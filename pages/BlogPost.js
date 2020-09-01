function insertNativePlcment(callback) {
    try {
        setTimeout(function () {
            var blogBodyContent = document.querySelector('.blog-body-content');

            var maxNodesReached = false;
            var nodeIndex = 2;

            var allowedElems = 'p,div > br,iframe.instagram-media,.twitter-tweet';
            var insertElems = Boolean(blogBodyContent.querySelector(allowedElems));

            while (maxNodesReached === false) {
                try {
                    var textNode = insertElems ? blogBodyContent.querySelectorAll(allowedElems)[nodeIndex] : document.evaluate(
                        '//br/following-sibling::text()[' + nodeIndex + ']',
                        blogBodyContent,
                        null,
                        XPathResult.ANY_UNORDERED_NODE_TYPE
                    ).singleNodeValue;

                    nodeIndex += 4;

                    if (textNode) {
                        var nativePlcment = document.createElement('ins');
                        nativePlcment.setAttribute('class', "adsbygoogle");
                        nativePlcment.setAttribute('style', "display:block; text-align:center;");
                        nativePlcment.setAttribute('data-ad-layout', "in-article");
                        nativePlcment.setAttribute('data-ad-format', "fluid");
                        nativePlcment.setAttribute('data-ad-client', "ca-pub-7274415743225662");
                        nativePlcment.setAttribute('data-ad-slot', "5578369122");

                        textNode.parentElement.insertBefore(nativePlcment, textNode);

                        var br = document.createElement('br');
                        if (insertElems) {
                            nativePlcment.parentElement.insertBefore(br, nativePlcment);
                        } else {
                            textNode.parentElement.insertBefore(br, textNode);
                        }

                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } else {
                        maxNodesReached = true;
                    }
                } catch (error) {
                    maxNodesReached = true;
                }
            }
            if (typeof callback === 'function') callback();
        }, 1000);
    } catch (error) {
        // console.log(error);
        if (typeof callback === 'function') callback();
    }
}

function removeNativePlcment(callback) {
    try {
        document.querySelectorAll('ins[data-ad-layout="in-article"]').forEach(function (elem) {
            var nextEl = elem.nextElementSibling;
            if (nextEl && nextEl.nodeName === 'BR') nextEl.parentElement.removeChild(nextEl);
            elem.parentElement.removeChild(elem);
        });
        if (typeof callback === 'function') callback();
    } catch(error) {
        if (typeof callback === 'function') callback();
    }
}

function loadDisqusComments(vnode) {
    if (vnode.state.canon_id && vnode.state.canon_url && vnode.state.title) {
        vnode.state.show_comments = true;
        m.redraw();
        setTimeout(function() {
            var useReload = 'DISQUS' in window;
            window.disqus_config = function () {
                this.page.url = window.location.origin + vnode.state.canon_url;
                this.page.identifier = vnode.state.canon_id;
                this.page.title = vnode.state.title;
            };
            loadDisqusScript();
            if (useReload) {
                window.DISQUS.reset({
                    reload: true,
                    config: window.disqus_config
                });
            }
        }, 500);
    }
}

function loadMgidPlacements() {
    var o = document.querySelectorAll('script[src*=".mgid.com"]');
    o.forEach(function(elem) {
        elem.parentElement.removeChild(elem);
    });
    var s = document.createElement('script');
    s.src = 'https://jsc.mgid.com/w/o/wonderfulsubs.com.992110.js';
    s.async = true;
    document.head.appendChild(s);
}

function loadOutbrainPlacements() {
    var o = document.querySelectorAll('script[src*=".outbrain.com"]');
    o.forEach(function(elem) {
        elem.parentElement.removeChild(elem);
    });
    window.OBR = undefined;
    var s = document.createElement('script');
    s.src = '//widgets.outbrain.com/outbrain.js';
    s.async = true;
    document.head.appendChild(s);
}

