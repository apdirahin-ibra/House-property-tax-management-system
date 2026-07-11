import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Home,
  Layers,
  Receipt,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getRoleHomePath } from '../../utils/storage';

const features = [
  {
    icon: Building2,
    title: 'Property Registration',
    description: 'Register and manage properties with zone classification, valuation, and ownership tracking.',
  },
  {
    icon: BarChart3,
    title: 'Tax Assessment',
    description: 'Auto-calculate annual tax based on configurable rates per zone, property type, and year.',
  },
  {
    icon: FileText,
    title: 'Billing',
    description: 'Generate itemized tax bills with due dates, track payments, and download PDF copies.',
  },
  {
    icon: CreditCard,
    title: 'Mobile Payments',
    description: 'Accept payments via EVC Plus, eDahab, bank, or cash with auto-generated receipts.',
  },
  {
    icon: Receipt,
    title: 'Digital Receipts',
    description: 'Generate PDF receipts with QR verification tokens for tamper-proof record keeping.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit Trail',
    description: 'Every action is logged with actor, timestamp, and IP for full accountability.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Configure',
    description: 'Set up zones, property types, and tax rates for the fiscal year.',
  },
  {
    step: '02',
    title: 'Register',
    description: 'Register owners and their properties with assessed values.',
  },
  {
    step: '03',
    title: 'Assess & Bill',
    description: 'Generate assessments and issue tax bills with due dates.',
  },
  {
    step: '04',
    title: 'Collect & Report',
    description: 'Record payments, issue receipts, and view real-time reports.',
  },
];

const roles = [
  {
    role: 'Admin',
    icon: ShieldCheck,
    description: 'Full system control — manage users, configure tax rates, view audit logs and reports.',
    gradient: 'from-violet-500 to-purple-600',
    features: ['User management', 'Tax rate configuration', 'Audit log review', 'All reports access'],
  },
  {
    role: 'Tax Officer',
    icon: Users,
    description: 'Daily operations — register owners and properties, issue bills, record payments.',
    gradient: 'from-emerald-500 to-teal-600',
    features: ['Owner & property registration', 'Assessment generation', 'Bill issuance', 'Payment recording'],
  },
  {
    role: 'Property Owner',
    icon: Home,
    description: 'Self-service portal — view properties, pay bills, download receipts.',
    gradient: 'from-cyan-500 to-blue-600',
    features: ['View properties', 'Pay bills online', 'Download receipts', 'Payment history'],
  },
];

const stats = [
  { value: '10,000+', label: 'Properties Managed' },
  { value: '99.9%', label: 'System Uptime' },
  { value: '50,000+', label: 'Transactions Processed' },
  { value: '3', label: 'Active Zones' },
];

export default function LandingPage() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ── Fixed navbar ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-black text-slate-950">
              HP
            </span>
            <span className="text-lg font-bold tracking-tight">HPTMS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-lg bg-emerald-400 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(52,211,153,0.15)_0%,_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.1)_0%,_transparent_50%)]" />
        <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-20 sm:px-8 sm:pt-28 lg:pb-32 lg:pt-36">
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              House Property Tax Management
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Property tax,
              <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                simplified & transparent.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[640px] text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              A complete platform for municipalities to manage property assessments, 
              billing, mobile-money payments, digital receipts, and reporting — all in one secure workspace.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-500/40 sm:w-auto"
              >
                Launch workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-8 text-sm font-semibold text-slate-300 transition hover:border-white/40 hover:text-white sm:w-auto"
              >
                <ShieldCheck className="h-4 w-4" />
                View demo
              </Link>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-950 px-6 py-8 text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/5 bg-slate-900/50 py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">Everything you need</p>
            <h2 className="text-3xl font-black sm:text-4xl">One platform, endless capabilities</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              From property registration to payment collection and reporting — manage your entire tax workflow.
            </p>
          </div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 transition group-hover:bg-emerald-400/20 group-hover:ring-emerald-400/30">
                    <Icon className="h-5.5 w-5.5" strokeWidth={2.2} />
                  </span>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 leading-6 text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">How it works</p>
            <h2 className="text-3xl font-black sm:text-4xl">Simple workflow, powerful results</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Four straightforward steps from configuration to collection.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-12 top-12 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-emerald-400/40 to-transparent md:block" />
                )}
                <div className="relative">
                  <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 text-3xl font-black text-emerald-400 ring-1 ring-white/10">
                    {step.step}
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 leading-6 text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="border-t border-white/5 bg-slate-900/50 py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">Designed for</p>
            <h2 className="text-3xl font-black sm:text-4xl">Three roles, one system</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Tailored dashboards for administrators, tax officers, and property owners.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.role}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:-translate-y-1 hover:border-white/20"
                >
                  <span
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.gradient} text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold text-white">{role.role}</h3>
                  <p className="mt-2 leading-6 text-slate-400">{role.description}</p>
                  <ul className="mt-6 space-y-3">
                    {role.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.12)_0%,_transparent_60%)]" />
        <div className="mx-auto max-w-[800px] px-6 text-center sm:px-8">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to streamline your tax operations?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-slate-400">
            Join municipalities already using HPTMS to manage property tax with transparency and efficiency.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-500/40 sm:w-auto"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-8 text-sm font-semibold text-slate-300 transition hover:border-white/40 hover:text-white sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-xs font-black text-slate-950">
                HP
              </span>
              <span className="text-sm font-semibold text-slate-300">HPTMS</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>House Property Tax Management System</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-slate-500" />
              <Layers className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
