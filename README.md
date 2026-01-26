# TalentFlow API

A **production-grade backend platform** for remote developer hiring and project matching.
Built with **NestJS, Prisma 7, PostgreSQL, Redis, and full observability (Prometheus + Grafana)**.

This project demonstrates **senior-level backend engineering practices**: clean architecture, optimized queries, caching, metrics, logging, testing strategy, and containerized infrastructure.

---

## Table of Contents

* Overview
* Architecture
* Tech Stack
* Features
* System Design
* Getting Started
* Environment Variables
* Database & Prisma
* Caching Strategy
* Observability
* Developer Experience
* Scripts
* Documentation
* Performance Characteristics
* Roadmap

---

## Overview

TalentFlow is a backend system similar to **Proxify / Toptal-style hiring platforms**, allowing:

* developers to register skills and availability
* clients to post projects
* automatic matching of developers to projects
* caching and ranking of matches
* monitoring, metrics, and structured logs

The system is **API-only** and designed to be frontend-agnostic.

---

## Architecture

```
Clients (Postman / Frontend)
        ↓
NestJS API (Controllers, Guards, Services)
        ↓
Prisma ORM
        ↓
PostgreSQL
        ↑
Redis (match cache)
        ↑
Prometheus → Grafana (metrics)
```

### Architecture Style

* Modular monolith
* Stateless API
* Cache-aside pattern
* Docker-orchestrated services

---

## Tech Stack

### Core

* **Node.js 20**
* **NestJS**
* **TypeScript**

### Data

* **PostgreSQL**
* **Prisma ORM (v7)**

### Caching

* **Redis**

### Observability

* **Prometheus**
* **Grafana**
* **Pino (structured logging)**

### Tooling

* ESLint (Flat Config)
* Prettier
* EditorConfig
* Docker & Docker Compose

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Role-based access control (Admin / Client / Developer)

### Domain

* Users
* Developers
* Clients
* Skills (normalized, many-to-many)
* Projects
* Matching engine
* Contracts

### Matching Engine

* Skill overlap scoring
* Availability filtering
* Budget constraints
* Ranked results
* Optimized SQL + Redis caching

### Performance

* Indexed queries
* DB-side filtering
* Aggregation in SQL
* Redis cache with TTL and invalidation

### Observability

* Request rate
* Latency (avg + P95)
* Cache hit/miss ratio
* Matching query count
* CPU & memory metrics

---

## System Design Highlights

### Prisma 7 Configuration

* No DB URL in `schema.prisma`
* Centralized configuration in `prisma.config.ts`
* Clean separation of schema and environment secrets

### Matching Optimization

* Heavy matching logic executed in SQL
* `COUNT(skillId)` used for scoring
* `LIMIT` applied in database
* Redis cache reduces latency from ~200ms → ~5ms

### Caching Strategy

* Cache-aside pattern
* Key: `matches:project:{projectId}`
* TTL-based invalidation
* Explicit invalidation on updates

---

## Getting Started

### Prerequisites

* Docker
* Docker Compose
* Node.js 20+

---

### Clone

```bash
git clone https://github.com/your-username/talentflow-api.git
cd talentflow-api
```

---

### Start Everything

```bash
docker compose up --build
```

Services started:

* API → [http://localhost:3000](http://localhost:3000)
* PostgreSQL → 5432
* Redis → 6379
* Prometheus → [http://localhost:9090](http://localhost:9090)
* Grafana → [http://localhost:3001](http://localhost:3001)

---

## Environment Variables

`.env`

```env
PORT=3000

DATABASE_URL=postgresql://nestuser:nestpass@postgres:5432/nestdb

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=devsecret
JWT_EXPIRES=1d

LOG_LEVEL=info
NODE_ENV=development
```

---

## Database & Prisma

### Migrations

```bash
npx prisma migrate dev
```

### Seed Data

```bash
npx prisma db seed
```

### Prisma Studio

```bash
npx prisma studio
```

---

## Caching Strategy (Redis)

* Matches cached per project
* TTL: 10 minutes
* Invalidated on:

  * project updates
  * developer availability / skills change
  * contract creation

Expected cache hit rate in steady state: **> 80%**

---

## Observability

### Metrics Endpoint

```
GET /metrics
```

Scraped by Prometheus.

### Grafana Dashboard

* Request rate
* Cache hit ratio
* P95 latency
* Matching queries/sec
* CPU & memory usage

Prebuilt dashboard JSON included in:

```
monitoring/grafana-dashboard.json
```

---

## Developer Experience

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
```

### EditorConfig

Ensures consistent formatting across editors and OS.

---

## Scripts

```json
{
  "start:dev": "nest start --watch",
  "build": "nest build",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "test": "jest",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

---

## Documentation

All design documents are included:

```
docs/
  FRD.md                  # Functional Requirements
  TDD.md                  # Technical Design
  openapi.yaml            # API contract
  er-diagram.md           # Database ER diagram
  architecture.md         # System architecture
  test-strategy.md        # Testing approach
  performance-test-plan.md
  prisma-optimization-checklist.md
```

---

## Performance Characteristics

| Scenario                   | Expected |
| -------------------------- | -------- |
| Avg API latency            | < 50 ms  |
| P95 latency                | < 200 ms |
| Matching endpoint (cached) | < 5 ms   |
| Matching endpoint (cold)   | < 300 ms |
| Cache hit rate             | > 80%    |

---

## Roadmap

* Redis warm-up jobs
* Background matching recomputation
* Rate limiting
* Role-based dashboards
* Cloud deployment (AWS / Render)
* Log aggregation with Grafana Loki
