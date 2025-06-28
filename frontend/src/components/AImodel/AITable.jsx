import { useEffect, useState } from 'react';
import axios from 'axios';

const AITable = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/aidata/records');
        setRecords(data);
      } catch (err) {
        console.error('Failed to load AI records', err);
      }
    };
    fetchData();
  }, []);

  return (
    <table className="w-full mt-4 text-center table-auto rounded-2xl AIdata-table">
      <thead className="table-header">
        <tr>
          {[
            'Verification ID',
            'Manual Count',
            'AI Count',
            'Sacks No Error',
            'Overlap Pairs',
            'Overlap Positions',
            'Verification Date',
            'Visit ID',
            'IO ID',
          ].map((header) => (
            <th key={header} className="text-sm md:text-base lg:text-lg p-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((rec, idx) => (
          <tr
            key={rec.VerifID}
            className={idx % 2 === 0 ? 'bg-[var(--table-row-one)]' : 'bg-[var(--table-row-two)]'}
          >
            <td className="p-2">{rec.VerifID}</td>
            <td className="p-2">{rec.ManualCount}</td>
            <td className="p-2">{rec.AICount}</td>
            <td className="p-2">{rec.SacksNoError}</td>
            <td className="p-2">{rec.OverlapPairs}</td>
            <td className="p-2">{rec.OverlapPositions}</td>
            <td className="p-2">{rec.VerifDate}</td>
            <td className="p-2">{rec.VisitID}</td>
            <td className="p-2">{rec.IO_ID}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AITable;
