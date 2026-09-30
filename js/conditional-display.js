// This module owns all the "show/hide within a page" logic: revealing an
// "Other" text box, showing the Chaperones field only for K-12 audiences,
// and progressively revealing Tour Date options 2 and 3. Which *page* is
// showing at all is a separate concern, owned by step-navigation.js.

import { byId, setElementVisible, isAnyChecked, wireOtherCheckboxToggle } from "./dom-utils.js";

function wireAllOtherToggles() {
  wireOtherCheckboxToggle("event-type-other-toggle", "event-type-other-detail");
  wireOtherCheckboxToggle("tabling-audience-other-toggle", "tabling-audience-other-detail");
  wireOtherCheckboxToggle("tour-audience-other-toggle", "tour-audience-other-detail");
  wireOtherCheckboxToggle("department-other-toggle", "department-other-detail");
}

// The Chaperones field is only relevant (and only required) when at least
// one K-12 audience checkbox is checked.
function wireChaperoneVisibility() {
  const chaperoneWrap = byId("chaperone-field-wrap");
  const chaperoneInput = byId("num-chaperones");

  function refresh() {
    const audienceIncludesK12 = isAnyChecked("js-k12-audience");
    setElementVisible(chaperoneWrap, audienceIncludesK12);
    if (!audienceIncludesK12) chaperoneInput.value = "";
  }

  document.querySelectorAll(".js-k12-audience").forEach((checkbox) => {
    checkbox.addEventListener("change", refresh);
  });
}

// Tour Date Option 2 only appears once Option 1 is fully filled in, and
// Option 3 only appears once Option 2 is fully filled in.
function isTourOptionComplete(optionNumber) {
  const date = byId(`tour-date-${optionNumber}`).value;
  const start = byId(`tour-start-${optionNumber}`).value;
  const end = byId(`tour-end-${optionNumber}`).value;
  return Boolean(date && start && end);
}

function clearTourOption(optionNumber) {
  byId(`tour-date-${optionNumber}`).value = "";
  byId(`tour-start-${optionNumber}`).value = "";
  byId(`tour-end-${optionNumber}`).value = "";
}

function wireProgressiveTourOptions() {
  const fieldsThatTriggerRecheck = [
    "tour-date-1", "tour-start-1", "tour-end-1",
    "tour-date-2", "tour-start-2", "tour-end-2",
  ];

  function refresh() {
    const option1Done = isTourOptionComplete(1);
    const option2Done = isTourOptionComplete(2);

    setElementVisible(byId("tour-option-2"), option1Done);
    setElementVisible(byId("tour-option-3"), option1Done && option2Done);

    if (!option1Done) clearTourOption(2);
    if (!option1Done || !option2Done) clearTourOption(3);
  }

  fieldsThatTriggerRecheck.forEach((fieldId) => {
    byId(fieldId).addEventListener("change", refresh);
  });
}

// Sets the browser's native date-picker minimum to the earliest allowed
// date, so the calendar UI itself discourages picking a date too soon.
function applyEarliestDateConstraints(earliestAllowedDate) {
  ["event-date", "tour-date-1", "tour-date-2", "tour-date-3"].forEach((fieldId) => {
    byId(fieldId).min = earliestAllowedDate;
  });
}

export function initializeConditionalDisplay(earliestAllowedDate) {
  wireAllOtherToggles();
  wireChaperoneVisibility();
  wireProgressiveTourOptions();
  applyEarliestDateConstraints(earliestAllowedDate);
}
