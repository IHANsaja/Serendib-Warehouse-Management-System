const employeeModel = require('../models/employeeModel');

/**
 * Get all employees with their efficiency metrics
 */
const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployeesWithEfficiency();
        
        // Calculate efficiency score for each employee
        const employeesWithEfficiency = employees.map(emp => {
            // Calculate efficiency based on work hours and trucks managed
            // Base efficiency: 60% from trucks managed, 40% from work hours
            const trucksEfficiency = emp.totalTrucksManaged > 0 ? Math.min((emp.totalTrucksManaged / 50) * 60, 60) : 0;
            const workHoursEfficiency = emp.totalWorkHours > 0 ? Math.min((emp.totalWorkHours / 160) * 40, 40) : 0;
            const totalEfficiency = Math.round(trucksEfficiency + workHoursEfficiency);
            
            return {
                id: emp.EmployeeID,
                name: emp.Name,
                role: emp.Role,
                email: emp.Email,
                contactInfo: emp.ContactInfo,
                totalWorkHours: parseFloat(emp.totalWorkHours || 0),
                totalSessions: emp.totalSessions || 0,
                totalTrucksManaged: emp.totalTrucksManaged || 0,
                loadings: emp.loadings || 0,
                unloadings: emp.unloadings || 0,
                efficiency: totalEfficiency,
                period: new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
            };
        });

        res.status(200).json(employeesWithEfficiency);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error while fetching employee data.' });
    }
};

/**
 * Get current month efficiency for all employees
 */
const getCurrentMonthEfficiency = async (req, res) => {
    try {
        const employees = await employeeModel.getCurrentMonthEfficiency();
        
        const monthlyData = employees.map(emp => {
            // Calculate monthly efficiency
            const trucksEfficiency = emp.monthlyTrucksManaged > 0 ? Math.min((emp.monthlyTrucksManaged / 20) * 60, 60) : 0;
            const workHoursEfficiency = emp.monthlyWorkHours > 0 ? Math.min((emp.monthlyWorkHours / 160) * 40, 40) : 0;
            const totalEfficiency = Math.round(trucksEfficiency + workHoursEfficiency);
            
            return {
                id: emp.EmployeeID,
                name: emp.Name,
                role: emp.Role,
                monthlyWorkHours: parseFloat(emp.monthlyWorkHours || 0),
                monthlySessions: emp.monthlySessions || 0,
                monthlyTrucksManaged: emp.monthlyTrucksManaged || 0,
                monthlyLoadings: emp.monthlyLoadings || 0,
                monthlyUnloadings: emp.monthlyUnloadings || 0,
                efficiency: totalEfficiency,
                period: new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
            };
        });

        res.status(200).json(monthlyData);
    } catch (error) {
        console.error('Error fetching monthly efficiency:', error);
        res.status(500).json({ message: 'Server error while fetching monthly efficiency data.' });
    }
};

/**
 * Get employee efficiency for a specific date range
 */
const getEmployeeEfficiencyByDateRange = async (req, res) => {
    try {
        const { employeeID, startDate, endDate } = req.params;
        
        if (!employeeID || !startDate || !endDate) {
            return res.status(400).json({ message: 'Employee ID, start date, and end date are required.' });
        }

        const efficiencyData = await employeeModel.getEmployeeEfficiencyByDateRange(employeeID, startDate, endDate);
        
        if (efficiencyData.length === 0) {
            return res.status(404).json({ message: 'No efficiency data found for the specified employee and date range.' });
        }

        res.status(200).json(efficiencyData);
    } catch (error) {
        console.error('Error fetching employee efficiency by date range:', error);
        res.status(500).json({ message: 'Server error while fetching efficiency data.' });
    }
};

/**
 * Get employee login sessions for a specific date
 */
const getEmployeeSessions = async (req, res) => {
    try {
        const { employeeID, date } = req.params;
        
        if (!employeeID || !date) {
            return res.status(400).json({ message: 'Employee ID and date are required.' });
        }

        const sessions = await employeeModel.getEmployeeSessionsByDate(employeeID, date);
        
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching employee sessions:', error);
        res.status(500).json({ message: 'Server error while fetching session data.' });
    }
};

