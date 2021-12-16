
function weather (data) {
    var dateDayname = document.getElementById('date-dayname');
    var dateDay = document.getElementById('date-day');
    var location = document.getElementById('location');
    //天气图标
    var weatherL = document.getElementById('weather-1');
    var weatherTemp = document.getElementById('weather-temp');
    var weatherDesc = document.getElementById('weather-desc');

    dateDayname.innerHTML = data.data[0].day.slice(4,7);
    dateDay.innerHTML = data.data[0].date;
    location.innerHTML = '&#xe600;'+data.city;
    weatherL.innerHTML = weatherIcon()
    weatherTemp.innerHTML = data.data[0].tem;
    weatherDesc.innerHTML = data.data[0].wea_day;

    //封装判断天气与图标对应的函数
    //t 第t天
    function weatherIcon (t) {
        if (data.data[t - 1].wea_img.search('qing' != -1) ) {
            return "&#xe61f;";
        }
        if (data.data[t - 1].wea_img.search('yu' != -1) ) {
            return "&#xec6a;";
        }
        if (data.data[t - 1].wea_img.search('duoyun' != -1) ) {
            return "&#xe61d;";
        }
        if (data.data[t - 1].wea_img.search('dayu' != -1) ) {
            return "&#xec6a;";
        }
        if (data.data[t - 1].wea_img.search('yin' != -1) ) {
            return "&#xe610;";
        }
    }

}
window.onload = function () {
    // https://api.asilu.com/weather/?city=${"北京"}&callback=weather
    // APPID
    // 84532775
    // APPSecret
    // I2l6vzON
    //weather({
    // 	"cityid": "101010100",
    // 	"city": "\u5317\u4eac",
    // 	"update_time": "12:06",
    // 	"wea": "\u6674",
    // 	"wea_img": "qing",
    // 	"tem": "3",
    // 	"tem_day": "4",
    // 	"tem_night": "-7",
    // 	"win": "\u897f\u5317\u98ce",
    // 	"win_speed": "4\u7ea7",
    // 	"win_meter": "22km\/h",
    // 	"air": "30"
    // })
    //https://www.tianqiapi.com/free/day?appid=84532775&appsecret=I2l6vzON&unescape=1
    //https://www.tianqiapi.com/free/day?appid=84532775&appsecret=I2l6vzON&city=%E5%8C%97%E4%BA%AC&callback=weather
    var btn = document.getElementById('location-button');
    var city= document.getElementById('city');

    btn.onclick = function () {
        if (city.value) {
            var script = document.createElement('script');
            script.src = `https://v0.yiketianqi.com/api?unescape=1&version=v9&appid=84532775&appsecret=I2l6vzON&city=${city.value}&callback=weather`;
            //js加入页面
            document.body.append(script);
        } else {
            alert('请输入查询城市!')
        }
    }

}

