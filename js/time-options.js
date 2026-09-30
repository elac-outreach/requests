// Builds a bounded list of time choices (e.g. "9:00 AM", "9:30 AM", ...)
// instead of using a native <input type="time">, whose scroll-style picker
// is confusing and doesn't visually communicate the allowed range at all.
// Because the dropdown only ever offers times inside the allowed hours,
// "is this time within business hours" never needs separate validation —
// the field simply doesn't let you pick anything else.

function to24HourValue(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function to12HourLabel(hour, minute) {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = ((hour + 11) % 12) + 1;
  const displayMinute = String(minute).padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

// hoursRange looks like { earliest: "09:00", latest: "21:00" }
function generateTimeSlots(hoursRange, intervalMinutes) {
  const [startHour, startMinute] = hoursRange.earliest.split(":").map(Number);
  const [endHour, endMinute] = hoursRange.latest.split(":").map(Number);

  const slots = [];
  let minutesSinceMidnight = startHour * 60 + startMinute;
  const lastMinutesSinceMidnight = endHour * 60 + endMinute;

  while (minutesSinceMidnight <= lastMinutesSinceMidnight) {
    const hour = Math.floor(minutesSinceMidnight / 60);
    const minute = minutesSinceMidnight % 60;
    slots.push({ value: to24HourValue(hour, minute), label: to12HourLabel(hour, minute) });
    minutesSinceMidnight += intervalMinutes;
  }
  return slots;
}

export function populateTimeSelect(selectElementId, hoursRange, intervalMinutes = 30) {
  const selectElement = document.getElementById(selectElementId);
  const timeSlots = generateTimeSlots(hoursRange, intervalMinutes);

  const optionsHtml = [
    `<option value="">Select a time...</option>`,
    ...timeSlots.map((slot) => `<option value="${slot.value}">${slot.label}</option>`),
  ];

  selectElement.innerHTML = optionsHtml.join("");
}
