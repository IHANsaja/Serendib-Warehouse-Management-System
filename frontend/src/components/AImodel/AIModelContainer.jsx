import React from "react";
import "../../CSS/global.css";
const AIModelContainer = ({ children }) => (
  <div className="space-y-6 p-6 bg-[var(--theme-white)] rounded-2xl shadow-lg">
    {children}
  </div>
);
export default AIModelContainer;