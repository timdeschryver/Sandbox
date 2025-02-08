using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var reverseProxyBuilder = builder.Services
    .AddReverseProxy()
    .LoadFromMemory(
        [
            new RouteConfig {
                RouteId = "apiservice",
                ClusterId = "apiservice",
                Match = new RouteMatch { Path = "/api/weatherforecast/{**catch-all}" },
            }.WithTransformPathRemovePrefix(prefix: "/api"),
            new RouteConfig {
                RouteId = "otelcollector",
                ClusterId = "otelcollector",
                Match = new RouteMatch { Path = "/v1/traces" },
            },
            new RouteConfig {
                RouteId = "angularfrontend",
                ClusterId = "angularfrontend",
                Match = new RouteMatch { Path = "/{**catch-all}" },
            },
        ],
        [
            new ClusterConfig {
                ClusterId = "apiservice",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["apiservice"] =  new DestinationConfig {
                        Address = "http://apiservice"
                    }
                }
            },
            new ClusterConfig {
                ClusterId = "otelcollector",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["otelcollector"] =  new DestinationConfig {
                        Address = "http://otelcollector"
                    }
                }
            },
            new ClusterConfig {
                ClusterId = "angularfrontend",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["angularfrontend"] =  new DestinationConfig {
                        Address = "http://angularfrontend"
                    }
                }
            }
        ]
    );
    // .AddServiceDiscoveryDestinationResolver();

// Temp fix: https://github.com/dotnet/aspire/issues/4605
if (!builder.Environment.IsProduction())
{
    reverseProxyBuilder.AddServiceDiscoveryDestinationResolver();
}

var app = builder.Build();

app.MapReverseProxy();

app.Run();
