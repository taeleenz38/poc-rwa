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
      {address === "0x3aE47F6F7B2705De921374f57Df212C18343cC9d" && (
        <UserFunctions />
      )}
      {address === "0xe0e3D4141D7FC3697AD469b4ED5b149D30b7069B" && (
        <AdminFunctions />
      )}
    </main>
  );
}
