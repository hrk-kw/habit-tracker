import { createSetTracker } from './setTracker.js';
import { showMuscleResult } from './muscle.js';

const tracker = createSetTracker({
  listElementId: 'gym-exercise-list',
  saveButtonId: 'gym-save-btn',
  category: 'outer',
  sessionType: 'gym',
  showWeight: true,
  onSaved: showMuscleResult,
});

export const render = tracker.render;
