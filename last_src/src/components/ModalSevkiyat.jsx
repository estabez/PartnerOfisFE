import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, Col, Row} from 'reactstrap';
import {modalSevkiyatToggle, setOrderID, spinnerToggle, setCancelStatus, modalCancelToggle} from "../redux/actions";
import RestApiModule from '../RestApiModule';
import store from "../redux/store";


class ModalSevkiyat extends React.Component {
    constructor(props) {
        super(props);
        this.restApi = new RestApiModule();
        this.store = store;
        this.state = {
            fileJSON: [],
            inputValue:null,
            trackingInputValue:null,
            carrierInputValue:null,
            shippingMethodInputValue:null,
            dateShippedInputValue:null,
            noteInputValue:null,
            shippedQtyInputValue:null,
            suppressedInputValue:null,

        }

        this.today = new Date();
        this.todayDate = '_' + (this.today.getMonth()+1) + '-' + this.today.getDate() + '-' + this.today.getFullYear();
        this.fileName = 'DataMatrix' + this.todayDate + '.csv';

        this.restApi = new RestApiModule();
    }


    toggle() {
        this.props.setModalSevkiyat();
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

    SevkiyatEkleRequest(){
        const company = localStorage.getItem('Company');
        console.log(this.state.inputValue)
        console.log(this.props.orderId)
        this.restApi.callApi('sevkiyatEkle', {
            company:company,
            purchaseOrderId: this.props.orderId,
            carrier:this.state.carrierInputValue,
            method:this.state.shippingMethodInputValue,
            note:this.state.noteInputValue,
            shippedAt:this.state.dateShippedInputValue,
            suppressed:this.state.suppressed,
            trackingNumber:this.state.trackingInputValue,
            quantity:this.state.shippedQtyInputValue

        }).then(response => {

            console.log(response)


        }).catch((err) => {

            console.log(err);
        })

        this.props.setModalSevkiyat();
    }

    updateTrackingInputValue(evt) {
        this.setState({
            trackingInputValue: evt.target.value
        });
    }

    updateCarrierInputValue(evt) {
        this.setState({
            carrierInputValue: evt.target.value
        });
    }

    updateShippingMethodInputValue(evt) {
        this.setState({
            shippingMethodInputValue: evt.target.value
        });
    }

    updateDateShippedInputValue(evt) {
        this.setState({
            dateShippedInputValue: evt.target.value
        });
    }

    updateNoteInputValue(evt) {
        this.setState({
            noteInputValue: evt.target.value
        });
    }

    updateShippedQtyInputValue(evt) {
        this.setState({
            shippedQtyInputValue: evt.target.value
        });
    }

    render() {
        const {language} = this.props;
        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'lx'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)} style={{
                        fontSize:'1.25rem',
                        fontFamily:'proxima-nova,sans-serif',
                        fontStyle:'normal',
                        fontWeight:'600',
                        marginBottom:'1.5rem',
                        color:'unset',
                        lineHeight:'1.125',
                        display:'block'
                    }}>Sevkiyat Ekle</ModalHeader>
                    <ModalBody>
                        <div style={{
                            columnGap:'0.75rem',
                            marginLeft:'calc(-1*0.75rem)',
                            marginRight:'calc(-1*0.75rem)',
                            display:'flex',
                            flexWrap:'wrap',
                            marginBottom:'-.75rem',
                            marginTop:'-.75rem',
                            boxSizing:'inherit'
                        }}>
                            <div style={{
                                paddingLeft:'0.75rem',
                                paddingRight:'0.75rem',
                                flex:'none',
                                width:'100%',
                                display:'block',
                                padding:'.75rem'
                            }}>
                                <div>
                                    <label style={{
                                        marginBottom:'.5em',
                                        color:'#363636',
                                        display:'block',
                                        fontSize:'1rem',
                                        fontWeight:'700'
                                    }}>Satın Alma Siparişi</label>
                                    <label style={{
                                        marginBottom:'.5em',
                                        marginLeft:'2.25em',
                                        display:'block',
                                        fontSize:'1rem',
                                        fontWeight:'700',
                                        height:'2.25em',
                                        textAlign:'1rem',
                                        color:'#7a7a7a',
                                        borderRadius:'4px',
                                        borderColor:'#f5f5f5'
                                    }}>{this.props.order}</label>
                                </div>
                            </div>
                        </div>


