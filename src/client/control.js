export function createControl(controlsContainer) {
  const control = document.createElement('div');
  control.className = 'map-control map-pane-control stravaheatmap-control';
  control.innerHTML = `
      <button class="button">
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

  controlsContainer.appendChild(control);

  control.style.marginTop = '20px';
  control.querySelector('button').style.borderRadius = '5px';

  return control;
}
