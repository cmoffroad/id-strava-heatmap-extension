export function createControl(controlsContainer) {
  const control = document.createElement('div');
  control.className = 'map-control map-pane-control stravaheatmap-control';
  control.style.marginTop = '20px';

  const button = document.createElement('button');
  button.className = 'button';
  button.style.borderRadius = '5px';

  const icon = document.createElement('svg');
  icon.className = 'icon light';

  const iconUse = document.createElement('use');
  iconUse.setAttribute('xlink:href', '#fas-user-cog');
  icon.appendChild(iconUse);

  const popover = document.createElement('div');
  popover.className = 'popover popover-7 tooltip arrowed left';
  popover.style.left = '-138px';
  popover.style.top = '-21px';

  const arrow = document.createElement('div');
  arrow.className = 'popover-arrow';

  const popoverInner = document.createElement('div');
  popoverInner.className = 'popover-inner';

  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';

  const tooltipSpan = document.createElement('span');
  tooltipSpan.className = 'localized-text';
  tooltipSpan.setAttribute('lang', 'en-US');
  tooltipSpan.textContent = 'Strava Heatmap Settings';

  tooltipText.appendChild(tooltipSpan);

  const keyHintWrap = document.createElement('div');
  keyHintWrap.className = 'keyhint-wrap';

  const shortcutText = document.createElement('span');
  shortcutText.className = 'localized-text';
  shortcutText.setAttribute('lang', 'en-US');
  shortcutText.textContent = 'Shortcut:';

  const shortcutKey = document.createElement('kbd');
  shortcutKey.className = 'shortcut';
  shortcutKey.textContent = 'Q';

  keyHintWrap.appendChild(shortcutText);
  keyHintWrap.appendChild(shortcutKey);

  // Build the structure
  popoverInner.appendChild(tooltipText);
  popoverInner.appendChild(keyHintWrap);
  popover.appendChild(arrow);
  popover.appendChild(popoverInner);
  button.appendChild(icon);
  button.appendChild(popover);
  control.appendChild(button);
  controlsContainer.appendChild(control);

  return control;
}
