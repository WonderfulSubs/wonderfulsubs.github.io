window.HELP_IMPROVE_VIDEOJS = false;

function setTheaterClass() {
    var body = document.body;
    var hasTheaterClass = body.classList.contains('theater-body');
    if (window.innerWidth < 768 && hasTheaterClass) {
        body.classList.remove('theater-body');
    } else if (window.innerWidth > 767 && !hasTheaterClass) {
        body.classList.add('theater-body');
        if (window.pageYOffset !== 0) scrollToTop();
    }
}

function toggleTheater(on, store, showToast) {
    if (typeof on === 'boolean' || m.route.get().indexOf('/watch/') === 0) {
        var doTurnOn;
        if (typeof on === 'boolean') {
            doTurnOn = on;
        } else {
            theaterModeEnabled = !theaterModeEnabled;
            doTurnOn = theaterModeEnabled;
        }
        var bottomBar = document.querySelector('.bottom-bar');
        var musicPlayerBar = document.querySelector('.music-player');
        bottomBar.classList[doTurnOn ? 'add' : 'remove']('third-700');
        musicPlayerBar.classList[doTurnOn ? 'add' : 'remove']('third-700');
        if (doTurnOn) {
            setTheaterClass();
        } else {
            document.body.classList.remove('theater-body');
        }
        window[doTurnOn ? 'addEventListener' : 'removeEventListener']("resize", setTheaterClass);
        m.redraw();
        if (store !== false) setStorage('theater', doTurnOn);
        if (showToast !== false) {
            nativeToast({
                message: 'Theater Mode ' + (doTurnOn ? 'Enabled' : 'Disabled'),
                position: 'north-east',
                type: 'info',
                closeOnClick: true
            });
        }
    }
}

var EmbedPlayer = {
    view: function (vnode) {
        return m('iframe', { src: vnode.attrs.src });
    }
};

