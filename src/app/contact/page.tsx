"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  FileQuestion,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Order & Delivery Inquiry");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const officialEmail = "aoujbusinessofficial@gmail.com";
  const officialPhone = "+92 342-6300002";
  const advisorName = "Adnan";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format professional inquiry for Email / WhatsApp
    const queryDetails = `Assalam o Alaikum AOUJ Concierge,\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim()}\nSubject: ${subject}\n${orderNumber ? `Order Reference: ${orderNumber.trim()}\n` : ""}\nMessage:\n${message.trim()}`;

    // Open direct mailto client as reliable direct dispatch
    const mailtoUrl = `mailto:${officialEmail}?subject=${encodeURIComponent(`[AOUJ Atelier Inquiry] ${subject}${orderNumber ? ` - #${orderNumber}` : ""}`)}&body=${encodeURIComponent(queryDetails)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-8"
        >
          <Link href="/" className="hover:text-[#907553] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#151007] font-medium">Concierge &amp; Contact</span>
        </nav>

        {/* Hero Section */}
        <div className="border-b border-[#D8C9B6]/60 pb-8 mb-12">
          <p className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#907553] mb-2">
            ATELIER CLIENT SERVICES &amp; RESOLUTIONS
          </p>
          <h1
            className="text-3xl sm:text-5xl text-[#151007] font-normal tracking-tight uppercase"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Contact &amp; Assistance
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-sans text-[#3A2E21]/80 max-w-2xl leading-relaxed">
            At AOUJ Atelier, every stitch and silhouette is crafted with unwavering dedication. If you have inquiries regarding your bespoke orders, sizing adjustments, payment verifications, or complaints, our dedicated concierge team is at your immediate service.
          </p>
        </div>

        {/* Content Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: OFFICIAL ATELIER DIRECT CHANNELS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <div className="p-6 bg-[#F7F1E8] border border-[#D8C9B6] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#907553]/15 flex items-center justify-center text-[#907553] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-serif text-[#151007]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Official Email Support
                  </h3>
                  <p className="text-[10px] font-sans text-[#907553] uppercase tracking-wider font-semibold">
                    Queries, Verifications &amp; Complaints
                  </p>
                </div>
              </div>

              <p className="text-xs font-sans text-[#3A2E21]/85 leading-relaxed">
                For formal order disputes, payment receipt submissions, custom bridal queries, or feedback, you can reach out directly to our official atelier inbox:
              </p>

              <div className="p-3 bg-[#FAF7F2] border border-[#D8C9B6] flex items-center justify-between">
                <a
                  href={`mailto:${officialEmail}`}
                  className="font-mono text-xs sm:text-sm font-semibold text-[#151007] hover:text-[#907553] transition-colors break-all"
                >
                  {officialEmail}
                </a>
              </div>

              <div className="text-[11px] font-sans text-[#665a4a] space-y-1">
                <p>⚡ <strong>Average Resolution Time:</strong> 12 to 24 business hours.</p>
                <p>📩 Kindly include your <strong>Order Reference Number</strong> for expedited handling.</p>
              </div>
            </div>

            {/* Instant WhatsApp Concierge Card */}
            <div className="p-6 bg-[#FAF7F2] border border-[#D8C9B6] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-serif text-[#151007]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Live WhatsApp Concierge
                  </h3>
                  <p className="text-[10px] font-sans text-emerald-700 uppercase tracking-wider font-semibold">
                    Instant Priority Support
                  </p>
                </div>
              </div>

              <p className="text-xs font-sans text-[#3A2E21]/85 leading-relaxed">
                Chat directly with our lead advisor, <strong>{advisorName}</strong>, to share payment transfer screenshots, discuss fabric details, or track your live parcel.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <a
                  href={`https://wa.me/923426300002?text=${encodeURIComponent("Assalam o Alaikum Adnan Bhai, mujhe AOUJ Atelier ke mutalliq assistance chahiye.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-sans font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${officialPhone.replace(/\s+/g, "")}`}
                  className="w-full sm:w-auto py-3 px-4 border border-[#D8C9B6] hover:border-[#151007] text-[#151007] text-xs font-sans font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  <span>{officialPhone}</span>
                </a>
              </div>
            </div>

            {/* Timings & Atelier Details */}
            <div className="p-5 bg-[#F7F1E8]/60 border border-[#D8C9B6]/60 text-xs font-sans space-y-3">
              <div className="flex items-start gap-2.5 text-[#3A2E21]">
                <Clock size={16} className="text-[#907553] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#151007]">Artisan Working Hours</p>
                  <p className="text-[11px] text-[#665a4a]">
                    Monday – Friday: 10:00 AM – 7:00 PM (PKT)
                    <br />
                    Saturday: 11:00 AM – 5:00 PM | Sunday: Closed for Master Weaving
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[#3A2E21] pt-2 border-t border-[#D8C9B6]/40">
                <MapPin size={16} className="text-[#907553] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#151007]">Atelier Headquarters</p>
                  <p className="text-[11px] text-[#665a4a]">
                    AOUJ Haute Couture &amp; Heirloom House, Lahore, Pakistan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: RESOLUTION & INQUIRY FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-[#F7F1E8] p-6 sm:p-9 border border-[#D8C9B6]">
            <div className="border-b border-[#D8C9B6]/60 pb-4 mb-6">
              <h2
                className="text-2xl sm:text-3xl font-serif text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Send Us A Direct Query
              </h2>
              <p className="text-xs font-sans text-[#3A2E21]/70 mt-1">
                Fill out the form below. Your message will be routed directly to our priority support inbox at <span className="font-semibold text-[#151007]">{officialEmail}</span>.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center border border-emerald-300">
                  <CheckCircle2 size={30} />
                </div>
                <h3
                  className="text-2xl font-serif text-[#151007]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your query has been routed to our concierge team. You will receive an official response on your email (<strong>{email}</strong>) within 24 business hours.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#FAF7F2] border border-[#D8C9B6] text-xs font-sans uppercase tracking-widest hover:bg-[#151007] hover:text-[#FAF7F2] transition-colors"
                  >
                    Submit Another Query
                  </button>
                  <Link
                    href="/products"
                    className="px-6 py-2.5 bg-[#151007] text-[#FAF7F2] text-xs font-sans uppercase tracking-widest hover:bg-[#907553] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3.5 py-2.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ayesha@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3.5 py-2.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                      Mobile Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3.5 py-2.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                      Order Reference (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g. AOUJ-20261024-XXXX"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3.5 py-2.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                    Query Category / Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3.5 py-2.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans cursor-pointer"
                  >
                    <option value="Order & Delivery Inquiry">Order &amp; Delivery Inquiry</option>
                    <option value="Payment Verification & Receipt">Payment Verification &amp; Receipt Submission</option>
                    <option value="72-Hours Exchange & Returns">72-Hours Exchange &amp; Sizing Discrepancy</option>
                    <option value="Fabric & Custom Stitching Queries">Fabric &amp; Custom Sizing Consultation</option>
                    <option value="General Feedback & Complaints">General Feedback &amp; Service Complaints</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-sans text-[#3A2E21] mb-1 font-medium">
                    Your Message / Complaint Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your query in detail. Our atelier concierge will review and get back to you promptly..."
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs p-3.5 text-[#211A12] focus:outline-none focus:border-[#907553] font-sans resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? "Dispatching Inquiry..." : "Submit Inquiry to Concierge"}</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#3A2E21]/60 text-center font-sans">
                  🔒 Your information is confidential and strictly handled under AOUJ Atelier privacy standards.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
