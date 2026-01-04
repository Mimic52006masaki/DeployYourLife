import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ActionButton } from './ActionButton';

const EmployeeCard = ({ employee }) => {
  const { fireEmployee, gameState, doAction } = useGameState();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleFire = () => {
    if (window.confirm(`${employee.name} を解雇しますか？`)) {
      fireEmployee(employee.id);
    }
  };

  const handleAssign = () => {
    setIsAssignModalOpen(true);
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
          <span>アサイン:</span>
          <span>{employee.assignedProductId ? gameState.game.products.find(p => p.id === employee.assignedProductId)?.name : 'なし'}</span>
        </div>
        <div className="flex justify-between text-xs text-green-600">
          <span>月次ボーナス:</span>
          <span>¥{(employee.level * 5000).toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <ActionButton onClick={handleFire} colorClasses="flex-1 bg-red-500 hover:bg-red-600 text-white">
          解雇
        </ActionButton>
        <ActionButton onClick={handleAssign} colorClasses="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
          アサイン
        </ActionButton>
      </div>

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{employee.name} のアサイン</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">アサインするプロダクトを選択してください。</p>
              {gameState.game.products.length === 0 ? (
                <p className="text-gray-500">プロダクトがありません</p>
              ) : (
                gameState.game.products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      doAction('assign_employee', { employeeId: employee.id, productId: product.id });
                      setIsAssignModalOpen(false);
                    }}
                    className="w-full text-left p-2 border rounded hover:bg-gray-100"
                  >
                    {product.name} ({product.stage})
                  </button>
                ))
              )}
              {employee.assignedProductId && (
                <button
                  onClick={() => {
                    doAction('assign_employee', { employeeId: employee.id, productId: employee.assignedProductId });
                    setIsAssignModalOpen(false);
                  }}
                  className="w-full text-left p-2 border rounded bg-red-50 hover:bg-red-100 text-red-600"
                >
                  アサイン解除
                </button>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <ActionButton onClick={() => setIsAssignModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">
                キャンセル
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;