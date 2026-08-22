# 虚拟身份生成器（本地离线版）

<p align='center'>
  <a href='README.md'>English</a> &nbsp;·&nbsp; <a href='README_zh.md'>中文</a>
</p>

<p align='center'>
  <img alt='运行环境' src='https://img.shields.io/badge/%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83-100%25%20%E7%A6%BB%E7%BA%BF-blue'>
  <img alt='依赖' src='https://img.shields.io/badge/%E4%BE%9D%E8%B5%96-%E9%9B%B6-brightgreen'>
  <img alt='国际化' src='https://img.shields.io/badge/%E5%9B%BD%E9%99%85%E5%8C%96-%E4%B8%AD%E6%96%87%20%7C%20English-orange'>
  <img alt='国家数' src='https://img.shields.io/badge/%E5%9B%BD%E5%AE%B6-9-important'>
</p>

一个完全**离线**、**零依赖**的网页应用，可为 9 个国家/地区生成逼真但不真实的「虚拟身份」。所有数据均在浏览器本地随机合成 —— **不发起任何外部网络请求**，无需构建步骤，可直接以文件形式运行。

> ⚠️ **免责声明** —— 本工具生成的一切内容均为虚构、随机合成的演示数据，**仅供测试、原型设计与演示用途**。它**不是**真实个人信息；所生成的证件号码、SSN、银行卡号等均为**示意性**数据，**严禁**用于冒充任何真实个人或从事任何欺诈行为。

---

