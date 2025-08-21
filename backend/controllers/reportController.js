// controllers/reportController.js
const reportModel = require('../models/reportModel');

function calculateDelayMinutes(estimated, actual) {
  if (!estimated || !actual) return null;
  const diff = (new Date(actual) - new Date(estimated)) / 60000;
  return Math.round(diff);
}

function formatTime(time) {
  if (!time) return 'N/A';
  return new Date(time).toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function getReport(req, res) {
  try {
    const { visitId } = req.params;
    const data = await reportModel.getReportDataByVisit(visitId);

    if (!data) {
      return res.status(404).json({ message: `No report found for VisitID ${visitId}` });
    }

    // Calculate delays
    const arrivalDelay = calculateDelayMinutes(data.EstimatedArrivalTime, data.ActualArrivalTime);
    const bayInDelay = calculateDelayMinutes(data.EstimatedBayInTime, data.ActualBayInTime);
    const bayOutDelay = calculateDelayMinutes(data.EstimatedBayOutTime, data.ActualBayOutTime);
    const exitDelay = calculateDelayMinutes(data.EstimatedLeaveTime, data.ActualLeaveTime);
    
    // Calculate total time on site
    const totalOnSite = data.ActualArrivalTime && data.ActualLeaveTime ? 
      calculateDelayMinutes(data.ActualArrivalTime, data.ActualLeaveTime) : null;

    // Calculate total delay (from estimated arrival to actual leave)
    const totalDelay = data.EstimatedArrivalTime && data.ActualLeaveTime ? 
      calculateDelayMinutes(data.EstimatedArrivalTime, data.ActualLeaveTime) : null;

    const reportPayload = {
      visitId: data.VisitID,
      customerName: data.CompanyName,
      orderNumber: data.OrderID,
      vehicleNumber: data.VehicleNumber,
      driverName: data.DriverName,
      truckType: data.Type,
      itemCode: data.ItemCode,
      item: data.Item,
      quantity: data.Quantity,
      orderDate: formatTime(data.OrderDate),
      status: data.Status,

      // Arrival times
      estimatedArrival: formatTime(data.EstimatedArrivalTime),
      actualArrival: formatTime(data.ActualArrivalTime),
      arrivalDelay: arrivalDelay ? `${arrivalDelay} min` : 'On Time',

      // Bay times
      estimatedBayIn: formatTime(data.EstimatedBayInTime),
      actualBayIn: formatTime(data.ActualBayInTime),
      bayInDelay: bayInDelay ? `${bayInDelay} min` : 'On Time',

      estimatedBayOut: formatTime(data.EstimatedBayOutTime),
      actualBayOut: formatTime(data.ActualBayOutTime),
      bayOutDelay: bayOutDelay ? `${bayOutDelay} min` : 'On Time',

      // Exit times
      estimatedExit: formatTime(data.EstimatedLeaveTime),
      actualExit: formatTime(data.ActualLeaveTime),
      exitDelay: exitDelay ? `${exitDelay} min` : 'On Time',

      // Summary
      totalDelay: totalDelay ? `${totalDelay} min` : 'N/A',
      totalOnSiteTime: totalOnSite ? `${totalOnSite} min` : 'N/A',

      // Personnel
      securityOfficer: data.SecurityOfficerName || 'N/A',
      executiveOfficer: data.ExecutiveOfficerName || 'N/A',
      
      // Bay information
      bayId: data.BayNumber || 'N/A',
      bayLocation: data.LocationDescription || 'N/A',
      bayStatus: data.BayStatus || 'N/A',

      // Delay analysis
      hasArrivalDelay: arrivalDelay > 0,
      hasBayInDelay: bayInDelay > 0,
      hasBayOutDelay: bayOutDelay > 0,
      hasExitDelay: exitDelay > 0,
      totalDelayMinutes: totalDelay || 0,
      arrivalDelayMinutes: arrivalDelay || 0,
      bayInDelayMinutes: bayInDelay || 0,
      bayOutDelayMinutes: bayOutDelay || 0,
      exitDelayMinutes: exitDelay || 0
    };

    res.json(reportPayload);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getVisitList(req, res) {
  try {
    const visits = await reportModel.getVisitList();
    res.json(visits);
  } catch (err) {
    console.error('Error fetching visit list:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getDelaySummaryReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const summary = await reportModel.getDelaySummaryReport(startDate, endDate);
    
    if (!summary) {
      return res.json({
        totalVisits: 0,
        arrivalDelays: 0,
        bayInDelays: 0,
        bayOutDelays: 0,
        exitDelays: 0,
        avgArrivalDelay: 0,
        avgBayInDelay: 0,
        avgBayOutDelay: 0,
        avgExitDelay: 0,
        avgTotalTime: 0,
        delayPercentage: 0
      });
    }

    const delayPercentage = summary.totalVisits > 0 ? 
      Math.round(((summary.arrivalDelays + summary.bayInDelays + summary.bayOutDelays + summary.exitDelays) / (summary.totalVisits * 4)) * 100) : 0;

    res.json({
      ...summary,
      delayPercentage,
      avgArrivalDelay: Math.round(summary.avgArrivalDelay || 0),
      avgBayInDelay: Math.round(summary.avgBayInDelay || 0),
      avgBayOutDelay: Math.round(summary.avgBayOutDelay || 0),
      avgExitDelay: Math.round(summary.avgExitDelay || 0),
      avgTotalTime: Math.round(summary.avgTotalTime || 0)
    });
  } catch (err) {
    console.error('Error generating delay summary report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getCompanyDelayReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const companies = await reportModel.getCompanyDelayReport(startDate, endDate);
    
    const formattedCompanies = companies.map(company => ({
      ...company,
      avgArrivalDelay: Math.round(company.avgArrivalDelay || 0),
      avgBayInDelay: Math.round(company.avgBayInDelay || 0),
      avgBayOutDelay: Math.round(company.avgBayOutDelay || 0),
      avgExitDelay: Math.round(company.avgExitDelay || 0),
      totalDelays: company.arrivalDelays + company.bayInDelays + company.bayOutDelays + company.exitDelays,
      delayPercentage: company.totalVisits > 0 ? 
        Math.round(((company.arrivalDelays + company.bayInDelays + company.bayOutDelays + company.exitDelays) / (company.totalVisits * 4)) * 100) : 0
    }));

    res.json(formattedCompanies);
  } catch (err) {
    console.error('Error generating company delay report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getBayPerformanceReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const bays = await reportModel.getBayPerformanceReport(startDate, endDate);
    
    const formattedBays = bays.map(bay => ({
      ...bay,
      avgOperationTime: Math.round(bay.avgOperationTime || 0),
      avgBayInDelay: Math.round(bay.avgBayInDelay || 0),
      avgBayOutDelay: Math.round(bay.avgBayOutDelay || 0),
      totalDelays: bay.bayInDelays + bay.bayOutDelays,
      delayPercentage: bay.totalOperations > 0 ? 
        Math.round(((bay.bayInDelays + bay.bayOutDelays) / (bay.totalOperations * 2)) * 100) : 0
    }));

    res.json(formattedBays);
  } catch (err) {
    console.error('Error generating bay performance report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getEmployeePerformanceReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const employees = await reportModel.getEmployeePerformanceReport(startDate, endDate);
    
    const formattedEmployees = employees.map(employee => ({
      ...employee,
      avgArrivalDelay: Math.round(employee.avgArrivalDelay || 0),
      avgBayInDelay: Math.round(employee.avgBayInDelay || 0),
      avgBayOutDelay: Math.round(employee.avgBayOutDelay || 0),
      avgExitDelay: Math.round(employee.avgExitDelay || 0),
      totalDelays: employee.arrivalDelays + employee.bayInDelays + employee.bayOutDelays + employee.exitDelays,
      delayPercentage: employee.totalVisitsHandled > 0 ? 
        Math.round(((employee.arrivalDelays + employee.bayInDelays + employee.bayOutDelays + employee.exitDelays) / (employee.totalVisitsHandled * 4)) * 100) : 0
    }));

    res.json(formattedEmployees);
  } catch (err) {
    console.error('Error generating employee performance report:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { 
  getReport, 
  getVisitList, 
  getDelaySummaryReport,
  getCompanyDelayReport,
  getBayPerformanceReport,
  getEmployeePerformanceReport
};
