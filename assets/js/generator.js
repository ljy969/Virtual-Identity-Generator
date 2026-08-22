/* generator.js — 生成调度器（所有国家共用） */
(function (global) {
  'use strict';
  var FakeID = global.FakeID;
  FakeID.generate = function (code, opts) {
    opts = opts || {};
    var c = FakeID.countries[code];
    if (!c) throw new Error('未知国家/地区: ' + code);
    opts.countryCode = code;
    return c.make(opts);
  };
  FakeID.listCountries = function () {
    return Object.keys(FakeID.countries).map(function (k) {
      var c = FakeID.countries[k];
      return {
        code: k,
        label: c.label,
        hasStates: !!c.hasStates,
        states: c.states || null,
        hasRegions: !!(c.regions && c.regions.length),
        regions: c.regions || null
      };
    });
  };
})(window);