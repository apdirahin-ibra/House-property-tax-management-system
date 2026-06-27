export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase text-cyan-700">Property tax operations</p>
        <h2 className="text-3xl font-bold text-slate-950">{title}</h2>
        {description && <p className="mt-1 max-w-3xl text-base text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
    </div>
  );
}
