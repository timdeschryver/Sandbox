using JasperFx.Resources;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
            builder.Services.AddAuthorization();
            return builder;
        }

        public WebApplicationBuilder AddOpenApi()
        {
            builder.Services.AddOpenApi(openApi =>
            {
                openApi.AddDocumentTransformer((document, _, _) =>
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
                openApi.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            return builder;
        }

        public WebApplicationBuilder AddErrorHandling()
        {
            builder.Services.AddExceptionHandler<ExceptionHandler>();
            builder.Services.AddProblemDetails(options =>
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
            builder.Services.AddFusionCache()
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

            builder.Services
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

            builder.Services.AddResourceSetupOnStartup();
            builder.Host.UseWolverine(opts =>
            {
                // Required to generate the OpenAPI document, otherwise this exception is thrown
                if (Environment.GetCommandLineArgs().Any(e => e.Contains("GetDocument.Insider", StringComparison.OrdinalIgnoreCase)))
                {
                    return;
                }
                var connectionString = builder.Configuration.GetConnectionString("sandbox-db") ?? throw new InvalidOperationException("Connection string 'sandbox-db' not found.");
                opts.PersistMessagesWithPostgresql(connectionString, "wolverine");
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
            builder.Services.AddSecurityHeaderPolicies()
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

        s_headerApiPolicy.AddContentSecurityPolicy(builder =>
        {
            builder.AddObjectSrc().None();
            builder.AddBlockAllMixedContent();
            builder.AddImgSrc().None();
            builder.AddFormAction().None();
            builder.AddFontSrc().None();
            builder.AddStyleSrc().None();
            builder.AddScriptSrc().None();
            builder.AddScriptSrcElem().None();
            builder.AddBaseUri().Self();
            builder.AddFrameAncestors().None();
            builder.AddCustomDirective("require-trusted-types-for", "'script'");
        });

        if (!isDev)
        {
            s_headerApiPolicy.AddStrictTransportSecurityMaxAgeIncludeSubDomainsAndPreload();
        }

        return s_headerApiPolicy;
    }
}
