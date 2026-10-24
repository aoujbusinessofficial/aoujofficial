"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export function FloatingWhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const officialNumber = "923426300002";
  const advisorName = "Adnan";

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg =
      message.trim() ||
      "Assalam o Alaikum Adnan Bhai, mujhe AOUJ collection ke mutalliq information chahiye.";
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://wa.me/${officialNumber}?text=${encoded}`, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  const handleQuickQuestion = (quickText: string) => {
    const encoded = encodeURIComponent(quickText);
    window.open(`https://wa.me/${officialNumber}?text=${encoded}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* POPUP CHAT WINDOW */}
      {isOpen && (
        <div className="mb-3 w-[310px] sm:w-[340px] bg-[#FAF7F2] border border-[#D8C9B6] shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#151007] text-[#FAF7F2] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#907553] flex items-center justify-center text-white font-serif font-bold text-sm">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#151007]" />
              </div>
              <div>
                <h4 className="text-xs font-serif tracking-wide text-white">
                  AOUJ Couture Concierge
                </h4>
                <p className="text-[10px] text-emerald-400 font-sans flex items-center gap-1">
                  <span>●</span> Online | {advisorName} (Official Advisor)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#D8C9B6] hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#F5EFE6]/60 space-y-3 max-h-[300px] overflow-y-auto text-xs font-sans">
            <div className="bg-white p-3 rounded-tr-md rounded-br-md rounded-bl-md border border-[#D8C9B6]/60 shadow-xs text-[#211A12] space-y-1.5">
              <p className="font-medium text-[#907553] text-[11px]">
                Assalam o Alaikum! ✨
              </p>
              <p className="text-[11.5px] leading-relaxed text-[#3A2E21]">
                Main <strong>{advisorName}</strong> hoon. Fabric composition, custom size measurements, ya order verification ke mutalliq kuch poochna ho to foran rabta karein.
              </p>
              <span className="text-[9.5px] text-[#3A2E21]/50 block text-right">
                AOUJ Atelier
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase tracking-wider text-[#907553] font-semibold">
                Quick Inquiries:
              </p>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    "Assalam o Alaikum Adnan Bhai, mujhe fabric quality aur delivery time ke baare mein poochna hai."
                  )
                }
                className="w-full text-left p-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] text-[#151007] transition-colors cursor-pointer"
              >
                🧵 Fabric &amp; Delivery Inquiry
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    "Assalam o Alaikum Adnan Bhai, maine order place kiya hai aur payment receipt share karni hai."
                  )
                }
                className="w-full text-left p-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] text-[#151007] transition-colors cursor-pointer"
              >
                💳 Share Payment Receipt
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    "Assalam o Alaikum Adnan Bhai, kya custom size ya unstitched option available hai?"
                  )
                }
                className="w-full text-left p-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] text-[#151007] transition-colors cursor-pointer"
              >
                📏 Custom Stitching Inquiry
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#FAF7F2] border-t border-[#D8C9B6] flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white border border-[#D8C9B6] px-3 py-2 text-xs text-[#211A12] focus:outline-none focus:border-[#907553] font-sans"
            />
            <button
              type="submit"
              className="w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center rounded-sm transition-colors cursor-pointer shrink-0 shadow-sm"
              aria-label="Send WhatsApp message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle size={20} className="text-white fill-white" />
        <span className="text-xs font-sans font-semibold tracking-wider uppercase hidden sm:inline-block">
          Chat With Us
        </span>
      </button>
    </div>
  );
}
