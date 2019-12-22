var Series = {
    letter: '',
    count: '',
    title: '',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var letter = params.letter;
        Series.letter = letter;
        Series.count = '';
        Series.title = letter ? '"' + (letter === 'none' ? '#' : letter.toUpperCase()) + '" - A-Z List' : 'A-Z List';
        Series.getResults(Series.letter ? Series.letter.trim() : undefined);
        // m.redraw();
    },
    onupdate: function (vnode) {
        var letter = vnode.attrs.letter;
        if ((letter && letter !== Series.letter) || !letter && Series.letter || letter && !Series.letter) Series.oninit();
    },
    getResults: function (letter) {
        Series.results = SeriesList(
            domain + "/api/media/all?options=summary" + (letter ? '&letter=' + letter : ''),
            {
                header: Series.letter ? 'Series - ' + (Series.letter === 'none' ? '#' : Series.letter.toUpperCase()) : 'All Series',
                callback: function (count) {
                    Series.count = count;
                }
            }
        );
    },
    results: SeriesList(),
    view: function () {
        setTitle(Series.title);

        function loadResults(letter) {
            m.route.set(m.route.get(), { letter: letter });
        }

        var buttons = m('div', { class: 'result-switch flex twelve center' }, [
            m('button', { onclick: function () { m.route.set('/series'); } }, 'All'),
            m('button', { onclick: loadResults.bind(this, 'none') }, '#'),
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(function (letter) {
                return m('button', { key: letter, onclick: loadResults.bind(this, letter) }, letter);
            })
        ]);

        return m('div', { class: 'main-container' }, [
            m('div', [
                m('div', [
                    m('h4', { class: 'poster-header' }, 'A-Z'),
                    buttons,
                    m(Series.results),
                    Series.count === 0 ? m('div', { class: 'fadeInUp fast animated center-align' }, 'No results') : undefined
                ])
            ])
        ]);
    }
};