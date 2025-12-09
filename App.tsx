import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StrategicBoard } from './components/StrategicBoard';
import { MatrixView } from './components/MatrixView';
import { Reports } from './components/Reports';
import { rasData } from './data';
import { RiskItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize state from LocalStorage if available, otherwise use default data
  const [data, setData] = useState<RiskItem[]>(() => {
    const saved = localStorage.getItem('rasData_betulle24');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved data", e);
        return rasData;
      }
    }
    return rasData;
  });

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('rasData_betulle24', JSON.stringify(data));
  }, [data]);

  // Function to update a single item
  const updateRiskItem = (updatedItem: RiskItem) => {
    setData(prevData => prevData.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'board':
        return <StrategicBoard data={data} onUpdateItem={updateRiskItem} />;
      case 'matrix':
        return <MatrixView data={data} />;
      case 'reports':
        return <Reports data={data} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;