// SignInModal Component
import React from "react";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Button from "@/app/components/atoms/Buttons/Button";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";

interface SignInModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignIn: () => void;
  signInError: string | null;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const SignInModal: React.FC<SignInModalProps> = ({
  setShowModal,
  handleSignIn,
  signInError,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
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
              widthfull={true}
              border={true}
              required={true}
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
              widthfull={true}
              border={true}
              required={true}
            />
          </div>
          {signInError && (
            <div className="error-message error-text">{signInError}</div>
          )}
          <div className="w-full px-8">
            <Button
              text="Sign In"
              className="bg-primary rounded-full w-full mt-4 mb-2 hover:bg-secondary-focus text-white py-2 px-4"
              onClick={handleSignIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
