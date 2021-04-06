import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/TopologyToolbar'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TopologyDiagram from '../components/TopologyDiagram'

import IconModule from '../IconModule';
import RestApiModule from '../RestApiModule'
import EmptyDataset from "../components/EmptyDataset";

class Core extends React.Component {
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
        this.fileName = 'CoreTopology' + this.todayDate + '.png';
    }


    componentDidMount() {
        this._isMounted = true;
        this.getCoreTopologyData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getCoreTopologyData() {

        this.restApi.callApi('core', {
            token: this.props.token

        }).then((response) => {

            const d = response.CoreTopologyViewData ? response.CoreTopologyViewData : [];

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
        let graph = null;

        function pushItem(id, label, icon) {

            labels.push(label);

            nodes.push({
                id,
                label,
                shape: 'image',
                font: {color: 'black', size:14},
                image: icon,
                size: 25,
            })
        }

        if (json) {

            json.map((item) => {
                const index1 = nodes.findIndex(data => data.id === item.CONTROLLER_INST_ID);
                const index2 = nodes.findIndex(data => data.id === item.MGW_INST_ID);

                if (index1 < 0) {
                    pushItem(item.CONTROLLER_INST_ID,
                        item.CONTROLLER_NAME,
                        Icons.getIconForNode(item.CONTROLLER_TYPE)
                    );
                }

                if (index2 < 0) {
                    pushItem(item.MGW_INST_ID,
                        item.MGW_NAME,
                        Icons.getIconForNode('AGGREGATE_SITE')
                    );
                }

                edges.push({
                    from: item.CONTROLLER_INST_ID,
                    to: item.MGW_INST_ID,
                    dashes: true,
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
                    node.size = 50;
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
                                         diagramAreaId={'CoreTopology'}
                                         snapshotFileName={this.fileName}
                                />
                                <div id={'CoreTopology'} className={'card mt-1 fixedCard'}>
                                    <div className="card-body">
                                        <h4 className={'topologyViewHeader'}>{language.coreTopology}</h4>
                                        <TopologyDiagram
                                            height={'95% '}
                                            graph={graph}
                                        />
                                    </div>
                                </div>
                            </>
                            }

                            {!dataExist &&
                            <EmptyDataset page={'core'} showButton={true}/>
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

export default connect(mapStateToProps)(Core);