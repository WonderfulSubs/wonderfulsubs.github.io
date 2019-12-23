var Poster = {
    view: function (vnode) {
        var item = vnode.attrs.item;
        var preventUpdate = vnode.attrs.preventUpdate;
        var changeOnRemove = vnode.attrs.changeOnRemove;

        function goToUrl() {
            m.route.set(item.url);
        }

        var isInWatchList = AuthUser.isInList('Watch List', item);
        var isFavoritesList = AuthUser.isInList('Favorites', item);

        function listAction(listName, e) {
            preventAndStop(e).then(AuthUser.addToRemoveFromList.bind(this, listName, item, { preventUpdate: preventUpdate, element: changeOnRemove ? e.target.parentElement.parentElement.parentElement.parentElement : undefined }));
        }

        var imgSrc = item.poster || getPosterTall(item.poster_tall).poster;

        return m('div', { class: 'poster-item-container animated fadeInUp faster' }, [
            m('div', { class: 'poster-item' }, [
                m('a', { href: item.url, oncreate: m.route.link, onclick: function (e) { e.preventDefault(); } }, [
                    llv('img', { src: imgSrc, class: 'animated fadeIn', alt: item.title, onclick: goToUrl }),
                    m('div', { class: 'poster-title', onclick: goToUrl }, [
                        m('span', item.title)
                    ]),
                    m('div', { class: 'poster-list-button-container flex two' }, [
                        m('div', { class: 'poster-watch-later three-fourth animated faster' + (isInWatchList ? ' active fadeIn' : ''), onclick: function (e) { listAction('Watch List', e); } }, [
                            m('span', [
                                m('i', { class: 'icon-clock' }),
                                isInWatchList ? ' In Watch List' : ' Watch Later'
                            ])
                        ]),
                        m('div', { class: 'poster-favorite fourth animated faster' + (isFavoritesList ? ' active fadeIn' : ''), onclick: function (e) { listAction('Favorites', e); } }, [
                            m('i', { class: 'icon-heart' })
                        ])
                    ]),
                    m('div', { class: 'poster-language', onclick: goToUrl }, [
                        m('span', item.is_subbed && item.is_dubbed ? 'SUBS | DUBS' : item.is_subbed ? 'SUBS' : item.is_dubbed ? 'DUBS' : 'ORIGINAL')
                    ])
                ])
            ])
        ]);
    }
};

var PosterGrid = {
    view: function (vnode) {
        var items = vnode.attrs.items;
        var preventUpdate = vnode.attrs.preventUpdate;
        var changeOnRemove = vnode.attrs.changeOnRemove;
        var sideScroll = vnode.attrs.sideScroll;
        return m('div', { class: 'flex' + (sideScroll ? ' side-scroll' : '') },
            items.map(function (item) {
                return m(Poster, { key: item.url, item: item, preventUpdate: preventUpdate, changeonremove: changeOnRemove });
            })
        );
    }
};