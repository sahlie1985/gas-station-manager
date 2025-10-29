
import React, { useState } from 'react';
import { Tank, FuelType } from '../../types';

interface TanksConfigProps {
  tanks: Tank[];
  onTanksChange: React.Dispatch<React.SetStateAction<Tank[]>>;
}

const emptyTank: Omit<Tank, 'id'> = { name: '', fuelType: FuelType.SSP, capacity: 0, startStock: 0, purchases: 0, physicalStock: 0 };

const TanksConfig: React.FC<TanksConfigProps> = ({ tanks, onTanksChange }) => {
  const [newTank, setNewTank] = useState(emptyTank);

  const handleAdd = () => {
    if (newTank.name.trim() && newTank.capacity > 0) {
      onTanksChange(prev => [...prev, { ...newTank, id: Date.now() }]);
      setNewTank(emptyTank);
    }
  };

  const handleUpdate = (id: number, field: keyof Tank, value: string | number) => {
    onTanksChange(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleDelete = (id: number) => {
    onTanksChange(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gérer les Cuves</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type Carburant</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Capacité (L)</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tanks.map(tank => (
              <tr key={tank.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="text" value={tank.name} onChange={e => handleUpdate(tank.id, 'name', e.target.value)} className="w-full p-1 border rounded-md" /></td>
                <td className="px-4 py-3">
                    <select value={tank.fuelType} onChange={e => handleUpdate(tank.id, 'fuelType', e.target.value)} className="w-full p-1 border rounded-md">
                        {Object.values(FuelType).map(ft => <option key={ft} value={ft}>{ft}</option>)}
                    </select>
                </td>
                <td className="px-4 py-3"><input type="number" value={tank.capacity} onChange={e => handleUpdate(tank.id, 'capacity', Number(e.target.value))} className="w-full p-1 border rounded-md text-right" /></td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(tank.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
           <tfoot>
                <tr>
                    <td className="px-4 py-3"><input type="text" value={newTank.name} onChange={e => setNewTank({...newTank, name: e.target.value})} placeholder="Nom de la cuve" className="w-full p-1 border rounded-md" /></td>
                    <td className="px-4 py-3">
                        <select value={newTank.fuelType} onChange={e => setNewTank({...newTank, fuelType: e.target.value as FuelType})} className="w-full p-1 border rounded-md">
                            {Object.values(FuelType).map(ft => <option key={ft} value={ft}>{ft}</option>)}
                        </select>
                    </td>
                    <td className="px-4 py-3"><input type="number" value={newTank.capacity || ''} onChange={e => setNewTank({...newTank, capacity: Number(e.target.value)})} placeholder="Capacité" className="w-full p-1 border rounded-md text-right" /></td>
                    <td className="px-4 py-3 text-right"><button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ajouter</button></td>
                </tr>
           </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TanksConfig;
