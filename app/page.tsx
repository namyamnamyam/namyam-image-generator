"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AspectRatio,
  COMPOSITION_PRESETS,
  EXPRESSION_PRESETS,
  STYLE_PRESETS,
  buildPrompt,
} from "@/lib/presets";

const styleKeys = Object.keys(STYLE_PRESETS) as (keyof typeof STYLE_PRESETS)[];
const expressionKeys = Object.keys(EXPRESSION_PRESETS) as (keyof typeof EXPRESSION_PRESETS)[];
const compositionKeys = Object.keys(COMPOSITION_PRESETS) as (keyof typeof COMPOSITION_PRESETS)[];

export default function Home() {
  const [character, setCharacter] = useState("long black hair, straight hair, red eyes, pale skin");
  const [outfit, setOutfit] = useState("black crop top, casual outfit");
  const [expression, setExpression] = useState<keyof typeof EXPRESSION_PRESETS>("평소");
  const [composition, setComposition] = useState<keyof typeof COMPOSITION_PRESETS>("허리 위");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3 가로");
  const [style, setStyle] = useState<keyof typeof STYLE_PRESETS>("게임 애니 일러스트");
  const [background, setBackground] = useState("soft fantasy interior, subtle depth of field");
  const [extra, setExtra] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prompt = useMemo(
    () =>
      buildPrompt({
        character,
        outfit,
        expression,
        composition,
        background,
        style,
        extra,
        aspectRatio,
      }),
    [character, outfit, expression, composition, background, style, extra, aspectRatio],
  );

  async function generate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "이미지 생성에 실패했어.");
      setImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">NAMYAM IMAGE LAB · v0.1</p>
        <h1>냠얌 캐릭터 생성기</h1>
        <p>캐릭터 외형은 고정하고 표정·구도·배경만 빠르게 갈아끼우는 생성기.</p>
      </header>

      <div className="grid">
        <form className="panel form" onSubmit={generate}>
          <label>
            캐릭터 외형
            <textarea value={character} onChange={(e) => setCharacter(e.target.value)} rows={3} />
          </label>

          <label>
            의상
            <input value={outfit} onChange={(e) => setOutfit(e.target.value)} />
          </label>

          <div className="two">
            <label>
              표정
              <select value={expression} onChange={(e) => setExpression(e.target.value as keyof typeof EXPRESSION_PRESETS)}>
                {expressionKeys.map((key) => <option key={key}>{key}</option>)}
              </select>
            </label>
            <label>
              구도
              <select value={composition} onChange={(e) => setComposition(e.target.value as keyof typeof COMPOSITION_PRESETS)}>
                {compositionKeys.map((key) => <option key={key}>{key}</option>)}
              </select>
            </label>
          </div>

          <div className="two">
            <label>
              비율
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}>
                <option>4:3 가로</option>
                <option>3:4 세로</option>
                <option>1:1 정사각</option>
              </select>
            </label>
            <label>
              그림체 프리셋
              <select value={style} onChange={(e) => setStyle(e.target.value as keyof typeof STYLE_PRESETS)}>
                {styleKeys.map((key) => <option key={key}>{key}</option>)}
              </select>
            </label>
          </div>

          <label>
            배경
            <input value={background} onChange={(e) => setBackground(e.target.value)} />
          </label>

          <label>
            추가 지시
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="예: looking at viewer, subtle rim light"
              rows={2}
            />
          </label>

          <button disabled={loading}>{loading ? "생성 중..." : "이미지 생성"}</button>
          {error && <p className="error">{error}</p>}
        </form>

        <section className="stack">
          <article className="panel">
            <div className="panelTitle">
              <h2>최종 프롬프트</h2>
              <button
                type="button"
                className="ghost"
                onClick={() => navigator.clipboard.writeText(prompt)}
              >
                복사
              </button>
            </div>
            <p className="prompt">{prompt}</p>
          </article>

          <article className="panel result">
            <h2>생성 결과</h2>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="생성된 캐릭터" />
            ) : (
              <div className="empty">API 키를 설정한 뒤 생성 버튼을 누르면 여기에 결과가 떠.</div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
