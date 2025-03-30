export function waitForDom(selectors, callback) {
  if (!Array.isArray(selectors)) {
    selectors = [selectors]; // Ensure it's an array
  }

  const observer = new MutationObserver(() => {
    const elements = selectors.map((selector) => document.querySelector(selector));

    if (elements.every((el) => el)) {
      observer.disconnect(); // Stop observing once all elements are found
      callback(...elements);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check in case elements are already present
  const elements = selectors.map((selector) => document.querySelector(selector));
  if (elements.every((el) => el)) {
    observer.disconnect();
    callback(...elements);
  }
}
