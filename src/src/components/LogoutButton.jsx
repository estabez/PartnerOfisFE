import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {setAuthUser, setCompany, setToken} from "../redux/actions";
import {Button} from 'reactstrap';

import store from '../redux/store';

// RestApi Connection
import RestApiModule from '../RestApiModule';

class LogoutButton extends React.Component {

    constructor(props) {
        super(props);
        this.store = store;
        this.restApi = new RestApiModule();
    }

    handleLogout() {


        this.store.dispatch(setCompany());
            //this.props.setUser();
            //this.props.setToken();
            this.props.history.push('/login')

    }

    render() {
        const {language, editOn} = this.props;

        if (language) {
            return (
                <Button color={'danger'}
                        disabled={editOn}
                        data-place={'bottom'}
                        data-tip={language.logoutButtonText}
                        onClick={this.handleLogout.bind(this)}>
                    <i className="icon icon-cross"/>
                </Button>
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
        editOn: state.editOn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: () => dispatch(setAuthUser(null)),
        setToken: () => dispatch(setToken(null))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogoutButton));