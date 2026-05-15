export default function StatCard({ label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-blue-50 text-brand border-blue-100',
    mint: 'bg-emerald-50 text-mint border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    coral: 'bg-red-50 text-coral border-red-100'
  };

  return (
    <div className="app-panel p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-4 inline-flex min-w-16 justify-center rounded-md border px-3 py-1 text-3xl font-bold ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
}
