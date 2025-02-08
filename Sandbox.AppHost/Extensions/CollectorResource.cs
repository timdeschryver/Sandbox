namespace Sandbox.AppHost.Extensions;

public class CollectorResource(string name) : ContainerResource(name)
{
    internal static string GRPCEndpointName = "grpc";
    internal static string HTTPEndpointName = "http";

    public EndpointReference GRPCEndpoint => this.GetEndpoint(GRPCEndpointName);
    public EndpointReference HTTPEndpoint => this.GetEndpoint(HTTPEndpointName);
}
