import React, { useState, useEffect, useMemo } from 'react';
import DailyView from './components/ShiftForm';
import Configuration from './components/config/Configuration';
import Dashboard from './components/dashboard/Dashboard';
import { FuelPrices, Attendant, Tank, Pump, OtherProduct, ShiftData } from './types';
import * as dataService from './services/dataService';

type View = 'form' | 'config' | 'dashboard';

const SHIFT_NAMES: ('Shift 1' | 'Shift 2' | 'Shift 3')[] = ['Shift 1', 'Shift 2', 'Shift 3'];

function App() {
  const [view, setView] = useState<View>('form');
  
  // Configuration State
  const [prices, setPrices] = useState<FuelPrices>(dataService.loadPrices());
  const [attendants, setAttendants] = useState<Attendant[]>(dataService.loadAttendants());
  const [tanks, setTanks] = useState<Tank[]>(dataService.loadTanks());
  const [pumps, setPumps] = useState<Pump[]>(dataService.loadPumps());
  const [otherProducts, setOtherProducts] = useState<OtherProduct[]>(dataService.loadOtherProducts());
  
  // All shifts data from storage
  const [allShifts, setAllShifts] = useState<ShiftData[]>(dataService.loadShifts());
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  // Effects to save data on change
  useEffect(() => { dataService.savePrices(prices); }, [prices]);
  useEffect(() => { dataService.saveAttendants(attendants); }, [attendants]);
  useEffect(() => { dataService.saveTanks(tanks); }, [tanks]);
  useEffect(() => { dataService.savePumps(pumps); }, [pumps]);
  useEffect(() => { dataService.saveOtherProducts(otherProducts); }, [otherProducts]);
  useEffect(() => { dataService.saveShifts(allShifts); }, [allShifts]);
  
  const getPreviousDayLastReadings = (date: string): Pump[] => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().split('T')[0];
    
    const lastShiftOfPrevDay = allShifts
      .filter(s => s.date === prevDateStr && s.shift === 'Shift 3' && s.status === 'completed')
      .pop();

    if (lastShiftOfPrevDay) {
        return lastShiftOfPrevDay.pumpReadings.map(r => ({ ...pumps.find(p=>p.id === r.pumpId)!, endIndex: r.endIndex } as any));
    }
    return [];
  };

  // Memoized shifts for the currently selected date
  const shiftsForDay = useMemo(() => {
    let dayShifts = allShifts.filter(s => s.date === currentDate);
    
    // If no shifts for this day, create them
    if (dayShifts.length === 0) {
        const lastReadings = getPreviousDayLastReadings(currentDate);
        
        dayShifts = SHIFT_NAMES.map(shiftName => ({
            id: `${currentDate}-${shiftName}`,
            date: currentDate,
            shift: shiftName,
            attendantId: '',
            pumpReadings: pumps.map(p => ({
                pumpId: p.id,
                startIndex: shiftName === 'Shift 1' 
                    ? (lastReadings.find(lr => lr.id === p.id) as any)?.endIndex || 0 
                    : 0,
                endIndex: 0,
                testVolume: 0,
            })),
            payments: { cash: 0, checks: 0, stateVoucher: 0, tpe: 0, ocard: 0, credit: 0 },
            otherSales: [],
            tankUpdates: [],
            status: 'open',
        }));

        // Use a callback with setAllShifts to avoid race conditions
        setTimeout(() => setAllShifts(prev => [...prev.filter(s => s.date !== currentDate), ...dayShifts]), 0);
    }
    return dayShifts.sort((a,b) => a.shift.localeCompare(b.shift));
  }, [currentDate, allShifts, pumps]);

  const handleDayUpdate = (updatedDayShifts: ShiftData[]) => {
    setAllShifts(prevAllShifts => {
      const otherDaysShifts = prevAllShifts.filter(s => s.date !== currentDate);
      return [...otherDaysShifts, ...updatedDayShifts];
    });
  };

  const handleValidateAndAdvance = (shiftToValidate: ShiftData) => {
    // 1. Mark current shift as completed
    const validatedShift = { ...shiftToValidate, status: 'completed' as const };
    let updatedDayShifts = shiftsForDay.map(s => s.id === validatedShift.id ? validatedShift : s);

    const validatedShiftIndex = SHIFT_NAMES.indexOf(validatedShift.shift);

    // 2. If it's not the last shift, update the next one
    if (validatedShiftIndex < 2) {
        const nextShiftIndex = validatedShiftIndex + 1;
        const nextShift = updatedDayShifts[nextShiftIndex];
        
        const updatedNextShift = {
            ...nextShift,
            pumpReadings: nextShift.pumpReadings.map(reading => {
                const prevReading = validatedShift.pumpReadings.find(pr => pr.pumpId === reading.pumpId);
                return {
                    ...reading,
                    startIndex: prevReading ? prevReading.endIndex : reading.startIndex
                };
            })
        };
        updatedDayShifts[nextShiftIndex] = updatedNextShift;
    } else {
        alert("Journée clôturée !");
    }

    // 3. Save the updated shifts for the day
    handleDayUpdate(updatedDayShifts);
  };
  
  const NavButton: React.FC<{
    targetView: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ targetView, label, icon }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex flex-col items-center justify-center w-full py-2 px-1 text-sm font-medium rounded-lg transition-colors ${
        view === targetView
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion Station Service</h1>
            <div className="w-1/3 grid grid-cols-3 gap-2">
                 <NavButton 
                    targetView="form" 
                    label="Saisie"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M5.828 21h12.344a1 1 0 00.95-1.316l-1.262-3.785a1 1 0 00-.95-.699H7.042a1 1 0 00-.95.699L4.828 19.684A1 1 0 005.828 21zM5 21V10.722a2 2 0 01.447-1.33L8.354 5.5a2 2 0 011.414-.5h4.463a2 2 0 011.414.5l2.907 3.888a2 2 0 01.447 1.33V21" /></svg>}
                />
                 <NavButton 
                    targetView="dashboard" 
                    label="Tableau de Bord"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                />
                <NavButton 
                    targetView="config" 
                    label="Configuration"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {view === 'form' && <DailyView 
            attendants={attendants}
            pumps={pumps}
            tanks={tanks}
            prices={prices}
            otherProducts={otherProducts}
            shiftsForDay={shiftsForDay}
            onDayUpdate={handleDayUpdate}
            onValidateAndAdvance={handleValidateAndAdvance}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
        />}
        {view === 'config' && <Configuration 
            prices={prices} onPricesChange={setPrices}
            attendants={attendants} onAttendantsChange={setAttendants}
            tanks={tanks} onTanksChange={setTanks}
            pumps={pumps} onPumpsChange={setPumps}
            otherProducts={otherProducts} onOtherProductsChange={setOtherProducts}
        />}
        {view === 'dashboard' && <Dashboard shifts={allShifts} pumps={pumps} tanks={tanks} prices={prices} />}
      </main>
    </div>
  );
}

export default App;