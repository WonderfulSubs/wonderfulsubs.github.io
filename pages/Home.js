function HomeToggleChatbox(options) {
    if (window.innerWidth >= 700) {
        Home.chatEnabled = !Home.chatEnabled;
        if (Home.chatEnabled && !Home.chatIframeLoaded) Home.chatIframeLoaded = true;
        if (Home.chatbox.dom) {
            if (!Home.chatbox.dom.style.display) {
                Home.chatbox.dom.style.display = 'none';
            } else {
                Home.chatbox.dom.style.display = '';
            }
        }
        m.redraw();
        setStorage('chat', Home.chatEnabled);
        if (!options) options = {};
        var showToast = options.showToast;
        if (showToast) {
            nativeToast({
                message: 'Chat ' + (Home.chatEnabled ? 'On' : 'Off'),
                position: 'north-east',
                type: 'info',
                closeOnClick: true
            });
        }
    }
}

var posts = [
    {
        id: 'sdy3wehd',
        avatar: 'https://pbs.twimg.com/profile_images/751896288027766784/KMLgSn-Z_bigger.jpg',
        username: 'OnMSFT',
        displayName: 'OnMSFT',
        content: '<iframe src="/"><\/iframe> http://web.com `yolo();` *Hey!* ***BOOM*** **Bold** __huh__ [Wow](http://google.com) https://giphy.com/gifs/3o7TKvKQ2DuCGRti0g/ Amazon request termination of Microsoft’s JEDI contract due to “behind-the-scenes attacks” from Trump http://someth.ing/wrT54',
        media: [
            {
                mediaUrl: 'https://pbs.twimg.com/media/ELZXUaNUEAA-PwY?format=jpg&name=small',
                mediaType: 'image'
            },
            {
                mediaUrl: 'http://blogs.slj.com/goodcomicsforkids/files/2019/04/origin-1.jpg',
                mediaType: 'image'
            },
            {
                mediaUrl: '/video/c01ace716b4721c5',
                mediaType: 'video'
            }
        ],
        datePublished: 1576106436993,
        likes: 2,
        shares: 25,
        isEdited: false,
        verified: true,
        administrator: false,
        moderator: false,
        supporter: false
    },
    {
        id: 'p23rweie',
        avatar: 'https://i.ibb.co/LtPkK9y/redninja-large.jpg',
        username: 'RedNinjaX',
        displayName: 'Red',
        content: 'Check out the annoying Big Buck Bunny video! You can watch the full thing here: https://youtu.be/aqz-KE-bpKQ\nEnjoy!',
        media: [
            {
                mediaUrl: '/image/-IzPWLqY4gJ0%2FT01CPzNb1KI%2FAAAAAAAACgA%2F_8uyj68QhFE',
                mediaType: 'image'
            }
        ],
        datePublished: 1576105436993,
        likes: 150,
        shares: 532,
        isEdited: false,
        verified: false,
        administrator: true,
        moderator: false,
        supporter: false
    },
    {
        id: '7sdfsd',
        avatar: 'https://www.pdslibrary.org/sites/www.pdslibrary.org/files/Images/slp2018/hillbilly%20science.jpg',
        username: 'boBguy32',
        displayName: 'Hillbilly Bob',
        content: 'Y\'all folks ain\'t right smh',
        datePublished: 1576093436993,
        likes: 27,
        shares: 43,
        isEdited: true,
        verified: false,
        administrator: false,
        moderator: true,
        supporter: false,
        media: [
            {
                mediaUrl: 'http://blogs.slj.com/goodcomicsforkids/files/2019/04/origin-1.jpg',
                mediaType: 'image'
            }
        ]
    }
];

var postVjsPlayerOpts = {
    classNames: 'post-media-video',
    controls: true,
    autoplay: false,
    muted: true,
    disableAnimation: true,
    disableDefaultPoster: true,
    popoutOnScroll: true
};

function getKey(str, postId) {
    return postId + str;
}

