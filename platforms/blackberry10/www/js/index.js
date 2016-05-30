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
                onscreenready : function(element, id, params) {
                    if (id.indexOf('page') != -1) {
                        setDribbble(element,params)
                    }
                },
                ondomready: function(element, id, params) {

                }
            });
        }
        getDribbble()
    }
};

function getDribbble(page){
    Zepto.ajax({
        url:'http://open.charlesbao.com/dribbble?nav=popular&page=1',
        dataType:'jsonp',
        type:'get',
        success:function(data){
            bb.pushScreen('components/dribbbleScreen.html', 'page'+page,{page:page,data:data});
        }
    })
}

function setDribbble(element,params){
    var page = params.page;
    var data = params.data;
    var html = [];
    for(each in data){
        if(each%2){
            html.push('<div data-bb-type="row">');
            html.push('<div data-bb-type="item" data-bb-img="'+data[each-1]['image']['normal']+'"></div>');
            html.push('<div data-bb-type="item" data-bb-img="'+data[each]['image']['normal']+'"></div>');
            html.push('</div>');
        }
    }
    element.getElementById('grid').innerHTML = html.join('')
}