# Draft PR: Phase 1 monolith to workspace/service split

## Summary

- move the former root Next.js app into `services/core-service`
- introduce npm workspaces for `packages/*` and `services/*`
- extract the first domain service as `services/application-service`
- add shared packages for contracts, service calls, events, and shared utilities
- add gateway and local compose scaffolding for service-oriented development
- add architecture and working docs for the staged migration

## What is implemented

- `core-service` now owns the main admin UI, auth routes, workspace context, and most product logic
- `application-service` exposes application domain endpoints:
  - `GET /health`
  - `GET /forms`
  - `POST /forms`
  - `GET /applications`
  - `GET /applications/summary`
  - `POST /applications`
  - `PATCH /applications/:id/status`
- `core-service` application pages call `application-service` first for read/update paths
- local gateway, Postgres, and Redis wiring is defined in compose

## Current architecture state

- this is not a completed microservice architecture
- this is a staged strangler-pattern migration
- most business logic still lives in `services/core-service`
- only the application domain has been partially extracted
- `content-service`, `notification-service`, `ai-service`, and `community-service` are still skeletons

## Known issues

- root `npm run typecheck` currently fails in `services/core-service`
- root `npm run build` currently fails because `services/content-service` has no source files yet
- `docker-compose.yml` includes skeleton services that are not fully runnable
- application data still exists in both `core-service` and `application-service` Prisma schemas
- `core-service` still contains local Prisma fallback logic for application flows

## Reviewer focus

- validate the workspace/service split direction
- validate whether `application-service` is the right first extraction boundary
- review the next-step order for removing fallback paths and finalizing data ownership
- call out anything in the compose/gateway setup that should be simplified for this intermediate phase

## Suggested next steps

1. remove direct application-domain Prisma access from `core-service`
2. define service-to-service auth and church/user context propagation
3. decide and implement the application data migration strategy
4. make compose/build behavior safe for skeleton services
5. choose the next real extraction target after `application-service`

## Validation notes

- `services/application-service` builds
- `services/core-service` production build completes
- full workspace validation is not green yet because this branch represents an in-progress migration state
