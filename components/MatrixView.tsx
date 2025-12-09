import React, { useMemo } from 'react';
import { RiskItem } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ZAxis, ReferenceLine } from 'recharts';

interface MatrixProps {
  data: RiskItem[];
}

export const MatrixView: React.FC<MatrixProps> = ({ data }) => {
  
  const matrixData = useMemo(() => {
    return data.map((item, index) => {
      // Map Urgency to X-axis (0-100)
      let xVal = 0;
      switch(item.urgency) {
        case 'Immediato': xVal = 85; break;
        case 'Breve Termine': xVal = 65; break;
        case 'Medio Termine': xVal = 35; break;
        case 'Lungo Termine': xVal = 15; break;
        default: xVal = 10;
      }
      // Add deterministic jitter based on ID/Index to avoid overlap
      const jitterX = (index % 2 === 0 ? 1 : -1) * (index % 5); 
      
      // Map Cost to Y-axis (0-100) using Logarithmic scale
      // Min significant cost ~100, Max ~50000
      const minLog = 2; // log10(100) = 2
      const maxLog = 5; // log10(100000) = 5
      let yVal = 10;
      
      if (item.cost > 0) {
        const logCost = Math.log10(item.cost);
        // Normalize between 10 and 90
        yVal = 10 + ((Math.max(logCost, minLog) - minLog) / (maxLog - minLog)) * 80;
      }

      // Add deterministic jitter for Y as well
      const jitterY = (index % 3 === 0 ? 1 : -1) * (index % 3);

      return {
        ...item,
        x: Math.min(Math.max(xVal + jitterX, 5), 95),
        y: Math.min(Math.max(yVal + jitterY, 5), 95),
        z: item.priority === '1' ? 400 : item.priority === '2' ? 200 : 100, // Size
        fill: item.priority === '1' ? '#EF4444' : item.priority === '2' ? '#F97316' : '#EAB308'
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded text-sm z-50">
          <p className="font-bold text-gray-800">#{data.id} {data.title}</p>
          <div className="mt-1 text-xs text-gray-600">
            <p>Costo: €{data.cost.toLocaleString()}</p>
            <p>Urgenza: {data.urgency}</p>
            <p>Priorità: {data.priority}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Matrice Decisionale</h2>
        <p className="text-gray-500 mb-6">Mappatura degli interventi basata sul rapporto Costo/Urgenza per definire le priorità di investimento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Matrix Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-[600px] relative">
           <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">Analisi Costo vs Urgenza</h3>
           
           {/* Quadrant Labels */}
           <div className="absolute top-12 right-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 z-10">Investimenti Prioritari</div>
           <div className="absolute top-12 left-16 text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100 z-10">Pianificazione Strategica</div>
           <div className="absolute bottom-12 right-4 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded border border-green-100 z-10">Quick Wins</div>
           <div className="absolute bottom-12 left-16 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 z-10">Ottimizzazione</div>

           <ResponsiveContainer width="100%" height="90%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Urgenza" 
                domain={[0, 100]} 
                tick={false} 
                label={{ value: 'Urgenza Crescente →', position: 'bottom', offset: 0, fill: '#6b7280', fontSize: 12 }} 
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Costo" 
                domain={[0, 100]} 
                tick={false} 
                label={{ value: 'Costo Crescente →', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }} 
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Quadrant Lines */}
              <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="5 5" />
              <ReferenceLine y={50} stroke="#9ca3af" strokeDasharray="5 5" />

              <Scatter name="Interventi" data={matrixData} fill="#8884d8">
                 <LabelList 
                    dataKey="id" 
                    position="center" 
                    style={{ fontSize: '10px', fontWeight: 'bold', fill: '#fff', textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }} 
                 />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Textual Analysis Side Panel */}
        <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
            <h4 className="font-semibold text-gray-700 sticky top-0 bg-gray-50 py-2">Dettagli Quadranti</h4>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h5 className="text-red-800 font-bold text-sm mb-1">🔴 Investimenti Prioritari</h5>
                <p className="text-xs text-red-600 mb-2">Alta Urgenza + Alto Costo. Richiedono budget immediato.</p>
                <ul className="space-y-1">
                    {data.filter(i => i.cost > 5000 && (i.urgency === 'Immediato' || i.urgency === 'Breve Termine')).map(i => (
                        <li key={i.id} className="text-xs text-red-700 flex justify-between">
                            <span>#{i.id} {i.title}</span>
                            <span className="font-mono">€{i.cost.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h5 className="text-green-800 font-bold text-sm mb-1">🟢 Quick Wins</h5>
                <p className="text-xs text-green-600 mb-2">Alta Urgenza + Basso Costo. Massima resa minima spesa.</p>
                <ul className="space-y-1">
                    {data.filter(i => i.cost <= 5000 && (i.urgency === 'Immediato' || i.urgency === 'Breve Termine')).map(i => (
                        <li key={i.id} className="text-xs text-green-700 flex justify-between">
                            <span>#{i.id} {i.title}</span>
                            <span className="font-mono">€{i.cost.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h5 className="text-blue-800 font-bold text-sm mb-1">🔵 Strategici / Pianificazione</h5>
                <p className="text-xs text-blue-600 mb-2">Bassa Urgenza. Da inserire nel piano pluriennale.</p>
                <ul className="space-y-1">
                    {data.filter(i => i.urgency === 'Medio Termine' || i.urgency === 'Lungo Termine').map(i => (
                        <li key={i.id} className="text-xs text-blue-700 flex justify-between">
                            <span>#{i.id} {i.title}</span>
                            <span className="font-mono">€{i.cost.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};