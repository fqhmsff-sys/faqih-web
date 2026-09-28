(function(){
  const gate=document.getElementById('siteAuthGate');
  if(!gate)return;
  const form=document.getElementById('siteAuthForm');
  const input=document.getElementById('siteAuthPassword');
  const error=document.getElementById('siteAuthError');
  form.addEventListener('submit',async e=>{
    e.preventDefault(); error.textContent='';
    const button=form.querySelector('button'); button.disabled=true; button.textContent='MEMERIKSA...';
    try{
      await FaqihAuth.verifyPassword(input.value);
      window.siteAuthPassword=input.value;
      gate.remove();
      document.body.classList.remove('protected');
      window.dispatchEvent(new CustomEvent('site-authenticated'));
    }catch(err){
      error.textContent=err.message==='SECURE_CONTEXT'?'Gunakan website melalui HTTPS.':err.message==='NO_BUNDLE'?'Data private tidak ditemukan.':'Sandi salah.';
      input.value=''; input.focus(); button.disabled=false; button.textContent='BUKA';
    }
  });
  input.focus();
})();
