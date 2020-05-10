function showHideSettingsPanel() {
    var outAnimation = 'fadeOutRight';
    if (settingsPanelElem.classList.contains('none')) {
        settingsPanelElem.classList.remove('none');
    } else if (settingsPanelElem.classList.contains(outAnimation)) {
        // m.redraw();
        settingsPanelElem.classList.remove(outAnimation);
    } else {
        settingsPanelElem.classList.add(outAnimation);
    }
}

function SettingsPanel() {
    function keyEvents(e) {
        if (!(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
            e.preventDefault();
            switch (e.key) {
                case "e":
                    showHideSettingsPanel();
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
            return m('div', [
                m('div', { class: 'user-panel-profile' }, [
                    m('span', { class: 'left' }, 'Settings'),
                    m('div', { class: 'pointer right' }, m('i', { class: 'icon-cancel-circled' })),
                ]),
                m('div', { class: 'settings-option-container flex two' }, [
                    m('button', { class: 'settings-option', onclick: function (e) { preventAndStop(e, switchTheme); } }, [
                        m('i', { class: 'icon-color-adjust' }),
                        'Change Theme'
                    ])
                ])
            ]);
        }
    };
}

var settingsPanelElem;
document.addEventListener('DOMContentLoaded', function () {
    settingsPanelElem = document.getElementById('settings-panel');
    settingsPanelElem.onclick = showHideSettingsPanel;
    m.mount(settingsPanelElem, SettingsPanel);
});