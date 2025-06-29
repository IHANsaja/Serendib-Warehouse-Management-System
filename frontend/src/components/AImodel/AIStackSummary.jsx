// src/components/AImodel/SummaryCard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCheck } from "react-icons/fa";
import { useAIStatus } from "../../context/AIStatusContext"; 
import { toast } from "sonner";

const SummaryCard = () => {
  // Default values until AI runs or user edits
  const [formData, setFormData] = useState({
    totalSacks: 0,
    sacksWithoutErrors: 0,
    overlappingSackPairs: 0,
    positionsOfOverlappingSackPairs: "",
    aiModelCount: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [tempData, setTempData] = useState({ ...formData });
  const [loading, setLoading] = useState(false);
  const { updateStatus } = useAIStatus(); // <-- Use context


  // Keep tempData in sync when formData updates
  useEffect(() => {
    setTempData({ ...formData });
  }, [formData]);

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
    toast.success("Details updated successfully.");
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/aidata/verify-count",
        {
          ManualCount: Number(formData.totalSacks),
          AICount: Number(formData.aiModelCount),
          SacksNoError: Number(formData.sacksWithoutErrors),
          OverlapPairs: Number(formData.overlappingSackPairs),
          OverlapPositions: formData.positionsOfOverlappingSackPairs,
          VisitID: 123,
          IO_ID: 456,
        }
      );
      console.log("Verification Saved:", response.data);
      toast.success("Verification saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Error saving verification.");
    }
  };

  const runAIModel = async () => {
    try {
      setLoading(true);
      updateStatus("Accessing video and canvas...", 10);

      const video = document.getElementById("webcam-video");
      const canvas = document.querySelector("canvas");

      if (!video || !canvas) {
        toast.error("Video or canvas not found.");
        updateStatus("Video or canvas not found.", 100);
        setLoading(false);
        return;
      }

      updateStatus("Capturing frame...", 20);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      const base64Image = tempCanvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");

      updateStatus("Sending image to Roboflow...", 40);
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/sack-counting-x1wzu-lkzgj/1",
        params: { api_key: "BnFrWCGuYJw6CLOyIqiM" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      updateStatus("Processing predictions...", 60);
      const predictions = response.data.predictions || [];
      const total = predictions.length;

      updateStatus("Drawing bounding boxes...", 80);
      const drawCtx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawCtx.clearRect(0, 0, canvas.width, canvas.height);

      predictions.forEach((pred) => {
        const { x, y, width, height, class: label, confidence } = pred;
        drawCtx.strokeStyle = "#A43424";
        drawCtx.lineWidth = 2;
        drawCtx.font = "16px Arial";
        drawCtx.fillText(
          `${label} (${(confidence * 100).toFixed(1)}%)`,
          x - width / 2,
          y - height / 2 - 5
        );
      });

      updateStatus(`Detection complete. ${total} sacks found.`, 100);

      setFormData({
        totalSacks: total,
        sacksWithoutErrors: total,
        overlappingSackPairs: 0,
        positionsOfOverlappingSackPairs: "",
        aiModelCount: total,
      });

      toast.success(`AI detected ${total} sacks.`);
    } catch (err) {
      console.error("Roboflow error:", err.message);
      updateStatus("Error during AI processing.", 100);
      toast.error("Failed to run AI model.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="card-summary text-[color:var(--darkest-red)]">
        <ul className="space-y-4">
          <li className="flex justify-between items-center rounded-lg px-3">
            <span className="font-medium">Total Sacks in the Truck</span>
            <span className="summary-span w-20 h-10">{formData.totalSacks}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg px-3">
            <span className="font-medium">Sacks Without Errors</span>
            <span className="summary-span w-20 h-10">{formData.sacksWithoutErrors}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg px-3">
            <span className="font-medium">Overlapping Sack Pairs</span>
            <span className="summary-span w-20 h-10">{formData.overlappingSackPairs}</span>
          </li>
          <li className="flex justify-between items-center rounded-lg px-3">
            <span className="font-medium">Positions of Overlapping Sack Pairs</span>
            <span className="summary-span w-20 h-10">
              {formData.positionsOfOverlappingSackPairs}
            </span>
          </li>
          <li className="flex justify-between items-center rounded-lg px-3">
            <span className="font-medium">Count got by AI model</span>
            <span className="summary-span w-20 h-10">{formData.aiModelCount}</span>
          </li>
        </ul>
      </div>

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
        <button
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[color:var(--main-red)] hover:bg-[color:var(--darkest-red)]"
          }`}
          onClick={runAIModel}
        >
          {loading ? "Running AI..." : "Run AI Model"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-[rgba(0,0,0,0.1)] flex items-center justify-center">
          <div className="bg-[color:var(--theme-white)] p-6 rounded-lg shadow-lg w-[90%] max-w-md border border-[color:var(--main-red)]">
            <h2 className="text-lg font-semibold mb-4 text-[color:var(--darkest-red)]">
              Edit Summary Details
            </h2>
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