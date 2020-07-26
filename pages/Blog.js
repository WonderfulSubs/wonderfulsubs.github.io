var Blog = {
    oninit: function () {
        scrollToTop();
    },
    view: function () {
        setTitle('WonderfulSubs Blog', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, 
                m('div', m(BloggerList, { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json', full: true }))
            )
        ]);
    }
};