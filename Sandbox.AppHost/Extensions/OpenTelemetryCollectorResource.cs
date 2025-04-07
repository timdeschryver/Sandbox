﻿namespace Sandbox.AppHost.Extensions;

internal sealed class OpenTelemetryCollectorResource(string name) : ContainerResource(name)
{
    internal const string GRPCEndpointName = "grpc";
    internal const string HTTPEndpointName = "http";

    public EndpointReference GRPCEndpoint => this.GetEndpoint(GRPCEndpointName);
    public EndpointReference HTTPEndpoint => this.GetEndpoint(HTTPEndpointName);
}
