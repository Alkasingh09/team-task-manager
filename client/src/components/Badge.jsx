export default function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-200 bg-slate-100 text-slate-700',
    Low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Medium: 'border-amber-200 bg-amber-50 text-amber-700',
    High: 'border-red-200 bg-red-50 text-red-700',
    'To Do': 'border-slate-200 bg-slate-100 text-slate-700',
    'In Progress': 'border-blue-200 bg-blue-50 text-blue-700',
    Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  };

  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}