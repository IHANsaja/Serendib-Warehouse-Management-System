import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import CurrentProcess from '../components/dashboard/currentProcess';
import ProcessAccuracy from '../components/dashboard/ProcessAccuracy';
import ProcessStatus from '../components/dashboard/ProcessStatus';

const DashboardPage = () => {
    return (
        <div className="flex min-h-screen font-roboto">
            <aside className="w-1/6">
                <DashboardSidebar />
            </aside>
            <main className="w-5/6 p-4 bg-[#FFF]">
                <DashboardHeader />
                <section className="my-4">
                    <CurrentProcess />
                </section>
                <section className="grid grid-cols-1 gap-6">
                    <ProcessAccuracy />
                    <ProcessStatus />
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
