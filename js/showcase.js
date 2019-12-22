var ShowcaseItem = {
    view: function (vnode) {
        var item = vnode.attrs.item;
        if (item.poster) item.poster = item.poster.replace('\/s1600\/', '\/w203-h107-c\/');
        var numOfItems = vnode.attrs.numOfItems;
        var index = vnode.attrs.index;
        return m('a', { href: item.url, rel: 'noopener', target: '_blank' }, [
            m('div', { class: index !== (numOfItems - 1) ? 'bottom-divider' : undefined }, [
                llv('img', { class: 'vertical-center', src: item.poster || getPosterWide(item.poster_wide).poster }),
                m('span', item.title)
            ])
        ]);
    }
};

var ShowcaseGrid = {
    view: function (vnode) {
        var items = vnode.attrs.items;
        return m('div', { class: 'showcase-container animated zoomIn faster' }, [
            m('h4', { class: 'poster-header' }, 'From the Blog'),
            items.map(function (item, index) {
                return m(ShowcaseItem, { key: item.url, item: item, index: index, numOfItems: items.length });
            })
        ]);
    }
};