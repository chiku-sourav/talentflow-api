# Performance Test Plan

# Project

**TalentFlow API — Remote Talent Matching Backend**

---

# 1. Purpose

This document defines the **strategy, methodology, tools, and success criteria** for validating system performance under expected and peak workloads.

Objectives:

* ensure acceptable latency
* validate scalability
* identify bottlenecks
* protect against regressions
* confirm production readiness

---

# 2. Scope

## In Scope

* REST API endpoints
* authentication overhead
* database queries
* matching engine
* pagination performance
* concurrent traffic

## Out of Scope

* frontend rendering
* CDN/network latency
* third-party integrations

---

# 3. Performance Goals (Targets)

These are **realistic startup-grade SLAs**.

| Metric         | Target        |
| -------------- | ------------- |
| Avg latency    | < 200 ms      |
| P95 latency    | < 500 ms      |
| Error rate     | < 1%          |
| Throughput     | ≥ 100 req/sec |
| Matching query | < 300 ms      |
| Cold start     | < 3 sec       |

---

# 4. Key Scenarios to Test

---

## 4.1 Authentication

### Endpoint

```
POST /auth/login
```

### Goal

* validate hashing + JWT overhead

### Load

* 50–100 concurrent logins

---

## 4.2 Developer Listing (Pagination)

### Endpoint

```
GET /developers?page=1&limit=10
```

### Goal

* ensure indexed queries
* avoid full table scans

### Load

* 500–5000 records
* concurrent reads

---

## 4.3 Project Creation

### Endpoint

```
POST /projects
```

### Goal

* validate write throughput
* DB insert performance

---

## 4.4 Matching Engine (Critical)

### Endpoint

```
GET /projects/:id/matches
```

### Goal

* evaluate business logic complexity
* ensure optimized joins

### Dataset

* 1k–10k developers
* 20+ skills

### Expectation

< 300 ms

---

## 4.5 Concurrent Mixed Traffic

### Mix

* 60% reads
* 30% matching
* 10% writes

Simulates real production.

---

# 5. Test Types

---

## 5.1 Load Testing

Validate behavior at normal traffic.

Example:

```
100 users
5 minutes
```

---

## 5.2 Stress Testing

Push beyond limits to find breaking point.

Example:

```
1000+ users spike
```

Observe:

* crashes
* timeouts
* DB locks

---

## 5.3 Spike Testing

Sudden traffic bursts.

Example:

```
0 → 500 req/sec instantly
```

---

## 5.4 Soak Testing

Long-duration stability.

Example:

```
6–12 hours steady traffic
```

Detect:

* memory leaks
* connection leaks

---

# 6. Tools

---

## Primary Tool — k6 (Recommended)

Reasons:

* lightweight
* scriptable
* widely used
* easy CI integration

Install:

```bash
sudo dnf install k6
```

or

```bash
brew install k6
```

---

## Alternatives

* Apache JMeter
* Artillery
* Postman Runner (basic)

---

# 7. Test Environment

---

## Infrastructure

* Docker containers
* same as production config
* seeded DB

## Hardware

* local or small VM
* consistent specs

---

# 8. Data Preparation

Before tests:

* seed database
* 1000–10000 developers
* 100+ projects
* realistic skill distributions

Why:
Small datasets hide bottlenecks.

---

# 9. Sample k6 Scripts

---

## 9.1 Developer Listing Test

Create:

```
perf/developers.js
```

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/developers');

  check(res, {
    'status 200': (r) => r.status === 200,
  });
}
```

Run:

```bash
k6 run perf/developers.js
```

---

## 9.2 Matching Test

```
perf/matching.js
```

```javascript
import http from 'k6/http';

export const options = {
  vus: 30,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3000/api/projects/1/matches');
}
```

---

## 9.3 Mixed Traffic

```
perf/mixed.js
```

```javascript
import http from 'k6/http';

export const options = {
  scenarios: {
    reads: {
      executor: 'constant-vus',
      vus: 40,
      duration: '1m',
      exec: 'reads',
    },
    matches: {
      executor: 'constant-vus',
      vus: 20,
      duration: '1m',
      exec: 'matches',
    },
  },
};

export function reads() {
  http.get('http://localhost:3000/api/developers');
}

export function matches() {
  http.get('http://localhost:3000/api/projects/1/matches');
}
```

---

# 10. Metrics to Monitor

---

## Application

* response time
* error rate
* memory usage
* CPU usage

---

## Database

* slow queries
* locks
* connection count
* query plans

---

## Tools

```
docker stats
htop
EXPLAIN ANALYZE
```

---

# 11. Optimization Strategy

If bottlenecks detected:

## Database

* add indexes
* reduce joins
* paginate
* cache matches

## API

* caching
* memoization
* remove heavy loops

## Infra

* horizontal scaling
* load balancer
* Redis

---

# 12. Acceptance Criteria

Performance is acceptable when:

* P95 latency < 500ms
* no memory growth
* no DB locks
* no crashes
* CPU < 70%

---

# 13. CI Integration (Optional)

Add nightly test:

```yaml
- run: k6 run perf/mixed.js
```

Prevents regressions.

---

# 14. Risks & Mitigation

| Risk          | Mitigation   |
| ------------- | ------------ |
| slow matching | DB indexes   |
| high memory   | profiling    |
| DB locks      | transactions |
| query spikes  | caching      |

---

# Conclusion

This strategy ensures:

* predictable performance
* scalability readiness
* bottleneck detection
* production confidence
