import clsx from 'clsx';

export const ActionButton = ({
  onClick,
  disabled,
  children,
  colorClasses = "bg-zinc-50 hover:bg-white border-2 border-zinc-100 hover:border-indigo-500",
  fullWidth = true,
  sizeClasses = "py-3 px-4 text-sm",
  lockReason = null,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled && lockReason ? lockReason : undefined}
      className={clsx(
        fullWidth && "w-full",
        "flex justify-between items-center transition-all group font-black uppercase tracking-widest rounded",
        sizeClasses,
        colorClasses,
        "disabled:opacity-30 disabled:cursor-not-allowed",
        "active:translate-y-0.5 active:shadow-none shadow-md"
      )}
    >
      {children}
    </button>
  );
};