import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CurrentProcess from '../components/dashboard/CurrentProcess';
import ProcessAccuracy from '../components/dashboard/ProcessAccuracy';
import ProcessStatus from '../components/dashboard/ProcessStatus';
import Loadings from '../components/dashboard/Loadings';
import Unloadings from '../components/dashboard/Unloadings';
import Reports from '../components/dashboard/Reports';
import Settings from '../components/dashboard/Settings';
import Employees from '../components/dashboard/Employees';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <>
                        <section className="my-4">
                            <CurrentProcess />
                        </section>
                        <section className="grid grid-cols-1 gap-6">
                            <ProcessAccuracy />
                            <ProcessStatus />
                        </section>
                    </>
                );
            case 'Loadings':
                return <Loadings />;
            case 'Unloadings':
                return <Unloadings />;
            case 'Employees':
                return <Employees />;
            case 'Reports':
                return <Reports />;
            case 'Settings':
                return <Settings />;
            default:
                return <p>Content not found</p>;
        }
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-1/6">
                <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </aside>
            <main className="w-5/6 p-4 bg-[#FFF]">
                {/* ✅ Passing activeTab as title */}
                <DashboardHeader title={activeTab} />
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;
