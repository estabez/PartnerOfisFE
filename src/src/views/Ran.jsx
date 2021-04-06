import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/TopologyToolbar'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ModalTemplate from '../components/Modal'
import TopologyDiagram from '../components/TopologyDiagram'
import {
    modalToggle, modalTitle,
    setTopologyFirstLevel,
    setTopologySecondLevel,
    setTopologySecondLevelDropdownLabels
} from "../redux/actions";

import IconModule from '../IconModule';
import RestApiModule from '../RestApiModule'
import AlertModule from '../AlertModule'
import EmptyDataset from "../components/EmptyDataset";
import {Card, CardBody} from 'reactstrap';


class Ran extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.Icons = new IconModule();
        this.restApi = new RestApiModule();
        this.alert = new AlertModule();

        this.state = {
            firstLevelData: null,
            dropdownLabels: null,
            dataExist: true
        }

        this.unformatedData = null
        this.unformatedDataSecondLevel = null

        this.today = new Date();
        this.todayDate = '_' + this.today.getDate() +  (this.today.toLocaleString('default', { month: 'long' })) + this.today.getFullYear();
        this.fileName = 'RanTopology' + this.todayDate + '.png';

        // init first data
        this.getDataByRegion();
    }

    events = {
        doubleClick: (event) => {
            const {nodes} = event;
            const nodeID = nodes[0];

            if (nodeID) {
                // type must be aggreg_site
                const node = this.props.graph.nodes.find((item) => {
                    return item.id === nodeID
                });
                if (node.type === 'AGGREGATE_SITE') {
                    this.getDataByAggregSite(nodeID);

                    this.props.setModalTitle(nodeID);

                }
            }
        }
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    getDataByRegion() {

        const {token, region} = this.props;

        this.restApi.callApi('ranFirst', {
            token,
            region

        }).then(async (response) => {

            const d = response.RANTopologyFirstLevelViewData;

            if (this._isMounted && (d && d.length > 0)) {
                await this.setStateAsync({firstLevelData: d, dataExist: true});

                this.prepareFirstLevelData();

            } else {
                this.setStateAsync({dataExist: false})
            }

        }).catch((error) => {
            console.log(error)
            this.setStateAsync({dataExist: false})
        });

    }

    async getDataByAggregSite(id) {

        const {token} = this.props;

        this.restApi.callApi('ranSecond', {
            selectedNode: id,
            token

        }).then(async (response) => {

            const d = response.RANTopologySecondLevelViewData;

            if (d.length > 0) await this.prepareSecondLevelData(d, id);

            this.props.setModal();

        }).catch((error) => {
            console.log(error)
        });
    }

    prepareFirstLevelData() {

        let nodes = [], edges = [], labels = [];

        function pushItem(id, type, Icons) {

            if (type === 'AGGREGATE_SITE') {
                labels.push(id);
            }
            nodes.push({
                id: id,
                label: id,
                type: type,
                shape: 'image',
                font: {color: 'black', size: '13'},
                size: 25,
                image: Icons.getIconForNode(type)
            })
        }

        this.state.firstLevelData.map((item) => {

            const indexA = nodes.findIndex(data => data.id === item.NODE_A);
            if (indexA < 0) {
                pushItem(item.NODE_A, item.NODE_A_TYPE, this.Icons);
            }

            const indexB = nodes.findIndex(data => data.id === item.NODE_B);
            if (indexB < 0) {
                pushItem(item.NODE_B, item.NODE_B_TYPE, this.Icons);
            }

            edges.push({
                from: item.NODE_A,
                to: item.NODE_B
            });
        });

        // this row for store the first state of graph data.
        // Once we select a node, it will turn to red font, others will stay black.
        this.unformatedData = {nodes, edges};

        // once the data is ready to show, redux is updating.
        this.props.setTopologyFirstLevel({
            nodes,
            edges
        });

        this.setState({dropdownLabels: labels.sort()});

    }

    prepareSecondLevelData(data, aggregSite) {

        let nodes = [], edges = [], labels = [];

        function pushItem(id, Icons) {

            const radioIcon = Icons.getIconForNode('RADIO_SITE');
            const aggregIcon = Icons.getIconForNode('AGGREGATE_SITE');

            nodes.push({
                id: id,
                label: id,
                shape: 'image',
                font: {color: 'black', size: '13'},
                size: 25,
                image: id === aggregSite ? aggregIcon : radioIcon
            })

            if (id !== aggregSite) labels.push(id);
        }

        if (data) {
            data.map((item) => {

                const indexA = nodes.findIndex(data => data.id === item.A_SITE);
                if (indexA < 0) {
                    pushItem(item.A_SITE, this.Icons);
                }

                const indexB = nodes.findIndex(data => data.id === item.Z_SITE);
                if (indexB < 0) {
                    pushItem(item.Z_SITE, this.Icons);
                }

                edges.push({
                    from: item.A_SITE,
                    to: item.Z_SITE
                });
            });

            // this row for store the first state of graph data.
            // Once we select a node, it will turn to red font, others will stay black.
            this.unformatedDataSecondLevel = {nodes, edges};

            // set the second level topology diagram.
            // It will update the redux and it trigger to rerender of modal window.
            this.props.setTopologySecondLevel({
                nodes,
                edges
            });

            // set the secondLevel topology view dropdown list
            this.props.setTopologySecondLevelDropDown({
                dropdownList: labels
            })
        }
    }

    async handleSelectAggregSite(selectedNodeId) {

        let newGraph = JSON.parse(JSON.stringify(this.unformatedData));

        if (newGraph) {
            newGraph.nodes.map((node) => {
                if (node.id === selectedNodeId) {
                    node.font = {color: 'red', size: this.props.fontSize};
                    node.size = 40;
                }
            });
            this.props.setTopologyFirstLevel(newGraph);
        }
    };

    render() {
        const {language, maximize, contentCSS, graph} = this.props;
        const diagramAreaIdLevelOne = 'diagramLevel1';
        const diagramAreaIdLevelTwo = 'diagramLevel2';

        if (language !== null) {
            return (
                <>
                    <Header/>
                    <div className="row h-100">
                        <Sidebar maximize={maximize}/>

                        <div className={contentCSS}>

                            <Toolbar wrapper={'card toolbar mt-2'}
                                     labels={this.state.dropdownLabels}
                                     handleAggregSiteChange={this.handleSelectAggregSite.bind(this)}
                                     handleRegionChange={this.getDataByRegion.bind(this)}
                                     topologyLevel={1}
                                     diagramAreaId={diagramAreaIdLevelOne}
                                     snapshotFileName={this.fileName}
                            />

                            <Card id={diagramAreaIdLevelOne} className={'mt-1 fixedCard'}>
                                <CardBody>
                                    <h4 className={'topologyViewHeader'}>{language.ranTopology}</h4>

                                    {(this.state.dataExist && graph) &&
                                    <TopologyDiagram
                                        id={'diagramLevel1'}
                                        height={'95%'}
                                        graph={graph}
                                        events={this.events}/>
                                    }

                                    {!this.state.dataExist &&
                                    <EmptyDataset page={'ran'} showButton={true}/>
                                    }
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <ModalTemplate diagramAreaId={diagramAreaIdLevelTwo} />
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
        region: state.region,
        language: state.language,
        maximize: state.maximize,
        contentCSS: state.contentCSS,
        graph: state.topologyFirstLevel,
        fontSize: state.topologySelectedNodeFontSize,
        authUser: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModal: () => dispatch(modalToggle()),
        setModalTitle: (content) => dispatch(modalTitle(content)),
        setTopologyFirstLevel: (graph) => dispatch(setTopologyFirstLevel(graph)),
        setTopologySecondLevel: (graph) => dispatch(setTopologySecondLevel(graph)),
        setTopologySecondLevelDropDown: (labels) => dispatch(setTopologySecondLevelDropdownLabels(labels))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ran);