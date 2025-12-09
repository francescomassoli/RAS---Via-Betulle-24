import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  FileText, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'board', label: 'Strategic Board', icon: ListTodo },
    { id: 'matrix', label: 'Matrici Analisi', icon: BarChart3 },
    { id: 'reports', label: 'Report & Export', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-blue-400 h-8 w-8" />
            <div>
              <h1 className="text-lg font-bold leading-none">RAS Strategico</h1>
              <p className="text-xs text-slate-400 mt-1">Via Betulle 24, Roma</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-800 m-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">Stato Globale</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">Critico</span>
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Priorità 1</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Aggiornato: Ott 2025</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
            <span className="font-semibold text-gray-800">
                {navItems.find(i => i.id === activeTab)?.label}
            </span>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
                <Menu className="h-6 w-6 text-gray-600" />
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};