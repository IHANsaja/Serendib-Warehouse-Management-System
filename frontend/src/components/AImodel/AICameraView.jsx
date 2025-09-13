import { useRef, useState } from "react";
import LiveCameraFeed from "./LiveCameraFeed";
import { useAIStatus } from "../../context/AIStatusContext";

const AICameraView = () => {
  const feedRef = useRef(null);
  const { updateStatus } = useAIStatus();
  const [sourceType, setSourceType] = useState("camera"); // 'camera' | 'video'
  const [videoUrl, setVideoUrl] = useState(null);
  const [running, setRunning] = useState(false);
  const [uniqueTotal, setUniqueTotal] = useState(0);
  const seenIdsRef = useRef(new Set());

  const onDetections = (predictions) => {
    // predictions contain assigned id from LiveCameraFeed tracker
    const frameCount = predictions?.length || 0;
    if (predictions && predictions.length) {
      for (const p of predictions) {
        if (p.id != null) seenIdsRef.current.add(p.id);
      }
      const uniq = seenIdsRef.current.size;
      setUniqueTotal(uniq);
      updateStatus(`Running: Unique sacks so far ${uniq} (this frame ${frameCount})`, Math.min(99, uniq));
    } else {
      updateStatus(`Running: No sacks detected`, 10);
    }
  };

  const handleStart = () => {
    // reset session state
    seenIdsRef.current = new Set();
    setUniqueTotal(0);
    updateStatus("Starting real-time AI...", 5);
    feedRef.current?.start();
    setRunning(true);
  };

  const handleStop = async () => {
    feedRef.current?.stop();
    setRunning(false);

    const total = uniqueTotal || 0;

    // Update summary via a custom event so AIStackSummary updates its UI
    window.dispatchEvent(new CustomEvent("ai:sessionComplete", { detail: { total } }));

    // Do not save to DB here. Saving should happen only when user clicks "Verify Count".
    updateStatus("Session stopped. Review/edit the summary, then click Verify Count to save.", 95);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  return (
    <div className="card-primary w-full p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around mb-3">
        <div className="flex items-center gap-2">
          <label className="font-medium text-[color:var(--theme-white)]">Source:</label>
          <select
            className="border rounded px-2 py-1"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <option value="camera">Camera</option>
            <option value="video">Video</option>
          </select>
          {sourceType === "video" && (
            <input type="file" accept="video/*" onChange={handleFileChange} />
          )}
        </div>
          <div className="mt-2 text-sm text-[color:var(--theme-white)] bg-[color:var(--darkest-red)] p-2 rounded-md">
              Sacks detected this session: <span className="font-semibold">{uniqueTotal}</span>
          </div>
        <div className="flex items-center">
          <button
            className={`px-4 py-2 rounded-bl-md rounded-tl-md ${running ? "bg-[color:var(--theme-white)] text-[color:var(--darkest-red)] cursor-not-allowed" : "bg-[color:var(--darkest-red)] text-[color:var(--theme-white)] hover:bg-[color:var(--hover-red)]"}`}
            onClick={handleStart}
            disabled={running}
          >
            Start
          </button>
          <button
            className={`px-4 py-2 rounded-br-md rounded-tr-md ${running ? "bg-[color:var(--darkest-red)] text-[color:var(--theme-white)] hover:bg-[color:var(--darkest-red)]" : "bg-[color:var(--theme-white)] text-[color:var(--darkest-red)] cursor-not-allowed"}`}
            onClick={handleStop}
            disabled={!running}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center h-full w-full -translate-y-8">
        <LiveCameraFeed ref={feedRef} onDetections={onDetections} sourceType={sourceType} videoUrl={videoUrl} />
      </div>
    </div>
  );
};

export default AICameraView;
