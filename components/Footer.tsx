import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#060d14] border-t border-[rgba(201,168,76,0.1)]
                        px-16 py-8 flex items-center justify-between flex-wrap gap-4
                        font-mono text-[0.6rem] tracking-[0.1em] text-mid-gray">
      <div>© 2025 <span className="text-gold">Aamir Bashir</span> · Senior Software Engineer</div>
      <div>Made with precision · India · Open to Remote <span className="text-gold">(US/EU)</span></div>
      <div>
        <Link href="/blog" className="text-gold hover:text-gold2 transition-colors duration-200 no-underline">
          Blog →
        </Link>
      </div>
    </footer>
  );
}
