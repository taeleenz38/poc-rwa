"use client";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";

interface SignOutProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

const SignOut: React.FC<SignOutProps> = ({ setIsLoggedIn, setUserRole }) => {
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserRole("");
    disconnect();
    router.push("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
