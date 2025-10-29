import React from 'react';
import { DailySummaryData, FuelType } from '../../types';

interface SummaryTableProps {
    summary: DailySummaryData;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ summary }) => {
    
    const format = (val: number | undefined) => (val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 3 });
    const formatVol = (val: number | undefined) => (val || 0).toLocaleString('fr-FR');

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Détails du Jour: {new Date(summary.date).toLocaleDateString('fr-FR')}</h2>
            
            {/* Sales Summary */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ventes</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-right">Volume (L)</th>
                            <th className="px-4 py-2 text-right">Revenu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(FuelType).map(ft => (
                            <tr key={ft}>
                                <td className="px-4 py-2">{ft}</td>
                                <td className="px-4 py-2 text-right">{formatVol(summary.totalFuelSales[ft]?.volume)}</td>
                                <td className="px-4 py-2 text-right">{format(summary.totalFuelSales[ft]?.revenue)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className="px-4 py-2">Autres Ventes</td>
                            <td className="px-4 py-2 text-right">-</td>
                            <td className="px-4 py-2 text-right">{format(summary.totalOtherSalesRevenue)}</td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                        <tr>
                            <td className="px-4 py-2">Total</td>
                            <td className="px-4 py-2 text-right"></td>
                            <td className="px-4 py-2 text-right">{format(summary.totalRevenue)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Payments Summary */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Paiements</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {Object.entries(summary.payments).map(([key, value]) => (
                         <div key={key} className="flex justify-between border-b pb-1">
                             <span className="capitalize">{key}</span>
                             <span>{format(value)}</span>
                         </div>
                    ))}
                    <div className="col-span-2 flex justify-between font-bold text-lg mt-2 pt-2 border-t-2">
                         <span>Total Paiements</span>
                         <span>{format(summary.totalPayments)}</span>
                    </div>
                </div>
            </div>

            {/* Tank Summary */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">État des Cuves</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                           {['Cuve', 'Stock Début', 'Achats', 'Ventes', 'Stock Théorique', 'Stock Physique', 'Différence'].map(h => (
                               <th key={h} className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">{h}</th>
                           ))}
                        </tr>
                    </thead>
                    <tbody>
                        {summary.tankSummaries.map(ts => (
                             <tr key={ts.id}>
                                <td className="px-2 py-2 text-left">{ts.name}</td>
                                <td className="px-2 py-2 text-right">{formatVol(ts.startStock)}</td>
                                <td className="px-2 py-2 text-right">{formatVol(ts.purchases)}</td>
                                <td className="px-2 py-2 text-right text-red-600">{formatVol(ts.sales)}</td>
                                <td className="px-2 py-2 text-right">{formatVol(ts.theoreticalStock)}</td>
                                <td className="px-2 py-2 text-right">{formatVol(ts.physicalStock)}</td>
                                <td className={`px-2 py-2 text-right font-bold ${ts.difference < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatVol(ts.difference)}</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryTable;
