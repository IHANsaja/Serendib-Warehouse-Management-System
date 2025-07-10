// src/components/common/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaDatabase } from "react-icons/fa";

const Sidebar = ({ selected, onSelect }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md: breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttons = [
    {
      label: "Order Management",
      value: "OrderForm",
      icon: <FaBoxOpen className="w-5 h-5" />,
    },
    {
      label: "Data Management",
      value: "DataManageForm",
      icon: <FaDatabase className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`calc(h-screen-72px) ${
        isMobile ? "w-16 min-w-16" : "w-60 min-w-60"
      } bg-[#6C1509] text-white p-2 md:p-4 flex flex-col items-center pt-4 space-y-4 z-50`}
    >
      {buttons.map((btn) => (
        <button
          key={btn.value}
          className={`flex items-center ${
            isMobile ? "justify-center" : "justify-start"
          } w-full py-3 px-2 rounded-lg transition-all ${
            selected === btn.value ? "bg-[#A43424]" : "hover:bg-[#A43424]"
          }`}
          onClick={() => onSelect(btn.value)}
        >
          <span className="text-xl">{btn.icon}</span>
          {!isMobile && <span className="ml-4">{btn.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
