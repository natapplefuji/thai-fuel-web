import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FuelCalculator from './components/FuelCalculator';
import TotalExpenses from './components/TotalExpenses';
import Contact from './components/Contact';
import useFuelPrices from './hooks/useFuelPrices';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const { prices: fuelPrices, meta, loading, error, refetch } = useFuelPrices();

  const addExpense = (trip) => {
    setExpenses((prev) => [{ ...trip, id: Date.now() }, ...prev]);
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const sections = {
    dashboard: (
      <Dashboard
        fuelPrices={fuelPrices}
        meta={meta}
        loading={loading}
        error={error}
        refetch={refetch}
      />
    ),
    calculator: (
      <FuelCalculator fuelPrices={fuelPrices} addExpense={addExpense} />
    ),
    expenses: (
      <TotalExpenses expenses={expenses} removeExpense={removeExpense} />
    ),
    contact: <Contact />,
  };

  return (
    <>
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        expenseCount={expenses.length}
      />
      <main className="app-main">
        <div key={activeSection} className="section-enter">
          {sections[activeSection]}
        </div>
      </main>
    </>
  );
}
