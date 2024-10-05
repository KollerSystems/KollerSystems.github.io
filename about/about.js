// import init, { calc_next_prime } from "../wasm/pkg/wasm_lib.js";
// init().then(() => {
//   let p = 2;
//   while (p < 100000) {
//     console.log(p);
//     p = calc_next_prime(p);
//   }
// });

function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  })
}

async function updateCounterDigit(digitN, time, numarr, type = 1) {
  const animationType = {
    0: 'ease-in',
    1: 'linear',
    2: 'ease-out',
    4: 'ease'
  }

  const counter = document.getElementById('counter');
  const digit = counter.children[digitN];

  digit.style.top = digit.clientTop + 'px';
  digit.style.transition = `top ${time}ms ${animationType[type]}`;

  for (let num of numarr) {
    let div = document.createElement('div');
    let char = document.createTextNode(num);
    div.appendChild(char);

    digit.appendChild(div);
  }

  await sleep(1);

  const divHeightUnit = 12;
  let numdiff = digit.children.length - 1;

  digit.style.top = numdiff * -1 * divHeightUnit + 'em';

  await sleep(time);
  digit.style.transition = '';
  await sleep(1);
  digit.style.top = '0em';
  for (let i = 0; i < numdiff; i++) {
    digit.children[0].remove();
  }
}

window.addEventListener('load', async () => {
  let wheelEvent = new WheelEvent('wheel', {deltaY: 0});
  window.dispatchEvent(wheelEvent);

  await sleep(1000);
  await updateCounterDigit(1, 500, [ 6, 7, 8, 9, 0 ], 0);
  updateCounterDigit(0, 100, [ 3 ], 4);
  await updateCounterDigit(1, 400, [ 1, 2, 3, 4 ], 2);
});

window.addEventListener('wheel', e => {
  e.preventDefault();
  e.stopPropagation();

  let scrollContainer = document.getElementById('horizontalscrollcontainer');
  let scrollBlocks = scrollContainer.children;
  console.log(scrollBlocks)
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

/*
 * IDEA
 * box with overflows hidden (and colored gradient edges from bg color to transparent)
 * calling an updateCounter function pushes new DOM object(num) below visibility(or more if it's more to update)
 * it essentially creates a column of numbers to this
 * that column then gets moved (with css transform animations applied)
 * */
