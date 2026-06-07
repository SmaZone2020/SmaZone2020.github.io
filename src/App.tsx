import { useState, useEffect } from 'react';
import { BottomNav } from './layout/BottomNav';
import Sidebar from './layout/Navbar';
import AppRoutes from './routes';
import { siteConfig } from './config/site';

export function setTitle(title: string) {
    document.title = siteConfig.name + (title ? ` - ${title}` : '');
}

const Navigation = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            {!isSmallScreen && (
                <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
            )}
            {isSmallScreen && <BottomNav />}
            <div
                className={`transition-all duration-300 py-4 ${
                    isSmallScreen ? '' : sidebarCollapsed ? 'ml-20' : 'ml-56'
                }`}
                style={{
                    '--sidebar-offset': isSmallScreen ? '0px' : sidebarCollapsed ? '80px' : '224px',
                } as React.CSSProperties}
            >
                <AppRoutes />
            </div>
        </>
    );
};

export default Navigation;
