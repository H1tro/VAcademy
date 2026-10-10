export const LEGAL_VERSION = "2026-10-10";
export const LEGAL_CONTACT = "arstan.anarbekov10@gmail.com";
export const AGE_RESTRICTION_KEY = "vacademy-age-restricted";
export type RegistrationAcknowledgement = {
  version: string;
  termsAccepted: true;
  privacyRead: true;
  ageRange: "13-17" | "18+";
  guardianPermission: boolean;
};
export function isRegistrationAcknowledgement(value: unknown): value is RegistrationAcknowledgement {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.version === LEGAL_VERSION && v.termsAccepted === true && v.privacyRead === true
    && (v.ageRange === "13-17" || v.ageRange === "18+")
    && typeof v.guardianPermission === "boolean"
    && (v.ageRange !== "13-17" || v.guardianPermission === true);
}
