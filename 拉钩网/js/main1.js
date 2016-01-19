/*�Ҳ�������*/
/*���Ӧ��ע��ĵ��ǣ���̬ҳ�沼�ֵ�ʱ��ʹ��a��ǩ�������a��ǩ�Ļ�Ҫ�ǵ���ֹa��Ĭ����Ϊ���˴���̬���ֵ�ʱ��*/
function getWin(attr) {
    return document.documentElement[attr] || document.body[attr];
}
var goTo = document.getElementById("footer_top_a");

var scrollMove = function scrollMove() {
    var curT = getWin("scrollTop");
    goTo.style.display = curT >= 30 ? "block" : "none";
};
/*DOM2���¼��󶨲���  1���¼������� 2���¼�Ҫ�󶨵ķ��� 3���¼����ҷ�ʽ*/
//window.addEventListener("scroll",scrollMove,false);
on(window, "scroll", scrollMove);

goTo.onclick = function () {
    /*�Ƴ��Լ��������¼��������scrollMove����*/
    off(window, "scroll", scrollMove);
    /*���� ����������(tarT / 500) * 10 Ҳ����ֱ����*/
    var timer = window.setInterval(function () {
        var step = 30;
        var curT=getWin("scrollTop");
        document.documentElement.scrollTop -= step;
        document.body.scrollTop -= step;
        /*���б߽��ж� �������һ��С��0��ʱ��͵���0*/
        if (curT-30 <= 0) {
            curT=0;
            on(window, "scroll", scrollMove);
            window.clearInterval(timer);
        }
    }, 10);
};

/*������պ��²�ע���¼�����Ч������ͨ�������������ģ��������ڹ����ϰ󶨶������������õ���DOM2���¼�*/

/*�²���¼ע�����Ч��*/
/*������Ĺ��־�ȥ�ĸ߶ȣ�Ȼ���ڵ���ײ���ʱ�򣬶�λ�� bottom��68px; �����Ͼ�ȥ68px��ʱ���䶨λ��Ϊ0*/
/*follow ����*/
var follow = function follow() {
    var fooTop=document.getElementById("footer_top");
    /*��ȡ��ǰ��ȥ�ĸ߶�*/
    var curT = getWin("scrollTop");
    /*��ȡ����body�ĸ߶�*/
    /*�˴�ʹ��offsetHeight Ҳ���Ի�ȡbody�ĸ߶�*/
    var curH = getWin("scrollHeight");
    /*��ȡ��ǰ�ӿڵĸ߶�*/
    var winH = getWin("clientHeight");
    /*����ȥ�߶�*/
    var maxT=curH-winH;
    /*���ֵ�ʱ�������䶨λ�����棨bottom��0�������ȥ�ĸ߶ȴ���maxT-68��ʱ������bottom��68px*/
    if(curT<(maxT-68)){
        fooTop.style.bottom="0";
    }else{
        fooTop.style.bottom="68px";
    }
};
/*�����õ�DOM2���¼���ʱ��IE6-8��֧�����������Ҫ�������Դ�����event.js ����*/
/*Ҳ���Բ����룬��ΪҪ��������window this���ⲻ�ÿ��� ˳������Ҳ����Ҫ���� �󶨵�Ҳ����ͬһ������*/
//window.addEventListener("scroll",follow,false);
on(window,"scroll",follow);


/*�������ϵĻ���Ч��*/





