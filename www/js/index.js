var page = 0;
var cache = {};
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        if(id == 'deviceready'){
            bb.init({
                controlsDark: true,
                listsDark: true,
                onscreenready : function(element, id, params) {
                    if (id == 'page') {
                        setDribbble(element,params)
                    } else if (id == 'detail') {
                        setDetail(element, params)
                    }
                },
                ondomready: function(element, id, params) {
                }
            });
        }
        getDribbble(1)
    }
};

function getDribbble(method) {
    page += method;
    if (cache[page]) {
        preDribble(page + 1)
        return bb.pushScreen('components/dribbbleScreen.html', 'page', {data: cache[page]});
    }
    Zepto.ajax({
        url: 'http://open.charlesbao.com/dribbble?nav=popular&page=' + page,
        dataType:'jsonp',
        type:'get',
        success:function(data){
            bb.pushScreen('components/dribbbleScreen.html', 'page', {data: data});
            cache[page] = data;
            preDribble(page + 1)
        }
    })
}

function preDribble(prePage) {
    if (cache[prePage]) {
        return;
    }
    Zepto.ajax({
        url: 'http://open.charlesbao.com/dribbble?nav=popular&page=' + prePage,
        dataType: 'jsonp',
        type: 'get',
        success: function (data) {
            cache[prePage] = data
        }
    })
}

function setDribbble(element,params){
    var data = params.data;
    var html = [];
    for(each in data){
        if(each%2){
            html.push('<div data-bb-type="row">');
            html.push('<div onclick="showBig(\'' + data[each - 1]['image']['big'] + '\')" data-bb-type="item" data-bb-img="' + data[each - 1]['image']['normal'] + '"></div>');
            html.push('<div onclick="showBig(\'' + data[each]['image']['big'] + '\')" data-bb-type="item" data-bb-img="' + data[each]['image']['normal'] + '"></div>');
            html.push('</div>');
        }
    }
    element.getElementById('grid').innerHTML = html.join('')
}

function setDetail(element, params) {
    var data = params.data;
    var html = '<img src="' + data + '" />';
    var height = bb.screen.currentScreen.clientHeight - bb.screen.getActionBarHeight()
    element.getElementById('detail').style.height = height + 'px';
    element.getElementById('detail').innerHTML = html;
}

function showBig(data) {
    bb.pushScreen('components/detailScreen.html', 'detail', {data: data});
}