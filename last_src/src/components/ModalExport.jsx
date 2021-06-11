import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {modalExportToggle, setOrderID, spinnerToggle,setCancelStatus} from "../redux/actions";
import RestApiModule from '../RestApiModule';
import store from "../redux/store";


class ModalExport extends React.Component {
    constructor(props) {
        super(props);
        this.restApi = new RestApiModule();
        this.store = store;
        this.state = {
            fileJSON: [],
            inputValue:null
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

    CancelRequest(){
        const company = localStorage.getItem('Company');
        console.log(this.state.inputValue)
        console.log(this.props.orderId)
        this.restApi.callApi('iptal', {
            company:company,
            orderId: this.props.orderId,
            reason: this.state.inputValue
        }).then(response => {

            console.log(response)
            this.store.dispatch(setCancelStatus("1"));

        }).catch((err) => {
            this.store.dispatch(setCancelStatus("0"));
            console.log(err);
        })

        this.props.setModalExport();
    }

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }

    render() {
        const {language} = this.props;
        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'l'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)} style={{
                        fontSize:'1.25rem',
                        fontFamily:'proxima-nova,sans-serif',
                        fontStyle:'normal',
                        fontWeight:'400'
                    }}>#{this.props.order} numaralı satın alma siparişini iptal etmek istediğinize emin misiniz? </ModalHeader>
                    <ModalBody>
                        <div className={'row'}>
                            <label style={{
                                marginBottom:'.5em',
                                color:'#363636',
                                marginLeft:'35%',
                                display:'block',
                                fontSize:'1rem',
                                fontWeight:'700'
                            }}> İptal Sebebi(İsteğe Bağlı)</label>

                        </div>
                        <div>
                            <input  value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} style={{

                                maxWidth:'100%',
                                width:'100%',
                                color:'#363636',
                                alignItems:'center',
                                fontSize:'1rem',
                                height:'2.25rem',
                                lineHeight:'1.5',
                                padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                position:'relative',
                                verticalAlign:'top',
                                textRendering:'auto',
                                cursor:'text'

                            }}/>
                        </div>
                        <div style={{
                            marginTop:'.5rem',
                            marginLeft:'3.5rem'
                        }}>
                            <button style={{
                                marginLeft:'.25rem',
                                marginRight:'.25rem',
                                marginBottom:'.5rem',
                                minWidth:'180px',
                                backgroundColor:'#fff',
                                borderColor:'#dbdbdb',
                                borderWidth:'1px',
                                color:'#363636',
                                cursor:'pointer',
                                justifyContent:'center',
                                padding:'calc(.375em - 1px) .75em',
                                textAlign:'center',
                                whiteSpace:'nowrap',
                                alignItems:'center',

                                borderRadius:'4px',
                                boxShadow:'none',
                                display:'inline-flex',
                                fontSize:'1rem',
                                height:'2.25em',
                                lineHeight:'1.5'
                            }} onClick={() => this.props.setModalExport()}> Hayır</button>
                            <button style={{
                                marginLeft:'.25rem',
                                marginRight:'.25rem',
                                marginBottom:'.5rem',
                                minWidth:'180px',
                                backgroundColor:'#40c0bd',
                                borderColor:'#dbdbdb',
                                borderWidth:'1px',
                                color:'#363636',
                                cursor:'pointer',
                                justifyContent:'center',
                                padding:'calc(.375em - 1px) .75em',
                                textAlign:'center',
                                whiteSpace:'nowrap',
                                alignItems:'center',

                                borderRadius:'4px',
                                boxShadow:'none',
                                display:'inline-flex',
                                fontSize:'1rem',
                                height:'2.25em',
                                lineHeight:'1.5'
                            }} onClick={() => this.CancelRequest()}> Evet</button>
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
        region: state.region,
        order:state.order,
        orderId:state.orderId,
        cancelStatus:state.cancelStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalExport: () => dispatch(modalExportToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
        setCancelStatus: (cancelStatus) => dispatch(setCancelStatus(cancelStatus))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalExport);