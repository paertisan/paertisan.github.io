// js/utils.js
export function isMobile() {
  return window.innerWidth <= 768;
}

export function updateThemeColor(color) {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color);
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'theme-color';
    newMeta.content = color;
    document.head.appendChild(newMeta);
  }
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