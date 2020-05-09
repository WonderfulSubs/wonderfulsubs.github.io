function showHideMore(e) {
    var button = e.target;
    if (button.tagName.toLowerCase() === 'i') button = button.parentElement;
    var previousElemSibling = button.previousElementSibling;
    if (previousElemSibling.style['overflow-y'] === 'scroll') {
        previousElemSibling.style['overflow-y'] = '';
        previousElemSibling.scrollTo(0, 0);
        button.firstElementChild.className = 'icon-down-dir';
    } else {
        previousElemSibling.style['overflow-y'] = 'scroll';
        previousElemSibling.scrollTo(0, 30);
        button.firstElementChild.className = 'icon-up-dir';
    }
}

var RecommendedList = {
    getList: function (series) {
        function filterFunc(s) {
            return s.title !== series.title;
        }

        RecommendedList.list = {
            url: domain + "/api/v2/media/search?options=summary&count=4&index=1&q=" + series.title,
            options: {
                filter: filterFunc,
                callback: function (count) {
                    if (count === 0 && Array.isArray(series.keywords)) {
                        var keywords = series.keywords.filter(function (x) {
                            return x;
                        });
                        var keyword = keywords[Math.floor(Math.random() * keywords.length)];
                        RecommendedList.list = {
                            url: domain + "/api/v2/media/random?options=summary&count=4&keyword=" + keyword,
                            options: { filter: filterFunc }
                        };
                    }
                }
            }
        };
    },
    view: function () {
        return m("div", [
            m("h2", { class: "list-header animated fadeInUp" }, [
                m("span", { class: "label full" }, "Recommended")
            ]),
            m(SeriesList, RecommendedList.list)
        ]);
    }
};

var EpisodeInfo = {
    view: function () {
        var showInfo = WatchInfo.showInfo;
        var episode = WatchInfo.episode;
        var season = WatchInfo.season;
        var series = WatchInfo.series;
        series.url = location.pathname;

        var isInWatchList = AuthUser.isInList('Watch List', series);
        var isFavoritesList = AuthUser.isInList('Favorites', series);

        var headerElements = [m("h3", showInfo && season.type !== 'episodes' ? series.title : season.title || series.title)];
        if ((season.japanese_title && season.japanese_title != season.title) || (series.japanese_title && series.japanese_title != series.title)) headerElements.push(m("h6", { class: "subtitle" }, season.japanese_title || series.japanese_title));

        var description = season.description || series.description;
        var sectionElements = [m("p", showInfo ? description : episode.description || description)];
        if (!showInfo && episode.title) sectionElements.unshift(m("h4", episode.title));

        var showMoreButton = m('div', { class: 'show-more top-divider bottom-divider', onclick: showHideMore }, m('i', { class: 'icon-down-dir' }));

        return m('div', { class: 'episode-info-container animated fadeInLeft' }, [
            m("article", { class: "card episode-info-card" }, [
                m("header", [
                    m('span', headerElements),
                    m('div', [
                        m('i', { class: (theaterModeEnabled ? 'icon-monitor' : 'icon-video') + ' theater-toggle', onclick: toggleTheater, title: theaterModeEnabled ? 'Turn off Theater Mode' : 'Turn on Theater Mode' }),
                        m('i', { class: 'icon-info-circled' + (showInfo ? ' active' : ''), onclick: function () { WatchInfo.showInfo = !showInfo; }, title: showInfo ? 'View Episode Info' : 'View Series Info' }),
                        m('i', { class: 'icon-clock info-watch-later' + (isInWatchList ? ' active' : ''), onclick: AuthUser.addToRemoveFromList.bind(this, 'Watch List', series, { showToast: true }), title: isInWatchList ? 'Remove from Watch List' : 'Save to Watch List' }),
                        m('i', { class: 'icon-heart info-favorite' + (isFavoritesList ? ' active' : ''), onclick: AuthUser.addToRemoveFromList.bind(this, 'Favorites', series, { showToast: true }), title: isInWatchList ? 'Remove from Favorites' : 'Save to Favorites' })
                    ]),
                ]),
                m("section", { class: "content flex" }, [
                    !showInfo && (episode.episode_number || episode.ova_number) ? m('div', { class: 'episode-number' }, (episode.episode_number ? 'EP ' : 'OVA ') + (episode.episode_number || episode.ova_number)) : undefined,
                    m("img", { src: showInfo ? getPosterTall(series.poster_tall, 180).poster : episode.poster || getPosterWide(episode.thumbnail, series.poster_tall, 320, 180).poster }),
                    m('div', sectionElements)
                ])
            ]),
            showMoreButton
        ]);
    }
};

