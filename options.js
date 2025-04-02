function callbackFn(field) {
  return (value) => console.log(`${field} changed to "${value}"`);
}

function initializeToolbar(containerSelector, options = {}) {
  const {
    opened = false,
    enabled = false,
    authenticated = false,
    activity = 'all',
    color = 'hot',
    opacity = 50,
    callbackOpened = callbackFn('opened'),
    callbackEnabled = callbackFn('enabled'),
    callbackActivity = callbackFn('activity'),
    callbackColor = callbackFn('color'),
    callbackOpacity = callbackFn('opacity'),
  } = options;
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Container element not found');
    return;
  }

  const toolbar = createElement('div', { className: 'toolbar-container' });
  const popup = createElement('div', { className: 'popup-container' });
  const iconToggle = createElement('img', {
    src: 'icons/icon-48.png',
    className: 'icon-toggle',
  });

  toolbar.append(popup, iconToggle);
  container.append(toolbar);

  createPopupContent(popup);

  const elements = {
    toolbar,
    iconToggle: toolbar.querySelector('.icon-toggle'),
    layerSwitch: popup.querySelector('.switch-layer > input'),
    activityDropdown: popup.querySelector('.control-activity > select'),
    colorDropdown: popup.querySelector('.control-color > select'),
    opacitySlider: popup.querySelector('.control-opacity > input'),
    opacityCaption: popup.querySelector('.control-opacity > .caption'),
    closeButton: popup.querySelector('.btn-close'),
  };

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isInputField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable;

    if (isInputField) return;

    if (event.code === 'KeyS' && !event.altKey && !event.ctrlKey && !event.metaKey) {
      togglePopup(elements, callbackOpened);
    }
  });

  elements.iconToggle.addEventListener('click', () =>
    togglePopup(elements, callbackOpened)
  );
  elements.closeButton.addEventListener('click', () =>
    closePopup(elements, callbackOpened)
  );
  elements.layerSwitch.addEventListener('change', (e) =>
    toggleLayer(elements, e.target.checked, callbackEnabled)
  );
  elements.activityDropdown.addEventListener('change', (e) =>
    updateActivity(elements, e.target.value, callbackActivity)
  );
  elements.colorDropdown.addEventListener('change', (e) =>
    updateColor(elements, e.target.value, callbackColor)
  );
  elements.opacitySlider.addEventListener('input', (e) =>
    updateOpacity(elements, e.target.value, callbackOpacity)
  );

  // initialize state
  togglePopup(elements);
  toggleLayer(elements, enabled);
  toggleAuthentication(elements, authenticated);

  updateActivity(elements, activity);
  updateColor(elements, color);
  updateOpacity(elements, opacity);
}

const createElement = (tag, props = {}, children = []) => {
  const el = Object.assign(document.createElement(tag), props);
  if (children.length)
    el.append(...(Array.isArray(children[0]) ? children[0] : children));
  return el;
};

const ACTIVITY_OPTIONS = [
  ['all', 'All'],
  ['ride', 'Ride'],
  ['run', 'Run'],
  ['water', 'Water'],
  ['winter', 'Winter'],
];
const COLOR_OPTIONS = [
  ['hot', 'Hot'],
  ['gray', 'Gray'],
  ['purple', 'Purple'],
  ['bluered', 'Blue Red'],
  ['orange', 'Orange'],
];

function createPopupContent(popup) {
  popup.append(
    createElement('div', { className: 'popup-left' }, [
      createElement('span', { className: 'label', textContent: 'Strava Heatmap' }),
      createElement('label', { className: 'switch switch-layer' }, [
        createElement('input', { type: 'checkbox' }),
        createElement('span', { className: 'slider' }),
      ]),
    ]),
    createElement('div', { className: 'popup-center' }, [
      createErrorMessage(),
      createSelectControl('control-activity', 'Activity', ACTIVITY_OPTIONS),
      createSelectControl('control-color', 'Color', COLOR_OPTIONS),
      createElement('div', { className: 'control control-opacity' }, [
        createElement('span', { className: 'label', textContent: 'Opacity' }),
        createElement('input', { type: 'range', min: '0', max: '100' }),
        createElement('span', { className: 'caption' }),
      ]),
    ]),
    createElement('div', { className: 'popup-right' }, [
      createElement('button', { className: 'btn-close', textContent: 'X' }),
    ])
  );
}

function createErrorMessage() {
  const div = createElement('div', { className: 'error' });
  div.append(
    'Log in at ',
    createElement('a', {
      href: 'https://www.strava.com/login?redirect=https%3A%2F%2Fwww.strava.com%2Fmaps',
      target: '_blank',
      textContent: 'strava.com/login',
    }),
    ' and navigate to ',
    createElement('b', { textContent: 'Maps' })
  );
  return div;
}

function createSelectControl(className, labelText, options) {
  return createElement('div', { className: `control ${className}` }, [
    createElement('span', { className: 'label', textContent: labelText }),
    createElement(
      'select',
      {},
      options.map(([value, text]) =>
        createElement('option', { value, textContent: text })
      )
    ),
  ]);
}

function togglePopup(elements, callback) {
  elements.toolbar.classList.toggle('opened');

  if (callback) callback(open);
}

function closePopup(elements, callback) {
  elements.toolbar.classList.toggle('opened', false);

  if (callback) callback(open);
}

function toggleLayer(elements, enabled, callback) {
  if (callback) callback(enabled);
  else elements.layerSwitch.checked = enabled;

  elements.activityDropdown.disabled = !enabled;
  elements.colorDropdown.disabled = !enabled;
  elements.opacitySlider.disabled = !enabled;
  elements.toolbar.classList.toggle('layer-enabled', enabled);
}

function toggleAuthentication(elements, authenticated) {
  elements.toolbar.classList.toggle('authenticated', authenticated);
}

function updateActivity(elements, value, callback) {
  if (callback) callback(value);
  else elements.activityDropdown.value = value;
}

function updateColor(elements, value, callback) {
  if (callback) callback(value);
  else elements.colorDropdown.value = value;
}

function updateOpacity(elements, value, callback) {
  elements.opacityCaption.textContent = value + '%';
  if (callback) callback(value);
  else elements.opacitySlider.value = value;
}
