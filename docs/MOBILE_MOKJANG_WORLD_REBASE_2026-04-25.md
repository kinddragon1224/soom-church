# Mobile Mokjang World Rebase - 2026-04-25

## 1. Decision

SOOM's product center is no longer the broad web workspace.

The product center is:

**An AI-agent-powered mobile shepherding world for mokjang leaders.**

The web remains useful, but it is no longer the main product experience. It should support the mobile app through authentication, admin operations, data APIs, and public product pages.

## 2. Product Thesis

Mokjang leaders do not need another wide admin dashboard.

They need a small, living command center that helps them answer:

- Who needs care today?
- What changed since I last opened the app?
- Who needs prayer, follow-up, attendance check, or a visit?
- What should I do next?
- Can the AI agent organize this without making me manage another tool?

The mobile world should feel like a calm pastoral game, but the purpose is not entertainment. The purpose is sustained care.

The game-like layer is not a secondary cosmetic idea. It is one of the main differentiators of the product.

The leader should feel that their mokjang is not a document archive, but a living home they return to.

## 3. What We Are Building

The MVP is a vertical mobile app where a mokjang leader enters a small world representing their community.

The world contains:

- A visual village/world surface
- People and households as care subjects
- Mora, the AI operating agent
- Daily/weekly care briefs
- Follow-up tasks
- Attendance and prayer state
- Lightweight progression for care consistency
- Collectible/helper NPC characters
- Customizable mokjang world home elements

The app should feel game-like in feedback and presence, but operational in outcome.

## 4. What We Are Not Building For MVP

Do not optimize the MVP around:

- A full church-wide SaaS workspace
- Complex ministry department management
- Advanced dashboards
- Multi-role admin workflows
- Full calendar/productivity-suite parity
- Content studio workflows
- Broad web-first CRM screens
- Heavy automation rule builders
- A game that distracts from shepherding work

These can return later if the mobile core proves valuable.

## 5. MVP Promise

The first valuable version should deliver this promise:

**When a mokjang leader opens the app, Mora tells them what changed, who needs care, and what to do next. The leader can confirm or command actions in a few taps.**

If a feature does not strengthen that promise, it is probably not MVP.

## 6. Core Loop

1. The leader opens the app.
2. Jesus NPC summarizes today's mokjang state.
3. The app shows three daily shepherding quests.
4. The leader records real shepherding actions.
5. The leader earns XP, seeds, lamps, badges, or unlocks.
6. The mokjang garden changes.
7. The sheep character reacts.
8. The next action becomes clear.

This is the product loop. Everything else is supporting structure.

## 7. MVP Screens

### 7.1 World

Role:
- First screen and emotional anchor
- Shows the mokjang as a living place
- Surfaces care urgency without becoming a data dashboard

Must include:
- World visual
- Today's Mora brief
- People/household state hints
- Immediate action prompts
- Recent care result

### 7.2 Mora Command

Role:
- Primary operation interface
- Not a general chat room
- A command surface for recording and planning care

Must support:
- "Add this prayer request"
- "Who needs follow-up today?"
- "Mark attendance"
- "Create a visit task"
- "Summarize this week's care"

### 7.3 People

Role:
- Practical list for finding and updating members

Must include:
- Member list
- Household/group relation
- Care status
- Last contact or last update
- Next action

### 7.4 Attendance

Role:
- Weekly rhythm input

Must include:
- Simple present/absent/unknown flow
- Absence reason or follow-up need
- Attendance-based care suggestions

### 7.5 Tasks

Role:
- Execution queue

Must include:
- Today/this week tasks
- Owner
- Due label
- Completion
- Link back to person/household when possible

## 8. Data Model Focus

For MVP, use only the data needed to power the loop:

- Church
- User
- ChurchMembership
- Member
- Household
- Group
- MemberCareRecord
- ActivityLog
- Runtime task state

Avoid creating new models until the current Prisma schema cannot express the MVP behavior.

## 9. AI Scope For The Rebuild

The original ambition was to place an OpenClaw/OpenAI Codex-style agent directly inside Mokjang World.

That is no longer MVP.

The near-term rebuild should assume:

- No embedded OpenClaw agent inside the mobile app.
- No OAuth-dependent agent runtime as a required user flow.
- No agent bottleneck blocking core product usability.
- No AI feature that makes the app unusable when the model/API path fails.

The product should first work as a useful shepherding app without AI.

Mora can remain as a product character and interaction metaphor, but in MVP she can be implemented as deterministic guidance, templates, briefs, command shortcuts, and local/server-side rule logic.

AI can return later after the care loop is already useful.

## 10. Non-AI MVP Scope

Without AI, the app should still help a leader:

- See who needs attention.
- Track attendance.
- Record prayer and care notes.
- Create follow-up tasks.
- Review today's and this week's care queue.
- Keep households and members organized.
- Re-enter the app and understand what changed.

This means the MVP can be valuable with structured data, careful defaults, and good interaction design before true agent behavior exists.

