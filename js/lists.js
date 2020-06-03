function SeriesList(initialVnode) {
    var url = initialVnode.attrs.url;
    var options = initialVnode.attrs.options;
    var nextPage;
    if (!options) options = {};
    var withAuth = options.withAuth;
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
        var requestOpts = { method: 'GET', url: u };
        if (withAuth) requestOpts.headers = { Authorization: 'Bearer ' + AuthUser.data.token };
        return m.request(requestOpts)
            .then(function (result) {
                var series = (result.json || result.data).series;

                // This is a hack. Format this properly on the backend
                if (!series && result.data) {
                    Object.entries(result.data).some(function (entry) {
                        var value = Array.isArray(entry[1]);
                        if (value) {
                            series = entry[1];
                            return true;
                        }
                    });
                }
                //End hack

                nextPage = (result.json || result.data).next_page;

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
        if (e && 'stopPropagation' in e) e.stopPropagation();
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
            function autoLoadPage() {
                push(nextPage, vnode);
            }

            var elements = [m(PosterGrid, { items: list, sideScroll: sideScroll, preventUpdate: preventUpdate, changeonremove: changeOnRemove })];
            if (header) elements.unshift(m('h4', { class: 'poster-header' }, header));
            if (nextPage || (isObject && currentCount < url.length)) elements.push(llc('button', { class: 'center-element', onclick: autoLoadPage, oncreate: autoLoadPage, onobserve: autoLoadPage }, 'View More'));
            return m('div', { class: className }, elements);
        }
    };
}

function UserList(initialVnode) {
    var url = initialVnode.attrs.url;
    var options = initialVnode.attrs.options;
    var nextPage;
    if (!options) options = {};
    var withAuth = options.withAuth;
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
        var requestOpts = { method: 'GET', url: u };
        if (withAuth) requestOpts.headers = { Authorization: 'Bearer ' + AuthUser.data.token };
        return m.request(requestOpts)
            .then(function (result) {
                var users = result.data;

                // This is a hack. Format this properly on the backend
                if (!users && result.data) {
                    Object.entries(result.data).some(function (entry) {
                        var value = Array.isArray(entry[1]);
                        if (value) {
                            users = entry[1];
                            return true;
                        }
                    });
                }
                //End hack

                nextPage = result.next_page;

                if (filter) users = users.filter(filter);

                if (append) {
                    list.push.apply(list, users);
                } else {
                    list = users;
                }
                full_list = list;
                if (onloaded) onloaded();
                if (callback) callback(full_list.length);
            });
    }

    function push(u, vnode, e) {
        if (e && 'stopPropagation' in e) e.stopPropagation();
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
            function autoLoadPage() {
                push(nextPage, vnode);
            }

            var elements = [m(UserGrid, { items: list, sideScroll: sideScroll, preventUpdate: preventUpdate, changeonremove: changeOnRemove })];
            if (header) elements.unshift(m('h4', { class: 'poster-header' }, header));
            if (nextPage || (isObject && currentCount < url.length)) elements.push(llc('button', { class: 'center-element', onclick: autoLoadPage, oncreate: autoLoadPage, onobserve: autoLoadPage }, 'View More'));
            return m('div', { class: className }, elements);
        }
    };
}

var BloggerList = {
    oninit: function (vnode) {
        this.list = [];
        this.loadList = function (u) {
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
