const COLORS = {
  blue: 'Blue',
  hot: 'Hot',
  gray: 'Gray',
  purple: 'Purple',
  bluered: 'Blue Red',
  orange: 'Orange',
};

export function initializeColorList(parentElement, initialValue, callback) {
  const container = document.createElement('div');
  container.innerHTML = `
    <ul class="layer-list layer-fill-list">
      ${Object.entries(COLORS)
        .map(
          ([color, label]) => `
            <li class="${color === initialValue ? 'active' : ''}">
                <label>
                <input type="radio" name="strava_heatmap_color" value="${color}" checked=${
            color === initialValue ? 'true' : 'false'
          }>
                    <span><span class="localized-text" lang="en-US">${label}</span></span>
                </label>
            </li>`
        )
        .join('\n')}
    </ul>
    `;

  container
    .querySelectorAll('input[type="radio"][name="strava_heatmap_color"]')
    .forEach((radio) => {
      radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          const selectedColor = event.target.value;
          event.target.closest('li').classList.toggle('active', true);
          callback(selectedColor);
        }
      });
    });

  parentElement.appendChild(container);
}
