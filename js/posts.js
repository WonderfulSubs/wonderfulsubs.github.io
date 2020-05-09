// Posts

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
                mediaUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
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
                mediaUrl: 'https://cdn.wonderfulsubs.com/image/efHq86JYU8_%2FaGcaaaaaaaa%2Fik1BnZpc10t%2F0jG4yQlwpZi-',
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
    },
    {
        id: '7sdfsd',
        avatar: 'https://pbs.twimg.com/profile_images/2668854518/79fc3605e372a8e1e34693abcf7d7847.jpeg',
        username: '007',
        displayName: 'James Bond',
        content: 'Sometimes the old ways are the best.',
        datePublished: 1576093436993,
        likes: 2,
        shares: 3,
        isEdited: false,
        verified: false,
        administrator: false,
        moderator: false,
        supporter: false,
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

    function getDivImg(elem) {
        return elem.nodeName === 'DIV' ? err(function () {
            return elem.style.backgroundImage.match(/url\((['"]{0,1})(.+)\1\)/)[2];
        }, true) : undefined;
    }
    
    var isVideo = elem.nodeName === 'VIDEO';
    var isImage = elem.nodeName === 'IMG' || getDivImg(elem);
    var isGifVideo = isVideo && ('loop' in elem.attributes);
    if (!isGifVideo && !isImage) return;

    var viewerContainer = document.createElement('div');
    viewerContainer.className = 'post-media-viewer animated fadeIn faster';
    viewerContainer.onclick = function () {
        viewerContainer.parentElement.removeChild(viewerContainer);
        history.pushState("", document.title, window.location.pathname + window.location.search);
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
            preventAndStop(e, function() {setItem(elem[sibling]);});
        }
    }

    viewerContainer.appendChild(backArrow);
    viewerContainer.appendChild(forwardArrow);

    var prevPageXOffset = window.pageXOffset;
    var prevPageYOffset = window.pageYOffset;
    
    document.body.insertAdjacentElement('afterbegin', viewerContainer);

    scrollTo(prevPageXOffset, prevPageYOffset);

    function setItem(elem) {
        var divImg = getDivImg(elem);
        var isVideo = elem.nodeName === 'VIDEO';
        var isImage = elem.nodeName === 'IMG' || divImg;
        var isGifVideo = isVideo && ('loop' in elem.attributes);
        if (!isGifVideo && !isImage) return;
        var item = document.createElement(isGifVideo ? 'video' : 'img');
        item.src = elem.src || divImg;
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
        m.route.set('#viewer');
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
            if (startsWith(str, 'http://') || startsWith(str, 'https://')) {
                var strUrl = new URL(str);
                var giphyId = err(function() {
                    if (strUrl.hostname === 'media.giphy.com' || strUrl.hostname === 'i.giphy.com') {
                        return strUrl.pathname.match(/\/media\/(.+?)\/.+?/)[1];
                    } else if (strUrl.hostname === 'giphy.com') {
                        if (startsWith(strUrl.pathname, '/gifs/') && strUrl.pathname.match(/\//g).length <= 3) {
                            return strUrl.pathname.match(/\/gifs\/.*?-*?([A-z0-9]+)\/{0,1}$/)[1];
                        } else if (startsWith(strUrl.pathname, '/embed/') && strUrl.pathname.match(/\//g).length <= 3) {
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
                
                // Disallow loading of non-secure content
                if ((isImg || isVideo) && startsWith(str, 'http://')) return;

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
                // Disallow loading of non-secure content
                if (startsWith(postMedia.mediaUrl, 'http://')) return stzedContent.mediaLinks.push(m.fragment({ key: getKey(postMedia.mediaUrl + index, post.id) }, (sanitizeContent(postMedia.mediaUrl, postMedia.mediaUrl)).content));

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
                        post.moderator && !post.administrator ? m('i', { class: 'post-author-badge icon-wrench', title: 'Moderator' }) : undefined,
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

// Feeds

function switchList(e, component) {
    preventAndStop(e, function () {
        var elem = e.target;
        var listKey = elem.innerText.toLowerCase().replace(/ /g, '_');
        component.currentListName = listKey;
        var buttons = elem.parentElement.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        elem.classList.add('active');
    });
}