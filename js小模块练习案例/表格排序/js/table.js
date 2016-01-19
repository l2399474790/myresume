/*想要操作谁就先获取谁*/
var oTable = document.getElementById("oTable");
var tHead = oTable.tHead;//->获取table下的唯一一个tHead
var tBody = oTable.tBodies[0];//->获取table下所有tBody中的第一个
var rowList = tBody.rows;//->获取tBody下所有的tr行

//1、把数据dataAry(json.js)绑定到我们的页面中
/*初始化数据*/
function initData() {
    /*每次循环拼接的时候都进行了DOM的回流和重绘*/
    /*注意：回流必将引起重绘，但是重绘不一定引发回流*/
    for (var i = 0; i < dataAry.length; i++) {
        //在项目中绑定数据之前,我们需要对数据进行初始化的设置->对于没有这项数据的我们给一个友好的默认值
        /*a&&b a为真则返回b不管 b是真是假。如果a是假则直接返回假*/
        /*a||b 如果a为真则返回a，如果a为假则返回b 不管b是真是假*/
        var cur = dataAry[i];
        cur.name = cur.name || "--";
        cur.age = cur.age || "25";
        cur.score = cur.score || "80";

        //每一次循环数据的时候,我们动态创建一个tr,并且把三个td通过拼接字符串的方式添加到我们的tr中,最后再把每一个tr都存放到tBody中
        var oTr = document.createElement("tr");/*创建tr*/
        var str = "";
        str += "<td>" + cur.name + "</td>";
        str += "<td>" + cur.age + "</td>";
        str += "<td>" + cur.score + "</td>";
        oTr.innerHTML = str;
        tBody.appendChild(oTr); /*将创建好的tr，td*/
    }
}
initData();

//2、实现隔行变色
function changeBg() {
    for (var i = 0; i < rowList.length; i++) {
        rowList[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();

//3)实现表格排序  /*此时的排列是从小到大排列*/
function sortList(n) {
    //n是当前排序那一列的索引

    //1、把类数组转化为数组  /*将获得的tr类数组列表转化为数组*/
    var ary = utils.listToArray(rowList);

    //2、调用sort进行排序
    ary.sort(function (a, b) {
        //cells获取某一行的所有列(table里面独有的属性),我们让 当前行的n列中的内容和（下一行）n列中的内容进行比较实现排序
        //可能某一列的内容是汉字
        /*当前行中的n列中的内容*/
        var cur = a.cells[n].innerHTML;
        /*下一行中n列中的内容*/
        var next = b.cells[n].innerHTML;
        var curNum = parseFloat(cur);
        var nextNum = parseFloat(next);
        if (isNaN(curNum)) {
            return cur.localeCompare(next);
        }
        return curNum - nextNum;
    });

    //5、在点击的（当前列）上增加一个sortType自定义属性，存储当前排序完成的"排序方式标识"->告诉当前已经是什么顺序了，下一次在点击的时候通过当前的顺序来判断应该按照什么顺序排序
    //当前是乱序 ->升序
    //当前是降序 ->升序
    //当前是升序 ->降序
    if (this.sortType === "升序") {
        ary.reverse();
        this.sortType = "降序";
    } else {
        this.sortType = "升序";
    }

    //3、按照最新的顺序从新的把每一行添加到tBody中
    for (var i = 0; i < ary.length; i++) {
        tBody.appendChild(ary[i]);
    }
    /*DOM映射机制没有动态的增加  就是把原来的修改*/

    //4、重新的计算隔行变色
    changeBg();
}



/*4.实现点击th中的内容，让点击列变为倒叙*/
var oThs = tHead.getElementsByTagName("th");
//oThs[2].onclick = function () {
//    //this->oThs[2]
//    //sortList();//this->window
//    sortList.call(this);//this->oThs[2]
//};
for (var i = 0; i < oThs.length; i++) {
    oThs[i].index = i;
    oThs[i].onclick = function () {
        sortList.call(this, this.index);
    }
}

//当前这个代码还不是最优化的，绑定数据的时候不优化：
//DOM回流和重绘-->大数据绑定的处理技巧
//http://www.zhufengpeixun.com/viewer.do?courseId=957241#currentPlaying=1663574

/*DOM回流的几种情况
* 1、添加或者删除可见的DOM元素
* 2、元素的位置发生改变
* 3、元素的尺寸发生改变（边距，填充，边框，宽度，高度）
* 4、内容发生改变（文本，图片大小）
* 5、页面渲染初始化
* 6、浏览器窗口尺寸发生改变（resize事件发生的时候）*/

/*如何减少回流
* 1、当需要修改多个样式的时候，先将样式写到样式表中，然后在通过js增加或者删除className
* 2、让操作的元素进行“离线处理”，处理完成后进行统一的更新
* 3、不要经常访问浏览器的flush队列的属性，如果确实需要访问，就利用缓存*/










