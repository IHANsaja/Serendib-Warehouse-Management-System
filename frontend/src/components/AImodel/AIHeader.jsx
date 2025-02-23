import React from "react";
import "../../CSS/global.css";
const AIHeader = () => (
  <div className="bg-[var(--main-red)] text-[var(--theme-white)] p-4 rounded-2xl flex justify-between items-center">
    <h1 className="text-xl font-semibold">SERENDIB AI</h1>
    <button className="btn-primary">Real-Time AI Analyse</button>
  </div>
);
export default AIHeader;