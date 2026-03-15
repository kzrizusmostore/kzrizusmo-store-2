(function(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js').then(function(reg){
        console.log('SW registered:', reg.scope);
      }).catch(function(err){
        console.warn('SW register failed:', err);
      });
    });
  }

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.createElement('button');
    btn.className = 'pwa-install-btn';
    btn.textContent = 'Pasang Aplikasi';
    document.body.appendChild(btn);
    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('User accepted install');
        btn.remove();
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  });

  // optional: add class to body to use margin approach
  // document.body.classList.add('pwa-add-top-margin');

})();