                        {/*<Row>
                            <Col xs={6}>
                                <div style={{
                                    paddingLeft:'.75rem',
                                    paddingRight:'.75rem',
                                    flex:'none',
                                    width:'50%',
                                    display:'block',
                                    padding:'.75rem'
                                }}>
                                    <div>
                                        <label style={{
                                            marginBottom:'.5em',
                                            color:'#363636',
                                            display:'block',
                                            fontSize:'1rem',
                                            fontWeight:'700'
                                        }}>Takip Numarası</label>
                                        <input  value={this.state.trackingInputValue} onChange={evt => this.updateTrackingInputValue(evt)} style={{

                                            maxWidth:'100%',
                                            width:'100%',
                                            backgroundColor:'#fff',
                                            borderColor:'#dbdbdb',
                                            borderRadius:'4px',
                                            color:'#363636',
                                            alignItems:'center',
                                            border:'1px solid #dbdbdb',
                                            fontSize:'1rem',
                                            height:'2.25em',
                                            lineHeight:'1.5',
                                            padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                            position:'relative',
                                            verticalAlign:'top',
                                            fontFamily:'proxima-nova,sans-serif',
                                            margin:'0'

                                        }}/>
                                    </div>
                                </div>



                            </Col>

                            <Col xs={6}>

                                <div style={{
                                    paddingLeft:'.75rem',
                                    paddingRight:'.75rem',
                                    flex:'none',
                                    width:'50%',
                                    display:'block',
                                    padding:'.75rem',

                                }}>
                                    <div>
                                        <label style={{
                                            marginBottom:'.5em',
                                            color:'#363636',
                                            display:'block',
                                            fontSize:'1rem',
                                            fontWeight:'700'
                                        }}>Suppressed</label>
                                        <div style={{
                                            boxSizing:'border-box',
                                            clear:'both',
                                            fontSize:'1rem',
                                            position:'relative',
                                            textAlign:'left'
                                        }}>
                                            <div style={{
                                                marginBottom:'-.5rem',
                                                flexWrap:'nowrap',
                                                alignItems:'center',
                                                display:'flex',
                                                justifyContent:'flex-start'
                                            }}>
                                        <span style={{
                                            zIndex:'3',
                                            borderBottomRightRadius:'0',
                                            borderTopRightRadius:'0',
                                            marginRight:'-1px',
                                            marginBottom:'.5rem',
                                            backgroundColor:'#40c0bd',
                                            borderColor:'transparent',
                                            color:'#fff',
                                            borderWidth:'1px',
                                            cursor:'pointer',
                                            textAlign:'center',
                                            padding:'calc(.375em - 1px) .75em',
                                            whiteSpace:'nowrap'
                                        }}>Hayır</span>
                                                <span style={{
                                                    zIndex:'3',
                                                    borderBottomRightRadius:'0',
                                                    borderTopRightRadius:'0',
                                                    marginRight:'-1px',
                                                    marginBottom:'.5rem',
                                                    backgroundColor:'#fff',
                                                    borderColor:'transparent',
                                                    color:'#363636',
                                                    borderWidth:'1px',
                                                    cursor:'pointer',
                                                    textAlign:'center',
                                                    padding:'calc(.375em - 1px) .75em',
                                                    whiteSpace:'nowrap'
                                                }}>Evet</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </Col>

                        </Row>*/}




                        {/*<Row>
                            <Col xs={6}>
                                <div style={{
                                    paddingLeft:'.75rem',
                                    paddingRight:'.75rem',
                                    flex:'none',
                                    width:'50%',
                                    display:'block',
                                    padding:'.75rem',
                                }}>
                                    <div>
                                        <label style={{
                                            marginBottom:'.5em',
                                            color:'#363636',
                                            display:'block',
                                            fontSize:'1rem',
                                            fontWeight:'700'
                                        }}>Kargo Şirketi</label>
                                        <input  value={this.state.carrierInputValue} onChange={evt => this.updateCarrierInputValue(evt)} style={{

                                            maxWidth:'100%',
                                            width:'100%',
                                            backgroundColor:'#fff',
                                            borderColor:'#dbdbdb',
                                            borderRadius:'4px',
                                            color:'#363636',
                                            alignItems:'center',
                                            border:'1px solid #dbdbdb',
                                            fontSize:'1rem',
                                            height:'2.25em',
                                            lineHeight:'1.5',
                                            padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                            position:'relative',
                                            verticalAlign:'top',
                                            fontFamily:'proxima-nova,sans-serif',
                                            margin:'0'

                                        }}/>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div style={{
                                    paddingLeft:'.75rem',
                                    paddingRight:'.75rem',
                                    flex:'none',
                                    width:'50%',
                                    display:'block',
                                    padding:'.75rem',
                                }}>
                                    <div>
                                        <label style={{
                                            marginBottom:'.5em',
                                            color:'#363636',
                                            display:'block',
                                            fontSize:'1rem',
                                            fontWeight:'700'
                                        }}>Sevkiyat Methodu</label>
                                        <input  value={this.state.shippingMethodInputValue} onChange={evt => this.updateShippingMethodInputValue(evt)} style={{

                                            maxWidth:'100%',
                                            width:'100%',
                                            backgroundColor:'#fff',
                                            borderColor:'#dbdbdb',
                                            borderRadius:'4px',
                                            color:'#363636',
                                            alignItems:'center',
                                            border:'1px solid #dbdbdb',
                                            fontSize:'1rem',
                                            height:'2.25em',
                                            lineHeight:'1.5',
                                            padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                            position:'relative',
                                            verticalAlign:'top',
                                            fontFamily:'proxima-nova,sans-serif',
                                            margin:'0'

                                        }}/>
                                    </div>
                                </div>

                            </Col>
                        </Row>*/}






