/**
 * Timestamp formatting utilities for HelpButton.qs.
 *
 * Provides a set of named timestamp formats that can be selected
 * independently for dialog display and webhook payload.
 */

// ---------------------------------------------------------------------------
// Format key constants
// ---------------------------------------------------------------------------

/**
 * All supported timestamp format keys with human-readable labels.
 * Used by the property panel dropdowns.
 */
export const TIMESTAMP_FORMAT_OPTIONS = [
  { value: "YYYY-MM-DD HH:mm:ss", label: "2026-03-14 10:47:55" },
  { value: "DD Month YYYY HH:mm:ss", label: "14 March 2026 10:47:55" },
  { value: "Mon DD, YYYY hh:mm:ss A", label: "Mar 14, 2026 10:47:55 AM" },
  { value: "Month DD, YYYY hh:mm:ss A", label: "March 14, 2026 10:47:55 AM" },
  { value: "DD/MM/YYYY, HH:mm:ss", label: "14/03/2026, 10:47:55" },
  { value: "MM/DD/YYYY, hh:mm:ss A", label: "03/14/2026, 10:47:55 AM" },
  { value: "ISO8601", label: "2026-03-14T10:47:55 (ISO 8601, no TZ)" },
  { value: "ISO8601Z", label: "2026-03-14T10:47:55Z (ISO 8601 UTC)" },
  {
    value: "ISO8601Offset",
    label: "2026-03-14T10:47:55+01:00 (ISO 8601 w/ offset)",
  },
  { value: "DD-Mon-YYYY HH:mm:ss", label: "14-Mar-2026 10:47:55 (log format)" },
  { value: "ISO8601Compact", label: "20260314T104755 (ISO 8601 compact)" },
];

/**
 * Default timestamp format for dialog display.
 */
export const DEFAULT_DIALOG_FORMAT = "YYYY-MM-DD HH:mm:ss";

/**
 * Default timestamp format for webhook payloads.
 */
export const DEFAULT_PAYLOAD_FORMAT = "ISO8601Z";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function ampm(hours) {
  return hours < 12 ? "AM" : "PM";
}

function hours12(h) {
  const h12 = h % 12;
  return h12 === 0 ? 12 : h12;
}

/**
 * Get the local timezone offset string in ±HH:MM form.
 * e.g. "+01:00", "-05:00", "+00:00"
 */
function tzOffsetString(date) {
  const offsetMin = date.getTimezoneOffset(); // e.g. -60 for UTC+1
  const sign = offsetMin <= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  return sign + pad2(Math.floor(absMin / 60)) + ":" + pad2(absMin % 60);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Format a Date object according to a named format key.
 *
 * @param {Date} date - The date to format.
 * @param {string} formatKey - One of the format key strings from TIMESTAMP_FORMAT_OPTIONS.
 * @returns {string} Formatted date string.
 */
export function formatTimestamp(date, formatKey) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "(invalid date)";
  }

  const Y = date.getFullYear();
  const M = date.getMonth(); // 0-based
  const D = date.getDate();
  const H = date.getHours(); // 0-23
  const m = date.getMinutes();
  const s = date.getSeconds();

  switch (formatKey) {
    // 2026-03-14 10:47:55
    case "YYYY-MM-DD HH:mm:ss":
      return (
        Y +
        "-" +
        pad2(M + 1) +
        "-" +
        pad2(D) +
        " " +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s)
      );

    // 14 March 2026 10:47:55
    case "DD Month YYYY HH:mm:ss":
      return (
        D +
        " " +
        MONTHS_LONG[M] +
        " " +
        Y +
        " " +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s)
      );

    // Mar 14, 2026 10:47:55 AM
    case "Mon DD, YYYY hh:mm:ss A":
      return (
        MONTHS_SHORT[M] +
        " " +
        D +
        ", " +
        Y +
        " " +
        pad2(hours12(H)) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s) +
        " " +
        ampm(H)
      );

    // March 14, 2026 10:47:55 AM
    case "Month DD, YYYY hh:mm:ss A":
      return (
        MONTHS_LONG[M] +
        " " +
        D +
        ", " +
        Y +
        " " +
        pad2(hours12(H)) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s) +
        " " +
        ampm(H)
      );

    // 14/03/2026, 10:47:55
    case "DD/MM/YYYY, HH:mm:ss":
      return (
        pad2(D) +
        "/" +
        pad2(M + 1) +
        "/" +
        Y +
        ", " +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s)
      );

    // 3/14/2026, 10:47:55 AM
    case "MM/DD/YYYY, hh:mm:ss A":
      return (
        (M + 1) +
        "/" +
        D +
        "/" +
        Y +
        ", " +
        pad2(hours12(H)) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s) +
        " " +
        ampm(H)
      );

    // 2026-03-14T10:47:55
    case "ISO8601":
      return (
        Y +
        "-" +
        pad2(M + 1) +
        "-" +
        pad2(D) +
        "T" +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s)
      );

    // 2026-03-14T10:47:55Z  (uses UTC values)
    case "ISO8601Z":
      return (
        date.getUTCFullYear() +
        "-" +
        pad2(date.getUTCMonth() + 1) +
        "-" +
        pad2(date.getUTCDate()) +
        "T" +
        pad2(date.getUTCHours()) +
        ":" +
        pad2(date.getUTCMinutes()) +
        ":" +
        pad2(date.getUTCSeconds()) +
        "Z"
      );

    // 2026-03-14T10:47:55+01:00
    case "ISO8601Offset":
      return (
        Y +
        "-" +
        pad2(M + 1) +
        "-" +
        pad2(D) +
        "T" +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s) +
        tzOffsetString(date)
      );

    // 14-Mar-2026 10:47:55
    case "DD-Mon-YYYY HH:mm:ss":
      return (
        pad2(D) +
        "-" +
        MONTHS_SHORT[M] +
        "-" +
        Y +
        " " +
        pad2(H) +
        ":" +
        pad2(m) +
        ":" +
        pad2(s)
      );

    // 20260314T104755
    case "ISO8601Compact":
      return "" + Y + pad2(M + 1) + pad2(D) + "T" + pad2(H) + pad2(m) + pad2(s);

    default:
      // Fall back to ISO 8601 UTC for unknown format keys
      return date.toISOString();
  }
}
