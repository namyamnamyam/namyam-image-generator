import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SIZE_MAP = {
  "4:3 가로": { width: 1024, height: 768 },
  "3:4 세로": { width: 768, height: 1024 },
  "1:1 정사각": { width: 1024, height: 1024 },
} as const;

type AspectRatio = keyof typeof SIZE_MAP;

const MODEL = "@cf/bytedance/stable-diffusion-xl-lightning";

export async function POST(request: Request) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        {
          error:
            "Cloudflare 설정이 없어. CLOUDFLARE_ACCOUNT_ID와 CLOUDFLARE_API_TOKEN을 환경변수에 넣어줘.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const aspectRatio: AspectRatio = body.aspectRatio in SIZE_MAP ? body.aspectRatio : "4:3 가로";

    if (!prompt) {
      return NextResponse.json({ error: "프롬프트가 비어 있어." }, { status: 400 });
    }

    if (prompt.length > 6000) {
      return NextResponse.json(
        { error: "프롬프트가 너무 길어. 6,000자 이하로 줄여줘." },
        { status: 400 },
      );
    }

    const target = SIZE_MAP[aspectRatio];
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          negative_prompt:
            "low quality, lowres, blurry, bad anatomy, malformed hands, extra fingers, extra limbs, deformed face, text, logo, watermark",
          width: target.width,
          height: target.height,
          num_steps: 20,
          guidance: 7.5,
        }),
      },
    );

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let detail = `Cloudflare Workers AI 요청 실패 (${response.status})`;
      if (contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        const apiMessage =
          errorData?.errors?.[0]?.message || errorData?.messages?.[0]?.message || errorData?.error;
        if (apiMessage) detail = String(apiMessage);
      } else {
        const text = await response.text().catch(() => "");
        if (text) detail = text.slice(0, 500);
      }
      return NextResponse.json({ error: detail }, { status: response.status });
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      const base64 = data?.result?.image ?? data?.image;
      if (!base64) {
        return NextResponse.json(
          { error: "Cloudflare에서 이미지 데이터가 반환되지 않았어." },
          { status: 502 },
        );
      }

      return NextResponse.json({
        image: `data:image/png;base64,${base64}`,
        width: target.width,
        height: target.height,
        provider: "cloudflare",
        model: MODEL,
      });
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const mime = contentType.split(";")[0] || "image/png";

    return NextResponse.json({
      image: `data:${mime};base64,${imageBuffer.toString("base64")}`,
      width: target.width,
      height: target.height,
      provider: "cloudflare",
      model: MODEL,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "이미지 생성 중 오류가 발생했어.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
