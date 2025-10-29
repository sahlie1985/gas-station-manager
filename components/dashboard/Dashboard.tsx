import React, { useState, useMemo } from 'react';
import { ShiftData, Pump, Tank, FuelPrices, FuelType, DailySummaryData } from '../../types';
import KPICard from './KPICard';
import SummaryTable from './SummaryTable';
import { generateDailySummary } from '../../services/template';

interface DashboardProps {
  shifts: ShiftData[];
  pumps: Pump[];
  tanks: Tank[];
  prices: FuelPrices;
}

const Dashboard: React.FC<DashboardProps> = ({ shifts, pumps, tanks, prices }) => {
  const uniqueDates = useMemo(() => {
    const dates = new Set(shifts.map(s => s.date));
    return Array.from(dates).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
  }, [shifts]);
  
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] || new Date().toISOString().split('T')[0]);

  const dailySummary: DailySummaryData | null = useMemo(() => {
    return generateDailySummary(selectedDate, shifts, pumps, tanks, prices);
  }, [selectedDate, shifts, pumps, tanks, prices]);

  if (shifts.length === 0) {
      return (
        <div className="text-center p-10 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700">Aucune donnée disponible</h2>
            <p className="text-gray-500 mt-2">Commencez par enregistrer un shift pour voir les données ici.</p>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
        <label htmlFor="date-select" className="font-bold text-gray-700">Sélectionner une date:</label>
        <select 
            id="date-select"
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
        >
            {uniqueDates.map(date => <option key={date} value={date}>{new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</option>)}
        </select>
      </div>

      {!dailySummary ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-700">Aucune donnée pour cette date</h2>
              <p className="text-gray-500 mt-2">Veuillez sélectionner une autre date.</p>
          </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Recettes" value={dailySummary.totalRevenue} isCurrency={true} />
                <KPICard title="Ventes SSP (L)" value={dailySummary.totalFuelSales[FuelType.SSP]?.volume || 0} />
                <KPICard title="Ventes Gasoil (L)" value={dailySummary.totalFuelSales[FuelType.Gasoil]?.volume || 0} />
                <KPICard title="Manquant/Excédent" value={dailySummary.shortageOrOverage} isCurrency={true} trend={dailySummary.shortageOrOverage >= 0 ? 'up' : 'down'} />
            </div>

            <SummaryTable summary={dailySummary} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
