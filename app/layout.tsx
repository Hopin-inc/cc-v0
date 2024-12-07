import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layouts/ConditionalLayout";
import { DEFAULT_PROJECT_NAME } from "@/config";
import { AppProvider } from "@/providers/AppProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: DEFAULT_PROJECT_NAME,
  description: `${DEFAULT_PROJECT_NAME} の日常`,
  openGraph: {
    title: DEFAULT_PROJECT_NAME,
    description: `${DEFAULT_PROJECT_NAME} の日常`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <div id="portal-root" />
          <div id="select-portal-root" />
        </AppProvider>
      </body>
    </html>
  );
}
