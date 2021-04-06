import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {setAuthUser, setToken} from "../redux/actions";
import {Button} from 'reactstrap';

class LogoutButton extends React.Component {

    handleLogout() {

        this.props.setUser();
        this.props.setToken();
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