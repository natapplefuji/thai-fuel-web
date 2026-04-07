import Card from './ui/Card';
import Button from './ui/Button';
import styles from './TotalExpenses.module.css';

function fmt(n) {
  return n.toLocaleString('en-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TotalExpenses({ expenses, removeExpense }) {
  const grandTotal = expenses.reduce((sum, e) => sum + e.totalCost, 0);

  return (
    <div className="section-container">
      <h1 className="section-title">Total Expenses</h1>
      <p className="section-subtitle">All saved trips and cumulative fuel cost</p>

      {/* Grand Total */}
      <Card className={styles.grandTotalCard}>
        <div className={styles.grandTotalInner}>
          <div>
            <div className={styles.grandTotalLabel}>Grand Total</div>
            <div>
              <span className={styles.grandTotalAmount}>฿{fmt(grandTotal)}</span>
              <span className={styles.grandTotalUnit}>THB</span>
            </div>
            <div className={styles.grandTotalMeta}>
              {expenses.length === 0
                ? 'No trips saved yet'
                : `${expenses.length} trip${expenses.length !== 1 ? 's' : ''} recorded`}
            </div>
          </div>
          <span style={{ fontSize: '3rem', opacity: 0.5 }}>⛽</span>
        </div>
      </Card>

      {/* Trip list */}
      {expenses.length === 0 ? (
        <Card>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📋</div>
            <h3 className={styles.emptyTitle}>No expenses yet</h3>
            <p className={styles.emptyText}>
              Go to <strong>Calculate Fuel</strong>, compute a trip, then click <strong>Add to Expenses</strong>.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Trip History</span>
            <button
              className={styles.clearBtn}
              onClick={() => expenses.forEach((e) => removeExpense(e.id))}
            >
              Clear all
            </button>
          </div>
          <div className={styles.list}>
            {expenses.map((expense, index) => (
              <Card key={expense.id} className={styles.tripCard}>
                <div className={styles.tripNumber}>{expenses.length - index}</div>
                <div className={styles.tripInfo}>
                  <div className={styles.tripRoute}>
                    <span>{expense.startPoint}</span>
                    <span className={styles.tripArrow}>→</span>
                    <span>{expense.destination}</span>
                  </div>
                  <div className={styles.tripDetails}>
                    <span>⛽ {expense.fuelType}</span>
                    <span>📏 {expense.distance.toLocaleString()} km</span>
                    <span>💧 {expense.litresUsed.toFixed(2)} L</span>
                  </div>
                </div>
                <div className={styles.tripCost}>
                  <span className={styles.tripCostAmount}>฿{fmt(expense.totalCost)}</span>
                  <span className={styles.tripCostUnit}>THB</span>
                </div>
                <Button variant="danger" onClick={() => removeExpense(expense.id)}>
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
