import React, {createRef} from 'react';
import {connect} from "react-redux";
import Axios from 'axios';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import {Row, Col, Card, CardBody, CardFooter} from 'reactstrap';
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import RestApiModule from '../RestApiModule';
import ModalSevkiyat from "../components/ModalSevkiyat";

import {
    editOnToggle,
    modalSevkiyatToggle,
    spinnerToggle,
    setEditedRows,
    setOriginalRows,
    setOrder,
    setIsDataChanged, setCompany
} from "../redux/actions";

import Toolbar from '../components/Toolbar';
import AlertModule from '../AlertModule'
import Spinner from "../components/Spinner";
import store from "../redux/store";


class WDM extends React.Component {
    _isMounted = false;

    constructor(props) {

        super(props);
        this.store = store;
        this.hotTableComponent = createRef();
        this.hot = null;
        this.columns = [];
        this.restApi = new RestApiModule();

        this.addInput = this.addInput.bind(this);

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
            a:"b",
            columns: [
            ],
            data: [
            ],
            newArrColumns: [],
            ColumnsInOrder: ["SKU","Tedarikçi SKU","Ürün İsmi", "Liste Fiyatı", "Satış Fiyatı", "İnd.Oran(%)", "Stok Adet", "T.Adet","T.Sıra", "Ürt.Tar.", "Hz.Sr."],
            newArrData: [],
            newArrDataForPair: [],
            columnOptions: []
        };
    }

    componentDidMount() {
        this.hot = this.hotTableComponent.current.hotInstance;

      //  console.log(this.hotTableComponent)

        this.state.a = this.hot

        this.store.dispatch(setIsDataChanged(false));
        const company = localStorage.getItem('Company');

        this.props.setSpinner();
        this.restApi.callApi('exceldata', {
            company: company,
        }).then(response => {


            const json = response.data[0];
            const jsonBig = response.data;
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    this.state.newArrColumns.push(key);

                }
            }
        //    console.log(this.state.ColumnsInOrder)
/*
            for(let a=0; a<jsonBig.length; a++){
                const jsonPair = response.data[a];
                console.log(jsonPair)
                for(let key in jsonPair){
                    console.log(key)
                    if (jsonPair.hasOwnProperty(key)) {
                        this.state.newArrData.push(jsonPair[key]);
                    }
                }
                this.state.data.push(this.state.newArrData);
                this.state.newArrData = [];
            }
            */

          //  console.log(this.state.ColumnsInOrder[0])
           for(let a=0; a<jsonBig.length; a++){
               const jsonPair = response.data[a];
               for(let c=0; c<11; c++){
                   let key = this.state.ColumnsInOrder[c]
                   this.state.newArrData.push(jsonPair[key]);

               }
               this.state.data.push(this.state.newArrData);
               this.state.newArrData = [];
            }
         //   console.log(this.state.data)



            this.handsontableData = this.state.data;

            this.state.columns.push(this.state.newArrColumns);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const firstOfYear = new Date(now.getFullYear(), 0, 1);
            const numOfWeek = Math.ceil((((today - firstOfYear) / 86400000)-1)/7);
         //   console.log(numOfWeek)

            this.arrayForDropdown.push("Son 1 yıl içerisinde üretilmiştir.");
            for(let b=1; b<numOfWeek+1; b++){
                this.arrayForDropdown.push(this.today.getFullYear() + "  " + b + ". Hafta" );
            }
            for(let c=0; c<12; c++){
                this.arrayForDropdown.push( this.today.getFullYear()-1 + "  " + this.monthNames[c])
            }
                for(let a = 0; a<10;a++){
                    this.arrayForDropdown.push(this.today.getFullYear()-a);
                }



            this.columns = [
                {readOnly: true},
                {},
                {readOnly: true},{readOnly: true},{},{},{},{readOnly: true},{readOnly: true},{
                    type: 'dropdown',
                    source: this.arrayForDropdown
                },{
                    type: 'numeric'
                }
            ];


            this.handsontableDataBackup = JSON.parse(JSON.stringify(this.handsontableData));
            this.forceUpdate();


            //this.hot.setCellMeta(1, 4, "className", 'bg-primary text-white');
            //this.hot.render();
           /* var rows=this.hot.countRows();  // get the count of the rows in the table
            var cols=this.hot.countCols();  // get the count of the columns in the table.
            for(var row=0; row<rows; row++){  // go through each row of the table

                    var cell = this.hot.getCell(row,1);
                    cell.style.background = "#00FF90";

            }

            console.log(this.hot.getSettings())*/

          //  this.hot.render();








        }).catch((err) => {
    console.log(err);
})

        this.props.setSpinner();

