"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import UserFunctions from "@/app/components/organisms/UserFunctions";
import AdminFunctions from "@/app/components/organisms/AdminFunctions";
import { useAccount } from "wagmi";
import { config } from "@/config";

export default function Home() {
  const { address, status } = useAccount({
    config,
  });
  return (
    <main className="min-h-screen">
      {status !== "connected" && <div className="text-center mt-80 font-bold text-2xl">Please Connect Your Wallet</div>}
      {address === "0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC" && (
        <UserFunctions />
      )}
      {address === "0x1E40767ddA91a06ee3e80E3d28BEB28CcF2F2565" && (
        <AdminFunctions />
      )}
    </main>
  );
}
