import * as home from './home.js';
import * as gym from './gym.js';
import * as bike from './bike.js';
import * as hometrack from './hometrack.js';
import * as history from './history.js';
import * as badge from './badge.js';

const SCREENS = {
  '#home': { id: 'screen-home', title: '習慣トラッカー', module: home, showBack: false },
  '#gym': { id: 'screen-gym', title: 'ジム記録', module: gym, showBack: true },
  '#bike': { id: 'screen-bike', title: '自転車記録', module: bike, showBack: true },
  '#hometrack': { id: 'screen-hometrack', title: '家トレ記録', module: hometrack, showBack: true },
  '#history': { id: 'screen-history', title: '記録履歴', module: history, showBack: true },
};

function router() {
  const hash = SCREENS[location.hash] ? location.hash : '#home';
  const target = SCREENS[hash];

  document.querySelectorAll('.modal-overlay').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(target.id).classList.add('active');
  document.getElementById('app-title').textContent = target.title;
  document.getElementById('back-btn').classList.toggle('visible', target.showBack);

  target.module.render();
}

function initBackButton() {
  document.getElementById('back-btn').addEventListener('click', () => {
    location.hash = '#home';
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // オフラインキャッシュが使えないだけなので致命的ではない
    });
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  initBackButton();
  registerServiceWorker();
  router();
  badge.refresh();
});
