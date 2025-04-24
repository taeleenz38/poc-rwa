import React from "react";
import Button from "@/app/components/atoms/Buttons/Button"; 
import NavButtons from "@/app/components/atoms/Buttons/NavButtons"; 
import Link from "next/link";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  handleSignOut: () => void;
  setShowModal: (show: boolean) => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLoggedIn,
  handleSignOut,
  setShowModal,
}) => {
  return (
    <div className="drawer-content">
      <div className="flex gap-2">
        {isLoggedIn ? (
          <>
            <div className="hidden lg:block">
              <Button
                text="Sign Out"
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
              text="Sign In"
              className="border-0 hover:bg-secondary-focus text-white py-1 px-2 lg:py-2 lg:px-4"
              onClick={() => setShowModal(true)}
            />
            <Link href="/kyc">
              <NavButtons
                text="Sign Up"
                className="hover:bg-secondary-focus text-white hover:text-white py-1 px-2 lg:py-2 lg:px-4"
                onClick={() => {}}
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthButtons;
