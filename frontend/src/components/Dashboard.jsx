import Card from './ui/Card';
import Button from './ui/Button';
import styles from './Dashboard.module.css';

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonBar} skeleton`} />
      <div className={`${styles.skeletonLine} skeleton`} style={{ width: '60%' }} />
      <div className={`${styles.skeletonLine} skeleton`} style={{ width: '90%' }} />
      <div className={`${styles.skeletonPrice} skeleton`} />
    </div>
  );
}

export default function Dashboard({ fuelPrices, meta, loading, error, refetch }) {
  const minPrice = fuelPrices.length ? Math.min(...fuelPrices.map((p) => p.price)) : null;

  if (loading) {
    return (
      <div className="section-container">
        <div className={styles.header}>
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="section-subtitle">Loading current fuel prices in Thailand...</p>
          </div>
        </div>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <h1 className="section-title">Dashboard</h1>
        <Card className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>{error}</p>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Make sure the backend server is running on port 3001.
          </p>
          <Button onClick={refetch} variant="outline">
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className={styles.header}>
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Current fuel prices in Thailand</p>
          {meta && (
            <>
              <p className={styles.meta}>
                Last updated: {new Date(meta.lastUpdated).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' })} ICT
              </p>
              <p className={styles.metaSource}>{meta.source}</p>
            </>
          )}
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          &#x21bb; Refresh
        </Button>
      </div>

      <div className={styles.grid}>
        {fuelPrices.map((fuel) => (
          <Card key={fuel.id} className={styles.fuelCard}>
            <div className={styles.colorBar} style={{ backgroundColor: fuel.color }} />
            <div className={styles.fuelCardTop}>
              <div
                className={styles.fuelDot}
                style={{ backgroundColor: fuel.color }}
              />
              {fuel.price === minPrice && (
                <span className={styles.cheapestBadge}>✓ Cheapest</span>
              )}
            </div>
            <div className={styles.fuelName}>{fuel.name}</div>
            <div className={styles.fuelDesc}>{fuel.description}</div>
            <div className={styles.fuelPriceRow}>
              <span className={styles.fuelPrice}>
                ฿{fuel.price.toFixed(2)}
              </span>
              <span className={styles.fuelUnit}>/ litre</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
