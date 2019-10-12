var popularSeries = SeriesList(domain + '/api/media/popular?count=24', { header: 'Popular' });
var updatedSeries = SeriesList(domain + '/api/media/latest?count=24', { header: 'Recently Updated' });
<<<<<<< Updated upstream
var randomSeries = SeriesList(domain + '/api/media/random?options=summary&count=5', { header: 'Random', sideScroll: true });
var featured = BloggerList('https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json&max-results=5');
=======
//var randomSeries = SeriesList(domain + '/api/media/random?options=summary&count=5', { header: 'Random', sideScroll: true });

function HomeToggleChatbox(options) {
    if (window.innerWidth >= 700) {
        Home.chatEnabled = !Home.chatEnabled;
        if (Home.chatEnabled && !Home.chatIframeLoaded) Home.chatIframeLoaded = true;
        if (Home.chatbox.dom) {
            if (!Home.chatbox.dom.style.display) {
                Home.chatbox.dom.style.display = 'none';
            } else {
                Home.chatbox.dom.style.display = '';
            }
        }
        m.redraw();
        setStorage('chat', Home.chatEnabled);
        if (!options) options = {};
        var showToast = options.showToast;
        if (showToast) {
            nativeToast({
                message: 'Chat ' + (Home.chatEnabled ? 'On' : 'Off'),
                position: 'north-east',
                type: 'info',
                closeOnClick: true
            });
        }
    }
}
>>>>>>> Stashed changes

var Home = {
    oninit: function () {
        scrollToTop();

        Home.chatEnabled = window.innerWidth < 700 ? false : getStorage('chat');
        Home.chatIframeLoaded = Home.chatEnabled;
        if (window.innerWidth < 700 && getStorage('chat')) {
            window.addEventListener('resize', function turnOnChatOnResize() {
                if (window.innerWidth >= 700) {
                    HomeToggleChatbox();
                    window.removeEventListener('resize', turnOnChatOnResize)
                }
            });
        }
    },
<<<<<<< Updated upstream
=======
    onremove: function () {
        Home.player.player.dispose();
    },
    player: VideoPlayer({
        src: "https://stream.wonderfulsubs.com/live/stream/index.m3u8",
        type: "application/x-mpegURL"
    }, { muted: true }, function (player) {
        player.on('playerresize', function (e) {
            if (Home.chatContainer) Home.chatContainer.style.height = e.target.clientHeight + 'px';
        });
    }),
    chatbox: m('iframe', { src: 'https://titan.wonderfulsubs.com/embed/386361030353354765?css=1&defaultchannel=386361187811459074&username=WS%20Guest', frameborder: '0' }),
    chatboxOverlay: m('div', { class: 'home-chat-overlay' }, m('button', { onclick: function(){ HomeToggleChatbox(); } }, [
        m('i', { class: 'icon-comment' }),
        'Turn Chat On'
    ])),
>>>>>>> Stashed changes
    view: function () {
        if (!AuthUser.data._id) return m(Welcome);

        setTitle('WonderfulSubs', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
<<<<<<< Updated upstream
                m('div', { class: 'flex two-700' }, [
                    m('div', { class: 'flex-padding-reset' }, m(featured)),
                    m('div', { class: 'none half-700' }, m(randomSeries))
=======
                m('div', { class: 'flex one two-700' }, [
                    m('div', { class: 'flex-padding-reset two-third-700' }, m(Home.player)),
                    m('div', { class: 'home-chat-container none third-700 flex-padding-reset animated fadeIn slow', oncreate: function (vnode) { Home.chatContainer = vnode.dom; } }, [
                        Home.chatEnabled ? undefined : Home.chatboxOverlay,
                        Home.chatIframeLoaded ? Home.chatbox : undefined
                    ])
>>>>>>> Stashed changes
                ]),
                m('div', { class: 'flex two' }, [
                    m('div', m(popularSeries)),
                    m('div', { class: 'left-divider' }, m(updatedSeries))
                ])
            ])
        ]);
    }
};