export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4.5" y="12.5" width="3.4" height="6.2" rx="0.6" fill="currentColor" />
        <rect x="10.3" y="8.6" width="3.4" height="10.1" rx="0.6" fill="currentColor" />
        <rect x="16.1" y="4.7" width="3.4" height="14" rx="0.6" fill="currentColor" />
        <rect x="4.5" y="18.7" width="15" height="1.5" rx="0.75" fill="currentColor" opacity="0.55" />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <LogoMark />
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-[-0.045em]">Ledgerly</span>
        <span className="mono mt-1 block text-[7px] uppercase tracking-[0.2em] text-[#928f84]">
          Studio finance
        </span>
      </span>
    </span>
  );
}
