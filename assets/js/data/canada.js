(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Smith','Brown','Tremblay','Martin','Roy','Comeau','Gagnon','Boisvert','Cote','Poirier','Lavoie','Fortin','Gauthier','Morin','Belanger','Pelletier','Bergeron','Leblanc','Picard','Ouellet'];
  var givenMale = ['Liam','Noah','William','James','Logan','Ethan','Lucas','Benjamin','Jacob','Oliver','Jack','Henry','Owen','Wyatt','Leo'];
  var givenFemale = ['Olivia','Emma','Charlotte','Ava','Sophia','Mia','Amelia','Emily','Layla','Hannah','Abigail','Ella','Scarlett','Grace','Chloe'];
  var regions = [
  {name:'Ontario',abbr:'ON',cities:['Toronto','Ottawa','Hamilton','Kitchener','London','Windsor']},
  {name:'Quebec',abbr:'QC',cities:['Montreal','Quebec City','Laval','Gatineau']},
  {name:'British Columbia',abbr:'BC',cities:['Vancouver','Victoria','Surrey','Kelowna']},
  {name:'Alberta',abbr:'AB',cities:['Calgary','Edmonton','Red Deer']},
  {name:'Manitoba',abbr:'MB',cities:['Winnipeg','Brandon','Thompson']},
  {name:'Saskatchewan',abbr:'SK',cities:['Saskatoon','Regina','Prince Albert']},
  {name:'Nova Scotia',abbr:'NS',cities:['Halifax','Sydney']},
  {name:'New Brunswick',abbr:'NB',cities:['Fredericton','Moncton','Saint John']},
  {name:'Newfoundland and Labrador',abbr:'NL',cities:['St. Johns','Corner Brook']},
  {name:'Prince Edward Island',abbr:'PE',cities:['Charlottetown','Summerside']},
  {name:'Northwest Territories',abbr:'NT',cities:['Yellowknife']},
  {name:'Yukon',abbr:'YT',cities:['Whitehorse']},
  {name:'Nunavut',abbr:'NU',cities:['Iqaluit']}
];;
  var streets = ['King St','Queen St','Main St','Maple Ave','Elm St','Park Rd','Church St','Lake Rd','Hillcrest Ave','Victoria Ave'];
  var companies = ['Maple Tech Inc','Rocher Commerce','Grand Nord Logistics','Canoe Media','Laurentian Systems','Pacific Software'];
  var jobs = util.occupationPool('en');
  var postalLetters = 'ABCEGHJKLMNPRSTVWXYZ'.split('');
  function sin() {
    // 加拿大 SIN 使用 Luhn 算法校验 (9位数字，最后一位为校验位)
    var body = util.pad(util.randInt(0, 99999999), 8); // 8位本体
    var check = util.luhnCheckDigit(body);
    var full = body + check;
    return full.slice(0, 3) + '-' + full.slice(3, 6) + '-' + full.slice(6);
  }
  function postal() {
    return util.pick(postalLetters) + util.randInt(0, 9) + util.pick(postalLetters) + ' ' + util.randInt(0, 9) + util.pick(postalLetters) + util.randInt(0, 9);
  }
  FakeID.registerCountry('canada', {
    label: '加拿大',
    locale: 'en',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('en'),
        phonePrefix: ['416','514','604','403','613','902','204','905','780','418'],
        phoneLen: 7,
        idLabel: 'sin',
        idFn: function () { return sin(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          var prov = ctx.region && ctx.region.abbr ? ctx.region.abbr : (ctx.region ? ctx.region.name : '');
          return u.randInt(1, 9999) + ' ' + u.pick(streets) + ', ' + city + ', ' + prov;
        },
        zipFn: function () { return postal(); },
        companies: companies, jobs: jobs, locale: 'en'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);