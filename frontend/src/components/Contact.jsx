import Card from './ui/Card';
import styles from './Contact.module.css';

const CONTACT_INFO = [
  { icon: '📧', label: 'Email', value: 'info@thaifuelcalc.th', sub: 'support@thaifuelcalc.th' },
  { icon: '📞', label: 'Phone', value: '+66 2 123 4567', sub: 'Mon–Fri, 08:00–17:00 ICT' },
  { icon: '💬', label: 'Line Official', value: '@ThaiFuelCalc', sub: 'Quick response via LINE' },
  { icon: '📍', label: 'Address', value: '123 Sukhumvit Road, Khlong Toei', sub: 'Bangkok 10110, Thailand' },
];

const HOURS = [
  { day: 'Monday', time: '08:00–17:00' },
  { day: 'Tuesday', time: '08:00–17:00' },
  { day: 'Wednesday', time: '08:00–17:00' },
  { day: 'Thursday', time: '08:00–17:00' },
  { day: 'Friday', time: '08:00–17:00' },
  { day: 'Saturday', time: '09:00–13:00' },
  { day: 'Sunday', time: 'Closed' },
];

export default function Contact() {
  return (
    <div className="section-container">
      <h1 className="section-title">Contact</h1>
      <p className="section-subtitle">Get in touch with the Thai Fuel Calc team</p>

      <div className={styles.grid}>
        {/* Contact info */}
        <Card className={styles.infoCard}>
          <div className={styles.orgHeader}>
            <div className={styles.orgIcon}>⛽</div>
            <div>
              <div className={styles.orgName}>Thai Fuel Calc</div>
              <div className={styles.orgTagline}>Thailand's Fuel Cost Calculator</div>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.contactList}>
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className={styles.contactItem}>
                <div className={styles.contactIconBox}>{item.icon}</div>
                <div>
                  <div className={styles.contactLabel}>{item.label}</div>
                  <div className={styles.contactValue}>{item.value}</div>
                  {item.sub && <div className={styles.contactValueSub}>{item.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          <div>
            <div className={styles.contactLabel} style={{ marginBottom: '0.75rem' }}>Follow Us</div>
            <div className={styles.socialRow}>
              {['Facebook', 'Twitter / X', 'Instagram', 'YouTube'].map((s) => (
                <button key={s} className={styles.socialBtn}>
                  {s === 'Facebook' ? '📘' : s === 'Twitter / X' ? '🐦' : s === 'Instagram' ? '📸' : '▶️'} {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Map + Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card className={styles.mapCard}>
            <div className={styles.mapTitle}>📍 Our Location</div>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapEmoji}>🗺️</div>
              <div className={styles.mapCaption}>Bangkok, Thailand</div>
              <div className={styles.mapAddress}>123 Sukhumvit Road, Khlong Toei, Bangkok 10110</div>
            </div>
          </Card>

          <Card>
            <div className={styles.mapTitle} style={{ marginBottom: '1rem' }}>🕐 Office Hours</div>
            <div className={styles.hoursGrid}>
              {HOURS.map((h) => (
                <div key={h.day} className={styles.hourRow}>
                  <span className={styles.hourDay}>{h.day}</span>
                  <span
                    className={styles.hourTime}
                    style={{ color: h.time === 'Closed' ? 'var(--color-danger)' : undefined }}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
