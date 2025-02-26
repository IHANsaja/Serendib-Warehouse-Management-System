import '../../CSS/global.css';
import { FaTachometerAlt, FaTruckLoading, FaTruck, FaFileAlt, FaCog } from 'react-icons/fa';

const DashboardSidebar = () => {
    const menuItems = [
        { name: "Dashboard", icon: <FaTachometerAlt /> },
        { name: "Loadings", icon: <FaTruckLoading /> },
        { name: "Unloadings", icon: <FaTruck /> },
        { name: "Reports", icon: <FaFileAlt /> },
        { name: "Settings", icon: <FaCog /> },
    ];

    return (
        <aside className="bg-[var(--main-red)] min-h-full text-white pt-6 w-full relative overflow-visible">
            <div className='w-full flex items-center justify-center mb-6'>
                <h2 className="relative text-xl font-semibold header-head w-[80%] text-center">SERENDIB WMS</h2>
            </div>
            <ul className="space-y-4">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-3 w-full h-[50px] z-10 cursor-pointer p-2 pl-6 rounded-e-3xl relative transition-all duration-300 ease-in-out
                                   hover:bg-[var(--theme-yellow)] hover:shadow-lg hover:text-[var(--main-red)] hover:w-[105%]"
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default DashboardSidebar;
