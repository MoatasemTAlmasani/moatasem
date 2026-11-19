# موقع معتصم طارق هاشم

موقع ثنائي اللغة (عربي/English) يُولَّد من ملفات في `content/` بواسطة `build.js` على Vercel، ويُدار من لوحة تحكم على `/admin`.

## لوحة التحكم
1. افتح `https://moatasem.vercel.app/admin` من أي جهاز.
2. اختر Sign in with GitHub token، والصق مفتاح الدخول (انظر أدناه).
3. من اللوحة: **المقالات** (إضافة مقال)، و**محتوى الموقع** (الشهادات، الخبرات، المهارات، المشاريع، أتعلمه حالياً، التعليم).
4. اضغط Save ثم Publish. يظهر التغيير على الموقع بعد دقيقة تقريباً.

### إنشاء مفتاح الدخول (مرة واحدة)
GitHub ← Settings ← Developer settings ← Personal access tokens ← Fine-grained tokens ← Generate new token.
- Repository access: Only select repositories واختر مستودع الموقع.
- Permissions ← Repository permissions ← **Contents: Read and write**.
احتفظ بالمفتاح في مكان آمن ولا تشاركه مع أحد.

## بنية المشروع
- `content/*.json` بيانات الأقسام، و`content/articles/*.md` المقالات.
- `build.js` يولّد مجلد `dist/` (الصفحة الرئيسية، والإنجليزية، والمقالات، وsitemap.xml).
- `index.html` و`en/index.html` قالبان: الأقسام المحاطة بـ `<!--cms:...-->` تُستبدل عند كل بناء، فلا تعدّلها يدوياً.
- `tools/` و`cheatsheet/` و`assets/` و`404.html` ملفات ثابتة تُنسخ كما هي.
- `admin/config.yml` يحدد حقول اللوحة.

## أمر البناء محلياً
`node build.js` ثم افتح مجلد `dist/`.

## Google Search Console
أضف وسم التحقق داخل `<head>` في `index.html`، ثم أرسل `https://moatasem.vercel.app/sitemap.xml`.
