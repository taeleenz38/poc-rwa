import React from "react";
import Link from "next/link";

interface NavbarProps {
  userRole: string;
  currentPath: string;
  userState: string | null;
}

const NavbarLinks: React.FC<NavbarProps> = ({
  userRole,
  currentPath,
  userState,
}) => {
  const generateLink = (href: string, text: string, extraClass?: string) => {
    return (
      <Link
        href={href}
        className={`font-semibold mr-14 text-2xl text-white hover:text-primary duration-200 ${extraClass}`}
      >
        {text}
      </Link>
    );
  };

  const renderUserLinks = () => {
    if (userRole === "user") {
      return (
        <>
          {userState === "Active" &&
            userState !== null &&
            generateLink("/portfolio", "Portfolio")}
          {generateLink("/about", "About")}
          {generateLink("/profile", "Profile")}
        </>
      );
    }
    return null;
  };

  const renderAdminLinks = () => {
    if (userRole === "admin") {
      return (
        <>
          {generateLink(
            "/admin",
            "Admin",
            currentPath === "/admin" ? "text-white" : ""
          )}
          {generateLink(
            "/fundManagement",
            "Manage",
            currentPath === "/fundManagement" ? "text-white" : ""
          )}
        </>
      );
    }
    return null;
  };

  const renderGuardianLinks = () => {
    if (userRole === "guardian") {
      return generateLink(
        "/allowlist",
        "Guardian",
        currentPath === "/allowlist" ? "text-white" : ""
      );
    }
    return null;
  };

  const renderAssetSenderLinks = () => {
    if (userRole === "assetsender") {
      return generateLink(
        "/assetsender",
        "Asset Sender",
        currentPath === "/assetsender" ? "text-white" : ""
      );
    }
    return null;
  };

  return (
    <ul className="hidden lg:block">
      {renderUserLinks()}
      {renderAdminLinks()}
      {renderGuardianLinks()}
      {renderAssetSenderLinks()}
    </ul>
  );
};

export default NavbarLinks;
