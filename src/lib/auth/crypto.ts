/**
 * Web Crypto SHA-256 password hashing & OTP generator
 * Compatible across browser and Node.js Next.js environments
 */

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_aouj_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  // If stored hash was created with plain SHA-256 without salt (e.g. from SQL seed)
  const hashedWithSalt = await hashPassword(password);
  if (hashedWithSalt === storedHash) return true;

  // Fallback check for standard unsalted SHA-256 (used in direct SQL seed for admin123)
  const encoder = new TextEncoder();
  const unsaltedBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  const unsaltedHash = Array.from(new Uint8Array(unsaltedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return unsaltedHash === storedHash || password === storedHash;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
