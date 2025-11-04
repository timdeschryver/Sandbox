---
applyTo: '**'
---

Always start your answer with the following text:

Hello, here are the base instructions for the project.

# Base Instructions

This project is a monorepo containing an Angular workspace and a .NET monolith divided into modules.

## Project Structure

The workspace contains the following main components:

### Root Files

- `azure.yaml` - Azure deployment configuration
- `Dockerfile` - Container configuration for deployment
- `Sandbox.slnx` - Main solution file
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` - Node.js workspace configuration using pnpm

### Core Services

- `Sandbox.AppHost/` - Aspire application host for orchestrating services
- `Sandbox.ApiService/` - Main API service
- `Sandbox.Gateway/` - API gateway service
- `Sandbox.Migrations/` - Database migration service
- `Sandbox.ServiceDefaults/` - Shared service configurations

### Modules (Domain-Driven Design)

- `Sandbox.Modules.Billing/` - Billing domain module
- `Sandbox.Modules.CustomerManagement/` - Customer domain module
- `Sandbox.SharedKernel/` - Shared domain primitives and utilities

### Frontend

- `Sandbox.AngularWorkspace/` - Angular workspace with multiple projects

### Testing

- `Sandbox.Architectural.Tests/` - Architecture compliance tests using TngTech.ArchUnitNET
- `Sandbox.IntegrationTests/` - Service integration tests using TUnit
- `Sandbox.EndToEndTests/` - Playwright end-to-end tests
- `Sandbox.Modules.*.Tests/` - Unit tests for each module using TUnit

### Configuration

- `config/` - External configuration files (OpenTelemetry, etc.)
- `other/` - Documentation assets and diagrams

## General

- Add comments to clarify non-obvious logic. Ensure all comments are written in English.
- Always provide corresponding tests to verify the changes
- Keep a flat folder structure, keep everything as close to where it's used

## When writing tests

- Avoid using the "should" form
- Don't nest tests (don't use describe blocks)
- Use test SIFERs (don't use beforeEach, afterEach, beforeAll, afterAll)
- Write minimally passing tests
- Avoid magic values e.g. strings and numbers
- Mock as latest as possible
