import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaGlobe, FaLanguage } from 'react-icons/fa';

const LanguageToggle = ({ className = '', showText = true, size = 'md' }) => {
    const { currentLanguage, toggleLanguage, t } = useLanguage();
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-2.5 text-lg'
    };
    
    const buttonClasses = `inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--main-red)] bg-[var(--theme-yellow)] text-[var(--main-red)] hover:bg-[var(--main-red)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-yellow)] shadow-md hover:shadow-lg transition-colors duration-200 ${sizeClasses[size]} ${className}`;
    
    const handleToggle = () => {
        toggleLanguage();
    };
    
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleToggle}
                className={buttonClasses}
                title={`${t('common.switchTo')} ${currentLanguage === 'sinhala' ? 'English' : 'සිංහල'}`}
                aria-label={`${t('common.switchTo')} ${currentLanguage === 'sinhala' ? 'English' : 'සිංහල'}`}
            >
                {currentLanguage === 'sinhala' ? (
                    <>
                        <FaLanguage aria-hidden="true" />
                        <span className="font-bold">සිංහල</span>
                    </>
                ) : (
                    <>
                        <FaGlobe aria-hidden="true" />
                        <span className="font-bold">ENGLISH</span>
                    </>
                )}
            </button>
            
            {showText && (
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FaGlobe className="text-[var(--main-red)]" />
                        <span className="font-medium text-[var(--theme-yellow)]">
                            {currentLanguage === 'sinhala' ? 'සිංහල' : 'English'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageToggle;