var SeasonsList = {
    list: [],
    view: function () {
        var list = SeasonsList.list;

        function openCloseEpisodeList(vnode) {
            vnode.dom.onclick = function () {
                var listElem = vnode.dom.nextElementSibling;
                if (listElem.classList.contains("none")) {
                    listElem.classList.remove("none");
                } else {
                    listElem.classList.add("none");
                }
                var arrowElem = vnode.dom.querySelector('i[class*="-dir"]');
                if (arrowElem.classList.contains("icon-up-dir")) {
                    arrowElem.classList.remove("icon-up-dir");
                    arrowElem.classList.add("icon-down-dir");
                } else {
                    arrowElem.classList.remove("icon-down-dir");
                    arrowElem.classList.add("icon-up-dir");
                }
            };
        }

        return m("div", { class: "animated fadeInUpBig" },
            list.map(function (season, index) {
                season.index = index;
                var isSelected = season.index === WatchInfo.season.index;
                return m("div", { key: season.id || season.type + String(index) }, [
                    m("span",
                        {
                            class: "button full season-list-button" + (index !== (list.length - 1) ? ' bottom-divider' : '') + (isSelected ? ' active' : ''),
                            oncreate: openCloseEpisodeList
                        },
                        [
                            m('i', { class: 'icon-desktop' }),
                            (season.title || "Extras") + (season.max_season ? season.min_season ? " (Seasons " + season.min_season + "-" + season.max_season + ")" : " (Up to Season " + season.max_season + ")" : ""),
                            m("i", { class: "icon-up-dir right" })
                        ]
                    ),
                    m(EpisodeList, { list: season.episodes, season: season })
                ]);
            })
        );
    }
};

function EpisodeList(initialVnode) {
    var list = initialVnode.attrs.list;
    var season = initialVnode.attrs.season;
    list.forEach(function (episode, index) {
        episode.index = index;
    });

    var pages = getEpisodePages(list, 50);

    function setListHeight(index, e) {
        e.redraw = false;
        var tabs = e.target.parentElement;
        tabs.style.height = '';
        var row = tabs.querySelector('.row');
        var table = tabs.querySelectorAll('.table-container table')[index];
        tabs.style.height = (table.clientHeight + tabs.clientHeight - row.clientHeight) + 'px';
    }

    return {
        view: function () {
            var tabsStyle = getEpisodePagesCSS(pages.length);

            function tabs(check) {
                var randomPrefix = getRandomId();

                return pages.map(function (page, index) {
                    var id = "episode-page-tab-" + (index + 1) + "-" + (season.index + 1);
                    var name = randomPrefix + "-episodePagesTabs-" + (season.index + 1);
                    return m.fragment({ key: page.title }, [
                        m("input", {
                            id: id,
                            type: "radio",
                            name: name,
                            checked: check && index === 0 ? true : undefined
                        }),
                        m("label", { class: "pseudo button toggle", for: id, onclick: setListHeight.bind(this, index) }, page.title)
                    ]);
                });
            }

            function getLanguageLabel(episode) {
                var isSubbed = episode.is_subbed;
                var isDubbed = episode.is_dubbed;
                if (!isSubbed && Array.isArray(episode.sources)) {
                    isSubbed = episode.sources.some(function (source) {
                        return source.language === 'subs';
                    });
                }
                if (!isDubbed && Array.isArray(episode.sources)) {
                    isDubbed = episode.sources.some(function (source) {
                        return source.language === 'dubs';
                    });
                }
                return isSubbed && isDubbed ? "Subs | Dubs" : isSubbed ? "Subs" : isDubbed ? "Dubs" : "";
            }

            var tabNums = tabs(true);

            return m("div", { class: "episode-list none" }, [
                tabsStyle.html,
                m("div", { class: "tabs " + tabsStyle.className }, [
                    tabNums,
                    m("div", { class: "row" }, [
                        pages.map(function (page) {
                            return m("div", { key: page.title, class: "table-container" }, [
                                m("table", { class: "primary full" }, [
                                    m("thead", [
                                        m("tr", [
                                            m("th", "#"),
                                            m("th", "Title"),
                                            m("th", "Language")
                                        ])
                                    ]),
                                    m("tbody", { class: "table-selectable" }, [
                                        page.episodes.map(function (episode) {
                                            var isSelected = season.index === WatchInfo.season.index && episode.index === WatchInfo.episode.index;
                                            return m("tr",
                                                {
                                                    class: isSelected ? 'selected': undefined,
                                                    key: episode.title + String(episode.episode_number || episode.ova_number),
                                                    onclick: function () {
                                                        SourceSelectModal.openEpisode(episode, season);
                                                    }
                                                },
                                                [
                                                    m("td", { class: 'number' }, (episode.episode_number ? 'EP ' : 'OVA ') + (episode.episode_number || episode.ova_number)),
                                                    m("td", { class: 'title' }, episode.title),
                                                    m("td", { class: 'language' }, getLanguageLabel(episode))
                                                ]
                                            );
                                        })
                                    ])
                                ])
                            ]);
                        })
                    ]),
                    // tabNums
                ])
            ]);
        }
    };
}

