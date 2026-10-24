/**
 * Service to dispatch transactional emails (OTP codes, order receipts)
 */
export async function dispatchEmail(payload: {
  to: string;
  type: "OTP" | "ORDER_CONFIRMATION" | "CUSTOM";
  subject?: string;
  data: Record<string, any>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    return { success: res.ok, error: json.error };
  } catch (err: any) {
    console.warn("Failed to dispatch email:", err);
    return { success: false, error: err.message };
  }
}
