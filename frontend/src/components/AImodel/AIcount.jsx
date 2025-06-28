// src/components/AImodel/AIcount.jsx
import { useEffect, useState } from "react";

function AIcount() {
  const [totalStacks, setTotalStacks] = useState(0);        // user-input total
  const [progress, setProgress] = useState(0);              // counter progress
  const [counting, setCounting] = useState(false);          // track whether to start counting

  // Handle counter
  useEffect(() => {
    if (!counting || totalStacks === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= totalStacks) {
          clearInterval(interval);
          return totalStacks;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [counting, totalStacks]);

  const handleStart = () => {
    if (totalStacks > 0) {
      setProgress(0);
      setCounting(true);
    }
  };

  return (
    <div className="flex flex-col card-count space-y-4">
      {/* Input for total stack count */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-[color:var(--main-red)]">
          Enter Total Sack Count:
        </label>
        <input
          type="number"
          value={totalStacks}
          onChange={(e) => setTotalStacks(Number(e.target.value))}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={handleStart}
          className="mt-2 px-4 py-2 text-white bg-[color:var(--main-red)] hover:bg-[color:var(--darkest-red)] rounded"
        >
          Start Counting
        </button>
      </div>

      {/* Display progress */}
      <div className="flex flex-row justify-between text-[color:var(--main-red)] mt-4">
        <h2 className="text-sm md:text-base lg:text-lg font-semibold">Sack Count</h2>
        <p className="text-sm md:text-base lg:text-lg">{progress}/{totalStacks}</p>
      </div>
      <div className="relative w-full h-1 bg-gray-200 rounded-2xl shadow-inner">
        <div
          className="h-full bg-[color:var(--main-red)] rounded-2xl shadow-md"
          style={{ width: `${(progress / totalStacks) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default AIcount;
