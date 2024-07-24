import type { Metadata } from "next";
import { headers } from "next/headers";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COPIAM",
  description: "COPIAM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={notoSans.className}>
        <Navbar />
        <Web3ModalProvider initialState={initialState}>
          {children}
        </Web3ModalProvider>
        <Footer />
      </body>
    </html>
  );
}
