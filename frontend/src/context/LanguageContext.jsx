import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Language data
const languages = {
    sinhala: {
        // Common UI elements
        common: {
            loading: 'පූරණය වෙමින්...',
            error: 'දෝෂයක්',
            retry: 'නැවත උත්සාහ කරන්න',
            save: 'සුරකින්න',
            update: 'යාවත්කාලීන කරන්න',
            delete: 'මකන්න',
            cancel: 'අවලංගු කරන්න',
            search: 'සොයන්න',
            add: 'එකතු කරන්න',
            edit: 'සංස්කරණය කරන්න',
            close: 'වසන්න',
            submit: 'ඉදිරිපත් කරන්න',
            back: 'ආපසු',
            next: 'ඊළඟ',
            previous: 'කලින්',
            total: 'මුළු',
            average: 'සාමාන්‍ය',
            summary: 'සාරාංශය',
            details: 'විස්තර',
            status: 'තත්වය',
            date: 'දිනය',
            time: 'වේලාව',
            period: 'කාල සීමාව',
            actions: 'ක්‍රියා',
            filter: 'පෙරහන්න',
            sort: 'අනුපිළිවෙලට සකස් කරන්න',
            view: 'බලන්න',
            export: 'අපනයනය කරන්න',
            import: 'ආනයනය කරන්න',
            refresh: 'නැවුම් කරන්න',
            settings: 'සැකසුම්',
            profile: 'පැතිකඩ',
            logout: 'පිටවීම',
            login: 'පිවිසීම',
            register: 'ලියාපදිංචි වන්න',
            password: 'මුරපදය',
            username: 'පරිශීලක නාමය',
            email: 'විද්‍යුත් තැපෑල',
            contact: 'සම්බන්ධතාවය',
            phone: 'දුරකථන අංකය',
            address: 'ලිපිනය',
            name: 'නම',
            id: 'හැඳුනුම්පත',
            role: 'භූමිකාව',
            description: 'විස්තරය',
            quantity: 'ප්‍රමාණය',
            amount: 'ප්‍රමාණය',
            price: 'මිල',
            category: 'වර්ගය',
            type: 'වර්ගය',
            location: 'ස්ථානය',
            start: 'ආරම්භය',
            end: 'අවසානය',
            duration: 'කාලය',
            efficiency: 'කාර්යක්ෂමතාව',
            performance: 'කාර්ය සාධනය',
            progress: 'ප්‍රගතිය',
            completed: 'සම්පූර්ණ',
            pending: 'පොරොත්තුවෙන්',
            inProgress: 'ප්‍රගතියෙන්',
            failed: 'අසාර්ථක',
            success: 'සාර්ථක',
            warning: 'අවවාදය',
            info: 'තොරතුරු',
            yes: 'ඔව්',
            no: 'නැත',
            confirm: 'තහවුරු කරන්න',
            select: 'තෝරන්න',
            all: 'සියල්ල',
            none: 'කිසිවක් නැත',
            today: 'අද',
            yesterday: 'ඊයේ',
            tomorrow: 'හෙට',
            thisWeek: 'මේ සතිය',
            thisMonth: 'මේ මාසය',
            thisYear: 'මේ වර්ෂය',
            lastWeek: 'පසුගිය සතිය',
            lastMonth: 'පසුගිය මාසය',
            lastYear: 'පසුගිය වර්ෂය',
            nextWeek: 'ඊළඟ සතිය',
            nextMonth: 'ඊළඟ මාසය',
            nextYear: 'ඊළඟ වර්ෂය',
            switchTo: 'වෙනස් කරන්න'
        },
        
        // Employee efficiency system
        employee: {
            title: 'සේවකයන්',
            allTime: 'සියලු කාලය',
            thisMonth: 'මේ මාසය',
            searchPlaceholder: 'නම, හැඳුනුම්පත, හෝ භූමිකාව අනුව සොයන්න',
            noEmployeesFound: 'සේවකයින් සොයාගත නොහැක.',
            noEmployeesMatching: 'ඔබගේ සොයාගැනීමට ගැලපෙන සේවකයින් නැත.',
            checkDatabase: 'දත්ත ගබඩාවේ සේවක දත්ත තිබේදැයි පරීක්ෂා කරන්න.',
            totalEmployees: 'මුළු සේවකයින්',
            totalTrucks: 'මුළු ට්‍රක් රථ',
            totalHours: 'මුළු පැය',
            avgEfficiency: 'සාමාන්‍ය කාර්යක්ෂමතාව',
            workHours: 'වැඩ පැය',
            totalTrucks: 'මුළු ට්‍රක් රථ',
            sessions: 'සැසි',
            loadings: 'බඩු ගැනීම්',
            unloadings: 'බඩු බෑම්',
            efficiency: 'කාර්යක්ෂමතාව',
            period: 'කාල සීමාව',
            role: {
                executiveOfficer: 'විධායක නිලධාරී',
                securityOfficer: 'ආරක්ෂක නිලධාරී',
                inventoryOfficer: 'භාණ්ඩ ගණන නිලධාරී'
            }
        },
        
        // Truck management
        truck: {
            title: 'ට්‍රක් රථ කළමනාකරණ ට්‍රැකරය',
            addRecord: 'වාර්තාවක් එකතු කරන්න',
            editRecord: 'ට්‍රක් රථ කළමනාකරණ වාර්තාව සංස්කරණය කරන්න',
            addNewRecord: 'නව ට්‍රක් රථ කළමනාකරණ වාර්තාවක් එකතු කරන්න',
            employee: 'සේවකයා',
            truckVisit: 'ට්‍රක් රථ සංචාරය',
            truckNumber: 'ට්‍රක් රථ අංකය',
            driverName: 'රියදුරුගේ නම',
            operationType: 'මෙහෙයුම් වර්ගය',
            sessionStartTime: 'සැසි ආරම්භ වේලාව',
            sessionEndTime: 'සැසි අවසාන වේලාව',
            selectEmployee: 'සේවකයා තෝරන්න',
            selectTruckVisit: 'ට්‍රක් රථ සංචාරය තෝරන්න',
            loading: 'බඩු ගැනීම',
            unloading: 'බඩු බෑම',
            truckManagementRecords: 'ට්‍රක් රථ කළමනාකරණ වාර්තා',
            noRecordsFound: 'ට්‍රක් රථ කළමනාකරණ වාර්තා සොයාගත නොහැක.',
            clickAddRecord: 'ට්‍රක් රථ කළමනාකරණය ට්‍රැක් කිරීමට "වාර්තාවක් එකතු කරන්න" ක්ලික් කරන්න.',
            start: 'ආරම්භය',
            end: 'අවසානය'
        },
        
        // Dashboard elements
        dashboard: {
            title: 'උපකරණ පුවරුව',
            overview: 'දළ විශ්ලේෂණය',
            statistics: 'සංඛ්‍යාලේඛන',
            reports: 'වාර්තා',
            settings: 'සැකසුම්',
            profile: 'පැතිකඩ',
            notifications: 'දැනුම්දීම්',
            help: 'උදව්',
            about: 'ගැන'
        },
        
        // Form elements
        form: {
            required: 'අවශ්‍යයි',
            optional: 'විකල්ප',
            minLength: 'අවම දිග',
            maxLength: 'උපරිම දිග',
            invalidFormat: 'අවලංගු ආකෘතිය',
            passwordMismatch: 'මුරපද නොගැලපේ',
            emailInvalid: 'අවලංගු විද්‍යුත් තැපෑල',
            phoneInvalid: 'අවලංගු දුරකථන අංකය',
            numberInvalid: 'අවලංගු අංකය',
            dateInvalid: 'අවලංගු දිනය',
            timeInvalid: 'අවලංගු වේලාව'
        },
        
        // Messages
        messages: {
            saveSuccess: 'සාර්ථකව සුරකින ලදී',
            updateSuccess: 'සාර්ථකව යාවත්කාලීන කරන ලදී',
            deleteSuccess: 'සාර්ථකව මකා දමන ලදී',
            operationFailed: 'මෙහෙයුම අසාර්ථක විය',
            networkError: 'ජාල දෝෂයක්',
            serverError: 'සර්වර් දෝෂයක්',
            validationError: 'සත්‍යාපන දෝෂයක්',
            permissionDenied: 'අවසරය ප්‍රතික්ෂේප කරන ලදී',
            sessionExpired: 'සැසිය කල් ඉකුත් විය',
            loginRequired: 'පිවිසීම අවශ්‍යයි',
            confirmDelete: 'මෙය මකා දැමීමට ඔබට විශ්වාසද?',
            unsavedChanges: 'සුරකින ලද නොවන වෙනස්කම් තිබේ. ඔබට ඉදිරියට යාමට අවශ්‍යද?'
        }
    },
    
    english: {
        // Common UI elements
        common: {
            loading: 'Loading...',
            error: 'Error',
            retry: 'Retry',
            save: 'Save',
            update: 'Update',
            delete: 'Delete',
            cancel: 'Cancel',
            search: 'Search',
            add: 'Add',
            edit: 'Edit',
            close: 'Close',
            submit: 'Submit',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            total: 'Total',
            average: 'Average',
            summary: 'Summary',
            details: 'Details',
            status: 'Status',
            date: 'Date',
            time: 'Time',
            period: 'Period',
            actions: 'Actions',
            filter: 'Filter',
            sort: 'Sort',
            view: 'View',
            export: 'Export',
            import: 'Import',
            refresh: 'Refresh',
            settings: 'Settings',
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login',
            register: 'Register',
            password: 'Password',
            username: 'Username',
            email: 'Email',
            contact: 'Contact',
            phone: 'Phone',
            address: 'Address',
            name: 'Name',
            id: 'ID',
            role: 'Role',
            description: 'Description',
            quantity: 'Quantity',
            amount: 'Amount',
            price: 'Price',
            category: 'Category',
            type: 'Type',
            location: 'Location',
            start: 'Start',
            end: 'End',
            duration: 'Duration',
            efficiency: 'Efficiency',
            performance: 'Performance',
            progress: 'Progress',
            completed: 'Completed',
            pending: 'Pending',
            inProgress: 'In Progress',
            failed: 'Failed',
            success: 'Success',
            warning: 'Warning',
            info: 'Info',
            yes: 'Yes',
            no: 'No',
            confirm: 'Confirm',
            select: 'Select',
            all: 'All',
            none: 'None',
            today: 'Today',
            yesterday: 'Yesterday',
            tomorrow: 'Tomorrow',
            thisWeek: 'This Week',
            thisMonth: 'This Month',
            thisYear: 'This Year',
            lastWeek: 'Last Week',
            lastMonth: 'Last Month',
            lastYear: 'Last Year',
            nextWeek: 'Next Week',
            nextMonth: 'Next Month',
            nextYear: 'Next Year',
            switchTo: 'Switch to'
        },
        
        // Employee efficiency system
        employee: {
            title: 'Employees',
            allTime: 'All Time',
            thisMonth: 'This Month',
            searchPlaceholder: 'Search by name, ID, or role',
            noEmployeesFound: 'No employees found.',
            noEmployeesMatching: 'No employees found matching your search.',
            checkDatabase: 'Please check if the database has employee data.',
            totalEmployees: 'Total Employees',
            totalTrucks: 'Total Trucks',
            totalHours: 'Total Hours',
            avgEfficiency: 'Avg Efficiency',
            workHours: 'Work Hours',
            totalTrucks: 'Total Trucks',
            sessions: 'Sessions',
            loadings: 'Loadings',
            unloadings: 'Unloadings',
            efficiency: 'Efficiency',
            period: 'Period',
            role: {
                executiveOfficer: 'Executive Officer',
                securityOfficer: 'Security Officer',
                inventoryOfficer: 'Inventory Officer'
            }
        },
        
        // Truck management
        truck: {
            title: 'Truck Management Tracker',
            addRecord: 'Add Record',
            editRecord: 'Edit Truck Management Record',
            addNewRecord: 'Add New Truck Management Record',
            employee: 'Employee',
            truckVisit: 'Truck Visit',
            truckNumber: 'Truck Number',
            driverName: 'Driver Name',
            operationType: 'Operation Type',
            sessionStartTime: 'Session Start Time',
            sessionEndTime: 'Session End Time',
            selectEmployee: 'Select Employee',
            selectTruckVisit: 'Select Truck Visit',
            loading: 'Loading',
            unloading: 'Unloading',
            truckManagementRecords: 'Truck Management Records',
            noRecordsFound: 'No truck management records found.',
            clickAddRecord: 'Click "Add Record" to start tracking truck management.',
            start: 'Start',
            end: 'End'
        },
        
        // Dashboard elements
        dashboard: {
            title: 'Dashboard',
            overview: 'Overview',
            statistics: 'Statistics',
            reports: 'Reports',
            settings: 'Settings',
            profile: 'Profile',
            notifications: 'Notifications',
            help: 'Help',
            about: 'About'
        },
        
        // Form elements
        form: {
            required: 'Required',
            optional: 'Optional',
            minLength: 'Minimum length',
            maxLength: 'Maximum length',
            invalidFormat: 'Invalid format',
            passwordMismatch: 'Passwords do not match',
            emailInvalid: 'Invalid email',
            phoneInvalid: 'Invalid phone number',
            numberInvalid: 'Invalid number',
            dateInvalid: 'Invalid date',
            timeInvalid: 'Invalid time'
        },
        
        // Messages
        messages: {
            saveSuccess: 'Saved successfully',
            updateSuccess: 'Updated successfully',
            deleteSuccess: 'Deleted successfully',
            operationFailed: 'Operation failed',
            networkError: 'Network error',
            serverError: 'Server error',
            validationError: 'Validation error',
            permissionDenied: 'Permission denied',
            sessionExpired: 'Session expired',
            loginRequired: 'Login required',
            confirmDelete: 'Are you sure you want to delete this?',
            unsavedChanges: 'You have unsaved changes. Do you want to continue?'
        }
    }
};

