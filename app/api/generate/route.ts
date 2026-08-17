import OpenAI from "openai";
import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SIZE_MAP = {
  "4:3 가로": { apiSize: "1536x1024", width: 1024, height: 768 },
  "3:4 세로": { apiSize: "1024x1536", width: 768, height: 1024 },
  "1:1 정사각": { apiSize: "1024x1024", width: 1024, height: 1024 },
} as const;

type AspectRatio = keyof typeof SIZE_MAP;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았어. .env.local을 확인해줘." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const aspectRatio: AspectRatio = body.aspectRatio in SIZE_MAP ? body.aspectRatio : "4:3 가로";

    if (!prompt) {
      return NextResponse.json({ error: "프롬프트가 비어 있어." }, { status: 400 });
    }

    if (prompt.length > 8000) {
      return NextResponse.json({ error: "프롬프트가 너무 길어. 8,000자 이하로 줄여줘." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const target = SIZE_MAP[aspectRatio];

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: target.apiSize,
      quality: "medium",
      output_format: "png",
    });

    const base64 = result.data?.[0]?.b64_json;
    if (!base64) {
      return NextResponse.json({ error: "이미지 데이터가 반환되지 않았어." }, { status: 502 });
    }

    const source = Buffer.from(base64, "base64");
    const output = await sharp(source)
      .resize(target.width, target.height, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();

    return NextResponse.json({
      image: `data:image/png;base64,${output.toString("base64")}`,
      width: target.width,
      height: target.height,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "이미지 생성 중 오류가 발생했어.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
