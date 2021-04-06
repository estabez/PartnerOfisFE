import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Jumbotron, Button} from 'reactstrap';

class EmptyDataset extends React.Component {


    render() {
        const {language, page, showButton, authUser} = this.props;

        if (language) {
            return (
                <div className={'empty-data'}>
                    <Jumbotron className="empty-data-content">
                        <h1 className="display-5">{language.emptyDataSet[page].title}</h1>
                        <p className="lead">{language.emptyDataSet[page].spot}</p>
                        <hr className="my-2"/>
                        <p>{language.emptyDataSet[page].text}</p>

                        {(showButton && authUser) &&
                        <p>
                            <Link to={authUser.role.mainPage}>
                                <Button color={'primary'}>
                                    <i className="icon icon-arrow-left mr-2"/>
                                    {language.backTo}
                                </Button>
                            </Link>
                        </p>
                        }
                    </Jumbotron>
                </div>
            )
        } else {
            return (<></>)
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        authUser: state.user
    }
}

export default connect(mapStateToProps)(EmptyDataset);