function openMediaViewer(e) {
    var elem = e.target;
    var isVideo = elem.nodeName === 'VIDEO';
    var isImage = elem.nodeName === 'IMG';
    var isGifVideo = isVideo && ('loop' in elem.attributes);
    if (!isGifVideo && !isImage) return;

    var viewerContainer = document.createElement('div');
    viewerContainer.className = 'post-media-viewer animated fadeIn faster';
    viewerContainer.onclick = function () {
        viewerContainer.parentElement.removeChild(viewerContainer);
    };

    var backArrow = document.createElement('div');
    backArrow.innerHTML = '<';
    backArrow.className = 'post-media-viewer-back';
    backArrow.style.display = 'none';

    var forwardArrow = document.createElement('div');
    forwardArrow.innerHTML = '>';
    forwardArrow.className = 'post-media-viewer-forward';
    forwardArrow.style.display = 'none';

    var prevMaxOffset = 120;
    var mediaOffsetX = prevMaxOffset + 1;

    function navigateMedia(e, elem, item) {
        item.parentElement.removeChild(item);
        backArrow.style.display = 'none';
        forwardArrow.style.display = 'none';

        var sibling;
        if (mediaOffsetX <= prevMaxOffset && elem.previousElementSibling) {
            sibling = 'previousElementSibling';
        } else if (mediaOffsetX > prevMaxOffset && elem.nextElementSibling) {
            sibling = 'nextElementSibling';
        } else {
            return;
        }

        if (elem[sibling].nodeName === 'VIDEO' || elem[sibling].nodeName === 'IMG') {
            preventAndStop(e).then(function() {setItem(elem[sibling]);});
        }
    }

    viewerContainer.appendChild(backArrow);
    viewerContainer.appendChild(forwardArrow);

    var prevPageXOffset = window.pageXOffset;
    var prevPageYOffset = window.pageYOffset;
    
    document.body.insertAdjacentElement('afterbegin', viewerContainer);

    scrollTo(prevPageXOffset, prevPageYOffset);

    function setItem(elem) {
        var isVideo = elem.nodeName === 'VIDEO';
        var isImage = elem.nodeName === 'IMG';
        var isGifVideo = isVideo && ('loop' in elem.attributes);
        if (!isGifVideo && !isImage) return;
        var item = document.createElement(isGifVideo ? 'video' : 'img');
        item.src = elem.src;
        if (isGifVideo) {
            ['autoplay', 'muted', 'playsinline', 'loop'].forEach(function (attr) {
                item.setAttribute(attr, true);
            });
        }

        item.onmousemove = function(e) {
            if (e.relatedTarget === backArrow || e.relatedTarget === forwardArrow) return;
            mediaOffsetX = e.offsetX;
            var width =  e.target.clientWidth + 'px';
            backArrow.style.right = width;
            forwardArrow.style.left = width;
            if (elem.previousElementSibling && (elem.previousElementSibling.nodeName === 'VIDEO' || elem.previousElementSibling.nodeName === 'IMG')) backArrow.style.display = '';
            if (elem.nextElementSibling && (elem.nextElementSibling.nodeName === 'VIDEO' || elem.nextElementSibling.nodeName === 'IMG')) forwardArrow.style.display = '';
            if (e.offsetX <= prevMaxOffset) {
                backArrow.style.opacity = '1';
                forwardArrow.style.opacity = '0.5';
            } else if (e.offsetX > prevMaxOffset) {
                backArrow.style.opacity = '0.5';
                forwardArrow.style.opacity = '1';
            }
        };

        item.onmouseleave = function(e) {
            if (e.relatedTarget === backArrow || e.relatedTarget === forwardArrow) return;
            backArrow.style.display = 'none';
            forwardArrow.style.display = 'none';
        };

        item.onclick = function (e) {
            navigateMedia(e, elem, item);
        };

        viewerContainer.appendChild(item);
    }

    setItem(elem);
}

