# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js)
```bash
# Run from project root
npm run dev       # dev server (do NOT run via tool — start manually)
npm run build     # production build
npm run lint      # ESLint
```

### Java Backend
```bash
# Run from backend/java/
# Requires Java 17+
mvn spring-boot:run          # start server on :8080
mvn clean package            # build JAR
mvn test                     # run tests
mvn test -Dtest=ClassName    # run single test class
```

**API Documentation:** Swagger UI available at `http://localhost:8080/swagger-ui.html`

### Python Backend
```bash
# Run from backend/python/
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Architecture

Three independent services that must all run together:

| Service | Port | Role |
|---|---|---|
| Next.js frontend | 3000 | UI, routes to Java via `/api` |
| Spring Boot (Java) | 8080 | API gateway, auth, orchestration |
| FastAPI (Python) | 8000 | AI inference (LLM, imaging, voice) |

**Request flow:** Browser → Next.js → Java (`/api/*`) → Python AI services (`:8001`/`:8002`/`:8003`)

The Java backend proxies AI invocation requests to the Python service. The Python service is split into three logical endpoints per `application.yml`: LLM on 8001, image on 8002, voice on 8003 — though the FastAPI app currently runs all three on a single port.

## Frontend Conventions

- All pages are in `app/` using Next.js App Router. Every page is `'use client'`.
- UI components live in `components/ui/` (shadcn/ui style — CVA + Tailwind).
- The design system is CSS-variable-based. All semantic colors (`primary`, `success`, `warning`, `accent`, `destructive`, `muted`) are defined as HSL variables in `app/globals.css` and extended in `tailwind.config.ts`.
- **Tailwind dynamic class warning:** Several pages build class names via string interpolation (e.g. `` `bg-${color}-light` ``). These won't be picked up by Tailwind's static scanner and will be missing in production builds unless safelisted in `tailwind.config.ts`.
- Custom utility classes defined in `globals.css`: `.card-hover`, `.gradient-primary`, `.gradient-accent`, `.glass-effect`, `.text-gradient`.
- The sidebar layout is implemented per-page in `app/page.tsx` (dashboard), not in a shared layout. Other pages (`/models`, `/workflows`, etc.) render without the sidebar — they expect to be embedded or navigated to directly.

## Java Backend Conventions

- Package root: `com.medical.ai`
- All API responses use `Result<T>` wrapper from `common/Result.java`
- Business errors throw `BusinessException` with codes from `common/ErrorCode.java`
- JWT auth: stateless, HS256, configured via `jwt.*` in `application.yml`. The `JwtAuthenticationFilter` runs before every request. Public endpoints are whitelisted in `SecurityConfig`.
- JPA `ddl-auto: validate` — schema must exist before startup. Run `database/init.sql` against PostgreSQL first.
- Database schema: defined in `database/init.sql`
- Required external services: PostgreSQL on 5432, Redis on 6379, RabbitMQ on 5672. The app will fail to start without them.
- `OPENAI_API_KEY` env var required for Spring AI features (defaults to `sk-xxx` placeholder).

## Python Backend Conventions

- Entry point: `backend/python/app/main.py`
- Three routers: `routers/llm.py`, `routers/image_diagnosis.py`, `routers/voice.py`
- All responses use the unified format from `utils/response.py`
- Config in `app/config.py`

## Current State

All frontend pages use hardcoded mock data — no API calls are wired up yet. Most action buttons (edit, delete, pause, configure) have no `onClick` handlers. The monitoring page (`app/monitoring/page.tsx`) is the only page with live-updating state (via `setInterval`).
