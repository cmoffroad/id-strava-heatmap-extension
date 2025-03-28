export function observeAuthMeta(metaTag, callback) {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'content') {
        const isAuthenticated = metaTag.getAttribute('content') === 'true';
        callback(isAuthenticated);
      }
    });
  });
  observer.observe(metaTag, { attributes: true, attributeFilter: ['content'] });

  callback(metaTag.getAttribute('content') === 'true');
}
