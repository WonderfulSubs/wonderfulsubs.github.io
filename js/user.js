var defaultUserListOptions = { className: 'user-panel-list', count: 14, preventUpdate: true, changeonremove: true };

var AuthUser = {
    init: function () {
        ['Watch List', 'Favorites'].forEach(function (listName) {
            var listKey = listName.toLowerCase().replace(/ /g, '_');
            AuthUser[listKey] = { url: (getStorage(listKey) || {}).list, options: defaultUserListOptions };
        });
    },
    data: getStorage('auth_user') || {},
    login: function (data, callback) {
        AuthUser._returnUserData(domain + '/api/v2/users/login', data, { requireToken: true, setAuthUser: true })
            .then(function (onFulfilled) {
                if (onFulfilled) {
                    AuthUser.fetchList('Watch List', function () {
                        CurrentUser.currentList = AuthUser.watch_list;
                    });
                    AuthUser.fetchList('Favorites');
                    if (callback) callback();
                    AuthUser.removeCaptchaBadge();
                } else {
                    if (callback) callback();
                    AuthUser.removeCaptchaBadge();
                }
            })
            .catch(function(error) {
                if (callback) callback(error);
            });
    },
    update: function (data, callback) {
        AuthUser._returnUserData(domain + '/api/v2/users/update', data, { withAuth: true })
        .then(function (data) {
            if (callback) callback(undefined, data);
        })
        .catch(function(error) {
            if (callback) callback(error);
        });
    },
    signup: function (data, callback) {
        function getReCaptcha() {
            grecaptcha.ready(function () {
                grecaptcha.execute(recaptchaKey, { action: 'signup' })
                    .then(function (g_response) {
                        data.g_response = g_response;
                        AuthUser._returnUserData(domain + '/api/v2/users/create', data, { requireToken: true, setAuthUser: true })
                            .then(function (onFulfilled) {
                                if (callback) callback();
                                if (onFulfilled) AuthUser.removeCaptchaBadge();
                            })
                            .catch(function(error) {
                                if (callback) callback(error);
                            });
                    });
            });
        }

        var recaptchaScriptExists = document.querySelector('script[src*="' + recaptchaUrl + '"]');
        if (!recaptchaScriptExists) {
            var script = document.createElement('script');
            script.src = recaptchaUrl;
            script.async = true;
            script.defer = true;
            script.onload = getReCaptcha;
            document.head.appendChild(script);
        } else {
            getReCaptcha();
        }
    },
    removeCaptchaBadge: function () {
        var elem = document.querySelector('.grecaptcha-badge');
        //if (elem) location.reload();
    },
    _returnUserData: function (url, data, options) {
        return new Promise(function (resolve, reject) {
            Object.keys(data).forEach(function (key) {
                if (data[key] === undefined || data[key] === "") delete data[key];
            });
            if (!options) options = {};
            var headers = {};
            if (options.withAuth) headers.Authorization = 'Bearer ' + AuthUser.data.token;
            m.request({ method: 'POST', url: url, body: data, headers })
                .then(function (result) {
                    try {
                        if (result.data && result.data._id && (options.requireToken ? result.token : true)) {
                            if (options.setAuthUser) {
                                AuthUser.data = result.data;
                                AuthUser.data.token = result.token;
                                setStorage('auth_user', AuthUser.data);
                            }
                            resolve();
                        } else {
                            reject(new Error(defaultErrMsg));
                        }
                    } catch (error) {
                        nativeToast({
                            message: result.error || defaultErrMsg,
                            position: 'north-east',
                            type: 'error'
                        });
                        reject(error);
                    }
                })
                .catch(function(error) {
                    reject(error);
                });
        })
    },
    logout: function () {
        AuthUser.data = {};
        AuthUser.watch_list = undefined;
        AuthUser.favorites = undefined;
        ['auth_user', 'watch_list', 'favorites'].forEach(function (key) {
            removeStorage(key);
        });
        userPanelElem.classList.add('none');
        // m.redraw();
    },
    fetchList: function (listName, callback) {
        m.request({
            method: 'GET',
            url: domain + '/api/v2/' + listName.toLowerCase().replace(/ /g, '') + '/list?_id=' + AuthUser.data._id,
            headers: {
                Authorization: 'Bearer ' + AuthUser.data.token
            }
        })
            .then(function (result) {
                AuthUser.setList(listName, result, defaultUserListOptions);
                if (callback) callback();
            });
    },
    isInList: function (listName, series) {
        var listKey = listName.toLowerCase().replace(/ /g, '_');
        // var alreadySet = AuthUser[listKey].full_list.some(function (listedSeries) {
        //     return listedSeries.url === series.url;
        // });
        // return alreadySet;
    },
    setList: function (listName, result, options) {
        try {
            var listKey = listName.toLowerCase().replace(/ /g, '_');
            if (result.data[listKey]) {
                AuthUser[listKey] = { url: result.data[listKey], options: options };
                setStorage(listKey, { list: result.data[listKey], last_modified: result.data.last_modified });
            } else {
                throw new Error(defaultErrMsg);
            }
        } catch (error) {
            nativeToast({
                message: result.error || defaultErrMsg,
                position: 'north',
                type: 'error'
            });
        }
    },
    addToRemoveFromList: function (listName, series, options) {
        if (!AuthUser.data._id) {
            return nativeToast({
                message: loginErrMsg,
                position: 'north-east',
                type: 'error'
            });
        }
        if (!options) options = {};
        var preventUpdate = options.preventUpdate;
        var element = options.element;
        var showToast = options.showToast;
        var alreadySet = AuthUser.isInList(listName, series);
        var seriesData = {
            title: series.title,
            url: series.url,
            poster: series.poster || getPosterTall(series.poster_tall).poster,
            is_subbed: series.is_subbed,
            is_dubbed: series.is_dubbed,
            readable: series.readable
        };
        var data = {
            _id: AuthUser.data._id,
            series: !alreadySet ? seriesData : undefined,
            url: alreadySet ? series.url : undefined,
        };

        m.request({
            method: 'POST',
            url: domain + '/api/v2/' + listName.toLowerCase().replace(/ /g, '') + '/' + (!alreadySet ? 'add' : 'remove'),
            body: data,
            headers: {
                Authorization: 'Bearer ' + AuthUser.data.token
            }
        })
            .then(function (result) {
                AuthUser.setList(listName, result, defaultUserListOptions);
                var listKey = listName.toLowerCase().replace(/ /g, '_');
                if (element && CurrentUser.currentListName === listKey) {
                    var onChangeClasses = ['removed', 'pulse', 'animated', 'infinite', 'slow'];
                    onChangeClasses.forEach(function (className) {
                        element.classList[alreadySet ? 'add' : 'remove'](className);
                    });
                }
                if (!preventUpdate) refreshUserList();
                if (showToast) {
                    nativeToast({
                        message: (!alreadySet ? 'Added to ' : 'Removed from ') + listName,
                        position: 'north-east',
                        type: 'success',
                        closeOnClick: true
                    });
                }
            });
    }
};

