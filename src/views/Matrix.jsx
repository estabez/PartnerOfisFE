import React, {createRef} from 'react';
import {connect} from "react-redux";
import {Row, Col, Card, CardBody, CardFooter} from 'reactstrap';

import {HotTable} from '@handsontable/react';
import Handsontable from 'handsontable';
import {groupingMap} from '../matrixDataMap';
import {columnLogic} from '../matrixColumnLogicMap';

import PaginationMatrix from "../components/Pagination"

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Toolbar from '../components/ToolbarMatrix';
import ModalImport from '../components/ModalImport';
import Spinner from '../components/Spinner';
import EmptyDataset from '../components/EmptyDataset';

import {editOnToggle, spinnerToggle} from "../redux/actions";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// For export File
import XLSX from 'xlsx'
import {saveAs} from 'file-saver';

// Rest api module import
import RestApiModule from '../RestApiModule'

// Alert module
import AlertModule from '../AlertModule'

class Matrix extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.restApi = new RestApiModule();
        this.alert = new AlertModule();

        this.hotTableComponent = createRef();
        this.hot = null;
        this.handsontableData = null;
        this.handsontableDataBackup = null;

        this.errorMessages = null;
        this.errorBoxTitle = null;
        this.columnHeaders = [];
        this.titles = [];
        this.columns = [];
        this.handleColumnHeaders();

        this.selectedRowCoords = {r: null, c: null};
        this.editedRowCoords = {r: null, c: null};
        this.validatedCell = {r: null, c: null};
        this.rowValidation = true;
        this.filter = null;
        this.mandatoryColumns = null;
        this.isDuplicate = false;
        this.submitProcessFail = false;


        //this.itemPerPage = +process.env.REACT_APP_MATRIX_ITEM_PER_PAGE;
        this.state = {
            isDataExistsInDB: false,
            newRowAdded: false,
            activePage: 1,
            itemPerPage: +process.env.REACT_APP_MATRIX_ITEM_PER_PAGE,
            totalCountOfData: 0,
            exportDataAsExcelFile: null
        };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.user) {

            // get mandatory columns from map file
            this.mandatoryColumns = this.mandatoryColumnExtractor();

            this.setStateAsync({permittedColumns: this.props.user.role.permittedColumns});
            this.hot = this.hotTableComponent.current.hotInstance;

            this.dataLoad();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    calculatePagination(total) {

        if (total) {
            const pageCount = +total / this.state.itemPerPage;
            this.setStateAsync({totalCountOfData: total, pageCount})
        }
    }

    dataCountOfSelectedRegion() {

        const {token, region, radioSite} = this.props;

        if (region) {
            this.restApi.callApi('getMatrixDataCount', {
                token,
                region,
                radioSite
            }).then(response => {
                this.calculatePagination(response.ConnectivityCount[0].Count)
            })
        }
    }

    async dataLoad(filterChanged) {

        if (this._isMounted) {
            const {token, region, radioSite} = this.props;

            // that means filtered options changed, so we reset the activePage number to 1
            if (filterChanged) {

                this.setStateAsync({
                    activePage: 1,
                    itemPerPage: (filterChanged === "radioSite") ? 100 : +process.env.REACT_APP_MATRIX_ITEM_PER_PAGE
                });
            }

            if (region) {
                this.props.setSpinner();

                // get count of data
                await this.dataCountOfSelectedRegion()

                //reset selected row data
                this.resetSelectedRow()

                this.restApi.callApi('getMatrixData', {
                    token,
                    region,
                    radioSite,
                    count: this.state.itemPerPage.toString(),
                    page_index: this.state.activePage.toString()
                }).then(async (response) => {
                    //console.log(response)

                    // mock test
                    //response.exec_status = "error";

                    const {ConnectivityMatrix, exec_status} = response;

                    // If data doesnt exist in EAI DB we should set a flag to manage toolbar actions
                    if (exec_status === "success" &&
                        ConnectivityMatrix.length > 0) {

                        this.setStateAsync({isDataExistsInDB: true});

                        this.handsontableData = ConnectivityMatrix; // store the copy of data
                        this.hot.loadData(this.handsontableData);

                        this.paginationRowNumbers();

                        /* Filter for show active rows only*/
                        this.filter = this.hot.getPlugin('filters');

                        await this.revisionRowFilter();

                    } else {

                        this.setStateAsync({isDataExistsInDB: false});
                    }

                    // remove spinner from screen
                    this.props.setSpinner();

                }).catch(err => {
                    // err state. If need we can give message to user.
                    // Error handling is managed by RestApiModule.
                    // We don't need to do extra development in here

                    // Somehow if this block executed, we can only change the flag to false.
                    this.setStateAsync({isDataExistsInDB: false});

                    // remove spinner from screen
                    this.props.setSpinner();
                })
            }
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async handlePageChange(pageNumber) {
        //console.log(pageNumber);
        // TODO: call api to retrieve data for matrix page
        // data will provided by page number
        await this.setStateAsync({activePage: pageNumber});
        this.dataLoad();
    }

    paginationRowNumbers() {
        // break the handsontable row headers mechanism to show to user exact row numbers while paginating
        const {activePage, itemPerPage} = this.state;

        const startPoint =((activePage - 1) * itemPerPage) + 1;
        const newNumbers = Array.from(Array(itemPerPage), (_, i) => startPoint + i)

        this.hot.updateSettings({
            rowHeaders: newNumbers
        })
    }

    isRowCanBeEditable(r, restriction) {

        const etatRule = this.ruleExtractor("etatCheckValue");
        const archivedRule = this.ruleExtractor("archivedCheckValue");
        const etatDataAtCell = this.hot.getDataAtRowProp(r, "etat");
        const archivedDataAtCell = this.hot.getDataAtRowProp(r, "archived");

        const checkEtatValue = etatRule.isValue.includes(etatDataAtCell)
        const checkArchivedValue = archivedRule.isValue.includes(archivedDataAtCell)

        const response = (checkEtatValue && checkArchivedValue);

        if (!response) {
            const {language} = this.props;
            let message, title = "";

            switch (restriction) {
                case 'Lock' : title = language.lockModeRestrictionTitle; message = language.lockModeRestriction; break;
                case 'Edit' :
                default : title = language.editModeRestrictionTitle; message = language.editModeRestriction; break;
            }
            this.alert.showMessage("warning", title, message, false);
        }

        return response;
    }

    // click event handle for edit button
    handleEditClick() {

        const {r, c} = this.selectedRowCoords;
        if (r === null && c === null) return;

        if (this.isRowCanBeEditable(r)) {

            // Lock mechanism controls
            const dto = this.prepareDTOforLockMechanism(r, false);

            this.restApi.callApi('lock', dto).then(response => {
                const json = response.resultLock;
                const {user} = this.props;

                // can I continue to edit ?
                const continueToEdit = json.islock && json.uname === user.name;

                if (continueToEdit) {

                    // create backup data before editing;
                    this.handsontableDataBackup = JSON.parse(JSON.stringify(this.handsontableData));

                    // Change edit mode on redux
                    this.props.setEdit();

                    this.setCellProperties(r, c);
                    this.editedRowCoords.r = r;
                    this.editedRowCoords.c = c;

                } else {
                    this.showMessageForLockMechanism(true, json)
                }
            })

        }
    }

    // click handle for add new row
    async handleNewRowClick() {

        await this.setStateAsync({newRowAdded : true});
        this.editedRowCoords.r = 0;
        this.editedRowCoords.c = 0;
        this.isDuplicate = false;

        // create backup data before editing;
        this.handsontableDataBackup = JSON.parse(JSON.stringify(this.handsontableData));

        this.props.setEdit();
        this.hot.alter('insert_row', 0, 1);
        this.setCellProperties(0, null);

        // set initial value for newly adding rows
        if (this.state.newRowAdded && !this.isDuplicate) {
            this.setInitialValueOfColumn();
        }
    }

    async handleDuplicateRowClick() {

        const {r, c} = this.selectedRowCoords;
        if (r === null && c === null) return;

        // get existing data at row
        const data = this.hot.getDataAtRow(r);

        this.isDuplicate = true;
        await this.handleNewRowClick();

        // find radio Site column for special case. we need empty radio site for duplicated row
        const radioSiteColumnIndex = this.findIndexOfColumn(0,'radioSite');
        const lockStatusColumnIndex = this.findIndexOfColumn(0,'LOCK_STATUS');
        const lockUserColumnIndex = this.findIndexOfColumn(0,'USER_NAME');
        const lockTimeColumnIndex = this.findIndexOfColumn(0,'LOCK_TIME');

        const passThisColumns = [
            radioSiteColumnIndex,
            lockStatusColumnIndex,
            lockUserColumnIndex,
            lockTimeColumnIndex]

        // get column count for iteration
        const colCount = this.hot.countCols();

        // iterate the columns
        for (let x = 0; x <= colCount; x++) {

            // if column is this list, pass it, data will not copy from exist row
            if (x in passThisColumns) continue;

            // set data
            this.hot.setDataAtCell(0, x, data[x])
        }
    }

    handleCancelClick() {

        if (!this.state.newRowAdded) {

            const {r, c} = this.editedRowCoords;
            if (r === null && c === null) return;

            // Lock mechanism controls
            const dto = this.prepareDTOforLockMechanism(r, false);

            // In all circumstances call implicit unlock
            this.restApi.callApi('unlock', dto);
        }
        this.setStateAsync({newRowAdded : false}).then(() => {
            this.cancelEdit();
        });
    }

    handleSaveClick() {
        this.saveAction();
    }

    handleSaveHistoryClick() {
        this.saveAction(true)
    }

    checkIsRadioSiteExists(token, radioSite) {

        return new Promise((res, rej) => {

            const {language} = this.props;

            // if the save action doing on new row add we should check if radio site is exists
            // then we need to show message to the user to continue or not.
            this.restApi.callApi('isRadioSiteExists', {
                token,
                radioSite
            }).then(radioResponse => {

                if (radioResponse.isExist === true) {

                    // get confirmation from user to continue
                    this.alert.getConfirmation(
                        "warning",
                        language.radioSiteExistsWithSameNameTitle,
                        language.radioSiteExistsWithSameNameText
                    ).then(confirmation => {
                        res({
                            confirmation,
                            isExists: radioResponse.isExist
                        })
                    })
                } else {
                    // if radio site not exist we should return false
                    res({
                        confirmation: null,
                        isExists: radioResponse.isExist
                    })
                }
            }).catch(err => {
                rej(err)
            })

        })
    }

    // save action for row edited or new
    saveAction(revision) {

        const {language, token} = this.props;
        const isRevision = revision ? revision : false;

        this.restApi.callApi('getImportStatus', {
            token
        }).then(importStatusResponse => {

            const {isImportOngoing} = importStatusResponse;
            const {r, c} = this.editedRowCoords;


            if (!isImportOngoing.isLock) {
                // there isn't an import action ongoing

                if (this.rowValidation) {

                    if (r !== null || r !== undefined) {
                        // data would send to API
                        let data = this.hot.getDataAtRow(r);

                        data = this.columns.reduce((newRowData, item, index) => {

                            Object.assign(newRowData,
                                (data[index] !== null)
                                    ? {[item.data]: data[index]}
                                    : {[item.data]: ""}
                            );
                            return newRowData;
                        }, {});

                        const mandatoryColumnsFilled = this.checkMandatoryColumnsFilled(data);

                        if (mandatoryColumnsFilled) {

                            const { newRowAdded: isNewRow} = this.state;

                            // radio Site exists check
                            if (isNewRow) {

                                this.checkIsRadioSiteExists(token, data['radioSite'])
                                    .then(isExistsResponse => {

                                        const confirm = isExistsResponse.confirmation;
                                        if (confirm || confirm === null){
                                            // it means, user didn't click cancel on messagebox.
                                            // confirm = null means there isnt exist radio site in db
                                            this.saveIt(token, data, isNewRow, isExistsResponse.isExists, r, c)
                                        }
                                });

                            } else {

                                this.saveIt(token, data, isNewRow, isRevision, r, c)
                            }

                        } else {

                            const title = language.mandatoryDataTitle;
                            let text = language.mandatoryDataText;

                            text = text.replace("{columns}", this.mandatoryColumns.join(',<br>'));

                            this.alert.showMessage("error", title, text, false);
                        }
                    }

                } else {

                    const {language} = this.props;
                    this.alert.showMessage("error",
                        language.validationMessageBoxTitle,
                        language.validationErrorGeneralMessage,
                        false)
                }

            } else {
                const message = language.importSection.ongoingImportText.replace('{username}', isImportOngoing.uname);

                this.alert.showMessage(
                    'warning',
                    language.importSection.ongoingImportTitle,
                    message,
                    false)

                // import is ongoing we need to reload the data
                this.resetRow(r);
                this.props.setEdit();
                this.dataLoad();
            }
        })
    }

    saveIt(token, row, isNewRow, isRevision, r, c) {

        const {setSpinner, setEdit} = this.props;

        setSpinner();

        // Call backend to save row
        this.restApi.callApi("saveRow", {
            token,
            row,
            isNewRow,
            isRevision
        }).
        then(response => {

            const {language} = this.props;

            const {processed, log} = response.result;

            const message = log.split('\n').join('<br>');

            setSpinner();

            if (processed) {
                this.alert.showMessage("success",
                    language.saveActionSuccessTitle,
                    message,
                    false
                )

                this.selectedRowCoords.c = c;
                this.selectedRowCoords.r = r;
                this.editedRowCoords.r = null;
                this.editedRowCoords.c = null;

                // Reset new row state if its true
                if (this.state.newRowAdded)
                    this.setState({ newRowAdded : false});

                setEdit(); // set it's not edit mode anymore
                this.resetRow(r); // this method will return the edit view to normal
                this.dataLoad(); // load the data again from db.

            } else {
                // something not suitable for BE,
                // FE just showing a message to user.
                this.alert.showMessage("error",
                    language.saveActionFailTitle,
                    message,
                    false
                )

                // this will make the row re-editable if get error from backend
                this.setCellProperties(r, c);

            }
        }).catch(() => {
            // we have unexpected error from BE
            // Stopping edit mode, stop everything, back to one step previous
            setSpinner();
            //this.cancelEdit();
            //this.resetRow(r);
        })
    }

    async revisionRowFilter() {
        if (this._isMounted) {
            const colIndex = this.findIndexOfColumn(0,'archived');
            const {showRevision} = this.props;

            const arg = showRevision ? '' : 'NO'; // this param is for filtering on handsontable

            if (showRevision) {
                this.filter.removeConditions(colIndex);
            } else {
                this.filter.addCondition(colIndex, 'contains', arg);
            }
            await this.filter.filter();
        }
    }

    setCellProperties(r, c) {

        const colCount = this.hot.countCols();
        let col = c !== null ? c : 0;

        for (let x = 0; x <= colCount; x++) {
            const {prop, readOnly, readOnlyInEditMode} = this.hot.getCellMeta(r,x);

            if (typeof prop !== "string") continue

            // if prop has got readyOnly attribute with value "true", write permission will restricted
            // if prop hasn't got readOnly attribute it would be false by default. So we need to check if
            // this action is adding new row or editing existing row.
            // if action is editing a row then we should check readOnlyInEditMode attribute of prop.
            // if it's exist we should get opposite value because if we add this attribute to prop it value should be "true"
            // it means this property can not be writable in edit mode
            // if readOnlyInEditMode attribute is not exist in prop there isn't extra attribute checking for this cell
            // can be writable or not. So we can put "true" value to associated variable.
            const writable = readOnly ? !readOnly : !this.state.newRowAdded ? !readOnlyInEditMode : !readOnly;

            if (writable) {
                if (this.state.permittedColumns.indexOf(prop) >= 0) {

                    const type = this.hot.getDataType(r, x); // get cell type from loaded map

                    // this 2 row for initiate the rules on editing row.
                    //const value = this.hot.getDataAtCell(r, x);
                    //this.columnEvents(r, prop, value);

                    col = col === 0 ? x : col; // when add new row find first editable col.

                    this.hot.setCellMeta(r, x, "editor", type);
                    this.hot.setCellMeta(r, x, "className", 'bg-warning text-dark');
                }
            }
        }
        this.hot.render();
        this.hot.selectCell(r, col);
    }

    findIndexOfColumn(r, propName) {
        const colCount = this.hot.countCols();
        for (let c = 0; c <= colCount; c++) {
            const {prop} = this.hot.getCellMeta(r,c);
            if (prop === propName) {
                return c;
            }
        }
    }

    // Before save action mandatory columns are must be filled
    checkMandatoryColumnsFilled(rowData) {

        const checkData = this.mandatoryColumns.reduce((data, columnId) => {
            data.push(rowData[columnId]);
            return data;
        }, []);

        return checkData.every(data => {
            return data !== undefined && data !== "" && data !== null
        })
    }

    // Finished initial value setter
    setInitialValueOfColumn() {
        this.columns.map((item) => {
            if (item.hasOwnProperty('initialValue')) {
                this.hot.setDataAtRowProp(0, item.data, item.initialValue)
            }
            return true;
        })
    }

    // Finished, cancel edit return back to last backup data
    cancelEdit() {
        this.handsontableData = JSON.parse(JSON.stringify(this.handsontableDataBackup));
        this.hot.loadData(this.handsontableData);
        this.hot.render();

        // Change edit mode on redux
        this.props.setEdit();
    }

    // reset row finished
    resetRow(r) {
        const colCount = this.hot.countCols();
        for (let x = 0; x <= colCount; x++) {

            this.hot.setCellMeta(r, x, "editor", false);
            this.hot.setCellMeta(r, x, "className", 'bg-primary text-white');
        }
        this.hot.render();
        this.setState({ newRowAdded : false});
    }

    // reset seleted rows for some reason such as change region, change active page
    resetSelectedRow() {

        this.selectedRowCoords.r = null
        this.selectedRowCoords.c = null
        this.editedRowCoords.r = null
        this.editedRowCoords.c = null
        this.validatedCell.r = null
        this.validatedCell.c = null

        this.hot.deselectCell();
    }

    // disable moves finished
    disableMoves() {
        return false;
    }

    // Finished ip validation rule
    ipValidate(value, callback) {

        const pat = /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;

        this.rowValidation = pat.test(value);
        callback(this.rowValidation);
        if (!this.rowValidation)
            this.showMessage(this.errorBoxTitle, this.errorMessages.invalidIP, true, true);
    }

    // Finished numeric value validation
    numericValidate(value, callback) {

        const pat = /^\d+$/;

        this.rowValidation = pat.test(value);
        callback(this.rowValidation);
        if (!this.rowValidation)
            this.showMessage(this.errorBoxTitle, this.errorMessages.invalidNumber, true, true);
    }

    // Finished validation message box
    showMessage(title, message, validatorClose, isMandatoryColumn) {
        confirmAlert({
            title: 'Validation Warning',
            message: message,
            closeOnEscape: false,
            closeOnClickOutside: false,
            customUI: ({ onClose }) => {

                const closeAction = () => {
                    if (validatorClose) {
                        if (isMandatoryColumn) {
                            const {r, c} = this.validatedCell;
                            this.hot.selectCell(r, c);

                            if (this.hot.getActiveEditor() !== undefined) {

                                const existingValueInCell = this.hot.getDataAtCell(r, c);

                                this.hot.getActiveEditor().beginEditing();
                                this.hot.getActiveEditor().setValue(existingValueInCell);
                            }
                        }
                        onClose();

                    } else {
                        this.cancelEdit();
                        onClose();
                    }
                }
                return (
                    <div className="card">
                        <div className="card-header">
                            {title}

                            <button type="button" className="close"
                                    onClick={closeAction}
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>

                        </div>
                        <div className="card-body">
                            <div className={'card-text text-danger'}>{message}</div>
                        </div>
                        <div className="card-footer">
                            <button className={'btn btn-warning'} onClick={closeAction}>
                                Ok
                            </button>
                        </div>
                    </div>
                );
            }
        });
    }

    // Finished column header groups
    handleColumnHeaders() {

        // Create a copy of map file
        const headerMap = JSON.parse(JSON.stringify(groupingMap));

        // Set the header groups for table
        const headerGrouping = headerMap.filter((item) => {
            item.colspan = item.columns.length;
            return typeof item.columns === "object"
        })

        // set each and every column defaults
        const cols = headerMap.map((item) => {

            return item.columns.map(c => {

                this.titles.push(c.label);

                c.color = item.color;

                c.editor = false; // default readonly

                if (typeof c.validator !== "undefined") {

                    if (c.validator === 'ipValidator') {
                        c.validator = (value, callback) => {
                            this.ipValidate(value, callback)
                        }
                    }

                    if (c.validator === 'isNumeric') {
                        c.validator = (value, callback) => {
                            this.numericValidate(value, callback)
                        }
                    }
                }

                if (typeof c.type !== "undefined") {
                    if (c.type === 'dropdown') {
                        this.setPickList(c.data).then((list) => {
                            c.source = list;
                        });
                    }
                }

                if (typeof c.rerenderer !== "undefined") {
                    c.renderer = this.iconForLockStatusInCell.bind(this);
                    delete c.rerenderer;
                }

                return c;
            });
        })
        console.log(this.columns);

        // spread the columns into single object
        cols.map((c) => {
            console.log(c);
            this.columns = [...this.columns, ...c];
        })



        // Pushing header group const to related vars
        this.columnHeaders.push(headerGrouping);
        this.columnHeaders.push(this.titles);

        console.log(this.columnHeaders);
        console.log(this.columns);
    }

    // Finished colouring header
    headerColoring(col, TH) {

        const TR = TH.parentNode;
        const THEAD = TR.parentNode;

        const b = THEAD.childNodes.length;
        const n = Array.prototype.indexOf.call(THEAD.childNodes, TR);
        const headerLevel = (-1) * b + n;

        function applyClass(elem, className) {
            if (!Handsontable.dom.hasClass(elem, className))
                Handsontable.dom.addClass(elem, className);
        }

        if (headerLevel === -1 || headerLevel === -2) {

            if (col in this.columns) {

                const {color} = this.columns[col];
                if (color) applyClass(TH, color);
            }
        }
    }

    // Finished pick list setter function
    setPickList(name) {
        return new Promise ((res, rej) => {

            const value = `${name}Picklist_value`;
            const key = `${name}Picklist`;

            this.restApi.callApi('getPickList', {
                token: this.props.token,
                pickListName: key

            }).then((response) => {

                if (response.pickList.length > 0) {
                     const list = response.pickList.map((item) => {
                        return item[value];
                    })
                    res(list)
                }
            }).catch((error) => {
                console.log(error)
            });
        })
    }

    // Read the rule from imported rule file
    mandatoryColumnExtractor() {
        return groupingMap.reduce((fullArr, item) => {
            const cols = item.columns.reduce((arr, col) => {
                if (col.mandatory) arr.push(col.data)
                return arr;
            }, []);
            return [...fullArr, ...cols]
        }, [])
    }

    // Read the rule from imported rule file
    ruleExtractor(columnId) {
        return columnLogic.find((item) => {
            return item.id === columnId;
        })
    }

    // Generic attributes validations and rule runner
    async columnEvents(r, c, newV) {

        this.validatedCell.r = r;
        this.validatedCell.c = c;

        const properties = this.ruleExtractor(c);
        if (properties) {
            const {methodCaller, rules, executeRules, paramName, additionalParams, ruleChain} = properties;

            if (methodCaller) {
                // we understand that this logic needs to call api

                // default dto
                let dto = {
                    token: this.props.token,
                    [paramName]: this.hot.getDataAtRowProp(r, c)
                };

                if (typeof additionalParams !== 'undefined' &&
                    typeof additionalParams === 'object') {

                    // create addition parameter to bind exact one
                    const additionalDTO = additionalParams.map((prop) => {
                        return {[prop]: this.hot.getDataAtRowProp(r, prop)}
                    });

                    // dto with additional parameters
                    dto = Object.assign({}, dto, ...additionalDTO);
                }

                // method caller and logic execution
                //await this.genericCL(methodCaller, dto);
                this.restApi.callApi(methodCaller, dto).then((response) => {

                    if (typeof response.isExist !== 'undefined') {

                        if (!response.isExist) {
                            // value is not exist in DB, show message

                            // add this row, if column is mandatory, user must fill this cell with correct value
                            const isMandatoryColumn = this.mandatoryColumns.includes(c);
                            // show message and execute logic
                            this.showMessage(this.errorBoxTitle, this.errorMessages[c], true, isMandatoryColumn);

                            this.rowValidation = false; // row has error
                            return false;

                        } else {
                            // value is exist in DB, check other rules associated with that one
                            if (executeRules && executeRules.length > 0) {
                                executeRules.map(props => {

                                    const {propId} = props;
                                    const data = this.hot.getDataAtRowProp(r, propId)

                                    this.columnEvents(r, propId, data)
                                })
                            }
                            this.rowValidation = true; // row passed all validation
                        }

                        if (ruleChain && ruleChain.length > 0) {
                            this.ruleChainHandle(ruleChain, dto, r)
                        }
                    } else {
                        rules[0].changedValue = response.List.map(i => {return i.value})
                        this.staticRules(r, null, rules);
                    }
                })

            } else {
                this.staticRules(r, newV, rules)
            }
        }
    }

    ruleChainHandle(ruleChain, dto, r) {

        ruleChain.map(item => {
            if (item.parentResponse) {
                this.restApi.callApi(item.methodCaller, dto).then(response => {
                    const { exec_status } = response;

                    if (item.responseType === "string") {
                        const value = response[item.parsingKey]
                        if (exec_status === "success") {
                            this.staticRules(r, value, item.rules)
                        }
                    }

                    if (item.responseType === "object") {
                        const obj = response[item.parsingKey]

                        const list = obj.reduce((arr, i) => {
                            return [...arr, i[item.parsingKey]]
                        }, [])

                        this.hot.setCellMeta(r, this.hot.propToCol(item.parsingKey), 'source', list);
                        this.hot.setDataAtRowProp(r, item.parsingKey, list[0]);
                    }
                })
            }
        })
    }

    staticRules(r, value, rules) {
        if (rules) {
            rules.map((item) => {
                if (item.columnValue && value) {
                    if (item.columnValue === value) {
                        // status changes
                        this.hot.setDataAtRowProp(r, item.changedId, item.changedValue);
                    }
                } else if (!item.columnValue && value) {

                    this.hot.setDataAtRowProp(r, item.changedId, value);

                } else {
                    this.hot.setCellMeta(r, this.hot.propToCol(item.changedId), 'source', item.changedValue);
                }
            })
        }
    }

    handleExport() {
        const {token, region, radioSite} = this.props;
        this.props.setSpinner();

        this.restApi.callApi('exportData', {
            region,
            token,
            radioSite
        }).then(response => {
            const today = new Date();
            //const todayDate =  '_' + today.getDate() +  (today.toLocaleString('default', { month: 'long' })) + today.getFullYear();

            const todayDate = '_' + today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate() + 'T' + today.getHours() + '.' + today.getMinutes()

            const ws = XLSX.utils.json_to_sheet(response.ExportedExcelAsJSON);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: 'xlsx'});

           // saveAs(data, `DataMatrix${todayDate}.xlsx`);
            saveAs(data, `Exported_RANConn${todayDate}.xlsx`);
            this.props.setSpinner();

        }).catch((error) => {
            console.log(error)
            this.props.setSpinner();

        });
    }

    handleLockClick() {

        const {r} = this.selectedRowCoords;
        if (r === null) return;

        if (this.isRowCanBeEditable(r, 'Lock')) {
            const dto = this.prepareDTOforLockMechanism(r, true);

            this.restApi.callApi('lock', dto).then(response => {
                this.showMessageForLockMechanism(true, response.resultLock);
                this.dataLoad();
            })
        }
    }

    handleUnlockClick() {
        const {r} = this.selectedRowCoords;
        if (r === null) return;

        if (this.isRowCanBeEditable(r, 'Lock')) {
            const dto = this.prepareDTOforLockMechanism(r, true);

            this.restApi.callApi('unlock', dto).then(response => {
                this.showMessageForLockMechanism(false, response.resultUnlock);
                this.dataLoad();
            })
        }
    }

    prepareDTOforLockMechanism(r, isExplicit) {
        const {token} = this.props;

        // get existing data at row
        const data = this.hot.getDataAtRow(r);
        const radioSiteColumnIndex = this.findIndexOfColumn(0,'radioSite');
        const revisionNumberColumnIndex = this.findIndexOfColumn(0,'revisionNumber');

        const radioSite = data[radioSiteColumnIndex].toString();
        const revisionNumber = data[revisionNumberColumnIndex].toString();

        return {
            token,
            radioSite,
            revisionNumber,
            isExplicit
        }
    }

    showMessageForLockMechanism(messageForLock, result) {

        const {lockMechanism, unlockMechanism} = this.props.language;

        const title = messageForLock ? lockMechanism.title : unlockMechanism.title;
        let message = messageForLock ? lockMechanism[result.code.toString()] : unlockMechanism[result.code.toString()]

        message = message
            ? message.replace("{uname}", result.uname).replace("{time}", new Date(result.time).toLocaleString())
            : "Undefined";

        this.alert.showMessage('info', title, message, false);
    }

    iconForLockStatusInCell(instance, td, row, col, prop, value) {

        const {language} = this.props;

        switch (value) {
            case "Locked_Current_User" : {
                const message = language.lockStatusMessages.Locked_Current_User;
                td.innerHTML = '<strong class="icon icon-lock-locked text-danger" title="'+message+'" />';
            } break;

            case "Locked_Other_User" : {
                const message = language.lockStatusMessages.Locked_Other_User;
                td.innerHTML = '<strong class="text-danger" title="'+message+'">' +
                    '<i class="icon icon-lock-locked"></i>' +
                    '<i class="icon icon-avatar"></i>' +
                    '</strong>';
            } break;

            default: {
                const message = language.lockStatusMessages.Not_Locked;
                td.innerHTML = '<strong class="icon icon-lock-unlocked" title="'+message+'" />';
            } break;

        }
        td.classList.add("text-center")
        return td;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.isDataExistsInDB !== this.state.isDataExistsInDB ||
            nextState.activePage !== this.state.activePage ||
            nextState.totalCountOfData !== this.state.totalCountOfData ||
            nextState.newRowAdded !== this.state.newRowAdded ||
            nextState.maximize !== this.props.maximize
    }

    render() {
        const {maximize, language, contentCSS, showRevision} = this.props;

        if (language) {
            this.errorBoxTitle = language.validationMessageBoxTitle;
            this.errorMessages = language.validationErrorMessages;
        }

        return (
            <>
                <Header/>
                <Row className="h-100">
                    <Sidebar maximize={maximize}/>
                    <Col className={contentCSS}>
                        <Toolbar
                            wrapper={'toolbar mt-2'}
                            isDataExist={this.state.isDataExistsInDB}
                            newRowAdded={this.state.newRowAdded}
                            export={this.handleExport.bind(this)}
                            lock={this.handleLockClick.bind(this)}
                            unlock={this.handleUnlockClick.bind(this)}
                            new={this.handleNewRowClick.bind(this)}
                            duplicate={this.handleDuplicateRowClick.bind(this)}
                            edit={this.handleEditClick.bind(this)}
                            cancel={this.handleCancelClick.bind(this)}
                            save={this.handleSaveClick.bind(this)}
                            save-history={this.handleSaveHistoryClick.bind(this)}
                            revision={this.revisionRowFilter.bind(this)}
                            handleRegionChange={this.dataLoad.bind(this)}
                            handleRadioSiteChange={this.dataLoad.bind(this)}
                        />

                        <Card className={'mt-1 fixedCard'}>
                            <CardBody>
                                <HotTable ref={this.hotTableComponent} id={'hot'}
                                  licenseKey={'non-commercial-and-evaluation'}
                                  nestedHeaders={this.columnHeaders}
                                  columns={this.columns}
                                  stretchH={'all'}
                                  dropdownMenu={true}
                                  filters={true}
                                  manualColumnResize={true}
                                  width={'100%'}
                                  height={'100%'}
                                  fixedColumnsLeft={0}
                                  columnSorting={true}
                                  currentRowClassName={['bg-primary', 'text-white']}
                                  enterBeginsEditing={false}
                                  outsideClickDeselects={false}
                                  enterMoves={this.disableMoves()}
                                  fillHandle={this.disableMoves()}
                                  afterSelectionEnd={(r, c) => {
                                      this.selectedRowCoords.r = r;
                                      this.selectedRowCoords.c = c;
                                  }}
                                  afterValidate={(isValid, value, row, prop) => {
                                      // this is check dropdown values are proper or not.
                                      this.validatedCell.r = row;
                                      this.validatedCell.c = prop;
                                  }}
                                  afterGetColHeader={(col, TH) => {
                                      this.headerColoring(col, TH)
                                  }}
                                  afterCreateRow={(index, amount, source) => {
                                      //console.log(index, amount, source)
                                  }}
                                  afterRenderer={(td, r) => {
                                      if (showRevision) {
                                          const v = this.hot.getDataAtRowProp(r, 'archived');
                                          if (['YES', 'Yes', 'yes'].includes(v)) {
                                              td.classList.add('revision-row')
                                          }
                                      }
                                  }}
                                  afterChange={(changes) => {
                                      // TODO: check esc button when its clicked
                                      if (changes) {
                                          const [r, c, oldV, newV] = changes[0];
                                          // check cell value if it's different previous one and
                                          // if row still has error -> we need that because
                                          // if user doesnt change value at second time, validation rule not execute.
                                          if (oldV !== newV || !this.rowValidation)
                                            this.columnEvents(r, c, newV);
                                      }
                                  }}
                                />

                                {!this.state.isDataExistsInDB &&
                                    <EmptyDataset page={'matrix'}/>
                                }
                            </CardBody>

                            {/*<CardFooter className={'text-center'}>
                                <PaginationMatrix
                                    activePage={this.state.activePage}
                                    itemPerPage={this.state.itemPerPage}
                                    totalCountOfData={this.state.totalCountOfData}
                                    handlePageChange={this.handlePageChange.bind(this)}
                                />
                            </CardFooter>*/}
                        </Card>
                    </Col>
                </Row>

                <ModalImport loadAfterImport={this.dataLoad.bind(this)}/>
                <Spinner/>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        user: state.user,
        language: state.language,
        maximize: state.maximize,
        contentCSS: state.contentCSS,
        region: state.region,
        radioSite: state.radioSite,
        spinnerToggle: state.spinnerToggle,
        showRevision: state.showRevision
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setEdit: () => dispatch(editOnToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);