function sanitizeContent(content, postId) {
    var mediaLinks = [];
    content.split(/(\s|^){1}(https{0,1}:\/\/.+?)(\s|$){1}/)
        .filter(function (x) {
            return x;
        })
        .forEach(function (str, index) {
            if (str.indexOf('http://') === 0 || str.indexOf('https://') === 0) {
                var strUrl = new URL(str);
                var giphyId = err(function() {
                    if (strUrl.hostname === 'media.giphy.com' || strUrl.hostname === 'i.giphy.com') {
                        return strUrl.pathname.match(/\/media\/(.+?)\/.+?/)[1];
                    } else if (strUrl.hostname === 'giphy.com') {
                        if (strUrl.pathname.indexOf('/gifs/') === 0 && strUrl.pathname.match(/\//g).length <= 3) {
                            return strUrl.pathname.match(/\/gifs\/.*?-*?([A-z0-9]+)\/{0,1}$/)[1];
                        } else if (strUrl.pathname.indexOf('/embed/') === 0 && strUrl.pathname.match(/\//g).length <= 3) {
                            return strUrl.pathname.match(/\/embed\/([A-z0-9]+)\/{0,1}$/)[1];
                        }
                    }
                }, true);
                var isYouTube = strUrl.hostname === 'youtube.com' || strUrl.hostname === 'youtu.be' || endsWith(strUrl.hostname, '.youtube.com');
                var isImg = ['.png', '.jpg', '.jpeg', '.gif'].some(function (ext) {
                    return endsWith(str, ext);
                });
                var isVideo = ['.mp4', '.webm', '.gifv', '.hls', '.dash'].some(function (ext) {
                    return endsWith(str, ext);
                });
                
                if (giphyId) {
                    var oncreate = function(vnode) {
                        ['autoplay', 'muted', 'playsinline', 'loop'].forEach(function (attr) {
                            // Have to set these two different ways due to weird bug
                            vnode.dom[attr] = true;
                            vnode.dom.setAttribute(attr, true);
                        });
                    };
                    mediaLinks.push(llv('video', { key: getKey(str, postId), class: 'post-media-gif', src: 'https://i.giphy.com/media/' + giphyId + '/giphy.mp4', oncreate: oncreate, onclick: openMediaViewer }));
                } else if (isYouTube) {
                    var opts = Object.assign({ id: getKey(index, postId) }, postVjsPlayerOpts);
                    var player = llc(VideoPlayer, { src: { src: str, type: 'video/youtube' }, options: opts });
                    mediaLinks.push(m.fragment({ key: getKey(str, postId) }, player));
                } else if (isImg) {
                    mediaLinks.push(llv('img', { key: getKey(str, postId), src: str, class: 'post-media-img', onclick: openMediaViewer }));
                } else if (isVideo) {
                    var oncreate = function(vnode) {
                        ['controls', 'muted', 'playsinline'].forEach(function (attr) {
                            // Have to set these two different ways due to weird bug
                            vnode.dom[attr] = true;
                            vnode.dom.setAttribute(attr, true);
                        });
                    };
                    mediaLinks.push(llv('video', { key: getKey(str, postId), class: 'post-media-video', src: str, oncreate: oncreate }));
                }
            }
        });
    var c = m.fragment({
        oncreate: function (vnode) {
            vnode.dom.querySelectorAll('a').forEach(function (anchor) {
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'nofollow noreferrer');
            });
        }
    }, m.trust(marked(DOMPurify.sanitize(content).trim())));
    return {
        content: c,
        mediaLinks: mediaLinks
    };
}

function dataToPostFeed(posts) {
    return posts.map(function (post) {
        var stzedContent = sanitizeContent(post.content, post.id);
        if (post.media) {
            post.media.forEach(function(postMedia, index) {
                var isVideo = postMedia.mediaType === 'video';
                var player = llc(VideoPlayer, { src: { src: postMedia.mediaUrl, type: 'video/mp4' }, options: postVjsPlayerOpts });
                stzedContent.mediaLinks.push(isVideo ?
                    m.fragment({ key: getKey(postMedia.mediaUrl + index, post.id) }, player)
                    :
                    llv('img', { key: getKey(postMedia.mediaUrl + index, post.id), src: postMedia.mediaUrl, class: 'post-media-img', onclick: openMediaViewer })
                );
            });
        }
        return m('article', { key: post.id, class: 'post-item center-element animated fadeInUp faster' }, [
            m('header', { class: 'post-meta' }, [
                llv('img', { class: 'post-profile-img', src: post.avatar, onclick: openMediaViewer }),
                m('div', [
                    m('div', { class: 'post-author-display-name' }, [
                        post.displayName,
                        post.verified ? m('i', { class: 'post-author-badge icon-ok-circled', title: 'Verified User' }) : undefined,
                        post.administrator ? m('i', { class: 'post-author-badge icon-shield', title: 'Administrator' }) : undefined,
                        post.moderator ? m('i', { class: 'post-author-badge icon-wrench', title: 'Moderator' }) : undefined,
                        post.supporter ? m('i', { class: 'post-author-badge icon-star', title: 'Supporter' }) : undefined
                    ]),
                    m('a', { href: '/profile/' + post.username }, m('div', { class: 'post-author-username' }, '@' + post.username)),
                    m('div', { class: 'post-date-published' }, 'Published ' + new Date(post.datePublished).toDateString() + ' at ' + new Date(post.datePublished).toLocaleTimeString().replace(/:[0-9]{2} /, ' ') + (post.isEdited ? ' (Edited)' : ''))
                ])
            ]),
            m('section', { class: 'post-content', oncreate: function (vnode) {
                var target = vnode.dom;
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.intersectionRatio > 0) {
                            observer.unobserve(entry.target);
                            window.addEventListener('scroll', function addShowMore() {
                                if (target.scrollHeight > 500 && !target.querySelector('.post-show-more-less')) {
                                    var button = document.createElement('button');
                                    button.className = 'post-show-more-less';
                                    button.innerHTML = 'Show More';
                                    button.onclick = function () {
                                        target.classList.toggle('post-view-full');
                                        button.innerHTML = button.innerHTML === 'Show More' ? 'Show Less' : 'Show More';
                                    };
                                    target.insertAdjacentElement('afterend', button);
                                    window.removeEventListener('scroll', addShowMore);
                                }
                            });
                        }
                    });
                });

                observer.observe(target);
            }}, [
                m('span', { class: 'post-text' }, stzedContent.content),
                m('div', { class: 'post-media' }, stzedContent.mediaLinks)
            ]),
            m('section', { class: 'post-actions flex top-divider' }, [
                m('i', { class: 'icon-comment', title: 'Comment' }),
                m('i', { class: 'icon-heart', title: 'Like' }),
                m('i', { class: 'icon-share', title: 'Share' })
            ])
        ])
    });
}

