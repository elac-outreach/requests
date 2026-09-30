// Pure functions only: given some input, return true/false. None of these
// touch the DOM, which makes the business rules easy to read in isolation
// from how they get applied to the form.

import { MINIMUM_ADVANCE_NOTICE_DAYS } from "./config.js";

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isBlank(value) {
  return !value || !value.trim();
}

// Returns the earliest date string (YYYY-MM-DD) that satisfies the
// advance-notice policy, e.g. "at least 2 weeks from today".
export function getEarliestAllowedDate() {
  const date = new Date();
  date.setDate(date.getDate() + MINIMUM_ADVANCE_NOTICE_DAYS);
  return date.toISOString().slice(0, 10);
}

export function isDateTooSoon(dateString) {
  return !!dateString && dateString < getEarliestAllowedDate();
}

export function isEndTimeInvalid(startTime, endTime) {
  return !!startTime && !!endTime && endTime <= startTime;
}

