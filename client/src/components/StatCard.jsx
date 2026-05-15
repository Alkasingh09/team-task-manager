export default function StatCard({ label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-blue-50 text-brand',
    mint: 'bg-emerald-50 text-mint',
    amber: 'bg-amber-50 text-amber-700',
    coral: 'bg-red-50 text-coral'
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-md px-3 py-1 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
