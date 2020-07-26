var ShowcaseItem = {
    view: function (vnode) {
        var item = vnode.attrs.item;
        var full = vnode.attrs.full;
        if (item.poster) {
            if (item.poster.indexOf('//img.youtube.com/') !== -1) {
                item.poster = item.poster.replace('/mqdefault.', '/maxresdefault.');
            } else {
                item.poster = item.poster.replace('\/s1600\/', full ? '\/w1020-h538-c\/' : '\/w203-h107-c\/');
            }
        }
        var numOfItems = vnode.attrs.numOfItems;
        var index = vnode.attrs.index;
        return m(m.route.Link, { href: item.url }, [
            m('div', { class: ( full ? 'post-item ' : '') + ((!full && index) !== (numOfItems - 1) ? 'bottom-divider' : '') }, [
                llv('img', { class: 'vertical-center', src: item.poster || getPosterWide(item.poster_wide).poster }),
                m('span', item.title),
                full ? m('span', { class: 'shwcse-author top-divider' }, 'by ' + item.author + ' • ' + item.publish_date) : undefined
            ])
        ]);
    }
};

var ShowcaseGrid = {
    view: function (vnode) {
        var items = vnode.attrs.items;
        var title = vnode.attrs.title;
        var full = vnode.attrs.full;

        return m('div', { class: 'showcase-container animated faster ' + (full ? 'fadeInUp' : 'zoomIn') }, [
            title ? m('h4', { class: 'poster-header' }, title) : undefined,
            m('div', { class: full ? 'post-feed' : undefined }, items.map(function (item, index) {
                return m(ShowcaseItem, { key: item.url, item: item, index: index, numOfItems: items.length, full: full });
            }))
        ]);
    }
};