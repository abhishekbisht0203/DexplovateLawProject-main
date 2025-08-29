import { useState } from 'react';
import  PlusIcon  from './PlusIcon.jsx';
import  XIcon  from './XIcon.jsx';
import SearchBar from './SearchBar.jsx';

const Sidebar = ({ isOpen, onClose }) => {
    const [activeItem, setActiveItem] = useState('All Files');
    const sidebarItems = ['Junior Advocate', 'Proofs', 'Hearings', 'Senior', 'completed files', 'incompleted files', 'All Files'];

    const handleItemClick = (item) => {
        setActiveItem(item);
        
        if (item === 'Hearings') {
            const hearingsSection = document.getElementById('hearings-section');
            if (hearingsSection) {
                hearingsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Close mobile sidebar after clicking
        if (isOpen) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex flex-col transform transition-transform duration-300 ease-in-out z-30
                md:relative md:translate-x-0 md:m-4 md:rounded-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* --- UPDATED SECTION --- */}
                {/* Mobile Header: Close button */}
                <div className="flex items-center justify-end p-2 md:hidden">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar (Mobile only) */}
                <div className="px-2 mb-6 md:hidden">
                    <SearchBar />
                </div>
                {/* --- END UPDATED SECTION --- */}
                
                <button className="flex items-center justify-center w-full bg-gray-900 text-white py-3 px-4 rounded-lg mb-8 hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Add New Case</span>
                </button>
                
                <nav className="flex-1 space-y-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleItemClick(item)}
                            className={`w-full text-left flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 capitalize ${activeItem === item ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                            {item}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
};
export default Sidebar;