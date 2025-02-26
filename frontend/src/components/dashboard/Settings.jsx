import React, { useState } from 'react';
import { FaUserCircle, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';

const Settings = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [darkMode, setDarkMode] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        console.log('Updated Profile:', profile);
        // Implement profile update logic here (e.g., API call)
    };

    const handleLogout = () => {
        console.log('User logged out');
        // Implement logout logic here
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark', !darkMode);
    };

    return (
        <div className="p-6 bg-[var(--theme-white)] rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-[var(--main-red)] mb-4 flex items-center gap-2">
                <FaUserCircle /> Profile Settings
            </h2>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-[var(--main-red)] bg-[var(--table-row-one)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)]"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-[var(--main-red)] bg-[var(--table-row-one)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)]"
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-[var(--main-red)] bg-[var(--table-row-one)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)]"
                />
                <button
                    type="submit"
                    className="md:col-span-2 bg-[var(--main-red)] text-white p-3 rounded-lg hover:bg-opacity-90 transition"
                >
                    Update Profile
                </button>
            </form>

            <div className="mt-8 flex justify-between items-center bg-[var(--table-row-two)] p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[var(--main-red)] flex items-center gap-2">
                    {darkMode ? <FaMoon /> : <FaSun />} Theme: {darkMode ? 'Dark' : 'Light'}
                </h3>
                <button
                    onClick={toggleDarkMode}
                    className="bg-[var(--main-red)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                    Switch to {darkMode ? 'Light' : 'Dark'} Mode
                </button>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default Settings;
