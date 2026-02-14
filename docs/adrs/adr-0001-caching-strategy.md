---
title: 'ADR-0001: Caching Strategy'
status: 'Accepted'
date: '2026-02-14'
authors: 'Tim'
tags: ['architecture', 'decision', 'caching', 'redis']
supersedes: ''
superseded_by: ''
---

<!-- markdownlint-disable-next-line MD025 -->

# ADR-0001: Caching Strategy

## Status

Proposed | **Accepted** | Rejected | Superseded | Deprecated

## Context

The application requires a caching strategy to reduce repeated database reads, improve response latency for frequently requested data, and maintain predictable performance as traffic increases. The decision must balance performance, operational complexity, consistency behavior, and future scalability. Candidate approaches are a distributed Redis cache, local in-memory caching, or no cache with all reads served directly from the database.

## Decision

Use a hybrid caching strategy with FusionCache, combining L1 in-memory cache and L2 Redis distributed cache, for read-heavy and frequently reused data. Redis is selected as L2 because it provides low-latency shared access across instances and supports explicit expiration and invalidation policies at scale.

Caching principles for this decision:

- **PRN-001**: L1 (in-memory) cache is the first lookup to minimize latency within a single process.
- **PRN-002**: L2 (Redis) cache is the second lookup to share cached state across all application instances.
- **PRN-003**: On L1 miss and L2 hit, repopulate L1 to restore hot-path performance.
- **PRN-004**: On L1 and L2 miss, load from database, then write-through to both cache layers with a defined TTL.
- **PRN-005**: Use consistent key strategy and invalidation rules so L1 and L2 remain coherent.

## Consequences

### Positive

- **POS-001**: Read latency is reduced for cacheable data, improving end-user response times.
- **POS-002**: A shared distributed cache prevents per-instance cache divergence and improves horizontal scaling behavior.
- **POS-003**: Database load is reduced for repeated reads, increasing headroom for growth.

### Negative

- **NEG-001**: Introduces an additional infrastructure dependency that must be provisioned, monitored, and secured.
- **NEG-002**: Adds cache invalidation and expiration complexity that must be implemented carefully to avoid stale data.
- **NEG-003**: Creates a failure mode where cache outages can affect latency and increase sudden load on the database.

## Alternatives Considered

### In-Memory Cache

- **ALT-001**: **Description**: Use process-local memory caching per application instance.
- **ALT-002**: **Rejection Reason**: Rejected because cache entries are not shared across instances, causing inconsistent hit rates, duplicated warm-up costs, and lower effectiveness under horizontal scale.

### No Cache (Database Only)

- **ALT-003**: **Description**: Skip caching and serve all reads directly from the primary database.
- **ALT-004**: **Rejection Reason**: Rejected because it increases median and tail latency for repeated reads and places unnecessary sustained load on the database tier.

## Implementation Notes

- **IMP-001**: Implement hybrid caching with FusionCache: L1 memory cache + L2 Redis distributed cache.
- **IMP-002**: Define key naming, TTL defaults, fail-safe behavior, and invalidation patterns for each cacheable data type.
- **IMP-003**: Use phased adoption starting with high-read, low-volatility queries; track L1 hit ratio, L2 hit ratio, cache latency, and database query reduction.

## References

- **REF-001**: Related ADRs: None.
- **REF-002**: External documentation: [Redis documentation](https://redis.io/docs/).
- **REF-003**: External documentation: [FusionCache](https://github.com/ZiggyCreatures/FusionCache).
- **REF-004**: Standards or frameworks referenced: [Cache-Aside pattern](https://learn.microsoft.com/azure/architecture/patterns/cache-aside).