function VideoPlayer(initialVnode) {
    var isEmbed = typeof initialVnode.attrs.src === 'string';
    var player, observer;
    var opts = Object.assign({}, initialVnode.attrs.options);
    if (opts.id && document.getElementById(opts.id)) return undefined; // work around for that stupid post video duplicate bug
    var disablePauseOnScroll = opts.disablePauseOnScroll;
    var disableAnimation = opts.disableAnimation;
    var disableDefaultPoster = opts.disableDefaultPoster;
    var showTheaterToggle = opts.showTheaterToggle;
    var popoutOnScroll = opts.popoutOnScroll;
    var classNames = opts.classNames ? (' ' + opts.classNames) : '';
    ['disablePauseOnScroll', 'disableDefaultPoster', 'showTheaterToggle', 'disableAnimation'].forEach(function (key) {
        delete opts[key];
    });

    if (opts.controls === undefined) opts.controls = true;
    if (opts.fluid === undefined) opts.fluid = true;
    if (opts.autoplay === undefined) opts.autoplay = true;
    if (opts.playsinline === undefined) opts.playsinline = true;
    if (opts.html5 === undefined) opts.html5 = {
        hls: {
            overrideNative: videojs.browser.IS_ANDROID && videojs.browser.CHROME_VERSION >= 78
        }
    };
    if (opts.youtube === undefined) opts.youtube = {
        playsinline: opts.playsinline ? 1 : undefined
    };

    return {
        player: {},
        onremove: function (vnode) {
            if (typeof vnode.attrs.src === 'string') return;
            if (player) {
                if (observer) observer.unobserve(player.el_);
                player.dispose();
            }
        },
        oncreate: function (vnode) {
            var el = document.createElement('video-js');
            el.className = 'video-js vjs-big-play-centered fadeInDown' + (disableAnimation ? '' : ' animated ') + classNames;
            if (typeof vnode.attrs.src === 'object') {
                var srcEl = document.createElement('source');
                srcEl.src = vnode.attrs.src.src;
                srcEl.type =  vnode.attrs.src.type;
                el.appendChild(srcEl);
            }
            player = videojs(el, opts);
            vnode.dom.appendChild(player.el_);
            vnode.state.player = player;
            player.qualityLevels();
            player.hlsQualitySelector();
            player.ready(function () {
                var p = this; // p for the sake of distinction and the fact "this" won't pass on to anonymous functions
                var isYoutube = p.techName_ === 'Youtube';
                var techEl = isYoutube ? p.el_ : p.tech_.el_;
                var posterImageEl = p.posterImage.el_;
                var playToggleEl = p.controlBar.getChild('PlayToggle').el_;
                var bigPlayButtonEl = p.bigPlayButton.el_;
                var userPaused = false;

                [posterImageEl, bigPlayButtonEl].forEach(function (elem) {
                    elem.addEventListener('click', function () {
                        if (p.muted()) p.muted(false);
                    });
                });

                [playToggleEl, techEl].forEach(function (elem) {
                    elem.addEventListener('click', function () {
                        // YouTube embed and regular sources seem to read the opposite value so handle that
                        if (isYoutube) {
                            if (!p.paused()) userPaused = true;
                        } else if (p.paused()) {
                            userPaused = true;
                        }
                    });
                });

                function pauseOtherPlayers() {
                    userPaused = false;
                    if (!p.muted() && !p.paused()) {
                        document.querySelectorAll('video-js').forEach(function (videoEl) {
                            if (videoEl.player.el_ !== p.el_ && !videoEl.player.paused() && !videoEl.player.muted()) videoEl.player.pause();
                        });
                    }
                }

                p.on('play', pauseOtherPlayers);
                p.on('volumechange', pauseOtherPlayers);

                if (!disablePauseOnScroll) {
                    var target = p.el_;
                    var targetParent = p.el_.parentElement;
                    var isMini = false;

                    observer = new IntersectionObserver(function (entries) {
                        entries.forEach(function (entry) {
                            var didIntersect = entry.intersectionRatio > 0;
                            if (!userPaused && p.muted() === true) {
                                p[didIntersect ? 'play' : 'pause']();
                            }
                            if (popoutOnScroll) {
                                if (!isMini && !didIntersect && p.paused() === false && p.muted() === false) {
                                    isMini = true;
                                    var miniPlayerContainer = document.getElementById('mini-player');
                                    var placeholderElem = document.createElement('div');
                                    placeholderElem.style.width = p.el_.clientWidth + 'px';
                                    placeholderElem.style.height = p.el_.clientHeight + 'px';
                                    miniPlayerContainer.innerHTML = '';
                                    miniPlayerContainer.appendChild(p.el_);
                                    targetParent.appendChild(placeholderElem);
                                } else if (isMini && didIntersect) {
                                    isMini = false;
                                    targetParent.innerHTML = '';
                                    targetParent.appendChild(p.el_);
                                }
                            }
                        });
                    });

                    observer.observe(target);
                }
                if (vnode.attrs.ready) vnode.attrs.ready(p);
            });

            if (!disableDefaultPoster) player.poster(posterWidePlaceholder);

            if (showTheaterToggle) {
                var Button = videojs.getComponent('Button');
                var theaterButton = videojs.extend(Button, {
                    constructor: function () {
                        Button.apply(this, arguments);
                        /* initialize your button */
                    },
                    handleClick: toggleTheater,
                    buildCSSClass: function () {
                        return "vjs-icon-theatermode vjs-control vjs-button";
                    }
                });
                videojs.registerComponent('MyButton', theaterButton);
                player.getChild('controlBar').addChild('myButton', {});
            }

            if (opts.autoplay !== false) {
                player.on('loadstart', function () {
                    this.play();
                });
            }

            // Setup custom functions
            player.cs_src = function (src) {
                if (typeof src === 'string') {
                    isEmbed = true;
                    this.el_.classList.add('vjs-hide-player');
                    this.cs_stop();
                } else {
                    isEmbed = false;
                    this.el_.classList.remove('vjs-hide-player');
                    this.src(src);
                }
            };

            player.cs_stop = function (hideSpinner) {
                if (this.currentSrc()) {
                    this.pause();
                    this.hasStarted(false);
                    if (!hideSpinner) this.el_.classList.add('vjs-waiting');
                }
            };

            player.cs_captions = function (captions) {
                this.addRemoteTextTrack(captions, false);
            };
        },
        onupdate: function(vnode) {
            if (vnode.dom.nodeName === 'DIV' && vnode.dom.childElementCount === 0) {
                vnode.dom.appendChild(player.el_);
            }
        },
        view: function (vnode) {
            return isEmbed ? m(EmbedPlayer, { src: vnode.attrs.src }) : m('div');
        }
    };
};