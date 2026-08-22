/* data/china.js — 中国（示例数据，仅用于本地生成演示）
 * 结构：国家(中国) -> 地区/省(regions) -> 城市(cities，含 6 位地区码用于身份证)。
 * 新增国家/地区：复制本文件，改 registerCountry 的第一个参数与数据即可。 */
(function (global) {
  'use strict';
  var FakeID = global.FakeID, util = FakeID.util;
  var surnames = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高','林','何','郭','马','罗','梁','宋','郑','谢','韩','唐','冯','于','董','萧','程','曹','袁','邓','许','傅','沈','曾','彭','吕','苏','卢','蒋','蔡','贾','丁','魏','薛','叶','阎','余','潘','杜','戴','夏','钟','汪','田','任','姜','范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康','毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','钱','汤','尹','黎','易','常','武','乔','贺','赖','龚','文','尚','辛','庞','樊','兰','殷','施','陶','翟','安','颜','倪','严','牛','温','芦','季','俞','章'];
  var givenMale = ['伟','强','磊','军','洋','勇','杰','涛','明','超','刚','平','辉','鹏','华','飞','鑫','波','斌','宇','浩','凯','睿','轩','昊','晨','旭','然','梓','铭'];
  var givenFemale = ['芳','娟','敏','静','丽','艳','梅','琳','雪','倩','婷','莹','璐','萌','琪','妍','悦','欣','彤','雅','涵','萱','怡','薇','晴','玥','诗','梓','欣','悦'];
  // 省/地区 -> 城市（city.code 为 6 位地区码，用于生成身份证）
  var regions = [
  { name:'北京市', abbr:'BJ', cities:[ {name:'东城区',code:'110101'}, {name:'西城区',code:'110102'}, {name:'朝阳区',code:'110105'}, {name:'海淀区',code:'110108'}, {name:'丰台区',code:'110106'}, {name:'通州区',code:'110112'} ] },
  { name:'天津市', abbr:'TJ', cities:[ {name:'和平区',code:'120101'}, {name:'河东区',code:'120102'}, {name:'河西区',code:'120103'}, {name:'南开区',code:'120104'}, {name:'滨海新区',code:'120116'} ] },
  { name:'河北省', abbr:'HE', cities:[
    {name:'石家庄市',code:'130102', districts:['长安区','桥西区','新华区','裕华区']},
    {name:'唐山市',code:'130203', districts:['路北区','路南区','丰润区','开平区']},
    {name:'保定市',code:'130604', districts:['竞秀区','莲池区','满城区','清苑区']},
    {name:'邯郸市',code:'130402', districts:['邯山区','丛台区','复兴区','峰峰矿区']},
    {name:'廊坊市',code:'131002', districts:['广阳区','安次区']},
    {name:'秦皇岛市',code:'130302', districts:['海港区','山海关区','北戴河区','抚宁区']} ] },
  { name:'山西省', abbr:'SX', cities:[
    {name:'太原市',code:'140105', districts:['小店区','迎泽区','杏花岭区','尖草坪区']},
    {name:'大同市',code:'140202', districts:['平城区','云冈区','新荣区','云州区']},
    {name:'临汾市',code:'141002', districts:['尧都区']},
    {name:'运城市',code:'140802', districts:['盐湖区']} ] },
  { name:'内蒙古自治区', abbr:'NM', cities:[
    {name:'呼和浩特市',code:'150102', districts:['新城区','回民区','玉泉区','赛罕区']},
    {name:'包头市',code:'150202', districts:['昆都仑区','青山区','东河区','九原区']},
    {name:'鄂尔多斯市',code:'150602', districts:['东胜区','康巴什区','伊金霍洛旗']},
    {name:'赤峰市',code:'150402', districts:['红山区','元宝山区','松山区']} ] },
  { name:'辽宁省', abbr:'LN', cities:[
    {name:'沈阳市',code:'210102', districts:['和平区','沈河区','大东区','皇姑区','铁西区']},
    {name:'大连市',code:'210202', districts:['中山区','西岗区','沙河口区','甘井子区']},
    {name:'鞍山市',code:'210302', districts:['铁东区','铁西区','立山区','千山区']},
    {name:'锦州市',code:'210702', districts:['古塔区','凌河区','太和区']} ] },
  { name:'吉林省', abbr:'JL', cities:[
    {name:'长春市',code:'220104', districts:['朝阳区','南关区','宽城区','二道区','绿园区']},
    {name:'吉林市',code:'220202', districts:['昌邑区','龙潭区','船营区','丰满区']},
    {name:'延吉市',code:'222401'},
    {name:'四平市',code:'220302', districts:['铁西区','铁东区','梨树县']} ] },
  { name:'黑龙江省', abbr:'HL', cities:[
    {name:'哈尔滨市',code:'230103', districts:['道里区','南岗区','道外区','香坊区','松北区']},
    {name:'大庆市',code:'230602', districts:['萨尔图区','龙凤区','让胡路区','红岗区']},
    {name:'齐齐哈尔市',code:'230202', districts:['龙沙区','建华区','铁锋区','昂昂溪区']},
    {name:'牡丹江市',code:'231002', districts:['东安区','阳明区','爱民区','西安区']} ] },
  { name:'上海市', abbr:'SH', cities:[ {name:'浦东新区',code:'310115'}, {name:'黄浦区',code:'310101'}, {name:'徐汇区',code:'310104'}, {name:'静安区',code:'310106'}, {name:'杨浦区',code:'310110'}, {name:'长宁区',code:'310105'} ] },
  { name:'江苏省', abbr:'JS', cities:[
    {name:'南京市',code:'320106', districts:['玄武区','秦淮区','鼓楼区','建邺区','江宁区']},
    {name:'苏州市',code:'320505', districts:['姑苏区','虎丘区','吴中区','相城区','吴江区']},
    {name:'无锡市',code:'320203', districts:['梁溪区','锡山区','惠山区','滨湖区','新吴区']},
    {name:'常州市',code:'320402', districts:['天宁区','钟楼区','新北区','武进区','金坛区']},
    {name:'徐州市',code:'320302', districts:['云龙区','鼓楼区','贾汪区','泉山区','铜山区']},
    {name:'南通市',code:'320602', districts:['崇川区','通州区','海门区']} ] },
  { name:'浙江省', abbr:'ZJ', cities:[
    {name:'杭州市',code:'330106', districts:['上城区','拱墅区','西湖区','滨江区','余杭区']},
    {name:'宁波市',code:'330203', districts:['海曙区','江北区','镇海区','北仑区','鄞州区']},
    {name:'温州市',code:'330302', districts:['鹿城区','龙湾区','瓯海区','洞头区']},
    {name:'绍兴市',code:'330602', districts:['越城区','柯桥区','上虞区']},
    {name:'嘉兴市',code:'330402', districts:['南湖区','秀洲区']},
    {name:'金华市',code:'330702', districts:['婺城区','金东区']} ] },
  { name:'安徽省', abbr:'AH', cities:[
    {name:'合肥市',code:'340103', districts:['瑶海区','庐阳区','蜀山区','包河区']},
    {name:'芜湖市',code:'340202', districts:['镜湖区','弋江区','鸠江区','湾沚区']},
    {name:'蚌埠市',code:'340302', districts:['龙子湖区','蚌山区','禹会区','淮上区']},
    {name:'马鞍山市',code:'340503', districts:['花山区','雨山区','博望区']} ] },
  { name:'福建省', abbr:'FJ', cities:[
    {name:'厦门市',code:'350203', districts:['思明区','海沧区','湖里区','集美区','同安区']},
    {name:'福州市',code:'350102', districts:['鼓楼区','台江区','仓山区','晋安区','马尾区']},
    {name:'泉州市',code:'350502', districts:['鲤城区','丰泽区','洛江区','泉港区']},
    {name:'漳州市',code:'350602', districts:['芗城区','龙文区','龙海区']},
    {name:'莆田市',code:'350302', districts:['城厢区','涵江区','荔城区','秀屿区']} ] },
  { name:'江西省', abbr:'JX', cities:[
    {name:'南昌市',code:'360102', districts:['东湖区','西湖区','青云谱区','青山湖区','新建区']},
    {name:'赣州市',code:'360702', districts:['章贡区','南康区','赣县区']},
    {name:'九江市',code:'360402', districts:['浔阳区','濂溪区','柴桑区']},
    {name:'景德镇市',code:'360202', districts:['昌江区','珠山区']} ] },
  { name:'山东省', abbr:'SD', cities:[
    {name:'济南市',code:'370102', districts:['历下区','市中区','槐荫区','天桥区','历城区']},
    {name:'青岛市',code:'370202', districts:['市南区','市北区','黄岛区','崂山区','城阳区']},
    {name:'烟台市',code:'370602', districts:['芝罘区','福山区','牟平区','莱山区','蓬莱区']},
    {name:'潍坊市',code:'370702', districts:['潍城区','寒亭区','坊子区','奎文区']},
    {name:'临沂市',code:'371302', districts:['兰山区','罗庄区','河东区']},
    {name:'济宁市',code:'370802', districts:['任城区','兖州区','曲阜市']} ] },
  { name:'河南省', abbr:'HA', cities:[
    {name:'郑州市',code:'410105', districts:['中原区','二七区','金水区','管城回族区','惠济区']},
    {name:'洛阳市',code:'410303', districts:['老城区','西工区','涧西区','洛龙区','偃师区']},
    {name:'开封市',code:'410202', districts:['龙亭区','顺河回族区','鼓楼区','禹王台区','祥符区']},
    {name:'南阳市',code:'411302', districts:['宛城区','卧龙区']},
    {name:'新乡市',code:'410702', districts:['红旗区','卫滨区','凤泉区','牧野区']} ] },
  { name:'湖北省', abbr:'HB', cities:[
    {name:'武汉市',code:'420106', districts:['江岸区','江汉区','硚口区','汉阳区','武昌区','洪山区']},
    {name:'宜昌市',code:'420502', districts:['西陵区','伍家岗区','点军区','猇亭区','夷陵区']},
    {name:'襄阳市',code:'420602', districts:['襄城区','樊城区','襄州区']},
    {name:'荆州市',code:'421002', districts:['沙市区','荆州区']},
    {name:'黄冈市',code:'421102', districts:['黄州区']} ] },
  { name:'湖南省', abbr:'HN', cities:[
    {name:'长沙市',code:'430104', districts:['芙蓉区','天心区','岳麓区','开福区','雨花区','望城区']},
    {name:'株洲市',code:'430202', districts:['荷塘区','芦淞区','石峰区','天元区','渌口区']},
    {name:'衡阳市',code:'430404', districts:['珠晖区','雁峰区','石鼓区','蒸湘区','南岳区']},
    {name:'岳阳市',code:'430602', districts:['岳阳楼区','云溪区','君山区']},
    {name:'常德市',code:'430702', districts:['武陵区','鼎城区']} ] },
  { name:'广东省', abbr:'GD', cities:[
    {name:'广州市',code:'440106', districts:['越秀区','海珠区','荔湾区','天河区','白云区','番禺区']},
    {name:'深圳市',code:'440305', districts:['福田区','罗湖区','南山区','宝安区','龙岗区','龙华区']},
    {name:'东莞市',code:'441901', districts:['莞城街道','南城街道','东城街道','万江街道']},
    {name:'佛山市',code:'440604', districts:['禅城区','南海区','顺德区','三水区','高明区']},
    {name:'珠海市',code:'440402', districts:['香洲区','斗门区','金湾区']},
    {name:'中山市',code:'442001', districts:['石岐街道','东区街道','西区街道','南区街道']},
    {name:'汕头市',code:'440507', districts:['金平区','龙湖区','濠江区','潮阳区','潮南区']},
    {name:'惠州市',code:'441302', districts:['惠城区','惠阳区','博罗县']} ] },
  { name:'广西壮族自治区', abbr:'GX', cities:[
    {name:'南宁市',code:'450103', districts:['青秀区','兴宁区','西乡塘区','江南区','良庆区','邕宁区']},
    {name:'柳州市',code:'450202', districts:['城中区','鱼峰区','柳南区','柳北区','柳江区']},
    {name:'桂林市',code:'450302', districts:['秀峰区','叠彩区','象山区','七星区','雁山区']},
    {name:'北海市',code:'450502', districts:['海城区','银海区','铁山港区']} ] },
  { name:'海南省', abbr:'HI', cities:[
    {name:'海口市',code:'460106', districts:['秀英区','龙华区','琼山区','美兰区']},
    {name:'三亚市',code:'460201', districts:['海棠区','吉阳区','天涯区','崖州区']},
    {name:'儋州市',code:'460401', districts:['那大镇','白马井镇','中和镇']} ] },
  { name:'重庆市', abbr:'CQ', cities:[ {name:'渝中区',code:'500103'}, {name:'江北区',code:'500105'}, {name:'沙坪坝区',code:'500106'}, {name:'南岸区',code:'500108'}, {name:'九龙坡区',code:'500107'} ] },
  { name:'四川省', abbr:'SC', cities:[
    {name:'成都市',code:'510107', districts:['锦江区','青羊区','金牛区','武侯区','成华区','龙泉驿区']},
    {name:'绵阳市',code:'510703', districts:['涪城区','游仙区','安州区']},
    {name:'德阳市',code:'510603', districts:['旌阳区','罗江区','广汉市']},
    {name:'宜宾市',code:'511502', districts:['翠屏区','南溪区','叙州区']},
    {name:'南充市',code:'511302', districts:['顺庆区','高坪区','嘉陵区']} ] },
  { name:'贵州省', abbr:'GZ', cities:[
    {name:'贵阳市',code:'520102', districts:['南明区','云岩区','花溪区','乌当区','白云区','观山湖区']},
    {name:'遵义市',code:'520302', districts:['红花岗区','汇川区','播州区','桐梓县']},
    {name:'六盘水市',code:'520201', districts:['钟山区','六枝特区','水城区']},
    {name:'安顺市',code:'520402', districts:['西秀区','平坝区','普定县']} ] },
  { name:'云南省', abbr:'YN', cities:[
    {name:'昆明市',code:'530102', districts:['五华区','盘龙区','官渡区','西山区','呈贡区']},
    {name:'大理市',code:'532901'},
    {name:'曲靖市',code:'530302', districts:['麒麟区','沾益区','马龙区']},
    {name:'丽江市',code:'530702', districts:['古城区','玉龙纳西族自治县']} ] },
  { name:'西藏自治区', abbr:'XZ', cities:[
    {name:'拉萨市',code:'540102', districts:['城关区','堆龙德庆区','达孜区']},
    {name:'日喀则市',code:'540202', districts:['桑珠孜区','南木林县']},
    {name:'林芝市',code:'540402', districts:['巴宜区','米林市']} ] },
  { name:'陕西省', abbr:'SN', cities:[
    {name:'西安市',code:'610113', districts:['新城区','碑林区','莲湖区','雁塔区','未央区','灞桥区']},
    {name:'咸阳市',code:'610402', districts:['秦都区','杨陵区','渭城区','兴平市']},
    {name:'宝鸡市',code:'610302', districts:['渭滨区','金台区','陈仓区','凤翔区']},
    {name:'渭南市',code:'610502', districts:['临渭区','华州区','韩城市']} ] },
  { name:'甘肃省', abbr:'GS', cities:[
    {name:'兰州市',code:'620102', districts:['城关区','七里河区','西固区','安宁区','红古区']},
    {name:'天水市',code:'620502', districts:['秦州区','麦积区']},
    {name:'酒泉市',code:'620902', districts:['肃州区','玉门市','敦煌市']} ] },
  { name:'青海省', abbr:'QH', cities:[
    {name:'西宁市',code:'630104', districts:['城东区','城中区','城西区','城北区','湟中区']},
    {name:'格尔木市',code:'632801'},
    {name:'德令哈市',code:'632802'} ] },
  { name:'宁夏回族自治区', abbr:'NX', cities:[
    {name:'银川市',code:'640104', districts:['兴庆区','西夏区','金凤区','永宁县']},
    {name:'石嘴山市',code:'640202', districts:['大武口区','惠农区','平罗县']},
    {name:'吴忠市',code:'640302', districts:['利通区','红寺堡区','青铜峡市']} ] },
  { name:'新疆维吾尔自治区', abbr:'XJ', cities:[
    {name:'乌鲁木齐市',code:'650103', districts:['天山区','沙依巴克区','新市区','水磨沟区','头屯河区']},
    {name:'克拉玛依市',code:'650202', districts:['克拉玛依区','独山子区','白碱滩区','乌尔禾区']},
    {name:'喀什市',code:'653101'},
    {name:'伊宁市',code:'654002'} ] },
  { name:'台湾省', abbr:'TW', cities:[ {name:'台北市',code:'710101'}, {name:'高雄市',code:'710301'}, {name:'台中市',code:'710201'}, {name:'台南市',code:'710201'} ] },
  { name:'香港特别行政区', abbr:'HK', cities:[ {name:'香港', code:'810000'} ] },
  { name:'澳门特别行政区', abbr:'MO', cities:[ {name:'澳门', code:'820000'} ] }

];;
  var streets = ['人民路','解放路','建设路','中山路','和平路','文化路','迎宾大道','长江路','黄河路','北京路','南京路','世纪大道','高新路','创业路','书香路','滨江路','湖滨路','学院路','工业路','幸福路','振兴路','开元路'];
  var companies = ['星辰科技有限公司','云图网络技术有限公司','华瑞贸易有限公司','博远电子商务有限公司','智联信息技术有限公司','万象文化传媒有限公司','恒通物流有限公司','优创软件开发有限公司','盛源服饰有限公司','金桥医疗器械有限公司','远景智能科技有限公司','同辉数据服务有限公司'];
  var jobs = util.occupationPool('zh');
  var phonePrefixes = ['138','139','136','137','150','151','152','158','159','182','183','186','187','188','199','177','133','135','189','176'];
  var mailDomains = util.emailPool('zh');

  function resolveRegionCity(opts) {
    opts = opts || {};
    var region = null, city = null, district = null;
    if (opts.region) {
      for (var i = 0; i < regions.length; i++) if (regions[i].name === opts.region) { region = regions[i]; break; }
    }
    if (!region) region = util.pick(regions);
    if (opts.city) {
      for (var j = 0; j < region.cities.length; j++) if (region.cities[j].name === opts.city) { city = region.cities[j]; break; }
    }
    if (!city) city = util.pick(region.cities);
    // 区/县：若城市含 districts（地级市下的区/县），优先使用所选区，否则随机取一个
    if (city && city.districts && city.districts.length) {
      if (opts.district) {
        for (var k = 0; k < city.districts.length; k++) if (city.districts[k] === opts.district) { district = city.districts[k]; break; }
      }
      if (!district) district = util.pick(city.districts);
    }
    return { region: region, city: city, district: district };
  }

  FakeID.registerCountry('china', {
    label: '中国',
    locale: 'zh',
    regions: regions,
    make: function (opts) {
      opts = opts || {};
      var gender = opts.gender === 'random' ? (util.chance(0.5) ? 'male' : 'female') : opts.gender;
      var given = gender === 'male' ? givenMale : givenFemale;
      var givenCount = util.chance(0.6) ? 2 : 1;
      var surname = util.pick(surnames);
      var givenName = '';
      for (var gi = 0; gi < givenCount; gi++) givenName += util.pick(given);
      var name = surname + givenName;
      var bdate = util.birthDate(opts);
      var rc = resolveRegionCity(opts);
      var id = util.makeChinaID(rc.city.code, bdate);
      var phone = util.pick(phonePrefixes) + util.pad(util.randInt(0, 99999999), 8);
      // 使用拼音生成用户名，保持姓名关联性
      var uname = (util.toPinyin(surname) + util.toPinyin(givenName)).toLowerCase().replace(/[^a-z]/g, '') + util.randInt(10, 999);
      var email = uname + '@' + util.emailDomain(opts, mailDomains);
      // 使用解析得到的区/县（选中或随机）；直辖市/县级市等无 districts 时 district 为空，city 本身即区级
      var district = rc.district ? rc.district : '';
      var address = rc.region.name + rc.city.name + district + util.pick(streets) + util.randInt(1, 999) + '号';
      var metrics = util.bodyMetrics(gender, util.ageFrom(bdate));
      var company = util.companyForAge(util.ageFrom(bdate), { companies: companies });
      // 字段以“键”形式存储，渲染时按当前 UI 语言本地化
      var fields = [
        ['fullName', name],
        ['gender', gender],
        ['birthDate', util.formatDate(bdate)],
        ['age', util.ageFrom(bdate)],
        ['height', metrics[0] + ' cm'],
        ['weight', metrics[1] + ' kg'],
        ['idCard', id],
        ['phone', phone],
        ['email', email],
        ['username', uname],
        ['password', util.password(10)],
        ['address', address]
      ];
      if (company) fields.push(['company', company]);
      fields.push(['occupation', util.occupationForAge(util.ageFrom(bdate), { jobs: jobs })]);
      var profileCtx = { countryCode: opts.countryCode || 'china', handle: uname, age: util.ageFrom(bdate) };
      return fields.concat(util.creditCardForAge(util.ageFrom(bdate), opts), util.profileFields(opts, profileCtx));
    }
  });
})(window);