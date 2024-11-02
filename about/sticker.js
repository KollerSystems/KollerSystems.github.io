import { getRandNum } from './about.js';
function modifycolor(color, percent) {
  let num = parseInt(color, 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let B = (num >> 8 & 0x00FF) + amt;
  let G = (num & 0x0000FF) + amt;

  const squash = v => ( v < 255 ? (v < 1 ? 0 : v) : 255);

  return (
    0x1000000 +
    squash(R) * 0x10000 +
    squash(B) * 0x100 +
    squash(G)
  ).toString(16).slice(1);
};

let active;
let stickerContainer = document.getElementById('stickercontainer');
let stickers = stickerContainer.getElementsByTagName('div');

for (let sticker of stickers) {
  sticker.style.left = getRandNum(20, 80) + '%';
  sticker.style.top = getRandNum(20, 80) + '%';
}

let widthDiff;
let heightDiff;
window.addEventListener('resize', () => {
  widthDiff = window.innerWidth - stickerContainer.clientWidth;
  heightDiff = window.innerHeight - stickerContainer.clientHeight;
});
window.dispatchEvent(new Event('resize'));

let n = 0;
for (let div of stickers) {
  div.style.zIndex = n++;
  let bgcolor = div.style.background
    .slice(4, -1)
    .split(', ')
    .map(v => parseInt(v, 10).toString(16))
    .join('');

  div.style.borderColor = '#' + modifycolor(bgcolor, -10);

  div.addEventListener('mousedown', e => {
    active = e;
    active.container = e.currentTarget;
    stickerContainer.style.cursor = 'grabbing';

    let zIndex = Number(active.container.style.zIndex);
    for (let sticker of stickers) {
      let otherzIndex = Number(sticker.style.zIndex);
      if (otherzIndex > zIndex)
        sticker.style.zIndex = otherzIndex - 1;
    }

    active.container.style.zIndex = stickers.length - 1;

  });
}
stickerContainer.addEventListener('mouseup', () => {
  active = undefined;
    stickerContainer.style.cursor = '';
});

stickerContainer.addEventListener('mousemove', e => {
  if (active == undefined) return;

  active.container.style.left = e.x - widthDiff - active.layerX + 'px';
  active.container.style.top = e.y - heightDiff - active.layerY + 'px';
});
