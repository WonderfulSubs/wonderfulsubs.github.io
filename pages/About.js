var About = {
    oninit: function () {
        scrollToTop();
    },
    view: function () {
        setTitle('About', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, 
                m('div', { class: 'blog-body' }, [
                    m('h2', { class: 'blog-body-title' }, 'About WonderfulSubs'),
                    m('div', { class: 'blog-body-content bottom-divider' }, ''),
                ])
            ),
            m('style', '@media only screen and (max-width:998px){.content-wrapper-container.flex{overflow:hidden}}')
        ]);
    }
};