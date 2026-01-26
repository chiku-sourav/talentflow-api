# Interview Talking Points

Use these short summaries when explaining the project verbally.

---

## 30-Second Pitch

> TalentFlow is a production-style NestJS backend for a remote hiring marketplace.
> It supports authentication, project management, and a skill-based matching engine.
> I optimized matching using SQL aggregation and Redis caching, reducing latency from ~200ms to under 5ms.
> The system includes Dockerized infra, Prisma ORM, Prometheus/Grafana monitoring, and structured logging to simulate real production practices.

---

## 60-Second Architecture Summary

> It’s a modular monolith built with NestJS.
> Controllers handle HTTP, services hold business logic, Prisma handles DB access, PostgreSQL stores relational data, and Redis caches expensive matching queries.
> Metrics are exposed via Prometheus and visualized in Grafana.
> Everything runs in Docker for reproducibility.

---

## 2-Minute Deep Dive

> The core complexity is the matching engine.
> Instead of fetching all developers and filtering in memory, I push filtering and ranking into SQL using joins and COUNT aggregates.
> Then I cache results in Redis using a cache-aside strategy.
> This keeps the database load low and makes repeated requests nearly instant.
> I also added structured logs, metrics, linting, and testing to make it production-ready rather than a demo project.

---

---

# Key Technical Highlights (Quick Bullets)

Use these as sound bites:

* Modular NestJS architecture
* Prisma 7 with migrations
* PostgreSQL with proper indexing
* Raw SQL for heavy ranking queries
* Redis cache-aside pattern
* Prometheus + Grafana monitoring
* Structured JSON logging (Pino)
* Dockerized full stack
* ESLint + Prettier + CI hygiene
* Production-style documentation

---

---

# Common Questions & Answers

---

## Q1 — Why NestJS instead of Express?

**Answer:**

> NestJS provides dependency injection, modular structure, and better testability.
> For larger systems, structure and maintainability are more important than minimal setup.
> It scales better as the codebase grows.

---

## Q2 — Why PostgreSQL instead of MongoDB?

**Answer:**

> Matching requires relational joins between developers, projects, and skills.
> SQL handles many-to-many relationships and aggregations much more efficiently.
> PostgreSQL gives stronger consistency and indexing support for these queries.

---

## Q3 — Why Prisma?

**Answer:**

> Prisma gives type-safe queries and schema-driven migrations, which reduces runtime bugs.
> It improves developer experience and refactoring safety.
> For complex queries, I still use raw SQL where appropriate.

---

## Q4 — Why did you use raw SQL for matching?

**Answer:**

> The matching logic involves joins, grouping, and ranking.
> Doing this in the ORM or application layer would be slower and memory heavy.
> Executing it directly in SQL lets the database optimize execution and is significantly faster.

---

## Q5 — How did you improve performance?

**Answer:**

> Three main steps:
>
> 1. DB-side filtering and indexing
> 2. Aggregation in SQL
> 3. Redis caching
>
> This reduced match latency from ~200–300ms to under 5ms for cached requests.

---

## Q6 — Why Redis caching?

**Answer:**

> Matching is compute-heavy but mostly read-heavy.
> Caching prevents repeated expensive queries and protects the database.
> I used a cache-aside pattern with TTL and explicit invalidation.

---

## Q7 — How do you handle cache invalidation?

**Answer:**

> When project requirements or developer availability changes, I delete the related cache key.
> That forces recomputation on the next request.
> This keeps data fresh while still benefiting from caching.

---

## Q8 — Why modular monolith instead of microservices?

**Answer:**

> Microservices add operational complexity.
> For this scale, a modular monolith is simpler to deploy and debug.
> If traffic grows, modules like matching could be extracted later.

---

## Q9 — How do you ensure reliability?

**Answer:**

> * Dockerized services
> * DB migrations
> * tests
> * health checks
> * metrics
> * structured logging
>
> This makes failures observable and reproducible.

---

## Q10 — How do you monitor performance?

**Answer:**

> Prometheus scrapes metrics like request rate, latency, and cache hit ratio.
> Grafana dashboards visualize trends.
> This helps detect bottlenecks before users notice issues.

---

## Q11 — How do you prevent slow queries?

**Answer:**

> * indexes on filtered fields
> * pagination
> * selecting only required columns
> * avoiding N+1 queries
> * using EXPLAIN ANALYZE
> * caching expensive operations

---

## Q12 — How would you scale this system?

**Answer:**

> * add Redis caching (already done)
> * horizontal API scaling behind load balancer
> * DB read replicas
> * background job workers
> * split matching into a service if needed

---

## Q13 — What would you improve next?

**Answer:**

> * background pre-computation of matches
> * rate limiting
> * async queues
> * better analytics
> * cloud deployment
> * log aggregation with Loki

---

---

# “If You Had 1 Minute to Explain This Project”

You can memorize this:

> I built a production-style backend using NestJS and PostgreSQL.
> The core challenge was efficiently matching developers to projects.
> I optimized it by pushing ranking logic into SQL and caching results in Redis, reducing latency by ~50x.
> I also added observability with Prometheus and structured logging, plus Dockerized infra and proper linting/testing.
> The focus was building it like a real production system, not just a demo API.

---

---
