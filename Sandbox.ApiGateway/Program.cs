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
                Match = new RouteMatch
                {
                    Path = "/api/weatherforecast",
                },
            }.WithTransformPathRemovePrefix(prefix: "/api")
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
            }
        ]
    )
    .AddServiceDiscoveryDestinationResolver();

var app = builder.Build();

app.MapReverseProxy();

app.Run();
