import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from './logoIcon.jsx';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // The HamburgerIcon is only used by the Header, so we can define it here.
  const HamburgerIcon = ({ menuOpen }) => (
    <>
      <div
        className={`bar h-[3px] w-[25px] rounded bg-gray-800 transition-all duration-300 ease-in-out ${
          menuOpen ? 'translate-y-[7px] rotate-45' : ''
        }`}
      ></div>
      <div
        className={`bar h-[3px] w-[25px] rounded bg-gray-800 transition-all duration-300 ease-in-out ${
          menuOpen ? 'opacity-0' : ''
        }`}
      ></div>
      <div
        className={`bar h-[3px] w-[25px] rounded bg-gray-800 transition-all duration-300 ease-in-out ${
          menuOpen ? 'translate-y-[-7px] -rotate-45' : ''
        }`}
      ></div>
    </>
  );

  return (
    <>
      <header className="header sticky top-0 z-50 bg-white shadow-md">
        <div className="header-main flex items-center justify-between py-4 px-10 md:px-6 lg:px-10">
          <LogoIcon />
          <nav className="nav-menu hidden gap-8 md:flex">
            <Link to="/" className="border-b-2 border-transparent pb-1.5 font-medium text-[#34495e] transition-colors duration-300 hover:border-[#34495e]">Home</Link>
            <Link to="/pricing" className="border-b-2 border-transparent pb-1.5 font-medium text-[#34495e] transition-colors duration-300 hover:border-[#34495e]">Pricing</Link>
            <Link to="/resources" className="border-b-2 border-transparent pb-1.5 font-medium text-[#34495e] transition-colors duration-300 hover:border-[#34495e]">Resources</Link>
            <Link to="/company" className="border-b-2 border-transparent pb-1.5 font-medium text-[#34495e] transition-colors duration-300 hover:border-[#34495e]">Company</Link>
            <Link to="/support" className="border-b-2 border-transparent pb-1.5 font-medium text-[#34495e] transition-colors duration-300 hover:border-[#34495e]">Support</Link>
          </nav>

          <div className="header-actions hidden md:block">
            <Link to="/login" className="sign-in-button rounded-md border border-[#34495e] py-2.5 px-5 font-medium text-[#34495e] transition-all duration-300 hover:bg-[#34495e] hover:text-white">Sign in</Link>
          </div>

          <div className="hamburger flex cursor-pointer flex-col gap-1 md:hidden" onClick={toggleMenu}>
            <HamburgerIcon menuOpen={menuOpen} />
          </div>
        </div>
        <div className="header-sub border-t border-[#e0e0e0] bg-[#f8f9fa] py-2 px-10 text-right text-sm text-[#34495e] md:px-6 lg:px-10">
          <span>Don't have an account? <Link to="/signup" className="font-bold text-blue-500">SignUp Now</Link></span>
        </div>
      </header>

      <nav
        className={`mobile-nav fixed left-0 z-40 flex w-full flex-col bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden h-[calc(100vh-112px)] overflow-y-auto ${
          menuOpen ? 'top-[112px] opacity-100' : 'top-[-100vh] opacity-0'
        }`}
      >
        <Link to="/" onClick={toggleMenu} className="border-b border-[#e0e0e0] py-4 px-10 text-[#34495e]">Home</Link>
        <Link to="/pricing" onClick={toggleMenu} className="border-b border-[#e0e0e0] py-4 px-10 text-[#34495e]">Pricing</Link>
        <Link to="/resources" onClick={toggleMenu} className="border-b border-[#e0e0e0] py-4 px-10 text-[#34495e]">Resources</Link>
        <Link to="/company" onClick={toggleMenu} className="border-b border-[#e0e0e0] py-4 px-10 text-[#34495e]">Company</Link>
        <Link to="/support" onClick={toggleMenu} className="border-b border-[#e0e0e0] py-4 px-10 text-[#34495e]">Support</Link>
        <div className="p-4">
          <Link to="/login" onClick={toggleMenu} className="block w-full rounded-md border border-[#34495e] py-2.5 px-5 text-center font-medium text-[#34495e] transition-all duration-300 hover:bg-[#34495e] hover:text-white">
            Sign in
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;