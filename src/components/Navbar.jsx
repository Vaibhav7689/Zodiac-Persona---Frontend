import { useState, useEffect } from 'react';
import { Compass, MessageSquare, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-close menu on hash change
    useEffect(() => {
        const handleHashChange = () => setMobileOpen(false);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const toggleMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            {/* Overlay to dim background when mobile menu is open */}
            <div
                className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
            ></div>

            <nav className="navbar">
                <div className="nav-brand">
                    <a href="#" className="nav-logo">
                        <Compass size={24} className="spin-slow" />
                        <span>Zodiac Persona</span>
                    </a>
                </div>

                {/* Mobile Hamburger Button */}
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* The Links (Hidden on mobile by default, sliding out) */}
                <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
                    <a href="#" className="nav-link">Home</a>
                    <a href="#about" className="nav-link">About</a>
                    {/*<a href="#kundli" className="nav-link">Kundli Match</ a>*/}
                    {/* <a href="#zen" className="nav-link" style={{ color: 'var(--primary)' }}><Sparkles size={16} /> Cosmic Zen</a> */}

                    <a href="#chat" className="nav-link">
                        <MessageSquare size={18} /> Seek Guidance
                    </a>
                    <a href="#login" className="nav-link">Sign In</a>
                    <a href="#signup" className="nav-btn">Start Journey</a>
                </div>
            </nav>
        </>
    );
}
