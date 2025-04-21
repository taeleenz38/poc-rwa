"use client";
import React, { useState } from "react";
import AdminRequests from "@/app/components/organisms/AdminRequests";

const Admin = () => {
  const [tokenType, setTokenType] = useState<"VLR" | "EQV">("VLR");
//
  return (
    <div className="min-h-screen root-container">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-secondary mb-4">Admin Requests</h1>
          <h2 className="text-xl font-normal text-secondary mb-8">
            Track and manage your requests
          </h2>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm md:text-base border ${tokenType === "VLR"
                ? "bg-primary text-white"
                : "border-primary text-primary"
              }`}
            onClick={() => setTokenType("VLR")}
          >
            VLR
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm md:text-base border ${tokenType === "EQV"
                ? "bg-primary text-white"
                : "border-primary text-primary"
              }`}
            onClick={() => setTokenType("EQV")}
          >
            EQV
          </button>
        </div>
      </div>

      {/* Pass tokenType to AdminRequests */}
      <AdminRequests tokenType={tokenType} />
    </div>
  );
};

export default Admin;
