import { apiBaseUrl } from "./config";

export const checkServerHealth = async (maxRetries = 5, retryInterval = 10000) => { // Set defaults for retries and interval
  let count = 0; // Start count at 0 for accurate retry tracking

  while (count < maxRetries) {
    const url = `${apiBaseUrl}/healthcheck`;
    try {
      const resp = await fetch(url);
      if (resp.ok && resp.status === 200) {
        return true; // Server is healthy, return success
      } else {
        console.warn(`Server health check failed (attempt ${count + 1}/${maxRetries}): status ${resp.status}`); // Log warning with attempt number
      }
    } catch (error) {
      console.error(`Server health check error (attempt ${count + 1}/${maxRetries}):`, error); // Log error with attempt number
    }

    count++; // Increment count for next iteration
    await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Wait for retry interval using Promise
  }

  console.error('Server health check failed after all retries.'); // Log error if all retries fail
  return false; // Server is unhealthy after retries
};