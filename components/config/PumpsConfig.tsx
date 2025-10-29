
import React, { useState } from 'react';
import { Pump, Tank } from '../../types';

interface PumpsConfigProps {
  pumps: Pump[];
  onPumpsChange: React.Dispatch<React.SetStateAction<Pump[]>>;
  tanks: Tank[];
}

const emptyPump: Omit<Pump, 'id'> = { name: '', tankId: 0 };

const PumpsConfig: React.FC<PumpsConfigProps> = ({ pumps, onPumpsChange, tanks }) => {
  const [newPump, setNewPump] = useState({ ...emptyPump, tankId: tanks[0]?.id || 0 });

  const handleAdd = () => {
    if (newPump.name.trim() && newPump.tankId) {
      onPumpsChange(prev => [...prev, { ...newPump, id: Date.now() }]);
      setNewPump({ ...emptyPump, tankId: tanks[0]?.id || 0 });
    }
  };

  const handleUpdate = (id: number, field: keyof Pump, value: string | number) => {
    onPumpsChange(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleDelete = (id: number) => {
    onPumpsChange(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gérer les Pistolets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom du Pistolet</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Lié à la Cuve</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pumps.map(pump => (
              <tr key={pump.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="text" value={pump.name} onChange={e => handleUpdate(pump.id, 'name', e.target.value)} className="w-full p-1 border rounded-md" /></td>
                <td className="px-4 py-3">
                  <select value={pump.tankId} onChange={e => handleUpdate(pump.id, 'tankId', Number(e.target.value))} className="w-full p-1 border rounded-md">
                    {tanks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.fuelType})</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(pump.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-4 py-3"><input type="text" value={newPump.name} onChange={e => setNewPump({ ...newPump, name: e.target.value })} placeholder="Nom du pistolet" className="w-full p-1 border rounded-md" /></td>
              <td className="px-4 py-3">
                <select value={newPump.tankId} onChange={e => setNewPump({ ...newPump, tankId: Number(e.target.value) })} className="w-full p-1 border rounded-md">
                   {tanks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.fuelType})</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-right"><button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ajouter</button></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PumpsConfig;
