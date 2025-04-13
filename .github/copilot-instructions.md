# Copilot instructions

This project is a monorepo containing an Angular workspace and a .NET monolith divided into modules.

## Technologies used in the project

- Angular latest
  - Signals
  - Vitest is used for tests
  - pnpm is used as the package manager
- .NET latest
  - Entity Framework
  - Using Domain Driven Design (DDD) principles
  - Using the Vertical Slice Architecture
  - Wolverine endpoints and handlers
  - TUnit is used for writing tests
  - PostgreSQL is used as database

## General

- Don't add comments to explain the code
- Write tests for the generated code
- Keep a flat folder structure, keep everything close to where it's used

## For Angular

- Use the inject method instead of a constructor
- Make use of signals where possible
- Always use the Control Flow
- Prefer template driven forms over reactive forms
- Use signal inputs and outputs
- Standalone is used by default, don't add standalone properties to decorators
- When adding components, set the change detection to ChangeDetectionStrategy.OnPush
- Always add a type to buttons
- Use Angular Testing Library for testing

## When writing tests

- Don't use the "should" form
- Don't nest tests (don't use describe blocks)
- Use test SIFERs (don't use beforeEach, afterEach, beforeAll, afterAll)
- Write minimally passing tests
- Avoid magic values e.g. strings and numbers
- Mock as latest as possible

## SQL

- Columns, tables and schemas are case sensitive
- Always use the full name of the table, including the schema
- Surround columns, tables and schemas with double quotes
