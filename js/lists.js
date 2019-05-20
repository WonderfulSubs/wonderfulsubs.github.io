function SeriesList(url, options) {
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

    function loadList(u, options) {
        if (!u && !isObject) return;
        var append = options && options.push === true;
        var onloaded = options.onloaded;
        if (isObject) {
            if (append) currentCount += count;
            _this.list = url.slice(0, currentCount);
            _this.full_list = url;
            if (onloaded) onloaded();
            if (callback) callback(_this.full_list.length);
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
                    _this.list.push.apply(_this.list, series);
                } else {
                    _this.list = series;
                }
                _this.full_list = _this.list;
                if (onloaded) onloaded();
                if (callback) callback(_this.full_list.length);
            });
    }

    var _this = {
        oninit: loadList.bind(this, url),
        list: isObject ? url : [],
        full_list: isObject ? url : [],
        load: loadList,
        push: function (u, vnode, e) {
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
        },
        view: function (vnode) {
            var elements = [m(PosterGrid, { items: _this.list, sideScroll: sideScroll, preventUpdate: preventUpdate, changeOnRemove: changeOnRemove })];
            if (header) elements.unshift(m('h4', { class: 'poster-header' }, header));
            if (nextPage || (isObject && currentCount < url.length)) elements.push(m('button', { class: 'center-element', onclick: _this.push.bind(this, nextPage, vnode) }, 'View More'));
            return m('div', { class: className }, elements);
        }
    };

    return _this;
}

function BloggerList(url) {
    var list = [];

    function loadList(u, options) {
        var append = options && options.push === true;
        return m.jsonp({
            url: u
        })
            .then(function (result) {
                var entry = convertBloggerJson(result.feed.entry);
                if (append) {
                    list.push.apply(list, entry);
                } else {
                    list = entry;
                }
            });
    }

    return {
        oninit: loadList.bind(this, url),
        load: loadList,
        push: function (u) { loadList(u, { push: true }); },
        view: function () {
            return m(ShowcaseGrid, { items: list });
        }
    };
}
