/* app.js — 界面交互（国家 -> 地区/省 -> 城市 三级联动/生成/复制/导出）
 * 依赖：i18n.js、util.js、data/*.js、generator.js（均在 index.html 中按 defer 顺序引入）。
 * 字段以“键”存储，渲染时按当前 UI 语言本地化（ FakeID.i18n ）。 */
(function () {
  'use strict';
  var FakeID = window.FakeID;
  var i18n = FakeID.i18n;
  var theme = FakeID.theme;
  var util = FakeID.util;
  function $(id) { return document.getElementById(id); }
  var countrySel = $('country'), regionWrap = $('regionWrap'), regionSel = $('region'),
      cityWrap = $('cityWrap'), citySel = $('city'),
      districtWrap = $('districtWrap'), districtSel = $('district'),
      genderSel = $('gender'), cardTypeSel = $('cardType'), countSel = $('count'), genBtn = $('generate'),
      ageModeSel = $('ageMode'), ageExactWrap = $('ageExactWrap'), ageExactSel = $('ageExact'),
      ageRangeWrap = $('ageRangeWrap'), ageMinSel = $('ageMin'), ageMaxSel = $('ageMax'),
      emailSuffixSel = $('emailSuffix'), emailCustomWrap = $('emailCustomWrap'), emailCustomSel = $('emailCustom'),
      copyBtn = $('copy'), exportBtn = $('export'), results = $('results'), statusEl = $('status'),
      langSwitch = $('langSwitch'), themeSwitch = $('themeSwitch');

  var lastBatches = null;   // 最近一次生成的字段数组集合（每项 [key, value]）
  var lastText = '';        // 最近一次生成的纯文本（用于复制，按当前语言）
  var lastCountryCode = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 信用卡类型下拉：根据 util.cardTypeKeys() 动态填充（与 i18n 双语显示名联动），
  // 新增卡组织只需在 util.js 的 cardTypes 中登记，无需改动此处与 index.html。
  function populateCardTypes() {
    if (!cardTypeSel) return;
    var cur = cardTypeSel.value;
    cardTypeSel.innerHTML = '';
    var any = document.createElement('option');
    any.value = 'random';
    any.textContent = i18n.t('cardType.random');
    cardTypeSel.appendChild(any);
    util.cardTypeKeys().forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = i18n.card(k);
      cardTypeSel.appendChild(o);
    });
    if (cur) {
      var exists = false;
      for (var i = 0; i < cardTypeSel.options.length; i++) {
        if (cardTypeSel.options[i].value === cur) { exists = true; break; }
      }
      if (exists) cardTypeSel.value = cur;
    }
  }

  // 将字段值按当前 UI 语言本地化（性别代码与年龄类别职业代码）
  function localizeValue(key, value) {
    if (key === 'gender') return i18n.gender(value);
    if (key === 'cardType') return i18n.card(value);
    if (key === 'occupation' && (value === 'child' || value === 'student' || value === 'retired')) {
      return i18n.occLabel(value);
    }
    return value;
  }

  function init() {
    document.documentElement.lang = (i18n.lang() === 'en') ? 'en' : 'zh-CN';
    document.title = i18n.t('app.title.full');
    i18n.apply(document);
    refreshCountryOptions();
    populateCardTypes();
    countrySel.addEventListener('change', onCountryChange);
    regionSel.addEventListener('change', onRegionChange);
    citySel.addEventListener('change', onCityChange);
    genBtn.addEventListener('click', onGenerate);
    ageModeSel.addEventListener('change', syncAgeUI);
    syncAgeUI();
    emailSuffixSel.addEventListener('change', syncEmailUI);
    syncEmailUI();
    copyBtn.addEventListener('click', onCopy);
    exportBtn.addEventListener('click', onExport);
    langSwitch.addEventListener('click', onLangClick);
    themeSwitch.addEventListener('click', onThemeClick);
    i18n.onChange(applyLanguage);
    theme.onChange(updateThemeSwitch);
    onCountryChange();
    updateLangSwitch();
    updateThemeSwitch();
  }

  // 语言切换：点击分段控件
  function onLangClick(e) {
    var b = e.target.closest ? e.target.closest('.lang-opt') : null;
    if (!b) return;
    i18n.setLang(b.getAttribute('data-lang'));
  }

  // 语言变化时统一刷新界面（保留已生成数据，仅重新本地化标签/值）
  function applyLanguage() {
    document.documentElement.lang = (i18n.lang() === 'en') ? 'en' : 'zh-CN';
    document.title = i18n.t('app.title.full');
    i18n.apply(document);
    refreshCountryOptions();
    onCountryChange();   // 重新本地化 地区/城市/邮箱后缀 下拉文案
    populateCardTypes();  // 重新本地化信用卡类型下拉文案
    updateLangSwitch();
    renderResults();
  }

  function updateLangSwitch() {
    var pref = i18n.pref();
    var opts = langSwitch.querySelectorAll('.lang-opt');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('active', opts[i].getAttribute('data-lang') === pref);
    }
  }

  // 主题切换：点击分段控件（系统/浅色/深色），与语言切换完全同构
  function onThemeClick(e) {
    var b = e.target.closest ? e.target.closest('.theme-opt') : null;
    if (!b) return;
    theme.set(b.getAttribute('data-theme-opt'));
  }
  function updateThemeSwitch() {
    var pref = theme.pref();
    var opts = themeSwitch.querySelectorAll('.theme-opt');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('active', opts[i].getAttribute('data-theme-opt') === pref);
    }
  }

  function refreshCountryOptions() {
    var sel = countrySel.value;
    countrySel.innerHTML = '';
    FakeID.listCountries().forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code; o.textContent = i18n.countryLabel(c.code);
      countrySel.appendChild(o);
    });
    if (sel) countrySel.value = sel;
  }

  // 邮箱后缀下拉：根据国家所选语言/地区的邮箱域名池动态填充，
  // 便于用户直接选择“网上主流邮箱”，同时保留“随机（国家默认）”与“自定义…”。
  function syncEmailOptions(c) {
    if (!emailSuffixSel) return;
    var pool = (c && c.locale && FakeID.util.emailPool) ? FakeID.util.emailPool(c.locale) : ['gmail.com'];
    emailSuffixSel.innerHTML = '';
    var any = document.createElement('option');
    any.value = '__random__'; any.textContent = i18n.t('email.any');
    emailSuffixSel.appendChild(any);
    pool.forEach(function (d) {
      var o = document.createElement('option');
      o.value = d; o.textContent = d;
      emailSuffixSel.appendChild(o);
    });
    var custom = document.createElement('option');
    custom.value = '__custom__'; custom.textContent = i18n.t('email.custom');
    emailSuffixSel.appendChild(custom);
    syncEmailUI();
  }

  // 国家变化 -> 重新填充“地区/省”
  function onCountryChange() {
    var c = FakeID.countries[countrySel.value];
    syncEmailOptions(c);
    regionSel.innerHTML = '';
    citySel.innerHTML = '';
    if (c && c.regions && c.regions.length) {
      regionWrap.classList.remove('hidden');
      var any = document.createElement('option');
      any.value = ''; any.textContent = i18n.t('region.any');
      regionSel.appendChild(any);
      c.regions.forEach(function (r) {
        var o = document.createElement('option');
        o.value = r.name; o.textContent = r.abbr ? (r.name + ' (' + r.abbr + ')') : r.name;
        regionSel.appendChild(o);
      });
    } else {
      regionWrap.classList.add('hidden');
    }
    onRegionChange();
  }

  // 地区变化 -> 重新填充“城市”
  function onRegionChange() {
    var c = FakeID.countries[countrySel.value];
    citySel.innerHTML = '';
    var region = null;
    if (c && c.regions) {
      for (var i = 0; i < c.regions.length; i++) {
        if (c.regions[i].name === regionSel.value) { region = c.regions[i]; break; }
      }
    }
    if (region && region.cities && region.cities.length) {
      cityWrap.classList.remove('hidden');
      var any = document.createElement('option');
      any.value = ''; any.textContent = i18n.t('city.any');
      citySel.appendChild(any);
      region.cities.forEach(function (ci) {
        var name = (typeof ci === 'string') ? ci : ci.name;
        var o = document.createElement('option');
        o.value = name; o.textContent = name;
        citySel.appendChild(o);
      });
    } else {
      cityWrap.classList.add('hidden');
    }
    onCityChange();   // 城市变化后联动刷新“区/县”
  }

  // 城市变化 -> 重新填充“区/县”（仅当地级市含 districts 时显示该下拉）
  function onCityChange() {
    var c = FakeID.countries[countrySel.value];
    districtSel.innerHTML = '';
    var region = null, city = null;
    if (c && c.regions) {
      for (var i = 0; i < c.regions.length; i++) {
        if (c.regions[i].name === regionSel.value) { region = c.regions[i]; break; }
      }
    }
    if (region && region.cities) {
      for (var j = 0; j < region.cities.length; j++) {
        var ci = region.cities[j];
        var name = (typeof ci === 'string') ? ci : ci.name;
        if (name === citySel.value) { city = ci; break; }
      }
    }
    var districts = (city && city.districts) ? city.districts : null;
    if (districts && districts.length) {
      districtWrap.classList.remove('hidden');
      var any = document.createElement('option');
      any.value = ''; any.textContent = i18n.t('district.any');
      districtSel.appendChild(any);
      districts.forEach(function (d) {
        var o = document.createElement('option');
        o.value = d; o.textContent = d;
        districtSel.appendChild(o);
      });
    } else {
      districtWrap.classList.add('hidden');
    }
  }

  // 年龄设置 UI 显隐联动：根据所选模式显示/隐藏对应输入框
  function syncAgeUI() {
    var mode = ageModeSel.value;
    ageExactWrap.classList.toggle('hidden', mode !== 'exact');
    ageRangeWrap.classList.toggle('hidden', mode !== 'range');
  }

  // 邮箱后缀 UI 联动：选择“自定义…”时显示自定义输入框
  function syncEmailUI() {
    emailCustomWrap.classList.toggle('hidden', emailSuffixSel.value !== '__custom__');
  }

  function onGenerate() {
    var code = countrySel.value;
    var c = FakeID.countries[code];
    var gender = genderSel.value;
    var cardType = cardTypeSel.value || 'random';
    var region = regionSel.value || null;
    var city = citySel.value || null;
    var district = districtSel.value || null;
    var n = parseInt(countSel.value, 10) || 1;
    var ageMode = ageModeSel.value || 'random';
    var genOpts = { gender: gender, cardType: cardType, region: region, city: city, district: district, ageMode: ageMode };
    if (ageMode === 'exact') genOpts.ageExact = ageExactSel.value;
    if (ageMode === 'range') { genOpts.ageMin = ageMinSel.value; genOpts.ageMax = ageMaxSel.value; }
    // 邮箱后缀：下拉选择固定后缀或用自定义后缀覆盖国家默认域名
    var emailSuffix = emailSuffixSel.value;
    if (emailSuffix === '__custom__') {
      var customDomain = emailCustomSel.value.trim().replace(/^@+/, '');
      if (customDomain) genOpts.emailDomain = customDomain;
    } else if (emailSuffix && emailSuffix !== '__random__') {
      genOpts.emailDomain = emailSuffix;
    }
    var batches = [];
    for (var i = 0; i < n; i++) {
      batches.push(FakeID.generate(code, genOpts));
    }
    lastBatches = batches;
    lastCountryCode = code;
    renderResults();
    flash(i18n.t('flash.generated').replace('{n}', n));
  }

  // 按当前语言渲染结果（字段标签与性别/年龄类别职业值均本地化）
  function renderResults() {
    if (!lastBatches) return;
    var cLabel = i18n.countryLabel(lastCountryCode);
    var cards = [], texts = [];
    for (var i = 0; i < lastBatches.length; i++) {
      var fields = lastBatches[i];
      var rows = fields.map(function (f) {
        return '<tr><th>' + esc(i18n.field(f[0])) + '</th><td>' + esc(localizeValue(f[0], f[1])) + '</td></tr>';
      }).join('');
      cards.push('<article class="card"><h3>' + esc(cLabel) + ' #' + (i + 1) + '</h3><table>' + rows + '</table></article>');
      texts.push(cLabel + ' #' + (i + 1) + '\n' + fields.map(function (f) {
        return i18n.field(f[0]) + '：' + localizeValue(f[0], f[1]);
      }).join('\n'));
    }
    results.innerHTML = cards.join('');
    lastText = texts.join('\n\n');
  }

  function onCopy() {
    if (!lastText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastText).then(function () { flash(i18n.t('flash.copied')); }, function () { fallbackCopy(lastText); });
    } else {
      fallbackCopy(lastText);
    }
  }
  function fallbackCopy(t) {
    var ta = document.createElement('textarea');
    ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash(i18n.t('flash.copied.compat')); }
    catch (e) { flash(i18n.t('flash.copyfail')); }
    document.body.removeChild(ta);
  }

  function onExport() {
    if (!lastBatches || !lastBatches.length) return;
    var labels = lastBatches[0].map(function (f) { return i18n.field(f[0]); });
    var rows = [labels.map(csvCell).join(',')];
    lastBatches.forEach(function (fields) {
      rows.push(fields.map(function (f) { return csvCell(String(localizeValue(f[0], f[1]))); }).join(','));
    });
    var csv = '﻿' + rows.join('\n');
    download(csv, 'fake-identities.csv', 'text/csv;charset=utf-8');
    flash(i18n.t('flash.exported'));
  }
  function csvCell(s) {
    s = String(s).replace(/\r?\n/g, ' ');
    if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function download(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var flashTimer = null;
  function flash(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.add('show');
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { statusEl.classList.remove('show'); }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();