AuthUser.init();

function showHideUserPanel() {
    if (!AuthUser.data._id) {
        m.route.set('/login');
        return;
    }
    var outAnimation = 'slideOutDown';
    if (userPanelElem.classList.contains('none')) {
        userPanelElem.classList.remove('none');
    } else if (userPanelElem.classList.contains(outAnimation)) {
        refreshUserList();
        m.redraw();
        userPanelElem.classList.remove(outAnimation);
    } else {
        userPanelElem.classList.add(outAnimation);
    }
}

var CurrentUser = {
    currentList: AuthUser.watch_list,
    currentListName: 'watch_list',
};

function refreshUserList() {
    CurrentUser.currentList = AuthUser[CurrentUser.currentListName];
}

function UserPanel() {
    function keyEvents(e) {
        if (!(document.activeElement instanceof HTMLInputElement)) {
            switch (e.key) {
                case "w":
                    showHideUserPanel();
                    break;
            }
        }
    }

    function switchList(e) {
        preventAndStop(e, function () {
            var elem = e.target;
            var listKey = elem.innerText.toLowerCase().replace(/ /g, '_');
            CurrentUser.currentList = AuthUser[listKey];
            CurrentUser.currentListName = listKey;
            var buttons = elem.parentElement.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
            }
            elem.classList.add('active');
        });
    }

    return {
        oncreate: function () {
            document.addEventListener('keydown', keyEvents);
        },
        onremove: function () {
            document.removeEventListener('keydown', keyEvents);
        },
        view: function () {
            return m('div', [
                m('div', { class: 'user-panel-profile' }, [
                    m(m.route.Link, { href: '/profile/' + AuthUser.data.username }, [
                        llv('img', { class: 'left', src: AuthUser.data.profile_pic }),
                        m('span', { class: 'left' }, AuthUser.data.display_name || AuthUser.data.username)
                    ]),
                    m('div', { class: 'pointer right' }, m('i', { class: 'icon-cancel-circled' })),
                    m('div', { class: 'pointer right', onclick: AuthUser.logout }, [
                        m('i', { class: 'icon-logout' }),
                        m('span', 'Log Out')
                    ])
                ]),
                m('div', { class: 'list-switch-buttons' }, [
                    m('button', { class: 'active', onclick: switchList }, [m('i', { class: 'icon-clock' }), 'Watch List']),
                    m('button', { onclick: switchList }, [m('i', { class: 'icon-heart' }), 'Favorites'])
                ]),
                m(SeriesList, CurrentUser.currentList)
            ]);
        }
    };
}

var userPanelElem;
document.addEventListener('DOMContentLoaded', function () {
    userPanelElem = document.getElementById('user-panel');
    userPanelElem.onclick = showHideUserPanel;
    m.mount(userPanelElem, UserPanel);
});