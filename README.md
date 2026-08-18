# 냠얌 캐릭터 생성기

캐릭터 외형 프리셋 + 표정 + 구도 + 배경 + 그림체 프리셋을 조합해 최종 프롬프트를 만들고, Cloudflare Workers AI로 이미지를 생성하는 개인용 웹앱입니다.

## v0.2 기능

- 캐릭터 외형 / 의상 입력
- 표정 프리셋
- 구도 프리셋
- 4:3 가로 / 3:4 세로 / 1:1 비율
- 그림체 프리셋
- 배경 / 추가 지시
- 최종 프롬프트 실시간 미리보기 + 복사
- Cloudflare Workers AI 이미지 생성
- 기본 모델: `@cf/bytedance/stable-diffusion-xl-lightning`
- API 토큰은 브라우저에 노출하지 않고 서버 환경변수에서만 사용

## Cloudflare 준비

Cloudflare 계정에서 Workers AI를 연 뒤 `Use REST API`에서 다음 두 값을 준비합니다.

- Account ID
- Workers AI API Token

직접 토큰을 만들 경우 Workers AI Read / Edit 권한이 필요합니다.

## 로컬 실행

Node.js 20 이상 권장.

```bash
npm install
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

`.env.local`:

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

그 다음:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 배포

Vercel에서 이 GitHub 저장소를 Import한 뒤 Environment Variables에 아래 두 개를 추가합니다.

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

그 다음 Deploy 또는 Redeploy하면 됩니다.

## 무료 사용 관련

Workers AI는 Cloudflare 무료 플랜의 일일 무료 할당량 범위에서 사용할 수 있습니다. 무료 할당량을 넘으면 무료 플랜에서는 요청이 더 이상 처리되지 않을 수 있습니다. Cloudflare의 정책과 모델별 사용 가능 여부는 변경될 수 있으므로 대시보드의 현재 사용량을 확인하세요.

## 보안

- `.env`, `.env.local`은 Git에 커밋하지 않습니다.
- `CLOUDFLARE_API_TOKEN`을 `NEXT_PUBLIC_` 환경변수에 넣지 마세요.
- 실제 토큰은 Vercel의 Environment Variables에만 저장하세요.

## 다음 버전 후보

- 캐릭터 프리셋 저장 / 불러오기
- 표정 프리셋 직접 추가
- 스타일 프리셋 직접 추가
- 생성 기록 갤러리
- 참고 이미지 업로드 + img2img
- 이미지 엔진 선택 구조

## 구조

```text
app/
  api/generate/route.ts  # Cloudflare Workers AI 호출
  globals.css            # UI 스타일
  layout.tsx
  page.tsx               # 메인 UI
lib/
  presets.ts             # 스타일/표정/구도/프롬프트 조합
```
