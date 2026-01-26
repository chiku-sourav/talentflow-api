
# Design Decisions

This section explains the **key architectural and engineering decisions** made in TalentFlow and the rationale behind them.
It is intended to clarify trade-offs and demonstrate production-oriented thinking.

---

## 1. Why NestJS (instead of Express/Fastify)

**Decision:** NestJS framework

**Rationale:**

* modular architecture (feature-based modules)
* dependency injection
* strong TypeScript support
* testability
* enterprise conventions out of the box

**Trade-off:**

* slightly more boilerplate than Express

**Why acceptable:**
Maintainability and scalability outweigh minimalism for backend systems.

---

## 2. Why PostgreSQL (not MongoDB)

**Decision:** Relational database

**Rationale:**

* strong relational integrity (Users ↔ Developers ↔ Projects ↔ Skills)
* many-to-many joins required for matching
* indexing + aggregation performance
* transactional consistency for contracts

**Trade-off:**

* more schema planning upfront

**Why acceptable:**
Matching logic depends heavily on relational joins; SQL fits better than NoSQL.

---

## 3. Why Prisma ORM

**Decision:** Prisma instead of raw SQL or TypeORM

**Rationale:**

* type-safe queries
* schema-first migrations
* excellent DX
* auto-generated client
* safer refactors

**Trade-off:**

* less flexible for complex analytics queries

**Mitigation:**
Use `prisma.$queryRaw` selectively for heavy matching queries.

---

## 4. Why Raw SQL for Matching

**Decision:** Use `$queryRaw` for the matching engine

**Rationale:**
Matching requires:

* joins
* aggregates
* ranking
* sorting
* LIMIT

ORM abstractions become inefficient.

**Benefit:**

* pushes computation to DB
* avoids loading large datasets into Node
* significantly faster

**Result:**
~200–400 ms → ~50–150 ms

**Principle:**
Use ORM for CRUD, raw SQL for heavy analytics.

---

## 5. Why Redis Caching

**Decision:** Cache match results in Redis

**Rationale:**
Matching queries are:

* expensive
* repeated frequently
* mostly read-heavy

**Pattern used:**
Cache-aside

**Flow:**

```
check cache → compute if miss → store → return
```

**Benefit:**

* reduces DB load
* improves latency drastically

**Measured improvement:**
~200 ms → ~5 ms

**Trade-off:**
cache invalidation complexity

**Mitigation:**
explicit invalidation on project/developer updates

---

## 6. Why Modular Monolith (not microservices)

**Decision:** Single service, modular design

**Rationale:**

* simpler deployment
* fewer moving parts
* easier debugging
* appropriate for current scale

**Trade-off:**
less independent scaling

**Future path:**
Matching, Auth, or Notifications can be split into services if needed.

**Principle:**
Start simple, split when necessary.

---

## 7. Why Docker-Only Infrastructure

**Decision:** All dependencies containerized

**Rationale:**

* reproducible environments
* no local DB/Redis installs
* consistent CI behavior
* easier onboarding

**Benefit:**

```
docker compose up
```

runs the entire stack

---

## 8. Why Structured Logging (Pino)

**Decision:** JSON structured logs

**Rationale:**

* machine-readable
* fast
* compatible with Loki/ELK
* request correlation IDs
* latency tracking

**Benefit:**
Production-grade observability vs console logs.

---

## 9. Why Prometheus + Grafana

**Decision:** Metrics-first monitoring

**Rationale:**
Provides:

* request rate
* latency (P95)
* cache hit ratio
* matching query count

**Benefit:**
Quantifiable performance, not guesswork.

**Principle:**
“If you can’t measure it, you can’t optimize it.”

---

## 10. Why Strict Linting & Formatting

**Decision:** ESLint + Prettier + EditorConfig

**Rationale:**

* consistent codebase
* clean diffs
* fewer bugs
* easier collaboration

**Benefit:**
Production hygiene expected in real teams.

---

## 11. Why Normalized Skills Model

**Decision:** Skill join tables instead of arrays

**Instead of:**

```
skills: string[]
```

**Used:**

```
Skill table + DeveloperSkill + ProjectSkill
```

**Benefits:**

* indexed queries
* faster filtering
* scalable
* relational correctness

**Trade-off:**
extra joins

**Justification:**
Query performance > schema simplicity.

---

## 12. Why Cache-Aside (not write-through)

**Decision:** Cache-aside pattern

**Rationale:**

* simplest implementation
* safe failure mode
* DB remains source of truth
* common industry practice

**Trade-off:**
first request slower

**Acceptable because:**
most traffic hits cache afterward.

---

## 13. Testing Strategy Choice

**Decision:** Unit + Integration + E2E

**Rationale:**

* services tested in isolation
* DB interactions validated
* full flows tested

**Benefit:**
Confidence without over-engineering mocks.

---

## 14. Performance Philosophy

Core principles followed:

* filter in DB, not JS
* index all filters
* paginate everything
* cache expensive queries
* measure latency
* optimize only after measurement

This avoids premature optimization while ensuring scalability.

---

# Summary

TalentFlow was intentionally designed to demonstrate:

* clean architecture
* pragmatic technology choices
* performance awareness
* observability
* production readiness
