import { getExercisesByCategory, addSession } from './db.js';
import { todayStr } from './util.js';
import * as badge from './badge.js';

async function save() {
  const checked = Array.from(document.querySelectorAll('#hometrack-checklist input:checked'))
    .map((input) => input.dataset.name);

  if (checked.length === 0) {
    window.alert('1つ以上チェックしてください');
    return;
  }

  await addSession({
    date: todayStr(),
    type: 'home',
    note: checked.join('、'),
  });

  await badge.refresh();
  location.hash = '#home';
}

export async function render() {
  const exercises = await getExercisesByCategory('inner');
  const list = document.getElementById('hometrack-checklist');
  list.innerHTML = '';

  for (const exercise of exercises) {
    const item = document.createElement('label');
    item.className = 'checklist-item';
    item.innerHTML = `
      <input type="checkbox" data-name="${exercise.name}">
      <span>${exercise.name}</span>
    `;
    list.appendChild(item);
  }

  document.getElementById('hometrack-save-btn').onclick = save;
}
