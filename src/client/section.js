function toggleSectionTitle(element, title, hide) {
  // Remove previous children
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // Create anchor element
  const link = document.createElement('a');
  link.setAttribute('role', 'button');
  link.setAttribute('href', '#');
  link.className = `hide-toggle hide-toggle-background_list ${hide ? '' : 'expanded'}`;
  link.title = hide ? 'expand' : 'collapse';
  link.setAttribute('aria-expanded', hide ? 'false' : 'true');

  // Create icon element
  const svg = document.createElement('svg');
  svg.className = 'icon pre-text';

  const use = document.createElement('use');
  use.setAttribute('xlink:href', hide ? '#iD-icon-forward' : '#iD-icon-down');
  use.className = 'hide-toggle-icon';
  svg.appendChild(use);

  // Create span element for the text
  const spanText = document.createElement('span');
  spanText.className = 'hide-toggle-text';

  const localizedText = document.createElement('span');
  localizedText.className = 'localized-text';
  localizedText.setAttribute('lang', 'en-US');
  localizedText.textContent = title;

  spanText.appendChild(localizedText);

  // Append children to the link
  link.appendChild(svg);
  link.appendChild(spanText);

  // Append the link to the element
  element.appendChild(link);
}

function toggleSectionContent(element, hide) {
  element.classList.toggle('hide', hide);
}

function createSection(parentElement, title, hide = false) {
  const section = document.createElement('div');
  section.className = 'section';

  // Title Element
  const titleElement = document.createElement('h3');
  toggleSectionTitle(titleElement, title, hide);
  titleElement.addEventListener('click', () => {
    const hidden = content.classList.contains('hide');
    toggleSectionTitle(titleElement, title, !hidden);
    toggleSectionContent(content, !hidden);
  });
  section.appendChild(titleElement);

  // Content Element
  const content = document.createElement('div');
  content.className = 'disclosure-wrap';
  toggleSectionContent(content, hide);
  section.appendChild(content);

  // Append the section to the parent element
  parentElement.appendChild(section);

  return content;
}

export { createSection };
