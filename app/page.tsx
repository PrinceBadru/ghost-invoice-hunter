import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-slate-50 p-24 text-center">
      <div className="max-w-md card bg-white shadow-lg p-32 rounded-xl border border-neutral-border">
        <h1 className="text-4xl font-bold text-slate-900 mb-16 tracking-tight">Ghost Invoice Hunter</h1>
        <p className="text-neutral mb-32 text-md leading-relaxed">
          Accounts-receivable intelligence platform to identify revenue leakage and automate reconciliation.
        </p>
        <div className="flex flex-col gap-16">
   
        </div>
      </div>
    </div>
  );
}
