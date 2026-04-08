import { useState, useEffect } from 'react';
import Button from './ui/Button';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⛽' },
  { id: 'calculator', label: 'Calculate Fuel', icon: '🧮' },
  { id: 'expenses', label: 'Total Expenses', icon: '📋' },
  { id: 'contact', label: 'Contact', icon: '📞' },
];

export default function Navbar({ activeSection, setActiveSection, expenseCount, user, onLogout, onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close hamburger menu when viewport is tablet+
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⛽</span>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Thai Fuel Calc</span>
            <span className={styles.brandSub}>Thailand &#x1F1F9;&#x1F1ED;</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navBtn} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
              {item.id === 'expenses' && expenseCount > 0 && (
                <span className={styles.badge}>{expenseCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* User widget (desktop) */}
        <div className={styles.userWidget}>
          {user ? (
            <>
              <span className={styles.username}>👤 {user.username}</span>
              <Button variant="danger" size="sm" onClick={onLogout}>Log out</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={onOpenAuth}>Log In</Button>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <div className={`${styles.hamburgerIcon} ${menuOpen ? styles.open : ''}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {/* User widget (mobile) */}
          <div className={styles.mobileUserWidget}>
            {user ? (
              <>
                <span className={styles.mobileUsername}>👤 {user.username}</span>
                <Button variant="danger" size="sm" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  Log out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => { onOpenAuth(); setMenuOpen(false); }}>
                Log In / Register
              </Button>
            )}
          </div>
          <hr className={styles.mobileDivider} />
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.mobileNavBtn} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className={styles.mobileNavIcon}>{item.icon}</span>
              {item.label}
              {item.id === 'expenses' && expenseCount > 0 && (
                <span className={styles.mobileBadge}>{expenseCount}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