                        {/*<div style={{
                            columnGap:'0.75rem',
                            marginLeft:'calc(-1*0.75rem)',
                            marginRight:'calc(-1*0.75rem)',
                            display:'flex',
                            flexWrap:'wrap',
                            marginBottom:'-.75rem',
                            marginTop:'-.75rem',
                            boxSizing:'inherit'
                        }}>
                            <div style={{
                                paddingLeft:'0.75rem',
                                paddingRight:'0.75rem',
                                flex:'none',
                                width:'100%',
                                display:'block',
                                padding:'.75rem'
                            }}>
                                <div>
                                    <label style={{
                                        marginBottom:'.5em',
                                        color:'#363636',
                                        display:'block',
                                        fontSize:'1rem',
                                        fontWeight:'700'
                                    }}>Sevkiyat Tarihi</label>
                                    <div>


                                            <input
                                                type="date"
                                                format="YYYY-MM-DD"
                                                id="start_date"

                                                style={{
                                                    width:'30%',
                                                    height:'100%'
                                                }}

                                                value={this.state.dateShippedInputValue} onChange={evt => this.updateDateShippedInputValue(evt)}
                                            />

                                    </div>
                                </div>
                            </div>
                        </div>*/}






                        {/*<div style={{
                            columnGap:'0.75rem',
                            marginLeft:'calc(-1*0.75rem)',
                            marginRight:'calc(-1*0.75rem)',
                            display:'flex',
                            flexWrap:'wrap',
                            marginBottom:'-.75rem',
                            marginTop:'-.75rem',
                            boxSizing:'inherit'
                        }}>
                            <div style={{
                                paddingLeft:'0.75rem',
                                paddingRight:'0.75rem',
                                flex:'none',
                                width:'100%',
                                display:'block',
                                padding:'.75rem'
                            }}>
                                <div>
                                    <label style={{
                                        marginBottom:'.5em',
                                        color:'#363636',
                                        display:'block',
                                        fontSize:'1rem',
                                        fontWeight:'700'
                                    }}>Not</label>
                                    <div>
                                        <input  value={this.state.noteInputValue} onChange={evt => this.updateNoteInputValue(evt)} style={{

                                            maxWidth:'100%',
                                            width:'100%',
                                            backgroundColor:'#fff',
                                            borderColor:'#dbdbdb',
                                            borderRadius:'4px',
                                            color:'#363636',
                                            alignItems:'center',
                                            border:'1px solid #dbdbdb',
                                            fontSize:'1rem',
                                            height:'12.25em',
                                            lineHeight:'1.5',
                                            padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                            position:'relative',
                                            verticalAlign:'top',
                                            fontFamily:'proxima-nova,sans-serif',
                                            margin:'0'

                                        }}/>

                                    </div>
                                </div>
                            </div>
                        </div>*/}



