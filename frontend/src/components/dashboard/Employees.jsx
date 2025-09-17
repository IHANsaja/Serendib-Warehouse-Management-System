import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { FaSearch, FaUserTie } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// Format seconds to HH:MM:SS
const formatHMS = (seconds) => {
    const h = Math.floor((seconds || 0) / 3600);
    const m = Math.floor(((seconds || 0) % 3600) / 60);
    const s = (seconds || 0) % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const Employees = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]); // State to hold data from API

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Use efficiency summaries API
                const response = await axios.get('http://localhost:5000/api/efficiency/all', { withCredentials: true });
                const list = Array.isArray(response.data) ? response.data : [];
                const mapped = list.map((emp) => ({
                    id: emp.employeeId,
                    name: emp.name,
                    role: emp.role,
                    efficiency: emp.efficiency ?? 0,
                    loadings: emp.counts?.loading ?? 0,
                    unloadings: emp.counts?.unloading ?? 0,
                    workSeconds: emp.workSeconds ?? 0,
                    workingTime: formatHMS(emp.workSeconds ?? 0),
                    period: emp.isActive ? 'Current Session' : (emp.hasSession ? 'Last Session' : '-')
                }));
                setEmployees(mapped);
            } catch (error) {
                console.error("Error fetching employee data:", error);
                setEmployees([]);
            }
        };

        fetchEmployeeData();
        const interval = setInterval(fetchEmployeeData, 10000); // refresh periodically
        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this runs only once

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-red)] mb-6 text-center md:text-left flex items-center gap-2">
                <FaUserTie className="text-[var(--main-red)]" /> {t('employee.title')} {t('employee.overview') || ''}
            </h1>

            <div className="flex flex-row justify-center items-center mb-6 relative w-full md:w-1/3">
                <FaSearch className="absolute left-3 top-5 text-[var(--main-red)] opacity-50" />
                <input
                    type="text"
                    placeholder={t('employee.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full ml-5 pl-10 pr-4 py-3 border border-[var(--main-red)] rounded-2xl text-base 
                               bg-[var(--table-row-one)] text-[var(--main-red)] placeholder:text-[var(--main-red)] placeholder:pl-8 placeholder:opacity-50
                               focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] focus:border-transparent shadow"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => {
                    const performanceValue = employee.efficiency;
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
                                        value={performanceValue}
                                        text={`${Math.round(performanceValue)}%`}
                                        styles={buildStyles({
                                            textSize: '14px',
                                            pathColor: 'var(--main-red)',
                                            textColor: 'var(--main-red)',
                                            trailColor: 'var(--table-row-one)',
                                        })}
                                    />
                                </motion.div>
                                <div className="text-sm space-y-1">
                                    <p>Work Time: <span className="font-medium">{employee.workingTime}</span></p>
                                    <p>{t('employee.loadings')}: <span className="font-medium">{employee.loadings}</span></p>
                                    <p>{t('employee.unloadings')}: <span className="font-medium">{employee.unloadings}</span></p>
                                    <p>{t('employee.efficiency')}: <span className="font-semibold text-[var(--main-red)]">{performanceValue}%</span></p>
                                    <p className="text-xs text-gray-500">{t('employee.period')}: {employee.period}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                {filteredEmployees.length === 0 && (
                    <div className="col-span-full text-center text-[var(--main-red)] font-semibold">
                        {t('employee.noEmployeesFound')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;