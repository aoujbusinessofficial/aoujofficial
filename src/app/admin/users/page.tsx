"use client";

import React, { useState, useEffect } from "react";
import { fetchAllUsers, updateUserRole, AdminUser } from "@/services/adminService";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  Ruler,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleMessage, setRoleMessage] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await fetchAllUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "CUSTOMER" | "ADMIN") => {
    const ok = await updateUserRole(userId, newRole);
    if (ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setRoleMessage(`User role successfully changed to ${newRole}!`);
      setTimeout(() => setRoleMessage(""), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C9B6] pb-5">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553] font-semibold mb-1">
            CLIENT DIRECTORY &amp; PRIVILEGES
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Registered Clients &amp; Admins
          </h1>
        </div>

        <div className="text-xs font-sans text-[#3A2E21]/80">
          Total Registered: <strong className="text-[#151007]">{users.length}</strong>
        </div>
      </div>

      {/* Role Management Info Notice */}
      <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6] text-xs font-sans text-[#3A2E21] flex items-start gap-3">
        <Info size={18} className="text-[#907553] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#151007]">Admin Access Management:</p>
          <p className="text-[11px] leading-relaxed text-[#3A2E21]/80">
            By default, all clients who register on the storefront receive the <span className="font-mono font-semibold">CUSTOMER</span> role. You can promote any trusted account to <span className="font-mono font-semibold text-[#907553]">ADMIN</span> below or directly inside your Supabase <span className="font-mono">profiles</span> table. Only accounts with the ADMIN role can access this atelier portal.
          </p>
        </div>
      </div>

      {roleMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{roleMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-4 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-3 text-[#3A2E21]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, email, phone..."
            className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 pl-9 pr-3 text-xs font-sans text-[#151007] focus:outline-none focus:border-[#907553]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FAF7F2] border border-[#D8C9B6] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs font-sans text-[#3A2E21]/70">
            Loading clients from Supabase...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users size={32} className="mx-auto text-[#907553]" strokeWidth={1.5} />
            <p className="text-sm font-sans font-medium text-[#151007]">No Clients Found</p>
            <p className="text-xs font-sans text-[#3A2E21]/70">
              When customers sign up on the storefront, their accounts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F7F1E8] border-b border-[#D8C9B6] text-[10px] uppercase tracking-wider text-[#3A2E21]">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Bespoke Measurements</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4 text-right">Role Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C9B6]/40">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F2EAE0]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#151007] text-[#FAF7F2] flex items-center justify-center font-serif text-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#151007]">{user.fullName}</p>
                          <p className="text-[10px] text-[#3A2E21]/60 font-mono">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-[#151007]">{user.email}</p>
                      <p className="text-[11px] text-[#3A2E21]/70">{user.phone || "No phone provided"}</p>
                    </td>

                    <td className="py-3 px-4">
                      {user.measurements ? (
                        <div className="text-[11px] text-[#3A2E21] space-x-2">
                          <span className="font-medium text-[#907553]">
                            B: {user.measurements.bust || "-"}&quot;
                          </span>
                          <span>W: {user.measurements.waist || "-"}&quot;</span>
                          <span>H: {user.measurements.hip || "-"}&quot;</span>
                          <span>L: {user.measurements.shirtLength || "-"}&quot;</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#3A2E21]/50 italic">None saved</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#3A2E21]/80">
                      {new Date(user.createdAt).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-semibold border ${
                          user.role === "ADMIN"
                            ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                            : "bg-[#F7F1E8] text-[#3A2E21] border-[#D8C9B6]"
                        }`}
                      >
                        {user.role === "ADMIN" && <ShieldCheck size={11} className="text-[#907553]" />}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as "CUSTOMER" | "ADMIN")
                        }
                        className="bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] font-sans py-1 px-2 focus:outline-none focus:border-[#907553]"
                      >
                        <option value="CUSTOMER">Role: CUSTOMER</option>
                        <option value="ADMIN">Role: ADMIN</option>
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
