import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

/**
 * 문의 폼 제출 시 Notion DB에 저장
 * DB 속성: 이름(title), 이메일(email), 문의사항(rich_text)
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return NextResponse.json(
      { error: "서버 설정이 누락되었습니다." },
      { status: 500 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email) {
    return NextResponse.json(
      { error: "이름과 이메일을 입력해 주세요." },
      { status: 400 }
    );
  }

  const properties: Record<string, unknown> = {
    이름: {
      title: [{ text: { content: name } }],
    },
    이메일: {
      email,
    },
  };
  if (message) {
    properties.문의사항 = {
      rich_text: [{ text: { content: message } }],
    };
  }

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Notion API error:", res.status, err);
      return NextResponse.json(
        { error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Inquiry API error:", e);
    return NextResponse.json(
      { error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
