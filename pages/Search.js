var Search = {
    query: '',
    count: '',
    title: '',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var query = params.q;
        if (query) {
            Search.query = query;
            Search.count = '';
            Search.title = query ? 'Search Results for "' + query + '"' : 'Search';
            Search.getResults(Search.query.trim());
            m.redraw();
        }
    },
    onupdate: function (vnode) {
        var query = vnode.attrs.q;
        if (query !== Search.query) Search.oninit();
    },
    getResults: function (query) {
        Search.results = SeriesList(
            domain + "/api/media/search?options=summary&q=" + query,
            {
                header: Search.title,
                callback: function (count) {
                    Search.count = count;
                }
            }
        );
    },
    results: SeriesList(),
    view: function () {
        setTitle(Search.title);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', [
                    m('div', [
                        m(Search.results),
                        Search.count === 0 ? m('div', { class: 'fadeInUp fast animated center-align' }, 'No results') : undefined
                    ])
                ])
            ])
        ]);
    }
};