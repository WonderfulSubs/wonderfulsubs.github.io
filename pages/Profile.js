var ProfileInfo = {
    user: {},
    update: {}
};

var PrivateUserMsg = {
    view: function() {
        return m('div', { class: 'user-private-msg' }, [
            m('i', { class: 'icon-lock' }),
            m('div', "This user's activity is private")
        ])
    }
}

var ProfileFeed = {
    view: function () {
        if (ProfileInfo.user.private && !AuthUser.data.administrator && AuthUser.data._id !== ProfileInfo.user._id) return m(PrivateUserMsg);
        return ProfileInfo.user._id ? m('div', { class: 'post-feed' }, dataToPostFeed(posts)) : undefined;
    }
}

var FavoritesFeed = {
    view: function () {
        if (ProfileInfo.user.private && !AuthUser.data.administrator && AuthUser.data._id !== ProfileInfo.user._id) return m(PrivateUserMsg);
        return ProfileInfo.user._id ? m('div', { class: 'flex one' }, m('div', m(SeriesList, { url: domain + '/api/v2/favorites/list?_id=' + ProfileInfo.user._id, options: { withAuth: true } }))) : undefined;
    }
};

var WatchListFeed = {
    view: function () {
        if (ProfileInfo.user.private && !AuthUser.data.administrator && AuthUser.data._id !== ProfileInfo.user._id) return m(PrivateUserMsg);
        return ProfileInfo.user._id ? m('div', { class: 'flex one' }, m('div', m(SeriesList, { url: domain + '/api/v2/watchlist/list?_id=' + ProfileInfo.user._id, options: { withAuth: true } }))) : undefined;
    }
};

function uploadImg(e, options) {
    var cameraIcon = e.target.parentElement.querySelector('i[class="icon-camera"]').parentElement;
    var uploadText = cameraIcon.nextElementSibling;
    cameraIcon.className = 'animated infinite rubberBand';
    uploadText.innerHTML = 'Uploading...';

    openFile(e, function (error, url) {
        if (!error) {
            // Temp size fix. Remove this later
            if (options.key === 'profile_pic') url += '?size=200&crop';
            if (options.key === 'cover_pic') url += '?width=1147&height=298&crop';// '?size=1200';

            options.object[options.key] = url;
            m.redraw();
        } else {
            // Handle image upload error
            nativeToast({
                message: defaultErrMsg,
                position: 'north-east',
                type: 'error'
            });
        }
        cameraIcon.className = '';
        uploadText.innerHTML = 'Upload';
    });
}

function setProfileUpdateValue(e) {
    var elem = e.target;
    ProfileInfo.update[elem.name] = elem.type === 'checkbox' ? elem.checked : elem.value;
}

function updateUserData() {
    var data = {};

    Object.keys(ProfileInfo.update).map(function (key) {
        if (ProfileInfo.update[key] !== ProfileInfo.user[key]) data[key] = ProfileInfo.update[key];
    });

    if (Object.keys(data).length === 0) {
        ProfileInfo.edit = false;
    } else {
        data._id = ProfileInfo.user._id;

        ProfileInfo.saving = true;
        AuthUser.update(data, function (error) {
            if (!error) {
                var isCurrentUser = AuthUser.data._id === ProfileInfo.user._id;
                var usernameDidChange = ProfileInfo.update.username !== undefined && ProfileInfo.update.username !== ProfileInfo.user.username;
                if (usernameDidChange) m.route.set('/profile/:id', { id: ProfileInfo.update.username }, { replace: true });
                getUserData({ _id: ProfileInfo.user._id });
                ProfileInfo.edit = false;
                nativeToast({
                    message: 'Profile changes saved',
                    position: 'north-east',
                    type: 'success'
                });
            } else {
                nativeToast({
                    message: defaultErrMsg,
                    position: 'north-east',
                    type: 'error'
                });
            }
            ProfileInfo.saving = false;
        });
    }
}

