(function(){
var f=document.getElementById("cs-form"),st=document.getElementById("cs-st"),box=document.getElementById("cs-dl"),busy=false;
function show(){f.hidden=true;box.hidden=false;box.querySelector("a").focus()}
f.addEventListener("submit",function(e){e.preventDefault();if(busy)return;
if(document.getElementById("cs-hp").value){show();return}
var n=document.getElementById("cs-name").value.trim(),m=document.getElementById("cs-email").value.trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){st.textContent="أدخل بريداً إلكترونياً صحيحاً.";st.className="err";document.getElementById("cs-email").focus();return}
var fd=new FormData();fd.append("name",n||"-");fd.append("email",m);fd.append("source","cheatsheet");
fd.append("_subject","تحميل ملف الأوامر — "+m);fd.append("_template","table");fd.append("_captcha","false");
fd.append("_autoresponse","شكراً لتحميلك ملف أهم أوامر FortiGate وCisco. يمكنك تحميله في أي وقت من: https://moatasem.vercel.app/assets/network-commands-cheatsheet.pdf — معتصم طارق هاشم");
busy=true;st.textContent="جارٍ الإرسال…";st.className="";
fetch("https://formsubmit.co/ajax/eng.moatasem.almasani@gmail.com",{method:"POST",body:fd,headers:{Accept:"application/json"}})
.then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{ok:r.ok,d:d}})})
.then(function(x){busy=false;if(x.ok&&(x.d.success===true||x.d.success==="true")){try{window.plausible&&window.plausible("Cheatsheet Lead")}catch(e){}show()}else{st.textContent="تعذّر الإرسال الآن. حاول لاحقاً أو راسلني على البريد.";st.className="err"}})
.catch(function(){busy=false;st.textContent="تعذّر الإرسال الآن. تحقق من اتصالك وحاول مرة أخرى.";st.className="err"})});
})();
