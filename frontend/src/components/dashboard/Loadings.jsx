import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';

// Reusable table component for displaying loading lists
const LoadingTable = ({ title, data, filterDate, onDateChange, searchTerm, onSearchChange }) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <span className="bg-[var(--theme-yellow)] px-4 py-2 rounded-lg font-semibold">Total : {data.length}</span>
                <h3 className="text-lg font-semibold text-[var(--main-red)]">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative w-80">
                    <FaBars className="absolute left-3 top-5 text-[var(--main-red)] opacity-80" />
                    <input
                        type="text"
                        placeholder="Enter Order ID to Search"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-3 py-2 border border-[var(--main-red)] rounded-lg text-sm w-80 
                                   bg-[var(--first-row)] text-[var(--main-red)] placeholder-[var(--main-red)] placeholder:opacity-80 
                                   focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] focus:border-transparent shadow-sm"
                    />
                </div>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="p-2 border border-[var(--main-red)] rounded-lg text-sm w-48 
                               bg-[var(--first-row)] text-[var(--main-red)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] focus:border-transparent shadow-sm"
                />
            </div>
        </div>
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[var(--main-red)] text-white">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Truck Number</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Item Code</th>
                    <th className="p-3">Date</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={item.orderId || index} className={index % 2 === 0 ? 'bg-[var(--first-row)]' : 'bg-[var(--second-row)]'}>
                            <td className="p-3">{item.orderId || "-"}</td>
                            <td className="p-3">{item.truckNumber || "-"}</td>
                            <td className="p-3">{item.quantity || "-"}</td>
                            <td className="p-3">{item.organization || "-"}</td>
                            <td className="p-3">{item.itemCode || "-"}</td>
                            <td className="p-3">{item.date ? item.date.split("T")[0] : "-"}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500">
                            No data found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

// Main component to manage and display loading data
const Loadings = () => {
    const [allData, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // ✅ **FIX: Dynamically build URL with date filter**
            let url = "http://localhost:5000/api/trucks/loading";
            if (filterDate) {
                url += `?date=${filterDate}`;
            }

            try {
                const res = await fetch(url, { credentials: "include" });
                const data = await res.json();
                setAllData(data);
            } catch (err) {
                console.error("Error fetching loading trucks:", err);
                setAllData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filterDate]); // ✅ **FIX: Re-run effect when filterDate changes**

    const pendingList = React.useMemo(() =>
        allData
            .filter(item => item.status && item.status.toLowerCase() === 'pending')
            .filter(item => !searchTerm || (item.orderId != null && String(item.orderId).toLowerCase().includes(searchTerm.toLowerCase()))),
        [allData, searchTerm]
    );

    const completedList = React.useMemo(() =>
        allData
            .filter(item => item.status && item.status.toLowerCase() === 'completed')
            .filter(item => !searchTerm || (item.orderId != null && String(item.orderId).toLowerCase().includes(searchTerm.toLowerCase()))),
        [allData, searchTerm]
    );

    return (
        <div className="p-6 bg-[#FFF]">
             {isLoading ? (
                <div className="p-6 text-center font-semibold text-lg">Loading Truck Data...</div>
             ) : (
                <>
                    <LoadingTable
                        title="PENDING LIST"
                        data={pendingList}
                        filterDate={filterDate}
                        onDateChange={setFilterDate}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                    <LoadingTable
                        title="COMPLETED LIST"
                        data={completedList}
                        filterDate={filterDate}
                        onDateChange={setFilterDate}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                </>
             )}
        </div>
    );
};

export default Loadings;