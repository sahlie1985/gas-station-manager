import React from 'react';

interface DailySummaryProps {
  totalFuelRevenue: number;
  totalOtherRevenue: number;
  totalRevenue: number;
  totalPayments: number;
  difference: number;
}

const SummaryRow: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text-gray-800' }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-md font-medium text-gray-700">{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</span>
    </div>
);

const DailySummary: React.FC<DailySummaryProps> = ({ totalFuelRevenue, totalOtherRevenue, totalRevenue, totalPayments, difference }) => {
  const differenceColor = difference < 0 ? 'text-red-600' : 'text-green-600';
  const differenceLabel = difference < 0 ? 'Manquant' : 'Excédent';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Récapitulatif du Shift</h3>
      <div className="space-y-2">
        <SummaryRow label="Total Ventes Carburants" value={totalFuelRevenue} color="text-blue-700" />
        <SummaryRow label="Total Autres Ventes" value={totalOtherRevenue} color="text-indigo-700" />
        <SummaryRow label="TOTAL VENTES" value={totalRevenue} color="text-black" />
        <hr className="my-2" />
        <SummaryRow label="TOTAL RECETTE" value={totalPayments} color="text-green-700" />
        <hr className="my-4 border-t-2 border-gray-300" />
        <SummaryRow label={differenceLabel} value={Math.abs(difference)} color={differenceColor} />
      </div>
    </div>
  );
};

export default DailySummary;
