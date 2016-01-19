/*
 * utils(v1.0): Which contains the common method of operating DOM
 * by Team on 2015/11/17
 */
(function () {
    var _utils = {
        //将数组转化为类数组
        listToArray: function listToArray(likeAry) {
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
        //将JOSN格式的字符串转化为对象   将JSON格式的对象转化为JSON格式的stringify
        toJSON: function toJSON(str) {
            return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
        }
    };

    /*
     * Num.1 : Methods for obtaining DOM elements
     *         获得DOM元素
     */

    //getElementsByClass：We get the elements through the style class, solve the getElementsByClassName not compatible in IE6~8
    //解决getElementsByClassName 的不兼容性 IE6~8
    _utils.getElementsByClass = function getElementsByClass(strClass, context) {
        //this->_utils
        context = context || document; //给它一个初始的默认值

        //To determine whether the current browser is compatible with our getElementsByClassName approach, we can use this method directly, in the context of the implementation of context
        //先看是否和浏览器兼容，如果兼容的话就直接执行 不兼容的话在进行处理
        if ("getElementsByClassName" in document) {
            return this.listToArray(context.getElementsByClassName(strClass));
            //将类数组转化为数组了
        }

        //In case of not compatible with this method we have to write code to handle compatible
        var strAry = strClass.replace(/(^ +)|( +$)/g, "").split(/\s+/), tagList = context.getElementsByTagName("*"), ary = [];
        //将strClass 拆分成一个数组了
        for (var i = 0; i < tagList.length; i++) {
            var curTag = tagList[i];
            curTag.flag = true;
            for (var k = 0; k < strAry.length; k++) {
                var reg = new RegExp("(^| +)" + strAry[k] + "( +|$)");
                if (!reg.test(curTag.className)) {
                    curTag.flag = false;
                    break;
                }
            }
            curTag.flag ? ary[ary.length] = curTag : null;
        }
        return ary;
    };

    //children：Gets all the elements of the element under the current specified element (which can specify a specific tag).
    //获取元素的所有元素子节点 如果传标签名的话就是 找到所有元素子节点中的固定标签名的元素节点
    _utils.children = function children(curEle, tagName) {
        var nodeList = curEle.childNodes, ary = [];//获取当前元素所有的子节点
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            if (curNode.nodeType === 1) {
                if (typeof tagName === "string") {//判断是否传入标签名了
                    var curNodeLow = curNode.nodeName.toLowerCase();
                    var tagNameLow = tagName.toLowerCase();
                    if (curNodeLow === tagNameLow) {
                        ary[ary.length] = curNode;
                    }
                    continue;
                }
                ary[ary.length] = curNode;
            }
        }
        return ary;
    };

    //prev：Gets the last element node of the current element
    //获取上一个哥哥元素节点
    _utils.prev = function prev(curEle) {
        if ("previousElementSibling" in curEle) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;//先找上一个哥哥节点
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    };

    //prevAll：Gets all of the elements of the current element for the node
    //获取所有的哥哥元素节点
    _utils.prevAll = function prevAll(curEle) {
        var pre = this.prev(curEle), ary = [];
        while (pre) {//当条件为真时执行循环体重的代码
            ary.unshift(pre);//先加入的是弟弟元素，再往里面加，加前面才是哥哥
            pre = this.prev(pre);
        }
        return ary;
    };

    //getIndex：Gets the index of the current element
    //获取当前元素在数组中的索引
    _utils.getIndex = function getIndex(curEle) {
        return this.prevAll(curEle).length;//所有哥哥元素的个数
    };

    //next：Gets the next younger brother element node of the current element
    //获取下一个弟弟元素节点
    _utils.next = function next(curEle) {
        if ("nextElementSibling" in curEle) {//兼容情况下
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;//不兼容情况下
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    };

    //nextAll：Gets all elements of the elements of the current element
    //获取所有的弟弟元素节点
    _utils.nextAll = function nextAll(curEle) {
        var nex = this.next(curEle), ary = [];
        while (nex) {
            ary[ary.length] = nex;
            nex = this.next(nex);//获取弟弟的弟弟
        }
        return ary;
    };

    //sibling：Gets the neighboring elements of the current element
    //获取上一个哥哥元素节点和下一个弟弟元素节点
    _utils.sibling = function sibling(curEle) {
        var pre = this.prev(curEle), nex = this.next(curEle), ary = [];
        pre ? ary[ary.length] = pre : null;
        nex ? ary[ary.length] = nex : null;
        return ary;
    };

    //siblings：Gets all elements of the elements of the current element
    //获取当前元素的所有兄弟元素节点
    _utils.siblings = function siblings(curEle) {
        var preA = this.prevAll(curEle), nexA = this.nextAll(curEle);
        return preA.concat(nexA);  //实现两个数组的拼接
    };

    //first：Gets the first element child node of the current element (you can specify the name of the tag)
    //获取第一个元素子节点  如果传了标签名 则获取的是当前元素的第一个的指定标签名的元素子节点
    _utils.first = function first(curEle, tagName) {
        return this.children(curEle, tagName)[0];
    };

    //last：Gets the last element of the current element and the child node (which can specify the name of the tag)
    //获取最后一个元素子节点  如果传了标签名 则获取的是当前元素的最后一个指定标签名的元素子节点
    _utils.last = function last(curEle, tagName) {
        var child = this.children(curEle, tagName);
        return child[child.length - 1];
    };


    /*
     * Num.2 : Methods for obtaining DOM style
     *          获取DOM元素的样式
     */

    //css：Gets or sets the style of the current element (third value values are obtained, and the value is set).
    //获取当前元素的某一属性的css样式，如果传value 则是设置该属性的css的样式的值
    _utils.css = function css(curEle, attr, value) {
        //get style  获取样式
        var reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?(px|pt|em|rem)$/;
        if (typeof value === "undefined") {
            //getComputerStyle 获取的是一个对象数据类型值,里面包含了我们所有的样式集合(CSSStyleDeclaration)->获取某一个具体的样式值,很多都是带着单位的
            var val = "getComputedStyle" in window ? window.getComputedStyle(curEle, null)[attr] : curEle.currentStyle[attr];
            return reg.test(val) ? parseFloat(val) : val;
        }

        //set style  传value的值则是设置样式的值
        reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
        if (attr === "opacity") {
            if (value >= 0 && value <= 1) {
                //所有浏览器都支持 opacity 属性。
                //注释：IE8 以及更早的版本支持替代的 filter 属性。例如：filter:Alpha(opacity=50)。
                curEle["style"]["opacity"] = value;
                curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            }
        } else if (attr === "float") {
            curEle["style"]["cssFloat"] = value;//设置文本或图像出现（浮动）在另一个元素中的什么地方。
            curEle["style"]["styleFloat"] = value;
        } else if (reg.test(attr)) {
            curEle["style"][attr] = isNaN(value) ? value : value + "px";
        } else {
            curEle["style"][attr] = value;
        }
    };

    //setGroupCss：Set the style for the current element
    //成组的建立css样式
    _utils.setGroupCss = function setGroupCss(curEle, options) {
        for (var key in options) {//遍历对象中的每一项
            if (options.hasOwnProperty(key)) {
                this.css(curEle, key, options[key]);
            }
        }
    };

    //offset：Gets the offset of the current element distance body
    //求当前元素到body 的距离
    _utils.offset = function offset(curEle) {
        var p = curEle.offsetParent, l = curEle.offsetLeft, t = curEle.offsetTop;
        while (p) {
            if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
                l += p.clientLeft;
                t += p.clientTop;
            }
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {top: t, left: l};
    };

    //win：Gets or sets the box model information for all and the browser
    _utils.win = function (attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    };

    //hasClass：To detect whether the current element contains the style name
    _utils.hasClass = function hasClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)");
        return reg.test(curEle.className);
    };

    //addClass：The class name for the current element adding style
    _utils.addClass = function addClass(curEle, strClass) {
        if (!this.hasClass(curEle, strClass)) {
            curEle.className += " " + strClass;
        }
    };

    //removeClass：Delete the current class name style elements
    _utils.removeClass = function removeClass(curEle, strClass) {
        var reg = new RegExp("(^| +)" + strClass + "( +|$)", "g");
        if (this.hasClass(curEle, strClass)) {
            curEle.className = curEle.className.replace(reg, " ");
        }
    };

    //tollageClass：Before judging whether there is any style of this class, if not removed, is to increase
    _utils.tollageClass = function tollageClass(curEle, strClass) {
        this.hasClass(curEle, strClass) ? this.removeClass(curEle, strClass) : this.addClass(curEle, strClass);
    };


    /*
     * Num.3 : About DOM additions and deletions
     */

    //attr：Sets or gets the value of the current element's custom attributes
    _utils.attr = function attr(curEle, attr, value) {
        if (typeof value === "undefined") {
            return attr === "class" ? curEle.className : curEle.getAttribute(attr);
        }
        attr === "class" ? curEle.className = value : curEle.setAttribute(attr, value);
    };

    //html：Set or get the contents of a non form element
    _utils.html = function html(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.innerHTML;
        }
        curEle.innerHTML = value;
    };

    //val：Sets or gets the contents of the form elements
    _utils.val = function val(curEle, value) {
        if (typeof value === "undefined") {
            return curEle.value;
        }
        curEle.value = value;
    };

    //prepend：Contrary to our appendChild, add new content to the beginning of the container.
    _utils.prepend = function prepend(container, newEle) {
        var fir = this.first(container);
        fir ? container.insertBefore(newEle, fir) : container.appendChild(newEle);
    };

    //insertAfter：Contrary to insertBefore，The new element is added to the back of the old elements
    _utils.insertAfter = function insertAfter(oldEle, newEle) {
        var nex = this.next(oldEle), par = oldEle.parentNode;
        nex ? par.insertBefore(newEle, nex) : par.appendChild(newEle);
    };

    //extend：As a qualified class library, we need to give others an interface to extend our approach, and we generally write a method called extend.
    _utils.extend = function extend(options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
    };

    //Assign the private variable _utils to the global variable utils
    window.utils = _utils;
})();

