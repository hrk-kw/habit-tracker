import { TRACKS } from './config.js';
import { getLatestSessionDate } from './db.js';
import { computeElapsedDays, classifyColor } from './home.js';

export async function refresh() {
  if (!('setAppBadge' in navigator)) return;

  let overdueCount = 0;
  for (const track of TRACKS) {
    const latestDate = await getLatestSessionDate(track.type);
    const days = computeElapsedDays(latestDate);
    if (classifyColor(days, track) === 'red') {
      overdueCount += 1;
    }
  }

  if (overdueCount > 0) {
    navigator.setAppBadge(overdueCount);
  } else {
    navigator.clearAppBadge();
  }
}
