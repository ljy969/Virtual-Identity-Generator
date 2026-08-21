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
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var out = '';
    for (var i = 0; i < 16; i++) out += s.charAt(util.randInt(0, s.length - 1));
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