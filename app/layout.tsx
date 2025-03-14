import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ThemeProvider from "@/components/providers/theme-provider";

const rubik = localFont({
  src: "../public/assets/fonts/Rubik-VariableFont_wght.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just Quiz App",
  description: "A quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
    
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
