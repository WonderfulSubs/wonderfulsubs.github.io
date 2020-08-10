var Welcome = {
    view: function (vnode) {
        setTitle('WonderfulSubs | Anime Entertainment Paradise', true);

        var isHome = vnode.attrs.isHome;
        return m('div', { class: 'flex center' +  (isHome ? '' : ' two-700')}, [
            m('div', { class: 'welcome-message center-align' }, [
                m('div', [
                    m('h1', ['Welcome to ', m('span', 'WonderfulSubs')]),
                    m('h2', 'Anime Entertainment Paradise'),
                    m('p', 'We strive to entertain and inform people of the latest and greatest in the Anime world.'),
                    isHome ? m(VideoPlayer, { src: { src: 'https://www.youtube.com/watch?v=G8Aq7AManu8&list=PLFKXApK6bByWwRr8f_bwX2f1pKyNLtceA', type: 'video/youtube' }, options: { muted: true } }) : undefined
                ]),
                m('div', {class: 'flex one two-1000' + (isHome ? ' is-home' : '')}, [
                    m('p', m('a', { href: 'https://www.facebook.com/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-facebook-squared'), 'Like us on Facebook'])),
                    m('p', m('a', { href: 'https://twitter.com/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-twitter-squared'), 'Follow us on Twitter'])),
                    m('p', m('a', { href: 'https://www.instagram.com/wonderful.subs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-instagram'), 'Follow us on Instagram'])),
                    m('p', m('a', { href: 'https://www.youtube.com/WonderfulSubs?sub_confirmation=1', target: '_blank', rel: 'noreferrer' }, [m('i.icon-youtube-play'), 'Subscribe to us on YouTube'])),
                    m('p', m('a', { href: 'https://www.reddit.com/r/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-reddit'), 'Subscribe to us on Reddit'])),
                    m('p', m('a', { href: 'https://discord.gg/CegGQ2G', target: '_blank', rel: 'noreferrer' }, [m('i.icon-comment'), 'Join us on Discord'])),
                    m('p', m('a', { href: 'https://app.wonderfulsubs.com/newsletter', target: '_blank', rel: 'noreferrer' }, [m('i.icon-mail-alt'), 'Subscribe to our Newsletter']))
                ]),
                m('button', { style: { borderRadius: '19px' }, onclick: function(){ m.route.set('/blog'); } }, 'Check Out Our Blog For More!')
            ]),
            isHome ? undefined : m(Login)
        ]);
    }
};