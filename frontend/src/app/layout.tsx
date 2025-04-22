import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google"; // Changed this line
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Updated the font setup
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fund Tokenisation",
  description: "Fund Tokenisation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>
          <Navbar />
          <div className="pt-[92px] text-primary">{children}</div>
          <Footer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
