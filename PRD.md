# Soom Church PRD

- Document status: Draft
- Version: v1.0
- Last updated: 2026-03-12
- Scope: Current project MVP and near-term product direction

## 1. Product Summary

Soom Church is a church operations platform focused on member administration, follow-up workflows, and workspace-based church management for Korean churches.

The current MVP is centered on an admin dashboard experience. It prioritizes practical church office work such as member management, district/group assignment, application processing, notice publishing, and operational visibility through dashboard metrics.

The broader product direction includes content, notification, AI, and community modules, but those are mostly future-facing or in skeleton form in the current codebase.

## 2. Background and Problem

Many churches manage member records, follow-up care, notices, and ministry applications across spreadsheets, messaging tools, paper forms, and manual coordination.

This creates recurring problems:

- Member information is fragmented and hard to keep current.
- Newcomer follow-up lacks a clear status flow.
- District and group assignment is tracked inconsistently.
- Applications and ministry requests are submitted, but processing is not centralized.
- Operational leaders do not have a single dashboard showing what needs attention now.

Soom Church solves this by providing one operational hub where church administrators can manage records, workflows, and high-priority actions in a single product.

## 3. Product Vision

Build a modular church platform that starts with the administrative operating core, then expands into content, notifications, AI-assisted ministry workflows, and community features.

## 4. Goals

### MVP Goals

- Provide a reliable admin dashboard for day-to-day church office operations.
- Centralize member records and related administrative entities.
- Make follow-up status visible and actionable.
- Support district and group assignment as part of ongoing member care.
- Provide a basic application workflow for intake and status management.
- Enable notice publishing and recent activity review.
- Establish the first production-ready boundary for a multi-tenant church SaaS platform.

### Business Goals

- Validate that churches will adopt a church-specific operating hub instead of ad hoc tools.
- Create a product foundation that can expand into paid SaaS subscriptions.
- Reduce future product risk by separating domains gradually through a service-oriented architecture.

## 5. Non-Goals

The following are explicitly not part of the current MVP commitment:

- Full real-time community or chat experience
- Complete sermon/content production workflows
- Advanced AI orchestration across ministry use cases
- Automated omnichannel notification operations
- Full workflow automation across every church department
- Public-facing member self-service portal

These remain future modules or follow-on phases.

## 6. Target Users

### Primary Users

- Church administrators
- Pastoral staff
- Ministry coordinators
- Office managers

### Secondary Users

- Platform administrators managing multiple churches

## 7. Core User Problems to Solve

1. "I need to see the current operational state of the church at a glance."
2. "I need to register, edit, and find member information quickly."
3. "I need to know which members need follow-up right now."
4. "I need to manage district and small-group assignment consistently."
5. "I need one place to review and process submitted applications."
6. "I need to publish notices and keep the organization aligned."
7. "I need church data isolated by workspace and tenant."

## 8. Product Principles

- Dashboard first: the first screen should help staff act, not browse.
- Follow-up centric: member care status should be visible and operationally useful.
- Practical over ornamental: optimize for church office workflows, not generic SaaS complexity.
- Modular expansion: new modules should attach to a stable operational core.
- Tenant-safe by default: core data should be scoped to a church workspace.

## 9. Scope

### In Scope for the Current MVP

- Authentication and login
- Admin dashboard home
- Member list, detail, create, and edit
- District and group management
- Application form and application management
- Notice management
- Activity log visibility
- Platform admin basics for church and subscription management
- Foundational multi-tenant workspace support

### Near-Term Platform Scope

- Content service foundation
- Notification service foundation
- AI service foundation
- Community service foundation

These exist in the repository directionally, but they are not yet core MVP deliverables.

## 10. User Experience Overview

### Primary Journey A: Daily Admin Operations

1. User logs in.
2. User lands on the dashboard.
3. User reviews KPIs, recent items, and urgent follow-up signals.
4. User navigates to members, applications, notices, or settings.
5. User completes operational tasks and returns to dashboard context.

### Primary Journey B: Member Lifecycle Management

1. Admin creates or opens a member record.
2. Admin updates personal information, household, district, and group data.
3. Admin reviews status tags such as newcomer or follow-up needed.
4. Admin records changes and uses the member record as the source of truth.

### Primary Journey C: Application Processing

1. Admin views submitted applications.
2. Admin checks application details and current status.
3. Admin updates status based on review progress.
4. Admin monitors remaining unprocessed items through dashboard summaries.

