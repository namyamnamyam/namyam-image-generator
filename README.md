# 냠얌 캐릭터 생성기

캐릭터 외형 프리셋 + 표정 + 구도 + 배경 + 그림체 프리셋을 조합해 최종 프롬프트를 만들고, OpenAI 이미지 API로 바로 생성하는 개인용 웹앱입니다.

## v0.1 기능

- 캐릭터 외형 / 의상 입력
- 표정 프리셋
- 구도 프리셋
- 4:3 가로 / 3:4 세로 / 1:1 비율
- 그림체 프리셋
- 배경 / 추가 지시
- 최종 프롬프트 실시간 미리보기 + 복사
- OpenAI `gpt-image-1` 이미지 생성
- API 원본 결과를 `sharp`로 후처리해 정확한 4:3 또는 3:4 크기로 맞춤
- API 키는 브라우저에 노출하지 않고 서버 환경변수에서만 사용

## 실행

Node.js 20 이상 권장.

```bash
npm install
cp .env.example .env.local
```

Windows PowerShell이라면:

```powershell
Copy-Item .env.example .env.local
```

`.env.local`에 본인 OpenAI API 키를 넣습니다.

```env
OPENAI_API_KEY=sk-...
```

그 다음:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 이미지 크기

OpenAI 이미지 API가 제공하는 기본 생성 크기를 사용한 뒤 서버에서 중앙 기준으로 후처리합니다.

- 4:3 가로 → 1024×768
- 3:4 세로 → 768×1024
- 1:1 → 1024×1024

## 보안

- `.env`, `.env.local`은 Git에 커밋하지 않습니다.
- `OPENAI_API_KEY`를 `NEXT_PUBLIC_` 환경변수에 넣지 마세요.
- 배포할 때는 Vercel 등 호스팅 서비스의 서버 환경변수 기능을 사용하세요.

## 다음 버전 후보

- 캐릭터 프리셋 저장 / 불러오기
- 표정 프리셋 직접 추가
- 스타일 프리셋 직접 추가
- 생성 기록 갤러리
- 참고 이미지 업로드 + 이미지 편집/변형
- 여러 이미지 엔진(OpenAI / ComfyUI 등) 선택 구조

## 구조

```text
app/
  api/generate/route.ts  # 서버 이미지 생성 API
  globals.css            # UI 스타일
  layout.tsx
  page.tsx               # 메인 UI
lib/
  presets.ts             # 스타일/표정/구도/프롬프트 조합
```
