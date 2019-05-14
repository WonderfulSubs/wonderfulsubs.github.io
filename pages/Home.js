var popularSeries = SeriesList(domain + '/api/media/popular?count=24', { header: 'Popular' });
var updatedSeries = SeriesList(domain + '/api/media/latest?count=24', { header: 'Recently Updated' });
var randomSeries = SeriesList(domain + '/api/media/random?options=summary&count=5', { header: 'Random', sideScroll: true });
var featured = BloggerList('https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json&max-results=4');

var Home = {
    oninit: function () {
        scrollToTop();
    },
    view: function () {
        if (!AuthUser.data._id) return m(Welcome);

        setTitle('WonderfulSubs', true);

        return m('div', { class: 'main-container' }, [
            /*m('div', { class: 'flex two-700' }, [
                m('div', m(featured)),
                m('div', { class: 'none half-700' }, m(randomSeries))
            ]),*/
            m('div', { class: 'flex two' }, [
                m('div', m(popularSeries)),
                m('div', { class: 'left-divider' }, m(updatedSeries))
            ])
        ]);
    }
};