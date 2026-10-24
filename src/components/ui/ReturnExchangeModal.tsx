"use client";

import React, { useState } from "react";
import { RotateCcw, X, ShieldCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function ReturnExchangeModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Pill / Link */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#907553] hover:text-[#151007] underline cursor-pointer transition-colors"
      >
        <RotateCcw size={13} />
        <span>View 72-Hours Exchange Policy</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 sm:p-7 border border-[#D8C9B6] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#907553]/15 flex items-center justify-center text-[#907553]">
                  <RotateCcw size={16} />
                </div>
                <div>
                  <h3
                    className="text-xl font-serif text-[#151007]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    72-Hours Exchange &amp; Return Policy
                  </h3>
                  <p className="text-[10px] text-[#907553] uppercase font-sans tracking-wider">
                    AOUJ Atelier Guarantee
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs uppercase font-sans tracking-widest text-[#3A2E21] hover:text-[#907553] cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Policy Points */}
            <div className="space-y-4 text-xs font-sans text-[#3A2E21] leading-relaxed">
              <div className="p-3 bg-[#E7F6DF] border border-emerald-300 text-emerald-950 rounded-xs flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Shop with 100% Peace of Mind:</strong> If you face sizing discrepancies or if the fabric does not meet your expectations, you can request an exchange within 72 hours of parcel delivery.
                </p>
              </div>

              <div className="space-y-2.5 border-t border-[#D8C9B6]/60 pt-3">
                <h4 className="font-semibold text-xs text-[#151007] uppercase tracking-wider">
                  Exchange Guidelines &amp; Criteria:
                </h4>
                <ul className="space-y-2 text-[#3A2E21]/90">
                  <li className="flex items-start gap-2">
                    <span className="text-[#907553] font-bold">1.</span>
                    <span>Articles must remain unworn, unaltered, and unwashed with all original AOUJ tags, accessories, and bespoke packaging intact.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#907553] font-bold">2.</span>
                    <span>Kindly notify our official concierge on WhatsApp within 72 hours of receiving your delivery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#907553] font-bold">3.</span>
                    <span>In the rare event of a transit or manufacturing defect, a complimentary replacement will be arranged free of charge.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 border-t border-[#D8C9B6]/60 pt-3">
                <h4 className="font-semibold text-xs text-[#151007] uppercase tracking-wider">
                  How To Initiate An Exchange:
                </h4>
                <p className="text-[#3A2E21]/90">
                  Send your Order Reference along with clear images or videos of the article to our official WhatsApp Concierge at <strong>+92 342-6300002 (Adnan)</strong> within 72 hours of receiving the parcel. Our team will review and coordinate the exchange or reverse pickup.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 pt-3 border-t border-[#D8C9B6] flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-[#151007] text-[#FAF7F2] text-xs font-sans uppercase tracking-wider hover:bg-[#907553] transition-colors cursor-pointer"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