/*
        //console.log(this.state.columns);
        Axios({

            method: 'POST',
            url: `http://localhost:8777/test-jersey-rest-maven-tomcat/rest/testservice/test12/`,
            data: null,
            headers: {
                'Content-Type' : 'application/json'
            }
        }).then(async (response) => {
            console.log("aaaa");

            const json = response.data[0].variants[0];
            const jsonBig = response.data[0].variants;
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    this.state.newArrColumns.push(key);
                }
            }

            for(let a=0; a<jsonBig.length; a++){
                const jsonPair = response.data[0].variants[a];
                for(let key in jsonPair){
                    if (jsonPair.hasOwnProperty(key)) {
                        this.state.newArrData.push(jsonPair[key]);
                    }
                }
                this.state.data.push(this.state.newArrData);
                this.state.newArrData = [];
            }
            this.state.columns.push(this.state.newArrColumns);
            this.forceUpdate();

        }).catch((err) => {
            console.log(err);
        })*/
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


        let differentRowsWillSend = [];


        for(let a=0; a< this.handsontableDataBackup.length; a++){

            if(this.handsontableDataBackup[a].toString() != this.handsontableData[a].toString()){
               // console.log(a + ":: index esit degil")
                differentRowsWillSend.push(a);

            }

        }
      //  console.log(differentRowsWillSend);
        this.store.dispatch(setOriginalRows(differentRowsWillSend));
        this.store.dispatch(setEditedRows(this.handsontableData));


        const rows = []

        for(let b = 0; b < differentRowsWillSend.length; b++){
          //  console.log(this.handsontableData[differentRowsWillSend[b]])
            rows.push(this.handsontableData[differentRowsWillSend[b]]);
        }
      //  console.log(rows)
        let finalData = {};

        this.state.ColumnsInOrder.forEach((v,i) => {
            finalData[v] = rows[i+1]
        });

      //  console.log(finalData)

        const company = localStorage.getItem('Company');

        this.restApi.callApi('SaveMultipleRow', {
           rows: rows,
            company: company

        }).then(response => {


          //  console.log(response)






        }).catch((err) => {
            console.log(err);
            this.props.setSpinner();
        })



        this.props.setModalSevkiyat();


        this.hot.loadData(this.handsontableData);
        this.hot.render();


    }


    handleCancelClick() {

        this.handsontableData = JSON.parse(JSON.stringify(this.handsontableDataBackup));
        this.hot.loadData(this.handsontableData);
        this.hot.render();

        // Change edit mode on redux
        this.props.setEdit();

    }




    handleAfterChangeFunction(r,c){



        if(r !=null){
            //console.log(r)
            var changedR = r.toString().split(',');
            let changedRowNumber = changedR[0];
            let changedColumnNumber = changedR[1];

            //console.log(changedR[3])
            if(changedR[1] == '4') {



                if(changedR[3] != '0' && changedR[3] != '-' && changedR[3] != 'null' && !isNaN(Number(changedR[3]))){
                    this.store.dispatch(setIsDataChanged(true));
                    this.hot.setCellMeta(changedRowNumber, changedColumnNumber, "className", 'changedCellBG');
                    this.hot.render();
                }else{

                    this.alert.showMessage(
                        'warning',
                        "Uyarı",
                        "Satış Fiyatı 0 olamaz",
                        false)

                    this.hot.setDataAtCell(parseInt(changedRowNumber, 10),parseInt(changedColumnNumber, 10),changedR[2].toString());
                    this.hot.setCellMeta(parseInt(changedRowNumber, 10),parseInt(changedColumnNumber, 10),"className", 'NotchangedCellBG')
                    this.hot.render();
                }
            }else{
                this.store.dispatch(setIsDataChanged(true));
                this.hot.setCellMeta(changedRowNumber, changedColumnNumber, "className", 'changedCellBG');
                this.hot.render();
            }



        }

    }

    handleSaveClick() {
   //   console.log("aaaa")
        const {r, c} = this.editedRowCoords;
        let data = this.hot.getDataAtRow(r);
      //  console.log(data);
      //  console.log(this.state.ColumnsInOrder);

       let finalData = {};

        this.state.ColumnsInOrder.forEach((v,i) => {
           finalData[v] = data[i]
       });

      //  console.log(finalData);

        const company = localStorage.getItem('Company');
      //  console.log(company);
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

    resetRow(r) {
        const colCount = this.hot.countCols();
        for (let x = 0; x <= colCount; x++) {

            this.hot.setCellMeta(r, x, "editor", false);
            this.hot.setCellMeta(r, x, "className", 'bg-primary text-white');
        }
        this.hot.render();
        this.setState({ newRowAdded : false});
    }


    addInput(col, TH) {



        if (typeof col !== 'number') {
            return col;
        }

        if (col >= 0 && TH.childElementCount < 2) {

            var div = document.createElement('div');
            var input = document.createElement('input');

            div.className = 'filterHeader';


            var filtersPlugin = this.state.a.getPlugin('filters');

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


    doNotSelectColumn(event, coords){
        if (coords.row === -1 && event.target.nodeName === 'INPUT') {
            event.stopImmediatePropagation();
            this.deselectCell();
        }
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
                                           height={'100%'}
                                           licenseKey="non-commercial-and-evaluation"
                                           afterSelectionEnd={(r, c) => {
                                               this.selectedRowCoords.r = r;
                                               this.selectedRowCoords.c = c;
                                           }}
                                           afterGetColHeader={this.addInput}
                                           beforeOnCellMouseDown={this.doNotSelectColumn}
                                           columnHeaderHeight={55}
                                           afterChange={(r, c) => this.handleAfterChangeFunction(r)}
                                />

                            </CardBody>


                        </Card>
                    </Col>
                </Row>
                <ModalSevkiyat/>
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
        originalRows: state.originalRows,
        editedRows: state.editedRows,
        isDataChanged: state.isDataChanged
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setEdit: () => dispatch(editOnToggle()),
        setSpinner: () => dispatch(spinnerToggle()),
        setModalSevkiyat: () => dispatch(modalSevkiyatToggle()),
        setOriginalRows: () => dispatch(setOriginalRows()),
        setEditedRows: () => dispatch(setEditedRows()),
        setIsDataChanged: () => dispatch(setIsDataChanged()),
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(WDM);