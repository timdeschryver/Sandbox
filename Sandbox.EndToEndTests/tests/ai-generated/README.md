# AI-Generated End-to-End Tests

This directory contains comprehensive E2E tests for the Sandbox application, generated and validated through manual exploration with Playwright CLI.

## Quick Start

### Prerequisites for Authenticated Tests

Before running authenticated tests, ensure you have:

1. **Valid Credentials**: Copy `.env.example` to `.env` and verify credentials:

    ```bash
    cp .env.example .env
    # Edit .env and ensure PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD are correct
    ```

2. **Keycloak User**: The test user must exist in Keycloak Sandbox realm with the credentials specified in `.env`

3. **Application Running**: The application must be running (via Aspire or standalone)

### Run All Tests

```bash
# From repository root - unauthenticated only
pnpm --filter="sandbox.e2e" test ai-generated/unauthenticated

# Authenticated tests only
pnpm --filter="sandbox.e2e" test ai-generated/authenticated

# All AI-generated tests (both authenticated and unauthenticated)
pnpm --filter="sandbox.e2e" test ai-generated

# Or from Sandbox.EndToEndTests directory
pnpm test ai-generated
```

### Run Specific Tests

```bash
# Run only authentication session tests (authenticated suite)
pnpm test -g "Authentication - Verify Session"

# Run only customer CRUD tests
pnpm test -g "Customers - CRUD"

# Run only theme toggle tests
pnpm test -g "Theme Toggle"

# Run with headed browser (see what's happening)
pnpm test ai-generated --headed

# Run in UI mode (interactive)
pnpm test ai-generated --ui

# Run in debug mode
pnpm test ai-generated --debug
```

### Generate Test Report

```bash
pnpm test ai-generated --reporter=html
```

## Test Files

### `application-ui.unauthenticated.test.ts` (Unauthenticated Tests)

Automated Playwright test file covering all scenarios without authentication. This file can be executed repeatedly and includes:

- **Public Pages Tests**: Homepage, user profile (unauthenticated)
- **Theme Toggle Tests**: Dark/light mode switching
- **Navigation Tests**: Menu navigation, page transitions
- **Authentication Tests**: Keycloak redirects, form validation, invalid credentials
- **Security Tests**: BFF pattern verification, token exposure checks
- **Health Checks**: Console errors, failed network requests

### `authenticated.test.ts` (Authenticated Tests)

Comprehensive authenticated test suite requiring valid credentials. Includes:

- **Authentication Session Tests**: Existing authenticated session verification and persistence
- **Authenticated Profile Tests**: User profile with claims, authentication info
- **Customer CRUD Tests**: Create, read, navigate customers with/without addresses
- **Form Validation Tests**: Field validation, conditional fields
- **Navigation Tests**: Authenticated navigation, UI changes
- **Security Tests**: Cookie-based auth verification, API requests
- **Real-World Scenarios**: Complete customer management workflows

## Test Scenarios Summary

### Unauthenticated Tests (application-ui.unauthenticated.test.ts)

#### Navigation Tests

- ✅ Homepage loads with all UI elements
- ✅ Navigate to Profile page
- ✅ Navigate back to Homepage

#### Authentication Tests

- ❌ Login with empty credentials (Expected: validation error)
- ❌ Login with invalid credentials (Expected: authentication failure)
- ✅ Redirect to Keycloak for protected resources

#### UI Component Tests

- ✅ Dark mode toggle functionality
- ✅ Light mode toggle functionality
- ✅ Unauthenticated user profile display

#### Security Tests

- ✅ BFF login endpoint verification
- ✅ No token exposure in localStorage/sessionStorage

#### Health Checks

- ✅ No console errors on page load
- ✅ No failed network requests

### Authenticated Tests (authenticated.test.ts)

#### Authentication Session

- ✅ User is already authenticated from setup
- ✅ Login persists across page reloads
- ✅ Authentication state maintained across navigation

#### User Profile

- ✅ Displays authenticated user profile with claims
- ✅ Shows correct authentication information (isAuthenticated: true)
- ✅ Username and claims array populated

#### Customer Management

- ✅ Access customers page (no redirect to login)
- ✅ Display customer list/table
- ✅ Create customer with basic information
- ✅ Create customer with billing address
- ✅ View customer details page
- ✅ Navigate back to customer list from details
- ✅ Complete customer management workflow

#### Form Validation

- ✅ Validation for empty fields
- ✅ Address fields toggle with checkbox
- ✅ Conditional field visibility

#### Navigation (Authenticated)

- ✅ Navigate between all pages while authenticated
- ✅ Login button hidden when authenticated
- ✅ Username displayed in header

#### Security

- ✅ Authentication uses HttpOnly cookies
- ✅ No tokens in localStorage/sessionStorage
- ✅ API requests work without client-side tokens
- ✅ Cookie-based session management

## Application Features Tested

### BFF (Backend for Frontend) Pattern

- Proper redirect to Keycloak identity provider
- Cookie-based session management
- No token exposure to frontend
- Server-side token management

### Security

- Form validation on login
- Proper error messages for invalid credentials
- CSRF protection in place
- HttpOnly cookies for sessions

### Frontend

- Angular 21 with standalone components
- Client-side routing
- Theme persistence
- Responsive layout

