import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Copyright from '../components/Copyright'

class NotFound extends React.Component {

    render() {
        const {language, authUser} = this.props;

        if (language) {
            return (
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-11 col-md-8 mx-auto">

                        <div className='logo mb-5'/>

                        <div className={'http-status-bg'}>403</div>

                        <h2 className={'mb-4'}>{language.forbiddenAccess}</h2>
                        <p>
                            <Link to={authUser.role.mainPage}>
                                <button className="btn btn-outline-primary">
                                    <i className="icon icon-arrow-left mr-2"/>
                                    {language.backTo}
                                </button>
                            </Link>
                        </p>

                        <h5 className={'mt-5'}>
                            <Copyright/>
                        </h5>

                    </div>
                </div>
            );
        } else {
            return(
              <></>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        authUser: state.user
    }
}

export default connect(mapStateToProps) (NotFound);