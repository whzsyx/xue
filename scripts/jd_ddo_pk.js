/*
京享值PK
cron 15 0,6,13,19,21 * * * ddo_pk.js
更新时间：2021-6-8

本次更新添加了为ddo助力（助力不够了啊，就内置一个，大家肯定不会介意的吧，嘻嘻

活动入口：京东APP-我的-京享值
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京享值PK
15 0,6,13,19,21 * * * https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js, tag=京享值PK
================Loon==============
[Script]
cron "15 0,6,13,19,21 * * *" script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js,tag=京享值PK
===============Surge=================
京享值PK = type=cron,cronexp="15 0,6,13,19,21 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js
============小火箭=========
京享值PK = type=cron,script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js, cronexpr="15 0,6,13,19,21 * * *", timeout=3600, enable=true
*/
const $ = new Env('京享值PK');
$.toObj = (t, e = null) => {
    try {
        return JSON.parse(t)
    } catch {
        return e
    }
}
$.toStr = (t, e = null) => {
    try {
        return JSON.stringify(t)
    } catch {
        return e
    }
}
const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
let cookiesArr = [],
    cookie = "",
    message;
let minPrize = 1;
let bcomplate = false;
let ydpk = false; //true 获取云端pin列表, false 默认使用本地
$.pinList = [
  'db9223a0dceaf1777299fd6326a0f6940f296a206a12473f57d63d95f3be0534',
  '83cf362bb6dbae39b51c59f714a408bb0f296a206a12473f57d63d95f3be0534',
  '5a0989f1d970fab93d15f21f1825fcf4',
  'b4fe7ab978b20b34c6975e2a0441496a',
  '617553f9764c3aa7ea9717d795d364e40f296a206a12473f57d63d95f3be0534',
  '0e9fd067791a81a89dd5fd731dd509270f296a206a12473f57d63d95f3be0534',
  '6edc3641bb16acd517c7351c74a0eac0fd0ae600a537b99c53c5a80ba4ab77a2',
  '3115b957ddb8fde1463c74f45c0ea10a',
  '2c62748ad83306bd4981b501f7313f260f296a206a12473f57d63d95f3be0534',
  '756481d35ce37d61b0d5c02cf83566fe',
  'a88b8699419990fc504cdede23a435ef0f296a206a12473f57d63d95f3be0534',
  '8c8a1b10abacf0bb4a80cd8daf2de7cf',
  '6af5b6f70dc3cf6754cbc5c7e7ecb7c00f296a206a12473f57d63d95f3be0534',
  'a0612c902ad112f1c5db0ae0916a5325',
  'f3aab6c51bf693006de96f450d3c104f0f296a206a12473f57d63d95f3be0534',
  'b731057a3daed8192e1663223019e1b20f296a206a12473f57d63d95f3be0534',
  '4a0b18bb540b582d2c790d789f50bbdd',
  '8923b9c7101061cb7af464e76f0a0fa40f296a206a12473f57d63d95f3be0534',
  'a28ec09458373d7cde070b03dccd5463',
  '1dd134e979d62e44fa73d6df62209d670f296a206a12473f57d63d95f3be0534',
  '60feaf943bf3a71f9447fcd1ee306a670f296a206a12473f57d63d95f3be0534',
  'edd6c5724ea33f3df8d864f45d960d9c0f296a206a12473f57d63d95f3be0534',
  'bd8c76fc24eae98d3158fd4fd9913560',
  '3779ee478088974a6fbc29ca95e46b47',
  'ba8c38a4af6bb8d92bcfc0675904e2c70f296a206a12473f57d63d95f3be0534',
  'be5176958054c4ade5e27e4c722c9e72',
  '17092a11f7f5e85cf8394cdbff7248580f296a206a12473f57d63d95f3be0534',
  '750f2755d739a70cd5999c12f6952cdd',
  'ae4a472f0a45213bdebbd88b27d85e2c0f296a206a12473f57d63d95f3be0534',
  '2c951fd8bca657d1274f13482b457797',
  'b5dcee85931184a8dfe57d04c1f2b5e70f296a206a12473f57d63d95f3be0534',
  '37d62a145149bc8ebdfaa42e4a2b8e580f296a206a12473f57d63d95f3be0534',
  'e6d18cedbe0b59c7db5f3f0d8a42622b',
  '38fb520daebbc3170f5e925fcc69bec30f296a206a12473f57d63d95f3be0534',
  'bbd85c9d302463b82fe34eae80a600c5',
  '67757758679b6f93a0e81abafeb229050f296a206a12473f57d63d95f3be0534',
  '9f0edd055d12d28235a3e8bf8b1c3cc6',
  'b4a046f324cefa33842239c0d2a257e1',
  '6f2b033a8ba75ffd52274ad2cc40075b',
  'e362becb6c5db6ac5d3f86b0f85d7dc8',
  '4c3a725f797ef3cf9c33847709ae34d40f296a206a12473f57d63d95f3be0534',
  '0937640309ddc55b11561959fd531fab',
  '36a175fdb974b1362d9198097f097766',
  '3fbabcf985c30c23e2799fc75dd9864f0f296a206a12473f57d63d95f3be0534',
  '89f644a2a63d83f0018cc2f2ed49bdef',
  '0602cef677f8898a61d0a35ebb42dbd7',
  'c18ed14e790f59b5e3f209ef52c79e5c',
  'fa29e723d695d10d447938614c03827a',
  'd1824be7be9fefa48532bfca1400eec3',
  '945dd541c3e66492bca3d77141c92af50f296a206a12473f57d63d95f3be0534',
  '3327086ae8c55414bd1184e19254d8e00f296a206a12473f57d63d95f3be0534',
  'bbe1884692f8e6e114614a0be08dee0e0f296a206a12473f57d63d95f3be0534',
  '4ac430cb33f54134a26aed4065c2c4ef',
  '17c7abbc3d925586c557cd24092e07120f296a206a12473f57d63d95f3be0534',
  'c726fb8a9d14a0b72d4c703a88b1e0cb0f296a206a12473f57d63d95f3be0534',
  '60cae27726b9742f311321761e89c676',
  'a1985e118b886e644fe1e8f909c7b585',
  '94a3ed3e2fed006a8212dd9fd9dbf1c8',
  'ce9056821b9834562b3117fade0733c50f296a206a12473f57d63d95f3be0534',
  '211e87cb88a710b856e4dde00bde056a',
  '51c8d479e2ddef2fc4b181cc8151b7180f296a206a12473f57d63d95f3be0534',
  'ba68e008b35d49c7952ae59c5beb1eac',
  '0036b21ccb0535fc5d6c4e2dafa38745',
  '86098279139e5d13daa4493ccce09394',
  '7954274923e406c9645474f27cc15866b7ec6b7b8347f259593027aa8da0ff4e',
  'ce54a7ef2f56bd304a16a110fc5887ea0f296a206a12473f57d63d95f3be0534',
  'ab6c03e1ad9a667594f375b26e18721d0f296a206a12473f57d63d95f3be0534',
  'c4a84ea33842b865958beac2c33464ad',
  '34677111d781ed5cf978ae28260277240f296a206a12473f57d63d95f3be0534',
  '260ec145849a21ba6281c6fa27c02a5a0f296a206a12473f57d63d95f3be0534',
  'f1074486a7d5dfc7555d78a90e1ce97c0f296a206a12473f57d63d95f3be0534',
  '20b1cb87dbf45d1e6dfa84436f05e654',
  'a2b6c46929c00b057aa8e11e763598e00f296a206a12473f57d63d95f3be0534',
  '8a867b8073ec93634a2d1b5e40c8a70a',
  '78b12a7d111a9a9760bb6e4d820c733c',
  'dfa528e74a90a1eb4dd8776efcd23ff90f296a206a12473f57d63d95f3be0534',
  '84f734d3d111c0c4c87c18fc88316c02',
  '0d7ebc6e1a68850ca320a4dbeca5151a',
  'a7e60f9b699e69d356d378b3ec0f8c5d',
  '8e9c73848e9170f0b7fd81f9533e5c2c0f296a206a12473f57d63d95f3be0534',
  '1594763913717d91fffd789939818e20',
  '68b3d0ebd778615da658f8b6b962a9d3',
  '426e397a8d5a1e134e7bf8ff6e9a61af',
  'f545825ded560f6d3ca6639d838c176f0f296a206a12473f57d63d95f3be0534',
  '0d0bef381b6668afaacbb45879e8c43a',
  'cc46b275b624b011f3f82c21a6921c270f296a206a12473f57d63d95f3be0534',
  '7422eb8698545b9c7c2d4f455c3e390d',
  '55b8127d235104279c0f734ca441fe2a',
  '70c60c815e071ae1eeed3a3c8c2ecb11',
  'c57193f4e5319207ba0ae149423afa3f',
  '0d2b1c03e1ae4f4a4dac7f8bab3936170f296a206a12473f57d63d95f3be0534',
  '33a5a4f52b87b8fbc3cf3b221a7d6597',
  '40fbb8e31adc91fcf87453071a2145a9',
  '6bc8774df950855079647a93b20245020f296a206a12473f57d63d95f3be0534',
  '634248e61e2126b7a56515a96c110a00',
  '4f9105805f7b73a7a6918f9c1a435e390f296a206a12473f57d63d95f3be0534',
  'de6623c004a2e93ebba73af395c25628',
  '23be85d1aea60f50bd253c58504c03f8',
  '8fc4dd7f5e9ac253dec9d560bc65ff88',
  'b62d112fe3081fff93a7ba69f9af4f2a0f296a206a12473f57d63d95f3be0534',
  '2b0b6d90281bafa7d587ba35c2be1cb4',
  '1495ae997361d48f0ea74acd26c797f0',
  'ad1ed5f99931bcd6a51057d3279e4c730f296a206a12473f57d63d95f3be0534',
  '665dbd1c073c4ed530b61411f0be856d0f296a206a12473f57d63d95f3be0534',
  '095d5489ec9830ace68edc4754a88265b7ec6b7b8347f259593027aa8da0ff4e',
  '5a30d19035fb9ee035806920843d221f',
  'ba499ff90b235f87952672c363b8813d0f296a206a12473f57d63d95f3be0534',
  '0f43de73f8bc8497c1922e84cd86ad500f296a206a12473f57d63d95f3be0534',
  '7925fa2f39caafd03d74f5955c0e60bc',
  'c5c124a3c5caa59ec418c17c2ffe273c',
  '35832725754d1a801221ae81a4c840df',
  '4aa1851fa207dfeee682a6be3c3e2559',
  'dc721ca67b2dbcacc8783f770ec58fbc',
  '0e254ecb0bf81298469fa0c91d47169c',
  '065c019c5c0dcfbfcd572cf7b14afb9f',
  '1420dcd19d3db24c69c27551952dfb4d0f296a206a12473f57d63d95f3be0534',
  '94e57fefce7c7ef532a4c8a7a75ca2cc0f296a206a12473f57d63d95f3be0534',
  'fe97292bcf3218d93a3d37c5ca28b45e',
  'e3b4f581311a25c96bf4b36ec2dc2f61',
  'eeb05204f9552b770e92f01729ddc9340f296a206a12473f57d63d95f3be0534',
  'fe6a44544dcd2d600bcbffa1e03cb8be0f296a206a12473f57d63d95f3be0534',
  'fbd347da484d794305aa2df54b37e686',
  'c2a9b018061062d0a98eae27b0117c15',
  '6eba33f52240f0f6946f1ba2ab9a80c30f296a206a12473f57d63d95f3be0534',
  '21265835d8f714eb4a71c793d16c619e',
  '8985ab770a876ca3000a6c74272e200e',
  '3d872fd0d8c4381546c85a04a1ec55290f296a206a12473f57d63d95f3be0534',
  '1a400cd9a2838cbd4b55aa172b144f6a',
  '31d6c12dc5d4ad04f58dc02671d7d0330f296a206a12473f57d63d95f3be0534',
  '5888afe5bba3ab7d8737dd603a45e73a',
  '3c1593add299e2943d4b7119e2a20716',
  'f055ef76f1765a228f1befcef6bfc1760f296a206a12473f57d63d95f3be0534',
  'a26e247cdf593d47381f255bd78f546a',
  '563ab41222050bd8a1430700620704bd',
  'f815b90a70e57891519297f45155be26',
  '5578319ef4915cd39d903fca606fcda5',
  'ae53f0ed2fc377b2092b3bda4c0c40e7',
  'adb1208fee8036d65c90e7efe6c5d2d30f296a206a12473f57d63d95f3be0534',
  '3202322e82104c891a8cc44f1de2adf1',
  'fe14bc1bc37a5ff740a2ce1d11b844490be96cb5d975757d67b837453081cb39',
  'ac7d2211634be46a9d960892f273eba80f296a206a12473f57d63d95f3be0534',
  '5e00ee52da06306469b9ec7456b178ae0f296a206a12473f57d63d95f3be0534',
  '0603929a42e39e1d20fe79e4ba2fa89e',
  '1a122c6ab0369b2f5a85e5ad8982cafd0f296a206a12473f57d63d95f3be0534',
  'f0b5b9f5ff9016b0bd36e9e9b01b19e30f296a206a12473f57d63d95f3be0534',
  '0e76c1eb9352857a2d6cc0ff00fb0a31',
  'c2227be6156918e6443ff37e27d28bd60f296a206a12473f57d63d95f3be0534',
  '6032915e521157cc010ba839abe963650f296a206a12473f57d63d95f3be0534',
  '099581bba6e06cb72aeb7ad78df12248',
  '35a2c2f70a9c7b3b9c8ffd26bc6a68940f296a206a12473f57d63d95f3be0534',
  'd4a51aaa980979f721b1083f961d2222',
  '65f2cdfd30aa78abc392cd96877e63a40f296a206a12473f57d63d95f3be0534',
  'a8cc5a3bdcde8a772be4a42a8d400e37',
  '2d4de5aacd45539abb2bfda9f75f58680f296a206a12473f57d63d95f3be0534',
  '9789e2b88569ca7e2b150a281479924b0f296a206a12473f57d63d95f3be0534',
  '3d3631601631e2ce77d70a1f4dea39db',
  '28262f7cbe97545eb69570c14c19af3f',
  'd7a9a64915cac3da3f1e5634409fec82',
  '56f42aa84174f3c604e5c7c06134afa70f296a206a12473f57d63d95f3be0534',
  'e3d22fc79542abb8dde3b98928a3b6af0f296a206a12473f57d63d95f3be0534',
  '2f51c0fb535165d1f52d67f8ff9d7da6',
  'daa5320b939e344157ce4cf53af6d08f0f296a206a12473f57d63d95f3be0534',
  'f0df8006cbc5b6b4bca013b944bd5994',
  '38dc173e9a48005c962d058a84d714b40f296a206a12473f57d63d95f3be0534',
  '00d5b3f73cf17310e60d0c97220758380f296a206a12473f57d63d95f3be0534',
  '323352ddf1973b6f1926b8e70e97baa2826efaeae8c4431eebaaf98639468273',
  '34c655cb0e5d4326f34b606bd2a08e500f296a206a12473f57d63d95f3be0534',
  'ccdfb1f90a098624aec9a83e6531ed03',
  '112ff9f635ea6dcec14beba2ffcccd78',
  'e6022668788757b610029ccadeb4c6950f296a206a12473f57d63d95f3be0534',
  '96deecc9f2d60349a62d2b8a3b39756f',
  '1860093c4fa52a5ccb89a7d53280a3e3',
  'd79956fef0103107333149bbccab27400f296a206a12473f57d63d95f3be0534',
  'c0b47e9accff763b0ac4d259ae1ac8680f296a206a12473f57d63d95f3be0534',
  '8ca4a0c0e60e0c0b6a7b8670869af7d2',
  'e6e57e2ca272b3ef023c6cb29d0ac356',
  '867099307277b3d2fdae05158ae624ec',
  '83fce80083df085a096527f1b93be383',
  '3a439797f10b3dcde716c1c37de4c3b8',
  '99b31c3f3e99d9281d9700c7013ac2620f296a206a12473f57d63d95f3be0534',
  '812f1c9b8c4a801fa89bbfe5cd3fdf8e',
  '0769fa218f42dc4c93abb201448a039a',
  'ef1051d5dfc91c84bc096268957d254c0f296a206a12473f57d63d95f3be0534',
  '812073ddd5786a1eb40fd9dd7fd19e22',
  '48c0a90c879fb73c3b5dee917a53c417',
  '05169afc275d5ca917778261e803ee38',
  '1824d8833339fa8ea6620cb8951290db',
  'a5a7c277e16906b6d97cf026ebca814e',
  '0a2c67fb110346ad82f757956ff15b45',
  'ecea52a7741ac608f9819444639e0a74',
  'cd0c341bf21a1561118ea222c4d012df',
  '646d537efdbcf6c134e9fc6950314812b7ec6b7b8347f259593027aa8da0ff4e',
  'be115a450da8dc6e6c7cc4cea220856b',
  '2c951fd8bca657d1274f13482b457797',
  '8305d7f3d19fb3d2fb9844f74269e8ec0f296a206a12473f57d63d95f3be0534',
  'b344728de7b0ca736f9202f5d3defe0a0f296a206a12473f57d63d95f3be0534',
  '463f2ee0315c4d81e6d3a3adc38d66ec',
  'b254ee8b689d371069ce91f7b556a8b80f296a206a12473f57d63d95f3be0534',
  '4e355a08d759b6ff1b23d41237d9cf96',
  '51d0f1f960adaccd9163f04d7dc524970f296a206a12473f57d63d95f3be0534',
  '08e5e0268be3b70a8e5baa16aa5e3126',
  '21e6014a5c156eda90f794f63a1ff6920f296a206a12473f57d63d95f3be0534',
  'f6d4cac8a0436d630ee46641b799b2a7',
  'd61a0f7e96a9bd829e9dd83b701fdee2a48032725a565e99de2bff1348877065',
  '27491831b6ff507e9a37393bfe62a00a0f296a206a12473f57d63d95f3be0534',
  '01e91111093660e09e7340e3f017a0610f296a206a12473f57d63d95f3be0534',
  '7a7230c1de4dac699102451e67a7ae4a',
  '91776ebe3b06b8343ede04f1cc3c6c5b0f296a206a12473f57d63d95f3be0534',
  '96267e5a130e1bbc1684f44c46d2de57',
  '24d2bd7a8f1e57e97e3c34c803d9797d',
   '891c81690e0b79c8a99c0108cc844aa9',
  '68c7db5f0d4933c223d002c4312bdbc3',
  '4b363aac4904222fbe5c36facb0298130f296a206a12473f57d63d95f3be0534',
  '70f2c55f8852c98014dbb3aa94d8a5200f296a206a12473f57d63d95f3be0534',
  'db970cd4a2947b5f28db807dfe378cc0',
  '124c01a74f1fd8c87a98ec0ec4cc5e95',
  '2954562d38b52ea692bbe8d30bb928860f296a206a12473f57d63d95f3be0534',
  'bab0b064decb66407c640331d0bd9c99',
  '931f9102ec3554ab9a145ad9d8753287',
  '1e6044e292c2547fec5a3485f33b565b0f296a206a12473f57d63d95f3be0534',
  '679241bc14a85c95310bb39c53b6956d0f296a206a12473f57d63d95f3be0534',
  '0356d173e041b74c6012ad000aa5e764',
  '414a4d90eab8f5ab3933b1450e1e6d5f',
  'f8684ca96eaa8de49501f0eb58a88b10',
  '32d7b318693f59caf28528e7a18f6f6c0f296a206a12473f57d63d95f3be0534',
  'f0df6b9ca906042e9cc505eaf8a6ff7f',
  'bbcab1d479420fb6a7fa859fd2c20a0a0f296a206a12473f57d63d95f3be0534',
  '6d76394078974362bc21fce1fc21eb530f296a206a12473f57d63d95f3be0534',
  'db1814bfa491ba3089349f030299e1f6',
  'b500173e4744a2eabc8848b392fdce97',
  'f763b39b626ef27dc6d2f94b3c1c040c0f296a206a12473f57d63d95f3be0534',
  '5bf6eee9fad7eb7cff698c187dd606380f296a206a12473f57d63d95f3be0534',
  'cf93057e468665418709960333722db70f296a206a12473f57d63d95f3be0534',
  '949008b2681ed7989895dde07db8f75b0f296a206a12473f57d63d95f3be0534',
  '0b90978f32f15df4771ebba4c513d1e10f296a206a12473f57d63d95f3be0534',
  '5cf30860280741285e7d8c6c434fec8d',
  '47c25cf44b08a5e9628449eb29febaf7',
  'a1eeee06b936094b551b80ef92fd4523',
  'cb08ec6032cdbafc225a1017f37cdab6',
  '9b28e69e27212b3e98a6feea8d03723a',
  '72075d6f54422048f8317060a099f5630f296a206a12473f57d63d95f3be0534',
  '801877548fd44bd20e31505ac66d18080f296a206a12473f57d63d95f3be0534',
  '149aed7af1493c2c69894dabdab07396',
  '13b898517273e7444026b85609767d7f0f296a206a12473f57d63d95f3be0534',
  '954461894d41b6d08d3b73b3704a36b4',
  '033d978dc52bc0f7a41864126f2a95c00f296a206a12473f57d63d95f3be0534',
  'ed0c92aca8ba9fe1fb409850845e041c',
  'a3c76538603b92e45787f6b158fa6416',
  'e8c4f6ee6e12a09399e1ff4850777b85',
  'bdb5070cbe95b5fbff3b15fdec220615',
  '431d9e37f990f8876d7653ab36e202b40f296a206a12473f57d63d95f3be0534',
  '8323b537b5b167035470fb855f0b6254',
  '1f5c165892c39ee22460bec5ae2da81d0f296a206a12473f57d63d95f3be0534',
  '577f2f08b2c5cb9a539134b491f61a07',
  '7b5f6df5af286affe0b82ee87990be9e0f296a206a12473f57d63d95f3be0534',
  'e869b78731c010b251836e5073e2e228',
  'cc5ec2cbcbc0b4c6c117d9fdea5d4c42',
  'fb8e3e61d8986655b7a275213d5640948272bf544eabe8440069abd921740fd4',
  '088af0a2a1044e4b58d6f59dba63976b0f296a206a12473f57d63d95f3be0534',
  '5cb0c3f41698f2e2d37acde84503cb0a',
  'b617292b29fe14b6bf0123c0c50e36590f296a206a12473f57d63d95f3be0534',
  'db6b6f9b16dc0a036a3ad7d7e5301a020f296a206a12473f57d63d95f3be0534',
  'f76f81880c65ebb57629b05108fd94ba',
  '36e888344fe483b7738d3dc4ad6e7803',
  '7a85d59738aebb0f0632ea5fa8864bda',
  '49008d407e32d3ce8225830a48af91a4',
  '58bc4d0e459ec3906e811108b88fa117',
  '15a5489c87f75ac867b6cb88da0dd42d',
  '0d0bef381b6668afaacbb45879e8c43a',
  'f91463f7737e83bb800f152da26093bb',
  '33e00fb95badb2a6421204918d68d32b',
  '158748337110929e24c7195274c3b8aa',
  '66a3c30a1eb65ad9a6a779c87b3a905c0f296a206a12473f57d63d95f3be0534',
  '0b90978f32f15df4771ebba4c513d1e10f296a206a12473f57d63d95f3be0534',
  '3baa3555ffc8f215aafc523efb6bb1c50f296a206a12473f57d63d95f3be0534',
  '38b2a03602b16fd54a4634e192dd5a79',
  'ceef3511ab85d555a30d7cad430f8e82',
  '8e7402a28098f5c65dd9ff2d4b23e4b7',
  '804110e286b480d64cea7a84191f4d23',
  '1d01a95d2662fa4283ee0ea36781594a',
  '65e994c42a407ac14b88bba8571ddb91',
  '47c96201d0b6947a16449e772002a7f20f296a206a12473f57d63d95f3be0534',
  'd2cdb13a70a94c0535282355534521f4',
  'f96d78c816338d4f4394bbff44f02a020f296a206a12473f57d63d95f3be0534',
  '444c47db15d48c1ea7af1aaa8a256c390f296a206a12473f57d63d95f3be0534',
  '00ad6499ab922dcf05081fb6f813e3710f296a206a12473f57d63d95f3be0534',
  '85d915f3ee2d67ff206251f5c319cda9',
  '1fa6e501d808b0a95e2297717604564c',
  '34d5306c38bc9b2eba3d9923987c8e8e0f296a206a12473f57d63d95f3be0534',
  'a1403ed27b46141a291ea8fb52955c7d',
  'c0d40ee46d799ecbd61095f228cfc82c',
  '45aa8bad11716f7d6bf9237969afe9aa',
  '189ff0faeabbdd8a1d75cd80c24c5166',
  '6a3e401272250b7227e05f61027fa7d8',
  '3991ca707870c3ee5fd64321f3e94b50',
  'ea81605cd9371cb847fc5776ea506da60f296a206a12473f57d63d95f3be0534',
  '3f706b1576bf45fd04c6b25ee8f8e12b0f296a206a12473f57d63d95f3be0534',
  '188b34f4f5eb807bf53f9dc2b202202b',
  '73c0d9d6e84a3ba07ef9a65531453e760f296a206a12473f57d63d95f3be0534',
  '0fc727254f868da9433dc7389b066efb'
]

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
    ].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
