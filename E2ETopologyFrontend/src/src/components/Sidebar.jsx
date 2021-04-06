import React from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {ListGroup, ListGroupItem} from 'reactstrap';
import ReactTooltip from 'react-tooltip'


class Sidebar extends React.Component {

    render() {

        const {language, maximize, authUser} = this.props;

        if (language !== null) {

            return (
                <>
                    {!maximize &&
                    <div className="col-1 sidebar pt-4 p-0">
                        <ListGroup>
                            {
                                language.routes.map((item, key) => {
                                    if (authUser.role.permittedPages.includes(item.path)) {
                                        return (
                                            <ListGroupItem key={key}
                                                           disabled={this.props.editOn}
                                                           data-place={'right'}
                                                           data-tip={item.title}>
                                                <Link to={`${item.path}`}>
                                                    <i className={item.icon}/>
                                                </Link>
                                            </ListGroupItem>
                                        )
                                    }
                                })
                            }
                        </ListGroup>
                        <ReactTooltip effect={'solid'}/>
                    </div>
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
    return {
        language: state.language,
        authUser: state.user,
        editOn: state.editOn
    }
}

export default connect(mapStateToProps)(Sidebar);