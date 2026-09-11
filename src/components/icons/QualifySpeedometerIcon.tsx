/** Speedometer / odometer gauge for warranty qualify funnel. */
export function QualifySpeedometerIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 22a10 10 0 1 1 20 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 22h15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M9 19.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 19.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 12.5L12.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20.5 12.5L19.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="22" r="2" fill="currentColor" />
      <path
        d="M16 22L21.5 14.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
