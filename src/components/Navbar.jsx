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

                    <Link to="/dashboard" className="flex-center" style={{ textDecoration: 'none', color: '#fff', minWidth: 'fit-content' }}>
                        <img src="/logo.png" alt="Dev2Dev" style={{ height: '32px', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(99,102,241,0.3))' }} />
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

                    <Link to="/profile" className={`nav-profile-circle ${currentPath === '/profile' ? 'active' : ''}`} title="Profile">
                        <User size={20} color="#fff" />
                    </Link>
                    <button onClick={handleLogout} className="nav-logout-btn hide-mobile" title="Logout">
                        <LogOut size={20} color="#ef4444" />
                    </button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-content">
                        <div className="mobile-menu-header">
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src="/logo.png" alt="Dev2Dev" style={{ height: '24px' }} />
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>DEV</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '0.5rem', color: '#fff', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mobile-search">
                            <input type="text" placeholder="Search problems..." className="mobile-search-input" />
                            <Search size={18} className="mobile-search-icon" />
                        </div>
                        <div className="mobile-links">
                            <Link to="/dashboard"><span>Dashboard</span> <MonitorPlay size={18} opacity={0.5} /></Link>
                            <Link to="/exams"><span>Practice Problems</span> <Code2 size={18} opacity={0.5} /></Link>
                            <Link to="/learning"><span>Learning Courses</span> <BookOpen size={18} opacity={0.5} /></Link>
                            <Link to="/interview"><span>Mock Interviews</span> <Briefcase size={18} opacity={0.5} /></Link>
                            <Link to="/resume"><span>Resume Analyzer</span> <FileText size={18} opacity={0.5} /></Link>
                            <Link to="/profile"><span>My Profile</span> <UserCircle size={18} opacity={0.5} /></Link>
                            {userRole === 'admin' && <Link to="/admin"><span>Admin Panel</span> <Settings size={18} opacity={0.5} /></Link>}
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

                .nav-action-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                .nav-action-icon:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .notification-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: var(--danger, #ef4444);
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #121212;
                    padding: 0 2px;
                }

                .admin-pill {
                    background: rgba(129, 140, 248, 0.1);
                    border: 1px solid rgba(129, 140, 248, 0.3);
                    color: #818cf8;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .admin-pill:hover {
                    background: rgba(129, 140, 248, 0.2);
                    box-shadow: 0 0 15px rgba(129, 140, 248, 0.2);
                }

                .nav-profile-circle {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                .nav-profile-circle:hover, .nav-profile-circle.active {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: #818cf8;
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
                }

                .nav-logout-btn {
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    padding: 8px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .nav-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.3);
                    transform: translateY(-1px);
                }

                .action-divider {
                    width: 1px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0 0.5rem;
                }

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
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(10, 10, 15, 0.95);
                    backdrop-filter: blur(20px);
                    z-index: 2000;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .mobile-menu-content {
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                }

                .mobile-search {
                    position: relative;
                    margin-bottom: 2rem;
                }
                .mobile-search-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 1rem 1rem 1rem 3rem;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                }
                .mobile-search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.4);
                }

                .mobile-links { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 0.75rem; 
                }
                .mobile-links a {
                    color: rgba(255,255,255,0.8);
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 500;
                    padding: 1.2rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .mobile-links a:active {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: rgba(99, 102, 241, 0.3);
                    color: #818cf8;
                    transform: scale(0.98);
                }
                .mobile-logout-btn {
                    margin-top: 2rem;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 1.2rem;
                    border-radius: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    justify-content: center;
                    font-size: 1rem;
                    width: 100%;
                    cursor: pointer;
                }

                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
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
