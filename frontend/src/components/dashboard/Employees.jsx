import React, { useState } from 'react';
import { FaSearch, FaUserTie } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const Employees = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const employeeData = [
        { id: 'E101', name: 'John Doe', role: 'Operator', loadings: 120, unloadings: 100, period: 'Jan 2025', efficiency: '92%' },
        { id: 'E102', name: 'Jane Smith', role: 'Supervisor', loadings: 140, unloadings: 130, period: 'Jan 2025', efficiency: '96%' },
        { id: 'E103', name: 'Emily Johnson', role: 'Operator', loadings: 160, unloadings: 110, period: 'Jan 2025', efficiency: '88%' },
        { id: 'E104', name: 'Michael Brown', role: 'Loader', loadings: 90, unloadings: 85, period: 'Jan 2025', efficiency: '80%' },
    ];

    const filteredEmployees = employeeData.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-red)] mb-6 text-center md:text-left flex items-center gap-2">
                <FaUserTie className="text-[var(--main-red)]" /> Employee Performance Overview
            </h1>

            <div className="flex flex-row justify-center items-center mb-6 relative w-full md:w-1/3">
                <FaSearch className="absolute left-3 top-5 text-[var(--main-red)] opacity-50" />
                <input
                    type="text"
                    placeholder="Search by name, ID, or role"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full ml-5 pl-10 pr-4 py-3 border border-[var(--main-red)] rounded-2xl text-base 
                            bg-[var(--table-row-one)] text-[var(--main-red)] placeholder:text-[var(--main-red)] placeholder:pl-8 placeholder:opacity-50
                            focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] focus:border-transparent shadow"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => {
                    const totalTasks = employee.loadings + employee.unloadings;
                    const performance = ((totalTasks / 300) * 100).toFixed(2);
                    return (
                        <motion.div
                            key={employee.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 
                                       transform hover:-translate-y-1 cursor-grab"
                        >
                            <h3 className="text-lg font-semibold text-[var(--main-red)] mb-2">{employee.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">ID: {employee.id}</p>
                            <p className="text-sm text-gray-600 mb-3">Role: {employee.role}</p>
                            <div className="flex items-center justify-between">
                                <motion.div 
                                    className="w-16 h-16"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CircularProgressbar
                                        value={performance}
                                        text={`${performance}%`}
                                        styles={buildStyles({
                                            textSize: '14px',
                                            pathColor: 'var(--main-red)',
                                            textColor: 'var(--main-red)',
                                            trailColor: 'var(--table-row-one)',
                                        })}
                                    />
                                </motion.div>
                                <div className="text-sm space-y-1">
                                    <p>Loadings: <span className="font-medium">{employee.loadings}</span></p>
                                    <p>Unloadings: <span className="font-medium">{employee.unloadings}</span></p>
                                    <p>Efficiency: <span className="font-semibold text-[var(--main-red)]">{employee.efficiency}</span></p>
                                    <p className="text-xs text-gray-500">Period: {employee.period}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                {filteredEmployees.length === 0 && (
                    <div className="col-span-full text-center text-[var(--main-red)] font-semibold">
                        No employees found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;