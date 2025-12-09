export type PriorityLevel = '1' | '2' | '3'; // 1=Critico, 2=Alto, 3=Moderato
export type Status = 'Non Iniziato' | 'In Corso' | 'Completato';
export type Area = 'Strutturale' | 'Impianti' | 'Normativa' | 'Assicurazione' | 'Documentale';
export type Urgency = 'Immediato' | 'Breve Termine' | 'Medio Termine' | 'Lungo Termine';
export type CostRange = '€' | '€€' | '€€€';

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: Status;
  area: Area;
  cost: number; // Stima numerica
  costRange: CostRange;
  deadline: string; // ISO Date
  owner: string;
  dependencies?: string[];
  impact: string; // KPI description
  legalRisk: 'Penale' | 'Civile' | 'Amministrativo' | 'Patrimoniale';
  urgency: Urgency;
}

export interface DashboardMetrics {
  complianceScore: number;
  totalBudget: number;
  criticalCount: number;
  completedCount: number;
}