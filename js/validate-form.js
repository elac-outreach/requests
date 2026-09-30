import { byId, getCheckedValues, isAnyChecked, setFieldError, setGroupError } from "./dom-utils.js";
import { isValidEmail, isBlank, isDateTooSoon, isEndTimeInvalid } from "./validation-rules.js";

// One validator per *page* of the wizard, so step-navigation.js can call
// exactly the right one when the user clicks Next. Each still returns
// true/false and paints error states as a side effect, same pattern as
// before — just scoped to a single card's fields instead of a whole branch.

export function validateRequesterDetails() {
  let stepIsValid = true;

  ["first-name", "last-name", "title", "organization", "phone"].forEach((fieldId) => {
    const field = byId(fieldId);
    const fieldIsBlank = isBlank(field.value);
    setFieldError(field, fieldIsBlank);
    if (fieldIsBlank) stepIsValid = false;
  });

  const emailField = byId("email");
  const emailIsInvalid = !isValidEmail(emailField.value);
  setFieldError(emailField, emailIsInvalid);
  if (emailIsInvalid) stepIsValid = false;

  if (!byId("request-type").value) stepIsValid = false;

  return stepIsValid;
}

// ---------- Tabling: one function per Tabling card ----------

export function validateTablingEventDetails() {
  let stepIsValid = true;

  const nameField = byId("event-name");
  const nameIsBlank = isBlank(nameField.value);
  setFieldError(nameField, nameIsBlank);
  if (nameIsBlank) stepIsValid = false;

  const eventTypeSelected = getCheckedValues("js-event-type").length > 0;
  setGroupError(byId("event-type-error"), !eventTypeSelected);
  if (!eventTypeSelected) stepIsValid = false;

  return stepIsValid;
}

export function validateTablingLogistics() {
  let stepIsValid = true;

  ["event-date", "start-time", "end-time", "address-line-1", "city", "zip"].forEach((fieldId) => {
    const field = byId(fieldId);
    const fieldIsBlank = isBlank(field.value);
    setFieldError(field, fieldIsBlank);
    if (fieldIsBlank) stepIsValid = false;
  });

  const audienceSelected = getCheckedValues("js-tabling-audience").length > 0;
  setGroupError(byId("tabling-audience-error"), !audienceSelected);
  if (!audienceSelected) stepIsValid = false;

  const eventDateField = byId("event-date");
  const eventDateTooSoon = isDateTooSoon(eventDateField.value);
  setFieldError(eventDateField, eventDateTooSoon);
  if (eventDateTooSoon) stepIsValid = false;

  // Setup/Start/End are dropdowns of fixed, in-range time slots (see
  // time-options.js), so the only thing left to check is the cross-field
  // rule a dropdown can't enforce on its own: end after start.
  const startTimeField = byId("start-time");
  const endTimeField = byId("end-time");
  const endTimeBad = isEndTimeInvalid(startTimeField.value, endTimeField.value);
  setFieldError(endTimeField, endTimeBad);
  if (endTimeBad) stepIsValid = false;

  return stepIsValid;
}

export function validateTablingAdditionalDetails() {
  const indoorOutdoorField = byId("indoor-outdoor");
  const isBlankValue = isBlank(indoorOutdoorField.value);
  setFieldError(indoorOutdoorField, isBlankValue);
  return !isBlankValue;
}

// ---------- Campus Tour: one function per Tour card ----------

export function validateTourDetails() {
  let stepIsValid = true;

  const audienceSelected = getCheckedValues("js-tour-audience").length > 0;
  setGroupError(byId("tour-audience-error"), !audienceSelected);
  if (!audienceSelected) stepIsValid = false;

  const audienceIncludesK12 = isAnyChecked("js-k12-audience");
  const chaperoneField = byId("num-chaperones");
  const chaperoneIsMissing = audienceIncludesK12 && isBlank(chaperoneField.value);
  setFieldError(chaperoneField, chaperoneIsMissing);
  if (chaperoneIsMissing) stepIsValid = false;

  const participantsField = byId("num-participants");
  const participantsMissing = isBlank(participantsField.value);
  setFieldError(participantsField, participantsMissing);
  if (participantsMissing) stepIsValid = false;

  return stepIsValid;
}

function validateTourDateOption(optionNumber, isRequired) {
  let optionIsValid = true;
  const dateField = byId(`tour-date-${optionNumber}`);
  const startField = byId(`tour-start-${optionNumber}`);
  const endField = byId(`tour-end-${optionNumber}`);

  if (isRequired) {
    [dateField, startField, endField].forEach((field) => {
      const fieldIsBlank = isBlank(field.value);
      setFieldError(field, fieldIsBlank);
      if (fieldIsBlank) optionIsValid = false;
    });
  }

  const dateTooSoon = isDateTooSoon(dateField.value);
  setFieldError(dateField, dateTooSoon);
  if (dateTooSoon) optionIsValid = false;

  const endTimeBad = isEndTimeInvalid(startField.value, endField.value);
  setFieldError(endField, endTimeBad);
  if (endTimeBad) optionIsValid = false;

  return optionIsValid;
}

export function validateTourDateTime() {
  const option1Valid = validateTourDateOption(1, true);
  validateTourDateOption(2, false);
  validateTourDateOption(3, false);
  return option1Valid;
}

export function validateDepartments() {
  // Nothing in this card is required — exists mainly so step-navigation.js
  // can treat every page the same way (an id paired with a validator).
  return true;
}

// ---------- Full-form safety net, run once more right before the actual
// network request in main.js, in case the wizard's state ever drifts. ----------

export function validateForm() {
  const requestType = byId("request-type").value;

  const requesterOk = validateRequesterDetails();
  let branchOk = true;

  if (requestType === "Tabling") {
    const detailsOk = validateTablingEventDetails();
    const logisticsOk = validateTablingLogistics();
    const additionalOk = validateTablingAdditionalDetails();
    branchOk = detailsOk && logisticsOk && additionalOk;
  } else if (requestType === "Campus Tour") {
    const detailsOk = validateTourDetails();
    const dateTimeOk = validateTourDateTime();
    const departmentsOk = validateDepartments();
    branchOk = detailsOk && dateTimeOk && departmentsOk;
  }

  return requesterOk && branchOk;
}
