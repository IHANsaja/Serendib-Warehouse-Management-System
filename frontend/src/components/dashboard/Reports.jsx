import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import VisitTable from "./VisitTable";
import { toast } from "react-toastify";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#A43424" },
  section: { marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { fontWeight: "bold", color: "#6C1509", width: "45%" },
  value: { backgroundColor: "#A43424", color: "#FEF4F3", padding: 5, width: "50%" },
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#A43424" },
  tableRow: { flexDirection: "row" },
  tableCell: { padding: 5, borderWidth: 1, borderColor: "#A43424", fontSize: 10 }
});

const ReportDocument = ({ data, reportType }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {reportType === 'individual' ? `Truck Delay Report - Visit ${data.visitId}` : 
         reportType === 'summary' ? 'Delay Summary Report' :
         reportType === 'company' ? 'Company Delay Analysis Report' :
         reportType === 'bay' ? 'Bay Performance Report' :
         'Employee Performance Report'}
      </Text>

      {reportType === 'individual' && (
        <>
          <View style={styles.section}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>General Information</Text>
            <View style={styles.row}><Text style={styles.label}>Customer Name:</Text><Text style={styles.value}>{data.customerName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Order Number:</Text><Text style={styles.value}>{data.orderNumber}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Truck Type:</Text><Text style={styles.value}>{data.truckType}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Vehicle Number:</Text><Text style={styles.value}>{data.vehicleNumber}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Driver Name:</Text><Text style={styles.value}>{data.driverName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Item:</Text><Text style={styles.value}>{data.item}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Quantity:</Text><Text style={styles.value}>{data.quantity}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Timing & Delays</Text>
            <View style={styles.row}><Text style={styles.label}>Estimated Arrival:</Text><Text style={styles.value}>{data.estimatedArrival}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Actual Arrival:</Text><Text style={styles.value}>{data.actualArrival}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Arrival Delay:</Text><Text style={styles.value}>{data.arrivalDelay}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Estimated Bay-In:</Text><Text style={styles.value}>{data.estimatedBayIn}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Actual Bay-In:</Text><Text style={styles.value}>{data.actualBayIn}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bay-In Delay:</Text><Text style={styles.value}>{data.bayInDelay}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Estimated Bay-Out:</Text><Text style={styles.value}>{data.estimatedBayOut}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Actual Bay-Out:</Text><Text style={styles.value}>{data.actualBayOut}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bay-Out Delay:</Text><Text style={styles.value}>{data.bayOutDelay}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Estimated Exit:</Text><Text style={styles.value}>{data.estimatedExit}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Actual Exit:</Text><Text style={styles.value}>{data.actualExit}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Exit Delay:</Text><Text style={styles.value}>{data.exitDelay}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Total Delay:</Text><Text style={styles.value}>{data.totalDelay}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Total On-Site Time:</Text><Text style={styles.value}>{data.totalOnSiteTime}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Personnel</Text>
            <View style={styles.row}><Text style={styles.label}>Security Officer:</Text><Text style={styles.value}>{data.securityOfficer}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Executive Officer:</Text><Text style={styles.value}>{data.executiveOfficer}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Bay Operation</Text>
            <View style={styles.row}><Text style={styles.label}>Bay ID:</Text><Text style={styles.value}>{data.bayId}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bay Location:</Text><Text style={styles.value}>{data.bayLocation}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Bay Status:</Text><Text style={styles.value}>{data.bayStatus}</Text></View>
          </View>
        </>
      )}

      {reportType === 'summary' && (
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Delay Summary</Text>
          <View style={styles.row}><Text style={styles.label}>Total Visits:</Text><Text style={styles.value}>{data.totalVisits}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Arrival Delays:</Text><Text style={styles.value}>{data.arrivalDelays}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Bay-In Delays:</Text><Text style={styles.value}>{data.bayInDelays}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Bay-Out Delays:</Text><Text style={styles.value}>{data.bayOutDelays}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Exit Delays:</Text><Text style={styles.value}>{data.exitDelays}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Delay Percentage:</Text><Text style={styles.value}>{data.delayPercentage}%</Text></View>
          <View style={styles.row}><Text style={styles.label}>Avg Arrival Delay:</Text><Text style={styles.value}>{data.avgArrivalDelay} min</Text></View>
          <View style={styles.row}><Text style={styles.label}>Avg Bay-In Delay:</Text><Text style={styles.value}>{data.avgBayInDelay} min</Text></View>
          <View style={styles.row}><Text style={styles.label}>Avg Bay-Out Delay:</Text><Text style={styles.value}>{data.avgBayOutDelay} min</Text></View>
          <View style={styles.row}><Text style={styles.label}>Avg Exit Delay:</Text><Text style={styles.value}>{data.avgExitDelay} min</Text></View>
          <View style={styles.row}><Text style={styles.label}>Avg Total Time:</Text><Text style={styles.value}>{data.avgTotalTime} min</Text></View>
        </View>
      )}
    </Page>
  </Document>
);

const Reports = () => {
  const [visitId, setVisitId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("individual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summaryData, setSummaryData] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [bayData, setBayData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const fetchReport = () => {
    if (!visitId) return toast.warning("Please enter VisitID");
    setLoading(true);
    fetch(`http://localhost:5000/api/reports/${visitId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching report:", err);
        setLoading(false);
      });
  };

  const fetchSummaryReport = async () => {
    if (!startDate || !endDate) return toast.warning("Please select date range");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/summary/delay?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      console.error("Error fetching summary report:", err);
    }
    setLoading(false);
  };

  const fetchCompanyReport = async () => {
    if (!startDate || !endDate) return toast.warning("Please select date range");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/company/delay?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      const data = await response.json();
      setCompanyData(data);
    } catch (err) {
      console.error("Error fetching company report:", err);
    }
    setLoading(false);
  };

  const fetchBayReport = async () => {
    if (!startDate || !endDate) return toast.warning("Please select date range");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/bay/performance?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      const data = await response.json();
      setBayData(data);
    } catch (err) {
      console.error("Error fetching bay report:", err);
    }
    setLoading(false);
  };

  const fetchEmployeeReport = async () => {
    if (!startDate || !endDate) return toast.warning("Please select date range");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/employee/performance?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      const data = await response.json();
      setEmployeeData(data);
    } catch (err) {
      console.error("Error fetching employee report:", err);
    }
    setLoading(false);
  };

  const generateReport = () => {
    switch (reportType) {
      case "individual":
        fetchReport();
        break;
      case "summary":
        fetchSummaryReport();
        break;
      case "company":
        fetchCompanyReport();
        break;
      case "bay":
        fetchBayReport();
        break;
      case "employee":
        fetchEmployeeReport();
        break;
      default:
        break;
    }
  };

  const getCurrentReportData = () => {
    switch (reportType) {
      case "individual":
        return reportData;
      case "summary":
        return summaryData;
      case "company":
        return companyData[0]; // For PDF, show first company
      case "bay":
        return bayData[0]; // For PDF, show first bay
      case "employee":
        return employeeData[0]; // For PDF, show first employee
      default:
        return null;
    }
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-main-red mb-4">Comprehensive Delay Management Reports</h2>
      
      {/* Report Type Selection */}
      <div className="mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border p-2 rounded mr-2"
        >
          <option value="individual">Individual Visit Report</option>
          <option value="summary">Delay Summary Report</option>
          <option value="company">Company Delay Analysis</option>
          <option value="bay">Bay Performance Report</option>
          <option value="employee">Employee Performance Report</option>
        </select>
      </div>

      {/* Date Range Selection */}
      {reportType !== "individual" && (
        <div className="mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <span className="mr-2">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </div>
      )}

      {/* Individual Visit Input */}
      {reportType === "individual" && (
        <div className="mb-4">
          <input
            type="text"
            value={visitId}
            onChange={(e) => setVisitId(e.target.value)}
            placeholder="Enter VisitID"
            className="border p-2 rounded mr-2"
          />
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-4">
        <button
          onClick={generateReport}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Report Display */}
      {reportData && reportType === "individual" && (
        <div>
          <div style={{ width: "100%", height: "600px" }}>
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <ReportDocument data={reportData} reportType={reportType} />
            </PDFViewer>
          </div>
          <PDFDownloadLink
            document={<ReportDocument data={reportData} reportType={reportType} />}
            fileName={`Serendib_Warehouse_Report_${reportData.visitId}.pdf`}
          >
            {({ loading }) => (
              <button className="btn-primary mt-3">
                {loading ? "Preparing PDF..." : "Download Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Summary Report Display */}
      {summaryData && reportType === "summary" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Delay Summary Report</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-100 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">{summaryData.totalVisits}</div>
              <div className="text-sm">Total Visits</div>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <div className="text-2xl font-bold text-red-600">{summaryData.delayPercentage}%</div>
              <div className="text-sm">Delay Rate</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <div className="text-2xl font-bold text-yellow-600">{summaryData.avgArrivalDelay}</div>
              <div className="text-sm">Avg Arrival Delay (min)</div>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">{summaryData.avgTotalTime}</div>
              <div className="text-sm">Avg Total Time (min)</div>
            </div>
          </div>
          <PDFDownloadLink
            document={<ReportDocument data={summaryData} reportType={reportType} />}
            fileName={`Delay_Summary_Report_${startDate}_to_${endDate}.pdf`}
          >
            {({ loading }) => (
              <button className="btn-primary">
                {loading ? "Preparing PDF..." : "Download Summary Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Company Report Display */}
      {companyData.length > 0 && reportType === "company" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Company Delay Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Company</th>
                  <th className="border p-2">Total Visits</th>
                  <th className="border p-2">Delay %</th>
                  <th className="border p-2">Avg Arrival Delay</th>
                  <th className="border p-2">Avg Bay Delay</th>
                  <th className="border p-2">Avg Exit Delay</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((company, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-2">{company.CompanyName}</td>
                    <td className="border p-2">{company.totalVisits}</td>
                    <td className="border p-2">{company.delayPercentage}%</td>
                    <td className="border p-2">{company.avgArrivalDelay} min</td>
                    <td className="border p-2">{Math.round((company.avgBayInDelay + company.avgBayOutDelay) / 2)} min</td>
                    <td className="border p-2">{company.avgExitDelay} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bay Report Display */}
      {bayData.length > 0 && reportType === "bay" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Bay Performance Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Bay</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Operations</th>
                  <th className="border p-2">Avg Operation Time</th>
                  <th className="border p-2">Delay %</th>
                  <th className="border p-2">Avg Bay Delay</th>
                </tr>
              </thead>
              <tbody>
                {bayData.map((bay, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-2">{bay.BayNumber}</td>
                    <td className="border p-2">{bay.Type}</td>
                    <td className="border p-2">{bay.totalOperations}</td>
                    <td className="border p-2">{bay.avgOperationTime} min</td>
                    <td className="border p-2">{bay.delayPercentage}%</td>
                    <td className="border p-2">{Math.round((bay.avgBayInDelay + bay.avgBayOutDelay) / 2)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Report Display */}
      {employeeData.length > 0 && reportType === "employee" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Employee Performance Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Employee</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Visits Handled</th>
                  <th className="border p-2">Delay %</th>
                  <th className="border p-2">Avg Arrival Delay</th>
                  <th className="border p-2">Avg Bay Delay</th>
                  <th className="border p-2">Avg Exit Delay</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-2">{employee.EmployeeName}</td>
                    <td className="border p-2">{employee.Role}</td>
                    <td className="border p-2">{employee.totalVisitsHandled}</td>
                    <td className="border p-2">{employee.delayPercentage}%</td>
                    <td className="border p-2">{employee.avgArrivalDelay} min</td>
                    <td className="border p-2">{Math.round((employee.avgBayInDelay + employee.avgBayOutDelay) / 2)} min</td>
                    <td className="border p-2">{employee.avgExitDelay} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <VisitTable />
    </div>
  );
};

export default Reports;
