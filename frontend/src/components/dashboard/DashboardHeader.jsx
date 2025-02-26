const DashboardHeader = ({ title }) => {
    return (
        <header className="bg-[var(--theme-white)] p-4 rounded-2xl shadow-md mb-4">
            <h1 className="text-2xl font-semibold text-[#A43424]">{title}</h1>
        </header>
    );
};

export default DashboardHeader;