var contractions = ["aight","aint","amnt","arent","cant","cause","couldve","couldnt","couldntve","darent","daresnt","dasnt","didnt","doesnt","dont","dunno","dye","eer","everybodys","everyones","finna","gday","gimme","givn","gonna","gont","gotta","hadnt","hadve","hasnt","havent","hed","hell","hes","heve","howd","howdy","howll","howre","hows","id","idve","ill","im","ima","imo","innit","ive","isnt","itd","itll","its","iunno","lets","maam","maynt","mayve","methinks","mightnt","mightve","mustnt","mustntve","mustve","neednt","nal","neer","oclock","oer","ol","oughtnt","s","shallnt","shant","shed","shell","shes","shouldve","shouldnt","shouldntve","somebodys","someones","somethings","sore","thatll","thatre","thats","thatd","thered","therell","therere","theres","thesere","theseve","theyd","theyll","theyre","theyve","thiss","thosere","thoseve","tis","tove","twas","wanna","wasnt","wed","wedve","well","were","weve","werent","whatd","whatll","whatre","whats","whatve","whens","whered","wherell","wherere","wheres","whereve","whichd","whichll","whichre","whichs","whichve","whod","whodve","wholl","whore","whos","whove","whyd","whyre","whys","willnt","wont","wonnot","wouldve","wouldnt","wouldntve","yall","yalldve","yallre","youd","youll","youre","youve"];

