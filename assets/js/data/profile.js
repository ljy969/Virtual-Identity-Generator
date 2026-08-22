/* data/profile.js — 虚拟身份扩展档案池（学校/学历/收入/技能/外貌/安全等）
 * 这些字段与“国家/地区”无关，对所有国家通用，故单独抽成一份双语数据文件。
 * 生成时按当前 UI 语言（zh / en）取对应语言池，新增条目直接在对应语言数组追加即可。
 * 依赖：util.js（需在其后加载，本文件仅登记数据，不调用生成逻辑）。
 *
 * 说明：schools / kindergartens / primarySchools / middleSchools / highSchools
 * 均为 [学校名, 学校所在国家] 的二元组，保证“学校”与“学校所在国家”一一对应。 */
(function (global) {
  'use strict';
  var FakeID = global.FakeID;

  // 扩展档案双语池：zh / en。键与生成器 util.profileFields 约定的字段一一对应。
  var PROFILE = {
    zh: {
      // 学校 / 学历类（学校名与教育阶段所在国家成对，保证对应）
      // 大学（劳动年龄及大学生阶段的“母校/在读院校”）
      schools: [
        ['北京大学','中国','北京大学'],['清华大学','中国','清华大学'],['复旦大学','中国','复旦大学'],['上海交通大学','中国','上海交通大学'],
        ['浙江大学','中国','浙江大学'],['南京大学','中国','南京大学'],['武汉大学','中国','武汉大学'],['中山大学','中国','中山大学'],
        ['四川大学','中国','四川大学'],['华中科技大学','中国','华中科技大学'],['西安交通大学','中国','西安交通大学'],['同济大学','中国','同济大学'],
        ['北京师范大学','中国','北京师范大学'],['中国人民大学','中国','中国人民大学'],['哈尔滨工业大学','中国','哈尔滨工业大学'],
        ['中国传媒大学','中国','中国传媒大学'],['上海财经大学','中国','上海财经大学'],['北京外国语大学','中国','北京外国语大学'],
        ['东京大学','日本','東京大学'],['京都大学','日本','京都大学'],['大阪大学','日本','大阪大学'],['东北大学','日本','東北大学'],
        ['名古屋大学','日本','名古屋大学'],['北海道大学','日本','北海道大学'],['九州大学','日本','九州大学'],['筑波大学','日本','筑波大学'],
        ['神户大学','日本','神戸大学'],['早稻田大学','日本','早稲田大学'],['庆应义塾大学','日本','慶應義塾大学'],['上智大学','日本','上智大学'],
        ['牛津大学','英国','University of Oxford'],['剑桥大学','英国','University of Cambridge'],['帝国理工学院','英国','Imperial College London'],['伦敦大学学院','英国','University College London'],
        ['慕尼黑工业大学','德国','Technische Universität München'],['海德堡大学','德国','Ruprecht-Karls-Universität Heidelberg'],['巴黎综合理工学院','法国','École Polytechnique'],['索邦大学','法国','Sorbonne Université'],
        ['博洛尼亚大学','意大利','Università di Bologna'],['马德里康普顿斯大学','西班牙','Universidad Complutense de Madrid'],['多伦多大学','加拿大','University of Toronto'],
        ['哈佛大学','美国','Harvard University'],['斯坦福大学','美国','Stanford University'],['麻省理工学院','美国','Massachusetts Institute of Technology'],['耶鲁大学','美国','Yale University'],
        ['普林斯顿大学','美国','Princeton University'],['哥伦比亚大学','美国','Columbia University'],['芝加哥大学','美国','University of Chicago'],['加州理工学院','美国','California Institute of Technology'],
        ['宾夕法尼亚大学','美国','University of Pennsylvania'],['杜克大学','美国','Duke University'],['西北大学','美国','Northwestern University'],['约翰斯·霍普金斯大学','美国','Johns Hopkins University'],
        ['加州大学伯克利分校','美国','University of California, Berkeley'],['加州大学洛杉矶分校','美国','University of California, Los Angeles'],['康奈尔大学','美国','Cornell University'],['布朗大学','美国','Brown University'],
        ['纽约大学','美国','New York University'],['卡内基梅隆大学','美国','Carnegie Mellon University'],['南加州大学','美国','University of Southern California'],['弗吉尼亚大学','美国','University of Virginia'],
        ['德克萨斯大学奥斯汀分校','美国','University of Texas at Austin'],['密歇根大学安娜堡分校','美国','University of Michigan, Ann Arbor'],['北卡罗来纳大学教堂山分校','美国','University of North Carolina at Chapel Hill'],['佐治亚理工学院','美国','Georgia Institute of Technology'],
        ['威斯康星大学麦迪逊分校','美国','University of Wisconsin-Madison'],['伊利诺伊大学香槟分校','美国','University of Illinois at Urbana-Champaign'],['华盛顿大学','美国','University of Washington'],['波士顿大学','美国','Boston University']
      ],
      // 幼儿园（学龄前）
      kindergartens: [
        ['阳光幼儿园','中国','阳光幼儿园'],['蓝天幼儿园','中国','蓝天幼儿园'],['红黄蓝幼儿园','中国','红黄蓝幼儿园'],
        ['快乐宝贝幼儿园','中国','快乐宝贝幼儿园'],['金色摇篮幼儿园','中国','金色摇篮幼儿园'],['小星星幼儿园','中国','小星星幼儿园'],
        ['Sunshine Kindergarten','美国','Sunshine Kindergarten'],['Blue Sky Kindergarten','美国','Blue Sky Kindergarten'],['Happy Kids Kindergarten','美国','Happy Kids Kindergarten'],
        ['Little Angels Kindergarten','美国','Little Angels Kindergarten'],['Bright Star Kindergarten','美国','Bright Star Kindergarten'],['Rainbow Kindergarten','美国','Rainbow Kindergarten'],
        ['陽光幼稚園','日本','陽光幼稚園'],['さくら幼稚園','日本','さくら幼稚園'],['虹の幼稚園','日本','虹の幼稚園'],
        ['ハッピー幼稚園','日本','ハッピー幼稚園'],['星の幼稚園','日本','星の幼稚園'],['緑の幼稚園','日本','緑の幼稚園'],
        ['Sunshine Kindergarten','英国','Sunshine Kindergarten'],['Blue Sky Kindergarten','英国','Blue Sky Kindergarten'],['Happy Kindergarten','英国','Happy Kindergarten'],
        ['Little Star Kindergarten','英国','Little Star Kindergarten'],['Rainbow Kindergarten','英国','Rainbow Kindergarten'],['Greenfield Kindergarten','英国','Greenfield Kindergarten'],
        ['Sonnenschein Kindergarten','德国','Sonnenschein Kindergarten'],['Blauer Himmel Kindergarten','德国','Blauer Himmel Kindergarten'],['Fröhlicher Kindergarten','德国','Fröhlicher Kindergarten'],
        ['Sternchen Kindergarten','德国','Sternchen Kindergarten'],['Regenbogen Kindergarten','德国','Regenbogen Kindergarten'],['Grünfeld Kindergarten','德国','Grünfeld Kindergarten'],
        ['École Maternelle Soleil','法国','École Maternelle Soleil'],['École Maternelle Ciel Bleu','法国','École Maternelle Ciel Bleu'],['École Maternelle Joyeuse','法国','École Maternelle Joyeuse'],
        ['École Maternelle Petite Étoile','法国','École Maternelle Petite Étoile'],['École Maternelle Arc-en-ciel','法国','École Maternelle Arc-en-ciel'],['École Maternelle Vert Pré','法国','École Maternelle Vert Pré'],
        ['Scuola Materna Sole','意大利','Scuola Materna Sole'],['Scuola Materna Cielo Blu','意大利','Scuola Materna Cielo Blu'],['Scuola Materna Felice','意大利','Scuola Materna Felice'],
        ['Scuola Materna Stellina','意大利','Scuola Materna Stellina'],['Scuola Materna Arcobaleno','意大利','Scuola Materna Arcobaleno'],['Scuola Materna Prato Verde','意大利','Scuola Materna Prato Verde'],
        ['Guardería Sol','西班牙','Guardería Sol'],['Guardería Cielo Azul','西班牙','Guardería Cielo Azul'],['Guardería Feliz','西班牙','Guardería Feliz'],
        ['Guardería Estrellita','西班牙','Guardería Estrellita'],['Guardería Arcoíris','西班牙','Guardería Arcoíris'],['Guardería Prado Verde','西班牙','Guardería Prado Verde'],
        ['Sunshine Kindergarten','加拿大','Sunshine Kindergarten'],['Blue Sky Kindergarten','加拿大','Blue Sky Kindergarten'],['Happy Kindergarten','加拿大','Happy Kindergarten'],
        ['Little Star Kindergarten','加拿大','Little Star Kindergarten'],['Rainbow Kindergarten','加拿大','Rainbow Kindergarten'],['Greenfield Kindergarten','加拿大','Greenfield Kindergarten']
      ],
      // 小学
      primarySchools: [
        ['实验小学','中国','实验小学'],['第一小学','中国','第一小学'],['育才小学','中国','育才小学'],['阳光小学','中国','阳光小学'],
        ['和平小学','中国','和平小学'],['师范附属小学','中国','师范附属小学'],['双语实验小学','中国','双语实验小学'],
        ['Central Primary School','美国','Central Primary School'],['Lincoln Elementary','美国','Lincoln Elementary'],['Maple Primary','美国','Maple Primary'],
        ['Riverside Primary','美国','Riverside Primary'],['Oak Elementary','美国','Oak Elementary'],['Greenwood Primary','美国','Greenwood Primary'],
        ['中央小学校','日本','中央小学校'],['第一小学校','日本','第一小学校'],['さくら小学校','日本','さくら小学校'],
        ['陽光小学校','日本','陽光小学校'],['緑の小学校','日本','緑の小学校'],['希望小学校','日本','希望小学校'],
        ['Central Primary School','英国','Central Primary School'],['Lincoln Primary School','英国','Lincoln Primary School'],['Maple Primary School','英国','Maple Primary School'],
        ['Riverside Primary School','英国','Riverside Primary School'],['Oak Primary School','英国','Oak Primary School'],['Greenwood Primary School','英国','Greenwood Primary School'],
        ['Grundschule Mitte','德国','Grundschule Mitte'],['Grundschule Nr. 1','德国','Grundschule Nr. 1'],['Ahorn-Grundschule','德国','Ahorn-Grundschule'],
        ['Fluss-Grundschule','德国','Fluss-Grundschule'],['Eichen-Grundschule','德国','Eichen-Grundschule'],['Grünwald-Grundschule','德国','Grünwald-Grundschule'],
        ['École Primaire Centrale','法国','École Primaire Centrale'],['École Primaire n°1','法国','École Primaire n°1'],['École Primaire Érable','法国','École Primaire Érable'],
        ['École Primaire Rivage','法国','École Primaire Rivage'],['École Primaire Chêne','法国','École Primaire Chêne'],['École Primaire Bois-Vert','法国','École Primaire Bois-Vert'],
        ['Scuola Primaria Centrale','意大利','Scuola Primaria Centrale'],['Scuola Primaria n.1','意大利','Scuola Primaria n.1'],['Scuola Primaria Acero','意大利','Scuola Primaria Acero'],
        ['Scuola Primaria Riva','意大利','Scuola Primaria Riva'],['Scuola Primaria Quercia','意大利','Scuola Primaria Quercia'],['Scuola Primaria Boscoverde','意大利','Scuola Primaria Boscoverde'],
        ['Colegio Primario Central','西班牙','Colegio Primario Central'],['Colegio Primario n.1','西班牙','Colegio Primario n.1'],['Colegio Primario Arce','西班牙','Colegio Primario Arce'],
        ['Colegio Primario Ribera','西班牙','Colegio Primario Ribera'],['Colegio Primario Roble','西班牙','Colegio Primario Roble'],['Colegio Primario Bosque Verde','西班牙','Colegio Primario Bosque Verde'],
        ['Central Primary School','加拿大','Central Primary School'],['Lincoln Elementary','加拿大','Lincoln Elementary'],['Maple Primary School','加拿大','Maple Primary School'],
        ['Riverside Primary School','加拿大','Riverside Primary School'],['Oak Primary School','加拿大','Oak Primary School'],['Greenwood Primary School','加拿大','Greenwood Primary School']
      ],
      // 初中
      middleSchools: [
        ['实验中学','中国','实验中学'],['第二中学','中国','第二中学'],['文汇中学','中国','文汇中学'],['青春中学','中国','青春中学'],
        ['外国语初级中学','中国','外国语初级中学'],['育才初级中学','中国','育才初级中学'],
        ['Central Middle School','美国','Central Middle School'],['Lincoln Junior High','美国','Lincoln Junior High'],['Maple Middle','美国','Maple Middle'],
        ['Riverside Middle','美国','Riverside Middle'],['Oak Middle','美国','Oak Middle'],
        ['中央中学校','日本','中央中学校'],['第一中学校','日本','第一中学校'],['さくら中学校','日本','さくら中学校'],
        ['陽光中学校','日本','陽光中学校'],['緑の中学校','日本','緑の中学校'],
        ['Central Secondary School','英国','Central Secondary School'],['Lincoln Secondary School','英国','Lincoln Secondary School'],['Maple Secondary School','英国','Maple Secondary School'],
        ['Riverside Secondary School','英国','Riverside Secondary School'],['Oak Secondary School','英国','Oak Secondary School'],
        ['Mittelschule Mitte','德国','Mittelschule Mitte'],['Mittelschule Nr. 1','德国','Mittelschule Nr. 1'],['Ahorn-Mittelschule','德国','Ahorn-Mittelschule'],
        ['Fluss-Mittelschule','德国','Fluss-Mittelschule'],['Eichen-Mittelschule','德国','Eichen-Mittelschule'],
        ['Collège Central','法国','Collège Central'],['Collège n°1','法国','Collège n°1'],['Collège Érable','法国','Collège Érable'],
        ['Collège Rivage','法国','Collège Rivage'],['Collège Chêne','法国','Collège Chêne'],
        ['Scuola Media Centrale','意大利','Scuola Media Centrale'],['Scuola Media n.1','意大利','Scuola Media n.1'],['Scuola Media Acero','意大利','Scuola Media Acero'],
        ['Scuola Media Riva','意大利','Scuola Media Riva'],['Scuola Media Quercia','意大利','Scuola Media Quercia'],
        ['Instituto Central','西班牙','Instituto Central'],['Instituto n.1','西班牙','Instituto n.1'],['Instituto Arce','西班牙','Instituto Arce'],
        ['Instituto Ribera','西班牙','Instituto Ribera'],['Instituto Roble','西班牙','Instituto Roble'],
        ['Central Middle School','加拿大','Central Middle School'],['Lincoln Middle School','加拿大','Lincoln Middle School'],['Maple Middle School','加拿大','Maple Middle School'],
        ['Riverside Middle School','加拿大','Riverside Middle School'],['Oak Middle School','加拿大','Oak Middle School']
      ],
      // 高中
      highSchools: [
        ['第一中学','中国','第一中学'],['附属中学','中国','附属中学'],['育才中学','中国','育才中学'],
        ['外国语高级中学','中国','外国语高级中学'],['实验高中','中国','实验高中'],['育才高级中学','中国','育才高级中学'],
        ['Central High School','美国','Central High School'],['Lincoln High','美国','Lincoln High'],['Maple High','美国','Maple High'],
        ['Riverside High','美国','Riverside High'],['Oak High','美国','Oak High'],
        ['中央高等学校','日本','中央高等学校'],['第一高等学校','日本','第一高等学校'],['さくら高等学校','日本','さくら高等学校'],
        ['陽光高等学校','日本','陽光高等学校'],['緑の高等学校','日本','緑の高等学校'],
        ['Central Sixth Form','英国','Central Sixth Form'],['Lincoln Sixth Form','英国','Lincoln Sixth Form'],['Maple Sixth Form','英国','Maple Sixth Form'],
        ['Riverside Sixth Form','英国','Riverside Sixth Form'],['Oak Sixth Form','英国','Oak Sixth Form'],
        ['Gymnasium Mitte','德国','Gymnasium Mitte'],['Gymnasium Nr. 1','德国','Gymnasium Nr. 1'],['Ahorn-Gymnasium','德国','Ahorn-Gymnasium'],
        ['Fluss-Gymnasium','德国','Fluss-Gymnasium'],['Eichen-Gymnasium','德国','Eichen-Gymnasium'],
        ['Lycée Central','法国','Lycée Central'],['Lycée n°1','法国','Lycée n°1'],['Lycée Érable','法国','Lycée Érable'],
        ['Lycée Rivage','法国','Lycée Rivage'],['Lycée Chêne','法国','Lycée Chêne'],
        ['Liceo Centrale','意大利','Liceo Centrale'],['Liceo n.1','意大利','Liceo n.1'],['Liceo Acero','意大利','Liceo Acero'],
        ['Liceo Riva','意大利','Liceo Riva'],['Liceo Quercia','意大利','Liceo Quercia'],
        ['Instituto Central','西班牙','Instituto Central'],['Instituto n.1','西班牙','Instituto n.1'],['Instituto Arce','西班牙','Instituto Arce'],
        ['Instituto Ribera','西班牙','Instituto Ribera'],['Instituto Roble','西班牙','Instituto Roble'],
        ['Central High School','加拿大','Central High School'],['Lincoln High School','加拿大','Lincoln High School'],['Maple High School','加拿大','Maple High School'],
        ['Riverside High School','加拿大','Riverside High School'],['Oak High School','加拿大','Oak High School']
      ],
      majors: ['计算机科学','软件工程','电子信息工程','工商管理','经济学','金融学','法学','临床医学','汉语言文学','外国语文学','数学','物理学','化学','生物科学','建筑学','机械工程','自动化','新闻传播学','心理学','环境科学','数据科学与大数据技术'],
      educations: ['高中','大专','本科','硕士','博士','博士后'],
      schoolTypes: ['公立大学','私立大学','理工学院','师范大学','综合性大学','艺术类院校','军事院校','职业技术学院'],
      countries: ['中国','美国','英国','日本','德国','法国','加拿大','澳大利亚','新加坡','韩国','意大利','西班牙'],
      // 工作 / 生活类
      incomeLevels: ['低收入','中低收入','中等收入','中高收入','高收入','富裕'],
      companySizes: ['1-10人','11-50人','51-200人','201-500人','501-1000人','1000人以上'],
      skills: {
        child: ['认字','唱歌','画画','数数','做手工','跳绳'],
        youth: ['绘画','游泳','写作','吉他','篮球','演讲','手工','编程入门'],
        adult: ['Python','Java','SQL','数据分析','项目管理','UI设计','沟通协调','公开演讲','写作','外语','机器学习','云计算','市场营销','财务分析','危机处理','团队协作'],
        senior: ['烹饪','园艺','书法','下棋','太极拳','编织','摄影','广场舞']
      },
      interests: {
        child: ['动画片','积木','绘本','游乐园','卡通','儿歌'],
        youth: ['动漫','游戏','篮球','足球','阅读','音乐','电影','绘画','科技','滑板'],
        adult: ['阅读','旅行','摄影','烹饪','健身','音乐','电影','登山','咖啡','志愿者','美食','编程'],
        senior: ['书法','棋牌','园艺','太极拳','养花','戏曲','散步','广场舞']
      },
      personalities: ['内向','外向','开朗','沉稳','严谨','富有创造力','乐观','理性','感性','善于领导','乐于助人'],
      pets: ['狗','猫','鱼','仓鼠','兔子','鹦鹉','乌龟','无'],
      favoriteFoods: ['川菜','粤菜','日料','意大利面','火锅','寿司','披萨','沙拉','烧烤','甜点','咖喱','小吃','奶茶'],
      travelStyles: ['背包客','豪华游','自驾游','深度游','邮轮','民宿体验','跟团游','探险','城市观光'],
      // 外貌类
      hairColors: ['黑色','棕色','金色','栗色','白发','红色','灰色','亚麻色'],
      eyeColors: ['黑色','棕色','蓝色','绿色','灰色','琥珀色'],
      skinTones: ['白皙','偏白','自然','偏深','小麦色','深色'],
      bloodTypes: ['A型','B型','AB型','O型'],
      bodyTypes: ['偏瘦','匀称','健壮','微胖','标准','肌肉型','运动型'],
      // 在线 / 安全类
      signatures: ['保持热爱，奔赴山海','步履不停，未来可期','万事胜意','认真生活，知足常乐','念念不忘，必有回响','心之所向，素履以往','且将新火试新茶','星光不问赶路人'],
      // 安全问题 / 安全答案（成对出现，保证问答一致）
      securityQA: [
        ['你第一只宠物的名字？','豆豆'],
        ['你母亲的姓氏？','李'],
        ['你小时候最好的朋友叫什么？','小明'],
        ['你出生的城市是哪里？','北京'],
        ['你最喜欢的老师姓什么？','王'],
        ['你就读的第一所小学叫什么？','实验小学'],
        ['你第一次去旅行的地点是哪里？','青岛'],
        ['你最喜欢的食物是什么？','饺子']
      ]
    },
    en: {
      schools: [
        ['Harvard University','United States','Harvard University'],['Stanford University','United States','Stanford University'],['MIT','United States','Massachusetts Institute of Technology'],
        ['University of Cambridge','United Kingdom','University of Cambridge'],['University of Oxford','United Kingdom','University of Oxford'],
        ['New York University','United States','New York University'],['University of Toronto','Canada','University of Toronto'],['University of Sydney','Australia','University of Sydney'],
        ['Technical University of Munich','Germany','Technische Universität München'],['National University of Singapore','Singapore','National University of Singapore'],
        ['University of Tokyo','Japan','東京大学'],['Berlin Institute of Technology','Germany','Technische Universität Berlin'],
        ['Sorbonne University','France','Sorbonne Université'],['University of Melbourne','Australia','University of Melbourne'],
        ['Tsinghua University','China','清华大学'],['University of Edinburgh','United Kingdom','University of Edinburgh'],['University of Rome','Italy','Università di Roma'],
        ['University of Tokyo','Japan','東京大学'],['Kyoto University','Japan','京都大学'],['Osaka University','Japan','大阪大学'],['Tohoku University','Japan','東北大学'],
        ['Nagoya University','Japan','名古屋大学'],['Hokkaido University','Japan','北海道大学'],['Kyushu University','Japan','九州大学'],['University of Tsukuba','Japan','筑波大学'],
        ['University of Oxford','United Kingdom','University of Oxford'],['University of Cambridge','United Kingdom','University of Cambridge'],['Imperial College London','United Kingdom','Imperial College London'],['University College London','United Kingdom','University College London'],
        ['Technical University of Munich','Germany','Technische Universität München'],['Heidelberg University','Germany','Ruprecht-Karls-Universität Heidelberg'],['Ecole Polytechnique','France','École Polytechnique'],['Sorbonne University','France','Sorbonne Université'],
        ['University of Bologna','Italy','Università di Bologna'],['Complutense University of Madrid','Spain','Universidad Complutense de Madrid'],['University of Toronto','Canada','University of Toronto']
      ],
      kindergartens: [
        ['Sunshine Kindergarten','United States'],['Blue Sky Kindergarten','United States'],
        ['Happy Kids Kindergarten','United States'],['Little Angels Kindergarten','United States'],
        ['Bright Star Kindergarten','United States']
      ],
      primarySchools: [
        ['Central Primary School','United States'],['Lincoln Elementary','United States'],
        ['Maple Primary','United States'],['Riverside Primary','United States'],
        ['Oak Elementary','United States'],['Greenwood Primary','United States']
      ],
      middleSchools: [
        ['Central Middle School','United States'],['Lincoln Junior High','United States'],
        ['Maple Middle','United States'],['Riverside Middle','United States'],['Oak Middle','United States']
      ],
      highSchools: [
        ['Central High School','United States'],['Lincoln High','United States'],
        ['Maple High','United States'],['Riverside High','United States'],['Oak High','United States']
      ],
      majors: ['Computer Science','Software Engineering','Electrical Engineering','Business Administration','Economics','Finance','Law','Clinical Medicine','Chinese Language','Foreign Languages','Mathematics','Physics','Chemistry','Biological Sciences','Architecture','Mechanical Engineering','Automation','Journalism','Psychology','Environmental Science','Data Science'],
      educations: ['High School','Associate Degree','Bachelor','Master','PhD','Postdoc'],
      schoolTypes: ['Public University','Private University','Institute of Technology','Normal University','Comprehensive University','Arts College','Military Academy','Vocational College'],
      countries: ['China','United States','United Kingdom','Japan','Germany','France','Canada','Australia','Singapore','South Korea','Italy','Spain'],
      incomeLevels: ['Low','Lower-Middle','Middle','Upper-Middle','High','Affluent'],
      companySizes: ['1-10','11-50','51-200','201-500','501-1000','1000+'],
      skills: {
        child: ['Reading','Singing','Drawing','Counting','Crafts','Skipping'],
        youth: ['Drawing','Swimming','Writing','Guitar','Basketball','Public Speaking','Coding (Scratch)','Crafts'],
        adult: ['Python','Java','SQL','Data Analysis','Project Management','UI Design','Communication','Public Speaking','Writing','Foreign Language','Machine Learning','Cloud Computing','Marketing','Financial Analysis','Crisis Management','Teamwork'],
        senior: ['Cooking','Gardening','Calligraphy','Chess','Tai Chi','Knitting','Photography','Dancing']
      },
      interests: {
        child: ['Cartoons','Building Blocks','Picture Books','Playground','Fairy Tales','Nursery Rhymes'],
        youth: ['Anime','Video Games','Basketball','Soccer','Reading','Music','Movies','Drawing','Tech','Skateboarding'],
        adult: ['Reading','Travel','Photography','Cooking','Fitness','Music','Movies','Hiking','Coffee','Volunteering','Foodie','Coding'],
        senior: ['Calligraphy','Chess','Gardening','Tai Chi','Flower Care','Opera','Walking','Dancing']
      },
      personalities: ['Introverted','Extroverted','Cheerful','Calm','Meticulous','Creative','Optimistic','Rational','Sensitive','Leadership','Helpful'],
      pets: ['Dog','Cat','Fish','Hamster','Rabbit','Parrot','Turtle','None'],
      favoriteFoods: ['Sichuan Cuisine','Cantonese Cuisine','Japanese Food','Pasta','Hot Pot','Sushi','Pizza','Salad','BBQ','Dessert','Curry','Snacks','Milk Tea'],
      travelStyles: ['Backpacking','Luxury','Road Trip','In-depth','Cruise','Homestay','Group Tour','Adventure','City Sightseeing'],
      hairColors: ['Black','Brown','Blonde','Chestnut','White','Red','Gray','Ash'],
      eyeColors: ['Black','Brown','Blue','Green','Gray','Amber'],
      skinTones: ['Fair','Light','Natural','Tan','Wheatish','Dark'],
      bloodTypes: ['A','B','AB','O'],
      bodyTypes: ['Slim','Athletic','Muscular','Chubby','Average','Fit'],
      signatures: ['Stay hungry, stay foolish','Keep calm and carry on','Live life to the fullest','Dream big, work hard','Less is more','Carpe diem','Seize the day','Chase your dreams'],
      securityQA: [
        ['What is your first pet\'s name?','Buddy'],
        ['Your mother\'s maiden name?','Smith'],
        ['Your childhood best friend?','Alex'],
        ['The city you were born in?','Boston'],
        ['Your favorite teacher\'s surname?','Davis'],
        ['The name of your first elementary school?','Lincoln'],
        ['Your first travel destination?','Orlando'],
        ['Your favorite food?','Pizza']
      ]
    },

    // 安全问题 / 安全答案（按国家细分，保证问答内容与所生身份的国家相符）
    // 结构：{ nativeLang, zh: [[q,a],...], en: [[q,a],...], [nativeLang]: [[q,a],...] }
    // 原先的 securityQA 保留为回退，新增国家专属问答池，提升文化真实性。
    securityQAByCountry: {
  "china": {
    "nativeLang": "zh",
    "zh": [
      [
        "你的第一只宠物叫什么名字？",
        "阿黑"
      ],
      [
        "你的母亲的姓氏是什么？",
        "王"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "小明"
      ],
      [
        "你出生的城市是哪里？",
        "成都"
      ],
      [
        "你最喜欢的老师姓什么？",
        "陈"
      ],
      [
        "你就读的第一所小学叫什么？",
        "育知小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "黄山"
      ],
      [
        "你喜欢吃的食物是什么？",
        "火锅"
      ],
      [
        "你的祖父的名字是什么？",
        "老王"
      ],
      [
        "你小时候最喜欢看的动画是什么？",
        "大白鲨金毛"
      ],
      [
        "你的第一个电话号码是什么？",
        "13800138000"
      ],
      [
        "你的初中学号是多少？",
        "0012580"
      ],
      [
        "你的出生医院叫什么名字？",
        "成都儿童医院"
      ],
      [
        "你第一次参加的社团活动是什么？",
        "少先队"
      ],
      [
        "你的初中班主任的姓名是什么？",
        "张老师"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Buddy"
      ],
      [
        "What is your mother's maiden name?",
        "Wang"
      ],
      [
        "What is your childhood best friend's name?",
        "Xiao Ming"
      ],
      [
        "What city were you born in?",
        "Chengdu"
      ],
      [
        "What is your favorite teacher's surname?",
        "Chen"
      ],
      [
        "What was the name of your first elementary school?",
        "Yu Zhi Primary School"
      ],
      [
        "Where was your first travel destination?",
        "Yellow Mountain"
      ],
      [
        "What is your favorite food?",
        "Hot Pot"
      ],
      [
        "What is your grandfather's name?",
        "Old Wang"
      ],
      [
        "What was your favorite cartoon as a child?",
        "Police Patrol"
      ],
      [
        "What was your first phone number?",
        "138-0013-8000"
      ],
      [
        "What was your junior high school student ID?",
        "0012580"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Chengdu Children Hospital"
      ],
      [
        "What was the first club you joined?",
        "Young Pioneers"
      ],
      [
        "What is your homeroom teacher's name?",
        "Teacher Zhang"
      ]
    ]
  },
  "us": {
    "nativeLang": "en",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "阿Buddy"
      ],
      [
        "你的母亲的姓氏是什么？",
        "史密斯"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "迈克尔"
      ],
      [
        "你出生的城市是哪里？",
        "芝加哥"
      ],
      [
        "你最喜欢的老师姓什么？",
        "安德森"
      ],
      [
        "你就读的第一所小学叫什么？",
        "林肯小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "迪士尼世界"
      ],
      [
        "你喜欢吃的食物是什么？",
        "披萨"
      ],
      [
        "你的父亲的中间名字是什么？",
        "罗伯特"
      ],
      [
        "你的第一辆汽车是什么？",
        "福特野马"
      ],
      [
        "你的高中校魂是什么？",
        "老鹰"
      ],
      [
        "你的第一份工作是什么？",
        "救生员"
      ],
      [
        "你的祖母的姓氏是什么？",
        "威廉斯"
      ],
      [
        "你成长的街道是什么？",
        "枫叶街"
      ],
      [
        "你最喜欢的运动队是什么？",
        "芝加哥公牛"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Buddy"
      ],
      [
        "What is your mother's maiden name?",
        "Smith"
      ],
      [
        "What is your childhood best friend's name?",
        "Michael"
      ],
      [
        "What city were you born in?",
        "Chicago"
      ],
      [
        "What is your favorite teacher's surname?",
        "Anderson"
      ],
      [
        "What was the name of your first elementary school?",
        "Lincoln Elementary"
      ],
      [
        "Where was the first place you traveled?",
        "Disney World"
      ],
      [
        "What is your favorite food?",
        "Pizza"
      ],
      [
        "What is your father's middle name?",
        "Robert"
      ],
      [
        "What was your first car?",
        "Ford Mustang"
      ],
      [
        "What is your high school mascot?",
        "Eagles"
      ],
      [
        "What was your first job?",
        "Lifeguard"
      ],
      [
        "What is your grandmother's maiden name?",
        "Williams"
      ],
      [
        "What street did you grow up on?",
        "Maple Street"
      ],
      [
        "What is your favorite sports team?",
        "Chicago Bulls"
      ]
    ]
  },
  "japan": {
    "nativeLang": "ja",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "ポチ"
      ],
      [
        "你的母亲的姓氏是什么？",
        "田中"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "健太"
      ],
      [
        "你出生的城市是哪里？",
        "东京"
      ],
      [
        "你最喜欢的老师姓什么？",
        "佐藤"
      ],
      [
        "你就读的第一所小学叫什么？",
        "东京小学校"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "富士山"
      ],
      [
        "你喜欢吃的食物是什么？",
        "拉面"
      ],
      [
        "你的祖父的名字是什么？",
        "山田"
      ],
      [
        "你小时候最喜欢看的动画是什么？",
        "龙珠"
      ],
      [
        "你的第一个电话号码是什么？",
        "090-1234-5678"
      ],
      [
        "你的班级是多少？",
        "3班"
      ],
      [
        "你的出生医院叫什么名字？",
        "东京医科大学附属医院"
      ],
      [
        "你第一次加入的组织是什么？",
        "足球俱乐部"
      ],
      [
        "你的初中班主任的姓名是什么？",
        "佐藤老师"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Pochi"
      ],
      [
        "What is your mother's maiden name?",
        "Tanaka"
      ],
      [
        "What is your childhood best friend's name?",
        "Kenta"
      ],
      [
        "What city were you born in?",
        "Tokyo"
      ],
      [
        "What is your favorite teacher's surname?",
        "Sato"
      ],
      [
        "What was the name of your first elementary school?",
        "Tokyo Elementary"
      ],
      [
        "Where was your first travel destination?",
        "Mt. Fuji"
      ],
      [
        "What is your favorite food?",
        "Ramen"
      ],
      [
        "What is your grandfather's name?",
        "Yamada"
      ],
      [
        "What was your favorite cartoon as a child?",
        "Dragon Ball"
      ],
      [
        "What was your first phone number?",
        "090-1234-5678"
      ],
      [
        "What class were you in elementary school?",
        "Class 3"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Tokyo Medical University Hospital"
      ],
      [
        "What was the first club you joined?",
        "Soccer Club"
      ],
      [
        "What is your homeroom teacher's name?",
        "Teacher Sato"
      ]
    ],
    "ja": [
      [
        "初めてのペットの名前は？",
        "ポチ"
      ],
      [
        "母の旧姓は何ですか？",
        "田中"
      ],
      [
        "子供時代の良く仲の友達の名前は？",
        "健太"
      ],
      [
        "生まれた街はどこですか？",
        "東京"
      ],
      [
        "好きな先生の姓は？",
        "佐藤"
      ],
      [
        "最初に通った小学校の名前は？",
        "東京小学校"
      ],
      [
        "初めて旅行した場所は？",
        "富士山"
      ],
      [
        "最好きな食べものは？",
        "ラーメン"
      ],
      [
        "祖父の名前は？",
        "山田"
      ],
      [
        "子供時代に見ていたアニメは？",
        "ドラゴンボール"
      ],
      [
        "最初の電話番号は何ですか？",
        "090-1234-5678"
      ],
      [
        "小学生の時のクラスは？",
        "3組"
      ],
      [
        "生まれた病院の名前は？",
        "東京医大附属病院"
      ],
      [
        "初めて入ったサークルは？",
        "サッカー部"
      ],
      [
        "担任の担任教師の名前は？",
        "佐藤先生"
      ]
    ]
  },
  "uk": {
    "nativeLang": "en",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "雷克斯"
      ],
      [
        "你的母亲的姓氏是什么？",
        "汤普森"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "詹姆斯"
      ],
      [
        "你出生的城市是哪里？",
        "伦敦"
      ],
      [
        "你最喜欢的老师姓什么？",
        "布朗"
      ],
      [
        "你就读的第一所小学叫什么？",
        "圣玛丽小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "布赖顿"
      ],
      [
        "你喜欢吃的食物是什么？",
        "鱼薯条"
      ],
      [
        "你的父亲的中间名字是什么？",
        "詹姆斯"
      ],
      [
        "你的第一辆汽车是什么？",
        "迷你"
      ],
      [
        "你的学校颜色是什么？",
        "蓝色和金色"
      ],
      [
        "你的第一份工作是什么？",
        "酒吧服务员"
      ],
      [
        "你的祖母的姓氏是什么？",
        "戴维斯"
      ],
      [
        "你成长的街道是什么？",
        "橡树路"
      ],
      [
        "你最喜欢的足球队是什么？",
        "阿森纳"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Rex"
      ],
      [
        "What is your mother's maiden name?",
        "Thompson"
      ],
      [
        "What is your childhood best friend's name?",
        "James"
      ],
      [
        "What city were you born in?",
        "London"
      ],
      [
        "What is your favourite teacher's surname?",
        "Brown"
      ],
      [
        "What was the name of your first primary school?",
        "St. Mary's Primary"
      ],
      [
        "Where did you first travel?",
        "Brighton"
      ],
      [
        "What is your favourite food?",
        "Fish and Chips"
      ],
      [
        "What is your father's middle name?",
        "James"
      ],
      [
        "What was your first car?",
        "Mini"
      ],
      [
        "What are your school colours?",
        "Blue and Gold"
      ],
      [
        "What was your first job?",
        "Barman"
      ],
      [
        "What is your grandmother's maiden name?",
        "Davies"
      ],
      [
        "What road did you grow up on?",
        "Oak Road"
      ],
      [
        "What is your favourite football team?",
        "Arsenal"
      ]
    ]
  },
  "germany": {
    "nativeLang": "de",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "菲迪"
      ],
      [
        "你的母亲的姓氏是什么？",
        "穆勒"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "克劳斯"
      ],
      [
        "你出生的城市是哪里？",
        "柏林"
      ],
      [
        "你最喜欢的老师姓什么？",
        "施密特"
      ],
      [
        "你就读的第一所小学叫什么？",
        "柏林中央小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "慕尼黑"
      ],
      [
        "你喜欢吃的食物是什么？",
        "德国香肠"
      ],
      [
        "你的祖父的名字是什么？",
        "韦伯"
      ],
      [
        "你小时候最喜欢的歌是什么？",
        "我想回去"
      ],
      [
        "你的第一个电话号码是什么？",
        "0151-12345678"
      ],
      [
        "你的班级是多少？",
        "3b"
      ],
      [
        "你的出生医院叫什么名字？",
        "查理医院"
      ],
      [
        "你第一次加入的组织是什么？",
        "足球俱乐部"
      ],
      [
        "你的第一份工作是什么？",
        "西门子"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Fido"
      ],
      [
        "What is your mother's maiden name?",
        "Muller"
      ],
      [
        "What is your childhood best friend's name?",
        "Klaus"
      ],
      [
        "What city were you born in?",
        "Berlin"
      ],
      [
        "What is your favorite teacher's surname?",
        "Schmidt"
      ],
      [
        "What was the name of your first elementary school?",
        "Berlin-Mitte Elementary"
      ],
      [
        "Where was your first travel destination?",
        "Munich"
      ],
      [
        "What is your favorite food?",
        "Bratwurst"
      ],
      [
        "What is your grandfather's name?",
        "Weber"
      ],
      [
        "What was your favorite song?",
        "Ich will zurück"
      ],
      [
        "What was your first phone number?",
        "0151-12345678"
      ],
      [
        "What class were you in?",
        "3b"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Charité"
      ],
      [
        "What was the first club you joined?",
        "Football Club"
      ],
      [
        "What was your first employer?",
        "Siemens"
      ]
    ],
    "de": [
      [
        "Wie heißt dein erstes Haustier?",
        "Fido"
      ],
      [
        "Wie lautet der Maiden-Name deiner Mutter?",
        "Müller"
      ],
      [
        "Wie hieß dein bester Kindheitsfreund?",
        "Klaus"
      ],
      [
        "In welcher Stadt bist du geboren?",
        "Berlin"
      ],
      [
        "Wie heißt dein Lieblingsl Lehrer?",
        "Schmidt"
      ],
      [
        "Wie hieß deine erste Grundschule?",
        "Grundschule Berlin-Mitte"
      ],
      [
        "Wohin war dein erster Urlaub?",
        "München"
      ],
      [
        "Was ist dein Lieblingsessen?",
        "Bratwurst"
      ],
      [
        "Wie heißt dein Großvater?",
        "Weber"
      ],
      [
        "Was war dein Lieblingslied?",
        "Ich will zurück"
      ],
      [
        "Wie hieß deine erste Telefonnummer?",
        "0151-12345678"
      ],
      [
        "In welchem Klassenverband warst du?",
        "3b"
      ],
      [
        "Wie heißt das Krankenhaus, in dem du geboren wurdest?",
        "Charité"
      ],
      [
        "Welcher Verein war dein erster?",
        "Fußballverein"
      ],
      [
        "Wie hieß dein erster Arbeitgeber?",
        "Siemens"
      ]
    ]
  },
  "france": {
    "nativeLang": "fr",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "雷克斯"
      ],
      [
        "你的母亲的姓氏是什么？",
        "马丁"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "托马斯"
      ],
      [
        "你出生的城市是哪里？",
        "巴黎"
      ],
      [
        "你最喜欢的老师姓什么？",
        "杜布瓦"
      ],
      [
        "你就读的第一所小学叫什么？",
        "圣路易斯小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "里昂"
      ],
      [
        "你喜欢吃的食物是什么？",
        "香葆鸡"
      ],
      [
        "你的祖父的名字是什么？",
        "伯南"
      ],
      [
        "你小时候最喜欢看的动画是什么？",
        "蓝色小精灵"
      ],
      [
        "你的第一个邮箱地址是什么？",
        "monsieur@test.com"
      ],
      [
        "你的电话号码是什么？",
        "06-12-34-56-78"
      ],
      [
        "你的出生医院叫什么名字？",
        "圣安托万医院"
      ],
      [
        "你第一次加入的组织是什么？",
        "足球俱乐部"
      ],
      [
        "你的第一份工作是什么？",
        "空中客车"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Rex"
      ],
      [
        "What is your mother's maiden name?",
        "Martin"
      ],
      [
        "What is your childhood best friend's name?",
        "Thomas"
      ],
      [
        "What city were you born in?",
        "Paris"
      ],
      [
        "What is your favorite teacher's surname?",
        "Dubois"
      ],
      [
        "What was the name of your first elementary school?",
        "Ecole Primaire Saint-Louis"
      ],
      [
        "Where was your first travel destination?",
        "Lyon"
      ],
      [
        "What is your favorite food?",
        "Coq au Vin"
      ],
      [
        "What is your grandfather's name?",
        "Bernard"
      ],
      [
        "What was your favorite cartoon as a child?",
        "The Smurfs"
      ],
      [
        "What was your first email address?",
        "monsieur@test.com"
      ],
      [
        "What was your first phone number?",
        "06-12-34-56-78"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Hopital Saint-Antoine"
      ],
      [
        "What was the first club you joined?",
        "Football Club"
      ],
      [
        "What was your first employer?",
        "Airbus"
      ]
    ],
    "fr": [
      [
        "Comment s'appelle votre premier animal de compagnie?",
        "Rex"
      ],
      [
        "Quel est le nom de jeune femme de votre mère?",
        "Martin"
      ],
      [
        "Comment s'appelle votre meilleur ami d'enfance?",
        "Thomas"
      ],
      [
        "Dans quelle ville êtes-vous né?",
        "Paris"
      ],
      [
        "Quel est le nom de famille de votre professeur préféré?",
        "Dubois"
      ],
      [
        "Quel était le nom de votre première école primaire?",
        "École Primaire Saint-Louis"
      ],
      [
        "Où avez-vous fait votre premier voyage?",
        "Lyon"
      ],
      [
        "Quel est votre plat préféré?",
        "Coq au Vin"
      ],
      [
        "Comment s'appelle votre grand-père?",
        "Bernard"
      ],
      [
        "Quel était votre dessin animé préféré?",
        "Les Schtroumpfons"
      ],
      [
        "Quelle était votre première adresse e-mail?",
        "monsieur@test.com"
      ],
      [
        "Quelle était votre numéro de téléphone?",
        "06-12-34-56-78"
      ],
      [
        "Comment s'appelle l'hôpital où vous êtes né?",
        "Hôpital Saint-Antoine"
      ],
      [
        "Quel était le premier club auquel vous avez adhéré?",
        "Club de Football"
      ],
      [
        "Quel était votre premier employeur?",
        "Airbus"
      ]
    ]
  },
  "canada": {
    "nativeLang": "en",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "罗弗"
      ],
      [
        "你的母亲的姓氏是什么？",
        "特伦布莱"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "爱玛"
      ],
      [
        "你出生的城市是哪里？",
        "多伦多"
      ],
      [
        "你最喜欢的老师姓什么？",
        "史密斯"
      ],
      [
        "你就读的第一所小学叫什么？",
        "枫叶小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "尼亚加拉瀑布"
      ],
      [
        "你喜欢吃的食物是什么？",
        "菠萝千层面"
      ],
      [
        "你的父亲的中间名字是什么？",
        "詹姆斯"
      ],
      [
        "你的第一辆汽车是什么？",
        "福特F-150"
      ],
      [
        "你的高中校魂是什么？",
        "狼"
      ],
      [
        "你的第一份工作是什么？",
        "滑雪教师"
      ],
      [
        "你的祖母的姓氏是什么？",
        "约翰逊"
      ],
      [
        "你成长的街道是什么？",
        "枫叶街"
      ],
      [
        "你最喜欢的运动队是什么？",
        "多伦多枫叶队"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Rover"
      ],
      [
        "What is your mother's maiden name?",
        "Tremblay"
      ],
      [
        "What is your childhood best friend's name?",
        "Emma"
      ],
      [
        "What city were you born in?",
        "Toronto"
      ],
      [
        "What is your favorite teacher's surname?",
        "Smith"
      ],
      [
        "What was the name of your first elementary school?",
        "Maple Leaf Elementary"
      ],
      [
        "Where was the first place you traveled?",
        "Niagara Falls"
      ],
      [
        "What is your favorite food?",
        "Poutine"
      ],
      [
        "What is your father's middle name?",
        "James"
      ],
      [
        "What was your first car?",
        "Ford F-150"
      ],
      [
        "What is your high school mascot?",
        "Wolves"
      ],
      [
        "What was your first job?",
        "Ski Instructor"
      ],
      [
        "What is your grandmother's maiden name?",
        "Johnson"
      ],
      [
        "What street did you grow up on?",
        "Maple Street"
      ],
      [
        "What is your favorite sports team?",
        "Toronto Maple Leafs"
      ]
    ]
  },
  "italy": {
    "nativeLang": "it",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "菲迪"
      ],
      [
        "你的母亲的姓氏是什么？",
        "罗西"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "马尔科"
      ],
      [
        "你出生的城市是哪里？",
        "罗马"
      ],
      [
        "你最喜欢的老师姓什么？",
        "比安基"
      ],
      [
        "你就读的第一所小学叫什么？",
        "罗马中心小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "佩斯卡纳"
      ],
      [
        "你喜欢吃的食物是什么？",
        "卡塔纳罗鸭肝"
      ],
      [
        "你的祖父的名字是什么？",
        "埃斯波西托"
      ],
      [
        "你小时候最喜欢看的动画是什么？",
        "宝可梦"
      ],
      [
        "你的第一个电话号码是什么？",
        "333-1234567"
      ],
      [
        "你的班级是多少？",
        "3A"
      ],
      [
        "你的出生医院叫什么名字？",
        "杰曼尼医院"
      ],
      [
        "你第一次加入的组织是什么？",
        "足球俱乐部"
      ],
      [
        "你的第一份工作是什么？",
        "法拉利"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Fido"
      ],
      [
        "What is your mother's maiden name?",
        "Rossi"
      ],
      [
        "What is your childhood best friend's name?",
        "Marco"
      ],
      [
        "What city were you born in?",
        "Rome"
      ],
      [
        "What is your favorite teacher's surname?",
        "Bianchi"
      ],
      [
        "What was the name of your first elementary school?",
        "Roma Centro Primary"
      ],
      [
        "Where was your first travel destination?",
        "Florence"
      ],
      [
        "What is your favorite food?",
        "Pasta Carbonara"
      ],
      [
        "What is your grandfather's name?",
        "Esposito"
      ],
      [
        "What was your favorite cartoon as a child?",
        "Pokémon"
      ],
      [
        "What was your first phone number?",
        "333-1234567"
      ],
      [
        "What class were you in?",
        "3A"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Ospedale Gemelli"
      ],
      [
        "What was the first club you joined?",
        "Football Club"
      ],
      [
        "What was your first employer?",
        "Ferrari"
      ]
    ],
    "it": [
      [
        "Come si chiama il tuo primo animale domestico?",
        "Fido"
      ],
      [
        "Qual è il cognome di famiglia della tua madre?",
        "Rossi"
      ],
      [
        "Come si chiama il tuo migliore amico da bambino?",
        "Marco"
      ],
      [
        "In quale città sei nato?",
        "Roma"
      ],
      [
        "Qual è il cognome del tuo insegnante preferito?",
        "Bianchi"
      ],
      [
        "Qual è il nome della tua prima scuola elementare?",
        "Scuola Primaria Roma Centro"
      ],
      [
        "Dove hai viaggiato per la prima volta?",
        "Firenze"
      ],
      [
        "Qual è il tuo cibo preferito?",
        "Pasta Carbonara"
      ],
      [
        "Come si chiama il tuo nonno?",
        "Esposito"
      ],
      [
        "Qual è il tuo cartone animato preferito?",
        "Pokémon"
      ],
      [
        "Qual è stato il tuo primo numero di telefono?",
        "333-1234567"
      ],
      [
        "Quale classe frequentavi?",
        "3A"
      ],
      [
        "Come si chiama l'ospedale dove sei nato?",
        "Ospedale Gemelli"
      ],
      [
        "Qual è stato il primo club cui hai aderito?",
        "Società Calcio"
      ],
      [
        "Chi è stato il tuo primo datore di lavoro?",
        "Ferrari"
      ]
    ]
  },
  "spain": {
    "nativeLang": "es",
    "zh": [
      [
        "你的第一只宠物的名字叫什么？",
        "费鲁拉"
      ],
      [
        "你的母亲的姓氏是什么？",
        "加里达"
      ],
      [
        "你小时候最好的朋友叫什么？",
        "卡洛斯"
      ],
      [
        "你出生的城市是哪里？",
        "马德里"
      ],
      [
        "你最喜欢的老师姓什么？",
        "洛佩斯"
      ],
      [
        "你就读的第一所小学叫什么？",
        "太阳小学"
      ],
      [
        "你第一次去旅行的目的地是哪里？",
        "巴塞罗那"
      ],
      [
        "你喜欢吃的食物是什么？",
        "排阿利亚"
      ],
      [
        "你的祖父的名字是什么？",
        "马丁内斯"
      ],
      [
        "你小时候最喜欢看的动画是什么？",
        "野牛帮"
      ],
      [
        "你的第一个电话号码是什么？",
        "600-123-456"
      ],
      [
        "你的班级是多少？",
        "4班A"
      ],
      [
        "你的出生医院叫什么名字？",
        "克林蒂卡医院"
      ],
      [
        "你第一次加入的组织是什么？",
        "足球俱乐部"
      ],
      [
        "你的第一份工作是什么？",
        "雷普索尔"
      ]
    ],
    "en": [
      [
        "What is the name of your first pet?",
        "Firula"
      ],
      [
        "What is your mother's maiden name?",
        "Garcia"
      ],
      [
        "What is your childhood best friend's name?",
        "Carlos"
      ],
      [
        "What city were you born in?",
        "Madrid"
      ],
      [
        "What is your favorite teacher's surname?",
        "Lopez"
      ],
      [
        "What was the name of your first elementary school?",
        "Sol Primary"
      ],
      [
        "Where was your first travel destination?",
        "Barcelona"
      ],
      [
        "What is your favorite food?",
        "Paella"
      ],
      [
        "What is your grandfather's name?",
        "Martinz"
      ],
      [
        "What was your favorite cartoon as a child?",
        "The Flintstones"
      ],
      [
        "What was your first phone number?",
        "600-123-456"
      ],
      [
        "What class were you in?",
        "4th Grade A"
      ],
      [
        "What is the name of the hospital where you were born?",
        "Hospital Clinic"
      ],
      [
        "What was the first club you joined?",
        "Football Club"
      ],
      [
        "What was your first employer?",
        "Repsol"
      ]
    ],
    "es": [
      [
        "¿Cómo se llama tu primera mascota?",
        "Firula"
      ],
      [
        "¿Cuál es el apellido de soltera de tu madre?",
        "García"
      ],
      [
        "¿Cómo se llamaba tu mejor amigo de la infancia?",
        "Carlos"
      ],
      [
        "¿En qué ciudad naciste?",
        "Madrid"
      ],
      [
        "¿Cuál es el apellido de tu profesor favorito?",
        "López"
      ],
      [
        "¿Cómo se llamaba tu primera escuela primaria?",
        "Escuela Primaria Sol"
      ],
      [
        "¿Dónde fuiste por primera vez de viaje?",
        "Barcelona"
      ],
      [
        "¿Cuál es tu comida favorita?",
        "Paella"
      ],
      [
        "¿Cómo se llama tu abuelo?",
        "Martínez"
      ],
      [
        "¿Cuál era tu dibujo animado favorito?",
        "Los Picapiedras"
      ],
      [
        "¿Cuál fue tu primer número de teléfono?",
        "600-123-456"
      ],
      [
        "¿Qué clase ibas?",
        "4ºA"
      ],
      [
        "¿Cómo se llama el hospital donde naciste?",
        "Hospital Clínic"
      ],
      [
        "¿Cuál fue el primer club al que te uniste?",
        "Club de Fútbol"
      ],
      [
        "¿Cuál fue tu primer empleador?",
        "Repsol"
      ]
    ]
  }
}
    ,
    
    // 在线签名（按国家细分，保证签名内容与所生身份的国家相符）
    // 结构：{ nativeLang, zh: [...], en: [...], [nativeLang]: [...] }
    // 原先的 signatures 保留为回退，新增国家专属签名池。
    signaturesByCountry: {
  "china": {
    "nativeLang": "zh",
    "zh": [
      "保持热爱，奔赴山海",
      "心之所向，素履以往",
      "万事胜意",
      "认真生活，知足常乐",
      "念念不忘，必有回响",
      "且将新火试新茶",
      "星光不问赶路人",
      "自律即自由",
      "种一树树一森",
      "活在当下",
      "梦想不会缺席",
      "简单而真实",
      "美好从现在",
      "随风出摆动",
      "心静自然凉"
    ],
    "en": [
      "Keep your passion burning",
      "Follow your heart, walk your path",
      "All the best",
      "Live simply, be happy",
      "Persistent efforts bear fruit",
      "Try new things",
      "Stars don't ask who hurries",
      "Discipline is freedom",
      "Plant a tree, plant a forest",
      "Live in the present",
      "Dreams never fail",
      "Simple and authentic",
      "Beauty starts now",
      "Go with the wind",
      "Stay calm and carry on"
    ]
  },
  "us": {
    "nativeLang": "en",
    "en": [
      "Stay hungry, stay foolish",
      "Keep it real",
      "Living my best life",
      "Hustle hard, dream big",
      "Coffee, because adulting is hard",
      "Just do it",
      "Blessed and grateful",
      "Onward and upward",
      "Be fearless",
      "Make it happen",
      "Good vibes only",
      "Chasing dreams",
      "Stay humble, hustle hard",
      "Life's a beach",
      "One day at a time"
    ],
    "zh": [
      "保持饥饿，保持愚蠆",
      "保持真实",
      "过着最好的生活",
      "努力奔跑，梦想远大",
      "咖啡，因为成年很难",
      "就这么干",
      "感恩有福",
      "不断前进",
      "勇往无畏",
      "让它发生",
      "只有好气氛",
      "追梦中",
      "保持谦虚，努力奋斗",
      "生活就像海滩",
      "一天天来"
    ]
  },
  "japan": {
    "nativeLang": "ja",
    "ja": [
      "前向きに生きよう",
      "今日も一日、がんばろう",
      "自分らしく生きる",
      "小さな幸せを感じる",
      "自然に笑顔になる",
      "心を静める",
      "新しいことにチャンレンジ",
      "人との繋がりを大切に",
      "みんなで頑張ろう",
      "ありがとうの気持ち",
      "夢を追いかける",
      "両者のバランスを取る",
      "今この瞬間を大切に",
      "自分を信じる",
      "積極的に前進する"
    ],
    "zh": [
      "向前看，勇往直前",
      "今天也要努力",
      "做真实的自己",
      "享受生活中的小幸福",
      "自然而然地微笑",
      "静心",
      "挑战新事物",
      "珍惜人际关系",
      "大家一起加油",
      "表达感恩之情",
      "追逐梦想",
      "保持平衡",
      "珍惜此刻",
      "相信自己",
      "积极向前"
    ],
    "en": [
      "Live forward with positivity",
      "Do your best every day",
      "Be your true self",
      "Find joy in small things",
      "Let your smile come naturally",
      "Calm your spirit",
      "Challenge new things",
      "Cherish human connections",
      "Let's do our best together",
      "Express gratitude",
      "Chase your dreams",
      "Maintain balance",
      "Treasure the present moment",
      "Believe in yourself",
      "Move forward proactively"
    ]
  },
  "uk": {
    "nativeLang": "en",
    "en": [
      "Rather grand, really",
      "Not bad at all",
      "Spot on",
      "Jolly good show",
      "Cheeky but brilliant",
      "Proper job",
      "Blazing, innit",
      "Right, then",
      "Fair play",
      "Top banana",
      "Smashing",
      "Brilliant stuff",
      "Lovely jubbly",
      "Sorted",
      "Cheers, mate"
    ],
    "zh": [
      "相当宏伟，真的",
      "一点也不糟糕",
      "完美",
      "真是精彩",
      "顽皮且出色",
      "干得好",
      "太棒了，不是吗",
      "好的",
      "公平比赛",
      "红木柱",
      "碉堕了",
      "真是棒极了",
      "可爱的",
      "解决了",
      "干杯，老友"
    ]
  },
  "germany": {
    "nativeLang": "de",
    "de": [
      "Auf die Plätze, fertig, los",
      "Einfach nur gut",
      "Das ist gut",
      "Feuer und Flamme",
      "Da bin ich",
      "Alles klar",
      "Na klar",
      "Passt schon",
      "Prost",
      "In die richtige Richtung",
      "Kein Ding",
      "Feuerwehrmann",
      "Alles unter Kontrolle",
      "Einfach so",
      "Da liegt der Winkel"
    ],
    "zh": [
      "就位，准备，开始",
      "简直棒极了",
      "这很好",
      "热火友好",
      "到了我的地方",
      "一切 OK",
      "当然",
      "勉强可以",
      "干杯",
      "向正确的方向",
      "没问题",
      "消防队员",
      "都受控",
      "就这样",
      "找到了弧度"
    ],
    "en": [
      "Ready, set, go",
      "Simply great",
      "That's good",
      "On fire",
      "I'm here",
      "All good",
      "Of course",
      "It's fine",
      "Cheers",
      "In the right direction",
      "No problem",
      "Firefighter",
      "All under control",
      "Just like that",
      "Found the angle"
    ]
  },
  "france": {
    "nativeLang": "fr",
    "fr": [
      "Vive la vie",
      "Profitez du moment",
      "L'essentiel est invisible",
      "Carpe diem",
      "L'amour, c'est plus fort",
      "Je suis comme je suis",
      "La vie est belle",
      "Rien n'est impossible",
      "L'art de vivre",
      "A la bonne heure",
      "C'est la vie",
      "En mode survie",
      "La vie en rose",
      "Sourire et la pêche",
      "Bien sûr"
    ],
    "zh": [
      "生命在线",
      "享受当下",
      "重要的看不见",
      "把握今天",
      "爱情更强",
      "我就是我",
      "生命之美",
      "没有不可能",
      "生活的艺术",
      "好的",
      "生活就是这样",
      "生存模式",
      "粉红生活",
      "微笑和钓鱼",
      "当然"
    ],
    "en": [
      "Long live life",
      "Enjoy the moment",
      "The essential is invisible",
      "Seize the day",
      "Love is stronger",
      "I am who I am",
      "Life is beautiful",
      "Nothing is impossible",
      "The art of living",
      "All good",
      "That's life",
      "Survival mode",
      "Life in pink",
      "Smile and fish",
      "Of course"
    ]
  },
  "canada": {
    "nativeLang": "en",
    "en": [
      "Sorry, eh",
      "Eh, it's okay",
      "Take off, buddy",
      "Maple leaf forever",
      "True north strong and free",
      "Tim Hortons runs in my veins",
      "Don't be a hoser",
      "That's pretty good, eh",
      "Skate, shot, score",
      "Moose spotted",
      "Toque season",
      "Double-double, please",
      "Peace, eh",
      "Beaver tails and poutine",
      "Canadian tuxedo"
    ],
    "zh": [
      "对不起啊",
      "哦，还好",
      "拜拜，伙计",
      "永远红叶",
      "真北坚强且自由",
      "提姆霍顿在我的血管中",
      "别当破坏者",
      "相当不错，诶",
      "滑冰射门进球",
      "驼鹿出现",
      "毛线帽季节",
      "双倍，请",
      "和平，诶",
      "海狮尾巴和普渣",
      "加拿大背心"
    ]
  },
  "italy": {
    "nativeLang": "it",
    "it": [
      "La vita è bella",
      "Segui il tuo cuore",
      "Sogna in grande",
      "Buona fortuna",
      "Sei fantastico",
      "Che bello",
      "Mamma mia",
      "Bellissimo",
      "Forza e coraggio",
      "Amore mio",
      "Vivi e lascia vivere",
      "La strada della vita",
      "Piccola grandezza",
      "Che vuoi",
      "A presto"
    ],
    "zh": [
      "生命美好",
      "跟随你的心",
      "做个梦想",
      "好运",
      "你真棒",
      "真美",
      "天呀",
      "太美了",
      "力量与勇气",
      "我的爱",
      "生而自由",
      "生命之路",
      "小伟大",
      "怎么",
      "很快见"
    ],
    "en": [
      "Life is beautiful",
      "Follow your heart",
      "Dream big",
      "Good luck",
      "You're amazing",
      "How beautiful",
      "Oh my",
      "Beautiful",
      "Courage and strength",
      "My love",
      "Live and let live",
      "The road of life",
      "Small greatness",
      "Whatever you want",
      "See you soon"
    ]
  },
  "spain": {
    "nativeLang": "es",
    "es": [
      "La vida es bella",
      "Sigue tu corazón",
      "Sueña en grande",
      "Buena suerte",
      "Eres increíble",
      "Qué guay",
      "Olé",
      "Guay",
      "Arriba",
      "Vamos allá",
      "Todo va bien",
      "No te rindas",
      "Carpe diem",
      "Tomate",
      "Hasta luego"
    ],
    "zh": [
      "生活美好",
      "跟随你的心",
      "做个美梦",
      "好运",
      "你非常棒",
      "真酷",
      "哦了",
      "酷",
      "向上",
      "去吧",
      "一切顺利",
      "不要放弃",
      "把握今天",
      "番茄",
      "再见"
    ],
    "en": [
      "Life is beautiful",
      "Follow your heart",
      "Dream big",
      "Good luck",
      "You're amazing",
      "How cool",
      "Olé",
      "Cool",
      "Up",
      "Let's go",
      "All good",
      "Don't give up",
      "Seize the day",
      "Tomato (take it easy)",
      "See you later"
    ]
  }
}
};

  // 国家代码 -> 时区（用于“时区”字段；未命中时回退到 UTC）
  // 多数国家仅单一时区；跨时区国家（美国、加拿大、法国、西班牙等）列出全部 IANA 时区标识符
  var TIMEZONES = {
    china: 'Asia/Shanghai',
    us: [
      'America/New_York',       // Eastern Time
      'America/Detroit',        // Eastern Time - Michigan
      'America/Kentucky/Louisville', // Eastern Time - Kentucky (Louisville)
      'America/Kentucky/Monticello', // Eastern Time - Kentucky (Monticello)
      'America/Indiana/Indianapolis', // Eastern Time - Indiana
      'America/Indiana/Vincennes',    // Eastern Time - Indiana (Vincennes)
      'America/Indiana/Winamac',      // Eastern Time - Indiana (Winamac)
      'America/Indiana/Marengo',      // Eastern Time - Indiana (Marengo)
      'America/Indiana/Petersburg',   // Eastern Time - Indiana (Petersburg)
      'America/Indiana/Vevay',        // Eastern Time - Indiana (Vevay)
      'America/Chicago',        // Central Time
      'America/Indiana/Tell_City',    // Central Time - Indiana (Tell City)
      'America/Indiana/Knox',         // Central Time - Indiana (Knox)
      'America/Menominee',      // Central Time - Michigan (Menominee)
      'America/North_Dakota/Center',  // Central Time - North Dakota
      'America/North_Dakota/New_Salem', // Central Time - North Dakota (New Salem)
      'America/North_Dakota/Beulah',   // Central Time - North Dakota (Beulah)
      'America/Denver',         // Mountain Time
      'America/Boise',          // Mountain Time - Idaho
      'America/Phoenix',        // Mountain Standard Time - Arizona (no DST)
      'America/Los_Angeles',    // Pacific Time
      'America/Anchorage',      // Alaska Time
      'America/Juneau',         // Alaska Time - Juneau
      'America/Sitka',          // Alaska Time - Sitka
      'America/Metlakatla',     // Alaska Time - Metlakatla
      'America/Yakutat',        // Alaska Time - Yakutat
      'America/Nome',           // Alaska Time - Nome
      'America/Adak',           // Hawaii-Aleutian Time - Adak
      'Pacific/Honolulu'        // Hawaii Time (no DST)
    ],
    japan: 'Asia/Tokyo',
    uk: 'Europe/London',
    germany: 'Europe/Berlin',
    france: [
      'Europe/Paris',           // Metropolitan France
      'America/Guadeloupe',     // Guadeloupe
      'America/Martinique',     // Martinique
      'America/Cayenne',        // French Guiana
      'Indian/Reunion',         // Réunion
      'Indian/Mayotte',         // Mayotte
      'Indian/Kerguelen',       // Kerguelen Islands
      'Indian/Comoro',          // Comoro Islands (Scattered Islands)
      'Indian/Mahe',            // Scattered Islands (Europa, Juan de Nova, etc.)
      'Pacific/Tahiti',         // French Polynesia - Tahiti
      'Pacific/Marquesas',      // French Polynesia - Marquesas
      'Pacific/Gambier',        // French Polynesia - Gambier
      'Pacific/Noumea',         // New Caledonia
      'Pacific/Wallis'          // Wallis and Futuna
    ],
    italy: 'Europe/Rome',
    spain: [
      'Europe/Madrid',          // Mainland Spain, Balearic Islands, Ceuta, Melilla
      'Africa/Ceuta',           // Ceuta, Melilla (same as Madrid)
      'Atlantic/Canary'         // Canary Islands
    ],
    canada: [
      'America/St_Johns',       // Newfoundland Time (NL)
      'America/Halifax',        // Atlantic Time (NS, PE)
      'America/Glace_Bay',      // Atlantic Time - Nova Scotia (Cape Breton)
      'America/Moncton',        // Atlantic Time - New Brunswick
      'America/Goose_Bay',      // Atlantic Time - Labrador
      'America/Blanc-Sablon',   // Atlantic Standard Time - Quebec (Blanc-Sablon, no DST)
      'America/Toronto',        // Eastern Time (ON, QC - most)
      'America/Nipigon',        // Eastern Time - Ontario (Nipigon)
      'America/Thunder_Bay',    // Eastern Time - Ontario (Thunder Bay)
      'America/Iqaluit',        // Eastern Time - Nunavut (Iqaluit)
      'America/Pangnirtung',    // Eastern Time - Nunavut (Pangnirtung)
      'America/Atikokan',       // Eastern Standard Time - Ontario (Atikokan, no DST)
      'America/Winnipeg',       // Central Time (MB, SK - most)
      'America/Rainy_River',    // Central Time - Ontario (Rainy River)
      'America/Resolute',       // Central Time - Nunavut (Resolute)
      'America/Rankin_Inlet',   // Central Time - Nunavut (Rankin Inlet)
      'America/Regina',         // Central Standard Time - Saskatchewan (no DST)
      'America/Swift_Current',  // Central Standard Time - Saskatchewan (Swift Current, no DST)
      'America/Edmonton',       // Mountain Time (AB, NT, BC - east)
      'America/Cambridge_Bay',  // Mountain Time - Nunavut (Cambridge Bay)
      'America/Yellowknife',    // Mountain Time - Northwest Territories
      'America/Inuvik',         // Mountain Time - Northwest Territories (Inuvik)
      'America/Creston',        // Mountain Standard Time - BC (Creston, no DST)
      'America/Dawson_Creek',   // Mountain Standard Time - BC (Dawson Creek, no DST)
      'America/Fort_Nelson',    // Mountain Standard Time - BC (Fort Nelson, no DST)
      'America/Vancouver',      // Pacific Time (BC - most, YT)
      'America/Whitehorse',     // Pacific Time - Yukon
      'America/Dawson'          // Pacific Time - Yukon (Dawson)
    ]
  };

  FakeID.profile = { pools: PROFILE, timezones: TIMEZONES };
})(window);