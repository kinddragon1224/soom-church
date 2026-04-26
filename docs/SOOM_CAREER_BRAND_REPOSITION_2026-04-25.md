# SOOM Career Brand Reposition - 2026-04-25

## Decision

SOOM web is no longer the main Mokjang World product page.

SOOM web becomes the user's personal brand and product page for AI-era career consulting.

Mokjang World continues as a separate mobile/product experiment and does not need to be tightly coupled to SOOM web authentication, positioning, or public marketing.

## Naming And Voice

- Assistant/project partner name in this project: Mora.
- Avoid "Lumen" because it is too close to THE RUMEN / 이룸.
- Use consistent polite Korean tone in user-facing copy and assistant responses.

## SOOM Web Positioning

SOOM helps people redesign their career and work in the AI era.

Core strengths to highlight:

- Certified career counselor perspective.
- Planning and product-structuring ability.
- Practical experience using AI tools to build products as a non-developer.
- Ability to turn vague anxiety into a concrete next action, portfolio, service, or product direction.

## Priority

1. Rebuild the public landing page around AI-era career consulting.
2. Update navigation and CTA language to match the new brand direction.
3. Rewrite Contact as a consultation intake page.
4. Rewrite About as the user's personal/brand story.
5. Keep Mokjang World accessible as a Lab/side product, but no longer frame it as the SOOM web's main product.
6. Later, create a Notion or CMS-backed inquiry/work queue if needed.

## Completed In First Pass

- `app/page.tsx` now presents SOOM as an AI-era career design/consulting brand.
- `components/site-header.tsx` navigation now uses career consulting as the primary frame and labels Mokjang World as a Lab.

## Completed In Second Pass

- `app/contact/page.tsx` now works as an AI-era career consultation intake page.
- Replaced church/content-production inquiry copy with career concern categories, current-stage selection, consultation type selection, and Mora-guided FAQ.

## Completed In Third Pass

- `app/about/page.tsx` now introduces SOOM as an AI-era career design consulting brand.
- Replaced church operations/team copy with the user's career counselor, planning, AI-practice positioning.
- Added Mora as the named AI partner for thinking, planning, and execution support.

## Completed In Fourth Pass

- `app/app/mobile/page.tsx` now frames Mokjang World as a separate Lab/mobile product experiment.
- The page no longer redirects unauthenticated visitors immediately; it presents the Lab and routes login users into the prototype.
- Copy now clarifies that Mokjang World is not the main SOOM web product and can evolve independently.

## Completed In Fifth Pass

- `app/pricing/page.tsx` now presents consulting programs instead of content studio/video production packages.
- `app/features/page.tsx` now explains SOOM's career consulting method instead of church workspace features.
- `app/blog/page.tsx` hero and empty state now frame the blog as AI-era career insight content.
- `app/layout.tsx` metadata now uses the AI-era career consulting title, description, keywords, and share image alt text.

## Completed In Sixth Pass

- `app/workspace/layout.tsx` now redirects legacy SaaS workspace routes to the consultation contact page instead of exposing the old workspace demo or sending users into Mokjang World.
- `app/login/page.tsx` and `app/signup/page.tsx` now describe authentication as Mokjang World Lab access, keeping it separate from SOOM's AI-era career consulting brand.
- Checked the updated public web paths for old church/content-studio positioning and informal Korean copy.

## Completed In Seventh Pass

- Removed the unused `components/marketing/*` legacy component island that still contained church/content-studio marketing copy.
- Confirmed no remaining imports reference `components/marketing`, so the old section set cannot accidentally reappear in public routes.

## Completed In Eighth Pass

- `/app` now redirects to `/app/mobile`, making Mokjang World Lab the explicit app entry instead of silently requiring auth or workspace state.
- `/app/onboarding`, `/login`, and `/signup` now use Mokjang World Lab labels and polite copy, not SOOM workspace/SaaS language.
- `components/auth/create-workspace-form.tsx` and `app/api/onboarding/create-church/route.ts` now use Mokjang World naming and polite error messages.
- `components/site-header.tsx` now labels auth entry as `Lab 로그인` so SOOM career consulting does not look like it has a separate SaaS login.

## Completed In Ninth Pass

- Legacy `(admin)` routes now redirect to `/platform-admin`, leaving one protected admin entry instead of two competing admin surfaces.
- `platform-admin` copy now frames the console as Mokjang World Lab operations, not SOOM's public career consulting product or a church SaaS platform.
- Removed `lib/workspace-registry.ts` and simplified `/workspace` to a legacy redirect so the old workspace demo registry cannot re-enter active code.
- Cleaned remaining user-facing admin labels from "workspace/church/subscription" toward "Lab space/member/plan" where the DB model is still shared.

## Completed In Tenth Pass

- `/contact` now uses a real client-side consultation intake form with selected concern, stage, consultation type, contact details, message, reference link, and preferred schedule.
- Added `POST /api/contact/consultation` to validate intake payloads and append received inquiries as JSONL records under `ops/contact-inquiries/`.
- Added a honeypot field and ignored `ops/contact-inquiries/` in git so private inquiry records are not committed.
- The contact page now behaves like a first MVP funnel instead of a static mock form.

## Completed In Eleventh Pass

- Added `/platform-admin/inquiries` as a protected admin inbox for SOOM career consultation inquiries.
- The admin inbox reads private JSONL records from `ops/contact-inquiries/`, shows latest inquiry, recent inquiry cards, contact details, selected concern/stage/program, and preferred schedule.
- Added a platform-admin navigation link and overview card for `상담 신청` so the funnel has an operational follow-up surface.

## Completed In Twelfth Pass

- Rewrote the main SOOM web copy to sound less like a product brochure and more like a real career consultation conversation.
- Updated `app/page.tsx`, `app/about/page.tsx`, `app/features/page.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`, and the consultation form copy.
- The copy now emphasizes uncertainty, lived experience, not over-selling AI fear, and leaving the user with a concrete next action.
