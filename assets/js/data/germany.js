(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Muller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann','Koch','Bauer','Richter','Klein','Wolf','Neumann','Schwarz','Zimmermann','Braun','Kruger'];
  var givenMale = ['Lukas','Jonas','Felix','Paul','Leon','Ben','Luca','Finn','Elias','Noah','Max','Tim','David','Jan','Niklas'];
  var givenFemale = ['Mia','Emma','Hannah','Sofia','Anna','Lea','Marie','Lina','Clara','Laura','Emily','Sarah','Lena','Maja','Emilia'];
  var regions = [
  {name:'Berlin',cities:['Berlin']},
  {name:'Bayern',cities:['Munich','Nuremberg','Augsburg','Regensburg']},
  {name:'Hamburg',cities:['Hamburg']},
  {name:'Hessen',cities:['Frankfurt','Wiesbaden','Kassel','Darmstadt']},
  {name:'Nordrhein-Westfalen',cities:['Cologne','Dusseldorf','Dortmund','Essen','Bonn']},
  {name:'Sachsen',cities:['Leipzig','Dresden','Chemnitz']},
  {name:'Bremen',cities:['Bremen']},
  {name:'Niedersachsen',cities:['Hanover','Braunschweig','Goettingen']},
  {name:'Baden-Wuerttemberg',cities:['Stuttgart','Mannheim','Karlsruhe','Freiburg']},
  {name:'Rheinland-Pfalz',cities:['Mainz','Ludwigshafen','Koblenz']},
  {name:'Thueringen',cities:['Erfurt','Jena','Gera']},
  {name:'Sachsen-Anhalt',cities:['Magdeburg','Halle','Dessau']},
  {name:'Brandenburg',cities:['Potsdam','Cottbus','Frankfurt Oder']},
  {name:'Mecklenburg-Vorpommern',cities:['Rostock','Schwerin','Neubrandenburg']},
  {name:'Saarland',cities:['Saarbruecken']},
  {name:'Schleswig-Holstein',cities:['Kiel','Luebeck','Flensburg']}
];;
  var streets = ['Hauptstrasse','Bahnhofstrasse','Schulstrasse','Gartenstrasse','Bergstrasse','Lindenstrasse','Waldstrasse','Ringstrasse','Kirchstrasse','Mozartstrasse'];
  var companies = ['Deutsche Tech GmbH','Rhein Handel AG','Berlin Logistik','Hansa Media','Bayerische Systems','Nord Software','Suder Logistics'];
  var jobs = util.occupationPool('de');
  function steuerId() {
    // 德国 Steuer-ID (11位，含校验位) - 简化演示实现
    // 真实算法：ISO 7064 Mod 11,10，结构复杂
    // 此处生成格式正确但校验位为演示用随机值
    var d = util.pad(util.randInt(0, 9999999999), 10); // 前10位
    var check = util.randInt(0, 9); // 简化：随机校验位
    var full = d + check;
    return full.slice(0, 2) + ' ' + full.slice(2, 5) + ' ' + full.slice(5, 8) + ' ' + full.slice(8, 11);
  }
  FakeID.registerCountry('germany', {
    label: '德国',
    locale: 'de',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('de'),
        phonePrefix: ['0151','0170','0171','0172','0173','0174','0175','0176','0177','0178','0179'],
        phoneLen: 7,
        idLabel: 'taxId',
        idFn: function () { return steuerId(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.pick(streets) + ' ' + u.randInt(1, 199) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(10000, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'de'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);