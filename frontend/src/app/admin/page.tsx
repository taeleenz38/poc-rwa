"use client";
import React, { useState } from "react";
import AdminRequests from "@/app/components/organisms/AdminRequests";

const Admin = () => {
  const [tokenType, setTokenType] = useState<"VLR" | "EQV">("VLR");

  return (
    <div className="min-h-screen root-container">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-secondary mb-4">
            Admin Requests
          </h1>
          <h2 className="text-xl font-normal text-secondary mb-8">
            Track and manage your requests
          </h2>
        </div>
        <div className="flex justify-end">
          <select
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value as "VLR" | "EQV")}
            className="px-2 py-2 rounded-xl text-sm md:text-base text-primary bg-white focus:outline-none"
          >
            <option value="VLR">VLR</option>
            <option value="EQV">EQV</option>
          </select>
        </div>
      </div>

      {/* Pass tokenType to AdminRequests */}
      <AdminRequests tokenType={tokenType} />
    </div>
  );
};

export default Admin;
