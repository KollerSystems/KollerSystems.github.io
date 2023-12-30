const _textpanel = document.getElementById('textpanel');

const _gradientDivs = document.getElementsByClassName('gradientCircle');

_textpanel.addEventListener('mouseenter', () => {
  for (let i = 0; i < _gradientDivs.length; i++) {
    _gradientDivs[i].style.opacity = 0.5;
  }
});
_textpanel.addEventListener('mouseleave', () => {
  if (_textpanel.classList.contains('hover')) {
    return false;
  }
  for (let i = 0; i < _gradientDivs.length; i++) {
    _gradientDivs[i].style.opacity = 0;
  }
});

async function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

window.addEventListener('load', async e => {
  _textpanel.style.pointerEvents = 'none';
  _textpanel.style.transition = 'width 0s ease';
  _textpanel.style.width = '100%';
  for (let i = 0; i < _gradientDivs.length; i++) {
    _gradientDivs[i].style.opacity = 0.5;
  }
  await sleep(10);
  _textpanel.style.transition = 'width 0.8s ease';
  _textpanel.style.width = '';
  for (let i = 0; i < _gradientDivs.length; i++) {
    _gradientDivs[i].style.opacity = 0;
  }
  await sleep(810);
  _textpanel.style.pointerEvents = '';
  _textpanel.style.transition = '';
});

const _navanchors = document.getElementsByClassName('navAnchor');
const _transformN = 25;
for (let i = 0; i < _navanchors.length; i++) {
  _navanchors[i].addEventListener('click', async e => {
    e.preventDefault();
    _textpanel.classList.add('hover');
    _textpanel.style.width = '30%';
    e.target.parentNode.parentNode.style.opacity = 1;
    for (let n = 0; n < _navanchors.length; n++)
      _navanchors[n].style.opacity = 1;

    const nElement = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);
    let transformMatrix = getComputedStyle(e.target).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
    transformMatrix[5] = Number(transformMatrix[5]) + ((nElement >= _navanchors.length/2) ? _transformN : -1*_transformN);
    e.target.style.transform = 'matrix(' + transformMatrix.join(', ') + ')';

    let n = 1;
    while ((_navanchors[nElement + n] ?? '') || (_navanchors[nElement - n] ?? '')) {
      await sleep(200);
      if (_navanchors[nElement + n] ?? '') {
        let matrix = getComputedStyle(_navanchors[nElement + n]).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
        matrix[5] = Number(matrix[5]) + _transformN;
        _navanchors[nElement + n].style.transform = 'matrix(' + matrix.join(', ') + ')';
        _navanchors[nElement + n].style.opacity = 0;
      }
      if (_navanchors[nElement - n] ?? '') {
        let matrix = getComputedStyle(_navanchors[nElement - n]).transform.replaceAll('matrix(', '').replaceAll(')', '').split(', ');
        matrix[5] = Number(matrix[5]) - _transformN;
        _navanchors[nElement - n].style.transform = 'matrix(' + matrix.join(', ') + ')';
        _navanchors[nElement - n].style.opacity = 0;
      }
      n++;
    }

    await sleep(500);
    _textpanel.style.transition = 'width 0.8s ease';
    _textpanel.style.width = '100%';
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