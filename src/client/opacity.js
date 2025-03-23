import { createSection } from './section.js';

// Function to initialize mouse listeners for opacity slider
export function initializeOpacitySlider(parentElement, initialValue, callback) {
  const section = createSection(parentElement, 'Display');
  const container = document.createElement('div');
  container.className = 'display-options-container controls-list';
  container.innerHTML = `
    <label class="display-control display-control-opacity">
      <span class="localized-text" lang="en-US">Opacity</span>
      <span class="display-option-value display-option-value-opacity">${Math.round(
        initialValue * 100
      )}%</span>
      <div class="control-wrap">
        <input class="display-option-input display-option-input-opacity" type="range" min="0" max="1" step="0.01" value="${initialValue}">
      </div>
      </label>
    `;
  section.appendChild(container);

  const opacityInput = container.querySelector('.display-option-input-opacity');
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
    Math.round(newValue * 100) + '%';

  callback(newValue);
}
