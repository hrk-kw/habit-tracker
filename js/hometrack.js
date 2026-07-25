import { createSetTracker } from './setTracker.js';

const tracker = createSetTracker({
  listElementId: 'hometrack-exercise-list',
  saveButtonId: 'hometrack-save-btn',
  category: 'inner',
  sessionType: 'home',
  showWeight: false,
});

export const render = tracker.render;
