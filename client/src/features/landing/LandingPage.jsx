import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  ChartNoAxesCombined,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import civicReference from '../../assets/civic-ledger-reference.png';
import { useAuth } from '../auth/AuthContext';
import { getRoleHomePath } from '../../utils/storage';

const proofPoints = [
  {
    icon: Building2,
    value: '99.98%',
    label: 'Workspace uptime',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Audit-ready actions',
  },
  {
    icon: ChartNoAxesCombined,
    value: '2.4M+',
    label: 'Transactions processed',
  },
];

export default function LandingPage() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030807] text-white">
      <Link
        to="/login"
        className="fixed right-5 top-5 z-50 inline-flex h-11 items-center justify-center rounded-md border border-white/35 bg-[#07100f]/70 px-6 text-sm font-bold text-white shadow-[0_12px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/80 hover:bg-emerald-50 hover:text-[#06110e] hover:shadow-[0_16px_48px_rgba(52,211,153,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:right-8 sm:top-7"
      >
        Sign In
      </Link>

      <section className="relative isolate min-h-[100svh] bg-[#030807]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(16,185,129,0.12),transparent_55%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(16,185,129,0.06),transparent_50%)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1480px] flex-col px-5 pb-7 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pb-8 xl:px-16">
          <div className="grid flex-1 items-center gap-12 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-5 lg:pb-6">
            <div className="max-w-[590px] self-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/45 bg-[#06100e]/70 px-4 py-2 text-xs font-bold uppercase text-emerald-100 backdrop-blur-xl">
                <LockKeyhole className="h-3.5 w-3.5" />
                HPTMS · Civic ledger
              </div>

              <h1 className="max-w-[590px] text-[2.7rem] font-black leading-[1.04] text-white sm:text-[3.25rem] lg:text-[3.35rem] xl:text-[3.7rem]">
                Property tax,
                <span className="block text-emerald-300">made accountable.</span>
              </h1>

              <p className="mt-6 max-w-[560px] text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                One secure workspace for assessments, billing, EVC and eDahab payments, receipts, and reporting.
              </p>

              <div className="mt-8 flex flex-col items-start gap-5">
                <Link
                  to="/login"
                  className="group inline-flex h-14 min-w-[255px] items-center justify-between gap-4 rounded-md bg-emerald-300 px-7 text-sm font-black text-[#06110e] shadow-[0_18px_48px_rgba(16,185,129,0.24),inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-[0_22px_58px_rgba(52,211,153,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100"
                >
                  Open workspace
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Bank-grade security. Complete audit history.
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[520px] items-center justify-end lg:flex xl:min-h-[570px]">
              <div className="absolute right-0 top-1/2 aspect-[1.19/1] w-[96%] -translate-y-1/2 rotate-[1.2deg] overflow-hidden rounded-xl border border-emerald-100/20 bg-[#08110f] shadow-[0_36px_100px_rgba(0,0,0,0.62),0_0_56px_rgba(16,185,129,0.08)] transition duration-500 hover:rotate-0 hover:border-emerald-200/35">
                <img
                  src={civicReference}
                  alt="Dark HPTMS municipal revenue dashboard with collection metrics and audit activity"
                  className="absolute max-w-none"
                  style={{
                    width: '190.6%',
                    left: '-88.4%',
                    top: '-16.3%',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-white/15 bg-[#06100e]/80 shadow-[0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:grid-cols-3">
            {proofPoints.map(({ icon: Icon, value, label }, index) => (
              <div
                key={value}
                className={`flex min-h-[126px] items-center gap-5 px-5 py-5 sm:px-8 ${index > 0 ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''}`}
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-2xl font-black text-white xl:text-3xl">{value}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-400">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
