function showHideMore(e) {
    var button = e.target;
    var previousElemSibling = button.previousElementSibling;
    if (previousElemSibling.style['overflow-y'] === 'scroll') {
        previousElemSibling.style['overflow-y'] = '';
        previousElemSibling.scrollTo(0, 0);
        button.innerText = 'Show More';
    } else {
        previousElemSibling.style['overflow-y'] = 'scroll';
        previousElemSibling.scrollTo(0, 30);
        button.innerText = 'Show Less';
    }
}

var showMoreButton = m('div', { class: 'show-more top-divider bottom-divider', onclick: showHideMore }, 'Show More');
var player = VideoPlayer();
var sourceSelectorId = getRandomId();

var SeriesInfo = {
    series: {},
    view: function () {
        var series = SeriesInfo.series;
        var headerElements = [m("h3", series.title)];
        if (series.japanese_title && series.japanese_title != series.title)
            headerElements.push(
                m("h6", { class: "subtitle" }, series.japanese_title)
            );

        return m('div', { class: 'fadeInRight animated none full-700' }, [
            m("article", { class: "card series-info-card" }, [
                m("header", headerElements),
                m("section", { class: "content" }, [m("p", series.description)])
            ]),
            showMoreButton
        ]);
    }
};

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

var EpisodeInfo = {
    episode: {},
    season: {},
    series: {},
    view: function () {
        var episode = EpisodeInfo.episode;
        var season = EpisodeInfo.season;
        var series = EpisodeInfo.series;

        return m('div', { class: 'animated fadeInLeft' }, [
            m("article", { class: "card episode-info-card" }, [
                m("header", [
                    m("h3", { class: (episode.sources || episode.retrieve_url) ? undefined : 'flash animated infinite slower' }, (episode.sources || episode.retrieve_url) ? episode.title : 'Select An Episode Below'),
                    m("h6", { class: "subtitle" }, season.title || series.title)
                ]),
                m("section", { class: "content flex" }, [
                    m("img", {
                        class: "two-fifth",
                        src:
                            episode.poster ||
                            getPosterWide(
                                episode.thumbnail || series.poster_wide,
                                undefined,
                                320
                            ).poster
                    }),
                    m(
                        "p",
                        { class: "three-fifth" },
                        episode.description || season.description || series.description
                    )
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
        var episodeListInstance;

        function openCloseEpisodeList(vnode) {
            vnode.dom.onclick = function (e) {
                var listElem = e.target.nextElementSibling;
                if (listElem.classList.contains("none")) {
                    listElem.classList.remove("none");
                    console.log(episodeListInstance);
                    if (episodeListInstance.firstEpisodeTab) episodeListInstance.setListHeight(0, episodeListInstance.firstEpisodeTab);
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

        return m(
            "div",
            { class: "animated fadeInUp" },
            list.map(function (season, index) {
                season.index = index;
                episodeListInstance = EpisodeList(season.episodes, season);
                return m("div", { key: season.id || season.type + String(index) }, [
                    m(
                        "span",
                        {
                            class: "button full season-list-button",
                            oncreate: openCloseEpisodeList
                        },
                        [
                            m('i', { class: 'icon-desktop' }),
                            (season.title || "Extras") + (season.max_season ? season.min_season ? " (Seasons " + season.min_season + "-" + season.max_season + ")" : " (Up to Season " + season.max_season + ")" : ""),
                            m("i", { class: "icon-up-dir right" })
                        ]
                    ),
                    m(episodeListInstance)
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


    var _this = {
        setListHeight: function (index, e) {
            e.redraw = false;
            console.log(e.target);
            var tabs = e.target.parentElement;
            tabs.style.height = '';
            var row = tabs.querySelector('.row');
            var table = tabs.querySelectorAll('.table-container table')[index];
            tabs.style.height = (table.clientHeight + tabs.clientHeight - row.clientHeight) + 'px';
        },
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
                        m("label", { class: "pseudo button toggle", for: id, onclick: _this.setListHeight.bind(this, index), oncreate: function (vom) { if (index === 0) _this.firstEpisodeTab = { target: vom.dom }; } }, page.title)
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
                                            return m(
                                                "tr",
                                                {
                                                    key:
                                                        episode.title +
                                                        String(episode.episode_number || episode.ova_number),
                                                    onclick: function () {
                                                        SourceSelectModal.openEpisode(
                                                            episode,
                                                            season
                                                        );
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

    return _this;
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
        SourceSelectModal.sources = episode.sources || [
            { retrieve_url: episode.retrieve_url }
        ];
        SourceSelectModal.open();

        if (setInfo) {
            EpisodeInfo.episode = episode;
            EpisodeInfo.season = season;
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

        EpisodeInfo.episode = episode;
        EpisodeInfo.season = season;

        scrollToTop(2000);

        m.request({
            method: "GET",
            url:
                domain + "/api/v1/media/stream?code=" +
                encodeURIComponent(source.retrieve_url)
        }).then(function (result) {
            var sources = result.urls;
            window.player.src(
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

            if (captions) window.player.captions(captions);

            var poster = result.poster;
            if (poster && !EpisodeInfo.episode.thumbnail)
                EpisodeInfo.episode.poster = poster;
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

        var theadElems = [m("th", "Server"), m("th", "Language")];

        if (hasUncensored) theadElems.push(m("th", "Uncensored"));
        if (hasFanDub) theadElems.push(m("th", "Fan Dub"));

        return m("div", { class: "modal" }, [
            m("input", { id: sourceSelectorId, type: "checkbox" }),
            m("label", { class: "overlay", for: sourceSelectorId }),
            m("article", [
                m("header", [
                    m("h4", "Select Source"),
                    m(
                        "label",
                        { class: "close", for: sourceSelectorId },
                        m.trust("&times;")
                    )
                ]),
                m("section", { class: "content" }, [
                    m("div", [
                        m("table", { class: "primary full" }, [
                            m("thead", [m("tr", theadElems)]),
                            m("tbody", { class: "source-table-body table-selectable" }, [
                                (Array.isArray(sources) ? sources : [episode]).map(function (
                                    source
                                ) {
                                    var tbodyElems = [
                                        m("td", source.source),
                                        m("td", source.language === "subs" || source.is_subbed ? "Subtitled" : source.language === "dubs" || source.is_dubbed ? "Dubbed" : "Original")
                                    ];

                                    if (hasUncensored)
                                        tbodyElems.push(m("td", source.uncensored ? "Yes" : "No"));
                                    if (hasFanDub)
                                        tbodyElems.push(m("td", source.fan ? "Yes" : "No"));

                                    return m(
                                        "tr",
                                        {
                                            key: source.source,
                                            onclick: SourceSelectModal.getSource.bind(this, source)
                                        },
                                        tbodyElems
                                    );
                                })
                            ])
                        ])
                    ])
                ]),
                m("section", { class: "content" }, [
                    m("h5", episode.title),
                    m("img", {
                        class: "full",
                        src: getPosterWide(episode.thumbnail, undefined, 800).poster
                    }),
                    m("p", episode.description)
                ])
            ])
        ]);
    }
};

var Watch = {
    oninit: function (vnode) {
        Watch.currentId = vnode.attrs.id;
    },
    onupdate: function (vnode) {
        var id = vnode.attrs.id;
        if (id !== Watch.currentId) {
            Watch.abort();
            scrollToTop(500, function () {
                Watch.currentId = id;

                var outAnimationClasses = ["bounceOutDown", "faster"];
                var inAnimationClasses = ["bounceInUp", "fast"];
                outAnimationClasses.forEach(function (className) {
                    root.classList.add(className);
                });

                root.addEventListener("animationend", function removeOutAnimationClass(
                    e
                ) {
                    if (outAnimationClasses.indexOf(e.animationName) !== -1) {
                        this.removeEventListener("animationend", removeOutAnimationClass);

                        Watch.oncreate(vnode, function () {
                            outAnimationClasses.forEach(function (className) {
                                root.classList.remove(className);
                            });

                            inAnimationClasses.forEach(function (className) {
                                root.classList.add(className);
                            });

                            root.addEventListener(
                                "animationend",
                                function removeInAnimationClass(e) {
                                    if (inAnimationClasses.indexOf(e.animationName) !== -1) {
                                        this.removeEventListener(
                                            "animationend",
                                            removeInAnimationClass
                                        );
                                        inAnimationClasses.forEach(function (className) {
                                            root.classList.remove(className);
                                        });
                                    }
                                }
                            );
                        });
                    }
                });
            });
        }
    },
    view: function () {
        if (!AuthUser.data._id) return m.route.set('/');

        return m("div", [
            darkThemeStyles,
            m("div", { class: "watch-content-container flex one two-700" }, [
                m("div", { class: "two-third-700" }, [
                    m(player),
                    m(EpisodeInfo),
                    m(SeasonsList)
                ]),
                m("div", { class: "third-700" }, [m(SeriesInfo), m(RecommendedList)])
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
                    SeriesInfo.series = series;
                    EpisodeInfo.series = series;
                    player.poster(
                        getPosterWide(series.poster_wide, undefined, 800).poster
                    );
                    RecommendedList.getList(series);

                    var seasons = series.seasons.ws.media;
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
                        chosenEpisode =
                            chosenSeason.episodes[chosenSeason.episodes.length - 1];
                        SourceSelectModal.openEpisode(chosenEpisode, chosenSeason, true);
                    }
                }
            } catch (error) { }
        });
    }
};
