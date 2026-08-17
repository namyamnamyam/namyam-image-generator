import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "냠얌 캐릭터 생성기",
  description: "캐릭터 프리셋과 표정/구도를 조합해 이미지 프롬프트를 만들고 생성합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
