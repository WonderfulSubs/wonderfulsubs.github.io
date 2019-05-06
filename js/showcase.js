var ShowcaseItem = {
    view: function (vnode) {
        var item = vnode.attrs.item;
        var numOfItems = vnode.attrs.numOfItems;
        var index = vnode.attrs.index;
        return m('a', { href: item.url }, [
            m('div', { class: 'showcase-item animated zoomIn faster', style: convertObjToStyles({ marginBottom: numOfItems > 3 && (index + 1) === numOfItems ? '32px' : undefined, float: numOfItems === 1 ? undefined : index === 0 ? 'left' : 'right', width: numOfItems === 1 || index > 2 ? '100%' : numOfItems === 2 ? '50%' : index === 0 ? '59%' : '40%', height: index === 0 || numOfItems === 2 ? '100%' : '49%', padding: index === 0 ? '0 2px 2px 0' : index === 1 ? '0 0 2px 2px' : index === 2 ? '2px 0 3px 2px' : index === 3 ? '2px 0 0 0' : '4px 0 0 0' }) }, [
                m('div', { class: 'showcase-content-container', style: convertObjToStyles({ backgroundImage: 'url(' + (item.poster || getPosterWide(item.poster_wide).poster) + ')' }) }, [
                    m('div', { class: 'showcase-content', style: convertObjToStyles({ height: index === 0 ? '262px' : (index === 1 || index === 3) ? '130px' : '128px' }) }, [
                        m('span', { class: 'showcase-title' }, item.title)
                    ])
                ])
            ])
        ]);
    }
};

var ShowcaseGrid = {
    view: function (vnode) {
        var items = vnode.attrs.items;
        return m('div', { class: 'showcase-container' },
            items.map(function (item, index) {
                return m(ShowcaseItem, { key: item.url, item: item, index: index, numOfItems: items.length });
            })
        );
    }
};