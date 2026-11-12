/* Romain Gary — annexe : langue + bon de caisse. Aucun traceur, aucune donnée envoyée. */
(function(){
  var L=['en','he','fr'];
  function pick(){var q=new URLSearchParams(location.search).get('l');if(L.indexOf(q)>=0)return q;
    var s=null;try{s=localStorage.getItem('rg_l')}catch(e){};if(L.indexOf(s)>=0)return s;
    // 12/11 (David) : on est en Israël, la page s'ouvre en hébreu ; l'anglais seulement pour un téléphone réglé en anglais sans hébreu ; le français par le bouton.
    var ls=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'he']).map(function(x){return String(x).slice(0,2)});
    if(ls.indexOf('he')>=0||ls.indexOf('iw')>=0)return 'he';return ls[0]==='en'?'en':'he';}
  function set(l){document.documentElement.lang=l;document.documentElement.dir=l==='he'?'rtl':'ltr';
    document.querySelectorAll('[data-l]').forEach(function(e){e.hidden=e.getAttribute('data-l')!==l});
    document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.set===l)});
    var t=document.querySelector('meta[name="t-'+l+'"]');if(t)document.title=t.content;
    try{localStorage.setItem('rg_l',l)}catch(e){}}
  document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.set)})});
  set(pick());
  // voucher
  var v=document.getElementById('vch');if(!v)return;
  function visit(){var k='rg_v_'+v.dataset.code,d=new Date().toISOString().slice(0,10),o=null;
    try{o=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}
    if(!o||o.d!==d){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';var r=new Uint32Array(4);crypto.getRandomValues(r);
      for(var i=0;i<4;i++)s+=a[r[i]%a.length];o={d:d,n:s};try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}}
    return o.n;}
  function tick(){var n=new Date();var p=function(x){return String(x).padStart(2,'0')};
    v.querySelectorAll('.clock').forEach(function(c){c.textContent=p(n.getDate())+'/'+p(n.getMonth()+1)+'/'+n.getFullYear()+' '+p(n.getHours())+':'+p(n.getMinutes())+':'+p(n.getSeconds())});}
  var timer;
  document.querySelectorAll('[data-open-vch]').forEach(function(b){b.addEventListener('click',function(){
    var n=visit();v.querySelectorAll('.vno').forEach(function(e){e.textContent=n});
    v.classList.add('on');document.body.style.overflow='hidden';tick();timer=setInterval(tick,1000);
    var c=v.querySelector('.close:not([hidden])')||v.querySelector('.close');if(c)c.focus();})});
  v.querySelectorAll('.close').forEach(function(b){b.addEventListener('click',function(){v.classList.remove('on');document.body.style.overflow='';clearInterval(timer)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&v.classList.contains('on')){v.classList.remove('on');document.body.style.overflow='';clearInterval(timer)}});
})();
