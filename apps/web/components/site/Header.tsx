import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="wordmark wordmark--with-mark" aria-label="Casal Olives — home">
          <svg
            className="wordmark-mark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="28"
            height="28"
            aria-hidden="true"
          >
            {/* Harvest mark — four olive leaves around a centre stem */}
            <ellipse cx="32" cy="14" rx="8" ry="4" fill="currentColor" transform="rotate(-15 32 14)" />
            <ellipse cx="50" cy="32" rx="8" ry="4" fill="currentColor" transform="rotate(75 50 32)" />
            <ellipse cx="32" cy="50" rx="8" ry="4" fill="currentColor" transform="rotate(15 32 50)" />
            <ellipse cx="14" cy="32" rx="8" ry="4" fill="currentColor" transform="rotate(105 14 32)" />
            <circle cx="32" cy="32" r="3" fill="currentColor" />
          </svg>
          <span className="wordmark-text">Casal Olives</span>
        </Link>
        <Link href="/#concierge" className="btn btn-primary btn-sm">Talk to Olive →</Link>
      </div>
    </header>
  );
}
