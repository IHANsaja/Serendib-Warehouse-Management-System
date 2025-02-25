import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const loadingData = [
    { name: "Within Time Limit", value: 42 },
    { name: "Out of Time Limit", value: 8 },
];

const COLORS = ["#A43424", "#FFE7E3"];

const renderPieChart = (data, title) => (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        <p>Within Time Limit: {data[0].value}</p>
        <p>Out of Time Limit: {data[1].value}</p>
    </div>
);

const ProcessStatus = () => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderPieChart(loadingData, "Loading Status")}
            {renderPieChart(loadingData, "Unloading Status")}
        </section>
    );
};

export default ProcessStatus;