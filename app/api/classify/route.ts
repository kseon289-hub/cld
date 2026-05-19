import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export interface ClassifiedItem {
  index: number;
  text: string;
  requiresAction: boolean;
  actionSummary: string | null;
}

export async function POST(req: NextRequest) {
  const { items }: { items: string[] } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ classified: [] });
  }

  const itemList = items
    .map((item, i) => `[${i}] ${item}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: `당신은 어린이집 가정통신문 도우미입니다.
각 항목을 분석하여 부모님의 행동이 필요한지 판단해주세요.

부모님의 행동이 필요한 경우 (requiresAction: true):
- 서류 제출, 동의서 서명, 비용 납부
- 특정 날짜까지 확인/응답 필요
- 준비물 챙기기, 물건 가져오기
- 이벤트 참여 신청
- 어린이집 방문 필요

단순 공지사항인 경우 (requiresAction: false):
- 행사 일정 안내
- 날씨·계절 관련 안내
- 교육 활동 소개
- 일반적인 공지

반드시 다음 JSON 형식으로만 응답하세요 (추가 텍스트 없이):
[{"index": 0, "requiresAction": true, "actionSummary": "구체적인 행동 요약"}, ...]`,
    messages: [
      {
        role: "user",
        content: `다음 가정통신문 항목들을 분류해주세요:\n\n${itemList}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json(
      { error: "분류 실패" },
      { status: 500 }
    );
  }

  const parsed: Array<{
    index: number;
    requiresAction: boolean;
    actionSummary: string | null;
  }> = JSON.parse(textBlock.text.trim());

  const classified: ClassifiedItem[] = parsed.map((r) => ({
    index: r.index,
    text: items[r.index],
    requiresAction: r.requiresAction,
    actionSummary: r.actionSummary ?? null,
  }));

  return NextResponse.json({ classified });
}
