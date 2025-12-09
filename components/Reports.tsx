import React from 'react';
import { FileDown, Printer, Share2 } from 'lucide-react';
import { RiskItem } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  data: RiskItem[];
}

export const Reports: React.FC<ReportsProps> = ({ data }) => {
  
  const generatePDF = (reportType: string) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('it-IT');

    // Header
    doc.setFontSize(20);
    doc.text(`RAS Strategico - Via Betulle 24`, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data Report: ${today}`, 14, 28);
    doc.text(`Tipo: ${reportType}`, 14, 33);
    
    doc.line(14, 38, 196, 38);

    // Body based on report type
    if (reportType.includes('Delibera')) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Proposta Interventi Prioritari (Urgenti)", 14, 50);
        
        const urgentItems = data
            .filter(i => i.priority === '1' || i.priority === '2')
            .map(i => [
                `P${i.priority}`, 
                i.title, 
                i.owner, 
                `€ ${i.cost.toLocaleString()}`
            ]);

        autoTable(doc, {
            startY: 55,
            head: [['Priorità', 'Intervento', 'Responsabile', 'Stima Costo']],
            body: urgentItems,
            theme: 'grid',
            headStyles: { fillColor: [220, 53, 69] }
        });
        
        const total = data.filter(i => i.priority === '1' || i.priority === '2').reduce((acc, i) => acc + i.cost, 0);
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(12);
        doc.text(`Totale Stimato Delibera: € ${total.toLocaleString()}`, 14, finalY);

    } else if (reportType.includes('Piano Triennale')) {
         doc.setFontSize(14);
         doc.setTextColor(0);
         doc.text("Pianificazione Interventi (Tutti)", 14, 50);

         const allItems = data
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .map(i => [
                new Date(i.deadline).toLocaleDateString('it-IT'),
                i.title,
                i.urgency,
                `€ ${i.cost.toLocaleString()}`
            ]);

          autoTable(doc, {
            startY: 55,
            head: [['Scadenza', 'Intervento', 'Urgenza', 'Costo']],
            body: allItems,
            theme: 'striped',
            headStyles: { fillColor: [66, 139, 202] }
        });
    } else {
        // Generic dump
        doc.setFontSize(12);
        doc.text("Riepilogo completo criticità", 14, 50);
        
        const rows = data.map(i => [i.title, i.area, i.status]);
        autoTable(doc, {
            startY: 55,
            head: [['Titolo', 'Area', 'Stato']],
            body: rows,
        });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Documento generato automaticamente da RAS Strategico App.", 14, 285);

    // Save
    doc.save(`${reportType.replace(/\s/g, '_')}_${Date.now()}.pdf`);
  };

  const reports = [
    { title: 'Proposta Delibera Assembleare', desc: 'Documento pre-compilato con le criticità priorità 1 e 2 e relativi preventivi stimati.', color: 'bg-blue-600' },
    { title: 'Piano Triennale Manutenzione', desc: 'Roadmap degli interventi suddivisa per anno fiscale, con previsione flussi di cassa.', color: 'bg-indigo-600' },
    { title: 'Audit Report Assicurativo', desc: 'Stato di fatto dei rischi per rinegoziazione polizza globale fabbricati.', color: 'bg-emerald-600' },
    { title: 'Checklist Passaggio Consegne', desc: 'Elenco documentale e stato conformità per tutela amministratore.', color: 'bg-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Centro Reportistica</h2>
      <p className="text-gray-600">Genera documentazione ufficiale basata sui dati attuali del RAS.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-500 text-sm mb-6">{report.desc}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => generatePDF(report.title)}
                className={`flex items-center gap-2 px-4 py-2 ${report.color} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-md active:transform active:scale-95`}
              >
                <FileDown size={16} /> Scarica PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Printer size={16} /> Stampa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <Share2 size={18}/> Condivisione Consiglieri
        </h4>
        <p className="text-sm text-yellow-700 mb-4">
            È possibile generare un link di sola lettura alla Dashboard per i consiglieri di condominio, oscurando i dettagli sensibili (nomi fornitori e importi specifici non deliberati).
        </p>
        <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 border border-yellow-200">
            Copia Link Pubblico
        </button>
      </div>
    </div>
  );
};