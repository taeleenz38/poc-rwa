"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { config } from "@/config";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { address } = useAccount({ config });
  const currentPath = usePathname();

  return (
    <div className="flex w-full justify-between items-center px-80 border-b-2 border-light py-4 bg-primary text-light">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/LOGO-DARK.png"
            alt="logo"
            width={150}
            height={150}
            className="mr-16"
          />
        </Link>
        {address === "0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC" && (
          <>
            <Link
              href="/invest"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/invest" ? "text-secondary" : ""
              }`}
            >
              Invest
            </Link>
            <Link
              href="/portfolio"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/portfolio" ? "text-secondary" : ""
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/about" ? "text-secondary" : ""
              }`}
            >
              About
            </Link>
          </>
        )}
        {address === "0x1E40767ddA91a06ee3e80E3d28BEB28CcF2F2565" && (
          <>
            <Link
              href="/pricing"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/pricing" ? "text-secondary" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/allowlist"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/allowlist" ? "text-secondary" : ""
              }`}
            >
              Allowlist
            </Link>
            <Link
              href="/about"
              className={`font-semibold mr-14 text-xl hover:text-secondary ${
                currentPath === "/about" ? "text-secondary" : ""
              }`}
            >
              About
            </Link>
          </>
        )}
      </div>
      <w3m-button />
    </div>
  );
};

export default Navbar;
