import { createSetTracker } from './setTracker.js';

const tracker = createSetTracker({
  listElementId: 'gym-exercise-list',
  saveButtonId: 'gym-save-btn',
  category: 'outer',
  sessionType: 'gym',
  showWeight: true,
});

export const render = tracker.render;
