// Utility functions for time handling

/**
 * Get current time in Sri Lanka timezone (GMT +5:30)
 * @returns {string} Current time in format "YYYY-MM-DD HH:MM:SS"
 */
export const getSriLankaTime = () => {
  const now = new Date();
  const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  return sriLankaTime.toISOString().slice(0, 19).replace("T", " ");
};

/**
 * Get current time in Sri Lanka timezone as Date object
 * @returns {Date} Current time in Sri Lanka timezone
 */
export const getSriLankaTimeAsDate = () => {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
};

/**
 * Format a date to Sri Lanka timezone string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatSriLankaTime = (date) => {
  const sriLankaTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  return sriLankaTime.toISOString().slice(0, 19).replace("T", " ");
};

/**
 * Get current date in Sri Lanka timezone
 * @returns {string} Current date in format "YYYY-MM-DD"
 */
export const getSriLankaDate = () => {
  const now = new Date();
  const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  return sriLankaTime.toISOString().split('T')[0];
};
