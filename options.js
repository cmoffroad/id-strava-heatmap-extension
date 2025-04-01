function togglePopup(popupContainer, open = popupContainer.style.display === 'none') {
  popupContainer.style.display = open ? 'flex' : 'none';
}

function toggleLayer(popupContainer, enabled) {
  const controls = popupContainer.querySelectorAll('.control select, .control input');
  controls.forEach((ctrl) => {
    ctrl.disabled = !enabled;
    ctrl.parentElement.classList.toggle('disabled', ctrl.disabled);
  });
}

function updateOpacityValue(popupContainer, value) {
  popupContainer.querySelector('.opacity-value').textContent = value + '%';
}

function toggleAuthentication(popupContainer, authenticated) {
  popupContainer.querySelector('.unauthenticated').style.display = authenticated
    ? 'none'
    : 'flex';
  popupContainer.querySelector('.authenticated').style.display = !authenticated
    ? 'none'
    : 'flex';
  popupContainer.querySelector('.logout-btn').style.display = !authenticated
    ? 'none'
    : 'block';
}

function initializeToolbar(
  containerSelector,
  { opened, enabled, authenticated, activity, color, opacity }
) {
  const containerElement = document.querySelector(containerSelector);

  const popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';
  popupContainer.style.display = 'none';

  const icon = document.createElement('img');
  icon.src = 'icons/icon-48.png';
  icon.alt = 'Extension Icon';
  icon.className = 'extension-icon';
  icon.addEventListener('click', () => togglePopup(popupContainer));
  containerElement.appendChild(icon);

  popupContainer.innerHTML = `
    <div class="popup-left">
        <span class="label">Strava Heatmap</span>
        <label class="switch">
            <input type="checkbox" class="toggle-heatmap" ${enabled ? 'checked' : ''} />
            <span class="slider"></span>
        </label>
    </div>
    <div class="popup-center unauthenticated">
        <div class="hint">
            Log in at <a href="https://www.strava.com/login?redirect=https%3A%2F%2Fwww.strava.com%2Fmaps" target="_blank">strava.com/login</a> and navigate to <b>Maps</b>
        </div>
    </div>
    <div class="popup-center authenticated">
        <div class="control">
            <span class="label">Activity</span>
            <select id="activity-select">
                <option value="all" ${activity === 'all' ? 'selected' : ''}>All</option>
                <option value="ride" ${
                  activity === 'ride' ? 'selected' : ''
                }>Ride</option>
                <option value="winter" ${
                  activity === 'winter' ? 'selected' : ''
                }>Winter</option>
            </select>
        </div>
        <div class="control">
            <span class="label">Color</span>
            <select id="color-select">
                <option ${color === 'Hot' ? 'selected' : ''}>Hot</option>
                <option ${color === 'Blue Red' ? 'selected' : ''}>Blue Red</option>
            </select>
        </div>
        <div class="control">
            <span class="label">Opacity</span>
            <input type="range" min="0" max="100" class="opacity-slider" value="${opacity}" />
            <span class="opacity-value"></span>
        </div>
    </div>
    <div class="popup-right">
        <button class="logout-btn">Log Out</button>
        <button class="close-btn">X</button>
    </div>
`;

  containerElement.appendChild(popupContainer);

  popupContainer
    .querySelector('.opacity-slider')
    .addEventListener('input', (e) => updateOpacityValue(popupContainer, e.target.value));

  popupContainer
    .querySelector('.toggle-heatmap')
    .addEventListener('change', (e) => toggleLayer(popupContainer, e.target.checked));

  popupContainer
    .querySelector('.close-btn')
    .addEventListener('click', () => togglePopup(popupContainer));

  togglePopup(popupContainer, opened);
  toggleLayer(popupContainer, enabled);
  updateOpacityValue(popupContainer, opacity);

  toggleAuthentication(popupContainer, authenticated);
}
