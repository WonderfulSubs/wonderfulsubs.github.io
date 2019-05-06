var Genre = {
    category: '',
    count: '',
    title: '',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var category = params.q;
        Genre.category = category;
        Genre.count = '';
        Genre.title = category ? '"' + category + '" - Genres' : 'Genres';
        Genre.getResults(Genre.category ? Genre.category.trim() : undefined);
        m.redraw();
    },
    onupdate: function (vnode) {
        var category = vnode.attrs.q;
        if ((category && category !== Genre.category) || !category && Genre.category || category && !Genre.category) Genre.oninit();
    },
    getResults: function (category) {
        Genre.results = SeriesList(
            domain + (category ? "/api/media/search?options=summary" + '&q=' + category : "/api/media/all?options=summary"),
            {
                header: Genre.category ? 'Genre - ' + Genre.category : 'All Genre',
                callback: function (count) {
                    Genre.count = count;
                }
            }
        );
    },
    results: SeriesList(),
    view: function () {
        if (!AuthUser.data._id) return m.route.set('/');

        setTitle(Genre.title);

        function loadResults(category) {
            m.route.set(m.route.get(), { q: category });
        }

        var buttons = m('div', { class: 'result-switch mobile-scroll flex center' }, [
            m('button', { onclick: function () { m.route.set('/genre'); } }, 'All'),
            ["Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi", "Fantasy", "Game", "Harem", "Historical", "Horror", "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural", "Thriller", "Vampire", "Yaoi", "Yuri"]
            .map(function (category) {
                return m('button', { key: category, onclick: loadResults.bind(this, category) }, category);
            })
        ]);

        return m('div', { class: 'main-container' }, [
            m('div', [
                m('div', [
                    buttons,
                    m(Genre.results),
                    Genre.count === 0 ? m('div', { class: 'fadeInUp fast animated center-align' }, 'No results') : undefined
                ])
            ])
        ]);
    }
};