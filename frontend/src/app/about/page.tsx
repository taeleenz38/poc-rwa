import React from "react";
import AboutSection from "@/app/components/molecules/AboutSection";
import Contact from "@/app/components/molecules/Contact";

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AboutSection />
      <Contact />
    </div>
  );
};

export default About;
