import React from 'react';
import {connect} from "react-redux";
import {Input} from 'reactstrap';
import {setRadioSites, setSelectedRegion, setSelectedRadioSite} from "../redux/actions";

import RestApiModule from '../RestApiModule'

class SelectRegion extends React.Component {

    constructor(props) {
        super(props)

        this.restApi = new RestApiModule();
    }

    async handleSelectedRegion(ev) {
        let val = ev.target.value;

        val = +val === 0 ? this.props.regions[0] : val;

        await this.props.setSelectedRegion(val);

        const {token} = this.props;

        this.restApi.callApi('getRadioListByRegion', {
            region: val,
            token
        }).then(async (response) => {

            const list = await response.List.map((item) => {
                return item.value;
            });

            this.props.setRadioSites(list.sort());
            this.props.setSelectedRadioSite(undefined);

        })

        this.props.handleRegionChange(true) // this should return true to parent for reset activePage value;
    }

    render() {
        const {language, regions, editOn, region} = this.props;

        if (language && regions) {
            return (
                <Input type={'select'} className={'custom-select'}
                       disabled={editOn}
                       onChange={this.handleSelectedRegion.bind(this)}
                       value={region}
                >
                    {regions.map((value) => {
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
        regions: state.regions,
        region: state.region,
        editOn: state.editOn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedRegion: (region) => {dispatch(setSelectedRegion(region))},
        setRadioSites: (list) => {dispatch(setRadioSites(list))},
        setSelectedRadioSite: (radioSite) => {dispatch(setSelectedRadioSite(radioSite))}

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRegion);