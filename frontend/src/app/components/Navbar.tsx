"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { config } from "@/config";
import { usePathname, useRouter } from "next/navigation";
import Button from "./atoms/Buttons/Button";
import CloseButton from "./atoms/Buttons/CloseButton";
import axios from "axios";
import { MdAlternateEmail } from "react-icons/md";
import { Router } from "next/router";
import NavButtons from "./atoms/Buttons/NavButtons";
import InputWithLabel from "./atoms/Inputs/InputWithLabel";

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
    return pathname === path ? "text-[#FF10F0] ghost-btn" : "text-white";
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
        "/invest",
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

  useEffect(() => {
    if (justLoggedIn) {
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "user") {
        // router.push("/invest");
      } else if (userRole === "guardian") {
        router.push("/allowlist");
      } else if (userRole === "assetsender") {
        router.push("/assetsender");
      }
      setJustLoggedIn(false);
    }
  }, [justLoggedIn, userRole, router]);

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
        process.env.NEXT_PUBLIC_BACKEND_API + "/auth/signin",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || 200) {
        if (email === "admin@blockmajority.io") {
          setIsLoggedIn(true);
          setUserRole("admin");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", "admin");
          setShowModal(false);
          setJustLoggedIn(true);
        } else if (email === "guardian@blockmajority.io") {
          setIsLoggedIn(true);
          setUserRole("guardian");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", "guardian");
          setShowModal(false);
          setJustLoggedIn(true);
        } else if (email === "assetsender@blockmajority.io") {
          setIsLoggedIn(true);
          setUserRole("assetsender");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", "assetsender");
          setShowModal(false);
          setJustLoggedIn(true);
        } else {
          setIsLoggedIn(true);
          setUserRole("user");
          fetchUserStatus(email);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", "user");
          setShowModal(false);
          setJustLoggedIn(true);
        }
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
      className={`drawer flex w-full fixed top-0 justify-between z-20 items-center shadow-md lg:px-32 px-12 transition-all duration-300 bg-[#0a0a0a] text-white`}
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
          {!scrolled && isLoggedIn && (
            <ul className="hidden lg:block">
              {userRole === "user" && (
                <>
                  {/* <Link
                    href="/invest"
                    className={`font-semibold mr-14 text-2xl text-white hover:text-primary `}
                  >
                    Invest
                  </Link> */}
                  {userState === "Active" && userState !== null && (
                    <Link
                      href="/portfolio"
                      className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200`}
                    >
                      Portfolio
                    </Link>
                  )}
                  <Link
                    href="/about"
                    className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 `}
                  >
                    About
                  </Link>
                  <Link
                    href="/profile"
                    className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200`}
                  >
                    Profile
                  </Link>
                </>
              )}
              {userRole === "admin" && (
                <>
                  <Link
                    href="/admin"
                    className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 ${
                      currentPath === "/admin" ? "text-white" : ""
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/fundManagement"
                    className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 ${
                      currentPath === "/fundManagement" ? "text-white" : ""
                    }`}
                  >
                    Manage
                  </Link>
                </>
              )}
              {userRole === "guardian" && (
                <Link
                  href="/allowlist"
                  className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 ${
                    currentPath === "/allowlist" ? "text-white" : ""
                  }`}
                >
                  Guardian
                </Link>
              )}
              {userRole === "assetsender" && (
                <Link
                  href="/assetsender"
                  className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 ${
                    currentPath === "/assetsender" ? "text-white" : ""
                  }`}
                >
                  Asset Sender
                </Link>
              )}
            </ul>
          )}
        </div>
      </div>
      {!scrolled && (
        <div className="drawer-content">
          <div className="flex gap-2">
            {isLoggedIn ? (
              <>
                <div className="hidden lg:block">
                  <Button
                    text={"Sign Out"}
                    className="border-0 bg-primary text-md text-white hover:bg-secondary-focus py-1 px-3"
                    onClick={handleSignOut}
                  />
                </div>
                <div className="rounded-xl">
                  <w3m-button />
                </div>
              </>
            ) : (
              <>
                <NavButtons
                  text={"Sign In"}
                  className="border-0 hover:bg-secondary-focus text-white py-1 px-2 lg:py-2 lg:px-4"
                  onClick={() => setShowModal(true)}
                />
                <Link href="/kyc">
                  <NavButtons
                    text={"Sign Up"}
                    className="hover:bg-secondary-focus text-white hover:text-white py-1 px-2 lg:py-2 lg:px-4"
                    onClick={() => {}}
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-primary text-base-content pt-16 min-h-full w-2/3 p-4">
          {isLoggedIn && (
            <>
              {userRole === "user" && (
                <>
                  <li className={isActiveSide("/invest")}>
                    <Link
                      href="/invest"
                      onClick={closeSidebar}
                      className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                        currentPath === "/invest" ? "text-white" : ""
                      }`}
                    >
                      Invest
                    </Link>
                  </li>
                  {userState === "Active" && userState !== null && (
                    <li className={isActiveSide("/portfolio")}>
                      <Link
                        href="/portfolio"
                        onClick={closeSidebar}
                        className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                          currentPath === "/portfolio" ? "text-white" : ""
                        }`}
                      >
                        Portfolio
                      </Link>
                    </li>
                  )}
                  <li className={isActiveSide("/about")}>
                    <Link
                      href="/about"
                      onClick={closeSidebar}
                      className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                        currentPath === "/about" ? "text-white" : ""
                      }`}
                    >
                      About
                    </Link>
                  </li>
                  <li className={isActiveSide("/profile")}>
                    <Link
                      href="/profile"
                      onClick={closeSidebar}
                      className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                        currentPath === "/profile" ? "text-white" : ""
                      }`}
                    >
                      Profile
                    </Link>
                  </li>
                </>
              )}
              {userRole === "admin" && (
                <li className={isActiveSide("/admin")}>
                  <Link
                    href="/admin"
                    onClick={closeSidebar}
                    className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                      currentPath === "/admin" ? "text-white" : ""
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}
              {userRole === "guardian" && (
                <li className={isActiveSide("/allowlist")}>
                  <Link
                    href="/allowlist"
                    onClick={closeSidebar}
                    className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                      currentPath === "/allowlist" ? "text-white" : ""
                    }`}
                  >
                    Guardian
                  </Link>
                </li>
              )}
              {userRole === "assetsender" && (
                <li className={isActiveSide("/assetsender")}>
                  <Link
                    href="/assetsender"
                    onClick={closeSidebar}
                    className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                      currentPath === "/assetsender" ? "text-white" : ""
                    }`}
                  >
                    Asset Sender
                  </Link>
                </li>
              )}
            </>
          )}
          <div className="flex">
            {isLoggedIn && (
              <>
                <div className="">
                  <Button
                    text={"Sign Out"}
                    className="font-semibold text-2xl text-[rgb(128,128,128)] hover:bg-secondary-focus hover:text-primary"
                    onClick={() => {
                      handleSignOut();
                      closeSidebar();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
      {!isLoggedIn && showModal && (
        <div className="fixed inset-0 text-primary bg-black bg-opacity-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-md text-gray bg-white shadow-md shadow-white w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Sign In
              </h2>
              <CloseButton
                onClick={() => {
                  setShowModal(false);
                  setEmail("");
                  setPassword("");
                }}
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full px-8">
                <InputWithLabel
                  id="email"
                  name="email"
                  type="text"
                  label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  widthfull={true} // Optional, you can pass widthfull to control width
                  border={true} // Optional, you can pass border to control border style
                  required={true} // Optional, you can pass required if needed
                />
              </div>
              <div className="w-full px-8">
                <InputWithLabel
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  widthfull={true} // Optional
                  border={true} // Optional
                  required={true} // Optional
                />
              </div>
              {signInError && (
                <div className="error-message error-text">{signInError}</div>
              )}
              <div className="w-full px-8">
                <Button
                  text={"Sign In"}
                  className="bg-primary rounded-full w-full mt-4 mb-2 hover:bg-secondary-focus text-white py-2 px-4"
                  onClick={handleSignIn}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
