// Same idea as time-options.js, applied to plain integers: fills a <select>
// with every whole number in a range instead of a free-typed <input
// type="number">. Bounding the choices this way also means validate-form.js
// never has to check "is this number in range" — an out-of-range value
// simply isn't an option.

export function populateNumberSelect(selectElementId, minValue, maxValue) {
  const selectElement = document.getElementById(selectElementId);

  const options = ['<option value="">Select...</option>'];
  for (let value = minValue; value <= maxValue; value += 1) {
    options.push(`<option value="${value}">${value}</option>`);
  }

  selectElement.innerHTML = options.join("");
}
