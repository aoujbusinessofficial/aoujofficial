"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Package,
  Ruler,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Camera,
  UploadCloud,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Edit3,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    logout,
    updateMeasurements,
    updateAvatar,
    updateProfile,
    changePassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "measurements" | "orders">("profile");

  // Profile Picture Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleAvatarUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarMessage({ text: "Please select an image file (JPG, PNG, WebP).", isError: true });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarMessage({ text: "Image size must be under 2MB.", isError: true });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const ok = await updateAvatar(dataUrl);
        setIsUploadingAvatar(false);
        if (ok) {
          setAvatarMessage({ text: "Profile picture saved securely to database!" });
          setTimeout(() => setAvatarMessage(null), 3500);
        } else {
          setAvatarMessage({ text: "Unable to save profile picture.", isError: true });
        }
      } catch {
        setIsUploadingAvatar(false);
        setAvatarMessage({ text: "Error saving picture.", isError: true });
      }
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      setAvatarMessage({ text: "Failed to read image file.", isError: true });
    };
    reader.readAsDataURL(file);
  };

  // Personal Profile Editing State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);

    if (!profileName.trim()) {
      setProfileFeedback({ text: "Full name cannot be empty.", isError: true });
      return;
    }

    setIsSavingProfile(true);
    const res = await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim() || undefined,
    });
    setIsSavingProfile(false);

    if (res.success) {
      setProfileFeedback({ text: "Your profile details have been updated successfully!" });
      setTimeout(() => setProfileFeedback(null), 3500);
    } else {
      setProfileFeedback({ text: res.error || "Unable to update profile.", isError: true });
    }
  };

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!currentPassword) {
      setPassFeedback({ text: "Please enter your current password.", isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPassFeedback({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassFeedback({ text: "New passwords do not match.", isError: true });
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setPassFeedback({ text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassFeedback(null), 4000);
    } else {
      setPassFeedback({
        text: res.error || "Failed to change password. Please check your current password.",
        isError: true,
      });
    }
  };

  // Custom Measurements state
  const [bust, setBust] = useState(user?.measurements?.bust || "");
  const [waist, setWaist] = useState(user?.measurements?.waist || "");
  const [hip, setHip] = useState(user?.measurements?.hip || "");
  const [shirtLength, setShirtLength] = useState(user?.measurements?.shirtLength || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    updateMeasurements({
      bust,
      waist,
      hip,
      shirtLength,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 w-full py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-8">
            <Link href="/" className="hover:text-[#907553] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#907553]" />
            <span className="text-[#151007] font-medium tracking-wide">
              {isAuthenticated ? "My Account" : "Client Access"}
            </span>
          </div>

          {!isAuthenticated ? (
            /* Not logged in State: Option to Login, Signup, or Continue as Guest */
            <div className="max-w-xl mx-auto bg-[#FAF7F2] border border-[#D8C9B6] p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#F7F1E8] border border-[#D8C9B6] mx-auto flex items-center justify-center text-[#907553]">
                <User size={28} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] font-sans text-[#907553] font-medium mb-1.5">
                  AOUJ CLIENT PORTAL
                </p>
                <h1
                  className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Account Access
                </h1>
                <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 max-w-md mx-auto mt-2 leading-relaxed">
                  Sign in or create an account to view your saved bespoke measurements, or feel free to continue shopping as a guest anytime.
                </p>
              </div>

              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60 text-xs font-sans text-[#3A2E21]/90 flex items-center justify-center gap-2">
                <Sparkles size={15} className="text-[#907553] shrink-0" />
                <span>Account creation is 100% optional. Guest checkout is always available.</span>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="primary" size="md" href="/login" className="w-full">
                  SIGN IN TO ACCOUNT
                </Button>
                <Button variant="secondary" size="md" href="/signup" className="w-full">
                  CREATE NEW ACCOUNT (OPTIONAL)
                </Button>
                <Button variant="outline" size="md" href="/products" className="w-full">
                  CONTINUE BROWSING AS GUEST
                </Button>
              </div>
            </div>
          ) : (
            /* Authenticated Account Dashboard */
            <div className="space-y-8">
              {/* Header Card */}
              <div className="bg-[#F7F1E8] border border-[#D8C9B6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || "User Avatar"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#907553] shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#151007] text-[#FAF7F2] font-serif text-2xl flex items-center justify-center border-2 border-[#907553]">
                        {user?.name?.charAt(0) || "A"}
                      </div>
                    )}
                    <label
                      htmlFor="header-avatar-upload"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#907553] text-[#FAF7F2] flex items-center justify-center cursor-pointer hover:bg-[#151007] transition-colors border border-[#FAF7F2] shadow"
                      title="Upload Profile Picture"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Camera size={12} />
                      )}
                      <input
                        id="header-avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1
                        className="text-2xl sm:text-3xl text-[#151007] font-normal"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        Salam, {user?.name}
                      </h1>
                      <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 bg-[#FAF7F2] border border-[#D8C9B6] text-[#907553]">
                        {user?.role === "ADMIN" ? "Master Admin" : "Client Member"}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[#3A2E21]/70 mt-0.5">{user?.email}</p>
                    {avatarMessage && (
                      <p
                        className={`text-[11px] font-sans mt-1 ${
                          avatarMessage.isError ? "text-red-700" : "text-emerald-700 font-medium"
                        }`}
                      >
                        {avatarMessage.text}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {user?.role === "ADMIN" && (
                    <Button variant="champagne" size="sm" href="/admin">
                      ADMIN ATELIER
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-xs font-sans text-[#907553] hover:text-[#151007] border border-[#D8C9B6] bg-[#FAF7F2] px-4 py-2 hover:border-[#907553] transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>SIGN OUT</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#D8C9B6] gap-4 sm:gap-8 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "profile"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <User size={15} />
                  <span>Profile Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("measurements")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "measurements"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <Ruler size={15} />
                  <span>Saved Measurements</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <Package size={15} />
                  <span>Recent Orders</span>
                </button>
              </div>

              {/* Tab 1: Profile Details */}
              {activeTab === "profile" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 max-w-2xl space-y-6">
                  <h2
                    className="text-2xl text-[#151007] font-normal uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Personal Information
                  </h2>

                  {/* Profile Picture Card */}
                  <div className="p-5 bg-[#F7F1E8] border border-[#D8C9B6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name || "Profile Picture"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#907553]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#151007] text-[#FAF7F2] font-serif text-xl flex items-center justify-center border-2 border-[#907553]">
                          {user?.name?.charAt(0) || "A"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-sans font-medium uppercase tracking-wider text-[#151007]">
                          Profile Picture / Avatar
                        </p>
                        <p className="text-[11px] font-sans text-[#3A2E21]/70 mt-0.5">
                          Stored securely in your Supabase database profile.
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="tab-avatar-upload"
                      className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.15em] bg-[#151007] text-[#FAF7F2] hover:bg-[#907553] px-4 py-2.5 transition-colors cursor-pointer shrink-0"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>SAVING...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={14} />
                          <span>UPLOAD NEW PHOTO</span>
                        </>
                      )}
                      <input
                        id="tab-avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Profile Edit Feedback */}
                  {profileFeedback && (
                    <div
                      className={`p-3 text-xs font-sans flex items-start gap-2 border ${
                        profileFeedback.isError
                          ? "bg-red-50 border-red-200 text-red-800"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                      }`}
                    >
                      {profileFeedback.isError ? (
                        <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                      ) : (
                        <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                      )}
                      <span>{profileFeedback.text}</span>
                    </div>
                  )}

                  {/* Personal Information Edit Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="client-fullname"
                          className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                        >
                          Full Name *
                        </label>
                        <div className="relative flex items-center">
                          <User size={15} className="absolute left-3 text-[#3A2E21]/50" />
                          <input
                            id="client-fullname"
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            required
                            placeholder="Your full name"
                            className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email (Read Only Identity) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="client-email"
                            className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                          >
                            Email Address
                          </label>
                          <span className="text-[10px] text-[#907553] font-sans">Primary ID</span>
                        </div>
                        <input
                          id="client-email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full bg-[#F7F1E8] border border-[#D8C9B6]/60 py-2.5 px-3 text-xs font-sans text-[#3A2E21]/60 cursor-not-allowed"
                        />
                      </div>

                      {/* Mobile / WhatsApp */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="client-phone"
                          className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                        >
                          Mobile / WhatsApp (Optional)
                        </label>
                        <input
                          id="client-phone"
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 px-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        />
                      </div>

                      {/* Account Status Display */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]">
                          Account Status
                        </label>
                        <div className="py-2.5 px-3 bg-[#F7F1E8] border border-[#D8C9B6]/60 text-xs font-sans text-emerald-800 font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Active Client Member</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="primary"
                        size="md"
                        type="submit"
                        disabled={isSavingProfile}
                      >
                        {isSavingProfile ? "SAVING CHANGES..." : "SAVE PROFILE CHANGES"}
                      </Button>
                    </div>
                  </form>

                  {/* Password Change Section */}
                  <div className="pt-6 border-t border-[#D8C9B6] space-y-4">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-[#907553]" />
                      <h3
                        className="text-lg text-[#151007] font-normal uppercase"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        Security &amp; Change Password
                      </h3>
                    </div>

                    {passFeedback && (
                      <div
                        className={`p-3 text-xs font-sans flex items-start gap-2 border ${
                          passFeedback.isError
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        }`}
                      >
                        {passFeedback.isError ? (
                          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                        ) : (
                          <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                        )}
                        <span>{passFeedback.text}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Current Password */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="client-cur-pass"
                            className="block text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                          >
                            Current Password *
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="client-cur-pass"
                              type={showCurrentPass ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                              placeholder="Current password"
                              className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 pl-3 pr-8 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPass(!showCurrentPass)}
                              className="absolute right-2.5 text-[#3A2E21]/60 hover:text-[#151007]"
                            >
                              {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="client-new-pass"
                            className="block text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                          >
                            New Password *
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="client-new-pass"
                              type={showNewPass ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              placeholder="At least 6 chars"
                              className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 pl-3 pr-8 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-2.5 text-[#3A2E21]/60 hover:text-[#151007]"
                            >
                              {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="client-confirm-pass"
                            className="block text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                          >
                            Confirm Password *
                          </label>
                          <input
                            id="client-confirm-pass"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Repeat new password"
                            className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 px-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553]"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          type="submit"
                          disabled={isChangingPass}
                        >
                          {isChangingPass ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
                        </Button>
                      </div>
                    </form>
                  </div>

                  <div className="pt-4 border-t border-[#D8C9B6]">
                    <Button variant="outline" size="md" href="/products">
                      START SHOPPING NEW ARRIVALS
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 2: Saved Bespoke Measurements */}
              {activeTab === "measurements" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 max-w-2xl space-y-6">
                  <div>
                    <h2
                      className="text-2xl text-[#151007] font-normal uppercase"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      Bespoke Tailoring Profile
                    </h2>
                    <p className="text-xs font-sans text-[#3A2E21]/80 mt-1">
                      Save your exact measurements here. When choosing the &ldquo;Custom Size&rdquo; option on any outfit, our master tailors will craft the garment to these exact dimensions.
                    </p>
                  </div>

                  {savedSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>Measurements updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveMeasurements} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Bust (Inches)
                        </label>
                        <input
                          type="text"
                          value={bust}
                          onChange={(e) => setBust(e.target.value)}
                          placeholder="e.g. 36"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Waist (Inches)
                        </label>
                        <input
                          type="text"
                          value={waist}
                          onChange={(e) => setWaist(e.target.value)}
                          placeholder="e.g. 29"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Hip (Inches)
                        </label>
                        <input
                          type="text"
                          value={hip}
                          onChange={(e) => setHip(e.target.value)}
                          placeholder="e.g. 39"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Shirt Length (Inches)
                        </label>
                        <input
                          type="text"
                          value={shirtLength}
                          onChange={(e) => setShirtLength(e.target.value)}
                          placeholder="e.g. 42"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="primary" size="md" type="submit">
                        SAVE MEASUREMENTS
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 3: Order History */}
              {activeTab === "orders" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 space-y-6">
                  <h2
                    className="text-2xl text-[#151007] font-normal uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Your Orders
                  </h2>

                  <div className="border border-[#D8C9B6] p-8 text-center bg-[#F7F1E8]/40 space-y-3">
                    <ShoppingBag size={32} className="mx-auto text-[#907553]" strokeWidth={1.5} />
                    <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#151007]">
                      No Orders Placed Yet
                    </p>
                    <p className="text-xs font-sans text-[#3A2E21]/70 max-w-sm mx-auto">
                      Your purchase archive will appear here once you place your first order.
                    </p>
                    <div className="pt-2">
                      <Button variant="primary" size="sm" href="/products" withArrow>
                        EXPLORE THE COLLECTION
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
