var BlogPost = {
    view: function (vnode) {
        return m.fragment({},
            m('div', { class: 'main-container' }, 
                m('div', { class: 'blog-body' }, [
                    m('h2', { class: 'blog-body-title' }, vnode.state.title),
                    m('div', { class: 'blog-body-info' }, [
                        m('img', { class: 'blog-body-author-img', src: vnode.state.authorImg }),
                        m('span', 'by ' + vnode.state.authorName + ' • ' + vnode.state.publishDate)
                    ]),
                    m('div', { class: 'blog-body-content bottom-divider' }, vnode.state.postContent)
                ])
            )
        );
    },
    oncreate: function (vnode) {
        var id = vnode.attrs.id;
        BlogPost.currentId = id;

        setTitle("WonderfulSubs", true);
        scrollToTop();

        m.jsonp({
            url: 'https://blog.wonderfulsubs.com/feeds/posts/default/' + id + '?alt=json',
        }).then(function (result) {
            try {
                vnode.state.title = result.entry.title.$t;
                vnode.state.authorImg = 'https:' + result.entry.author[0].gd$image.src;
                vnode.state.authorName = result.entry.author[0].name.$t;
                vnode.state.publishDate = (new Date(result.entry.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
                vnode.state.postContent = m.trust(result.entry.content.$t);
                setTitle(vnode.state.title);
                loadGAScript();
            } catch(error) {
                // console.log(error);
            }
        });
    },
    onupdate: function(vnode) {
        var id = vnode.attrs.id;
        if (id !== BlogPost.currentId) BlogPost.oncreate(vnode);

        vnode.dom.querySelectorAll('img').forEach(function (target) {
            if (!target.onclick) {
                target.onclick = function (e) {
                    preventAndStop(e, openMediaViewer.bind(this, e));
                };
            }
        });
    },
    onremove: function() {
        document.querySelectorAll('ins').forEach(function(elem) {
            elem.removeAttribute('data-adsbygoogle-status');
            elem.innerHTML = '';
            var parentElem = elem.parentElement;
            if (parentElem && parentElem.style) {
                if (parentElem.style.getPropertyPriority('height') === 'important') parentElem.style.removeProperty('height');
                if (parentElem.style.getPropertyPriority('width') === 'important') parentElem.style.removeProperty('width');
            }
        });
    }
};