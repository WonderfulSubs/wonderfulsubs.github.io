window.HELP_IMPROVE_VIDEOJS = false;

function VideoPlayer(src, options, ready) {
    return MediaPlayer(src, options, ready);
    var _this = {
        embed: false,
        player: {},
        src: function (src) {
            player.src(src);
        },
        poster: function (poster) {
            //player.poster(poster);
        },
        view: function () {
            if (_this.embed) {
                player.dispose();
                return m('iframe', { frameborder: '0' });
            }
            return m('video', { id: getRandomId(), class: 'video-js vjs-big-play-centered' });
        }
    };

    return _this;
}

function EmbedPlayer(src, options) {
    var _this = {
        view: function () {
            return m('iframe', { src: src });
        }
    };
    return _this;
}

function MediaPlayer(src, options, ready) {
    var player, disableHotkeys, showTheaterToggle;
    var _this = {
        player: {},
        oncreate: function (vnode) {
            var opts = {
                controls: true,
                fluid: true,
                autoplay: true,
                html5: {
                    hls: {
                        overrideNative: videojs.browser.IS_ANDROID && videojs.browser.CHROME_VERSION === 78
                    }
                }
            };
            if (options) {
                opts.id = options.playerId;
                disableHotkeys = options.disableHotkeys;
                showTheaterToggle = options.showTheaterToggle;
                ['playerId', 'disableHotkeys', 'showTheaterToggle'].forEach(function (key) {
                    delete options[key];
                });
                for (var key in options) opts[key] = options[key];
            }
            player = videojs(vnode.dom, opts);
            _this.player = player;
            player.qualityLevels();
            player.hlsQualitySelector();
            player.ready(function () {
                if (!disableHotkeys) {
                    this.hotkeys({
                        volumeStep: 0.1,
                        seekStep: 5,
                        enableModifiersForNumbers: false,
                        enableVolumeScroll: false,
                        alwaysCaptureHotkeys: true
                    });
                }
                if (ready) ready(this);
            });

            player.poster(posterWidePlaceholder);
            if (src) player.src(src);

            if (showTheaterToggle) {
                var Button = videojs.getComponent('Button');
                var theaterButton = videojs.extend(Button, {
                    constructor: function () {
                        Button.apply(this, arguments);
                        /* initialize your button */
                    },
                    handleClick: Watch.toggleTheater,
                    buildCSSClass: function () {
                        return "vjs-icon-theatermode vjs-control vjs-button";
                    }
                });
                videojs.registerComponent('MyButton', theaterButton);
                player.getChild('controlBar').addChild('myButton', {});
            }

            player.on('loadstart', function () {
                this.play();
            });
        },
        src: function (src) {
            typeof src === 'string' ? m.redraw: undefined;
            player.src(src);
        },
        stop: function (hideSpinner) {
            if (player.currentSrc()) {
                player.pause();
                player.hasStarted(false);
                if (!hideSpinner) player.el_.classList.add('vjs-waiting');
            }
        },
        poster: function (poster) {
            player.poster(poster);
        },
        captions: function (captions) {
            player.addRemoteTextTrack(captions, false);
        },
        toggleTheater: function () {
            player.toggleClass('theater-player');
            player.el_.querySelector('video').className = 'vjs-tech';
        },
        view: function () {
            return m('video', { class: 'video-js vjs-big-play-centered animated fadeInDown' + (showTheaterToggle && theaterModeEnabled ? ' theater-player' : ''), playsinline: 'playsinline' });
        }
    };

    return typeof src === 'string' ? EmbedPlayer(src) : _this;
}