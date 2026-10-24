import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { hashPassword, verifyPassword, generateOTP } from "@/lib/auth/crypto";

export interface ProfileData {
  id?: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: "CUSTOMER" | "ADMIN";
  avatarUrl?: string;
  password?: string;
}

export interface MeasurementData {
  userId: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shirtLength?: string;
  notes?: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: "CUSTOMER" | "ADMIN";
    avatarUrl?: string;
    measurements?: {
      bust?: string;
      waist?: string;
      hip?: string;
      shirtLength?: string;
    };
  };
  error?: string;
  isLocked?: boolean;
  lockoutRemainingMinutes?: number;
  attemptsRemaining?: number;
}

// -----------------------------------------------------------------------------
// 1. AUTHENTICATE USER (With 3 Failed Attempts -> 1 Hour Lockout)
// -----------------------------------------------------------------------------
export const authenticateUser = async (
  email: string,
  passwordInput: string
): Promise<AuthResult> => {
  const cleanEmail = email.trim().toLowerCase();

  // 1. If Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data: user, error } = await (supabase as any)
          .from("profiles")
          .select("*, user_measurements(*)")
          .eq("email", cleanEmail)
          .single();

        if (error || !user) {
          return {
            success: false,
            error: "No account found with this email. Please check your spelling or create an account.",
          };
        }

        const now = Date.now();

        // 2. Check if account is currently locked
        if (user.locked_until) {
          const lockTime = new Date(user.locked_until).getTime();
          if (now < lockTime) {
            const minutesLeft = Math.ceil((lockTime - now) / (60 * 1000));
            return {
              success: false,
              isLocked: true,
              lockoutRemainingMinutes: minutesLeft,
              error: `Account is locked due to 3 failed attempts. Please try again in ${minutesLeft} minute(s) or reset your password using Forgot Password.`,
            };
          } else {
            // Lockout period has elapsed, reset
            await (supabase as any)
              .from("profiles")
              .update({ locked_until: null, failed_attempts: 0 })
              .eq("id", user.id);
            user.failed_attempts = 0;
            user.locked_until = null;
          }
        }

        // 3. Verify password
        const currentFailed = Number(user.failed_attempts || 0);
        let passwordMatches = false;

        if (user.password_hash) {
          passwordMatches = await verifyPassword(passwordInput, user.password_hash);
        } else {
          // If user was created before password_hash was set, accept password and set it
          const newHash = await hashPassword(passwordInput);
          await (supabase as any)
            .from("profiles")
            .update({ password_hash: newHash })
            .eq("id", user.id);
          passwordMatches = true;
        }

        // 4. Handle Incorrect Password
        if (!passwordMatches) {
          const newFailed = currentFailed + 1;

          if (newFailed >= 3) {
            // Lock out account for 1 hour (60 minutes)
            const lockedUntilDate = new Date(now + 60 * 60 * 1000).toISOString();
            await (supabase as any)
              .from("profiles")
              .update({
                failed_attempts: newFailed,
                locked_until: lockedUntilDate,
              })
              .eq("id", user.id);

            return {
              success: false,
              isLocked: true,
              lockoutRemainingMinutes: 60,
              error:
                "Incorrect password. Maximum 3 failed attempts reached! Your account has been locked for 1 hour. You can use 'Forgot Password' to reset it immediately.",
            };
          } else {
            // Record failed attempt
            await (supabase as any)
              .from("profiles")
              .update({ failed_attempts: newFailed })
              .eq("id", user.id);

            const remaining = 3 - newFailed;
            return {
              success: false,
              attemptsRemaining: remaining,
              error: `Incorrect password. Attempt ${newFailed} of 3. You have ${remaining} attempt(s) remaining before a 1-hour account lockout.`,
            };
          }
        }

        // 5. Password is Correct! Reset failed counters
        if (currentFailed > 0 || user.locked_until) {
          await (supabase as any)
            .from("profiles")
            .update({ failed_attempts: 0, locked_until: null })
            .eq("id", user.id);
        }

        const m = user.user_measurements?.[0];

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.full_name,
            phone: user.phone,
            role: user.role || "CUSTOMER",
            avatarUrl: user.avatar_url || undefined,
            measurements: m
              ? {
                  bust: m.bust,
                  waist: m.waist,
                  hip: m.hip,
                  shirtLength: m.shirt_length,
                }
              : undefined,
          },
        };
      } catch (err: any) {
        console.error("Supabase authentication error:", err);
      }
    }
  }

  // Local Storage Fallback for offline development
  try {
    const localUsers = JSON.parse(localStorage.getItem("aouj_local_profiles") || "{}");
    const localUser = localUsers[cleanEmail];

    if (!localUser) {
      return {
        success: false,
        error: "No account found with this email.",
      };
    }

    const now = Date.now();
    if (localUser.lockedUntil && now < localUser.lockedUntil) {
      const minutesLeft = Math.ceil((localUser.lockedUntil - now) / (60 * 1000));
      return {
        success: false,
        isLocked: true,
        lockoutRemainingMinutes: minutesLeft,
        error: `Account is locked due to 3 failed attempts. Please try again in ${minutesLeft} minute(s).`,
      };
    }

    const valid = await verifyPassword(passwordInput, localUser.passwordHash);
    if (!valid) {
      const attempts = (localUser.failedAttempts || 0) + 1;
      localUser.failedAttempts = attempts;
      if (attempts >= 3) {
        localUser.lockedUntil = now + 60 * 60 * 1000;
        localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));
        return {
          success: false,
          isLocked: true,
          lockoutRemainingMinutes: 60,
          error: "Maximum 3 attempts reached. Account locked for 1 hour.",
        };
      }
      localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));
      return {
        success: false,
        attemptsRemaining: 3 - attempts,
        error: `Incorrect password. ${3 - attempts} attempt(s) remaining.`,
      };
    }

    localUser.failedAttempts = 0;
    localUser.lockedUntil = null;
    localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));

    return {
      success: true,
      user: {
        id: localUser.id || "local-user",
        email: localUser.email,
        name: localUser.fullName,
        phone: localUser.phone,
        role: localUser.role || "CUSTOMER",
        avatarUrl: localUser.avatarUrl,
      },
    };
  } catch {
    return { success: false, error: "Authentication system error" };
  }
};

