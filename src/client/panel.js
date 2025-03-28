import { createControl } from './control.js';

function togglePaneContent(panesContainer, pane) {
  Array.from(panesContainer.children).forEach((child) => {
    if (child != pane) {
      child.classList.remove('shown');
      child.classList.add('hide');
    }
  });
  pane.classList.toggle('hide');
  pane.classList.toggle('shown');
  pane.style.right = 0;
}

export function createPaneContent(controlsContainer, panesContainer) {
  const pane = document.createElement('div');
  pane.className = 'fillL map-pane stravaheatmap-pane hide';

  const paneWrapper = document.createElement('div');
  paneWrapper.setAttribute('pane', 'stravaheatmap');
  paneWrapper.style.right = '0';

  const heading = document.createElement('div');
  heading.className = 'pane-heading';

  const title = document.createElement('h2');
  const titleText = document.createElement('span');
  titleText.className = 'localized-text';
  titleText.setAttribute('lang', 'en-US');
  titleText.textContent = 'Strava Heatmap';
  title.appendChild(titleText);

  const closeButton = document.createElement('button');
  closeButton.className = 'close';
  closeButton.setAttribute('title', 'Close');

  const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIcon.classList.add('icon');
  const useIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useIcon.setAttribute('xlink:href', '#iD-icon-close');
  closeIcon.appendChild(useIcon);
  closeButton.appendChild(closeIcon);

  heading.append(title, closeButton);

  const paneContent = document.createElement('div');
  paneContent.className = 'pane-content';

  paneWrapper.append(heading, paneContent);
  pane.appendChild(paneWrapper);
  panesContainer.appendChild(pane);

  const control = createControl(controlsContainer);
  const togglePane = () => togglePaneContent(panesContainer, pane);

  control.addEventListener('click', togglePane);
  closeButton.addEventListener('click', togglePane);

  document.addEventListener('keydown', (event) => {
    if (event.key === 's' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      togglePane();
    }
  });

  return paneContent;
}
