import { createSection } from './section.js';

const COLORS = {
  blue: 'Blue',
  hot: 'Hot',
  gray: 'Gray',
  purple: 'Purple',
  bluered: 'Blue Red',
  orange: 'Orange',
};

export function initializeColorList(parentElement, initialValue, callback) {
  const section = createSection(parentElement, 'Color');
  const container = document.createElement('div');
  const ul = document.createElement('ul');
  ul.className = 'layer-list layer-fill-list';

  Object.entries(COLORS).forEach(([color, label]) => {
    const li = document.createElement('li');
    if (color === initialValue) li.classList.add('active');

    const labelElement = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'strava_heatmap_color';
    input.value = color;
    input.checked = color === initialValue;

    input.addEventListener('change', () => {
      ul.querySelector('.active')?.classList.remove('active');
      li.classList.add('active');
      callback(color);
    });

    const span = document.createElement('span');
    const localizedText = document.createElement('span');
    localizedText.className = 'localized-text';
    localizedText.lang = 'en-US';
    localizedText.textContent = label;

    span.appendChild(localizedText);
    labelElement.append(input, span);
    li.appendChild(labelElement);
    ul.appendChild(li);
  });

  container.appendChild(ul);
  section.appendChild(container);
}
