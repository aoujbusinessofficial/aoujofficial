"use client";

import React from "react";
import { X, Printer, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { AdminOrder } from "@/services/adminService";

interface OrderInvoiceModalProps {
  order: AdminOrder;
  onClose: () => void;
}

const formatPrice = (amount: number) =>
  `PKR ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#FAF7F2] max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#D8C9B6] shadow-2xl flex flex-col">
        {/* Actions Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-[#151007] text-[#FAF7F2] border-b border-[#D8C9B6]">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#D8C9B6]">
            <Sparkles size={14} className="text-[#907553]" />
            <span>AOUJ ATELIER • OFFICIAL INVOICE &amp; RECEIPT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#907553] text-[#FAF7F2] text-xs font-sans uppercase tracking-wider hover:bg-[#A38662] transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:text-[#D8C9B6] text-white/80 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-10 space-y-8 bg-white print:p-0 print:bg-transparent text-[#151007]">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#D8C9B6] pb-6">
            <div>
              <h1
                className="text-3xl sm:text-4xl tracking-[0.2em] font-normal uppercase text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                AOUJ
              </h1>
              <p className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#907553] font-semibold mt-0.5">
                HAUTE COUTURE &amp; HEIRLOOM ATELIER
              </p>
              <p className="text-xs font-sans text-[#3A2E21]/70 mt-2 leading-relaxed">
                Gulberg III, Lahore, Pakistan
                <br />
                Concierge: +92 300 0000000 | concierge@aouj.atelier
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-[#F7F1E8] border border-[#D8C9B6] text-[11px] font-mono uppercase tracking-wider text-[#907553] font-bold">
                INVOICE
              </span>
              <p className="font-mono text-sm font-semibold text-[#151007] pt-1">
                {order.orderNumber}
              </p>
              <p className="text-xs font-sans text-[#3A2E21]/70">Date: {invoiceDate}</p>
              <p className="text-xs font-sans text-[#3A2E21]/70">
                Payment: <strong className="text-[#151007]">{order.paymentMethod}</strong>
              </p>
              <p className="text-xs font-sans text-[#3A2E21]/70">
                Status: <strong className="text-emerald-700">{order.orderStatus}</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div className="p-4 bg-[#FAF7F2] border border-[#D8C9B6]">
              <p className="text-[10px] uppercase tracking-widest text-[#907553] font-bold mb-2">
                CUSTOMER &amp; BILLING DETAILS
              </p>
              <p className="font-semibold text-sm text-[#151007]">{order.customerName}</p>
              <p className="text-[#3A2E21] mt-1">Phone / WhatsApp: {order.customerPhone}</p>
              {order.customerEmail && (
                <p className="text-[#3A2E21]">Email: {order.customerEmail}</p>
              )}
              <p className="text-[11px] text-[#3A2E21]/60 mt-1">
                Type: {order.isGuest ? "Guest Client" : "Registered Member"}
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#D8C9B6]">
              <p className="text-[10px] uppercase tracking-widest text-[#907553] font-bold mb-2">
                DELIVERY DESTINATION
              </p>
              <p className="text-[#151007] font-medium leading-relaxed">
                {order.shippingAddress}
              </p>
              <p className="text-[#3A2E21] mt-1">
                City: <strong>{order.city}</strong>
              </p>
              <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                Standard Insured Courier (2-4 Working Days)
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#907553] font-bold">
              ORDERED ATELIER CREATIONS
            </p>
            <div className="border border-[#D8C9B6] overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-[#F2EAE0] border-b border-[#D8C9B6] text-[#151007]">
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold">
                      #
                    </th>
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold">
                      Design / Piece
                    </th>
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold">
                      Tailored Sizes &amp; Measurements
                    </th>
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold text-right">
                      Unit Price
                    </th>
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold text-center">
                      Qty
                    </th>
                    <th className="p-3 uppercase text-[10px] tracking-wider font-semibold text-right">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C9B6]/60">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-[#FAF7F2]">
                      <td className="p-3 text-[#3A2E21]/60 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-[#151007]">
                        {item.productName}
                      </td>
                      <td className="p-3 space-y-1 text-[11px] text-[#3A2E21]">
                        {item.selectedWomanSize && (
                          <div>
                            Woman: <strong>{item.selectedWomanSize}</strong>
                          </div>
                        )}
                        {item.selectedGirlSize && (
                          <div>
                            Girl: <strong>{item.selectedGirlSize}</strong>
                          </div>
                        )}
                        {item.isCustomSize && (
                          <div className="text-[#907553] font-medium">
                            ★ Bespoke Custom Size
                            {item.customMeasurements && (
                              <div className="text-[10px] text-[#151007]">
                                {Object.entries(item.customMeasurements).map(([k, v]) => (
                                  <span key={k} className="mr-2 capitalize">
                                    {k}: {String(v)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right font-medium text-[#151007]">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="p-3 text-center font-semibold text-[#151007]">
                        {item.quantity}
                      </td>
                      <td className="p-3 text-right font-bold text-[#151007]">
                        {formatPrice(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Notes Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-[#FAF7F2] border border-[#D8C9B6] text-xs font-sans space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#907553] font-bold">
                COURIER &amp; DISPATCH NOTICE
              </p>
              <p className="text-[#3A2E21] leading-relaxed">
                All AOUJ garments are inspected by our master tailors before sealed dispatch. Please keep cash ready for the courier agent upon arrival.
              </p>
              <p className="text-[11px] text-[#3A2E21]/70">
                Tracking Link: https://aouj.atelier/track-order?order={order.orderNumber}
              </p>
            </div>

            <div className="p-4 bg-[#F2EAE0] border border-[#D8C9B6] text-xs font-sans space-y-2.5">
              <div className="flex justify-between text-[#3A2E21]">
                <span>Items Subtotal:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#3A2E21]">
                <span>Shipping &amp; Logistics:</span>
                <span className="font-medium">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Discount:</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#151007] border-t border-[#D8C9B6] pt-2">
                <span>Grand Total (Payable on COD):</span>
                <span className="text-[#907553]">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Monogram & Sign */}
          <div className="text-center pt-6 border-t border-[#D8C9B6]/60 text-xs font-sans text-[#3A2E21]/60">
            <p className="tracking-widest uppercase text-[10px] text-[#907553] font-medium">
              Thank you for trusting AOUJ Atelier
            </p>
            <p className="mt-1">
              This is a computer-generated luxury receipt. No physical signature required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
