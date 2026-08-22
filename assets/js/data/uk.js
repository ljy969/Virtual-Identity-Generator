(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Patel','Wright','Evans','Walker','Roberts','Thompson','Clark','Lee','Khan','Ali','Singh','Cox'];
  var givenMale = ['Oliver','Harry','George','Jack','Jacob','Noah','Charlie','Thomas','Oscar','Freddie','Alfie','Archie','Henry','Leo','Arthur'];
  var givenFemale = ['Olivia','Amelia','Isla','Ava','Emily','Sophia','Grace','Mia','Poppy','Ella','Lily','Freya','Charlotte','Florence','Evie'];
  var regions = [
  {name:'England',cities:['London','Manchester','Birmingham','Leeds','Liverpool','Bristol','Sheffield','Newcastle','Nottingham','Brighton','Oxford','Cambridge','York']},
  {name:'Scotland',cities:['Glasgow','Edinburgh','Aberdeen','Dundee','Inverness']},
  {name:'Wales',cities:['Cardiff','Swansea','Newport','Bangor']},
  {name:'Northern Ireland',cities:['Belfast','Londonderry','Lisburn']}
];;
  var streets = ['High St','Church Rd','Station Rd','Main St','Park Ave','Victoria Rd','Green Lane','Kings Rd','North St','Mill Lane'];
  var companies = ['Britannia Ltd','Thames Consulting','Albion Group','Crown Retail','Union Logistics','Empire Media','Royal Tech','Saxons Inc'];
  var jobs = util.occupationPool('en');
  var outward = ['SW1A','EH1','M1','B1','G2','CF10','BS1','LE1','LS1','NE1','NW1','SE1','EC1','WC1','RG1','CB1'];
  function nino() {
    // NINO 格式：两字母 + 6数字 + 后缀字母(A-D)
    // 前两字母排除 D, F, I, Q, U, V (官方规范)
    var L = 'ABCEGHJKLMNPRSTWXYZ'; // 含 O，排除 DFIQUV
    var a = L.charAt(util.randInt(0, L.length - 1));
    var b = L.charAt(util.randInt(0, L.length - 1));
    var last = util.pick(['A','B','C','D']);
    return a + b + util.pad(util.randInt(0, 999999), 6) + last;
  }
  FakeID.registerCountry('uk', {
    label: '英国',
    locale: 'en',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('en'),
        phonePrefix: ['07400','07500','07600','07700','07800','07900','07300','07200'],
        phoneLen: 6,
        idLabel: 'nino',
        idFn: function () { return nino(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.randInt(1, 299) + ' ' + u.pick(streets) + ', ' + city;
        },
        zipFn: function (u) {
          return u.pick(outward) + ' ' + u.randInt(1, 9) + u.pick('ABCDEFGHJKLMNPQRSTUVWXY'.split(''));
        },
        companies: companies, jobs: jobs, locale: 'en'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);