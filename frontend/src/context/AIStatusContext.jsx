import { createContext, useContext, useState } from "react";

const AIStatusContext = createContext();

export const useAIStatus = () => useContext(AIStatusContext);

export const AIStatusProvider = ({ children }) => {
  const [aiMessage, setAIMessage] = useState("Waiting for AI...");
  const [aiProgress, setAIProgress] = useState(0);

  const updateStatus = (message, progress) => {
    setAIMessage(message);
    setAIProgress(progress);
  };

  return (
    <AIStatusContext.Provider value={{ aiMessage, aiProgress, updateStatus }}>
      {children}
    </AIStatusContext.Provider>
  );
};
