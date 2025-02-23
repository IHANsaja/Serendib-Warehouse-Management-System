import React from "react";
import AIHeader from "../components/AImodel/AIHeader";
import AICameraView from "../components/AImodel/AICameraView";
import AIStackSummary from "../components/AImodel/AIStackSummary";
import AITable from "../components/AImodel/AITable";
import AIModelContainer from "../components/AImodel/AIModelContainer";

const AIOutput = () => (
  <AIModelContainer>
    <AIHeader />
    <div className="grid grid-cols-3 gap-4">
      <AICameraView className="col-span-2" />
      <AIStackSummary />
    </div>
    <AITable />
  </AIModelContainer>
);

export default AIOutput;
