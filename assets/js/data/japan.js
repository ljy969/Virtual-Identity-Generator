(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato','Yoshida','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Kimura','Hayashi','Saito','Mori'];
  var givenMale = ['Haruto','Yuto','Sota','Yuki','Sora','Ren','Aoi','Hiroto','Shota','Kaito','Riku','Toma','Koharu','Daichi','Yusei'];
  var givenFemale = ['Yui','Aoi','Hana','Sakura','Mio','Rin','Yuna','Akari','Mei','Risa','Nanami','Honoka','Saki','Emi','Koharu'];
  var regions = [
  {name:'Tokyo',cities:['新宿区','渋谷区','千代田区','港区','足立区','江戸川区']},
  {name:'Osaka',cities:['大阪市','堺市','豊中市','吹田市']},
  {name:'Kyoto',cities:['京都市','宇治市','亀岡市']},
  {name:'Hokkaido',cities:['札幌市','函館市','旭川市','帯広市']},
  {name:'Kanagawa',cities:['横浜市','川崎市','相模原市','藤沢市']},
  {name:'Aichi',cities:['名古屋市','豊田市','一宮市','岡崎市']},
  {name:'Fukuoka',cities:['福岡市','北九州市','久留米市']},
  {name:'Hyogo',cities:['神戸市','姫路市','西宮市']},
  {name:'Shizuoka',cities:['静岡市','浜松市','沼津市']},
  {name:'Chiba',cities:['千葉市','船橋市','柏市']},
  {name:'Saitama',cities:['さいたま市','川口市','所沢市']},
  {name:'Hiroshima',cities:['広島市','福山市','呉市']},
  {name:'Okinawa',cities:['那覇市','沖縄市','浦添市']},
  {name:'Nara',cities:['奈良市','橿原市','生駒市']},
  {name:'Kumamoto',cities:['熊本市','八代市','玉名市']},
  {name:'Aomori',cities:['Aomori']},
  {name:'Iwate',cities:['Morioka']},
  {name:'Miyagi',cities:['Sendai']},
  {name:'Akita',cities:['Akita']},
  {name:'Yamagata',cities:['Yamagata']},
  {name:'Fukushima',cities:['Fukushima']},
  {name:'Ibaraki',cities:['Mito']},
  {name:'Tochigi',cities:['Utsunomiya']},
  {name:'Gunma',cities:['Maebashi']},
  {name:'Niigata',cities:['Niigata']},
  {name:'Toyama',cities:['Toyama']},
  {name:'Ishikawa',cities:['Kanazawa']},
  {name:'Fukui',cities:['Fukui']},
  {name:'Yamanashi',cities:['Kofu']},
  {name:'Nagano',cities:['Nagano']},
  {name:'Gifu',cities:['Gifu']},
  {name:'Mie',cities:['Tsu']},
  {name:'Shiga',cities:['Otsu']},
  {name:'Wakayama',cities:['Wakayama']},
  {name:'Tottori',cities:['Tottori']},
  {name:'Shimane',cities:['Matsue']},
  {name:'Okayama',cities:['Okayama']},
  {name:'Yamaguchi',cities:['Yamaguchi']},
  {name:'Tokushima',cities:['Tokushima']},
  {name:'Kagawa',cities:['Takamatsu']},
  {name:'Ehime',cities:['Matsuyama']},
  {name:'Kochi',cities:['Kochi']},
  {name:'Saga',cities:['Saga']},
  {name:'Nagasaki',cities:['Nagasaki']},
  {name:'Oita',cities:['Oita']},
  {name:'Miyazaki',cities:['Miyazaki']},
  {name:'Kagoshima',cities:['Kagoshima']}

];;
  var companies = ['Sakura Corp','Tokyo Tech KK','Nihon Systems','Yamato Logistics','Mizuho Digital','Asahi Media','Kobe Trading','Sora Networks'];
  var jobs = util.occupationPool('ja');
  function myNumber() {
    // 日本个人番号 (My Number) 12位，第12位为校验位
    // 校验算法：从右往左第2位开始，权重 2,3,4,5,6,7,2,3,4,5,6
    // 校验位 = (11 - (加权和 % 11)) % 10
    var body = util.pad(util.randInt(0, 99999999999), 11); // 前11位
    var weights = [6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2]; // 从左往右对应 body[0]..body[10]
    var sum = 0;
    for (var i = 0; i < 11; i++) {
      sum += parseInt(body.charAt(i), 10) * weights[i];
    }
    var check = (11 - (sum % 11)) % 10;
    return body + check;
  }
  FakeID.registerCountry('japan', {
    label: '日本',
    locale: 'ja',
    regions: regions,
    make: function (opts) {
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('ja'),
        phonePrefix: ['090','080','070','050'],
        phoneLen: 8,
        idLabel: 'myNumber',
        idFn: function () { return myNumber(); },
        addressFn: function (u, ctx) {
          var city = ctx.city ? (typeof ctx.city === 'string' ? ctx.city : ctx.city.name) : '';
          return ctx.region.name + city + u.randInt(1, 99) + '-' + u.randInt(1, 99);
        },
        zipFn: function (u) { return u.pad(u.randInt(0, 9999999), 7).slice(0,3) + '-' + u.pad(u.randInt(0, 9999), 4); },
        companies: companies, jobs: jobs, locale: 'ja'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);