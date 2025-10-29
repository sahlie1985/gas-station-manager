import {
  ShiftData,
  Pump,
  Tank,
  FuelPrices,
  FuelType,
  DailySummaryData,
  Payment,
  TankSummary,
} from '../types';

export function generateDailySummary(
  date: string,
  allShifts: ShiftData[],
  pumps: Pump[],
  tanks: Tank[],
  prices: FuelPrices
): DailySummaryData | null {
  const shiftsForDay = allShifts.filter(s => s.date === date);
  if (shiftsForDay.length === 0) {
    return null;
  }

  const summary: DailySummaryData = {
    date,
    totalFuelSales: {},
    totalOtherSalesRevenue: 0,
    totalRevenue: 0,
    payments: { cash: 0, checks: 0, stateVoucher: 0, tpe: 0, ocard: 0, credit: 0 },
    totalPayments: 0,
    shortageOrOverage: 0,
    tankSummaries: [],
  };

  // Initialize fuel sales to ensure all fuel types are present
  for (const fuelType of Object.values(FuelType)) {
      summary.totalFuelSales[fuelType] = { volume: 0, revenue: 0 };
  }

  // Aggregate sales and payments from all shifts of the day
  for (const shift of shiftsForDay) {
    // Other sales
    summary.totalOtherSalesRevenue += shift.otherSales.reduce((sum, sale) => sum + sale.quantity * sale.price, 0);

    // Payments
    for (const key in shift.payments) {
      summary.payments[key as keyof Payment] += shift.payments[key as keyof Payment];
    }

    // Fuel sales
    for (const reading of shift.pumpReadings) {
      const sale = reading.endIndex - reading.startIndex - reading.testVolume;
      if (sale > 0) {
        const pump = pumps.find(p => p.id === reading.pumpId);
        if (pump) {
          const tank = tanks.find(t => t.id === pump.tankId);
          if (tank) {
            const fuelType = tank.fuelType;
            if (!summary.totalFuelSales[fuelType]) {
              summary.totalFuelSales[fuelType] = { volume: 0, revenue: 0 };
            }
            summary.totalFuelSales[fuelType]!.volume += sale;
            summary.totalFuelSales[fuelType]!.revenue += sale * prices[fuelType];
          }
        }
      }
    }
  }

  // Calculate totals
  const totalFuelRevenue = Object.values(summary.totalFuelSales).reduce((sum, ft) => sum + ft!.revenue, 0);
  summary.totalRevenue = totalFuelRevenue + summary.totalOtherSalesRevenue;
  summary.totalPayments = Object.values(summary.payments).reduce((sum, val) => sum + val, 0);
  summary.shortageOrOverage = summary.totalPayments - summary.totalRevenue;
  
  // Tank summaries are complex. This is a simplified version.
  // A real system would need opening stock for the day, and closing stock.
  // We'll use the initial tank data as a base, which is not perfect.
  summary.tankSummaries = tanks.map(tank => {
      const sales = summary.totalFuelSales[tank.fuelType]?.volume || 0;
      
      // Note: This logic for stocks needs improvement. 
      // It should get startStock from previous day's physicalStock.
      // For now, it's a simplification.
      const startStock = tank.startStock; 
      const purchases = tank.purchases;
      const totalIn = startStock + purchases;
      const theoreticalStock = totalIn - sales;
      const physicalStock = tank.physicalStock; // Assuming this is end-of-day stock
      const difference = physicalStock - theoreticalStock;

      return {
          id: tank.id,
          name: tank.name,
          fuelType: tank.fuelType,
          startStock,
          purchases,
          totalIn,
          sales,
          theoreticalStock,
          physicalStock,
          difference,
      };
  });


  return summary;
}
