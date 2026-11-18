# موقع معتصم طارق هاشم

موقع شخصي ثنائي اللغة (عربي/English) مبني بـHTML وCSS وJS بدون أدوات بناء. ينشر مباشرة على Vercel.

## الهيكل
- `index.html` الصفحة العربية، و`en/index.html` النسخة الإنجليزية.
- `articles/` مقالات بصفحات مستقلة، و`tools/` أدوات الشبكات، و`cheatsheet/` صفحة الملف المجاني.
- `assets/` الصور وملفات PDF وملفات CSS/JS المشتركة.
- `sitemap.xml` و`robots.txt` لمحركات البحث، و`vercel.json` للترويسات الأمنية.

## إضافة مقال
1. انسخ أي ملف من `articles/` وعدّل العنوان والمحتوى وبيانات Article.
2. أضف الرابط إلى `articles/index.html` وإلى قسم المقالات في `index.html`.
3. أضف الرابط إلى `sitemap.xml` وغيّر `lastmod`.

## Google Search Console
1. أضف الموقع كخاصية Domain أو URL prefix.
2. اختر التحقق بوسم HTML وألصق الوسم `<meta name="google-site-verification" ...>` داخل `<head>` في `index.html`.
3. بعد النشر أرسل `https://moatasem.vercel.app/sitemap.xml` من قسم Sitemaps.

## النشر
أي `git push` إلى الفرع `main` ينشر الموقع تلقائياً بعد ربط المستودع بمشروع Vercel.
