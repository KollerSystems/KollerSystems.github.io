// IDEA: onscroll ugrás a következő vonal közepére, kártyák megjelennek
// IDEA: közben háttéren random "tüzijáték" circle gradientek (canvas!)

const svg = document.getElementById('middleSVG');
const circle = document.getElementById('mainCircle');
const mainLine = document.getElementById('mainLine');
const canvas = document.getElementById('backgroundCanvas');
let ctx = canvas.getContext('2d');
let transformY = 0;

let { height: pageHeight, width: pageWidth } = window.getComputedStyle(document.getElementById('outsidecontainer'));
pageHeight = parseInt(pageHeight, 10);
pageWidth = parseInt(pageWidth, 10);
svg.setAttribute('height', pageHeight);
mainLine.setAttribute('y2', svg.clientHeight - 50);
const lineLength = svg.clientHeight - 100;

const containers = document.getElementsByClassName('container');
let lineYs = [];
let lines;
let currentYIndex = 0;
let maxYIndex = 0;

window.addEventListener('load', () => {
  containers[0].style.transition = 'none';
  containers[0].style.opacity = 1;
  containers[0].style.transform = 'none';
  containers[maxYIndex].style.filter = 'none';
  window.scrollTo({top: lineYs[maxYIndex]-window.innerHeight/2, behavior: 'instant'});

  for (let i = 0; i < containers.length; i++) {
    const img = containers[i].getElementsByTagName('img')[0];
    const y = parseInt(containers[i].offsetTop + img.clientHeight + 2.5, 10);
    lineYs.push(y);
    const x = i % 2 == 0 ? 0 : 125;
    const ns = 'http://www.w3.org/2000/svg';


    let circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', 125);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 5);
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', 4);
    circle.setAttribute('fill', 'white');
    svg.append(circle);

    let line = document.createElementNS(ns, 'line');
    line.classList.add('sideline');
    line.setAttribute('x1', x);
    line.setAttribute('x2', x + 125);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.style.stroke = 'white';
    line.style.strokeWidth = 5;
    svg.append(line)
  }
  lines = svg.getElementsByClassName('sideline');

  circle.style.transform = `matrix(1, 0, 0, 1, -125, ${lineYs[0]})`;

  mainLine.setAttribute('y1', lineYs[0]);
  mainLine.setAttribute('y2', lineYs.at(-1))

  lines[0].style.transform = `matrix(1, 0, 0, 1, 0, 0)`;

  canvas.setAttribute('width', pageWidth);
  canvas.setAttribute('height', pageHeight);

  window.requestAnimationFrame(render);
});

function chainTransitionEnds(element, callbacks, parameters) {
  if (callbacks.length == 0) return;
  element.addEventListener('transitionend', ()=>{
    callbacks[0](...(parameters[0]));
    chainTransitionEnds(element, callbacks.slice(1), parameters.slice(1));
  });
}

let scrollAllow = true;

window.addEventListener('wheel', async e => {
  e.preventDefault();
  if (!scrollAllow) return;
  let prevcurrentYIndex = currentYIndex;
  window.scrollTo({top: lineYs[currentYIndex]-window.innerHeight/2, behavior: 'smooth'});
  if (e.wheelDelta > 0) {
    if (currentYIndex == 0) return;
    currentYIndex = currentYIndex-1;
  } else {
    if (currentYIndex == lineYs.length-1) return;
    currentYIndex = currentYIndex+1;
  }

  if (currentYIndex > maxYIndex) maxYIndex = currentYIndex;

  window.scrollTo(0, lineYs[currentYIndex] - window.innerHeight/2);
  if (maxYIndex == currentYIndex) {
    containers[maxYIndex].style.opacity = 1;
    containers[maxYIndex].style.transform = 'none';
    containers[maxYIndex].style.filter = 'none';

    lines[maxYIndex].style.transform = 'translateX(0px) scaleX(1)';
  }

  let p = (currentYIndex % 2 == 0) ? 1 : -1
  circle.style.transition = 'transform 0.1s ease-in';
  circle.style.transform = `matrix(1, 0, 0, 1, ${p*0}, ${lineYs[prevcurrentYIndex]})`;
  const variableLongTimeOfMiddlePartInTheMiddleOfThePageSVGThatHasADescriptiveVariableNameForBetterReadibilitySinceThereWillBeManyMoreContributors = 0.2 + (Math.abs(lineYs[prevcurrentYIndex] - lineYs[currentYIndex]) * 0.00005);
  chainTransitionEnds(circle, [
    (p, transition) => {circle.style.transition = transition; circle.style.transform = `matrix(1, 0, 0, 1, 0, ${lineYs[currentYIndex]})`},
    (p, transition) => {circle.style.transition = transition; circle.style.transform = `matrix(1, 0, 0, 1, ${p*125}, ${lineYs[currentYIndex]})`}
  ], [ [null, `transform ${variableLongTimeOfMiddlePartInTheMiddleOfThePageSVGThatHasADescriptiveVariableNameForBetterReadibilitySinceThereWillBeManyMoreContributors}s linear`], [p*-1, 'transform 0.1s ease-out'] ]);
  scrollAllow = false;
  setTimeout(() => {
    scrollAllow = true;
  }, variableLongTimeOfMiddlePartInTheMiddleOfThePageSVGThatHasADescriptiveVariableNameForBetterReadibilitySinceThereWillBeManyMoreContributors + 0.2*1000)
});

