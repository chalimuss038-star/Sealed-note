function encode(data){
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode('0x' + p1)));
}

function decode(str){
  const json = decodeURIComponent(atob(str).split('').map(
    c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));
  return JSON.parse(json);
}
 
const composeView = document.getElementById('compose-view');
const revealView = document.getElementById('reveal-view');
 
function showCompose(){
  composeView.style.display = 'block';
  revealView.style.display = 'none';
  history.replaceState(null, '', location.pathname + location.search);
}
 
function showReveal(data){
  composeView.style.display = 'none';
  revealView.style.display = 'block';
  document.getElementById('letter-body').textContent = data.m;
  document.getElementById('letter-from').textContent = data.f ? '— ' + data.f : '';
  document.getElementById('reveal-sub').textContent = data.f
    ? 'A note from ' + data.f + '.'
    : 'Tap the flap to open it.';
}
 
const hash = location.hash.replace('#s=', '');
if(hash){
  try{
    const data = decode(decodeURIComponent(hash));
    if(data && data.m) showReveal(data);
    else showCompose();
  }catch(e){
    showCompose();
  }
} else {
  showCompose();
}
 
document.getElementById('seal-btn').addEventListener('click', () => {
  const message = document.getElementById('message').value.trim();
  const from = document.getElementById('from').value.trim();
  if(!message){
    document.getElementById('message').focus();
    return;
  }
  const encoded = encode({ m: message, f: from });
  const url = location.origin + location.pathname + '#s=' + encodeURIComponent(encoded);
  document.getElementById('link-output').value = url;
  document.getElementById('result').classList.add('show');
});
 
document.getElementById('copy-btn').addEventListener('click', () => {
  const input = document.getElementById('link-output');
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('copy-btn');
    const original = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = original; }, 1400);
  });
});
 
document.getElementById('flap').addEventListener('click', function(){
  this.classList.add('open');
  document.getElementById('postmark').classList.add('show');
  setTimeout(() => {
    document.getElementById('letter').classList.add('show');
  }, 150);
});
 
document.getElementById('write-back').addEventListener('click', showCompose);
    