var HomeFeed = {
    view: function() {
        return m('div', { class: 'post-feed' }, dataToPostFeed(posts))
    }
}

var SeriesFeed = {
    popular: SeriesList(domain + '/api/media/popular?count=24', { header: 'Popular' }),
    updated: SeriesList(domain + '/api/media/latest?count=24', { header: 'Recently Updated' }),
    view: function () {
        return m('div', { class: 'flex two' }, [
            m('div', m(SeriesFeed.popular)),
            m('div', { class: 'left-divider' }, m(SeriesFeed.updated))
        ])
    }
};

var RandomFeed = {
    feed: SeriesList(domain + '/api/media/random?options=summary&count=24', { header: 'Random' }),
    view: function () {
        return m('div', { class: 'flex one' }, m('div', m(RandomFeed.feed)))
    }
};

var Home = {
    oninit: function () {
        scrollToTop();

        Home.chatEnabled = window.innerWidth < 700 ? false : getStorage('chat');
        Home.chatIframeLoaded = Home.chatEnabled;
        if (window.innerWidth < 700 && getStorage('chat')) {
            window.addEventListener('resize', function turnOnChatOnResize() {
                if (window.innerWidth >= 700) {
                    HomeToggleChatbox();
                    window.removeEventListener('resize', turnOnChatOnResize)
                }
            });
        }
    },
    player: llc(VideoPlayer, { src: { src: "https://stream.wonderfulsubs.com/live/stream/index.m3u8", type: "application/x-mpegURL" }, options: { muted: true, disablePauseOnScroll: true } }),
    chatbox: llv('iframe', { src: 'https://titan.wonderfulsubs.com/embed/386361030353354765?css=1&defaultchannel=386361187811459074&username=WS%20Guest', frameborder: '0' }),
    chatboxOverlay: m('div', { class: 'home-chat-overlay' }, m('button', { onclick: function(){ HomeToggleChatbox(); } }, [
        m('i', { class: 'icon-comment' }),
        'Turn Chat On'
    ])),
    currentListName: 'feed',
    switchList: function (e) {
        preventAndStop(e)
            .then(function () {
                var elem = e.target;
                var listKey = elem.innerText.toLowerCase().replace(/ /g, '_');
                Home.currentListName = listKey;
                var buttons = elem.parentElement.querySelectorAll('button');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                }
                elem.classList.add('active');
            });
    },
    view: function () {
        setTitle('WonderfulSubs', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' }, [
                m('div', { class: 'flex one two-700' }, [
                    m('div', { class: 'flex-padding-reset two-third-700' }, Home.player),
                    m('div', { class: 'home-chat-container none third-700 flex-padding-reset animated fadeIn slow', oncreate: function (vnode) { Home.chatContainer = vnode.dom; } }, [
                        Home.chatEnabled ? undefined : Home.chatboxOverlay,
                        Home.chatIframeLoaded ? Home.chatbox : undefined
                    ])
                ]),
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    m('button', { class: Home.currentListName === 'feed' ? 'active' : undefined, onclick: Home.switchList }, [m('i'), 'Feed']),
                    m('button', { class: Home.currentListName === 'series' ? 'active' : undefined, onclick: Home.switchList }, [m('i'), 'Series']),
                    m('button', { class: Home.currentListName === 'random' ? 'active' : undefined, onclick: Home.switchList }, [m('i'), 'Random'])
                ]),
                Home.currentListName === 'series' ? m(SeriesFeed) : Home.currentListName === 'random' ? m(RandomFeed) : m(HomeFeed)
            ])
        ]);
    }
};