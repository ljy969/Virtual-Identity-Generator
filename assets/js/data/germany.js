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
];
  var streets = ['Hauptstrasse','Bahnhofstrasse','Schulstrasse','Gartenstrasse','Bergstrasse','Lindenstrasse','Waldstrasse','Ringstrasse','Kirchstrasse','Mozartstrasse'];
  var companies = ['Deutsche Tech GmbH','Rhein Handel AG','Berlin Logistik','Hansa Media','Bayerische Systems','Nord Software','Suder Logistics'];
  var jobs = util.occupationPool('de');
  function steuerId() {
    // 德国 Steuer-ID (IdNr, 11位)：前10位为本体，第11位为校验位
    // 官方算法为 ISO 7064 MOD 11,10 递归式（并非固定权重线性式）：
    //   p = 10; 对本体每位 d: s = (p + d) % 10; s===0 时 s=10; p = (s * 2) % 11;
    //   校验位 = (11 - p) % 10
    // 另：真实 IdNr 首位不为 0，这里限定本体首位 >= 1
    var body = String(util.randInt(1000000000, 9999999999)); // 10位且首位非0
    var p = 10;
    for (var i = 0; i < body.length; i++) {
      var d = parseInt(body.charAt(i), 10);
      var s = (p + d) % 10;
      if (s === 0) s = 10;
      p = (s * 2) % 11;
    }
    var check = (11 - p) % 10;
    var full = body + check;
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