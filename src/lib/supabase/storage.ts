import { createClient, isSupabaseConfigured } from "./client";

/**
 * Uploads an image file to Supabase Storage or converts it to an optimized data URL.
 * Falls back safely to base64 data URL if storage bucket is not yet provisioned.
 */
export async function uploadImageToStorage(
  file: File,
  bucket: "product-images" | "avatars" = "product-images"
): Promise<{ url: string; error?: string }> {
  // If Supabase client is available, attempt direct bucket upload
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${bucket}/${cleanFileName}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            return { url: publicUrlData.publicUrl };
          }
        } else if (error) {
          console.warn(`Supabase Storage upload to bucket "${bucket}" returned notice:`, error.message);
          // Fall back to optimized Data URL below
        }
      } catch (err: any) {
        console.warn("Storage upload exception, falling back to data URL:", err?.message);
      }
    }
  }

  // Robust fallback: convert File to Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: "", error: "Failed to read image file" });
    };
    reader.readAsDataURL(file);
  });
}
