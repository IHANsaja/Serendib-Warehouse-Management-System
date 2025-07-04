// src/pages/AIresponsePG.jsx
import AIHeader from "../components/AImodel/AIHeader";
import AICameraView from "../components/AImodel/AICameraView";
import AIStackSummary from "../components/AImodel/AIStackSummary";
import AITable from "../components/AImodel/AITable";
import AIModelContainer from "../components/AImodel/AIModelContainer";
import AIcount from "../components/AImodel/AIcount";

const AIresponsePG = () => (
  <div>
    <AIHeader />
    <AIModelContainer>
      <div className="grid md:grid-cols-2 gap-4">
        <AICameraView className="col-span-2s" />
        <div className="flex flex-col space-y-6">
          <AIcount />
          <AIStackSummary />
        </div>
      </div>
      <AITable />
    </AIModelContainer>
  </div>
);

export default AIresponsePG;
