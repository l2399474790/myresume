/*1、先用on 将原本的事件池替换  这是解决顺序问题
* 2、当我们给一个元素绑定多个方法时，on执行完后进行run的执行，run：按照自己建的事件池依次执行我们的绑定的方法。
* 3、*/



/*解决this和重复的问题*/
/*绑定事件   给当前元素的某个事件绑定某个方法*/
/*执行这个函数 是绑定一个方法，一次绑定一个方法，每次绑定的时候把该方法存在数组当中*/
function bind(curEle, evenType, evenFn) {/*function run(){fn1.call(this,e)}*/
    if (document.addEventListener) {
        /*false控制的是冒泡传播 如果是true就是捕获*/
        /*兼容和不兼容的处理*/
        curEle.addEventListener(evenType, evenFn, false);
        /*不能是evenFn.call(curEle); 因为这样写就执行了，传进去的就是函数执行的结果*/
        return;
    }
    //1)给每一次传递进来需要绑定的方法进行化妆
    /*通过.call来解决this问题 原来的this是window*/
    var tempFn = function () {
        evenFn.call(curEle);/*run.call(curEle)*/
    };
    //把化妆前的放到脑门上,后期需要拿化妆前的比较
    /*给一个标识，因为改变后堆内存的地址已经改变了需要通过这个标识来找到这个堆内存*/
    /*将之前的方法放到现在方法的一个自定义属性上，等到下面可以将两者进行比较*/
    tempFn.photo = evenFn;  /*run*/

    //2)把它存储到一个容器中(容器中存储的是所有需要  绑定的方法  化妆后的函数)
    if (!curEle["my" + evenType]) {
        /*没有的话就  给当前元素增加一个自定义属性 使其为空数组*/
        curEle["my" + evenType] = [];
    }
    var ary = curEle["my" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        /*此处实现的是去重，当一样的时候下面就不执行了*/
        if (cur.photo === evenFn) {
            return;
        }
    }
    /*将重复的包装过的函数 去除*/
    ary.push(tempFn);
    curEle.attachEvent("on" + evenType, tempFn);/*function(){run.call(curEle)}*/
}

/*解开绑定事件  解除当前元素的某个事件上的某个方法*/
/*解除绑定的时候也是执行一次该方法，解除一个绑定的方法*/
/*curEle["my" + evenType]; 这个数组是不变的 自定义属性可以存任何东西*/
function unbind(curEle, evenType, evenFn) {
    /*兼容和不兼容的处理*/
    if (document.removeEventListener) {
        /*事件类型、事件方法、冒泡阶段*/
        curEle.removeEventListener(evenType, evenFn, false);
        return;
    }
    var ary = curEle["my" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var tempFn = ary[i];
        if (tempFn.photo === evenFn) {
            curEle.detachEvent("on" + evenType, tempFn);
            break;
        }
    }
}

/*顺序问题:内置的事件池不能用了,我们自己写一套事件池来执行我们的方法*/
/*这里通过自定义属性创建了一个事件池*/
function on(curEle, evenType, evenFn) {
    !curEle["myEvent" + evenType] ? curEle["myEvent" + evenType] = [] : null;
    var ary = curEle["myEvent" + evenType];/*又增加了一个自定义属性*/
    for (var i = 0; i < ary.length; i++) {
        /*实现去重*/
        if (ary[i] == evenFn) {
            return;
        }
    }
    ary.push(evenFn);  /*fn1*/
    bind(curEle, evenType, run);
    /*给当前元素绑定一个run方法   function run(){fn1.call(this,e)}*/
}

//off:在自己的事件池中，把需要移除的方法去掉
function off(curEle, evenType, evenFn) {
    var ary = curEle["myEvent" + evenType];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] == evenFn) {
            ary[i] = null;
            break;
        }
    }
}

//run:按照自己的事件池，依次执行我们的绑定的方法
/*run 是执行fn1这个方法 fn1.call(this,e) 但是要确定里面的this就要执行 bind来改变fn1中的this让其变为curEle */
function run(e) {/*默认传进来一个事件对象*/
    e = e || window.event;/*解决事件对象的兼容性*/
    var flag = e.target ? true : false;/*如果有事件源*/
    if (!flag) {/*flag 标识*/
        /*如果不支持的话就给其一个自定义属性给其伪装一下*/
        e.target = e.srcElement; /*事件源*/
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);/*鼠标距离body的坐标值*/
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };/*阻止事件的默认行为*/
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };/*阻止事件的冒泡传播*/
    }
    //this->curEle  /*在哪执行来判断this是谁*/
    var ary = this["myEvent" + e.type];  /*fn1*/
    /*当前元素自己建的事件池里面的 onclick事件 的所有方法*/
    for (var i = 0; i < ary.length; i++) {
        /*循环把每个方法给curFn*/
        var curFn = ary[i];/*fn1*/
        if (typeof curFn === "function") {
            curFn.call(this, e);  /*fn1.call(this,e)*/
        } else {
            ary.splice(i, 1);/*删除当前项*/
            i--;/*解决数组塌陷问题*/
        }
    }
}