/* util.js — 通用工具与注册表（多文件生成器的基础，无外部依赖）
 * 扩展方式：其他国家/地区的数据文件都依赖这里的工具函数。 */
/**
 * @typedef {Object} FakeIDUtil
 * @property {function(number, number): number} randInt
 * @property {function(Array): *} pick
 * @property {function(number): boolean} chance
 * @property {function(string|number, number): string} pad
 * @property {function(number, number): Date} randomDate
 * @property {function(Date, string=): string} formatDate
 * @property {function(Date): number} ageFrom
 * @property {function(string): string} deaccent
 * @property {function(number): Date} birthDateForAge
 * @property {function(Object): Date} birthDate
 * @property {function(string, number): number[]} bodyMetrics
 * @property {function(number, Object): string} occupationForAge
 * @property {function(number, Object): (string|null)} companyForAge
 * @property {function(number=): string} password
 * @property {function(number=): string} randomHandle
 * @property {function(string): string} chinaIDChecksum
 * @property {function(string, Date): string} makeChinaID
 * @property {function(Object, Array<string>): string} emailDomain
 * @property {function(Object, Object): Array<Array<string>>} buildWestern
 * @property {function(string): Array<string>} emailPool
 * @property {function(string): Array<string>} occupationPool
 * @property {Object<string, Object>} cardTypes
 * @property {function(): string[]} cardTypeKeys
 * @property {function(string): number} luhnCheckDigit
 * @property {function(Object): Object} creditCard
 * @property {function(string, string): string} formatCardNumber
 * @property {function(Object): Array<Array<string>>} creditCardFields
 * @property {function(number, Object): Array<Array<string>>} creditCardForAge
 * @property {function(Array, number, string=): string} pickSome
 * @property {function(Object, Object): Array<Array<string>>} profileFields
 * @property {function(string): string} timezoneFor
 * @property {function(Object): string} websiteFor
 * @property {function(string, Object): void} registerCountry
 * @property {Object<string, Object>} countries
 * @property {Object} MAILDOMAINS
 * @property {Object} OCCUPATIONS
 */

/**
 * @type {FakeIDUtil}
 */
