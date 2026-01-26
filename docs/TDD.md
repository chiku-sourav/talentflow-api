# Technical Design Document (TDD)

# Project

**TalentFlow API — Remote Talent Matching Backend**

---

# 1. Introduction

## 1.1 Objective

Define the technical architecture, system components, design patterns, and implementation strategy for the TalentFlow backend.

The system must be:

* modular
* scalable
* production-ready
* testable
* cloud-deployable

---

## 1.2 Technology Stack

| Layer     | Technology  | Rationale                     |
| --------- | ----------- | ----------------------------- |
| Runtime   | Node.js 20+ | Industry standard             |
| Framework | NestJS      | Modular, DI, enterprise-ready |
| Language  | TypeScript  | Type safety                   |
| Database  | PostgreSQL  | Relational + advanced queries |
| ORM       | Prisma 7    | Typed queries + migrations    |
| Auth      | JWT         | Stateless security            |
| Container | Docker      | Reproducible environments     |
| Testing   | Jest        | Built-in with Nest            |
| Docs      | Swagger     | API discoverability           |

---

# 2. High-Level Architecture

## 2.1 Logical View

```
Clients (Postman/Web)
        ↓
NestJS Controllers
        ↓
Services (Business Logic)
        ↓
Prisma ORM
        ↓
PostgreSQL
```

---

## 2.2 Layered Architecture

### Presentation Layer

* Controllers
* DTO validation
* Guards

### Business Layer

* Services
* Matching logic
* Rules

### Data Layer

* Prisma client
* Database access

### Infrastructure Layer

* Config
* Logging
* Docker
* CI

---

# 3. Project Structure

```
src/
 ├── modules/
 ├── common/
 ├── config/
 ├── database/
 └── main.ts
```

---

## 3.1 Module-Based Design

Each feature is self-contained:

```
feature/
  controller
  service
  dto
  module
```

### Reasons

* scalability
* clear ownership
* testability
* avoids monolith files

---

# 4. Component Design

---

## 4.1 Authentication Module

### Responsibilities

* register
* login
* password hashing
* JWT issuance
* role enforcement

### Flow

```
Login → validate → sign JWT → return token
```

### Components

* AuthController
* AuthService
* JwtStrategy
* JwtGuard
* RolesGuard

---

## 4.2 Users Module

### Responsibilities

* account management
* role assignment

### Database

User table stores:

* email
* password
* role

Profiles stored separately.

### Rationale

Polymorphic design supports multiple profile types.

---

## 4.3 Developers Module

### Responsibilities

* developer profile
* skills
* availability
* rates

### Design Choice

Skills normalized via many-to-many tables.

### Why

* indexable
* filterable
* scalable

---

## 4.4 Clients Module

### Responsibilities

* company profile
* project ownership

---

## 4.5 Projects Module

### Responsibilities

* project lifecycle
* skill requirements
* budget tracking

---

## 4.6 Matching Module

### Responsibilities

Core business logic.

### Algorithm

Inputs:

* required skills
* developer skills
* availability
* rate

Pseudo:

```
score =
  skill_overlap_weight +
  availability_bonus +
  budget_match_bonus
```

Return sorted developers.

### Complexity

Optimized DB filtering + light scoring.

---

## 4.7 Contracts Module

### Responsibilities

* agreement tracking
* statuses
* lifecycle

---

# 5. Database Design

---

## 5.1 ER Diagram (logical)

```
User
 ├─ Developer
 ├─ Client

Developer ↔ Skill
Project ↔ Skill
Developer ↔ Project (Match)
Developer ↔ Project (Contract)
```

---

## 5.2 Design Principles

### Normalization

* avoid arrays for skills
* many-to-many tables

### Indexing

Indexes on:

* email
* role
* availability
* rate
* status

### Benefits

* faster matching
* efficient queries

---

# 6. API Design

---

## 6.1 REST Principles

* nouns only
* stateless
* JSON
* standard HTTP codes

---

## 6.2 Example

```
GET /developers
POST /projects
GET /projects/:id/matches
```

---

## 6.3 Error Handling

Standard format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

---

# 7. Security Design

---

## 7.1 Authentication

* JWT bearer tokens
* stateless

---

## 7.2 Authorization

* role-based guards

---

## 7.3 Passwords

* bcrypt hashing
* never stored plain text

---

## 7.4 Input Validation

* DTO validation pipes

---

# 8. Configuration Management

---

## 8.1 Environment Variables

```
DATABASE_URL
JWT_SECRET
PORT
```

Loaded via:

* Nest ConfigModule
* prisma.config.ts

---

# 9. Logging & Observability

---

## Logging

* interceptor-based request logging

## Health Check

```
GET /health
```

Used by:

* Docker
* CI
* cloud platforms

---

# 10. Testing Strategy

---

## Unit Tests

Services only.

## Integration Tests

Controllers + DB.

## e2e Tests

Full API flow.

---

## Coverage Target

```
≥ 70%
```

---

# 11. Deployment Design

---

## Dockerized

### Containers

* api
* postgres

### Start

```
docker compose up
```

---

## CI Pipeline

GitHub Actions:

* install
* test
* build

---

# 12. Scalability Strategy

---

## Horizontal Scaling

* stateless API
* load balancer ready

## Database

* indexes
* pagination
* optimized queries

## Future

* Redis caching
* microservices split

---

# 13. Performance Considerations

* pagination default
* indexed filters
* minimal joins
* batch queries
* Prisma transactions

---

# 14. Trade-offs

| Decision       | Trade-off          |
| -------------- | ------------------ |
| Prisma         | less SQL control   |
| Monolith first | simpler deployment |
| JWT            | no server sessions |

---

# 15. Risks & Mitigations

| Risk              | Mitigation |
| ----------------- | ---------- |
| slow queries      | indexing   |
| auth bugs         | guards     |
| schema changes    | migrations |
| environment drift | Docker     |

---

# 16. Future Improvements

* Redis caching
* background jobs
* notifications
* payments
* microservices

---

# Conclusion

This design ensures:

* modular code
* clean separation
* production readiness
* maintainability
* scalability