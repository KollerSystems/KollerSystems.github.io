import init, { calc_next_prime } from "../wasm/pkg/wasm_lib.js";


const DIGITS = 5;
const QUOTE = 'Ahol a gatyám van, ott a gatyám van... Mert a gatyám rajtam van.';


function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  })
}

// Generate a new array such that: [start; stop[ -- where every item is an integer
function range(start, stop) {
  return [...Array(stop - start).keys()]
    .map(v => v + start);
}
function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function createRecursiveTimeout(callback, timerFunc) {
  setTimeout(async () => {
    await callback();
    createRecursiveTimeout(callback, timerFunc);
  }, timerFunc());
};

async function updateCounterDigit(digitN, timePerNum, numarr, type = 'linear') {
  const totalTime = timePerNum * numarr.length;

  const digit = document.querySelectorAll('#counter > div')[digitN];

  digit.style.top = digit.clientTop + 'px';
  digit.style.transition = `top ${totalTime}ms ${type}`;

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

  await sleep(totalTime);
  digit.style.transition = '';
  await sleep(1);
  digit.style.top = '0em';
  for (let i = 0; i < numdiff; i++) {
    digit.children[0].remove();
  }
}

async function updateCounterDigitAbstract(
  digitN,
  toNum,
  timePerNum,
  maxTimePerNum,
  timeIncreasePerDigit,
  linearFrom,
  enforcedAnimation = undefined
) {
  const animationType = (time, fallbackType = 'ease') => {
    if (enforcedAnimation ?? '') return enforcedAnimation;
    return time <= linearFrom ? 'linear' : fallbackType;
  }
  const getDigit = decPlaceIndex => {
    return parseInt(
      document.querySelectorAll('#counter > div')[decPlaceIndex]
        .children[0]
        .innerHTML,
      10
    );
  };

  if (toNum == 10) { toNum = 0 };

  let digit = getDigit(digitN);
  let time = (DIGITS - digitN - 1) * timeIncreasePerDigit + timePerNum;
  if (time > maxTimePerNum) time = maxTimePerNum;

  if (toNum > digit) {
    await updateCounterDigit(digitN, time, range(digit + 1, toNum + 1), animationType(time, 'ease'))
  } else {
    await updateCounterDigit(digitN, time, range(digit + 1, 10).concat(0), animationType(time, toNum == 0 ? 'ease' : 'ease-in'))

    updateCounterDigitAbstract(digitN - 1, getDigit(digitN - 1) + 1, timePerNum, maxTimePerNum, timeIncreasePerDigit, linearFrom);

    await updateCounterDigit(digitN, time, range(1, toNum + 1), animationType(time, 'ease-out'));
  }

}


window.addEventListener('load', async () => {
  let wheelEvent = new WheelEvent('wheel', {deltaY: 0});
  window.dispatchEvent(wheelEvent);


  const quoteContainer = document.getElementById('quote');
  const quoteH1 = quoteContainer.getElementsByTagName('h1')[0];

  for (let word of QUOTE.split(' ')) {
    let span = document.createElement('span');
    span.innerText = word + ' ';
    quoteH1.appendChild(span);
  }

  await sleep(750);
  const quoteParts = quoteH1.getElementsByTagName('span');

  quoteH1.classList.add('animate');
  for (let i = 0; i < quoteParts.length; i++) {
    await sleep(100);
    quoteParts[i].classList.add('animate');
  }

  setTimeout(()=>{
    quoteH1.classList.add('disanimate');
    [ document.getElementById('countercontainer'), document.getElementById('counter') ]
      .forEach(element => element.classList.add('fadeover'));
  }, 3500);
  await sleep(2500);

  // timer start
  await init();
  let limit = getRandNum(10_000, 100_000);
  let prime = 1;
  while (prime < limit)
    prime = calc_next_prime(prime);

  const digitContainer = document.getElementById('counter');
  let primeByDigits = prime.toString().split('');
  for (let i = 0; i < DIGITS; i++) {
    let containerDiv = document.createElement('div');
    let holderDiv = document.createElement('div');

    holderDiv.innerHTML = primeByDigits[i];

    containerDiv.appendChild(holderDiv);
    digitContainer.appendChild(containerDiv);
  }

  let animationParams = [45, 45 * 3, 45 * 2, 45];

  let runs = getRandNum(10, 100);
  await sleep(1000);
  for (let i = 0; i < runs; i++)
    await updateCounterDigitAbstract(DIGITS - 1, 10, ...animationParams);
  await updateCounterDigitAbstract(DIGITS - 1, getRandNum(1, 10), ...animationParams, 'ease-out');

  createRecursiveTimeout(async () => {
    await updateCounterDigitAbstract(DIGITS - 1, getRandNum(1, 10), 100, 200, 200, 45);
  }, getRandNum.bind(null, 100, 10000));
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

/*
 * IDEA
 * box with overflows hidden (and colored gradient edges from bg color to transparent)
 * calling an updateCounter function pushes new DOM object(num) below visibility(or more if it's more to update)
 * it essentially creates a column of numbers to this
 * that column then gets moved (with css transform animations applied)
 * */
