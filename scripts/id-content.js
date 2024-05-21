const script = document.createElement('script');
script.src = browser.runtime.getURL('scripts/id-script.js');
(document.head || document.documentElement).appendChild(script);
script.remove();

var meta = document.createElement('meta');
meta.name = "referrer";
meta.content = "never";
(document.head || document.documentElement).appendChild(meta);