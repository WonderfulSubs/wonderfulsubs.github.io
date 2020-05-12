var Users = {
    letter: '',
    count: '',
    title: '',
    oninit: function () {
        scrollToTop();
        var params = m.route.param();
        var letter = params.letter;
        var sort = params.sort;
        var order = params.order;
        Users.letter = letter;
        Users.sort = sort;
        Users.order = order;
        Users.count = '';
        Users.title = (letter ? '"' + (letter === 'none' ? '#' : letter.toUpperCase()) + '" - ' : (sort === 'date_created' && order === 'desc') ? 'Recent - ' : '') + 'Users List';
        Users.getResults(Users.letter ? Users.letter.trim() : undefined, Users.sort ? Users.sort.trim() : undefined,  Users.order ? Users.order.trim() : undefined);
        // m.redraw();
    },
    onupdate: function (vnode) {
        var letter = vnode.attrs.letter;
        var sort = vnode.attrs.sort;
        var order = vnode.attrs.order;
        if ((letter && letter !== Users.letter) || !letter && Users.letter || letter && !Users.letter ||
            (sort && sort !== Users.sort) || !sort && Users.sort || sort && !Users.sort ||
            (order && order !== Users.order) || !order && Users.order || order && !Users.order) return Users.oninit();
    },
    getResults: function (letter, sort, order) {
        Users.results = {
            url: domain + "/api/v2/users/list?" + (letter ? 'letter=' + letter : '') + (sort ? '&sort=' + sort : '') + (order ? '&order=' + order : ''),
            options: {
                header: (Users.sort === 'date_created' && Users.order === 'desc') ? 'Recent Users' : Users.letter ? 'Users - ' + (Users.letter === 'none' ? '#' : Users.letter.toUpperCase()) : 'All Users',
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
            m('button', { onclick: function () { m.route.set('/users?sort=date_created&order=desc'); } }, 'Recent'),
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