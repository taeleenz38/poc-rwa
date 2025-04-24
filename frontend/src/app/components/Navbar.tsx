"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { config } from "@/config";
import { usePathname, useRouter } from "next/navigation";
import Button from "./atoms/Buttons/Button";
import SignInModal from "./molecules/SignInModal";
import axios from "axios";
import AuthButtons from "./molecules/AuthButton";
import SidebarLinks from "./molecules/NavLinks";
import NavbarLinks from "./molecules/NavbarLinks";

const Navbar = () => {
  const { address } = useAccount({ config });
  const { disconnect } = useDisconnect({ config });
  const currentPath = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [userState, setUserState] = useState<string | null>("Inactive");
  const [signInError, setSignInError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isActiveSide = (path: string) => {
    return pathname === path ? "text-primary ghost-btn" : "text-white";
  };

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserRole = localStorage.getItem("userRole");
    const email = localStorage.getItem("username");

    if (email) fetchUserStatus(email);

    if (storedLoggedIn && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    } else {
      // Redirect to home and show modal if not logged in
      const restrictedPaths = [
        "/admin",
        "/fundManagement",
        "/investEQV",
        "/investVLR",
        "/allowlist",
        "/assetsender",
        "/portfolio",
        "/profile",
      ];
      if (restrictedPaths.includes(currentPath) && !isLoggedIn) {
        router.push("/");
        setShowModal(true);
      }
    }

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
  }, [currentPath, isLoggedIn, router]);

  const fetchUserStatus = async (user: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/status?email=${user}`
      );
      if (response.status === 200 || 201) {
        if (response.data.isActive === true) {
          setUserState("Active");
        } else {
          setUserState("Inactive");
        }
      }
    } catch (err) {
      console.error("Failed to fetch status ", err);

      setUserState("Inactive");
    }
  };

  const handleSignIn = async () => {
    try {
      localStorage.setItem("username", email);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/signin`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || 201) {
        const roles: { [key: string]: string } = {
          "admin@blockmajority.io": "admin",
          "guardian@blockmajority.io": "guardian",
          "assetsender@blockmajority.io": "assetsender",
        };

        const userRole = roles[email] || "user";
        setIsLoggedIn(true);
        setUserRole(userRole);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", userRole);

        if (userRole === "user") {
          fetchUserStatus(email);
        }

        setShowModal(false);
        setJustLoggedIn(true);
      } else {
        setSignInError("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      setSignInError("Invalid credentials");
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserRole("");
    disconnect();
    router.push("/");
    // localStorage.clear();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
  };

  const closeSidebar = () => {
    const drawerToggle = document.getElementById(
      "my-drawer"
    ) as HTMLInputElement;
    if (drawerToggle && drawerToggle.checked) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div
      className={`drawer flex w-full fixed top-0 justify-between z-20 items-center shadow-md lg:px-32 px-12 py-3 md:py-0 transition-all duration-300 bg-[#0a0a0a] text-white`}
    >
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex items-center justify-between">
        <div className="flex items-center">
          {isLoggedIn ? (
            <label
              htmlFor="my-drawer"
              className={`bg-none drawer-button items-center text-2xl lg:hidden cursor-pointer
            `}
            >
              ☰
            </label>
          ) : (
            <Link href="/">
              <Image
                src="/BM-LOGO.svg"
                alt="logo"
                width={60}
                height={60}
                className="mr-16 lg:hidden"
              />
            </Link>
          )}
          <Link href="/">
            <Image
              src="/BM-LOGO.svg"
              alt="logo"
              width={210}
              height={210}
              className="mr-16 hidden lg:block "
            />
          </Link>
          {!scrolled && isLoggedIn && <NavbarLinks userRole={userRole} currentPath={currentPath} userState={userState} />}
        </div>
      </div>
      {!scrolled && (
        <AuthButtons
          isLoggedIn={isLoggedIn}
          handleSignOut={handleSignOut}
          setShowModal={setShowModal}
        />
      )}

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-[#0a0a0a] text-base-content pt-16 min-h-full w-2/3">
          {isLoggedIn && (
            <SidebarLinks
              currentPath={currentPath}
              userState={userState}
              userRole={userRole}
              isLoggedIn={isLoggedIn}
              closeSidebar={closeSidebar}
              handleSignOut={handleSignOut}
            />
          )}
        </ul>
      </div>
      {!isLoggedIn && showModal && (
        <SignInModal
          setShowModal={setShowModal}
          handleSignIn={handleSignIn}
          signInError={signInError}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      )}
    </div>
  );
};

export default Navbar;
