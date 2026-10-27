import type { Metadata, Viewport } from "next";
import { Roboto_Flex } from "next/font/google";
import "./admin.css";

const robotoFlex = Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto-flex", display: "swap" });

// Only the Material Symbols the admin uses (icon_names must be alphabetical).
const ICONS = [
  "arrow_forward", "campaign", "chat", "check", "check_circle", "chevron_left", "chevron_right", "close",
  "content_copy", "dark_mode", "database", "delete", "download", "error", "filter_list", "group",
  "light_mode", "lock", "logout", "mail", "menu_book", "more_vert", "north_east", "open_in_new",
  "person_remove", "refresh", "search", "settings", "south_east", "space_dashboard", "trending_flat",
  "visibility", "visibility_off",
];
const SYMBOLS_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0" +
  `&icon_names=${[...ICONS].sort().join(",")}&display=block`;

export const metadata: Metadata = {
  title:  { default: "Admin", template: "%s · Build With Aamir Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#101410" },
    { media: "(prefers-color-scheme: light)", color: "#f7fbf2" },
  ],
};

// Runs before paint: apply the saved/OS theme and opt into load-in motion.
const bootScript = `(function(){try{var r=document.getElementById('admin-root');var t=null;try{t=localStorage.getItem('bwa-admin-theme')}catch(e){}
if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}r.setAttribute('data-theme',t);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('js-motion')}}catch(e){}})();`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={SYMBOLS_URL} />
      <div id="admin-root" data-theme="dark" className={`admin-root min-h-dvh ${robotoFlex.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {children}
      </div>
    </>
  );
}
