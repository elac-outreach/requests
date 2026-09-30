// Generic helpers for reading/writing the DOM. Nothing in this file knows
// anything about the form's business rules — it's pure plumbing so the
// other modules can stay focused on "what" rather than "how".

export function byId(elementId) {
  return document.getElementById(elementId);
}

export function showElement(element) {
  element.classList.remove("hidden");
}

export function hideElement(element) {
  element.classList.add("hidden");
}

export function setElementVisible(element, shouldBeVisible) {
  element.classList.toggle("hidden", !shouldBeVisible);
}

// Returns the .value of every checked checkbox matching a given class name,
// e.g. getCheckedValues("js-department") -> ["Dream Resource Center", ...]
export function getCheckedValues(triggerClassName) {
  const checkedInputs = document.querySelectorAll(`.${triggerClassName}:checked`);
  return Array.from(checkedInputs).map((input) => input.value);
}

export function isAnyChecked(triggerClassName) {
  return document.querySelectorAll(`.${triggerClassName}:checked`).length > 0;
}

// Marks or clears the "has-error" state on a field's wrapping container,
// which is what actually shows/hides the red border and error text
// (see the .has-error rules in css/styles.css).
export function setFieldError(inputElement, hasError) {
  const fieldWrapper = inputElement.closest("div") || inputElement.parentElement;
  fieldWrapper.classList.toggle("has-error", hasError);
}

export function setGroupError(errorMessageElement, hasError) {
  errorMessageElement.classList.toggle("has-error", hasError);
  errorMessageElement.style.display = hasError ? "block" : "none";
}

// Wires an "Other" checkbox to reveal/hide (and clear) its paired free-text field.
export function wireOtherCheckboxToggle(checkboxId, detailFieldId) {
  const checkbox = byId(checkboxId);
  const detailField = byId(detailFieldId);
  checkbox.addEventListener("change", () => {
    setElementVisible(detailField, checkbox.checked);
    if (!checkbox.checked) detailField.value = "";
  });
}
