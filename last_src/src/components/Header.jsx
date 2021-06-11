import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Button, ButtonGroup} from 'reactstrap';

import LanguageButton from '../components/LanguageButton';
import LogoutButton from '../components/LogoutButton';
import logo from '../images/inwi.png';

class Header extends React.Component {

    render() {
        const {user, language, maximize, editOn} = this.props.state;

        if (language) {
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
                                <Link to={'/main'}>
                                    <Button color={'light'}
                                            data-place={'bottom'}
                                            data-tip='Ana Sayfa'>
                                        <i className={"icon icon-main"}/>
                                    </Button>
                                </Link>
                                }
                                {editOn &&
                                <Button color={'light'}
                                        disabled={true}
                                        data-place={'bottom'}
                                        data-tip='Ana Sayfa'>
                                    <i className={"icon icon-main"}/>
                                </Button>
                                }


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


                                <Button color={'light'}
                                        disabled={editOn}
                                        data-place={'bottom'}
                                        data-tip={"user.name"}>
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

export default connect(mapStateToProps)(withRouter(Header));
