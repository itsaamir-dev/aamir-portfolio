"use client";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function ShareBar({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked — the link is still visible to copy by hand */ }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-wa"
      >
        <Icon name="chat" size={18} />
        Share on WhatsApp
      </a>
      <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
        <Icon name={copied ? "check" : "link"} size={18} />
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