function getUserData(options) {
    if (!options) options = {};
    var callback = options.callback;
    var username = options.username;
    var _id = options._id;

    m.request({
        method: "GET",
        url: domain + "/api/v2/users/details?" + (_id ? ("_id=" + _id) : ("username=" + username)),
        headers: {
            Authorization: 'Bearer ' + AuthUser.data.token
        },
        config: function (xhr) {
            Profile.XHR = xhr;
        }
    }).then(function (result) {
        try {
            Profile.XHR = null;
            var user = result.data;
            if (user) {
                setTitle(user.display_name || user.username);
                ProfileInfo.user = user;
            }
            if (callback) callback();
        } catch (error) { }
    }).catch(function (error) {
        // Handle 404 User does not exist stuff here

        // if (error.code < 200 && error.code < 299) {
        //     AuthUser.logout();
        // }
    });
}

var Profile = {
    title: '',
    currentListName: 'favorites',
    oninit: function (vnode) {
        Watch.currentId = vnode.attrs.id;
        scrollToTop();
    },
    view: function (vnode) {
        setTitle(Profile.title);

        var name = ProfileInfo.user.display_name || ProfileInfo.user.username;
        var isCurrentUser = AuthUser.data._id === ProfileInfo.user._id;
        var allowProfileEdit = AuthUser.data.administrator || (AuthUser.data._id === ProfileInfo.user._id);
        var allowViewPrivate = ProfileInfo.user.private && allowProfileEdit;
        var allowSendMessage = !isCurrentUser && (!ProfileInfo.user.private || AuthUser.data.administrator || AuthUser.data.moderator);
        var allowFollow = allowSendMessage;
        var allowBadgeEdit = ProfileInfo.edit && AuthUser.data.administrator; 

        if (!ProfileInfo.user._id) return;
        return m.fragment({}, [
            m('div', { class: 'main-container flex-margin-reset extend-padding' }, [
                m('div', { class: 'club-content-container bottom-divider' + (ProfileInfo.saving ? ' saving' : '') }, [
                    ProfileInfo.edit ? m('div', { class: 'club-cover-img edit' }, [
                        m('input', { title: 'Drag & Drop image or click here', type: 'file', accept: 'image/*', onchange: function(e) { uploadImg(e, { object: ProfileInfo.update, key: 'cover_pic' }) } }),
                        m('div', m('i', { class: 'icon-camera' })),
                        m('div', 'Upload')
                    ]) : undefined,
                    m('div', { class: 'club-cover-img', onclick: openMediaViewer, style: convertObjToStyles({ backgroundImage: 'url(' + (ProfileInfo.edit && ProfileInfo.update.cover_pic ? ProfileInfo.update.cover_pic : ProfileInfo.user.cover_pic) + ')' }) }),
                    m('div', { class: 'club-header-container' }, [
                        ProfileInfo.edit ? m('div', { class: 'club-icon-img edit' }, [
                            m('input', { title: 'Drag & Drop image or click here', type: 'file', accept: 'image/*', onchange: function(e) { uploadImg(e, { object: ProfileInfo.update, key: 'profile_pic' }) } }),
                            m('div', m('i', { class: 'icon-camera' })),
                            m('div', 'Upload')
                        ]) : undefined,
                        m('div', { class: 'club-icon-img', onclick: openMediaViewer, style: convertObjToStyles({ backgroundImage: 'url(' + (ProfileInfo.edit && ProfileInfo.update.profile_pic ? ProfileInfo.update.profile_pic : ProfileInfo.user.profile_pic) + ')' }) }),
                        m('div', { class: 'club-info-container' + (ProfileInfo.edit ? ' edit' : '') }, [
                            m('div', { class: 'club-header-title' }, [
                                m('div', { class: 'club-item-wrapper' + (ProfileInfo.edit ? ' edit' : '') }, [
                                    ProfileInfo.edit ? m('i', { class: 'icon-user-circle' }) : undefined,
                                    ProfileInfo.edit ? m('input', { type: 'text', name: 'display_name', placeholder: 'Display Name', autocomplete: 'off', value: ProfileInfo.update.display_name !== undefined ? ProfileInfo.update.display_name : ProfileInfo.user.display_name, onchange: setProfileUpdateValue }) : name,
                                ]),
                                m('label', [
                                    allowBadgeEdit ? m('input', { type: 'checkbox', name: 'verified', checked: ProfileInfo.update.verified !== undefined ? ProfileInfo.update.verified : ProfileInfo.user.verified, onchange: setProfileUpdateValue }) : undefined,
                                    allowBadgeEdit || (!ProfileInfo.edit && ProfileInfo.user.verified) ? m('div', { class: allowBadgeEdit ? 'checkable' : undefined }, m('i', { class: 'post-author-badge icon-ok-circled', title: 'Verified User' })) : undefined,
                                ]),
                                m('label', [
                                    allowBadgeEdit ? m('input', { type: 'checkbox', name: 'administrator', checked: ProfileInfo.update.administrator !== undefined ? ProfileInfo.update.administrator : ProfileInfo.user.administrator, onchange: setProfileUpdateValue }) : undefined,
                                    allowBadgeEdit || (!ProfileInfo.edit && ProfileInfo.user.administrator) ? m('div', { class: allowBadgeEdit ? 'checkable' : undefined }, m('i', { class: 'post-author-badge icon-shield', title: 'Administrator' })) : undefined,
                                ]),
                                m('label', [
                                    allowBadgeEdit ? m('input', { type: 'checkbox', name: 'moderator', checked: ProfileInfo.update.moderator !== undefined ? ProfileInfo.update.moderator : ProfileInfo.user.moderator, onchange: setProfileUpdateValue }) : undefined,
                                    allowBadgeEdit || (!ProfileInfo.edit && ProfileInfo.user.moderator && !ProfileInfo.user.administrator) ? m('div', { class: allowBadgeEdit ? 'checkable' : undefined }, m('i', { class: 'post-author-badge icon-wrench', title: 'Moderator' })) : undefined,
                                ]),
                                m('label', [
                                    allowBadgeEdit ? m('input', { type: 'checkbox', name: 'supporter', checked: ProfileInfo.update.supporter !== undefined ? ProfileInfo.update.supporter : ProfileInfo.user.supporter, onchange: setProfileUpdateValue }) : undefined,
                                    allowBadgeEdit || (!ProfileInfo.edit && ProfileInfo.user.supporter) ? m('div', { class: allowBadgeEdit ? 'checkable' : undefined }, m('i', { class: 'post-author-badge icon-star', title: 'Supporter' })) : undefined,
                                ]),
                                m('label', [
                                    ProfileInfo.edit ? m('input', { type: 'checkbox', name: 'private', checked: ProfileInfo.update.private !== undefined ? ProfileInfo.update.private : ProfileInfo.user.private, onchange: setProfileUpdateValue }) : undefined,
                                    ProfileInfo.edit || ProfileInfo.user.private ? m('div', { class: ProfileInfo.edit ? 'checkable' : undefined }, m('i', { class: 'post-author-badge icon-lock', title: ProfileInfo.edit ? 'Make Profile Private' : 'Private Profile' })) : undefined,
                                ]),
                            ]),
                            m('div', { class: 'club-header-username' + (ProfileInfo.edit ? ' edit' : '')}, ProfileInfo.edit ? ['@', m('input', { type: 'text', name: 'username', placeholder: 'Username', autocomplete: 'off', value: ProfileInfo.update.username !== undefined ? ProfileInfo.update.username : ProfileInfo.user.username, onchange: setProfileUpdateValue })] : '@' + ProfileInfo.user.username),
                            m('div', { class: 'club-item-wrapper' + (ProfileInfo.edit ? ' edit' : '') }, [
                                ProfileInfo.edit ? m('i', { class: 'icon-info-circled' }) : undefined,
                                ProfileInfo.edit ? m('textarea', { name: 'biography', placeholder: 'Biography', maxlength: '258', value: ProfileInfo.update.biography !== undefined ? ProfileInfo.update.biography : ProfileInfo.user.biography, onchange: setProfileUpdateValue, oncreate: addTextExpandEvent, onremove: removeTextExpandEvent }) : m('div', { class: 'club-header-description' + (vnode.state.extendInfo ? ' extended-info' : '') }, ProfileInfo.user.biography),
                                !ProfileInfo.edit ? m('div', { class: 'club-header-date-created' + (vnode.state.extendInfo ? ' extended-info' : '') }, 'Joined ' + (new Date(ProfileInfo.user.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))) : undefined
                            ]),
                            ProfileInfo.edit ? m('div', { class: 'club-item-wrapper' + (ProfileInfo.edit ? ' edit' : '') }, [
                                m('i', { class: 'icon-key' }),
                                m('input', { type: 'password', placeholder: 'Password', name: 'password', autocomplete: 'off', value: ProfileInfo.update.password, onchange: setProfileUpdateValue })
                            ]) : undefined
                        ]),
                        m('div', { class: 'club-action-buttons' }, [
                            ProfileInfo.edit ? m('button', { title: 'Confirm Changes', onclick: updateUserData }, m('i', { class: 'icon-ok-circled' })) : undefined,
                            allowProfileEdit ? m('button', { class: 'pseudo', title: ProfileInfo.edit ? 'Cancel' : 'Edit Profile', onclick: function () { ProfileInfo.edit = !ProfileInfo.edit; } }, m('i', { class: ProfileInfo.edit ? 'icon-cancel-circled' : 'icon-cog' })) : undefined,
                            !ProfileInfo.edit ? m.fragment({}, [
                                m('button', { class: 'pseudo view-info', title: 'View More Info', onclick: function () { vnode.state.extendInfo = !vnode.state.extendInfo; } }, m('i', { class: 'icon-info-circled' })),
                                allowFollow ? m('button', { class: 'pseudo', title: 'Follow ' + name }, 'Follow') : undefined,
                                allowSendMessage ? m('button', { class: 'pseudo', title: 'Message ' + name }, m('i', { class: 'icon-comment' })) : undefined,
                                isCurrentUser ? m('button', { title: 'Create New Post' }, m('i', { class: 'icon-edit' })) : undefined
                            ]) : undefined
                        ])
                    ])
                ]),
                m('div', { class: 'list-switch-buttons animated fadeIn' }, [
                    allowViewPrivate ? m('div', { class: 'club-private-profile-msg' }, [
                        m('i', { class: 'icon-lock' }),
                        'Only you can see this'
                    ]) : undefined,
                    m('button', { class: Profile.currentListName === 'posts' ? 'active' : undefined, onclick: function(e) {switchList(e, Profile);} }, [m('i'), 'Posts']),
                    m('button', { class: Profile.currentListName === 'favorites' ? 'active' : undefined, onclick: function(e) {switchList(e, Profile);} }, [m('i'), 'Favorites']),
                    m('button', { class: Profile.currentListName === 'watch_list' ? 'active' : undefined, onclick: function(e) {switchList(e, Profile);} }, [m('i'), 'Watch List'])
                ]),
                Profile.currentListName === 'watch_list' ? m(WatchListFeed) : Profile.currentListName === 'favorites' ? m(FavoritesFeed) : m(ProfileFeed)
            ])
        ]);
    },
    oncreate: function (vnode, callback) {
        setTitle("WonderfulSubs", true);
        scrollToTop();
        
        var username = vnode.attrs.id;
        getUserData({ username: username, callback: callback });
    },
    onupdate: function(vnode) {
        if (ProfileInfo.edit === false) ProfileInfo.update = {};
        animatePageUpdate(vnode, Profile);
    }
};