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

var showMoreButton = m('div', { class: 'show-more top-divider bottom-divider', onclick: showHideMore }, m('i', { class: 'icon-down-dir' }));

var sourceSelectorId = getRandomId();

var RecommendedList = {
    list: SeriesList(),
    getList: function (series) {
        function filterFunc(s) {
            return s.title !== series.title;
        }

        RecommendedList.list = SeriesList(
            domain + "/api/v1/media/search?options=summary&count=4&index=1&q=" +
            series.title,
            {
                filter: filterFunc,
                callback: function (count) {
                    if (count === 0 && Array.isArray(series.keywords)) {
                        var keywords = series.keywords.filter(function (x) {
                            return x;
                        });
                        var keyword = keywords[Math.floor(Math.random() * keywords.length)];
                        RecommendedList.list = SeriesList(
                            domain + "/api/v1/media/random?options=summary&count=4&keyword=" +
                            keyword,
                            { filter: filterFunc }
                        );
                    }
                }
            }
        );
    },
    view: function () {
        return m("div", [
            m("h2", { class: "list-header animated fadeInUp" }, [
                m("span", { class: "label full" }, "Recommended")
            ]),
            m(RecommendedList.list)
        ]);
    }
};

function EpisodeInfo() {
    var _this = {
        showInfo: false,
        episode: {},
        season: {},
        series: {},
        view: function () {
            var showInfo = _this.showInfo;
            var episode = _this.episode;
            var season = _this.season;
            var series = _this.series;
            series.url = location.pathname;

            var isInWatchList = AuthUser.isInList('Watch List', series);
            var isFavoritesList = AuthUser.isInList('Favorites', series);

            var headerElements = [m("h3", showInfo && season.type !== 'episodes' ? series.title : season.title || series.title)];
            if ((season.japanese_title && season.japanese_title != season.title) || (series.japanese_title && series.japanese_title != series.title)) headerElements.push(m("h6", { class: "subtitle" }, season.japanese_title || series.japanese_title));

            var description = season.description || series.description;
            var sectionElements = [m("p", showInfo ? description : episode.description || description)];
            if (!showInfo && episode.title) sectionElements.unshift(m("h4", episode.title));

            return m('div', { class: 'animated fadeInLeft' }, [
                m("article", { class: "card episode-info-card" }, [
                    m("header", [
                        m('span', headerElements),
                        m('div', [
                            m('i', { class: 'icon-info-circled' + (showInfo ? ' active' : ''), onclick: function () { _this.showInfo = !showInfo; } }),
                            m('i', { class: 'icon-clock info-watch-later' + (isInWatchList ? ' active' : ''), onclick: AuthUser.addToRemoveFromList.bind(this, 'Watch List', series, { showToast: true }) }),
                            m('i', { class: 'icon-heart info-favorite' + (isFavoritesList ? ' active' : ''), onclick: AuthUser.addToRemoveFromList.bind(this, 'Favorites', series, { showToast: true }) })
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
    return _this;
}

var SeasonsList = {
    list: [],
    view: function () {
        var list = SeasonsList.list;

        function openCloseEpisodeList(vnode) {
            vnode.dom.onclick = function (e) {
                var listElem = e.target.nextElementSibling;
                if (listElem.classList.contains("none")) {
                    listElem.classList.remove("none");
                } else {
                    listElem.classList.add("none");
                }
                var arrowElem = e.target.querySelector('i[class*="-dir"]');
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
                return m("div", { key: season.id || season.type + String(index) }, [
                    m(
                        "span",
                        {
                            class: "button full season-list-button" + (index !== (list.length - 1) ? ' bottom-divider' : ''),
                            oncreate: openCloseEpisodeList
                        },
                        [
                            m('i', { class: 'icon-desktop' }),
                            (season.title || "Extras") + (season.max_season ? season.min_season ? " (Seasons " + season.min_season + "-" + season.max_season + ")" : " (Up to Season " + season.max_season + ")" : ""),
                            m("i", { class: "icon-up-dir right" })
                        ]
                    ),
                    m(EpisodeList(season.episodes, season))
                ]);
            })
        );
    }
};

function EpisodeList(list, season) {
    list.forEach(function (episode, index) {
        episode.index = index;
    });
    var pages = getEpisodePages(list, 50);
    var tabsStyle = getEpisodePagesCSS(pages.length);

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

            return m("div", { class: "episode-list none" }, [
                tabsStyle.html,
                m("div", { class: "tabs " + tabsStyle.className }, [
                    tabs(true),
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
                                            return m("tr",
                                                {
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
                    // tabs()
                ])
            ]);
        }
    };
}

var SourceSelectModal = {
    element: {},
    episode: {},
    season: {},
    source: {},
    sources: [],
    oncreate: function (vnode) {
        SourceSelectModal.element = vnode.dom.firstChild;
    },
    open: function () {
        SourceSelectModal.element.checked = true;
    },
    close: function () {
        SourceSelectModal.element.checked = false;
    },
    openEpisode: function (episode, season, setInfo) {
        SourceSelectModal.episode = episode;
        SourceSelectModal.season = season;
        SourceSelectModal.sources = episode.sources || [{ retrieve_url: episode.retrieve_url }];
        SourceSelectModal.open();

        if (setInfo) {
            Watch.InfoBox.episode = episode;
            Watch.InfoBox.season = season;
        }
    },
    getSource: function (source) {
        SourceSelectModal.source = source;

        var episode = SourceSelectModal.episode;
        var season = SourceSelectModal.season;
        m.route.set(
            m.route.get(),
            { ss: season.index, e: episode.index },
            { title: episode.title }
        );
        SourceSelectModal.close();

        Watch.InfoBox.episode = episode;
        Watch.InfoBox.season = season;
        WatchPlayer.player.cs_stop();

        scrollToTop(2000);

        m.request({
            method: "GET",
            url: domain + "/api/v1/media/stream?code=" + encodeURIComponent(source.retrieve_url)
        }).then(function (result) {
            try {
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
                if (poster && !Watch.InfoBox.episode.thumbnail) Watch.InfoBox.episode.poster = poster;
            } catch (error) {
                nativeToast({
                    message: 'An error occured. Please try another source.',
                    position: 'north-east',
                    type: 'error'
                });
            }
        });
    },
    view: function () {
        var episode = SourceSelectModal.episode;
        var sources = SourceSelectModal.sources;

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
            m("input", { id: sourceSelectorId, type: "checkbox" }),
            m("label", { class: "overlay", for: sourceSelectorId }),
            m("article", [
                m("header", [
                    m("h4", "Select Source"),
                    m("label", { class: "close", for: sourceSelectorId }, m.trust("&times;")),
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
        Watch.InfoBox = EpisodeInfo();
        document.body.classList.add('watch-body');
        var bottomBar = document.querySelector('.bottom-bar');
        var musicPlayerBar = document.querySelector('.music-player');
        Watch.initialBottomBarClassName = bottomBar.className;
        Watch.initialMusicPlayerBarClassName = musicPlayerBar.className;
        if (theaterModeEnabled) toggleTheater(theaterModeEnabled, false, false);
    },
    onremove: function () {
        document.body.classList.remove('watch-body');
        toggleTheater(false, false, false);
        var bottomBar = document.querySelector('.bottom-bar');
        var musicPlayerBar = document.querySelector('.music-player');
        bottomBar.className = Watch.initialBottomBarClassName;
        musicPlayerBar.className = Watch.initialMusicPlayerBarClassName;
        if (WatchPlayer.player.el_) WatchPlayer.player.el_.removeEventListener(supportsTouch ? "touchend" : "click", Watch.setPlayerClick);
    },
    onbeforeremove: function() {
        if (!WatchPlayer.player.paused()) {
            var miniPlayerContainer = document.getElementById('mini-player');
            miniPlayerContainer.appendChild(WatchPlayer.dom);
        }
    },
    setPlayerClick: function () {
        if (!WatchPlayer.player.currentSources().length) {
            var chosenSeason = SourceSelectModal.season.episodes ? SourceSelectModal.season : SeasonsList.list[0];
            var chosenEpisode = (SourceSelectModal.episode.sources || SourceSelectModal.episode.retrieve_url) ? SourceSelectModal.episode : chosenSeason.episodes[0];
            SourceSelectModal.openEpisode(chosenEpisode, chosenSeason, true);
            window.m.redraw();
        }
    },
    onupdate: function (vnode) {
        var id = vnode.attrs.id;
        if (id !== Watch.currentId) {
            Watch.abort();
            scrollToTop(500)
                .then(function () {
                    Watch.currentId = id;
                    var outAnimationClasses = ["bounceOutDown", "faster"];
                    var inAnimationClasses = ["bounceInUp", "fast"];
                    outAnimationClasses.forEach(function (className) {
                        root.classList.add(className);
                    });

                    root.addEventListener("animationend", function removeOutAnimationClass(e) {
                        if (outAnimationClasses.indexOf(e.animationName) !== -1) {
                            this.removeEventListener("animationend", removeOutAnimationClass);
                            Watch.oncreate(vnode, function () {
                                outAnimationClasses.forEach(function (className) {
                                    root.classList.remove(className);
                                });

                                inAnimationClasses.forEach(function (className) {
                                    root.classList.add(className);
                                });

                                root.addEventListener("animationend", function removeInAnimationClass(e) {
                                    if (inAnimationClasses.indexOf(e.animationName) !== -1) {
                                        this.removeEventListener("animationend", removeInAnimationClass);
                                        inAnimationClasses.forEach(function (className) {
                                            root.classList.remove(className);
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
        }
    },
    view: function () {
        if (!AuthUser.data._id) {
            nativeToast({
                message: loginErrMsg,
                position: 'north-east',
                type: 'error'
            });
            return m.route.set('/login');
        }

        return m("div", { class: 'flex-margin-reset' + (theaterModeEnabled ? ' desktop' : '') }, [
            window.DARK_THEME_STYLES,
            m("div", { class: "watch-content-container flex one two-700" }, [
                m("div", { class: "two-third-700 flex-padding-reset" }, [
                    m('div', { oncreate: function(vnode) {
                        vnode.dom.appendChild(WatchPlayer.dom)
                    }}),
                    !theaterModeEnabled ? m(Watch.InfoBox) : undefined,
                ]),
                m("div", { class: "third-700" }, [
                    theaterModeEnabled ? m(Watch.InfoBox) : undefined,
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

        m.request({
            method: "GET",
            url: domain + "/api/v1/media/series?series=" + slug,
            config: function (xhr) {
                Watch.abort = xhr.abort;
            }
        }).then(function (result) {
            try {
                var series = result.json;
                if (series) {
                    setTitle(series.title);
                    Watch.InfoBox = EpisodeInfo();
                    Watch.InfoBox.series = series;
                    WatchPlayer.player.cs_stop(true);
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
        });
    }
};
