(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Rossi','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','DeLuca','Costa','Giordano','Mancini','Rizzo','Lombardi','Moretti','Barbieri'];
  var givenMale = ['Leonardo','Francesco','Alessandro','Lorenzo','Mattia','Andrea','Gabriele','Matteo','Tommaso','Edoardo','Riccardo','Davide','Giovanni','Filippo','Pietro'];
  var givenFemale = ['Sofia','Aurora','Giorgia','Giulia','Emma','Martina','Chiara','Sara','Alice','Anna','Ludovica','Noemi','Nicole','Vittoria','Eleonora'];
  var regions = [
  {name:'Lazio',cities:['Rome','Latina']},
  {name:'Lombardia',cities:['Milan','Brescia','Bergamo','Como']},
  {name:'Campania',cities:['Naples','Salerno','Caserta']},
  {name:'Piemonte',cities:['Turin','Alessandria','Novara']},
  {name:'Sicilia',cities:['Palermo','Catania','Messina']},
  {name:'Liguria',cities:['Genoa','La Spezia','Imperia']},
  {name:'Emilia-Romagna',cities:['Bologna','Modena','Parma','Ravenna']},
  {name:'Toscana',cities:['Florence','Pisa','Siena']},
  {name:'Veneto',cities:['Venice','Verona','Padua','Treviso']},
  {name:'Puglia',cities:['Bari','Lecce','Taranto']},
  {name:'Friuli-Venezia Giulia',cities:['Trieste','Udine','Pordenone']},
  {name:'Abruzzo',cities:['L\'Aquila','Pescara']},
  {name:'Basilicata',cities:['Potenza','Matera']},
  {name:'Calabria',cities:['Catanzaro','Reggio Calabria']},
  {name:'Marche',cities:['Ancona','Pesaro']},
  {name:'Molise',cities:['Campobasso']},
  {name:'Sardegna',cities:['Cagliari','Sassari']},
  {name:'Trentino-Alto Adige',cities:['Trento','Bolzano']},
  {name:'Umbria',cities:['Perugia']},
  {name:'Valle d\'Aosta',cities:['Aosta']}

];;
  var streets = ['Via Roma','Via Garibaldi','Corso Italia','Via Dante','Via Galileo','Via Marconi','Viale dei Mille','Via Trento','Via Trieste','Via Bologna'];
  var companies = ['Italia Tech SRL','Mediterraneo SpA','Colosseo Media','Serenissima Logistics','Vesuvio Software','Adriatico Commerce'];
  var jobs = util.occupationPool('it');
  function cf() {
    // Codice Fiscale 格式：LLLNNNYYMDDZZZZX (16字符)
    // LLL: 姓氏辅音 (3字母) - 简化为随机大写字母
    // NNN: 名字辅音 (3字母) - 简化为随机大写字母
    // YY: 出生年份后两位
    // M: 出生月份字母 (A-L)
    // DD: 出生日 (男1-31, 女41-71)
    // ZZZZ: 出生地编码 (4字符) - 简化为随机
    // X: 校验字符 - 简化为随机字母
    // 注意：这是演示用简化实现，非真实合法 CF
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var n = '0123456789';
    var months = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, 12);
    var out = '';
    // 姓氏3字母
    for (var i = 0; i < 3; i++) out += s.charAt(util.randInt(0, 25));
    // 名字3字母
    for (var i = 0; i < 3; i++) out += s.charAt(util.randInt(0, 25));
    // 年份2位 (随机 1950-2004)
    out += String(util.randInt(50, 104)).slice(-2);
    // 月份1字母
    out += months.charAt(util.randInt(0, 11));
    // 日期2位
    var day = util.randInt(1, 31);
    out += util.pad(day, 2);
    // 出生地4字符 (字母+数字)
    for (var i = 0; i < 4; i++) out += (i % 2 === 0 ? s : n).charAt(util.randInt(0, i % 2 === 0 ? 25 : 9));
    // 校验字符
    out += s.charAt(util.randInt(0, 25));
    return out;
  }
  FakeID.registerCountry('italy', {
    label: '意大利',
    locale: 'it',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('it'),
        phonePrefix: ['320','330','340','347','348','349','351','392','393','380'],
        phoneLen: 7,
        idLabel: 'cf',
        idFn: function () { return cf(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.pick(streets) + ' ' + u.randInt(1, 199) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(10000, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'it'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);