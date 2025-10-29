
import React from 'react';
import { FuelPrices, FuelType } from '../../types';

interface PricesConfigProps {
    prices: FuelPrices;
    onPricesChange: (prices: FuelPrices) => void;
}

const PricesConfig: React.FC<PricesConfigProps> = ({ prices, onPricesChange }) => {

    const handlePriceChange = (fuelType: FuelType, value: number) => {
        onPricesChange({ ...prices, [fuelType]: value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Prix des Carburants (par Litre)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.values(FuelType).map(fuelType => (
                    <div key={fuelType}>
                        <label className="block text-sm font-medium text-gray-700">{fuelType}</label>
                        <input
                            type="number"
                            step="0.001"
                            value={prices[fuelType as FuelType]}
                            onChange={e => handlePriceChange(fuelType as FuelType, Number(e.target.value))}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onFocus={e => e.target.select()}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricesConfig;
