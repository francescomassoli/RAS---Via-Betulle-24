import React, { useState, useMemo } from 'react';
import { RiskItem, PriorityLevel, Status, Area, CostRange, Urgency } from '../types';
import { Filter, Calendar, AlertOctagon, Banknote, ChevronDown, ChevronUp, Edit2, CheckCircle, X } from 'lucide-react';

interface BoardProps {
  data: RiskItem[];
  onUpdateItem: (item: RiskItem) => void;
}

export const StrategicBoard: React.FC<BoardProps> = ({ data, onUpdateItem }) => {
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'All'>('All');
  const [filterArea, setFilterArea] = useState<Area | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RiskItem | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filterPriority !== 'All' && item.priority !== filterPriority) return false;
      if (filterArea !== 'All' && item.area !== filterArea) return false;
      if (filterStatus !== 'All' && item.status !== filterStatus) return false;
      return true;
    });
  }, [data, filterPriority, filterArea, filterStatus]);

  const getPriorityColor = (p: PriorityLevel) => {
    switch (p) {
      case '1': return 'bg-red-500 text-white';
      case '2': return 'bg-orange-500 text-white';
      case '3': return 'bg-yellow-400 text-gray-900';
    }
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case 'Completato': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Corso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Non Iniziato': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusCycle = (item: RiskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const statusMap: Record<Status, Status> = {
      'Non Iniziato': 'In Corso',
      'In Corso': 'Completato',
      'Completato': 'Non Iniziato'
    };
    onUpdateItem({ ...item, status: statusMap[item.status] });
  };

  const openEditModal = (item: RiskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setIsEditModalOpen(false);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Piano Strategico</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 px-2 text-gray-500">
            <Filter size={16} />
            <span className="text-sm font-medium">Filtri:</span>
          </div>
          
          <select 
            className="text-sm border-none bg-gray-50 rounded-md py-1.5 px-3 focus:ring-1 focus:ring-blue-500"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as PriorityLevel | 'All')}
          >
            <option value="All">Priorità: Tutte</option>
            <option value="1">Critico (1)</option>
            <option value="2">Alto (2)</option>
            <option value="3">Moderato (3)</option>
          </select>

          <select 
            className="text-sm border-none bg-gray-50 rounded-md py-1.5 px-3 focus:ring-1 focus:ring-blue-500"
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value as Area | 'All')}
          >
            <option value="All">Area: Tutte</option>
            <option value="Strutturale">Strutturale</option>
            <option value="Impianti">Impianti</option>
            <option value="Normativa">Normativa</option>
            <option value="Assicurazione">Assicurazione</option>
            <option value="Documentale">Documentale</option>
          </select>
        </div>
      </div>

      {/* Kanban List */}
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-xl border transition-all duration-200 shadow-sm ${
              expandedId === item.id ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Status & Priority Badge */}
                <div className="flex items-center gap-3 md:w-48 shrink-0">
                  <span className={`w-3 h-3 rounded-full ${
                     item.priority === '1' ? 'bg-red-500 animate-pulse' : 
                     item.priority === '2' ? 'bg-orange-500' : 'bg-yellow-400'
                  }`} />
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                    P{item.priority}
                  </span>
                  <button 
                    onClick={(e) => handleStatusCycle(item, e)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border hover:opacity-80 transition-opacity ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </button>
                </div>

                {/* Main Content Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.priority === '1' && <AlertOctagon size={16} className="text-red-500" />}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Area:</span> {item.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> 
                      <span className={`${new Date(item.deadline) < new Date() ? 'text-red-600 font-bold' : ''}`}>
                         {new Date(item.deadline).toLocaleDateString('it-IT')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Side Info */}
                <div className="flex items-center justify-between md:justify-end gap-4 md:w-64 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">€{item.cost.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{item.costRange}</p>
                  </div>
                  <button 
                    onClick={(e) => openEditModal(item, e)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  {expandedId === item.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === item.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-6 rounded-b-xl animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Dettagli Intervento</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-1">
                        <span className="text-gray-500">Responsabile</span>
                        <span className="font-medium text-gray-900">{item.owner}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-1">
                        <span className="text-gray-500">Urgenza</span>
                        <span className="font-medium text-gray-900">{item.urgency}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-1">
                        <span className="text-gray-500">Dipendenze</span>
                        <span className="font-medium text-gray-900">
                          {item.dependencies ? `ID: ${item.dependencies.join(', ')}` : 'Nessuna'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Banknote size={16} /> Analisi Impatto
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Rischio Legale</p>
                        <p className={`text-sm font-medium mt-1 ${
                          item.legalRisk === 'Penale' ? 'text-red-600' : 'text-gray-800'
                        }`}>
                          {item.legalRisk}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Beneficio Atteso (KPI)</p>
                        <p className="text-sm text-gray-800 mt-1">{item.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button 
                      onClick={(e) => openEditModal(item, e)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Modifica Dati
                    </button>
                    <button 
                      onClick={(e) => handleStatusCycle(item, e)}
                      className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                       Avanza Stato <CheckCircle size={16} />
                    </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Modifica Intervento</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={saveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                <input 
                  type="text" 
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea 
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Costo Stimato (€)</label>
                    <input 
                      type="number" 
                      value={editingItem.cost}
                      onChange={(e) => setEditingItem({...editingItem, cost: Number(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza</label>
                    <input 
                      type="date" 
                      value={editingItem.deadline}
                      onChange={(e) => setEditingItem({...editingItem, deadline: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                    <select 
                      value={editingItem.priority}
                      onChange={(e) => setEditingItem({...editingItem, priority: e.target.value as PriorityLevel})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="1">1 - Critico</option>
                      <option value="2">2 - Alto</option>
                      <option value="3">3 - Moderato</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgenza</label>
                    <select 
                      value={editingItem.urgency}
                      onChange={(e) => setEditingItem({...editingItem, urgency: e.target.value as Urgency})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Immediato">Immediato</option>
                      <option value="Breve Termine">Breve Termine</option>
                      <option value="Medio Termine">Medio Termine</option>
                      <option value="Lungo Termine">Lungo Termine</option>
                    </select>
                 </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsabile</label>
                <input 
                  type="text" 
                  value={editingItem.owner}
                  onChange={(e) => setEditingItem({...editingItem, owner: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                >
                  Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};