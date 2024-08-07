import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <div className="bg-primary px-48 py-24 flex justify-between items-center">
        <div>
          <Image
            src="/LOGO-DARK.png"
            alt="logo"
            width={200}
            height={200}
            className="mr-16"
          />
        </div>
        <div className="flex flex-col gap-y-6 text-xl text-light">
          <Link href="/" className="font-bold">
            Home
          </Link>
          <Link href="/about">About</Link>
          <Link href="/about">Our Offering</Link>
          <Link href="/about">Contact</Link>
        </div>
        <div className="flex flex-col gap-y-6 text-xl text-light text-opacity-80">
          <div>+61 (0)452 597 949</div>
          <div>123 address st</div>
          <div>peter@copiam.io</div>
          <div>www.copiam.io</div>
        </div>
        <div className="bg-light px-28 py-4 hover:cursor-pointer text-primary">
          Contact Us
        </div>
      </div>
      <div className="flex w-full justify-between items-center px-80 py-4 text-light bg-black ">
        <div className="">Copyright Copiam 2024</div>
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
