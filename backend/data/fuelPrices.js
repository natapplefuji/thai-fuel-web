const fuelPrices = {
  lastUpdated: new Date().toISOString(),
  currency: 'THB',
  unit: 'Baht per Litre',
  source: 'PTT / EPPO Thailand (Mock Data)',
  prices: [
    {
      id: 'gasohol95',
      name: 'Gasohol 95 (E10)',
      shortName: 'Gasohol 95',
      price: 39.66,
      color: '#f97316',
      description: 'Premium unleaded with 10% ethanol',
    },
    {
      id: 'gasohol91',
      name: 'Gasohol 91',
      shortName: 'Gasohol 91',
      price: 36.42,
      color: '#22c55e',
      description: 'Standard unleaded with ethanol blend',
    },
    {
      id: 'e20',
      name: 'Gasohol E20',
      shortName: 'E20',
      price: 35.94,
      color: '#84cc16',
      description: 'High ethanol blend (20% ethanol)',
    },
    {
      id: 'e85',
      name: 'Gasohol E85',
      shortName: 'E85',
      price: 22.94,
      color: '#10b981',
      description: 'Flex fuel — 85% ethanol',
    },
    {
      id: 'diesel',
      name: 'Diesel B7',
      shortName: 'Diesel B7',
      price: 33.44,
      color: '#3b82f6',
      description: 'Standard diesel with 7% biodiesel',
    },
    {
      id: 'premDiesel',
      name: 'Premium Diesel B7',
      shortName: 'Prem. Diesel',
      price: 40.14,
      color: '#6366f1',
      description: 'High-performance diesel with additives',
    },
  ],
};

module.exports = fuelPrices;
