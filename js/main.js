import { byId, hideElement } from "./dom-utils.js";
import { getEarliestAllowedDate } from "./validation-rules.js";
import { initializeConditionalDisplay } from "./conditional-display.js";
import { validateForm } from "./validate-form.js";
import { buildSubmissionPayload } from "./collect-form-data.js";
import { submitRequest } from "./submit-request.js";
import { loadFormSections } from "./load-sections.js";
import { populateTimeSelect } from "./time-options.js";
import { populateNumberSelect } from "./number-options.js";
import { initializeStepNavigation, resetToFirstStep } from "./step-navigation.js";
import { TABLING_HOURS, TOUR_HOURS, PARTICIPANT_RANGE, CHAPERONE_RANGE } from "./config.js";

function showStatusMessage(text, kind) {
  const statusMessageElement = byId("form-status-message");
  statusMessageElement.textContent = text;
  statusMessageElement.classList.remove("hidden", "status-success", "status-error");
  statusMessageElement.classList.add(kind === "success" ? "status-success" : "status-error");
}

function resetFormToInitialState(formElement) {
  formElement.reset();
  hideElement(byId("chaperone-field-wrap"));
  hideElement(byId("tour-option-2"));
  hideElement(byId("tour-option-3"));
  resetToFirstStep();
}

async function handleFormSubmit(event) {
  event.preventDefault();

  // Safety net: re-checks every page's rules at once, in case the wizard's
  // step-by-step gating and the actual field state ever drift apart.
  if (!validateForm()) {
    showStatusMessage("Please fix the highlighted fields above before submitting.", "error");
    return;
  }

  const submitButton = byId("submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await submitRequest(buildSubmissionPayload());
    showStatusMessage("Thank you! Your request has been received. You'll get a confirmation email shortly.", "success");
    resetFormToInitialState(event.target);
  } catch (error) {
    showStatusMessage("Something went wrong submitting your request. Please try again or contact us directly.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Request";
  }
}

function populateAllTimeSelects() {
  populateTimeSelect("setup-time", TABLING_HOURS);
  populateTimeSelect("start-time", TABLING_HOURS);
  populateTimeSelect("end-time", TABLING_HOURS);

  ["1", "2", "3"].forEach((optionNumber) => {
    populateTimeSelect(`tour-start-${optionNumber}`, TOUR_HOURS);
    populateTimeSelect(`tour-end-${optionNumber}`, TOUR_HOURS);
  });
}

function populateAllNumberSelects() {
  populateNumberSelect("num-participants", PARTICIPANT_RANGE.min, PARTICIPANT_RANGE.max);
  populateNumberSelect("num-chaperones", CHAPERONE_RANGE.min, CHAPERONE_RANGE.max);
}

async function init() {
  // Sections must be in the DOM before anything below can find its elements.
  await loadFormSections();

  populateAllTimeSelects();
  populateAllNumberSelects();
  initializeConditionalDisplay(getEarliestAllowedDate());

  // Must run after the above, since it immediately renders step one and
  // needs every field already present and populated to do so correctly.
  initializeStepNavigation();

  byId("request-form").addEventListener("submit", handleFormSubmit);
}

init();
