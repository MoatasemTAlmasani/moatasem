(function(){
function P(v){var m=String(v).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);if(!m)return null;var o=m.slice(1).map(Number);if(o.some(function(x){return x>255}))return null;return((o[0]<<24)|(o[1]<<16)|(o[2]<<8)|o[3])>>>0}
function F(n){return[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join(".")}
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
/* Tabs */
var tabs=document.querySelectorAll('[role=tab]'),panels=document.querySelectorAll('[role=tabpanel]');
function show(id){tabs.forEach(function(t){t.setAttribute("aria-selected",t.dataset.p===id)});panels.forEach(function(p){p.hidden=p.id!==id})}
tabs.forEach(function(t){t.addEventListener("click",function(){show(t.dataset.p);history.replaceState(null,"","#"+t.dataset.p)})});
var h=location.hash.slice(1);show(["subnet","vlsm","wildcard","ports"].indexOf(h)>-1?h:"subnet");
/* Subnet */
function sub(){var n=P($("s-ip").value),p=parseInt($("s-cidr").value.replace("/",""),10),e=$("s-err"),o=$("s-out");
if(n===null||!(p>=0&&p<=32)){e.hidden=false;o.innerHTML="";return}e.hidden=true;
var mk=p?(0xFFFFFFFF<<(32-p))>>>0:0,nt=(n&mk)>>>0,bc=(nt|~mk)>>>0,hs=p===32?1:p===31?2:Math.pow(2,32-p)-2;
var r=[["عنوان الشبكة",F(nt)],["عنوان البث",F(bc)],["القناع",F(mk)+" (/"+p+")"],["Wildcard",F((~mk)>>>0)],["أول عنوان صالح",F(p>=31?nt:nt+1)],["آخر عنوان صالح",F(p>=31?bc:bc-1)],["عدد الأجهزة",hs.toLocaleString("en")]];
o.innerHTML=r.map(function(x){return"<tr><th scope=row>"+x[0]+"</th><td class=mono>"+x[1]+"</td></tr>"}).join("")}
["s-ip","s-cidr"].forEach(function(i){$(i).addEventListener("input",sub)});sub();
/* VLSM */
function vlsm(){var n=P($("v-ip").value),p=parseInt($("v-cidr").value,10),e=$("v-err"),o=$("v-out");
var hs=$("v-hosts").value.split(/[\s,،]+/).filter(Boolean).map(Number);
if(n===null||!(p>=1&&p<=30)||!hs.length||hs.some(function(x){return!(x>=1&&x<=1e7)})){e.textContent="أدخل شبكة صحيحة وبادئة بين 1 و30 وأعداد أجهزة مفصولة بفواصل.";e.hidden=false;o.innerHTML="";return}
var mk=(0xFFFFFFFF<<(32-p))>>>0,base=(n&mk)>>>0,end=base+Math.pow(2,32-p),cur=base,rows="";
var items=hs.map(function(h,i){return{h:h,i:i}}).sort(function(a,b){return b.h-a.h});
var res=[],fail=false;
items.forEach(function(it){var bits=2;while(Math.pow(2,bits)-2<it.h)bits++;var size=Math.pow(2,bits);
if(cur%size)cur+=size-(cur%size);if(cur+size>end){fail=true;return}
res.push({i:it.i,h:it.h,net:cur,pre:32-bits,size:size});cur+=size});
if(fail){e.textContent="الشبكة الأم لا تكفي لهذه الأعداد. استخدم بادئة أصغر.";e.hidden=false;o.innerHTML="";return}
e.hidden=true;
o.innerHTML=res.map(function(r,k){var m=(0xFFFFFFFF<<(32-r.pre))>>>0;return"<tr><td>"+(k+1)+"</td><td class=mono>"+r.h+"</td><td class=mono>"+F(r.net)+"/"+r.pre+"</td><td class=mono>"+F(m)+"</td><td class=mono>"+F(r.net+1)+" – "+F(r.net+r.size-2)+"</td><td class=mono>"+F(r.net+r.size-1)+"</td><td class=mono>"+(r.size-2)+"</td></tr>"}).join("")+"<tr><td colspan=7 class=meta>المتبقي من الشبكة الأم: "+(end-cur).toLocaleString("en")+" عنواناً</td></tr>"}
["v-ip","v-cidr","v-hosts"].forEach(function(i){$(i).addEventListener("input",vlsm)});vlsm();
/* Wildcard */
function wc(){var v=$("w-in").value.trim(),e=$("w-err"),o=$("w-out"),r;e.hidden=true;
var m=v.match(/^\/?(\d{1,2})$/);
if(m&&+m[1]<=32){var p=+m[1];var mk=p?(0xFFFFFFFF<<(32-p))>>>0:0;r=[["القناع",F(mk)],["Wildcard",F((~mk)>>>0)],["البادئة","/"+p]]}
else{var n=P(v);if(n===null){e.hidden=false;o.innerHTML="";return}
var inv=(~n)>>>0;var asMask=/^1*0*$/.test(n.toString(2).padStart(32,"0"));
var asWild=/^0*1*$/.test(n.toString(2).padStart(32,"0"));
if(asMask){var pp=n.toString(2).replace(/0/g,"").length;r=[["القناع",F(n)],["Wildcard",F(inv)],["البادئة","/"+pp]]}
else if(asWild){var pw=32-n.toString(2).replace(/0/g,"").length;r=[["Wildcard",F(n)],["القناع",F(inv)],["البادئة","/"+pw]]}
else{e.hidden=false;o.innerHTML="";return}}
o.innerHTML=r.map(function(x){return"<tr><th scope=row>"+x[0]+"</th><td class=mono>"+x[1]+"</td></tr>"}).join("")}
$("w-in").addEventListener("input",wc);wc();
/* Ports */
var PORTS=[[20,"TCP","FTP (بيانات)","نقل الملفات"],[21,"TCP","FTP (تحكم)","نقل الملفات"],[22,"TCP","SSH","وصول آمن عن بعد"],[23,"TCP","Telnet","وصول عن بعد غير مشفر"],[25,"TCP","SMTP","إرسال البريد"],[53,"TCP/UDP","DNS","تحويل الأسماء"],[67,"UDP","DHCP (خادم)","توزيع العناوين"],[68,"UDP","DHCP (عميل)","توزيع العناوين"],[69,"UDP","TFTP","نقل ملفات بسيط"],[80,"TCP","HTTP","الويب"],[88,"TCP/UDP","Kerberos","مصادقة Active Directory"],[110,"TCP","POP3","استلام البريد"],[123,"UDP","NTP","مزامنة الوقت"],[135,"TCP","RPC","استدعاء الإجراءات عن بعد"],[137,"UDP","NetBIOS","خدمة الأسماء"],[143,"TCP","IMAP","استلام البريد"],[161,"UDP","SNMP","مراقبة الأجهزة"],[162,"UDP","SNMP Trap","تنبيهات الأجهزة"],[389,"TCP/UDP","LDAP","الدليل"],[443,"TCP","HTTPS","الويب المشفّر"],[445,"TCP","SMB","مشاركة الملفات"],[465,"TCP","SMTPS","إرسال البريد المشفر"],[500,"UDP","IKE","IPsec VPN"],[514,"UDP","Syslog","السجلات"],[587,"TCP","SMTP Submission","إرسال البريد"],[636,"TCP","LDAPS","الدليل المشفر"],[993,"TCP","IMAPS","استلام البريد المشفر"],[995,"TCP","POP3S","استلام البريد المشفر"],[1433,"TCP","SQL Server","قاعدة بيانات"],[1723,"TCP","PPTP","VPN"],[3306,"TCP","MySQL","قاعدة بيانات"],[3389,"TCP","RDP","سطح المكتب البعيد"],[4500,"UDP","IPsec NAT-T","IPsec خلف NAT"],[5060,"TCP/UDP","SIP","الاتصال الصوتي"],[5432,"TCP","PostgreSQL","قاعدة بيانات"]];
function ports(){var q=$("p-q").value.trim().toLowerCase();
$("p-out").innerHTML=PORTS.filter(function(r){return!q||(r[0]+" "+r[1]+" "+r[2]+" "+r[3]).toLowerCase().indexOf(q)>-1}).map(function(r){return"<tr><td class=mono>"+r[0]+"</td><td class=mono>"+r[1]+"</td><td>"+esc(r[2])+"</td><td>"+esc(r[3])+"</td></tr>"}).join("")||"<tr><td colspan=4>لا نتائج.</td></tr>"}
$("p-q").addEventListener("input",ports);ports();
})();
