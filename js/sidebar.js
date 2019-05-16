var sidebarStyles = m('style', '.content-wrapper.flex{margin:0 auto;flex-direction:column-reverse}@media only screen and (min-width:1000px){.content-wrapper.flex{flex-direction:row}}');

var Sidebar = m.fragment({}, [
    m('div', { class: 'sidebar-container full fourth-1000 animated zoomIn faster' }, [
        m('div', { class: 'sidebar-top-announcement pointer', onclick: window.open.bind(this, 'https://blog.wonderfulsubs.com/donate') }),
        m('iframe', { src: 'https://discordapp.com/widget?id=386361030353354765&theme=light', width: '100%', height: '500', allowtransparency: 'true', frameborder: '0' })
    ]),
    sidebarStyles
]);