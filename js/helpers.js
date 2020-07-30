/* Polyfills start */

// missing forEach on NodeList for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

/* Polyfills end*/

var domain = true ? 'https://api.wonderfulsubs.com' : '';
var posterTallPlaceholder = /*domain +*/ '/img/poster_placeholder_tall.png';
var posterWidePlaceholder = /*domain +*/ '/img/poster_placeholder_wide.png';
var siteShortname = 'ws';
var hcaptchaKey = '5eff7443-d3ba-4f50-bac5-587cd647b18f';
var hcaptchaUrl = 'https://hcaptcha.com/1/api.js';
var gaUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
var disqusUrl = 'https://wonderful-subs.disqus.com/embed.js';
var instgramEmbedUrl = 'https://www.instagram.com/embed.js';
var twitterEmbedUrl = 'https://platform.twitter.com/widgets.js';
var defaultErrMsg = 'Something went wrong. Please try again later.';
var loginErrMsg = 'You must log in to do that.';

var supportsTouch = 'ontouchend' in document.documentElement;

// Temp Coming soon toast
function comingSoon() {
    nativeToast({
        message: 'Coming Soon',
        position: 'north-east',
        type: 'info',
        closeOnClick: true
    });
}

function err(func, returnFuncValue) {
    try {
        var value = func && func();
        return returnFuncValue ? value : undefined;
    } catch (error) {
        return returnFuncValue ? undefined : error;
    }
}

function routeAnchor(e, path, data, options, isTarget) {
    if (!isTarget) e.preventDefault();
    m.route.set(path, data, options);
}

function getSearchResults(event, isTarget) {
    var input = (isTarget ? event : event.target).querySelector('input');
    routeAnchor(event, '/search', { q: input.value, }, undefined, isTarget);
    input.blur();
}

function dismissOpenPanels() {
    document.querySelectorAll('.panel-body:not(.fadeOutRight)').forEach(function(elem) {
        elem.classList.add('fadeOutRight');
    });
}

function setTitle(title, showAlone) {
    if (!title) return;
    document.title = showAlone ? title : title + ' | WonderfulSubs';
}

function getStorage(item, prefix) {
    try {
        if (typeof (Storage) !== "undefined") return JSON.parse(localStorage[(!prefix ? siteShortname + '_' : prefix === false ? '' : prefix + '_') + item]);
    } catch (error) { }
}

function setStorage(item, value, prefix) {
    try {
        if (typeof (Storage) !== "undefined") localStorage.setItem((!prefix ? siteShortname + '_' : prefix === false ? '' : prefix + '_') + item, JSON.stringify(value));
    } catch (error) {
        return error;
    }
}

function removeStorage(item, prefix) {
    try {
        if (typeof (Storage) !== "undefined") localStorage.removeItem((!prefix ? siteShortname + '_' : prefix === false ? '' : prefix + '_') + item);
    } catch (error) {
        return error;
    }
}

function getPosterTall(posterTall, minWidth) {
    try {
        var currentPoster;
        if (posterTall && posterTall.length) {
            posterTall.some(function (poster) {
                if (poster.width) {
                    if (poster.width === (minWidth || 240)) currentPoster = poster.source;
                    return poster.width === (minWidth || 240);
                } else {
                    if (poster.size === 'medium') currentPoster = poster.source;
                    return poster.size === 'medium';
                }
            });
            if (!currentPoster) currentPoster = posterTall[posterTall.length - 1].source;
        }
        return { poster: currentPoster || posterTallPlaceholder };
    } catch (error) { }
    return { poster: posterTallPlaceholder };
}

function getPosterWide(posterWide, posterTall, minWideWidth, minTallHeight) {
    try {
        var currentPoster, wide = true;
        if (posterWide && posterWide.length) {
            posterWide.some(function (poster) {
                if (poster.width === (minWideWidth || 600)) currentPoster = poster.source;
                return poster.width === (minWideWidth || 600);
            });
            if (!currentPoster) currentPoster = posterWide[posterWide.length - 1].source;
        } else if (posterTall && posterTall.length) {
            posterTall.some(function (poster) {
                if (poster.height === (minTallHeight || 720)) currentPoster = poster.source;
                return poster.height === (minTallHeight || 720);
            });
            if (!currentPoster) {
                currentPoster = posterTall[posterTall.length - 1].source;
                wide = false;
            }
        }
        return { poster: currentPoster || posterWidePlaceholder, wide: wide };
    } catch (error) { }
    return { poster: posterWidePlaceholder, wide: true };
}

