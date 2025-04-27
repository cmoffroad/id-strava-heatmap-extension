import Sortable from '../../../lib/sortablejs@1.15.0.esm.min.js';

import {
  formatLayerPresets,
  getLayerPresets,
  setLayerPresets,
  resetLayerPresets,
} from '../layers.js';
import { ACTIVITY_OPTIONS, COLOR_OPTIONS } from '../../clients/common/layers.js';

const MAX_LAYERS = 8;

function createActivitySelect(selected) {
  const select = document.createElement('select');

  ACTIVITY_OPTIONS.forEach(([groupLabel, activities]) => {
    let optgroup;
    if (groupLabel !== '_') {
      optgroup = document.createElement('optgroup');
      optgroup.label = groupLabel;
      select.appendChild(optgroup);
    }
    activities.forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      if (value === selected) option.selected = true;
      if (optgroup) optgroup.appendChild(option);
      else select.appendChild(option);
    });
  });
  return select;
}

function createColorPicker(selected) {
  const select = document.createElement('select');
  COLOR_OPTIONS.forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === selected) option.selected = true;
    select.appendChild(option);
  });
  return select;
}

function createLayerItem(layer, index, removeCallback, changeCallback) {
  const li = document.createElement('li');
  li.className = 'layer';
  li.dataset.index = index;

  const dragHandle = document.createElement('span');
  dragHandle.className = 'drag-handle';
  dragHandle.textContent = '⠿'; //'☰';

  const activitySelect = createActivitySelect(layer.activity);
  activitySelect.onchange = () => changeCallback();
  const colorSelect = createColorPicker(layer.color);
  colorSelect.onchange = () => changeCallback();

  const deleteButton = document.createElement('button');
  deleteButton.className = 'layer-remove';
  deleteButton.textContent = '🗑️';
  deleteButton.onclick = () => removeCallback(index);

  li.appendChild(dragHandle);
  li.appendChild(activitySelect);
  li.appendChild(colorSelect);
  li.appendChild(deleteButton);

  return li;
}

async function renderLayers(layers) {
  const list = document.getElementById('layer-list');
  list.innerHTML = '';

  layers.forEach((layer, i) => {
    const item = createLayerItem(
      layer,
      i,
      async (index) => {
        layers.splice(index, 1);
        await renderLayers(layers);
      },
      async () => {
        const current = getCurrentLayers();
        await renderLayers(current);
      }
    );
    list.appendChild(item);
  });

  const layerPresets = await getLayerPresets();
  const hasChanges = formatLayerPresets(layerPresets) !== formatLayerPresets(layers);

  document.querySelector('#layer-list .layer button').disabled = layers.length === 1;
  document.getElementById('add-layer').disabled = layers.length >= MAX_LAYERS;

  document.getElementById('apply-settings').disabled = !hasChanges;
  document.getElementById('apply-settings').textContent = hasChanges
    ? 'Apply changes'
    : 'No changes found';
}

function getCurrentLayers() {
  const items = [...document.querySelectorAll('#layer-list .layer')];
  return items.map((item) => {
    const selects = item.querySelectorAll('select');
    return {
      activity: selects[0].value,
      color: selects[1].value,
    };
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const layerPresets = await getLayerPresets();
  await renderLayers(layerPresets);

  const list = document.getElementById('layer-list');
  Sortable.create(list, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: async () => {
      const current = getCurrentLayers();
      await renderLayers(current);
    },
  });

  document.getElementById('close-settings').addEventListener('click', async () => {
    window.close();
  });

  document.getElementById('add-layer').addEventListener('click', async () => {
    const current = getCurrentLayers();
    if (current.length < MAX_LAYERS) {
      const { activity, color } = current[current.length - 1];
      current.push({ activity, color });
      await renderLayers(current);
    }
  });

  document.getElementById('apply-settings').addEventListener('click', async () => {
    const current = getCurrentLayers();
    if (current.length >= 1) {
      await setLayerPresets(current);
      window.close();
    }
  });
});
