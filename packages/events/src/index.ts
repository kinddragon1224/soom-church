export const domainEvents = {
  applicationSubmitted: "application.submitted",
  applicationStatusChanged: "application.status_changed",
} as const;

export type DomainEventName = (typeof domainEvents)[keyof typeof domainEvents];

export interface ApplicationSubmittedEvent {
  name: typeof domainEvents.applicationSubmitted;
  payload: {
    applicationId: string;
    churchId: string | null;
    formId: string;
    occurredAt: string;
  };
}

export interface ApplicationStatusChangedEvent {
  name: typeof domainEvents.applicationStatusChanged;
  payload: {
    applicationId: string;
    churchId: string | null;
    status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
    occurredAt: string;
  };
}
