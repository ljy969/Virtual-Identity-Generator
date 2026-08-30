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

];
  var streets = ['Via Roma','Via Garibaldi','Corso Italia','Via Dante','Via Galileo','Via Marconi','Viale dei Mille','Via Trento','Via Trieste','Via Bologna'];
  var companies = ['Italia Tech SRL','Mediterraneo SpA','Colosseo Media','Serenissima Logistics','Vesuvio Software','Adriatico Commerce'];
  var jobs = util.occupationPool('it');

  // 辅音/元音提取（意大利语规则：B C D F G H J K L M N P Q R S T V W X Y Z 为辅音，其余为元音）
  var CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
  var VOWELS = 'AEIOU';

  function cfExtract(name, count) {
    name = String(name || '').toUpperCase().replace(/[^A-Z]/g, '');
    var cons = '', vowels = '';
    for (var i = 0; i < name.length; i++) {
      var ch = name.charAt(i);
      if (CONSONANTS.indexOf(ch) >= 0) cons += ch;
      else if (VOWELS.indexOf(ch) >= 0) vowels += ch;
    }
    var pool = cons + vowels;
    var out = '';
    for (var i = 0; i < count; i++) {
      out += pool.charAt(i) || 'X'; // 不足补 X
    }
    return out;
  }

  function cf(ctx) {
    // Codice Fiscale 格式：LLLNNNYYMDDZZZZX (16字符)
    // LLL: 姓氏前3辅音（不足补元音，仍不足补 X）
    // NNN: 名字前3辅音
    // YY: 出生年份后两位
    // M: 出生月份字母 (A-L)
    // DD: 出生日 (男1-31, 女41-71)
    // ZZZZ: 出生地编码 (4字符)
    // X: 校验字符
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var months = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, 12);
    var cadastralCodes = ['H501','F205','D612','L219','M261','B354','A944','C351','E815','G273'];
    var gender = ctx && ctx.gender ? ctx.gender : (util.chance(0.5) ? 'male' : 'female');
    var bdate = ctx && ctx.bdate ? ctx.bdate : util.randomDate(1965, 2004);
    var surname = ctx && ctx.last ? ctx.last : util.pick(surnames);
    var given = ctx && ctx.first ? ctx.first : util.pick(gender === 'male' ? givenMale : givenFemale);

    var out = '';
    out += cfExtract(surname, 3);                    // 姓氏3辅音
    out += cfExtract(given, 3);                      // 名字3辅音
    out += String(bdate.getFullYear()).slice(-2);    // 年份后2位
    out += months.charAt(bdate.getMonth());          // 月份字母 A-L
    var day = bdate.getDate();
    if (gender === 'female') day += 40;
    out += util.pad(day, 2);                         // 日期
    out += util.pick(cadastralCodes);                // 出生地编码

    // 校验字符 (官方算法: 奇偶位分别加权求和模26)
    var oddMap = {'0':1,'1':0,'2':5,'3':7,'4':9,'5':13,'6':15,'7':17,'8':19,'9':21,
      'A':1,'B':0,'C':5,'D':7,'E':9,'F':13,'G':15,'H':17,'I':19,'J':21,
      'K':2,'L':4,'M':18,'N':20,'O':11,'P':3,'Q':6,'R':8,'S':12,'T':14,'U':16,'V':10,'W':22,'X':25,'Y':24,'Z':23};
    var evenMap = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
      'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,
      'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25};
    var sum = 0;
    for (var i = 0; i < 15; i++) {
      var ch = out.charAt(i);
      if ((15 - i) % 2 === 1) sum += oddMap[ch] || 0;
      else sum += evenMap[ch] || 0;
    }
    var checkChar = s.charAt(sum % 26);
    return out + checkChar;
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
        idFn: function (ctx) { return cf(ctx); },
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