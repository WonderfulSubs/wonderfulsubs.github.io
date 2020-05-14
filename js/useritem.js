var UserItem = {
    view: function (vnode) {
        var item = vnode.attrs.item;
        var name = item.display_name || item.username;
        var allowSendMessage = !item.private;
        var allowFollow = allowSendMessage;

        function goToUrl() {
            m.route.set('/profile/' + item.username);
        }

        return m('div', { class: 'club-content-container left-divider right-divider bottom-divider animated fadeInUp faster user-item' }, [
            llv('div', { class: 'club-cover-img', onclick: goToUrl, style: convertObjToStyles({ backgroundImage: 'url(' + item.cover_pic + ')' }) }),
            m('div', { class: 'club-header-container' }, [
                llv('div', { class: 'club-icon-img', onclick: goToUrl, style: convertObjToStyles({ backgroundImage: 'url(' + item.profile_pic + ')' }) }),
                m('div', { class: 'club-info-container', onclick: goToUrl }, [
                    m('div', { class: 'club-header-title' }, [
                        m('div', { class: 'club-item-wrapper' }, name),
                        m('label', item.verified ? m('div', m('i', { class: 'post-author-badge icon-ok-circled', title: 'Verified User' })) : undefined),
                        m('label', item.administrator ? m('div', m('i', { class: 'post-author-badge icon-shield', title: 'Administrator' })) : undefined),
                        m('label', item.moderator && !item.administrator ? m('div', m('i', { class: 'post-author-badge icon-wrench', title: 'Moderator' })) : undefined),
                        m('label', item.supporter ? m('div', m('i', { class: 'post-author-badge icon-star', title: 'Supporter' })) : undefined),
                        m('label', item.private ? m('div', m('i', { class: 'post-author-badge icon-lock', title: 'Private Profile' })) : undefined),
                    ]),
                    m(m.route.Link, { href: '/profile/' + item.username, class: 'club-header-username' }, '@' + item.username),
                    m('div', { class: 'club-item-wrapper' }, [
                         m('div', { class: 'club-header-description' + (vnode.state.extendInfo ? ' extended-info' : '') }, item.biography),
                        m('div', { class: 'club-header-date-created' + (vnode.state.extendInfo ? ' extended-info' : '') }, 'Joined ' + (new Date(item.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })))
                    ])
                ]),
                m('div', { class: 'club-action-buttons' }, [
                    m.fragment({}, [
                        m('button', { class: 'pseudo view-info', title: 'View More Info', onclick: function () { vnode.state.extendInfo = !vnode.state.extendInfo; } }, m('i', { class: 'icon-info-circled' })),
                        allowFollow ? m('button', { class: 'pseudo', title: 'Follow ' + name }, 'Follow') : undefined,
                        allowSendMessage ? m('button', { class: 'pseudo', title: 'Message ' + name }, m('i', { class: 'icon-comment' })) : undefined,
                    ])
                ])
            ])
        ]);
    }
};

var UserGrid = {
    view: function (vnode) {
        var items = vnode.attrs.items;
        var preventUpdate = vnode.attrs.preventUpdate;
        var changeOnRemove = vnode.attrs.changeOnRemove;
        return m('div', { class: 'flex' },
            items.map(function (item) {
                return m(UserItem, { key: item.url, item: item, preventUpdate: preventUpdate, changeonremove: changeOnRemove });
            })
        );
    }
};