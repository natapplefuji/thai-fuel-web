import { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import styles from './FuelCalculator.module.css';

const EMPTY_FORM = {
  startPoint: '',
  destination: '',
  distance: '',
  fuelTypeId: '',
  fuelEfficiency: '',
};

export default function FuelCalculator({ fuelPrices, addExpense, isAuthenticated, onOpenAuth }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(false);

  // Auto-select first fuel type when prices load
  useEffect(() => {
    if (fuelPrices.length && !form.fuelTypeId) {
      setForm((f) => ({ ...f, fuelTypeId: fuelPrices[0].id }));
    }
  }, [fuelPrices]);

  const selectedFuel = fuelPrices.find((p) => p.id === form.fuelTypeId) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear result when inputs change
    setResult(null);
  };

  const canCalculate =
    form.distance && form.fuelEfficiency && form.fuelTypeId && Number(form.distance) > 0 && Number(form.fuelEfficiency) > 0;

  const handleCalculate = () => {
    if (!canCalculate || !selectedFuel) return;
    const distance = Number(form.distance);
    const efficiency = Number(form.fuelEfficiency);
    const price = selectedFuel.price;
    const litresUsed = distance / efficiency;
    const totalCost = litresUsed * price;
    setResult({ distance, efficiency, litresUsed, totalCost, fuelType: selectedFuel.name, price });
  };

  const handleAddExpense = () => {
    if (!result) return;
    addExpense({
      startPoint: form.startPoint || 'Unknown',
      destination: form.destination || 'Unknown',
      fuelType: result.fuelType,
      distance: result.distance,
      litresUsed: result.litresUsed,
      totalCost: result.totalCost,
    });
    // Show success toast briefly
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="section-container">
      <h1 className="section-title">Calculate Fuel</h1>
      <p className="section-subtitle">Enter your trip details to estimate fuel cost</p>

      <div className={styles.layout}>
        {/* Form */}
        <Card>
          <div className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="startPoint">
                  Start Point
                </label>
                <input
                  id="startPoint"
                  name="startPoint"
                  className={styles.input}
                  placeholder="e.g. Bangkok"
                  value={form.startPoint}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="destination">
                  Destination
                </label>
                <input
                  id="destination"
                  name="destination"
                  className={styles.input}
                  placeholder="e.g. Chiang Mai"
                  value={form.destination}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="distance">
                Distance <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="distance"
                  name="distance"
                  type="number"
                  min="0"
                  step="0.1"
                  className={styles.input}
                  placeholder="0"
                  value={form.distance}
                  onChange={handleChange}
                />
                <span className={styles.inputSuffix}>km</span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="fuelTypeId">
                Fuel Type <span className={styles.required}>*</span>
              </label>
              <select
                id="fuelTypeId"
                name="fuelTypeId"
                className={styles.select}
                value={form.fuelTypeId}
                onChange={handleChange}
              >
                {fuelPrices.length === 0 && (
                  <option value="">Loading fuel types...</option>
                )}
                {fuelPrices.map((fuel) => (
                  <option key={fuel.id} value={fuel.id}>
                    {fuel.name} — ฿{fuel.price.toFixed(2)}/L
                  </option>
                ))}
              </select>
              {selectedFuel && (
                <p className={styles.priceNote}>
                  Current price: <span>฿{selectedFuel.price.toFixed(2)} per litre</span>
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="fuelEfficiency">
                Fuel Efficiency <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="fuelEfficiency"
                  name="fuelEfficiency"
                  type="number"
                  min="0"
                  step="0.1"
                  className={styles.input}
                  placeholder="e.g. 14"
                  value={form.fuelEfficiency}
                  onChange={handleChange}
                />
                <span className={styles.inputSuffix}>km/L</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleCalculate} disabled={!canCalculate} size="lg">
                Calculate
              </Button>
              {isAuthenticated ? (
                <Button
                  onClick={handleAddExpense}
                  disabled={!result}
                  variant="secondary"
                  size="lg"
                >
                  + Add to Expenses
                </Button>
              ) : (
                <Button
                  onClick={onOpenAuth}
                  variant="outline"
                  size="lg"
                >
                  Log in to save
                </Button>
              )}
            </div>

            {toast && (
              <div className={styles.successToast}>
                ✓ Trip added to expenses!
              </div>
            )}
          </div>
        </Card>

        {/* Result */}
        <Card highlighted={!!result} className={styles.resultCard}>
          {result ? (
            <>
              <div className={styles.resultTitle}>
                <span>⛽</span> Calculation Result
              </div>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultItemLabel}>Distance</span>
                  <span className={styles.resultItemValue}>{result.distance.toLocaleString()} km</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultItemLabel}>Fuel Efficiency</span>
                  <span className={styles.resultItemValue}>{result.efficiency} km/L</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultItemLabel}>Fuel Type</span>
                  <span className={styles.resultItemValue}>{result.fuelType}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultItemLabel}>Litres Used</span>
                  <span className={styles.resultItemValue}>{result.litresUsed.toFixed(2)} L</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultItemLabel}>Price per Litre</span>
                  <span className={styles.resultItemValue}>฿{result.price.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Cost</span>
                <div>
                  <span className={styles.totalValue}>
                    ฿{result.totalCost.toLocaleString('en-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={styles.totalUnit}> THB</span>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyResult}>
              <div className={styles.emptyIcon}>🧮</div>
              <p className={styles.emptyText}>Fill in the form and click <strong>Calculate</strong> to see your fuel cost estimate.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
