//src/components/AImodel/AIcount.jsx
import { useEffect, useState } from "react";
import data from './summaryData.json';

function AIcount() {
  const totalStacks = data.totalSacks;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= totalStacks) {
          clearInterval(interval);
          return totalStacks;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [totalStacks]);

  return (
    <div className="flex flex-col card-count space-y-4">
      <div className="flex flex-row justify-between text-[color:var(--main-red)]">
        <h2 className="text-sm md:text-base lg:text-lg font-semibold">Sack Count</h2>
        <p className="text-sm md:text-base lg:text-lg">{progress}/{totalStacks}</p>
      </div>
      <div className="relative w-full h-1 bg-gray-200 rounded-2xl shadow-inner">
        <div
          className="h-full bg-[var(--main-red)] rounded-2xl shadow-md"
          style={{ width: `${(progress / totalStacks) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default AIcount;
