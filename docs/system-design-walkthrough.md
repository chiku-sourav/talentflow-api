# System Design Walkthrough

This section explains **how TalentFlow is designed end-to-end**, the reasoning behind each component, and how the system scales under load.

It mirrors how a backend system would be discussed in a **system design interview**.

---

# 1. Problem Statement

Design a backend platform that:

* stores developers and their skills
* allows clients to create projects with requirements
* automatically matches developers to projects
* returns ranked results quickly
* scales with increasing users
* remains observable and maintainable

Constraints:

* low latency (< 200ms target)
* many-to-many skill relationships
* read-heavy matching queries
* production-ready reliability

---

---

# 2. High-Level Architecture

```
                Clients (Web / Postman)
                         ↓
                 NestJS REST API
                         ↓
         ┌───────────────┴───────────────┐
         ↓                               ↓
   PostgreSQL                       Redis Cache
 (source of truth)                (match results)
         ↓
   Prometheus → Grafana
```

---

---

# 3. Component Breakdown

---

## 3.1 API Layer (NestJS)

Responsibilities:

* routing
* validation
* authentication (JWT)
* authorization (roles)
* orchestrating business logic

Why:

* modular architecture
* dependency injection
* strong TypeScript support
* easier testing

Pattern:

```
Controller → Service → Prisma
```

---

---

## 3.2 Database (PostgreSQL)

Responsibilities:

* persistent storage
* relational integrity
* joins and aggregations
* transactions

Why SQL:

Matching depends on:

* joins
* filtering
* counting
* sorting

SQL is far more efficient than NoSQL for this workload.

---

### Data Model (simplified)

```
User
Developer
Client
Project
Skill
DeveloperSkill (M:N)
ProjectSkill (M:N)
Contract
```

Why normalized:

* efficient indexing
* scalable filtering
* clean relationships

---

---

## 3.3 Prisma ORM

Responsibilities:

* type-safe queries
* migrations
* schema management

Why:

* fewer runtime bugs
* faster development
* safe refactors

Design choice:

* Prisma for CRUD
* raw SQL for heavy queries

---

---

## 3.4 Matching Engine (Core Logic)

This is the **most expensive operation**.

### Requirements

* filter available developers
* filter by budget
* match skills
* rank by overlap
* return top N

---

### Naive approach (bad)

```
fetch all developers
filter in JS
compute scores
```

Problems:

* loads entire table
* high memory
* slow

---

### Optimized approach (used)

Push work to DB:

```sql
JOIN
GROUP BY
COUNT(skill)
ORDER BY score DESC
LIMIT 10
```

Benefits:

* DB uses indexes
* minimal data transferred
* faster execution

---

---

## 3.5 Redis Cache

Responsibilities:

* store expensive query results
* reduce DB load
* improve latency

Pattern:

Cache-aside

Flow:

```
check cache
  hit → return
  miss → compute → store → return
```

---

### Why cache matches?

Matching is:

* expensive
* repeated often
* mostly read-heavy

Perfect candidate for caching.

---

### Performance impact

Before:

```
200–300 ms
```

After:

```
< 5 ms
```

~50x faster.

---

---

## 3.6 Observability

### Prometheus

* request count
* latency
* cache hits/misses
* match queries

### Grafana

* dashboards
* P95 latency
* trends

### Structured Logs

* JSON logs
* request IDs
* latency

Why:

Without metrics:

```
guessing
```

With metrics:

```
measurable optimization
```

---

---

# 4. Request Flow (Step-by-Step)

Example:

```
GET /projects/1/matches
```

---

## Step 1

Request hits NestJS controller

---

## Step 2

Service checks Redis:

```
matches:project:1
```

---

## Step 3A — Cache hit

Return immediately (~5ms)

---

## Step 3B — Cache miss

Run optimized SQL query

---

## Step 4

Store result in Redis with TTL

---

## Step 5

Return response

---

---

# 5. Scaling Strategy

---

## Horizontal API scaling

Because API is stateless:

```
multiple containers behind load balancer
```

---

## Database scaling

Options:

* read replicas
* indexes
* query optimization
* connection pooling

---

## Cache scaling

Redis handles:

* heavy reads
* reduced DB pressure

---

## Future extraction

If needed:

* Matching service → separate worker
* Queue-based async computation

---

---

# 6. Bottleneck Analysis

---

## Potential bottlenecks

### Matching queries

Mitigation:

* indexes
* raw SQL
* caching

---

### DB overload

Mitigation:

* cache
* replicas

---

### High latency

Mitigation:

* metrics
* profiling
* pagination

---

### Memory leaks

Mitigation:

* soak testing
* monitoring

---

---

# 7. Failure Handling

---

## Redis down

Fallback:
→ compute from DB

System still works, just slower.

---

## DB down

API unavailable

Expected behavior for source-of-truth systems.

---

## Cache stale

TTL + invalidation ensures eventual consistency.

---

---

# 8. Trade-offs Made

| Decision          | Benefit           | Trade-off                |
| ----------------- | ----------------- | ------------------------ |
| Modular monolith  | simpler ops       | less independent scaling |
| Redis caching     | fast responses    | invalidation complexity  |
| Raw SQL           | performance       | less abstraction         |
| Normalized schema | efficient queries | more joins               |
| Docker infra      | reproducibility   | setup overhead           |

---

---

# 9. How I Would Explain This in an Interview

You can say:

> The system is a NestJS API backed by PostgreSQL.
> The main challenge is efficiently matching developers to projects.
> I push heavy computation into SQL and cache results in Redis to keep latency low.
> Everything is observable via Prometheus and Grafana, and Docker ensures reproducible environments.
> It’s designed as a modular monolith that can evolve into microservices if needed.

---

---

# 10. Key Design Principles Followed

* push computation to database
* cache expensive reads
* measure performance
* start simple, scale later
* optimize only bottlenecks
* design for observability
* containerize everything

---

---

# Outcome

The final system is:

* fast
* scalable
* observable
* maintainable
* production-ready