//utils.isNum(val):Test data type
~function (utils) {
    var numObj = {
        isNum: "Number",
        isStr: "String",
        isBoo: "Boolean",
        isNul: "Null",
        isUnd: "Undefined",
        isObj: "Object",
        isAry: "Array",
        isFun: "Function",
        isReg: "RegExp",
        isDate: "Date"
    }, isType = function () {
        var outerArg = arguments[0];
        return function () {
            var innerArg = arguments[0], reg = new RegExp("^\\[object " + outerArg + "\\]$", "i");
            return reg.test(Object.prototype.toString.call(innerArg));
        }
    };
    for (var key in numObj) {
        if (numObj.hasOwnProperty(key)) {
            utils[key] = isType(numObj[key]);
        }
    }
}(utils);


//Extended method on the prototype of the built-in class
~function () {
    var aryPro = Array.prototype, strPro = String.prototype, regPro = RegExp.prototype;

    //unique：Array distinct
    aryPro.unique = function unique() {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            obj[cur] == cur ? (this[i] = this[this.length - 1], this.length -= 1, i--) : obj[cur] = cur;
        }
        obj = null;
        return this;
    };

    //myForEach：forEach compatibility
    aryPro.myForEach = function myForEach(callBack, context) {
        if (Array.prototype.forEach) {
            return this.forEach(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            callBack.call(context, this[i], i, this);
        }
    };

    //myMap：map compatibility
    aryPro.myMap = function myMap(callBack, context) {
        if (Array.prototype.map) {
            return this.map(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            this[i] = callBack.call(context, this[i], i, this);
        }
        return this;
    };

    //myTrim：Remove the string and space
    strPro.myTrim = function myTrim() {
        return this.replace(/(^\s+|\s+$)/g, "");
    };

    //mySub：Intercept string, this method is distinguished in English
    strPro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime：Format time
    strPro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日 {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter：Gets the parameters in the URL address bar
    strPro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };

    //myExecAll：Capture all of the required content in a one-time capture
    regPro.myExecAll = function myExecAll(str) {
        var reg = !this.global ? eval(this.toString() + "g") : this;
        var ary = [], res = reg.exec(str);
        while (res) {
            ary[ary.length] = res[0];
            res = reg.exec(str);
        }
        return ary.length === 0 ? null : ary;
    };
}();