var util = (function (global) {
  'use strict';
  var FakeID = (global.FakeID = global.FakeID || {});
  var util = (FakeID.util = {});

  /**
   * 加密安全的随机数生成 (0-1)
   * 使用 crypto.getRandomValues，回退到 Math.random (极旧浏览器)
   * @returns {number} 0-1 之间的随机数
   */
  util.secureRandom = function () {
    try {
      var arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return arr[0] / 0x100000000;
    } catch (e) {
      // 显式告警：随机源已降级为可预测的 Math.random（仅作兼容，敏感字段安全性下降）
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[FakeID] crypto.getRandomValues 不可用，已降级为 Math.random；生成的密码/证件序列不再具备加密安全性:', e);
      }
      return Math.random();
    }
  };

  /**
   * 生成 [min, max] 之间的随机整数（含边界）
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 随机整数
   */
  util.randInt = function (min, max) {
    return Math.floor(util.secureRandom() * (max - min + 1)) + min;
  };

  /**
   * 从数组中随机选取一个元素
   * @template T
   * @param {T[]} arr - 数组
   * @returns {T} 随机元素
   */
  util.pick = function (arr) {
    return arr[Math.floor(util.secureRandom() * arr.length)];
  };

  /**
   * 按概率返回 true
   * @param {number} p - 概率 (0-1)
   * @returns {boolean}
   */
  util.chance = function (p) {
    return util.secureRandom() < p;
  };

  /**
   * 数字/字符串左侧补零
   * @param {string|number} n - 数值
   * @param {number} len - 目标长度
   * @returns {string} 补零后的字符串
   */
  util.pad = function (n, len) {
    n = String(n);
    while (n.length < len) n = '0' + n;
    return n;
  };

  /**
   * 在 [startYear, endYear] 范围内生成随机日期
   * 使用整数天数采样（本地正午 12:00），与 ageFrom/birthDateForAge 保持同一本地时间基准，
   * 避免 UTC 采样与本地 getter 混用导致的 DST/时区边界日期偏移。
   * @param {number} startYear - 起始年份
   * @param {number} endYear - 结束年份
   * @returns {Date} 随机日期 (本地中午 12:00，避免时区跨日)
   */
  util.randomDate = function (startYear, endYear) {
    var start = new Date(startYear, 0, 1, 12, 0, 0).getTime();
    var end = new Date(endYear, 11, 31, 12, 0, 0).getTime();
    var days = Math.floor((end - start) / 86400000);
    var offset = util.randInt(0, days);
    return new Date(start + offset * 86400000);
  };

  /**
   * 格式化日期为 YYYY-MM-DD 或自定义分隔符
   * @param {Date} d - 日期对象
   * @param {string=} sep - 分隔符，默认 '-'
   * @returns {string} 格式化日期字符串
   */
  util.formatDate = function (d, sep) {
    if (sep === undefined || sep === null) sep = '-';
    return d.getFullYear() + sep + util.pad(d.getMonth() + 1, 2) + sep + util.pad(d.getDate(), 2);
  };

  /**
   * 计算出生日期到现在的年龄
   * @param {Date} d - 出生日期
   * @returns {number} 年龄
   */
  util.ageFrom = function (d) {
    var now = new Date();
    var age = now.getFullYear() - d.getFullYear();
    var m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  /**
   * 移除字符串中的变音符号 (NFD 归一化后移除组合字符)
   * @param {string} s - 输入字符串
   * @returns {string} 移除变音符后的字符串
   */
  util.deaccent = function (s) {
    if (!s) return '';
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  /**
   * 按目标年龄生成出生日期，保证 ageFrom 精确等于目标年龄
   * @param {number} age - 目标年龄
   * @returns {Date} 出生日期
   */
  util.birthDateForAge = function (age) {
    age = parseInt(age, 10);
    if (isNaN(age) || age < 0) age = 0;
    if (age > 120) age = 120;
    var now = new Date();
    var targetYear = now.getFullYear() - age;
    var maxMonth = now.getMonth();                       // 0-11，确保今年生日已过
    var month, day, d;
    // 使用拒绝采样：生成日期后验证 ageFrom 结果，不符则重试
    // 这样可自动处理闰年 2/29 等边界情况
    var maxAttempts = 100; // 增加尝试次数，极小概率仍失败则抛出错误
    for (var attempt = 0; attempt < maxAttempts; attempt++) {
      month = util.randInt(0, maxMonth);
      // 正确计算该月的最大天数（考虑闰年）
      var maxDay = new Date(targetYear, month + 1, 0).getDate();
      // 如果是当月，不能超过今天
      if (month === maxMonth) {
        maxDay = Math.min(maxDay, now.getDate());
      }
      day = util.randInt(1, maxDay);
      d = new Date(targetYear, month, day);
      // 验证生成的日期确实产生目标年龄（处理闰年回滚等情况）
      if (util.ageFrom(d) === age) return d;
    }
    // 兜底：按顺序尝试 targetYear 年的每一天，直到找到匹配的
    for (month = 0; month <= maxMonth; month++) {
      var daysInMonth = new Date(targetYear, month + 1, 0).getDate();
      var endDay = (month === maxMonth) ? now.getDate() : daysInMonth;
      for (day = 1; day <= endDay; day++) {
        d = new Date(targetYear, month, day);
        if (util.ageFrom(d) === age) return d;
      }
    }
    // 理论上不应到达这里，但以防万一抛出错误而非静默返回错误日期
    throw new Error('无法为年龄 ' + age + ' 生成有效出生日期');
  };

  /**
   * 根据 opts.ageMode 决定出生日期：random / exact / range
   * @param {Object} opts - 选项
   * @param {string} [opts.ageMode='random'] - 年龄模式
   * @param {number} [opts.ageExact] - 精确年龄
   * @param {number} [opts.ageMin] - 最小年龄
   * @param {number} [opts.ageMax] - 最大年龄
   * @returns {Date} 出生日期
   */
  util.birthDate = function (opts) {
    opts = opts || {};
    if (opts.ageMode === 'exact' && opts.ageExact != null && opts.ageExact !== '') {
      return util.birthDateForAge(opts.ageExact);
    }
    if (opts.ageMode === 'range') {
      var min = (opts.ageMin != null && opts.ageMin !== '') ? parseInt(opts.ageMin, 10) : 18;
      var max = (opts.ageMax != null && opts.ageMax !== '') ? parseInt(opts.ageMax, 10) : 65;
      if (isNaN(min)) min = 18;
      if (isNaN(max)) max = 65;
      if (max < min) { var t = min; min = max; max = t; }
      return util.birthDateForAge(util.randInt(min, max));
    }
    return util.randomDate(1965, 2004);
  };
  /* 身高/体重（按性别与年龄给出合理数值，避免“婴幼儿拥有成人身材”这类不符）。
   * 以成年参考身高为基准，按年龄的成长系数缩放；体重以身高推算 BMI 估算。
   *   age < 1    → 新生儿/婴儿（约 50cm）
   *   1~2        → 幼儿
   *   3~17       → 随年龄增长逐步接近成年身高
   *   >=18       → 成年身高区间
   *   >=70       → 老年人身高略有萎缩 */
  util.bodyMetrics = function (gender, age) {
    age = parseInt(age, 10);
    if (isNaN(age) || age < 0) age = 30;
    var male = gender === 'male';
    var adultH = male ? 172 : 159;          // 成年参考身高(cm)
    var hVar = male ? 13 : 10;              // 成年身高浮动
    var noise = util.randInt(-3, 3);        // 个体随机差异

    // 相对成年身高的成长系数（0~1，随年龄增长）
    var gf;
    if (age < 1) gf = 0.32;
    else if (age < 2) gf = 0.48;
    else if (age < 3) gf = 0.57;
    else if (age < 4) gf = 0.62;
    else if (age < 5) gf = 0.66;
    else if (age < 6) gf = 0.70;
    else if (age < 7) gf = 0.73;
    else if (age < 8) gf = 0.76;
    else if (age < 9) gf = 0.79;
    else if (age < 10) gf = 0.82;
    else if (age < 11) gf = 0.85;
    else if (age < 12) gf = 0.88;
    else if (age < 13) gf = 0.91;
    else if (age < 14) gf = 0.94;
    else if (age < 15) gf = 0.96;
    else if (age < 16) gf = 0.98;
    else if (age < 18) gf = 0.99;
    else gf = 1.0;
    if (age >= 70) gf -= 0.02;             // 老年人身高略有萎缩

    var h = Math.round(adultH * gf) + noise;
    if (h < 40) h = 40;

    // BMI 估算（不同年龄段参考区间），再乘以身高(m)^2 得到体重(kg)
    var bmi;
    if (age < 2) bmi = 16 + util.randInt(-1, 2);
    else if (age < 6) bmi = 15 + util.randInt(-1, 2);
    else if (age < 18) bmi = 17 + util.randInt(-1, 3);
    else bmi = 21 + util.randInt(-2, 5);
    if (age >= 70) bmi -= 1;
    var w = Math.round(bmi * Math.pow(h / 100, 2));
    if (w < 3) w = 3;
    return [h, w];
  };

  /* 不同语言/地区下“非工作年龄”的通用身份标签（学生/退休/学龄前）。
   * 职业（jobs）只用于劳动年龄人口；其余年龄段应使用符合年龄的身份标签，
   * 避免出现“5 岁软件工程师”“90 岁小学生”这类职业与年龄不符的情况。 */
  var OCCUPATION_LABELS = {
    zh: { child: '学龄前儿童', student: '学生', retired: '退休' },
    en: { child: 'Child', student: 'Student', retired: 'Retired' },
    de: { child: 'Kleinkind', student: 'Schüler', retired: 'Rentner' },
    fr: { child: 'Jeune enfant', student: 'Élève', retired: 'Retraité' },
    it: { child: 'Bambino', student: 'Studente', retired: 'Pensionato' },
    es: { child: 'Niño', student: 'Estudiante', retired: 'Jubilado' },
    ja: { child: '幼児', student: '学生', retired: '定年退職' }
  };
  /* 按年龄返回合理身份/职业：
   *   age < 6        → 学龄前儿童（过小，无职业）
   *   6 ≤ age < 18   → 学生
   *   18 ≤ age ≤ 64  → 从 jobs（成年职业池）中随机取一个
   *   age ≥ 65       → 退休
   * cfg 需包含 jobs（成年职业池），可选 locale（见 OCCUPATION_LABELS）或 labels 覆盖。 */
  util.occupationForAge = function (age, cfg) {
    cfg = cfg || {};
    age = parseInt(age, 10);
    if (isNaN(age)) age = 0;
    // 返回“年龄类别代码”child/student/retired，由界面层按当前 UI 语言渲染；
    // 成年则从 jobs（国家母语职业池）随机抽取具体职业名（不随 UI 语言翻译）。
    if (age < 6) return 'child';
    if (age < 18) return 'student';
    if (age >= 65) return 'retired';
    return util.pick(cfg.jobs || ['student']);
  };

  /* 按年龄返回在职公司：仅劳动年龄（18~64 岁）拥有在职公司，
   * 其余年龄段（学龄前/学生/退休）无在职公司，返回 null（调用方据此省略该字段），
   * 避免出现“5 岁却在某公司任职”这类公司/年龄不符的情况。 */
  util.companyForAge = function (age, cfg) {
    cfg = cfg || {};
    age = parseInt(age, 10);
    if (isNaN(age)) age = 0;
    if (age < 18 || age >= 65) return null;
    if (!cfg.companies || !cfg.companies.length) return null;
    return util.pick(cfg.companies);
  };

  util.password = function (len) {
    len = len || 10;
    var all = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
    var out = '';
    for (var i = 0; i < len; i++) out += all.charAt(util.randInt(0, all.length - 1));
    return out;
  };

  /* 简易中文拼音映射（常用姓氏/名字字），用于生成可读的用户名 */
  // 仅覆盖 china.js 中使用的常用姓氏和名字字，完整拼音库体积过大，此处仅作演示
  util.pinyinMap = {
    // 常用姓氏
    '王': 'wang', '李': 'li', '张': 'zhang', '刘': 'liu', '陈': 'chen', '杨': 'yang', '赵': 'zhao', '黄': 'huang',
    '周': 'zhou', '吴': 'wu', '徐': 'xu', '孙': 'sun', '胡': 'hu', '朱': 'zhu', '高': 'gao', '林': 'lin',
    '何': 'he', '郭': 'guo', '马': 'ma', '罗': 'luo', '梁': 'liang', '宋': 'song', '郑': 'zheng', '谢': 'xie',
    '韩': 'han', '唐': 'tang', '冯': 'feng', '于': 'yu', '董': 'dong', '萧': 'xiao', '程': 'cheng', '曹': 'cao',
    '袁': 'yuan', '邓': 'deng', '许': 'xu', '傅': 'fu', '沈': 'shen', '曾': 'zeng', '彭': 'peng', '吕': 'lv',
    '苏': 'su', '卢': 'lu', '蒋': 'jiang', '蔡': 'cai', '贾': 'jia', '丁': 'ding', '魏': 'wei', '薛': 'xue',
    '叶': 'ye', '阎': 'yan', '余': 'yu', '潘': 'pan', '杜': 'du', '戴': 'dai', '夏': 'xia', '钟': 'zhong',
    '汪': 'wang', '田': 'tian', '任': 'ren', '姜': 'jiang', '范': 'fan', '方': 'fang', '石': 'shi', '姚': 'yao',
    '谭': 'tan', '廖': 'liao', '邹': 'zou', '熊': 'xiong', '金': 'jin', '陆': 'lu', '郝': 'hao', '孔': 'kong',
    '白': 'bai', '崔': 'cui', '康': 'kang', '毛': 'mao', '邱': 'qiu', '秦': 'qin', '江': 'jiang', '史': 'shi',
    '顾': 'gu', '侯': 'hou', '邵': 'shao', '孟': 'meng', '龙': 'long', '万': 'wan', '段': 'duan', '钱': 'qian',
    '汤': 'tang', '尹': 'yin', '黎': 'li', '易': 'yi', '常': 'chang', '武': 'wu', '乔': 'qiao', '贺': 'he',
    '赖': 'lai', '龚': 'gong', '文': 'wen', '尚': 'shang', '辛': 'xin', '庞': 'pang', '樊': 'fan', '兰': 'lan',
    '殷': 'yin', '施': 'shi', '陶': 'tao', '翟': 'zhai', '安': 'an', '颜': 'yan', '倪': 'ni', '严': 'yan',
    '牛': 'niu', '温': 'wen', '芦': 'lu', '季': 'ji', '俞': 'yu', '章': 'zhang',
    // 常用名字字
    '伟': 'wei', '强': 'qiang', '磊': 'lei', '军': 'jun', '洋': 'yang', '勇': 'yong', '杰': 'jie', '涛': 'tao',
    '明': 'ming', '超': 'chao', '刚': 'gang', '平': 'ping', '辉': 'hui', '鹏': 'peng', '华': 'hua', '飞': 'fei',
    '鑫': 'xin', '波': 'bo', '斌': 'bin', '宇': 'yu', '浩': 'hao', '凯': 'kai', '睿': 'rui', '轩': 'xuan',
    '昊': 'hao', '晨': 'chen', '旭': 'xu', '然': 'ran', '梓': 'zi', '铭': 'ming',
    '芳': 'fang', '娟': 'juan', '敏': 'min', '静': 'jing', '丽': 'li', '艳': 'yan', '梅': 'mei', '琳': 'lin',
    '雪': 'xue', '倩': 'qian', '婷': 'ting', '莹': 'ying', '璐': 'lu', '萌': 'meng', '琪': 'qi', '妍': 'yan',
    '悦': 'yue', '欣': 'xin', '彤': 'tong', '雅': 'ya', '涵': 'han', '萱': 'xuan', '怡': 'yi', '薇': 'wei',
    '晴': 'qing', '玥': 'yue', '诗': 'shi', '梓': 'zi', '欣': 'xin', '悦': 'yue'
  };

  /* 将中文字符串转写为拼音（无声调，小写），未收录字符用随机字母替代 */
  util.toPinyin = function (str) {
    if (!str) return '';
    var out = '';
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      out += util.pinyinMap[ch] || (util.chance(0.5) ? 'x' : 'z'); // 未收录字符用 x/z 占位
    }
    return out;
  };

  /* 生成随机 ASCII 用户名片段（中文姓名等无法转写为拉丁字母时使用），保证不以 "user" 开头 */
  util.randomHandle = function (len) {
    len = len || 8;
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    var out = '';
    // 确定性防 "user" 前缀：首字母强制非 'u'
    var firstChar = letters.charAt(util.randInt(1, 25)); // 跳过 'a'(0), 但 'u' 是 20
    // 更简单：首字母从 'b'..'z' 中选 (排除 'a' 和 'u')
    var safeFirst = 'bcdfghjklmnpqrstvwxyz'; // 20 个字母，排除 a, u, e, i, o (元音也排除更安全)
    firstChar = safeFirst.charAt(util.randInt(0, safeFirst.length - 1));
    out += firstChar;
    for (var i = 1; i < len; i++) {
      out += letters.charAt(util.randInt(0, 25));
    }
    return out;
  };

  /* 中国大陆身份证校验码（GB 11643-1999, mod 11-2） */
  // 权重因子：从左往右（身份证第1位到第17位）对应 [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
  util.chinaIDChecksum = function (body17) {
    var w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var c = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += parseInt(body17.charAt(i), 10) * w[i];
    }
    return c[sum % 11];
  };
  util.makeChinaID = function (region6, date) {
    // 校验 6 位地区码：必须是 6 位数字（GB/T 2260 行政区划码）
    region6 = String(region6 || '');
    if (!/^\d{6}$/.test(region6)) {
      throw new Error('无效的地区码: ' + region6 + '（应为 6 位数字）');
    }
    var body = region6 + util.formatDate(date, '') + util.pad(util.randInt(1, 999), 3);
    return body + util.chinaIDChecksum(body);
  };

  /* 通用“西方国家”档案构建器：减少各国样板代码，便于扩展。
   * cfg 可包含：surnames, givenMale, givenFemale, domains, phonePrefix(数组),
   *   phoneLen, idLabel, idFn(ctx), addressFn(util), zipFn(util),
   *   companies, jobs, nameOrder('western' 默认 / 'eastern') */
  /* 在地区(regions)中解析出“地区/省”和“城市”。
   * regions: [{ name, abbr?, cities: [{name,...} 或 '城市名'] }, ...]
   * opts.region / opts.city 传入名称（或 abbr）时按所选生成；为空则随机。 */
  function resolveRegionCity(regions, opts) {
    opts = opts || {};
    var region = null, city = null;
    regions = regions || [];
    if (opts.region) {
      for (var i = 0; i < regions.length; i++) {
        if (regions[i].name === opts.region || regions[i].abbr === opts.region) { region = regions[i]; break; }
      }
    }
    if (!region && regions.length) region = util.pick(regions);
    if (region) {
      var cities = region.cities || [];
      if (opts.city) {
        for (var j = 0; j < cities.length; j++) {
          var cn = (typeof cities[j] === 'string') ? cities[j] : cities[j].name;
          if (cn === opts.city) { city = cities[j]; break; }
        }
      }
      if (!city && cities.length) city = util.pick(cities);
    }
    return { region: region, city: city };
  }

  /* 解析邮箱域名：优先使用 opts.emailDomain（下拉选择或自定义固定后缀），
   * 未指定或为空时从国家默认域名列表中随机取一个。用户可能带前导 @，这里统一去除。 */
  /* 合法的自定义邮箱域名白名单：仅允许字母/数字/点/连字符，至少一个点分隔顶级域。
   * 引擎层统一校验（UI 与任意调用方共用同一防线），拒绝空、含注入字符或非法格式的域名。 */
  util.isValidEmailDomain = function (d) {
    if (d == null) return false;
    d = String(d).trim().replace(/^@+/, '');
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(d) && d.length <= 253;
  };
  util.emailDomain = function (opts, defaultDomains) {
    opts = opts || {};
    if (opts.emailDomain && String(opts.emailDomain).trim()) {
      var raw = String(opts.emailDomain).trim().replace(/^@+/, '');
      // 非法域名（含注入/格式错误）时回退到国家默认域名，而非原样拼接进邮箱
      if (util.isValidEmailDomain(raw)) return raw;
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[FakeID] 非法自定义邮箱域名已忽略，回退默认域名:', raw);
      }
    }
    return util.pick(defaultDomains);
  };

  util.buildWestern = function (cfg, opts) {
    opts = opts || {};
    // 防御性默认值：新增国家漏传 phonePrefix/phoneLen/surnames/domains 时不至抛 TypeError
    cfg = cfg || {};
    cfg.phonePrefix = cfg.phonePrefix || ['0'];
    cfg.phoneLen = cfg.phoneLen || 7;
    cfg.surnames = cfg.surnames || ['X'];
    cfg.givenMale = cfg.givenMale || ['M'];
    cfg.givenFemale = cfg.givenFemale || ['F'];
    cfg.domains = cfg.domains || ['example.com'];
    var rc = resolveRegionCity(cfg.regions, opts);
    var region = rc.region, city = rc.city;
    var gender = opts.gender === 'random' ? (util.chance(0.5) ? 'male' : 'female') : opts.gender;
    var first = util.pick(gender === 'male' ? cfg.givenMale : cfg.givenFemale);
    var last = util.pick(cfg.surnames);
    var bdate = util.birthDate(opts);
    var countryCode = opts.countryCode || cfg.code;
    // 为非拉丁语系国家生成拼音/罗马音用户名，保持姓名关联性
    var handle;
    if (countryCode === 'china') {
      handle = (util.toPinyin(last) + '.' + util.toPinyin(first)).toLowerCase().replace(/[^a-z.]/g, '');
    } else if (countryCode === 'japan') {
      // 日文姓名：姓在前，名在后，使用简单罗马音映射（此处简化为随机，完整映射需更大表）
      handle = util.randomHandle(8);
    } else {
      handle = util.deaccent(first + '.' + last).toLowerCase().replace(/[^a-z.]/g, '');
    }
    // 兜底：若转写后为空，使用随机 handle
    if (!handle) handle = util.randomHandle(8);
    var num = util.randInt(10, 999);
    var username = handle.replace(/\./g, '') + num;
    var email = handle + num + '@' + util.emailDomain(opts, cfg.domains);
    var phone = util.pick(cfg.phonePrefix) + util.pad(util.randInt(0, Math.pow(10, cfg.phoneLen || 7) - 1), cfg.phoneLen || 7);
    var ctx = { first: first, last: last, gender: gender, bdate: bdate, region: region, city: city, handle: username, countryCode: opts.countryCode || cfg.code, age: util.ageFrom(bdate) };
    var metrics = util.bodyMetrics(gender, util.ageFrom(bdate));
    // 字段以“键”形式存储，渲染时按当前 UI 语言本地化（i18n.field + i18n.gender/occLabel）
    var fields = [
      ['lastName', last],
      ['firstName', first],
      ['gender', gender],
      ['birthDate', util.formatDate(bdate)],
      ['age', util.ageFrom(bdate)],
      ['height', metrics[0] + ' cm'],
      ['weight', metrics[1] + ' kg'],
      ['phone', phone],
      ['email', email],
      ['username', username],
      ['password', util.password(10)]
    ];
    if (cfg.idFn) fields.push([cfg.idLabel || 'id', cfg.idFn(ctx)]);
    if (cfg.addressFn) fields.push(['address', cfg.addressFn(util, ctx)]);
    if (cfg.zipFn) fields.push(['zip', cfg.zipFn(util, ctx)]);
    if (cfg.companies) {
      var company = util.companyForAge(util.ageFrom(bdate), cfg);
      if (company) fields.push(['company', company]);
    }
    if (cfg.jobs) fields.push(['occupation', util.occupationForAge(util.ageFrom(bdate), cfg)]);
    // 信用卡（类型由 opts.cardType 控制，缺省随机；未成年不生成）
    fields = fields.concat(util.creditCardForAge(util.ageFrom(bdate), opts));
    // 扩展档案字段（学校/学历/收入/技能/外貌/安全等，对所有国家通用）
    fields = fields.concat(util.profileFields(opts, ctx));
    return fields;
  };

  /* 信用卡类型与生成（Luhn 校验，纯示意数据） */
  /* 常见信用卡/借记卡组织与品牌（含全球与主要地区性网络），仅用于生成示意数据。
   * 各字段：label 为英文品牌名（回退显示），prefixes 为 IIN/BIN 前缀候选，
   * len 为卡号位数（不含校验位），cvvLen 为安全码位数。卡号均通过 Luhn 校验。 */
  util.cardTypes = {
    visa:            { label: 'Visa',                prefixes: ['4'],                                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    visaElectron:    { label: 'Visa Electron',       prefixes: ['4026','417500','4405','4508','4844','4913','4917'],   len: 16, cvvLen: 3, format: '4-4-4-4' },
    mastercard:      { label: 'Mastercard',          prefixes: ['51','52','53','54','55','2221','223','224','225','226','227','228','229','23','24','25','26','270','271','2720'], len: 16, cvvLen: 3, format: '4-4-4-4' },
    amex:            { label: 'American Express',    prefixes: ['34','37'],                                            len: 15, cvvLen: 4, format: '4-6-5' },
    discover:        { label: 'Discover',            prefixes: ['6011','65','644','645','646','647','648','649'],     len: 16, cvvLen: 3, format: '4-4-4-4' },
    jcb:             { label: 'JCB',                 prefixes: ['3528','3529','353','354','355','356','357','358'],    len: 16, cvvLen: 3, format: '4-4-4-4' },
    unionpay:        { label: 'UnionPay',            prefixes: ['62'],                                                 len: 19, cvvLen: 3, format: '4-4-4-4-3' },
    diners:          { label: 'Diners Club',         prefixes: ['300','301','302','303','304','305','3095','36','38','39'], len: 14, cvvLen: 3, format: '4-4-4-2' },
    carteBlanche:    { label: 'Carte Blanche',       prefixes: ['300','305'],                                          len: 14, cvvLen: 3, format: '4-4-4-2' },
    maestro:         { label: 'Maestro',             prefixes: ['50','56','57','58','6304','6759','6761','6762','6763'], len: 16, cvvLen: 3, format: '4-4-4-4' },
    rupay:           { label: 'RuPay',               prefixes: ['60','65','81','82','508','6'],                        len: 16, cvvLen: 3, format: '4-4-4-4' },
    mir:             { label: 'Mir',                 prefixes: ['2200','2201','2202','2203','2204'],                   len: 16, cvvLen: 3, format: '4-4-4-4' },
    troy:            { label: 'Troy',                prefixes: ['979200','979201','979202','979203','979289'],          len: 16, cvvLen: 3, format: '4-4-4-4' },
    elo:             { label: 'Elo',                 prefixes: ['401178','401179','438935','457631','457632','504175','627780','636297','636368','650','651','655'], len: 16, cvvLen: 3, format: '4-4-4-4' },
    dankort:         { label: 'Dankort',             prefixes: ['5019','4571','4'],                                    len: 16, cvvLen: 3, format: '4-4-4-4' },
    interac:         { label: 'Interac',             prefixes: ['4506','4725','4726','639'],                           len: 16, cvvLen: 3, format: '4-4-4-4' },
    verve:           { label: 'Verve',               prefixes: ['506099','506198','650002','650027'],                   len: 16, cvvLen: 3, format: '4-4-4-4' },
    uatp:            { label: 'UATP',                prefixes: ['1'],                                                   len: 15, cvvLen: 3, format: '4-5-6' },
    laser:           { label: 'Laser',               prefixes: ['6304','6706','6771','6709'],                          len: 16, cvvLen: 3, format: '4-4-4-4' },
    switch:          { label: 'Switch',              prefixes: ['4903','4905','4911','4936','564182','633110','6333','6759'], len: 16, cvvLen: 3, format: '4-4-4-4' },
    solo:            { label: 'Solo',                prefixes: ['6334','6767'],                                         len: 16, cvvLen: 3, format: '4-4-4-4' },
    bancontact:      { label: 'Bancontact',          prefixes: ['6703','6799','4871'],                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    enroute:         { label: 'EnRoute',             prefixes: ['2014','2149'],                                         len: 15, cvvLen: 3, format: '4-6-5' },
    voyager:         { label: 'Voyager',             prefixes: ['8699'],                                               len: 15, cvvLen: 3, format: '4-6-5' },
    instapayment:    { label: 'InstaPayment',        prefixes: ['637','638','639'],                                     len: 16, cvvLen: 3, format: '4-4-4-4' },
    postepay:        { label: 'PostePay',            prefixes: ['402360','457033','463799','650005'],                   len: 16, cvvLen: 3, format: '4-4-4-4' },
    sbercard:        { label: 'SberCard',            prefixes: ['6390','6764'],                                         len: 16, cvvLen: 3, format: '4-4-4-4' },
    naps:            { label: 'NAPS',                prefixes: ['421676','409775'],                                     len: 16, cvvLen: 3, format: '4-4-4-4' },
    kcp:             { label: 'KCP',                 prefixes: ['366','367','368','369'],                               len: 16, cvvLen: 3, format: '4-4-4-4' },
    meps:            { label: 'MEPS',                prefixes: ['629','600','601','602'],                               len: 16, cvvLen: 3, format: '4-4-4-4' },
    bccard:          { label: 'BC Card',             prefixes: ['940','941','942','943','944','945','946','947','948','949'], len: 16, cvvLen: 3, format: '4-4-4-4' },
    polcard:         { label: 'PolCard',             prefixes: ['6759','6760','6761'],                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    girocard:        { label: 'Girocard',            prefixes: ['4799','4798','4797'],                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    carteBancaire:   { label: 'Carte Bancaire',      prefixes: ['4972','6701','6702'],                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    lankapay:        { label: 'LankaPay',            prefixes: ['3571','3572','3573'],                                  len: 16, cvvLen: 3, format: '4-4-4-4' },
    nepalpay:        { label: 'NepalPay',            prefixes: ['4299','4354'],                                         len: 16, cvvLen: 3, format: '4-4-4-4' },
    bca:             { label: 'BCA',                 prefixes: ['409998','433662','459922','549646','549647'],          len: 16, cvvLen: 3, format: '4-4-4-4' }
  };
  util.cardTypeKeys = function () { return Object.keys(util.cardTypes); };

  // 根据已生成的数字串计算 Luhn 校验位（用于补在卡号末尾）
  // 算法：从右往左第 2 位开始（含校验位在内的总长度），每隔一位乘以 2
  // 总长度 = body.length + 1。从右往左数，偶数位（2,4,6...）倍增。
  // body 中下标 i 对应的从右往左位置 = body.length - i（1-indexed，不含校验位）
  // 加上校验位后，从右往左位置 = body.length - i + 1
  // 倍增条件：(body.length - i + 1) % 2 === 0  即  (body.length - i) % 2 === 1
  util.luhnCheckDigit = function (body) {
    var sum = 0;
    for (var i = body.length - 1; i >= 0; i--) {
      var d = parseInt(body.charAt(i), 10);
      // 从右往左第 2、4、6... 位（含校验位）倍增：即 (body.length - i) % 2 === 1
      if ((body.length - i) % 2 === 1) {
        d *= 2; if (d > 9) d -= 9;
      }
      sum += d;
    }
    return (10 - (sum % 10)) % 10;
  };

  // 生成一张信用卡信息；opts.cardType 可为具体类型或省略/'random'
  util.creditCard = function (opts) {
    opts = opts || {};
    var key = (!opts.cardType || opts.cardType === 'random')
      ? util.pick(util.cardTypeKeys())
      : opts.cardType;
    var t = util.cardTypes[key] || util.cardTypes[util.pick(util.cardTypeKeys())];
    var prefix = util.pick(t.prefixes);
    // 防御：前缀长度必须 < 卡号长度，否则截断，避免生成超长/非法卡号
    var maxBodyLen = Math.max(1, t.len - 1);
    if (prefix.length > maxBodyLen) prefix = prefix.slice(0, maxBodyLen);
    var body = String(prefix);
    while (body.length < t.len - 1) body += String(util.randInt(0, 9));
    var number = body + util.luhnCheckDigit(body);
    var now = new Date();
    var currentYear = now.getFullYear();
    var expY = util.randInt(currentYear + 1, currentYear + 10); // 明年~10年后
    var expM = util.pad(util.randInt(1, 12), 2);
    var expiry = expM + '/' + String(expY).slice(-2);
    var cvv = util.pad(util.randInt(0, Math.pow(10, t.cvvLen) - 1), t.cvvLen);
    return { key: key, type: t.label, number: number, expiry: expiry, cvv: cvv };
  };

  // 按卡组织格式化卡号展示（使用 cardTypes 中定义的 format 字段，如 '4-6-5', '4-5-6', '4-4-4-4' 等）
  util.formatCardNumber = function (num, key) {
    var t = util.cardTypes[key];
    var format = (t && t.format) ? t.format : '4-4-4-4';
    // 防御：分段总和与实际卡号长度不一致时，直接原样返回，避免 substr 错切
    var fmtSum = 0;
    format.split('-').forEach(function (p) { fmtSum += parseInt(p, 10) || 0; });
    if (String(num).length !== fmtSum) return String(num);
    var parts = format.split('-');
    var out = '';
    var idx = 0;
    for (var i = 0; i < parts.length; i++) {
      var len = parseInt(parts[i], 10);
      out += num.substr(idx, len);
      idx += len;
      if (i < parts.length - 1) out += ' ';
    }
    // 如果还有剩余字符，追加到末尾
    if (idx < num.length) out += ' ' + num.substr(idx);
    return out.trim();
  };

  // 返回信用卡相关字段数组（便于所有国家复用）
  util.creditCardFields = function (opts) {
    var c = util.creditCard(opts);
    // 存储卡组织的 key（便于界面层按当前 UI 语言本地化显示名）
    return [
      ['cardType', c.key],
      ['cardNumber', util.formatCardNumber(c.number, c.key)],
      ['expiry', c.expiry],
      ['cvv', c.cvv]
    ];
  };

  /* 按年龄返回信用卡字段数组：持卡需为成年人（>=18 岁），
   * 未成年（学龄前/学生）不生成信用卡字段，返回空数组（调用方 concat 不影响字段数），
   * 避免出现“10 岁却持有信用卡”这类信用卡/年龄不符的情况。 */
  util.creditCardForAge = function (age, opts) {
    opts = opts || {};
    age = parseInt(age, 10);
    if (isNaN(age)) age = 0;
    var adultAge = opts.adultAge || 18;
    if (age < adultAge) return [];
    return util.creditCardFields(opts);
  };

  /* 从数组中随机取 n 个不重复元素，并以 sep 连接为字符串 */
  util.pickSome = function (arr, n, sep) {
    arr = arr || [];
    if (!sep) sep = ', ';
    if (arr.length <= n) return arr.slice().join(sep);
    var pool = arr.slice(), out = [];
    while (out.length < n && pool.length) {
      out.push(pool.splice(util.randInt(0, pool.length - 1), 1)[0]);
    }
    return out.join(sep);
  };

  /* 扩展档案字段：学校/学历/收入/技能/外貌/安全等，对所有国家通用。
   * 生成时按当前 UI 语言（zh / en）取对应语言池；ctx 需包含 countryCode、handle(用户名) 等。
   * 学校相关字段按国家代码从对应国家池中选取，保证学校与“学校所在国家”一一对应。 */
  util.profileFields = function (opts, ctx) {
    opts = opts || {};
    ctx = ctx || {};
    var P = (FakeID.profile && FakeID.profile.pools) || {};
    var lang = (FakeID.i18n && FakeID.i18n.lang && FakeID.i18n.lang() === 'en') ? 'en' : 'zh';
    var zhPool = P['zh'];
    var enPool = P['en'];
    if (!zhPool || !enPool) return [];
    var pick = util.pick, sepListZh = '、', sepListEn = ', ', out = [];

    // 从两个语言池中按相同索引取值，返回双语对象 {zh, en}
    // 普通字段（非学校类）使用 zhPool/enPool 直接按索引对应
    function pickBoth(poolKey) {
      var zhArr = zhPool[poolKey] || [], enArr = enPool[poolKey] || [];
      if (!zhArr.length || !enArr.length) return { zh: '', en: '' };
      var idx = util.randInt(0, zhArr.length - 1);
      var zhVal = zhArr[idx], enVal = enArr[idx];
      // securityQA 的元素是数组 [问题, 答案]，保留完整数组供调用方解包
      // 其它池元素为字符串，直接返回
      return { zh: zhVal, en: enVal };
    }
    function pickSomeBoth(arrKey, n, band) {
      var zhArr = (zhPool[arrKey] && zhPool[arrKey][band]) || zhPool[arrKey] || [];
      var enArr = (enPool[arrKey] && enPool[arrKey][band]) || enPool[arrKey] || [];
      if (!zhArr.length || !enArr.length) return { zh: '', en: '' };
      // util.pickSome 可能会修改数组，使用副本
      return {
        zh: util.pickSome(zhArr.slice(), n, '、'),
        en: util.pickSome(enArr.slice(), n, ', ')
      };
    }
    function pickBothBand(arrKey, band) {
      var zhArr = (zhPool[arrKey] && zhPool[arrKey][band]) || zhPool[arrKey] || [];
      var enArr = (enPool[arrKey] && enPool[arrKey][band]) || enPool[arrKey] || [];
      if (!zhArr.length || !enArr.length) return { zh: '', en: '' };
      var idx = util.randInt(0, zhArr.length - 1);
      return { zh: zhArr[idx], en: enArr[idx] };
    }

    // 安全问题 / 答案（按国家细分，保证问答内容与所生身份的国家相符）
    // 比较 zh/en 池的 pickBoth 不同，本函数从 securityQAByCountry 按国家代码选取，
    // 并返回本国语言版本，供 localizeValue 按原生语言优先显示。
    // 返回结构：{ zh: [q,a], en: [q,a], nativeLang: 'xx', native: [q,a] }
    // 如国家专属池缺失，回退到通用 securityQA。
    function pickSecurityQAByCountry(countryCode) {
      var byCountry = (P['securityQAByCountry'] || {});
      var pool = byCountry[countryCode];
      if (!pool) {
        // 回退到通用 securityQA（按相同索引从 zh/en 池中取）
        var fb = pickBoth('securityQA');
        return { zh: fb.zh, en: fb.en, nativeLang: 'zh', native: fb.zh };
      }
      var nativeLang = pool.nativeLang || 'en';
      var nativeArr = pool[nativeLang] || pool.en || pool.zh || [];
      if (!nativeArr.length) {
        var fb2 = pickBoth('securityQA');
        return { zh: fb2.zh, en: fb2.en, nativeLang: 'zh', native: fb2.zh };
      }
      // 以 zh/en/native 三语的最小长度取界，避免任一阵列缺失/较短时同 idx 越界或错位
      var zhArr2 = pool.zh || [];
      var enArr2 = pool.en || [];
      var safeLen = nativeArr.length;
      if (zhArr2.length && zhArr2.length < safeLen) safeLen = zhArr2.length;
      if (enArr2.length && enArr2.length < safeLen) safeLen = enArr2.length;
      var idx = util.randInt(0, safeLen - 1);
      return {
        zh: zhArr2[idx] || nativeArr[idx] || nativeArr[nativeArr.length - 1],
        en: enArr2[idx] || nativeArr[idx] || nativeArr[nativeArr.length - 1],
        nativeLang: nativeLang,
        native: nativeArr[idx]
      };
    }

    // 在线签名（按国家细分，保证签名内容与所生身份的国家相符）
    // 比较 zh/en 池的 pickBoth 不同，本函数从 signaturesByCountry 按国家代码选取，
    // 并返回本国语言版本，供 localizeValue 按原生语言优先显示。
    // 返回结构：{ zh: sig, en: sig, nativeLang: 'xx', native: sig }
    // 如国家专属池缺失，回退到通用 signatures。
    function pickSignaturesByCountry(countryCode) {
      var byCountry = (P['signaturesByCountry'] || {});
      var pool = byCountry[countryCode];
      if (!pool) {
        // 回退到通用 signatures（按相同索引从 zh/en 池中取）
        var fb = pickBoth('signatures');
        return { zh: fb.zh, en: fb.en, nativeLang: 'zh', native: fb.zh };
      }
      var nativeLang = pool.nativeLang || 'en';
      var nativeArr = pool[nativeLang] || pool.en || pool.zh || [];
      if (!nativeArr.length) {
        var fb2 = pickBoth('signatures');
        return { zh: fb2.zh, en: fb2.en, nativeLang: 'zh', native: fb2.zh };
      }
      // 以 zh/en/native 三语的最小长度取界，避免任一阵列缺失/较短时同 idx 越界或错位
      var zhArr2 = pool.zh || [];
      var enArr2 = pool.en || [];
      var safeLen = nativeArr.length;
      if (zhArr2.length && zhArr2.length < safeLen) safeLen = zhArr2.length;
      if (enArr2.length && enArr2.length < safeLen) safeLen = enArr2.length;
      var idx = util.randInt(0, safeLen - 1);
      return {
        zh: zhArr2[idx] || nativeArr[idx] || nativeArr[nativeArr.length - 1],
        en: enArr2[idx] || nativeArr[idx] || nativeArr[nativeArr.length - 1],
        nativeLang: nativeLang,
        native: nativeArr[idx]
      };
    }

    // 国家代码 -> 本地语言代码映射
    var COUNTRY_NATIVE_LANG = {
      china: 'zh', us: 'en', japan: 'ja', uk: 'en',
      germany: 'de', france: 'fr', italy: 'it', spain: 'es', canada: 'en'
    };
    
    // 从扁平学校池中选取：数组元素为 [zhName, countryName, nativeName] 或 [enName, countryName, nativeName]
    // 返回 { native: [schoolName, countryName], zh: [schoolName, countryName], en: [schoolName, countryName], nativeLang: 'ja' }
    function pickSchoolByCountry(poolName) {
      var countryCode = ctx.countryCode || 'china';
      var nativeLang = COUNTRY_NATIVE_LANG[countryCode] || 'en';
      
      var zhArr = zhPool[poolName] || [];
      var enArr = enPool[poolName] || [];
      
      // 使用两个数组的最小长度作为边界，防止越界
      var maxLen = Math.min(zhArr.length, enArr.length);
      if (maxLen === 0) {
        // 回退：任一数组有数据则用其长度
        maxLen = Math.max(zhArr.length, enArr.length);
      }
      if (maxLen === 0) return { native: ['', ''], zh: ['', ''], en: ['', ''], nativeLang: nativeLang };
      
      // 选择基础数组：优先使用 nativeLang 对应的数组
      var baseArr = (nativeLang === 'zh') ? zhArr : enArr;
      if (!baseArr.length) baseArr = (nativeLang === 'zh') ? enArr : zhArr;
      
      var idx = util.randInt(0, maxLen - 1);
      var baseEntry = baseArr[idx];
      
      // 安全获取各语言值，防止越界
      var zhName = (zhArr[idx] && zhArr[idx][0]) || baseEntry[0] || '';
      var enName = (enArr[idx] && enArr[idx][0]) || baseEntry[0] || '';
      var nativeName = baseEntry[2] || baseEntry[0] || '';
      var countryName = baseEntry[1] || '';
      
      var result = {};
      result.zh = [zhName, countryName];
      result.en = [enName, countryName];
      result[nativeLang] = [nativeName, countryName];
      result.nativeLang = nativeLang;
      return result;
    }

    // 学校类型也按国家区分（使用 schoolTypesByCountry，若不存在则回退通用池）
    function pickSchoolTypeByCountry() {
      var countryCode = ctx.countryCode || 'china';
      var byCountry = P['schoolTypesByCountry'] || {};
      var countryPool = byCountry[countryCode];
      if (!countryPool) {
        // 回退到通用 schoolTypes 池
        return pickBoth('schoolTypes');
      }
      var zhArr = countryPool.zh || [];
      var enArr = countryPool.en || [];
      if (!zhArr.length || !enArr.length) return pickBoth('schoolTypes');
      var idx = util.randInt(0, zhArr.length - 1);
      return { zh: zhArr[idx], en: enArr[idx] };
    }

    // 学校 / 学历 / 收入：与年龄一致（学龄前→小学→初中→高中→大学；在职才有收入与公司规模）
    var ageNum = parseInt(ctx.age, 10);
    if (isNaN(ageNum)) ageNum = 30;
    var band = (ageNum < 6) ? 'child' : (ageNum < 18) ? 'youth' : (ageNum < 65) ? 'adult' : 'senior';

    // 学校 / 学历类（双语，学校与国家成对）
    var edu = { zh: '', en: '' };
    var schoolTypeVal = { zh: '', en: '' };
    var majorVal = { zh: '', en: '' };
    var schoolPair = { zh: ['', ''], en: ['', ''] };

    if (ageNum < 6) {
      edu = { zh: '学龄前', en: 'Preschool' };
      schoolPair = pickSchoolByCountry('kindergartens');
      schoolTypeVal = { zh: '幼儿园', en: 'Kindergarten' };
      majorVal = { zh: '无', en: 'None' };
    } else if (ageNum < 12) {
      edu = { zh: '小学在读', en: 'Primary School' };
      schoolPair = pickSchoolByCountry('primarySchools');
      schoolTypeVal = { zh: '小学', en: 'Primary School' };
      majorVal = { zh: '无', en: 'None' };
    } else if (ageNum < 15) {
      edu = { zh: '初中在读', en: 'Junior High School' };
      schoolPair = pickSchoolByCountry('middleSchools');
      schoolTypeVal = { zh: '初中', en: 'Junior High' };
      majorVal = { zh: '无', en: 'None' };
    } else if (ageNum < 18) {
      edu = { zh: '高中在读', en: 'High School' };
      schoolPair = pickSchoolByCountry('highSchools');
      schoolTypeVal = { zh: '高中', en: 'High School' };
      majorVal = { zh: '无', en: 'None' };
    } else if (ageNum < 23) {
      edu = { zh: '本科在读', en: 'Bachelor (in progress)' };
      schoolPair = pickSchoolByCountry('schools');
      schoolTypeVal = pickSchoolTypeByCountry();
      majorVal = pickBoth('majors');
    } else if (ageNum < 65) {
      edu = { zh: pick(['本科', '硕士', '博士']), en: pick(['Bachelor', 'Master', 'PhD']) };
      schoolPair = pickSchoolByCountry('schools');
      schoolTypeVal = pickSchoolTypeByCountry();
      majorVal = pickBoth('majors');
    } else {
      edu = { zh: pick(['大专', '本科', '硕士']), en: pick(['Associate', 'Bachelor', 'Master']) };
      schoolPair = pickSchoolByCountry('schools');
      schoolTypeVal = pickSchoolTypeByCountry();
      majorVal = pickBoth('majors');
    }

    // 学校与“学校所在国家”成对，保证一一对应（多语言：优先本地语言，回退 zh/en）
    // schoolPair 现在包含 { nativeLang, [nativeLang], zh, en }，每个值为 [schoolName, countryName]
    var nativeLang = schoolPair.nativeLang || 'en';
    var schoolNameObj = {};
    schoolNameObj[nativeLang] = schoolPair[nativeLang] ? schoolPair[nativeLang][0] : (schoolPair.zh ? schoolPair.zh[0] : '');
    schoolNameObj.zh = schoolPair.zh ? schoolPair.zh[0] : '';
    schoolNameObj.en = schoolPair.en ? schoolPair.en[0] : '';
    schoolNameObj.nativeLang = nativeLang;
    out.push(['school', schoolNameObj]);
    
    out.push(['major', majorVal]);
    out.push(['education', edu]);
    out.push(['schoolType', schoolTypeVal]);
    
    var countryNameObj = {};
    countryNameObj[nativeLang] = schoolPair[nativeLang] ? schoolPair[nativeLang][1] : (schoolPair.zh ? schoolPair.zh[1] : '');
    countryNameObj.zh = schoolPair.zh ? schoolPair.zh[1] : '';
    countryNameObj.en = schoolPair.en ? schoolPair.en[1] : '';
    countryNameObj.nativeLang = nativeLang;
    out.push(['schoolCountry', countryNameObj]);

    // 收入等级 / 公司规模：仅劳动年龄(18~64)有在职收入，其余按身份填“无”
    var incomeLevel, companySize;
    if (ageNum < 18) {
      incomeLevel = { zh: '无收入', en: 'No income' };
      companySize = { zh: '无', en: 'None' };
    } else if (ageNum >= 65) {
      incomeLevel = { zh: '退休金', en: 'Pension' };
      companySize = { zh: '无', en: 'None' };
    } else {
      incomeLevel = pickBoth('incomeLevels');
      companySize = pickBoth('companySizes');
    }
    out.push(['incomeLevel', incomeLevel]);
    out.push(['companySize', companySize]);

    // 技能 / 兴趣：按年龄段选取，与年龄相符（幼儿/青少年/成年/老年 各有不同）
    var skills = pickSomeBoth('skills', 3, band);
    var interests = pickSomeBoth('interests', 3, band);
    out.push(['skills', skills]);
    out.push(['interests', interests]);

    // 其它双语字段
    out.push(['personality', pickBoth('personalities')]);
    out.push(['pet', pickBoth('pets')]);
    out.push(['favoriteFood', pickBoth('favoriteFoods')]);
    out.push(['travelStyle', pickBoth('travelStyles')]);

    // 外貌类
    var hairVal = (ageNum >= 60) ? { zh: '白发', en: 'White' } : pickBoth('hairColors');
    out.push(['hairColor', hairVal]);
    out.push(['eyeColor', pickBoth('eyeColors')]);
    out.push(['skinTone', pickBoth('skinTones')]);
    out.push(['bloodType', pickBoth('bloodTypes')]);
    out.push(['bodyType', pickBoth('bodyTypes')]);

    // 在线 / 安全类（安全问题与安全答案成对出现，保证一致；按国家选取，保证文化匹配）
    var qa = pickSecurityQAByCountry(ctx.countryCode);
    var secQObj = { zh: qa.zh[0], en: qa.en[0], nativeLang: qa.nativeLang };
    secQObj[qa.nativeLang] = qa.native[0];
    var secAObj = { zh: qa.zh[1], en: qa.en[1], nativeLang: qa.nativeLang };
    secAObj[qa.nativeLang] = qa.native[1];
    out.push(['securityQuestion', secQObj]);
    out.push(['securityAnswer', secAObj]);
    // 在线签名（按国家选取，保证文化匹配）
    var sig = pickSignaturesByCountry(ctx.countryCode);
    var sigObj = { zh: sig.zh, en: sig.en, nativeLang: sig.nativeLang };
    sigObj[sig.nativeLang] = sig.native;
    out.push(['onlineSignature', sigObj]);

    // 语言无关字段（时区、网站）
    out.push(['timezone', util.timezoneFor(ctx.countryCode)]);
    out.push(['website', util.websiteFor(ctx)]);
    return out;
  };

  /* 按国家代码返回时区，未命中回退 UTC
   * 若该国家有多个时区（数组），随机返回其中一个 */
  util.timezoneFor = function (code) {
    var TZ = (FakeID.profile && FakeID.profile.timezones) || {};
    var tz = TZ[code] || 'UTC';
    return Array.isArray(tz) ? util.pick(tz) : tz;
  };

  /* 生成“网站”字段：基于用户名 handle 拼一个示例个人站点
    * 使用 RFC 2606/6761 保留 TLD (.test, .example, .invalid, .localhost)
    * 避免意外生成真实可注册域名 */
  util.websiteFor = function (ctx) {
    ctx = ctx || {};
    var handle = ctx.handle || util.randomHandle(8);
    var tld = util.pick(['test', 'example', 'invalid', 'localhost']);
    return 'https://www.' + String(handle).toLowerCase() + '.' + tld;
  };

  /* 并行数组完整性自检：校验 profile.js 中 zh/en 数组同键长度一致 */
  util.validateParallelArrays = function (zhPool, enPool, poolKeys) {
    poolKeys = poolKeys || ['schools','kindergartens','primarySchools','middleSchools','highSchools','majors','educations','schoolTypes','countries','incomeLevels','companySizes','personalities','pets','favoriteFoods','travelStyles','hairColors','eyeColors','skinTones','bloodTypes','bodyTypes','signatures'];
    var mismatches = [];
    for (var i = 0; i < poolKeys.length; i++) {
      var k = poolKeys[i];
      var zhLen = (zhPool[k] && zhPool[k].length) || 0;
      var enLen = (enPool[k] && enPool[k].length) || 0;
      if (zhLen !== enLen) mismatches.push(k + ': zh=' + zhLen + ' en=' + enLen);
    }
    if (mismatches.length && typeof console !== 'undefined' && console.warn) {
      console.warn('[FakeID] profile 并行数组长度不一致（会导致中英错位），请同步更新 zh/en 数组:', mismatches.join('; '));
    }
    return mismatches.length === 0;
  };

  /* 国家/地区注册表 */
  FakeID.countries = FakeID.countries || {};
  FakeID.registerCountry = function (code, cfg) {
    cfg.code = code;
    FakeID.countries[code] = cfg;
  };
})(window);