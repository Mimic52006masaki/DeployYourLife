import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const getGradient = (percent, isPositive) => {
  const intensity = Math.min(Math.abs(percent), 100); // 最大100%
  const alpha = 0.1 + (intensity / 100) * 0.6; // 0.1〜0.7の透明度
  const color = isPositive ? `rgba(34,197,94,${alpha})` : `rgba(239,68,68,${alpha})`; // 緑/赤
  return color;
};

const CustomTooltip = ({ active, payload, label, history }) => {
  if (!(active && payload && payload.length)) return null;

  const data = payload[0].payload;
  const index = history.findIndex(r => `月${r.month}` === label);

  const calcPercent = (current, previous) => {
    if (previous === null || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getGradient = (percent, isPositive) => {
    const intensity = Math.min(Math.abs(percent), 100);
    const alpha = 0.1 + (intensity / 100) * 0.6;
    return isPositive ? `rgba(34,197,94,${alpha})` : `rgba(239,68,68,${alpha})`;
  };

  const renderMiniHeat = (itemKey, isMoney = true) => {
    return (
      <div className="flex items-center space-x-2">
        <strong className="w-24">{itemKey}:</strong>
        <div className="flex-1 flex space-x-0.5">
          {history.map((h, idx) => {
            const prev = idx > 0 ? h[itemKey] : 0;
            const curr = h[itemKey];
            const percent = idx === 0 ? 0 : calcPercent(curr, prev);
            const color = getGradient(percent, percent >= 0);

            // 最新月バーかどうか
            const isLatest = idx === index;
            return (
              <div
                key={idx}
                title={`月${h.month}: ${curr}${isMoney ? '¥' : ''} (${percent.toFixed(1)}%)`}
                className={`h-4 flex-1 rounded-sm transform transition-all duration-700 ${
                  isLatest ? 'scale-y-125 opacity-100 translate-y-0' : 'opacity-80'
                }`}
                style={{
                  backgroundColor: color,
                  transformOrigin: 'bottom', // 下から伸びる
                }}
              />
            );
          })}
        </div>
        {/* 最新月の数値と矢印 */}
        {index >= 0 && (
          <span className="ml-2 font-bold">
            {(() => {
              const prev = index > 0 ? history[index - 1][itemKey] : null;
              const curr = history[index][itemKey];
              if (prev === null) return curr;
              const diff = curr - prev;
              const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
              const percent = prev !== 0 ? ((diff / prev) * 100).toFixed(1) : 'N/A';
              return `${arrow} ${isMoney ? '¥' : ''}${Math.abs(diff).toLocaleString()} (${percent !== 'N/A' ? percent + '%' : 'N/A'})`;
            })()}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-300 p-3 rounded shadow-lg max-w-md text-sm space-y-2">
      <p className="font-bold text-gray-800">{label}</p>
      <div className="space-y-1">
        {renderMiniHeat('jobIncome')}
        {renderMiniHeat('freelanceIncome')}
        {renderMiniHeat('corporationIncome')}
        {renderMiniHeat('livingExpenses')}
        {renderMiniHeat('proExpenses')}
        {renderMiniHeat('corpExpenses')}
        {renderMiniHeat('netIncome')}
        {renderMiniHeat('cumulativeNetIncome')}
        {renderMiniHeat('mental', false)}
        {renderMiniHeat('followers', false)}
      </div>
    </div>
  );
};

const TrendChart = ({ history }) => {
  // 過去6ヶ月のデータを準備
  const data = history.map((report, index) => ({
    month: `月${report.month}`,
    jobIncome: report.jobIncome,
    freelanceIncome: report.freelanceIncome,
    corporationIncome: report.corporationIncome,
    livingExpenses: report.expensesBreakdown?.living || 0,
    proExpenses: report.expensesBreakdown?.pro || 0,
    corpExpenses: report.expensesBreakdown?.corp || 0,
    netIncome: report.income - report.expenses,
    cumulativeNetIncome: history.slice(0, index + 1).reduce((acc, r) => acc + (r.income - r.expenses), 0),
    mental: index === 0 ? 30 + report.mentalChange : history.slice(0, index + 1).reduce((acc, r) => acc + r.mentalChange, 30),
    followers: index === 0 ? report.followerChange : history.slice(0, index + 1).reduce((acc, r) => acc + r.followerChange, 0),
  }));

  return (
    <div className="w-full h-80 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">過去6ヶ月のトレンド</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" domain={['dataMin - 100000', 'dataMax + 100000']} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax']} />
          <Tooltip content={<CustomTooltip history={history} />} />
          <Legend />
          <Bar yAxisId="left" dataKey="jobIncome" stackId="income" fill="#4ade80" name="仕事収入 (¥)" animationDuration={800} />
          <Bar yAxisId="left" dataKey="freelanceIncome" stackId="income" fill="#22c55e" name="フリーランス (¥)" animationDuration={800} />
          <Bar yAxisId="left" dataKey="corporationIncome" stackId="income" fill="#16a34a" name="法人収入 (¥)" animationDuration={800} />
          <Bar yAxisId="left" dataKey="livingExpenses" stackId="expenses" fill="#f87171" name="生活費 (¥)" animationDuration={800} />
          <Bar yAxisId="left" dataKey="proExpenses" stackId="expenses" fill="#ef4444" name="プロプラン (¥)" animationDuration={800} />
          <Bar yAxisId="left" dataKey="corpExpenses" stackId="expenses" fill="#dc2626" name="法人費 (¥)" animationDuration={800} />
          <Line yAxisId="left" type="monotone" dataKey="netIncome" stroke="#000000" name="正味収支 (¥)" strokeWidth={3} animationDuration={1000} />
          <Line yAxisId="left" type="monotone" dataKey="cumulativeNetIncome" stroke="#ff0000" strokeDasharray="5 5" name="累積正味収支 (¥)" strokeWidth={2} animationDuration={1200} />
          <Line yAxisId="right" type="monotone" dataKey="mental" stroke="#ff7300" name="メンタル" strokeWidth={2} animationDuration={1000} />
          <Line yAxisId="right" type="monotone" dataKey="followers" stroke="#413ea0" name="フォロワー" strokeWidth={2} animationDuration={1200} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;