import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, Code2, BookOpen, UserCircle, Settings, FileText, BarChart2, Briefcase, PlusCircle, MonitorPlay, ChevronDown, Menu, X } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [showAptitudeDropdown, setShowAptitudeDropdown] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Add refs for dropdown closing logic
    const aptitudeRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/notifications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNotificationCount(res.data.length);
                } catch (err) {
                    console.error("Failed to fetch notifications for navbar", err);
                }
            }
        };
        fetchNotifications();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        const handleClickOutside = (event) => {
            if (aptitudeRef.current && !aptitudeRef.current.contains(event.target)) {
                setShowAptitudeDropdown(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const userRole = localStorage.getItem('userRole');
    const currentPath = location.pathname;

    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {/* Main Navbar */}
            <nav className="navbar-main">
                {/* Left Section: Logo + Search */}
                <div className="nav-left">
                    <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
                    </button>

                    <Link to="/dashboard" className="flex-center" style={{ textDecoration: 'none', color: '#fff', gap: '0.75rem', minWidth: 'fit-content' }}>
                        <img src="/logo.png" alt="Dev2Dev" style={{ height: '28px', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(99,102,241,0.3))' }} />
                        <span className="logo-text hide-mobile">Dev2Dev</span>
                    </Link>

                    <div className="nav-search-container hide-mobile">
                        <input
                            type="text"
                            placeholder="Search"
                            className="nav-search-input"
                        />
                        <Search size={18} className="search-icon" />
                    </div>
                </div>

                {/* Center Section: Links (Desktop) */}
                <div className="nav-center hide-mobile">
                    <Link to="/exams" className={`gfg-nav-link ${currentPath === '/exams' ? 'active' : ''}`}>Practice</Link>
                    <Link to="/learning" className={`gfg-nav-link ${currentPath === '/learning' ? 'active' : ''}`}>Courses</Link>
                    <Link to="/tutorials" className={`gfg-nav-link ${currentPath === '/tutorials' ? 'active' : ''}`}>Tutorials</Link>
                    <Link to="/interview" className={`gfg-nav-link ${currentPath === '/interview' ? 'active' : ''}`}>Interviews</Link>
                    <Link to="/resume" className={`gfg-nav-link ${currentPath === '/resume' ? 'active' : ''}`}>Resume</Link>
                </div>

                {/* Right Section: Actions */}
                <div className="nav-right">
                    <Link to="/notifications" className="nav-action-icon">
                        <Bell size={20} color="#fff" />
                        {notificationCount > 0 && (
                            <span className="notification-badge">
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </span>
                        )}
                    </Link>

                    <div className="action-divider hide-mobile"></div>

                    {userRole === 'admin' && <Link to="/admin" className="admin-pill hide-mobile">Admin</Link>}

                    <Link to="/profile" className={`nav-profile-circle ${currentPath === '/profile' ? 'active' : ''}`}>
                        <User size={20} color="#fff" />
                    </Link>
                    <button onClick={handleLogout} className="nav-logout-btn hide-mobile" title="Logout">
                        <LogOut size={20} color="#ef4444" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay animate-fade-in">
                    <div className="mobile-menu-content">
                        <div className="mobile-search">
                            <input type="text" placeholder="Search problems..." className="mobile-search-input" />
                            <Search size={18} className="mobile-search-icon" />
                        </div>
                        <div className="mobile-links">
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/exams">Practice Problems</Link>
                            <Link to="/learning">Learning Courses</Link>
                            <Link to="/tutorials">Video Tutorials</Link>
                            <Link to="/interview">Mock Interviews</Link>
                            <Link to="/resume">Resume Analyzer</Link>
                            <Link to="/profile">My Profile</Link>
                            {userRole === 'admin' && <Link to="/admin">Admin Panel</Link>}
                            <button onClick={handleLogout} className="mobile-logout-btn">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Navbar (Domain Categories) */}
            <div className="sub-nav-categories scroll-x">
                {['DSA', 'Interview Prep', 'OOPS', 'Operating Systems', 'DBMS', 'Computer Networks', 'Aptitude'].map(item => (
                    item === 'Aptitude' ? (
                        <div
                            key={item}
                            className="sub-nav-item relative"
                            ref={aptitudeRef}
                            onClick={() => setShowAptitudeDropdown(!showAptitudeDropdown)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            {item}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showAptitudeDropdown ? 'rotate-180' : ''}`} />

                            {/* Dropdown Menu */}
                            {showAptitudeDropdown && (
                                <div className="aptitude-dropdown nav-animate-fade-in">
                                    <div className="aptitude-dropdown-item" onClick={(e) => { e.stopPropagation(); setShowAptitudeDropdown(false); navigate('/aptitude'); }}>Quantitative Aptitude</div>
                                    <div className="aptitude-dropdown-item" onClick={(e) => { e.stopPropagation(); setShowAptitudeDropdown(false); navigate('/logical-reasoning'); }}>Logical Reasoning</div>
                                    <div className="aptitude-dropdown-item" onClick={(e) => { e.stopPropagation(); setShowAptitudeDropdown(false); navigate('/verbal-ability'); }}>Verbal Ability</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span
                            key={item}
                            className="sub-nav-item"
                            onClick={() => {
                                const routes = { 'DSA': '/problems', 'Interview Prep': '/interview-prep', 'OOPS': '/oops', 'Operating Systems': '/os-tutorial', 'DBMS': '/dbms-tutorial', 'Computer Networks': '/cn-tutorial' };
                                navigate(routes[item] || '/learning');
                            }}
                        >
                            {item}
                        </span>
                    )
                ))}
            </div>

            <style>{`
                .navbar-main {
                    padding: 0 1.5rem;
                    height: 56px;
                    background: rgba(18, 18, 18, 0.98);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .nav-left, .nav-center, .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex: 1;
                }
                .nav-left { flex: 1.2; }
                .nav-center { flex: 2; justify-content: center; }
                .nav-right { flex: 1.2; justify-content: flex-end; }

                .mobile-menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                }

                .nav-search-container {
                    position: relative;
                    width: 200px;
                    transition: all 0.3s ease;
                }
                .nav-search-input {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50px;
                    padding: 0.4rem 1rem 0.4rem 2.5rem;
                    color: #fff;
                    font-size: 0.85rem;
                    outline: none;
                }
                .nav-search-container:focus-within { width: 280px; }
                .search-icon { position: absolute; left: 10px; color: rgba(255,255,255,0.4); }

                .gfg-nav-link {
                    text-decoration: none;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 0.5rem 0;
                    position: relative;
                }
                .gfg-nav-link.active { color: #818cf8; }
                .gfg-nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #818cf8;
                    transition: width 0.3s;
                }
                .gfg-nav-link:hover::after, .gfg-nav-link.active::after { width: 100%; }

                .mobile-menu-overlay {
                    position: fixed;
                    top: 56px;
                    left: 0;
                    width: 100%;
                    height: calc(100vh - 56px);
                    background: rgba(10, 10, 15, 0.98);
                    z-index: 999;
                    padding: 1.5rem;
                }
                .mobile-links { display: flex; flexDirection: column; gap: 1rem; margin-top: 2rem; }
                .mobile-links a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 1.25rem;
                    font-weight: 600;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                }
                .mobile-logout-btn {
                    margin-top: 1rem;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    justify-content: center;
                }

                @media (max-width: 1024px) {
                    .nav-center, .nav-search-container { display: none; }
                    .mobile-menu-toggle { display: block; }
                }

                @media (max-width: 768px) {
                    .navbar-main { padding: 0 1rem; }
                    .nav-right { gap: 1rem; }
                    .sub-nav-categories { gap: 1.5rem; justify-content: flex-start; padding: 0 1rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
                }

                .scroll-x::-webkit-scrollbar { display: none; }
                .scroll-x { scrollbar-width: none; }

                .sub-nav-categories {
                    height: 45px;
                    background: #000;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }
                .sub-nav-item { color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
                .sub-nav-item:hover { color: #fff; }

                .aptitude-dropdown { position: absolute; top: 100%; left: 0; background: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; width: 180px; z-index: 1001; }
                .aptitude-dropdown-item { padding: 0.8rem 1rem; color: #fff; font-size: 0.85rem; }
                .aptitude-dropdown-item:hover { background: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    );
};

export default Navbar;
