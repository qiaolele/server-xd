var noBack = false;
var second = 17;
var cutStart = false;
var ip = "";
var _UVUI;
var skinId = "";
var _partnerId = "";
var inviteCode = "";
var ua = navigator.userAgent.toLowerCase();
var ad = getQueryString("ad");
var PUBLIC_KEY =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCszw6hzlYNtZQe1WMf13UkjObTc1pjN+VZI1BsB5XYBBeD/RZM7C01WLXsZb60d3ScCpxqJM919A8XGZe1dFYq3oRckUQGJv4U+au8dxG6Eekqv0U6wRXZLGgoEwX3/Cwkj4OT1+RGGYSZu3JB367karRYPb2h4gNqiu0lvGBjuwIDAQAB";
// var agree = "";

var isWeixin = ua.indexOf("micromessenger") != -1;
var issafariBrowser =
  /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
$(function () {
  if (isWeixin) {
    tips("请点击右上角选择在浏览器打开");
  }
  if (getQueryString("p").length > 6) {
    _partnerId = decrypt(getQueryString("p"));
  } else {
    _partnerId = getQueryString("p");
  }

  inviteCode = getQueryString("i");
  if (localStorage.getItem("uvui")) {
    _UVUI = localStorage.getItem("uvui");
  } else {
    localStorage.setItem("uvui", _uuid());
    _UVUI = localStorage.getItem("uvui");
  }
  regEvent();
  skin();
  // $(".xy").on("click", function () {
  //   window.location.href =
  //     "https://dc-app-web.itkyd.com/agreement/%E5%BF%AB%E6%98%93%E8%B4%B7%E5%B9%B3%E5%8F%B0%E6%B3%A8%E5%86%8C%E5%8D%8F%E8%AE%AEonline.html";
  // });

  $(".btn_close,.shadow").on("click", function () {
    $(".shadow").hide();
    $(".toast").hide();
  });
});
/**
 * @param {*需要加密的字符串 注：对象转化为json字符串再加密} word
 * @param {*aes加密需要的key值，这个key值后端同学会告诉你} key
 */
