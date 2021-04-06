import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/ToolbarWdm'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TopologyDiagram from '../components/TopologyDiagram'

import data from '../sampleData/wdmData';

import IconModule from '../IconModule';

class Wdm extends React.Component {

    constructor(props) {
        super(props);
        this.coreJSON = data.data;
        this.state = {
            graph: null,
            selectedOption: null,
            selectedNodeColor: null,
            selectedNodeId: null,
            dropdownLabels: null
        }
        this.graph = [];
        this.labels = [];
        this.dropDownHandler();
    }

    componentDidMount() {
        const nodes = [];
        const edges = [];
        const Icons = new IconModule();
        const Site = Icons.getIconForNode('AGGREGATE_SITE');
        this.coreJSON.map((item) => {
            const indexA = nodes.findIndex(data => data.label === item.a_side_site);

            if (indexA < 0) {
                nodes.push({
                    id: item.a_side_site,
                    label: item.a_side_site,
                    image: Site,
                    shape: 'image',
                    font: {color: 'black'}
                });
            }

            const indexZ = nodes.findIndex(data => data.label === item.z_side_site);

            if (indexZ < 0) {
                nodes.push({
                    id: item.z_side_site,
                    label: item.z_side_site,
                    image: Site,
                    shape: 'image',
                    font: {color: 'black'}
                });
            }

        });

        this.coreJSON.map((item) => {

            let title = `<strong>Name: </strong>${item.name}<br /><strong>Status: </strong>${item.status}<br />`;
            title += `<strong>A Side Equip: </strong>${item.a_side_equip}<br />`;
            title += `<strong>Z Side Equip: </strong>${item.z_side_equip}`;

            edges.push({
                from: item.a_side_site,
                to: item.z_side_site,
                title: title
            });
        });

        this.graph = {
            nodes,
            edges
        };

        for (let m = 0; m < this.graph.nodes.length; m++) {
            this.labels.push(this.graph.nodes[m].label);
        }

        this.setState({dropdownLabels: this.labels});
        this.state.dropdownLabels = this.labels;
        if (this.state.selectedNodeId !== null) {
            for (let a = 0; a < this.graph.nodes.length; a++) {
                if (this.graph.nodes[a].id === this.state.selectedNodeId) {
                    this.graph.nodes[a].font = {color: 'red'}
                }
            }
        }

        this.setState({graph: this.graph});
    }



    handleChange = selectedOption => {
        this.setState({selectedOption});
        console.log(`Option selected:`, selectedOption.target.selectedOptions[0].text);
        for (let m = 0; m < this.graph.nodes.length; m++) {
            if (this.graph.nodes[m].label === selectedOption.target.selectedOptions[0].text) {
                this.state.selectedNodeColor = 'Selected';
                this.state.selectedNodeId = this.graph.nodes[m].id;
                this.componentDidMount();
            }
        }
    };


    dropDownHandler() {
        console.log(this.graph.nodes);
        if (this.graph.nodes !== undefined && this.graph.nodes !== null) {
            for (let m = 0; m < this.graph.nodes.length; m++) {
                this.labels.push(this.graph.nodes[m].label);
            }
        }
    }

    render() {
        const {maximize, contentCSS} = this.props;
        const {language} = this.props;

        if (this.state.graph !== null && language !== null) {

            return (
                <>

                    <Header/>
                    <div className="row h-100">
                        <Sidebar maximize={maximize}/>
                        <div className={contentCSS}>
                            <Toolbar wrapper={'card mt-3'} labels={this.state.dropdownLabels}
                                     handleChange={this.handleChange}/>
                            <div id={'WdmTopology'} className={'card mt-3 fixedCard'}>
                                <label className={'topologyViewHeader'}>{language.wdmTopology}</label>
                                <hr/>
                                <div className="card-body">

                                    <TopologyDiagram
                                        graph={this.state.graph}
                                        events={this.events}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return (<></>);
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        maximize: state.maximize,
        contentCSS: state.contentCSS
    }
}


export default connect(mapStateToProps)(Wdm);