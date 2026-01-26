# Deployment Guide

This document describes how to deploy TalentFlow to:

* Render (fastest, simplest)
* AWS (production-grade, scalable)

Both approaches follow:

* stateless API
* managed database
* managed Redis
* environment-based config
* containerized runtime

---

---

# Option 1 — Deploy to Render (Recommended for Portfolio / MVP)

Render is ideal for:

* quick deployment
* minimal DevOps
* free tier
* managed Postgres/Redis
* automatic SSL

---

## Architecture on Render

```
Render Web Service (API)
        ↓
Render PostgreSQL
        ↓
Render Redis
```

Prometheus/Grafana optional locally.

---

---

## Step 1 — Push to GitHub

Render deploys from GitHub.

```bash
git init
git add .
git commit -m "initial"
git remote add origin <repo>
git push -u origin main
```

---

---

## Step 2 — Create PostgreSQL

Render Dashboard:

```
New → PostgreSQL
```

Choose:

* Starter plan

Copy:

```
Internal Database URL
```

---

---

## Step 3 — Create Redis

```
New → Redis
```

Copy:

```
Internal host + port
```

---

---

## Step 4 — Create Web Service

```
New → Web Service
```

### Settings

### Build Command

```bash
npm ci && npm run build
```

### Start Command

```bash
node dist/main.js
```

### Runtime

```
Node 20+
```

---

---

## Step 5 — Environment Variables

Add:

```
NODE_ENV=production
PORT=3000

DATABASE_URL=<Render Postgres URL>

REDIS_HOST=<render redis host>
REDIS_PORT=6379

JWT_SECRET=supersecret
LOG_LEVEL=info
```

---

---

## Step 6 — Prisma 7 Setup (IMPORTANT)

Render does not auto-run migrations.

Add:

### Start command (recommended)

```bash
npx prisma migrate deploy && node dist/main.js
```

This:

* applies migrations
* then starts server

---

---

## Step 7 — Deploy

Click:

```
Deploy → Manual Deploy
```

After build:

```
https://your-app.onrender.com
```

---

---

## Optional — Health Check

Add:

```
/health
```

to Render health check path.

---

---

## Render Pros & Cons

### Pros

* simplest
* managed DB/Redis
* no infra setup
* good for demos/interviews

### Cons

* limited scaling control
* not ideal for heavy production

---

---

# Option 2 — Deploy to AWS (Production Style)

Use this for:

* real production
* scaling
* professional setups

---

# Recommended AWS Architecture

```
             ALB
              ↓
        ECS/Fargate (API)
              ↓
     ┌──────────────┬─────────────┐
     ↓              ↓
 RDS Postgres   ElastiCache Redis
```

---

---

# Services Used

| Service     | Purpose        |
| ----------- | -------------- |
| ECS Fargate | run containers |
| RDS         | PostgreSQL     |
| ElastiCache | Redis          |
| ALB         | load balancing |
| CloudWatch  | logs/metrics   |

---

---

# Step-by-Step (High Level)

---

## 1. Build Docker Image

Your existing Dockerfile works.

Test:

```bash
docker build -t talentflow-api .
```

---

---

## 2. Push to ECR

### Create repo

```
AWS → ECR → Create repository
```

### Push

```bash
aws ecr get-login-password | docker login ...
docker tag talentflow-api <repo>
docker push <repo>
```

---

---

## 3. Create RDS Postgres

```
RDS → Create DB
```

Choose:

* PostgreSQL 16
* small instance (dev)

Copy endpoint:

```
talentflow.xxxxxx.rds.amazonaws.com
```

---

---

## 4. Create ElastiCache Redis

```
ElastiCache → Redis
```

Copy endpoint.

---

---

## 5. Create ECS Service (Fargate)

Create:

* Task definition → container image
* CPU/memory
* environment variables

### Env vars

```
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/nestdb
REDIS_HOST=redis-endpoint
REDIS_PORT=6379
NODE_ENV=production
```

---

---

## 6. Run Prisma Migrations

Two options:

### Option A — On startup (simple)

Inside Docker CMD:

```bash
npx prisma migrate deploy && node dist/main.js
```

### Option B — CI/CD step (recommended)

Run migration job before deployment.

---

---

## 7. Add Load Balancer

Application Load Balancer:

```
ALB → target group → ECS service
```

Gives:

* HTTPS
* scaling
* health checks

---

---

## 8. Logs

CloudWatch automatically captures stdout.

Your Pino JSON logs appear automatically.

---

---

# Production Considerations

---

## Enable autoscaling

Scale on:

* CPU > 70%
* memory usage

---

## Add health check

```
/health
```

---

## Use secrets manager

Store:

* DB URL
* JWT secret

---

## Enable read replicas

For high read traffic.

---

## Redis persistence

Enable AOF/RDB.

---

---

# Which Option Should You Use?

## For portfolio/interviews

Use:

```
Render
```

Faster, simpler.

---

## For real production

Use:

```
AWS
```

More control and scalability.

---

---

# Deployment Checklist

Before deploying:

* [ ] Docker builds
* [ ] env vars set
* [ ] prisma migrate deploy
* [ ] health endpoint works
* [ ] Redis reachable
* [ ] logs structured
* [ ] metrics endpoint accessible

---

---

# Interview Talking Point

You can say:

> I containerized the app and deployed it to Render for simplicity, and also designed an AWS architecture using ECS, RDS, and Redis for real production scalability. The system is stateless so it can scale horizontally behind a load balancer.

This signals:

* DevOps knowledge
* cloud familiarity
* production mindset

---

---
