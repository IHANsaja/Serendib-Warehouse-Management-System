import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserTie, FaClock, FaTruck, FaChartLine } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const Employees = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'monthly'

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        fetchEmployeeData();
    }, [viewMode]);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            const endpoint = viewMode === 'monthly' ? '/api/employees/monthly' : '/api/employees';
            const response = await axios.get(`http://localhost:5000${endpoint}`);
            console.log('Employee data received:', response.data);
            
            // Validate and clean the data
            const validatedData = response.data.map(emp => ({
                ...emp,
                totalWorkHours: parseFloat(emp.totalWorkHours) || 0,
                monthlyWorkHours: parseFloat(emp.monthlyWorkHours) || 0,
                totalTrucksManaged: parseInt(emp.totalTrucksManaged) || 0,
                totalSessions: parseInt(emp.totalSessions) || 0,
                monthlySessions: parseInt(emp.monthlySessions) || 0,
                efficiency: parseInt(emp.efficiency) || 0,
                loadings: parseInt(emp.loadings) || 0,
                unloadings: parseInt(emp.unloadings) || 0
            }));
            
            console.log('Validated employee data:', validatedData);
            console.log('Number of employees:', validatedData.length);
            
            setEmployees(validatedData);
            setError(null);
        } catch (error) {
            console.error("Error fetching employee data:", error);
            setError("Failed to fetch employee data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 80) return 'text-green-600';
        if (efficiency >= 60) return 'text-yellow-600';
        if (efficiency >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getEfficiencyBarColor = (efficiency) => {
        if (efficiency >= 80) return 'var(--main-green)';
        if (efficiency >= 60) return 'var(--theme-yellow)';
        if (efficiency >= 40) return 'var(--main-orange)';
        return 'var(--main-red)';
    };

    if (loading) {
        return (
            <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-red)] mx-auto mb-4"></div>
                    <p className="text-[var(--main-red)]">Loading employee data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg">
                <div className="text-center text-[var(--main-red)]">
                    <p className="text-lg font-semibold mb-2">Error</p>
                    <p>{error}</p>
                    <button 
                        onClick={fetchEmployeeData}
                        className="mt-4 px-4 py-2 bg-[var(--main-red)] text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--main-red)] mb-4 md:mb-0 text-center md:text-left flex items-center gap-2">
                    <FaUserTie className="text-[var(--main-red)]" /> Employee Efficiency Overview
                </h1>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'all' 
                                ? 'bg-[var(--main-red)] text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Time
                    </button>
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'monthly' 
                                ? 'bg-[var(--main-red)] text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        This Month
                    </button>
                </div>
            </div>

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
                {filteredEmployees
                    .map((employee) => {
                        // Add safety checks for data
                        if (!employee || typeof employee !== 'object') {
                            console.warn('Invalid employee data:', employee);
                            return null;
                        }
                        
                        const performanceValue = employee.efficiency || 0;
                        const efficiencyColor = getEfficiencyColor(performanceValue);
                        const barColor = getEfficiencyBarColor(performanceValue);
                        
                        return (
                        <motion.div
                            key={employee.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 
                                       transform hover:-translate-y-1 cursor-grab"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-[var(--main-red)]">{employee.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${efficiencyColor} bg-opacity-20`}>
                                    {employee.role}
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3 space-y-1">
                                <p>ID: {employee.id}</p>
                                {employee.email && <p>Email: {employee.email}</p>}
                                {employee.contactInfo && <p>Contact: {employee.contactInfo}</p>}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <motion.div 
                                    className="w-20 h-20"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CircularProgressbar
                                        value={performanceValue}
                                        text={`${Math.round(performanceValue)}%`}
                                        styles={buildStyles({
                                            textSize: '16px',
                                            pathColor: barColor,
                                            textColor: barColor,
                                            trailColor: 'var(--table-row-one)',
                                        })}
                                    />
                                </motion.div>
                                
                                <div className="text-right">
                                    <p className={`text-2xl font-bold ${efficiencyColor}`}>
                                        {Math.round(performanceValue)}%
                                    </p>
                                    <p className="text-xs text-gray-500">Efficiency</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="text-center p-2 bg-blue-50 rounded-lg">
                                    <FaTruck className="mx-auto text-blue-600 mb-1" />
                                    <p className="font-semibold text-blue-600">{employee.totalTrucksManaged || 0}</p>
                                    <p className="text-xs text-gray-600">Total Trucks</p>
                                </div>
                                
                                <div className="text-center p-2 bg-green-50 rounded-lg">
                                    <FaClock className="mx-auto text-green-600 mb-1" />
                                    <p className="font-semibold text-green-600">
                                        {viewMode === 'monthly' 
                                            ? (parseFloat(employee.monthlyWorkHours) || 0).toFixed(1)
                                            : (parseFloat(employee.totalWorkHours) || 0).toFixed(1)
                                        }
                                    </p>
                                    <p className="text-xs text-gray-600">Work Hours</p>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Loadings: <span className="font-medium">{employee.loadings || 0}</span></span>
                                    <span>Unloadings: <span className="font-medium">{employee.unloadings || 0}</span></span>
                                </div>
                                {viewMode === 'all' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Sessions: {employee.totalSessions || 0}
                                    </div>
                                )}
                                {viewMode === 'monthly' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Sessions: {employee.monthlySessions || 0}
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-gray-400 text-center mt-3">
                                Period: {employee.period}
                            </div>
                        </motion.div>
                    );
                })
                .filter(Boolean)}
                
                            {filteredEmployees.length === 0 && (
                <div className="col-span-full text-center text-[var(--main-red)] font-semibold py-8">
                    {searchTerm ? 'No employees found matching your search.' : 'No employees found. Please check if the database has employee data.'}
                </div>
            )}
            </div>

            {filteredEmployees.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <FaChartLine className="text-[var(--main-red)]" />
                        <h3 className="text-lg font-semibold text-[var(--main-red)]">Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">{filteredEmployees.length}</p>
                            <p className="text-gray-500">Total Employees</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">
                                {filteredEmployees.reduce((sum, emp) => sum + (emp.totalTrucksManaged || 0), 0)}
                            </p>
                            <p className="text-gray-500">Total Trucks</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">
                                {filteredEmployees.reduce((sum, emp) => sum + (parseFloat(emp.totalWorkHours) || 0), 0).toFixed(1)}
                            </p>
                            <p className="text-gray-500">Total Hours</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">
                                {Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.efficiency, 0) / filteredEmployees.length)}
                            </p>
                            <p className="text-gray-500">Avg Efficiency</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;