## 11. Future AI Agent Scope

When AI returns, Mora should be narrow, practical, and reliable.

Future Mora can:
- Summarize care state
- Detect likely intent from commands
- Suggest follow-up tasks
- Convert natural language notes into structured care records
- Build a daily or weekly brief
- Explain what changed since the last session

Future Mora should not:
- Autonomously contact people
- Make sensitive pastoral judgments alone
- Create large workflow systems
- Generate broad product plans inside the app
- Replace the leader's final confirmation

## 12. Game-Like System Scope

The app may use game language carefully, but care ethics come first.

Allowed:
- World progression
- Care streaks for consistency
- Warm visual feedback
- Unlocking helper NPCs or village improvements
- Community health indicators
- Decorating the mokjang world home screen
- Earning NPC helper characters through healthy care rhythms
- Unlocking environmental objects such as lamps, paths, trees, benches, rooms, signs, gathering spots, or seasonal details
- Giving each leader a sense that "this is our mokjang's place"

Avoid:
- Ranking people
- Scoring members by worth
- Competitive leaderboards
- Shame-based absence signals
- Rare/level language applied to people
- Monetization-style gacha mechanics
- Random rewards tied to sensitive care events

The game layer should reward faithful attention, not turn people into objectives.

### 12.1 World Home Customization

The mokjang world home screen should become a place the leader can gradually shape.

Customization can include:

- Background mood or season
- Meeting place objects
- Prayer corner objects
- Household markers
- Welcome table or notice board
- NPC placement
- Small care-memory objects unlocked by completed rhythms

Customization should not require complex building tools in MVP. It can start with simple unlocks and placement presets.

### 12.2 NPC Collection

NPCs are not just decoration. They should represent care functions, guidance, and emotional companionship.

MVP-friendly NPC roles:

- Mora: guide and command helper
- Prayer helper: surfaces prayer requests
- Attendance helper: supports weekly attendance rhythm
- Follow-up helper: tracks people needing contact
- Welcome helper: supports new member onboarding

NPC unlocks should be tied to non-sensitive product milestones:

- First mokjang setup completed
- First attendance week recorded
- First follow-up task completed
- First prayer note recorded
- Seven-day return rhythm

Avoid tying unlocks to someone's absence, illness, crisis, or private hardship.

### 12.3 Progression Principle

Progression should say:

**Your mokjang is becoming more cared for.**

It should not say:

**Your members are becoming more valuable because you managed them.**

### 12.4 MVP Growth System

First MVP characters:

- Jesus NPC
- Basic shepherd character
- Sheep character

First MVP growth tracks:

- Shepherd level
- Mokjang garden level
- Sheep affinity

First MVP quest structure:

- Three daily shepherding quests
- Three weekly shepherding quests

Example daily quests:

- Pray for one member.
- Record a check-in with one member.
- Mark attendance from the last mokjang meeting.
- Add one line from a sharing note.
- Confirm prayer requests for the next meeting.

First MVP rewards:

- XP
- Seeds
- Lamps
- Badges

Reward expansion candidates:

- Mokjang XP
- Sheep affinity
- Garden growth points
- Lamp fragments
- Seeds
- Badges
- Character expression/pose unlocks
- Background decoration unlocks

Shepherd level labels:

- Level 1: Beginner Shepherd
- Level 2: Care Shepherd
- Level 3: Prayer Shepherd
- Level 4: Word Shepherd
- Level 5: Faithful Shepherd

Shepherd visual progression:

- Level 1: Small staff, basic bag
- Level 2: Prayer notebook added to bag
- Level 3: Lamp ornament added
- Level 4: Scroll added
- Level 5: Shepherd cloak or shining badge added

The first implementation can be deterministic and local. It does not need AI.

Implementation note:

- Daily quest completion and rewards are stored locally per church/account.
- Current storage module: `apps/mobile-app/lib/world-growth-store.ts`
- Current growth config: `apps/mobile-app/lib/world-growth-config.ts`
- Current growth summary calculator: `apps/mobile-app/lib/world-growth-summary.ts`
- Current home screen integration: `apps/mobile-app/app/(tabs)/world.tsx`
- The first loop is tap-to-complete, then later each quest should open the relevant record flow before completion.

## 13. Web Role After Rebase

Keep web focused on:

- Public homepage
- Login/signup
- Mobile return bridge
- Platform admin
- Backend API routes for mobile
- Emergency data inspection

Stop expanding:

- Web workspace as the primary product
- Broad dashboard UX
- Old graph/workspace experiments
- Web-only mokjang workflows unless they directly support mobile

## 14. Web Cleanup Classification

The existing web app contains several generations of product direction. Cleanup should happen in stages so the build does not break and useful backend support is preserved.

### Keep

- Public pages that can become Mokjang World introduction pages:
  - `app/page.tsx`
  - `app/about/page.tsx`
  - `app/contact/page.tsx`
  - `app/login/page.tsx`
  - `app/signup/page.tsx`
  - `app/app/mobile/page.tsx`
  - `app/app/mobile/return/page.tsx`
