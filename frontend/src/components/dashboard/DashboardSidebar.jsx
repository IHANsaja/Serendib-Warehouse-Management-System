import { FaTachometerAlt, FaTruckLoading, FaTruck, FaFileAlt, FaCog, FaUserTie, FaCalculator } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
    const { t } = useLanguage();
    const menuItems = [
        { key: 'dashboard', icon: <FaTachometerAlt /> },
        { key: 'loadings', icon: <FaTruckLoading /> },
        { key: 'unloadings', icon: <FaTruck /> },
        { key: 'employees', icon: <FaUserTie />},
        { key: 'incomePredictor', icon: <FaCalculator /> },
        { key: 'reports', icon: <FaFileAlt /> },
        { key: 'settings', icon: <FaCog /> },
    ];

    return (
        <aside className="bg-[var(--main-red)] h-screen fixed text-white pt-6 w-full overflow-visible flex flex-col">
            <div className='w-full flex items-center justify-center mb-6 px-4'>
                <h2 className="relative text-xl font-semibold header-head text-center">{t('dashboard.sidebar.appTitle')}</h2>
            </div>
            <ul className="space-y-4 flex-1">
                {menuItems.map((item, index) => {
                    const label = t(`dashboard.sidebar.${item.key}`);
                    return (
                    <li
                        key={index}
                        className={`flex items-center gap-3 w-full h-[50px] z-10 cursor-pointer p-2 pl-6 rounded-e-3xl relative transition-all duration-300 ease-in-out
                                    ${activeTab === item.key
                                ? 'bg-[var(--theme-yellow)] shadow-lg text-[var(--main-red)] w-[105%]'
                                : 'hover:bg-[var(--theme-yellow)] hover:shadow-lg hover:text-[var(--main-red)] hover:w-[105%]'
                            }`}
                        onClick={() => setActiveTab(item.key)}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {label}
                    </li>
                )})}
            </ul>
            <div className="mt-auto p-4 text-center text-sm opacity-80">
                {t('dashboard.sidebar.footer').replace('{year}', new Date().getFullYear())}
            </div>
        </aside>
    );
};

export default DashboardSidebar;