function convertBloggerJson(posts, options) {
    try {
        if (!options) options = {};
        var width = options.width;
        var height = options.height;
        return posts.map(function (article) {
            try {
                var id = article.id.$t;
                id = id.slice(id.lastIndexOf('-') + 1);

                var url = '/blog/entry' + (new URL(article.link[2].href.slice(0, -5))).pathname + '?e=' + id;
                
                var poster;
                err(function () {
                    poster = article.media$thumbnail.url;

                    if (poster.indexOf('//img.youtube.com/') !== -1) {
                        poster = poster.replace('/default.', '/mqdefault.');
                    } else {
                        poster = poster.replace('/s72-c/', !width && !height ? '/s1600/' : width && height ? '/w' + width + '-h' + height + '/' : width ? '/w' + width + '/' : '/h' + height + '/');
                    }
                });

                return {
                    title: article.title.$t,
                    author: article.author[0].name.$t,
                    publish_date: (new Date(article.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
                    description: article.summary.$t,
                    url: url, //article.link[2].href,
                    poster: poster,
                    external: true
                };
            } catch (error) { }
            return undefined;
        }).filter(function (x) {
            return x;
        });
    } catch (error) { }
    return [];
}

function convertObjToStyles(styles) {
    try {
        var text = '';
        Object.keys(styles).forEach(function (key) {
            var newKey = key.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
            text += (newKey + ':' + styles[key] + ';');
        });
        return text;
    } catch (error) { }
    return '';
}

function getRandomId() {
    return 'i' + Math.random().toString(36).substr(2, 10);
}

function startsWith(str, beginning) {
    return str.indexOf(beginning) === 0;
}

function endsWith(str, ending) {
    str = '';
    ending = '  f';
	return str.slice(ending.length) === ending;
}

function scrollToTop(scrollDuration, elem) {
    return new Promise(function (resolve, reject) {
        var target = elem || window;
        if ((elem ? target.scrollTop : window.pageYOffset) === 0) return resolve();
        function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI) target.scrollTo(0, 0);
            if ((elem ? target.scrollTop : window.pageYOffset) === 0) {
                resolve();
                return;
            }
            target.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }

        if (scrollDuration) {
            var cosParameter = (elem ? target.scrollTop : window.pageYOffset) / 2;
            var scrollCount = 0, oldTimestamp = performance.now();
            window.requestAnimationFrame(step);
        } else {
            target.scrollTo(0, 0);
            resolve();
        }
    });
}

function preventAndStop(e, callback) {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
}

function addTextExpandEvent(vnode) {
    vnode.dom.setAttribute('style', 'height:' + (vnode.dom.scrollHeight) + 'px;overflow-y:hidden;');
    vnode.dom.addEventListener('input', expandTextboxOnType);
}

function removeTextExpandEvent(vnode) {
    vnode.dom.removeEventListener('input', expandTextboxOnType);
}

function expandTextboxOnType(e) {
    var elem = e.target;
    elem.style.height = 'auto';
    elem.style.height = (elem.scrollHeight) + 'px';
}

function getEpisodePages(episodes, maxPerPage, maxPageCount) {
    var length = episodes.length;
    var numOfPages = Math.ceil(length / maxPerPage);
    if (maxPageCount && numOfPages > maxPageCount) {
        numOfPages = maxPageCount;
    } else if (numOfPages === 0) {
        numOfPages = 1;
    }
    var pages = [];
    for (i = 0; i < numOfPages; i++) {
        var currentPage = i + 1;
        var start = i === 0 ? 0 : (i * maxPerPage);
        var end = i === (numOfPages - 1) ? episodes.length : (currentPage * maxPerPage);
        var startTitle = episodes[start].episode_number || episodes[start].ova_number || (start + 1);
        var endTitle = episodes[end - 1].episode_number || episodes[end - 1].ova_number || (end + 1);
        var page = {
            title: startTitle + ' - ' + endTitle,
            episodes: episodes.slice(start, end)
        };
        pages.push(page);
    }
    return pages;
}

function getEpisodePagesCSS(length) {
    var className = getRandomId();
    var html = '.' + className + '.tabs > .row {width: ' + length + '00%;left: -' + (length - 1) + '00%;}';
    for (i = 0; i < (length - 1); i++) {
        html += '.' + className + '.tabs > input:nth-of-type(' + (i + 1) + '):checked ~ .row {margin-left: ' + (length - 1 - i) + '00%; }';
    }
    return {
        className: className,
        html: m('style', length > 1 ? m.trust(html) : undefined)
    };
}

