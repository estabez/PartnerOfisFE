import {
    SET_LANG,
    SET_AUTH_USER,
    SET_MAXIMIZE,
    SET_REGIONS, SET_REGION, SET_RADIO_SITES, SET_RADIO_SITE,
    SET_TOKEN, SET_COMPANY, MODAL_TOGGLE, MODAL_TITLE, MODAL_IMPORT_TOGGLE,
    SET_TOPOLOGY_FIRST_LEVEL, SET_TOPOLOGY_SECOND_LEVEL,
    EDIT_ON_TOGGLE, SPINNER_TOGGLE, MODAL_EXPORT_TOGGLE,
    SET_TOPOLOGY_SECOND_LEVEL_DROPDOWN_LABELS, IMPORT_POLLING, SHOW_REVISION
}
    from '../actions'

const initialState = {
    language: null,
    lang: 'en', // default language
    maximize: false,
    contentCSS: 'col-12 content', // default content area css
    token: null,
    company: null,
    modalToggle: false,
    editOn: false,
    spinnerToggle: false,
    importPolling: true,
    showRevision: false,
    tooltipPlacement: "top",
    topologyFirstLevel: null,
    topologySecondLevel: null,
    topologySecondLevelDropdownLabels: null,
    topologySelectedNodeFontSize: 18 // selectedNode font size default is 13
};

const reducers = (state = initialState, action) =>  {

    switch (action.type) {

        case SET_LANG: {
            const {langFile, lang} = action.payload;
            return {...state, ...{language: langFile, lang: lang}}
        }
        case SET_AUTH_USER: {
            if (action.user !== null) {
                localStorage.setItem('user', action.user.name);
            } else {
                localStorage.removeItem('user');
            }
            return {...state, ...{user: action.user}}
        }
        case SET_TOKEN: {
            if (action.token !== null) {
                localStorage.setItem('e2eToken', action.token);
            } else {
                localStorage.removeItem('e2eToken');
            }
            return {...state, ...{token: action.token}}
        }
        case SET_COMPANY: {
            if (action.company !== null) {
                localStorage.setItem('Company', action.company);
            } else {
                localStorage.removeItem('Company');
            }
            return {...state, ...{company: action.company}}
        }
        case SET_REGIONS: {
            return {...state, ...{regions: action.regions}}
        }
        case SET_REGION: {
            return {...state, ...{region: action.region}}
        }
        case SET_RADIO_SITES: {
            return {...state, ...{radioSites: action.radioSites}}
        }
        case SET_RADIO_SITE: {
            return {...state, ...{radioSite: action.radioSite}}
        }
        case SET_MAXIMIZE: {
            const newValue = !state.maximize;
            const contentCSS = newValue ? 'col-12 maximized' : initialState.contentCSS;
            const tooltipPlacement = newValue ? 'bottom' : 'top';
            return {...state, ...{maximize: newValue, contentCSS, tooltipPlacement}}
        }
        case MODAL_TOGGLE: {
            return {...state, ...{modalToggle: !state.modalToggle}}
        }
        case MODAL_TITLE: {
            return {...state, ...{modalTitle: action.title}}
        }
        case MODAL_IMPORT_TOGGLE: {
            return {...state, ...{modalImportToggle: !state.modalImportToggle}}
        }
        case MODAL_EXPORT_TOGGLE: {
            return {...state, ...{modalExportToggle: !state.modalExportToggle}}
        }
        case SPINNER_TOGGLE: {
            return {...state, ...{spinnerToggle: !state.spinnerToggle}}
        }
        case SET_TOPOLOGY_FIRST_LEVEL: {
            const {data} = action.payload;
            return {...state, ...{topologyFirstLevel: data}}
        }
        case SET_TOPOLOGY_SECOND_LEVEL: {
            const {data} = action.payload;
            return {...state, ...{topologySecondLevel: data}}
        }
        case SET_TOPOLOGY_SECOND_LEVEL_DROPDOWN_LABELS: {
            const {data} = action.payload;
            return {...state, ...{topologySecondLevelDropdownLabels: data}}
        }
        case EDIT_ON_TOGGLE: {
            return {...state, ...{editOn: !state.editOn}}
        }
        case IMPORT_POLLING: {
            return {...state, ...{importPolling: action.data}}
        }
        case SHOW_REVISION: {
            return {...state, ...{showRevision: !state.showRevision}}
        }
        default: return state;
    }
} 

export default reducers