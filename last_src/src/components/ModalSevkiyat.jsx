import React, {createRef} from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, Col, Row, CardBody, Card, Button} from 'reactstrap';
import {modalSevkiyatToggle, setOrderID, spinnerToggle, setCancelStatus, modalCancelToggle} from "../redux/actions";
import RestApiModule from '../RestApiModule';
import store from "../redux/store";

import {HotTable} from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import EmptyDataset from "./EmptyDataset";
import Spinner from "./Spinner";

class ModalSevkiyat extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.store = store;
        this.hotTableComponent1 = createRef();
        this.restApi = new RestApiModule();

        this.addInput = this.addInput.bind(this);
        this.hot = null;
        this.columns = [];
        this.selectedRowCoords = {r: null, c: null};
        this.editedRowCoords = {r: null, c: null};
        this.state = {
            a:"b",
            columns: [
            ],
            data: [
            ],
            newArrColumns: [],
            ColumnsInOrderByAPI: ["Detay", "purchaseOrderNumber", "generatedAt", "purchaseOrderStatusId", "purchaseOrderFulfillmentStatusId", "totalCost"],
            ColumnsInOrder: ["Durum","SKU","Tedarikçi SKU","Ürün İsmi", "Liste Fiyatı", "Satış Fiyatı", "İnd.Oran(%)", "Stok Adet", "T.Adet","T.Sıra", "Ürt.Tar.", "Hz.Sr."],
            fileJSON: [],
            inputValue:null,
            trackingInputValue:null,
            carrierInputValue:null,
            shippingMethodInputValue:null,
            dateShippedInputValue:null,
            noteInputValue:null,
            shippedQtyInputValue:null,
            suppressedInputValue:null,
            table:null

        }

        this.today = new Date();
        this.todayDate = '_' + (this.today.getMonth()+1) + '-' + this.today.getDate() + '-' + this.today.getFullYear();
        this.fileName = 'DataMatrix' + this.todayDate + '.csv';

        this.restApi = new RestApiModule();
    }




    componentDidMount () {
        this.forceUpdate();

      //  console.log(this.hotTableComponent1.current)
       // this.hot = this.hotTableComponent1.current.hotInstance;
        this.columns = [
            {readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},
        ];

        this.setState({

        })

        if(this.hotTableComponent1.current != null){
            this.hot = this.hotTableComponent.current.hotInstance;

            this.state.a = this.hotTableComponent.current.hotInstance;

       //     console.log(this.hot)
       //     console.log("did")
        }

        this.forceUpdate();
    }


    toggle() {
        this.props.setSpinner();
        this.props.setModalSevkiyat();


        window.location.reload();

    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }



    componentWillUnmount() {
    //    console.log("will")
    //    console.log(this.hotTableComponent1.current)
    }

    SevkiyatEkleRequest(){
        const company = localStorage.getItem('Company');
     //   console.log(this.state.inputValue)
      //  console.log(this.props.orderId)
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

       //     console.log(response)


        }).catch((err) => {

            console.log(err);
        })

        this.props.setModalSevkiyat();
    }




    handleColumnColor(){

        for(let m = 0; m<13; m++){
            let columnscolor = document.querySelectorAll('.ht_master tr > td:nth-child(' +m +')');
            for (let o= 0; o < columnscolor.length; o++) {

                columnscolor[o].style.backgroundColor = 'white';
            }
        }

        /*

        let columnscolor = document.querySelectorAll('.ht_master tr > td:nth-child'+ '(3)');
        for (let o= 0; o < columnscolor.length; o++) {

            columnscolor[o].style.backgroundColor = 'white';
        }

        let columnscolor1 = document.querySelectorAll('.ht_master tr > td:nth-child(6)');
        for (let o= 0; o < columnscolor1.length; o++) {

            columnscolor1[o].style.backgroundColor = 'white';
        }

       let columnscolor2 = document.querySelectorAll('.ht_master tr > td:nth-child(7)');
       for (let o= 0; o < columnscolor2.length; o++) {

           columnscolor2[o].style.backgroundColor = 'white';
       }
       let columnscolor3 = document.querySelectorAll('.ht_master tr > td:nth-child' + '(8)');
       for (let o= 0; o < columnscolor3.length; o++) {

           columnscolor3[o].style.backgroundColor = 'white';
       }
       let columnscolor4= document.querySelectorAll('.ht_master tr > td:nth-child(9)');
       for (let o= 0; o < columnscolor4.length; o++) {

           columnscolor4[o].style.backgroundColor = 'white';
       }
       let columnscolor5= document.querySelectorAll('.ht_master tr > td:nth-child(10)');
       for (let o= 0; o < columnscolor5.length; o++) {

           columnscolor5[o].style.backgroundColor = 'white';
       }
        let columnscolor6= document.querySelectorAll('.ht_master tr > td:nth-child(11)');
        for (let o= 0; o < columnscolor6.length; o++) {

            columnscolor6[o].style.backgroundColor = 'white';
        }
        let columnscolor7= document.querySelectorAll('.ht_master tr > td:nth-child(12)');
        for (let o= 0; o < columnscolor7.length; o++) {

            columnscolor7[o].style.backgroundColor = 'white';
        }
*/

    }

    addInput(col, TH) {

        this.handleColumnColor();

//console.log(this.hotTableComponent1.current)

        if(this.hotTableComponent1.current != null){
            this.hot = this.hotTableComponent1.current.hotInstance;



        if (typeof col !== 'number') {
            return col;
        }

        if (col >= 0 && TH.childElementCount < 2) {

            var div = document.createElement('div');
            var input = document.createElement('input');

            div.className = 'filterHeader';


            var filtersPlugin = this.hot.getPlugin('filters');

            input.addEventListener('keydown', function(event) {

                filtersPlugin.removeConditions(col);
                filtersPlugin.addCondition(col, 'contains', [event.target.value]);
                filtersPlugin.filter();


            });
            //console.log(TH)

            if(TH.children[0].children[1] != null || TH.children[0].children[1] != undefined){
                //   console.log(TH.children[0].children[1].innerText)
                //   console.log(document.getElementsByClassName("colHeader columnSorting sortAction"))

                let kolonAdi = TH.children[0].children[1].innerText;

                if(kolonAdi == 'Ürün İsmi' || kolonAdi == 'SKU' || kolonAdi == 'Tedarikçi SKU'){

                    div.appendChild(input);
                    TH.appendChild(div);
                }
            }




        }
        }


    }


    doNotSelectColumn(event, coords){
        if (coords.row === -1 && event.target.nodeName === 'INPUT') {
            event.stopImmediatePropagation();
            this.deselectCell();
        }
    }


    render() {
        const {language} = this.props;
        const items = []
    //    console.log(this.props.originalRows)
     //   console.log(this.props.editedRows)

this.state.data = [];
if(this.props.originalRows != null){
    for(let b = 0; b < this.props.originalRows.length; b++){
     //   console.log(this.props.editedRows[this.props.originalRows[b]])

        const satir = this.props.editedRows[this.props.originalRows[b]]

        satir.push('Kaydedildi');

        satir[11] = satir[10]
        satir[10] = satir[9]
        satir[9] = satir[8]
        satir[8] = satir[7]
        satir[7] = satir[6]
        satir[6] = satir[5]
        satir[5] = satir[4]
        satir[4] = satir[3]
        satir[3] = satir[2]
        satir[2] = satir[1]
        satir[1] = satir[0];
        satir[0]='Kaydedildi';

        this.state.data.push(satir);
       // items.push(<li key={b}>{'SKU: ' + satir[0] + ', Ürün İsmi: ' + satir[2] + ', Satış Fiyatı: ' + satir[4] + ', Stok Adet: ' + satir[6] + ', Üretim Tarihi: ' + satir[9] + ', Hazırlık Süresi: ' + satir[10]}</li>)
       /* items.push(<li key={b}>{', Ürün İsmi: ' + satir[2]}</li>)
        items.push(<li key={b}>{', Satış Fiyatı: ' + satir[4]}</li>)
        items.push(<li key={b}>{', Stok Adet: ' + satir[6]}</li>)
        items.push(<li key={b}>{', Üretim Tarihi: ' + satir[9]}</li>)
        items.push(<li key={b}>{', Hazırlık Süresi: ' + satir[10]}</li>)*/
    }
}

        if (language) {
            return (
                <Modal isOpen={this.props.open} size={'xxxx'} centered={true}>
                    <ModalHeader toggle={this.toggle.bind(this)} style={{
                        fontSize:'1.25rem',
                        fontFamily:'proxima-nova,sans-serif',
                        fontStyle:'normal',
                        fontWeight:'600',
                        marginBottom:'1.5rem',
                        color:'unset',
                        lineHeight:'1.125',
                        display:'block'
                    }}>Fiyat/Stok Güncelleme Raporu</ModalHeader>
                    <div>
                        <span style={{
                            fontSize:'1.25rem',
                            fontFamily:'proxima-nova,sans-serif',
                            fontStyle:'normal',
                            fontWeight:'300',
                            marginLeft:'1.5rem',
                        }}> Değişiklik yapılan satırların listesi aşağıdadır.</span>

                    </div>

                    <ModalBody>
                        {/*<div>
                            {items}
                        </div>*/}

                        <Card className={'mt-1 fixedCard'}>
                            <CardBody>
                                <HotTable ref={this.hotTableComponent1} id={'hot'}
                                          data={this.state.data}
                                          stretchH={'all'}
                                          autoRowSize={true}
                                          autoWrapRow={true}
                                          dropdownMenu={true}
                                          filters={true}
                                          manualColumnResize={true}
                                          columnSorting={true}
                                          colHeaders={this.state.ColumnsInOrder}
                                          columns={this.columns}
                                          rowHeaders={true}
                                          width={'100%'}
                                          height={'550px'}
                                          licenseKey="non-commercial-and-evaluation"
                                          afterGetColHeader={this.addInput}
                                          beforeOnCellMouseDown={this.doNotSelectColumn}
                                          columnHeaderHeight={55}
                                          afterRender={this.addInput}

                                />


                            </CardBody>

                        </Card>

                        <div>
                            <Button
                                style={
                                    {backgroundColor : '#42f545',
                                        color : 'white',
                                        border: 'none',
                                        display: 'inline-block',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: '46%',
                                        marginTop:'15px',
                                        width: '75px',
                                        height: '50px'
                                    }
                                }
                                text-align = {'center'}
                                onClick={this.toggle.bind(this)}

                                cursor = {'pointer'}>
                                OK
                            </Button>
                        </div>

                    </ModalBody>
                    <Spinner/>
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
        cancelStatus:state.cancelStatus,
        originalRows: state.originalRows,
        editedRows: state.editedRows
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