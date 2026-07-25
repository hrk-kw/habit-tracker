import { getExercisesByCategory, getSetLogsByExercise, getRecentSessions } from './db.js';

const SET_LOGS_PER_EXERCISE = 5;
const SESSIONS_PER_TRACK = 10;

function groupBySession(setLogs) {
  const bySession = new Map();
  for (const log of setLogs) {
    const existing = bySession.get(log.session_id);
    if (existing) {
      existing.count += 1;
    } else {
      bySession.set(log.session_id, { date: log.date, weightKg: log.weight_kg, reps: log.reps, count: 1 });
    }
  }
  return Array.from(bySession.values());
}

function bikeSessionLabel(session) {
  const modeLabel = session.bike_mode === 'gym_machine' ? 'ジムの固定バイク' : '実走';
  const parts = [modeLabel];
  if (session.duration_min != null) parts.push(`${session.duration_min}分`);
  if (session.distance_km != null) parts.push(`${session.distance_km}km`);
  if (session.resistance_level != null) parts.push(`負荷${session.resistance_level}`);
  return parts.join(' / ');
}

function entryLabel(session, showWeight) {
  if (showWeight) return `${session.date}: ${session.weightKg}kg × ${session.reps}回 × ${session.count}セット`;
  return `${session.date}: ${session.reps}回 × ${session.count}セット`;
}

async function renderExerciseHistory(category, containerId, showWeight) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const exercises = await getExercisesByCategory(category);
  for (const exercise of exercises) {
    const logs = await getSetLogsByExercise(exercise.id, SET_LOGS_PER_EXERCISE * 10);
    const sessions = groupBySession(logs).slice(0, SET_LOGS_PER_EXERCISE);
    if (sessions.length === 0) continue;

    const block = document.createElement('div');
    block.className = 'history-block';
    block.innerHTML = `
      <div class="history-exercise-name">${exercise.name}</div>
      <ul class="history-entry-list">
        ${sessions.map((s) => `<li>${entryLabel(s, showWeight)}</li>`).join('')}
      </ul>
    `;
    container.appendChild(block);
  }

  if (container.innerHTML === '') {
    container.innerHTML = '<p class="screen-hint">まだ記録がありません</p>';
  }
}

async function renderBikeHistory() {
  const container = document.getElementById('history-bike');
  const sessions = await getRecentSessions('bike', SESSIONS_PER_TRACK);

  container.innerHTML = sessions.length === 0
    ? '<p class="screen-hint">まだ記録がありません</p>'
    : `<ul class="history-entry-list">${sessions.map((s) => `<li>${s.date}: ${bikeSessionLabel(s)}</li>`).join('')}</ul>`;
}

export async function render() {
  await Promise.all([
    renderExerciseHistory('outer', 'history-gym', true),
    renderBikeHistory(),
    renderExerciseHistory('inner', 'history-home', false),
  ]);
}
