import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { MissionStatus } from './MissionStatus';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const AstroNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Mission', href: '#mission' },
    { label: 'The Challenge', href: '#challenge' },
    { label: 'Health Intelligence', href: '#intelligence' },
    { label: 'Technology', href: '#technology' },
    { label: 'Research', href: '#research' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F2F0EA]/95 backdrop-blur-md border-b border-[#DCD8CD] py-3.5 shadow-subtle'
          : 'bg-[#F2F0EA] py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-[#F2F0EA] shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <circle cx="16" cy="16" r="13" stroke="#F2F0EA" strokeWidth="1.5" />
              <ellipse
                cx="16"
                cy="16"
                rx="13"
                ry="6"
                stroke="#75D8DC"
                strokeWidth="1.25"
                transform="rotate(-20 16 16)"
              />
              <path
                d="M7 16H11L13 11L16 21L19 13L21 16H25"
                stroke="#FF6B35"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-widest text-[#111111] leading-none">
              ASTRO<span className="text-[#FF6B35]">CARE</span>
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#888882] mt-0.5">
              HUMAN HEALTH BEYOND EARTH
            </span>
          </div>
        </Link>

        {/* Live Mission Status (Center-Left on Desktop) */}
        <div className="hidden xl:block">
          <MissionStatus variant="pill" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 border border-[#DCD8CD] rounded-full px-4 py-1.5 bg-[#FFFFFF] shadow-subtle">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium text-[#444444] hover:text-[#111111] hover:bg-[#F2F0EA] transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            to={ROUTES.AUTH}
            className="px-4 py-2 text-xs font-mono font-semibold text-[#111111] hover:text-[#FF6B35] bg-[#FFFFFF] border border-[#111111] rounded-full transition-all shadow-sm"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="px-5 py-2 text-xs font-mono font-bold tracking-wider text-[#F2F0EA] bg-[#111111] hover:bg-[#242424] rounded-full transition-all flex items-center space-x-1.5 shadow-md hover:scale-[1.02]"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#75D8DC]" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[#111111] rounded-lg border border-[#DCD8CD]"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F2F0EA] border-b border-[#DCD8CD] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-2 px-3 text-sm font-mono font-semibold text-[#111111] hover:bg-[#FFFFFF] rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#DCD8CD] flex flex-col space-y-2.5">
            <Link
              to={ROUTES.AUTH}
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center text-xs font-mono font-bold text-[#111111] bg-[#FFFFFF] border border-[#111111] rounded-full"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate(ROUTES.DASHBOARD);
              }}
              className="w-full py-2.5 text-center text-xs font-mono font-bold text-[#F2F0EA] bg-[#111111] rounded-full shadow-md"
            >
              ENTER MISSION CONTROL
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
