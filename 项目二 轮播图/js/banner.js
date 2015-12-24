var dataAry = ["img/banner1.jpg", "img/banner2.jpg", "img/banner3.jpg", "img/banner4.jpg"];

/*封装我们常用的DOM库*/
/*将类数组转化为数组*/
var listToArray = function (likeAry) {
    var ary = [];
    try {/*如果支持slice方法，就直接使用*/
        ary = Array.prototype.slice.call(likeAry, 0);
    } catch (e) {/*如果不支持的话就将类数组中的每一项放到数组当中*/
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
    }
    return ary;
};
/*通过class标签获取元素*/
var getElementsByClass = function (strClass, context) {
    context = context || document;
    /*判断某一属性是否属于一个对象（既可以检测共有属性也可以检测私有属性）*/
    if ("getElementsByClassName" in document) {
    /*getElementByClassName获得的是类数组，要将其转化为数组*/
        return listToArray(context.getElementsByClassName(strClass));
    }
    /*replace将老字符串用新字符串替换，目的：将字符串中的开头的空格和结尾的空格都删掉*/
    /*split将字符串按照指定的字符进行拆分，拆分成数组的每一项，目的：用空格将字符串进行拆分*/
    /*+是指匹配一个或者多个*/
    var classAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/), tagList = context.getElementsByTagName("*"), ary = [];
    /*循环取出上下文范围内包含的所有标签*/
    for (var i = 0; i < tagList.length; i++) {
        var curTag = tagList[i];
        /*给标签一个自定义属性*/
        curTag.flag = true;
        for (var j = 0; j < classAry.length; j++) {
        /*循环取出匹配到，并且转化为数组的class名*/
            var reg = new RegExp("(^| +)" + classAry[j] + "( +|$)");
        /*通过正则匹配验证标签的类名和输入的类名是否相同如果相同的话就将该标签元素放到数组当中*/
            if (!reg.test(curTag.className)) {
                curTag.flag = false;
                break;
            }
        }
        /*通过自定义属性来判断*/
        curTag.flag ? ary[ary.length] = curTag : null;
    }
    return ary;
};
/*获取元素的css样式*/
var getCss = function (curEle, attr) {
    /*有效数字：一位或者多位，有小数或者是没小数*/
    var reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?(px|pt|em|rem)$/, val = null;
    /*getComputerStyle 获取内联或者外链css样式*/
    if ("getComputedStyle" in window) {
        /*参数：1、要取得样式的元素 2、伪元素字符串如：：after*/
        val = window.getComputedStyle(curEle, null)[attr];
    } else {
        /*opacity才ie下不兼容，所以当获得opacity属性的时候要有专门的ie下的处理方式*/
        if (attr === "opacity") {
            /*在ie下使用currentStyle*/
            var temp = curEle.currentStyle["filter"], tempReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            /*exec把匹配到的内容进行捕获*/
            val = tempReg.test(temp) ? tempReg.exec(temp)[1] : "1";
            /*如果没有找到opacity的值，就直接给其一个 1（不透明）*/
            val = parseFloat(val) / 100;
            /*得到的是alpha中的值，然后在除以100 得到正常的透明度*/
        } else {
            /*如果不是opacity就直接有currentStyle来实现css样式的获取*/
            val = curEle.currentStyle[attr];
        }
    }
    /*通过正则进行匹配验证，如果是带单位的就将其单位去掉，如果是没有单位的就直接输出*/
    return reg.test(val) ? parseFloat(val) : val;
};
/*设置元素上的css样式 */
var setCss = function (curEle, attr, value) {
    var reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
    if (attr === "opacity") {
        /*给对象增加一对键值对   对象名.属性名=属性值  对象["属性名"]=属性值*/
        if (value >= 0 && value <= 1) {
            curEle["style"]["opacity"] = value;
            /*这种写法相当于cueEle.style.opacity=value*/
            curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
        }
    } else if (attr === "float") {
/*在写js操作css的过程中发现float属性在IE和firefox下对应的js脚本是不一样的，IE下对应得styleFloat，firefox,chorme,safari下对应的是cssFloat，可用in运算符去检测style是否包含此属性。*/
        curEle["style"]["cssFloat"] = value;
        curEle["style"]["styleFloat"] = value;
    } else if (reg.test(attr)) {
/*上面特殊的处理完之后就处理普通的带单位的，判断输入的value值是不是有效数字，如果不是有效数字则直接输出传入的属性值，如果是有效数字就给其后面加上单位*/
        curEle["style"][attr] = isNaN(value) ? value : value + "px";
    } else {
        /*如果以上的情况都不是的话就直接将属性值赋值给属性名*/
        curEle["style"][attr] = value;
    }
};
/*批量设置元素上的css样式*/
/*循环遍历对象中的每一项，然后通过setcss来设置响应的属性名*/
var setGroupCss = function (curEle, options) {
    for (var key in options) {
        /*遍历对象中的每一项，只遍历对象私有属性上的，不通过原型链进行查找*/
        if (options.hasOwnProperty(key)) {
            setCss(curEle, key, options[key]);
        }
    }
};