## 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [浏览器支持](#浏览器支持)
- [截图展示](#截图展示)
- [支持的国家/地区](#支持的国家地区)
- [生成的身份字段](#生成的身份字段)
- [真实性引擎](#真实性引擎)
  - [出生日期与年龄](#出生日期与年龄)
  - [身高体重](#身高体重)
  - [按年龄划分的职业](#按年龄划分的职业)
  - [按年龄划分的在职公司](#按年龄划分的在职公司)
  - [信用卡](#信用卡)
  - [各国专属证件](#各国专属证件)
- [信用卡卡组织](#信用卡卡组织)
- [国际化（i18n）](#国际化i18n)
- [主题（浅色 / 深色 / 跟随系统）](#主题浅色--深色--跟随系统)
- [复制与 CSV 导出](#复制与-csv-导出)
- [项目结构](#项目结构)
- [架构](#架构)
- [开发者指南：新增国家/地区](#开发者指南新增国家地区)
- [API 参考](#api-参考)
- [隐私与安全](#隐私与安全)
- [已知限制](#已知限制)

---

## 功能特性

- **100% 离线、零依赖。** 纯 HTML/CSS/JavaScript（以经典脚本 `defer` 方式加载），无需服务器、打包工具或 `npm install`，可直接以 `file://` 打开运行。
- **支持 9 个国家/地区**，并按语言/地区提供贴合当地的姓氏、名字、地区、城市、街道、公司、职业与邮箱域名。
- **级联（联动）地址选择器** —— *国家 → 地区/省 → 城市 → 区/县（可选）*。直辖市、特别行政区及台湾本身即为区级，无需再做下级选择。
- **中英双语界面（中文 / English）**，自动探测访客系统语言，并通过 `localStorage` 持久化偏好。
- **浅色 / 深色 / 跟随系统** 三套主题，由集中式的「设计令牌（Design Tokens）」CSS 变量驱动，过渡平滑，且首屏加载无主题闪烁（FOUC）。
- **基于年龄的真实性生成** —— 出生日期、身高体重、职业、任职公司与信用卡均与所生成年龄保持内在一致。
- **结构合法的证件号码** —— 中国身份证采用真实的 GB 11643-1999（模 11-2）校验算法；银行卡号通过 **Luhn** 校验；SSN/NINO/My Number/Steuer-ID/NIR/Codice Fiscale/DNI 均遵循各自的格式规范（均为示意数据）。
- **灵活的控件** —— 性别、年龄模式（随机 / 指定 / 区间）、邮箱后缀（按国家随机 / 主流邮箱 / 自定义）、卡组织，以及批量数量（1/3/5/10 条）。
- **复制全部**（Clipboard API，并带 `execCommand` 兼容回退）与 **导出 CSV**（带 UTF-8 BOM、符合 RFC 的引号/转义），便于在测试与演示中快速复用。

---

## 快速开始

无需安装或构建。

1. 下载 / 克隆本仓库。
2. 使用任意现代浏览器打开 `index.html`（直接双击即可 —— `file://` 完全受支持）。
3. 选择国家，调整控件，点击 **生成**。

也可使用任意静态服务器托管：

```bash
# Python
python3 -m http.server 8080
# 然后访问 http://localhost:8080

# 或 Node
npx serve .
```

---

## 浏览器支持

| 功能 | 最低要求 |
| --- | --- |
| 核心生成 | 支持 ES5 及 `Array`/`String` 的任意浏览器 |
| 复制 | `navigator.clipboard`（带 `document.execCommand('copy')` 回退） |
| 深色模式自动探测 | `window.matchMedia('(prefers-color-scheme: dark)')` |
| 偏好持久化 | `localStorage`（被禁用时优雅降级） |

已在主流桌面与移动浏览器（常青版本）上做概念性验证。

---

## 截图展示

> 界面完全中英双语（中文 / English）。以下每组截图展示同一界面在两种语言、浅色与深色主题下的效果。

| 功能 | 中文 | English |
| --- | --- | --- |
| **界面语言**<br>Interface language | <img src="screenshots/language-Chinese.PNG" width="300" alt="界面语言（中文）"> | <img src="screenshots/language-English.PNG" width="300" alt="Interface language (English)"> |
| **浅色模式**<br>Light mode | <img src="screenshots/light%20mode-Chinese.PNG" width="300" alt="浅色模式（中文）"> | <img src="screenshots/light%20mode-English.PNG" width="300" alt="Light mode (English)"> |
| **深色模式**<br>Dark mode | <img src="screenshots/dark%20mode-Chinese.PNG" width="300" alt="深色模式（中文）"> | <img src="screenshots/dark%20mode-English.PNG" width="300" alt="Dark mode (English)"> |
| **国家选择**<br>Country selection | <img src="screenshots/Country%20Choice-Chinese.png" width="300" alt="国家选择（中文）"> | <img src="screenshots/Country%20Choice-English.png" width="300" alt="Country selection (English)"> |
| **生成示例**<br>Generation example | <img src="screenshots/Generate%20Example-Chinese.PNG" width="300" alt="生成示例（中文）"> | <img src="screenshots/Generate%20Example-English.PNG" width="300" alt="Generation example (English)"> |

---

## 支持的国家/地区

| 代码 | 国家/地区 | 语言 | 证件字段 | 说明 |
| --- | --- | --- | --- | --- |
| `china` | 中国 | `zh` | 身份证号 | 6 位地区码 + 校验位；直辖市/特别行政区/台湾按区级处理 |
| `us` | 美国 | `en` | SSN（示意） | 格式 `AAA-BB-CCCC`；避开 666 与 900+ 地区码 |
| `japan` | 日本 | `ja` | My Number（示意） | 12 位；日文姓名 |
| `uk` | 英国 | `en` | NINO（示意） | 例如 `AB123456C` |
| `germany` | 德国 | `de` | Steuer-ID（示意） | 11 位，按 `XX XXX XXX XXX` 分组展示 |
| `france` | 法国 | `fr` | NIR（示意） | 内嵌性别与出生日期 |
| `italy` | 意大利 | `it` | Codice Fiscale（示意） | |
| `spain` | 西班牙 | `es` | DNI（示意） | |
| `canada` | 加拿大 | `en` | SIN（示意） | 格式 `XXX-XXX-XXX`；邮编 `A1B 2C3` |

> 说明：以上所有证件均为**合成、仅供演示**的数据 —— 虽遵循公开格式/校验规范，但**并非**有效、可签发的号码。

---

## 生成的身份字段

身份档案存在两种「形态」：

**西式档案**（由 `util.buildWestern` 构建，用于 `us`、`uk`、`japan`、`germany`、`france`、`italy`、`spain`、`canada`）：

| 字段键 | 标签（中文） | 标签（English） | 说明 |
| --- | --- | --- | --- |
| `lastName` | 姓 | Last Name | |
| `firstName` | 名 | First Name | |
| `gender` | 性别 | Gender | `male` / `female` |
| `birthDate` | 出生日期 | Date of Birth | `YYYY-MM-DD` |
| `age` | 年龄 | Age | 由出生日期推算 |
| `height` | 身高 | Height | 例如 `172 cm` |
| `weight` | 体重 | Weight | 例如 `68 kg` |
| `phone` | 手机号 | Phone | 当地前缀 + 随机 |
| `email` | 邮箱 | Email | 取自邮箱池 / 自定义域名 |
| `username` | 用户名 | Username | ASCII 句柄 |
| `password` | 密码 | Password | 10 位随机 |
| `id` | 证件号 / SSN(示意) / … | ID / SSN / NINO / … | 各国不同（标签随之变化） |
| `address` | 地址 | Address | 街道 + 城市（+ 地区） |
| `zip` | 邮编 | Postal Code | 各国格式不同 |
| `company` | 公司 | Company | 仅劳动年龄成年人 |
| `occupation` | 职业 | Occupation | 年龄类别或职业池抽取 |
| `cardType` | 信用卡类型 | Card Type | 仅成年人（≥ 18 岁） |
| `cardNumber` | 卡号 | Card Number | 通过 Luhn 校验 |
| `expiry` | 有效期 | Expiry | `MM/YY` |
| `cvv` | 安全码 | CVV | 3–4 位 |

**中国档案**（`china` 模块，使用合并姓名）：

| 字段键 | 标签（中文） | 标签（English） |
| --- | --- | --- |
| `fullName` | 姓名 | Full Name |
| `gender` | 性别 | Gender |
| `birthDate` | 出生日期 | Date of Birth |
| `age` | 年龄 | Age |
| `height` | 身高 | Height |
| `weight` | 体重 | Weight |
| `idCard` | 身份证号 | ID Number |
| `phone` | 手机号 | Phone |
| `email` | 邮箱 | Email |
| `username` | 用户名 | Username |
| `password` | 密码 | Password |
| `address` | 地址 | Address |
| `company` | 公司 | Company（仅劳动年龄） |
| `occupation` | 职业 | Occupation |
| `cardType` / `cardNumber` / `expiry` / `cvv` | 信用卡相关 | Card fields（仅成年人 ≥ 18 岁） |

字段在内部均以 `[key, value]`（键值对）形式存储，并在渲染时按当前界面语言本地化，因此同一份数据可在中文与英文之间切换展示。

---

## 真实性引擎

所有随机性都经由 `util` 工具函数统一处理，以确保生成记录的内在一致性。

### 出生日期与年龄

- `ageMode = random`（随机）→ 出生日期在 **1965** 至 **2004** 年间均匀采样。
- `ageMode = exact`（指定）→ 选取使 `util.ageFrom(date)` **精确等于**目标年龄的出生日期（保证今年生日已过）。
- `ageMode = range`（区间）→ 先在闭区间内抽取年龄（若 min/max 颠倒则自动交换），再反推精确出生日期。
- `util.ageFrom(date)` 以正确的月/日逻辑计算当前年龄。

### 身高体重

`util.bodyMetrics(gender, age)` 返回一个 `[身高cm, 体重kg]` 数组，按成长系数缩放：

- 婴幼儿身高按比例较小（不会出现「婴儿拥有成人身材」）；
- 3–17 岁逐步向成年身高插值；
- 成年人以性别基准身高叠加个体差异；
- 老年人（≥ 70 岁）身高略有萎缩；
- 体重由适龄 BMI × 身高² 估算。

### 按年龄划分的职业

`util.occupationForAge(age, cfg)` 强制年龄适配：

| 年龄 | 类别 | 行为 |
| --- | --- | --- |
| < 6 | 学龄前儿童（child） | 无职业 |
| 6 – 17 | 学生（student） | 无职业 |
| 18 – 64 | 劳动年龄成年人 | 从该国语言职业池随机抽取 |
| ≥ 65 | 退休（retired） | 无职业 |

类别**代码**（`child` / `student` / `retired`）被存储并在渲染时本地化；成年职业名称取自该国母语职业池，**不**随界面语言翻译。

### 按年龄划分的在职公司

`util.companyForAge(age, cfg)` 仅对劳动年龄成年人（18–64 岁）返回任职公司。未成年人、学龄前儿童、学生与退休者**不会**出现 `company` 字段 —— 避免出现「5 岁却在某公司任职」这类矛盾。

### 信用卡

`util.creditCardForAge(age, opts)` 仅在 `age ≥ 18` 时输出四个信用卡字段，未成年人不生成。生成时：

- 卡组织由 `opts.cardType` 指定，或随机选取；
- 卡号由合法的 IIN/BIN 前缀填充至长度后，追加 **Luhn** 校验位（`util.luhnCheckDigit`）；
- 有效期为 2025–2034 年间的 `MM/YY`；安全码位数依卡组织而定（3 位，美国运通为 4 位）；
- 展示格式遵循各卡组织规范（运通为 `4-6-5`，其余为 `4-4-4-4`）。

### 各国专属证件

- **中国 `idCard`** —— `util.makeChinaID(region6, date)` 组合 `地区码(6) + 出生日期(8) + 顺序码(3) + 校验码(1)`，并使用 `util.chinaIDChecksum` 按 GB 11643-1999（模 11-2）权重 `[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]` 与余数映射 `['1','0','X','9','8','7','6','5','4','3','2']` 计算校验位。
- **美国 `ssn`** —— `AAA-BB-CCCC`；地区码避开 `000`、`666` 与 `900–999`。
- **英国 `nino`** —— 两位字母 + 6 位数字 + 一位后缀字母（`A–D`）。
- **日本 `myNumber`** —— 12 位。
- **德国 `taxId`（Steuer-ID）** —— 11 位，按 `XX XXX XXX XXX` 分组展示。
- **法国 `nir`** —— 按法国 NIR 规范内嵌性别与出生日期。
- **意大利 `cf`** —— Codice Fiscale 风格。
- **西班牙 `dni`** —— DNI 风格。
- **加拿大 `sin`** —— `XXX-XXX-XXX`；邮编遵循 `A1B 2C3`。

---

## 信用卡卡组织

`util.cardTypes` 注册表内置约 **60** 个全球与地区性卡组织（含品牌名、IIN/BIN 前缀、卡号长度、安全码长度）。择要列举：

Visa、Visa Electron、Mastercard、美国运通（American Express）、Discover、JCB、银联（UnionPay）、大莱卡（Diners Club）、Carte Blanche、Maestro、RuPay、米尔卡（Мир）、Troy、Elo、Dankort、Interac、Verve、UATP、Laser、Switch、Solo、Bancontact、EnRoute、Voyager、InstaPayment、PostePay、SberCard、NAPS、KCP、MEPS、BC Card、PolCard、Girocard、Carte Bancaire、LankaPay、NepalPay、BCA 等。

品牌显示名通过 `i18n.card(key)` 进行本地化。

---

## 国际化（i18n）

`assets/js/i18n.js` 是界面文案与字段标签的唯一来源。

- **语言：** `zh`（中文）与 `en`（English）。系统语言由 `navigator.languages` 自动探测（缺省回退到中文）。
- **持久化：** 所选偏好（`system` / `zh` / `en`）保存于 `localStorage['fakeid.lang']`。
- **DOM 翻译：** `i18n.apply(root)` 会改写带有以下属性的元素：
  - `data-i18n` → `textContent`
  - `data-i18n-ph` → `placeholder`
  - `data-i18n-title` → `title`
  - `data-i18n-html` → `innerHTML`（用于免责声明）
- **字段与取值本地化：** `i18n.field(key)`、`i18n.gender(code)`、`i18n.occLabel(code)`、`i18n.card(key)`、`i18n.countryLabel(code)` 保证生成结果与当前语言一致。
- **观察者：** `i18n.onChange(cb)` 允许界面在切换语言时无刷新重新渲染。

---

## 主题（浅色 / 深色 / 跟随系统）

`assets/js/theme.js` 管理 `system` / `light` / `dark` 偏好，持久化于 `localStorage['fakeid.theme']`。

- `system`（跟随系统）→ 不设置 `data-theme` 属性，由 CSS `@media (prefers-color-scheme: dark)` 自动决定（并实时跟随系统变化）。
- `light` / `dark` → 显式写入 `data-theme` 属性，覆盖系统偏好。
- `<head>` 中的一小段内联脚本会在首屏绘制前应用已保存的显式主题，避免主题闪烁（FOUC）。
- 设计令牌（颜色、边框、阴影）集中为 `assets/css/styles.css` 中的 CSS 变量，在两种模式下保持统一的 slate 中性色阶 + 主蓝/翠绿强调色，并有平滑的颜色过渡。

---

## 复制与 CSV 导出

- **复制全部** —— 将全部生成记录（按当前语言本地化）拼接为纯文本块，通过 `navigator.clipboard.writeText` 写入剪贴板；在不支持的浏览器中回退到隐藏 `<textarea>` + `document.execCommand('copy')`。
- **导出 CSV** —— 输出以 BOM（`﻿`）开头的 UTF-8 文件，确保 Excel 正确识别中文；对含逗号、引号或换行的字段进行符合 RFC 的引号/转义处理。表头使用本地化后的字段标签。

---

## 项目结构

```text
.
├── index.html                 # 应用外壳；按依赖顺序以 defer 加载脚本
└── assets
    ├── css
    │   └── styles.css          # 设计令牌主题（浅色/深色/跟随系统）
    └── js
        ├── i18n.js             # 界面文案、字段标签、卡组织/国家/职业名称
        ├── util.js             # 注册表 + 生成工具（无依赖）
        ├── generator.js        # FakeID.generate / FakeID.listCountries
        ├── theme.js            # 浅色/深色/跟随系统 偏好 + 观察者
        ├── app.js              # 界面编排（级联选择、渲染、复制、导出）
        └── data
            ├── occupations.js  # 各语言职业池（util.occupationPool）
            ├── maildomains.js  # 各语言邮箱域名池（util.emailPool）
            ├── china.js        # registerCountry('china', …) —— 自定义 make()
            ├── us.js           # registerCountry('us', …)   —— buildWestern
            ├── japan.js        # registerCountry('japan', …)
            ├── uk.js           # registerCountry('uk', …)
            ├── germany.js      # registerCountry('germany', …)
            ├── france.js       # registerCountry('france', …)
            ├── italy.js        # registerCountry('italy', …)
            ├── spain.js        # registerCountry('spain', …)
            └── canada.js       # registerCountry('canada', …)
```

---

## 架构

应用围绕单一的全局命名空间 **`window.FakeID`** 构建，由若干小巧、相互独立的模块以 `defer` 方式加载（执行顺序即文档顺序，因此 `file://` 下无需模块系统或 CORS 即可工作）。

| 模块 | 职责 |
| --- | --- |
| `i18n.js` | 中英文案字典：界面字符串、字段标签、卡组织品牌名、国家名、年龄类别职业标签；提供 `apply()`、`t()`、`field()`、`card()`、`gender()`、`countryLabel()`、`occLabel()`、`setLang()`、`onChange()`。 |
| `util.js` | 核心引擎：随机数助手、日期/年龄逻辑、身高体重、按年龄的职业/公司、密码/句柄生成、中国身份证校验、邮箱/池解析器、共享的 `buildWestern()` 档案构建器、`cardTypes` 注册表与 Luhn 逻辑，以及**国家注册表**（`registerCountry`）。 |
| `generator.js` | 对外入口 `FakeID.generate(code, opts)` 与 `FakeID.listCountries()`。 |
| `theme.js` | 主题偏好 + 观察者；向 `<html>` 写入 `data-theme`。 |
| `app.js` | 串联 DOM：国家→地区→城市→区县 的级联选择、控件联动、渲染、复制/导出，以及语言/主题切换。 |
| `data/*.js` | 每个文件一次 `registerCountry(code, cfg)` 调用。`occupations.js` 与 `maildomains.js` 提供共享的、按语言分组的池。 |

**扩展模型：** 一个国家/地区本质上只是一个调用 `FakeID.registerCountry('code', { label, locale, regions, make })` 的数据文件。界面通过 `FakeID.listCountries()` 自动发现它 —— 除新增 `<script>` 标签外，无需改动 `app.js` 或 `index.html` 的控件逻辑。

---

## 开发者指南：新增国家/地区

1. **在 `assets/js/data/` 下新建数据模块**，例如 `assets/js/data/example.js`：

```js
(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;

  var surnames    = ['姓氏1', '姓氏2'];
  var givenMale   = ['男名1', '男名2'];
  var givenFemale = ['女名1', '女名2'];
  // 地区 → 城市 →（可选）区县
  var regions = [
    { name: '地区A', abbr: 'RA', cities: ['城市X', '城市Y'] },
    { name: '地区B', cities: [{ name: '城市Z', districts: ['区县1'] }] }
  ];
  var streets   = ['主街', '橡树路'];
  var companies = ['示例有限公司', '示例集团'];
  var jobs      = util.occupationPool('zh'); // 或 'en','de','fr','it','es','ja'

  FakeID.registerCountry('ex', {
    label: '示例国',          // 显示在国家下拉框中（在 i18n.COUNTRY 中本地化）
    locale: 'zh',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('zh'),
        phonePrefix: ['138'], phoneLen: 8,
        idLabel: 'id',
        idFn: function () { return 'ID-' + util.pad(util.randInt(0, 999999), 6); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.randInt(1, 199) + ' ' + u.pick(streets) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(0, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'zh'
      };
      return util.buildWestern(cfg, opts); // 共享的西式档案构建器
    }
  });
})(window);
```

2. **登记语言字符串**（国家名 + 任何新增职业文本）到 `assets/js/i18n.js` —— 将代码加入 `zh` 与 `en` 两个 `COUNTRY` 映射，使下拉标签能正确本地化。

3. **加载脚本**：在 `index.html` 的 `defer` 顺序中加入该文件，位置在 `util.js` / `occupations.js` / `maildomains.js` 之后、`generator.js` 之前：

```html
<script defer src='assets/js/data/example.js'></script>
```

完成 —— 新国家即出现在下拉框中，并自动具备级联、国际化、主题、复制与 CSV 导出等能力，无需改动其它代码。

---

## API 参考

### `window.FakeID`

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `generate` | `generate(code, opts) → Array<[key, value]>` | 生成一条身份。详见下方 `opts`。 |
| `listCountries` | `listCountries() → Array<{code,label,hasStates,states,hasRegions,regions}>` | 列出已注册国家。 |
| `countries` | `Object<code, cfg>` | 原始注册表。 |
| `registerCountry` | `registerCountry(code, cfg)` | 注册一个国家/地区。 |
| `util` | `Object` | 核心引擎（见下）。 |
| `i18n` | `Object` | 国际化 API（见下）。 |
| `theme` | `Object` | 主题 API（见下）。 |

### 生成选项（`opts`）

| 键 | 取值 | 作用 |
| --- | --- | --- |
| `gender` | `'random'` \| `'male'` \| `'female'` | 性别选择。 |
| `cardType` | `'random'` \| 卡组织键 | 指定卡组织或随机。 |
| `region` | 地区名 | 限定到某地区/省。 |
| `city` | 城市名 | 限定到某城市。 |
| `district` | 区县名 | 限定到某区县（如适用）。 |
| `ageMode` | `'random'` \| `'exact'` \| `'range'` | 年龄策略。 |
| `ageExact` | 数字 | 当 `ageMode === 'exact'` 时使用。 |
| `ageMin` / `ageMax` | 数字 | 当 `ageMode === 'range'` 时使用。 |
| `emailDomain` | 字符串 | 覆盖国家默认邮箱域名（自动去除前导 `@`）。 |

### `FakeID.util`（择要）

`randInt(min,max)`、`pick(arr)`、`chance(p)`、`pad(n,len)`、`randomDate(y1,y2)`、`formatDate(d,sep)`、`ageFrom(d)`、`deaccent(s)`、`birthDate(opts)`、`birthDateForAge(age)`、`bodyMetrics(gender,age)`、`occupationForAge(age,cfg)`、`companyForAge(age,cfg)`、`password(len)`、`randomHandle(len)`、`chinaIDChecksum(body17)`、`makeChinaID(region6,date)`、`emailDomain(opts,defaults)`、`buildWestern(cfg,opts)`、`emailPool(locale)`、`occupationPool(locale)`、`cardTypes`、`cardTypeKeys()`、`luhnCheckDigit(body)`、`creditCard(opts)`、`formatCardNumber(num,key)`、`creditCardFields(opts)`、`creditCardForAge(age,opts)`、`registerCountry(code,cfg)`。

### `FakeID.i18n`

`SUPPORTED`、`lang()`、`pref()`、`detectSystemLang()`、`t(key)`、`field(key)`、`countryLabel(code)`、`occLabel(code)`、`card(key)`、`gender(code)`、`setLang(lang, persist?)`、`onChange(cb)`、`apply(root)`。

### `FakeID.theme`

`SUPPORTED`（`['system','light','dark']`）、`pref()`、`systemPrefersDark()`、`isDark()`、`set(theme)`、`onChange(cb)`。

---

## 隐私与安全

- **无网络访问。** 页面零外部请求（无 CDN、无分析、无外部字体、无遥测）。打开浏览器「网络」面板，不会看到任何数据离开浏览器。
- **不存储生成数据。** 记录仅在 DOM 中存在，直到你复制或导出；不会写入服务器或被共享。
- **纯合成。** 所有取值均为随机生成；证件虽遵循公开格式规范，但**并非**有效签发号码，不得用于代表真实个人。

---

## 已知限制

- 姓名与职业池为**精选样例**，并非穷尽的人口普查数据；仅作示意，不具统计代表性。
- 中文（`zh`）职业池中仍混有少量尚未本地化的占位条目，待清理。
- 证件均为**演示/示意**性质 —— 虽符合公开格式与校验，但未经校验、不可签发。
- 本仓库暂未包含自动化测试或 CI。

---

## Star 历史

<a href="https://www.star-history.com/?repos=ljy969%2FVirtual-Identity-Generator&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=ljy969/Virtual-Identity-Generator&type=date&theme=dark&legend=top-left&sealed_token=3qIFWIq4W_I-K9HkzvFZigUDxouDgAhC2iSEf1vV-m65Kx6TzulfXGXOfTWEu6m9qBYhJEayzj8JC7oMewXrlQwMavS4PPY02dzAwQDHI8NJfm1zOQxWSA" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=ljy969/Virtual-Identity-Generator&type=date&legend=top-left&sealed_token=3qIFWIq4W_I-K9HkzvFZigUDxouDgAhC2iSEf1vV-m65Kx6TzulfXGXOfTWEu6m9qBYhJEayzj8JC7oMewXrlQwMavS4PPY02dzAwQDHI8NJfm1zOQxWSA" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=ljy969/Virtual-Identity-Generator&type=date&legend=top-left&sealed_token=3qIFWIq4W_I-K9HkzvFZigUDxouDgAhC2iSEf1vV-m65Kx6TzulfXGXOfTWEu6m9qBYhJEayzj8JC7oMewXrlQwMavS4PPY02dzAwQDHI8NJfm1zOQxWSA" />
 </picture>
</a>
