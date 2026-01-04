import React, { useState, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ActionButton } from './ActionButton';

const TeamAssignmentModal = ({ job, onAssign, onClose }) => {
  const { gameState } = useGameState();
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [bonuses, setBonuses] = useState({ skillBonus: 0, coopBonus: 0, specialtyBonus: 0, totalBonus: 0 });
  const [barWidths, setBarWidths] = useState({ skill: 0, coop: 0, specialty: 0 });
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const [sortByScore, setSortByScore] = useState(false);

  const calculateCompatibilityScore = (employee, job) => {
    let score = 0;
    if (employee.specialty === job.lang) score += 20;
    score += employee.level * 2;
    if (employee.role === (job.lang === 'design' ? 'Designer' : 'Developer')) score += 10;
    score = Math.min(100, score);
    return score;
  };

  const calculateBonuses = (team, job) => {
    const teamEmployees = gameState.game.employees.filter(emp => team.includes(emp.id));
    let skillBonus = 0;
    let coopBonus = 0;
    let specialtyBonus = 0;

    // Skill bonus
    if (job.lang === 'javascript' && teamEmployees.some(emp => emp.role === 'Developer')) {
      skillBonus = 0.2;
    } else if (job.lang === 'python' && teamEmployees.some(emp => emp.role === 'Developer')) {
      skillBonus = 0.15;
    } else if (job.lang === 'design' && teamEmployees.some(emp => emp.role === 'Designer')) {
      skillBonus = 0.25;
    }

    // Coop bonus
    const devCount = teamEmployees.filter(emp => emp.role === 'Developer').length;
    const desCount = teamEmployees.filter(emp => emp.role === 'Designer').length;
    if (devCount >= 2 && (job.lang === 'javascript' || job.lang === 'python')) {
      coopBonus = 0.1;
    } else if (desCount >= 2 && job.lang === 'design') {
      coopBonus = 0.15;
    }

    // Specialty bonus
    if (teamEmployees.some(emp => emp.specialty === job.lang)) {
      specialtyBonus = 0.05;
    }

    const totalBonus = skillBonus + coopBonus + specialtyBonus;
    return { skillBonus, coopBonus, specialtyBonus, totalBonus };
  };

  useEffect(() => {
    const newBonuses = calculateBonuses(selectedTeam, job);
    setBonuses(newBonuses);
    // Animate bars
    setTimeout(() => setBarWidths({
      skill: (newBonuses.skillBonus / 0.5) * 100,
      coop: (newBonuses.coopBonus / 0.3) * 100,
      specialty: (newBonuses.specialtyBonus / 0.1) * 100,
    }), 100);
  }, [selectedTeam, job]);

  const suggestOptimalTeam = (job, employees) => {
    const relevantRole = job.lang === 'design' ? 'Designer' : 'Developer';
    const relevantEmployees = employees.filter(emp => emp.role === relevantRole);
    const specialtyMatch = relevantEmployees.filter(emp => emp.specialty === job.lang).sort((a, b) => b.level - a.level);
    const others = relevantEmployees.filter(emp => emp.specialty !== job.lang).sort((a, b) => b.level - a.level);
    const selected = [...specialtyMatch.slice(0, 2), ...others.slice(0, 1)].map(emp => emp.id);
    return selected.slice(0, 3);
  };

  const handleSuggest = () => {
    const optimal = suggestOptimalTeam(job, gameState.game.employees);
    setSelectedTeam(optimal);
  };

  const handleToggleEmployee = (empId) => {
    setSelectedTeam(prev => {
      if (prev.includes(empId)) {
        return prev.filter(id => id !== empId);
      } else if (prev.length < job.maxTeam) {
        return [...prev, empId];
      }
      return prev;
    });
  };

  const handleAssign = () => {
    if (selectedTeam.length > 0) {
      onAssign(selectedTeam);
      onClose();
    }
  };

  const selectedEmployees = gameState.game.employees.filter(emp => selectedTeam.includes(emp.id));

  const sortedEmployees = sortByScore
    ? [...gameState.game.employees].sort((a, b) => {
        const scoreA = calculateCompatibilityScore(a, job) - Math.max(0, (gameState.game.month - a.lastAssignedMonth) - 1) * 10;
        const scoreB = calculateCompatibilityScore(b, job) - Math.max(0, (gameState.game.month - b.lastAssignedMonth) - 1) * 10;
        return scoreB - scoreA;
      })
    : gameState.game.employees;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">チーム編成: {job.name}</h3>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {sortedEmployees.map(employee => (
            <label key={employee.id} className={`flex items-center space-x-2 p-2 border rounded cursor-pointer ${employee.specialty === job.lang ? 'border-orange-400 bg-orange-50' : 'border-gray-300'} ${selectedTeam.includes(employee.id) ? 'bg-blue-50' : ''}`} onMouseEnter={() => setHoveredEmployee(employee)} onMouseLeave={() => setHoveredEmployee(null)} onClick={() => handleToggleEmployee(employee.id)}>
              <input
                type="checkbox"
                checked={selectedTeam.includes(employee.id)}
                readOnly
              />
              <div className="flex-1">
                <div className="font-bold">{employee.name}</div>
                <div className="text-sm text-gray-600">{employee.role} Lv.{employee.level} 得意:{employee.specialty}</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <span>相性:</span>
                    <div className="flex-1 bg-gray-100 h-2">
                      <div className={`h-full transition-all duration-300 ${calculateCompatibilityScore(employee, job) >= 80 ? 'bg-green-500' : calculateCompatibilityScore(employee, job) >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${calculateCompatibilityScore(employee, job)}%` }}></div>
                    </div>
                    <span>{calculateCompatibilityScore(employee, job)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <span>疲労:</span>
                    <div className="flex-1 bg-gray-100 h-2">
                      <div className={`h-full transition-all duration-300 ${Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1) <= 1 ? 'bg-green-500' : Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1) <= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1) * 20)}%` }}></div>
                    </div>
                    <span className={Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1) <= 1 ? 'text-green-600' : Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1) <= 3 ? 'text-yellow-600' : 'text-red-600'}>{Math.max(0, (gameState.game.month - employee.lastAssignedMonth) - 1)}</span>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredEmployee && (
          <div className="absolute bg-black text-white text-xs p-2 rounded shadow-lg z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div>スキル: {hoveredEmployee.skill}</div>
            <div>モラル: {hoveredEmployee.morale}</div>
            <div>EXP: {hoveredEmployee.exp}/{hoveredEmployee.level * 1000}</div>
            <div>総合スコア: {calculateCompatibilityScore(hoveredEmployee, job) - Math.max(0, (gameState.game.month - hoveredEmployee.lastAssignedMonth) - 1) * 10}</div>
          </div>
        )}

        {/* Team Selection */}
        <div className="mb-4">
          <h4 className="text-sm font-bold mb-2">選択チーム ({selectedEmployees.length}/{job.maxTeam})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedEmployees.map(emp => (
              <div key={emp.id} className="bg-blue-100 p-2 rounded border cursor-pointer hover:bg-blue-200" onClick={() => handleToggleEmployee(emp.id)}>
                {emp.name}
              </div>
            ))}
            {Array.from({ length: Math.max(0, job.maxTeam - selectedEmployees.length) }, (_, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded border border-dashed text-gray-400">空き</div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <div>予想ボーナス: +{(bonuses.totalBonus * 100).toFixed(0)}%</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2" title="スキルボーナス: 該当roleの社員がチームにいる場合適用">
              <span className="text-xs w-16">スキル:</span>
              <div className="flex-1 bg-gray-100 h-3">
                <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${barWidths.skill}%` }}></div>
              </div>
              <span className="text-xs w-8">{(bonuses.skillBonus * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-2" title="協力ボーナス: 該当roleの社員が2人以上いる場合適用">
              <span className="text-xs w-16">協力:</span>
              <div className="flex-1 bg-gray-100 h-3">
                <div className="h-full bg-blue-500 transition-all duration-500 ease-out delay-100" style={{ width: `${barWidths.coop}%` }}></div>
              </div>
              <span className="text-xs w-8">{(bonuses.coopBonus * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-2" title="得意ボーナス: 得意スキルの社員がチームにいる場合適用">
              <span className="text-xs w-16">得意:</span>
              <div className="flex-1 bg-gray-100 h-3">
                <div className="h-full bg-purple-500 transition-all duration-500 ease-out delay-200" style={{ width: `${barWidths.specialty}%` }}></div>
              </div>
              <span className="text-xs w-8">{(bonuses.specialtyBonus * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <ActionButton onClick={handleSuggest} className="bg-green-500 hover:bg-green-600 text-sm">
            最適チーム提案
          </ActionButton>
          <ActionButton onClick={() => setSortByScore(!sortByScore)} className="bg-blue-500 hover:bg-blue-600 text-sm">
            {sortByScore ? '通常順' : 'スコア順'}
          </ActionButton>
        </div>
        <div className="flex justify-end space-x-2">
          <ActionButton onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            キャンセル
          </ActionButton>
          <ActionButton onClick={handleAssign} disabled={selectedTeam.length === 0} className="bg-blue-500 hover:bg-blue-600">
            実行
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default TeamAssignmentModal;