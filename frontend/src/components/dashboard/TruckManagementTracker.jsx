import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTruck, FaUser, FaClock, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';

const TruckManagementTracker = () => {
    const { t } = useLanguage();
    const [truckRecords, setTruckRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [truckVisits, setTruckVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    
    const [formData, setFormData] = useState({
        SessionID: '',
        EmployeeID: '',
        VisitID: '',
        TruckNumber: '',
        DriverName: '',
        OperationType: 'Loading',
        SessionStartTime: '',
        SessionEndTime: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [employeesRes, truckVisitsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/employees'),
                axios.get('http://localhost:5000/api/trucks') // Assuming this endpoint exists
            ]);
            
            setEmployees(employeesRes.data);
            setTruckVisits(truckVisitsRes.data || []);
            
            // For now, we'll use mock data since the truck visits API might not exist
            if (!truckVisitsRes.data) {
                setTruckVisits([
                    { VisitID: 1, VehicleNumber: 'WP-KA-1234', DriverName: 'Ravi Perera', Type: 'Loading' },
                    { VisitID: 2, VehicleNumber: 'WP-CB-5678', DriverName: 'Saman Silva', Type: 'Loading' },
                    { VisitID: 3, VehicleNumber: 'WP-NE-9012', DriverName: 'Kumar Fernando', Type: 'Loading' },
                    { VisitID: 4, VehicleNumber: 'WP-GA-3456', DriverName: 'Priya Wijesinghe', Type: 'Unloading' },
                    { VisitID: 5, VehicleNumber: 'WP-MT-7890', DriverName: 'Ajith Bandara', Type: 'Loading' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                // Update existing record
                await axios.put(`http://localhost:5000/api/employees/truck-management/${editingRecord.RecordID}`, formData);
                setEditingRecord(null);
            } else {
                // Add new record
                await axios.post('http://localhost:5000/api/employees/truck-management', formData);
            }
            
            setFormData({
                SessionID: '',
                EmployeeID: '',
                VisitID: '',
                TruckNumber: '',
                DriverName: '',
                OperationType: 'Loading',
                SessionStartTime: '',
                SessionEndTime: ''
            });
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            console.error('Error saving truck management record:', error);
            alert('Error saving record. Please try again.');
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            SessionID: record.SessionID,
            EmployeeID: record.EmployeeID,
            VisitID: record.VisitID,
            TruckNumber: record.TruckNumber,
            DriverName: record.DriverName,
            OperationType: record.OperationType,
            SessionStartTime: record.SessionStartTime,
            SessionEndTime: record.SessionEndTime
        });
        setShowAddForm(true);
    };

    const handleDelete = async (recordId) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`http://localhost:5000/api/employees/truck-management/${recordId}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('Error deleting record. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            SessionID: '',
            EmployeeID: '',
            VisitID: '',
            TruckNumber: '',
            DriverName: '',
            OperationType: 'Loading',
            SessionStartTime: '',
            SessionEndTime: ''
        });
        setEditingRecord(null);
        setShowAddForm(false);
    };

    if (loading) {
        return (
            <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-red)] mx-auto mb-4"></div>
                    <p className="text-[var(--main-red)]">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--theme-white)] p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[var(--main-red)] flex items-center gap-2">
                    <FaTruck className="text-[var(--main-red)]" /> {t('truck.title')}
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-[var(--main-red)] text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <FaPlus /> {t('truck.addRecord')}
                    </button>
                    
                    <LanguageToggle size="sm" />
                </div>
            </div>

            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                    <h3 className="text-lg font-semibold mb-4 text-[var(--main-red)]">
                        {editingRecord ? t('truck.editRecord') : t('truck.addNewRecord')}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.employee')}</label>
                            <select
                                name="EmployeeID"
                                value={formData.EmployeeID}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            >
                                <option value="">{t('truck.selectEmployee')}</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.truckVisit')}</label>
                            <select
                                name="VisitID"
                                value={formData.VisitID}
                                onChange={(e) => {
                                    const visit = truckVisits.find(v => v.VisitID == e.target.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        VisitID: e.target.value,
                                        TruckNumber: visit ? visit.VehicleNumber : '',
                                        DriverName: visit ? visit.DriverName : '',
                                        OperationType: visit ? visit.Type : 'Loading'
                                    }));
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            >
                                <option value="">{t('truck.selectTruckVisit')}</option>
                                {truckVisits.map(visit => (
                                    <option key={visit.VisitID} value={visit.VisitID}>
                                        {visit.VehicleNumber} - {visit.DriverName} ({visit.Type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.truckNumber')}</label>
                            <input
                                type="text"
                                name="TruckNumber"
                                value={formData.TruckNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.driverName')}</label>
                            <input
                                type="text"
                                name="DriverName"
                                value={formData.DriverName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.operationType')}</label>
                            <select
                                name="OperationType"
                                value={formData.OperationType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            >
                                <option value="Loading">{t('truck.loading')}</option>
                                <option value="Unloading">{t('truck.unloading')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.sessionStartTime')}</label>
                            <input
                                type="datetime-local"
                                name="SessionStartTime"
                                value={formData.SessionStartTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('truck.sessionEndTime')}</label>
                            <input
                                type="datetime-local"
                                name="SessionEndTime"
                                value={formData.SessionEndTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-red)] focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--main-red)] text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {editingRecord ? t('common.update') : t('common.save')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{t('truck.truckManagementRecords')}</h3>
                </div>
                
                {truckRecords.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <FaTruck className="mx-auto text-4xl text-gray-300 mb-2" />
                        <p>{t('truck.noRecordsFound')}</p>
                        <p className="text-sm">{t('truck.clickAddRecord')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('truck.employee')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('truck.truckNumber')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('truck.driverName')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('truck.operationType')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.time')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {truckRecords.map((record) => (
                                    <tr key={record.RecordID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employees.find(emp => emp.id === record.EmployeeID)?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {employees.find(emp => emp.id === record.EmployeeID)?.role || 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.TruckNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.DriverName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                record.OperationType === 'Loading' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {record.OperationType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaClock className="text-gray-400 mr-1" />
                                                <div>
                                                    <div>{t('truck.start')}: {new Date(record.SessionStartTime).toLocaleString()}</div>
                                                    {record.SessionEndTime && (
                                                        <div>{t('truck.end')}: {new Date(record.SessionEndTime).toLocaleString()}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="text-[var(--main-red)] hover:text-red-700"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.RecordID)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TruckManagementTracker;
