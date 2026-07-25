import { addSession } from './db.js';
import { todayStr } from './util.js';
import * as badge from './badge.js';

let selectedMode = null;

function updateGymFieldsVisibility() {
  const isGymMachine = selectedMode === 'gym_machine';
  document.getElementById('bike-distance-field').classList.toggle('hidden', !isGymMachine);
  document.getElementById('bike-resistance-field').classList.toggle('hidden', !isGymMachine);
}

function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.mode === mode);
  });
  updateGymFieldsVisibility();
}

function parseOptionalNumber(elementId, parser) {
  const raw = document.getElementById(elementId).value;
  if (raw === '') return null;
  const value = parser(raw);
  return Number.isFinite(value) ? value : null;
}

async function save() {
  if (!selectedMode) {
    window.alert('「実走」か「ジムの固定バイク」を選んでください');
    return;
  }

  const isGymMachine = selectedMode === 'gym_machine';
  const duration = parseOptionalNumber('bike-duration', (v) => parseInt(v, 10));
  const note = document.getElementById('bike-note').value.trim() || null;

  await addSession({
    date: todayStr(),
    type: 'bike',
    bike_mode: selectedMode,
    duration_min: duration,
    distance_km: isGymMachine ? parseOptionalNumber('bike-distance', parseFloat) : null,
    resistance_level: isGymMachine ? parseOptionalNumber('bike-resistance', (v) => parseInt(v, 10)) : null,
    note,
  });

  await badge.refresh();
  location.hash = '#home';
}

export async function render() {
  selectedMode = null;
  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => btn.classList.remove('selected'));
  document.getElementById('bike-duration').value = '';
  document.getElementById('bike-distance').value = '';
  document.getElementById('bike-resistance').value = '';
  document.getElementById('bike-note').value = '';
  updateGymFieldsVisibility();

  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => {
    btn.onclick = () => selectMode(btn.dataset.mode);
  });
  document.getElementById('bike-save-btn').onclick = save;
}
