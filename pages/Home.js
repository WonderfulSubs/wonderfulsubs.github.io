var ChatboxElem;
function HomeToggleChatbox(options) {
    if (window.innerWidth >= 700) {
        Home.chatEnabled = !Home.chatEnabled;
        if (Home.chatEnabled && !Home.chatIframeLoaded) Home.chatIframeLoaded = true;
        if (ChatboxElem) {
            if (!ChatboxElem.style.display) {
                ChatboxElem.style.display = 'none';
            } else {
                ChatboxElem.style.display = '';
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

var HomeFeed = {
    view: function() {
        return m('div', { class: 'post-feed' }, dataToPostFeed(posts))
    }
}

var SeriesFeed = {
    popular: { url: domain + '/api/v2/media/popular?count=24', options: { header: 'Popular' } },
    updated: { url: domain + '/api/v2/media/latest?count=24', options: { header: 'Recently Updated' } },
    view: function () {
        return m('div', { class: 'flex two' }, [
            m('div', m(SeriesList, SeriesFeed.popular)),
            m('div', { class: 'left-divider' }, m(SeriesList, SeriesFeed.updated))
        ])
    }
};

var RandomFeed = {
    feed: { url: domain + '/api/v2/media/random?options=summary&count=24', options: { header: 'Random' } },
    view: function () {
        return m('div', { class: 'flex one' }, m('div', m(SeriesList, RandomFeed.feed)))
    }
};

var Home = {
    oninit: function () {
        scrollToTop();

        Home.chatEnabled = window.innerWidth < 700 ? false : getStorage('chat');
        Home.chatIframeLoaded = Home.chatEnabled;
    },
    currentListName: 'series',
    view: function () {
        setTitle('WonderfulSubs', true);

        // function turnOnChatOnResize() {
        //     if (window.innerWidth >= 700) {
        //         HomeToggleChatbox();
        //         window.removeEventListener('resize', turnOnChatOnResize);
        //     }
        // }

        // var player = llc(VideoPlayer, { src: { src: "https://stream.wonderfulsubs.com/live/stream/index.m3u8", type: "application/x-mpegURL" }, options: { muted: true, disablePauseOnScroll: true } });

        // var chatbox = llv('iframe', {
        //     src: 'https://titan.wonderfulsubs.com/embed/386361030353354765?css=1&defaultchannel=386361187811459074&username=WS%20Guest', frameborder: '0',
        //     oncreate: function (vnode) {
        //         ChatboxElem = vnode.dom;
        //         if (window.innerWidth < 700 && getStorage('chat')) window.addEventListener('resize', turnOnChatOnResize);
        //     },
        //     onremove: function () {
        //         window.removeEventListener('resize', turnOnChatOnResize);
        //     }
        // });

        // var chatboxOverlay = m('div', { class: 'home-chat-overlay' }, m('button', { onclick: function(){ HomeToggleChatbox(); } }, [
        //     m('i', { class: 'icon-comment' }),
        //     'Turn Chat On'
        // ]));

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                // m('div', { class: 'flex one two-700' }, [
                //     m('div', { class: 'flex-padding-reset two-third-700' }, player),
                //     m('div', { class: 'home-chat-container none third-700 flex-padding-reset animated fadeIn slow', oncreate: function (vnode) { Home.chatContainer = vnode.dom; } }, [
                //         Home.chatEnabled ? undefined : chatboxOverlay,
                //         Home.chatIframeLoaded ? chatbox : undefined
                //     ])
                // ]),
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    m('button', { class: Home.currentListName === 'feed' ? 'active' : undefined, onclick: function(e) {switchList(e, Home);} }, 'Feed'),
                    m('button', { class: Home.currentListName === 'series' ? 'active' : undefined, onclick: function(e) {switchList(e, Home);} }, 'Series'),
                    m('button', { class: Home.currentListName === 'random' ? 'active' : undefined, onclick: function(e) {switchList(e, Home);} }, 'Random')
                ]),
                Home.currentListName === 'series' ? m(SeriesFeed) : Home.currentListName === 'random' ? m(RandomFeed) : m(HomeFeed)
            ])
        ]);
    }
};