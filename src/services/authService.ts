import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface ProfileData {
  id?: string;
  email: string;
  fullName: string;
  phone?: string;
}

export interface MeasurementData {
  userId: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shirtLength?: string;
  notes?: string;
}

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
          email: profile.email,
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
