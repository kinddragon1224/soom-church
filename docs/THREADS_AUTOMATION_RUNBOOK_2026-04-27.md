# Threads Automation Runbook — 2026-04-27

## Purpose

This document is the source of truth for the Threads automation system. Do not rely on chat/session memory.

If a new OpenClaw session needs to understand Threads operations, read this file first.

## Current System

Threads is operated as a strategic editorial automation system, not a simple posting cron.

Daily pipeline:

1. `01:00` — previous day performance report
2. `01:10` — career/job/education research brief
3. `01:25` — strategic editorial brief
4. `01:40` — post queue generation + quality gate autofix
5. `06:40` — preflight safety check
6. `07:00~23:00` — publish every 2 hours

All cron jobs use `flock` to prevent duplicate runs.

## Active Crontab Shape

```cron
CRON_TZ=Asia/Seoul

0 1 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-report.lock npm run threads:report -- $(date -d 'yesterday' +\%F) >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
10 1 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-research.lock npm run threads:research -- $(date +\%F) >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
25 1 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-strategy.lock npm run threads:strategy -- $(date +\%F) >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
40 1 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-plan.lock sh -c 'npm run threads:plan -- $(date +\%F) && npm run threads:quality -- $(date +\%F) --fix' >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
40 6 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-preflight.lock npm run threads:preflight -- $(date +\%F) >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
0 7-23/2 * * * cd /home/kinddragon/.openclaw/workspace/soom-church && /usr/bin/flock -n /tmp/threads-post.lock npm run threads:post >> /home/kinddragon/.openclaw/workspace/soom-church/ops/threads/logs/cron.log 2>&1
```

## Scripts

Package scripts:

- `npm run threads:report -- YYYY-MM-DD`
- `npm run threads:research -- YYYY-MM-DD`
- `npm run threads:strategy -- YYYY-MM-DD`
- `npm run threads:plan -- YYYY-MM-DD`
- `npm run threads:quality -- YYYY-MM-DD --fix`
- `npm run threads:preflight -- YYYY-MM-DD`
- `npm run threads:post -- YYYY-MM-DD HH --dry-run`
- `npm run threads:post`

Script files:

- `scripts/threads-daily-insights.mjs`
- `scripts/threads-research-brief.mjs`
- `scripts/threads-strategy-brief.mjs`
- `scripts/threads-generate-day-plan.mjs`
- `scripts/threads-quality-gate.mjs`
- `scripts/threads-preflight.mjs`
- `scripts/threads-publish-slot.mjs`

## Source Documents

Read in this order:

1. `docs/THREADS_AUTOMATION_RUNBOOK_2026-04-27.md`
2. `docs/THREADS_STRATEGIC_EDITORIAL_SYSTEM_2026-04-27.md`
3. `docs/THREADS_BRAND_SYSTEM_2026-04-27.md`
4. `docs/THREADS_GTM_SYSTEM_2026-04-21.md`

## State Files

- Queue: `ops/threads/queue/YYYY-MM-DD.json`
- Research: `ops/threads/research/YYYY-MM-DD.json|md`
- Strategy: `ops/threads/strategy/YYYY-MM-DD.json|md`
- Quality: `ops/threads/quality/YYYY-MM-DD.json`
- Preflight: `ops/threads/state/preflight/YYYY-MM-DD.json`
- Block file: `ops/threads/state/blocked/YYYY-MM-DD.json`
- Published state: `ops/threads/state/published.json`
- Publish log: `ops/threads/logs/publish.jsonl`
- Cron log: `ops/threads/logs/cron.log`

## Safety Rules

Publishing must not happen unless:

- today's research brief exists
- today's strategy brief exists
- queue has `sourceResearch` and `sourceStrategy`
- brand version is `brand-flow-v1`
- quality report status is `ok`
- preflight report status is `ok`
- no block file exists for the day

If any of these fail, publishing should block.

## Brand Lock

Brand version: `brand-flow-v1`

Core:

> 복잡한 선택을 읽고, 다음 행동 하나로 바꾸는 계정

Position:

> 진로와 일의 막힌 흐름을 읽고, 오늘 할 행동 하나로 번역합니다.

## Recovery Checklist For New Sessions

When asked about Threads automation:

1. `cd /home/kinddragon/.openclaw/workspace/soom-church`
2. Read this runbook.
3. Run `crontab -l` to verify active cron.
4. Check `ops/threads/logs/cron.log` tail.
5. Check today files:
   - `ops/threads/research/$(date +%F).json`
   - `ops/threads/strategy/$(date +%F).json`
   - `ops/threads/queue/$(date +%F).json`
   - `ops/threads/quality/$(date +%F).json`
   - `ops/threads/state/preflight/$(date +%F).json`
6. Do not modify cron without creating a backup in `ops/threads/logs/`.

## Last Verified

2026-04-27 KST

Verified:

- research OK
- strategy OK
- plan OK
- quality OK
- preflight OK
- crontab installed