var WatchInfo = {
    currentSlug: undefined,
    showInfo: false,
    episode: {},
    season: {},
    series: {}
};

var SourceSelectModal = {
    episode: {},
    season: {},
    source: {},
    sources: [],
    oncreate: function (vnode) {
        SourceSelectModal.open = function() {
            vnode.dom.firstChild.checked = true;
        };
        SourceSelectModal.close = function() {
            vnode.dom.firstChild.checked = false;
            WatchInfo._episode = undefined;
            WatchInfo._season = undefined;
        };
    },
    openEpisode: function (episode, season, setInfo) {
        // SourceSelectModal.episode = episode;
        // SourceSelectModal.season = season;
        // SourceSelectModal.sources = episode.sources || [{ retrieve_url: episode.retrieve_url }];
        SourceSelectModal.open();

        if (episode && season) {
            WatchInfo._episode = WatchInfo.episode;
            WatchInfo._season = WatchInfo.season;
            WatchInfo.episode = episode;
            WatchInfo.season = season;
        }
    },
    getSource: function (source) {
        SourceSelectModal.source = source;

        var episode = WatchInfo.episode;
        var season = WatchInfo.season;
        m.route.set(
            location.pathname,
            { ss: season.index, e: episode.index },
            { title: episode.title }
        );
        SourceSelectModal.close();

        WatchInfo.episode = episode;
        WatchInfo.season = season;
        WatchPlayer.player.cs_stop();

        if (theaterModeEnabled && window.innerWidth > 699) {
            var seasonListContainer = document.querySelector('.season-list-container');
            scrollToTop(2000, seasonListContainer);
        } else {
            scrollToTop(2000);
        }

        m.request({
            method: "GET",
            url: domain + "/api/v2/media/stream?code=" + encodeURIComponent(source.retrieve_url),
            headers: {
                Authorization: 'Bearer ' + AuthUser.data.token
            },
            config: function (xhr) {
                SourceSelectModal.XHR = xhr;
            }
        }).then(function (result) {
            try {
                SourceSelectModal.XHR = null;
                var sources = result.urls;
                WatchPlayer.player.src(
                    sources.filter(function (source) {
                        return source.type !== "application/dash+xml";
                    })
                );

                var captions = err(function () {
                    var c;
                    function getC(source) {
                        if (!c && source.captions) c = source.captions;
                        delete source.captions;
                    }
                    if (Array.isArray(sources)) {
                        sources.forEach(function (source) {
                            getC(source);
                        });
                    } else {
                        getC(sources);
                    }
                    return c;
                }, true);

                if (captions) WatchPlayer.player.cs_captions(captions);

                var poster = result.poster;
                if (poster && !WatchInfo.episode.thumbnail) WatchInfo.episode.poster = poster;
            } catch (error) {
                nativeToast({
                    message: 'An error occured. Please try another source.',
                    position: 'north-east',
                    type: 'error'
                });
            }
        }).catch(function (error) {
            if (error.code < 200 && error.code < 299) {
                AuthUser.logout();
            }
        });
    },
    onremove: function() {
        if (SourceSelectModal.XHR) SourceSelectModal.XHR.abort();
    },
    view: function () {
        var episode = WatchInfo.episode || {};
        var sources = episode.sources || [{ retrieve_url: episode.retrieve_url }];

        var hasUncensored = sources.some(function (source) {
            return source.uncensored;
        });

        var hasFanDub = sources.some(function (source) {
            return source.fan;
        });

        function getSourceLanguageClass(source) {
            return source.language === "subs" || source.is_subbed ? " subs" : source.language === "dubs" || source.is_dubbed ? " dubs" : "";
        }

        function getSourceOptionClass(source) {
            return source.fan ? " fan" : source.uncensored ? " uncensored" : "";
        }

        return m("div", { class: "modal source-select-modal" }, [
            m("input", { id: 'source-selector', type: "checkbox" }),
            m("label", { class: "overlay", for: 'source-selector' }),
            m("article", [
                m("header", [
                    m("h4", "Select Source"),
                    m("label", { class: "close", for: 'source-selector' }, m.trust("&times;")),
                    hasFanDub ? m('div', { class: 'key-note' }, [m('div', { class: 'fan' }), 'Fan Dub']) : undefined,
                    hasUncensored ? m('div', { class: 'key-note' }, [m('div', { class: 'uncensored' }), 'Uncensored']) : undefined
                ]),
                m("section", { class: "content" }, [
                    m("div", { class: 'source-select-options-container' }, [
                        (Array.isArray(sources) ? sources : [episode]).map(function (source) {
                            var optionElems = [
                                m("div", source.source || '?'),
                                m("div", { class: 'source-language' }, source.language === "subs" || source.is_subbed ? "Subtitled" : source.language === "dubs" || source.is_dubbed ? "Dubbed" : "Original")
                            ];
                            return m("div", { class: 'source-select-options' + getSourceLanguageClass(source) + getSourceOptionClass(source), key: source.source, onclick: SourceSelectModal.getSource.bind(this, source) }, optionElems);
                        })
                    ])
                ]),
                m("section", { class: "content" }, [
                    m("h5", episode.title),
                    m('div', { class: 'flex two-600' }, [
                        m('div', m("img", { class: "full", src: getPosterWide(episode.thumbnail, undefined, 800).poster })),
                        m("p", episode.description)
                    ])
                ])
            ])
        ]);
    }
};

