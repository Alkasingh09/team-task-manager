export default function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    Low: 'bg-emerald-50 text-emerald-700',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-red-50 text-red-700',
    'To Do': 'bg-slate-100 text-slate-700',
    'In Progress': 'bg-blue-50 text-blue-700',
    Completed: 'bg-emerald-50 text-emerald-700'
  };

  return (
    <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}
