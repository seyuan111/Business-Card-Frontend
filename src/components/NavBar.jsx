import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, CreditCard, Menu, X } from 'lucide-react';
import axios from 'axios';
import { getAuthConfig } from '../utils/auth';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const navigation = [
  { label: 'Business Cards', links: [
    { to: '/generate-card', label: 'Create a business card' },
    { to: '/get-cards', label: 'My cards' },
  ] },
  { label: 'Contacts', links: [
    { to: '/Home', label: 'View contacts' },
    { to: '/cards/create', label: 'Add a contact' },
  ] },
  { label: 'Resources', links: [
    { to: '/about', label: 'About & FAQ' },
    { to: '/logos-list', label: 'My logos' },
    { to: '/choose-logo-icon', label: 'Explore logo icons' },
  ] },
];

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {}, getAuthConfig());
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await logout();
      setMobileOpen(false);
      setOpenMenu(null);
      navigate('/');
    }
  };

  const handleEscape = (event) => {
    if (event.key !== 'Escape') return;
    if (openMenu) {
      headerRef.current?.querySelector(`[aria-controls="${openMenu}-panel"]`)?.focus();
      setOpenMenu(null);
    } else if (mobileOpen) {
      setMobileOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <>
      <header className="site-header" ref={headerRef} onKeyDown={handleEscape}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
        }}>
        <div className="site-header__inner">
          <Link to="/" className="site-brand" aria-label="Ology home">
            <span className="site-brand__icon"><CreditCard size={25} strokeWidth={1.6} /></span>
            <span>Ology<span className="site-brand__dot">.</span></span>
          </Link>
          <nav id="primary-navigation" aria-label="Main navigation"
            className={`site-navigation${mobileOpen ? ' is-open' : ''}`}>
            <Link to="/" className="site-navigation__home" aria-current={location.pathname === '/' ? 'page' : undefined}>Home</Link>
            {navigation.map((group, index) => {
              const id = `nav-${index}`;
              const isOpen = openMenu === id;
              return (
                <div className="site-navigation__group" key={group.label}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`${id}-panel`}
                    className={group.links.some((link) => location.pathname === link.to) ? 'is-active' : ''}
                    onClick={() => setOpenMenu(isOpen ? null : id)}>
                    {group.label}<ChevronDown size={13} aria-hidden="true" />
                  </button>
                  {isOpen && <div className="site-dropdown" id={`${id}-panel`}>
                    {group.links.map((link) => <Link key={link.to} to={link.to}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
                  </div>}
                </div>
              );
            })}
          </nav>
          <div className="site-header__actions">
            {isAuthenticated ? <div className="site-account">
              <button className="site-login" type="button" aria-expanded={openMenu === 'account'}
                aria-controls="account-panel" onClick={() => setOpenMenu(openMenu === 'account' ? null : 'account')}>
                <span className="site-account__name">{user?.name || 'My account'}</span><ChevronDown size={14} aria-hidden="true" />
              </button>
              {openMenu === 'account' && <div className="site-dropdown site-dropdown--account" id="account-panel">
                <span className="site-account__caption">Signed in as {user?.name || 'User'}</span>
                <Link to="/settings">Settings<ArrowUpRight size={14} aria-hidden="true" /></Link>
                <button type="button" onClick={handleLogout}>Sign out</button>
              </div>}
            </div> : <Link className="site-login" to="/Login">Login<ArrowUpRight size={15} aria-hidden="true" /></Link>}
            <button ref={toggleRef} className="site-menu-toggle" type="button" aria-controls="primary-navigation"
              aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => { setMobileOpen(!mobileOpen); setOpenMenu(null); }}>
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>
      <div className="site-header-spacer" />
    </>
  );
};

export default NavBar;
