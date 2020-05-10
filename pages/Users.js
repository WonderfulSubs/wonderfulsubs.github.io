var Users = {
    letter: '',
    count: '',
    title: '',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var letter = params.letter;
        Users.letter = letter;
        Users.count = '';
        Users.title = letter ? '"' + (letter === 'none' ? '#' : letter.toUpperCase()) + '" - A-Z List' : 'A-Z List';
        Users.getResults(Users.letter ? Users.letter.trim() : undefined);
        // m.redraw();
    },
    onupdate: function (vnode) {
        var letter = vnode.attrs.letter;
        if ((letter && letter !== Users.letter) || !letter && Users.letter || letter && !Users.letter) Users.oninit();
    },
    getResults: function (letter) {
        Users.results = {
            url: domain + "/api/v2/users/list?" + (letter ? 'letter=' + letter : ''),
            options: {
                header: Users.letter ? 'Users - ' + (Users.letter === 'none' ? '#' : Users.letter.toUpperCase()) : 'All Users',
                callback: function (count) {
                    Users.count = count;
                }
            }
        };
    },
    view: function () {
        setTitle(Users.title);

        function loadResults(letter) {
            m.route.set(m.route.get(), { letter: letter });
        }

        var buttons = m('div', { class: 'result-switch flex twelve center' }, [
            m('button', { onclick: function () { m.route.set('/users'); } }, 'All'),
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
                    m(UserList, Users.results),
                    Users.count === 0 ? m('div', { class: 'fadeInUp fast animated center-align' }, 'No results') : undefined
                ])
            ])
        ]);
    }
};