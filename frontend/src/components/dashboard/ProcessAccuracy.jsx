import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { startOfWeek, format, subWeeks, getWeek } from "date-fns";

// This is the main component for displaying the accuracy chart.
const ProcessAccuracy = () => {
    // State to hold the chart data and loading status.
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * This effect hook runs once when the component mounts.
     * It fetches the loading and unloading data from the API endpoints in parallel.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both loading and unloading data concurrently for efficiency.
                const [loadingResponse, unloadingResponse] = await Promise.all([
                    axios.get("http://localhost:5000/api/trucks/loading"),
                    axios.get("http://localhost:5000/api/trucks/unloading"),
                ]);

                // Process the raw data to calculate weekly accuracy.
                const processedData = processTruckData(
                    loadingResponse.data,
                    unloadingResponse.data
                );
                setChartData(processedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                // In a real app, you might set an error state here to show a message to the user.
            } finally {
                // Set loading to false once data is fetched or an error occurs.
                setLoading(false);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures this effect runs only once.

    /**
     * Processes raw truck data to calculate weekly completion accuracy.
     * @param {Array} loadingTrucks - Array of loading truck visit objects.
     * @param {Array} unloadingTrucks - Array of unloading truck visit objects.
     * @returns {Array} - An array formatted for the Recharts line chart.
     */
    const processTruckData = (loadingTrucks, unloadingTrucks) => {
        const weeklyStats = {};

        // 1. Initialize the data structure for the last 5 weeks.
        for (let i = 4; i >= 0; i--) {
            const targetDate = subWeeks(new Date(), i);
            // Use the start date of the week as a unique key (e.g., '2025-07-14').
            const weekKey = format(startOfWeek(targetDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            // Use the ISO week number for the label (e.g., 'Week 30').
            const weekLabel = `Week ${getWeek(targetDate, { weekStartsOn: 1 })}`;
            
            weeklyStats[weekKey] = {
                week: weekLabel,
                Loading: { total: 0, completed: 0 },
                Unloading: { total: 0, completed: 0 },
            };
        }

        // 2. Populate the data structure with loading truck stats.
        loadingTrucks.forEach((truck) => {
            const truckDate = new Date(truck.date);
            const weekKey = format(startOfWeek(truckDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            if (weeklyStats[weekKey]) {
                weeklyStats[weekKey].Loading.total++;
                if (truck.status === "completed") {
                    weeklyStats[weekKey].Loading.completed++;
                }
            }
        });

        // 3. Populate the data structure with unloading truck stats.
        unloadingTrucks.forEach((truck) => {
            const truckDate = new Date(truck.date);
            const weekKey = format(startOfWeek(truckDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            if (weeklyStats[weekKey]) {
                weeklyStats[weekKey].Unloading.total++;
                if (truck.status === "completed") {
                    weeklyStats[weekKey].Unloading.completed++;
                }
            }
        });

        // 4. Calculate accuracy percentages and format for the chart.
        return Object.values(weeklyStats).map((stats) => {
            // Calculate loading accuracy. Returns 0 if no trucks were processed.
            const loadingAccuracy =
                stats.Loading.total > 0
                    ? (stats.Loading.completed / stats.Loading.total) * 100
                    : 0;

            // Calculate unloading accuracy.
            const unloadingAccuracy =
                stats.Unloading.total > 0
                    ? (stats.Unloading.completed / stats.Unloading.total) * 100
                    : 0;

            return {
                week: stats.week,
                Loading: parseFloat(loadingAccuracy.toFixed(1)), // Keep one decimal place.
                Unloading: parseFloat(unloadingAccuracy.toFixed(1)),
            };
        });
    };

    return (
        <div className="bg-[var(--theme-white)] text-[var(--darkest-red)] p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">
                Weekly Completion Accuracy (Loading vs Unloading)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p>Loading Chart Data...</p>
                    </div>
                ) : (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis
                            domain={[0, 100]} // Set Y-axis from 0% to 100%.
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value) => `${value}%`}
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                borderRadius: "0.5rem",
                                border: "1px solid #ddd",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Loading"
                            stroke="#F9CF46" // Yellow
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Unloading"
                            stroke="#A43424" // Red
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default ProcessAccuracy;
