import { NextRequest, NextResponse } from "next/server";

export interface ClassifiedItem {
  index: number;
  text: string;
  requiresAction: boolean;
  actionSummary: string | null;
}

const ACTION_KEYWORDS = [
  "제출", "제출해", "제출하",
  "서명", "동의서",
  "납부", "결제", "입금", "비용",
  "준비물", "챙겨", "가져",
  "신청", "등록",
  "방문",
  "확인해", "회신", "연락",
  "까지", // 데드라인 표현과 함께 쓰임
  "보내", "보내주",
];

const ACTION_PATTERNS = [
  /\d+월\s*\d+일까지/,   // "4월 20일까지"
  /\d+일까지/,           // "20일까지"
  /이번\s*주까지/,
  /다음\s*주까지/,
  /오늘까지/,
  /내일까지/,
];

function classifyItem(text: string): { requiresAction: boolean; actionSummary: string | null } {
  const hasKeyword = ACTION_KEYWORDS.some((kw) => text.includes(kw));
  const hasPattern = ACTION_PATTERNS.some((re) => re.test(text));

  if (!hasKeyword && !hasPattern) {
    return { requiresAction: false, actionSummary: null };
  }

  // 행동 요약 생성
  let summary: string | null = null;

  if (text.includes("제출") || text.includes("동의서") || text.includes("서명")) {
    summary = "서류 제출 필요";
  } else if (text.includes("납부") || text.includes("결제") || text.includes("입금") || text.includes("비용")) {
    summary = "비용 납부 필요";
  } else if (text.includes("준비물") || text.includes("챙겨") || text.includes("가져")) {
    summary = "준비물 챙기기";
  } else if (text.includes("신청") || text.includes("등록")) {
    summary = "신청·등록 필요";
  } else if (text.includes("방문")) {
    summary = "어린이집 방문 필요";
  } else if (text.includes("보내") || text.includes("회신") || text.includes("연락")) {
    summary = "회신·전달 필요";
  } else if (hasPattern) {
    summary = "기한 내 확인 필요";
  } else {
    summary = "확인 필요";
  }

  return { requiresAction: true, actionSummary: summary };
}

export async function POST(req: NextRequest) {
  const { items }: { items: string[] } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ classified: [] });
  }

  const classified: ClassifiedItem[] = items.map((text, index) => {
    const { requiresAction, actionSummary } = classifyItem(text);
    return { index, text, requiresAction, actionSummary };
  });

  return NextResponse.json({ classified });
}
