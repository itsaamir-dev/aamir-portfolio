// Small Lucide-style stroke icons, inlined to avoid adding an icon package.
const paths = {
  chat:    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  user:    <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  file:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
  globe:   <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
  dollar:  <><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  check:   <path d="M20 6 9 17l-5-5" />,
  x:       <path d="M18 6 6 18M6 6l12 12" />,
  plus:    <path d="M12 5v14M5 12h14" />,
  arrow:   <path d="M5 12h14M12 5l7 7-7 7" />,
  menu:    <path d="M4 6h16M4 12h16M4 18h16" />,
};

export type IconName = keyof typeof paths;

export default function Icon({ name, size = 20, className = "" }: {
  name: IconName; size?: number; className?: string;
}) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className={className}
    >
      {paths[name]}
    </svg>
  );
}
