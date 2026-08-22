/* data/us.js — 美国（含州/地区 -> 城市） */
(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'];
  var givenMale = ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles','Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua','Kenneth','Kevin','Brian','George','Timothy','Ronald','Jason','Edward','Jeffrey','Ryan'];
  var givenFemale = ['Mary','Patricia','Jennifer','Linda','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen','Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Kimberly','Emily','Donna','Michelle','Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Laura','Sharon','Cynthia','Kathleen'];
  var streets = ['Main St','Oak Ave','Pine St','Maple Ave','Cedar St','Elm St','Washington Ave','Lake Rd','Hill St','Park Ave','Sunset Blvd','River Rd','Church St','High St','Spring St','Jackson St','Madison Ave','Jefferson St','Adams St','Franklin St'];
  var companies = ['Acme Corporation','Globex LLC','Initech','Umbrella Inc','Stark Industries','Wayne Enterprises','Soylent Corp','Hooli','Vandelay Industries','Pied Piper','Massive Dynamic','Cyberdyne Systems'];
  var jobs = util.occupationPool('en');
  // 州/地区 -> 城市
  var regions = [
  {name:'Alabama',abbr:'AL',zip:'35',cities:['Birmingham','Montgomery','Mobile','Huntsville','Tuscaloosa']},
  {name:'Alaska',abbr:'AK',zip:'99',cities:['Anchorage','Fairbanks','Juneau']},
  {name:'Arizona',abbr:'AZ',zip:'85',cities:['Phoenix','Tucson','Mesa','Chandler','Scottsdale']},
  {name:'Arkansas',abbr:'AR',zip:'72',cities:['Little Rock','Fort Smith','Fayetteville','Springdale']},
  {name:'California',abbr:'CA',zip:'90',cities:['Los Angeles','San Francisco','San Diego','Sacramento','San Jose','Oakland','Fresno']},
  {name:'Colorado',abbr:'CO',zip:'80',cities:['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood']},
  {name:'Connecticut',abbr:'CT',zip:'06',cities:['Hartford','New Haven','Stamford','Bridgeport','Waterbury']},
  {name:'Delaware',abbr:'DE',zip:'19',cities:['Wilmington','Dover','Newark']},
  {name:'Florida',abbr:'FL',zip:'33',cities:['Miami','Orlando','Tampa','Jacksonville','St. Petersburg','Fort Lauderdale']},
  {name:'Georgia',abbr:'GA',zip:'30',cities:['Atlanta','Savannah','Augusta','Columbus','Macon']},
  {name:'Hawaii',abbr:'HI',zip:'96',cities:['Honolulu','Hilo','Kailua']},
  {name:'Idaho',abbr:'ID',zip:'83',cities:['Boise','Nampa','Idaho Falls','Pocatello']},
  {name:'Illinois',abbr:'IL',zip:'60',cities:['Chicago','Springfield','Naperville','Peoria','Aurora']},
  {name:'Indiana',abbr:'IN',zip:'46',cities:['Indianapolis','Fort Wayne','Evansville','South Bend']},
  {name:'Iowa',abbr:'IA',zip:'50',cities:['Des Moines','Cedar Rapids','Davenport','Sioux City']},
  {name:'Kansas',abbr:'KS',zip:'66',cities:['Wichita','Topeka','Overland Park','Olathe']},
  {name:'Kentucky',abbr:'KY',zip:'40',cities:['Louisville','Lexington','Bowling Green','Owensboro']},
  {name:'Louisiana',abbr:'LA',zip:'70',cities:['New Orleans','Baton Rouge','Shreveport','Lafayette']},
  {name:'Maine',abbr:'ME',zip:'04',cities:['Portland','Bangor','Augusta']},
  {name:'Maryland',abbr:'MD',zip:'20',cities:['Baltimore','Annapolis','Frederick','Rockville']},
  {name:'Massachusetts',abbr:'MA',zip:'02',cities:['Boston','Cambridge','Worcester','Springfield','Lowell']},
  {name:'Michigan',abbr:'MI',zip:'48',cities:['Detroit','Grand Rapids','Ann Arbor','Lansing','Flint']},
  {name:'Minnesota',abbr:'MN',zip:'55',cities:['Minneapolis','Saint Paul','Rochester','Duluth']},
  {name:'Mississippi',abbr:'MS',zip:'39',cities:['Jackson','Gulfport','Biloxi']},
  {name:'Missouri',abbr:'MO',zip:'63',cities:['Saint Louis','Kansas City','Springfield','Columbia']},
  {name:'Montana',abbr:'MT',zip:'59',cities:['Billings','Missoula','Great Falls']},
  {name:'Nebraska',abbr:'NE',zip:'68',cities:['Omaha','Lincoln','Bellevue']},
  {name:'Nevada',abbr:'NV',zip:'89',cities:['Las Vegas','Reno','Henderson']},
  {name:'New Hampshire',abbr:'NH',zip:'03',cities:['Manchester','Nashua','Concord']},
  {name:'New Jersey',abbr:'NJ',zip:'07',cities:['Newark','Jersey City','Trenton','Atlantic City']},
  {name:'New Mexico',abbr:'NM',zip:'87',cities:['Albuquerque','Santa Fe','Las Cruces']},
  {name:'New York',abbr:'NY',zip:'10',cities:['New York City','Buffalo','Albany','Rochester','Syracuse']},
  {name:'North Carolina',abbr:'NC',zip:'27',cities:['Charlotte','Raleigh','Durham','Greensboro','Winston-Salem']},
  {name:'North Dakota',abbr:'ND',zip:'58',cities:['Fargo','Bismarck','Grand Forks']},
  {name:'Ohio',abbr:'OH',zip:'44',cities:['Columbus','Cleveland','Cincinnati','Toledo','Dayton']},
  {name:'Oklahoma',abbr:'OK',zip:'73',cities:['Oklahoma City','Tulsa','Norman']},
  {name:'Oregon',abbr:'OR',zip:'97',cities:['Portland','Eugene','Salem','Gresham']},
  {name:'Pennsylvania',abbr:'PA',zip:'19',cities:['Philadelphia','Pittsburgh','Allentown','Erie']},
  {name:'Rhode Island',abbr:'RI',zip:'02',cities:['Providence','Warwick','Cranston']},
  {name:'South Carolina',abbr:'SC',zip:'29',cities:['Charleston','Columbia','Greenville','Spartanburg']},
  {name:'South Dakota',abbr:'SD',zip:'57',cities:['Sioux Falls','Rapid City','Aberdeen']},
  {name:'Tennessee',abbr:'TN',zip:'37',cities:['Nashville','Memphis','Knoxville','Chattanooga']},
  {name:'Texas',abbr:'TX',zip:'75',cities:['Houston','Dallas','Austin','San Antonio','Fort Worth','El Paso']},
  {name:'Utah',abbr:'UT',zip:'84',cities:['Salt Lake City','Provo','Ogden','West Valley City']},
  {name:'Vermont',abbr:'VT',zip:'05',cities:['Burlington','Montpelier','Rutland']},
  {name:'Virginia',abbr:'VA',zip:'23',cities:['Virginia Beach','Richmond','Norfolk','Arlington']},
  {name:'Washington',abbr:'WA',zip:'98',cities:['Seattle','Spokane','Tacoma','Vancouver']},
  {name:'West Virginia',abbr:'WV',zip:'26',cities:['Charleston','Huntington','Morgantown']},
  {name:'Wisconsin',abbr:'WI',zip:'53',cities:['Milwaukee','Madison','Green Bay','Kenosha']},
  {name:'Wyoming',abbr:'WY',zip:'82',cities:['Cheyenne','Casper','Laramie']},
  {name:'District of Columbia',abbr:'DC',zip:'20',cities:['Washington']}
];;
  function ssn() {
    // SSN 区号：排除 000, 666, 900-999
    // 使用拒绝采样保证均匀分布
    var a;
    do {
      a = util.randInt(1, 999);
    } while (a === 666 || a >= 900);
    return util.pad(a, 3) + '-' + util.pad(util.randInt(1, 99), 2) + '-' + util.pad(util.randInt(1, 9999), 4);
  }
  FakeID.registerCountry('us', {
    label: '美国',
    locale: 'en',
    regions: regions,
    make: function (opts) {
      opts = opts || {};
      var cfg = {
        regions: regions,
        surnames: surnames, givenMale: givenMale, givenFemale: givenFemale,
        domains: util.emailPool('en'),
        phonePrefix: ['212','310','415','512','617','702','713','818','904','305','404','503','619','713','212'],
        phoneLen: 7,
        idLabel: 'ssn',
        idFn: function () { return ssn(); },
        addressFn: function (u, ctx) {
          var st = ctx.region, city = ctx.city ? (ctx.city.name || ctx.city) : '';
          var zip = st.zip + util.pad(util.randInt(0, 9999), 4);
          return u.randInt(10, 9999) + ' ' + u.pick(streets) + ', ' + city + ', ' + st.abbr + ' ' + zip;
        },
        companies: companies, jobs: jobs, locale: 'en'
      };
      return util.buildWestern(cfg, opts);
    }
  });
})(window);