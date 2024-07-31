import React from "react";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
  return (
    <div className="bg-primary px-96 py-24 flex justify-between items-center">
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
  );
};

export default Contact;
