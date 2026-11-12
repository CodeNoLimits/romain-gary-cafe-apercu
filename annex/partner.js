/* Romain Gary — pages partenaires : langue, bon de caisse, bouton collant, apparitions. Aucun traceur, aucune donnée envoyée. */
(function(){
  var D=document,R=D.documentElement,L=['he','en','fr'],Q=new URLSearchParams(location.search);
  R.classList.add('js');
  // La page s'ouvre en hébreu (on est en Israël) ; anglais seulement pour un téléphone réglé en anglais sans hébreu ; français par le bouton ; ?l=he|en|fr force.
  function pick(){var q=Q.get('l');if(L.indexOf(q)>=0)return q;
    var s=null;try{s=localStorage.getItem('rg_l')}catch(e){}if(L.indexOf(s)>=0)return s;
    var ls=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'he']).map(function(x){return String(x).slice(0,2)});
    if(ls.indexOf('he')>=0||ls.indexOf('iw')>=0)return 'he';return ls[0]==='en'?'en':'he';}
  function set(l,save){R.lang=l;R.dir=l==='he'?'rtl':'ltr';
    D.querySelectorAll('[data-l]').forEach(function(e){e.hidden=e.getAttribute('data-l')!==l});
    D.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.set===l?'true':'false')});
    var t=D.querySelector('meta[name="t-'+l+'"]');if(t)D.title=t.content;
    if(save){try{localStorage.setItem('rg_l',l)}catch(e){}}
    D.dispatchEvent(new CustomEvent('rg:lang',{detail:l}));}
  D.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.set,true)})});
  set(pick(),false);

  // ?n=<nom> : salue l'équipe (texte seul, jamais de HTML)
  var n=(Q.get('n')||'').replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim().slice(0,40);
  if(n)D.querySelectorAll('[data-team]').forEach(function(e){e.textContent=e.getAttribute('data-team')+' '+n});

  // bouton collant : visible seulement quand les boutons du héros ne le sont plus
  // (et jamais par-dessus le billet ou le QR que l'on montre à la caisse)
  var st=D.querySelector('.sticky'),hb=D.querySelector('.hero .btns'),vis=new Set();
  if(st&&hb&&'IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)});st.classList.toggle('show',vis.size===0)});
    so.observe(hb);D.querySelectorAll('.ticket,.qrbox,.closing,footer').forEach(function(e){so.observe(e)})}
  else if(st)st.classList.add('show');

  // apparitions
  var rv=D.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(e){io.observe(e)})}
  else rv.forEach(function(e){e.classList.add('in')});

  // bon de caisse
  var v=D.getElementById('vch');if(!v)return;
  function visit(){var k='rg_v_'+v.dataset.code,d=new Date().toISOString().slice(0,10),o=null;
    try{o=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}
    if(!o||o.d!==d){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';var r=new Uint32Array(4);crypto.getRandomValues(r);
      for(var i=0;i<4;i++)s+=a[r[i]%a.length];o={d:d,n:s};try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}}
    return o.n;}
  function p2(x){return String(x).padStart(2,'0')}
  function tick(){var t=new Date();
    v.querySelectorAll('.clock').forEach(function(c){c.textContent=p2(t.getHours())+':'+p2(t.getMinutes())+':'+p2(t.getSeconds())});
    v.querySelectorAll('.day').forEach(function(c){c.textContent=p2(t.getDate())+'/'+p2(t.getMonth()+1)+'/'+t.getFullYear()});}
  var timer,opener=null;
  function close(){v.classList.remove('on');D.body.style.overflow='';clearInterval(timer);if(opener)opener.focus()}
  D.querySelectorAll('[data-open-vch]').forEach(function(b){b.addEventListener('click',function(){
    opener=b;var k=visit();v.querySelectorAll('.vno').forEach(function(e){e.textContent=k});
    v.classList.add('on');v.scrollTop=0;D.body.style.overflow='hidden';tick();timer=setInterval(tick,1000);
    var c=v.querySelector('[data-l]:not([hidden]) .close')||v.querySelector('.close');if(c)c.focus();})});
  v.querySelectorAll('.close').forEach(function(b){b.addEventListener('click',close)});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&v.classList.contains('on'))close()});
})();
