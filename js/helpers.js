var domain = 'https://www.wonderfulsubs.com';//'http://localhost:5000';
var posterTallPlaceholder = /*domain +*/ '/img/poster_placeholder_tall.png';
var posterWidePlaceholder = /*domain +*/ '/img/poster_placeholder_wide.png';
var siteShortname = 'ws';
var recaptchaKey = true ? '6LcC9ncUAAAAAGClorUQbnX9jl331yMXu_RZGtnx' : '6Ldb-XcUAAAAABImcnwvx1EeOEs73hVn2ecXaaKL';
var recaptchaUrl = 'https://www.google.com/recaptcha/api.js?render=' + recaptchaKey;
var defaultErrMsg = 'Something went wrong. Please try again later.';

function err(func, returnFuncValue) {
    try {
        var value = func && func();
        return returnFuncValue ? value : undefined;
    } catch (error) {
        return returnFuncValue ? undefined : error;
    }
}

function routeAnchor(e, path, data, options) {
    e.preventDefault();
    m.route.set(path, data, options);
}

function getSearchResults(event) {
    var input = event.target.querySelector('input');
    routeAnchor(event, '/search', { q: input.value });
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

function scrollToTop(scrollDuration, callback) {
    if (window.pageYOffset === 0) {
        if (callback) callback();
        return;
    }
    function step(newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.pageYOffset === 0) {
            if (callback) callback();
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
        if (callback) callback();
    }
}

function preventAndStop(e, callback) {
    e.preventDefault();
    e.stopPropagation();
    callback();
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

// Use ESC key to dismiss Picnic modals
document.addEventListener('keydown', function (e) {
    if (!(document.activeElement instanceof HTMLInputElement)) {
        switch (e.key) {
            case "Escape":
                var mods = document.querySelectorAll('.modal > [type=checkbox]');
                [].forEach.call(mods, function (mod) { mod.checked = false; });
                break;
        }
    }
});