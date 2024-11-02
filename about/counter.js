import init, { calc_next_prime } from "../wasm/pkg/wasm_lib.js";
import { sleep, getRandNum } from './about.js';

const DIGITS = 5;
const QUOTE = 'Ahol a gatyám van, ott a gatyám van... Mert a gatyám rajtam van.';
const MAXSTARS = 13;

function radToDeg(rad) {
  return (rad * (180 / Math.PI));
}

// Generate a new array such that: [start; stop[ -- where every item is an integer
function range(start, stop) {
  return [...Array(stop - start).keys()]
    .map(v => v + start);
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

  // star glittering
  const starContainer = document.getElementById('stars');
  const createStar = () => {
    let div = document.createElement('div');

    const size = getRandNum(8, 27) + 'px';
    div.style.width = size;
    div.style.height = size;
    div.style.left = (getRandNum(0, 100000) / 1000) + '%';
    div.style.top = (getRandNum(0, 100000) / 1000) + '%';

    starContainer.appendChild(div);
    div.addEventListener('animationend', () => {
      div.remove();

      setTimeout(() => {
        createStar();
      }, getRandNum(100, 3000));
    });
  }

  for (let i = 0; i < MAXSTARS; i++) {
    setTimeout(() => {
      createStar();
    }, getRandNum(100, 6000));
  }

  createRecursiveTimeout(async () => {
    let span = document.createElement('span');
    let right = 0;
    let m = getRandNum(25, 100) / 100;
    let opacity = 0;
    const shootingSpeed = getRandNum(2000, 3000) / 1000;

    span.style.right = right + 'px';
    span.style.top = (right * m) + 'px';
    span.style.opacity = opacity;
    span.style.transform = `rotate(${270 + radToDeg(Math.atan(1/m))}deg)`;

    starContainer.appendChild(span);

    const frame = () => {
      right += shootingSpeed;
      span.style.right = right + 'px';
      span.style.top = (right * m) + 'px';

      let w = starContainer.clientWidth;
      let h = starContainer.clientHeight;

      let doneD = Math.hypot(right, right * m);
      let fullD;
      if ((1/m) < (w / h)) fullD = h / Math.cos(Math.atan(1/m));
      else fullD = w / Math.sin(Math.atan(1/m));

      if (doneD / fullD < 0.25) {
        opacity = (doneD / (fullD / 4));

      } else if (doneD / fullD > 0.75) {
        // let diff = fullD - doneD;
        // let steps = diff / Math.hypot(shootingSpeed, shootingSpeed * m);
        // opacity -= opacity / steps;

        doneD -= 0.75 * fullD;
        fullD /= 4;
        opacity = 1 - doneD / fullD;
        if (opacity < 0) {
          span.remove();
          return;
        }
      }
      span.style.opacity = opacity;

      window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);

    await sleep(5000);
  }, getRandNum.bind(null, 5_000, 15_000));

  // counter
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
/*
 * IDEA: hullócsillagot beállítni, hogy valamelyik betűt találja el mindig, és olyankor az kivilágítana
 * overflow még lehetséges a counterben
 */
