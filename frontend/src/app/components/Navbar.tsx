"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { config } from "@/config";
import { usePathname, useRouter } from "next/navigation";
import Button from "./atoms/Buttons/Button";

const Navbar = () => {
  const { address } = useAccount({ config });
  const currentPath = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex w-full fixed top-0 justify-between z-20 items-center px-80 border-b-2 border-light py-4 transition-all duration-300 ${
        scrolled ? "bg-white" : "bg-primary"
      } ${scrolled ? "text-dark" : "text-light"}`}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src={scrolled ? "/LOGO-LIGHT.png" : "/LOGO-DARK.png"}
            alt="logo"
            width={150}
            height={150}
            className="mr-16"
          />
        </Link>
        {!scrolled &&
          address === "0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC" && (
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
        {!scrolled &&
          address === "0x1E40767ddA91a06ee3e80E3d28BEB28CcF2F2565" && (
            <>
              <Link
                href="/admin"
                className={`font-semibold mr-14 text-xl hover:text-secondary ${
                  currentPath === "/admin" ? "text-secondary" : ""
                }`}
              >
                Admin
              </Link>
              <Link
                href="/allowlist"
                className={`font-semibold mr-14 text-xl hover:text-secondary ${
                  currentPath === "/allowlist" ? "text-secondary" : ""
                }`}
              >
                Allowlist
              </Link>
              {/* <Link
                href="/admin"
                className={`font-semibold mr-14 text-xl hover:text-secondary ${
                  currentPath === "/admin" ? "text-secondary" : ""
                }`}
              >
                Claim Timestamps
              </Link> */}
            </>
          )}
      </div>
      {!scrolled && (
        <div className="flex  gap-2">
          <Button text={"SignIn"} onClick={() => {}} />
          <Button text={"SignUp"} onClick={() => {}} />
          <w3m-button />
        </div>
      )}
    </div>
  );
};

export default Navbar;
