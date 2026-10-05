'use strict';
function calculateQorsys(s, inputs, round) {
 let active=0; const years=[0,0,0]; const clients=[];
 for(let m=0;m<36;m++) {
  const audits=s.audits[m]*inputs.volume/100;
  const opt=audits*inputs.conversion/100;
  const source=m-s.core_lag;
  const added=source>=0?s.audits[source]*inputs.volume/100*inputs.conversion/100*s.opt_to_core:0;
  active=active*(1-inputs.churn/100)+added;
  clients.push(active);
  years[Math.floor(m/12)]+=opt*s.opt_fee+active*inputs.price;
 }
 const arr=active*inputs.price*12, value=arr*s.multiple;
 const share=round.share*(1-round.dilution1)*(1-round.dilution2);
 return {clients,years,arr,value,share,investor:value*share,moic:value*share/round.investment};
}
if(typeof module!=='undefined')module.exports={calculateQorsys};
if(typeof document!=='undefined'){
 const model=window.QORSYS_MODEL, form=document.getElementById('calc-form');
 const ids={volume:'calc-volume',conversion:'calc-conversion',price:'calc-price',churn:'calc-churn'};
 const choice=document.getElementById('calc-scenario');
 const num=(n,d=1)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n);
 const money=n=>num(n/1000000)+' млн ₽';
 function render(){
  const error=document.getElementById('calc-error');
  if(!form.checkValidity()) {error.hidden=false;error.textContent='Введите допустимые значения во всех полях. Результаты ниже относятся к предыдущему расчёту.';return;}
  error.hidden=true;
  const s=model.scenarios[choice.value],inputs=Object.fromEntries(Object.entries(ids).map(([k,id])=>[k,Number(document.getElementById(id).value)]));
  const r=calculateQorsys(s,inputs,model.round);
  const custom=inputs.volume!==100||inputs.conversion!==s.audit_to_opt*100||inputs.price!==s.core_price||Math.abs(inputs.churn-s.monthly_churn*100)>1e-9;
  document.getElementById('calc-state').textContent=choice.value+' · '+(custom?'ваши допущения':'параметры модели');
  document.getElementById('calc-clients').textContent=num(r.clients[35]);
  document.getElementById('calc-arr').textContent=money(r.arr);
  document.getElementById('calc-value').textContent=money(r.value);
  document.getElementById('calc-investor').textContent=money(r.investor);
  document.getElementById('calc-moic').textContent=num(r.moic,2)+'×';
  document.getElementById('calc-share').textContent=num(r.share*100,2)+'%';
  document.getElementById('calc-assumptions').textContent='Чек внедрения: '+money(s.opt_fee)+'. Переход в подписку: '+num(s.opt_to_core*100,0)+'%. Лаг: '+s.core_lag+' мес. Оценка: '+s.multiple+'× годовой выручки подписки.';
  const row=document.createElement('tr'),label=document.createElement('th');label.scope='row';label.textContent='Внедрения + подписка';row.append(label);
  r.years.forEach(v=>{const cell=document.createElement('td');cell.textContent=money(v);row.append(cell);});document.getElementById('calc-years').replaceChildren(row);
 }
 function reset(){const s=model.scenarios[choice.value];const values={volume:100,conversion:s.audit_to_opt*100,price:s.core_price,churn:s.monthly_churn*100};Object.entries(ids).forEach(([k,id])=>document.getElementById(id).value=values[k]);render();}
 Object.values(ids).forEach(id=>document.getElementById(id).required=true);
 choice.addEventListener('change',reset);form.addEventListener('input',render);form.addEventListener('submit',e=>e.preventDefault());document.getElementById('calc-reset').addEventListener('click',reset);reset();
}
