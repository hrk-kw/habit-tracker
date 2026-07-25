import { INITIAL_EXERCISES } from './config.js';

const DB_NAME = 'habitTrackerDB';
const DB_VERSION = 1;

let dbPromise = null;

function promisifyRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = req.result;

      if (event.oldVersion < 1) {
        const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id', autoIncrement: true });
        exerciseStore.createIndex('category', 'category', { unique: false });

        const setLogStore = db.createObjectStore('setLogs', { keyPath: 'id', autoIncrement: true });
        setLogStore.createIndex('session_id', 'session_id', { unique: false });
        setLogStore.createIndex('exercise_id', 'exercise_id', { unique: false });
        setLogStore.createIndex('date', 'date', { unique: false });

        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
        sessionStore.createIndex('type_date', ['type', 'date'], { unique: false });
        sessionStore.createIndex('date', 'date', { unique: false });

        for (const exercise of INITIAL_EXERCISES) {
          exerciseStore.add(exercise);
        }
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function getExercisesByCategory(category) {
  const db = await openDb();
  const tx = db.transaction('exercises', 'readonly');
  const index = tx.objectStore('exercises').index('category');
  return promisifyRequest(index.getAll(category));
}

export async function addSession(session) {
  const db = await openDb();
  const tx = db.transaction('sessions', 'readwrite');
  const id = await promisifyRequest(tx.objectStore('sessions').add(session));
  return id;
}

export async function getLatestSessionDate(type) {
  const db = await openDb();
  const tx = db.transaction('sessions', 'readonly');
  const index = tx.objectStore('sessions').index('type_date');
  const range = IDBKeyRange.bound([type, '0000-00-00'], [type, '9999-99-99']);

  return new Promise((resolve, reject) => {
    const cursorReq = index.openCursor(range, 'prev');
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      resolve(cursor ? cursor.value.date : null);
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

// セッション作成・セットログ一括追加・前回値更新を1トランザクションで行う(途中失敗時に片方だけ残る不整合を防ぐ)。
export async function saveGymSession(date, entries) {
  const db = await openDb();
  const tx = db.transaction(['sessions', 'setLogs', 'exercises'], 'readwrite');
  const sessionStore = tx.objectStore('sessions');
  const setLogStore = tx.objectStore('setLogs');
  const exerciseStore = tx.objectStore('exercises');

  const sessionReq = sessionStore.add({ date, type: 'gym' });
  sessionReq.onsuccess = () => {
    const sessionId = sessionReq.result;
    for (const { exerciseId, weightKg, reps, count } of entries) {
      if (count <= 0) continue;
      for (let setIndex = 1; setIndex <= count; setIndex += 1) {
        setLogStore.add({
          session_id: sessionId,
          exercise_id: exerciseId,
          date,
          weight_kg: weightKg,
          reps,
          set_index: setIndex,
          timestamp: Date.now(),
        });
      }
      exerciseStore.get(exerciseId).onsuccess = (event) => {
        const exercise = event.target.result;
        if (!exercise) return;
        exercise.default_weight_kg = weightKg;
        exercise.default_reps = reps;
        exerciseStore.put(exercise);
      };
    }
  };

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
