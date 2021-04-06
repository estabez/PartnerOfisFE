// CONSTS
export const SET_LANG = 'SET_LANG';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_MAXIMIZE = 'SET_MAXIMIZE';
export const SET_TOKEN = 'SET_TOKEN';

// MODAL CONSTS
export const MODAL_TOGGLE = 'MODAL_TOGGLE';
export const MODAL_TITLE = 'MODAL_TITLE';

// MODAL IMPORT CONSTS
export const MODAL_IMPORT_TOGGLE = 'MODAL_IMPORT_TOGGLE';

// SPINNER CONSTS
export const SPINNER_TOGGLE = 'SPINNER_TOGGLE';

// MODAL Export CONSTS
export const MODAL_EXPORT_TOGGLE = 'MODAL_EXPORT_TOGGLE';

// CORE_DROPDOWN
export const CORE_DROPDOWN = 'CORE_DROPDOWN';

//EXCEL TO JSON CONSTS
export const HANDLE_FILE = 'HANDLE_FILE';

// TOPOLOGY CONSTS
export const SET_TOPOLOGY_FIRST_LEVEL = 'SET_TOPOLOGY_FIRST_LEVEL';
export const SET_TOPOLOGY_SECOND_LEVEL = 'SET_TOPOLOGY_SECOND_LEVEL';


// EDIT ON HANDSONTABLE
export const EDIT_ON_TOGGLE = "EDIT_ON_TOGGLE";


// Language settings
export const setLang = (langFile, lang) => ({
    type: SET_LANG,
    payload: {
        langFile,
        lang
    }
});

// Save the authenticated user data into redux
export const setAuthUser = (user) => ({
    type: SET_AUTH_USER,
    user
});

// Save provided web token from server
export const setToken = (token) => ({
    type: SET_TOKEN,
    token
});

// Maximizing setting for content and toolbar
export const setMaximize = () => ({
    type: SET_MAXIMIZE
});

// Show second level topology diagram in modal window for ran
// modalToggle first state is false, modal will show if this value change to true.
export const modalToggle = () => ({
    type: MODAL_TOGGLE
});

// Set the modal window title
export const modalTitle = (title) => ({
    type: MODAL_TITLE,
    title
});

//Modal IMport toggle
export const modalImportToggle = () => ({
    type: MODAL_IMPORT_TOGGLE
});

//Modal Export toggle
export const modalExportToggle = () => ({
    type: MODAL_EXPORT_TOGGLE
});

//Modal Export toggle
export const dropDownHandler = () => ({
    type: CORE_DROPDOWN
});

//Spinner toggle
export const spinnerToggle = () => ({
    type:SPINNER_TOGGLE
});


//Excel to JSON handler
export const handleFile = () => ({
    type: HANDLE_FILE
});

// Topology diagram default state graph data
export const setTopologyFirstLevel = (data) => ({
    type: SET_TOPOLOGY_FIRST_LEVEL,
    payload: {
        data
    }
});

// Topology diagram second state graph data. This is only need for ran topology
export const setTopologySecondLevel = (data) => ({
    type: SET_TOPOLOGY_SECOND_LEVEL,
    payload: {
        data
    }
});

// Edit mode flag on handsontable
export const editOnToggle = () => ({
    type: EDIT_ON_TOGGLE
});
