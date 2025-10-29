
import React, { useState } from 'react';
import { OtherProduct } from '../../types';

interface OtherProductsConfigProps {
  products: OtherProduct[];
  onProductsChange: React.Dispatch<React.SetStateAction<OtherProduct[]>>;
}

const emptyProduct: Omit<OtherProduct, 'id'> = { name: '', price: 0 };

const OtherProductsConfig: React.FC<OtherProductsConfigProps> = ({ products, onProductsChange }) => {
  const [newProduct, setNewProduct] = useState(emptyProduct);

  const handleAdd = () => {
    if (newProduct.name.trim() && newProduct.price >= 0) {
      onProductsChange(prev => [...prev, { ...newProduct, id: Date.now() }]);
      setNewProduct(emptyProduct);
    }
  };

  const handleUpdate = (id: number, field: keyof OtherProduct, value: string | number) => {
    onProductsChange(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDelete = (id: number) => {
    onProductsChange(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gérer les Autres Produits & Services</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Prix</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="text" value={product.name} onChange={e => handleUpdate(product.id, 'name', e.target.value)} className="w-full p-1 border rounded-md" /></td>
                <td className="px-4 py-3"><input type="number" value={product.price} onChange={e => handleUpdate(product.id, 'price', Number(e.target.value))} className="w-full p-1 border rounded-md text-right" /></td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-4 py-3"><input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Nom du produit/service" className="w-full p-1 border rounded-md" /></td>
              <td className="px-4 py-3"><input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value)})} placeholder="Prix" className="w-full p-1 border rounded-md text-right" /></td>
              <td className="px-4 py-3 text-right"><button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ajouter</button></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OtherProductsConfig;
