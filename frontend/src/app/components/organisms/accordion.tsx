import React, { ReactNode, useState, useEffect } from "react";

interface AccordionItemProps {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

// AccordionItem component
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        onClick={toggleAccordion}
        className="cursor-pointer p-4 bg-primary text-white flex justify-between items-center rounded-t-md rounded-b-md mb-4"
      >
        <h3 className="m-0 text-xl font-semibold">{title}</h3>
        <span className="font-bold text-xl">{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className="mb-4 shadow-md  rounded-md p-4">{content}</div>}
    </div>
  );
};

// Define the props for the Accordion component
interface AccordionProps {
  data: { title: string; content: ReactNode }[];
}

// Accordion component
const Accordion: React.FC<AccordionProps> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
};

export default Accordion;
