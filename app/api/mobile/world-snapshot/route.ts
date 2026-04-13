import { NextResponse } from "next/server";

const worldObjects = [
  { id: "hub", name: "목양 관리", kind: "hub", state: "핵심 진입", note: "사람/기도/후속 흐름으로 들어간다.", x: 148, y: 60, icon: "⛪" },
  { id: "h1", name: "은혜 가정", kind: "house", state: "기도 2", note: "이번 주 중보 요청이 올라옴.", x: 28, y: 180, icon: "🏠" },
  { id: "h2", name: "소망 가정", kind: "house", state: "안정", note: "정착 흐름 유지 중.", x: 246, y: 190, icon: "🏠" },
  { id: "h3", name: "기쁨 가정", kind: "house", state: "후속 1", note: "초신자 후속 필요.", x: 64, y: 368, icon: "🏠" },
  { id: "h4", name: "평안 가정", kind: "house", state: "돌봄", note: "심방 일정 조정 필요.", x: 232, y: 382, icon: "🏠" },
  { id: "p1", name: "김요한", kind: "person", state: "✨ 기도", note: "기도제목 업데이트됨.", x: 132, y: 266, icon: "🙂" },
  { id: "p2", name: "박마리아", kind: "person", state: "💧 돌봄", note: "상담 후속 필요.", x: 212, y: 292, icon: "🙂" },
  { id: "p3", name: "이다니엘", kind: "person", state: "✉️ 후속", note: "연락 필요 3일 경과.", x: 162, y: 448, icon: "🙂" },
] as const;

const peopleRecords = [
  { id: "p1", name: "김요한", household: "은혜 가정", state: "✨ 기도", nextAction: "수요일 기도제목 후속" },
  { id: "p2", name: "박마리아", household: "평안 가정", state: "💧 돌봄", nextAction: "목요일 상담 체크인" },
  { id: "p3", name: "이다니엘", household: "기쁨 가정", state: "✉️ 후속", nextAction: "오늘 저녁 연락" },
] as const;

const taskRecords = [
  { id: "t1", title: "심방 대상 2명 확인", due: "오늘", owner: "목양 관리" },
  { id: "t2", title: "기도요청 업데이트 반영", due: "오늘", owner: "김요한" },
  { id: "t3", title: "주중 모임 공지 보내기", due: "내일 오전", owner: "박마리아" },
] as const;

const chatQuickActions = [
  "이번 주 심방 필요한 사람 보여줘",
  "기도 요청 새로 들어온 것 정리해줘",
  "오늘 해야 할 후속 3개만 뽑아줘",
] as const;

export async function GET() {
  return NextResponse.json({
    worldObjects,
    peopleRecords,
    taskRecords,
    chatQuickActions,
  });
}
