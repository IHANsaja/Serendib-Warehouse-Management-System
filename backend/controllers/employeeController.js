const employeeModel = require('../models/employeeModel');

const getEmployeePerformance = async (req, res) => {
    try {
        const employees = await employeeModel.findAllWithPerformance();

        // Define the monthly performance target for trucks managed
        const MONTHLY_TARGET = 250; 

        const performanceData = employees.map(emp => {
            // Calculate efficiency based on trucks managed
            const calculatedEfficiency = MONTHLY_TARGET > 0 
                ? (emp.totalTrucksManaged / MONTHLY_TARGET) * 100 
                : 0;
            
            // Cap efficiency at 100% for a standard visual representation
            const efficiency = Math.min(calculatedEfficiency, 100);

            return {
                id: emp.id,
                name: emp.name,
                role: emp.role,
                loadings: emp.totalTrucksManaged || 0, // Use totalTrucksManaged for loadings
                unloadings: emp.totalTrucksManaged || 0, // Use totalTrucksManaged for unloadings
                totalTrucksManaged: emp.totalTrucksManaged || 0,
                totalWorkingHours: parseFloat(emp.totalWorkingHours || 0).toFixed(2),
                period: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
                efficiency: parseFloat(efficiency.toFixed(2))
            };
        });

        res.status(200).json(performanceData);
    } catch (error) {
        console.error('Error fetching employee performance:', error);
        res.status(500).json({ message: 'Server error while fetching employee data.' });
    }
};

module.exports = {
    getEmployeePerformance
};