/**
 * Get trucks managed by employee during a specific session
 */
const getSessionTrucks = async (req, res) => {
    try {
        const { sessionID } = req.params;
        
        if (!sessionID) {
            return res.status(400).json({ message: 'Session ID is required.' });
        }

        const trucks = await employeeModel.getTrucksManagedBySession(sessionID);
        
        res.status(200).json(trucks);
    } catch (error) {
        console.error('Error fetching session trucks:', error);
        res.status(500).json({ message: 'Server error while fetching truck data.' });
    }
};

/**
 * Add truck management record for an employee session
 */
const addTruckManagement = async (req, res) => {
    try {
        const truckData = req.body;
        
        // Validate required fields
        const requiredFields = ['SessionID', 'EmployeeID', 'VisitID', 'TruckNumber', 'DriverName', 'OperationType'];
        for (const field of requiredFields) {
            if (!truckData[field]) {
                return res.status(400).json({ message: `${field} is required.` });
            }
        }

        // Set session times if not provided
        if (!truckData.SessionStartTime) {
            truckData.SessionStartTime = new Date();
        }
        if (!truckData.SessionEndTime) {
            truckData.SessionEndTime = null;
        }

        const result = await employeeModel.addTruckManagementRecord(truckData);
        
        res.status(201).json({ 
            message: 'Truck management record added successfully.',
            recordID: result.insertId 
        });
    } catch (error) {
        console.error('Error adding truck management record:', error);
        res.status(500).json({ message: 'Server error while adding truck management record.' });
    }
};

/**
 * Get employee performance summary
 */
const getEmployeePerformanceSummary = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployeesWithEfficiency();
        
        const summary = {
            totalEmployees: employees.length,
            totalWorkHours: employees.reduce((sum, emp) => sum + parseFloat(emp.totalWorkHours || 0), 0),
            totalTrucksManaged: employees.reduce((sum, emp) => sum + (emp.totalTrucksManaged || 0), 0),
            totalLoadings: employees.reduce((sum, emp) => sum + (emp.loadings || 0), 0),
            totalUnloadings: employees.reduce((sum, emp) => sum + (emp.unloadings || 0), 0),
            averageEfficiency: 0,
            topPerformers: []
        };

        // Calculate average efficiency
        if (employees.length > 0) {
            const totalEfficiency = employees.reduce((sum, emp) => {
                const trucksEfficiency = emp.totalTrucksManaged > 0 ? Math.min((emp.totalTrucksManaged / 50) * 60, 60) : 0;
                const workHoursEfficiency = emp.totalWorkHours > 0 ? Math.min((emp.totalWorkHours / 160) * 40, 40) : 0;
                return sum + trucksEfficiency + workHoursEfficiency;
            }, 0);
            summary.averageEfficiency = Math.round(totalEfficiency / employees.length);
        }

        // Get top 3 performers
        summary.topPerformers = employees
            .map(emp => {
                const trucksEfficiency = emp.totalTrucksManaged > 0 ? Math.min((emp.totalTrucksManaged / 50) * 60, 60) : 0;
                const workHoursEfficiency = emp.totalWorkHours > 0 ? Math.min((emp.totalWorkHours / 160) * 40, 40) : 0;
                return {
                    id: emp.EmployeeID,
                    name: emp.Name,
                    role: emp.Role,
                    efficiency: Math.round(trucksEfficiency + workHoursEfficiency)
                };
            })
            .sort((a, b) => b.efficiency - a.efficiency)
            .slice(0, 3);

        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching performance summary:', error);
        res.status(500).json({ message: 'Server error while fetching performance summary.' });
    }
};

module.exports = {
    getAllEmployees,
    getCurrentMonthEfficiency,
    getEmployeeEfficiencyByDateRange,
    getEmployeeSessions,
    getSessionTrucks,
    addTruckManagement,
    getEmployeePerformanceSummary
};