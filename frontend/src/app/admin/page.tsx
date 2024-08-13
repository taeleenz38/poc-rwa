"use client";
import React from "react";
import PricingSection from "@/app/components/molecules/PricingSection";
import AdminRequests from "@/app/components/organisms/AdminRequests";

const Admin = () => {
  return (
    <div className="min-h-screen root-container">
      <h1 className="text-4xl font-semibold text-black mb-4">Admin Requests</h1>
      <h2 className="text-xl font-normal text-gray mb-8">
        Track and manage your requests
      </h2>
      <AdminRequests />
      {/* <PricingSection /> */}
    </div>
  );
};

export default Admin;
