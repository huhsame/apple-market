import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "사과마켓",
  description: "우리 동네 중고거래, 사과마켓",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto max-w-5xl px-5 py-8 text-xs text-muted">
            © 2026 사과마켓 · 개발 공부용 프로젝트
          </div>
        </footer>
      </body>
    </html>
  );
}
