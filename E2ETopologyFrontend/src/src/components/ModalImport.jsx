import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {modalImportToggle, spinnerToggle} from "../redux/actions";
import FileUploadProgress from 'react-fileupload-progress';
import XLSX from "xlsx";
import {make_cols} from "./MakeColumns";
import {SheetJSFT} from './types';


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


class ModalImportTemplate extends React.Component {
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
        this.showProgress = false;

        this.handleFile = this.handleFile.bind(this);
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

    handleFile() {
        /* Boilerplate to set up FileReader */
        this.setState({
            showProgress: true
        })
        this.props.setSpinner();
        try {

            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (e) => {
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array', bookVBA: true});
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws);
                /* Update state */
                this.setState({data: data, cols: make_cols(ws['!ref'])}, () => {
                    this.state.fileJSON = JSON.stringify(this.state.data, null, 2);
                    console.log(this.state.fileJSON);
                });
                this.setState({
                    isValidateDisabled: false,
                    uploadHasError: false,
                    uploadProgress: 100
                });
                this.props.setSpinner();
            };

            if (rABS) {
                reader.readAsBinaryString(this.state.file);
            } else {
                reader.readAsArrayBuffer(this.state.file);
            }
            ;

        } catch (e) {
            this.setState({
                isValidateDisabled: true,
                uploadHasError: true,
                uploadProgress: 100
            });
            this.props.setSpinner();
        }

    }

    toggle() {
        this.props.setModalImport();
    }

    triggerInputFile = () => this.fileInput.click();


    customFormRenderer(onSubmit) {
        const {language} = this.props;
        return (
            <form id='customForm' style={{marginBottom: '15px'}}>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <button type="button" className={'btn btn-primary btn-block'}
                                onClick={this.triggerInputFile}>{language.import}</button>
                        <input ref={fileInput => this.fileInput = fileInput} style={{display: 'block'}} type="file" id="file"
                               accept={SheetJSFT} onChange={this.handleChange} hidden={true} name='file' id="exampleInputFile"/>
                    </div>
                    <div className={'col-10'}>
                        <p ref={chosenFile => this.chosenFile = chosenFile} style={styles.bsHelp}>{language.noFileChosen}</p>
                    </div>
                </div>

                <div className={'row'}>
                    <div className={'col-2 mt-4'}>
                        <button type="button" className={'btn btn-secondary btn-block'} onClick={this.handleFile}
                                disabled={this.state.isUploadDisabled}>{language.upload}</button>
                    </div>
                    <div className={'col-10'}>
                        <div ref={uploadProgressBar => this.uploadProgressBar = uploadProgressBar} className={'mt-3'}>
                            {this.state.showProgress &&
                            this.customProgressRenderer(this.state.uploadProgress, this.state.uploadHasError)
                            }
                        </div>
                    </div>
                </div>
                <hr/>
                <div className={'row'}>
                    <div className={'col-4'}> </div>
                    <div className={'col-4 mt-4'}>
                        <button type="button" ref={sendBackend => this.sendBackend = sendBackend}
                                hidden={this.state.isValidateDisabled} className={'btn btn-success btn-block'}
                                onClick={onSubmit}>{language.validate}</button>
                    </div>
                    <div className={'col-4'}>
                        <div>
                            {this.c}
                        </div>
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
                <Modal isOpen={this.props.open} size={'lg'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)}>{language.importDataMatrixFile}</ModalHeader>
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
        open: state.modalImportToggle,
        import: state.import,
        language: state.language
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalImport: () => dispatch(modalImportToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalImportTemplate);