var page = document.querySelector(".page");
var pageList = [].slice.call(document.querySelectorAll(".pageDemo"), 0);
var winH = document.documentElement.clientHeight;
var index = 0, count = pageList.length;

//init style  /*让页面等于当前屏幕的宽度*/
pageList.forEach(function (curItem) {
    curItem.style.height = winH + "px";
});
/*通过计算，获取总共的长度*/
page.style.height = count * winH + "px";

//init event
var bodyTouch = {
    /*每屏切换的时候做的动画*/
    setTran: function (flag) {
        if (flag) {
            /*切换每张的时候，如果切换则进行过度*/
            page.style.webkitTransitionDuration = "0.5s";
            return;
        }
        page.style.webkitTransitionDuration = "0s";
    },
    /*按下*/
    start: function (e) {
        /*通过自定义属性做一些标志*/
        this["isEnd"] = false;
        this["changePos"] = 0;
        this["strTop"] = parseFloat(page.style.top);
    },
    /*往上移动*/
    moveUp: function (e) {
        if (index >= (count - 1)) {
            return;
        }
        /*上下移动的距离*/
        var changePos = this["endYswipeUp"] - this["strYswipeUp"];
        this["changePos"] = changePos;
        page.style.top = this["strTop"] + changePos + "px";
    },
    /*上结束*/
    endUp: function (e) {
        bodyTouch.setTran(true);
        /*如果移动的距离大于winH / 4，让索引+1*/
        if (Math.abs(this["changePos"]) >= (winH / 4)) {
            index++;
        }
        page.style.top = -index * winH + "px";
        window.setTimeout(function () {
            bodyTouch.setTran(false);
            move();
        }, 500);
    },
    /*往下移动*/
    moveDown: function (e) {
        if (index <= 0) {
            return;
        }
        var changePos = this["endYswipeUp"] - this["strYswipeUp"];
        this["changePos"] = changePos;
        page.style.top = this["strTop"] + changePos + "px";
    },
    /*下结束*/
    endDown: function (e) {
        bodyTouch.setTran(true);
        if (Math.abs(this["changePos"]) >= (winH / 4)) {
            index--;
        }
        page.style.top = -index * winH + "px";
        window.setTimeout(function () {
            bodyTouch.setTran(false);
            move();
        }, 500);
    }
};

var body = document.body;
/*先通过touch事件库将上划下划的事件绑到相应的元素上*/
$t.swipeUp(body, {
    start: bodyTouch.start,
    move: bodyTouch.moveUp,
    end: bodyTouch.endUp
}).swipeDown(body, {
    start: bodyTouch.start,
    move: bodyTouch.moveDown,
    end: bodyTouch.endDown
});

//init move  /*实现每一页里面的动画*/
function move() {
    pageList.forEach(function (item, i) {
        console.log(index);
        console.log(item);
        if (i === index) {
            item.className = "pageDemo move";
        } else {
            item.className = "pageDemo";
        }
    });
    document.querySelector(".tip").style.display = index >= (count - 1) ? "none" : "block";
}

//init music
window.addEventListener("load", function () {
    var musicAudio = document.querySelector("#musicAudio");
    var music = document.querySelector(".music");

    musicAudio.addEventListener("canplay", function () {
        music.style.display = "block";
        music.className = "music move";
    }, false);
    musicAudio.play();

    $t.tap(music, {
        end: function (e) {
            if (musicAudio.paused) {
                musicAudio.play();
                this.className = "music move";
                return;
            }
            musicAudio.pause();
            this.className = "music";
        }
    });
}, false);

//init on-page  /*刚开始的时候第一页内的动画*/
window.setTimeout(function () {
    pageList[0].className = "pageDemo move";
}, 0);
















