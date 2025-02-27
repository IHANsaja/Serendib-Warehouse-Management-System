import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { PDFViewer } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#A43424" },
  container: { padding: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { fontWeight: "bold", color: "#6C1509" },
  value: { backgroundColor: "#A43424", color: "#FEF4F3", padding: 5, marginLeft: 5 }
});

// ReportDocument Component
const ReportDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Report - {data.orderNumber}</Text>
      <View style={styles.container}>
        <View style={styles.row}><Text style={styles.label}>Customer Name:</Text><Text style={styles.value}>{data.customerName}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Order Number:</Text><Text style={styles.value}>{data.orderNumber}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Vehicle Number:</Text><Text style={styles.value}>{data.vehicleNumber}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Driver Name:</Text><Text style={styles.value}>{data.driverName}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Order Date:</Text><Text style={styles.value}>{data.orderDate}</Text></View>
      </View>

      <View style={styles.container}>
        <View style={styles.row}><Text style={styles.label}>Estimated Arrival Time:</Text><Text style={styles.value}>{data.estimatedArrival}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Actual Arrival Time:</Text><Text style={styles.value}>{data.actualArrival}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Arrival Time Delay:</Text><Text style={styles.value}>{data.arrivalDelay}</Text></View>

        <View style={styles.row}><Text style={styles.label}>Estimated Bay In Time:</Text><Text style={styles.value}>{data.estimatedBayIn}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Actual Bay In Time:</Text><Text style={styles.value}>{data.actualBayIn}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Bay In Time Delay:</Text><Text style={styles.value}>{data.bayInDelay}</Text></View>

        <View style={styles.row}><Text style={styles.label}>Estimated Bay Out Time:</Text><Text style={styles.value}>{data.estimatedBayOut}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Actual Bay Out Time:</Text><Text style={styles.value}>{data.actualBayOut}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Bay Out Time Delay:</Text><Text style={styles.value}>{data.bayOutDelay}</Text></View>

        <View style={styles.row}><Text style={styles.label}>Estimated Exit Time:</Text><Text style={styles.value}>{data.estimatedExit}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Actual Exit Time:</Text><Text style={styles.value}>{data.actualExit}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Total Delay:</Text><Text style={styles.value}>{data.totalDelay}</Text></View>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Reason for Delay:</Text>
        <Text style={styles.value}>{data.delayReason}</Text>
      </View>
    </Page>
  </Document>
);

const Reports = () => {
  const [downloaded, setDownloaded] = useState(false); // Track if the file has been downloaded

  const reportData = {
    customerName: "Harischandra",
    orderNumber: "P2009",
    vehicleNumber: "LP - 2026",
    driverName: "Siripala",
    orderDate: "2025/02/09",
    estimatedArrival: "09.00",
    actualArrival: "09.30",
    arrivalDelay: "30 min",
    estimatedBayIn: "09.15",
    actualBayIn: "09.40",
    bayInDelay: "25 min",
    estimatedBayOut: "10.00",
    actualBayOut: "10.25",
    bayOutDelay: "25 min",
    estimatedExit: "10.10",
    actualExit: "10.35",
    totalDelay: "25 min",
    delayReason: "Truck Arrived lately"
  };

  const handleDownloadClick = () => {
    setDownloaded(true); // Set downloaded state to true when button is clicked
  };

  return (
    <div className="text-center p-4 bg-[var(--theme-white)] rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-main-red mb-4">Report Preview</h2>
      <div className="flex flex-col items-center justify-center gap-4">
        <div style={{ width: '100%', height: '600px', zIndex: '10000' }}>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <ReportDocument data={reportData} />
          </PDFViewer>
        </div>

        <PDFDownloadLink
          document={<ReportDocument data={reportData} />}
          fileName={`Serendib_Warehouse_Report_for_${reportData.orderNumber}.pdf`}
        >
          {({ loading, error }) => (
            <button
              className="btn-primary"
              disabled={downloaded} // Disable the button after downloading
              onClick={handleDownloadClick} // Trigger the download action
            >
              {downloaded ? `Serendib_Warehouse_Report_for_${reportData.orderNumber} downloaded!` : "Download Report"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default Reports;
