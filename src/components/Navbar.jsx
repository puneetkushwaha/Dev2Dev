import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, Code2, BookOpen, UserCircle, Settings, FileText, BarChart2, Briefcase, PlusCircle, MonitorPlay, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [showAptitudeDropdown, setShowAptitudeDropdown] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

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
            <nav style={{
                padding: '0 3rem',
                height: '56px',
                background: 'rgba(18, 18, 18, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Left Section: Logo + Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <Link to="/dashboard" className="flex-center" style={{ textDecoration: 'none', color: '#fff', gap: '0.75rem', minWidth: 'fit-content' }}>
                        <img src="/logo.png" alt="Dev2Dev" style={{ height: '28px', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(99,102,241,0.3))' }} />
                    </Link>

                    <div style={{ position: 'relative', width: '250px', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50px',
                                padding: '0.45rem 1rem 0.45rem 2.8rem',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none',
                                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            className="nav-search-input"
                        />
                        <Search size={18} style={{ position: 'absolute', left: '12px', color: '#fff' }} />
                    </div>
                </div>

                {/* Center Section: Links */}
                <div className="flex-center nav-links-container" style={{ gap: '2rem', flex: 1.5, justifyContent: 'center' }}>
                    <div className="nav-item-wrapper">
                        <Link to="/exams" className={`gfg-nav-link ${currentPath === '/exams' ? 'active' : ''}`}>
                            Practice
                        </Link>
                    </div>
                    <div className="nav-item-wrapper">
                        <Link to="/learning" className={`gfg-nav-link ${currentPath === '/learning' ? 'active' : ''}`}>
                            Courses
                        </Link>
                    </div>
                    <div className="nav-item-wrapper">
                        <Link to="/tutorials" className={`gfg-nav-link ${currentPath === '/tutorials' ? 'active' : ''}`}>
                            Tutorials
                        </Link>
                    </div>
                    <Link to="/interview" className={`gfg-nav-link ${currentPath === '/interview' ? 'active' : ''}`}>Mock Interviews</Link>
                    <Link to="/resume" className={`gfg-nav-link ${currentPath === '/resume' ? 'active' : ''}`}>Resume Analyzer</Link>
                </div>

                {/* Right Section: Actions */}
                <div className="flex-center" style={{ gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
                    <Link to="/notifications" style={{ position: 'relative', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center' }}>
                        <Bell size={20} color="#fff" />
                        {notificationCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                borderRadius: '50px',
                                padding: '1px 5px',
                                minWidth: '16px',
                                textAlign: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </span>
                        )}
                    </Link>

                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

                    {userRole === 'admin' && <Link to="/admin" className="admin-pill" style={{ textDecoration: 'none' }}>Admin</Link>}

                    <Link to="/profile" className={`nav-profile-circle ${currentPath === '/profile' ? 'active' : ''}`}>
                        <User size={20} color="#fff" />
                    </Link>
                    <button onClick={handleLogout} className="nav-logout-btn" title="Logout">
                        <LogOut size={20} color="#ef4444" />
                    </button>
                </div>
            </nav>

            {/* Sub-Navbar (Domain Categories) - Sleeker look */}
            <div className="sub-nav-categories">
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
                                    <div
                                        className="aptitude-dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAptitudeDropdown(false);
                                            navigate('/aptitude');
                                        }}
                                    >
                                        Quantitative Aptitude
                                    </div>
                                    <div
                                        className="aptitude-dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAptitudeDropdown(false);
                                            navigate('/logical-reasoning');
                                        }}
                                    >
                                        Logical Reasoning
                                    </div>
                                    <div
                                        className="aptitude-dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAptitudeDropdown(false);
                                            navigate('/verbal-ability');
                                        }}
                                    >
                                        Verbal Ability
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span
                            key={item}
                            className="sub-nav-item"
                            onClick={() => {
                                if (item === 'DSA') {
                                    navigate('/problems');
                                } else if (item === 'Interview Prep') {
                                    navigate('/interview-prep');
                                } else if (item === 'OOPS') {
                                    navigate('/oops');
                                } else if (item === 'Operating Systems') {
                                    navigate('/os-tutorial');
                                } else if (item === 'DBMS') {
                                    navigate('/dbms-tutorial');
                                } else if (item === 'Computer Networks') {
                                    navigate('/cn-tutorial');
                                } else {
                                    navigate('/learning');
                                }
                            }}
                        >
                            {item}
                        </span>
                    )
                ))}
            </div>

            <style>{`
                .nav-search-input:focus {
                    background: rgba(255,255,255,0.07) !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 15px rgba(99,102,241,0.2);
                    width: 320px !important;
                }
                .gfg-nav-link {
                    text-decoration: none;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.5rem 0;
                }
                .gfg-nav-link:hover {
                    color: #fff;
                }
                .gfg-nav-link .chevron {
                    opacity: 0.3;
                    transition: 0.3s;
                }
                .gfg-nav-link:hover .chevron {
                    opacity: 1;
                    transform: translateY(2px);
                }
                .gfg-nav-link.active {
                    color: #fff;
                    text-shadow: 0 0 10px rgba(99,102,241,0.5);
                }
                .admin-pill {
                    background: rgba(99,102,241,0.1);
                    color: #6366f1;
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.85rem;
                    border: 1px solid rgba(99,102,241,0.2);
                    transition: 0.3s;
                }
                .admin-pill:hover {
                    background: #6366f1;
                    color: #fff;
                }
                .nav-profile-circle {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: 0.3s;
                    text-decoration: none;
                }
                .nav-profile-circle:hover {
                    border-color: #6366f1;
                    background: rgba(99,102,241,0.1);
                    transform: translateY(-2px);
                }
                .nav-logout-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: 50%;
                    transition: 0.3s;
                }
                .nav-logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    transform: scale(1.1);
                }
                .sub-nav-categories {
                    height: 45px;
                    background: #181818;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2.5rem;
                    gap: 2.5rem;
                    overflow: visible; /* Changed from overflow-x: auto so dropdown can pop out */
                    scrollbar-width: none;
                }
                .sub-nav-categories::-webkit-scrollbar { display: none; }
                .sub-nav-item {
                    position: relative;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                }
                .sub-nav-item:hover {
                    color: #fff;
                    transform: translateY(-1px);
                    text-shadow: 0 0 10px rgba(255,255,255,0.3);
                }

                /* Aptitude Dropdown Custom CSS */
                .aptitude-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: 10px;
                    width: 220px;
                    background: #1e1e1e;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    padding: 0.5rem 0;
                    z-index: 1000;
                }
                .aptitude-dropdown-item {
                    padding: 0.75rem 1.25rem;
                    color: rgba(255,255,255,0.8);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: 0.2s ease;
                    text-align: left;
                    font-weight: 500;
                }
                .aptitude-dropdown-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                }
                @keyframes navFadeIn {
                    from { opacity: 0; transform: translate(-50%, -10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .nav-animate-fade-in {
                    animation: navFadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Navbar;
