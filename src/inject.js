const settings = {
  opacity: 0.5,
  color: 'hot',
};

// Initialize the observer to monitor for `div.layer.layer-overlay` elements and their children
export function initializeStravaHeatmapTileObserver() {
  // Get the supersurface element
  const supersurface = document.querySelector('.supersurface');

  // Check if supersurface exists
  if (!supersurface) {
    console.error('Supersurface element not found');
    return;
  }

  // Create an intersection observer to track changes in the supersurface element
  const observer = new MutationObserver((mutationsList) => {
    // Iterate over each mutation
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'DIV' && node.classList.contains('layer-overlay')) {
            // Check for images with the specific Strava heatmap URL
            const imgTiles = node.querySelectorAll(
              'img.tile[src*="heatmap-external-a.strava.com/tiles"]'
            );
            imgTiles.forEach((img) => {
              applySettingsToStravaHeatmapTile(img);
            });
          }
        });
      }
    });
  });

  // Set up the observer to watch for child list changes in supersurface
  observer.observe(supersurface, { childList: true, subtree: true });
}

// Update opacity for all existing and future heatmap tiles
export function updateExistingStravaHeatmapTiles() {
  const supersurface = document.querySelector('.supersurface');
  const images = supersurface.querySelectorAll(
    'img.tile[src*="heatmap-external-a.strava.com/tiles"]'
  );
  images.forEach((img) => {
    applySettingsToStravaHeatmapTile(img);
  });
}

export function applySettingsToStravaHeatmapTile(img) {
  img.style.opacity = settings.opacity;
  return (img.src = img.src.replace(
    /^https:\/\/heatmap-external-(.*)\.strava\.com\/tiles\/(all|ride|run|water|winter)\/(.*?)\/(\d+)\/(\d+)\/(\d+)\.png/,
    `https://heatmap-external-$1.strava.com/tiles/$2/${settings.color}/$4/$5/$6.png`
  ));
}

// Function to update slider value based on mouse position
function updateSliderValue(opacityInput, event, callback) {
  const rect = opacityInput.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;

  // Ensure the value stays within 0 to 1 range
  const sliderWidth = rect.width;
  const newValue = Math.max(0, Math.min(1, mouseX / sliderWidth));

  // Update the slider value
  opacityInput.value = newValue;

  // Optionally, update a visual display (e.g., a percentage display)
  document.querySelector('.display-option-value-opacity').textContent =
    (newValue * 100).toFixed(0) + '%';

  callback(newValue);
}

// Function to initialize mouse listeners for opacity slider
function initializeOpacitySlider(callback) {
  const opacityInput = document.querySelector('.display-option-input-opacity');
  if (!opacityInput) return;

  let isMouseDown = false;

  // Mouse down event to start tracking
  opacityInput.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    updateSliderValue(opacityInput, event, callback); // Update the value immediately on click

    // Mouse move event to update slider while dragging
    const onMouseMove = (moveEvent) => {
      if (isMouseDown) {
        updateSliderValue(opacityInput, moveEvent, callback);
      }
    };

    // Attach mousemove event to the document
    document.addEventListener('mousemove', onMouseMove);

    // Mouse up event to stop tracking
    document.addEventListener('mouseup', () => {
      isMouseDown = false;
      // Remove mousemove event listener once the mouse button is released
      document.removeEventListener('mousemove', onMouseMove);
    });
  });
}

function detectColorChange(callback) {
  // Select all radio buttons with the name 'strava_heatmap_color'
  const radioButtons = document.querySelectorAll(
    'input[type="radio"][name="strava_heatmap_color"]'
  );

  // Add an event listener to each radio button
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (event.target.checked) {
        const selectedColor = event.target.value;
        console.log(`Selected heatmap color: ${selectedColor}`);

        // Do something with the selected color (e.g., update the map)
        callback(selectedColor);
      }
    });
  });
}

function waitForPaneContent(callback) {
  const observer = new MutationObserver((mutationsList, observer) => {
    if (document.querySelector('.pane-content')) {
      observer.disconnect(); // Stop observing once found
      callback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForPaneContent(() => {
  const paneContent = document.querySelector('.pane-content');
  if (paneContent) {
    const sectionHTML = `
      <div class="section section-background-display-options">
        <h3>
          <a role="button" href="#" class="hide-toggle hide-toggle-background_display_options expanded" title="collapse" aria-expanded="true">
            <svg class="icon pre-text">
              <use xlink:href="#iD-icon-down" class="hide-toggle-icon"></use>
            </svg>
            <span class="hide-toggle-text">
              <span class="localized-text" lang="en-US">Strava Heatmap</span>
            </span>
          </a>
        </h3>
        <div class="disclosure-wrap disclosure-wrap-background_display_options">
          <div class="display-options-container controls-list">
            <label class="display-control display-control-opacity">
              <span class="localized-text" lang="en-US">Opacity</span>
              <span class="display-option-value display-option-value-opacity">50%</span>
              <div class="control-wrap">
                <input class="display-option-input display-option-input-opacity" type="range" min="0" max="1" step="0.01">
                <!--<button title="reset Opacity" class="display-option-reset display-option-reset-opacity disabled">
                  <svg class="icon">
                    <use xlink:href="#iD-icon-undo"></use>
                  </svg>
                </button>-->
              </div>
            </label>
            <!--<a class="display-option-resetlink" role="button" href="#">
              <span class="localized-text" lang="en-US">Reset All</span>
            </a>-->
          </div>
        </div>
        <ul class="layer-list layer-fill-list">
            <li>
                <label>
                <input type="radio" name="strava_heatmap_color" value="hot">
                <span><span class="localized-text" lang="en-US">Hot</span></span>
                </label>
            </li>
            <li class="active">
                <label>
                <input type="radio" name="strava_heatmap_color" value="blue">
                <span><span class="localized-text" lang="en-US">Blue</span></span>
                </label>
            </li>
            </ul>
      </div>
    `;

    paneContent.insertAdjacentHTML('beforeend', sectionHTML);

    // Call this function to initialize the observer once the page is loaded
    initializeStravaHeatmapTileObserver();

    // Initialize the opacity slider functionality
    initializeOpacitySlider((opacity) => {
      settings.opacity = opacity;
      updateExistingStravaHeatmapTiles();
    });

    detectColorChange((color) => {
      settings.color = color;
      updateExistingStravaHeatmapTiles();
    });
  }
});
