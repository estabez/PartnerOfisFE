import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {modalImportToggle, spinnerToggle, setImportPolling} from "../redux/actions";
import FileUploadProgress from 'react-fileupload-progress';
import XLSX from "xlsx";
import {groupingMap} from '../matrixDataMap';
import RestApiModule from '../RestApiModule';
import {Row, Col, Card, CardBody, CardTitle, CardText, CardHeader, Alert, Button} from 'reactstrap';
import {saveAs} from 'file-saver';

// Alert module import
import AlertModule from '../AlertModule'

class ModalImport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            isExcelHeadersValid: null,
            progress: -1,
            showButton1: true,
            showButton2: false,
            showButton3: false,
            showLongWaitMessage: false
        }

        this.fileJSON = {};
        this.data = [];
        this.cols = [];
        //const {REACT_APP_API_GATEWAY, REACT_APP_MATRIX_SERVICE} = process.env;
        //`${REACT_APP_API_GATEWAY}${REACT_APP_MATRIX_SERVICE}/ImportDataMatrixFromExcel`;

        this.restApi = new RestApiModule();
        this.alert = new AlertModule();

        this.fileInput = React.createRef();
        this.uploadFileUrl = this.restApi.getImportEndpoint('importData');

        this.styleBar = {
            width: 0,
        }

        this.progressAction = null; // handle interval
        this.timePassed = 0;

    }

    handleSelectFile(e) {
        function checkFileType(file) {
            const allowedTypes = process.env.REACT_APP_ACCEPTED_IMPORT_FILE_EXT.split(",");
            const extension = file.name.substring(file.name.lastIndexOf('.'));
            return allowedTypes.includes(extension);
        }

        const files = e.target.files;

        if (files && files[0])
            if (checkFileType(files[0])) {
                this.setState({
                    file: files[0],
                    showButton2: true,
                    isExcelHeadersValid: null
                });
            } else {
                const {language} = this.props;
                this.alert.showMessage("error",
                    language.importSection.wrongFileExtTitle,
                    language.importSection.wrongFileExt,
                    false)
            }
    };

    handleFile() {
        /* Boilerplate to set up FileReader */
        this.props.setSpinner();
        try {

            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (e) => {
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array', bookVBA: true, sheetRows: 0});
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, {
                    header: 1,
                    defval: ""
                });

                /* Store the json data */
                this.fileJSON = JSON.stringify(data, null, 2);

                this.handleJSONHeaders();

                this.props.setSpinner();
            };

            if (rABS) {
                reader.readAsBinaryString(this.state.file);
            } else {
                reader.readAsArrayBuffer(this.state.file);
            }


        } catch (e) {
            this.setState({showButton3: false})
            this.props.setSpinner();
        }

    }

    handleJSONHeaders() {

        const headerMap = JSON.parse(JSON.stringify(groupingMap));
        const excelHeadersArray = (JSON.parse(this.fileJSON))[1];

        const columnsMap = headerMap.reduce((fullArr, item) => {
            const cols = item.columns.reduce((arr, col) => {
                if (col.importColumnId !== undefined) arr.push(col.importColumnId)
                return arr;
            }, []);
            return [...fullArr, ...cols]
        }, [])

        const isSame = JSON.stringify(excelHeadersArray).replace(/ /g, '').toLowerCase() === JSON.stringify(columnsMap).toLowerCase();
        this.setState({isExcelHeadersValid: isSame, showButton3: isSame, showButton2: !isSame});

        if (!isSame) {
            this.setState({file: null, showButton2: false})
        }
    }

    downloadLogFile() {
        const {importActionResponse} = this.state;
        if (importActionResponse) {
            const today = new Date();
            const todayDate = '_' + today.getDate() + (today.toLocaleString('default', {month: 'long'})) + today.getFullYear();

            const {importResult} = JSON.parse(importActionResponse);
            const {log} = importResult[0];

            const blob = new Blob([log], {type: "text/plain;charset=utf-8"});
            saveAs(blob, `importDetailedLog${todayDate}.txt`);
        }
    }

    toggle() {
        this.setState({
            file: null,
            isExcelHeadersValid: null,
            importActionResponse: null,
            showButton2: false,
            showButton3: false,
            progress: -1
        })
        this.props.setModalImport();
    }

    customFormRenderer(onSubmit) {
        const {language, token} = this.props;

        return (
            <Row>
                <Col>
                    <Button color={'success'} size={"lg"} block
                            hidden={!this.state.showButton3}
                            onClick={(e) => {

                                this.restApi.callApi("getLocksCount", {
                                    token
                                }).then(res => {

                                    const {count} = res.locksCount;
                                    const lockCountMessage = language.importSection.locksCountForLastStep.replace('{count}', count);

                                    this.alert.getConfirmation(
                                        "warning",
                                        language.importSection.warningTitleForLastStep,
                                        `${language.importSection.warningMessageForLastStep}<br><br>${lockCountMessage}`
                                    ).then(response => {

                                        if (response === true) {

                                            // if user start an import action do not make observable request for check import status
                                            this.props.setImportPolling(false);

                                            this.restApi.callApi('getImportStatus', {
                                                token
                                            }).then(response => {

                                                const {islock, uname} = response.isImportOngoing

                                                if (!islock) {
                                                    this.setState({showButton3: false});
                                                    onSubmit(e)
                                                } else {

                                                    const message = language.importSection.ongoingImportText.replace('{username}', uname);

                                                    this.alert.showMessage(
                                                        'warning',
                                                        language.importSection.ongoingImportTitle,
                                                        message
                                                    )
                                                }
                                            })
                                        }
                                    })
                                })
                            }}>
                        {language.upload}
                        <i className={`icon icon-upload ml-2`}/>
                    </Button>
                </Col>
            </Row>
        );
    }

    formGetter() {
        return JSON.stringify({
            token: this.props.token,
            importedExcelAsJSON: this.fileJSON
        });
    }

    customProgressRenderer(progressFile, hasError, cancelHandler) {
        const {language} = this.props;

        function countOfRowsText(count) {
            return +count > 1
                ? `${count} ${language.importSection.rows}`
                : `${count} ${language.importSection.rows.slice(0, -1)}`
        }

        const {progress} = this.state;

        if (hasError || progress > -1) {

            let progressBar = Object.assign({}, this.styleBar);
            progressBar.width = `${progress}%`;

            let result = null;
            const {importActionResponse, showLongWaitMessage} = this.state;

            if (importActionResponse && progress === 100) {

                const jsonResponse = JSON.parse(importActionResponse);
                const {importResult, exec_status, error_code, error_message} = jsonResponse;

                if (importResult) result = importResult[0];

                if (exec_status === "error") {

                    this.setState({progress: 0, showLongWaitMessage: false})

                    const message = error_message ? error_message : "Null exception";

                    if (+error_code === 10) {
                        this.alert.showMessage('error', 'Error', message, true);
                    } else {
                        this.alert.showMessage('error', 'Error', message, false);
                    }
                }
            }

            return (
                <>
                    {!hasError &&
                    <>
                        <Row>
                            <Col>
                                <div className={"progressWrapper text-center"}>
                                    <span>Import progress: {`${progress}%`}</span>
                                    <div className={"progressBar"} style={progressBar}/>
                                </div>
                            </Col>
                        </Row>
                        {showLongWaitMessage &&
                        <Row>
                            <Col>
                                <Alert color={"warning"}>
                                    {language.importSection.longTimeWaitMessageForUpload}
                                </Alert>
                            </Col>
                        </Row>
                        }
                    </>
                    }

                    {hasError &&
                    <Row>
                        <Col>
                            <Alert color={"danger"}>
                                <i className="icon icon-triangle-warning mr-2"/>
                                {language.importSection.progressError}
                            </Alert>
                        </Col>
                    </Row>
                    }

                    {(progress === 100 && result && !hasError) &&
                    <Row>
                        <Col>
                            <Card body={false}>
                                <CardHeader>
                                    {language.importSection.summaryLabel}
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Card color={"primary"} inverse>
                                                <CardBody>
                                                    <CardTitle tag={"h5"}>
                                                        {language.importSection.totalRowCount}
                                                    </CardTitle>
                                                    <CardText>{language.importSection.totalRowText}</CardText>
                                                    <Alert tag={"h4"} color={"info"}>
                                                        {countOfRowsText(result.totalcount)}
                                                    </Alert>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card color={"success"} inverse>
                                                <CardBody>
                                                    <CardTitle tag={"h5"}>
                                                        {language.importSection.successRowCount}
                                                    </CardTitle>
                                                    <CardText>{language.importSection.successRowText}</CardText>
                                                    <Alert tag={"h4"} color={"info"}>
                                                        {countOfRowsText(result.successCount)}
                                                    </Alert>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card color={"danger"} inverse>
                                                <CardBody>
                                                    <CardTitle tag={"h5"}>
                                                        {language.importSection.failedRowCount}
                                                    </CardTitle>
                                                    <CardText>{language.importSection.failedRowText}</CardText>
                                                    <Alert tag={"h4"} color={"info"}>
                                                        {countOfRowsText(result.errorcount)}
                                                    </Alert>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <hr/>
                                            <Button color={"primary"} className={"mt-3"} block size={"lg"}
                                                    onClick={this.downloadLogFile.bind(this)}>
                                                {language.importSection.downloadLogFile}
                                                <i className={`icon icon-download-save ml-2`}/>
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    }
                </>
            );

        } else {
            return (
                <></>
            )
        }
    }

    render() {

        const {language, loadAfterImport} = this.props;

        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'lg'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)}>{language.importDataMatrixFile}</ModalHeader>
                    <ModalBody className={'import-file'}>

                        <input ref={fileInput => this.fileInput = fileInput} type="file"
                               accept={process.env.REACT_APP_ACCEPTED_IMPORT_FILE_TYPE}
                               onChange={this.handleSelectFile.bind(this)} hidden={true}/>

                        <Row>
                            <Col md={'12'}>
                                {!this.state.file &&
                                <div className={'choose-file-wrapper'}>
                                    <Button className={"chose-file"} onClick={() => this.fileInput.click()}>
                                        {language.chooseFile}
                                    </Button>
                                </div>
                                }
                                {this.state.file &&
                                <div className={'choose-file-wrapper'}>
                                    <h4>
                                        {language.importSection.selectedFileLabel}
                                        {this.state.file.name}
                                    </h4>
                                </div>
                                }
                            </Col>
                            <hr/>
                            <Col>
                                {this.state.showButton2 &&
                                <Button color={'primary'} className={'mt-3 mb-3'} size={"lg"} block
                                        onClick={this.handleFile.bind(this)}>
                                    {language.validate}
                                    <i className={`icon icon-file ml-2`}/>
                                </Button>
                                }
                                {this.state.isExcelHeadersValid === true &&
                                <Alert color="success" className={'mt-2'}>
                                    <i className={`icon icon-check mr-2`}/>
                                    {language.importSection.selectedFileValid}
                                </Alert>
                                }
                                {this.state.isExcelHeadersValid === false &&
                                <Alert color="danger" className={'mt-2'}>
                                    <i className={`icon icon-cross mr-2`}/>
                                    {language.importSection.selectedFileNotValid}
                                </Alert>
                                }
                            </Col>

                        </Row>

                        <FileUploadProgress
                            url={this.uploadFileUrl}
                            method={"POST"}
                            beforeSend={(request) => {
                                this.props.setSpinner();
                                this.setState({progress: Math.floor(Math.random() * 8) + 5});
                                request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                                // Wee need that workaround because we dont know when server will give response.
                                this.progressAction = setInterval(() => {

                                    this.timePassed += 2500;
                                    console.log(this.timePassed);
                                    if (this.timePassed > 60000) {
                                        this.setState({showLongWaitMessage: true})
                                    }

                                    if (this.state.progress <= 92) {
                                        let increase = Math.floor(Math.random() * 2) + 3;
                                        this.setState({
                                            progress: increase + +this.state.progress
                                        });
                                    }
                                }, 2500)

                                return request
                            }}
                            onProgress={(e, request, progress) => {
                                // empty event, maybe we need this event for later
                            }}
                            onLoad={(e, request) => {
                                clearInterval(this.progressAction);

                                setTimeout(() => {
                                    // Wait a little time to get correct data structure from response
                                    this.setState(
                                        {
                                            progress: 100,
                                            showLongWaitMessage: false,
                                            importActionResponse: request.response
                                        }, () => {
                                            // After set state execute load data action
                                            const {exec_status} = JSON.parse(this.state.importActionResponse);

                                            if (exec_status === "success") {
                                                // Import finish successfully, then reload the data.
                                                if (this.state.progress === 100) {
                                                    loadAfterImport();

                                                    // app should restart make observable request for control import status
                                                    this.props.setImportPolling(true);

                                                }
                                            }
                                            this.props.setSpinner();
                                        });
                                }, 200);
                            }}
                            onError={(e, request) => {
                                this.setState({progress: 0, showLongWaitMessage: false}, () => {
                                    clearInterval(this.progressAction);
                                    this.props.setSpinner();
                                })
                            }}
                            onAbort={(e, request) => {
                                this.setState({progress: 0, showLongWaitMessage: false}, () => {
                                    clearInterval(this.progressAction);
                                    this.props.setSpinner();
                                })
                            }}
                            formGetter={this.formGetter.bind(this)}
                            formRenderer={this.customFormRenderer.bind(this)}
                            progressRenderer={this.customProgressRenderer.bind(this)}

                        />
                    </ModalBody>

                </Modal>
            )
        } else {
            return (<></>)
        }
    }
}

function mapStateToProps(state) {
    return {
        open: state.modalImportToggle,
        import: state.import,
        language: state.language,
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalImport: () => dispatch(modalImportToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
        setImportPolling: (data) => dispatch(setImportPolling(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalImport);