const script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/id-script.js');
(document.head || document.documentElement).appendChild(script);
script.remove();