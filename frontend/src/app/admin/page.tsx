"use client";
import React from "react";
import PricingSection from "@/app/components/molecules/PricingSection";
import Contact from "../components/molecules/Contact";

const Admin = () => {
  return (
    <>
      <div className="min-h-screen pt-10">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Admin Requests
          </h1>
          <PricingSection />
        </div>
      </div>
      <Contact />
    </>
  );
};

export default Admin;
