const textpanel = document.getElementById('textpanel');
const span = textpanel.getElementsByTagName('span')[0];
const maintext = document.getElementById('maintext');

let fullyOpened = false, animationTimer;
span.addEventListener('mouseenter', () => {
  maintext.style.width = '70%';
  maintext.style.left = '30%';
  maintext.style.opacity = 1;
  animationTimer = setTimeout(()=>{
    fullyOpened = true;
  }, 450);
});
span.addEventListener('mouseleave', () => {
  if (textpanel.classList.contains('hover')) {
    return false;
  }
  if (fullyOpened) {
    maintext.style.width = '75.5%';
    maintext.style.left = '24.5%';
    maintext.style.opacity = 0;
  } else {
    clearTimeout(animationTimer);
    maintext.style.width = '';
    maintext.style.left = '';
    maintext.style.opacity = '';
  }
});


const mainscreen = document.getElementById('mainscreen');
const video = mainscreen.getElementsByTagName('video')[0];

let matrixVideoValues = window.getComputedStyle(video).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
let matrixHeaderValues = window.getComputedStyle(maintext).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');

const defaultHeaderTX = matrixHeaderValues[4];
const defaultHeaderTY = matrixHeaderValues[5];

mainscreen.addEventListener('mousemove', e => {
  const height = mainscreen.clientHeight, width = mainscreen.clientWidth;

  matrixVideoValues[4] = ((e.clientX-(width/2))/30);
  matrixVideoValues[5] = ((e.clientY-(height/2))/30);

  matrixHeaderValues[4] = Number(defaultHeaderTX) - ((e.clientX-(width/2))/120);
  matrixHeaderValues[5] = Number(defaultHeaderTY) - ((e.clientY-(height/2))/120);

  video.style.transform = 'matrix(' + matrixVideoValues.join(', ') + ')';
  maintext.style.transform = 'matrix(' + matrixHeaderValues.join(', ') + ')';
});

async function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}