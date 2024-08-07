"use client";
import React from "react";
import PricingSection from "@/app/components/molecules/PricingSection";
import AdminRequests from "@/app/components/organisms/AdminRequests";

const Admin = () => {
  return (
    <div className="min-h-screen root-container">
      <h1 className="text-5xl font-semibold text-black mb-6">Admin Requests</h1>
      <h2 className="text-2xl font-semibold text-gray mb-12">
        Track and manage your requests
      </h2>
      <AdminRequests />
      {/* <PricingSection /> */}
    </div>
  );
};

export default Admin;
