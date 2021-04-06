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

        this.state = {
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
            console.log(this.state.ColumnsInOrder)
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

            console.log(this.state.ColumnsInOrder[0])
           for(let a=0; a<jsonBig.length; a++){
               const jsonPair = response.data[a];
               for(let c=0; c<11; c++){
                   let key = this.state.ColumnsInOrder[c]
                   this.state.newArrData.push(jsonPair[key]);
               }
               this.state.data.push(this.state.newArrData);
               this.state.newArrData = [];
            }
            console.log(this.state.data)

            this.state.columns.push(this.state.newArrColumns);
            this.forceUpdate();

            this.hot = this.hotTableComponent.current.hotInstance;
            this.handsontableData = this.state.data;

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
                                           rowHeaders={true}
                                           width={'100%'}
                                           height={'100%'}
                                           licenseKey="non-commercial-and-evaluation"
                                           afterSelectionEnd={(r, c) => {
                                               this.selectedRowCoords.r = r;
                                               this.selectedRowCoords.c = c;
                                           }}
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