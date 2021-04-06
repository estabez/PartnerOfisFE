import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {Button, ButtonGroup} from 'reactstrap';

import {connect} from "react-redux";
import {setAuthUser, setToken} from "../redux/actions";

import LanguageButton from '../components/LanguageButton';
import LogoutButton from '../components/LogoutButton';

import logo from '../images/inwi.png';

class Header extends React.Component {

    navLink(props) {
        if (props.editOn) {
            return (
                <Button color={'light'}
                        disabled={true}
                        data-place={'bottom'}
                        data-tip={props.helpButtonText}>
                    <i className={"icon icon-help"}/>
                </Button>
            )
        } else {
            return (
                <Link to={'/help'}>
                    <Button color={'light'}
                            data-place={'bottom'}
                            data-tip={props.helpButtonText}>
                        <i className={"icon icon-help"}/>
                    </Button>
                </Link>
            )
        }
    }

    render() {
        const {user, language, maximize, editOn} = this.props.state;
        const userDisplay = (user !== undefined && user !== null)
            ? user.name
            : 'Demo user'; // just for demo

        if (language !== null) {
            return (
                <>
                    {!maximize &&
                    <header className="row p-0">

                        <div className="col-4 col-md-2 pt-3">
                            <img src={logo} alt={language.appName}
                                 className="img-fluid d-md-none"/>
                            <div className="logo d-none d-md-flex"/>

                        </div>

                        <div className="col-8 col-md-6 offset-md-4 p-0 text-right">

                            <ButtonGroup className={'user-info'}>

                                {!editOn &&
                                <Link to={'/help'}>
                                    <Button color={'light'}
                                            data-place={'bottom'}
                                            data-tip={language.helpButtonText}>
                                        <i className={"icon icon-help"}/>
                                    </Button>
                                </Link>
                                }
                                {editOn &&
                                <Button color={'light'}
                                        disabled={true}
                                        data-place={'bottom'}
                                        data-tip={language.helpButtonText}>
                                    <i className={"icon icon-help"}/>
                                </Button>
                                }

                                <LanguageButton buttonClass={'btn btn-light'} />
                                <Button color={'light'}
                                        disabled={editOn}
                                        data-place={'bottom'}
                                        data-tip={userDisplay}>
                                    <i className="icon icon-avatar"/>
                                </Button>
                                <LogoutButton/>
                            </ButtonGroup>
                        </div>
                    </header>
                    }
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }
}

function mapStateToProps(state) {
    return {state}
}

function mapDispatchToProps(dispatch) {
    return {
        logoutAction: () => dispatch(
            setAuthUser(null),
            setToken(null)
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
