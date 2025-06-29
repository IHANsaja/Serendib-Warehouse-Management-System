import { useAIStatus } from "../../context/AIStatusContext";

function AIcount() {
  const { aiMessage, aiProgress } = useAIStatus();

  return (
    <div
      className="flex flex-col space-y-4 p-4 rounded-md shadow-lg bg-[#fde5e3] hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold text-[var(--main-red)]">AI Model Status:</div>
        <div className="text-[var(--darkest-red)] text-sm">{aiMessage}</div>
      </div>

      <div className="relative w-full h-3 bg-gray-200 rounded-2xl shadow-inner">
        <div
          className="h-full bg-[var(--main-red)] rounded-2xl shadow-md transition-all duration-500"
          style={{ width: `${aiProgress}%` }}
        ></div>
      </div>

      <div className="text-xs text-right text-[var(--main-red)] mt-1">{aiProgress}%</div>
    </div>
  );
}

export default AIcount;
