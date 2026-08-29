(function (global) {
  'use strict';
  var FakeID = (global.FakeID = global.FakeID || {});
  var i18n = (FakeID.i18n = {});

  var SUPPORTED = ['zh', 'en'];
  var STORAGE_KEY = 'fakeid.lang';

  /* ---- 界面文案字典（zh / en）------------------------------------------ */
  var dict = {
    zh: {
      'app.title': '各国虚拟身份生成器',
      'app.title.full': '各国虚拟身份生成器（本地离线版）',
      'app.subtitle': '本地离线版 · 仅供测试/演示用途，生成的均为合成随机数据，非真实个人信息',
      'ctrl.country': '国家',
      'ctrl.region': '地区/省',
      'ctrl.city': '城市',
      'ctrl.district': '区/县',
      'ctrl.emailSuffix': '邮箱后缀',
      'ctrl.emailCustom': '自定义后缀',
      'ctrl.gender': '性别',
      'ctrl.age': '年龄设置',
      'ctrl.ageRange': '年龄区间',
      'ctrl.cardType': '信用卡类型',
      'ctrl.count': '数量',
      'gender.random': '随机',
      'gender.male': '男',
      'gender.female': '女',
      'ageMode.random': '随机',
      'ageMode.exact': '自定义年龄',
      'ageMode.range': '年龄区间',
      'cardType.random': '随机',
      'count.1': '1 条',
      'count.3': '3 条',
      'count.5': '5 条',
      'count.10': '10 条',
      'btn.generate': '生成',
      'btn.copy': '复制全部',
      'btn.export': '导出 CSV',
      'email.any': '随机（国家默认）',
      'email.custom': '自定义…',
      'email.custom.ph': '例如 example.com',
      'region.any': '（随机）',
      'city.any': '（随机）',
      'district.any': '（随机）',
      'lang.system': '系统默认',
      'lang.zh': '中文',
      'lang.en': 'English',
      'theme.system': '跟随系统',
      'theme.light': '浅色',
      'theme.dark': '深色',
      'flash.generated': '已生成 {n} 条',
      'flash.copied': '已复制到剪贴板',
      'flash.copied.compat': '已复制（兼容模式）',
      'flash.copyfail': '复制失败，请手动选择',
      'flash.exported': '已导出 CSV',
      'flash.generateFail': '生成失败，请检查设置后重试',
      'flash.domainInvalid': '自定义后缀格式无效，请使用合法域名（如 example.com）',
      'disclaimer': '说明：本页为完全离线工具，不发起任何外部网络请求。国家/地区按「国家 → 地区/省 → 城市 → 区/县(可选)」联动；直辖市/特别行政区/台湾等本身即区级时无需再选。如需新增国家/地区，在 <code>assets/js/data/</code> 下新建一个数据文件，调用 <code>FakeID.registerCountry("code", { label, regions: [{ name, abbr?, cities: ["城市名"] }] })</code>，并在本文件底部按 defer 顺序引入即可，无需改动其它代码。'
    },
    en: {
      'app.title': 'Fake Identity Generator',
      'app.title.full': 'Fake Identity Generator (Offline)',
      'app.subtitle': 'Offline local version · For testing/demo only. All generated data is synthetic and random, not real personal information.',
      'ctrl.country': 'Country',
      'ctrl.region': 'Region/State',
      'ctrl.city': 'City',
      'ctrl.district': 'District',
      'ctrl.emailSuffix': 'Email Domain',
      'ctrl.emailCustom': 'Custom Suffix',
      'ctrl.gender': 'Gender',
      'ctrl.age': 'Age Setting',
      'ctrl.ageRange': 'Age Range',
      'ctrl.cardType': 'Card Type',
      'ctrl.count': 'Count',
      'gender.random': 'Random',
      'gender.male': 'Male',
      'gender.female': 'Female',
      'ageMode.random': 'Random',
      'ageMode.exact': 'Custom Age',
      'ageMode.range': 'Age Range',
      'cardType.random': 'Random',
      'count.1': '1 record',
      'count.3': '3 records',
      'count.5': '5 records',
      'count.10': '10 records',
      'btn.generate': 'Generate',
      'btn.copy': 'Copy All',
      'btn.export': 'Export CSV',
      'email.any': 'Random (country default)',
      'email.custom': 'Custom…',
      'email.custom.ph': 'e.g. example.com',
      'region.any': '(Random)',
      'city.any': '(Random)',
      'district.any': '(Random)',
      'lang.system': 'System',
      'lang.zh': '中文',
      'lang.en': 'English',
      'theme.system': 'System',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'flash.generated': 'Generated {n} records',
      'flash.copied': 'Copied to clipboard',
      'flash.copied.compat': 'Copied (fallback)',
      'flash.copyfail': 'Copy failed, please select manually',
      'flash.exported': 'CSV exported',
      'flash.generateFail': 'Generation failed, please check settings and retry',
      'flash.domainInvalid': 'Invalid custom domain. Please use a valid domain (e.g. example.com)',
      'disclaimer': 'Note: This page is a fully offline tool that makes no external network requests. Countries/regions use a cascade of "Country → Region/State → City → District (optional)"; municipalities/SARs/Taiwan are already at district level and need no further selection. To add a new country/region, create a data file under <code>assets/js/data/</code> that calls <code>FakeID.registerCountry("code", { label, regions: [{ name, abbr?, cities: ["City"] }] })</code>, and include it at the bottom of this file in defer order — no other code needs to change.'
    }
  };

  /* ---- 生成结果字段标签（按字段键）------------------------------------ */
  var FIELDS = {
    zh: {
      lastName: '姓', firstName: '名', fullName: '姓名', gender: '性别',
      birthDate: '出生日期', age: '年龄', height: '身高', weight: '体重',
      phone: '手机号', email: '邮箱', username: '用户名', password: '密码',
      id: '证件号', idCard: '身份证号', ssn: 'SSN(示意)', nino: 'NINO(示意)',
      myNumber: 'マイナンバー(示意)', taxId: 'Steuer-ID(示意)', nir: 'NIR(示意)',
      cf: 'Codice Fiscale(示意)', dni: 'DNI(示意)', sin: 'SIN(示意)',
      address: '地址', zip: '邮编', company: '公司', occupation: '职业',
      school: '学校', major: '专业', education: '学历', schoolType: '学校类型', schoolCountry: '学校所在国家',
      incomeLevel: '收入等级', companySize: '公司规模', skills: '技能', interests: '兴趣', personality: '人格特征', pet: '宠物', favoriteFood: '喜好食物', travelStyle: '旅行风格',
      hairColor: '发色', eyeColor: '瞳色', skinTone: '肤色', bloodType: '血型', bodyType: '体型',
      securityQuestion: '安全问题', securityAnswer: '安全答案', onlineSignature: '在线签名', timezone: '时区', website: '网站',
      cardType: '信用卡类型', cardNumber: '卡号', expiry: '有效期', cvv: '安全码'
    },
    en: {
      lastName: 'Last Name', firstName: 'First Name', fullName: 'Full Name', gender: 'Gender',
      birthDate: 'Date of Birth', age: 'Age', height: 'Height', weight: 'Weight',
      phone: 'Phone', email: 'Email', username: 'Username', password: 'Password',
      id: 'ID', idCard: 'ID Number', ssn: 'SSN (demo)', nino: 'NINO (demo)',
      myNumber: 'My Number (demo)', taxId: 'Tax ID (demo)', nir: 'NIR (demo)',
      cf: 'Codice Fiscale (demo)', dni: 'DNI (demo)', sin: 'SIN (demo)',
      address: 'Address', zip: 'Postal Code', company: 'Company', occupation: 'Occupation',
      school: 'School', major: 'Major', education: 'Education', schoolType: 'School Type', schoolCountry: 'School Country',
      incomeLevel: 'Income Level', companySize: 'Company Size', skills: 'Skills', interests: 'Interests', personality: 'Personality', pet: 'Pet', favoriteFood: 'Favorite Food', travelStyle: 'Travel Style',
      hairColor: 'Hair Color', eyeColor: 'Eye Color', skinTone: 'Skin Tone', bloodType: 'Blood Type', bodyType: 'Body Type',
      securityQuestion: 'Security Question', securityAnswer: 'Security Answer', onlineSignature: 'Online Signature', timezone: 'Timezone', website: 'Website',
      cardType: 'Card Type', cardNumber: 'Card Number', expiry: 'Expiry', cvv: 'CVV'
    }
  };

  /* ---- 信用卡/借记卡组织显示名（按卡组织 key）------------------------- */
  var CARDS = {
    zh: {
      visa: 'Visa', visaElectron: 'Visa Electron', mastercard: 'Mastercard', amex: '美国运通',
      discover: 'Discover', jcb: 'JCB', unionpay: '银联', diners: '大莱卡', carteBlanche: 'Carte Blanche',
      maestro: 'Maestro 借记卡', rupay: 'RuPay（印度）', mir: '米尔卡（Мир）', troy: 'Troy（土耳其）',
      elo: 'Elo（巴西）', dankort: 'Dankort（丹麦）', interac: 'Interac（加拿大）', verve: 'Verve（尼日利亚）',
      uatp: 'UATP（航空）', laser: 'Laser（爱尔兰）', switch: 'Switch（英国）', solo: 'Solo（英国）',
      bancontact: 'Bancontact（比利时）', enroute: 'EnRoute', voyager: 'Voyager', instapayment: 'InstaPayment',
      postepay: 'PostePay（意大利）', sbercard: 'SberCard（俄罗斯）', naps: 'NAPS（卡塔尔）', kcp: 'KCP（韩国）',
      meps: 'MEPS（马来西亚）', bccard: 'BC Card（韩国）', polcard: 'PolCard（波兰）', girocard: 'Girocard（德国）',
      carteBancaire: 'Carte Bancaire（法国）', lankapay: 'LankaPay（斯里兰卡）', nepalpay: 'NepalPay', bca: 'BCA（印尼）'
    },
    en: {
      visa: 'Visa', visaElectron: 'Visa Electron', mastercard: 'Mastercard', amex: 'American Express',
      discover: 'Discover', jcb: 'JCB', unionpay: 'UnionPay', diners: 'Diners Club', carteBlanche: 'Carte Blanche',
      maestro: 'Maestro', rupay: 'RuPay', mir: 'Mir', troy: 'Troy', elo: 'Elo', dankort: 'Dankort',
      interac: 'Interac', verve: 'Verve', uatp: 'UATP', laser: 'Laser', switch: 'Switch', solo: 'Solo',
      bancontact: 'Bancontact', enroute: 'EnRoute', voyager: 'Voyager', instapayment: 'InstaPayment',
      postepay: 'PostePay', sbercard: 'SberCard', naps: 'NAPS', kcp: 'KCP', meps: 'MEPS', bccard: 'BC Card',
      polcard: 'PolCard', girocard: 'Girocard', carteBancaire: 'Carte Bancaire', lankapay: 'LankaPay', nepalpay: 'NepalPay', bca: 'BCA'
    }
  };

  /* ---- 国家名称（按国家代码）------------------------------------------ */
  var COUNTRY = {
    zh: { china: '中国', us: '美国', japan: '日本', uk: '英国', germany: '德国', france: '法国', italy: '意大利', spain: '西班牙', canada: '加拿大' },
    en: { china: 'China', us: 'United States', japan: 'Japan', uk: 'United Kingdom', germany: 'Germany', france: 'France', italy: 'Italy', spain: 'Spain', canada: 'Canada' }
  };

  /* ---- 年龄类别职业标签（child/student/retired 代码 → 文案）----------- */
  var OCC = {
    zh: { child: '学龄前儿童', student: '学生', retired: '退休' },
    en: { child: 'Child', student: 'Student', retired: 'Retired' }
  };

  /* ---- 偏好与生效语言 ------------------------------------------------- */
  function detectSystemLang() {
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'zh'];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).toLowerCase();
      if (l.indexOf('zh') === 0) return 'zh';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'zh'; // 默认回退到中文（主界面文案为中文）
  }

  /* ---- 根据系统区域设置推断默认国家（地区子标签优先，语言退而次之）--- */
  // 地区子标签（语言标签中 “-” 之后的部分，如 en-US 的 US）到国家代码的映射
  var REGION_TO_COUNTRY = {
    CN: 'china', US: 'us', GB: 'uk', CA: 'canada', DE: 'germany',
    JP: 'japan', FR: 'france', IT: 'italy', ES: 'spain',
    AU: 'canada', NZ: 'canada', ZA: 'canada', IE: 'uk',
    CH: 'germany', AT: 'germany', BE: 'france', LU: 'france',
    MX: 'spain', AR: 'spain', CO: 'spain', PE: 'spain', CL: 'spain',
    BR: 'canada', PT: 'spain', TW: 'china', HK: 'china', MO: 'china',
    SG: 'canada', MY: 'canada', TH: 'canada', VN: 'canada', ID: 'canada',
    KR: 'canada', PH: 'canada', IN: 'canada'
  };
  // 仅有主语言、无地区子标签时的回退（如 zh → china，en → us）
  var LANG_TO_COUNTRY = {
    zh: 'china', ja: 'japan', de: 'germany', fr: 'france', it: 'italy', es: 'spain', en: 'us',
    pt: 'canada', ko: 'canada', ru: 'canada', ar: 'canada', hi: 'canada',
    nl: 'canada', pl: 'canada', tr: 'canada', sv: 'canada', da: 'canada',
    no: 'canada', fi: 'canada', cs: 'canada', hu: 'canada', ro: 'canada',
    sk: 'canada', bg: 'canada', hr: 'canada', sr: 'canada', sl: 'canada',
    et: 'canada', lv: 'canada', lt: 'canada', el: 'canada', he: 'canada',
    th: 'canada', vi: 'canada', id: 'canada', ms: 'canada', tl: 'canada'
  };
  function detectSystemCountry(codes) {
    codes = codes || (FakeID.listCountries ? FakeID.listCountries().map(function (c) { return c.code; }) : []);
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ''];
    var i, parts, region, l, code;
    // 第一遍：优先使用语言标签中的地区子标签（如 en-US → US → us）
    for (i = 0; i < langs.length; i++) {
      parts = String(langs[i]).split('-');
      if (parts.length > 1) {
        region = parts[parts.length - 1].toUpperCase();
        code = REGION_TO_COUNTRY[region];
        if (code && codes.indexOf(code) >= 0) return code;
      }
    }
    // 第二遍：退化为按主语言推断（如 zh → china，en → us）
    for (i = 0; i < langs.length; i++) {
      l = String(langs[i]).split('-')[0].toLowerCase();
      code = LANG_TO_COUNTRY[l];
      if (code && codes.indexOf(code) >= 0) return code;
    }
    return null;
  }

  var pref;
  try { pref = localStorage.getItem(STORAGE_KEY); } catch (e) { pref = null; console.warn('[i18n] localStorage 读取失败，语言偏好将不持久化:', e); }
  if (SUPPORTED.indexOf(pref) < 0) pref = 'system';

  function effective() {
    if (pref === 'system') return detectSystemLang();
    return SUPPORTED.indexOf(pref) >= 0 ? pref : 'zh';
  }
  var current = effective();

  var listeners = [];
  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](current, pref); } catch (e) {}
    }
  }

  /* ---- 公共 API ------------------------------------------------------- */
  i18n.SUPPORTED = SUPPORTED;
  i18n.lang = function () { return current; };
  i18n.pref = function () { return pref; };
  i18n.detectSystemLang = detectSystemLang;
  i18n.detectSystemCountry = detectSystemCountry;
  i18n.t = function (k) {
    var d = dict[current] || dict.zh;
    return (d && d[k] != null) ? d[k] : (dict.zh[k] != null ? dict.zh[k] : k);
  };
  i18n.field = function (k) {
    var d = FIELDS[current] || FIELDS.zh;
    return (d && d[k] != null) ? d[k] : (FIELDS.zh[k] != null ? FIELDS.zh[k] : k);
  };
  i18n.countryLabel = function (code) {
    var d = COUNTRY[current] || COUNTRY.zh;
    return (d && d[code] != null) ? d[code] : (COUNTRY.zh[code] != null ? COUNTRY.zh[code] : code);
  };
  i18n.occLabel = function (code) {
    var d = OCC[current] || OCC.zh;
    return (d && d[code] != null) ? d[code] : code;
  };
  i18n.card = function (key) {
    var d = CARDS[current] || CARDS.zh;
    return (d && d[key] != null) ? d[key] : (CARDS.zh[key] != null ? CARDS.zh[key] : key);
  };
  i18n.gender = function (code) {
    var en = current === 'en';
    return code === 'male' ? (en ? 'Male' : '男') : (en ? 'Female' : '女');
  };
  i18n.setLang = function (l, persist) {
    if (l !== 'system' && SUPPORTED.indexOf(l) < 0) l = 'system';
    pref = l;
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, l); }
      catch (e) { console.warn('[i18n] localStorage 写入失败，语言偏好将不持久化:', e); }
    }
    current = effective();
    notify();
  };
  i18n.onChange = function (cb) { listeners.push(cb); };

  /* 将 [data-i18n] / [data-i18n-ph] / [data-i18n-title] 翻译为当前语言 */
  i18n.apply = function (root) {
    root = root || document;
    var els = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) els[i].textContent = i18n.t(els[i].getAttribute('data-i18n'));
    var ph = root.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) ph[j].setAttribute('placeholder', i18n.t(ph[j].getAttribute('data-i18n-ph')));
    var ti = root.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < ti.length; k++) ti[k].setAttribute('title', i18n.t(ti[k].getAttribute('data-i18n-title')));
    // data-i18n-html removed for security (XSS prevention).
    // Disclaimer uses data-i18n with textContent; HTML entities are pre-encoded in dict.
  };
})(window);