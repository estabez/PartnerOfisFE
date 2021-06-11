import React, {createRef} from 'react';
import {connect} from "react-redux";
import Axios from 'axios';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import {Row, Col, Card, CardBody, CardFooter} from 'reactstrap';
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import RestApiModule from '../RestApiModule';

import {editOnToggle, spinnerToggle} from "../redux/actions";

import Toolbar from '../components/Toolbar';
import AlertModule from '../AlertModule'

class WDM extends React.Component {
    _isMounted = false;

    constructor(props) {

        super(props);
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
            ColumnsInOrderByAPI: ["company","purchaseOrderNumber", "purchaseOrderStatusId", "purchaseOrderFulfillmentStatusId", "sku","title", "müsteri","teslimAlan","adet","iAdet","tutar","gelentutar","gelenmtb","iademtb","fiyatfarkmtb"],

            ColumnsInOrder: ["Tedarikçi","SAS No", "Drm", "Sevk Drm","Sku", "Ürün Adı", "Müşteri", "T. Alan","Adet","i.adet","Tutar","Gelen Tutar","Gelen Mtb","İade Mtb","Fiyat-Fark Mtb"],
            newArrData: [],
            newArrDataForPair: [],
            columnOptions: []
        };
    }

    componentDidMount() {

        const company = localStorage.getItem('Company');

        this.props.setSpinner();

        this.restApi.callApi('GetFaturalar', {
            company: company,
        }).then(response => {

            console.log(response)
            const json = response.data[0];
            const jsonBig = response.data;
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    this.state.newArrColumns.push(key);

                }
            }
            console.log(this.state.newArrColumns)
            console.log(this.state.ColumnsInOrderByAPI)
            for(let a=0; a<jsonBig.length; a++){
                const jsonPair = response.data[a];
                let items = jsonPair["items"];
                const itemsJSONObject = JSON.parse(items);
                const itemsPair = itemsJSONObject[0];
                let billing = jsonPair["billingAddress"];
                const billingJSONObject = JSON.parse(billing);

                for(let c=0; c<15; c++){
                    let key = this.state.ColumnsInOrderByAPI[c]

                    if(key == "purchaseOrderStatusId"){

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
                    }else if(key == "generatedAt"){
                        const formattedDate = new Date(parseInt(jsonPair[key]))
                        const formattedDateTime = formattedDate.getDate() + "." +((formattedDate.getMonth())+1) + "." + formattedDate.getFullYear().toString().substr(-2)+ " " + formattedDate.getHours() +  ":" + formattedDate.getMinutes();
                        this.state.newArrData.push(formattedDateTime);
                    }else if (key == "sku"){
                        this.state.newArrData.push(itemsPair["sku"]);
                    }else if (key == "title"){
                        this.state.newArrData.push(itemsPair["title"]);
                    }else if (key == "müsteri"){
                        this.state.newArrData.push(billingJSONObject["name"]);
                    }else if (key == "teslimAlan"){
                        this.state.newArrData.push("--");
                    }else if (key == "adet"){
                        this.state.newArrData.push(itemsPair["quantity"]);
                    }else if (key == "iAdet"){
                        this.state.newArrData.push("--");
                    }else if (key == "iAdet"){
                        this.state.newArrData.push(itemsPair["quantity"]);
                    }else if (key == "tutar"){
                        this.state.newArrData.push(itemsPair["cost"]);
                    }else {
                        this.state.newArrData.push(jsonPair[key]);
                    }


                }
                this.state.data.push(this.state.newArrData);

                this.state.newArrData = [];
            }
         //   console.log(this.state.data)
            this.hot = this.hotTableComponent.current.hotInstance;
            this.handsontableData = this.state.data;

           // console.log(this.props.order)
            this.state.columns.push(this.state.newArrColumns);

            this.columns = [
                { readOnly:true}, { readOnly:true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: true},{readOnly: false},{readOnly: false},{readOnly: false},{readOnly: false}
            ];

           // console.log(this.hot.getDataAtCell(1,0))

            //console.log(this.hot);
            this.props.setSpinner();

        }).catch((err) => {
            console.log(err);
            this.props.setSpinner();
        })




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
        let columnscolor4 = document.querySelectorAll('.ht_master tr > td:nth-child(11)');
        for (let o= 0; o < columnscolor4.length; o++) {

            columnscolor4[o].style.backgroundColor = 'white';
        }
        let columnscolor5 = document.querySelectorAll('.ht_master tr > td:nth-child(12)');
        for (let o= 0; o < columnscolor5.length; o++) {

            columnscolor5[o].style.backgroundColor = 'white';
        }
        let columnscolor6 = document.querySelectorAll('.ht_master tr > td:nth-child(13)');
        for (let o= 0; o < columnscolor6.length; o++) {

            columnscolor6[o].style.backgroundColor = '#68f789';
        }
        let columnscolor7 = document.querySelectorAll('.ht_master tr > td:nth-child(14)');
        for (let o= 0; o < columnscolor7.length; o++) {

            columnscolor7[o].style.backgroundColor = '#68f789';
        }
        let columnscolor8 = document.querySelectorAll('.ht_master tr > td:nth-child(15)');
        for (let o= 0; o < columnscolor8.length; o++) {

            columnscolor8[o].style.backgroundColor = '#68f789';
        }
        let columnscolor9 = document.querySelectorAll('.ht_master tr > td:nth-child(16)');
        for (let o= 0; o < columnscolor9.length; o++) {

            columnscolor9[o].style.backgroundColor = '#68f789';
        }
    }
    setCellProperties(r, c) {

        const colCount = this.hot.countCols();
        let col = c !== null ? c : 0;


        for (let x = 0; x <= colCount; x++) {
            const {prop, readOnly, readOnlyInEditMode} = this.hot.getCellMeta(r,x);



                    const type = this.hot.getDataType(r, x); // get cell type from loaded map


                    col = col === 0 ? x : col; // when add new row find first editable col.

                    this.hot.setCellMeta(r, x, "editor", type);
                    this.hot.setCellMeta(r, x, "className", 'bg-warning text-dark');


        }
        this.hot.render();
        this.hot.selectCell(r, col);
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
        this.restApi.callApi('SaveFatura', {
            row: finalData,
            company: company
        }).then(response => {

        const saveResult = response.exec_status;

        if(saveResult == "success"){
            this.alert.showMessage("success",
                "Kayıt Başarılı",
                response.POnumber + " için kayıt başarılı",
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

    resetRow(r) {
        const colCount = this.hot.countCols();
        for (let x = 0; x <= colCount; x++) {

            this.hot.setCellMeta(r, x, "editor", false);
            this.hot.setCellMeta(r, x, "className", 'bg-primary text-white');
        }
        this.hot.render();
        this.setState({ newRowAdded : false});
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
                        <Card className={'mt-1 fixedCard'}>
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
                                           height={'99%'}
                                           licenseKey="non-commercial-and-evaluation"
                                           afterSelectionEnd={(r, c) => {
                                               this.selectedRowCoords.r = r;
                                               this.selectedRowCoords.c = c;
                                           }}
                                           afterRender={this.handleColumnColor}
                                />

                            </CardBody>


                        </Card>
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

export default connect(mapStateToProps,mapDispatchToProps)(WDM);