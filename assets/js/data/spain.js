(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Garcia','Martinez','Rodriguez','Lopez','Gonzalez','Perez','Sanchez','Ramirez','Torres','Flores','Diaz','Gomez','Vazquez','Ruiz','Hernandez','Jimenez','Moreno','Alvarez','Romero','Alonso'];
  var givenMale = ['Hugo','Daniel','Pablo','Alvaro','Adrian','Sergio','Diego','Javier','Marcos','Lucas','Mateo','Leo','Bruno','David','Mario'];
  var givenFemale = ['Lucia','Sofia','Maria','Martina','Paula','Julia','Daniela','Valeria','Carla','Alba','Noa','Emma','Ines','Vega','Carmen'];
  var regions = [
  {name:'Madrid',cities:['Madrid','Alcala de Henares','Getafe']},
  {name:'Cataluna',cities:['Barcelona','Girona','Tarragona','Lleida']},
  {name:'Comunidad Valenciana',cities:['Valencia','Alicante','Elche','Castellon']},
  {name:'Andalucia',cities:['Seville','Malaga','Cordoba','Granada','Cadiz','Jerez']},
  {name:'Aragon',cities:['Zaragoza','Huesca','Teruel']},
  {name:'Murcia',cities:['Murcia','Cartagena','Lorca']},
  {name:'Islas Baleares',cities:['Palma','Ibiza']},
  {name:'Pais Vasco',cities:['Bilbao','Vitoria','San Sebastian']},
  {name:'Castilla y Leon',cities:['Valladolid','Segovia','Leon','Salamanca']},
  {name:'Galicia',cities:['Vigo','A Coruna','Santiago de Compostela']},
  {name:'Asturias',cities:['Oviedo','Gijon']},
  {name:'Canarias',cities:['Las Palmas','Santa Cruz de Tenerife']},
  {name:'Cantabria',cities:['Santander']},
  {name:'Castilla-La Mancha',cities:['Toledo','Albacete']},
  {name:'Extremadura',cities:['Merida','Badajoz']},
  {name:'La Rioja',cities:['Logrono']},
  {name:'Navarra',cities:['Pamplona']},
  {name:'Ceuta',cities:['Ceuta']},
  {name:'Melilla',cities:['Melilla']}

];
  var streets = ['Calle Mayor','Avenida de la Constitucion','Calle de Alcala','Paseo de la Castellana','Calle del Sol','Gran Via','Calle de San Miguel','Avenida del Parque','Calle Lopez','Calle Real'];
  var companies = ['Iberia Tech SL','Castellana Comercio','Sol Logistics','Hispania Media','Cervantes Software','Mediterraneo Systems'];
  var jobs = util.occupationPool('es');
  var dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE'.split(''); // 官方 DNI/NIE 校验字母表 (mod 23)
  function dni() {
    // 约 15% 概率生成 NIE (外国人身份号码)，格式：X/Y/Z + 7位数字 + 校验字母
    // NIE 校验：首字母 X/Y/Z 映射为 0/1/2，与 7 位数字拼成 8 位整数后模 23
    if (util.chance(0.15)) {
      var prefix = util.pick(['X', 'Y', 'Z']);
      var n = util.randInt(1000000, 9999999);
      var body = prefix + util.pad(n, 7);
      var map = {'X':0,'Y':1,'Z':2};
      var numForCheck = map[prefix] * 10000000 + n; // X/Y/Z→0/1/2 在最高位
      return body + dniLetters[numForCheck % 23];
    }
    // 标准 DNI: 8位数字 + 校验字母
    var n = util.randInt(10000000, 99999999);
    return n + dniLetters[n % 23];
  }
  FakeID.registerCountry('spain', {
    label: '西班牙',
    locale: 'es',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('es'),
        phonePrefix: ['600','610','620','630','640','650','680','690'],
        phoneLen: 6,
        idLabel: 'dni',
        idFn: function () { return dni(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return u.randInt(1, 199) + ' ' + u.pick(streets) + ', ' + city;
        },
        zipFn: function (u) { return u.pad(u.randInt(10000, 99999), 5); },
        companies: companies, jobs: jobs, locale: 'es'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);