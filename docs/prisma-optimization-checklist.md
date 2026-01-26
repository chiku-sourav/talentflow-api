# Prisma Query Optimization Checklist

# Project

**TalentFlow API — NestJS + Prisma + PostgreSQL**

---

# 1. Objective

This checklist ensures:

* low latency
* minimal DB load
* scalable queries
* predictable performance
* no N+1 issues

Use this **before production deployment** and **whenever performance degrades**.

---

# 2. Golden Rules (Always Apply)

These five rules prevent 80% of issues.

## Always

* use pagination
* add indexes to filtered fields
* select only needed columns
* avoid N+1 queries
* test with realistic data volumes

## Never

* fetch entire tables
* use `include: true` blindly
* loop DB calls inside loops
* use unindexed filters

---

---

# 3. Query Design Checklist

---

## 3.1 Use Pagination Everywhere

### Problem

Unbounded queries:

```ts
prisma.developer.findMany()
```

→ full table scan

---

### Correct

```ts
prisma.developer.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

---

### Rule

Every `findMany()` must include:

```
skip + take
```

---

---

## 3.2 Select Only Required Fields

### Problem

Default fetch returns everything.

```ts
findMany()
```

Returns:

* all columns
* relations
* large payload

---

### Correct

```ts
findMany({
  select: {
    id: true,
    bio: true,
    hourlyRate: true,
  },
});
```

---

### Why

* smaller payload
* faster serialization
* less memory

---

---

## 3.3 Avoid N+1 Queries (Very Common)

### Problem

```ts
for (const dev of developers) {
  await prisma.skill.findMany(...)
}
```

100 developers → 101 queries

---

### Correct

Use `include` or joins:

```ts
findMany({
  include: {
    skills: true,
  },
});
```

OR

batch query with `IN`.

---

### Rule

Never call Prisma inside loops.

---

---

## 3.4 Use Proper Indexes

### Add indexes for:

* filters
* joins
* sorting
* foreign keys

---

### Example

In Prisma schema:

```prisma
model Developer {
  hourlyRate Int
  available  Boolean

  @@index([hourlyRate])
  @@index([available])
}
```

---

### For matching

```prisma
@@index([available, hourlyRate])
```

Composite index improves filtering.

---

---

## 3.5 Prefer DB Filtering Over JS Filtering

### Problem

```ts
const devs = await prisma.developer.findMany();
return devs.filter(d => d.available);
```

Loads all rows into memory.

---

### Correct

```ts
where: {
  available: true,
}
```

---

### Rule

Filtering must always happen in DB.

---

---

## 3.6 Use Transactions for Multiple Queries

### Problem

Multiple separate calls:

```ts
await prisma.project.create()
await prisma.projectSkill.create()
```

Slow + inconsistent.

---

### Correct

```ts
await prisma.$transaction([
  prisma.project.create(...),
  prisma.projectSkill.create(...)
]);
```

---

### Benefits

* faster
* atomic
* fewer round trips

---

---

## 3.7 Optimize Matching Engine Queries

Matching is your most expensive query.

---

### Wrong

Fetch everything then compute:

```ts
const devs = await prisma.developer.findMany();
```

---

### Correct

Filter first:

```ts
findMany({
  where: {
    available: true,
    hourlyRate: { lte: budget },
    skills: {
      some: {
        skillId: { in: skillIds }
      }
    }
  },
});
```

---

### Rule

Reduce candidate set in SQL first, compute score later.

---

---

## 3.8 Avoid `include: true`

### Problem

```ts
include: { skills: true }
```

Fetches all columns.

---

### Better

```ts
include: {
  skills: {
    select: {
      skill: { select: { name: true } }
    }
  }
}
```

---

---

## 3.9 Use Counts Efficiently

### Problem

```ts
const list = await findMany()
const total = list.length
```

Loads all rows.

---

### Correct

```ts
await prisma.developer.count()
```

---

---

## 3.10 Use Raw Queries for Heavy Analytics

Prisma is great for CRUD, but not heavy aggregates.

For complex ranking:

```ts
prisma.$queryRaw`
  SELECT ...
`
```

Use when:

* big joins
* ranking
* analytics

---

---

# 4. Schema-Level Optimization

---

## Add indexes to:

### Developer

```
available
hourlyRate
```

### Project

```
status
budget
```

### Match

```
score
developerId + projectId
```

### User

```
email (unique)
role
```

---

---

# 5. Query Smell Checklist

If you see any of these → fix immediately:

| Smell                    | Problem      |
| ------------------------ | ------------ |
| findMany() without take  | full scan    |
| include: true everywhere | overfetching |
| loops with prisma calls  | N+1          |
| filtering in JS          | memory heavy |
| no indexes               | slow         |
| huge JSON responses      | slow network |

---

---

# 6. Measurement Tools

---

## PostgreSQL

```
EXPLAIN ANALYZE
```

Example:

```sql
EXPLAIN ANALYZE SELECT ...
```

---

## Prisma logging

Enable:

```ts
new PrismaClient({
  log: ['query', 'warn', 'error'],
});
```

Detect slow queries.

---

## Runtime

```
docker stats
htop
k6
```

---

---

# 7. Performance Targets

| Query     | Target  |
| --------- | ------- |
| list page | < 100ms |
| matching  | < 300ms |
| login     | < 150ms |
| create    | < 100ms |

---

---

# 8. Quick Pre-Deploy Checklist

Before deployment:

* [ ] all findMany paginated
* [ ] no prisma in loops
* [ ] indexes added
* [ ] select only needed fields
* [ ] heavy queries EXPLAINed
* [ ] matching optimized
* [ ] load tested with k6

---

---

# Final Guidance

If performance degrades:

1. Check indexes
2. Check pagination
3. Check N+1
4. Check payload size
5. Use EXPLAIN
6. Then optimize code

Most issues are not Prisma — they are query design mistakes.

---

# Outcome

Following this checklist ensures:

* stable latency
* scalable queries
* production readiness
* strong senior backend practices

---