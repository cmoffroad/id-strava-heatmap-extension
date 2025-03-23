function toggleSectionTitle(element, title, hide) {
  element.innerHTML = hide
    ? `<a role="button" href="#" class="hide-toggle hide-toggle-background_list" title="expand" aria-expanded="false"><svg class="icon pre-text"><use xlink:href="#iD-icon-forward" class="hide-toggle-icon"></use></svg><span class="hide-toggle-text"><span class="localized-text" lang="en-US">${title}</span></span></a>>`
    : `<a role="button" href="#" class="hide-toggle hide-toggle-background_list expanded" title="collapse" aria-expanded="true"><svg class="icon pre-text"><use xlink:href="#iD-icon-down" class="hide-toggle-icon"></use></svg><span class="hide-toggle-text"><span class="localized-text" lang="en-US">${title}</span></span></a>`;
}

function toggleSectionContent(element, hide) {
  element.classList.toggle('hide', hide);
}

function createSection(parentElement, title, hide) {
  const section = document.createElement('div');
  section.className = 'section';

  const titleElement = document.createElement('h3');
  toggleSectionTitle(titleElement, title, hide);
  titleElement.addEventListener('click', () => {
    const hidden = content.className.includes('hide');
    toggleSectionTitle(titleElement, title, !hidden);
    toggleSectionContent(content, !hidden);
  });
  section.appendChild(titleElement);

  const content = document.createElement('div');
  content.className = 'disclosure-wrap';
  toggleSectionContent(content, hide);
  section.appendChild(content);

  parentElement.appendChild(section);
  return content;
}

export { createSection };
