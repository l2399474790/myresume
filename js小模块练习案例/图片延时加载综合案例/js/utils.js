var utils = {
    toJSON: function (str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    },
    listToArray: function (likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },
    getCss: function (curEle, attr) {//获取元素的所有样式的值
        var reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?(px|pt|em|rem)$/, val = null;
        val = "getComputedStyle" in window ? window.getComputedStyle(curEle, null)[attr] : curEle.currentStyle[attr];//IE6~8下不兼容的时候用currentStyle
        return reg.test(val) ? parseFloat(val) : val;
    },
    offset: function (curEle) {//得到当前元素到body的距离
        //现获取它的父级参照物 元素的左偏移量和上偏移量
        var offsetP = curEle.offsetParent, l = curEle.offsetLeft, t = curEle.offsetTop;
        //找父级参照物 当找到后进行下面的操作
        while (offsetP) {
            //如果在IE8情况向就不用再加父级参照物的边框
            if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
                //navigator 导航器 userAgent 用户代理
                l += offsetP.clientLeft;
                t += offsetP.clientTop;
            }
            l += offsetP.offsetLeft;
            t += offsetP.offsetTop;
            offsetP = offsetP.offsetParent;
        }
        return {top: t, left: l};
    }
};




















