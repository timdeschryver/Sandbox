---
title: 'ADR-0002: Feature Flag Strategy with OpenFeature'
status: 'Accepted'
date: '2026-02-26'
authors: 'Tim'
tags: ['architecture', 'decision', 'feature-flags', 'openfeature']
supersedes: ''
superseded_by: ''
---

<!-- markdownlint-disable-next-line MD025 -->

# ADR-0002: Feature Flag Strategy with OpenFeature

## Status

Proposed | **Accepted** | Rejected | Superseded | Deprecated

## Context

The application needs a runtime feature-flag system that works consistently across API modules, the Gateway/BFF layer, and the Angular frontend. Feature flags enable safer deployments, gradual rollouts, and operational kill-switches without code redeployment. The decision must balance simplicity of adoption against long-term flexibility to evolve providers (e.g., from config-based to remote flag services).

## Decision

Use OpenFeature as the vendor-neutral abstraction layer for feature flag evaluation across the entire stack. The current implementation uses flagd as the OpenFeature provider, with flag values synchronized from `config/flagd/flagd.json` by the Aspire AppHost.

Design principles for this decision:

- **PRN-001**: Flag evaluation uses OpenFeature directly via `IFeatureClient` at call sites that need runtime checks, with shared flag configuration contracts in SharedKernel.
- **PRN-002**: Backend is the source of truth for business/security enforcement; frontend flags are informational and control UX presentation only.
- **PRN-003**: If the flag provider is unavailable, evaluation returns configured defaults and emits diagnostics — no hard failures.
- **PRN-004**: The BFF endpoint exposes the known application flags listed in `FeatureFlagKeys`, with values resolved from flagd.
- **PRN-005**: Flag evaluation outcomes are observable via OpenTelemetry tracing and metrics hooks.

## Consequences

### Positive

- **POS-001**: OpenFeature prevents vendor lock-in; providers can be swapped without changing application code.
- **POS-002**: Consistent flag evaluation semantics across API, Gateway, and frontend reduces drift and bugs.
- **POS-003**: Fail-safe defaults ensure flag provider outages do not cascade into application failures.
- **POS-004**: Centralizing known keys in `FeatureFlagKeys` keeps API, Gateway, and frontend flag usage aligned with the flagd configuration.

### Negative

- **NEG-001**: Introduces a new abstraction layer and dependency (OpenFeature SDK) that the team must understand.
- **NEG-002**: Local development now depends on a flagd container when running the full Aspire app.
- **NEG-003**: Known application keys remain code-owned and must be kept in sync with `config/flagd/flagd.json`.

## Alternatives Considered

### Microsoft.FeatureManagement

- **ALT-001**: **Description**: Use Microsoft's built-in feature management library with IFeatureManager.
- **ALT-002**: **Rejection Reason**: Rejected because it couples the codebase to Microsoft's specific abstractions, making provider swaps more costly. OpenFeature provides a vendor-neutral standard with broader ecosystem support.

### Custom Feature Flag Implementation

- **ALT-003**: **Description**: Build a bespoke flag evaluation system without an abstraction layer.
- **ALT-004**: **Rejection Reason**: Rejected because it increases maintenance burden and lacks the standardized hooks, contexts, and provider interfaces that OpenFeature provides out of the box.

### No Feature Flags

- **ALT-005**: **Description**: Deploy features without flag controls.
- **ALT-006**: **Rejection Reason**: Rejected because it eliminates the ability to safely roll back features, perform dark launches, or gate incomplete functionality behind toggles.

## Implementation Notes

- **IMP-001**: Shared feature-flag contracts (`FeatureFlag`, `FeatureFlagKeys`) live in `Sandbox.SharedKernel.FeatureFlags`.
- **IMP-002**: `Sandbox.AppHost` starts a flagd resource with `config/flagd/flagd.json` synchronized by `WithBindFileSync()` and passes the `flagd` connection string to API and Gateway through Aspire resource references.
- **IMP-003**: `FeatureFlagExtensions.AddFeatureFlags()` registers OpenFeature with `TracingHook` + `MetricsHook` (OTel) and the flagd provider, using the Aspire `flagd` connection string when present.
- **IMP-004**: Gateway exposes `GET /bff/feature-flags` returning `FeatureFlagKeys.All` with typed response values evaluated from flagd.
- **IMP-005**: Angular `FeatureFlags` service uses `httpResource()` with Zod schema validation for type-safe flag consumption.
- **IMP-006**: Future evolution path: swap flagd for another OpenFeature provider without changing module call sites.

## References

- **REF-001**: Related ADRs: ADR-0001 (Caching Strategy).
- **REF-002**: External documentation: [OpenFeature specification](https://openfeature.dev/).
- **REF-003**: External documentation: [OpenFeature .NET SDK](https://github.com/open-feature/dotnet-sdk).
- **REF-004**: Standards or frameworks referenced: [CNCF OpenFeature](https://www.cncf.io/projects/openfeature/).
- **REF-005**: External documentation: [Aspire flagd integration](https://aspire.dev/integrations/devtools/flagd/flagd-get-started/).
