import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Activity, ShieldAlert, Cpu, Heart, CheckSquare, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview', icon: Activity },
    { label: 'Spaceflight Hazards', href: '#hazards', icon: ShieldAlert },
    { label: 'Human Health', href: '#human-body', icon: Heart },
    { label: 'Intelligence', href: '#intelligence', icon: Cpu },
    { label: 'Mission Wellness', href: '#daily-mission', icon: CheckSquare },
    { label: 'Spacecraft', href: '#spacecraft', icon: Sparkles },
    { label: 'Science', href: '#science', icon: ArrowUpRight },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#262626] py-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Custom Health + Orbital Symbol */}
        <a
          href="#overview"
          onClick={(e) => handleScrollTo(e, '#overview')}
          className="flex items-center space-x-3 group"
        >
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00A3FF]/20 to-[#7B2CBF]/20 border border-[#00A3FF]/40 group-hover:border-[#00A3FF] transition-colors shadow-glowCyan">
            {/* Orbital Ring Motif */}
            <span className="absolute inset-0 rounded-xl border border-[#00A3FF]/30 animate-pulse-glow" />
            <Activity className="w-5 h-5 text-[#00A3FF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-space font-bold tracking-widest text-lg text-[#E2DED9] group-hover:text-[#00A3FF] transition-colors">
              ASTRO<span className="text-[#00A3FF]">CARE</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#817E7B] uppercase -mt-1">
              NASA BIOMEDICAL INTELLIGENCE
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#151515]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#262626]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#C6C2BB] hover:text-[#E2DED9] hover:bg-[#1C1C1C] transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={() => navigate(ROUTES.AUTH)}
            className="px-4 py-2 text-xs font-mono font-medium text-[#C6C2BB] hover:text-[#E2DED9] bg-[#151515] border border-[#262626] hover:border-[#383838] rounded-lg transition-all"
          >
            Personnel Access
          </button>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="relative group px-4 py-2 text-xs font-mono font-bold tracking-wider text-black bg-[#00A3FF] hover:bg-[#38BDF8] rounded-lg shadow-glowCyan transition-all flex items-center space-x-1.5"
          >
            <span>LAUNCH ASTROCARE</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#C6C2BB] hover:text-[#E2DED9] hover:bg-[#1C1C1C]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#262626] px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg text-sm text-[#C6C2BB] hover:text-[#E2DED9] hover:bg-[#151515]"
                >
                  <Icon className="w-4 h-4 text-[#00A3FF]" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
          <div className="pt-4 border-t border-[#262626] flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.AUTH);
              }}
              className="w-full py-2.5 text-xs font-mono font-semibold text-center text-[#E2DED9] bg-[#151515] border border-[#262626] rounded-lg"
            >
              Personnel Access
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.DASHBOARD);
              }}
              className="w-full py-2.5 text-xs font-mono font-bold text-center text-black bg-[#00A3FF] rounded-lg shadow-glowCyan"
            >
              LAUNCH ASTROCARE
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
