const span = document.getElementById('textpanel').getElementsByTagName('span')[0];
span.addEventListener('mouseenter', () => {
  document.getElementById('maintext').style.opacity = 1;
});
span.addEventListener('mouseleave', () => {
  document.getElementById('maintext').style.opacity = 0;
});