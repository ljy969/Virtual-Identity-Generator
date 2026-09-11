(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier'];
  var givenMale = ['Lucas','Hugo','Gabriel','Louis','Adam','Jules','Leo','Marius','Arthur','Nathan','Ethan','Raphael','Tom','Noah','Sacha'];
  var givenFemale = ['Emma','Jade','Louise','Alice','Chloe','Lina','Lea','Manon','Camille','Ines','Sarah','Anais','Eva','Romane','Juliette'];
  var regions = [
  {name:'Ile-de-France',cities:['Paris','Versailles']},
  {name:'Auvergne-Rhone-Alpes',cities:['Lyon','Grenoble','Saint-Etienne','Clermont-Ferrand']},
  {name:'Provence-Alpes-Cote dAzur',cities:['Marseille','Nice','Toulon']},
  {name:'Occitanie',cities:['Toulouse','Montpellier','Nimes']},
  {name:'Nouvelle-Aquitaine',cities:['Bordeaux','Limoges','Poitiers']},
  {name:'Hauts-de-France',cities:['Lille','Amiens','Calais']},
  {name:'Bretagne',cities:['Rennes','Brest','Quimper']},
  {name:'Grand Est',cities:['Strasbourg','Reims','Metz','Nancy']},
  {name:'Pays de la Loire',cities:['Nantes','Angers','Le Mans']},
  {name:'Normandie',cities:['Le Havre','Rouen','Caen']},
  {name:'Centre-Val de Loire',cities:['Orleans','Tours','Chartres']},
  {name:'Bourgogne-Franche-Comte',cities:['Dijon','Besancon','Dole']},
  {name:'Corse',cities:['Ajaccio','Bastia','Corte']},
  {name:'Guadeloupe',cities:['Pointe-a-Pitre','Basse-Terre']},
  {name:'Martinique',cities:['Fort-de-France']},
  {name:'Guyane',cities:['Cayenne']},
  {name:'La Reunion',cities:['Saint-Denis','Saint-Pierre']},
  {name:'Mayotte',cities:['Mamoudzou']}

];
  var streets = ['Rue de la Republique','Avenue de la Gare','Boulevard Victor Hugo','Rue des Lilas','Place de lEglise','Rue Pasteur','Avenue Jean Jaures','Rue Victor Hugo','Chemin des Vignes','Rue de lEcole'];
  var companies = ['Societe Generale Tech','Lumiere SAS','Bleu Logistique','Hexagone Media','Paris Software','Atlantique Commerce'];
  var jobs = util.occupationPool('fr');
  function nir(gender, bdate) {
    var sex = gender === 'male' ? 1 : 2;
    var yy = String(bdate.getFullYear()).slice(2);
    var mm = util.pad(bdate.getMonth() + 1, 2);
    // 省份代码：20 未分配（1976 年起科西嘉拆分为 2A/2B），按官方规则采样
    var dept;
    if (util.chance(0.02)) {
      dept = util.chance(0.5) ? '2A' : '2B'; // 科西嘉（20 号未分配）
    } else {
      // 目标集合 {01..19, 21..94}：共 93 个省份代码（20 未分配，2A/2B 上面单独处理）
      var n = util.randInt(1, 93);
      dept = util.pad(n <= 19 ? n : n + 1, 2);
    }
    var commune = util.pad(util.randInt(1, 999), 3);
    var order = util.pad(util.randInt(1, 999), 3);
    var body = '' + sex + yy + mm + dept + commune + order;
    // 计算校验键时，官方规定 Corse 的 2A 视作 "20"、2B 视作 "19"（INSEE 规则）
    var bodyForCheck = (dept === '2A') ? (body.replace('2A', '20')) : (dept === '2B') ? (body.replace('2B', '19')) : body;
    // 使用字符串逐位取模避免大整数精度问题
    var mod97 = function (str) {
      var rem = 0;
      for (var i = 0; i < str.length; i++) {
        rem = (rem * 10 + parseInt(str.charAt(i), 10)) % 97;
      }
      return rem;
    };
    var key = 97 - mod97(bodyForCheck);
    // 官方 NIR 校验键合法域为 01-97；body % 97 === 0 时 key=97（合法），移除错误的 99 特判
    return sex + yy + '-' + mm + '-' + dept + commune + '-' + order + '-' + util.pad(key, 2);
  }
  FakeID.registerCountry('france', {
    label: '法国',
    locale: 'fr',
    regions: regions,
    make: function (opts) {
      opts = opts || {};
      var g = opts.gender ? String(opts.gender).toLowerCase() : '';
      if (!g || g === 'random') g = util.chance(0.5) ? 'male' : 'female';
      if (g !== 'male' && g !== 'female') g = util.chance(0.5) ? 'male' : 'female';
      var gender = g;
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('fr'),
        phonePrefix: ['06','07'],
        phoneLen: 8,
        idLabel: 'nir',
        idFn: function (ctx) { return nir(ctx.gender, ctx.bdate); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.randInt(1, 199) + ' ' + u.pick(streets) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(10000, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'fr'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);