import React from "react";
import AIHeader from "../components/AImodel/AIHeader";
import AICameraView from "../components/AImodel/AICameraView";
import AIStackSummary from "../components/AImodel/AIStackSummary";
import AITable from "../components/AImodel/AITable";
import AIModelContainer from "../components/AImodel/AIModelContainer";
import AIcount from "../components/AImodel/AIcount";

const AIOutput = () => (
  <AIModelContainer>
    <AIHeader />
    <div className="grid grid-cols-3 gap-4">
      <AICameraView className="col-span-2" />
      <div className="flex flex-col space-y-6">
        <AIcount />
        <AIStackSummary />
      </div>
    </div>
    <AITable />
  </AIModelContainer>
);

export default AIOutput;
