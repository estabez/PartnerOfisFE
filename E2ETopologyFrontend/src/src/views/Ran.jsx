import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/ToolbarRan'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ModalTemplate from '../components/Modal'
import TopologyDiagram from '../components/TopologyDiagram'
import {
    modalToggle, modalTitle,
    setTopologyFirstLevel,
    setTopologySecondLevel
} from "../redux/actions";

import IconModule from '../IconModule';

// Fake data
import ouj_1003 from '../sampleData/OUJ-1003'
import ouj_1001 from '../sampleData/OUJ-1001'
import data from '../sampleData/ran1';

class Ran extends React.Component {

    constructor(props) {
        super(props);

        this.Icons = new IconModule();

        this.state = {
            firstLevelData: null,
            dropdownLabels: null,
        }

        this.unformattedData = null
    }

    events = {
        doubleClick: (event) => {
            const {nodes} = event;
            const nodeID = nodes[0];

            if (nodeID) {
                //alert(nodeID);

                const secondLevelData = this.getDataByAggregSite(nodeID);

                console.log(secondLevelData);
                this.prepareSecondLevelData(secondLevelData, nodeID);

                this.props.setModalTitle(nodeID);
                this.props.setModal();
            }
        }
    };

    async componentDidMount() {

        await this.getDataByRegion();
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async getDataByRegion(region) {

        let d = data.data;

        if (region && region !== "0") {
            d = data.data.filter((item) => {
                return item.REGION === region;
            })
        }
        await this.setStateAsync({firstLevelData: d});

        this.prepareFirstLevelData();
    }

    getDataByAggregSite(id) {
        let data = null;

        switch (id) {
            case "OUJ-1003": data = ouj_1003; break;
            case "OUJ-1001": data = ouj_1001; break;
        }

        return data;
    }

    prepareFirstLevelData() {

        let nodes = [], edges = [], labels = [];

        function pushItem(id, icon) {

            nodes.push({
                id: id,
                label: id,
                shape: 'image',
                font: {color: 'black'},
                image: icon
            })
        }

        this.state.firstLevelData.map((item) => {

            const indexA = nodes.findIndex(data => data.id === item.NODE_A);
            if (indexA < 0) {
                pushItem(item.NODE_A, this.Icons.getIconForNode(item.NODE_A_TYPE));
                labels.push(item.NODE_A);
            }

            const indexB = nodes.findIndex(data => data.id === item.NODE_B);
            if (indexB < 0) {
                pushItem(item.NODE_B, this.Icons.getIconForNode(item.NODE_B_TYPE));
                labels.push(item.NODE_B);
            }

            edges.push({
                from: item.NODE_A,
                to: item.NODE_B
            });
        });

        this.unformattedData = {nodes, edges};

        // once the data is ready to show, redux is updating.
        this.props.setTopologyFirstLevel({
            nodes,
            edges
        });

        this.setState({dropdownLabels: labels.sort()});

    }

    prepareSecondLevelData(data, aggregSite) {

        let nodes = [], edges = [], labels = [];

        function pushItem(id, icon) {

            nodes.push({
                id: id,
                label: id,
                shape: 'image',
                font: {color: 'black'},
                image: icon
            })
        }

        if (data) {

            data.data.map((item) => {

                const indexA = nodes.findIndex(data => data.id === item.A_SITE);
                if (indexA < 0) {
                    pushItem(item.A_SITE, this.Icons.getIconForNode('RADIO_SITE'));
                    labels.push(item.A_SITE);
                }

                const indexB = nodes.findIndex(data => data.id === item.Z_SITE);
                if (indexB < 0) {
                    pushItem(item.Z_SITE, this.Icons.getIconForNode('AGGREGATE_SITE'));
                    labels.push(item.Z_SITE);
                }

                edges.push({
                    from: item.A_SITE,
                    to: item.Z_SITE
                });
            });

            this.props.setTopologySecondLevel({
                nodes,
                edges
            });
        }
    }

    async handleChange(selectedNodeId) {

        let newGraph = JSON.parse(JSON.stringify(Object.assign({}, this.unformattedData)));

        if (newGraph) {
            newGraph.nodes.map((node) => {
                if (node.id === selectedNodeId) {
                    node.font = {color: "red"}
                }
            });
            this.props.setTopologyFirstLevel(newGraph);
        }
    };

    render() {
        const {maximize, contentCSS, graph} = this.props;
        const {language} = this.props;

        if (graph !== null && language !== null) {
            return (
                <>
                    <Header/>
                    <div className="row h-100">
                        <Sidebar maximize={maximize}/>
                        <div className={contentCSS}>
                            <Toolbar wrapper={'card mt-3'}
                                     labels={this.state.dropdownLabels}
                                     handleChange={this.handleChange.bind(this)}
                                     handleRegionChange={this.getDataByRegion.bind(this)}
                            />

                            <div id={'RanTopology'}  className={'card mt-3 fixedCard'}>
                                <label className={'topologyViewHeader'}>{language.ranTopology}</label>
                                <hr />
                                <div className="card-body">
                                    <TopologyDiagram
                                        graph={graph}
                                        events={this.events}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalTemplate />
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
        contentCSS: state.contentCSS,
        graph: state.topologyFirstLevel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModal: () => dispatch(modalToggle()),
        setModalTitle: (content) => dispatch(modalTitle(content)),
        setTopologyFirstLevel: (graph) => dispatch(setTopologyFirstLevel(graph)),
        setTopologySecondLevel: (graph) => dispatch(setTopologySecondLevel(graph))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ran);