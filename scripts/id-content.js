const script = document.createElement('script');
script.src = browser.runtime.getURL('scripts/id-script.js');
(document.head || document.documentElement).appendChild(script);
script.remove();