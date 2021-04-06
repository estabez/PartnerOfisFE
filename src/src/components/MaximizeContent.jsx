import React from 'react';
import {connect} from "react-redux";
import {setMaximize} from "../redux/actions";
import {Button} from 'reactstrap';
import ReactTooltip from 'react-tooltip'


class MaximizeContent extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        ReactTooltip.rebuild();
    }

    handleMaximize() {
        this.props.toggleMaximize();
    }

    render() {
        const {language, maximize, editOn, tooltipPlacement} = this.props;
        const toggleCSS = maximize ? 'icon icon-minimize' : 'icon icon-maximize';
        const buttonCSS = maximize ? 'btn btn-warning' : 'btn btn-light';
        const title = maximize ? language.standard : language.maximize;

        if (language) {
            return (
                <Button className={buttonCSS}
                        disabled={editOn}
                        data-place={tooltipPlacement}
                        data-tip={title}
                        onClick={this.handleMaximize.bind(this)}>
                    <i className={toggleCSS}/>
                </Button>
            )
        } else {
            return (<></>)
        }
    }
}

function mapStateToProps(state) {
    return {
        maximize: state.maximize,
        language: state.language,
        editOn: state.editOn,
        tooltipPlacement: state.tooltipPlacement
    }
}

function mapStateToDispatch(dispatch) {
    return {
        toggleMaximize: () => dispatch(setMaximize())
    }
}


export default connect(mapStateToProps, mapStateToDispatch)(MaximizeContent);