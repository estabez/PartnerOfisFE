import React from 'react';
import {connect} from "react-redux";
import MaximizeContent from "./MaximizeContent";
import {Row, Col, Card, CardBody, Button, ButtonGroup} from 'reactstrap';
import {modalImportToggle, setShowRevision} from "../redux/actions";
import SelectRegion from './SelectRegion';
import SelectRadioSite from './SelectRadioSite';
import ReactTooltip from 'react-tooltip'
import Switch from "react-switch";

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

           // console.log(response);
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

    handleChange() {
        this.props.setShowRevision();
        this.props.revision();
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
                                <Link to={'/siparisler'}>
                                    <Button
                                        style={
                                            {backgroundColor : '#007bbd',
                                                color : 'white',
                                                border: 'none',
                                                display: 'inline-block',
                                            }
                                        }
                                        text-align = {'center'}


                                        cursor = {'pointer'}>
                                        S??PAR????LER
                                    </Button>
                                </Link>

                                }
                                {editOn &&
                                <Link to={'/siparisler'}>
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
                                </Link>
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
                                <Button
                                    style={
                                        {
                                            backgroundColor: '#007bbd',
                                            color: 'white',
                                            border: 'none',
                                            display: 'inline-block',
                                            visibility:'hidden'
                                        }
                                    }
                                    text-align={'center'}


                                    cursor={'pointer'}>
                                    D????ar??ya Aktar
                                </Button>
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
        showRevision: state.showRevision
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModalImport: () => dispatch(modalImportToggle()),
        setShowRevision: () => dispatch(setShowRevision())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);