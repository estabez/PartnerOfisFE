import React, {createRef} from 'react';
import {connect} from "react-redux";
import Axios from 'axios';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import {Row, Col, Card, CardBody, CardFooter} from 'reactstrap';
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import RestApiModule from '../RestApiModule';
import { Container} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import store from '../redux/store'
import {
    editOnToggle,
    setAuthUser,
    setCancelStatus,
    setCompany,
    setOrder,
    setOrderID,
    spinnerToggle
} from "../redux/actions";
import Spinner from '../components/Spinner';
import Toolbar from '../components/ToolbarSiparis';
import AlertModule from '../AlertModule'
import XLSX from "xlsx";

class WDM extends React.Component {
    _isMounted = false;

    constructor(props) {

        super(props);
        this.store = store;
        this.hotTableComponent = createRef();
        this.hot = null;
        this.columns = [];
        this.restApi = new RestApiModule();
        this.handsontableDataBackup = null;
        this.handsontableData = null;
        this.alert = new AlertModule();
        this.selectedRowCoords = {r: null, c: null};
        this.editedRowCoords = {r: null, c: null};
        this.today = new Date();
        this.arrayForDropdown = [];
        this.monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ];
        this.state = {
            columns: [
            ],
            data: [
            ],
            newArrColumns: [],
            ColumnsInOrderByAPI: ["Detay", "purchaseOrderNumber", "generatedAt", "purchaseOrderStatusId", "purchaseOrderFulfillmentStatusId", "totalCost"],
            ColumnsInOrder: ["Detay","SAS Numarası", "SAS Yaratılma Tarihi", "SAS Durumu","Sevkiyat Durumu", "Toplam Ödenecek"],
            newArrData: [],
            newArrDataForPair: [],
            columnOptions: [],
            iptalEdilenSiparisSayisi:null,
            onaylananSiparisSayisi:null,
            yeniSiparisSayisi:null
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.props.setSpinner();
        const company = localStorage.getItem('Company');

        this.restApi.callApi('GetSiparisDurumlar', {
            company: company,
        }).then(response => {


            this.setState({
                iptalEdilenSiparisSayisi:response.iptalEdilenSiparisSayisi,
                onaylananSiparisSayisi:response.onaylananSiparisSayisi,
                yeniSiparisSayisi:response.yeniSiparisSayisi
            })

        }).catch((err) => {
            console.log(err);
        })



        this.restApi.callApi('getSiparisData', {
            company: company,
        }).then(response => {


            const json = response.data[0];
            const jsonBig = response.data;
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    this.state.newArrColumns.push(key);

                }
            }

           for(let a=0; a<jsonBig.length; a++){
               const jsonPair = response.data[a];
               for(let c=0; c<7; c++){
                   let key = this.state.ColumnsInOrderByAPI[c]

                   if(key == "purchaseOrderStatusId"){
                       console.log(jsonPair[key])
                       if(jsonPair[key]==10){
                           this.state.newArrData.push("Sevk Edildi");
                       }
                       if(jsonPair[key]==9){
                           this.state.newArrData.push("İptal Edildi");
                       }
                       if(jsonPair[key]==8){
                           this.state.newArrData.push("Onaylandı");
                       }
                       if(jsonPair[key]==7){
                           this.state.newArrData.push("Yeni Sipariş");
                       }
                   }else if(key=="purchaseOrderFulfillmentStatusId"){
                       if(jsonPair[key]==1){
                           this.state.newArrData.push("Sevkiyat Bekleniyor");
                       }
                       if(jsonPair[key]==2){
                           this.state.newArrData.push("Sevk Edildi");
                       }
                   }else if(key == "generatedAt"){
                       const formattedDate = new Date(parseInt(jsonPair[key]))
                       const formattedDateTime = formattedDate.getDate() + "." +((formattedDate.getMonth())+1) + "." + formattedDate.getFullYear().toString().substr(-2)+ " " + formattedDate.getHours() +  ":" + formattedDate.getMinutes();
                       this.state.newArrData.push(formattedDateTime);
                   }else{
                       this.state.newArrData.push(jsonPair[key]);
                   }


               }
               this.state.data.push(this.state.newArrData);
               this.state.newArrData = [];
            }


            this.hot = this.hotTableComponent.current.hotInstance;
            this.handsontableData = this.state.data;

            this.state.columns.push(this.state.newArrColumns);

            this.columns = [
                { readOnly:true, renderer:'html'},{readOnly: true, style:{color:'#ff686b'}},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true}
            ];





            this.forceUpdate();



            this.forceUpdate();

            for(let k=0; k<jsonBig.length; k++){

                const route1 =  21 ;

                this.state.data[k][0]= "<a href='https://partner.kolayoto.com/PartnerOfis/#/PartnerOfis/siparisDetay'>Detay Gör</a>";
          //  this.state.data[k][0]= "<a href='http://localhost:3000/#/siparisDetay'>Detay Gör</a>";
            }



