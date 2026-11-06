'use strict';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lensPath([x,h,w,a,b]) {
  return `M ${x} ${120-h} Q ${x-a} 120 ${x} ${120+h} L ${x+w} ${120+h} Q ${x+w+b} 120 ${x+w} ${120-h} Z`;
}
function diagram(item, hero=false) {
  if(item.kind==='product') {
    const hasConstruction=Number.isInteger(item.elements)&&Number.isInteger(item.groups);
    return `<svg class="optics-svg spec-svg" viewBox="0 0 360 240" role="img" aria-label="${escapeHTML(item.name)}の公表仕様。内部配置図ではありません。"><path class="axis" d="M 25 120 H 335"/><circle cx="180" cy="118" r="74" fill="none" stroke="#bcc8bf" stroke-width=".7"/><circle cx="180" cy="118" r="82" fill="none" stroke="#cbd4ca" stroke-width=".5"/><rect x="49" y="83" width="262" height="76" fill="#e9edf0"/><text class="spec-value" x="180" y="116" text-anchor="middle">${item.focal} · ${item.aperture}</text><text class="spec-caption" x="180" y="145" text-anchor="middle">${hasConstruction?`${item.groups} GROUPS / ${item.elements} ELEMENTS`:'HISTORICAL MODEL'}</text><text class="label" x="19" y="220">PUBLISHED SPECIFICATIONS</text><text class="label" x="341" y="220" text-anchor="end">LEICA / LEITZ</text></svg>`;
  }
  const axis = '<path class="axis" d="M 18 120 H 342"/>';
  let elements='', rays='';
  if (item.mirror) {
    elements = '<path class="mirror" d="M 286 51 Q 315 120 286 189"/>';
    if (item.mirror==='newtonian'||item.mirror==='schmidt-newtonian') {
      elements += '<path class="mirror" d="M 112 100 L 149 137"/>';
      rays = '<path class="ray" d="M 25 74 H 294 L 139 127 L 139 30"/><path class="ray alt" d="M 25 166 H 294 L 120 108 L 120 30"/>';
      if(item.mirror==='schmidt-newtonian')elements+='<path class="glass" d="M 65 52 Q 61 90 65 120 Q 69 151 65 188 H 71 Q 75 151 71 120 Q 67 90 71 52 Z"/>';
    } else if(item.mirror==='schmidt-camera') {
      elements+='<path class="glass" d="M 65 52 Q 61 90 65 120 Q 69 151 65 188 H 71 Q 75 151 71 120 Q 67 90 71 52 Z"/><path class="image-plane" d="M 163 101 Q 174 120 163 139"/><text class="label" x="141" y="161">IMAGE</text>';
      rays='<path class="ray" d="M 22 65 H 291 L 168 120"/><path class="ray alt" d="M 22 175 H 291 L 168 120"/>';
    } else if(item.mirror==='gregorian') {
      elements='<path class="mirror" d="M 286 51 Q 300 80 300 104 M 300 136 Q 300 160 286 189"/><path class="mirror" d="M 89 92 Q 61 120 89 148"/>';
      rays='<path class="ray" d="M 22 65 H 290 L 80 137 L 339 120"/><path class="ray alt" d="M 22 175 H 290 L 80 103 L 339 120"/>';
    } else {
      // A gap in the primary depicts its central hole.
      elements = '<path class="mirror" d="M 286 51 Q 300 80 300 104 M 300 136 Q 300 160 286 189"/><path class="mirror" d="M 110 96 Q 126 120 110 144"/>';
      if(item.mirror==='schmidt') elements += '<path class="glass" d="M 66 52 Q 62 90 66 120 Q 70 151 66 188 L 72 188 Q 76 151 72 120 Q 68 90 72 52 Z"/>';
      if(item.mirror==='maksutov')elements+='<path class="glass" d="M 64 52 Q 37 120 64 188 H 76 Q 52 120 76 52 Z"/>';
      if(item.mirror==='cdk')elements+=`<path class="glass" d="${lensPath([252,18,6,10,-3])}"/><path class="glass flint" d="${lensPath([274,18,6,3,8])}"/><text class="label" x="228" y="159">CORRECTOR</text>`;
      rays = '<path class="ray" d="M 22 65 H 290 L 118 108 L 339 120"/><path class="ray alt" d="M 22 175 H 290 L 118 132 L 339 120"/>';
    }
  } else {
    elements = item.lenses.map(l=>`<path class="glass ${l[5]===1?'flint':''}" d="${lensPath(l)}"/>`).join('');
    if(item.stop) elements += `<path class="stop" d="M ${item.stop} 49 V 93 M ${item.stop} 147 V 191"/>`;
    const first = item.lenses[0][0], last = item.lenses.at(-1)[0]+item.lenses.at(-1)[2];
    if(item.rayMode==='negative') {
      rays=`<path class="ray" d="M 20 65 L ${first} 99 L ${last} 99 H 340"/><path class="ray alt" d="M 20 175 L ${first} 141 L ${last} 141 H 340"/>`;
    } else if(item.category==='eyepiece') {
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
let category='all', brand='all', query='';
const dialog=$('detail');
function render() {
  const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\u3041-\u3096]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60)).toLowerCase();
  const searchTerms=normalize(query).split(/\s+/).filter(Boolean);
  const items=OPTICS.filter(o=>{
    const haystack=normalize([o.name,o.en,...(o.aliases||[]),...(BRAND_ALIASES[o.brand]||[]),o.tag,o.description,o.meta,CATEGORIES[o.category],BRANDS[o.brand||'general']].join(' '));
    return (category==='all'||o.category===category)&&(brand==='all'||(o.brand||'general')===brand)&&searchTerms.every(term=>haystack.includes(term));
  });
  $('gallery').innerHTML=items.map(o=>`<button class="card" data-id="${o.id}" data-category="${o.category}" aria-label="${escapeHTML(o.name)}の詳細を見る"><div class="card-art"><span class="card-number">${String(OPTICS.indexOf(o)+1).padStart(2,'0')} · ${o.kind==='product'?'実製品':'方式'}</span><span class="card-category">${o.brand?BRANDS[o.brand]:CATEGORIES[o.category]}</span>${diagram(o)}</div><div class="card-body"><p class="card-en">${escapeHTML(o.en)}</p><h3>${o.name}</h3><p class="card-description">${o.description}</p><div class="card-bottom"><span>${o.meta}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div></button>`).join('');
  $('result-count').textContent=`${String(items.length).padStart(2,'0')} ITEMS / ${CATEGORIES[category]||'すべての光学系'}${brand!=='all'?` / ${BRANDS[brand]}`:''}`;
  $('empty').hidden=items.length>0;
  document.querySelectorAll('.filter').forEach(b=>{const active=b.dataset.category===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));b.querySelector('span').textContent=OPTICS.filter(o=>b.dataset.category==='all'||o.category===b.dataset.category).length;});
}
function openDetail(id) {
  const o=OPTICS.find(o=>o.id===id); if(!o)return;
  const source=SOURCES[o.source];
  $('detail-content').innerHTML=`<p class="eyebrow">${CATEGORIES[o.category]} / ${o.kind==='product'?'実製品の公表仕様':'方式・設計例'}${o.brand?` / ${BRANDS[o.brand]}`:''}</p><h2 id="detail-title" class="detail-title">${o.name}</h2><p class="detail-en">${escapeHTML(o.en)}</p><div class="detail-art">${diagram(o)}</div><div class="detail-tags"><span>${o.meta}</span><span>${o.tag}</span></div><p class="detail-description">${o.detail}</p><p class="detail-notice">${o.kind==='product'?'このカードは特定モデルの公表仕様を表示しています。内部構成図や性能資料は下記の資料を参照してください。':'図は代表構成の模式例です。曲率・間隔・光路は数値計算や実機の処方に基づいていません。'}</p><a class="source-link" href="${source[1]}" target="_blank" rel="noopener noreferrer">参考資料：${source[0]} ↗</a>`;
  dialog.showModal();
  history.replaceState(null,'',`#system=${o.id}`);
}
function closeDetail(){dialog.close();history.replaceState(null,'','#collection');}
document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;render();}});
$('search').addEventListener('input',e=>{query=e.target.value.trim();render();});
$('reset').addEventListener('click',()=>{category='all';brand='all';query='';$('search').value='';$('brand-filter').value='all';render();});
$('brand-filter').innerHTML+=Object.entries(BRANDS).map(([key,label])=>`<option value="${key}">${label} (${OPTICS.filter(o=>(o.brand||'general')===key).length})</option>`).join('');
$('brand-filter').addEventListener('change',e=>{brand=e.target.value;render();});
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
