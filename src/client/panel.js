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
  pane.innerHTML = `
    <div class="" pane="stravaheatmap" style="right: 0px;">
        <div class="pane-heading">
            <h2><span class="localized-text" lang="en-US">Strava Heatmap</span></h2>
            <button class="close title="close">
                <svg class="icon ">
                    <use xlink:href="#iD-icon-close"></use>
                </svg>
            </button>
        </div>
        <div class="pane-content">
            
        </div>
    </div>
  `;
  panesContainer.appendChild(pane);

  const control = createControl(controlsContainer);
  control.addEventListener('click', () => togglePaneContent(panesContainer, pane));
  pane
    .querySelector('.close')
    .addEventListener('click', () => togglePaneContent(panesContainer, pane));

  document.addEventListener('keydown', (event) => {
    if (event.key === 's' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      togglePaneContent(panesContainer, pane);
    }
  });

  const paneContent = pane.querySelector('.pane-content');

  return paneContent;
}