// -----------------------------------------------------------------------------
// 2. REGISTER USER (With Password Hash)
// -----------------------------------------------------------------------------
export const registerUser = async (
  name: string,
  email: string,
  passwordPlain: string,
  phone?: string
): Promise<AuthResult> => {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashPassword(passwordPlain);

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data: existing } = await (supabase as any)
          .from("profiles")
          .select("id")
          .eq("email", cleanEmail)
          .single();

        if (existing) {
          return {
            success: false,
            error: "An account with this email address already exists. Please sign in instead.",
          };
        }

        const { data: newUser, error } = await (supabase as any)
          .from("profiles")
          .insert({
            email: cleanEmail,
            full_name: name.trim(),
            phone: phone?.trim() || null,
            password_hash: hashedPassword,
            role: "CUSTOMER",
            failed_attempts: 0,
          })
          .select()
          .single();

        if (error) {
          console.error("Registration database error:", error);
          return { success: false, error: error.message };
        }

        return {
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.full_name,
            phone: newUser.phone,
            role: newUser.role || "CUSTOMER",
          },
        };
      } catch (e: any) {
        console.error("Supabase registration error:", e);
      }
    }
  }

  // Local Storage fallback
  try {
    const localUsers = JSON.parse(localStorage.getItem("aouj_local_profiles") || "{}");
    localUsers[cleanEmail] = {
      id: "usr-" + Date.now(),
      email: cleanEmail,
      fullName: name.trim(),
      phone: phone?.trim(),
      passwordHash: hashedPassword,
      role: "CUSTOMER",
      failedAttempts: 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));

    return {
      success: true,
      user: {
        id: localUsers[cleanEmail].id,
        email: cleanEmail,
        name: name.trim(),
        phone,
        role: "CUSTOMER",
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// -----------------------------------------------------------------------------
// 3. FORGOT PASSWORD & EMAIL OTP WORKFLOW
// -----------------------------------------------------------------------------
export const requestPasswordResetOTP = async (
  email: string
): Promise<{ success: boolean; otp?: string; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data: user } = await (supabase as any)
          .from("profiles")
          .select("id")
          .eq("email", cleanEmail)
          .single();

        if (!user) {
          return {
            success: false,
            error: "No account found with this email address.",
          };
        }

        // Store OTP in profiles table
        await (supabase as any)
          .from("profiles")
          .update({
            reset_otp: otpCode,
            reset_otp_expires_at: expiresAt,
          })
          .eq("id", user.id);

        // Also record in password_resets history if available
        try {
          await (supabase as any).from("password_resets").insert({
            email: cleanEmail,
            otp_code: otpCode,
            expires_at: expiresAt,
          });
        } catch {}

        // Dispatch real email via API
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: cleanEmail,
              type: "OTP",
              data: { otp: otpCode },
            }),
          });
        } catch (mailErr) {
          console.warn("Email service trigger notice:", mailErr);
        }

        return { success: true, otp: otpCode };
      } catch (e: any) {
        console.error("Supabase OTP request error:", e);
      }
    }
  }

  // Local Storage fallback
  try {
    const localOTPs = JSON.parse(localStorage.getItem("aouj_local_otps") || "{}");
    localOTPs[cleanEmail] = {
      otp: otpCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    localStorage.setItem("aouj_local_otps", JSON.stringify(localOTPs));

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cleanEmail,
          type: "OTP",
          data: { otp: otpCode },
        }),
      });
    } catch {}

    return { success: true, otp: otpCode };
  } catch {
    return { success: false, error: "Unable to generate OTP." };
  }
};