let mouseX, mouseY;
canvas.addEventListener('mousemove', e => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

function Bubble(x,y, speed = 1) {
  this.x = x;
  this.y = y;
  this.speed = speed;
}
const r = 10;
const mouseR = 20;
const bubbles = [];
let nFrame = 0;
function collides(x1,y1, x2,y2, r1,r2) {
  return Math.hypot(x2 - x1, y2 - y1) <= (r1+r2);
}

function resolveCollision(i, x, y, r1, r2) {
  let dy = bubbles[i].y - y, dx = bubbles[i].x - x;
  let rad = Math.atan2(dy, dx);
  bubbles[i].y = (r1 + r2) * Math.sin(rad) + y;
  bubbles[i].x = (r1 + r2) * Math.cos(rad) + x;
}

function checkResolveCollision(i, x, y, r1=r, r2=r, done) {
  resolveCollision(i, x, y, r1, r2);

  const bubbleI = bubbles.findIndex((bubble, i2) => ((i != i2) && collides(bubbles[i].x, bubbles[i].y, bubble.x, bubble.y, r, r2)));
  done.push(i)
  if (bubbleI != -1 && !done.includes(bubbleI)) checkResolveCollision(bubbleI, bubbles[i].x, bubbles[i].y, r2, r, done);
}

const insidecontainerProperties = window.getComputedStyle(document.getElementById('insidecontainer'));
let marginWidth = parseInt(insidecontainerProperties.marginRight+(pageWidth/100 * 1), 10);
let width = parseInt(insidecontainerProperties.width, 10);

function render() {
  ctx.strokeStyle = 'white';
  ctx.clearRect(0,0,pageWidth,pageHeight);

  if (nFrame == 4) {
    let collides = true;
    let randomX;
    while (collides || (randomX >= marginWidth && randomX <= (marginWidth+width))) {
      randomX = Math.floor(Math.random() * pageWidth);
      collides = !bubbles.every(bubble => {
        return Math.hypot(randomX - bubble.x, pageHeight - bubble.y) >= 2*r
      });
    }
    bubbles.push(new Bubble(randomX, pageHeight, Math.random() + 1));
    nFrame = 0;
  }

  bubbles.forEach((bubble, i) => {
    if (collides(mouseX, mouseY, bubble.x, bubble.y, mouseR, r)) {
      checkResolveCollision(i, mouseX, mouseY, mouseR, r, []);
      // hahahaha ha sok a buborek beszarik...
    }
  });

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    bubble.y -= bubble.speed;

    if (bubble.y + r <= 0) {
      bubbles.splice(i, 1);
    }

    const index = bubbles.findIndex((v, i2) => ((i != i2) && collides(bubble.x, bubble.y, v.x, v.y, r, r)));
    if (index != -1)
      checkResolveCollision(index, bubble.x, bubble.y, r, r, []);

    ctx.beginPath();
    ctx.arc(bubble.x-2*r-5 , bubble.y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
  // ctx.beginPath();
  // ctx.arc(mouseX-mouseR-5, mouseY, mouseR, 0, 2 * Math.PI);
  // ctx.stroke();
  nFrame++;
  window.requestAnimationFrame(render);
}