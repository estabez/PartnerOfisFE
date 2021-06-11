// CONSTS
export const SET_LANG = 'SET_LANG';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_MAXIMIZE = 'SET_MAXIMIZE';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_COMPANY = 'SET_COMPANY';
export const SET_ORDER = 'SET_ORDER';
export const SET_ORDERID = 'SET_ORDERID';
export const SET_CANCEL_STATUS = 'SET_CANCEL_STATUS';
export const SET_REGIONS = 'SET_REGIONS';
export const SET_REGION = 'SET_REGION';
export const SET_RADIO_SITES = 'SET_RADIO_SITES';
export const SET_RADIO_SITE = 'SET_RADIO_SITE';

// MODAL CONSTS
export const MODAL_TOGGLE = 'MODAL_TOGGLE';
export const MODAL_TITLE = 'MODAL_TITLE';

// MODAL IMPORT CONSTS
export const MODAL_IMPORT_TOGGLE = 'MODAL_IMPORT_TOGGLE';

// SPINNER CONSTS
export const SPINNER_TOGGLE = 'SPINNER_TOGGLE';

// MODAL Export CONSTS
export const MODAL_EXPORT_TOGGLE = 'MODAL_EXPORT_TOGGLE';

export const MODAL_CANCEL_TOGGLE = 'MODAL_CANCEL_TOGGLE';

export const MODAL_SEVKIYAT_TOGGLE = 'MODAL_SEVKIYAT_TOGGLE';

export const MODAL_SEVKIYAT_CANCEL_TOGGLE = 'MODAL_SEVKIYAT_CANCEL_TOGGLE';


//EXCEL TO JSON CONSTS
export const HANDLE_FILE = 'HANDLE_FILE';

// TOPOLOGY CONSTS
export const SET_TOPOLOGY_FIRST_LEVEL = 'SET_TOPOLOGY_FIRST_LEVEL';
export const SET_TOPOLOGY_SECOND_LEVEL = 'SET_TOPOLOGY_SECOND_LEVEL';
export const SET_TOPOLOGY_SECOND_LEVEL_DROPDOWN_LABELS = 'SET_TOPOLOGY_SECOND_LEVEL_DROPDOWN_LABELS';

// EDIT ON HANDSONTABLE
export const EDIT_ON_TOGGLE = "EDIT_ON_TOGGLE";

//SET IMPORT POLLING
export const IMPORT_POLLING = 'IMPORT_POLLING';

// SHOW REVISION DATA
export const SHOW_REVISION = "SHOW_REVISION";

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

export const setCompany = (company) => ({
    type: SET_COMPANY,
    company
});

export const setOrder = (order) => ({
    type: SET_ORDER,
    order
});

export const setOrderID = (orderId) => ({
    type: SET_ORDERID,
    orderId
});

export const setCancelStatus = (cancelStatus) => ({
    type: SET_CANCEL_STATUS,
    cancelStatus
});

// set user regions into redux
export const setRegions = (regions) => ({
    type: SET_REGIONS,
    regions
});

// set selected region from selection component
export const setSelectedRegion = (region) => ({
    type: SET_REGION,
    region
});

// set region's radio sites into redux
export const setRadioSites = (radioSites) => ({
    type: SET_RADIO_SITES,
    radioSites
});

// set selected radio site from selection component
export const setSelectedRadioSite = (radioSite) => ({
    type: SET_RADIO_SITE,
    radioSite
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

export const modalCancelToggle = () => ({
    type: MODAL_CANCEL_TOGGLE
});

export const modalSevkiyatToggle = () => ({
    type: MODAL_SEVKIYAT_TOGGLE
});

export const modalSevkiyatCancelToggle = () => ({
    type: MODAL_SEVKIYAT_CANCEL_TOGGLE
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

// Topology diagram second level dropdown labels, this is only need for ran topology second level
export const setTopologySecondLevelDropdownLabels = (data) => ({
    type: SET_TOPOLOGY_SECOND_LEVEL_DROPDOWN_LABELS,
    payload: {
        data
    }
});

// Edit mode flag on handsontable
export const editOnToggle = () => ({
    type: EDIT_ON_TOGGLE
});

// Set import polling redux
export const setImportPolling = (data) => ({
    type: IMPORT_POLLING,
    data
})

// Set show revision flag
export const setShowRevision = () => ({
    type: SHOW_REVISION
})
