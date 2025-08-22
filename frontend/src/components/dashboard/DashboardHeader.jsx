import LanguageToggle from '../common/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

const DashboardHeader = ({ title }) => {
    const { t } = useLanguage();
    return (
        <header className="bg-[var(--theme-white)] p-4 rounded-2xl shadow-md mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#A43424]">{title}</h1>
            <LanguageToggle size="sm" />
        </header>
    );
};

export default DashboardHeader;
