(function(){
  function b64(v){return Uint8Array.from(atob(v),c=>c.charCodeAt(0));}
  async function verifyPassword(password){
    if(!window.crypto?.subtle) throw new Error('SECURE_CONTEXT');
    if(!window.PRIVATE_BUNDLE) throw new Error('NO_BUNDLE');
    const b=window.PRIVATE_BUNDLE;
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(b.salt),iterations:b.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
    await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(b.nonce)},key,b64(b.ciphertext));
    return true;
  }
  window.FaqihAuth={verifyPassword};
})();
