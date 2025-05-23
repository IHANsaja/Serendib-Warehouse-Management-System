import data from './summaryData.json';
import axios from 'axios';

const SummaryCard = () => {
  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/aidata/verify-count', {
        ManualCount: data.totalSacks,
        AICount: data.aiModelCount,
        SacksNoError: data.sacksWithoutErrors,
        OverlapPairs: data.overlappingSackPairs,
        OverlapPositions: data.positionsOfOverlappingSackPairs,
        VisitID: 123,  // Replace with actual VisitID
        IO_ID: 456     // Replace with actual Employee ID
      });
      console.log('Verification Saved:', response.data);
      alert("Verification saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Error saving verification.");
    }
  };

  return (
    <>
      <div className="card-summary text-[color:var(--darkest-red)]">
        <ul className="space-y-4">
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Total Sacks in the Truck</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{data.totalSacks}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Sacks Without Errors</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{data.sacksWithoutErrors}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Overlapping Sack Pairs</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{data.overlappingSackPairs}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Positions of Overlapping Sack Pairs</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{data.positionsOfOverlappingSackPairs}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Count got by AI model</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{data.aiModelCount}</span>
          </li>
        </ul>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button className="btn-primary cursor-pointer" onClick={handleVerify}>
          Verify Count
        </button>
      </div>
    </>
  );
};

export default SummaryCard;
