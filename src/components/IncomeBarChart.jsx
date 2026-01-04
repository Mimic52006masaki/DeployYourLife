import { useEffect, useState } from 'react';

export const IncomeBarChart = ({ income, expenses }) => {
  const [incomeWidth, setIncomeWidth] = useState(0);
  const [expensesWidth, setExpensesWidth] = useState(0);

  useEffect(() => {
    // アニメーションで棒を伸ばす
    setTimeout(() => setIncomeWidth((income / (income + expenses)) * 100), 300);
    setTimeout(() => setExpensesWidth((expenses / (income + expenses)) * 100), 600);
  }, [income, expenses]);

  const maxValue = Math.max(income, expenses);

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
          <span className="text-emerald-600 font-black text-sm w-20 text-right">¥{income.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-zinc-100 h-6 border border-zinc-200 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-1000 ease-out delay-300"
              style={{ width: `${expensesWidth}%` }}
            />
          </div>
          <span className="text-red-500 font-black text-sm w-20 text-right">¥{expenses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};