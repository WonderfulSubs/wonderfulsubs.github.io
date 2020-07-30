var Welcome = {
    view: function () {
        setTitle('WonderfulSubs | Anime Entertainment Paradise', true);

        return m('div', { class: 'flex two-700 center' }, [
            m('div', { class: 'welcome-message center-align' }, [
                m('div', [
                    m('h1', ['Welcome to ', m('span', 'WonderfulSubs')]),
                    m('h2', 'Anime Entertainment Paradise'),
                    m('p', 'We strive to entertain and inform people of the latest and greatest in the Anime world.')
                ]),
                m('div', {class: 'flex one two-1000'}, [
                    m('p', m('a', { href: 'https://www.facebook.com/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-facebook-squared'), 'Like us on Facebook'])),
                    m('p', m('a', { href: 'https://twitter.com/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-twitter-squared'), 'Follow us on Twitter'])),
                    m('p', m('a', { href: 'https://www.instagram.com/wonderful.subs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-instagram'), 'Follow us on Instagram'])),
                    m('p', m('a', { href: 'https://www.youtube.com/WonderfulSubs?sub_confirmation=1', target: '_blank', rel: 'noreferrer' }, [m('i.icon-youtube-play'), 'Subscribe to us on YouTube'])),
                    m('p', m('a', { href: 'https://www.reddit.com/r/WonderfulSubs', target: '_blank', rel: 'noreferrer' }, [m('i.icon-reddit'), 'Subscribe to us on Reddit'])),
                    m('p', m('a', { href: 'https://discord.gg/CegGQ2G', target: '_blank', rel: 'noreferrer' }, [m('i.icon-comment'), 'Join us on Discord'])),
                    m('p', m('a', { href: 'https://app.wonderfulsubs.com/newsletter', target: '_blank', rel: 'noreferrer' }, [m('i.icon-mail-alt'), 'Subscribe to our Newsletter']))
                ])
            ]),
            m(Login)
        ]);
    }
};