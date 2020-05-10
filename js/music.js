function showHideMusicPlayer() {
    var outAnimation = 'slideOutDown';
    if (musicPlayerElem.parentElement.classList.contains('none')) {
        musicPlayerElem.parentElement.classList.remove('none');
    } else if (musicPlayerElem.parentElement.classList.contains(outAnimation)) {
        // m.redraw();
        musicPlayerElem.parentElement.classList.remove(outAnimation);
    } else {
        musicPlayerElem.parentElement.classList.add(outAnimation);
    }
}

function MusicPlayer() {
    function keyEvents(e) {
        if (!(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
            switch (e.key) {
                case "r":
                    showHideMusicPlayer();
                    break;
            }
        }
    }

    return {
        oncreate: function () {
            document.addEventListener('keyup', keyEvents);
        },
        onremove: function () {
            document.removeEventListener('keyup', keyEvents);
        },
        view: function () {
            function playPauseMusic() {
                player[player.paused() ? 'play' : 'pause']();
            }

            function restartMusic() {
                player.currentTime(0);
            }

            function showHideMusicVideo() {
                player.toggleClass('hide-music-video');
                player.toggleClass('vjs-fluid');
                var musicPlayerBar = document.querySelector('.music-player');
                musicPlayerBar.classList.toggle('show-music-video');
            }

            var player = llc(VideoPlayer, {
                options: { id: 'vjs-music-player', autoplay: false, disablePauseOnScroll: true }, ready: function (player) {
                    player.addClass('hide-music-video');

                    function hidePlayer() {
                        var hidePlayerStyle = document.createElement('style');
                        hidePlayerStyle.innerHTML = '#vjs-music-player.hide-music-video > :not(.vjs-control-bar){display:none !important}';
                        player.el_.parentElement.insertBefore(hidePlayerStyle, player.el_);
                        player.off('play', hidePlayer);
                    }

                    var playButton = document.querySelector('.music-player-button .icon-play');

                    player.on('play', hidePlayer);
                    player.on('pause', function () {
                        playButton.className = 'icon-play';
                    });
                    player.on('ended', function () {
                        playButton.className = 'icon-ccw';
                    });
                    player.on('volumechange', function () {
                        if (player.volume() !== 1) player.volume(1);
                        if (player.muted()) player.muted(false);
                    });
                }
            });

            return m.fragment({}, [
                player,
                m('div', { class: 'flex two' },
                    m('div', { class: 'music-player-info' }, [
                        llv('img', { src: 'https://i.ytimg.com/vi/2MtOpB5LlUA/hq720.jpg?sqp=-oaymwEXCNUGEOADIAQqCwjVARCqCBh4INgESFo&rs=AMzJL3mTLkA192pEplLZlI5YcSzkQR6wRw' }),
                        m('div', [
                            m('h5', 'JoJo\'s Bizarre Adventure:Golden Wind OST: ~Giorno\'s Theme~ "Il vento d\'oro'),
                            m('h6', 'Golden Weed')
                        ])
                    ]),
                    m('div', { class: 'music-player-controls' },
                        m('div', { class: 'flex three three-700 four-1000 five-1300' }, [
                            m('div', { class: 'music-player-button'/* off-third-700 off-fourth-1000 off-fifth-1300'*/ }, m('i', { class: 'icon-to-start', onclick: restartMusic })),
                            m('div', { class: 'music-player-button' }, m('i', { class: 'icon-play', onclick: playPauseMusic })),
                            m('div', { class: 'music-player-button' }, m('i', { class: 'icon-youtube-play', onclick: showHideMusicVideo }))
                        ])
                    )
                )
            ]);
        }
    };
}

var musicPlayerElem;
document.addEventListener('DOMContentLoaded', function () {
    musicPlayerElem = document.getElementById('music-panel');
    m.mount(musicPlayerElem, MusicPlayer);
    // MusicPlayerInstance.player.state.player.src({ src: 'https://www.youtube.com/watch?v=2MtOpB5LlUA', type: 'video/youtube' });
});