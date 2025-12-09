import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { AlertTriangle, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';
import { RiskItem } from '../types';

interface DashboardProps {
  data: RiskItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Metrics Calculation
  const totalBudget = data.reduce((acc, item) => acc + item.cost, 0);
  const criticalItems = data.filter(i => i.priority === '1').length;
  const completedItems = data.filter(i => i.status === 'Completato').length;
  const complianceScore = Math.round((completedItems / data.length) * 100);

  // Chart Data
  const statusData = [
    { name: 'Completato', value: completedItems, color: '#10B981' },
    { name: 'In Corso', value: data.filter(i => i.status === 'In Corso').length, color: '#F59E0B' },
    { name: 'Non Iniziato', value: data.filter(i => i.status === 'Non Iniziato').length, color: '#EF4444' },
  ];

  const areaDataRaw = data.reduce((acc, item) => {
    acc[item.area] = (acc[item.area] || 0) + item.cost;
    return acc;
  }, {} as Record<string, number>);

  const budgetData = Object.keys(areaDataRaw).map(key => ({
    name: key,
    cost: areaDataRaw[key]
  }));

  const upcomingDeadlines = [...data]
    .filter(i => i.status !== 'Completato')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panoramica Sicurezza Condominio</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Score Conformità</p>
              <h3 className="text-3xl font-bold text-gray-900">{complianceScore}%</h3>
            </div>
            <div className={`p-3 rounded-full ${complianceScore > 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${complianceScore > 80 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${complianceScore}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Criticità Immediate</p>
              <h3 className="text-3xl font-bold text-red-600">{criticalItems}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Priorità 1 (Alto Rischio)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Budget Stimato</p>
              <h3 className="text-3xl font-bold text-gray-900">€{totalBudget.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Adeguamento completo</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Interventi Completati</p>
              <h3 className="text-3xl font-bold text-gray-900">{completedItems}/{data.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Progresso totale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Urgenze (Primi 90 Giorni)</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-l-transparent hover:border-l-red-500">
                <div className={`mt-1 p-2 rounded-full ${
                  item.priority === '1' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {new Date(item.deadline).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget per Macro-Area</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                <RechartsTooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                <Bar dataKey="cost" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};