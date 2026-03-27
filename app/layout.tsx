import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TIC-TAC-TOE ONLINE",
  description: "Play Tic-Tac-Toe online with friends or random opponents.",
  icons: "/logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{
        backgroundColor: '#050505',
        color: 'white',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden'
      }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
