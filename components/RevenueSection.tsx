import React from 'react';
import { Payment } from '../types';

interface RevenueSectionProps {
  payments: Payment;
  onPaymentChange: (field: keyof Payment, value: number) => void;
}

const RevenueInputRow: React.FC<{ label: string, value: number, onValueChange: (value: number) => void }> = ({ label, value, onValueChange }) => (
    <div className="flex justify-between items-center py-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <input 
            type="number"
            value={value || ''}
            onChange={(e) => onValueChange(Number(e.target.value) || 0)}
            className="w-1/2 p-2 border border-gray-300 rounded-md text-right focus:ring-blue-500 focus:border-blue-500"
            onFocus={e => e.target.select()}
        />
    </div>
);

const RevenueSection: React.FC<RevenueSectionProps> = ({ payments, onPaymentChange }) => {

  // Fix: Explicitly set the generic type for reduce to <number> to ensure correct type inference for the accumulator.
  const totalReceipts = Object.values(payments).reduce<number>((sum, value) => sum + Number(value || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">Recette du groupe</h3>
      <div className="divide-y divide-gray-200">
          <RevenueInputRow label="Espèces" value={payments.cash} onValueChange={(v) => onPaymentChange('cash', v)} />
          <RevenueInputRow label="Chèques" value={payments.checks} onValueChange={(v) => onPaymentChange('checks', v)} />
          <RevenueInputRow label="Bon. Stat" value={payments.stateVoucher} onValueChange={(v) => onPaymentChange('stateVoucher', v)} />
          <RevenueInputRow label="TPE" value={payments.tpe} onValueChange={(v) => onPaymentChange('tpe', v)} />
          <RevenueInputRow label="O'card" value={payments.ocard} onValueChange={(v) => onPaymentChange('ocard', v)} />
          <RevenueInputRow label="Crédit" value={payments.credit} onValueChange={(v) => onPaymentChange('credit', v)} />
      </div>
      <div className="border-t-2 pt-4 space-y-2">
          <div className="flex justify-between items-center font-bold text-md">
              <span className="text-gray-800">Caisse Pompistes</span>
              <span className="text-blue-700">{totalReceipts.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-md">
              <span className="text-gray-800">TOTAL RECETTE</span>
              <span className="text-green-700">{totalReceipts.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</span>
          </div>
      </div>
    </div>
  );
};

export default RevenueSection;