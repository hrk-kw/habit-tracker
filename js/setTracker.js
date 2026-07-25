import { getExercisesByCategory, saveSetSession } from './db.js';
import { todayStr } from './util.js';
import * as badge from './badge.js';

const LONG_PRESS_MS = 400;

export function createSetTracker({ listElementId, saveButtonId, category, sessionType, showWeight, onSaved }) {
  let exercises = [];
  let pendingSets = new Map(); // exerciseId -> { weightKg, reps, count }
  let pressTimer = null;
  let longPressFired = false;
  let editingExerciseId = null;

  function lastLabel(exercise) {
    if (exercise.default_reps == null) return '前回なし';
    if (!showWeight) return `前回: ${exercise.default_reps}回`;
    if (exercise.default_weight_kg == null) return '前回なし';
    return `前回: ${exercise.default_weight_kg}kg × ${exercise.default_reps}回`;
  }

  function getEffective(exercise) {
    const pending = pendingSets.get(exercise.id);
    if (pending) return { weightKg: pending.weightKg, reps: pending.reps };
    return { weightKg: exercise.default_weight_kg, reps: exercise.default_reps };
  }

  function updateBadge(exerciseId) {
    const badgeEl = document.querySelector(`#${listElementId} .exercise-count-badge[data-exercise-id="${exerciseId}"]`);
    if (!badgeEl) return;
    const pending = pendingSets.get(exerciseId);
    const count = pending ? pending.count : 0;
    badgeEl.textContent = `${count} セット`;
    badgeEl.classList.toggle('has-sets', count > 0);
  }

  function addSet(exercise) {
    const effective = getEffective(exercise);
    const existing = pendingSets.get(exercise.id);
    if (existing) {
      existing.count += 1;
    } else {
      pendingSets.set(exercise.id, { weightKg: effective.weightKg, reps: effective.reps, count: 1 });
    }
    updateBadge(exercise.id);
  }

  function openEditor(exercise) {
    editingExerciseId = exercise.id;
    const effective = getEffective(exercise);
    document.getElementById('edit-modal-title').textContent = exercise.name;
    document.getElementById('edit-weight').closest('.field-label').style.display = showWeight ? '' : 'none';
    document.getElementById('edit-weight').value = effective.weightKg ?? '';
    document.getElementById('edit-reps').value = effective.reps ?? '';
    document.getElementById('edit-modal-overlay').classList.add('active');
  }

  function closeEditor() {
    editingExerciseId = null;
    document.getElementById('edit-modal-overlay').classList.remove('active');
  }

  function applyEditorValue() {
    if (editingExerciseId === null) return;
    const exercise = exercises.find((e) => e.id === editingExerciseId);
    const currentEffective = getEffective(exercise);
    const weightKg = parseFloat(document.getElementById('edit-weight').value);
    const reps = parseInt(document.getElementById('edit-reps').value, 10);
    const existing = pendingSets.get(editingExerciseId);
    // 空欄は「変更なし」として扱う(前回値をnullで消してしまわないため)
    pendingSets.set(editingExerciseId, {
      weightKg: showWeight ? (Number.isFinite(weightKg) ? weightKg : currentEffective.weightKg) : null,
      reps: Number.isFinite(reps) ? reps : currentEffective.reps,
      count: existing ? existing.count : 0,
    });
    updateBadge(editingExerciseId);
    closeEditor();
  }

  function decrementEditorCount() {
    if (editingExerciseId === null) return;
    const existing = pendingSets.get(editingExerciseId);
    if (existing && existing.count > 0) {
      existing.count -= 1;
      updateBadge(editingExerciseId);
    }
    closeEditor();
  }

  function bindRow(row, exercise) {
    row.addEventListener('pointerdown', (event) => {
      if (event.target.closest('.exercise-edit-btn')) return;
      longPressFired = false;
      pressTimer = setTimeout(() => {
        longPressFired = true;
        openEditor(exercise);
      }, LONG_PRESS_MS);
    });

    const cancelPress = () => {
      clearTimeout(pressTimer);
    };

    row.addEventListener('pointerup', (event) => {
      if (event.target.closest('.exercise-edit-btn')) return;
      clearTimeout(pressTimer);
      if (!longPressFired) {
        addSet(exercise);
      }
    });
    row.addEventListener('pointerleave', cancelPress);
    row.addEventListener('pointercancel', cancelPress);

    row.querySelector('.exercise-edit-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      openEditor(exercise);
    });
  }

  async function save() {
    const date = todayStr();
    const entries = Array.from(pendingSets, ([exerciseId, { weightKg, reps, count }]) => (
      { exerciseId, weightKg, reps, count }
    ));

    await saveSetSession(date, sessionType, entries);
    await badge.refresh();

    if (onSaved) {
      await onSaved({ exercises, entries });
    } else {
      location.hash = '#home';
    }
  }

  async function render() {
    exercises = await getExercisesByCategory(category);
    pendingSets = new Map();

    const list = document.getElementById(listElementId);
    list.innerHTML = '';

    for (const exercise of exercises) {
      const row = document.createElement('div');
      row.className = 'exercise-row';
      row.innerHTML = `
        <div>
          <div class="exercise-name">${exercise.name}</div>
          <div class="exercise-last">${lastLabel(exercise)}</div>
        </div>
        <button class="exercise-edit-btn" type="button" aria-label="編集">✎</button>
        <div class="exercise-count-badge" data-exercise-id="${exercise.id}">0 セット</div>
      `;
      bindRow(row, exercise);
      list.appendChild(row);
    }

    document.getElementById(saveButtonId).onclick = save;
    document.getElementById('edit-ok-btn').onclick = applyEditorValue;
    document.getElementById('edit-remove-btn').onclick = decrementEditorCount;
    document.getElementById('edit-cancel-btn').onclick = closeEditor;
  }

  return { render };
}
