import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { week: "Week 1", Loading: 75, Unloading: 72 },
    { week: "Week 2", Loading: 78, Unloading: 74 },
    { week: "Week 3", Loading: 82, Unloading: 79 },
    { week: "Week 4", Loading: 88, Unloading: 85 },
    { week: "Week 5", Loading: 92, Unloading: 90 },
];

const ProcessAccuracy = () => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">Accuracy Increase Over Time (Loading vs Unloading)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Loading" stroke="#F9CF46" strokeWidth={3} />
                    <Line type="monotone" dataKey="Unloading" stroke="#A43424" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProcessAccuracy;