'use strict';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lensPath([x,h,w,a,b]) {
  return `M ${x} ${120-h} Q ${x-a} 120 ${x} ${120+h} L ${x+w} ${120+h} Q ${x+w+b} 120 ${x+w} ${120-h} Z`;
}
function diagram(item, hero=false) {
  const axis = '<path class="axis" d="M 18 120 H 342"/>';
  let elements='', rays='';
  if (item.mirror) {
    elements = '<path class="mirror" d="M 286 51 Q 315 120 286 189"/>';
    if (item.mirror==='newtonian') {
      elements += '<path class="mirror" d="M 112 100 L 149 137"/>';
      rays = '<path class="ray" d="M 25 74 H 294 L 139 127 L 139 30"/><path class="ray alt" d="M 25 166 H 294 L 120 108 L 120 30"/>';
    } else {
      // A gap in the primary depicts its central hole.
      elements = '<path class="mirror" d="M 286 51 Q 300 80 300 104 M 300 136 Q 300 160 286 189"/><path class="mirror" d="M 110 96 Q 126 120 110 144"/>';
      if(item.mirror==='schmidt') elements += '<path class="glass" d="M 66 52 Q 62 90 66 120 Q 70 151 66 188 L 72 188 Q 76 151 72 120 Q 68 90 72 52 Z"/>';
      rays = '<path class="ray" d="M 22 65 H 290 L 118 108 L 339 120"/><path class="ray alt" d="M 22 175 H 290 L 118 132 L 339 120"/>';
    }
  } else {
    elements = item.lenses.map(l=>`<path class="glass ${l[5]===1?'flint':''}" d="${lensPath(l)}"/>`).join('');
    if(item.stop) elements += `<path class="stop" d="M ${item.stop} 49 V 93 M ${item.stop} 147 V 191"/>`;
    const first = item.lenses[0][0], last = item.lenses.at(-1)[0]+item.lenses.at(-1)[2];
    if(item.category==='eyepiece') {
      rays = `<path class="ray" d="M 20 143 L ${first} 94 L ${last} 80 H 340"/><path class="ray alt" d="M 20 97 L ${first} 146 L ${last} 160 H 340"/>`;
    } else if(item.id==='microscope') {
      rays = `<path class="ray" d="M 25 120 L ${first} 102 L 170 84 L ${last} 76 L 338 120"/><path class="ray alt" d="M 25 120 L ${first} 138 L 170 156 L ${last} 164 L 338 120"/>`;
    } else {
      rays = `<path class="ray" d="M 20 83 H ${first} L ${last} 96 L 337 120"/><path class="ray alt" d="M 20 157 H ${first} L ${last} 144 L 337 120"/>`;
      if(hero) rays += `<path class="ray" d="M 20 63 L ${first} 75 L ${last} 118 L 337 130"/><path class="ray alt" d="M 20 177 L ${first} 165 L ${last} 122 L 337 110"/>`;
    }
  }
  return `<svg class="optics-svg" viewBox="0 0 360 240" role="img" aria-label="${escapeHTML(item.name)}の断面模式図。設計値による光線追跡ではありません。">${axis}${elements}${rays}<text class="label" x="19" y="220">${item.mirror?'FOLDED OPTICAL PATH':'LIGHT →'}</text><text class="label" text-anchor="end" x="341" y="220">SCHEMATIC</text></svg>`;
}
let category='all', query='';
const dialog=$('detail');
function render() {
  const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\u3041-\u3096]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60)).toLowerCase();
  const items=OPTICS.filter(o=>(category==='all'||o.category===category)&&normalize([o.name,o.en,...(o.aliases||[]),o.tag,o.description,o.meta,CATEGORIES[o.category]].join(' ')).includes(normalize(query)));
  $('gallery').innerHTML=items.map(o=>`<button class="card" data-id="${o.id}" data-category="${o.category}" aria-label="${escapeHTML(o.name)}の詳細を見る"><div class="card-art"><span class="card-number">${String(OPTICS.indexOf(o)+1).padStart(2,'0')}</span><span class="card-category">${CATEGORIES[o.category]}</span>${diagram(o)}</div><div class="card-body"><p class="card-en">${escapeHTML(o.en)}</p><h3>${o.name}</h3><p class="card-description">${o.description}</p><div class="card-bottom"><span>${o.meta}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div></button>`).join('');
  $('result-count').textContent=`${String(items.length).padStart(2,'0')} SYSTEMS / ${CATEGORIES[category]||'すべての光学系'}`;
  $('empty').hidden=items.length>0;
  document.querySelectorAll('.filter').forEach(b=>{const active=b.dataset.category===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));b.querySelector('span').textContent=OPTICS.filter(o=>b.dataset.category==='all'||o.category===b.dataset.category).length;});
}
function openDetail(id) {
  const o=OPTICS.find(o=>o.id===id); if(!o)return;
  const source=SOURCES[o.source];
  $('detail-content').innerHTML=`<p class="eyebrow">${CATEGORIES[o.category]} / ${String(OPTICS.indexOf(o)+1).padStart(2,'0')}</p><h2 id="detail-title" class="detail-title">${o.name}</h2><p class="detail-en">${escapeHTML(o.en)}</p><div class="detail-art">${diagram(o)}</div><div class="detail-tags"><span>${o.meta}</span><span>${o.tag}</span></div><p class="detail-description">${o.detail}</p><p class="detail-notice">図は代表構成の模式例です。曲率・間隔・光路は数値計算や実機の処方に基づいていません。</p><a class="source-link" href="${source[1]}" target="_blank" rel="noopener noreferrer">参考資料：${source[0]} ↗</a>`;
  dialog.showModal();
  history.replaceState(null,'',`#system=${o.id}`);
}
function closeDetail(){dialog.close();history.replaceState(null,'','#collection');}
document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;render();}});
$('search').addEventListener('input',e=>{query=e.target.value.trim();render();});
$('reset').addEventListener('click',()=>{category='all';query='';$('search').value='';render();});
$('show-rays').addEventListener('change',e=>document.body.classList.toggle('hide-rays',!e.target.checked));
$('gallery').addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openDetail(card.dataset.id);});
$('close-detail').addEventListener('click',closeDetail);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
$('hero-diagram').innerHTML=diagram(OPTICS.find(o=>o.id==='double-gauss'),true);
$('total-count').textContent=String(OPTICS.length).padStart(2,'0');
render();
if(location.hash.startsWith('#system='))openDetail(location.hash.slice(8));

