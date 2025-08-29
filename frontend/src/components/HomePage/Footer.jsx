import { Link } from 'react-router-dom';
// --- Component 3: Footer ---
const Footer = () => {
  return (
    <footer className="footer bg-[#343a40] py-6 px-10 text-[#bdc3c7] md:px-6 lg:px-10">
      <div className="footer-content flex flex-wrap items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm">&copy; 2025 Dexplovate Pvt Ltd. All rights reserved.</p>
        <div className="footer-links flex items-center gap-2">
          <Link to="/privacy" className="text-sm text-[#bdc3c7] transition-colors duration-300 hover:text-white">Privacy Policy</Link>
          <span className="text-sm">|</span>
          <Link to="/terms" className="text-sm text-[#bdc3c7] transition-colors duration-300 hover:text-white">Terms & Conditions</Link>
          <span className="text-sm">|</span>
          <Link to="/sitemap" className="text-sm text-[#bdc3c7] transition-colors duration-300 hover:text-white">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;