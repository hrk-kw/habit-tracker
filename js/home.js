import { TRACKS } from './config.js';
import { getLatestSessionDate } from './db.js';

function toLocalMidnight(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function computeElapsedDays(latestDateStr) {
  if (!latestDateStr) return null;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const last = toLocalMidnight(latestDateStr);
  return Math.floor((todayMidnight - last) / 86400000);
}

export function classifyColor(days, track) {
  if (days === null) return 'red';
  if (days <= track.green) return 'green';
  if (days <= track.yellow) return 'yellow';
  return 'red';
}

function daysLabel(days) {
  if (days === null) return '記録なし';
  if (days === 0) return '今日';
  return String(days);
}

export async function render() {
  const list = document.getElementById('card-list');
  list.innerHTML = '';

  for (const track of TRACKS) {
    const latestDate = await getLatestSessionDate(track.type);
    const days = computeElapsedDays(latestDate);
    const color = classifyColor(days, track);

    const card = document.createElement('a');
    card.href = track.hash;
    card.className = `card card--${color}`;
    card.innerHTML = `
      <span class="card-label">${track.label}</span>
      <span class="card-days">${daysLabel(days)}${days === null || days === 0 ? '' : '<span class="card-days-unit">日経過</span>'}</span>
    `;
    list.appendChild(card);
  }
}
