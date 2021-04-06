import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/TopologyToolbar'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TopologyDiagram from '../components/TopologyDiagram'

import IconModule from '../IconModule';
import RestApiModule from '../RestApiModule'

import EmptyDataset from "../components/EmptyDataset";

class WDM extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            graph: null,
            labels: null,
            dataExist: true
        }

        this.unformatedData = null

        this.restApi = new RestApiModule();

        this.today = new Date();
        this.todayDate = '_' + this.today.getDate() +  (this.today.toLocaleString('default', { month: 'long' })) + this.today.getFullYear();
        this.fileName = 'WDMTopology' + this.todayDate + '.png';
    }

    componentDidMount() {
        this._isMounted = true;
        this.getWdmTopologyData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getWdmTopologyData() {

        this.restApi.callApi('wdm', {
            token: this.props.token

        }).then((response) => {

            const d = response.WDMTopologyViewData ? response.WDMTopologyViewData : [];

            if (this._isMounted && d.length > 0) {

                this.prepareData(d);

            } else {

                this.setState({dataExist: false})
            }
        }).catch((error) => {
            console.log(error)
            this.setState({dataExist: false})

        });
    }

    prepareData(json) {

        const nodes = [], edges = [], labels = [];
        const Icons = new IconModule();
        const Site = Icons.getIconForNode('AGGREGATE_SITE');

        let graph = null;

        function pushItem(label) {

            if (label !== null) {
                labels.push(label);

                nodes.push({
                    id: label,
                    label,
                    shape: 'image',
                    font: {color: 'black', size: 13},
                    image: Site,
                    size: 25,
                })
            }
        }

        if (json) {

            json.map((item) => {
                const indexA = nodes.findIndex(data => data.label === item.A_SIDE_SITE);
                const indexZ = nodes.findIndex(data => data.label === item.Z_SIDE_SITE);

                pushItem(indexA < 0 ? item.A_SIDE_SITE : indexZ < 0 ? item.Z_SIDE_SITE : null);

                let title = `<strong>Name: </strong>${item.NAME}<br /><strong>Status: </strong>${item.STATUS}<br />`;
                title += `<strong>A Side Equip: </strong>${item.A_SIDE_SITE}<br />`;
                title += `<strong>Z Side Equip: </strong>${item.Z_SIDE_SITE}`;

                edges.push({
                    from: item.A_SIDE_SITE,
                    to: item.Z_SIDE_SITE,
                    title: title
                });

            });

            graph = {
                nodes,
                edges
            };

            this.unformatedData = graph;
            this.setState({graph});
            this.setState({labels: labels.sort()});
        }
    }

    async handleSelectNode(selectedNodeId) {

        let newGraph = JSON.parse(JSON.stringify(this.unformatedData));
        if (newGraph) {
            newGraph.nodes.map((node) => {
                if (node.label === selectedNodeId) {
                    node.font = {color: 'red', size: this.props.fontSize};
                    node.size = 40;
                }
            });
            this.setState({graph: newGraph});
        }
    };

    render() {
        const {language, maximize, contentCSS} = this.props;
        const {graph, dataExist, labels} = this.state;

        if (language) {

            return (
                <>
                    <Header/>
                    <div className="row h-100">
                        <Sidebar maximize={maximize}/>
                        <div className={contentCSS}>
                            {(dataExist && graph) &&
                            <>
                                <Toolbar wrapper={'card toolbar mt-2'}
                                         labels={labels}
                                         handleSelectNode={this.handleSelectNode.bind(this)}
                                         diagramAreaId={'WdmTopology'}
                                         snapshotFileName={this.fileName}
                                />
                                <div id={'WdmTopology'} className={'card mt-1 fixedCard'}>
                                    <div className="card-body">
                                        <h4 className={'topologyViewHeader'}>{language.wdmTopology}</h4>
                                        <TopologyDiagram
                                            height={'95%'}
                                            graph={graph}
                                        />
                                    </div>
                                </div>
                            </>
                            }

                            {!dataExist &&
                            <EmptyDataset page={'wdm'} showButton={true}/>
                            }
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
        token: state.token,
        language: state.language,
        maximize: state.maximize,
        contentCSS: state.contentCSS,
        fontSize: state.topologySelectedNodeFontSize
    }
}

export default connect(mapStateToProps)(WDM);