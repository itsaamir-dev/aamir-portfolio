"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

// Fixed WhatsApp CTA on mobile. Hidden while any primary CTA on the page
// (hero, final CTA) is on screen, so the action never appears twice.
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll("[data-primary-cta]");
    if (targets.length === 0) { setVisible(true); return; }

    const onScreen = new Set<Element>();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      setVisible(onScreen.size === 0);
    });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, [pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-[rgba(11,13,16,0.96)] px-4 pt-3
                  pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-[transform,visibility] duration-300 md:hidden
                  ${visible ? "visible translate-y-0" : "invisible translate-y-full"}`}
    >
      <WhatsAppButton location="sticky_mobile" className="w-full" />
    </div>
  );
}
