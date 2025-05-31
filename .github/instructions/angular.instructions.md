---
applyTo: '**/*.ts'
---

# Angular Instructions

Follow the conventions and guidelines at https://angular.dev/llms.txt

## General Principles

- Make use of signals where possible for reactive state management
- Prefer template-driven forms over reactive forms for simpler use cases
- Use standalone components by default - don't add standalone properties to decorators as it's implicit
- Prefer flat folder structure - keep components close to where they're used

## Modern Angular Patterns

- Use the inject method instead of a constructor for dependency injection

### Signals and State Management

- Use signals for component state that needs reactivity
- Use computed() for derived state
- Use signal() for mutable state
- Mark exposed signals as readonly when they shouldn't be mutated externally
- Use httpResource for HTTP-based data fetching with built-in caching

### Component Architecture

- Use output() for component events instead of @Output()
- Use input() for component inputs when you need signal-based reactivity
- Organize components by feature modules (customer-management/, authentication/, etc.)
- Keep shared utilities in the shared/ folder organized by type (functions/, operators/, components/)

### HTTP and Data Management

- Use httpResource for data fetching with automatic caching and error handling
- Implement proper parsing with custom parse functions (using Zod) for type safety

## Testing

- Use Vitest as the testing framework for better performance and modern features
- Use Angular Testing Library for component testing
- Follow the test SIFER principle (no beforeEach, afterEach, beforeAll, afterAll)
- Don't nest tests with describe blocks - keep them flat

## Accessibility

- Think about accessibility in all components from the start
- Use semantic HTML elements appropriately
- Always add explicit type attributes to buttons
- Provide proper ARIA labels and descriptions
- Ensure keyboard navigation works correctly
- Test with screen readers during development

## Performance

- Use ChangeDetectionStrategy.OnPush change detection strategy by default
- Leverage Angular's built-in optimization features (event coalescing, etc.)
- Implement proper lazy loading for feature modules
- Use Angular's httpResource for data fetching with automatic caching and error handling

## Code Organization

- Use TypeScript path mapping for clean, relative-path-free imports

## Error Handling

- Implement consistent error handling patterns
- Use signal-based error states for UI feedback
- Provide meaningful error messages to users
- Handle HTTP errors gracefully with proper fallbacks
