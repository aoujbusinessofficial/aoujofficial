"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchAllOrders,
  fetchAllAdminProducts,
  fetchAllUsers,
  updateOrderStatus,
  AdminOrder,
} from "@/services/adminService";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const formatPrice = (amount: number) =>
  `PKR ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedOrders, fetchedProds, fetchedUsers] = await Promise.all([
      fetchAllOrders(),
      fetchAllAdminProducts(),
      fetchAllUsers(),
    ]);

    setOrders(fetchedOrders);
    setProductsCount(fetchedProds.length);
    setUsersCount(fetchedUsers.length);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING");

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
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C9B6] pb-6">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553] font-semibold mb-1">
            EXECUTIVE ATELIER SUITE
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" href="/admin/products?action=add" withArrow>
            ADD NEW PRODUCT
          </Button>
          <Button variant="secondary" size="sm" href="/admin/orders">
            ALL ORDERS
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Revenue */}
        <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#907553]">
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#3A2E21]/70">
              TOTAL REVENUE
            </span>
            <DollarSign size={18} />
          </div>
          <p
            className="text-2xl sm:text-3xl text-[#151007] font-normal"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] font-sans text-emerald-700 flex items-center gap-1">
            <TrendingUp size={12} /> From {orders.length} order(s)
          </p>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#907553]">
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#3A2E21]/70">
              ORDERS RECEIVED
            </span>
            <ShoppingBag size={18} />
          </div>
          <p
            className="text-2xl sm:text-3xl text-[#151007] font-normal"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {orders.length}
          </p>
          <p className="text-[11px] font-sans text-amber-800 flex items-center gap-1">
            <Clock size={12} /> {pendingOrders.length} Pending processing
          </p>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#907553]">
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#3A2E21]/70">
              CATALOG PRODUCTS
            </span>
            <Package size={18} />
          </div>
          <p
            className="text-2xl sm:text-3xl text-[#151007] font-normal"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {productsCount}
          </p>
          <Link
            href="/admin/products"
            className="text-[11px] font-sans text-[#907553] hover:underline block"
          >
            Manage inventory →
          </Link>
        </div>

        {/* Metric 4: Registered Clients */}
        <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#907553]">
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#3A2E21]/70">
              REGISTERED CLIENTS
            </span>
            <Users size={18} />
          </div>
          <p
            className="text-2xl sm:text-3xl text-[#151007] font-normal"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {usersCount}
          </p>
          <Link
            href="/admin/users"
            className="text-[11px] font-sans text-[#907553] hover:underline block"
          >
            View customer profiles →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-4">
          <div>
            <h2
              className="text-2xl text-[#151007] font-normal uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Recent Customer Orders
            </h2>
            <p className="text-xs font-sans text-[#3A2E21]/70 mt-0.5">
              Real-time feed of placed orders from storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-sans font-medium uppercase tracking-wider text-[#907553] hover:text-[#151007] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-sans text-[#3A2E21]/60">
            Loading recent orders from Supabase...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag size={28} className="mx-auto text-[#907553]" />
            <p className="text-sm font-sans font-medium text-[#151007]">No Orders Yet</p>
            <p className="text-xs font-sans text-[#3A2E21]/70">
              As soon as a client or guest places an order, it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F7F1E8] border-b border-[#D8C9B6] text-[10px] uppercase tracking-wider text-[#3A2E21]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C9B6]/40">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F2EAE0]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#151007]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#151007]">{order.customerName}</p>
                      <p className="text-[11px] text-[#3A2E21]/70">{order.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4">{order.city}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{order.items.length}</span> item(s)
                    </td>
                    <td className="py-3 px-4 font-medium text-[#151007]">
                      {formatPrice(order.grandTotal)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold border ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] font-sans py-1 px-2 focus:outline-none focus:border-[#907553]"
                      >
                        <option value="PENDING">Mark Pending</option>
                        <option value="CONFIRMED">Mark Confirmed</option>
                        <option value="PROCESSING">Mark Processing</option>
                        <option value="DISPATCHED">Mark Dispatched</option>
                        <option value="DELIVERED">Mark Delivered</option>
                        <option value="CANCELLED">Mark Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
