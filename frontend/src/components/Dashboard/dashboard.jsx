import { useState } from 'react';
import Header from './Header.jsx';
import Sidebar from './SideBar.jsx';
import MainContent from './MainContent.jsx';
// --- ICON COMPONENTS (No changes needed here) ---


// --- SIDEBAR COMPONENT (Updated) ---


// --- MAIN CONTENT COMPONENT (Updated with Dashboard Cards) ---


// --- DASHBOARD COMPONENT (No changes needed) ---
const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <MainContent />
            </div>
        </div>
    );
};

export default Dashboard;
