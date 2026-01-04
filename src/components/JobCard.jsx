import clsx from 'clsx';

export const JobCard = ({ job, selected, onSelect }) => {
  const baseClasses = "p-4 border-2 transition-all cursor-pointer";
  const selectedClasses = "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500 ring-offset-2";
  const defaultClasses = "bg-zinc-50 border-zinc-100 hover:border-zinc-300";

  return (
    <div
      className={clsx(baseClasses, selected ? selectedClasses : defaultClasses)}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-black uppercase text-zinc-900">{job.name}</p>
        {job.lang && <span className="text-[8px] bg-zinc-900 text-white px-1.5 py-0.5">{job.lang}</span>}
      </div>
      <div className="flex justify-between items-end">
        <p className="text-lg font-black text-indigo-600">¥{job.reward.toLocaleString()}</p>
        <p className="text-[9px] text-zinc-400 font-bold uppercase">Target_Level: {job.levelReq}</p>
      </div>
    </div>
  );
};