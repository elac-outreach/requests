// All the "knobs" for this form's business rules live here, in one place,
// so adjusting a policy (like the advance-notice window) never requires
// hunting through validation logic elsewhere in the codebase.

export const FLOW_ENDPOINT_URL = "PASTE_YOUR_POWER_AUTOMATE_HTTP_TRIGGER_URL_HERE";

export const MINIMUM_ADVANCE_NOTICE_DAYS = 14;

export const TABLING_HOURS = { earliest: "09:00", latest: "21:00" };
export const TOUR_HOURS = { earliest: "09:00", latest: "15:00" };

export const PARTICIPANT_RANGE = { min: 15, max: 30 };

// Chaperones are only required for K-12 groups, so a minimum of 1 (not 0)
// makes sense once the field is showing at all.
export const CHAPERONE_RANGE = { min: 1, max: 15 };