            this.props.setSpinner();
        }).catch((err) => {
    console.log(err);
            this.props.setSpinner();
})



    }



    handleEditClick() {


        const {r, c} = this.selectedRowCoords;
        if (r === null && c === null) return;

        this.handsontableDataBackup = JSON.parse(JSON.stringify(this.handsontableData));
        // Change edit mode on redux
        this.props.setEdit();

        this.setCellProperties(r, c);
        this.editedRowCoords.r = r;
        this.editedRowCoords.c = c;

    }

    handleSiparisDetay(){
        if(this.selectedRowCoords.c == 0) {


            this.store.dispatch(setCancelStatus("0"));



           this.store.dispatch(setOrder(this.hot.getDataAtCell(this.selectedRowCoords.r,1)));



        }


    }


    handleColumnColor(){
        let columnscolor = document.querySelectorAll('.ht_master tr > td:nth-child(3)');
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
        let columnscolor3 = document.querySelectorAll('.ht_master tr > td:nth-child(8)');
        for (let o= 0; o < columnscolor3.length; o++) {

            columnscolor3[o].style.backgroundColor = 'white';
        }
    }

    handleCancelClick() {

        this.handsontableData = JSON.parse(JSON.stringify(this.handsontableDataBackup));
        this.hot.loadData(this.handsontableData);
        this.hot.render();

        // Change edit mode on redux
        this.props.setEdit();

    }


    handleSaveClick() {

        const {r, c} = this.editedRowCoords;
        let data = this.hot.getDataAtRow(r);


        let finalData = {};

        this.state.ColumnsInOrder.forEach((v,i) => {
            finalData[v] = data[i]
        });



        const company = localStorage.getItem('Company');

        this.restApi.callApi('saveRowAndSendFlxPoint', {
            row: finalData,
            company: company
        }).then(response => {

            const saveResult = response.exec_status;

            if(saveResult == "success"){
                this.alert.showMessage("success",
                    "Kayıt Başarılı",
                    response.SKU + " için kayıt başarılı",
                    false
                )



                this.resetRow(r); // this method will return the edit view to normal
                this.props.setEdit();

            }else{

                this.alert.showMessage("error",
                    "Kayıt Başarısız",
                    response.SKU + " için kayıt başarısız",
                    false
                )

            }


        }).catch((err) => {
            console.log(err);
        })


    }




    handleExport() {
      console.log("export tıklandı");
    }








    render() {

        return(
            <>
                <Header/>
                <Row className="h-100">
                    <Sidebar maximize={this.props.maximize}/>
                    <Col className={this.props.contentCSS}>
                        <Toolbar
                            wrapper={'toolbar mt-2'}
                            isDataExist={this.state.isDataExistsInDB}
                            newRowAdded={this.state.newRowAdded}
                            edit={this.handleEditClick.bind(this)}
                            cancel={this.handleCancelClick.bind(this)}
                            save={this.handleSaveClick.bind(this)}
                            export={this.handleExport.bind(this)}
                        />
                        <Container className="themed-container" fluid={true} style={
                            {padding : '0px',
                                border : '1px solid #CDCDCD',
                                background: '#fff',
                                width: '55%'
                            }
                        }>
                        <div style={
                            {padding : '8px 15px',
                                fontSize: '16px',
                                fontWeight : 'bold',
                                border : '1px solid #CDCDCD',
                                background: '#e2eff9',
                            }}
                            >

                        <span>Güncel Sipariş Durumu</span>
                        </div>

                        <div >
                            <table  style={
                                {
                                    fontSize: '100%',
                                    border : '0',
                                    borderSpacing: '0',
                                    emptyCells : 'show'
                                }}>
                                <tbody  style={
                                    {display : 'table-row-group',
                                        verticalAlign: 'middle'
                                    }}>
                                <tr style={
                                    {width : '960px',
                                        margin: '20px auto',
                                        minHeight : '400px'
                                    }}>
                                <td style={
                                    {borderRight : '1px solid #CDCDCD',
                                        textAlign: 'center',
                                        padding : '10px 5px 6px 5px',
                                        verticalAlign : 'top',
                                        fontWeight : 'normal',
                                        display: 'table-cell'
                                    }}>
                                    <a  style={
                                        {textDecoration : 'underline',
                                            color: '#263056',
                                        }}>
                                    <span style={
                                        {width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '13px'
                                        }}>Yeni Sipariş</span>
                                    <span style={
                                        {borderBottom : '1px solid #CDCDCD',
                                            width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '24px'
                                        }}>{this.state.yeniSiparisSayisi}</span>
                                    <span style={
                                        {
                                            width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '11px',
                                            color:'#878787'
                                        }}>Onayınızı Bekleyen Siparişler</span>
                                    </a>
                                </td>
                                    <td style={
                                        {borderRight : '1px solid #CDCDCD',
                                            textAlign: 'center',
                                            padding : '10px 5px 6px 5px',
                                            verticalAlign : 'top',
                                            fontWeight : 'normal',
                                            display: 'table-cell'
                                        }}>
                                        <a style={
                                            {textDecoration : 'underline',
                                                color: '#263056',
                                            }}>
                                    <span style={
                                        {width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '13px'
                                        }}>Onaylandı</span>
                                        <span style={
                                            {borderBottom : '1px solid #CDCDCD',
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '24px',
                                                color: '#279ebf'
                                            }}>{this.state.onaylananSiparisSayisi}</span>
                                        <span style={
                                            {
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '11px',
                                                color:'#878787'
                                            }}>Kargoya hazır siparişlerinizi düzenleyin.</span>
                                        </a>
                                    </td>
                                    <td style={
                                        {borderRight : '1px solid #CDCDCD',
                                            textAlign: 'center',
                                            padding : '10px 5px 6px 5px',
                                            verticalAlign : 'top',
                                            fontWeight : 'normal',
                                            display: 'table-cell'
                                        }}>
                                        <a  style={
                                            {textDecoration : 'underline',
                                                color: '#263056',
                                            }}>
                                    <span style={
                                        {width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '13px'
                                        }}>Kargolandı</span>
                                        <span style={
                                            {borderBottom : '1px solid #CDCDCD',
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '24px'
                                            }}>0</span>
                                        <span style={
                                            {
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '11px',
                                                color:'#878787'
                                            }}>Ödeme Onayı Bekleyen Siparişlerinizi takip edin.</span>
                                        </a>
                                    </td>
                                    <td style={
                                        {borderRight : '1px solid #CDCDCD',
                                            textAlign: 'center',
                                            padding : '10px 5px 6px 5px',
                                            verticalAlign : 'top',
                                            fontWeight : 'normal',
                                            display: 'table-cell'
                                        }}>
                                        <a style={
                                            {textDecoration : 'underline',
                                                color: '#263056',
                                            }}>
                                    <span style={
                                        {width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '13px'
                                        }}>Tamamlandı</span>
                                        <span style={
                                            {borderBottom : '1px solid #CDCDCD',
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '24px'
                                            }}>0</span>
                                        <span style={
                                            {
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '11px',
                                                color:'#878787'
                                            }}>Müşterilerin teslim aldığı siparişleri görüntüleyin.</span>
                                        </a>
                                    </td>
                                    <td style={
                                        {
                                            textAlign: 'center',
                                            padding : '10px 5px 6px 5px',
                                            verticalAlign : 'top',
                                            fontWeight : 'normal',
                                            display: 'table-cell'
                                        }}>
                                        <a  style={
                                            {textDecoration : 'underline',
                                                color: '#263056',
                                            }}>
                                    <span style={
                                        {width : '100%',
                                            display: 'block',
                                            float : 'left',
                                            fontSize: '13px'
                                        }}>Reddedildi</span>
                                        <span style={
                                            {borderBottom : '1px solid #CDCDCD',
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '24px'
                                            }}>{this.state.iptalEdilenSiparisSayisi}</span>
                                        <span style={
                                            {
                                                width : '100%',
                                                display: 'block',
                                                float : 'left',
                                                fontSize: '11px',
                                                color:'#878787'
                                            }}>Onaylamadığınız siparişlerinizi inceleyin.</span>
                                        </a>
                                    </td>

                                </tr>
                                </tbody>


                            </table>

                        </div>
                        </Container>

                        <Container className="themed-container" fluid={true}><Card className={'mt-1 fixedCard'} style={
                            {marginBottom : '10px',
                                border : '1px solid #ddd',
                                background: '#fff',
                                padding: '10px 18px'
                            }
                        }>
                            <div style={
                                {padding : '8px 15px',
                                    background: '#e2eff9',
                                    margin:'-10px -18px 18px',
                                    textAlign: 'right'
                                }}
                            >
                               <h3 style={
                                   {float : 'left',
                                       fontSize: '16px',
                                       fontWeight : 'bold',
                                       margin : '0 0 5px',
                                       lineHeight: '1.35',
                                       color: '#0a263c'
                                   }}>Siparişler</h3>

                                <strong hidden={true} style={
                                    {marginRight : '5px',
                                        float : 'right !important',
                                        fontWeight : 'bold',
                                    }}>
                                    <a href={''} style={
                                        {textDecoration : 'underline',
                                            color : '#263056',
                                        }}>Excel İndir</a>

                                </strong>
                            </div>
                            <CardBody>
                                <HotTable  ref={this.hotTableComponent} id={'hot'}
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
                                           height={'80%'}
                                           licenseKey="non-commercial-and-evaluation"
                                           afterSelectionEnd={(r, c) => {
                                               this.selectedRowCoords.r = r;
                                               this.selectedRowCoords.c = c;

                                               this.handleSiparisDetay();
                                           }}
                                           afterRender={this.handleColumnColor}



                                />

                            </CardBody>


                        </Card></Container>


                    </Col>
                </Row>
                <Spinner/>
            </>
        )
    }
}


function mapStateToProps(state) {
    return {
        token: state.token,
        company: state.company,
        language: state.language,
        maximize: state.maximize,
        contentCSS: state.contentCSS,
        fontSize: state.topologySelectedNodeFontSize,
        spinnerToggle: state.spinnerToggle,
        order: state.order,
        cancelStatus:state.cancelStatus
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setEdit: () => dispatch(editOnToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
        setOrder: (order) => dispatch(setOrder(order)),
        setCancelStatus: (cancelStatus) => dispatch(setCancelStatus(cancelStatus))
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(WDM);