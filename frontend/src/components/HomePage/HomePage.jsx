import Header from './Header.jsx';
import HeroSection from './HeroSection.jsx';
import Footer from './Footer.jsx';

// --- Main Page Component ---
// This component now composes the other components defined above.
const HomePage = () => {
  return (
    <div className="home-page flex min-h-screen flex-col bg-[#d4e3e5]">
      {console.log("HomePage component loaded")}
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;