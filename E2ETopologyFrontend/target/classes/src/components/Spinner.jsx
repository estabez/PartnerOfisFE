import React from 'react';
import {connect} from "react-redux";

import spinner from '../images/spinner.svg';
import { spinnerToggle} from "../redux/actions";




class Spinner extends React.Component {

    render() {

        if(this.props.open) {return (
            <div className={'spinner'}>
                <img src={spinner}/>
            </div>
        )
        }else{
            return (<></>)
        }

    }
}

function mapStateToProps(state) {
    return {
        open: state.spinnerToggle,
    }
}


export default connect(mapStateToProps)(Spinner);