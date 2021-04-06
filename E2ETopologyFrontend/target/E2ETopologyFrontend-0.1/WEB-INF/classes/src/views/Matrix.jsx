import React, {createRef} from 'react';
import {connect} from "react-redux";
import axios from 'axios';
import {HotTable} from '@handsontable/react';
import Handsontable from 'handsontable';
import {groupingMap} from '../matrixDataMap';
import {columnLogic} from '../matrixColumnLogicMap';

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Toolbar from '../components/ToolbarMatrix'
import ModalTemplate from '../components/ModalImport'
import Spinner from '../components/Spinner'
import data from '../sampleData/data';
import {editOnToggle} from "../redux/actions";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import ModalExportTemplate from "../components/ModalExport"; // Import css

class Matrix extends React.Component {

    constructor(props) {
        super(props);
        this.serviceName = process.env.REACT_APP_MATRIX_SERVICE;
        //this.handsontableData = Handsontable.helper.createSpreadsheetData(25, 10);
        this.hotTableComponent = createRef();
        this.hot = null;
        this.handsontableData = data.SAFI;
        this.handsontableDataBackup = null;

        this.errorMessages = null;
        this.errorBoxTitle = null;
        this.columnHeaders = [];
        this.titles = [];
        this.columns = [];
        this.handleColumnHeaders();
        this.editable = ['oldAggregSite', 'newAggregSite',
            'preAggregSite', 'mwPreAggregEquip', 'mwPreAggregPort',
            'aggregEquipIp',
            'status', 'dueDate', 'radioSite',
            'aggregIpPort', 'raccordmentOsnA', 'raccordmentOsnZ',
            'mwEquip' ,'mwVendor', 'mwPort',
            'iubIp', 'iubVlan']; // test
        this.selectedRowCoords = {r: null, c: null};
        this.editedRowCoords = {r: null, c: null};
        this.validatedCell = {r: null, c: null};
        this.rowValidation = true;
        this.showHistory = false;
        this.filter = null;

        this.radioSite = {
                isExists: false,
                value: ''
        };

        this.preAggregSite = {
            isExists: false,
            value: ""
        };

        this.state = {
            newRowAdded: false,
            showHistory: false,
        };

        Handsontable.hooks.add('afterSelectionEnd', (r, c) => {
            this.selectedRowCoords.r = r;
            this.selectedRowCoords.c = c;
        });
    }

