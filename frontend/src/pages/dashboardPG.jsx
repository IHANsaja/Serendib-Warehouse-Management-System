import React, { useState, useEffect } from 'react';
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
import IncomePredictor from '../components/dashboard/IncomePredict';
import { FaBars, FaTimes } from 'react-icons/fa';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size and update state
    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <>
                        <section className="my-4">
                            <CurrentProcess />
                        </section>
                        <section className="flex flex-col gap-6">
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
            case 'Income Predictor':
                return <IncomePredictor />;
            default:
                return <p>Content not found</p>;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Mobile menu button */}
            {isMobile && (
                <button 
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-[var(--main-red)] text-white rounded-md shadow-lg"
                >
                    {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            )}

            {/* Sidebar with responsive behavior */}
            <div className={`fixed lg:relative h-full z-40 transition-transform duration-300 ease-in-out
                    ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                    w-64 lg:w-1/6`}>
                <div className="h-full bg-[var(--main-red)]">
                    <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <main className="flex-1 p-4 bg-[#FFF] lg:ml-0 mt-0 lg:mt-0">
                <DashboardHeader title={activeTab} />
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;