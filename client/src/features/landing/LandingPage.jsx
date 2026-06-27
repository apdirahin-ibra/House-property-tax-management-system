import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import heroImage from '../../assets/landing-hero.png';
import { useAuth } from '../auth/AuthContext';
import { getRoleHomePath } from '../../utils/storage';

const proofPoints = [
  'Dedicated experiences for admins, officers, and property owners',
  'Billing, mobile-money payments, receipts, and audit trails in one flow',
  'Clear reporting for collections, outstanding balances, and accountability',
];

const stats = [
  ['Unified', 'Assessment, billing, payment, and receipt workflows'],
  ['Always On', 'Owner self-service for bills, balances, and receipts'],
  ['Auditable', 'Every critical action traceable from one secure workspace'],
];

export default function LandingPage() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Link
        to="/login"
        className="fixed right-4 top-4 z-30 inline-flex h-12 items-center justify-center rounded-full border border-cyan-50/75 bg-white/[0.18] px-6 text-sm font-black text-white shadow-[0_18px_60px_rgba(8,145,178,0.2)] backdrop-blur-2xl ring-1 ring-white/40 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-slate-950 hover:shadow-[0_24px_82px_rgba(103,232,249,0.34)] sm:right-8 sm:top-7"
      >
        Sign In
      </Link>

      <section className="relative isolate min-h-[94svh] overflow-hidden">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-95"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_32%,rgba(45,212,191,0.165),transparent_33%),radial-gradient(ellipse_at_88%_18%,rgba(251,191,36,0.07),transparent_28%),radial-gradient(ellipse_at_18%_22%,rgba(56,189,248,0.085),transparent_30%),linear-gradient(90deg,rgba(2,6,23,0.985)_0%,rgba(2,6,23,0.93)_32%,rgba(2,6,23,0.72)_52%,rgba(2,6,23,0.44)_77%,rgba(2,6,23,0.27)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/72 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-[64%] bg-gradient-to-r from-slate-950/5 via-slate-950/18 to-transparent" />
        <div className="absolute right-0 top-0 hidden h-full w-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_26%,rgba(20,184,166,0.045)_54%,transparent_86%)] lg:block" />

        <div className="relative mx-auto flex min-h-[94svh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8 lg:px-10">
          <div className="max-w-[700px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200/18 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase text-cyan-50/95 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl">
              <Sparkles className="h-4 w-4" />
              Premium municipal finance workspace
            </div>

            <h1 className="max-w-4xl text-[2.45rem] font-black leading-[1.04] text-white sm:text-[3.55rem] md:text-[4.25rem] lg:text-[4.55rem]">
              Property tax operations, rebuilt for speed and trust.
            </h1>

            <p className="mt-7 max-w-[620px] text-lg leading-8 text-slate-200/90 sm:text-xl">
              A refined command center for owners, properties, assessments, bills, EVC and eDahab payments, receipts, reports, and accountability.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-black text-slate-950 shadow-[0_24px_80px_rgba(8,145,178,0.26),inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 ring-white/90 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-[0_34px_105px_rgba(103,232,249,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]"
              >
                Open workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.032] px-6 text-sm font-semibold text-slate-300/90 backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Role-based and audit-ready
              </div>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-slate-300/80 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point} className="flex gap-2 rounded-md border border-white/[0.045] bg-white/[0.014] p-3 backdrop-blur-xl transition duration-300 hover:border-white/[0.08] hover:bg-white/[0.026]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300/75" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 pb-14 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="group rounded-lg border border-white/[0.07] bg-white/[0.03] p-6 shadow-2xl shadow-black/10 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/18 hover:bg-white/[0.055] hover:shadow-cyan-950/20"
            >
              <p className="text-2xl font-black text-white/95 sm:text-3xl">{value}</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 group-hover:text-slate-200">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