## 11. Functional Requirements

### 11.1 Authentication and Access

- Users must be able to log in and log out.
- Authenticated sessions must gate access to admin functionality.
- Platform admin routes must remain separate from church workspace routes.

### 11.2 Dashboard

The dashboard must provide at least the following:

- Total member count
- New registrations for the current month
- Count of unprocessed applications
- Count of members needing follow-up
- Distribution by district
- Recently registered members
- Recent applications
- Recent notices
- Quick actions for common workflows

### 11.3 Member Management

Admins must be able to:

- View a paginated or browsable member list
- Open a member detail page
- Create a new member
- Edit an existing member
- Soft-delete or otherwise preserve historical integrity where applicable

Member records should support at least:

- Name
- Gender
- Date of birth
- Phone number
- Email
- Address
- Household association
- District
- Group
- Registration date
- Role or church duty
- Status tags
- Notes

### 11.4 Follow-Up Status Tracking

The system must support operational status labels for member care, including examples such as:

- Registration pending
- Newcomer
- Settling
- Group assigned
- Service placement connected
- Dormant
- Visit needed

The product should make these statuses visible in member views and actionable from the dashboard context.

### 11.5 District and Group Management

Admins must be able to:

- View district and group structures
- Associate members to districts and groups
- Update assignments as church organization changes

### 11.6 Application Management

The product must support:

- Listing application forms
- Creating application forms
- Receiving application submissions
- Listing submitted applications
- Viewing summary metrics
- Updating application status

### 11.7 Notice Management

Admins must be able to:

- View notices
- Create and manage notices
- Surface recent notices on the dashboard

### 11.8 Activity Logs and Reporting

The product should expose recent activity history so admins can review operational changes and events.

### 11.9 Multi-Tenant Foundations

The system must:

- Represent churches as separate workspaces or tenants
- Scope core operational data by church
- Support church membership relationships for users
- Provide an initial subscription model foundation

## 12. Service and System Boundaries

The current repository is in a transitional architecture phase.

- `core-service` is the main product shell and contains most active end-user functionality.
- `application-service` is the first domain moving toward independent service ownership.
- `content-service`, `notification-service`, `ai-service`, and `community-service` are currently planned modules with limited or skeletal implementation.

This PRD treats the current product reality as:

- Product MVP: admin operating hub
- Product expansion path: modular church platform

## 13. Success Metrics

Initial success should be evaluated using practical operational metrics:

- Weekly active admin users per church
- Number of members managed in system
- Percentage of new members with assigned follow-up status
- Time to process incoming applications
- Number of notices published through the platform
- Reduction in off-platform spreadsheet/manual tracking for core workflows

## 14. Release Criteria for MVP

The MVP is considered acceptable when:

- Admin users can authenticate reliably.
- Core dashboard data loads without blocking errors.
- Member CRUD flows work end to end.
- District and group assignment flows are usable.
- Application list and status update flows work end to end.
- Notice management is usable in the admin UI.
- Church-scoped data boundaries are functioning for supported entities.

## 15. Risks and Constraints

- The codebase is in a staged migration from a monolith to a service-oriented architecture.
- Some domain boundaries are not fully separated yet.
- Application data currently reflects an intermediate migration state between `core-service` and `application-service`.
- Several future modules are represented in infrastructure and repository structure before product completeness exists.
- Product scope must remain disciplined so the MVP does not collapse under too many parallel module ambitions.

## 16. Open Questions

- What are the minimum role and permission levels required beyond current admin assumptions?
- Which dashboard metrics matter most to real church operators during pilots?
- Should applications remain a generic engine or be narrowed to specific church workflows first?
- What subscription packaging will separate core admin features from future premium modules?
- At what point should member-facing or public-facing experiences be introduced?

## 17. Future Phases

### Phase 2

- Deeper application workflow capabilities
- Stronger reporting and operational analytics
- Expanded tenant and subscription controls

### Phase 3

- Content workflows for sermons, summaries, shorts, and TTS
- Notification orchestration across email, SMS, and push
- AI-assisted ministry operations

### Phase 4

- Community features such as groups, feeds, and chat
- More connected member engagement experiences

## 18. Source Basis

This PRD is derived from the current repository state and the following project documents as of 2026-03-12:

- `services/core-service/docs/PRODUCT_SPEC.md`
- `PROJECT_WORKING_DOC.md`
- `README.md`
- `ARCHITECTURE.md`
- `services/core-service/README.md`
