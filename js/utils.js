// js/utils.js
export function isMobile() {
  return window.innerWidth <= 768;
}

export function updateTitle(hash) {
  const titles = {
    '#home': 'RWR Music - Home',
    '#about': 'RWR Music - About',
    '#music': 'RWR Music - Music',
    '#contact': 'RWR Music - Contact'
  };
  document.title = titles[hash] || 'RWR Music';
}