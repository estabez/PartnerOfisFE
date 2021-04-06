import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {modalExportToggle, spinnerToggle} from "../redux/actions";
import FileUploadProgress from 'react-fileupload-progress';
import { CSVLink } from 'react-csv'

import JSONInput from '../sampleData/data';

const styles = {
    progressWrapper: {
        height: '25px',
        marginTop: '10px',
        marginBottom: '10px',
        width: '100%',
        float: 'left',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        WebkitBoxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)'
    },
    progressBar: {
        float: 'left',
        width: '0',
        height: '100%',
        fontSize: '12px',
        lineHeight: '20px',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#5cb85c',
        WebkitBoxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
        boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
        WebkitTransition: 'width .6s ease',
        Otransition: 'width .6s ease',
        transition: 'width .6s ease'
    },
    cancelButton: {
        marginTop: '5px',
        WebkitAppearance: 'none',
        padding: 0,
        cursor: 'pointer',
        background: '0 0',
        border: 0,
        float: 'left',
        fontSize: '21px',
        fontWeight: 700,
        lineHeight: 1,
        color: '#000',
        textShadow: '0 1px 0 #fff',
        filter: 'alpha(opacity=20)',
        opacity: '.2'
    },

    bslabel: {
        display: 'inline-block',
        maxWidth: '100%',
        marginBottom: '5px',
        fontWeight: 700
    },

    bsHelp: {
        display: 'block',
        marginTop: '5px',
        marginBottom: '10px',
        color: '#737373'
    },

    bsButton: {
        padding: '1px 5px',
        fontSize: '12px',
        lineHeight: '1.5',
        borderRadius: '3px',
        color: '#fff',
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4',
        display: 'inline-block',
        marginBottom: 0,
        fontWeight: 400,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        touchAction: 'manipulation',
        cursor: 'pointer',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        backgroundImage: 'none',
        border: '1px solid transparent'
    }
};

class ModalExportTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            data: [],
            cols: [],
            fileJSON: {},
            loading: true,
            isUploadDisabled: true,
            isValidateDisabled: true,
            uploadHasError: true,
            uploadProgress: 0,
            showProgress: false
        }
        this.columnHeaders = [];
        this.titles = [];
        this.columns = [];
        this.today = new Date();
        this.todayDate = this.today.getFullYear() + '-' + (this.today.getMonth()+1) + '-' + this.today.getDate();
        this.fileName = 'DataMatrix_' + this.todayDate + '.csv';
        this.showProgress = false;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.chosenFile.innerText = e.target.files[0].name;
        const files = e.target.files;
        this.setState({
            isUploadDisabled: false
        })
        if (files && files[0]) this.setState({file: files[0]});
    };

    toggle() {
        this.props.setModalExport();
    }

    customFormRenderer(onSubmit) {
        return (
            <form id='customForm' style={{marginBottom: '15px'}}>
                <div className={'row'}>
                    <div className={'col-4'}></div>
                    <div className={'col-8'}>
                        <label style={styles.bsHelp}>{this.fileName}</label>
                        <button>
                            <CSVLink data={JSONInput.SAFI} filename={this.fileName}>Export</CSVLink>
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    formGetter() {
        return this.state.fileJSON;
    }

    customProgressRenderer(progress, hasError, cancelHandler) {
        if (hasError || progress > -1) {
            let barStyle = Object.assign({}, styles.progressBar);
            barStyle.width = progress + '%';

            let message = (<span>{barStyle.width}</span>);
            if (hasError) {
                barStyle.backgroundColor = '#d9534f';
                message = (<span style={{'color': '#a94442'}}>Failed to upload ...</span>);
            }
            if (!hasError && progress === 100) {
                message = (<span>Done</span>);
            }

            return (
                <div>
                    <div style={styles.progressWrapper}>
                        <div style={barStyle}></div>
                    </div>
                    <div className={'alert alert-info mt-2'} style={{'clear': 'left'}}>
                        {message}
                    </div>
                </div>
            );
        } else {
            return;
        }
    }


    render() {
        const {language} = this.props;
        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'l'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)}>{language.exportDataMatrixFile}</ModalHeader>
                    <ModalBody>
                        <FileUploadProgress key='ex2' url='http://localhost:3000/api/upload' method='post'
                                            onProgress={(e, request, progress) => {
                                                console.log('progress', e, request, progress);
                                                this.props.setSpinner();
                                            }}
                                            onLoad={(e, request) => {
                                                console.log('load', e, request);
                                                this.props.setSpinner();
                                            }}
                                            onError={(e, request) => {
                                                console.log('error', e, request);
                                                this.props.setSpinner();
                                            }}
                                            onAbort={(e, request) => {
                                                console.log('abort', e, request);
                                                this.props.setSpinner();
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
        open: state.modalExportToggle,
        export: state.export,
        language: state.language
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalExport: () => dispatch(modalExportToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalExportTemplate);