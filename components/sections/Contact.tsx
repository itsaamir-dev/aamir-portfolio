"use client";
import Reveal from "@/components/RevealOnScroll";

const links = [
  { icon: "✉",  label: "aamirbashir.ahangar@gmail.com", href: "mailto:aamirbashir.ahangar@gmail.com" },
  { icon: "📞", label: "+91-7006597966",                 href: "tel:+917006597966" },
  { icon: "⌥",  label: "github.com/itsaamir-dev",         href: "https://github.com/itsaamir-dev" },
  { icon: "in", label: "linkedin.com/in/itsaamirbashir", href: "https://linkedin.com/in/itsaamirbashir" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 bg-[#0D1B2A]">
      <div className="max-w-[1100px] mx-auto px-16 py-24">
        <Reveal><p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3">Let&apos;s Talk</p></Reveal>
        <Reveal delay={80}><h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-off-white leading-[1.1] mb-12">Get In <span className="text-gold">Touch</span></h2></Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Info */}
          <Reveal>
            <h3 className="font-display text-[1.55rem] text-off-white mb-3">Open to opportunities</h3>
            <p className="text-[0.9rem] text-mid-gray leading-[1.85] mb-8 font-light">
              Whether you have a project in mind, a role to discuss, or just want to connect — I&apos;d love to hear from you.
              Based in India, fully available for remote work with US/EU teams.
            </p>
            <div className="flex flex-col gap-3">
              {links.map(({ icon, label, href }) => (
                <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                   className="flex items-center gap-4 px-5 py-4 border border-[rgba(201,168,76,0.15)] text-light-blue text-[0.88rem]
                              no-underline transition-all duration-250 hover:bg-[rgba(201,168,76,0.06)] hover:border-[rgba(201,168,76,0.4)] hover:text-gold2 hover:translate-x-1">
                  <span className="w-9 h-9 flex items-center justify-center bg-[rgba(201,168,76,0.1)] text-[1rem] flex-shrink-0">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={200}>
            <form className="flex flex-col gap-5"
                  onSubmit={e => { e.preventDefault(); window.location.href = "mailto:aamirbashir.ahangar@gmail.com"; }}>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-gold">Your Name</label>
                <input type="text" placeholder="John Smith"
                  className="bg-[rgba(27,45,66,0.5)] border border-[rgba(201,168,76,0.15)] text-cream px-5 py-3.5
                             font-body text-[0.9rem] outline-none transition-colors duration-200
                             focus:border-[rgba(201,168,76,0.5)] placeholder:text-mid-gray/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-gold">Email</label>
                <input type="email" placeholder="john@company.com"
                  className="bg-[rgba(27,45,66,0.5)] border border-[rgba(201,168,76,0.15)] text-cream px-5 py-3.5
                             font-body text-[0.9rem] outline-none transition-colors duration-200
                             focus:border-[rgba(201,168,76,0.5)] placeholder:text-mid-gray/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-gold">Message</label>
                <textarea rows={5} placeholder="Tell me about your project or opportunity..."
                  className="bg-[rgba(27,45,66,0.5)] border border-[rgba(201,168,76,0.15)] text-cream px-5 py-3.5
                             font-body text-[0.9rem] outline-none transition-colors duration-200 resize-none
                             focus:border-[rgba(201,168,76,0.5)] placeholder:text-mid-gray/60" />
              </div>
              <button type="submit"
                className="btn-clip py-[0.85rem] bg-gold text-navy font-mono text-[0.7rem] tracking-[0.12em] uppercase
                           font-semibold transition-all duration-200 hover:bg-gold2 hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
