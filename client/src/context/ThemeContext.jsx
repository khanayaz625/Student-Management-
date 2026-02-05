import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Initialize sidebar state based on screen size
    const getInitialSidebarState = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1025;
        }
        return false;
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Track previous width to only trigger state changes on breakpoint cross
    const prevWidthRef = React.useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

    // Handle window resize to auto-open/close sidebar
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const prevWidth = prevWidthRef.current;

            // Only update if we cross the 1025px threshold
            if (width >= 1025 && prevWidth < 1025) {
                // Moving from Mobile to Desktop -> Open
                setIsSidebarOpen(true);
            } else if (width < 1025 && prevWidth >= 1025) {
                // Moving from Desktop to Mobile -> Close
                setIsSidebarOpen(false);
            }

            prevWidthRef.current = width;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isSidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
