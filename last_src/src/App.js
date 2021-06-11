import React from 'react';
import {withRouter} from 'react-router';
import {Route, Switch, HashRouter} from "react-router-dom";
import ReactTooltip from 'react-tooltip'


import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/scss/bootstrap.scss';
import './css/App.scss';
import 'handsontable/dist/handsontable.full.css';

import {connect} from 'react-redux';
import {setLang, setAuthUser, setToken} from "./redux/actions";


//Private Routing
import {PrivateRoute} from "./components/PrivateRoute";

//AuthModule
import AuthModule from './AuthModule';

// Import polling
import ImportPolling from './components/ImportPolling'

// Language file
import en from './languages/en';

// Views
import Login from './views/Login';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.authModule = new AuthModule();
    }

    componentDidMount() {
        // default lang
        this.props.setLang(en, 'en');

        const token = localStorage.getItem('e2eToken');
        const u = localStorage.getItem('user');

        if (token !== null) {
            this.authModule.registerUser(token, u);
        } else {
            this.props.setAuthUser(null)
            this.props.setToken(null)
        }
    }

    render() {

        const {authUser, location} = this.props;
        const requestedPath = location.pathname;

        if (authUser !== undefined) {
            return (
                <div className={'container-fluid'}>
                    <ReactTooltip effect={'solid'}/>
                    <HashRouter basename={process.env.PUBLIC_URL}>
                        <Switch>
                            <Route path="/" exact component={Login}/>
                            <Route path="/login" exact component={Login}/>

                            <PrivateRoute key={requestedPath} authUser={authUser} />
                        </Switch>
                    </HashRouter>
                    <ImportPolling />
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
        setAuthUser: (user) => dispatch(setAuthUser(user)),
        setToken: (token) => dispatch(setToken(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
