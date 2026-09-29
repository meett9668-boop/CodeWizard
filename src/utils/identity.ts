/**
 * Centralized Identity & String Normalization Helpers.
 */

export function normalizeEmail(email?: string | null): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

export function normalizeStudentId(id?: string | null): string {
  if (!id) return '';
  return id.trim().toUpperCase().replace(/\s+/g, '');
}

export function isSameEmail(emailA?: string | null, emailB?: string | null): boolean {
  return normalizeEmail(emailA) === normalizeEmail(emailB);
}