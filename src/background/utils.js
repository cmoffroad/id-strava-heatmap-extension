/**
 * Fetches a resource with a timeout mechanism.
 * Prevents hanging requests by rejecting the promise after the specified timeout.
 *
 * @param {string} url - The URL to fetch.
 * @param {number} [timeout=5000] - Timeout duration in milliseconds (default: 5000ms).
 * @returns {Promise<Response>} - A promise that resolves with the fetch response or rejects on timeout.
 */
export async function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    ),
  ]);
}
