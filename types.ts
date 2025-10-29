export enum FuelType {
  SSP = 'Super Sans Plomb',
  Gasoil = 'Gasoil',
  GPL = 'GPL',
}

export interface FuelPrices {
  [FuelType.SSP]: number;
  [FuelType.Gasoil]: number;
  [FuelType.GPL]: number;
}

export interface Attendant {
  id: number;
  name: string;
}

export interface Tank {
  id: number;
  name: string;
  fuelType: FuelType;
  capacity: number;
  startStock: number; // Stock at the beginning of the day
  purchases: number; // Deliveries during the day
  physicalStock: number; // Stock measured at the end of the day
}

export interface Pump {
  id: number;
  name: string;
  tankId: number; // a pump is linked to a tank
}

export interface PumpReading {
  pumpId: number;
  startIndex: number;
  endIndex: number;
  testVolume: number;
}

export interface Payment {
  cash: number;
  checks: number;
  stateVoucher: number;
  tpe: number;
  ocard: number;
  credit: number;
}

export interface OtherProduct {
  id: number;
  name:string;
  price: number;
}

export interface OtherProductSale {
  productId: number;
  quantity: number;
  price: number; // price at time of sale
}

export interface ShiftData {
  id: string; // e.g., '2023-10-27-Shift 1'
  date: string; // 'YYYY-MM-DD'
  shift: 'Shift 1' | 'Shift 2' | 'Shift 3';
  attendantId: number | '';
  pumpReadings: PumpReading[];
  payments: Payment;
  otherSales: OtherProductSale[];
  tankUpdates: { tankId: number, physicalStock: number, purchases: number }[];
  status: 'open' | 'completed';
}

export interface DailySummaryData {
  date: string;
  totalFuelSales: { [key in FuelType]?: { volume: number; revenue: number } };
  totalOtherSalesRevenue: number;
  totalRevenue: number;
  payments: Payment;
  totalPayments: number;
  shortageOrOverage: number;
  tankSummaries: TankSummary[];
}

export interface TankSummary {
    id: number;
    name: string;
    fuelType: FuelType;
    startStock: number;
    purchases: number;
    totalIn: number;
    sales: number;
    theoreticalStock: number;
    physicalStock: number;
    difference: number;
}