var Watch = {
    oninit: function (vnode) {
        Watch.currentId = vnode.attrs.id;
        document.body.classList.add('watch-body');
        // var bottomBar = document.querySelector('.bottom-bar');
        var musicPlayerBar = document.querySelector('.music-player');
        // Watch.initialBottomBarClassName = bottomBar.className;
        Watch.initialMusicPlayerBarClassName = musicPlayerBar.className;
        if (theaterModeEnabled) toggleTheater(theaterModeEnabled, false, false);
    },
    onremove: function () {
        document.body.classList.remove('watch-body');
        toggleTheater(false, false, false);
        // var bottomBar = document.querySelector('.bottom-bar');
        var musicPlayerBar = document.querySelector('.music-player');
        // bottomBar.className = Watch.initialBottomBarClassName;
        musicPlayerBar.className = Watch.initialMusicPlayerBarClassName;
        if (WatchPlayer.player.el_) WatchPlayer.player.el_.removeEventListener(supportsTouch ? "touchend" : "click", Watch.setPlayerClick);
        if (Watch.XHR) Watch.XHR.abort();
    },
    onbeforeremove: function() {
        if (!WatchPlayer.player.paused()) {
            var miniPlayerContainer = document.getElementById('mini-player');
            miniPlayerContainer.appendChild(WatchPlayer.dom);
        }
    },
    setPlayerClick: function (e) {
        var chosenSeason = WatchInfo.season.episodes ? WatchInfo.season : SeasonsList.list[0];
        var chosenEpisode = (WatchInfo.episode.sources || WatchInfo.episode.retrieve_url) ? WatchInfo.episode : chosenSeason.episodes[0];
        if (!WatchPlayer.player.currentSources().length/* || (!Watch.resumePlay && chosenSeason.index !== WatchInfo.season.index && chosenEpisode.index !== WatchInfo.episode.index)*/) {
            SourceSelectModal.openEpisode(chosenEpisode, chosenSeason, true);
            window.m.redraw();
        }
    },
    onupdate: function(vnode) { animatePageUpdate(vnode, Watch); },
    view: function () {
        if (!AuthUser.data._id) {
            nativeToast({
                message: loginErrMsg,
                position: 'north-east',
                type: 'error'
            });
            return m.route.set('/login');
        }

        var hideSidebarStyles = m('style', '#sidebar{display:none}');

        return m("div", { class: 'flex-margin-reset' + (theaterModeEnabled ? ' desktop' : '') }, [
            themeStyleElem ? undefined : window.DARK_THEME_STYLES,
            m("div", { class: "watch-content-container flex one two-700" }, [
                m("div", { class: "two-third-700 flex-padding-reset" }, [
                    m('div', { oncreate: function(vnode) {
                        vnode.dom.appendChild(WatchPlayer.dom);
                    }}),
                    !theaterModeEnabled ? m(EpisodeInfo) : undefined,
                ]),
                m("div", { class: "season-list-container third-700" }, [
                    theaterModeEnabled ? m(EpisodeInfo) : undefined,
                    m(SeasonsList),
                    m(RecommendedList)
                ])
            ]),
            m(SourceSelectModal),
            hideSidebarStyles
        ]);
    },
    oncreate: function (vnode, callback) {
        setTitle("WonderfulSubs", true);
        scrollToTop();
        
        var slug = vnode.attrs.id;
        var params = m.route.param();
        Watch.resumePlay = WatchInfo.currentSlug === slug;
        WatchInfo.currentSlug = slug;

        m.request({
            method: "GET",
            url: domain + "/api/v2/media/series?series=" + slug,
            headers: {
                Authorization: 'Bearer ' + AuthUser.data.token
            },
            config: function (xhr) {
                Watch.XHR = xhr;
            }
        }).then(function (result) {
            try {
                Watch.XHR = null;
                var series = result.json;
                if (series) {
                    setTitle(series.title);
                    WatchInfo.series = series;
                    if (!Watch.resumePlay) {
                        WatchPlayer.player.cs_stop(true);
                        WatchInfo.showInfo = false;
                        WatchInfo.episode = {};
                        WatchInfo.season = {};
                    } else {
                        if (Number.isFinite(WatchInfo.episode.index) && Number.isFinite(WatchInfo.season.index)) {
                            window.m.route.set(
                                location.pathname,
                                { ss: WatchInfo.season.index, e: WatchInfo.episode.index },
                                { title: WatchInfo.episode.title }
                            );
                        }
                    }
                    WatchPlayer.player.poster(getPosterWide(series.poster_wide, undefined, /*800*/1080).poster);
                    RecommendedList.getList(series);

                    var seasons = Array.isArray(series.seasons) ? series.seasons : series.seasons.ws.media;
                    SeasonsList.list = seasons;

                    if (callback) callback();

                    var ss = parseInt(params.ss);
                    var e = parseInt(params.e);
                    var m = params.m;
                    var chosenSeason, chosenEpisode;

                    if (isFinite(ss) && isFinite(e)) {
                        chosenSeason = seasons[ss];
                        chosenEpisode = chosenSeason.episodes[e];
                        SourceSelectModal.openEpisode(chosenEpisode, chosenSeason, true);
                    } else if (m === "latest") {
                        var nonSpecialSeasons = seasons.filter(function (season) {
                            return season.type !== "specials";
                        });
                        chosenSeason = nonSpecialSeasons[nonSpecialSeasons.length - 1];
                        chosenEpisode = chosenSeason.episodes[chosenSeason.episodes.length - 1];
                        SourceSelectModal.openEpisode(chosenEpisode, chosenSeason, true);
                    }

                    if (WatchPlayer.player.el_) WatchPlayer.player.el_.addEventListener(supportsTouch ? "touchend" : "click", Watch.setPlayerClick);
                }
            } catch (error) { }
        }).catch(function (error) {
            if (error.code < 200 && error.code < 299) {
                AuthUser.logout();
            }
        });
    }
};
