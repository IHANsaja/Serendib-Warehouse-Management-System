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
        <aside className="bg-[var(--main-red)] min-h-full text-white pt-6 w-full">
            <h2 className="relative text-xl font-semibold mb-6 mr-2 ml-2 w-full">Admin Dashboard</h2>
            <ul className="space-y-4">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-3 w-full h-[50px] z-10 cursor-pointer p-2 pl-6 rounded-e-2xl hover:bg-[var(--theme-yellow)] hover:shadow-md hover:text-[var(--main-red)] duration-300 ease-in-out transition-all"
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