                        <div style={{
                            columnGap:'0.75rem',
                            marginLeft:'calc(-1*0.75rem)',
                            marginRight:'calc(-1*0.75rem)',
                            display:'flex',
                            flexWrap:'wrap',
                            marginBottom:'-.75rem',
                            marginTop:'-.75rem',
                            boxSizing:'inherit'
                        }}>
                            <div style={{
                                paddingLeft:'0.75rem',
                                paddingRight:'0.75rem',
                                flex:'none',
                                width:'100%',
                                display:'block',
                                padding:'.75rem'
                            }}>
                                <div>
                                    <label style={{
                                        marginBottom:'.5em',
                                        color:'#363636',
                                        display:'block',
                                        fontSize:'1rem',
                                        fontWeight:'700'
                                    }}>Sevk Edilecek Ürünler</label>
                                    <div style={{
                                        boxSizing:'border-box',
                                        clear:'both',
                                        fontSize:'1rem',
                                        position:'relative',
                                        textAlign:'left'
                                    }}>
                                        <table style={{
                                            backgroundColor:'inherit',
                                            width:'100%',
                                            color:'#363636',
                                            borderCollapse:'collapse',
                                            borderSpacing:'0',
                                            boxSizing:'inherit'
                                        }}>
                                            <thead style={{
                                                backgroundColor:'#fff',
                                                color:'#363636',
                                                borderCollapse:'collapse',
                                                borderSpacing:'0',
                                                textIndent:'initial'
                                            }}>
                                                <tr style={{
                                                    boxSizing:'inherit',
                                                    display:'table-row',
                                                    verticalAlign:'inherit',
                                                    borderColor:'inherit'
                                                }}>
                                                    <th style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        textAlign:'left',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        color:'#363636',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em',
                                                        display:'table-cell'
                                                    }}>Sevk Edilen Ürün Sayısı</th>
                                                    <th style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        textAlign:'left',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        color:'#363636',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em',
                                                        display:'table-cell'
                                                    }}>Satın Alınan Ürün Sayısı</th>
                                                    <th style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        textAlign:'left',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        color:'#363636',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em',
                                                        display:'table-cell'
                                                    }}>SKU</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{
                                                backgroundColor:'transparent',
                                                boxSizing:'inherit',
                                                display:'table-row-group',
                                                verticalAlign:'middle',
                                                borderColor:'inherit'
                                            }}>
                                                <tr>
                                                    <td style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        textAlign:'left',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em',
                                                        display:'table-cell'
                                                    }}>
                                                        <input  value={this.state.shippedQtyInputValue} onChange={evt => this.updateShippedQtyInputValue(evt)} style={{

                                                            boxShadow:'none',
                                                            maxWidth:'100%',
                                                            width:'100%',
                                                            backgroundColor:'#fff',
                                                            borderColor:'#dbdbdb',
                                                            borderRadius:'4px',
                                                            color:'#363636',
                                                            alignItems:'center',
                                                            display:'inline-flex',
                                                            fontSize:'1rem',
                                                            height:'2.25em',
                                                            justifyContent:'flex-start',
                                                            lineHeight:'1.5',
                                                            padding:'calc(.375em - 1px) calc(.625em - 1px)',
                                                            position:'relative',
                                                            verticalAlign:'top',
                                                            fontFamily:'proxima-nova,sans-serif',
                                                            margin:'0'


                                                        }}/>
                                                    </td>

                                                    <td style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        textAlign:'left',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em'
                                                    }}>1</td>

                                                    <td style={{
                                                        borderBottomWidth:'1px',
                                                        verticalAlign:'middle',
                                                        borderWidth:'1px',
                                                        whiteSpace:'nowrap',
                                                        width:'1%',
                                                        textAlign:'left',
                                                        border:'solid #dbdbdb',
                                                        padding:'.5em .75em'
                                                    }}>L-21482</td>
                                                </tr>
                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>





                        <div style={{
                            columnGap:'0.75rem',
                            marginLeft:'calc(-1*0.75rem)',
                            marginRight:'calc(-1*0.75rem)',
                            display:'flex',
                            flexWrap:'wrap',
                            marginBottom:'-.75rem',
                            marginTop:'-.75rem',
                            boxSizing:'inherit'
                        }}>
                            <div style={{
                                paddingLeft:'0.75rem',
                                paddingRight:'0.75rem',
                                flex:'none',
                                width:'100%',
                                display:'block',
                                padding:'.75rem'
                            }}>
                                <div>

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
                                    }} onClick={() => this.SevkiyatEkleRequest()}>Sevkiyatı Kaydet</button>
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
                                    }} onClick={() => this.props.setModalSevkiyat()}>İptal</button>

                                    </div>
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
        open: state.modalSevkiyatToggle,
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
        setModalSevkiyat: () => dispatch(modalSevkiyatToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
        setCancelStatus: (cancelStatus) => dispatch(setCancelStatus(cancelStatus))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalSevkiyat);