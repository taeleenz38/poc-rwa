import React from "react";
import Link from "next/link";
import Button from "@/app/components/atoms/Buttons/Button";

interface NavbarLinksProps {
  currentPath: string;
  userState: string | null;
  userRole: string;
  isLoggedIn: boolean;
  closeSidebar: () => void;
  handleSignOut: () => void;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({
  currentPath,
  userState,
  userRole,
  isLoggedIn,
  closeSidebar,
  handleSignOut,
}) => {
  const isActiveSide = (path: string) => (currentPath === path ? "active" : "");

  return (
    <div className="">
      <div className="">
        {/* <li className={isActiveSide("/invest")}>
          <Link
            href="/invest"
            onClick={closeSidebar}
            className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
              currentPath === "/invest" ? "text-primary" : ""
            }`}
          >
            Invest
          </Link>
        </li> */}
        {userState === "Active" && userState !== null && (
          <li className={isActiveSide("/portfolio")}>
            <Link
              href="/portfolio"
              onClick={closeSidebar}
              className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
                currentPath === "/portfolio" ? "text-primary" : ""
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
              currentPath === "/about" ? "text-primary" : ""
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
              currentPath === "/profile" ? "text-primary" : ""
            }`}
          >
            Profile
          </Link>
        </li>
      </div>
      {userRole === "admin" && (
        <li className={isActiveSide("/admin")}>
          <Link
            href="/admin"
            onClick={closeSidebar}
            className={`font-semibold mr-14 text-2xl text-[rgb(128,128,128)] hover:text-primary ${
              currentPath === "/admin" ? "text-primary" : ""
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
              currentPath === "/allowlist" ? "text-primary" : ""
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
              currentPath === "/assetsender" ? "text-primary" : ""
            }`}
          >
            Asset Sender
          </Link>
        </li>
      )}
      {isLoggedIn && (
        <div className="flex">
          <Button
            text={"Sign Out"}
            className="font-semibold text-2xl text-[rgb(128,128,128)] hover:text-primary"
            onClick={() => {
              handleSignOut();
              closeSidebar();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NavbarLinks;
