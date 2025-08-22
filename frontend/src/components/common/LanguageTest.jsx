import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const LanguageTest = () => {
    const { t, currentLanguage, isSinhala, isEnglish } = useLanguage();
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Language System Test</h2>
            
            <div className="mb-4">
                <LanguageToggle size="lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Current Language: {currentLanguage}</h3>
                    <p>Is Sinhala: {isSinhala() ? 'Yes' : 'No'}</p>
                    <p>Is English: {isEnglish() ? 'Yes' : 'No'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Sample Translations</h3>
                    <p>Loading: {t('common.loading')}</p>
                    <p>Save: {t('common.save')}</p>
                    <p>Cancel: {t('common.cancel')}</p>
                    <p>Search: {t('common.search')}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Employee Translations</h3>
                    <p>Title: {t('employee.title')}</p>
                    <p>All Time: {t('employee.allTime')}</p>
                    <p>This Month: {t('employee.thisMonth')}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Truck Translations</h3>
                    <p>Title: {t('truck.title')}</p>
                    <p>Add Record: {t('truck.addRecord')}</p>
                    <p>Loading: {t('truck.loading')}</p>
                    <p>Unloading: {t('truck.unloading')}</p>
                </div>
            </div>
        </div>
    );
};

export default LanguageTest;
