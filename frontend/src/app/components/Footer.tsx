import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <div className="bg-primary px-8 py-12 sm:px-16 lg:px-28 sm:py-16 lg:py-24 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">
        <div>
          <Image
            src="/BM-LOGO.png"
            alt="logo"
            width={100}
            height={100}
            className="mb-6 lg:mb-0"
          />
        </div>
        <div className="flex flex-row gap-y-4 sm:gap-y-6 gap-x-16 lg:gap-x-52 text-lg sm:text-xl text-light">
          <div className="flex flex-col gap-y-4 sm:gap-y-6 text-lg sm:text-xl text-light">
            <Link href="/">Phone</Link>
            <Link href="/about">Address</Link>
            <Link href="/about">Email</Link>
            <Link href="/about">Website</Link>
          </div>
          <div className="flex flex-col gap-y-4 sm:gap-y-6 text-lg sm:text-xl text-light text-opacity-80">
            <div>+61 452 597 949</div>
            <div>123 address st</div>
            <div>contact@copiam.io</div>
            <div>www.copiam.io</div>
          </div>
        </div>
        <div className="bg-light text-center px-8 py-2 my-2 sm:px-16 sm:py-4 hover:cursor-pointer text-primary">
          Contact Us
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center px-8 sm:px-16 lg:px-80 py-4 text-light bg-black gap-4 sm:gap-0">
        <div className="text-center sm:text-left">Copyright Copiam 2024</div>
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
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
