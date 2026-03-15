using JasperFx.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;
using ZiggyCreatures.Caching.Fusion;

namespace Sandbox.ApiService;

internal static class Extensions
{
    private static HeaderPolicyCollection? s_headerApiPolicy;

    extension(WebApplicationBuilder builder)
    {
        public WebApplicationBuilder AddAuthentication()
        {
            _ = builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddKeycloakJwtBearer(
                    serviceName: "keycloak",
                    realm: "sandbox",
                    configureOptions: options =>
                    {
                        options.Audience = "sandbox.api";
                        if (builder.Environment.IsDevelopment())
                        {
                            options.RequireHttpsMetadata = false;
                        }
                    });
            _ = builder.Services.AddAuthorization();
            return builder;
        }

        public WebApplicationBuilder AddOpenApi()
        {
            _ = builder.Services.AddOpenApi(openApi =>
            {
                openApi.CreateSchemaReferenceId = (jsonTypeInfo) =>
                {
                    var schemaRefId = OpenApiOptions.CreateDefaultSchemaReferenceId(jsonTypeInfo);
                    if (schemaRefId is null || jsonTypeInfo?.Type?.FullName is null)
                    {
                        return null;
                    }

                    return jsonTypeInfo.Type.FullName.Replace("+", ".", StringComparison.Ordinal);
                };

                _ = openApi.AddDocumentTransformer((document, _, _) =>
                {
                    document.Servers = [new OpenApiServer { Url = "https://localhost:7333" }];
                    document.Info = new OpenApiInfo
                    {
                        Title = "Sandbox API Reference",
                        Version = "v1",
                        Description = "This is a sample API for the Sandbox project.",
                        Contact = new OpenApiContact
                        {
                            Name = "Support",
                            Email = "contact@timdeschryver.dev",
                            Url = new Uri("https://github.com/timdeschryver/sandbox")
                        },
                    };
                    return Task.CompletedTask;
                });
                _ = openApi.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            return builder;
        }

        public WebApplicationBuilder AddErrorHandling()
        {
            _ = builder.Services.AddExceptionHandler<ExceptionHandler>();
            _ = builder.Services.AddProblemDetails(options =>
            {
                options.CustomizeProblemDetails = context =>
                {
                    context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
                };
            });
            return builder;
        }

        public WebApplicationBuilder AddCaching()
        {
            builder.AddRedisDistributedCache(connectionName: "cache");
            _ = builder.Services.AddFusionCache()
                .WithOptions(options =>
                {
                    options.DistributedCacheCircuitBreakerDuration = TimeSpan.FromSeconds(2);
                })
                .WithDefaultEntryOptions(new FusionCacheEntryOptions
                {
                    Duration = TimeSpan.FromMinutes(1),

                    IsFailSafeEnabled = true,
                    FailSafeMaxDuration = TimeSpan.FromHours(2),
                    FailSafeThrottleDuration = TimeSpan.FromSeconds(30),

                    EagerRefreshThreshold = 0.9f,

                    FactorySoftTimeout = TimeSpan.FromMilliseconds(100),
                    FactoryHardTimeout = TimeSpan.FromMilliseconds(1500),

                    DistributedCacheSoftTimeout = TimeSpan.FromSeconds(1),
                    DistributedCacheHardTimeout = TimeSpan.FromSeconds(2),
                    AllowBackgroundDistributedCacheOperations = true,

                    JitterMaxDuration = TimeSpan.FromSeconds(2)
                });

            _ = builder.Services
                .AddFusionCacheSystemTextJsonSerializer()
                .AddFusionCacheStackExchangeRedisBackplane(options =>
                {
                    options.Configuration = builder.Configuration.GetConnectionString("cache");
                })
                .AddOpenTelemetry()
                    .WithTracing(tracing => tracing.AddFusionCacheInstrumentation())
                    .WithMetrics(metrics => metrics.AddFusionCacheInstrumentation());

            return builder;
        }

        public WebApplicationBuilder AddWolverine()
        {

            _ = builder.Services.AddResourceSetupOnStartup();
            _ = builder.Host.UseWolverine(opts =>
            {
                // Required to generate the OpenAPI document, otherwise this exception is thrown
                if (Environment.GetCommandLineArgs().Any(e => e.Contains("GetDocument.Insider", StringComparison.OrdinalIgnoreCase)))
                {
                    return;
                }
                var connectionString = builder.Configuration.GetConnectionString("sandbox-db") ?? throw new InvalidOperationException("Connection string 'sandbox-db' not found.");
                _ = opts.PersistMessagesWithPostgresql(connectionString, "wolverine");
                opts.UseEntityFrameworkCoreTransactions();
                opts.MultipleHandlerBehavior = MultipleHandlerBehavior.Separated;
                opts.Durability.MessageIdentity = MessageIdentity.IdAndDestination;
                opts.Policies.UseDurableLocalQueues();
                opts.Policies.AutoApplyTransactions();
            });
            return builder;
        }

        public WebApplicationBuilder AddSecurity()
        {
            _ = builder.Services.AddSecurityHeaderPolicies()
                .SetPolicySelector(ctx => GetApiHeaderPolicyCollection(builder.Environment.IsDevelopment()));
            return builder;
        }
    }

    internal static HeaderPolicyCollection GetApiHeaderPolicyCollection(bool isDev)
    {
        if (s_headerApiPolicy is not null)
        {
            return s_headerApiPolicy;
        }

        s_headerApiPolicy = new HeaderPolicyCollection()
            .AddFrameOptionsDeny()
            .AddContentTypeOptionsNoSniff()
            .AddReferrerPolicyStrictOriginWhenCrossOrigin()
            .AddCrossOriginOpenerPolicy(builder => builder.SameOrigin())
            .AddCrossOriginEmbedderPolicy(builder => builder.RequireCorp())
            .AddCrossOriginResourcePolicy(builder => builder.SameOrigin())
            .RemoveServerHeader()
            .AddPermissionsPolicyWithDefaultSecureDirectives();

        _ = s_headerApiPolicy.AddContentSecurityPolicy(builder =>
        {
            _ = builder.AddObjectSrc().None();
            _ = builder.AddBlockAllMixedContent();
            _ = builder.AddImgSrc().None();
            _ = builder.AddFormAction().None();
            _ = builder.AddFontSrc().None();
            _ = builder.AddStyleSrc().None();
            _ = builder.AddScriptSrc().None();
            _ = builder.AddScriptSrcElem().None();
            _ = builder.AddBaseUri().Self();
            _ = builder.AddFrameAncestors().None();
            _ = builder.AddCustomDirective("require-trusted-types-for", "'script'");
        });

        if (!isDev)
        {
            _ = s_headerApiPolicy.AddStrictTransportSecurityMaxAgeIncludeSubDomainsAndPreload();
        }

        return s_headerApiPolicy;
    }

    public static OpenApiOptions CustomSchemaIds(this OpenApiOptions config,
       Func<Type, string?> typeSchemaTransformer,
       bool includeValueTypes = false)
    {
        return config.AddSchemaTransformer((schema, context, _) =>
        {
            // Skip value types and strings
            if (!includeValueTypes &&
                (context.JsonTypeInfo.Type.IsValueType ||
                 context.JsonTypeInfo.Type == typeof(string)))
            {
                return Task.CompletedTask;
            }

            // Skip if the schema ID is not already set because we don't want to decorate the schema multiple times
            // if (schema.Annotations == null || !schema.Annotations.TryGetValue("x-schema-id", out object? _))
            // {
            //     return Task.CompletedTask;
            // }

            // transform the typename based on the provided delegate
            var transformedTypeName = typeSchemaTransformer(context.JsonTypeInfo.Type);

            // Scalar - decorate the models section
            // schema.Annotations["x-schema-id"] = transformedTypeName;

            // Swagger and Scalar specific:
            // for Scalar - decorate the endpoint section
            // for Swagger - decorate the endpoint and model sections
            schema.Title = transformedTypeName;

            return Task.CompletedTask;
        });
    }
}
