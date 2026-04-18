"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out", delay: 0.2 }
      );
    },
    { scope: pageRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send — wire up email service (Resend, SendGrid) here
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="contact-item">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-3">Get in Touch</p>
          <h1 className="text-5xl font-light text-zinc-900 tracking-tight mb-16">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            {[
              { label: "Customer Care", lines: ["Mon–Sat, 10am–7pm IST", "support@maison.in", "+91 98765 43210"] },
              { label: "Press & Wholesale", lines: ["press@maison.in"] },
              { label: "Visit Us", lines: ["42 Colaba Causeway", "Mumbai 400 001", "India"] },
            ].map((info) => (
              <div key={info.label} className="contact-item">
                <h3 className="text-xs tracking-widest uppercase text-zinc-400 mb-3">{info.label}</h3>
                {info.lines.map((l) => <p key={l} className="text-sm text-zinc-700 leading-relaxed">{l}</p>)}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="contact-item">
            {sent ? (
              <div className="bg-zinc-50 p-10 text-center space-y-4">
                <p className="text-2xl font-light text-zinc-900">Message Sent</p>
                <p className="text-zinc-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { name: "name", label: "Your Name", type: "text" },
                  { name: "email", label: "Email Address", type: "email" },
                  { name: "subject", label: "Subject", type: "text" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={(form as Record<string, string>)[f.name]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