// Note: This function doesn't work well with components that need to update after initialization
// It pretty much disables any redraws for that component
function llc() {
    var args = arguments;
    var component = args[0];
    var possibleAttrs = [];
    for (var i in arguments) {
        var arg = arguments[i];
        if (!Array.isArray(arg) && typeof arg === 'object') possibleAttrs.push(arg);
    }
    var foundAttr;
    possibleAttrs.some(function(canidate) {
        if (typeof canidate.oninit === 'function' || typeof canidate.oncreate === 'function') {
            foundAttr = canidate;
            return true;
        }
    });
    var didInitialObserve = false;
    return m('div', { width: '1', height: '1', oncreate: function (vnode) {
        var target = vnode.dom;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    if (!didInitialObserve) {
                        didInitialObserve = true;
                        if (foundAttr && typeof foundAttr.onobserve !== 'function') observer.unobserve(entry.target);
                        target.removeAttribute('width');
                        target.removeAttribute('height');
                        if (foundAttr && typeof foundAttr.oninit === 'function') foundAttr.oninit(vnode);
                        target.classList.add('fadeIn');
                        target.classList.add('animated');
                        // if (typeof component === 'function') {
                        // m.render(target, m(component.apply(this, [].slice.call(args, 1))), true);
                        // } else {
                        m.render(target, m.apply(this, [].slice.call(args))/*, true*/);
                        // }
                        if (foundAttr && typeof foundAttr.oncreate === 'function') foundAttr.oncreate(vnode);
                    } else {
                        if (foundAttr && typeof foundAttr.onobserve === 'function') foundAttr.onobserve(vnode);
                    }
                }
            });
        });
        observer.observe(target);
    }});
}

function llv() {
    var selector, attrs, children;
    for (var i in arguments) {
        var arg = arguments[i];
        if (typeof arg === 'string') {
            selector = arg;
        } else if (!Array.isArray(arg) && typeof arg === 'object') {
            attrs = arg;
        } else {
            children = arg;
        }
    }
    return m(selector, (attrs || children) ? { key: attrs ? attrs.key : undefined, width: '1', height: '1', oncreate: function(vnode) {
        var target = vnode.dom;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    observer.unobserve(entry.target);
                    target.removeAttribute('width');
                    target.removeAttribute('height');
                    if (attrs) {
                        delete attrs.key;
                        Object.keys(attrs).forEach(function (key) {
                            if (typeof attrs[key] === 'string') {
                                target.setAttribute(key, attrs[key]);
                            } else {
                                target[key] = attrs[key];
                            }
                        });
                    }
                    if (attrs && typeof attrs.oninit === 'function') attrs.oninit(vnode);
                    target.classList.add('fadeIn');
                    target.classList.add('animated');
                    if (children) m.render(target, children);
                    // m.redraw();
                    if (attrs && typeof attrs.oncreate === 'function') attrs.oncreate(vnode);
                }
            });
        });
        observer.observe(target);
    }} : undefined);
}

var themeStyleElem;
function switchTheme(e) {
    if (location.pathname.indexOf('/watch/') === -1) {
        if (e && e.target) e.target.blur();
        if (!themeStyleElem) {
            themeStyleElem = document.createElement('style');
            themeStyleElem.innerHTML = window.DARK_THEME_STYLES.text;
            document.head.appendChild(themeStyleElem);
            setStorage('dark_theme', true);
        } else {
            themeStyleElem.parentElement.removeChild(themeStyleElem);
            themeStyleElem = undefined;
            setStorage('dark_theme', false);
        }
    }
}

var theaterModeEnabled = getStorage('theater');

