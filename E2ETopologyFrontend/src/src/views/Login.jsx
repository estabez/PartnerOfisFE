import React from 'react';
import {connect} from "react-redux";
import axios from 'axios';
import {withRouter} from 'react-router-dom';

// User Privileges for accessible pages
import RoleModule from '../RoleModule';

import LanguageButton from '../components/LanguageButton';
import {setAuthUser, setToken} from "../redux/actions";
import Copyright from "../components/Copyright";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginError: false
        }

        this.roleModule = new RoleModule();
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit() {
        this.setState({loginError: !this.validateForm()})
        //if (!this.state.loginError) {
        if (this.validateForm()) {

            const role = this.roleModule.getRole("Admin");

            const user = {
                name: "Demo User",
                role
            };

            this.props.setUser(user);
            this.props.setToken('RrhzQx5fyZq0JzuDViRaXU1Eb8mpSoj9');

            this.props.history.push(role.mainPage);

            /*axios({
                method: "POST",
                url: `${this.props.serverPath}/AuthenticationService/Login/${this.state.username}`,
                data: {
                    username: this.state.username,
                    password: this.state.password
                }
            }).then((response) => {

                console.log(response.data);
                this.props.setAuthUser(response.data, true);
                localStorage.setItem('e2eToken', "true");

                if (history) history.push("/matrix");

            }).catch((err) => {
                console.log(err);

                this.props.setAuthUser({}, false);
                this.setState({loginError: true});
            })*/
        }
    }

    render() {
        const {language} = this.props;

        if (language !== null) {
            return (
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-10 col-md-4 mx-auto">
                        <div className="card login-card">
                            <div className="card-body text-center">
                                <div className="row">
                                    <div className="col-8">
                                        <div className='logo'/>
                                    </div>
                                    <div className="col-4 text-right">
                                        <LanguageButton buttonClass={'btn btn-sm btn-outline-dark'}/>
                                    </div>
                                </div>
                                <hr/>

                                <h3>{language.welcomeTo}</h3>
                                <h1 className={'mb-3'}>{language.appName}</h1>

                                <div className="form-group">
                                    <input type="text" name={'username'}
                                           className="form-control form-control-lg"
                                           onChange={this.handleChange.bind(this)}
                                           placeholder={language.usernameInput}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" name={'password'}
                                           className="form-control form-control-lg"
                                           onChange={this.handleChange.bind(this)}
                                           placeholder={language.passwordInput}/>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-lg btn-primary btn-block"
                                            onClick={this.handleSubmit.bind(this)}>
                                        <i className="icon icon-arrow-right mr-2"/>
                                        {language.loginButtonText}
                                    </button>
                                    {/*<LoginButton></LoginButton>*/}
                                </div>

                                {this.state.loginError &&
                                <div className="alert alert-danger text-left">
                                    <i className="icon icon-triangle-warning mr-2"/>
                                    {language.loginError}
                                </div>
                                }
                            </div>
                            <div className="card-footer text-right">
                                <Copyright/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return <></>;
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        lang: state.lang,
        serverPath: state.serverPath,
    }
}

function mapStateToDispatch(dispatch) {
    return {
        setUser: (user) => dispatch(setAuthUser(user)),
        setToken: (token) => dispatch(setToken(token))
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(withRouter(Login));