import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileClock,
  FileText,
  Home,
  LogOut,
  Receipt,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../features/auth/AuthContext';
import { cn } from '../utils/cn';
import { roleLabels } from '../utils/navigation';

const iconMap = {
  Dashboard: Home,
  Users: UsersRound,
  Owners: UserRound,
  Properties: Building2,
  'Tax Rates': Settings,
  Assessments: ClipboardCheck,
  Bills: FileText,
  Payments: CreditCard,
  Receipts: Receipt,
  Reports: BarChart3,
  'Audit Logs': FileClock,
  'My Properties': Building2,
  'My Bills': FileText,
  'My Payments': CreditCard,
  'My Receipts': Receipt,
};

export default function DashboardLayout({ navItems, title }) {
  const { user, logout, loading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const userInitial = user?.name?.slice(0, 1)?.toUpperCase() || 'U';

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden">
      <aside className={cn('hidden flex-shrink-0 p-4 pr-0 transition-[width] duration-300 md:block', sidebarExpanded ? 'w-[300px]' : 'w-24')}>
        <div className={cn('surface-shadow relative flex h-[calc(100vh-32px)] flex-col rounded-lg border border-slate-200/80 bg-white p-4', !sidebarExpanded && 'items-center px-3')}>
          <button
            type="button"
            title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => setSidebarExpanded((expanded) => !expanded)}
            className="absolute -right-3 top-9 z-30 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md shadow-slate-950/10 transition-colors hover:bg-emerald-50 hover:text-slate-950"
          >
            {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <div className={cn('flex-shrink-0 rounded-md border border-slate-200 bg-slate-50 p-3', sidebarExpanded ? 'w-full' : 'w-14')}>
            <div className={cn('flex items-center gap-3', !sidebarExpanded && 'justify-center')}>
              <div className={cn('grid flex-shrink-0 place-items-center rounded-full bg-slate-700 font-black text-white', sidebarExpanded ? 'h-10 w-10 text-sm' : 'h-9 w-9 text-xs')}>
                HP
              </div>
              {sidebarExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-black text-slate-950">HPTMS</p>
                  <p className="truncate text-xs font-semibold text-slate-500">{title}</p>
                </div>
              )}
            </div>
          </div>

          <nav className={cn('mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-1', sidebarExpanded ? 'w-full space-y-1 pr-1' : 'flex w-full flex-col items-center gap-1')}>
            {navItems.map((item) => {
              const Icon = iconMap[item.label] || ShieldCheck;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin' || item.path === '/officer' || item.path === '/owner'}
                  title={sidebarExpanded ? undefined : item.label}
                  className={({ isActive }) =>
                    cn(
                      'group flex h-12 items-center rounded-md text-sm font-bold transition-all',
                      sidebarExpanded ? 'w-full gap-3 px-3' : 'w-12 justify-center px-0',
                      isActive
                        ? 'bg-emerald-50 text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    )
                  }
                >
                  <Icon className="h-5 w-5 flex-shrink-0 text-slate-900 transition-colors group-hover:text-slate-950" strokeWidth={2.3} />
                  {sidebarExpanded && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className={cn('flex-shrink-0 border-t border-slate-200 pt-4', sidebarExpanded ? 'w-full' : 'w-full')}>
            <div className={cn('flex items-center', sidebarExpanded ? 'gap-3' : 'flex-col gap-3')}>
              <div className={cn('grid flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 font-black text-white', sidebarExpanded ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm')}>
                {userInitial}
              </div>
              {sidebarExpanded ? (
                <>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    <p className="mt-0.5 text-xs font-semibold text-emerald-700">{roleLabels[user?.role]}</p>
                  </div>
                  <button
                    type="button"
                    title="Sign out"
                    onClick={logout}
                    className="ml-auto grid h-10 w-10 flex-shrink-0 place-items-center rounded-md text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  title="Sign out"
                  onClick={logout}
                  className="grid h-10 w-10 place-items-center rounded-md text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 md:hidden">
          <div>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="text-xs text-slate-500">{user?.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign out
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto max-w-[1540px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
