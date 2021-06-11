import React from 'react';
import {connect} from "react-redux";
import {Input} from 'reactstrap';
import {setSelectedRadioSite} from "../redux/actions";

class SelectRadioSite extends React.Component {

    async handleSelectedRadio(ev) {
        let val = ev.target.value;

        val = +val === 0 ? null : val; // if nothing selected value should be null to get all list

        await this.props.setSelectedRadioSite(val);

        // this should return true to parent for reset activePage value;
        this.props.handleRadioSiteChange((val === null) ? true : "radioSite");
    }

    render() {
        const {language, radioSites, radioSite, editOn} = this.props;
        if (language && radioSites) {
            return (
                <Input type={'select'}
                       className={'custom-select'}
                       disabled={editOn}
                       onChange={this.handleSelectedRadio.bind(this)}
                       value={radioSite}
                >
                    <option value="0">{language.loadByRadioSite}</option>
                    {radioSites.map((value) => {
                        return (<option key={value} value={value}>{value}</option>)
                    })
                    }
                </Input>
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
        token: state.token,
        radioSites: state.radioSites,
        radioSite: state.radioSite,
        editOn: state.editOn
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setSelectedRadioSite: (radioSite) => {dispatch(setSelectedRadioSite(radioSite))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRadioSite);