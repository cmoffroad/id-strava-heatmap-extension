export function createPaneContent(controlsContainer, panesContainer) {
  const pane = document.createElement('div');
  pane.className = 'fillL map-pane stravaheatmap-pane hide';
  pane.innerHTML = `
    <div class="" pane="stravaheatmap" style="right: 0px;">
        <div class="pane-heading">
            <h2><span class="localized-text" lang="en-US">Strava Heatmap</span></h2>
            <button title="close">
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

  const control = document.createElement('div');
  control.className = 'map-control map-pane-control stravaheatmap-control';
  control.innerHTML = `
    <button class="">
        <svg class="icon light">
        <use xlink:href="#fas-user-cog"></use>
        </svg>
        <div
        class="popover popover-7 tooltip arrowed left"
        style="left: -138px; top: -21px;"
        >
        <div class="popover-arrow"></div>
        <div class="popover-inner">
            <div class="tooltip-text">
            <span class="localized-text" lang="en-US">
                Strava Heatmap Settings
            </span>
            </div>
            <div class="keyhint-wrap">
            <span>
                <span class="localized-text" lang="en-US">
                Shortcut:
                </span>
            </span>
            <kbd class="shortcut">Q</kbd>
            </div>
        </div>
        </div>
    </button>`;
  control.addEventListener('click', () => {
    Array.from(panesContainer.children).forEach((child) => {
      if (child != pane) {
        child.classList.remove('shown');
        child.classList.add('hide');
      }
    });
    pane.classList.toggle('hide');
    pane.classList.toggle('shown');
    pane.style.right = 0;
  });
  controlsContainer.appendChild(control);

  return pane.querySelector('.pane-content');
}
