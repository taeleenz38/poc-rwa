"use client";

import Button from "@/app/components/atoms/Buttons/Button";
import FileUpload from "@/app/components/atoms/Inputs/FileUpload";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";
import SelectField from "@/app/components/atoms/Inputs/SelectInput";
import Stepper from "@/app/components/atoms/Stepper";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import VerificationPopup from "./Popups/VerificationPopup";

type KycDetailsProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
};

const KycDetails = (props: KycDetailsProps) => {
  const { logoSrc, altText, fundName, fundDescription, yieldText } = props;
  const [idDocType, setIdDocType] = useState("ID_CARD");
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [idDocSubType, setIdDocSubType] = useState<
    "FRONT_SIDE" | "BACK_SIDE"
  >();
  const [currentStep, setCurrentStep] = useState(1);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backtFile, setBackFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const totalSteps = 3;
  const stepLabels = ["Personal Info", "Document Info", "Upload Document"];
  const [isLoading, setIsLoading] = useState(false);
  const [applicationid, setApplicationId] = useState();
  const [validateForm, setValidateForm] = useState(true);
  const [error, setError] = useState("");

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleSelectChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep + 1;
      if (newStep <= totalSteps) {
        return newStep;
      }
      return prevStep; // or handle exceeding steps if necessary
    });
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep - 1;
      if (newStep >= 1) {
        return newStep;
      }
      return prevStep; // or handle steps below 1 if necessary
    });
  };

  const isFormValid = () => {
    return (
      country.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      issuedDate.trim() !== "" &&
      validUntil.trim() !== "" &&
      number.trim() !== "" &&
      dob.trim() !== "" &&
      frontFile !== null &&
      backtFile !== null
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (isFormValid()) {
        setValidateForm(true);
        if (currentStep === totalSteps) {
          console.log("Submitting form...");

          // First, create the applicant to get the ID
          const applicantUrl =
            process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/applicant";
          const response = await axios.post(applicantUrl);
          const id = response.data.id;
          setApplicationId(id);

          // Now, upload the document with the ID
          const documentUrl =
            process.env.NEXT_PUBLIC_BACKEND_API +
            "/kyc/applicants/" +
            id +
            "/documents";

          console.log(documentUrl, "documentUrl");

          // Prepare the form data object
          const formDataFront = new FormData();
          formDataFront.append("idDocType", idDocType);
          formDataFront.append("country", country);
          formDataFront.append("firstName", firstName);
          formDataFront.append("lastName", lastName);
          formDataFront.append("issuedDate", issuedDate);
          formDataFront.append("validUntil", validUntil);
          formDataFront.append("number", number);
          formDataFront.append("dob", dob);
          formDataFront.append("placeOfBirth", placeOfBirth);
          formDataFront.append("idDocSubType", "FRONT_SIDE");
          if (frontFile) {
            formDataFront.append("file", frontFile); // frontFile should be a File object
          } else {
            console.error("No front file selected");
          }

          const formDataBack = new FormData();
          formDataBack.append("idDocType", idDocType);
          formDataBack.append("country", country);
          formDataBack.append("firstName", firstName);
          formDataBack.append("lastName", lastName);
          formDataBack.append("issuedDate", issuedDate);
          formDataBack.append("validUntil", validUntil);
          formDataBack.append("number", number);
          formDataBack.append("dob", dob);
          formDataBack.append("placeOfBirth", placeOfBirth);
          formDataBack.append("idDocSubType", "BACK_SIDE");
          if (backtFile) {
            formDataBack.append("file", backtFile); // backFile should be a File object
          } else {
            console.error("No back file selected");
          }

          console.log("Sending front file...");
          const resfront = await axios.post(documentUrl, formDataFront, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Front file response:", resfront);

          console.log("Sending back file...");
          const resBack = await axios.post(documentUrl, formDataBack, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Back file response:", resBack);

          if (resfront.status === 201 && resBack.status === 201) {
            setIsModalOpen(true);
            setFrontFile(null);
            setBackFile(null);
            // setFirstName("");
            // setLastName("");
            setIssuedDate("");
            setValidUntil("");
            setNumber("");
            setDob("");
            setPlaceOfBirth("");
            setFrontFile(null);
            setBackFile(null);

            const statusURL =
              process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/status/" + id;
            const status = await axios.get(statusURL);
            console.log(status, "status");
          }
        }
        setCurrentStep(1);
      } else {
        setValidateForm(false);
      }
    } catch (error) {
      console.error("Error submitting KYC application:", error);
      setError("An error occurred during submission. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const documentOptions = [
    { label: "Driver's License", value: "drivers_license" },
  ];

  const countryOptions = [
    { label: "Afghanistan", value: "AFG" },
    { label: "Albania", value: "ALB" },
    { label: "Algeria", value: "DZA" },
    { label: "Andorra", value: "AND" },
    { label: "Angola", value: "AGO" },
    { label: "Antigua and Barbuda", value: "ATG" },
    { label: "Argentina", value: "ARG" },
    { label: "Armenia", value: "ARM" },
    { label: "Australia", value: "AUS" },
    { label: "Austria", value: "AUT" },
    { label: "Azerbaijan", value: "AZE" },
    { label: "Bahamas", value: "BHS" },
    { label: "Bahrain", value: "BHR" },
    { label: "Bangladesh", value: "BGD" },
    { label: "Barbados", value: "BRB" },
    { label: "Belarus", value: "BLR" },
    { label: "Belgium", value: "BEL" },
    { label: "Belize", value: "BLZ" },
    { label: "Benin", value: "BEN" },
    { label: "Bhutan", value: "BTN" },
    { label: "Bolivia", value: "BOL" },
    { label: "Bosnia and Herzegovina", value: "BIH" },
    { label: "Botswana", value: "BWA" },
    { label: "Brazil", value: "BRA" },
    { label: "Brunei", value: "BRN" },
    { label: "Bulgaria", value: "BGR" },
    { label: "Burkina Faso", value: "BFA" },
    { label: "Burundi", value: "BDI" },
    { label: "Cabo Verde", value: "CPV" },
    { label: "Cambodia", value: "KHM" },
    { label: "Cameroon", value: "CMR" },
    { label: "Canada", value: "CAN" },
    { label: "Central African Republic", value: "CAF" },
    { label: "Chad", value: "TCD" },
    { label: "Chile", value: "CHL" },
    { label: "China", value: "CHN" },
    { label: "Colombia", value: "COL" },
    { label: "Comoros", value: "COM" },
    { label: "Congo (Congo-Brazzaville)", value: "COG" },
    { label: "Costa Rica", value: "CRI" },
    { label: "Croatia", value: "HRV" },
    { label: "Cuba", value: "CUB" },
    { label: "Cyprus", value: "CYP" },
    { label: "Czech Republic", value: "CZE" },
    { label: "Democratic Republic of the Congo", value: "COD" },
    { label: "Denmark", value: "DNK" },
    { label: "Djibouti", value: "DJI" },
    { label: "Dominica", value: "DMA" },
    { label: "Dominican Republic", value: "DOM" },
    { label: "Ecuador", value: "ECU" },
    { label: "Egypt", value: "EGY" },
    { label: "El Salvador", value: "SLV" },
    { label: "Equatorial Guinea", value: "GNQ" },
    { label: "Eritrea", value: "ERI" },
    { label: "Estonia", value: "EST" },
    { label: "Eswatini", value: "SWZ" },
    { label: "Ethiopia", value: "ETH" },
    { label: "Fiji", value: "FJI" },
    { label: "Finland", value: "FIN" },
    { label: "France", value: "FRA" },
    { label: "Gabon", value: "GAB" },
    { label: "Gambia", value: "GMB" },
    { label: "Georgia", value: "GEO" },
    { label: "Germany", value: "DEU" },
    { label: "Ghana", value: "GHA" },
    { label: "Greece", value: "GRC" },
    { label: "Grenada", value: "GRD" },
    { label: "Guatemala", value: "GTM" },
    { label: "Guinea", value: "GIN" },
    { label: "Guinea-Bissau", value: "GNB" },
    { label: "Guyana", value: "GUY" },
    { label: "Haiti", value: "HTI" },
    { label: "Honduras", value: "HND" },
    { label: "Hungary", value: "HUN" },
    { label: "Iceland", value: "ISL" },
    { label: "India", value: "IND" },
    { label: "Indonesia", value: "IDN" },
    { label: "Iran", value: "IRN" },
    { label: "Iraq", value: "IRQ" },
    { label: "Ireland", value: "IRL" },
    { label: "Israel", value: "ISR" },
    { label: "Italy", value: "ITA" },
    { label: "Jamaica", value: "JAM" },
    { label: "Japan", value: "JPN" },
    { label: "Jordan", value: "JOR" },
    { label: "Kazakhstan", value: "KAZ" },
    { label: "Kenya", value: "KEN" },
    { label: "Kiribati", value: "KIR" },
    { label: "Kuwait", value: "KWT" },
    { label: "Kyrgyzstan", value: "KGZ" },
    { label: "Laos", value: "LAO" },
    { label: "Latvia", value: "LVA" },
    { label: "Lebanon", value: "LBN" },
    { label: "Lesotho", value: "LSO" },
    { label: "Liberia", value: "LBR" },
    { label: "Libya", value: "LBY" },
    { label: "Liechtenstein", value: "LIE" },
    { label: "Lithuania", value: "LTU" },
    { label: "Luxembourg", value: "LUX" },
    { label: "Madagascar", value: "MDG" },
    { label: "Malawi", value: "MWI" },
    { label: "Malaysia", value: "MYS" },
    { label: "Maldives", value: "MDV" },
    { label: "Mali", value: "MLI" },
    { label: "Malta", value: "MLT" },
    { label: "Marshall Islands", value: "MHL" },
    { label: "Mauritania", value: "MRT" },
    { label: "Mauritius", value: "MUS" },
    { label: "Mexico", value: "MEX" },
    { label: "Micronesia", value: "FSM" },
    { label: "Moldova", value: "MDA" },
    { label: "Monaco", value: "MCO" },
    { label: "Mongolia", value: "MNG" },
    { label: "Montenegro", value: "MNE" },
    { label: "Morocco", value: "MAR" },
    { label: "Mozambique", value: "MOZ" },
    { label: "Myanmar", value: "MMR" },
    { label: "Namibia", value: "NAM" },
    { label: "Nauru", value: "NRU" },
    { label: "Nepal", value: "NPL" },
    { label: "Netherlands", value: "NLD" },
    { label: "New Zealand", value: "NZL" },
    { label: "Nicaragua", value: "NIC" },
    { label: "Niger", value: "NER" },
    { label: "Nigeria", value: "NGA" },
    { label: "North Korea", value: "PRK" },
    { label: "North Macedonia", value: "MKD" },
    { label: "Norway", value: "NOR" },
    { label: "Oman", value: "OMN" },
    { label: "Pakistan", value: "PAK" },
    { label: "Palau", value: "PLW" },
    { label: "Panama", value: "PAN" },
    { label: "Papua New Guinea", value: "PNG" },
    { label: "Paraguay", value: "PRY" },
    { label: "Peru", value: "PER" },
    { label: "Philippines", value: "PHL" },
    { label: "Poland", value: "POL" },
    { label: "Portugal", value: "PRT" },
    { label: "Qatar", value: "QAT" },
    { label: "Romania", value: "ROU" },
    { label: "Russia", value: "RUS" },
    { label: "Rwanda", value: "RWA" },
    { label: "Saint Kitts and Nevis", value: "KNA" },
    { label: "Saint Lucia", value: "LCA" },
    { label: "Saint Vincent and the Grenadines", value: "VCT" },
    { label: "Samoa", value: "WSM" },
    { label: "San Marino", value: "SMR" },
    { label: "Sao Tome and Principe", value: "STP" },
    { label: "Saudi Arabia", value: "SAU" },
    { label: "Senegal", value: "SEN" },
    { label: "Serbia", value: "SRB" },
    { label: "Seychelles", value: "SYC" },
    { label: "Sierra Leone", value: "SLE" },
    { label: "Singapore", value: "SGP" },
    { label: "Slovakia", value: "SVK" },
    { label: "Slovenia", value: "SVN" },
    { label: "Solomon Islands", value: "SLB" },
    { label: "Somalia", value: "SOM" },
    { label: "South Africa", value: "ZAF" },
    { label: "South Korea", value: "KOR" },
    { label: "South Sudan", value: "SSD" },
    { label: "Spain", value: "ESP" },
    { label: "Sri Lanka", value: "LKA" },
    { label: "Sudan", value: "SDN" },
    { label: "Suriname", value: "SUR" },
    { label: "Sweden", value: "SWE" },
    { label: "Switzerland", value: "CHE" },
    { label: "Syria", value: "SYR" },
    { label: "Taiwan", value: "TWN" },
    { label: "Tajikistan", value: "TJK" },
    { label: "Tanzania", value: "TZA" },
    { label: "Thailand", value: "THA" },
    { label: "Timor-Leste", value: "TLS" },
    { label: "Togo", value: "TGO" },
    { label: "Tonga", value: "TON" },
    { label: "Trinidad and Tobago", value: "TTO" },
    { label: "Tunisia", value: "TUN" },
    { label: "Turkey", value: "TUR" },
    { label: "Turkmenistan", value: "TKM" },
    { label: "Tuvalu", value: "TUV" },
    { label: "Uganda", value: "UGA" },
    { label: "Ukraine", value: "UKR" },
    { label: "United Arab Emirates", value: "ARE" },
    { label: "United Kingdom", value: "GBR" },
    { label: "United States of America", value: "USA" },
    { label: "Uruguay", value: "URY" },
    { label: "Uzbekistan", value: "UZB" },
    { label: "Vanuatu", value: "VUT" },
    { label: "Vatican City", value: "VAT" },
    { label: "Venezuela", value: "VEN" },
    { label: "Vietnam", value: "VNM" },
    { label: "Yemen", value: "YEM" },
    { label: "Zambia", value: "ZMB" },
    { label: "Zimbabwe", value: "ZWE" },
  ];

  return (
    <div className="flex justify-between items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-1/2 bg-primary min-h-screen p-4">
        <div className="text-center">
          <Image
            src={logoSrc}
            alt={altText}
            className="rounded-full"
            width={75}
            height={75}
          />
          <p className="text-4xl font-medium mt-4 text-light">Onboard to AYF</p>
          <div className="mt-8">
            <Stepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </div>
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center w-1/2 p-8 gap-4">
        <Image
          src={logoSrc}
          alt={altText}
          className="rounded-full"
          width={75}
          height={75}
        />
        <h1 className="text-3xl text-primary font-bold  text-center pb-3">
          Investor Onboarding
        </h1>
        <div
          className="w-full max-w-2xl bg-while  p-8 rounded-lg "
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
        >
          <h1 className="text-base text-primary font-semibold  text-center pb-9">
            {currentStep === 1
              ? "*Please provide your personal information, including your name, country, and date of birth"
              : currentStep === 2
              ? "*Upload the necessary document details, such as identification dates and document number"
              : "*Submit the required documents, ensuring all information is accurate and up-to-date"}
          </h1>

          {currentStep === 1 && (
            <div className="flex flex-col p-4 border border-gray rounded-md">
              <InputWithLabel
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleChange(setFirstName)}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleChange(setLastName)}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={handleChange(setEmail)}
                widthfull={true}
                required={true}
              />

              <SelectField
                label="Country"
                value={country}
                onChange={handleChange(setCountry)}
                options={countryOptions}
                className="mb-4"
              />

              <InputWithLabel
                id="placeOfBirth"
                name="placeOfBirth"
                type="text"
                label="Place of Birth (Optional)"
                placeholder="Enter place of birth"
                value={placeOfBirth}
                onChange={handleChange(setPlaceOfBirth)}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                placeholder="Enter date of birth"
                value={dob}
                onChange={handleChange(setDob)}
                widthfull={true}
                required={true}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col p-4 border border-gray rounded-md">
              <InputWithLabel
                id="issuedDate"
                name="issuedDate"
                type="date"
                label="Issued Date"
                placeholder="Enter issued date"
                value={issuedDate}
                onChange={handleChange(setIssuedDate)}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="validUntil"
                name="validUntil"
                type="date"
                label="Valid Until"
                placeholder="Enter valid until date"
                value={validUntil}
                onChange={handleChange(setValidUntil)}
                widthfull={true}
                required={true}
              />
              <SelectField
                label="Document Type:"
                value={idDocType}
                onChange={handleSelectChange(setIdDocType)}
                options={documentOptions}
                className="mb-4"
              />
              <InputWithLabel
                id="number"
                name="number"
                type="text"
                label="Document Number"
                placeholder="Enter document number"
                value={number}
                onChange={handleChange(setNumber)}
                widthfull={true}
                required={true}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col p-2  border-2 border-gray rounded-md">
              <FileUpload
                label="Upload Front of Driver's License"
                onChange={(file) => {
                  setFrontFile(file as File);
                }}
                className="mb-8"
              />
              <FileUpload
                label="Upload Back of Driver's License"
                onChange={(file) => {
                  setBackFile(file as File);
                }}
                className="mb-4"
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-6">
            {!validateForm && (
              <span className="text-base font-semibold text-orange text-pretty mt-7">
                {" "}
                Please Ensure all fields are filled out correctly and try again
              </span>
            )}
            {error && (
              <span className="text-base font-semibold text-red text-pretty mt-7">
                {error}
              </span>
            )}
            <div className="flex justify-between w-full mt-4">
              {currentStep > 1 && (
                <Button
                  text="Previous"
                  className="hover:bg-primary text-primary hover:text-white w-44 py-2"
                  onClick={prevStep}
                />
              )}
              <div className="flex-1 flex justify-end">
                {currentStep < totalSteps ? (
                  <Button
                    text="Next"
                    className="hover:bg-primary text-primary hover:text-white w-44 py-2"
                    onClick={nextStep}
                  />
                ) : (
                  currentStep === totalSteps && (
                    <Button
                      text={`${isLoading ? "Submitting..." : "Submit"}`}
                      className={`hover:bg-primary text-primary hover:text-white w-44 py-2 ${
                        isLoading && "bg-primary text-white"
                      }`}
                      onClick={handleSubmit}
                      disabled={isLoading}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VerificationPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={applicationid as unknown as string}
        firstName={firstName}
        lastName={lastName}
        email={email}
      />
    </div>
  );
};

export default KycDetails;
