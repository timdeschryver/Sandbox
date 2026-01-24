---
description: 'Angular project coding and best practices instructions'
applyTo: '**/*.ts,**/*.html'
---

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Use TypeScript path mapping for clean, relative-path-free imports

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
    - `NgOptimizedImage` does not work for inline base64 images.
- Prefer flat folder structure - keep files close to where they're used

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Forms

- Use Signal Forms

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

#### HTTP and Data Management

- Use `httpResource` for data fetching with automatic caching and error handling
- Implement proper parsing with custom parse functions (using Zod) for type safety

## Testing

- Use Vitest as the testing framework for better performance and modern features
- Use Angular Testing Library for component testing
- Follow the test SIFER principle (no beforeEach, afterEach, beforeAll, afterAll)
- Don't nest tests with describe blocks - keep them flat

## Accessibility

- Use semantic HTML elements appropriately
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
- Always add explicit type attributes to buttons
- Ensure keyboard navigation works correctly

## Error Handling

- Implement consistent error handling patterns
- Use signal-based error states for UI feedback
- Provide meaningful error messages to users
- Handle HTTP errors gracefully with proper fallbacks

## Styling

- Use CSS variables for theming and dynamic styles
- Prefer CSS for component styles, do not use scss or less
