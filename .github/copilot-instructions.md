# Copilot instructions

This project is a monorepo containing an Angular workspace and a .NET monolith divided into modules.

## Technologies used in the project

- Angular latest
  - Signals
  - Vitest is used for tests
  - pnpm is used as the package manager
- .NET latest
  - Entity Framework
  - TUnit is used for writing tests
  - PostregSQL is used as database

## General

- don't add comments to explain the code
- write tests for the generated code
- keep a flat folder structure, keep everything close to where it's used

## For Angular

- use the inject method instead of a constructor
- make use of signals where possible
- always use the Control Flow
- prefer template driven forms over reactive forms
- use signal inputs and outputs
- standalone is used by default, don't add standalone properties to decorators
- when adding components, set the change detection to ChangeDetectionStrategy.OnPush
- always add a type to buttons

## When writing tests

- don't use the "should" form
- don't nest tests
- use test SIFERs (don't use beforeEach, afterEach, beforeAll, afterAll)
- write minimally passing tests
- avoid magic values e.g. strings and numbers

## SQL

- columns, tables and schemas are case sensitive
- always use the full name of the table, including the schema
- surround columns, tables and schemas with double quotes
