"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

// Fixed WhatsApp CTA on mobile. Hidden while any primary CTA on the page
// (hero, final CTA) is on screen, so the action never appears twice, and on
// the e-book page, where the waiting-list form is the main action.
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const hidden = pathname.startsWith("/ebook");

  useEffect(() => {
    if (hidden) { setVisible(false); return; }
    const targets = document.querySelectorAll("[data-primary-cta]");
    if (targets.length === 0) { setVisible(true); return; }

    const onScreen = new Set<Element>();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      setVisible(onScreen.size === 0);
    });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, [pathname, hidden]);

  return (
    <div
      className={`fixed inset-x-2 bottom-2 z-[90] rounded-full bg-white/90 p-1.5 shadow-[0_10px_40px_rgba(19,19,19,0.18)]
                  backdrop-blur-md mb-[env(safe-area-inset-bottom)] transition-[transform,visibility,opacity] duration-300 md:hidden
                  ${visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-[150%] opacity-0"}`}
    >
      <WhatsAppButton location="sticky_mobile" className="w-full" />
    </div>
  );
}