// Incoherent monochromatic diffraction MTF of a clear, uniform circular pupil.
function diffractionMTF(frequency,fNumber,wavelengthNm) {
  const nu=frequency*wavelengthNm*1e-6*fNumber;
  if(nu>=1)return 0;if(nu<=0)return 1;
  return 2/Math.PI*(Math.acos(nu)-nu*Math.sqrt(1-nu*nu));
}
function renderMTF(){
  const f=Number($('f-number').value),wave=Number($('wavelength').value),cutoff=1/(wave*1e-6*f);
  $('f-value').textContent=`f/${f.toFixed(1).replace(/\.0$/,'')}`;
  $('wavelength-value').textContent=`${wave} nm`;
  $('mtf-readout').textContent=`遮断周波数 ${cutoff.toFixed(1)} lp/mm ｜ 10 lp/mm: ${(diffractionMTF(10,f,wave)*100).toFixed(1)}% ｜ 30 lp/mm: ${(diffractionMTF(30,f,wave)*100).toFixed(1)}%`;
  const left=60,top=35,width=630,height=240,maxFreq=Number($('mtf-max').value);
  let grid='';
  for(let i=0;i<=5;i++){const y=top+height-i/5*height;grid+=`<path d="M ${left} ${y} h ${width}" stroke="#dde2d8"/><text x="${left-12}" y="${y+4}" text-anchor="end">${(i/5).toFixed(1)}</text>`;}
  for(let i=0;i<=4;i++){const x=left+i/4*width;grid+=`<path d="M ${x} ${top} v ${height}" stroke="#e8ebe2"/><text x="${x}" y="${top+height+22}" text-anchor="middle">${i*maxFreq/4}</text>`;}
  const points=Array.from({length:701},(_,i)=>{const freq=i/700*maxFreq;return `${i?'L':'M'} ${(left+freq/maxFreq*width).toFixed(2)} ${(top+height*(1-diffractionMTF(freq,f,wave))).toFixed(2)}`;}).join(' ');
  const cutoffX=left+cutoff/maxFreq*width;
  const cutoffMarker=cutoff<=maxFreq?`<path d="M ${cutoffX} ${top} V ${top+height}" stroke="#9b886b" stroke-dasharray="4 5"/><circle cx="${cutoffX}" cy="${top+height}" r="3" fill="#9b886b"/>`:'';
  $('mtf-chart').innerHTML=`<svg viewBox="0 0 730 340" role="img" aria-label="回折限界MTF、F値${f}、波長${wave}nm。遮断周波数${cutoff.toFixed(1)}lp/mm。"><g fill="#647363" font-family="sans-serif" font-size="10">${grid}<text x="${left}" y="18">MTF（コントラスト伝達率）</text><text x="${left+width/2}" y="328" text-anchor="middle">像面での空間周波数（lp/mm）</text><text x="690" y="18" text-anchor="end">理想円形瞳 / 回折限界</text></g><path d="${points} L ${left+width} ${top+height} L ${left} ${top+height} Z" fill="#d8ed9e" opacity=".3"/><path d="${points}" fill="none" stroke="#496343" stroke-width="2.5"/>${cutoffMarker}</svg>`;
}
$('f-number').addEventListener('input',renderMTF);
$('wavelength').addEventListener('input',renderMTF);
$('mtf-max').addEventListener('change',renderMTF);
renderMTF();
