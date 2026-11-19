---
title: "VLAN جديدة ولا يتصل الجهاز: 4 فحوصات على سويتش Cisco"
description: "خطوات عملية لتشخيص جهاز لا يتصل بعد إنشاء VLAN جديدة: المنفذ، الـtrunk، واجهة SVI، وDHCP."
slug: vlan-no-connectivity
date: 2026-11-17
---

أنشأت VLAN جديدة وربطت الجهاز بها، ومع ذلك لا يحصل على اتصال. في أغلب الحالات يكمن السبب في واحدة من أربع نقاط، وأفحصها بهذا الترتيب.

## 1) المنفذ على الـVLAN الصحيحة

تأكد أن المنفذ بوضع access وأنه عضو في الـVLAN المطلوبة:

```
show vlan brief
show interfaces fa0/5 switchport
```

إن لم يظهر المنفذ تحت الـVLAN فاضبطه:

```
interface fa0/5
 switchport mode access
 switchport access vlan 20
```

## 2) الـVLAN مسموحة على الـtrunk

إذا كان الجهاز على سويتش آخر، فيجب أن تمر الـVLAN عبر الرابط بين السويتشات:

```
show interfaces trunk
interface gi0/1
 switchport trunk allowed vlan add 20
```

> استخدم الكلمة `add` دائماً. حذفها يستبدل القائمة كلها ويقطع بقية الـVLANs.

## 3) واجهة SVI تعمل ولها عنوان

```
show ip interface brief
interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
```

تبقى واجهة SVI بحالة down حتى يوجد منفذ نشط واحد على الأقل في الـVLAN.

## 4) DHCP

إن كان خادم DHCP في شبكة أخرى فأضف عنوانه على واجهة الـVLAN:

```
interface vlan 20
 ip helper-address 192.168.1.10
```

ثم اجعل الجهاز يطلب عنواناً جديداً وراقب النتيجة. إن بقي عنوانه يبدأ بـ169.254 فاقرأ مقال [العنوان 169.254](/articles/dhcp-169-254).