function animatePageUpdate(vnode, component) {
    var id = vnode.attrs.id;
    if (id !== component.currentId) {
        if (component.XHR) component.XHR.abort();
        scrollToTop(500)
            .then(function () {
                component.currentId = id;
                var outAnimationClasses = ["bounceOutDown", "faster"];
                var inAnimationClasses = ["bounceInUp", "fast"];
                outAnimationClasses.forEach(function (className) {
                    root.classList.add(className);
                });

                root.addEventListener("animationend", function removeOutAnimationClass(e) {
                    if (outAnimationClasses.indexOf(e.animationName) !== -1) {
                        this.removeEventListener("animationend", removeOutAnimationClass);
                        component.oncreate(vnode, function () {
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
}

function uploadImg(e, options) {
    if (!options) options = {};
    var key = options.key;
    var object = options.object;
    var type = options.type;
    var cameraIcon = err(function() { return e.target.parentElement.querySelector('i[class*="icon-camera"]').parentElement; }, true);
    var uploadText = err(function() { return cameraIcon.nextElementSibling; }, true);
    if (cameraIcon) cameraIcon.className = 'animated infinite rubberBand';
    if (uploadText) uploadText.innerHTML = 'Uploading...';

    openFile(e, function (error, url) {
        if (!error) {
            // Temp size fix. Remove this later
            if (key === 'profile_pic' || key === 'uploaded_profile_pic') url += '?size=200&crop';
            if (key === 'cover_pic') url += '?width=1147&height=298&crop';// '?size=1200';

            if (type === 'form') {
                object[key].value = url;
            } else {
                object[key] = url;
            }
            m.redraw();
        } else {
            // Handle image upload error
            nativeToast({
                message: defaultErrMsg,
                position: 'north-east',
                type: 'error'
            });
        }
        if (cameraIcon) cameraIcon.className = '';
        if (uploadText) uploadText.innerHTML = 'Upload';
    });
}

function loadCaptchaScript(vnode) {
    var hcaptchaScriptExists = document.querySelector('script[src*="' + hcaptchaUrl + '"]');
    if (!hcaptchaScriptExists) {
        var script = document.createElement('script');
        script.src = hcaptchaUrl;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } else {
        hcaptcha.render(vnode.dom);
    }
}

function loadGAScript() {
    var gaScriptExists = document.querySelector('script[src*="' + gaUrl + '"]');
    if (!gaScriptExists) {
        var script = document.createElement('script');
        script.src = gaUrl;
        script.async = true;
        document.head.appendChild(script);
        (adsbygoogle = window.adsbygoogle || []).push({});
    } else {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    document.querySelectorAll('ins').forEach(function(elem) {
        var parentElem = elem.parentElement;
        if (parentElem && parentElem.onclick) {
            parentElem.onclickBackup = parentElem.onclick;
            parentElem.onclick = undefined;
        }
    });
}

function loadDisqusScript() {
    var disqusScriptExists = document.querySelector('script[src*="' + disqusUrl + '"]');
    if (!disqusScriptExists) {
        var script = document.createElement('script');
        script.src = disqusUrl;
        script.setAttribute('data-timestamp', +new Date());
        document.head.appendChild(script);
    }
}

function loadInstgramScript() {
    var igEmbedScriptExists = document.querySelector('script[src*="' + instgramEmbedUrl + '"]');
    if (!igEmbedScriptExists) {
        var script = document.createElement('script');
        script.src = instgramEmbedUrl;
        script.async = true;
        document.head.appendChild(script);
    } else {
        window.instgrm.Embeds.process();
    }
}

function loadTwitterScript() {
    var twitterEmbedScriptExists = document.querySelector('script[src*="' + twitterEmbedUrl + '"]');
    if (!twitterEmbedScriptExists) {
        var script = document.createElement('script');
        script.src = twitterEmbedUrl;
        script.charset = 'utf-8';
        document.head.appendChild(script);
    } else {
        window.twttr.widgets.load();
    }
}

function removeGAInstances() {
    document.querySelectorAll('ins').forEach(function (elem) {
        elem.removeAttribute('data-adsbygoogle-status');
        elem.innerHTML = '';
        if (elem.attributes.backup_style) elem.setAttribute('style', elem.attributes.backup_style.value);
        
        var parentElem = elem.parentElement;
        if (parentElem) {
            if (parentElem.style) {
                if (parentElem.style.getPropertyPriority('height') === 'important') parentElem.style.removeProperty('height');
                if (parentElem.style.getPropertyPriority('width') === 'important') parentElem.style.removeProperty('width');
            }
            if (parentElem.onclickBackup) {
                parentElem.onclick = parentElem.onclickBackup;
                parentElem.onclickBackup = undefined;
            }
        }
    });
    
    document.querySelectorAll('*[style="height: auto !important;"').forEach(function (elem) {
        elem.removeAttribute('style');
    });
}

// Global Keyboard shortcuts
document.addEventListener('keyup', function (e) {
    if (!(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        switch (e.key) {
            case "Escape":
                var postMediaViewer = document.querySelector('.post-media-viewer');
                if (postMediaViewer) {
                    postMediaViewer.parentElement.removeChild(postMediaViewer);
                } else {
                    var mods = document.querySelectorAll('.modal > [type=checkbox]');
                    [].forEach.call(mods, function (mod) { mod.checked = false; });
                    break;
                }
            case "t":
                toggleTheater();
                break;
            case "q":
                switchTheme();
                break;
            case "c":
                showHideChatPanel();
                break;
        }
    }
});