(function () {
    var touch = {};

    //柯理化函数   /*将两个数组进行拼接*/
    function bind(context, callBack) {
        var outerArg = [].slice.call(arguments, 2);
        return function () {
            var innerArg = [].slice.call(arguments, 0);
            var arg = innerArg.concat(outerArg);
            callBack.apply(context, arg);
        }
    }

    //检测是否是滑动事件     /*返回值true或者false  左右划也是可以的*/
    function isSwipe(strX, endX, strY, endY) {
        return Math.abs(endX - strX) > 30 || Math.abs(endY - strY) > 30;
    }

    //检测当前滑动的方向    /*先判断是上下划还是左右划，然后载细判断*/
    function swipeDirection(strX, endX, strY, endY) {
        return Math.abs(endX - strX) > Math.abs(endY - strY) ? ((endX - strX) > 0 ? "Right" : "Left") : ((endY - strY) > 0 ? "Down" : "Up");
    }

    //开始编写事件的三步操作:touchStart、touchMove、touchEnd
    //name:我们模拟的事件类型"tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"
    //callback:每一阶段我们单独处理的事情
    function touchStart(e, name, callback) {
        e.preventDefault();
        /*阻止事件的默认行为*/
        var touchPoint = e.touches[0];
        /*获取的是所有触摸点的第一个*/
        this["strX" + name] = touchPoint.pageX;
        /*将获取到的值存到当前项的自定义属性上*/
        this["strY" + name] = touchPoint.pageY;
        typeof callback === "function" ? callback.call(this, e) : null;
    }

    function touchMove(e, name, callback) {
        e.preventDefault();
        var touchPoint = e.touches[0];
        this["endX" + name] = touchPoint.pageX;
        /*获取结束时候的位置*/
        this["endY" + name] = touchPoint.pageY;
        /*将检测过的是否是滑动事件当超过30px时认为是滑动事件*/
        this["isSwipe" + name] = isSwipe(this["strX" + name], this["endX" + name], this["strY" + name], this["endY" + name]);
        checkEvent.call(this, e, name, callback);
    }

    function touchEnd(e, name, callBack) {
        e.preventDefault();
        /*判断事件是否会触发*/
        checkEvent.call(this, e, name, callBack);
        /*当touch事件结束的时候，将自定义属性里面的值回归到原始的状态*/
        initDefault.call(this, e, name);
    }

    //根据传递进来的事件类型和当前用户的行为进行比较,最后判断是否进行触发
    function checkEvent(e, name, callBack) {
        var isSwipe = this["isSwipe" + name];
        switch (name) {
            case "tap":
                !isSwipe && typeof callBack === "function" ? callBack.call(this, e) : null;
                break;
            case "swipe":
                isSwipe && typeof callBack === "function" ? callBack.call(this, e) : null;
                break;
            default:
                if (isSwipe) {
                    /*如果是滑动事件，就判断滑动的方向*/
                    var swipeDir = swipeDirection(this["strX" + name], this["endX" + name], this["strY" + name], this["endY" + name]);
                    /*如果滑动的话就将相应的 swipe+up/down/left/right*/
                    if (name === "swipe" + swipeDir) {
                        typeof callBack === "function" ? callBack.call(this, e) : null;
                    }
                }
        }
    }

    //在touch事件结束后把设置的自定义属性值回归到原始的状态
    function initDefault(e, name) {
        ["strX", "endX", "strY", "endY", "isSwipe"].forEach(function (item) {
            this[item + name] = null;
        }, this);
    }


    //options:{start:function->开始做的事情 move:function->滑动做的事情 end:function->结束做的事情}
    /*绑定事件*/
    function init(name) {
        //console.log(name);
        return function (curEle, options) {
            ["start", "move", "end"].forEach(function (item) {
                var fn = item === "start" ? touchStart : (item === "move" ? touchMove : touchEnd);
                var tempFn = bind(curEle, fn, name, options[item]);
                console.log(tempFn);
                curEle["my" + item + name] = tempFn;
                curEle.addEventListener("touch" + item, tempFn, false);
            });
            return this;//->为了实现链式写法
        }
    }

    /*解绑事件*/
    function uninit(curEle) {
        ["tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"].forEach(function (name) {
            ["start", "move", "end"].forEach(function (item) {
                var tempFn = curEle["my" + item + name];
                curEle.removeEventListener("touch" + item, tempFn, false);
            });
        });
    }

    ["tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"].forEach(function (item) {
        touch[item] = init(item);
    });
    touch.uninit = uninit;

    window.zhufengTouch = window.$t = touch;
})();