"use client";
import React from "react";
import PricingSection from "@/app/components/molecules/PricingSection";

const Admin = () => {
  return (
    <div className="min-h-screen root-container">
      <h1 className="text-3xl font-semibold text-black">Admin Requests</h1>
      <PricingSection />
    </div>
  );
};

export default Admin;
