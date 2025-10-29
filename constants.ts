import { FuelType, Attendant, Tank, Pump, OtherProduct, FuelPrices } from './types';

export const INITIAL_PRICES: FuelPrices = {
  [FuelType.SSP]: 1.500,
  [FuelType.Gasoil]: 1.350,
  [FuelType.GPL]: 0.800,
};

export const INITIAL_ATTENDANTS: Attendant[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

export const INITIAL_TANKS: Tank[] = [
  { id: 101, name: 'Cuve SSP 1', fuelType: FuelType.SSP, capacity: 20000, startStock: 15000, purchases: 0, physicalStock: 0 },
  { id: 102, name: 'Cuve Gasoil 1', fuelType: FuelType.Gasoil, capacity: 30000, startStock: 25000, purchases: 0, physicalStock: 0 },
  { id: 103, name: 'Cuve GPL 1', fuelType: FuelType.GPL, capacity: 10000, startStock: 8000, purchases: 0, physicalStock: 0 },
];

export const INITIAL_PUMPS: Pump[] = [
  { id: 1, name: 'Pistolet 1 (SSP)', tankId: 101 },
  { id: 2, name: 'Pistolet 2 (SSP)', tankId: 101 },
  { id: 3, name: 'Pistolet 3 (Gasoil)', tankId: 102 },
  { id: 4, name: 'Pistolet 4 (Gasoil)', tankId: 102 },
  { id: 5, name: 'Pistolet 5 (GPL)', tankId: 103 },
];

export const INITIAL_OTHER_PRODUCTS: OtherProduct[] = [
    { id: 1, name: 'Lavage Auto', price: 10.000 },
    { id: 2, name: 'Huile Moteur (1L)', price: 15.500 },
    { id: 3, name: 'Lave-glace (5L)', price: 5.250 },
    { id: 4, name: 'Café', price: 1.200 },
];
