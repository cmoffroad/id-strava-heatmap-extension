export function waitForDom(selector, callback) {
  const observer = new MutationObserver((mutationsList, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect(); // Stop observing once found
      callback(element);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
