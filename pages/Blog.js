var LatestBlogFeed = {
    feed: { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json', full: true },
    view: function () {
        return m('div', m(BloggerList, LatestBlogFeed.feed))
    }
};

var NewsBlogFeed = {
    feed: { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary/-/News?alt=json', full: true },
    view: function () {
        return m('div', m(BloggerList, NewsBlogFeed.feed))
    }
};

var VideoBlogFeed = {
    feed: { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary/-/Videos?alt=json', full: true },
    view: function () {
        return m('div', m(BloggerList, VideoBlogFeed.feed))
    }
};

var Blog = {
    oninit: function () {
        scrollToTop();
    },
    currentListName: 'latest',
    view: function () {
        setTitle('WonderfulSubs Blog', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    m('button', { class: Blog.currentListName === 'latest' ? 'active' : undefined, onclick: function(e) {switchList(e, Blog);} }, 'Latest'),
                    m('button', { class: Blog.currentListName === 'news' ? 'active' : undefined, onclick: function(e) {switchList(e, Blog);} }, 'News'),
                    m('button', { class: Blog.currentListName === 'videos' ? 'active' : undefined, onclick: function(e) {switchList(e, Blog);} }, 'Videos')
                ]),
                Blog.currentListName === 'news' ? m(NewsBlogFeed) : Blog.currentListName === 'videos' ? m(VideoBlogFeed) : m(LatestBlogFeed)
            ])
        ]);
    }
};