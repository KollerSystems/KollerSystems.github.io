const textpanel = document.getElementById('textpanel');
const span = textpanel.getElementsByTagName('span')[0];
const maintext = document.getElementById('maintext');

const gradientDivs = document.getElementsByClassName('gradientCircle');

let fullyOpened = false, animationTimer;
span.addEventListener('mouseenter', () => {
  maintext.style.width = '70%';
  maintext.style.left = '30%';
  maintext.style.opacity = 1;
  for (let i = 0; i < gradientDivs.length; i++) {
    gradientDivs[i].style.opacity = 0.5;
  }
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
    for (let i = 0; i < gradientDivs.length; i++) {
      gradientDivs[i].style.opacity = 0;
    }
  } else {
    clearTimeout(animationTimer);
    maintext.style.width = '';
    maintext.style.left = '';
    maintext.style.opacity = '';
    for (let i = 0; i < gradientDivs.length; i++) {
      gradientDivs[i].style.opacity = '';
    }
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

window.addEventListener('load', async e => {
  textpanel.style.pointerEvents = 'none';
  textpanel.style.transition = 'width 0s ease';
  textpanel.style.width = '100%';
  for (let i = 0; i < gradientDivs.length; i++) {
    gradientDivs[i].style.opacity = 0.5;
  }
  await sleep(10);
  textpanel.style.transition = 'width 0.8s ease';
  textpanel.style.width = '';
  for (let i = 0; i < gradientDivs.length; i++) {
    gradientDivs[i].style.opacity = 0;
  }
  await sleep(810);
  textpanel.style.pointerEvents = '';
  textpanel.style.transition = '';
});

const navanchors = document.getElementsByClassName('navAnchor');
const transformN = 25;
for (let i = 0; i < navanchors.length; i++) {
  navanchors[i].addEventListener('click', async e => {
    e.preventDefault();
    textpanel.classList.add('hover');
    textpanel.style.width = '30%';
    span.style.opacity = 1;
    for (let n = 0; n < navanchors.length; n++)
      navanchors[n].style.opacity = 1;

    const nElement = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);
    let transformMatrix = getComputedStyle(e.target).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
    transformMatrix[5] = Number(transformMatrix[5]) + ((nElement >= navanchors.length/2) ? transformN : -1*transformN);
    e.target.style.transform = 'matrix(' + transformMatrix.join(', ') + ')';

    let n = 1;
    while ((navanchors[nElement + n] ?? '') || (navanchors[nElement - n] ?? '')) {
      await sleep(200);
      if (navanchors[nElement + n] ?? '') {
        let matrix = getComputedStyle(navanchors[nElement + n]).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
        matrix[5] = Number(matrix[5]) + transformN;
        navanchors[nElement + n].style.transform = 'matrix(' + matrix.join(', ') + ')';
        navanchors[nElement + n].style.opacity = 0;
      }
      if (navanchors[nElement - n] ?? '') {
        let matrix = getComputedStyle(navanchors[nElement - n]).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
        matrix[5] = Number(matrix[5]) - transformN;
        navanchors[nElement - n].style.transform = 'matrix(' + matrix.join(', ') + ')';
        navanchors[nElement - n].style.opacity = 0;
      }
      n++;
    }

    await sleep(500);
    textpanel.style.transition = 'width 0.8s ease';
    textpanel.style.width = '100%';
    await sleep(810);
    if (document.activeElement == e.target) {
      e.target.blur();
    } else {
      e.target.focus();
    }
    let matrix = getComputedStyle(e.target).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
    matrix[0] = 1.04;
    matrix[3] = 1.04;
    e.target.style.transform = 'matrix(' + matrix.join(', ') + ')';
    e.target.style.opacity = 0;
    await sleep(410);
    window.location.replace(e.target.href);
  });
}