export const verifyOTPAndResetPassword = async (
  email: string,
  otpEntered: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otpEntered.trim();

  if (newPasswordPlain.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const newHash = await hashPassword(newPasswordPlain);

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data: user, error } = await (supabase as any)
          .from("profiles")
          .select("id, reset_otp, reset_otp_expires_at")
          .eq("email", cleanEmail)
          .single();

        if (error || !user) {
          return { success: false, error: "Account not found." };
        }

        if (!user.reset_otp || user.reset_otp.trim() !== cleanOtp) {
          return { success: false, error: "Invalid OTP code entered. Please check and try again." };
        }

        if (
          user.reset_otp_expires_at &&
          new Date(user.reset_otp_expires_at).getTime() < Date.now()
        ) {
          return { success: false, error: "This OTP has expired. Please request a new one." };
        }

        // Reset password, clear OTP, reset lockout
        await (supabase as any)
          .from("profiles")
          .update({
            password_hash: newHash,
            reset_otp: null,
            reset_otp_expires_at: null,
            failed_attempts: 0,
            locked_until: null,
          })
          .eq("id", user.id);

        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  }

  // Local storage fallback
  try {
    const localOTPs = JSON.parse(localStorage.getItem("aouj_local_otps") || "{}");
    const stored = localOTPs[cleanEmail];
    if (!stored || stored.otp !== cleanOtp || Date.now() > stored.expiresAt) {
      return { success: false, error: "Invalid or expired OTP code." };
    }

    const localUsers = JSON.parse(localStorage.getItem("aouj_local_profiles") || "{}");
    if (localUsers[cleanEmail]) {
      localUsers[cleanEmail].passwordHash = newHash;
      localUsers[cleanEmail].failedAttempts = 0;
      localUsers[cleanEmail].lockedUntil = null;
      localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));
    }

    delete localOTPs[cleanEmail];
    localStorage.setItem("aouj_local_otps", JSON.stringify(localOTPs));
    return { success: true };
  } catch {
    return { success: false, error: "Password reset failed." };
  }
};

// -----------------------------------------------------------------------------
// 4. PROFILE PICTURE / AVATAR UPLOAD & STORAGE
// -----------------------------------------------------------------------------
export const updateProfileAvatar = async (
  email: string,
  avatarDataUrl: string
): Promise<{ success: boolean; error?: string }> => {
  return updateUserProfile(email, { avatarUrl: avatarDataUrl });
};

