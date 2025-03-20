try {
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('scripts/id-script.js');
  script.async = true; // Ensures non-blocking execution

  script.onload = () => script.remove(); // Removes after execution
  script.onerror = (e) => {
    console.error('Failed to load script:', script.src, e);
    script.remove(); // Cleanup even if it fails
  };

  (document.head || document.documentElement).appendChild(script);
} catch (error) {
  console.error('Error injecting script:', error);
}
