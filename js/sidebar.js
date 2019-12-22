function announcementClick() {
    window.open('https://blog.wonderfulsubs.com/donate');
    err(function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Top Announcement',
            eventAction: 'Click',
            eventLabel: 'Become A Supporter',//title,
            eventValue: 2557916,//id,
        });
    });
}


var Sidebar = {
    view: function () {
        var sidebarStyles = m('style', '.content-wrapper-container.flex{margin:0 auto;flex-direction:column-reverse}@media only screen and (min-width:1000px){.content-wrapper-container.flex{flex-direction:row;padding-top:0.3em}}');
        var blogPosts = m(BloggerList, { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json&max-results=5' });

        return m.fragment({}, [
            m('div', { class: 'sidebar-container animated slideInDown' }, [
                llv('div', { class: 'sidebar-top-announcement pointer', onclick: announcementClick }),
                blogPosts,
                // llv('iframe', { src: 'https://discordapp.com/widget?id=386361030353354765&theme=light', width: '100%', height: '500', allowtransparency: 'true', frameborder: '0' })
            ]),
            sidebarStyles
        ]);
    }
};