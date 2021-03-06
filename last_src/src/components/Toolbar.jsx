import React from 'react';
import {connect} from "react-redux";
import MaximizeContent from "./MaximizeContent";
import {Row, Col, Card, CardBody, Button, ButtonGroup, Alert} from 'reactstrap';
import {modalImportToggle, setShowRevision} from "../redux/actions";
import SelectRegion from './SelectRegion';
import SelectRadioSite from './SelectRadioSite';
import ReactTooltip from 'react-tooltip'
import Switch from "react-switch";
import { withRouter } from 'react-router'
// REST
import RestApiModule from '../RestApiModule'
// Alert
import AlertModule from '../AlertModule'
import {Link} from "react-router-dom";

class Toolbar extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props)

        this.restApi = new RestApiModule();
        this.alert = new AlertModule();

        this.sureCheck = this.sureCheck.bind(this);
        this.state = {
            sureCheckState: null
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        ReactTooltip.rebuild();
    }


    openImportModal() {

        const {token, setModalImport, language} = this.props

        this.restApi.callApi('getImportStatus', {
            token
        }).then(response => {

         //   console.log(response);
            const {isImportOngoing} = response;

            if (!isImportOngoing.isLock) {
                setModalImport()

            } else {
                const message = language.importSection.ongoingImportText.replace('{username}', isImportOngoing.uname);

                this.alert.showMessage(
                    'warning',
                    language.importSection.ongoingImportTitle,
                    message,
                    false)
            }
        })
    }

    openKaydetModal() {



//console.log("ssss")


    }


    handleChange() {
        this.props.setShowRevision();
        this.props.revision();
    }

    sureCheck(){
    //    console.log('originalRows' + this.props.isDataChanged)


        if(this.props.isDataChanged == true){
            return new Promise((res, rej) => {

                this.alert.getConfirmation(
                    "warning",
                    'Kaydedilmemi?? De??i??iklikler',
                    'Bu sayfadan ayr??l??rsan??z kaydedilmemi?? t??m de??i??iklikler kaybolur.'
                ).then(response => {
                    if(response == true){

                        this.props.history.push('/siparisler');


                    }


                })


                //  this.alert.showMessage('warning', 'Uyar??', "Kaydedilmemi?? Sat??rlar Mevcut. Ba??ka sayfaya ge??mek istedi??inize emin misiniz?", false);
                //

            })
        }else{
            this.props.history.push('/siparisler');
        }

    }

    render() {
        const company = localStorage.getItem('Company');
        const {language, wrapper, tooltipPlacement, showRevision, editOn, isDataExist,height} = this.props;

        if (language && this._isMounted) {


            return (
                <Card className={wrapper}>
                    <CardBody>

                        <Row>
                            <Col xs={2}>
                                <label>Giri?? Yap??lan ??irket: {company}</label>
                            </Col>

                            {company!="Sekizgen" &&
                            <Col xs={2}>


                                {!editOn &&

                                    <Button
                                        style={
                                            {backgroundColor : '#007bbd',
                                                color : 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align = {'center'}
                                        onClick={this.sureCheck}

                                        cursor = {'pointer'}>
                                        S??PAR????LER
                                    </Button>


                                }
                                {editOn &&

                                    <Button
                                        style={
                                            {backgroundColor : '#007bbd',
                                                color : 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align = {'center'}


                                        cursor = {'pointer'}
                                        disabled={true}>
                                        S??PAR????LER
                                    </Button>

                                }

                            </Col>

                            }
                            {company=="Sekizgen" &&
                            <Col xs={2}> </Col>
                            }

                            {company!="Sekizgen" &&
                            <Col xs={2}>


                                {!editOn &&
                                <Link to={'/main'}>
                                    <Button
                                        style={
                                            {
                                                backgroundColor: '#007bbd',
                                                color: 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align={'center'}


                                        cursor={'pointer'}>
                                        F??YAT/STOK G??NCELLEME
                                    </Button>
                                </Link>

                                }
                                {editOn &&
                                <Link to={'/main'}>
                                    <Button
                                        style={
                                            {
                                                backgroundColor: '#007bbd',
                                                color: 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align={'center'}


                                        cursor={'pointer'}
                                        disabled={true}>
                                        F??YAT/STOK G??NCELLEME
                                    </Button>
                                </Link>
                                }


                            </Col>
                            }
                            {company=="Sekizgen" &&
                            <Col xs={2}> </Col>
                            }
                            <Col xs={6} className="text-right tools">
                                <span className={'mr-2'}>

                                </span>

                                {
                                    <Button
                                        style={
                                            {
                                                backgroundColor: '#007bbd',
                                                color: 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align={'center'}
                                        onClick={this.props['edit']}

                                        cursor={'pointer'}>
                                        KAYDET
                                    </Button>

                                    /*
                                    Object.entries(language.matrixToolbar).map((group, ind, arr) => {
                                        return (
                                            <ButtonGroup className={'mr-2'} key={group[0]}>
                                                {group[1].map((item, key) => {

                                                    if ((item.clickEvent === 'edit' ||
                                                        item.id === 'saveOptions')) {
                                                        item.showMe = !editOn
                                                    }

                                                    // disable buttons if edit mode on
                                                    let disableAttr = false;


                                                    if (item.id !== 'saveOptions') {
                                                        return (
                                                            <Button key={key}
                                                                    data-tip={item.title}
                                                                    data-place={tooltipPlacement}
                                                                    disabled={disableAttr}
                                                                    className={item.showMe
                                                                        ? undefined
                                                                        : 'd-none'
                                                                    }
                                                                    onClick={item.clickEvent === 'import'
                                                                        ? this.openImportModal.bind(this)
                                                                        : this.props[item.clickEvent]
                                                                    }
                                                                    color={'#007bbd'}

                                                            >
                                                                <i className={`icon ${item.icon}`}/>
                                                            </Button>
                                                        )
                                                    } else if (item.id === 'saveOptions' && editOn) {

                                                        return (

                                                            <div className="dropdown" key={key}>
                                                                <Button data-tip={item.title}
                                                                        data-place={tooltipPlacement}
                                                                        color={item.btnClass}
                                                                        data-toggle="dropdown">
                                                                    <i className={`icon ${item.icon}`}/>
                                                                </Button>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    {item.children.map((child, childKey) => {

                                                                        const showOption = this.props.newRowAdded === true
                                                                            ? child.showOnNewRow
                                                                            : true;

                                                                        const divClass = `${child.class} ${
                                                                            (showOption) ? '' : ' d-none'
                                                                        }`;

                                                                        return (
                                                                            <div className={divClass}
                                                                                 onClick={this.props[child.clickEvent]}
                                                                                 key={childKey}>
                                                                                <i className={`icon ${child.icon} mr-2`}/>
                                                                                {child.title}
                                                                            </div>
                                                                        )
                                                                    })
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                                }
                                            </ButtonGroup>
                                        )
                                    })*/
                                }
                                <MaximizeContent/>
                            </Col>
                        </Row>

                    </CardBody>

                </Card>
            )
        } else {
            return (
                <></>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        language: state.language,
        editOn: state.editOn,
        maximize: state.maximize,
        tooltipPlacement: state.tooltipPlacement,
        isDataChanged:state.isDataChanged
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalImport: () => dispatch(modalImportToggle()),
        setShowRevision: () => dispatch(setShowRevision())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Toolbar));