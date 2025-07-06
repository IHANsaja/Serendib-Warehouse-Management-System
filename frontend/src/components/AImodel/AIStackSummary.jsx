import { useState } from 'react';
import axios from 'axios';
import data from './summaryData.json';
import { FaEdit, FaCheck } from 'react-icons/fa';

const SummaryCard = () => {
  const [formData, setFormData] = useState({
    totalSacks: data.totalSacks,
    sacksWithoutErrors: data.sacksWithoutErrors,
    overlappingSackPairs: data.overlappingSackPairs,
    positionsOfOverlappingSackPairs: data.positionsOfOverlappingSackPairs,
    aiModelCount: data.aiModelCount,
  });

  const [showModal, setShowModal] = useState(false);
  const [tempData, setTempData] = useState({ ...formData });

  const openEditModal = () => {
    setTempData({ ...formData });
    setShowModal(true);
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setFormData({ ...tempData });
    setShowModal(false);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/aidata/verify-count', {
        ManualCount: formData.totalSacks,
        AICount: formData.aiModelCount,
        SacksNoError: formData.sacksWithoutErrors,
        OverlapPairs: formData.overlappingSackPairs,
        OverlapPositions: formData.positionsOfOverlappingSackPairs,
        VisitID: 123,
        IO_ID: 456
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
      {/* Summary */}
      <div className="card-summary text-[color:var(--darkest-red)]">
        <ul className="space-y-4">
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Total Sacks in the Truck</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{formData.totalSacks}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Sacks Without Errors</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{formData.sacksWithoutErrors}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Overlapping Sack Pairs</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{formData.overlappingSackPairs}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Positions of Overlapping Sack Pairs</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{formData.positionsOfOverlappingSackPairs}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
            <span className="font-medium text-sm md:text-base lg:text-lg">Count got by AI model</span>
            <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">{formData.aiModelCount}</span>
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded text-white bg-[color:var(--main-red)] hover:bg-[color:var(--darkest-red)] transition"
          onClick={openEditModal}
        >
          <FaEdit /> Edit
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded text-white bg-[color:var(--main-red)] hover:bg-[color:var(--darkest-red)] transition"
          onClick={handleVerify}
        >
          <FaCheck /> Verify Count
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-[rgba(0,0,0,0.1)] flex items-center justify-center">
          <div className="bg-[color:var(--theme-white)] text-black p-6 rounded-lg shadow-lg w-[90%] max-w-md border border-[color:var(--main-red)]">
            <h2 className="text-lg font-semibold mb-4 text-[color:var(--darkest-red)]">Edit Summary Details</h2>
            <div className="space-y-4">
              {[
                { label: "Total Sacks in the Truck", name: "totalSacks" },
                { label: "Sacks Without Errors", name: "sacksWithoutErrors" },
                { label: "Overlapping Sack Pairs", name: "overlappingSackPairs" },
                { label: "Positions of Overlapping Sack Pairs", name: "positionsOfOverlappingSackPairs" },
                { label: "Count got by AI model", name: "aiModelCount" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={tempData[name]}
                    onChange={handleTempChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[color:var(--main-red)] text-white px-4 py-2 rounded hover:bg-[color:var(--darkest-red)]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryCard;