- Mobile backend API routes:
  - `app/api/mobile/world-snapshot/route.ts`
  - `app/api/mobile/runtime-tasks/route.ts`
  - `app/api/mobile/member-upsert/route.ts`
  - `app/api/mobile/chat-config/route.ts`
- Auth and onboarding support:
  - `app/api/auth/[...nextauth]/route.ts`
  - `app/api/login/route.ts`
  - `app/api/logout/route.ts`
  - `app/api/signup/route.ts`
  - `app/api/onboarding/create-church/route.ts`
- Platform admin only if it remains internal:
  - `app/platform-admin/*`

### Freeze Or Redirect

These should not receive new product work. They can redirect to `/app/mobile`, `/login`, or the new marketing page while the mobile app becomes the source of truth.

- `app/app/[churchSlug]/*`
- `app/app/beta/*`
- `app/workspace/*`
- `app/(admin)/*`

### Candidate For Removal

Remove after confirming no imports or runtime links depend on them:

- Old graph/workspace components
- GIDO-specific web workspace helpers
- Web-only mokjang pilot screens
- Blog/content-studio modules if the web is reduced to product introduction only
- OpenClaw bridge routes if they remain unused by the non-AI MVP
- Threads/social automation scripts and pages unless they are part of a separate operations workflow

### Cleanup Rule

Do not delete large web sections in one pass.

First:
- Redirect public routes away from stale web product surfaces.
- Keep APIs that mobile needs.
- Keep platform admin isolated.
- Run build/typecheck.
- Then remove unreachable components and libraries in smaller batches.

## 15. Current Code Mapping

Mobile app:
- `apps/mobile-app/app/index.tsx`
- `apps/mobile-app/app/world-setup.tsx`
- `apps/mobile-app/app/(tabs)/world.tsx`
- `apps/mobile-app/app/(tabs)/people.tsx`
- `apps/mobile-app/app/(tabs)/attendance.tsx`
- `apps/mobile-app/app/(tabs)/tasks.tsx`
- `apps/mobile-app/app/(tabs)/chat.tsx`

Mobile data sources:
- `apps/mobile-app/lib/world-store.tsx`
- `apps/mobile-app/lib/world-data-source.ts`
- `apps/mobile-app/lib/runtime-task-source.ts`
- `apps/mobile-app/lib/chat-source.ts`
- `apps/mobile-app/lib/auth-bridge.ts`

Web/API support:
- `app/api/mobile/world-snapshot/route.ts`
- `app/api/mobile/chat-command/route.ts`
- `app/api/mobile/runtime-tasks/route.ts`
- `app/api/mobile/member-upsert/route.ts`
- `app/api/mobile/chat-config/route.ts`
- `lib/mobile-world-orchestrator.ts`

Note: `chat-command`, `openclaw-bridge`, `agent-growth`, and `mobile-world-orchestrator` should be treated as optional/future AI infrastructure during the non-AI rebuild.

## 16. Refactor Priorities

### P0 - Stabilize the Mobile Core

- Make `world.tsx` smaller by extracting world layers, NPCs, Mora brief, and command panel.
- Make fallback, cached, and remote data states visible in code.
- Keep the app usable when the API fails.
- Type the world snapshot contract in one shared place if practical.

### P1 - Make The Non-AI Care Loop Useful

- Replace AI-dependent flows with deterministic commands, presets, and forms.
- Make attendance, care notes, follow-up tasks, and people status work without a model.
- Make first-session setup create a usable empty mokjang.
- Make the mobile app clearly show offline/fallback/empty states.

### P2 - Make Mora Useful Later

- Define a small command vocabulary.
- Improve command results so every response produces either a record, task, brief, or explicit "needs confirmation".
- Keep diagnostics out of the user-facing interface.

### P3 - Make People Data Real

- Ensure people, households, care records, attendance, and tasks flow from the same source.
- Reduce duplicate local placeholder records.
- Add a clear empty state for a brand-new mokjang.

### P4 - Improve the World Layer

- Keep the visual world emotionally strong, but make it serve care signals.
- NPCs should be helpers or guides, not decorative clutter.
- Progression should reflect consistent care actions.

## 17. Product Test

Before adding a feature, ask:

1. Does this help the leader know who needs care?
2. Does this reduce typing, remembering, or searching?
3. Does this make Mora more trustworthy?
4. Does this improve the core loop?
5. Would this still matter if the web workspace disappeared?

If the answer to 5 is no, it is probably not central to the mobile MVP.

## 18. Next Build Sequence

1. Document and freeze the new mobile-first product definition.
2. Freeze or redirect stale web routes so the web no longer looks like the product body.
3. Refactor `world.tsx` into smaller components without changing behavior.
4. Define the world snapshot contract and empty-state behavior.
5. Replace AI-blocked flows with deterministic care actions.
6. Make the first-session setup create a usable mokjang state.
7. Verify the app on Expo after each meaningful UI change.
