var ClubInfo = {
    series: {}
};

var Club = {
    title: '',
    currentListName: 'relevant',
    oninit: function () {
        scrollToTop();
    },
    view: function () {
        setTitle(Club.title);

        var allowClubEdit = AuthUser.data.administrator || (AuthUser.data._id === false /* admin or mod id list of current club */);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', { class: 'club-content-container bottom-divider' }, [
                    m('div', { class: 'club-cover-img', onclick: openMediaViewer, style: convertObjToStyles({ backgroundImage: 'url(' + getPosterWide(ClubInfo.series.poster_wide, undefined, 1200).poster + ')' }) }),
                    m('div', { class: 'club-header-container' }, [
                        m('div', { class: 'club-icon-img', onclick: openMediaViewer, style: convertObjToStyles({ backgroundImage: 'url(' + getPosterTall(ClubInfo.series.poster_tall, 240).poster + ')' }) }),
                        m('div', { class: 'club-info-container' }, [
                            m('div', { class: 'club-header-title' }, [
                                ClubInfo.series.title,
                                true ? m('div', m('i', { class: 'post-author-badge icon-ok-circled', title: 'Verified Club'})) : undefined
                            ]),
                            m('div', { class: 'club-header-description' }, ClubInfo.series.description)
                        ]),
                        m('div', { class: 'club-action-buttons' }, [
                            allowClubEdit ? m('button', { class: 'pseudo', title: 'Edit Club' }, m('i', { class: 'icon-cog' })) : undefined,
                            m('button', { class: 'pseudo view-info', title: 'View More Info' }, m('i', { class: 'icon-info-circled' })),
                            m('button', { class: 'pseudo', title: 'Follow ' + ClubInfo.series.title }, 'Follow'),
                            m('button', { title: 'Create New Post' }, m('i', { class: 'icon-edit' }))
                        ])
                    ])
                ]),
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    m('button', { class: Club.currentListName === 'relevant' ? 'active' : undefined, onclick: function(e) {switchList(e, Club);} }, [m('i'), 'Relevant']),
                    m('button', { class: Club.currentListName === 'latest' ? 'active' : undefined, onclick: function(e) {switchList(e, Club);} }, [m('i'), 'Latest']),
                    m('button', { class: Club.currentListName === 'oldest' ? 'active' : undefined, onclick: function(e) {switchList(e, Club);} }, [m('i'), 'Oldest'])
                ]),
                m('div', { class: 'post-feed' }, dataToPostFeed(posts))
            ])
        ]);
    },
    oncreate: function (vnode) {
        setTitle("WonderfulSubs", true);
        scrollToTop();
        
        var slug = vnode.attrs.id;

        m.request({
            method: "GET",
            url: domain + "/api/v2/media/series?series=" + slug,
            headers: {
                Authorization: 'Bearer ' + AuthUser.data.token
            },
            config: function (xhr) {
                Club.XHR = xhr;
            }
        }).then(function (result) {
            try {
                Club.XHR = null;
                var series = result.json;
                if (series) {
                    setTitle(series.title);
                    ClubInfo.series = series;
                }
            } catch (error) { }
        }).catch(function (error) {
            // if (error.code < 200 && error.code < 299) {
            //     AuthUser.logout();
            // }
        });
    }
};