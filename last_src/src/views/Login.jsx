import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {Row, Col, Card, CardBody, CardFooter, FormGroup, Button, Alert} from 'reactstrap';

// RestApi Connection
import RestApiModule from '../RestApiModule';

//Crypto Module
import CryptoModule from '../CryptoModule';

//AuthModule
import AuthModule from '../AuthModule';

import LanguageButton from '../components/LanguageButton';
import Copyright from "../components/Copyright";
import Spinner from '../components/Spinner';

import {setAuthUser, setToken, spinnerToggle, setCompany} from "../redux/actions";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginError: false
        }

        this.restApi = new RestApiModule();
        this.crypto = new CryptoModule();
        this.authModule = new AuthModule();
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit() {
        this.setState({loginError: !this.validateForm()})

        if (this.validateForm()) {
            this.props.setSpinner();

            this.authModule.login(
                this.state.username,
                this.state.password
            ).then(() => {
                console.log("ar");
                this.props.setSpinner();

                if(this.state.username == "yasemin"){
                    this.props.history.push('/fatura');
                }else{
                    this.props.history.push('/main');
                }


            }).catch((e) => {
                //console.log(e)
                this.props.setSpinner();

            })
        }
    }

    handleEnter(e) {
        const {charCode, keyCode} = e;

        if (charCode === 13 || keyCode === 13)
            this.handleSubmit();
    }

    render() {
        const {language} = this.props;

        if (language !== null) {
            return (
                <Row className="h-100 justify-content-center align-items-center">
                    <Col xs={12} sm={8} md={4} className="mx-auto">
                        <Card className="login-card">
                            <CardBody className="text-center">
                                <Row>
                                    <Col xs={8}>

                                    </Col>
                                    <Col xs={4} className={'text-right'}>

                                    </Col>
                                </Row>
                                <hr/>

                                <h3>{language.welcomeTo}</h3>
                                <h1 className={'mb-3'}>{language.appName}</h1>

                                <FormGroup>
                                    <input type="text" name={'username'}
                                           className="form-control form-control-lg"
                                           onChange={this.handleChange.bind(this)}
                                           onKeyPress={this.handleEnter.bind(this)}
                                           placeholder={language.usernameInput}/>
                                </FormGroup>
                                <FormGroup>
                                    <input type="password" name={'password'}
                                           className="form-control form-control-lg"
                                           onChange={this.handleChange.bind(this)}
                                           onKeyPress={this.handleEnter.bind(this)}
                                           placeholder={language.passwordInput}/>
                                </FormGroup>
                                <FormGroup>
                                    <Button color={'primary'} block={true} size={'lg'}
                                            onClick={this.handleSubmit.bind(this)}>
                                        <i className="icon icon-arrow-right mr-2"/>
                                        {language.loginButtonText}
                                    </Button>
                                </FormGroup>

                                {this.state.loginError &&
                                <Alert color={'danger'}>
                                    <i className="icon icon-triangle-warning mr-2"/>
                                    {language.loginError}
                                </Alert>
                                }
                            </CardBody>
                            <CardFooter className="text-right">
                                <Copyright/>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Spinner/>
                </Row>
            )
        } else {
            return <></>;
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
    }
}

function mapStateToDispatch(dispatch) {
    return {
        setUser: (user) => dispatch(setAuthUser(user)),
        setToken: (token) => dispatch(setToken(token)),
        setCompany: (company) => dispatch(setCompany(company)),
        setSpinner: () => dispatch(spinnerToggle()),
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(Login));