// Language context provider
export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('sinhala');
    
    // Get language data
    const getLanguageData = () => {
        return languages[currentLanguage];
    };
    
    // Get translation for a key
    const t = (key) => {
        const keys = key.split('.');
        let value = getLanguageData();
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key; // Return the key if translation not found
            }
        }
        
        return value;
    };
    
    // Toggle language
    const toggleLanguage = () => {
        setCurrentLanguage(prev => prev === 'sinhala' ? 'english' : 'sinhala');
    };
    
    // Set specific language
    const setLanguage = (lang) => {
        if (languages[lang]) {
            setCurrentLanguage(lang);
        }
    };
    
    // Get current language
    const getCurrentLanguage = () => currentLanguage;
    
    // Check if current language is Sinhala
    const isSinhala = () => currentLanguage === 'sinhala';
    
    // Check if current language is English
    const isEnglish = () => currentLanguage === 'english';
    
    // Save language preference to localStorage
    useEffect(() => {
        localStorage.setItem('preferredLanguage', currentLanguage);
    }, [currentLanguage]);
    
    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && languages[savedLanguage]) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);
    
    const value = {
        currentLanguage,
        getCurrentLanguage,
        setLanguage,
        toggleLanguage,
        t,
        isSinhala,
        isEnglish,
        getLanguageData
    };
    
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
