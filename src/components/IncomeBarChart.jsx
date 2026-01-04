import { useEffect, useState } from 'react';

export const IncomeBarChart = ({ income, expenses }) => {
  const safeIncome = income ?? 0;
  const safeExpenses = expenses ?? 0;

  const [incomeWidth, setIncomeWidth] = useState(0);
  const [expensesWidth, setExpensesWidth] = useState(0);

  useEffect(() => {
    // アニメーションで棒を伸ばす
    const total = safeIncome + safeExpenses || 1;
    setTimeout(() => setIncomeWidth((safeIncome / total) * 100), 300);
    setTimeout(() => setExpensesWidth((safeExpenses / total) * 100), 600);
  }, [safeIncome, safeExpenses]);

  const maxValue = Math.max(safeIncome, safeExpenses);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-zinc-400 uppercase font-bold tracking-widest">
        <span>Income</span>
        <span>Expenses</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-zinc-100 h-6 border border-zinc-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${incomeWidth}%` }}
            />
          </div>
          <span className="text-emerald-600 font-black text-sm w-20 text-right">¥{safeIncome.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-zinc-100 h-6 border border-zinc-200 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-1000 ease-out delay-300"
              style={{ width: `${expensesWidth}%` }}
            />
          </div>
          <span className="text-red-500 font-black text-sm w-20 text-right">¥{safeExpenses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};