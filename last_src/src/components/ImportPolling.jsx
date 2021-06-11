/*
* Import polling hook
*
*/
import React from 'react'
import {connect} from "react-redux";

import RestApiModule from '../RestApiModule'
import {Jumbotron} from 'reactstrap';


class ImportPolling extends React.Component{

    constructor(props) {
        super(props)
        this.restApi = new RestApiModule();
        this.interval = null;
        this.intervalTime = +process.env.REACT_APP_IMPORT_POLLING_INTERVAL;
        this.state = {
            importOngoing: false,
            uname: null
        }
    }

    componentDidMount() {
        this.tickStarter();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.tickStarter();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tickStarter() {
        const {token, importPolling} = this.props;

        if (token && importPolling) {
            this.interval = setInterval(() => {
                this.tick()
            }, this.intervalTime)
        } else {
            clearInterval(this.interval);
        }
    }

    tick() {
        const {token} = this.props;
        const {importOngoing} = this.state;

        this.restApi.callApi('getImportStatus', {
            token
        }).then(response => {

            const {islock, uname} = response.isImportOngoing

            if (importOngoing !== islock) {
                this.setState({
                    importOngoing: islock,
                    uname
                })

                // if isLock variable value is false that means is before status is true.
                // So we can understand there was an import action and it's done now.
                // if this happen we need to refresh the data.
                if (!islock) document.location.reload();
            }
        })
    }

    render() {
        const {importOngoing, uname} = this.state;
        const {language} = this.props;

        if (importOngoing) {

            const message = language.importSection.ongoingImportText.replace('{username}', uname);

            return (
                <div className={'empty-data'}>
                    <Jumbotron className="empty-data-content">
                        <h1 className="display-5">{language.importSection.ongoingImportTitle}</h1>
                        <hr/>
                        <p className="lead">{message}</p>
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
        token: state.token,
        language: state.language,
        importPolling: state.importPolling
    }
}

export default connect(mapStateToProps)(ImportPolling)
