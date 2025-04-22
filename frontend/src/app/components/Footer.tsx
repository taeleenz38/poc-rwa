import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <div className="bg-[#0a0a0a] px-8 py-12 sm:px-16 lg:px-28 sm:py-4 lg:py-8 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">
        <div className="flex items-center">
          <Image
            src="/BM-LOGO-WHITE.svg"
            alt="logo"
            width={210}
            height={210}
            className="mb-6 lg:mb-0 mr-24"
          />
          <div className="flex flex-col gap-3">
            <div className="font-bold text-lg">Quick Links</div>
            <div className="flex gap-12">
              <Link className="hover:underline duration-100" href="/">Home</Link>
              <Link className="hover:underline duration-100" href="/about">About</Link>
              <Link className="hover:underline duration-100" href="/investVLR">Velora (VLR)</Link>
              <Link className="hover:underline duration-100" href="/investEQV">Equivest (EQV)</Link>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-primary text-center px-4 py-2 my-2 sm:px-8 sm:py-4 hover:cursor-pointer hover:text-white hover:bg-primary duration-200 text-primary">
          Contact Us
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center px-8 sm:px-16 lg:px-28 py-4 text-light bg-black gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          © 2025 Block Majority Pty Ltd. All Rights Reserved.
        </div>
        <div className="flex space-x-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaXTwitter size={24} />
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
