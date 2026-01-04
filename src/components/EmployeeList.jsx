import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import EmployeeCard from './EmployeeCard';
import ActionButton from './ActionButton';

const EmployeeList = () => {
  const { gameState, hireEmployee } = useGameState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Developer');

  const handleHire = () => {
    if (name.trim()) {
      hireEmployee(name.trim(), role);
      setName('');
      setIsModalOpen(false);
    }
  };

  const roles = ['Developer', 'Designer', 'Marketer'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">社員リスト</h2>
        <ActionButton onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          社員雇用
        </ActionButton>
      </div>

      {gameState.game.employees.length === 0 ? (
        <p className="text-gray-500">雇用中の社員がいません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameState.game.employees.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}

      {/* Hire Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">社員雇用</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="社員名を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">職種</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <ActionButton onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">
                キャンセル
              </ActionButton>
              <ActionButton onClick={handleHire} className="bg-green-500 hover:bg-green-600">
                雇用
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;