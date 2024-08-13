import type { Metadata } from "next";
import { headers } from "next/headers";
import { Open_Sans } from "next/font/google"; // Change this line
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Update the font import
const openSans = Open_Sans({ subsets: ["latin"] });

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
      <body className={openSans.className}>
        <Web3ModalProvider initialState={initialState}>
          <Navbar />
          <div className="pt-[92px] text-primary">{children}</div>
          <Footer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
