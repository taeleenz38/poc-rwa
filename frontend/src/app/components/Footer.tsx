import React from "react";
import { FaXTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
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
  );
};

export default Footer;
