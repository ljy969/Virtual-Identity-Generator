/* theme.js — 主题（浅色/深色/跟随系统）偏好与自动检测
 * 设计上完全对齐 i18n.js：localStorage 持久化 + 监听者(observer) + 应用到 <html data-theme>。
 * 与 i18n 解耦，可独立工作；UI 高亮由 app.js 负责。
 *  - pref = 'system'：移除 data-theme 属性，由 CSS 的 @media (prefers-color-scheme) 决定（实时跟随系统）
 *  - pref = 'light' / 'dark'：显式写入 data-theme，覆盖系统偏好 */
(function (global) {
  'use strict';
  var FakeID = (global.FakeID = global.FakeID || {});
  var theme = (FakeID.theme = {});

  var KEY = 'fakeid.theme';
  var SUPPORTED = ['system', 'light', 'dark'];

  var mql = global.matchMedia
    ? global.matchMedia('(prefers-color-scheme: dark)')
    : null;

  var pref;
  try { pref = localStorage.getItem(KEY); } catch (e) { pref = null; }
  if (SUPPORTED.indexOf(pref) < 0) pref = 'system';

  var listeners = [];
  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](pref); } catch (e) {}
    }
  }

  // 将偏好落到 <html> 上：system => 交给 CSS 媒体查询；light/dark => 显式属性
  function applyAttr() {
    var d = document.documentElement;
    if (pref === 'system') d.removeAttribute('data-theme');
    else d.setAttribute('data-theme', pref);
  }

  theme.SUPPORTED = SUPPORTED;
  theme.pref = function () { return pref; };
  theme.systemPrefersDark = function () { return !!(mql && mql.matches); };
  // 当前“实际生效”是否为深色（供需要感知生效主题的逻辑使用）
  theme.isDark = function () {
    if (pref === 'dark') return true;
    if (pref === 'light') return false;
    return theme.systemPrefersDark();
  };
  theme.set = function (t) {
    if (SUPPORTED.indexOf(t) < 0) t = 'system';
    pref = t;
    try { localStorage.setItem(KEY, t); } catch (e) {}
    applyAttr();
    notify();
  };
  theme.onChange = function (cb) { listeners.push(cb); };

  // 系统主题实时变化时：pref==='system' 时 CSS 已自动响应，这里仅通知监听者（如 UI 高亮保持一致）
  if (mql) {
    var onSys = function () { notify(); };
    if (mql.addEventListener) mql.addEventListener('change', onSys);
    else if (mql.addListener) mql.addListener(onSys); // 旧浏览器回退
  }

  applyAttr();
})(window);
