import React, { useState, useEffect } from 'react';

const CurrentProcess = () => {
    const [processData, setProcessData] = useState({
        ongoing: [],
        completed: []
    });
    const [bayAvailability, setBayAvailability] = useState({
        loading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 },
        unloading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current process data with bay availability
    const fetchCurrentProcess = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/current-process/status-with-availability', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch process data');
            }
            
            const data = await response.json();
            setProcessData({
                ongoing: data.ongoing || [],
                completed: data.completed || []
            });
            setBayAvailability(data.bayAvailability || {
                loading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 },
                unloading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 }
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching current process:', err);
            setError('Failed to load process data');
        } finally {
            setLoading(false);
        }
    };



    // Initial fetch
    useEffect(() => {
        fetchCurrentProcess();
    }, []);

    // Set up automatic updates every 5 seconds for real-time data
    useEffect(() => {
        const updateInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:5000/api/current-process/status-with-availability', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProcessData({
                        ongoing: data.ongoing || [],
                        completed: data.completed || []
                    });
                    setBayAvailability(data.bayAvailability || {
                        loading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 },
                        unloading: { allOccupied: false, totalBays: 3, occupiedBays: 0, availableBays: 3 }
                    });
                }
            } catch (err) {
                console.error('Error fetching updates:', err);
            }
        }, 5000); // 5 seconds for real-time updates

        return () => clearInterval(updateInterval);
    }, []);

    // Format operation display text
    const formatOperationText = (operation) => {
        if (!operation) return '';
        return `${operation.OperationType}: ${operation.VehicleNumber} - ${operation.Item}`;
    };

    // Get operation for specific bay position
    const getOperationForBay = (bayType, bayIndex) => {
        const operations = processData.ongoing.filter(op => op.OperationType === bayType);
        return operations[bayIndex] || null;
    };

    if (loading) {
        return (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-2">Loading...</h3>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-2">Error: {error}</h3>
                </div>
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">
                    LOADING BAYS 
                    <span className="text-sm font-normal ml-2">
                        ({bayAvailability.loading.occupiedBays}/{bayAvailability.loading.totalBays})
                    </span>
                </h3>
                <div className="space-y-2 w-full">
                    {[0, 1, 2].map((bayIndex) => {
                        const operation = getOperationForBay('Loading', bayIndex);
                        
                        return (
                            <div key={bayIndex} className="bay-area p-2 border border-white/20 rounded">
                                {operation ? (
                                    formatOperationText(operation)
                                ) : (
                                    "No ongoing operation"
                                )}
                            </div>
                        );
                    })}
                </div>
                {bayAvailability.loading.allOccupied && (
                    <div className="mt-2 text-yellow-300 text-sm font-semibold">
                        ⚠️ All loading bays occupied - No new operations allowed
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">
                    UNLOADING BAYS 
                    <span className="text-sm font-normal ml-2">
                        ({bayAvailability.unloading.occupiedBays}/{bayAvailability.unloading.totalBays})
                    </span>
                </h3>
                <div className="space-y-2 w-full">
                    {[0, 1, 2].map((bayIndex) => {
                        const operation = getOperationForBay('Unloading', bayIndex);
                        
                        return (
                            <div key={bayIndex} className="bay-area p-2 border border-white/20 rounded">
                                {operation ? (
                                    formatOperationText(operation)
                                ) : (
                                    "No ongoing operation"
                                )}
                            </div>
                    );
                    })}
                </div>
                {bayAvailability.unloading.allOccupied && (
                    <div className="mt-2 text-yellow-300 text-sm font-semibold">
                        ⚠️ All unloading bays occupied - No new operations allowed
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center bg-[#A43424] text-white p-4 rounded-2xl col-span-2">
                <h3 className="text-lg font-semibold mb-2">COMPLETED</h3>
                <div className="space-y-2 w-full">
                    {processData.completed.length > 0 ? (
                        processData.completed.slice(0, 6).map((operation, index) => (
                            <p key={index} className="bay-area">
                                {formatOperationText(operation)}
                            </p>
                        ))
                    ) : (
                        <p className="bay-area">No completed operations</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CurrentProcess;