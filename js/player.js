window.HELP_IMPROVE_VIDEOJS = false;

function VideoPlayer(src) {
    return MediaPlayer(src);
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
            return m('video', { id: 'video-player', class: 'video-js vjs-big-play-centered' });
        }
    };

    return _this;
}

function MediaPlayer(src) {
    var player;
    var _this = {
        player: {},
        oncreate: function (vnode) {
            player = videojs(vnode.dom, {
                controls: true,
                fluid: true,
                autoplay: true
            });
            _this.player = player;
            player.qualityLevels();
            player.hlsQualitySelector();
            player.ready(function () {
                this.hotkeys({
                    volumeStep: 0.1,
                    seekStep: 5,
                    enableModifiersForNumbers: false,
                    enableVolumeScroll: false,
                    alwaysCaptureHotkeys: true
                });
            });

            player.poster(posterWidePlaceholder);
            if (src) player.src(src);

            player.on('loadstart', function() {
                this.play();
            });
        },
        src: function (src) {
            player.src(src);
        },
        poster: function (poster) {
            player.poster(poster);
        },
        captions: function (captions) {
            player.addRemoteTextTrack(captions, false);
        },
        view: function () {
            return m('video', { id: 'video-player', class: 'video-js vjs-big-play-centered animated fadeInDown', playsinline: 'playsinline' });
        }
    };

    return _this;
}