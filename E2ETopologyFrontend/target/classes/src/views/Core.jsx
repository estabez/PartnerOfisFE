import React from 'react';
import {connect} from "react-redux";

import Toolbar from '../components/ToolbarCore'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ModalTemplate from '../components/Modal'
import TopologyDiagram from '../components/TopologyDiagram'
import {
    modalToggle, modalTitle,
    setTopologyFirstLevel,
    setTopologySecondLevel,
    dropDownHandler
} from "../redux/actions";

import data from '../sampleData/coreData';

import IconModule from '../IconModule';

class Core extends React.Component {

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

//Creating nodes for BSC AND RNC
       for (let i = 0; i < this.coreJSON.length; i++) {
           // console.log(i);
            this.coreJSON.map((item,key)=>{
                if(key == i) {
                   // console.log(item);
                    const index = nodes.findIndex(data => data.label === item.CONTROLLER_NAME);
                    console.log(index);
                    if(index < 0 ) {
                        const icon = Icons.getIconForNode(item.CONTROLLER_TYPE);

                        if (item.CONTROLLER_TYPE === 'BSC') {
                            nodes.push({
                                id: item.CONTROLLER_INST_ID,
                                label: item.CONTROLLER_NAME,
                                image: icon,
                                shape: 'image',
                                font:{color:'black'}
                            });
                            // console.log(this.coreJSON.length);
                        }
                        if (item.CONTROLLER_TYPE === 'RNC') {
                            nodes.push({
                                id: item.CONTROLLER_INST_ID,
                                label: item.CONTROLLER_NAME,
                                image: icon,
                                shape: 'image',
                                font:{color:'black'}
                            });
                        }
                    }
                }
            })
        }


       //CREATING NODES FOR MGW
        for (let i = 0; i < this.coreJSON.length; i++) {
            // console.log(i);
            this.coreJSON.map((item,key)=>{
                if(key == i) {
                    // console.log(item);
                    const index = nodes.findIndex(data => data.label === item.MGW_NAME);
                    if(index < 0 ) {
                            nodes.push({
                                id: item.MGW_INST_ID,
                                label: item.MGW_NAME,
                                image: Icons.getIconForNode('AGGREGATE_SITE'),
                                shape: 'image',
                                font:{color:'black'}
                            });
                            // console.log(this.coreJSON.length);

                    }
                }
            })
        }

        //CREATING EDGES
        for (let i = 0; i < this.coreJSON.length; i++) {
            // console.log(i);
            this.coreJSON.map((item,key)=>{
                if(key == i) {
                    // console.log(item);
                        edges.push({
                            from: item.CONTROLLER_INST_ID,
                            to: item.MGW_INST_ID,
                            dashes:true,
                        });

                        // console.log(this.coreJSON.length);

                    }

            })
        }

        this.graph = {
            nodes,
            edges
        };

        for (let m = 0; m < this.graph.nodes.length; m++) {
            this.labels.push(this.graph.nodes[m].label);
        }

        this.setState({dropdownLabels:this.labels});
        this.state.dropdownLabels = this.labels;
        if(this.state.selectedNodeId !== null) {
            for (let a = 0; a <  this.graph.nodes.length; a++) {
                if (this.graph.nodes[a].id === this.state.selectedNodeId) {
                    this.graph.nodes[a].font = {color: 'red'}
                }
            }
        }

        this.props.setTopologyFirstLevel(this.graph);


    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption.target.selectedOptions[0].text);
        for (let m = 0; m <  this.graph.nodes.length; m++) {
            if(this.graph.nodes[m].label === selectedOption.target.selectedOptions[0].text ) {
                this.state.selectedNodeColor='Selected';
                this.state.selectedNodeId = this.graph.nodes[m].id;
                this.componentDidMount();
            }
        }
    };


    dropDownHandler(){
        console.log(this.graph.nodes);
        if( this.graph.nodes !== undefined && this.graph.nodes !== null ) {
            for (let m = 0; m < this.graph.nodes.length; m++) {
                this.labels.push(this.graph.nodes[m].label);
            }
        }


    }


    render() {
        const {maximize, contentCSS} = this.props;
        const {language} = this.props;

        if (this.props.firstLevelGraph !== null && language !== null) {

            return (
                <>

                    <Header/>
                    <div className="row h-100">
                        <Sidebar maximize={maximize}/>
                        <div className={contentCSS}>
                            <Toolbar wrapper={'card mt-3'}  labels={this.state.dropdownLabels}  handleChange={this.handleChange} />
                            <div id={'CoreTopology'}  className={'card mt-3 fixedCard'}>
                                <label className={'topologyViewHeader'} >{language.coreTopology}</label>
                                <hr />
                                <div className="card-body">
                                    <TopologyDiagram
                                        graph={this.props.firstLevelGraph}
                                        events={this.events}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalTemplate/>
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
        firstLevelGraph: state.topologyFirstLevel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModal: () => dispatch(modalToggle()),
        setModalTitle: (content) => dispatch(modalTitle(content)),
        setTopologyFirstLevel: (graph) => dispatch(setTopologyFirstLevel(graph)),
        setTopologySecondLevel: (graph) => dispatch(setTopologySecondLevel(graph)),
        dropDownHandler: () => dispatch(dropDownHandler()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Core);