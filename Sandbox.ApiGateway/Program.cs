using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services
    .AddReverseProxy()
    .LoadFromMemory(
        [
            new RouteConfig {
                RouteId = "apiservice",
                ClusterId = "apiservice",
                Match = new RouteMatch { Path = "/api/weatherforecast/{**catch-all}" },
            }.WithTransformPathRemovePrefix(prefix: "/api"),
            new RouteConfig {
                RouteId = "angularfrontend",
                ClusterId = "angularfrontend",
                Match = new RouteMatch { Path = "/{**catch-all}" },
            }
        ],
        [
            new ClusterConfig {
                ClusterId = "apiservice",
                Destinations = new Dictionary<string, DestinationConfig>
                {
                    ["apiservice"] =  new DestinationConfig {
                        Address = "http://apiservice",
                        Health = "http://apiservice/readiness"
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
    )
    .AddServiceDiscoveryDestinationResolver();

var app = builder.Build();

app.MapReverseProxy();

app.Run();
