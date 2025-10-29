
import React from 'react';
import { PumpReading, Pump } from '../types';

interface FuelSalesTableProps {
  title: string;
  pumps: Pump[]; // All pumps for this fuel type
  readings: PumpReading[]; // Readings for this shift
  onReadingChange: (updatedReading: PumpReading) => void;
  price: number;
}

const NumberInput: React.FC<{ value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, onChange }) => (
    <input 
        type="number"
        value={value || ''}
        onChange={onChange}
        className="w-full bg-gray-50 p-2 border border-gray-200 rounded-md text-right focus:ring-blue-500 focus:border-blue-500"
        onFocus={e => e.target.select()}
    />
);

const FuelSalesTable: React.FC<FuelSalesTableProps> = ({ title, pumps, readings, onReadingChange, price }) => {

  const { totalSales, totalRevenue } = readings.reduce((acc, reading) => {
    const sale = reading.endIndex - reading.startIndex - reading.testVolume;
    if (sale > 0) {
        acc.totalSales += sale;
        acc.totalRevenue += sale * (price || 0);
    }
    return acc;
  }, { totalSales: 0, totalRevenue: 0 });

  const handleInputChange = (pumpId: number, field: 'startIndex' | 'endIndex' | 'testVolume', value: string) => {
      const reading = readings.find(r => r.pumpId === pumpId);
      if (reading) {
          onReadingChange({ ...reading, [field]: Number(value) || 0 });
      }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Pistolet</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Index départ</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Essai</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Index final</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total ventes</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Recettes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pumps.map((pump) => {
                const reading = readings.find(r => r.pumpId === pump.id) || { pumpId: pump.id, startIndex: 0, endIndex: 0, testVolume: 0 };
                const sales = reading.endIndex - reading.startIndex - reading.testVolume;
                const revenue = sales > 0 ? sales * (price || 0) : 0;
                return (
                    <tr key={pump.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{pump.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <NumberInput value={reading.startIndex} onChange={(e) => handleInputChange(pump.id, 'startIndex', e.target.value)} />
                        </td>
                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <NumberInput value={reading.testVolume} onChange={(e) => handleInputChange(pump.id, 'testVolume', e.target.value)} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                           <NumberInput value={reading.endIndex} onChange={(e) => handleInputChange(pump.id, 'endIndex', e.target.value)} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 text-right">{sales > 0 ? sales.toLocaleString() : 0}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 text-right">{revenue > 0 ? revenue.toLocaleString('fr-FR', { minimumFractionDigits: 3 }) : '0,000'}</td>
                    </tr>
                );
            })}
          </tbody>
          <tfoot className="bg-gray-200">
            <tr>
              <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-800">Total</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-blue-700">{totalSales.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-700">{totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FuelSalesTable;
