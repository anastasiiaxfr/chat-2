// utils.js

/**
 * Format timestamp as MM.DD.YY at HH:mm
 * @param {number|Date} timestamp - Date object or milliseconds
 * @returns {string} Formatted string, e.g., "12.18.25 at 14:35"
 */
export function formatDateTime(timestamp) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // last 2 digits of year

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}.${day}.${year} at ${hours}:${minutes}`;
}
