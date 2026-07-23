type OTPEntry = {
  code:      string;
  expiresAt: number;
  attempts:  number;
  verified:  boolean;
};

declare global { var __otpStore: Map<string, OTPEntry> | undefined; }

const store: Map<string, OTPEntry> =
  global.__otpStore ?? (global.__otpStore = new Map());

const OTP_TTL_MS   = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS  = 60 * 1000;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function createOTP(key: string): { code: string; cooldown: boolean } {
  const existing = store.get(key);
  if (existing && Date.now() < existing.expiresAt - OTP_TTL_MS + COOLDOWN_MS) {
    return { code: "", cooldown: true };
  }
  const code = generateCode();
  store.set(key, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0, verified: false });
  return { code, cooldown: false };
}

export type VerifyResult =
  | "ok" | "not_found" | "expired" | "wrong" | "max_attempts" | "already_verified";

export function verifyOTP(key: string, input: string): VerifyResult {
  const entry = store.get(key);
  if (!entry)                         return "not_found";
  if (entry.verified)                 return "already_verified";
  if (Date.now() > entry.expiresAt)   { store.delete(key); return "expired"; }
  if (entry.attempts >= MAX_ATTEMPTS) return "max_attempts";
  if (entry.code !== input)           { entry.attempts += 1; return "wrong"; }
  entry.verified = true;
  return "ok";
}

export function isVerified(key: string): boolean {
  return store.get(key)?.verified === true;
}

export function deleteOTP(key: string) { store.delete(key); }