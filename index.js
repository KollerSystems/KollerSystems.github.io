const span = document.getElementById('textpanel').getElementsByTagName('span')[0];
const maintext = document.getElementById('maintext');

const gradientDivs = document.getElementsByClassName('gradientCircle');

span.addEventListener('mouseenter', () => {
  maintext.style.width = '70%';
  maintext.style.left = '30%';
  maintext.style.opacity = 1;
  for (let i = 0; i < gradientDivs.length; i++) {
    gradientDivs[i].style.opacity = 0.5;
  }
});
span.addEventListener('mouseleave', () => {
  maintext.style.width = '77.5%';
  maintext.style.left = '22.5%';
  maintext.style.opacity = 0;
  for (let i = 0; i < gradientDivs.length; i++) {
    gradientDivs[i].style.opacity = 0;
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