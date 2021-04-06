import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {modalExportToggle, spinnerToggle} from "../redux/actions";
import RestApiModule from '../RestApiModule';
import { CSVLink } from 'react-csv'

class ModalExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileJSON: [],
        }

        this.today = new Date();
        this.todayDate = '_' + (this.today.getMonth()+1) + '-' + this.today.getDate() + '-' + this.today.getFullYear();
        this.fileName = 'DataMatrix' + this.todayDate + '.csv';

        this.restApi = new RestApiModule();
    }


    toggle() {
        this.props.setModalExport();
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

/*
    componentDidMount () {
    this.getExportDataJSON();
    }

*/


    render() {
        const {language} = this.props;
        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'l'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)}>{language.exportDataMatrixFile}</ModalHeader>
                    <ModalBody>
                        <div className={'row'}>
                            <div className={'col-4'}></div>
                            <div className={'col-8'}>
                                <label >{this.fileName}</label>
                                <button>
                                    <CSVLink data={this.props.data} filename={this.fileName} >Export</CSVLink>
                                </button>
                            </div>
                        </div>
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
        language: state.language,
        token: state.token,
        region: state.region
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalExport: () => dispatch(modalExportToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalExport);