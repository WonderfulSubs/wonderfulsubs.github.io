var popularSeries = SeriesList(domain + '/api/media/popular?count=24', { header: 'Popular' });
var updatedSeries = SeriesList(domain + '/api/media/latest?count=24', { header: 'Recently Updated' });
var randomSeries = SeriesList(domain + '/api/media/random?options=summary&count=5', { header: 'Random', sideScroll: true });

var chatbox = m('iframe', { class: 'animated fadeIn slower', src: 'https://titan.wonderfulsubs.com/embed/386361030353354765?css=1&defaultchannel=386361187811459074&username=WS%20Guest', frameborder: '0', width: '100%' });

var Home = {
    oninit: function () {
        scrollToTop();
    },
    onremove: function() {
        Home.player.player.dispose();
    },
    player: VideoPlayer({
        src: "https://stream.wonderfulsubs.com/live/stream/index.m3u8",
        type: "application/x-mpegURL"
    }, { muted: true }, function (player) {
        player.on('playerresize', function(e) {
            chatbox.dom.style.height = e.target.clientHeight + 'px';
        });
    }),
    view: function () {
        setTitle('WonderfulSubs', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', { class: 'flex one two-700' }, [
                    m('div', { class: 'flex-padding-reset two-third-700' }, m(Home.player)),
                    m('div', { class: 'none third-700' }, chatbox)
                ]),
                m('div', { class: 'flex two' }, [
                    m('div', m(popularSeries)),
                    m('div', { class: 'left-divider' }, m(updatedSeries))
                ])
            ])
        ]);
    }
};