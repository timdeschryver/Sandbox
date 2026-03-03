---
name: create-adr
description: Create an Architectural Decision Record (ADR) document for AI-optimized decision documentation. Use when user asks to create, write, or document an architectural decision. Triggers on "create ADR", "document decision", "architectural decision record", or when a significant technical decision needs to be captured.
---

# Create Architectural Decision Record

## Overview

Create a structured ADR document optimized for both AI consumption and human readability. ADRs live in `/docs/adrs/` and use 4-digit sequential numbering (e.g., `adr-0003-title-slug.md`).

## Step 1: Gather Required Inputs

Before generating, collect the following from the user (or infer from conversation context):

| Input              | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| **Decision Title** | Short, descriptive name for the decision                              |
| **Context**        | Problem statement, constraints, and requirements driving the decision |
| **Decision**       | The chosen solution and rationale                                     |
| **Alternatives**   | Other options considered and why they were rejected                   |
| **Stakeholders**   | Authors, reviewers, or affected teams                                 |

If any required input is missing and cannot be inferred from conversation history, ask the user before proceeding.

## Step 2: Determine the Next ADR Number

Check the `/docs/adrs/` directory to find the highest existing ADR number, then increment by 1 for the new file. Use 4-digit zero-padded numbering (e.g., `0003`).

## Step 3: Generate the ADR

Save the file as `/docs/adrs/adr-NNNN-[title-slug].md` where the title slug is lowercase with hyphens.

### Document Template

```md
---
title: 'ADR-NNNN: [Decision Title]'
status: 'Proposed'
date: 'YYYY-MM-DD'
authors: '[Stakeholder Names/Roles]'
tags: ['architecture', 'decision']
supersedes: ''
superseded_by: ''
---

# ADR-NNNN: [Decision Title]

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## Context

[Problem statement, technical constraints, business requirements, and environmental factors requiring this decision.]

## Decision

[Chosen solution with clear rationale for selection.]

## Consequences

### Positive

- **POS-001**: [Beneficial outcomes and advantages]
- **POS-002**: [Performance, maintainability, scalability improvements]
- **POS-003**: [Alignment with architectural principles]

### Negative

- **NEG-001**: [Trade-offs, limitations, drawbacks]
- **NEG-002**: [Technical debt or complexity introduced]
- **NEG-003**: [Risks and future challenges]

## Alternatives Considered

### [Alternative 1 Name]

- **ALT-001**: **Description**: [Brief technical description]
- **ALT-002**: **Rejection Reason**: [Why this option was not selected]

### [Alternative 2 Name]

- **ALT-003**: **Description**: [Brief technical description]
- **ALT-004**: **Rejection Reason**: [Why this option was not selected]

## Implementation Notes

- **IMP-001**: [Key implementation considerations]
- **IMP-002**: [Migration or rollout strategy if applicable]
- **IMP-003**: [Monitoring and success criteria]

## References

- **REF-001**: [Related ADRs]
- **REF-002**: [External documentation]
- **REF-003**: [Standards or frameworks referenced]
```

## Writing Guidelines

- Use **precise, unambiguous language** throughout
- Use **coded bullet points** (3-4 letter codes + 3-digit numbers like `POS-001`, `NEG-002`) for all multi-item sections
- Document **both positive and negative** consequences honestly
- For each alternative, always include both a description and a rejection reason
- Set `status` to `Proposed` unless the user specifies otherwise
- Leave `supersedes` and `superseded_by` empty unless relevant
- Use today's date in `YYYY-MM-DD` format
