var featured = BloggerList('https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json&max-results=5');

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

var sidebarStyles = m('style', '.content-wrapper-container.flex{margin:0 auto;flex-direction:column-reverse}@media only screen and (min-width:1000px){.content-wrapper-container.flex{flex-direction:row;padding-top:0.3em}}');

var Sidebar = m.fragment({}, [
    m('div', { class: 'sidebar-container animated slideInDown' }, [
        m('div', { class: 'sidebar-top-announcement pointer', onclick: announcementClick }),
        // m(featured),
        // m('div', { id: 'amzn-assoc-ad-29f412c0-c0c8-46e1-9652-1dba8fdf13d5' }),
        // m('script', { async: '', src: '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=29f412c0-c0c8-46e1-9652-1dba8fdf13d5' }),
        m('iframe', { src: 'https://discordapp.com/widget?id=386361030353354765&theme=light', width: '100%', height: '500', allowtransparency: 'true', frameborder: '0' })
    ]),
    sidebarStyles
]);