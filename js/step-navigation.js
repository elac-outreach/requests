// Turns the form into a page-at-a-time wizard. Each step is just an element
// id paired with the validator function (from validate-form.js) that must
// pass before the person can move on — so adding, removing, or reordering
// a page is a one-line change to the arrays below, nothing else.

import { byId, setElementVisible } from "./dom-utils.js";
import {
  validateRequesterDetails,
  validateTablingEventDetails,
  validateTablingLogistics,
  validateTablingAdditionalDetails,
  validateTourDetails,
  validateTourDateTime,
  validateDepartments,
} from "./validate-form.js";

const REQUESTER_STEP = { id: "step-requester", validate: validateRequesterDetails };

const TABLING_STEPS = [
  { id: "step-tabling-details", validate: validateTablingEventDetails },
  { id: "step-tabling-logistics", validate: validateTablingLogistics },
  { id: "step-tabling-additional", validate: validateTablingAdditionalDetails },
];

const TOUR_STEPS = [
  { id: "step-tour-details", validate: validateTourDetails },
  { id: "step-tour-datetime", validate: validateTourDateTime },
  { id: "step-tour-departments", validate: validateDepartments },
];

const FINAL_STEP = { id: "step-notes", validate: () => true };

const ALL_POSSIBLE_STEP_IDS = [REQUESTER_STEP, ...TABLING_STEPS, ...TOUR_STEPS, FINAL_STEP].map(
  (step) => step.id
);

let currentStepIndex = 0;

// The sequence depends on which request type is selected, so it's
// recomputed fresh every time rather than decided once up front.
function getActiveStepSequence() {
  const requestType = byId("request-type").value;
  const branchSteps =
    requestType === "Tabling" ? TABLING_STEPS : requestType === "Campus Tour" ? TOUR_STEPS : [];
  return [REQUESTER_STEP, ...branchSteps, FINAL_STEP];
}

function renderCurrentStep() {
  const activeSteps = getActiveStepSequence();

  // Hide every step that could possibly exist, then reveal only the current
  // one — this also cleans up any branch steps left over from a request
  // type the person switched away from mid-form.
  ALL_POSSIBLE_STEP_IDS.forEach((stepId) => setElementVisible(byId(stepId), false));
  setElementVisible(byId(activeSteps[currentStepIndex].id), true);

  byId("step-indicator").textContent = `Step ${currentStepIndex + 1} of ${activeSteps.length}`;
  setElementVisible(byId("back-button"), currentStepIndex > 0);
  setElementVisible(byId("next-button"), currentStepIndex < activeSteps.length - 1);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToNextStep() {
  const activeSteps = getActiveStepSequence();
  const currentStepPassesValidation = activeSteps[currentStepIndex].validate();
  if (!currentStepPassesValidation) return;

  if (currentStepIndex < activeSteps.length - 1) {
    currentStepIndex += 1;
    renderCurrentStep();
  }
}

function goToPreviousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex -= 1;
    renderCurrentStep();
  }
}

// Called by main.js after a successful submission, so the form is back at
// page one the next time someone uses it.
export function resetToFirstStep() {
  currentStepIndex = 0;
  renderCurrentStep();
}

export function initializeStepNavigation() {
  byId("next-button").addEventListener("click", goToNextStep);
  byId("back-button").addEventListener("click", goToPreviousStep);
  renderCurrentStep();
}
