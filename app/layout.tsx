import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "가정통신문 작성 도우미",
  description: "어린이집 선생님을 위한 스마트 가정통신문 작성 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
