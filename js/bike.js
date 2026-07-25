import { addSession } from './db.js';
import { todayStr } from './util.js';
import * as badge from './badge.js';

let selectedMode = null;

function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.mode === mode);
  });
}

async function save() {
  if (!selectedMode) {
    window.alert('「実走」か「ジムの固定バイク」を選んでください');
    return;
  }

  const durationInput = document.getElementById('bike-duration').value;
  const duration = durationInput === '' ? null : parseInt(durationInput, 10);
  const note = document.getElementById('bike-note').value.trim() || null;

  await addSession({
    date: todayStr(),
    type: 'bike',
    bike_mode: selectedMode,
    duration_min: Number.isFinite(duration) ? duration : null,
    note,
  });

  await badge.refresh();
  location.hash = '#home';
}

export async function render() {
  selectedMode = null;
  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => btn.classList.remove('selected'));
  document.getElementById('bike-duration').value = '';
  document.getElementById('bike-note').value = '';

  document.querySelectorAll('#bike-form .toggle-btn').forEach((btn) => {
    btn.onclick = () => selectMode(btn.dataset.mode);
  });
  document.getElementById('bike-save-btn').onclick = save;
}
