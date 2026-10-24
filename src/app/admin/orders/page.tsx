"use client";

import React, { useState, useEffect } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
  AdminOrder,
} from "@/services/adminService";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  X,
  AlertTriangle,
  Ruler,
  Printer,
} from "lucide-react";
import Image from "next/image";
import { OrderInvoiceModal } from "@/components/invoice/OrderInvoiceModal";

const formatPrice = (amount: number) =>
  `PKR ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      }
    }
  };

  const handleDelete = async (orderId: string) => {
    const ok = await deleteOrder(orderId);
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      setDeleteConfirmId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "ALL" || order.orderStatus === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      order.city.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "PROCESSING":
        return "bg-indigo-100 text-indigo-900 border-indigo-300";
      case "DISPATCHED":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "CANCELLED":
        return "bg-red-100 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C9B6] pb-5">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553] font-semibold mb-1">
            FULFILLMENT &amp; LOGISTICS
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Customer Orders
          </h1>
        </div>

        <div className="text-xs font-sans text-[#3A2E21]/80">
          Total: <strong className="text-[#151007]">{orders.length}</strong> orders
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7F2] border border-[#D8C9B6] p-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "All" },
            { id: "PENDING", label: "Pending" },
            { id: "CONFIRMED", label: "Confirmed" },
            { id: "PROCESSING", label: "Processing" },
            { id: "DISPATCHED", label: "Dispatched" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                filterStatus === tab.id
                  ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                  : "bg-[#F7F1E8] text-[#3A2E21] border-[#D8C9B6] hover:border-[#907553]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-3 text-[#3A2E21]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, phone, city..."
            className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 pl-9 pr-3 text-xs font-sans text-[#151007] focus:outline-none focus:border-[#907553]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#FAF7F2] border border-[#D8C9B6] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs font-sans text-[#3A2E21]/70">
            Loading orders from Supabase...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShoppingBag size={32} className="mx-auto text-[#907553]" strokeWidth={1.5} />
            <p className="text-sm font-sans font-medium text-[#151007]">No Orders Found</p>
            <p className="text-xs font-sans text-[#3A2E21]/70">
              Try adjusting your filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F7F1E8] border-b border-[#D8C9B6] text-[10px] uppercase tracking-wider text-[#3A2E21]">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C9B6]/40">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F2EAE0]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#151007]">
                      {order.orderNumber}
                      <p className="text-[10px] text-[#3A2E21]/60 font-sans">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#151007]">{order.customerName}</p>
                      <p className="text-[11px] text-[#3A2E21]/80 flex items-center gap-1">
                        <Phone size={11} className="text-[#907553]" /> {order.customerPhone}
                      </p>
                      {order.isGuest && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#EFE8DF] text-[#7A6347] font-medium border border-[#D8C9B6]/60">
                          Guest Checkout
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#151007]">{order.city}</p>
                      <p className="text-[11px] text-[#3A2E21]/70 truncate max-w-[180px]">
                        {order.shippingAddress}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#151007]">
                      {formatPrice(order.grandTotal)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-[#3A2E21]">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[11px] font-sans font-medium py-1 px-2 border focus:outline-none ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#151007] hover:text-[#907553] hover:bg-[#FAF7F2] border border-[#D8C9B6] cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(order.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] max-w-2xl w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-4">
              <div>
                <p className="text-[10px] uppercase font-sans tracking-widest text-[#907553]">
                  ORDER DOSSIER
                </p>
                <h3
                  className="text-2xl font-serif text-[#151007]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#907553] text-[#FAF7F2] text-xs font-sans uppercase tracking-wider hover:bg-[#A38662] transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-[#3A2E21] hover:text-[#151007] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/70 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#907553] font-semibold">
                  CLIENT DETAILS
                </p>
                <p className="font-semibold text-sm text-[#151007]">{selectedOrder.customerName}</p>
                <p className="text-[#3A2E21]">Phone: {selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-[#3A2E21]">Email: {selectedOrder.customerEmail}</p>
                )}
                <p className="text-[11px] text-[#3A2E21]/70">
                  Account Type: {selectedOrder.isGuest ? "Guest Client" : "Registered Member"}
                </p>
              </div>

              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/70 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#907553] font-semibold">
                  DELIVERY ADDRESS
                </p>
                <p className="text-[#151007] font-medium leading-relaxed">
                  {selectedOrder.shippingAddress}
                </p>
                <p className="text-[#3A2E21]">City: {selectedOrder.city}</p>
                <p className="text-[#3A2E21]">Payment: {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Items Ordered with Full Size Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#151007]">
                Ordered Items ({selectedOrder.items.length})
              </h4>

              <div className="border border-[#D8C9B6] divide-y divide-[#D8C9B6]/50">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex gap-4 items-start bg-[#FAF7F2]">
                    {item.productImage && (
                      <div className="relative w-16 h-20 bg-[#D8C9B6] border border-[#D8C9B6] shrink-0 overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-1 text-xs font-sans">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-[#151007]">{item.productName}</h5>
                        <p className="font-medium text-[#151007]">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>

                      <p className="text-[#3A2E21]/80">
                        Qty: <strong>{item.quantity}</strong> × {formatPrice(item.unitPrice)}
                      </p>

                      {/* Exact Size Breakdown */}
                      <div className="pt-1.5 space-y-1">
                        {item.selectedWomanSize && (
                          <div className="inline-block mr-2 px-2 py-0.5 bg-[#F2EAE0] border border-[#D8C9B6] text-[11px] text-[#151007]">
                            👩 Mother&apos;s Size: <strong>{item.selectedWomanSize}</strong>
                          </div>
                        )}

                        {item.selectedGirlSize && (
                          <div className="inline-block mr-2 px-2 py-0.5 bg-[#F2EAE0] border border-[#D8C9B6] text-[11px] text-[#151007]">
                            👧 Daughter&apos;s Age Size: <strong>{item.selectedGirlSize}</strong>
                          </div>
                        )}

                        {item.isCustomSize && (
                          <div className="mt-2 p-2 bg-[#FAF7F2] border border-[#907553] text-[11px] space-y-1">
                            <p className="font-semibold text-[#907553] flex items-center gap-1">
                              <Ruler size={13} /> Bespoke Custom Tailoring:
                            </p>
                            {typeof item.customMeasurements === "object" && (
                              <div className="grid grid-cols-2 gap-1 text-[#151007]">
                                {Object.entries(item.customMeasurements).map(([k, v]) => (
                                  <span key={k} className="capitalize">
                                    {k}: <strong>{String(v)}&quot;</strong>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-[#F2EAE0] border border-[#D8C9B6] text-xs font-sans space-y-2">
              <div className="flex justify-between text-[#3A2E21]">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#3A2E21]">
                <span>Shipping Fee:</span>
                <span>
                  {selectedOrder.shippingFee === 0 ? "FREE" : formatPrice(selectedOrder.shippingFee)}
                </span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount:</span>
                  <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-[#151007] border-t border-[#D8C9B6] pt-2">
                <span>Grand Total (Payable on COD):</span>
                <span>{formatPrice(selectedOrder.grandTotal)}</span>
              </div>
            </div>

            {/* Status Change Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="font-medium text-[#151007]">Update Order Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="bg-[#FAF7F2] border border-[#D8C9B6] py-1.5 px-3 text-xs font-sans font-medium focus:outline-none focus:border-[#907553]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] text-xs font-sans uppercase tracking-wider hover:bg-[#3A2E21] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] max-w-sm w-full p-6 border border-red-300 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-serif font-medium text-[#151007]">
                Permanently Delete Order?
              </h4>
              <p className="text-xs font-sans text-[#3A2E21]/80">
                This will remove the order and all its items from the database permanently.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#D8C9B6] text-xs font-sans text-[#151007] hover:text-[#151007] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-700 text-white hover:text-white text-xs font-sans uppercase tracking-wider hover:bg-red-800 transition-colors cursor-pointer"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <OrderInvoiceModal
          order={selectedOrder}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
