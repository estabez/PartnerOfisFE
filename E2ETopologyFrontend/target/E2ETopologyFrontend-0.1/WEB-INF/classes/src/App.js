import React from 'react';
import {withRouter} from 'react-router';
import {BrowserRouter, Route, Switch, HashRouter} from "react-router-dom";

import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.css';
import './css/App.scss';
import 'handsontable/dist/handsontable.full.css';

import {connect} from 'react-redux';
import {setLang, setAuthUser} from "./redux/actions";


//Private Routing
import {PrivateRoute} from "./components/PrivateRoute";

// User Privileges for accessible pages
import RoleModule from './RoleModule';

// Language file
import en from './languages/en';

// Views
import Login from './views/Login';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.roleModule = new RoleModule();
    }

    componentDidMount() {
        // default lang
        this.props.setLang(en, 'en');

        const token = localStorage.getItem('e2eToken');

        if (token !== null) {

            const role = this.roleModule.getRole("Admin");

            const user = {
                name: "Demo User",
                role
            };

            this.props.setAuthUser(user)
        } else {
            this.props.setAuthUser(null)
        }
    }

    render() {

        const {authUser, location} = this.props;
        const requestedPath = location.pathname;


        if (authUser !== undefined) {
            return (
                <div className={'container-fluid'}>
                    <HashRouter basename={process.env.PUBLIC_URL}>
                        <Switch>
                            <Route path="/" exact component={Login}/>
                            <Route path="/login" exact component={Login}/>

                            <PrivateRoute key={requestedPath} authUser={authUser} />
                        </Switch>
                    </HashRouter>
                </div>
            )
        } else {
            return <></>;
        }
    }
}

function mapStateToProps(state) {
    return {
        lang: state.lang,
        language: state.language,
        maximize: state.maximize,
        authUser: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setLang: (langFile, lang) => dispatch(setLang(langFile, lang)),
        setAuthUser: (user) => dispatch(setAuthUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
