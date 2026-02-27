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

Use OpenFeature as the vendor-neutral abstraction layer for feature flag evaluation across the entire stack. Phase 1 implements global environment-level toggles backed by a configuration provider (appsettings.json), with the abstraction designed to support provider swaps (Redis-backed, managed services) in later phases without changing call sites.

Design principles for this decision:

- **PRN-001**: Flag evaluation uses OpenFeature directly via `IFeatureClient` at call sites that need runtime checks, with shared flag configuration contracts in SharedKernel.
- **PRN-002**: Backend is the source of truth for business/security enforcement; frontend flags are informational and control UX presentation only.
- **PRN-003**: If the flag provider is unavailable, evaluation returns configured defaults and emits diagnostics — no hard failures.
- **PRN-004**: Only flags explicitly marked as `FrontendVisible` are exposed via the BFF endpoint; operational/internal flags are never leaked.
- **PRN-005**: Flag evaluation outcomes are observable via OpenTelemetry tracing and metrics hooks.

## Consequences

### Positive

- **POS-001**: OpenFeature prevents vendor lock-in; providers can be swapped without changing application code.
- **POS-002**: Consistent flag evaluation semantics across API, Gateway, and frontend reduces drift and bugs.
- **POS-003**: Fail-safe defaults ensure flag provider outages do not cascade into application failures.
- **POS-004**: Separation of frontend-visible vs internal flags prevents accidental exposure of operational controls.

### Negative

- **NEG-001**: Introduces a new abstraction layer and dependency (OpenFeature SDK) that the team must understand.
- **NEG-002**: The `InMemoryProvider` is populated once at startup from appsettings; flag changes require a process restart (no live reload).
- **NEG-003**: No per-user or percentage-based targeting in phase 1; these require a richer provider.

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

- **IMP-001**: Shared contract (`FeatureFlag`, `FeatureFlagDefinition`) lives in `Sandbox.SharedKernel.FeatureFlags`.
- **IMP-002**: `FeatureFlagExtensions.AddFeatureFlags()` reads the `FeatureFlags` array from appsettings at startup and feeds it into OpenFeature's built-in `InMemoryProvider`.
- **IMP-003**: `FeatureFlagExtensions.AddFeatureFlags()` registers OpenFeature with `TracingHook` + `MetricsHook` (OTel), the `InMemoryProvider` populated from config, and exposes `IReadOnlyList<FeatureFlagDefinition>` as a singleton for BFF use.
- **IMP-004**: Gateway exposes `GET /bff/feature-flags` returning only `FrontendVisible` flags with typed response.
- **IMP-005**: Angular `FeatureFlags` service uses `httpResource()` with Zod schema validation for type-safe flag consumption.
- **IMP-006**: Phase 2 evolution path: swap `InMemoryProvider` for a Redis-backed or managed provider without changing module call sites.

## References

- **REF-001**: Related ADRs: ADR-0001 (Caching Strategy).
- **REF-002**: External documentation: [OpenFeature specification](https://openfeature.dev/).
- **REF-003**: External documentation: [OpenFeature .NET SDK](https://github.com/open-feature/dotnet-sdk).
- **REF-004**: Standards or frameworks referenced: [CNCF OpenFeature](https://www.cncf.io/projects/openfeature/).
