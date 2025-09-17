import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const formatHMS = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const EfficiencyDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [allSummaries, setAllSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const allTimerRef = useRef(null);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/efficiency/summary', { withCredentials: true });
      setSummary(res.data);
    } catch (e) {
      console.error(e);
      setError('Failed to load summary');
    }
  };

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/efficiency/all', { withCredentials: true });
      setAllSummaries(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAll();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (allTimerRef.current) clearInterval(allTimerRef.current);
    };
  }, []);

  // Poll if active session
  useEffect(() => {
    if (summary?.isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        fetchSummary();
        fetchAll();
      }, 5000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [summary?.isActive]);

  // Periodically refresh all employees list
  useEffect(() => {
    if (allTimerRef.current) clearInterval(allTimerRef.current);
    allTimerRef.current = setInterval(fetchAll, 10000);
    return () => {
      if (allTimerRef.current) clearInterval(allTimerRef.current);
    };
  }, []);

  const startSession = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/efficiency/start', {}, { withCredentials: true });
      await fetchSummary();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/efficiency/stop', {}, { withCredentials: true });
      await fetchSummary();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to stop session');
    } finally {
      setLoading(false);
    }
  };

  const record = async (type) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/efficiency/record', { type }, { withCredentials: true });
      await fetchSummary();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to record activity');
    } finally {
      setLoading(false);
    }
  };

  const workHMS = useMemo(() => (summary?.session?.workSeconds ? formatHMS(summary.session.workSeconds) : '00:00:00'), [summary?.session?.workSeconds]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee Efficiency</h1>
      {user && (
        <p className="mb-4">Logged in as: <span className="font-semibold">{user.name}</span> ({user.role})</p>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="bg-white shadow rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">All Employees</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allSummaries.map((emp) => (
            <div key={emp.employeeId} className="border rounded p-3">
              <div className="font-semibold">{emp.name}</div>
              <div className="text-sm text-gray-500">{emp.role}</div>
              <div className="mt-2 text-sm text-gray-500">Working Time</div>
              <div className="text-xl font-semibold">{formatHMS(emp.workSeconds || 0)}</div>
              <div className="mt-2 text-sm text-gray-500">Efficiency</div>
              <div className="text-xl font-semibold">{emp.efficiency}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50" onClick={startSession} disabled={loading || summary?.isActive}>Start Session</button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50" onClick={stopSession} disabled={loading || !summary?.isActive}>Stop Session</button>
          <span className="ml-auto text-sm text-gray-600">Session: {summary?.isActive ? 'Active' : (summary?.hasSession ? 'Last Session' : 'No Session')}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 text-sm">Working Time</div>
            <div className="text-xl font-semibold">{workHMS}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Efficiency</div>
            <div className="text-xl font-semibold">{summary?.metrics?.efficiency != null ? `${summary.metrics.efficiency}%` : '-'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Managed Trucks</h2>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <div className="text-gray-500 text-sm">Loading</div>
            <div className="text-2xl font-bold">{summary?.counts?.loading || 0}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Unloading</div>
            <div className="text-2xl font-bold">{summary?.counts?.unloading || 0}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total</div>
            <div className="text-2xl font-bold">{summary?.counts?.total || 0}</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" onClick={() => record('Loading')} disabled={loading || !summary?.isActive}>+ Loading</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50" onClick={() => record('Unloading')} disabled={loading || !summary?.isActive}>+ Unloading</button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Formula: Efficiency = min(200, round(((Loading + 1.1 × Unloading) / HoursWorked) × 25)). Baseline 4 trucks/hour = 100%.
      </div>
    </div>
  );
};

export default EfficiencyDashboard;
