export const STYLE_PRESETS = {
  "게임 애니 일러스트":
    "clean premium anime illustration, crisp lineart, refined cel shading, detailed eyes, detailed layered hair, natural skin shading, balanced colors, cinematic soft lighting, polished game character artwork",
  "깔끔한 셀 셰이딩":
    "clean anime lineart, controlled highlights, refined cel shading, clear shadows, vivid balanced colors, polished character illustration",
  "부드러운 판타지":
    "elegant fantasy anime illustration, delicate lineart, soft shading, subtle rim light, detailed hair and eyes, atmospheric background, polished promotional artwork",
} as const;

export const EXPRESSION_PRESETS = {
  "평소": "neutral expression, calm face, natural gaze",
  "미소": "gentle smile, relaxed eyes, warm expression",
  "눈웃음": "bright closed-eye smile, raised cheeks, cheerful expression",
  "화남": "angry expression, lowered eyebrows, narrowed eyes, firmly pressed lips, controlled anger",
  "슬픔": "sad expression, slightly lowered eyebrows, glossy eyes, restrained emotion",
  "부끄러움": "embarrassed expression, soft blush, slightly averted gaze, bashful expression",
  "흥미": "interested expression, slightly raised eyebrow, focused eyes, faint curious smile",
} as const;

export const COMPOSITION_PRESETS = {
  "허리 위": "waist-up, character centered, eye-level camera, natural perspective",
  "상반신": "upper-body portrait, character centered, eye-level camera",
  "전신": "full-body, character fully visible, balanced composition, eye-level camera",
  "얼굴 중심": "close-up portrait, face clearly visible, natural perspective",
} as const;

export type AspectRatio = "4:3 가로" | "3:4 세로" | "1:1 정사각";

export function buildPrompt(input: {
  character: string;
  outfit: string;
  expression: keyof typeof EXPRESSION_PRESETS;
  composition: keyof typeof COMPOSITION_PRESETS;
  background: string;
  style: keyof typeof STYLE_PRESETS;
  extra: string;
  aspectRatio: AspectRatio;
}) {
  const parts = [
    "Create one completely original character.",
    STYLE_PRESETS[input.style],
    input.character.trim(),
    input.outfit.trim(),
    EXPRESSION_PRESETS[input.expression],
    COMPOSITION_PRESETS[input.composition],
    input.aspectRatio === "4:3 가로"
      ? "horizontal 4:3 composition"
      : input.aspectRatio === "3:4 세로"
        ? "vertical 3:4 composition"
        : "square composition",
    input.background.trim() ? `background: ${input.background.trim()}` : "simple non-distracting background",
    input.extra.trim(),
    "single character, clean silhouette, natural anatomy, no text, no logo, no watermark",
  ];

  return parts.filter(Boolean).join(", ");
}
