import { useState, useRef, useEffect } from 'react';
import MenuIcon from './MenuIcon.jsx';
import BellIcon from './BellIcon.jsx';
import LogoIcon from '../HomePage/logoIcon.jsx'
import SearchBar from './SearchBar.jsx';
import { useAuth } from '../../contexts/AuthContexts.jsx';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    // Effect to close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileMenuRef]);

    const CustomUserIcon = () => (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2D3748" />
            <g><path d="M20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18Z" fill="white" /><path d="M20 20C15.5817 20 12 22.2386 12 25V28H28V25C28 22.2386 24.4183 20 20 20Z" fill="white" /></g>
        </svg>
    );

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 z-10">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <button onClick={onMenuClick} className="md:hidden mr-4 p-1 text-gray-600 hover:text-gray-900">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <LogoIcon/>
                </div>
                <div className="hidden md:flex flex-1 justify-center px-8 max-w-md">
                   <SearchBar />
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="hidden sm:block p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    {/* Profile Dropdown Area */}
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="rounded-full">
                            <CustomUserIcon />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm text-gray-700">Signed in as</p>
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {user?.displayName || user?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setProfileMenuOpen(false); // Close menu on logout
                                        }}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;