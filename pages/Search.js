var Search = {
    query: '',
    count: '',
    title: '',
    currentListName: 'series',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var query = params.q;
        var type = params.type;
        if (query) {
            Search.query = query;
            Search.currentListName = type === 'users' ? 'users' : 'series'
            Search.count = '';
            Search.title = query ? 'Search Results for "' + query + '"' : 'Search';
            Search.getResults(Search.query.trim());
            // m.redraw();
        }
    },
    onupdate: function (vnode) {
        var query = vnode.attrs.q;
        if (query !== Search.query) Search.oninit();
    },
    getResults: function (query) {
        Search.results = {
            url: domain + "/api/v2" + (Search.currentListName === 'series' ? '/media/search?options=summary&' : '/users/list?') + "q=" + query,
            options: {
                header: Search.title,
                callback: function (count) {
                    Search.count = count;
                }
            }
        };
    },
    view: function () {
        setTitle(Search.title);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    m('button', { class: Search.currentListName === 'series' ? 'active' : undefined, onclick: function(e) {switchList(e, Search);} }, [m('i'), 'Series']),
                    m('button', { class: Search.currentListName === 'users' ? 'active' : undefined, onclick: function(e) {switchList(e, Search);} }, [m('i'), 'Users'])
                ]),
                m('div', [
                    m('div', [
                        Search.currentListName === 'series' ? m(SeriesList, Search.results) : m(UserList, Search.results),
                        Search.count === 0 ? m('div', { class: 'fadeInUp fast animated center-align' }, 'No results') : undefined
                    ])
                ])
            ])
        ]);
    }
};