import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FuelCalculator from './components/FuelCalculator';
import TotalExpenses from './components/TotalExpenses';
import Contact from './components/Contact';
import AuthModal from './components/AuthModal';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import useFuelPrices from './hooks/useFuelPrices';
import useAuth from './hooks/useAuth';
import useExpenses from './hooks/useExpenses';

function LoginPrompt({ onOpenAuth }) {
  return (
    <div className="section-container">
      <h1 className="section-title">Total Expenses</h1>
      <p className="section-subtitle">All saved trips and cumulative fuel cost</p>
      <Card style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>Log in to view your expenses</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Your fuel expenses are saved to your account and available across sessions.
        </p>
        <Button onClick={onOpenAuth}>Log In / Register</Button>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { prices: fuelPrices, meta, loading, error, refetch } = useFuelPrices();
  const { user, token, authLoading, authError, login, register, logout } = useAuth();
  const { expenses, loading: expLoading, error: expError, addExpense, removeExpense, refetch: refetchExpenses } = useExpenses(token, logout);

  // Auto-close modal when user successfully logs in
  useEffect(() => {
    if (user) setShowAuthModal(false);
  }, [user]);

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
      <FuelCalculator
        fuelPrices={fuelPrices}
        addExpense={addExpense}
        isAuthenticated={!!user}
        onOpenAuth={() => setShowAuthModal(true)}
      />
    ),
    expenses: user
      ? (
        <TotalExpenses
          expenses={expenses}
          removeExpense={removeExpense}
          loading={expLoading}
          error={expError}
          refetch={refetchExpenses}
        />
      )
      : <LoginPrompt onOpenAuth={() => setShowAuthModal(true)} />,
    contact: <Contact />,
  };

  return (
    <>
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        expenseCount={expenses.length}
        user={user}
        onLogout={logout}
        onOpenAuth={() => setShowAuthModal(true)}
      />
      <main className="app-main">
        <div key={activeSection} className="section-enter">
          {sections[activeSection]}
        </div>
      </main>
      {showAuthModal && (
        <AuthModal
          authError={authError}
          onLogin={login}
          onRegister={register}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