// -----------------------------------------------------------------------------
// 4b. UPDATE USER PROFILE (Name, Phone, Avatar)
// -----------------------------------------------------------------------------
export const updateUserProfile = async (
  email: string,
  updates: { fullName?: string; phone?: string; avatarUrl?: string }
): Promise<{ success: boolean; error?: string; profile?: any }> => {
  const cleanEmail = email.trim().toLowerCase();

  const dbPayload: any = {};
  if (updates.fullName !== undefined) dbPayload.full_name = updates.fullName.trim();
  if (updates.phone !== undefined) dbPayload.phone = updates.phone.trim();
  if (updates.avatarUrl !== undefined) dbPayload.avatar_url = updates.avatarUrl;

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data, error } = await (supabase as any)
          .from("profiles")
          .update(dbPayload)
          .eq("email", cleanEmail)
          .select()
          .single();

        if (error) {
          console.error("Profile update error:", error);
          return { success: false, error: error.message };
        }

        return { success: true, profile: data };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  }

  // Local storage fallback
  try {
    const localUsers = JSON.parse(localStorage.getItem("aouj_local_profiles") || "{}");
    if (localUsers[cleanEmail]) {
      if (updates.fullName !== undefined) localUsers[cleanEmail].fullName = updates.fullName.trim();
      if (updates.phone !== undefined) localUsers[cleanEmail].phone = updates.phone.trim();
      if (updates.avatarUrl !== undefined) localUsers[cleanEmail].avatarUrl = updates.avatarUrl;
      localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
};

// -----------------------------------------------------------------------------
// 4c. CHANGE PASSWORD (With Current Password Verification & Admin Override)
// -----------------------------------------------------------------------------
export const changeUserPassword = async (
  email: string,
  currentPasswordPlain: string,
  newPasswordPlain: string,
  isAdminOverride: boolean = false
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!newPasswordPlain || newPasswordPlain.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data: user, error } = await (supabase as any)
          .from("profiles")
          .select("id, password_hash, role")
          .eq("email", cleanEmail)
          .single();

        if (error || !user) {
          return { success: false, error: "User account not found." };
        }

        // If NOT admin override AND current password was provided, verify it
        if (!isAdminOverride && user.password_hash && currentPasswordPlain) {
          const isMatch = await verifyPassword(currentPasswordPlain, user.password_hash);
          if (!isMatch) {
            return { success: false, error: "Current password is incorrect. Please try again." };
          }
        }

        const newHash = await hashPassword(newPasswordPlain);
        const updatePayload: any = {
          password_hash: newHash,
          failed_attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await (supabase as any)
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id);

        if (updateError) {
          console.error("Supabase password update error:", updateError);
          return { success: false, error: updateError.message };
        }

        // Also attempt to update plaintext 'password' column if it exists in the schema
        try {
          await (supabase as any)
            .from("profiles")
            .update({ password: newPasswordPlain })
            .eq("id", user.id);
        } catch {
          // If password column does not exist, ignore
        }

        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  }

  // Local storage fallback
  try {
    const localUsers = JSON.parse(localStorage.getItem("aouj_local_profiles") || "{}");
    const u = localUsers[cleanEmail];
    if (u) {
      if (!isAdminOverride && u.passwordHash && currentPasswordPlain) {
        const isMatch = await verifyPassword(currentPasswordPlain, u.passwordHash);
        if (!isMatch) {
          return { success: false, error: "Current password is incorrect." };
        }
      }
      u.passwordHash = await hashPassword(newPasswordPlain);
      u.password = newPasswordPlain;
      u.failedAttempts = 0;
      u.lockedUntil = null;
      localStorage.setItem("aouj_local_profiles", JSON.stringify(localUsers));
      return { success: true };
    }
    return { success: false, error: "User not found" };
  } catch {
    return { success: false, error: "Password update failed" };
  }
};

// -----------------------------------------------------------------------------
// 5. MEASUREMENTS SYNC
// -----------------------------------------------------------------------------
export const syncMeasurementsToSupabase = async (measurements: MeasurementData) => {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await (supabase as any).from("user_measurements").insert({
      user_id: measurements.userId,
      bust: measurements.bust || null,
      waist: measurements.waist || null,
      hip: measurements.hip || null,
      shirt_length: measurements.shirtLength || null,
      notes: measurements.notes || null,
    });

    if (error) console.warn("Measurements sync error:", error.message);
    return data;
  } catch (e) {
    console.warn("Supabase measurements error:", e);
    return null;
  }
};

export const syncProfileToSupabase = async (
  profile: ProfileData
): Promise<{ id: string; email: string } | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .upsert(
        {
          email: profile.email.toLowerCase(),
          full_name: profile.fullName,
          phone: profile.phone || null,
        },
        { onConflict: "email" }
      )
      .select("id, email")
      .single();

    if (error) {
      console.warn("Could not sync profile to Supabase:", error.message);
      return null;
    }
    return data as { id: string; email: string };
  } catch (e) {
    console.warn("Supabase profile sync error:", e);
    return null;
  }
};