var BlogPost = {
    view: function (vnode) {
        if (!vnode.state.canon_id) return;
        return m.fragment({}, [
            m('div', { class: 'main-container' }, 
                m('div', { class: 'blog-body' }, [
                    m('h2', { class: 'blog-body-title' }, vnode.state.title),
                    m('div', { class: 'blog-body-info' }, [
                        m('img', { class: 'blog-body-author-img', src: vnode.state.authorImg }),
                        m('span', 'by ' + vnode.state.authorName + ' • ' + vnode.state.publishDate)
                    ]),
                    m('div', { class: 'blog-body-content bottom-divider' }, vnode.state.postContent),
                    m('div', { class: "OUTBRAIN", 'data-src': window.location.href, 'data-widget-id': 'GS_1' }),
                    vnode.state.category ? m(BloggerList, { url: 'https://blog.wonderfulsubs.com/feeds/posts/summary/-/' + vnode.state.category + '?alt=json&max-results=5', title: 'Recommended' }) : undefined,
                    vnode.state.show_comments ? m('div', { id: 'disqus_thread' }) : m('button', { class: 'show-comments-btn', onclick: loadDisqusComments.bind(this, vnode) }, 'Show Comments')
                ])
            ),
            m('style', '@media only screen and (max-width:998px){.content-wrapper-container.flex{overflow:hidden}}')
        ]);
    },
    oncreate: function (vnode) {
        var hash = window.location.hash;
        vnode.state.show_comments = false;
        window.history.replaceState({}, '', m.parsePathname(m.route.get()).path.replace('/blog/post/', '/blog/entry/') + hash);
        var year = vnode.attrs.year;
        var month = vnode.attrs.month;
        var slug = vnode.attrs.slug;
        var id = year + month + slug;
        var entryId = vnode.attrs.e;
        BlogPost.currentId = id;

        var firstDayOfMonth = (new Date(year, (parseInt(month) - 1), 1)).toISOString();
        var lastDayOfMonth = (new Date(year, parseInt(month), 0)).toISOString();

        setTitle("WonderfulSubs", true);
        scrollToTop();

        var searchSlug = slug;

        err(function () {
            var mtch = searchSlug.match(/_[0-9]+$/);
            if (mtch) searchSlug = searchSlug.slice(0, -mtch[0].length);
            contractions.forEach(function(w) {
                var reg1 = new RegExp('^' + w + '-');
                var reg2 = new RegExp('-' + w + '$');
                var reg3 = new RegExp('-' + w + '-', 'g');
                searchSlug = searchSlug.replace(reg1, '').replace(reg2, '').replace(reg3, '-');
            });
        });

        var didRetry = false;

        (function fetchPost() {
            var fetchUrl = 'https://blog.wonderfulsubs.com/feeds/posts/default/?alt=json&max-results=' + (didRetry ? '3' : '1') + '&q=' + encodeURIComponent(searchSlug) + '&published-min=' + encodeURIComponent(firstDayOfMonth) + '&published-max=' + encodeURIComponent(lastDayOfMonth);
            if (entryId) fetchUrl = 'https://blog.wonderfulsubs.com/feeds/posts/default/' + entryId + '?alt=json';

            m.jsonp({
                url: fetchUrl
            }).then(function (result) {
                try {
                    var entry;
                    if (entryId) {
                        entry = result.entry;
                    } else {
                        (result.feed.entry || [result.feed]).some(function (e) {
                            if (BlogPost.currentId === ((new URL(e.link[2].href.slice(0, -5))).pathname).replace(/\//g, '')) {
                                entry = e;
                                return true;
                            };
                        });
                    }
                    if (!entry) throw Error;

                    var canon_id = entry.id.$t;
                    canon_id = canon_id.slice(canon_id.lastIndexOf('-') + 1);
                    var canon_url = '/blog/entry' + (new URL(entry.link[2].href.slice(0, -5))).pathname;
                    vnode.state.canon_id = canon_id;
                    vnode.state.canon_url = canon_url;

                    vnode.state.title = entry.title.$t;
                    vnode.state.authorImg = 'https:' + entry.author[0].gd$image.src;
                    vnode.state.authorName = entry.author[0].name.$t;
                    vnode.state.publishDate = (new Date(entry.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
                    vnode.state.postContent = m.trust(entry.content.$t);
                    err(function() {
                        var categories = entry.category.map(function(e) {return e.term;});
                        var category = categories[Math.floor(Math.random() * categories.length)];
                        vnode.state.category = category;
                    });
    
                    setTitle(vnode.state.title);

                    err(function() {
                        removeNativePlcment(function() {
                            insertNativePlcment(loadGAScript);
                        });
                    });

                    err(function() {
                        loadOutbrainPlacements();
                    });

                    err(function() {
                        pintrk('track', 'pagevisit');
                    });

                    err(function() {
                        if (window.location.hash.indexOf('#comment-') === 0) loadDisqusComments(vnode);
                    });
                } catch (error) {
                    if (!didRetry) {
                        didRetry = true;
                        entryId = undefined;
                        fetchPost();
                    } else {
                        if (sessionStorage.getItem('ws_try_blog_reload') !== 'true') {
                            sessionStorage.setItem('ws_try_blog_reload', 'true');
                            window.location.reload();
                        } else {
                            sessionStorage.removeItem('ws_try_blog_reload');
                        }
                    }
                }
            });
        })();
    },
    onupdate: function (vnode) {
        var year = vnode.attrs.year;
        var month = vnode.attrs.month;
        var slug = vnode.attrs.slug;
        var id = year + month + slug;
        if (id !== BlogPost.currentId) BlogPost.oncreate(vnode);

        if (vnode.dom) {
            var recList = vnode.dom.querySelector('.showcase-container');
            vnode.dom.querySelectorAll('img').forEach(function (target) {
                if ((recList ? !recList.contains(target) : true) && !target.onclick) {
                    target.onclick = function (e) {
                        preventAndStop(e, openMediaViewer.bind(this, e));
                    };
                }
            });

            if (vnode.dom.querySelector('.instagram-media')) {
                loadInstgramScript();
            }

            if (vnode.dom.querySelector('.twitter-tweet')) {
                loadTwitterScript();
            }

            if (vnode.dom.querySelector('.embedly-card')) {
                loadRedditScript();
            }
            
        }
    },
    onremove: function () {
        removeGAInstances();
    }
};