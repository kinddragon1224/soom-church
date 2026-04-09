import { ReviewItemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getChatThread(churchId: string, threadKey = "main") {
  return prisma.chatCapture.findMany({
    where: { churchId, threadKey },
    orderBy: { capturedAt: "asc" },
  });
}

export async function getPendingReviewQueue(churchId: string) {
  return prisma.reviewItem.findMany({
    where: {
      churchId,
      status: ReviewItemStatus.PENDING,
    },
    include: {
      extractedUpdate: {
        include: {
          capture: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function formatReviewReason(reason: string) {
  switch (reason) {
    case "AMBIGUOUS_MEMBER_MATCH":
      return "사람 매칭 불확실";
    case "AMBIGUOUS_HOUSEHOLD_MATCH":
      return "가정 매칭 불확실";
    case "RELATIONSHIP_UNCERTAIN":
      return "관계 추론 불확실";
    case "DUPLICATE_CANDIDATE":
      return "중복 후보";
    case "LOW_CONFIDENCE":
      return "낮은 확신";
    case "MISSING_REQUIRED_FIELD":
      return "필수 정보 부족";
    case "CONFLICTING_EXISTING_DATA":
      return "기존 데이터 충돌";
    default:
      return reason;
  }
}

export function formatUpdateType(type: string) {
  switch (type) {
    case "MEMBER_PROFILE":
      return "사람";
    case "HOUSEHOLD_PROFILE":
      return "가정";
    case "RELATIONSHIP":
      return "관계";
    case "PRAYER":
      return "기도";
    case "CARE_RECORD":
      return "기록";
    case "ATTENDANCE":
      return "출석";
    case "CHURCH_EVENT":
      return "이벤트";
    case "FOLLOW_UP":
      return "후속";
    case "STATUS_CHANGE":
      return "상태";
    default:
      return type;
  }
}

export function getEmptyChatMessages() {
  return [
    {
      id: "chat-empty-pastor",
      speakerRole: "PASTOR",
      rawText: "이번 주 목장 근황과 챙겨야 할 사람들을 정리하고 싶어.",
      capturedAt: new Date(),
    },
    {
      id: "chat-empty-assistant",
      speakerRole: "ASSISTANT",
      rawText: "좋아. 그냥 말하듯 적어줘. 사람, 가정, 기도, 심방, 출석, 후속 후보로 나눠서 Review와 다른 탭에 정리할게.",
      capturedAt: new Date(),
    },
  ];
}
