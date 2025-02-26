import React, { useState } from 'react';
import { FaCalendarAlt, FaBars } from 'react-icons/fa';

const UnloadingTable = ({ title, data, filterDate, onDateChange }) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <span className="bg-[var(--theme-yellow)] px-4 py-2 rounded-lg font-semibold">Total : {data.length}</span>
                <h3 className="text-lg font-semibold text-[var(--main-red)]">{title}</h3>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <FaBars className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Enter Product ID"
                        className="pl-10 pr-3 py-2 border border-[var(--main-red)] rounded-lg text-sm w-48 
                                    bg-[var(--first-row)] text-[var(--main-red)] placeholder-[var(--main-red)]
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
                {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[var(--first-row)]' : 'bg-[var(--second-row)]'}>
                        <td className="p-3">{item.orderId}</td>
                        <td className="p-3">{item.truckNumber}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.organization}</td>
                        <td className="p-3">{item.itemCode}</td>
                        <td className="p-3">{item.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Unloadings = () => {
    const [filterDate, setFilterDate] = useState('');

    const pendingList = [
        { orderId: 'P2002', truckNumber: 'LP 2020', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-25' },
        { orderId: 'P2003', truckNumber: 'LP 2021', quantity: '1000 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-26' },
        { orderId: 'P2004', truckNumber: 'LP 2022', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-26' },
        { orderId: 'P2005', truckNumber: 'LP 2022', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-27' },
        { orderId: 'P2006', truckNumber: 'LP 2022', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-28' },
        { orderId: 'P2007', truckNumber: 'LP 2022', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-28' },
    ];

    const completedList = [
        { orderId: 'P2005', truckNumber: 'LP 2023', quantity: '500 kg', organization: 'Harischandra', itemCode: 'NH031, BF056', date: '2025-02-25' },
        { orderId: 'P2006', truckNumber: 'LP 2024', quantity: '1000 kg', organization: 'Harischandra', itemCode: 'BF031', date: '2025-02-26' },
        { orderId: 'P2007', truckNumber: 'LP 2024', quantity: '1000 kg', organization: 'Harischandra', itemCode: 'BF031', date: '2025-02-26' },
        { orderId: 'P2008', truckNumber: 'LP 2024', quantity: '1000 kg', organization: 'Harischandra', itemCode: 'BF031', date: '2025-02-26' },
        { orderId: 'P2009', truckNumber: 'LP 2024', quantity: '1000 kg', organization: 'Harischandra', itemCode: 'BF031', date: '2025-02-25' },
    ];

    const filterByDate = (list) =>
        filterDate ? list.filter((item) => item.date === filterDate) : list;

    return (
        <div className="p-6 bg-[#FFF]">
            <UnloadingTable
                title="PENDING LIST"
                data={filterByDate(pendingList)}
                filterDate={filterDate}
                onDateChange={setFilterDate}
            />
            <UnloadingTable
                title="COMPLETED LIST"
                data={filterByDate(completedList)}
                filterDate={filterDate}
                onDateChange={setFilterDate}
            />
        </div>
    );
};

export default Unloadings;
