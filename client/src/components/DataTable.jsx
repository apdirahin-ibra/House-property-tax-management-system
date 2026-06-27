import { Card, CardContent } from './ui/Card';
import { EmptyState } from './Feedback';

export function DataTable({ columns, rows, emptyMessage }) {
  if (!rows?.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-b border-slate-100 bg-white transition-colors last:border-0 hover:bg-cyan-50/40"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 align-middle text-slate-800">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function FilterBar({ children }) {
  return (
    <Card className="border-slate-200/90 bg-white/90">
      <CardContent className="flex flex-wrap items-end gap-3 p-4">{children}</CardContent>
    </Card>
  );
}
