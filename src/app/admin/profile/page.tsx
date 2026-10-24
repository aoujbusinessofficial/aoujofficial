"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
  Database,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminProfilePage() {
  const { admin, updateAdminProfile, changeAdminPassword } = useAdminAuth();

  // Profile Details Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  // Avatar Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName || "");
      setPhone(admin.phone || "");
    }
  }, [admin]);

  // Handle Avatar Upload
  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setProfileMessage({
        text: "Please select a valid image file (JPG, PNG, WebP).",
        isError: true,
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({
        text: "Image file size must be under 2MB.",
        isError: true,
      });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await updateAdminProfile({ avatarUrl: dataUrl });
        setIsUploadingAvatar(false);
        if (res.success) {
          setProfileMessage({
            text: "Administrator avatar updated successfully in database!",
          });
          setTimeout(() => setProfileMessage(null), 3500);
        } else {
          setProfileMessage({
            text: res.error || "Failed to update administrator avatar.",
            isError: true,
          });
        }
      } catch {
        setIsUploadingAvatar(false);
        setProfileMessage({
          text: "Failed to process image file.",
          isError: true,
        });
      }
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      setProfileMessage({ text: "Failed to read image file.", isError: true });
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Details Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!fullName.trim()) {
      setProfileMessage({ text: "Full name cannot be empty.", isError: true });
      return;
    }

    setIsSavingProfile(true);
    const res = await updateAdminProfile({
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
    });
    setIsSavingProfile(false);

    if (res.success) {
      setProfileMessage({
        text: "Administrator profile details updated successfully!",
      });
      setTimeout(() => setProfileMessage(null), 3500);
    } else {
      setProfileMessage({
        text: res.error || "Failed to update profile.",
        isError: true,
      });
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({
        text: "New password must be at least 6 characters long.",
        isError: true,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        text: "New password and confirmation do not match.",
        isError: true,
      });
      return;
    }

    setIsChangingPass(true);
    const res = await changeAdminPassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setPasswordMessage({
        text: "Administrator password updated and re-hashed securely!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(null), 4000);
    } else {
      setPasswordMessage({
        text: res.error || "Password change failed. Check your current password.",
        isError: true,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-sans text-[#AF997E] hover:text-[#FAF7F2] transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1
            className="text-2xl sm:text-3xl text-[#FAF7F2] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Administrator Profile & Credentials
          </h1>
          <p className="text-xs font-sans text-[#AF997E] mt-1">
            Manage your personal administrative information, avatar, and master security passcodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#1A140A] border border-[#907553]/40 text-[#907553] text-[10px] font-sans uppercase tracking-[0.2em] flex items-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Role: ADMIN</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Information & Avatar */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1A140A] border border-[#3A2E21] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#3A2E21]">
              <User size={18} className="text-[#907553]" />
              <h2 className="text-sm font-sans font-medium uppercase tracking-[0.18em] text-[#FAF7F2]">
                Profile Information
              </h2>
            </div>

            {/* Avatar Uploader Section */}
            <div className="p-4 bg-[#151007] border border-[#3A2E21] flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group shrink-0">
                {admin?.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt={admin.fullName || "Admin"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#907553] shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#151007] text-[#FAF7F2] font-serif text-3xl flex items-center justify-center border-2 border-[#907553]">
                    {admin?.fullName?.charAt(0) || "A"}
                  </div>
                )}
                <label
                  htmlFor="admin-avatar-file"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#907553] text-[#FAF7F2] flex items-center justify-center cursor-pointer hover:bg-[#af997e] transition-colors border-2 border-[#151007] shadow"
                  title="Upload New Administrator Picture"
                >
                  {isUploadingAvatar ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Camera size={13} />
                  )}
                  <input
                    id="admin-avatar-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatarFile(f);
                    }}
                  />
                </label>
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <p className="text-xs font-sans font-medium uppercase tracking-wider text-[#FAF7F2]">
                  Administrator Portrait / Avatar
                </p>
                <p className="text-[11px] font-sans text-[#AF997E] leading-relaxed">
                  Click the camera icon to upload a personal photo. Stored securely in your Supabase database profile.
                </p>
                <label
                  htmlFor="admin-avatar-file-alt"
                  className="inline-block mt-2 text-[11px] font-sans uppercase tracking-[0.15em] text-[#907553] hover:text-[#FAF7F2] underline cursor-pointer"
                >
                  Choose image file (JPG, PNG, WebP &lt; 2MB)
                  <input
                    id="admin-avatar-file-alt"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatarFile(f);
                    }}
                  />
                </label>
              </div>
            </div>

            {profileMessage && (
              <div
                className={`p-3 text-xs font-sans flex items-start gap-2 border ${
                  profileMessage.isError
                    ? "bg-red-950/40 border-red-800 text-red-200"
                    : "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                }`}
              >
                {profileMessage.isError ? (
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                ) : (
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3 text-[#AF997E]/60" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Bilal Fazal"
                    className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-3 text-xs font-sans text-[#FAF7F2] focus:outline-none focus:border-[#907553] transition-colors"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                    Administrator Email (Account ID)
                  </label>
                  <span className="text-[10px] text-[#907553] font-sans">Primary Supabase Identity</span>
                </div>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3 text-[#AF997E]/40" />
                  <input
                    type="email"
                    value={admin?.email || ""}
                    disabled
                    className="w-full bg-[#151007]/50 border border-[#3A2E21]/60 py-2.5 pl-9 pr-3 text-xs font-sans text-[#AF997E]/80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                  Mobile / WhatsApp (Optional)
                </label>
                <div className="relative flex items-center">
                  <Phone size={15} className="absolute left-3 text-[#AF997E]/60" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-3 text-xs font-sans text-[#FAF7F2] focus:outline-none focus:border-[#907553] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="champagne"
                  size="md"
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto"
                >
                  {isSavingProfile ? "SAVING CHANGES..." : "SAVE PROFILE CHANGES"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Password Change & Security Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change Password Card */}
          <div className="bg-[#1A140A] border border-[#3A2E21] p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#3A2E21]">
              <KeyRound size={18} className="text-[#907553]" />
              <h2 className="text-sm font-sans font-medium uppercase tracking-[0.18em] text-[#FAF7F2]">
                Update Password
              </h2>
            </div>

            {passwordMessage && (
              <div
                className={`p-3 text-xs font-sans flex items-start gap-2 border ${
                  passwordMessage.isError
                    ? "bg-red-950/40 border-red-800 text-red-200"
                    : "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                }`}
              >
                {passwordMessage.isError ? (
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                ) : (
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                    Current Password
                  </label>
                  <span className="text-[10px] text-[#907553] font-sans">Optional for Master Admin</span>
                </div>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-[#AF997E]/60" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (if known)"
                    className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-10 text-xs font-sans text-[#FAF7F2] focus:outline-none focus:border-[#907553] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 text-[#AF997E]/60 hover:text-[#FAF7F2] cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                  New Password *
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-[#AF997E]/60" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-10 text-xs font-sans text-[#FAF7F2] focus:outline-none focus:border-[#907553] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 text-[#AF997E]/60 hover:text-[#FAF7F2] cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
                  Confirm New Password *
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-[#AF997E]/60" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-3 text-xs font-sans text-[#FAF7F2] focus:outline-none focus:border-[#907553] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="champagne"
                  size="md"
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full"
                >
                  {isChangingPass ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Protocols Notice */}
          <div className="bg-[#1A140A] border border-[#3A2E21] p-6 space-y-4 text-xs font-sans text-[#AF997E]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#3A2E21]">
              <Database size={16} className="text-[#907553]" />
              <p className="font-medium text-[#FAF7F2] uppercase tracking-wider text-[11px]">
                Atelier Security Guard
              </p>
            </div>

            <ul className="space-y-2 text-[11px] leading-relaxed">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>SHA-256 Web Crypto password encryption active</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Rate-limiting: 3 attempts lockout (1 hour) enforced</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Role verified in Supabase &apos;profiles&apos; table</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
