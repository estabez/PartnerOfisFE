import {
    SET_LANG,
    SET_AUTH_USER,
    SET_MAXIMIZE,
    SET_TOKEN, MODAL_TOGGLE, MODAL_TITLE, MODAL_IMPORT_TOGGLE,
    SET_TOPOLOGY_FIRST_LEVEL, SET_TOPOLOGY_SECOND_LEVEL,
    EDIT_ON_TOGGLE, SPINNER_TOGGLE, MODAL_EXPORT_TOGGLE,
    CORE_DROPDOWN
}
    from '../actions'

const initialState = {
    serverPath: process.env.REACT_APP_API_GATEWAY, // API gateway path
    language: null,
    lang: 'en', // default language
    maximize: false,
    contentCSS: 'col-11 content',
    token: null,
    modalToggle: false,
    editOn: false,
    spinnerToggle: false,
    topologyFirstLevel: null,
    topologySecondLevel: null
};

const reducers = (state = initialState, action) =>  {

    switch (action.type) {

        case SET_LANG: {
            const {langFile, lang} = action.payload;
            return {...state, ...{language: langFile, lang: lang}}

        }
        case SET_AUTH_USER: {
            if (action.user !== null) {
                localStorage.setItem('user', action.user);
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
        case SET_MAXIMIZE: {
            const newValue = !state.maximize;
            const contentCSS = newValue ? 'col-12 maximized' : initialState.contentCSS;
            return {...state, ...{maximize: newValue, contentCSS}}
        }
        case MODAL_TOGGLE: {
            return {...state, ...{modalToggle: !state.modalToggle}}
        }
        case MODAL_TITLE: {
            return {...state, ...{modalTitle: action.title}}
        }
        /*case MODAL_TITLE: {
            const {item} = action.payload;
            return {...state, ...{modalTitle: item.label}}
        }*/
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
        case CORE_DROPDOWN: {
            return {...state, ...{dropDownHandler: !state.dropDownHandler}}
        }
        case SET_TOPOLOGY_SECOND_LEVEL: {
            const {data} = action.payload;
            return {...state, ...{topologySecondLevel: data}}
        }
        case EDIT_ON_TOGGLE: {
            return {...state, ...{editOn: !state.editOn}}
        }
        default: return state;
    }
} 

export default reducers