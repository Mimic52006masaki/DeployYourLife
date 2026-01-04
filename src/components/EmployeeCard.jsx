import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ActionButton } from './ActionButton';

const EmployeeCard = ({ employee }) => {
  const { fireEmployee } = useGameState();

  const handleFire = () => {
    if (window.confirm(`${employee.name} を解雇しますか？`)) {
      fireEmployee(employee.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{employee.name}</h3>
        <span className="text-sm text-gray-500">{employee.role}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>レベル:</span>
          <span>Lv.{employee.level}</span>
        </div>
        <div className="flex justify-between">
          <span>スキル:</span>
          <span>{employee.skill}</span>
        </div>
        <div className="flex justify-between">
          <span>給与:</span>
          <span>¥{employee.salary.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>モラル:</span>
          <span>{employee.morale}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>EXP:</span>
          <span>{employee.exp}/{employee.level * 1000}</span>
        </div>
        <div className="flex justify-between text-xs text-orange-600">
          <span>得意:</span>
          <span>{employee.specialty}</span>
        </div>
        <div className="flex justify-between text-xs text-purple-600">
          <span>月次ボーナス:</span>
          <span>¥{(employee.level * 5000).toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4">
        <ActionButton onClick={handleFire} colorClasses="w-full bg-red-500 hover:bg-red-600 text-white">
          解雇
        </ActionButton>
      </div>
    </div>
  );
};

export default EmployeeCard;