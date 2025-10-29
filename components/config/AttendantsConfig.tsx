
import React, { useState } from 'react';
import { Attendant } from '../../types';

interface AttendantsConfigProps {
  attendants: Attendant[];
  onAttendantsChange: React.Dispatch<React.SetStateAction<Attendant[]>>;
}

const AttendantsConfig: React.FC<AttendantsConfigProps> = ({ attendants, onAttendantsChange }) => {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      const newAttendant: Attendant = {
        id: Date.now(),
        name: newName.trim(),
      };
      onAttendantsChange(prev => [...prev, newAttendant]);
      setNewName('');
    }
  };

  const handleUpdate = (id: number, name: string) => {
    onAttendantsChange(prev => prev.map(a => (a.id === id ? { ...a, name } : a)));
  };

  const handleDelete = (id: number) => {
    onAttendantsChange(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gérer les Pompistes</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nom du nouveau pompiste"
          className="flex-grow p-2 border rounded-md"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Ajouter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendants.map(attendant => (
              <tr key={attendant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={attendant.name}
                    onChange={e => handleUpdate(attendant.id, e.target.value)}
                    className="w-full p-1 border rounded-md"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(attendant.id)} className="text-red-600 hover:text-red-800">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendantsConfig;