function decrypt(word) {
  //解密
  // aes加密
  var key = CryptoJS.enc.Latin1.parse("eqYgjJlPJE2HvAYY"); //加密的key
  var iv = CryptoJS.enc.Latin1.parse("NxH6AaMiFkkOaXak"); //加密的iv
  var decrypted = CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
function goBack() {
  if (noBack == false) {
    // console.log("不返回");
    $(".shadow").show();
    var state = {
      title: "title",
      url: "/",
    };
    window.history.pushState(state, "title", "/");
  } else {
    // console.log("返回");
    $(".shadow").hide();
  }
}

function regEvent() {
  $(".codeImg").on("click", function () {
    //获取验证码
    const val = $(".mobilePhone").val();
    if (val.length !== 11) {
      tips("请输入正确的手机号");
      return;
    }
    // mobilePhone: $(".mobilePhone").val(),
    //   phoneSystem: navigator.userAgent.match(/Android/i) ? "Android" : "iOS",
    //   type: 1,
    //   code: -1,
    //   partnerId: _partnerId || "",
    //   skinId: skinId,
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    var str = {
      phone: $(".mobilePhone").val(),
      sendType: 1,
    };
    var encrypted = encrypt.encrypt(JSON.stringify(str));
    sendVerifiyCode({ sign: encrypted });
  });

  $(".mobilePhone").on("click", function () {
    if ($(this).val().length > 11) {
      $(this).val($(this).val().slice(0, 11));
    }
  });

  $(".mobilePhone").on("codeInput", function () {
    if ($(this).val().length > 6) {
      $(this).val($(this).val().slice(0, 6));
    }
  });
  $(".register").on("click", function () {
    const val = $(".mobilePhone").val(),
      code = $(".codeInput").val();
    if (val.length !== 11) {
      tips("请输入正确的手机号");
      return;
    }
    if (code.length <= 0) {
      tips("请输入正确的验证码");
      return;
    }
    register({
      phone: val,
      skinId: skinId,
      verifyCode: code,
      phoneSystem: navigator.userAgent.match(/Android/i) ? "Android" : "iOS",
      partnerId: _partnerId || "",
      inviteCode: inviteCode,
    });
  });
}
function sendVerifiyCode(param) {
  $.post("/app/v1/user/sendVerifyCode", param, function (info) {
    tips(info.data);
    if (info.code === 200 || info.code === 4005) {
      setTimer();
    }
    // if (info.code === 200) {
    //   tips(info.message);
    //   setTimer();
    // } else if (info.code === 4005) {
    //   showtips("正在为您下载app...");
    // } else {
    //   tips(info.message);
    // }
    //如果code是320就是老用户
    $(".imgCode").val("");
  });
}

function tips(tips) {
  $(".tips").html(tips);
  $(".tips").removeClass("hide");
  setTimeout(function () {
    $(".tips").addClass("hide");
  }, 3000);
}

function showtips(tips) {
  $(".tips").html(tips);
  $(".tips").removeClass("hide");
  setTimeout(function () {
    $(".tips").addClass("hide");
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var p = isAndroid ? "android" : isIos ? "ios" : "h5";
    if (p == "android") {
      window.location.href =
        "https://xindaiguanjia-app-prod.oss-cn-hangzhou.aliyuncs.com/package/android/manager_fapp.apk";
    } else if (p == "ios") {
      window.location.href =
        // "itms-services://?action=download-manifest&url=https://xindaiguanjia-app-prod.itkyd.com/package/ios/ios.plist";
        "https://apps.apple.com/cn/app/%E5%B1%95%E4%B8%9A%E5%B8%AE-%E4%BF%A1%E8%B4%B7%E6%8A%A2%E5%8D%95%E5%B1%95%E4%B8%9A%E8%8E%B7%E5%AE%A2%E5%B9%B3%E5%8F%B0/id1523244159";
      // showToast();
    }
  }, 2000);
}

function tips1(tips) {
  $(".tips1").html(tips);
  $(".tips1").removeClass("hide");
  setTimeout(function () {
    $(".tips1").addClass("hide");
  }, 5000);
}

function cutdown() {
  //倒计时
  cutStart = true;
  if (second == 1) {
    cutStart = false;
    second = 17;
    $(".btn").removeClass("btn_act");
    $(".btn_href").html("继续安装");
    return;
  } else {
    second = second - 1;
    $(".btn_href").html(second + "s后继续安装");
    setTimeout(() => {
      cutdown();
    }, 1000);
  }
}
//注册
function register(param) {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var p = isAndroid ? "android" : isIos ? "ios" : "h5";
  $.post("/app/v1/user/register", param, function (info) {
    if (info.code === 200 || info.code === 4005) {
      //成功之后判断是ios还是android跳转到不同的下载页面；
      if (p == "android") {
        window.location.href =
          "https://xindaiguanjia-app-prod.oss-cn-hangzhou.aliyuncs.com/package/android/manager_fapp.apk";
      } else if (p == "ios") {
        window.location.href =
          // "itms-services://?action=download-manifest&url=https://xindaiguanjia-app-prod.itkyd.com/package/ios/ios.plist";
          "https://apps.apple.com/cn/app/%E5%B1%95%E4%B8%9A%E5%B8%AE-%E4%BF%A1%E8%B4%B7%E6%8A%A2%E5%8D%95%E5%B1%95%E4%B8%9A%E8%8E%B7%E5%AE%A2%E5%B9%B3%E5%8F%B0/id1523244159";
        // 防止appStore被拒弹窗
        // showToast();
      }
    } else {
      tips(info.msg);
    }
  });
}

function showToast() {
  if (!isWeixin) {
    // 同时要弹窗
    $(".shadow").show();
    $(".toast").show();
    cutdown();
    $(".btn").addClass("btn_act");
    $(".btn_href").attr("href", "javascript:void(0)");
  } else {
    tips("请前往Safari浏览器打开此页面");
  }
  $(".btn").on("click", function () {
    if (cutStart == false) {
      if (issafariBrowser) {
        let url =
          "https://fapplink.oss-cn-shanghai.aliyuncs.com/static/cp205_release.mobileprovision";
        $(".btn_href").attr("href", url);
      } else {
        var content = $(".btn").attr("data-href");
        var clipboard = new Clipboard(".btn", {
          text: function () {
            return content;
          },
        });
        clipboard.on("success", function (e) {
          tips1("安装连接已复制，请前往Safari浏览器粘贴并打开");
        });
        clipboard.on("error", function (e) {
          // console.log(e);
        });
      }
    }
  });
}

function pvTrancking(isFirst, _customerId) {
  const PARAM = {
    eventType: isFirst, //落地页注册传3
    event: {
      partnerId: _partnerId,
      gmtTimestamp: new Date().getTime(),
      os: navigator.userAgent.match(/Android/i) ? 1 : 2,
      uvui: _UVUI,
      customerId: _customerId,
      skinId: skinId,
    },
  };
  eventTracking(PARAM, isFirst);
}

//数据埋点
function eventTracking(param, isFirst) {
  $.ajax({
    url: "/app/api/v1/partnerChannel/eventTracking",
    type: "post",
    dataType: "json",
    data: JSON.stringify(param),
    cache: false,
    headers: {
      "Content-Type": "application/json", //application/x-www-form-urlencoded  application/json
    },
    success: function (res) {
      sessionStorage.setItem("pvFlag", true);
    },
  });
}

function _uuid() {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function skin() {
  var skin_url = "/app/api/v1/start?partnerId=" + _partnerId + "&uvui=" + _UVUI;
  $.get(skin_url, function (info) {
    const code = info.code;
    if (code === 200) {
      const url = info.data.skinUrl;
      skinId = info.data.skinId;
      pvTrancking(1);
      $(".bg").attr("src", url.backgroundImg);
    } else {
      tips(info.message);
    }
  });
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

function setTimer() {
  var _time = 60,
    $t = $(".timer").removeClass("hide"),
    $img = $(".codeImg");
  $img.addClass("hide");
  var _timer = setInterval(function () {
    _time--;
    $t.find("span").html(_time);
    if (_time === 0) {
      $img.removeClass("hide");
      $t.addClass("hide").find("span").html(60);
      clearInterval(_timer);
    }
  }, 1000);
}
