import React, { ReactNode, useState, useEffect } from "react";

// Define the props for the AccordionItem component
interface AccordionItemProps {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean; // Optional prop for default open state
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
        className="cursor-pointer p-2.5 bg-gray border-b border-black flex justify-between items-center rounded-t-md rounded-b-md"
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {isOpen ? "-" : "+"}
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderTop: "none",
          }}
        >
          {content}
        </div>
      )}
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
          defaultOpen={index === 0} // Open the first item by default
        />
      ))}
    </div>
  );
};

export default Accordion;
