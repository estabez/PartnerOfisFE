import React from 'react';
import {connect} from "react-redux";
import {setMaximize} from "../redux/actions";
import {Button} from 'reactstrap';

class MaximizeContent extends React.Component {

    handleMaximize() {
        this.props.toggleMaximize();
    }

    render() {
        const {language, maximize, editOn} = this.props;
        const toggleCSS = maximize ? 'icon icon-minimize' : 'icon icon-maximize';
        const buttonCSS = maximize ? 'btn btn-warning ml-3' : 'btn btn-light ml-3';

        if (language) {
            return (
                <Button className={buttonCSS}
                        disabled={editOn}
                        data-placement={'top'}
                        data-tip={language.maximize}
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
        editOn: state.editOn
    }
}

function mapStateToDispatch(dispatch) {
    return {
        toggleMaximize: () => dispatch(setMaximize())
    }
}


export default connect(mapStateToProps, mapStateToDispatch)(MaximizeContent);