/*封装我们常用的动画库*/
var zhufengEffect = {
    /*匀速运动的动画公式 这里面的  t：运动的时间  b：开始位置 c：变化的路程  d：总时间*/
    zfLinear: function zfLinear(t, b, c, d) {
        return c * t / d + b;    /*返回的是当前位置*/
    },
    Quad: {
        easeIn: function QuadEaseIn(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function QuadEaseOut(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function QuadEaseInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function ExpoEaseIn(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function ExpoEaseOut(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function (t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    zfBounce: {
        easeIn: function (t, b, c, d) {
            return c - zhufengEffect.zfBounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) return zhufengEffect.zfBounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return zhufengEffect.zfBounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
};

/*这个动画是轮播图切换时的动画 curEle：当前元素  oTarget：目标值 duration：总时间 effect：动画类型 callBack：回调函数*/
/*实现图片切换的动画*/
var animate = function (curEle, oTarget, duration, effect, callBack) {

    //初始化传递进来的参数值,主要处理的是动画的方式
    var fnEffect = zhufengEffect.Expo.easeOut;
    /*判断传入的参数 12345对应相应的动画方式*/
    if (typeof effect === "number") {
        switch (effect) {
            case 1:
                fnEffect = zhufengEffect.zfLinear;
                break;
            case 2:
                fnEffect = zhufengEffect.Elastic.easeOut;
                break;
            case 3:
                fnEffect = zhufengEffect.Back.easeOut;
                break;
            case 4:
                fnEffect = zhufengEffect.zfBounce.easeOut;
                break;
            case 5:
                fnEffect = zhufengEffect.Expo.easeIn;
                break;
        }
    } else if (effect instanceof Array) {
        /*当传入一个的时候就是一个动画效果*/
/*当不是一个参数的时候effect[0]] 代表是总的动画类型 [effect[1]]代表effect[0]]下的一个动画方式*/
        /*当参数effect传入的是一个数字（1-5）则是上面的动画类型，如果传入两个不是数字*/
        fnEffect = effect.length === 1 ? zhufengEffect[effect] : zhufengEffect[effect[0]][effect[1]];
     /*如果effect传进去的是一个函数（表达的是一个动画的函数），后面的回调函数（当作参数传进来的函数）就不用写了*/
    } else if (typeof effect === "function") {
        callBack = effect;
    }

    //times:当前运动的时间 interval:多长时间运动一次 oBegin:起始的位置集合 oChange:总距离集合 oTarget:目标的位置集合{left: "-2000", opacity: 1}
    /*初始化变量值，15ms对浏览器来说这是时间因子比较合适，不用太纠结*/

/* animate(bannerImg, （oTarget）{left: -step * bannerW}, （duration）500,（effect） 1);*/
    var times = null, interval = 15, oBegin = {}, oChange = {};
    /*通过目标值oTarget和开始值oBegin 计算出运动的总路程也就是变化值oChange*/
    for (var key in oTarget) {
        if (oTarget.hasOwnProperty(key)) {
            /*开始位置通过getCss方法获得left值，然后用目标的left值减去开始位置的left值*/
            oBegin[key] = getCss(curEle, key);
            //console.log(oBegin[key]);
            oChange[key] = oTarget[key] - oBegin[key];
        }
    }

    //实现我们的动画
    //1)清除之前正在运行的动画
    window.clearInterval(curEle.timer);
    //2)开始设置新的动画执行我们的操作
    curEle.timer = window.setInterval(function () {
        /*times 当前运动的时间*/
        times += interval;
        /*时间因子：当运动15ms执行一下该函数（定时器，里面参数是一个函数）*/
        /*先判断条件条件成立执行判断体内的代码，当条件成立则执行判断体内代码*/
        if (times >= duration) {
           /*如果运动的时间大于总的时间了，就把目标值给当前元素*/
            setGroupCss(curEle, oTarget);
            window.clearInterval(curEle.timer);  /*清除定时器*/
            /*判断callBack是不是一个函数，如果是函数则执行，如果不是则什么都不干*/
            typeof callBack === "function" ? callBack.call(curEle) : null;
            return;
        }
        /*遍历上面的oChange集合中的每一项*/
        for (var key in oChange) {
            /*fnEffect（）；返回的是当前位置的值*/
            var curVal = fnEffect(times, oBegin[key], oChange[key], duration);
            /*将fnEffect（）；返回的值赋值给当前元素的该属性值*/
            setCss(curEle, key, curVal);
        }
    }, interval);
};

/*下面是实现轮播图的具体的业务逻辑*/
~function () {/*给一个自执行函数通过闭包解决全局变量的污染问题*/

    //获取所需要的元素     （想要操作元素就要先获取元素）

    /*banner 可以理解为可视窗口*/
    var banner = document.getElementById("banner");
    /*bannerImg是放图片的盒子*/
    var bannerImg = getElementsByClass("bannerImg", banner);
    /*如果bannerImg盒子里面有图片则执行下面的操作，如果没有则什么都不干*/
    if (bannerImg.length <= 0) return;
    /*通过getElementsByClass获取的是一个类数组，所以要获得上面的就要写成下面的格式*/
    /*这是获取banner下的bannerImg*/
    bannerImg = bannerImg[0];

    /*这个是右下角四个小圆球*/
    var bannerTip = getElementsByClass("bannerTip", banner);
    if (bannerTip.length <= 0) return;
    bannerTip = bannerTip[0];

    /*左右两边按键*/
    var bannerLeft = document.getElementById("bannerLeft");
    var bannerRight = document.getElementById("bannerRight");

    //计算当前bannerImg的宽度和位置
    /*totalW是bannerImg的总长度*/
    /*这的原理比较重要：本来是四张图片1234，但是要在前后分别加一张 412341 这个比较抽象啊下面都是基于这个原理来做的 前面加张4 是为了在点击左按钮的时候从1——>4  最后加一张1 也有这因素，还有就是要实现自动轮播*/
    /*bannerW=1000  totalW=6000*/
    var bannerW = banner.clientWidth,
        totalW = (dataAry.length + 2) * bannerW,
        count = dataAry.length + 2;   /*count 图片的数量*/
    /*批量设置bannerImg的宽度 width 和 left值 ，在这bannerImg是以banner为参照物进行相对定位*/
    setGroupCss(bannerImg, {
        /*传的是bannerImg总宽度和它与banner的位置关系，为了达到第一张是默认图的效果*/
        width: totalW,
        left: -bannerW
    });


    /*函数写成函数表达式的形式可以控制结构，因为函数表达式的函数只能在后面执行，在真正的项目中写成函数表达式的话找相应封装的函数的时候就会直接往上找，便于团队之间合作制作项目*/

    //初始化绑定数据
    /*搭设DOM框架*/
    var initData = function () {
        var str = "";
        /*第四张图片  在最左边位置（也就是一号位置）*/
        str += "<div trueImg='" + dataAry[dataAry.length - 1] + "'></div>";
        /*中间的四张图片 1234*/
        for (var i = 0; i < dataAry.length; i++) {
            str += "<div trueImg='" + dataAry[i] + "'></div>";
        }
        /*最后一张图片  1*/
        str += "<div trueImg='" + dataAry[0] + "'></div>";
        /*DOM框架直接搭好之后就放到对应的父元素下面*/
        bannerImg.innerHTML = str;

        str = "";
        /*给下角的小圆球样式*/
        for (i = 0; i < dataAry.length; i++) {
            /*将第一个小球设置为默认的样式*/
            i === 0 ? str += "<li class='select'></li>" : str += "<li></li>";
        }
        bannerTip.innerHTML = str;
    };
    initData();

    //图片延迟加载
    /*事件绑定和定时器都是异步加载*/
    var initAsyncImg = function () {
        var divList = bannerImg.getElementsByTagName("div");
        for (var i = 0; i < divList.length; i++) {
            ~function (i) {/*解决下面onload 事件的异步加载问题*/
                /*循环得到每一个装着图片的DIV*/
                var curDiv = divList[i];
                /*判断图片是否加载过如果没加载则执行下面的加载过程*/
                if (!curDiv.isLoad) {
                    /*提高用户体验*/
                    /*创建一个image的实例是创建了一个<img>标签*/
                    var oImg = new Image;
                    /*getAttribute 返回指定属性名的属性值*/
                    oImg.src = curDiv.getAttribute("trueImg");
            /*存储真实图片的地址，如果加载了就把真实图片放到这个盒子里如果没有加载则还放原图片*/
                    oImg.onload = function () {
                        /*默认图通过background：url进行设置*/
                        /*在这里将js创建的<img>标签添加到相应的容器中即可*/
                        curDiv.appendChild(oImg);
                        /*通过自定义属性做一个图片是否加载的标识*/
                        curDiv.isLoad = true;
                    };
                }
            }(i);
        }
    };
    /*这里设置一个定时器可以控制图片加载的时间*/
    window.setTimeout(initAsyncImg, 0);

    //实现焦点对齐
    /*焦点对齐：轮播图的大图和右下角的小圆球对照*/
    var setTip = function (index) {
        var bannerTipList = bannerTip.getElementsByTagName("li");
        /*如果索引< 0也就是当运动到第一个小球时再往左让它直接换到索引为3的小球也就是第四个*/
        index < 0 ? index = bannerTipList.length - 1 : null;
        /*如果索引>= bannerTipList.length（也就是4）将它直接换到索引为0的小球也就是第一个*/
        index >= bannerTipList.length ? index = 0 : null;
        for (var i = 0; i < bannerTipList.length; i++) {
            /*让当前索引的小球显示样式，其它的小球没有改样式*/
            bannerTipList[i].className = i === index ? "select" : null;
        }
    };

    //实现自动轮播
    /*我是按照索引理解的，当前位置是索引为1的图片（共六张）*/
    var step = 1;
    /*自动轮播动画 咱们拿第一次来看 当下面的定时器执行了进入函数*/
    var autoMove = function () {
        step++;/*到这 图片的索引变为2 但是显示还是第一张*/
        /*判断是否到头 也就是当我们索引是5的时候咱进行该判断题下的内容 count是总图片的数量（最上面有给值）*/
        if (step >= count) {
            /*这点比较难理解 也就是当切换到最后一张照片再切换的时候*/
            /*当条件满足后 将整个bannerImg拉回到初始位置 */
            setCss(bannerImg, "left", -1 * bannerW);
            /*将索引变为2 */
            step = 2;
        }
        /*通过里面传出来的step 给setTip（）传参数 让大图小图保持同步*/
        /*上面说了第一次执行的时候传进来的step是1，到这后变为2 给setTip（）传进去使其索引为1的小球（也就是第二个变为select样式）*/
        setTip(step - 1);/*图的索引 1234 对应小球的索引是 0123 */
        /*执行切换动画  第一次是从第一张切换到第二张  这样就保持了图片和小球的同步*/
        /*var animate = function (curEle, oTarget, duration, effect, callBack)*/
        animate(bannerImg, {left: -step * bannerW}, 500, 1);
    };
    bannerImg.autoTimer = window.setInterval(autoMove, 3000);

    //实现tip点击切换
    var bannerTipList = bannerTip.getElementsByTagName("li");
    for (var i = 0; i < bannerTipList.length; i++) {
        /*给一个自定属性，让索引能够传进绑定事件的函数当中*/
        bannerTipList[i].index = i;
        bannerTipList[i].onclick = function () {
            /*通过上面寻找到规律 小球的索引index总比图片的索引step小1*/
            /*实现焦点对齐*/
            setTip(this.index);
            step = this.index + 1;
            /*实现切换*/
            animate(bannerImg, {left: -step * bannerW}, 500, 1);
        };
    }

    //点击左右切换的按钮
    /*当划入的时候让左右点击的东西显示，与此同时清除正在运行的动画*/
    banner.onmouseover = function () {
        window.clearInterval(bannerImg.autoTimer);
        bannerLeft.style.display = bannerRight.style.display = "block";
    };

    /*当划出的时候左右点击的东西隐藏，与此同时给定时器 让其继续自动轮播*/
    banner.onmouseout = function () {
        bannerImg.autoTimer = window.setInterval(autoMove, 3000);
        bannerLeft.style.display = bannerRight.style.display = "none";
    };

    /*当点击右侧按钮的时候直接执行autoMove达到向右切换效果*/
    bannerRight.onclick = autoMove;

    /*当点击左侧的时候让索引每次都要 递减*/
    bannerLeft.onclick = function(){
        step--;
        /*当索引< 0 让其运动到索引为3的图片上*/
        if (step < 0) {
            /*count=6*/
            setCss(bannerImg, "left", -(count - 2) * bannerW);
            step = 3;
        }
        /*实现焦点对齐  此时传入的参数是-1 经过处理焦点达到索引为3的小球*/
        setTip(step - 1);
        /*实现轮播图切换功能*/
        animate(bannerImg, {left: -step * bannerW}, 500, 1);
    };
}();

