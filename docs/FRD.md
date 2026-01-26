# TalentFlow API

## Functional Requirements Document (FRD)

---

## 1. Purpose

The purpose of this system is to design and implement a **scalable backend API** that supports a remote talent marketplace where:

* Developers create professional profiles
* Clients post projects
* The system matches developers to projects
* Contracts are managed securely

The solution demonstrates **production-grade backend engineering practices** using:

* NestJS
* PostgreSQL
* Prisma
* Docker
* JWT Authentication

This project simulates real-world platforms such as Proxify, Toptal, or Turing.

---

## 2. Scope

### Included

* REST API backend
* Authentication and authorization
* Role-based access control
* PostgreSQL database
* Matching engine
* Dockerized deployment
* Automated tests
* Swagger documentation

### Excluded

* Frontend UI
* Payment gateways
* Notifications
* External integrations

---

## 3. Stakeholders

| Role      | Description               |
| --------- | ------------------------- |
| Admin     | Manages the entire system |
| Client    | Company hiring developers |
| Developer | Freelancer seeking work   |

---

## 4. System Overview

### Architecture

```
Client → API (NestJS) → Prisma → PostgreSQL
```

### Major Components

* API Server (NestJS)
* Database (PostgreSQL)
* ORM (Prisma)
* Containerization (Docker)

---

## 5. User Roles & Permissions

### Admin

* View all users
* Manage system data
* Override matches
* Full access

### Client

* Create projects
* Define required skills
* View matched developers
* Create contracts

### Developer

* Create and update profile
* Add skills
* Set rate and availability
* Accept/reject contracts

---

## 6. Functional Requirements

---

### 6.1 Authentication Module

| ID    | Requirement                                  |
| ----- | -------------------------------------------- |
| FR-A1 | Users shall register with email and password |
| FR-A2 | Users shall login using JWT                  |
| FR-A3 | Passwords shall be securely hashed           |
| FR-A4 | Protected routes require authentication      |
| FR-A5 | Role-based authorization enforced            |

---

### 6.2 User Management

| ID    | Requirement                           |
| ----- | ------------------------------------- |
| FR-U1 | System shall store user accounts      |
| FR-U2 | Each user shall have exactly one role |
| FR-U3 | Users shall update profile data       |
| FR-U4 | Admin may deactivate accounts         |

---

### 6.3 Developer Management

| ID    | Requirement                             |
| ----- | --------------------------------------- |
| FR-D1 | Developers shall create profiles        |
| FR-D2 | Developers shall add/remove skills      |
| FR-D3 | Developers shall define hourly rate     |
| FR-D4 | Developers shall set availability       |
| FR-D5 | Developers shall view matching projects |

---

### 6.4 Client Management

| ID    | Requirement                           |
| ----- | ------------------------------------- |
| FR-C1 | Clients shall create accounts         |
| FR-C2 | Clients shall manage company profile  |
| FR-C3 | Clients shall create projects         |
| FR-C4 | Clients shall view matched developers |

---

### 6.5 Project Management

| ID    | Requirement                                     |
| ----- | ----------------------------------------------- |
| FR-P1 | Clients shall create projects                   |
| FR-P2 | Projects shall include required skills          |
| FR-P3 | Projects shall include budget                   |
| FR-P4 | Projects shall track status                     |
| FR-P5 | Projects shall support filtering and pagination |

---

### 6.6 Matching Engine

Automatically ranks developers for each project.

| ID    | Requirement                  |
| ----- | ---------------------------- |
| FR-M1 | Match by skill overlap       |
| FR-M2 | Filter by availability       |
| FR-M3 | Enforce budget compatibility |
| FR-M4 | Compute match score          |
| FR-M5 | Return ranked developer list |

### Matching Criteria

* Skills match %
* Hourly rate ≤ project budget
* Developer availability

---

### 6.7 Contract Management

| ID     | Requirement                             |
| ------ | --------------------------------------- |
| FR-CT1 | Clients shall create contracts          |
| FR-CT2 | Developers shall accept/reject          |
| FR-CT3 | Contracts shall store rate and duration |
| FR-CT4 | Contracts shall track status            |

---

### 6.8 API Requirements

| ID      | Requirement               |
| ------- | ------------------------- |
| FR-API1 | RESTful design            |
| FR-API2 | Input validation          |
| FR-API3 | Pagination support        |
| FR-API4 | Swagger documentation     |
| FR-API5 | Consistent error handling |

---

## 7. Non-Functional Requirements

### Performance

* Average response time < 300ms
* Indexed queries
* Pagination for large datasets

### Security

* JWT authentication
* Hashed passwords
* Role-based guards
* Input validation

### Reliability

* Dockerized deployment
* Health check endpoint
* Database migrations

### Maintainability

* Modular architecture
* Clean separation of concerns
* DTO validation
* Test coverage ≥ 70%

### Scalability

* Stateless API
* Horizontal scaling possible
* Container-based deployment

---

## 8. Data Model (Entities)

* User
* Developer
* Client
* Skill
* Project
* Match
* Contract

---

## 9. API Endpoints (High-Level)

### Authentication

```
POST /auth/register
POST /auth/login
```

### Developers

```
GET /developers
POST /developers
PATCH /developers/:id
DELETE /developers/:id
```

### Projects

```
POST /projects
GET /projects
GET /projects/:id/matches
```

### Contracts

```
POST /contracts
PATCH /contracts/:id
```

---

## 10. Assumptions

* Stable internet connectivity
* Single region deployment
* No real payment processing
* JWT token expiry acceptable

---

## 11. Constraints

* Node.js runtime
* PostgreSQL database
* Prisma ORM
* Docker-based environment

---

## 12. Acceptance Criteria

The system is considered complete when:

* Authentication operational
* All CRUD modules functional
* Matching engine working
* Docker deployment works
* Tests pass
* Swagger documentation accessible

---

## 13. Future Enhancements (Out of Scope)

* Frontend application
* Real-time notifications
* Payments integration
* Analytics dashboards
* Multi-tenant architecture
* Advanced search engine

---

# End of Document
