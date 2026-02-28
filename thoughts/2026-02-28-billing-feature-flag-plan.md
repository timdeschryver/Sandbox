## Plan: Billing Feature Flag - Route, Menu & Endpoint

Wire up the existing `billing-enabled` feature flag end-to-end: add a billing REST endpoint in `BillingModule.cs` guarded by the flag, add a `/billing` Angular route protected by a new functional guard, and add a conditional Billing nav item in the header using the existing `FeatureFlags` service.

**Steps**

1. Phase 1 — Backend: Billing Endpoint
    - Create `Sandbox.Modules.Billing/Application/GetBillingOverview.cs` — static class with a `Query` method, same pattern as `GetCustomers.Query`. Return a simple stub response — billing domain data TBD.
    - Inject `IFeatureClient` (OpenFeature) as a parameter; if `await featureClient.GetBooleanValueAsync("billing-enabled", false)` is false, return `TypedResults.NotFound()`.
    - In `Sandbox.Modules.Billing/BillingModule.cs`, `UseModule` method: add `app.MapGroup("billing").RequireAuthorization().WithTags("Billing")` and map `MapGet("", GetBillingOverview.Query).WithName("GetBillingOverview").WithDescription("Get billing overview")`.

2. Phase 2 — Angular: Feature Flag Route Guard
    - Create `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/feature-flags/feature-flag-guard.ts` — functional guard (same shape as `authenticatedGuard`), closure-based: `() => featureFlagGuard('billing-enabled')`.
    - Inject `FeatureFlags` service; call `featureFlags.isEnabled(flagKey)`. Return `true` if enabled; return `false` if disabled (route is excluded from matching, causing the router to fall through to the next matching route or yield a 404).
    - Because `FeatureFlags.flags` is a `computed()` signal backed by `httpResource`, it may be idle on first eval — use `toObservable` + `filter` to wait for the resource to finish loading before resolving the guard.
    - Add a `billing` child route under the authenticated parent group in `app.routes.ts` with `canMatch: [() => featureFlagGuard('billing-enabled')]`, lazy-loading `billing.routes.ts`.
    - Create `billing/billing-overview/billing-overview.ts` — minimal standalone `OnPush` component.
    - Create `billing/billing.routes.ts` — default route pointing to `billing-overview`.

3. Phase 3 — Angular: Header Nav Item
    - In `header.ts`, inject `FeatureFlags`: `protected readonly featureFlags = inject(FeatureFlags)`.
    - In `header.html`, inside the authenticated `<header>` nav, add a Billing link wrapped in `@if(featureFlags.isEnabled('billing-enabled'))`. Match existing anchor styling (routerLink, routerLinkActive classes). Place between Customers and Profile links.

4. Phase 4 — Verification
    - Run `dotnet build` — no compile errors in Billing module.
    - Test the endpoint: GET `/billing` returns 404 when flag is `Enabled: false` in appsettings, 200 when `Enabled: true`.
    - Run `pnpm --filter="sandbox.angular-workspace" build` — no type errors.
    - Run `pnpm --filter="sandbox.angular-workspace" test --watch=false --reporters=dot`.
    - Manually verify in browser: Billing link absent when flag disabled, present and navigable when enabled; direct navigation to `/billing` while disabled redirects to `/`.

**Decisions**

- **Endpoint gate approach**: Check the flag inline in the handler via `IFeatureClient.GetBooleanValueAsync` returning `NotFound()` — no existing endpoint-filter precedent in the codebase.
- **Guard pattern**: Closure-based functional guard using `canMatch`: `() => featureFlagGuard('billing-enabled')` — consistent with the functional `authenticatedGuard`.
- **Route behavior when disabled**: `canMatch` returning `false` removes the route from consideration entirely, so direct navigation to `/billing` yields a 404 (no redirect needed). The nav item being hidden means the user won't reach it through the UI.
- **Stub endpoint**: The endpoint returns a placeholder response; full billing domain implementation is out of scope.

**Relevant files**

- `Sandbox.Modules.Billing/BillingModule.cs` — add `MapGroup` and `MapGet` in `UseModule`.
- `Sandbox.Modules.Billing/Application/GetBillingOverview.cs` — new handler (create).
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/feature-flags/feature-flag-guard.ts` — new functional guard (create).
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/app.routes.ts` — add `/billing` child route.
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/billing/billing-overview/billing-overview.ts` — new stub component (create).
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/billing/billing.routes.ts` — new route config (create).
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/core/header/header.ts` — inject `FeatureFlags`.
- `Sandbox.AngularWorkspace/projects/sandbox-app/src/app/core/header/header.html` — conditional Billing nav link in authenticated header.
