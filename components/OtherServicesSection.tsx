
import React from 'react';
import { OtherProduct, OtherProductSale } from '../types';

interface OtherServicesSectionProps {
  products: OtherProduct[];
  sales: OtherProductSale[];
  onSalesChange: (updatedSales: OtherProductSale[]) => void;
}

const OtherServicesSection: React.FC<OtherServicesSectionProps> = ({ products, sales, onSalesChange }) => {
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingSale = sales.find(s => s.productId === productId);
    let newSales: OtherProductSale[];

    if (quantity > 0) {
        if (existingSale) {
            newSales = sales.map(s => s.productId === productId ? { ...s, quantity } : s);
        } else {
            newSales = [...sales, { productId, quantity, price: product.price }];
        }
    } else {
        newSales = sales.filter(s => s.productId !== productId);
    }
    onSalesChange(newSales);
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">Autres Ventes & Services</h3>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {products.map(product => {
            const sale = sales.find(s => s.productId === product.id);
            return (
                 <div key={product.id} className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700 w-2/3">{product.name} (@ {product.price.toFixed(3)})</span>
                    <input 
                        type="number"
                        value={sale?.quantity || ''}
                        onChange={(e) => handleQuantityChange(product.id, Number(e.target.value) || 0)}
                        className="w-1/3 p-2 border border-gray-300 rounded-md text-right focus:ring-blue-500 focus:border-blue-500"
                        onFocus={e => e.target.select()}
                        placeholder="Qté"
                    />
                </div>
            );
        })}
      </div>
       <div className="border-t-2 pt-4">
          <div className="flex justify-between items-center font-bold text-md">
              <span className="text-gray-800">Total Autres Ventes</span>
              <span className="text-green-700">{totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</span>
          </div>
      </div>
    </div>
  );
};

export default OtherServicesSection;
