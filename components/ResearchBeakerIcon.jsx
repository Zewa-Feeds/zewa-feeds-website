// Chemistry beaker with a molecular compound: the site's "research backed" mark.
export default function ResearchBeakerIcon({ className = "w-4 h-4 text-primary" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M7.5 2.5h5M9 2.5v4.5L5 15.5c-.5.8 0 2 1 2h8c1 0 1.5-1.2 1-2l-4-8.5V2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 13h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="9" cy="15" r="0.7" fill="currentColor"/>
      <circle cx="11.5" cy="14" r="0.7" fill="currentColor"/>
      <circle cx="16" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
      <circle cx="16" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  );
}
