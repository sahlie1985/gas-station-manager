import {
  FuelPrices,
  Attendant,
  Tank,
  Pump,
  OtherProduct,
  ShiftData,
} from '../types';
import {
  INITIAL_PRICES,
  INITIAL_ATTENDANTS,
  INITIAL_TANKS,
  INITIAL_PUMPS,
  INITIAL_OTHER_PRODUCTS,
} from '../constants';

const KEYS = {
  PRICES: 'gas_station_prices',
  ATTENDANTS: 'gas_station_attendants',
  TANKS: 'gas_station_tanks',
  PUMPS: 'gas_station_pumps',
  OTHER_PRODUCTS: 'gas_station_other_products',
  SHIFTS: 'gas_station_shifts',
};

function loadData<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
}

// Prices
export const loadPrices = (): FuelPrices => loadData(KEYS.PRICES, INITIAL_PRICES);
export const savePrices = (prices: FuelPrices) => saveData(KEYS.PRICES, prices);

// Attendants
export const loadAttendants = (): Attendant[] => loadData(KEYS.ATTENDANTS, INITIAL_ATTENDANTS);
export const saveAttendants = (attendants: Attendant[]) => saveData(KEYS.ATTENDANTS, attendants);

// Tanks
export const loadTanks = (): Tank[] => loadData(KEYS.TANKS, INITIAL_TANKS);
export const saveTanks = (tanks: Tank[]) => saveData(KEYS.TANKS, tanks);

// Pumps
export const loadPumps = (): Pump[] => loadData(KEYS.PUMPS, INITIAL_PUMPS);
export const savePumps = (pumps: Pump[]) => saveData(KEYS.PUMPS, pumps);

// Other Products
export const loadOtherProducts = (): OtherProduct[] => loadData(KEYS.OTHER_PRODUCTS, INITIAL_OTHER_PRODUCTS);
export const saveOtherProducts = (products: OtherProduct[]) => saveData(KEYS.OTHER_PRODUCTS, products);

// Shifts
export const loadShifts = (): ShiftData[] => loadData(KEYS.SHIFTS, []);
export const saveShifts = (shifts: ShiftData[]) => saveData(KEYS.SHIFTS, shifts);

export const saveShift = (shiftData: ShiftData) => {
    const shifts = loadShifts();
    const existingIndex = shifts.findIndex(s => s.id === shiftData.id);
    if (existingIndex > -1) {
        shifts[existingIndex] = shiftData;
    } else {
        shifts.push(shiftData);
    }
    saveShifts(shifts);
};

// Reset function for development
export const resetAllData = () => {
    Object.values(KEYS).forEach(key => window.localStorage.removeItem(key));
    window.location.reload();
}
