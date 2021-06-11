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

import {editOnToggle, spinnerToggle} from "../redux/actions";

import Toolbar from '../components/Toolbar';
import AlertModule from '../AlertModule'

import JsonTable from "ts-react-json-table";

class Vendor extends React.Component {
    _isMounted = false;

    constructor(props) {

        super(props);
        this.hotTableComponent = createRef();
        this.hot = null;
        this.columns = [];
        this.items = [
            {"id": 75950,"name": "Louella Wallace","age": 24,"phone": "+44 (0)203 437 7302","color": "green"},
            {"id": 80616,"name": "Hanson Perry","age": 36,"phone": "+44 (0)203 279 3708","color": "brown"},
            {"id": 77621,"name": "Brandi Long","age": 20,"phone": "+44 (0)203 319 4880","color": "gray"},
            {"id": 81299,"name": "Tonia Sykes","age": 38,"phone": "+44 (0)208 328 3671","color": "blue"},
            {"id": 14225,"name": "Leach Durham","age": 23,"phone": "+44 (0)208 280 9572","color": "green"}
        ];
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
            ColumnsInOrder: ["SAS No","SAS Tarihi","Müşteri Adı", "Durum", "Toplam Ödenecek"],
            newArrData: [],
            newArrDataForPair: [],
            columnOptions: []
        };
    }

    componentWillMount() {

        this.handleColumnColor();
    }

    componentDidMount() {

        const company = localStorage.getItem('Company');

        this.props.setSpinner();
        this.restApi.callApi('getSiparisData', {
            company: company,
        }).then(response => {


            const json = response.data[0];
            const jsonBig = response.data;

            //this.items.push(response.data);

            console.log(this.items)
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    this.state.newArrColumns.push(key);

                }
            }
            console.log(this.state.newArrColumns)
            console.log(this.state.ColumnsInOrder)

            console.log(this.state.ColumnsInOrder[0])
           for(let a=0; a<jsonBig.length; a++){
               const jsonPair = response.data[a];
               for(let c=0; c<5; c++){
                   let key = this.state.ColumnsInOrder[c]
                   this.state.newArrData.push(jsonPair[key]);

               }
               this.state.data.push(this.state.newArrData);
               this.state.newArrData = [];
            }
            console.log(this.state.data)

            this.hot = this.hotTableComponent.current.hotInstance;
            this.handsontableData = this.state.data;

            this.state.columns.push(this.state.newArrColumns);

            this.columns = [
                {readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true}
            ];


            this.handleColumnColor();

            this.forceUpdate();
            this.handleColumnColor();

            console.log(jsonBig.length);

            /*
            for(let k=0; k<jsonBig.length; k++){

                const route1 =  21 ;

               this.state.data[k][0]= "<a href='http://localhost:3000/PartnerOfis/#/PartnerOfis/main'{route1}>Detay Gör</a>";

            }
            */
             
            console.log(this.state.data)


        }).catch((err) => {
    console.log(err);
})

        this.props.setSpinner();

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
    }

    handleCancelClick() {

        this.handsontableData = JSON.parse(JSON.stringify(this.handsontableDataBackup));
        this.hot.loadData(this.handsontableData);
        this.hot.render();

        // Change edit mode on redux
        this.props.setEdit();

    }


    handleSaveClick() {
        console.log("aaaa")
        const {r, c} = this.editedRowCoords;
        let data = this.hot.getDataAtRow(r);
        console.log(data);
        console.log(this.state.ColumnsInOrder);

        let finalData = {};

        this.state.ColumnsInOrder.forEach((v,i) => {
            finalData[v] = data[i]
        });

        console.log(finalData);

        const company = localStorage.getItem('Company');
        console.log(company);
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
                                background: '#c8f3a8',
                            }}
                            >

                        <span>Güncel Sipariş Durumu</span>
                        </div>

                        <div>
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
                                    <a href={''} style={
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
                                        }}>0</span>
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
                                        <a href={''} style={
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
                                            }}>0</span>
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
                                        <a href={''} style={
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
                                        <a href={''} style={
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
                                        <a href={''} style={
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
                                            }}>0</span>
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
                                    background: '#c8f3a8',
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

                                <strong  style={
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
                                <JsonTable rows = {this.items} />

                            </CardBody>


                        </Card></Container>


                    </Col>
                </Row>

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
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setEdit: () => dispatch(editOnToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(Vendor);