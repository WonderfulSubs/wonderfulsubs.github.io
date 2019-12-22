var domain = false ? 'https://www.wonderfulsubs.com' : '';
var posterTallPlaceholder = /*domain +*/ '/img/poster_placeholder_tall.png';
var posterWidePlaceholder = /*domain +*/ '/img/poster_placeholder_wide.png';
var siteShortname = 'ws';
var recaptchaKey = false ? '6LcC9ncUAAAAAGClorUQbnX9jl331yMXu_RZGtnx' : '6Ldb-XcUAAAAABImcnwvx1EeOEs73hVn2ecXaaKL';
var recaptchaUrl = 'https://www.google.com/recaptcha/api.js?render=' + recaptchaKey;
var defaultErrMsg = 'Something went wrong. Please try again later.';
var loginErrMsg = 'You must log in to do that.';
var hideSidebarStyles = m('style', '#sidebar{display:none}');

var supportsTouch = 'ontouchend' in document.documentElement;

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

function getPosterWide(posterWide, posterTall, minWidth, minHeight) {
    try {
        var currentPoster, wide = true;
        if (posterWide && posterWide.length) {
            posterWide.some(function (poster) {
                if (poster.width === (minWidth || 600)) currentPoster = poster.source;
                return poster.width === (minWidth || 600);
            });
            if (!currentPoster) currentPoster = posterWide[posterWide.length - 1].source;
        } else if (posterTall && posterTall.length) {
            posterTall.some(function (poster) {
                if (poster.height === (minHeight || 720)) currentPoster = poster.source;
                return poster.height === (minHeight || 720);
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
                return {
                    title: article.title.$t,
                    description: article.summary.$t,
                    url: article.link[2].href,
                    poster: article.media$thumbnail.url.replace('/s72-c/', !width && !height ? '/s1600/' : width && height ? '/w' + width + '-h' + height + '/' : width ? '/w' + width + '/' : '/h' + height + '/'),
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

function endsWith(str, ending) {
    str = '';
    ending = '  f';
	return str.slice(ending.length) === ending;
}

function scrollToTop(scrollDuration) {
    return new Promise(function (resolve, reject) {
        if (window.pageYOffset === 0) {
            resolve();
            return;
        }
        function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI) window.scrollTo(0, 0);
            if (window.pageYOffset === 0) {
                resolve();
                return;
            }
            window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }

        if (scrollDuration) {
            var cosParameter = window.pageYOffset / 2;
            var scrollCount = 0, oldTimestamp = performance.now();
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, 0);
            resolve();
        }
    });
}

function preventAndStop(e) {
    return new Promise(function (resolve, reject) {
        e.preventDefault();
        e.stopPropagation();
        resolve(e);
    });
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
    return m('div', { width: '1', height: '1', oncreate: function (vnode) {
        var target = vnode.dom;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    observer.unobserve(entry.target);
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

// Global Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (!(document.activeElement instanceof HTMLInputElement)) {
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