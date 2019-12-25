function SeriesList(initialVnode) {
    var url = initialVnode.attrs.url;
    var options = initialVnode.attrs.options;
    var nextPage;
    if (!options) options = {};
    var count = options.count || 10;
    var header = options.header;
    var className = options.className;
    var filter = options.filter;
    var preventUpdate = options.preventUpdate;
    var changeOnRemove = options.changeOnRemove;
    var sideScroll = options.sideScroll;
    var callback = options.callback;

    var isObject = typeof url === 'object';
    var currentCount = count;

    var list = isObject ? url : [];
    var full_list = isObject ? url : [];

    function loadList(u, options) {
        if (!u && !isObject) return;
        var append = options && options.push === true;
        var onloaded = options.onloaded;
        if (isObject) {
            if (append) currentCount += count;
            list = url.slice(0, currentCount);
            full_list = url;
            if (onloaded) onloaded();
            if (callback) callback(full_list.length);
            return;
        }
        return m.request({
            method: 'GET',
            url: u
        })
        .then(function (result) {
            var series = result.json.series;
            nextPage = result.json.next_page;

            if (filter) series = series.filter(filter);

            if (append) {
                list.push.apply(list, series);
            } else {
                list = series;
            }
            full_list = list;
            if (onloaded) onloaded();
            if (callback) callback(full_list.length);
        });
    }

    function push(u, vnode, e) {
        e.stopPropagation();
        if (!isObject && vnode) {
            vnode.dom.style['pointer-events'] = 'none';
            vnode.dom.style.opacity = 0.5;
        }
        loadList(u, {
            push: true,
            onloaded: function () {
                if (vnode) {
                    vnode.dom.style['pointer-events'] = '';
                    vnode.dom.style.opacity = '';
                }
            }
        });
    }

    return {
        oninit: loadList.bind(this, url),
        list: list,
        full_list: full_list,
        load: loadList,
        push: push,
        view: function (vnode) {
            var elements = [m(PosterGrid, { items: list, sideScroll: sideScroll, preventUpdate: preventUpdate, changeonremove: changeOnRemove })];
            if (header) elements.unshift(m('h4', { class: 'poster-header' }, header));
            if (nextPage || (isObject && currentCount < url.length)) elements.push(m('button', { class: 'center-element', onclick: push.bind(this, nextPage, vnode) }, 'View More'));
            return m('div', { class: className }, elements);
        }
    };
}

var BloggerList = {
    oninit: function (vnode) {
        this.list = [];
        this.loadList = function(u) {
            return m.jsonp({
                url: u
            })
            .then(function (result) {
                var entry = convertBloggerJson(result.feed.entry);
                vnode.state.list.push.apply(vnode.state.list, entry);
            });
        };
        this.loadList(vnode.attrs.url, this.list);
    },
    push: function (u) {
        this.loadList(u, this.list);
    },
    view: function () {
        return m(ShowcaseGrid, { items: this.list });
    }
};
