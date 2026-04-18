/**
 * Global Safety Protocols for String and Metadata Sanitization.
 */

/**
 * Ensures a valid string message is returned, preventing 'undefined' leak into UI.
 */
export function safeMessage(msg?: string | null): string {
  return msg ?? "Operational anomaly detected. Please retry.";
}

/**
 * Safely converts numbers for UI display with consistent default.
 */
export function safeNumber(val?: number | null, fallback = 0): number {
  return typeof val === 'number' ? val : fallback;
}

/**
 * Sanitizes and provides fallbacks for status labels.
 */
export function safeStatus(status?: string | null): string {
  return (status || "Inactive").toUpperCase();
}
