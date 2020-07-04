var DARK_THEME_CSS = 
'a{\n\
    color:#d2d2d2\n\
}\n\
.main-container{\n\
    background-color:#212121\n\
}\n\
.result-switch button{\n\
    background-color:#000000\n\
}\n\
nav .brand{\n\
    filter:brightness(0) invert(1)\n\
}\n\
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n\
    nav .brand{\n\
        background-image: url(/svg/white_logo.svg);\n\
        background-repeat:no-repeat;\n\
        padding-top:34px;\n\
        height:34px;\n\
        width:168px\n\
    }\n\
}\n\
.nav-menu,.nav-menu-content{\n\
    background-color:#171717\n\
}\n\
body{\n\
    background-color:#212121;\n\
    color:#fff\n\
}\n\
.nav-buttons a,.nav-buttons button{\n\
    color:#fff\n\
}\n\
.nav-search input{\n\
    background-color:rgba(255,255,255,.15);\n\
    color:#fff\n\
}\n\
.nav-search i{\n\
    color:#fff\n\
}\n\
.list-switch-buttons button{\n\
    border:solid 1px #424242\n\
}\n\
.poster-header{\n\
    color:#fff\n\
}\n\
.poster-item{\n\
    box-shadow:none\n\
}\n\
.post-item,.post-actions>*,.post-show-more-less,.poster-item .poster-title{\n\
    background-color:#424242;\n\
    color:#fff\n\
}\n\
.poster-item .poster-language{\n\
    background-color:#717171\n\
}\n\
.poster-item .poster-watch-later{\n\
    background-color:#000\n\
}\n\
.poster-item .poster-favorite{\n\
    background-color:#151515\n\
}\n\
.left-divider,.right-divider,.top-divider,.bottom-divider{\n\
    border-color:rgba(189,189,189,0.2)\n\
}\n\
.post-actions>*:hover{\n\
    background-color:#484848\n\
}\n\
.panel-body{\n\
    background-color:rgba(0,0,0,.75)\n\
}\n\
.button,.label,.select select:focus,[data-tooltip]:after,[type=checkbox]+.checkable:hover:before,[type=checkbox]:focus+.checkable:before,[type=radio]+.checkable:hover:before,[type=radio]:focus+.checkable:before,[type=submit],button,select:active,select:focus,th{\n\
    background-color:#424242\n\
}\n\
[type=checkbox]:checked+.checkable:after{\n\
    color: #ffffff\n\
}\n\
@media only screen and (max-width:767px){\n\
    .dropbtn.subdrop+div.dropdown-content{\n\
        border:2px #ffffff solid\n\
    }\n\
    .dropdown-content a:hover{\n\
        color:#000000\n\
    }\n\
    .dropdown-content,.dropbtn.subdrop:hover+div.dropdown-content,.dropbtn.subdrop+div.dropdown-content:hover,.dropdown-content a,.dropbtn.subdrop,.dropbtn.subdrop+div.dropdown-content a{\n\
        background-color:#000000;\n\
        color:#ffffff;\n\
        transition:none\n\
    }\n\
}\n\
.club-content-container{\n\
    background-color:transparent\n\
}\n\
.club-action-buttons>button{\n\
    border-color:#ffffff\n\
}'.replace(/\n^\s*/gm, '');

window.DARK_THEME_STYLES = m('style', DARK_THEME_CSS);
if (getStorage('dark_theme') === true) switchTheme();
m.redraw();
