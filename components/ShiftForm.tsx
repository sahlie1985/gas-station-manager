import React, { useState, useMemo, useEffect } from 'react';
import { Attendant, Pump, PumpReading, FuelType, Tank, Payment, OtherProduct, OtherProductSale, ShiftData, FuelPrices } from '../types';
import FuelSalesTable from './FuelSalesTable';
import RevenueSection from './RevenueSection';
import OtherServicesSection from './OtherServicesSection';
import DailySummary from './DailySummary';

interface DailyViewProps {
  attendants: Attendant[];
  pumps: Pump[];
  tanks: Tank[];
  prices: FuelPrices;
  otherProducts: OtherProduct[];
  shiftsForDay: ShiftData[];
  onDayUpdate: (updatedShifts: ShiftData[]) => void;
  onValidateAndAdvance: (shiftToValidate: ShiftData) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
}

const SHIFT_NAMES: ('Shift 1' | 'Shift 2' | 'Shift 3')[] = ['Shift 1', 'Shift 2', 'Shift 3'];

const DailyView: React.FC<DailyViewProps> = ({ 
    attendants, pumps, tanks, prices, otherProducts, shiftsForDay, 
    onDayUpdate, onValidateAndAdvance, currentDate, onDateChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const activeShiftIndex = useMemo(() => shiftsForDay.findIndex(s => s.status === 'open'), [shiftsForDay]);
  const currentShift = shiftsForDay[activeTab];
  
  // Update active tab when the active shift changes (e.g., after validation)
  useEffect(() => {
    setActiveTab(activeShiftIndex === -1 ? 2 : activeShiftIndex);
  }, [activeShiftIndex]);
  
  if (!currentShift) {
    return <div className="text-center p-8 bg-white rounded-lg shadow-md">Chargement des données du shift...</div>;
  }
  
  const isShiftEditable = currentShift.status === 'open';
  const isShiftActiveForValidation = activeTab === activeShiftIndex;

  const handleShiftChange = (field: keyof ShiftData, value: any) => {
    const updatedShift = { ...currentShift, [field]: value };
    const updatedDayShifts = shiftsForDay.map(s => s.id === updatedShift.id ? updatedShift : s);
    onDayUpdate(updatedDayShifts);
  };

  const handleSave = () => {
    onDayUpdate(shiftsForDay); // This will trigger the useEffect in App.tsx to save all shifts
    alert('Modifications enregistrées !');
  };

  const handleValidate = () => {
    if (window.confirm(`Voulez-vous vraiment valider et clôturer le ${currentShift.shift} ? Cette action est irréversible.`)) {
        onValidateAndAdvance(currentShift);
    }
  };

  const pumpsByFuelType = (fuelType: FuelType) => {
    const tankIds = tanks.filter(t => t.fuelType === fuelType).map(t => t.id);
    return pumps.filter(p => tankIds.includes(p.tankId));
  };
  
  const { totalFuelRevenue, totalOtherRevenue, totalRevenue, totalPayments, difference } = useMemo(() => {
    let fuelRev = 0, otherRev = 0, pay = { cash: 0, checks: 0, stateVoucher: 0, tpe: 0, ocard: 0, credit: 0 };

    shiftsForDay.forEach(shift => {
        shift.pumpReadings.forEach(reading => {
            const pump = pumps.find(p => p.id === reading.pumpId);
            if (!pump) return;
            const tank = tanks.find(t => t.id === pump.tankId);
            if (!tank) return;
            const price = prices[tank.fuelType];
            const sales = reading.endIndex - reading.startIndex - reading.testVolume;
            if (sales > 0) fuelRev += sales * price;
        });
        shift.otherSales.forEach(sale => otherRev += sale.quantity * sale.price);
        Object.keys(pay).forEach(key => pay[key as keyof Payment] += shift.payments[key as keyof Payment]);
    });
    
    const totalRev = fuelRev + otherRev;
    const totalPay = Object.values(pay).reduce((sum, val) => sum + val, 0);

    return {
      totalFuelRevenue: fuelRev,
      totalOtherRevenue: otherRev,
      totalRevenue: totalRev,
      totalPayments: totalPay,
      difference: totalPay - totalRev
    };
  }, [shiftsForDay, pumps, tanks, prices]);

  const TabButton: React.FC<{ index: number, shift: ShiftData }> = ({ index, shift }) => {
    const isActive = index === activeTab;
    const isCompleted = shift.status === 'completed';
    const isFutureActive = index > activeShiftIndex && activeShiftIndex !== -1;

    let bgColor = 'bg-white';
    let textColor = 'text-gray-600';
    if (isActive) {
        bgColor = 'bg-blue-600';
        textColor = 'text-white';
    } else if (isCompleted) {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
    } else if (isFutureActive) {
        bgColor = 'bg-gray-200';
        textColor = 'text-gray-400';
    }

    return (
        <button
          onClick={() => setActiveTab(index)}
          className={`px-4 py-3 text-lg font-bold rounded-t-lg transition-colors ${bgColor} ${textColor} border-gray-200 border-t border-l border-r`}
        >
          {shift.shift} {isCompleted ? ' (Clôturé)' : ''}
        </button>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Saisie de la Journée</h2>
        <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={currentDate} onChange={e => onDateChange(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
      </div>
      
      <div className="flex space-x-1 border-b-2 border-blue-600">
          {shiftsForDay.map((shift, index) => <TabButton key={shift.id} index={index} shift={shift}/>)}
      </div>

      {/* Form Content */}
      <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-lg space-y-8">
          <fieldset disabled={!isShiftEditable} className="space-y-8">
              {/* Shift Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pompiste</label>
                    <select value={currentShift.attendantId} onChange={e => handleShiftChange('attendantId', Number(e.target.value))} className="mt-1 p-2 w-full border border-gray-300 rounded-md disabled:bg-gray-100">
                      <option value="">Sélectionnez un pompiste</option>
                      {attendants.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
              </div>
              
              {/* Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <FuelSalesTable 
                        title={FuelType.SSP} 
                        pumps={pumpsByFuelType(FuelType.SSP)}
                        readings={currentShift.pumpReadings.filter(r => pumps.find(p=>p.id === r.pumpId && p.tankId && tanks.find(t=>t.id === p.tankId)?.fuelType === FuelType.SSP))}
                        onReadingChange={(r) => handleShiftChange('pumpReadings', currentShift.pumpReadings.map(pr => pr.pumpId === r.pumpId ? r : pr))}
                        price={prices[FuelType.SSP]}
                    />
                     <FuelSalesTable 
                        title={FuelType.Gasoil} 
                        pumps={pumpsByFuelType(FuelType.Gasoil)}
                        readings={currentShift.pumpReadings.filter(r => pumps.find(p=>p.id === r.pumpId && p.tankId && tanks.find(t=>t.id === p.tankId)?.fuelType === FuelType.Gasoil))}
                        onReadingChange={(r) => handleShiftChange('pumpReadings', currentShift.pumpReadings.map(pr => pr.pumpId === r.pumpId ? r : pr))}
                        price={prices[FuelType.Gasoil]}
                    />
                     <FuelSalesTable 
                        title={FuelType.GPL} 
                        pumps={pumpsByFuelType(FuelType.GPL)}
                        readings={currentShift.pumpReadings.filter(r => pumps.find(p=>p.id === r.pumpId && p.tankId && tanks.find(t=>t.id === p.tankId)?.fuelType === FuelType.GPL))}
                        onReadingChange={(r) => handleShiftChange('pumpReadings', currentShift.pumpReadings.map(pr => pr.pumpId === r.pumpId ? r : pr))}
                        price={prices[FuelType.GPL]}
                    />
                </div>
                <div className="space-y-6">
                    <RevenueSection payments={currentShift.payments} onPaymentChange={(field, value) => handleShiftChange('payments', {...currentShift.payments, [field]: value})} />
                    <OtherServicesSection products={otherProducts} sales={currentShift.otherSales} onSalesChange={(sales) => handleShiftChange('otherSales', sales)} />
                </div>
              </div>
          </fieldset>
      </div>
      
      <DailySummary 
        totalFuelRevenue={totalFuelRevenue}
        totalOtherRevenue={totalOtherRevenue}
        totalRevenue={totalRevenue}
        totalPayments={totalPayments}
        difference={difference}
      />

      <div className="flex justify-end items-center mt-8 gap-4">
        <button onClick={handleSave} className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors">
          Enregistrer
        </button>
        {isShiftActiveForValidation && (
            <button onClick={handleValidate} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
              Valider et Clôturer le Shift
            </button>
        )}
      </div>
    </div>
  );
};

export default DailyView;
