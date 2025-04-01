function togglePopup(toolbarContainer, open) {
  toolbarContainer.classList.toggle('opened', open);
}

function toggleLayer(toolbarContainer, enabled) {
  toolbarContainer.querySelector('.switch-layer > input').checked = enabled;
  const controls = toolbarContainer.querySelectorAll('.control select, .control input');
  controls.forEach((ctrl) => {
    ctrl.disabled = !enabled;
  });
  toolbarContainer.classList.toggle('layer-enabled', enabled);
}

function updateOpacityValue(toolbarContainer, value) {
  toolbarContainer.querySelector('.control-opacity > input').value = value;
  toolbarContainer.querySelector('.control-opacity > .caption').textContent = value + '%';
}

function toggleAuthentication(toolbarContainer, authenticated) {
  toolbarContainer.classList.toggle('authenticated', authenticated);
}

function initializeToolbar(
  containerSelector,
  { opened, enabled, authenticated, activity, color, opacity }
) {
  const containerElement = document.querySelector(containerSelector);

  // Create the new intermediate root div
  const toolbarDiv = document.createElement('div');
  toolbarDiv.className = 'toolbar-container'; // Optional: add a class for styling or reference

  const popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';

  const icon = document.createElement('img');
  icon.src = 'icons/icon-48.png';
  icon.alt = 'Extension Icon';
  icon.className = 'icon';
  icon.addEventListener('click', () => togglePopup(toolbarDiv));

  // Append icon and popupContainer to the toolbarDiv instead of containerElement
  toolbarDiv.appendChild(icon);
  toolbarDiv.appendChild(popupContainer);

  // Append the toolbarDiv to the containerElement
  containerElement.appendChild(toolbarDiv);

  popupContainer.innerHTML = `
    <div class="popup-left">
        <span class="label">Strava Heatmap</span>
        <label class="switch switch-layer">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
    </div>
   
    <div class="popup-center">
    <div class="error">
      Log in at <a href="https://www.strava.com/login?redirect=https%3A%2F%2Fwww.strava.com%2Fmaps" target="_blank">strava.com/login</a> and navigate to <b>Maps</b>
    </div>
        <div class="control control-activity">
            <span class="label">Activity</span>
            <select>
                <option value="all">All</option>
                <option value="ride">Ride</option>
                <option value="winter">Winter</option>
            </select>
        </div>
        <div class="control control-color">
            <span class="label">Color</span>
            <select>
                <option value="hot">Hot</option>
                <option value="blueRed">Blue Red</option>
            </select>
        </div>
        <div class="control control-opacity">
            <span class="label">Opacity</span>
            <input type="range" min="0" max="100" />
            <span class="caption"></span>
        </div>
    </div>
    <div class="popup-right">
        <button class="btn-close">X</button>
    </div>
`;

  popupContainer
    .querySelector('.control-opacity > input')
    .addEventListener('input', (e) => updateOpacityValue(toolbarDiv, e.target.value));

  popupContainer
    .querySelector('.switch-layer > input')
    .addEventListener('change', (e) => toggleLayer(toolbarDiv, e.target.checked));

  popupContainer
    .querySelector('.btn-close')
    .addEventListener('click', () => togglePopup(toolbarDiv));

  togglePopup(toolbarDiv, opened);
  toggleLayer(toolbarDiv, enabled);
  updateOpacityValue(toolbarDiv, opacity);

  toggleAuthentication(toolbarDiv, authenticated);
}
