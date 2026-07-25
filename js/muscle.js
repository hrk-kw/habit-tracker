import { EXERCISE_MUSCLE_MAP } from './config.js';

const REGION_LABELS = {
  chest: '胸',
  shoulders: '肩',
  abs: '腹筋',
  back: '背中',
  lower_back: '腰',
  glutes: '尻',
  hamstrings: 'もも裏',
  legs: '脚(前もも)',
};

function bodySvg(activeRegions) {
  const cls = (region) => (activeRegions.has(region) ? 'region-active' : 'region-inactive');

  return `
<svg viewBox="0 0 220 200" width="100%" role="img" aria-label="今日鍛えた部位の図">
  <g>
    <circle cx="55" cy="18" r="13" class="region-inactive"></circle>
    <rect x="35" y="34" width="14" height="28" rx="6" class="${cls('shoulders')}"></rect>
    <rect x="71" y="34" width="14" height="28" rx="6" class="${cls('shoulders')}"></rect>
    <rect x="40" y="34" width="30" height="32" rx="6" class="${cls('chest')}"></rect>
    <rect x="42" y="68" width="26" height="26" rx="6" class="${cls('abs')}"></rect>
    <rect x="38" y="96" width="15" height="50" rx="6" class="${cls('legs')}"></rect>
    <rect x="57" y="96" width="15" height="50" rx="6" class="${cls('legs')}"></rect>
    <text x="55" y="186" text-anchor="middle" class="region-view-label">前面</text>
  </g>
  <g transform="translate(110,0)">
    <circle cx="55" cy="18" r="13" class="region-inactive"></circle>
    <rect x="35" y="34" width="14" height="28" rx="6" class="region-inactive"></rect>
    <rect x="71" y="34" width="14" height="28" rx="6" class="region-inactive"></rect>
    <rect x="40" y="34" width="30" height="32" rx="6" class="${cls('back')}"></rect>
    <rect x="42" y="68" width="26" height="20" rx="6" class="${cls('lower_back')}"></rect>
    <rect x="40" y="90" width="30" height="18" rx="6" class="${cls('glutes')}"></rect>
    <rect x="38" y="110" width="15" height="46" rx="6" class="${cls('hamstrings')}"></rect>
    <rect x="57" y="110" width="15" height="46" rx="6" class="${cls('hamstrings')}"></rect>
    <text x="55" y="186" text-anchor="middle" class="region-view-label">背面</text>
  </g>
</svg>`;
}

export function showMuscleResult({ exercises, entries }) {
  const workedNames = entries
    .filter((entry) => entry.count > 0)
    .map((entry) => exercises.find((ex) => ex.id === entry.exerciseId)?.name)
    .filter(Boolean);

  const regions = new Set();
  for (const name of workedNames) {
    const mapped = EXERCISE_MUSCLE_MAP[name];
    if (mapped) mapped.forEach((region) => regions.add(region));
  }

  document.getElementById('muscle-body-diagram').innerHTML = bodySvg(regions);

  const listEl = document.getElementById('muscle-region-list');
  listEl.innerHTML = regions.size === 0
    ? '<li>今日はマッピング対象の部位を鍛えていません</li>'
    : Array.from(regions).map((region) => `<li>${REGION_LABELS[region] ?? region}</li>`).join('');

  document.getElementById('muscle-modal-overlay').classList.add('active');

  return new Promise((resolve) => {
    document.getElementById('muscle-modal-close-btn').onclick = () => {
      document.getElementById('muscle-modal-overlay').classList.remove('active');
      location.hash = '#home';
      resolve();
    };
  });
}