let authorPin='7338758317f7df3c98153ba5e97ec8490f296a206a12473f57d63d95f3be0534';
$.helpAuthor=true;



!(async () => {
    if (!cookiesArr[0]) {
        $.msg(
            $.name,
            "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
            "https://bean.m.jd.com/", {
                "open-url": "https://bean.m.jd.com/"
            }
        );
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(
                cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
            );
            $.index = i + 1;
            message = "";
            console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
            await main()
        }
    }
})()
    .catch((e) => {
        $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
    })
    .finally(() => {
        $.done();
    });

function showMsg() {
    return new Promise(resolve => {
        $.log($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
        resolve()
    })
}

async function main() {
    await getToken();
    console.log("当前token：" + $.token);
    if ($.token) {
        await getPin();
        if ($.pin) {
            console.log("当前pin（pk码）：" + $.pin);
        }
		if(ydpk){
			console.log('获取云端pin码列表');
			await getPinList(30); // 获取的pin列表
		}else{
			 console.log('启动本地pin码挑战');
		}
        let myScore=await getScore($.pin);
        await submitPKCode($.pin)
        console.log("我的京享值:"+myScore);
        if($.helpAuthor){
            let authScore=await getScore(authorPin);
            console.log("ddo的京享值:"+authScore);
            if(authScore < myScore){
                console.log('让ddo帮我一次');
                await launchBattle(authorPin);
                await receiveBattle(authorPin);
            }else{
                console.log('淦，分没ddo高，不挑战了');
            }
        }
        if($.pinList){
            console.log($.pinList)
            for(let i = 0; i < $.pinList.length ; i++){
                if(bcomplate){
                    break;
                }
                else{
                    let pin = $.pinList[i];
                    console.log('别人的的pin：' + pin)
                    let fscore=await getScore(pin);
                    console.log("别人的京享值:"+fscore);
                    if(fscore<myScore){
                        await launchBattle(pin);
                        await receiveBattle(pin);
                    }

                }

            }
            bcomplate =false;
        }
        await getBoxRewardInfo();
        console.log("去开宝箱");
        if($.awards){
            for(let index=0;index<$.awards.length;index++){
                let item=$.awards[index];
                if(item.received==0){
                    if($.totalWins>=item.wins){
                        await sendBoxReward(item.id);
                    }
                }
            }
        }
    }
}

function submitPKCode (pin) {
    console.log(`上传pk码: ${pin}`);
    return new Promise((resolve) => {
        let options = {
            "url": `https://pool.nz.lu/api/v2/upload?name=PK&code=${pin}`,
            "headers": {
                "Host": "pool.nz.lu",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4433.0 Safari/537.36",
                "Accept-Language": "zh-cn",
            }
        }

        $.get(options, (err, resp, res) => {
            try {
                if (res) {
                    console.log(`${pin}上传成功`)
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    })
}

function getPinList(num = 20){
    console.log("获取Pk列表");
    return new Promise((resolve) => {
        let options = {
            "url": `https://pool.nz.lu/api/v2/get?name=PK&count=${num}`,
            "headers": {
                "Host": "pool.nz.lu",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4433.0 Safari/537.36",
                "Accept-Language": "zh-cn",
            }
        }

        $.get(options, (err, resp, res) => {
            try {
                if (res) {
                    let data = $.toObj(res);
                    $.pinList = data.data;
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}


function launchBattle(fpin) {
    console.log("发起挑战");
    return new Promise((resolve) => {
        let options = {
            "url": `https://jd.moxigame.cn/likejxz/launchBattle?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=${$.pin}&recipient=${fpin}&relation=1`,
            "headers": {
                "Host": "jd.moxigame.cn",
                "Content-Type": "application/json",
                "Origin": "https://game-cdn.moxigame.cn",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": "",
                "Accept-Language": "zh-cn",
            }
        }


        $.get(options, (err, resp, res) => {
            try {
                if (res) {
                    let data = $.toObj(res);
                    console.log(data);
                    if (data) {
                        data=data.data;
                        if(data.msg){
                            console.log(data.msg);
                            if(data.msg =="今日次数已耗尽"){
                                bcomplate=true;
                            }
                        }else{
                            console.log($.toStr(data));
                        }
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}

function getScore(fpin){
    console.log("查询"+fpin+"分数");
    return new Promise((resolve) => {
        let options = {
            "url": "https://jd.moxigame.cn/likejxz/getScore?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+fpin,
            "headers": {
                "Host": "jd.moxigame.cn",
                "Content-Type": "application/json",
                "Origin": "https://game-cdn.moxigame.cn",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": "",
                "Accept-Language": "zh-cn",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }

        $.get(options, (err, resp, res) => {
            let score=0;
            try {
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        score = data.data;
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(score);
            }
        })
    });
}

function receiveBattle(fpin) {
    return new Promise((resolve) => {
        let options = {
            "url": `https://jd.moxigame.cn/likejxz/receiveBattle?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=${$.pin}&recipient=${fpin}`,
            "headers": {
                "Host": "jd.moxigame.cn",
                "Content-Type": "application/json",
                "Origin": "https://game-cdn.moxigame.cn",
                "Connection": "keep-alive",
                "Accept": " */*",
                "User-Agent": "",
                "Accept-Language": "zh-cn",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }
        $.get(options, (err, resp, res) => {
            try {
                if (res) {
                    let data = $.toObj(res);
                    console.log(data);
                    if (data) {
                        data=data.data;
                        console.log("挑战成功");
                        if(data.state==1){
                            if(data.pkResult){
                                console.log("当前胜场:"+data.pkResult.fromWinNum);
                            }
                        }else{
                            console.log($.toStr(data));
                        }
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}

function getBoxRewardInfo() {
    return new Promise((resolve) => {
        let options = {
            "url": "https://pengyougou.m.jd.com/like/jxz/getBoxRewardInfo?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+$.pin,
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
            }
        }

        $.get(options, (err, resp, res) => {
            try {
                console.log(res);
                if (res) {
                    let data = $.toObj(res);
                    if (data.success) {
                        $.awards = data.data.awards;
                        $.totalWins=data.data.totalWins;
                        console.log("总胜场:"+data.data.totalWins);
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}


function sendBoxReward(rewardConfigId) {
    return new Promise((resolve) => {
        let options = {
            "url": "https://pengyougou.m.jd.com/like/jxz/sendBoxReward?rewardConfigId="+rewardConfigId+"&actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+$.pin,
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
            }
        }

        $.get(options, (err, resp, res) => {
            try {
                console.log(res);
                if (res) {
                    let data = $.toObj(res);
                    if (data.success) {
                        $.openAwards = data.datas;
                        if($.openAwards){
                            $.openAwards.forEach(item=>{
                                console.log('获得奖励:'+$.toStr(item));
                            });
                        }
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}

function getPin() {
    return new Promise((resolve) => {
        let options = {
            "url": "https://jdjoy.jd.com/saas/framework/encrypt/pin?appId=dafbe42d5bff9d82298e5230eb8c3f79",
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
            }
        }

        $.post(options, (err, resp, res) => {
            try {
                console.log(res);
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        $.pin = data.data
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}

function getToken() {
    return new Promise((resolve) => {
        let options = {
            "url": "https://jdjoy.jd.com/saas/framework/user/token?appId=dafbe42d5bff9d82298e5230eb8c3f79&client=m&url=pengyougou.m.jd.com",
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
            }
        }
        $.post(options, (err, resp, res) => {
            try {
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        $.token = data.data
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(res);
            }
        })
    });
}


function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}

function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
            return [];
        }
    }
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}