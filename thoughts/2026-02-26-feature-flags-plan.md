## Plan: Full-Stack Feature Flags with OpenFeature

Implement a centralized runtime feature-flag system that works consistently across API modules, Gateway/BFF, and Angular UI, while starting with global environment-level flags. Use OpenFeature as the abstraction layer, backed first by a simple configuration provider for fast adoption; keep provider boundaries explicit so targeting (role/user/percentage) can be added later without rewriting call sites.

**Steps**

1. Phase 1 — Architecture and contracts
    - Define a shared flag contract in the backend (flag key naming, default behavior, fail-safe policy, and ownership metadata) in a SharedKernel-centric design so modules and gateway consume one consistent approach.
    - Decide evaluation semantics: if provider is unavailable, return configured defaults and emit diagnostics; no security-critical enforcement in frontend.
    - Document initial flag scope (global environment toggles only) and exclude per-user/percentage rollout for phase 1.

2. Phase 2 — Backend foundation (API + SharedKernel)
    - Add OpenFeature SDK wiring in API startup and use `IFeatureClient` where runtime flag checks are needed.
    - Implement a configuration-backed provider reading from `FeatureFlags` sections in appsettings (API and environment-specific overrides), with strong typing and startup validation.
    - Add cache-aware refresh behavior (lightweight TTL or provider poll) so flag changes can propagate without process restart when the backing store evolves.
    - Add observability hooks (logs + metrics + traces) for flag evaluation outcomes and provider failures.

3. Phase 3 — Gateway/BFF integration (_depends on 2_)
    - Register OpenFeature in Gateway and expose UI-safe flags from shared definitions.
    - Expose a dedicated `GET /bff/feature-flags` endpoint returning only frontend-allowed flags (do not leak operational/internal flags).
    - Keep endpoint response cache-friendly and include versioning/etag strategy for efficient frontend refresh.

4. Phase 4 — Angular integration (_depends on 3_)
    - Add a `FeatureFlags` service using existing `httpResource()` + Zod parsing patterns to load `/bff/feature-flags` and expose signal-based `isEnabled(flagKey)` reads.
    - Use feature checks only for presentation/UX branching in components and routes; backend remains source of truth for authorization/business enforcement.
    - Wire a minimal refresh trigger tied to auth-session lifecycle (initial load + explicit refresh after re-auth/session change).

5. Phase 5 — Progressive rollout and governance
    - Seed initial flags in appsettings for Development and production-safe defaults.
    - Add operational playbook: naming convention, owner, expiry/review date, and removal policy to prevent stale flags.
    - Add a small architecture note (ADR) capturing why OpenFeature is used and how to swap providers later.

6. Phase 6 — Verification
    - Backend tests: unit/integration tests validating API/Gateway flag endpoint behavior and runtime flag evaluation.
    - Frontend tests: Vitest tests for the flag service and one representative component branch using signals.
    - Manual verification: run full stack and toggle a Development flag to confirm API behavior and UI visibility update paths.

**Relevant files**

- `d:/Sandbox/main/Sandbox.ApiService/Program.cs` — wire OpenFeature feature flags into application startup.
- `d:/Sandbox/main/Sandbox.ApiService/Extensions.cs` — follow existing extension registration pattern for flag dependencies.
- `d:/Sandbox/main/Sandbox.ApiService/appsettings.json` — add root `FeatureFlags` configuration with safe defaults.
- `d:/Sandbox/main/Sandbox.Gateway/Program.cs` — register gateway-side feature flags and endpoint pipeline usage.
- `d:/Sandbox/main/Sandbox.Gateway/Extensions.cs` — align service registration with existing gateway extension style.
- `d:/Sandbox/main/Sandbox.Gateway/UserModule/UserModule.cs` — add or colocate BFF feature-flags endpoint module pattern.
- `d:/Sandbox/main/Sandbox.Gateway/appsettings.json` — gateway-visible frontend-safe flag configuration.
- `d:/Sandbox/main/Sandbox.SharedKernel/FeatureFlags/FeatureFlagExtensions.cs` — shared feature flag registration and definition mapping.
- `d:/Sandbox/main/Sandbox.AngularWorkspace/projects/sandbox-app/src/app/app.config.ts` — register feature-flags data provider/service.
- `d:/Sandbox/main/Sandbox.AngularWorkspace/projects/sandbox-app/src/app/authentication/authentication.ts` — integrate refresh/lifecycle touchpoint patterns.
- `d:/Sandbox/main/Sandbox.AngularWorkspace/projects/sandbox-app/src/app/authentication/user.ts` — mirror existing Zod schema conventions for contract validation.
- `d:/Sandbox/main/config/appsettings.encrypted.json` — update encrypted config if any secret-like flag-provider values are introduced.

**Verification**

1. Run backend tests for impacted projects: `dotnet test` (or narrowed project-level tests first, then full run).
2. Run frontend unit tests: `pnpm --filter="sandbox.angular-workspace" test --watch=false --reporters=dot`.
3. Start stack: `dotnet run --project ./Sandbox.AppHost`; validate `/bff/feature-flags` shape and one API-gated + one UI-gated behavior.
4. Confirm telemetry/logging emits feature-evaluation records without sensitive payload leakage.

**Decisions**

- OpenFeature is recommended as the long-term abstraction because it prevents vendor lock-in and keeps evaluation calls stable while providers evolve.
- For this project’s phase-1 scope (global environment flags), use OpenFeature with a simple configuration provider first; avoid introducing remote flag infrastructure immediately.
- Frontend flags are informational/UI-only; backend enforces real business/security decisions.
- Included: API + Gateway + Angular integration for global toggles. Excluded: per-user targeting, percentage rollout, experimentation analytics.

**Further Considerations**

1. Provider evolution path: Option A (keep config provider longer), Option B (add Redis-backed provider), Option C (adopt managed provider later) — recommendation: start with A, design interfaces for B/C.
2. Endpoint contract shape: flat map vs typed list with metadata — recommendation: start with typed list including `key`, `enabled` for forward compatibility.
3. Flag lifecycle governance strictness: lightweight docs vs ADR + CI linting for expired flags — recommendation: ADR now, CI policy later when flag count grows.
