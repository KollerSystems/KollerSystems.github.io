async function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

async function write(element, text, minT, maxT) {
  let written = '';
  let c = 0;
  while (written.length < text.length) {
    await sleep(Math.floor(Math.random() * (maxT-minT)) + minT)
    written += text[c++];
    if (c < 0) c = 0;
    element.innerHTML = written;
  }
}

// IDEA: csillagok?
window.addEventListener('load', async () => {
  document.getElementById('server').getElementsByTagName('video')[0].play();

  const descs = document.getElementsByClassName('description');
  for (let i = 0; i < descs.length; i++) {
    const OGtext = descs[i].innerHTML;
    descs[i].innerHTML = '';
    await write(descs[i], OGtext, 50, 80);
    await sleep(200);
    descs[i].classList.add('highlighted');
  }
})