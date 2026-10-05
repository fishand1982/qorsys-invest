'use strict';
document.body.classList.add('interactive-ready');
const scenarios={
 order:{title:'От заказа до оплаты',subtitle:'Семь этапов, две задержки.',steps:['Заказ','Расчёт','Согласование','Резерв товара','Отгрузка','Документы','Оплата'],days:[1,1,4,1,2,3,2],waits:[0,0,3,0,0,2,0],slow:[2,5],finding:'Две задержки дают 5 дней ожидания.'},
 purchase:{title:'Закупка материалов',subtitle:'Семь этапов, три задержки.',steps:['Потребность','Заявка','Сбор предложений','Выбор поставщика','Утверждение','Заказ','Приёмка'],days:[1,3,2,3,5,1,2],waits:[0,2,0,2,4,0,0],slow:[1,3,4],finding:'Три задержки дают 8 дней ожидания.'},
 invoice:{title:'Согласование счёта',subtitle:'Семь этапов, пять задержек.',steps:['Счёт получен','Регистрация','Сверка договора','Подтверждение работ','Проверка бюджета','Очередь платежей','Оплата'],days:[1,2,3,4,3,5,1],waits:[0,1,2,3,2,4,0],slow:[1,2,3,4,5],finding:'Пять задержек дают 12 дней ожидания.'}
};
const processIcons={"order": ["file", "chart", "users", "layers", "send", "file", "check"], "purchase": ["layers", "file", "search", "users", "shield", "send", "check"], "invoice": ["file", "calendar", "search", "check", "chart", "clock", "check"]};
const buttons=Array.from(document.querySelectorAll('[data-scenario]'));
buttons.forEach(button=>button.addEventListener('click',()=>{
 const data=scenarios[button.dataset.scenario];if(!data)return;
 buttons.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
 document.getElementById('demo-title').textContent=data.title;document.getElementById('demo-subtitle').textContent=data.subtitle;
 const track=document.getElementById('process-track');track.replaceChildren();
 data.steps.forEach((name,i)=>{const item=document.createElement('div');item.className=data.slow.includes(i)?'bottleneck':'';const step=document.createElement('span');step.textContent=String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=name;const days=document.createElement('small');days.textContent=data.days[i]+' '+dayWord(data.days[i])+(data.waits[i]?' · ожидание '+data.waits[i]+' '+dayWord(data.waits[i]):'');const icon=document.createElement('img');icon.className='process-icon';icon.setAttribute('src','assets/process-'+processIcons[button.dataset.scenario][i]+'.svg');icon.setAttribute('alt','');icon.setAttribute('width','28');icon.setAttribute('height','28');days.textContent=data.days[i]+' '+dayWord(data.days[i]);item.append(step,icon,title,days);if(data.waits[i]){const waiting=document.createElement('span');waiting.className='step-wait';waiting.textContent='Ожидание '+data.waits[i]+' '+dayWord(data.waits[i]);item.append(waiting);}track.append(item);});
 document.getElementById('finding-title').textContent=data.finding;
 const total=data.days.reduce((a,b)=>a+b,0),wait=data.waits.reduce((a,b)=>a+b,0);const share=document.getElementById('demo-share');share.replaceChildren(document.createTextNode(String(Math.round(wait/total*100))));const percent=document.createElement('span');percent.textContent='%';share.append(percent);
 document.getElementById('demo-total').textContent=String(total);document.getElementById('donut-share').setAttribute('stroke-dasharray',String(wait/total*100)+' 100');
 document.getElementById('demo-formula').textContent=wait+' '+dayWord(wait)+' ожидания / '+total+' '+dayWord(total)+' всего';
 const demo=document.querySelector('.process-demo');demo.classList.remove('changing');requestAnimationFrame(()=>demo.classList.add('changing'));
}));
buttons[0].click();
function dayWord(n){const a=n%100,b=n%10;return a>=11&&a<=14?'дней':b===1?'день':b>=2&&b<=4?'дня':'дней';}
const menu=document.querySelector('.menu-toggle'),mobileNav=document.getElementById('mobile-nav');
function closeMenu(){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!mobileNav.hidden&&!e.target.closest('.header'))closeMenu();});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reducedMotion.matches){
 document.body.classList.add('motion-ready');const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.remove('waiting');observer.unobserve(item.target);}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(item=>{if(item.getBoundingClientRect().top>innerHeight){item.classList.add('waiting');observer.observe(item);}});
 reducedMotion.addEventListener('change',event=>{if(event.matches){document.body.classList.remove('motion-ready');observer.disconnect();}});
}
const progress=document.querySelector('.reading-progress');let scheduled=false;
function updateProgress(){const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+Math.min(1,Math.max(0,range>0?scrollY/range:0))+')';scheduled=false;}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',()=>{updateProgress();if(innerWidth>767)closeMenu();});updateProgress();
// Document downloads live in native disclosure menus.
const documentMenus=Array.from(document.querySelectorAll('.header-documents'));
documentMenus.forEach(details=>{
 details.addEventListener('toggle',()=>{if(details.open)documentMenus.forEach(other=>{if(other!==details)other.open=false;});});
 details.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{details.open=false;}));
});
document.addEventListener('click',event=>documentMenus.forEach(details=>{if(details.open&&!details.contains(event.target))details.open=false;}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')documentMenus.forEach(details=>{if(details.open){details.open=false;details.querySelector('summary').focus();}});});
