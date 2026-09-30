// Turns whatever is currently filled in on the form into a plain JSON
// object. This module only reads values — it doesn't validate anything
// (see validate-form.js) and doesn't send anything (see submit-request.js).

import { byId, getCheckedValues } from "./dom-utils.js";

// Combines a set of checked checkbox values with a paired "Other" free-text
// field, the same pattern used for Event Type, both Target Audience groups,
// and Departments to Visit.
function collectCheckboxGroupWithOther(triggerClassName, otherToggleId, otherDetailId) {
  const selectedValues = getCheckedValues(triggerClassName).filter((value) => value !== "Other");
  const otherIsChecked = byId(otherToggleId).checked;
  const otherText = byId(otherDetailId).value.trim();

  if (otherIsChecked && otherText) {
    selectedValues.push(otherText);
  }
  return selectedValues.join(", ");
}

function collectRequesterDetails() {
  return {
    firstName: byId("first-name").value.trim(),
    lastName: byId("last-name").value.trim(),
    title: byId("title").value.trim(),
    organization: byId("organization").value.trim(),
    email: byId("email").value.trim(),
    phone: byId("phone").value.trim(),
    requestType: byId("request-type").value,
    additionalNotes: byId("additional-notes").value.trim(),
  };
}

function collectTablingDetails() {
  return {
    eventName: byId("event-name").value.trim(),
    eventType: collectCheckboxGroupWithOther("js-event-type", "event-type-other-toggle", "event-type-other-detail"),
    eventDescription: byId("event-description").value.trim(),
    eventDate: byId("event-date").value,
    addressLine1: byId("address-line-1").value.trim(),
    addressLine2: byId("address-line-2").value.trim(),
    city: byId("city").value.trim(),
    state: byId("state").value,
    zip: byId("zip").value.trim(),
    setupTime: byId("setup-time").value,
    startTime: byId("start-time").value,
    endTime: byId("end-time").value,
    targetAudience: collectCheckboxGroupWithOther("js-tabling-audience", "tabling-audience-other-toggle", "tabling-audience-other-detail"),
    itemsProvided: getCheckedValues("js-items-provided").join(", "),
    indoorOutdoor: byId("indoor-outdoor").value,
    flyerLink: byId("flyer-link").value.trim(),
    rsvpLink: byId("rsvp-link").value.trim(),
  };
}

function collectTourDetails() {
  return {
    tourTargetAudience: collectCheckboxGroupWithOther("js-tour-audience", "tour-audience-other-toggle", "tour-audience-other-detail"),
    numParticipants: byId("num-participants").value,
    numChaperones: byId("num-chaperones").value,
    departments: collectCheckboxGroupWithOther("js-department", "department-other-toggle", "department-other-detail"),
    tourDate1: byId("tour-date-1").value, tourStart1: byId("tour-start-1").value, tourEnd1: byId("tour-end-1").value,
    tourDate2: byId("tour-date-2").value, tourStart2: byId("tour-start-2").value, tourEnd2: byId("tour-end-2").value,
    tourDate3: byId("tour-date-3").value, tourStart3: byId("tour-start-3").value, tourEnd3: byId("tour-end-3").value,
  };
}

export function buildSubmissionPayload() {
  const requestType = byId("request-type").value;
  const payload = collectRequesterDetails();

  if (requestType === "Tabling") {
    Object.assign(payload, collectTablingDetails());
  } else if (requestType === "Campus Tour") {
    Object.assign(payload, collectTourDetails());
  }

  return payload;
}
