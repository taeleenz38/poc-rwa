"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Buttons/Button";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";

type KycDetailsProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
};

const KycDetails = (props: KycDetailsProps) => {
  const { logoSrc, altText, fundName, fundDescription, yieldText } = props;

  const [value, setValue] = useState("");

  return (
    // <div className="bg-[#122A5F] flex justify-center items-center z-10">
    <div className=" flex justify-center items-center ">
      {/* <div className="max-w-screen-xl h-full bg-hero-pattern bg-no-repeat bg-right-bottom bg-70% grid lg:grid-cols-2 grid-cols-1 pt-20 pb-36 px-8 font-normal text-light bg-url('/assets/ABBY-background.svg')"></div> */}
      <div>
        <form>
          <div className="grid grid-cols-2 gap-2 border border-white p-4">
            <div className="flex flex-col  p-2">
              <InputWithLabel
                id="idDocType"
                name="idDocType"
                type="text"
                label="Document Type"
                placeholder="Enter document type"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="country"
                name="country"
                type="text"
                label="Country"
                placeholder="Enter country"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />

              <InputWithLabel
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="issuedDate"
                name="issuedDate"
                type="date"
                label="Issued Date"
                placeholder="Enter issued date"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
            </div>

            <div className="flex flex-col  p-2">
              <InputWithLabel
                id="validUntil"
                name="validUntil"
                type="date"
                label="Valid Until"
                placeholder="Enter valid until date"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="number"
                name="number"
                type="text"
                label="Document Number"
                placeholder="Enter document number"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                placeholder="Enter date of birth"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="placeOfBirth"
                name="placeOfBirth"
                type="text"
                label="Place of Birth (Optional)"
                placeholder="Enter place of birth"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="idDocSubType"
                name="idDocSubType"
                type="text"
                label="Document Subtype"
                placeholder="Enter document subtype"
                value={value}
                onChange={() => {}}
                widthfull={true}
              />
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default KycDetails;
