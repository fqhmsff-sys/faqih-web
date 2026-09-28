const $=(s)=>document.querySelector(s);
const publicWords=$('#publicWords');
const privateGate=$('#privateGate');
const privateWords=$('#privateWords');
function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function render(list,target){if(!target)return;target.innerHTML=list.map(x=>`<article class="word-card"><div class="word-id">${escapeHtml(x.id)}</div>${x.title?`<div class="word-title">${escapeHtml(x.title)}</div>`:''}<div class="word-text">${escapeHtml(x.text)}</div></article>`).join('')}
function renderPublic(list,target){if(!target)return;target.innerHTML=list.map(x=>`<article class="word-card"><div class="word-id">${escapeHtml(x.id)}</div>${x.title?`<div class="word-title">${escapeHtml(x.title)}</div>`:''}<div class="word-text">${escapeHtml(x.text)}</div></article>`).join('')}
if(publicWords){
  renderPublic(PUBLIC_WORDS,publicWords);
  const tabs=document.querySelectorAll('.tab');
  tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');const isPrivate=tab.dataset.tab==='private';publicWords.classList.toggle('hidden',isPrivate);privateGate.classList.toggle('hidden',!isPrivate);if(!isPrivate)privateWords.classList.add('hidden')}));
  async function deriveKey(password,salt){const enc=new TextEncoder();const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:PRIVATE_BUNDLE.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt'])}
  function b64(s){const bin=atob(s);return Uint8Array.from(bin,c=>c.charCodeAt(0))}
  $('#unlockForm').addEventListener('submit',async e=>{e.preventDefault();const btn=e.target.querySelector('button');const err=$('#unlockError');err.textContent='';btn.disabled=true;btn.textContent='MEMERIKSA...';try{if(!window.crypto?.subtle)throw new Error('SECURE_CONTEXT');const key=await deriveKey($('#password').value,b64(PRIVATE_BUNDLE.salt));const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(PRIVATE_BUNDLE.nonce)},key,b64(PRIVATE_BUNDLE.ciphertext));const data=JSON.parse(new TextDecoder().decode(plain));render(data,privateWords);privateGate.classList.add('hidden');privateWords.classList.remove('hidden');e.target.reset()}catch(err){err.textContent=err.message==='SECURE_CONTEXT'?'Buka website lewat HTTPS (misalnya GitHub Pages), bukan file lokal.':'Sandi salah atau data privat tidak dapat dibuka.'}finally{btn.disabled=false;btn.textContent='BUKA'}});
}
