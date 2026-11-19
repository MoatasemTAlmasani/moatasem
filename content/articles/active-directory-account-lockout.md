---
title: "حساب Active Directory مقفل: كيف تعرف السبب وتفتحه"
description: "فتح الحساب المقفل في Active Directory وتتبع مصدر القفل عبر الأحداث 4740 على متحكم النطاق."
slug: active-directory-account-lockout
date: 2026-11-17
---

يتصل المستخدم قائلاً إنه لا يستطيع الدخول رغم أن كلمة المرور صحيحة. غالباً حسابه مقفل بسبب محاولات فاشلة متكررة، وأحياناً بسبب جهاز يستخدم كلمة مرور قديمة.

## فتح الحساب

من واجهة Active Directory Users and Computers: افتح خصائص المستخدم، تبويب Account، ثم اختر Unlock account. أو بـPowerShell:

```
Unlock-ADAccount -Identity username
Get-ADUser username -Properties LockedOut,BadLogonCount,LastBadPasswordAttempt
```

## معرفة سبب القفل

فتح الحساب لا يكفي إن عاد القفل بعد دقائق. المصدر الشائع هو جهاز أو خدمة تحاول الدخول بكلمة قديمة: هاتف متصل بالبريد، أو قرص شبكي مربوط، أو مهمة مجدولة، أو جلسة RDP قديمة.

على متحكم النطاق الذي يحمل دور PDC Emulator ابحث في سجل Security عن الحدث `4740` الذي يعرض اسم الجهاز المتسبب:

```
Get-WinEvent -FilterHashtable @{LogName='Security';Id=4740} -MaxEvents 20 |
 Select TimeCreated,Message
```

> لا تعطِ المستخدم كلمة مرور مؤقتة عبر قناة غير آمنة، واطلب منه تغييرها عند أول دخول (User must change password at next logon).

بعد تحديد الجهاز المتسبب حدّث كلمة المرور المخزّنة فيه أو احذفها، فينتهي القفل المتكرر من جذره.
