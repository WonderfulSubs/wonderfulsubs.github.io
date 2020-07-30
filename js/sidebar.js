function announcementClick() {
    window.open('https://discord.gg/AQkYAbb');
    err(function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Top Announcement',
            eventAction: 'Click',
            eventLabel: 'Join WS Discord',//title,
            eventValue: 3552917,//id,
        });
    });
}


var Sidebar = {
    view: function () {
        // var sidebarStyles = m('style', '.content-wrapper-container.flex{margin:0 auto;flex-direction:column-reverse}@media only screen and (min-width:1000px){.content-wrapper-container.flex{flex-direction:row;padding-top:0.3em}}');
        var blogPosts = m(BloggerList, { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary?alt=json&max-results=5', title: 'From the Blog' });

        return m.fragment({}, [
            m.fragment({}, [
                llv('div', { class: 'sidebar-top-announcement pointer', onclick: announcementClick }, [
                    m("ins.adsbygoogle[data-ad-client='ca-pub-7274415743225662'][data-ad-format='" + ((window.innerWidth > 998) ? 'vertical,' : '') + "rectangle,horizontal'][data-ad-slot='6251333500'][data-full-width-responsive='true']", {
                        style: { "display": "block" }, backup_style: convertObjToStyles({ "display": "block" }), oncreate: function (vnode) {
                            window.addEventListener('resize', function() {
                                var currentVal = vnode.dom.attributes['data-ad-format'].value;
                                if (window.innerWidth > 998 && (currentVal !== 'vertical,rectangle,horizontal')) {
                                    vnode.dom.attributes['data-ad-format'].value = 'vertical,rectangle,horizontal';
                                } else if (window.innerWidth <= 998 && (currentVal !== 'rectangle,horizontal')) {
                                    vnode.dom.attributes['data-ad-format'].value = 'rectangle,horizontal';
                                }
                            });
                        }
                    })
                ]),
                blogPosts,
                m('div', { class: 'animated fadeInUp slower' }, '© ' + (new Date()).getFullYear() + ' WonderfulSubs LLC')
                // llv('iframe', { src: 'https://discordapp.com/widget?id=386361030353354765&theme=light', width: '100%', height: '500', allowtransparency: 'true', frameborder: '0' })
            ]),
            // sidebarStyles
        ]);
    }
};