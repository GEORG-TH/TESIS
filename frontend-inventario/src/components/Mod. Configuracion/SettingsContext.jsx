import React, { createContext, useState, useEffect, useContext } from 'react';

const defaultSettings = {
    theme: 'light',
    density: 'comfortable',
    fontSize: 'medium',
    sidebarCollapsed: false,
    showFooter: true,
};

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const storedSettings = window.localStorage.getItem('appSettings');
            if (!storedSettings) {
                return defaultSettings;
            }
            const parsed = JSON.parse(storedSettings);
            return { ...defaultSettings, ...parsed };
        } catch (error) {
            console.error("Error reading settings from localStorage", error);
            return defaultSettings;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem('appSettings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving settings to localStorage", error);
        }
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value,
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};