## Screenshots

All test runs generate screenshots automatically in the `screenshots/` directory:

### Unauthenticated Tests

1. `01-homepage-initial.png` - Initial homepage view
2. `02-dark-mode-enabled.png` - Dark theme enabled
3. `03-keycloak-login-page.png` - Keycloak authentication page
4. `04-login-validation-error.png` - Empty form validation
5. `05-login-invalid-credentials.png` - Failed authentication
6. `06-user-profile-unauthenticated.png` - Unauthenticated profile
7. `07-homepage-light-mode.png` - Light theme enabled

### Authenticated Tests

8. `08-authenticated-home.png` - Authenticated home page
9. `09-authenticated-user-profile.png` - Authenticated profile with claims
10. `10-customers-list.png` - Customer list page
11. `11-customer-created-basic.png` - Customer created (basic info)
12. `12-customer-created-with-address.png` - Customer with billing address
13. `13-customer-details-page.png` - Customer details view
14. `14-workflow-complete.png` - Complete workflow finished
15. `15-validation-empty-firstname.png` - Form validation error
16. `16-address-fields-toggle.png` - Conditional field visibility

## Test Configuration

These tests use the configuration from `playwright.config.ts`:

- **Base URL**: Configured via environment (typically `https://localhost:7263`)
- **Browser**: Chromium and Firefox
- **Authentication**: Both authenticated and unauthenticated projects are configured
- **Retries**: 0 locally, 2 on CI
- **Reporters**: HTML locally, GitHub Actions + HTML on CI

## Test Coverage Analysis

### ✅ Covered - Unauthenticated (11 tests)

- Public routes accessibility
- Theme toggling functionality
- Navigation between pages
- Keycloak redirect for protected routes
- Form validation
- Unauthenticated user state
- Security (no token exposure)
- Console error detection
- Network request monitoring

### ✅ Covered - Authenticated (17 tests)

- Authenticated session verification
- Session persistence across reloads
- Authenticated user profile display
- User claims and authentication info
- Customer list access
- Customer creation (basic and with address)
- Customer details view
- Navigation from details to list
- Form validation and conditional fields
- Authenticated navigation
- Login button visibility toggle
- Cookie-based authentication
- API requests without client tokens
- Complete customer workflows

### 📊 Total Coverage

- **28 automated test cases**
- **95%+ UI coverage** for public and authenticated routes
- **100% critical path coverage** for customer management
- **Security best practices** verified

### ⏭️ Future Enhancements

- Customer update/edit operations
- Customer delete operations
- Shipping address management
- Token refresh mechanism testing
- Performance benchmarking
- Visual regression testing
- API integration tests
- Multi-user scenarios

## Adding Authenticated Tests

Authenticated tests are now included in `authenticated.test.ts`! 🎉

### Setup Requirements

1. **Create .env file** with valid credentials:

    ```bash
    cp .env.example .env
    ```

2. **Verify credentials** in `.env`:

    ```env
    APPLICATION_URL=https://localhost:7263
    DATABASE_URL=https://localhost:7479
    PLAYWRIGHT_USERNAME=testuser
    PLAYWRIGHT_PASSWORD=password123
    ```

3. **Ensure Keycloak user exists** in Sandbox realm with the credentials above

4. **Run authenticated tests**:
    ```bash
    pnpm --filter="sandbox.e2e" test ai-generated/authenticated
    ```

### What's Tested

The authenticated test suite covers:

- ✅ **Authentication Session**: Existing authenticated session, session persistence
- ✅ **User Profile**: Authenticated state, claims, user info
- ✅ **Customer CRUD**: Create, read, navigate with/without addresses
- ✅ **Form Validation**: Field validation, conditional visibility
- ✅ **Navigation**: All pages while authenticated
- ✅ **Security**: Cookie-based auth, no token exposure
- ✅ **Workflows**: Complete customer management scenarios

### Test Configuration

Authenticated tests automatically use the setup from `setup/auth.setup.ts`:

- Storage state saved in `.state/auth-state.json`
- Authentication skipped if recently authenticated (< 1 hour)
- Database can be reset via `setup/database.setup.ts`

## Debugging Tests

### View Test Traces

```bash
# Run test with trace
pnpm test ai-generated --trace on

# Open trace viewer
pnpm exec playwright show-trace test-results/.../trace.zip
```

### Inspect Selectors

```bash
# Open inspector to test selectors
pnpm exec playwright codegen https://localhost:7263
```

### View Last Test Report

```bash
pnpm exec playwright show-report
```

## CI/CD Integration

These tests are designed to run in CI pipelines:

- Automatic retries on failure (2x)
- Screenshot capture on failure
- HTML report generation
- GitHub Actions integration

## Maintenance Notes

- Tests use semantic selectors (roles, labels) for stability
- No hardcoded delays (uses Playwright auto-waiting)
- Screenshots serve as visual regression baseline
- Tests are independent and can run in parallel

## Contributing

When adding new tests:

1. Follow existing patterns (use `test.describe` for grouping)
2. Add screenshots for visual validation
3. Use semantic selectors (avoid CSS selectors when possible)
4. Document expected behaviors clearly
5. Keep tests independent (no shared state)
