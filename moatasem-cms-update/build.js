// يولّد الموقع النهائي في dist/ من ملفات content/ — يعمل على Vercel دون أي مكتبات خارجية
const fs=require('fs'),path=require('path');
const ROOT=__dirname,OUT=path.join(ROOT,'dist'),B='https://moatasem.vercel.app';
const rd=(p)=>fs.readFileSync(path.join(ROOT,p),'utf8');
const J=(p)=>JSON.parse(rd(p));
const esc=(s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug=(s)=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ICONS=J('content/icons.json');
const svg=(n,sw)=>n&&ICONS[n]?`<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw||1.7}" viewbox="0 0 24 24">${ICONS[n]}</svg>`:'';
const bi=(tag,cls,v,lang,extra)=>{v=v||{ar:'',en:''};return `<${tag}${cls?` class="${cls}"`:''}${extra||''} data-ar="${esc(v.ar)}" data-en="${esc(v.en)}">${esc(v[lang]||v.ar||'')}</${tag}>`};
const items=(n)=>J(`content/${n}.json`).items||[];
const R={
 certs:(l)=>items('certs').map(i=>{const key=i.key||slug(i.title),opt=i.optional||!i.pdf,b=i.badge&&(i.badge.ar||i.badge.en)?bi('span','cert-badge',i.badge,l):'';
  return `<div class="cert-item${i.featured?' featured':''}${i.more?' cert-more':''}" data-cat="${esc(i.category)}"><span aria-hidden="true" class="cert-ic">${svg('medal',1.6)}</span><p class="cert-title">${esc(i.title)}</p>${b}<p class="cert-org"><span>${esc(i.issuer)}</span> — <span>${esc(i.date)}</span></p><div class="cert-actions"${opt?' hidden':''}><a class="cert-btn cert-btn-primary" data-cert="${esc(key)}"${opt?' data-optional':''} href="${esc(i.pdf||`/assets/certs/${key}.pdf`)}" rel="noopener noreferrer" target="_blank"><span data-ar="عرض الشهادة" data-en="View Certificate">${l==='ar'?'عرض الشهادة':'View Certificate'}</span></a></div></div>`}).join('\n'),
 experience:(l)=>items('experience').map(i=>`<div class="tl-item"><span class="tl-node"></span><div class="tl-card">${bi('span','tl-tag',i.tag,l)}${bi('h3','',i.title,l)}${bi('p','tl-org',i.org,l)}<p class="tl-meta">${bi('span','',i.date,l)} <i>·</i> ${bi('span','',i.place,l)}</p>${(i.kpis||[]).length?`<div class="tl-kpis">${i.kpis.map(k=>bi('span','',k,l)).join('')}</div>`:''}<ul class="tl-list">${(i.bullets||[]).map(k=>bi('li','',k,l)).join('')}</ul></div></div>`).join('\n'),
 skills:(l)=>items('skills').map(i=>`<div class="skill-card" style="order:${i.order||0}"><div class="skill-head"><span aria-hidden="true" class="skill-ic">${svg(i.icon)}</span>${bi('b','',i.title,l)}</div><div class="tags">${(i.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div>`).join('\n'),
 projects:(l,f)=>items('projects').map(i=>`<div class="work-card"><div class="work-head"><span aria-hidden="true" class="work-ic">${svg(i.icon)}</span>${bi('h3','',i.title,l)}</div>${bi('span','work-tag',i.tag,l)}${bi('p','work-p',i.text,l)}${f==='en'&&(i.stack||[]).length?`<div aria-label="نطاق العمل والتقنيات" class="work-stack">${i.stack.map(k=>(k.ar===k.en?`<span>${esc(k.ar)}</span>`:bi('span','',k,l))).join('')}</div>`:''}</div>`).join('\n'),
 learning:(l)=>items('learning').map(i=>`<div class="work-card"><div class="work-head">${bi('h3','',i.title,l)}</div>${bi('span','status status-'+(i.state||'progress'),i.status,l)}${bi('p','work-p',i.text,l)}</div>`).join('\n'),
 education:(l)=>items('education').map(i=>`<div class="edu-card"><span aria-hidden="true" class="edu-ic">${svg(i.icon)}</span><div class="edu-body">${bi('h3','',i.title,l)}${bi('p','edu-org',i.org,l)}${bi('p','edu-loc',i.place,l)}${bi('p','edu-date',i.date,l)}</div></div>`).join('\n'),
};
// ---------- Markdown مصغّر ----------
function inl(t){const c=[];t=t.replace(/`([^`]+)`/g,(m,x)=>{c.push(x);return '\u0000'+(c.length-1)+'\u0000'});t=esc(t);
 t=t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,'<img src="$2" alt="$1" loading="lazy" style="max-width:100%;height:auto">').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g,'$1<em>$2</em>');
 return t.replace(/\u0000(\d+)\u0000/g,(m,i)=>'<code>'+esc(c[i])+'</code>')}
function md(src){const L=src.replace(/\r/g,'').split('\n');let o='',i=0;
 const cells=(r)=>r.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
 while(i<L.length){const l=L[i];
  if(/^\s*$/.test(l)){i++;continue}
  if(/^```/.test(l)){const b=[];i++;while(i<L.length&&!/^```/.test(L[i]))b.push(L[i++]);i++;o+=`<pre>${esc(b.join('\n'))}</pre>\n`;continue}
  let m;if((m=l.match(/^(#{1,4})\s+(.*)$/))){const n=Math.max(2,m[1].length);o+=`<h${n}>${inl(m[2])}</h${n}>\n`;i++;continue}
  if(/^---+\s*$/.test(l)){o+='<hr>\n';i++;continue}
  if(/^>/.test(l)){const b=[];while(i<L.length&&/^>/.test(L[i]))b.push(L[i++].replace(/^>\s?/,''));o+=`<div class="note">${md(b.join('\n'))}</div>\n`;continue}
  if(/^\|/.test(l)&&/^\|?\s*:?-{3,}/.test(L[i+1]||'')){const h=cells(l);i+=2;const r=[];while(i<L.length&&/^\|/.test(L[i]))r.push(cells(L[i++]));
   o+=`<div class="tbl"><table><thead><tr>${h.map(x=>`<th>${inl(x)}</th>`).join('')}</tr></thead><tbody>${r.map(x=>`<tr>${x.map(y=>`<td>${inl(y)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>\n`;continue}
  if(/^\s*([-*]|\d+\.)\s+/.test(l)){const ol=/^\s*\d+\./.test(l),b=[];while(i<L.length&&/^\s*([-*]|\d+\.)\s+/.test(L[i]))b.push(L[i++].replace(/^\s*([-*]|\d+\.)\s+/,''));o+=`<${ol?'ol':'ul'}>${b.map(x=>`<li>${inl(x)}</li>`).join('')}</${ol?'ol':'ul'}>\n`;continue}
  if(/^</.test(l)){o+=l+'\n';i++;continue}
  const b=[];while(i<L.length&&!/^\s*$/.test(L[i])&&!/^(```|#|>|\||\s*([-*]|\d+\.)\s)/.test(L[i]))b.push(L[i++]);if(!b.length){b.push(L[i++])}o+=`<p>${inl(b.join(' '))}</p>\n`}
 return o}
// ---------- المقالات ----------
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const arDate=(d)=>{const m=String(d).match(/(\d{4})-(\d{2})-(\d{2})/);return m?`${+m[3]} ${MONTHS[+m[2]-1]} ${m[1]}`:''};
function articles(){return fs.readdirSync(path.join(ROOT,'content/articles')).filter(f=>f.endsWith('.md')).map(f=>{
 const t=rd('content/articles/'+f),m=t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);if(!m)return null;const fm={};
 m[1].split('\n').forEach(l=>{const k=l.match(/^(\w+):\s*(.*)$/);if(k)fm[k[1]]=k[2].replace(/^"(.*)"$/,'$1').replace(/^'(.*)'$/,'$1')});
 const d=String(fm.date||'').slice(0,10);return{slug:f.replace(/\.md$/,''),title:fm.title||'',desc:fm.description||'',date:d,body:md(m[2])}}).filter(a=>a&&a.title).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title,'ar'))}
const head=(title,desc,p,extra,og)=>`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#050E15">
<link rel="canonical" href="${B}${p}">
<meta property="og:type" content="${og||'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${B}${p}">
<meta property="og:image" content="${B}/assets/og-image.jpeg?v=1">
<meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/shared.css">
${extra||''}
<script defer data-domain="moatasem.vercel.app" src="https://plausible.io/js/script.js"></script>
</head>
<body>
<a class="skip" href="#main">انتقل إلى المحتوى</a>
`;
const bar=(cur)=>{const a=(h,t,k)=>`<a href="${h}"${cur===k?' aria-current="page"':''}>${t}</a>`;return `<header class="bar"><div class="bar-in"><a class="brand" href="/">معتصم طارق هاشم</a>
<nav aria-label="التنقل">${a('/','الرئيسية','')}${a('/articles/','المقالات','a')}${a('/tools/','الأدوات','t')}${a('/cheatsheet/','ملف مجاني','c')}${a('/#contact','تواصل','')}</nav>
<button class="tbtn" id="tt" type="button" aria-label="تبديل المظهر">◐</button></div></header>
`};
const FOOT=`<footer>© 2026 معتصم طارق هاشم · <a href="/">الرئيسية</a> · <a href="/en/" lang="en" hreflang="en">English</a></footer>
<script src="/assets/shared.js"></script>
</body></html>`;
const CTA=`<aside class="cta"><b>تحتاج مساعدة في شبكتك أو أنظمتك؟</b><p>أعمل في الشبكات والدعم الفني وإدارة الأنظمة. راسلني وأرد عليك.</p><a class="btn" href="/#contact">تواصل معي</a> <a class="btn o" href="/tools/">جرّب أدوات الشبكات</a></aside>`;
const ld=(o)=>`<script type="application/ld+json">${JSON.stringify(o)}</script>`;
function build(){
 fs.rmSync(OUT,{recursive:true,force:true});
 const SKIP=new Set(['node_modules','dist','.git','content','articles','build.js','package.json','package-lock.json','README.md','.gitignore','sitemap.xml','.vercel']);
 (function cp(s,d){fs.mkdirSync(d,{recursive:true});for(const n of fs.readdirSync(s)){if(s===ROOT&&SKIP.has(n))continue;const a=path.join(s,n),b=path.join(d,n);fs.statSync(a).isDirectory()?cp(a,b):fs.copyFileSync(a,b)}})(ROOT,OUT);
 const A=articles();
 const notes=A.map(a=>`<a class="nc" href="/articles/${a.slug}"><b>${esc(a.title)}</b><span>${esc(a.desc)}</span></a>`).join('');
 const certs=items('certs');
 for(const [f,l] of [['index.html','ar'],['en/index.html','en']]){const fk=l;
  let t=fs.readFileSync(path.join(OUT,f),'utf8');
  t=t.replace(/<!--cms:(\w+)-->[\s\S]*?<!--\/cms:\1-->/g,(m,n)=>`<!--cms:${n}-->${n==='notes'?notes:R[n]?R[n]('ar',fk):''}<!--/cms:${n}-->`);
  t=t.replace(/\/\*cms:certlinks\*\/[\s\S]*?\/\*\/cms:certlinks\*\//,'/*cms:certlinks*/\n'+certs.map(i=>`  ${JSON.stringify(i.key||slug(i.title))}: ${JSON.stringify(i.link||'')}`).join(',\n')+'\n/*/cms:certlinks*/');
  t=t.replace(/(عرض كل الشهادات|View all certificates) \(\d+\)/g,`$1 (${certs.length})`);
  fs.writeFileSync(path.join(OUT,f),t)}
 fs.mkdirSync(path.join(OUT,'articles'),{recursive:true});
 A.forEach((a,k)=>{const p='/articles/'+a.slug,rel=A.filter(x=>x!==a).slice(0,3).map(x=>`<a class="card" href="/articles/${x.slug}"><b>${esc(x.title)}</b><span class="d">${esc(x.desc)}</span></a>`).join('');
  const art={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.desc,inLanguage:'ar',datePublished:a.date,dateModified:a.date,mainEntityOfPage:B+p,image:B+'/assets/og-image.jpeg',author:{'@type':'Person',name:'معتصم طارق هاشم',url:B+'/'},publisher:{'@type':'Person',name:'معتصم طارق هاشم',url:B+'/'}};
  const bc={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'الرئيسية',item:B+'/'},{'@type':'ListItem',position:2,name:'المقالات',item:B+'/articles/'},{'@type':'ListItem',position:3,name:a.title,item:B+p}]};
  fs.writeFileSync(path.join(OUT,'articles',a.slug+'.html'),head(a.title+' | معتصم هاشم',a.desc,p,ld(art)+'\n'+ld(bc),'article')+bar('a')+`<main id="main" class="wrap"><article>
<nav class="meta" aria-label="مسار الصفحة"><a href="/">الرئيسية</a> › <a href="/articles/">المقالات</a></nav>
<p class="eyebrow">شبكات وأنظمة</p><h1>${esc(a.title)}</h1>
<p class="meta"><time datetime="${a.date}">${arDate(a.date)}</time> · بقلم معتصم طارق هاشم</p>
<p class="lede">${esc(a.desc)}</p>
${a.body}
</article>${CTA}
<h2>مقالات ذات صلة</h2><div class="cards">${rel}</div></main>
`+FOOT)});
 fs.writeFileSync(path.join(OUT,'articles/index.html'),head('مقالات الشبكات والدعم الفني | معتصم هاشم','ملاحظات عملية من الميدان: شبكات وأنظمة ودعم فني وتشخيص أعطال.','/articles/',ld({'@context':'https://schema.org','@type':'CollectionPage',name:'مقالات الشبكات والدعم الفني',url:B+'/articles/',inLanguage:'ar'}))+bar('a')+`<main id="main" class="wrap wide"><p class="eyebrow">المقالات</p><h1>ملاحظات من الميدان</h1><p class="lede">خطوات تشخيص وأوامر جرّبتها في عملي مع الشبكات والأنظمة.</p><div class="cards">${A.map(a=>`<a class="card" href="/articles/${a.slug}"><span class="eyebrow">مقال</span><b>${esc(a.title)}</b><span class="d">${esc(a.desc)}</span></a>`).join('')}</div>${CTA}</main>
`+FOOT);
 const u=(p,pr,alt,d)=>`  <url>\n    <loc>${B}${p}</loc>\n    <lastmod>${d||new Date().toISOString().slice(0,10)}</lastmod>\n    <priority>${pr}</priority>\n${alt?`    <xhtml:link rel="alternate" hreflang="ar" href="${B}/"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${B}/en/"/>\n`:''}  </url>\n`;
 fs.writeFileSync(path.join(OUT,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+u('/',1.0,1)+u('/en/',0.9,1)+u('/articles/',0.8)+A.map(a=>u('/articles/'+a.slug,0.7,0,a.date)).join('')+u('/tools/',0.8)+u('/cheatsheet/',0.7)+'</urlset>\n');
 console.log('built:',A.length,'articles,',certs.length,'certificates');
}
build();
