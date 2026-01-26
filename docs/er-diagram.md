
# ER Diagram (Mermaid)

```mermaid
erDiagram

    USER {
        uuid id PK
        string email
        string password
        enum role
        datetime createdAt
        datetime updatedAt
    }

    DEVELOPER {
        uuid id PK
        uuid userId FK
        string bio
        int experience
        int hourlyRate
        boolean available
    }

    CLIENT {
        uuid id PK
        uuid userId FK
        string companyName
        string website
    }

    SKILL {
        uuid id PK
        string name
    }

    DEVELOPER_SKILL {
        uuid developerId FK
        uuid skillId FK
    }

    PROJECT {
        uuid id PK
        uuid clientId FK
        string title
        string description
        int budget
        enum status
    }

    PROJECT_SKILL {
        uuid projectId FK
        uuid skillId FK
    }

    MATCH {
        uuid id PK
        uuid developerId FK
        uuid projectId FK
        float score
        datetime createdAt
    }

    CONTRACT {
        uuid id PK
        uuid developerId FK
        uuid projectId FK
        int rate
        enum status
        datetime startDate
        datetime endDate
    }

    USER ||--o| DEVELOPER : has
    USER ||--o| CLIENT : has

    DEVELOPER ||--o{ DEVELOPER_SKILL : has
    SKILL ||--o{ DEVELOPER_SKILL : tagged_with

    PROJECT ||--o{ PROJECT_SKILL : requires
    SKILL ||--o{ PROJECT_SKILL : needed_for

    CLIENT ||--o{ PROJECT : owns

    DEVELOPER ||--o{ MATCH : matched
    PROJECT ||--o{ MATCH : matched

    DEVELOPER ||--o{ CONTRACT : works_on
    PROJECT ||--o{ CONTRACT : hires
```

---

# Visual Structure (Conceptual)

### Core Identity

```
User
 ├── Developer
 └── Client
```

### Skills

```
Developer ↔ Skill (many-to-many)
Project   ↔ Skill (many-to-many)
```

### Business

```
Client → Projects
Project ↔ Developer (Match)
Project ↔ Developer (Contract)
```

---

# Design Rationale

## User separation

Profiles split:

* auth logic stays in User
* domain data stays in Developer/Client

This is a standard **enterprise polymorphic pattern**.

---

## Normalized Skills

Instead of arrays:

```
skills: string[]
```

We use:

```
Skill + join tables
```

Benefits:

* indexed search
* filtering
* scalability
* better matching queries

---

## Match table

Stores:

* computed score
* history
* ranking

Avoids recomputing matches every request.

This is a **senior-level architecture decision**.

---

## Contract table

Represents real hiring lifecycle:

```
PENDING → ACTIVE → ENDED
```

Keeps business logic explicit.

---
