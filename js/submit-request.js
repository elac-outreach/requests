import { FLOW_ENDPOINT_URL } from "./config.js";

// Posts the payload to the Power Automate HTTP trigger. Throws if the
// request fails, so callers can decide how to react (see main.js).
export async function submitRequest(payload) {
  const response = await fetch(FLOW_ENDPOINT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Flow returned status ${response.status}`);
  }
}
