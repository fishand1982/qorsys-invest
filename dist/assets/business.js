'use strict';
(()=>{
 const cycle=document.querySelector('.business-cycle');if(!cycle)return;
 const nodes=Array.from(cycle.querySelectorAll('.business-node'));
 let closeTimer=null;
 const close=()=>nodes.forEach(n=>{n.querySelector('button').setAttribute('aria-expanded','false');n.querySelector('[role=tooltip]').hidden=true;});
 const cancel=()=>{if(closeTimer!==null){clearTimeout(closeTimer);closeTimer=null;}};
 const open=n=>{cancel();close();n.querySelector('button').setAttribute('aria-expanded','true');n.querySelector('[role=tooltip]').hidden=false;};
 nodes.forEach(n=>{
  const button=n.querySelector('button');
  n.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){open(n);}});
  n.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){cancel();closeTimer=setTimeout(close,220);}});
  button.addEventListener('focus',()=>open(n));
  button.addEventListener('click',()=>{if(button.getAttribute('aria-expanded')==='true'&&n.dataset.clicked==='true'){cancel();close();n.dataset.clicked='false';}else{open(n);nodes.forEach(x=>x.dataset.clicked=String(x===n));}});
  n.addEventListener('focusout',e=>{if(!n.contains(e.relatedTarget)){cancel();close();}});
 });
 document.addEventListener('pointerdown',e=>{if(!cycle.contains(e.target)){cancel();close();nodes.forEach(n=>n.dataset.clicked='false');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancel();close();nodes.forEach(n=>n.dataset.clicked='false');}});
})();
