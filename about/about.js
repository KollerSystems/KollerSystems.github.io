export function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  })
}
export function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

window.addEventListener('load', async () => {
  let wheelEvent = new WheelEvent('wheel', {deltaY: 0});
  window.dispatchEvent(wheelEvent);

});

window.addEventListener('wheel', e => {
  e.preventDefault();
  e.stopPropagation();

  let scrollContainer = document.getElementById('horizontalscrollcontainer');
  let scrollBlocks = scrollContainer.children;

  let index = -1;
  for (let i = 0; i < scrollBlocks.length; i++) {
    if (scrollBlocks[i].classList.contains('currentlyviewed')) {
      index = i;
      break;
    }
  }

  const limitedIndex = Math.min(Math.max(index + Math.sign(e.deltaY), 0), scrollBlocks.length - 1);
  scrollBlocks[index].classList.remove('currentlyviewed');
  scrollBlocks[limitedIndex].classList.add('currentlyviewed');

  for (let i = 0; i < scrollBlocks.length; i++) {
    scrollBlocks[i].style.left = ((i - limitedIndex) * 100) + '%';
  }
});
