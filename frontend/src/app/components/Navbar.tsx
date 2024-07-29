"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { config } from "@/config";
import { usePathname, useRouter } from "next/navigation";
import Button from "./atoms/Buttons/Button";
import CloseButton from "./atoms/Buttons/CloseButton";


const Navbar = () => {
  const { address } = useAccount({ config });
  const currentPath = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignIn = () => {
    if (username === "tedhansen" && password === "123") {
      setIsLoggedIn(true);
      setUserRole("admin");
      setShowModal(false);
    } else if (username === "johndoe" && password === "123") {
      setIsLoggedIn(true);
      setUserRole("user");
      setShowModal(false);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserRole("");
  };

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
        {!scrolled && isLoggedIn && userRole === "user" && (
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
        {!scrolled && isLoggedIn && userRole === "admin" && (
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
          </>
        )}
      </div>
      {!scrolled && (
        <div className="flex gap-2">
          {isLoggedIn ? (
            <>
              <Button
                text={"Sign Out"}
                className="border-0 hover:bg-secondary py-1 px-3"
                onClick={handleSignOut}
              />
              <w3m-button />
            </>
          ) : (
            <>
              <Button
                text={"Sign In"}
                className="border-0 hover:bg-secondary py-1 px-3"
                onClick={() => setShowModal(true)}
              />
              <Link href="/kyc">
                <Button
                  text={"Sign Up"}
                  className="bg-white hover:bg-primary text-primary hover:text-white py-1 px-3"
                  onClick={() => {}}
                />
              </Link>
            </>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 text-primary bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl">Sign In</h2>
              <CloseButton onClick={() => setShowModal(false)} />
            </div>
            <div className="flex flex-col items-center">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-2 border rounded w-96"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 border rounded w-96"
              />
              <Button
                text={"Sign In"}
                className="bg-primary rounded-lg w-32 hover:bg-white hover:text-primary text-white py-2 px-4"
                onClick={handleSignIn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
