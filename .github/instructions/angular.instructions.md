---
description: 'Angular project coding and best practices instructions'
applyTo: '**/*.ts'
---

# Angular Instructions

Follow the best practices at https://angular.dev/assets/context/best-practices.md.
For the correct syntax refer to https://angular.dev/context/llm-files/llms-full.txt.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## General Principles

- Make use of signals where possible for reactive state management
- Prefer Signal Forms
- Prefer flat folder structure - keep files close to where they're used

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

## Code Organization

- Use TypeScript path mapping for clean, relative-path-free imports

## Error Handling

- Implement consistent error handling patterns
- Use signal-based error states for UI feedback
- Provide meaningful error messages to users
- Handle HTTP errors gracefully with proper fallbacks
