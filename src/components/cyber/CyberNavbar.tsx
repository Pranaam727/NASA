import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Orbit, ArrowRight, Menu, X } from 'lucide-react';

export const CyberNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020807]/85 backdrop-blur-md border-b border-[#24E6D0]/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Minimal Orbital Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#071311] border border-[#24E6D0]/40 flex items-center justify-center text-[#24E6D0] group-hover:border-[#24E6D0] group-hover:shadow-cyberGlow transition-all">
            <Orbit className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <div className="font-display font-extrabold text-base tracking-widest text-[#F4FAF8] flex items-center space-x-1">
              <span>ASTRO</span>
              <span className="text-[#24E6D0]">CARE</span>
            </div>
            <div className="font-mono text-[8px] uppercase tracking-wider text-[#91A9A4]">
              SPACE HEALTH INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 px-4 py-1.5 rounded-full cyber-glass border border-[#24E6D0]/20">
          <a
            href="#overview"
            className="px-3.5 py-1 text-xs font-mono font-medium text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
          >
            Overview
          </a>
          <a
            href="#technology"
            className="px-3.5 py-1 text-xs font-mono font-medium text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
          >
            Technology
          </a>
          <a
            href="#health-intelligence"
            className="px-3.5 py-1 text-xs font-mono font-medium text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
          >
            Health Intelligence
          </a>
          <a
            href="#research"
            className="px-3.5 py-1 text-xs font-mono font-medium text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
          >
            Research
          </a>
          <a
            href="#mission"
            className="px-3.5 py-1 text-xs font-mono font-medium text-[#91A9A4] hover:text-[#24E6D0] transition-colors"
          >
            Mission
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            to={ROUTES.AUTH}
            className="px-4 py-2 text-xs font-mono font-bold text-[#F4FAF8] hover:text-[#24E6D0] transition-colors"
          >
            Sign In
          </Link>
          <Link
            to={ROUTES.ASTRONAUT_DASHBOARD}
            className="px-5 py-2 rounded-full font-mono text-xs font-bold bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] transition-all flex items-center space-x-1.5 shadow-cyberGlow hover:scale-105"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-[#91A9A4] hover:text-[#24E6D0] md:hidden"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071311] border-b border-[#24E6D0]/20 p-5 space-y-4">
          <div className="flex flex-col space-y-2 font-mono text-xs">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="text-[#91A9A4] hover:text-[#24E6D0] py-1">Overview</a>
            <a href="#technology" onClick={() => setMobileMenuOpen(false)} className="text-[#91A9A4] hover:text-[#24E6D0] py-1">Technology</a>
            <a href="#health-intelligence" onClick={() => setMobileMenuOpen(false)} className="text-[#91A9A4] hover:text-[#24E6D0] py-1">Health Intelligence</a>
            <a href="#research" onClick={() => setMobileMenuOpen(false)} className="text-[#91A9A4] hover:text-[#24E6D0] py-1">Research</a>
            <a href="#mission" onClick={() => setMobileMenuOpen(false)} className="text-[#91A9A4] hover:text-[#24E6D0] py-1">Mission</a>
          </div>
          <div className="pt-3 border-t border-[#24E6D0]/15 flex flex-col space-y-2">
            <Link
              to={ROUTES.AUTH}
              className="w-full text-center py-2 text-xs font-mono font-bold text-[#F4FAF8] border border-[#24E6D0]/30 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.ASTRONAUT_DASHBOARD}
              className="w-full text-center py-2.5 text-xs font-mono font-bold bg-[#24E6D0] text-[#020807] rounded-lg shadow-cyberGlow"
            >
              ENTER MISSION CONTROL →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