    componentDidMount() {
        this.hot = this.hotTableComponent.current.hotInstance;
        this.hot.loadData(this.handsontableData);

        this.filter = this.hot.getPlugin('filters');

        const colIndex = this.findIndexOfColumn(0,'archived');
        this.filter.addCondition(colIndex, 'contains', 'No');
        this.filter.filter();
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    handleEditClick() {

        const {r, c} = this.selectedRowCoords;
        if (r === null && c === null) return;

        //console.log(this.hot.getCellMeta(r, 4));
        //console.log(this.hot.getRangedData([r, 0, r, this.hot.countCols()]));

        // create backup data before editing;
        this.handsontableDataBackup = JSON.parse(JSON.stringify(this.handsontableData));

        // Change edit mode on redux
        this.props.setEdit();

        this.setCellProperties(r, c);
        this.editedRowCoords.r = r;
        this.editedRowCoords.c = c;
    }

    async handleCancelClick() {
        await this.setStateAsync({newRowAdded : false});
        this.cancelEdit();
    }

    handleSaveClick() {
        if (this.rowValidation) {

            const {r, c} = this.editedRowCoords;

            // data would send to API
            const data = this.hot.getDataAtRow(r);
            console.log(data);

            this.resetRow(r); // should remove, refresh data from DB

            this.selectedRowCoords.r = r;
            this.selectedRowCoords.c = c;
            this.editedRowCoords.r = null;
            this.editedRowCoords.c = null;


            // Change edit mode on redux
            this.props.setEdit();
        } else {
            alert('Validation errors');
        }
    }

    handleSaveHistoryClick() {
        alert('History handle');
    }

    async handleNewRowClick() {

        await this.setStateAsync({newRowAdded : true});

        this.props.setEdit();
        this.hot.alter('insert_row', 0, 1);
        this.setCellProperties(0, null);


        const statusColIndex = this.findIndexOfColumn(0, 'status');

        this.hot.setDataAtRowProp(0, 'archived', 'No');
        this.hot.setCellMeta(0, statusColIndex, 'source', ['Planned', 'Implemented'])

        // inital Data for new row
        this.hot.setDataAtRowProp(0, 'iubIp', '10.250.0.0')
        this.hot.setDataAtRowProp(0, 'iubGw', '10.250.0.0')
        this.hot.setDataAtRowProp(0, 'iubMask', '255.255.255.0')
        this.hot.setDataAtRowProp(0, 'omIp', '10.251.0.0')
        this.hot.setDataAtRowProp(0, 'omGw', '10.251.0.0')
        this.hot.setDataAtRowProp(0, 'omMask', '255.255.255.0')
        this.hot.setDataAtRowProp(0, 's1cp_x2cpIp', '10.248.0.0')
        this.hot.setDataAtRowProp(0, 's1cp_x2cpGw', '10.248.0.0')
        this.hot.setDataAtRowProp(0, 's1cp_x2cpMask', '255.255.255.0')
        this.hot.setDataAtRowProp(0, 's1up_x2upIp', '10.249.0.0')
        this.hot.setDataAtRowProp(0, 's1up_x2upGw', '10.249.0.0')
        this.hot.setDataAtRowProp(0, 's1up_x2upMask', '255.255.255.0')
        this.hot.setDataAtRowProp(0, 'bscIp', '10.137.0.0')
        this.hot.setDataAtRowProp(0, 'bscNextHopIp', '10.137.0.0')

    }

    handleHistoryToggle() {

        const colIndex = this.findIndexOfColumn(0,'archived');

        const arg = this.showHistory ? '' : 'No';

        if (!this.state.showHistory) {
            this.filter.removeConditions(colIndex);
        } else {
            this.filter.addCondition(colIndex, 'contains', arg);
        }
        this.filter.filter();

        this.setStateAsync({showHistory: !this.state.showHistory});
    }

    setCellProperties(r, c) {

        const colCount = this.hot.countCols();
        let col = c !== null ? c : 0;

        for (let x = 0; x <= colCount; x++) {
            const {prop} = this.hot.getCellMeta(r,x);

            if (this.editable.indexOf(prop) >= 0) {

                const type = this.hot.getDataType(r,x); // get cell type from loaded map

                // this 2 row for initiate the rules on editing row.
                const value = this.hot.getDataAtCell(r, x);
                this.columnEvents(r, prop, value);

                col = col === 0 ? x : col; // when add new row find first editable col.

                this.hot.setCellMeta(r, x, "editor", type);
                this.hot.setCellMeta(r, x, "className", 'bg-warning text-dark');
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

    cancelEdit() {
        this.handsontableData = JSON.parse(JSON.stringify(this.handsontableDataBackup));
        this.hot.loadData(this.handsontableData);
        this.hot.render();

        // Change edit mode on redux
        this.props.setEdit();
    }

    resetRow(r) {
        const colCount = this.hot.countCols();
        for (let x = 0; x <= colCount; x++) {

            this.hot.setCellMeta(r, x, "editor", false);
            this.hot.setCellMeta(r, x, "className", 'bg-primary text-white');
        }
        this.hot.render();
        this.setState({ newRowAdded : false});
    }

    disableMoves() {
        return false;
    }

    ipValidate(value, callback) {

        const pat = /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;
        //const pat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

        this.rowValidation = pat.test(value);
        callback(this.rowValidation);
        if (!this.rowValidation)
            this.showMessage(this.errorBoxTitle, this.errorMessages.invalidIP, true);
    }

    numericValidate(value, callback) {

        const pat = /^\d+$/;

        this.rowValidation = pat.test(value);
        callback(this.rowValidation);
        if (!this.rowValidation)
            this.showMessage(this.errorBoxTitle, this.errorMessages.invalidNumber, true);
    }

    ruleExtractor(columnId) {
        return columnLogic.find((item) => {
            return item.id === columnId;
        })
    }

    statusCL(r, c, newV) {

        if (!this.state.newRowAdded) {
            //edit mode
            const rule = this.ruleExtractor('status');
            rule.rules.map((item) => {
                if (item.columnValue === newV) {
                    this.hot.setDataAtRowProp(r, item.changedId, item.changedValue);
                }
            })
        }
    }

    newAggregSiteCL(r, c, value) {
        // column logic

        const properties = this.ruleExtractor('newAggregSite');
        const {methodName, rules} = properties;

        const isExist = this.callRestApiMethod(methodName, {value});
        console.log(isExist);

        if (value === 'Error') {
            this.showMessage(this.errorBoxTitle, this.errorMessages.aggregSiteNotExists, true);

        } else {

            rules.map((item) => {

                const ind =this.findIndexOfColumn(r, item.changedId);
                // retrieve data from DB view
                const data = ['Test1', 'Test2', 'Test3', 'Test4'];
                this.hot.setCellMeta(r, ind, 'source', data);

            });
        }
    }

    radioSiteCL(r, c, value) {

        const dbResponse = "Test"; // at this point we need check the name exists in db

        this.radioSite.value = value;
        this.radioSite.isExists = (dbResponse === value);
    }

    mwVendorCL(r, c, value) {

        /* Sample data */
        const ericsson = ['TAN-0049', 'TAN-0006', 'TAN-0036'];
        const huawei = ['HUA-0049', 'HUA-0006', 'HUA-0036'];

        let source;

        switch (value) {
            case "ERICSSON" : source = ericsson; break;
            case "Huawei" : source = huawei; break;
            default: source = []
        }
        /* Sample data end*/

        const rule = this.ruleExtractor('mwVendor'); // get this column rules

        rule.rules.map((item) => {
            const ind =this.findIndexOfColumn(r, item.changedId);
            // retrieve data from DB view
            this.hot.setCellMeta(r, ind, 'source', source);
        });
    }

    mwEquipCL(r, c, value) {

        /* Sample Data */
        const ericsson = ['Port3 FE', 'Port4 FE'];
        const huawei = ['Port99 FE', 'Port88 FE'];

        let source;

        switch (value) {
            case "TAN-0049" : source = ericsson; break;
            case "HUA-0049" : source = huawei; break;
            default: source = []
        }
        /* Sample Data end */

        const rule = this.ruleExtractor('mwEquip');
        rule.rules.map((item) => {
            const ind =this.findIndexOfColumn(r, item.changedId);
            // retrieve data from DB view
            this.hot.setCellMeta(r, ind, 'source', source);
        });
    }

    preAggregSiteCL(r, c, value) {

        const dbResponse = 'ABC';
        this.preAggregSite.value = value;

        // preAggregSite exist
        this.preAggregSite.isExists = (dbResponse === value);

        const rule = this.ruleExtractor('preAggregSite');
        rule.rules.map((item) => {
            const ind =this.findIndexOfColumn(r, item.changedId);

            let source = []; // retrieve data from DB view

            switch (item.changedId) {
                // retrieve from db
                case 'mwPreAggregEquip': {
                    source = this.preAggregSite.isExists
                        ? ['AAM20P Port Geth Dir YOU-0009', 'AAM10P Port', 'AAM550P', 'AAM10P']
                        : [];
                } break;
                case 'raccordmentOsnA': source = ['AB1', 'AB2', 'AB3', 'ABC4']; break;
            }

            this.hot.setCellMeta(r, ind, 'source', source);
        });

    }

    mwPreAggregEquipCL(r, c, value) {

        /* Sample Data */
        const s1 = ['Port3 FE', 'Port4 FE'];
        const s2 = ['Port99 FE', 'Port88 FE'];

        let source;

        switch (value) {
            case "AAM10P" : source = s1; break;
            case "AAM550P" : source = s2; break;
            default: source = []
        }
        /* Sample Data end */

        const rule = this.ruleExtractor('mwPreAggregEquip');
        rule.rules.map((item) => {
            const ind =this.findIndexOfColumn(r, item.changedId);
            // retrieve data from DB view
            this.hot.setCellMeta(r, ind, 'source', source);
        });
    }

    showMessage(title, message, validatorClose) {
        confirmAlert({
            title: 'Validation Warning',
            message: message,
            closeOnEscape: false,
            closeOnClickOutside: false,
            customUI: ({ onClose }) => {

                const closeAction = () => {
                    if (validatorClose) {
                        this.hot.selectCell(this.validatedCell.r, this.validatedCell.c);
                        this.hot.getActiveEditor().beginEditing();
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

    handleColumnHeaders() {
        const headerMap = JSON.parse(JSON.stringify(groupingMap));

        headerMap.map((item) => {
            item.columns.map(c => {
                this.titles.push(c.label);
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

            });
            item.colspan = item.columns.length;
            this.columns = [...this.columns, ...item.columns];
            delete item.columns;
        })

        this.columnHeaders.push(headerMap);
        this.columnHeaders.push(this.titles);
        //console.log(this.columnHeaders);
    }

    headerColoring(col, TH) {

        const TR = TH.parentNode;
        const THEAD = TR.parentNode;

        const b = THEAD.childNodes.length;
        const n = Array.prototype.indexOf.call(THEAD.childNodes, TR);
        const headerLevel = (-1) * b + n;

        function applyClass(elem, className) {
            if (!Handsontable.dom.hasClass(elem, className)) {
                Handsontable.dom.addClass(elem, className);
            }
        }

        if (headerLevel === -1 || headerLevel === -2) {

            if (col >=0 && col <= 1) {
                applyClass(TH, 'abis');
            }

            if (col >=2 && col <= 8) {
                applyClass(TH, 'primary');
            }

            if (col === 9) {
                applyClass(TH, 'info');
            }

            if (col >=10 && col <= 18) {
                applyClass(TH, 'dates');
            }

            if (col >=19 && col <= 23) {
                applyClass(TH, 'radio');
            }

            if (col >=24 && col <= 27) {
                applyClass(TH, 'local');
            }

            if (col >=28 && col <= 35) {
                applyClass(TH, 'nodal');
            }

            if (col >=36 && col <= 43) {
                applyClass(TH, 'site3g');
            }

            if (col >=44 && col <= 51) {
                applyClass(TH, 'site4g');
            }

            if (col >=52 && col <= 55) {
                applyClass(TH, 'bsc');
            }

            if (col >=56 && col <= 57) {
                applyClass(TH, 'rnc');
            }

            if (col >=58 && col <= 63) {
                applyClass(TH, 'site2g');
            }
        }
    }

    columnEvents(r, c, newV) {

        switch (c) {
            case 'newAggregSite' : {
                this.validatedCell.r = r;
                this.validatedCell.c = c;
                this.newAggregSiteCL(r, c, newV);
            } break;
            case 'status' : this.statusCL(r, c, newV); break;
            case 'radioSite' : this.radioSiteCL(r, c, newV); break;
            case 'mwVendor' : this.mwVendorCL(r, c, newV); break;
            case 'mwEquip' : this.mwEquipCL(r, c, newV); break;
            case 'preAggregSite' : this.preAggregSiteCL(r, c, newV); break;
            case 'mwPreAggregEquip' : this.mwPreAggregEquipCL(r, c, newV); break;

        }
    }

    callRestApiMethod(method, params) {
        const endpoint = `${this.props.serverPath}/${this.serviceName}/${method}`;

        return new Promise((res, rej) => {

            axios({
                method: "POST",
                url: endpoint,
                data: params
            }).then((response) => {
                console.log(response)
                res(response.data);
            }).catch((err) => {
                console.log(err);
                rej(err)
            })
        })

    }

    render() {
        const {maximize, language, contentCSS} = this.props;

        if (language) {
            this.errorBoxTitle = language.validationMessageBoxTitle;
            this.errorMessages = language.validationErrorMessages;
        }

        return (
            <>
                <Header/>
                <div className="row h-100">
                    <Sidebar maximize={maximize}/>
                    <div className={contentCSS}>
                        <Toolbar
                            newRowAdded={this.state.newRowAdded}
                            newClick={this.handleNewRowClick.bind(this)}
                            editClick={this.handleEditClick.bind(this)}
                            cancelClick={this.handleCancelClick.bind(this)}
                            saveClick={this.handleSaveClick.bind(this)}
                            saveHistoryClick={this.handleSaveHistoryClick.bind(this)}
                            historyToggle={this.handleHistoryToggle.bind(this)}
                        />

                        <div className={'card mt-3 fixedCard'}>
                            <div className="card-body">
                                <HotTable ref={this.hotTableComponent} id={'hot'}
                                          rowHeaders={true}
                                          licenseKey={'non-commercial-and-evaluation'}
                                          nestedHeaders={this.columnHeaders}
                                          columns={this.columns}
                                          stretchH={'all'}
                                          dropdownMenu={true}
                                          filters={true}
                                          manualColumnResize={true}
                                          width={'100%'}
                                          height={'100%'}
                                          fixedColumnsLeft={2}
                                          columnSorting={true}
                                          currentRowClassName={['bg-primary', 'text-white']}
                                          enterBeginsEditing={false}
                                          outsideClickDeselects={false}
                                          enterMoves={this.disableMoves}
                                          fillHandle={this.disableMoves()}
                                          afterValidate={(isValid, value, row, prop) => {
                                              //console.log(isValid, value, row, prop)
                                              this.validatedCell.r = row;
                                              this.validatedCell.c = prop;
                                          }}
                                          afterGetColHeader={(col, TH) => {
                                              this.headerColoring(col, TH)
                                          }}
                                          afterCreateRow={(index, amount, source) => {
                                              console.log(index, amount, source)
                                          }}
                                          afterChange={(changes) =>{

                                              if (changes) {
                                                  const [r, c, oldV, newV] = changes[0];
                                                  this.columnEvents(r, c, newV);
                                              }

                                          }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalTemplate/>
                <ModalExportTemplate/>
                <Spinner/>
            </>
        )
    }

}

function mapStateToProps(state) {
    return {
        language: state.language,
        serverPath: state.serverPath,
        maximize: state.maximize,
        contentCSS: state.contentCSS
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setEdit: () => dispatch(editOnToggle()),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);