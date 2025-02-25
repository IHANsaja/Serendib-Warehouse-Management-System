import '../../CSS/global.css';

const CurrentProcess = () => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">ONGOING</h3>
                <div className="space-y-2">
                    <p className="bay-area">Loading: P2009 - LP 2025</p>
                    <p className="bay-area">Unloading: P2009 - LP 2025</p>
                    <p className="bay-area">Empty Bay</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">COMPLETED</h3>
                <div className="space-y-2">
                    <p className="bay-area">Loading: P2009 - LP 2025</p>
                    <p className="bay-area">Unloading: P2009 - LP 2025</p>
                    <p className="bay-area">Loading: P2009 - LP 2025</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl col-span-2">
                <h3 className="text-lg font-semibold mb-2">PENDING</h3>
                <div className="space-y-2">
                    <p className="bay-area">Loading: 10 trucks</p>
                    <p className="bay-area">Unloading: 25 trucks</p>
                </div>
            </div>
        </section>
    );
};

export default CurrentProcess;