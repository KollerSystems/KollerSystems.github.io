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

const scrollContainer = document.getElementById('scroller');

let scrollPos = 0;
const scrollCases = 4;
document.addEventListener('wheel', async e => {
  e.preventDefault();

  scrollContainer.children[scrollPos].classList.remove('currentpage');

  if (e.wheelDeltaY < 0) scrollPos = ++scrollPos > scrollCases ? scrollPos = scrollCases : scrollPos;
  else scrollPos = --scrollPos < 0 ? scrollPos = 0 : scrollPos;
  let greatestPos = -1;

  scrollContainer.children[scrollPos].classList.add('currentpage');

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
      window.scrollTo({ behavior: 'smooth', left: 0, top: document.getElementById('developers').offsetTop - window.innerHeight });
      break;
    case scrollCases:
      window.scrollTo({ behavior: 'smooth', left: 0, top: document.documentElement.scrollHeight - window.innerHeight  });
      break;
  }
  greatestPos = scrollPos >= greatestPos ? scrollPos : greatestPos;
});

const getWriter = (isWrite, lang, minT, maxT, text) => isWrite ? write(document.getElementsByClassName(lang)[0], text, minT, maxT) : unwrite(document.getElementsByClassName(lang)[0], minT, maxT);

window.addEventListener('load', async () => {
  for (let i = 0; i <= scrollCases; i++) {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode('•'));
    scrollContainer.appendChild(span);
  }
  scrollContainer.children[scrollPos].classList.add('currentpage');

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

let override = false;
let devHighlightIndex = 0;

const flexDivs = document.getElementById('devsFlexbox').children;
for (let i = 0; i < flexDivs.length; i++) {
  const div = flexDivs[i];
  div.addEventListener('mouseenter', () => {
    override = true;
    for (d of flexDivs) {
      d.classList.remove('onscreenpopup');
      d.getElementsByClassName('popupdesc')[0].classList.remove('onscreenpopup');
    }
    div.getElementsByClassName('popupdesc')[0].classList.add('onscreenpopup');
  });
  div.addEventListener('mouseleave', () => {
    devHighlightIndex = i;
    div.getElementsByClassName('popupdesc')[0].classList.add('onscreenpopup');
    div.classList.add('onscreenpopup');
    override = false;
  });
}

flexDivs[devHighlightIndex].getElementsByClassName('popupdesc')[0].classList.add('onscreenpopup');
flexDivs[devHighlightIndex].classList.add('onscreenpopup');
setInterval(() => {
  if (override) return;
  flexDivs[devHighlightIndex].classList.remove('onscreenpopup');
  flexDivs[devHighlightIndex].getElementsByClassName('popupdesc')[0].classList.remove('onscreenpopup');
  devHighlightIndex = devHighlightIndex+2 > flexDivs.length ? 0 : devHighlightIndex+1;
  flexDivs[devHighlightIndex].getElementsByClassName('popupdesc')[0].classList.add('onscreenpopup');
  flexDivs[devHighlightIndex].classList.add('onscreenpopup');
}, 5000);