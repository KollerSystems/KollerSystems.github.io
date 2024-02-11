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
    element.innerText = written;
  }
}
async function unwrite(element, minT, maxT) {
  let written = element.innerText;
  let c = written.length;
  while (written.length > 0) {
    await sleep(Math.floor(Math.random() * (maxT-minT)) + minT)
    written = written.slice(0, c--);
    element.innerText = written;
  }
}


// IDEA: csillagok?
window.addEventListener('load', async () => {
  document.getElementById('server').getElementsByTagName('video')[0].play();
  window.scrollTo(0,0)

  const descs = document.getElementById('server').getElementsByClassName('description');
  for (let i = 0; i < descs.length; i++) {
    const OGtext = descs[i].innerHTML;
    descs[i].innerHTML = '';
    await write(descs[i], OGtext, 50, 80);
    await sleep(200);
    descs[i].classList.add('highlighted');
  }
});

let scrollPos = 0;
document.addEventListener('wheel', async e => {
  e.preventDefault();
  const cases = 3;
  if (e.wheelDeltaY < 0) scrollPos = ++scrollPos > cases ? scrollPos = cases : scrollPos;
  else scrollPos = --scrollPos < 0 ? scrollPos = 0 : scrollPos;
  let greatestPos = -1;
  switch (scrollPos) {
    case 0:
      window.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
      break;
    case 1:
      window.scrollTo({ behavior: 'smooth', left: 0, top: (document.getElementById('android').offsetTop - window.innerHeight) })
      break;
    case 2:
      window.scrollTo({ behavior: 'smooth', left: 0, top: document.getElementById('android').offsetTop });
      break;
    case 3:
      window.scrollTo({ behavior: 'smooth', left: 0, top: document.documentElement.scrollHeight - window.innerHeight  });
      break;
  }
  greatestPos = scrollPos >= greatestPos ? scrollPos : greatestPos;
});

const getWriter = (isWrite, lang, minT, maxT, text) => isWrite ? write(document.getElementsByClassName(lang)[0], text, minT, maxT) : unwrite(document.getElementsByClassName(lang)[0], minT, maxT);

window.addEventListener('load', async () => {
  const callWriters = (paramsArr) => {
    let promises = [];
    paramsArr.forEach(params => {
      promises.push(getWriter(...params));
    });
    return promises;
  }
  while (true) {
    await sleep(100);
    await Promise.all(callWriters([[true, 'hu', 50, 70, 'Letisztult'], [true, 'zh', 75, 105, '已\n清\n除'], [true, 'ar', 150, 240, 'مسح']]));
    await sleep(3000);
    await Promise.all(callWriters([[false, 'hu', 70, 100], [false, 'zh', 75, 105], [false, 'ar', 150, 240]]));
    await sleep(100);
    await Promise.all(callWriters([[true, 'hu', 50, 70, 'Megbízható'], [true, 'zh', 75, 105, '可\n靠\n的'], [true, 'ar', 75, 105, 'موثوق']]));
    await sleep(3000);
    await Promise.all(callWriters([[false, 'hu', 50, 70], [false, 'zh', 75, 105], [false, 'ar', 75, 105]]));
    await sleep(100);
    await Promise.all(callWriters([[true, 'hu', 70, 90, 'Hasznos'], [true, 'zh', 150, 240, '有\n用'], [true, 'ar', 120, 200, 'مفيد']]));
    await sleep(3000);
    await Promise.all(callWriters([[false, 'hu', 70, 90], [false, 'zh', 150, 240], [false, 'ar', 120, 180]]));
  }
});
