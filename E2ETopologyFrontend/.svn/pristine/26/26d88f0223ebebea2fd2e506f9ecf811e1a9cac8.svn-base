import React from 'react';
import {connect} from "react-redux";
import Graph from "react-graph-vis";
import "../../node_modules/vis-network/dist/vis-network.css";


class TopologyDiagram extends React.Component {

    constructor(props) {
        super(props);

        this.options = {
            autoResize:true,
            physics:true,
            height: this.props.height ? this.props.height : '100%',
            width:'100%',
            interaction:{
                dragNodes:true,
                dragView: true,
                hideEdgesOnDrag: false,
                hideEdgesOnZoom: false,
                hideNodesOnDrag: false,
                hover: true,
                hoverConnectedEdges: true,
                keyboard: {
                    enabled: true,
                    speed: {x: 10, y: 10, zoom: 0.02},
                    bindToWindow: true
                },
                multiselect: false,
                navigationButtons: true,
                selectable: true,
                selectConnectedEdges: true,
                tooltipDelay: 300,
                zoomView: true,
            },
            layout:{
                hierarchical:{
                    enabled:false,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 200,
                },
            },
            edges: {
                arrows:{
                    to:{
                        enabled: false
                    }
                },
                color: {
                    color:'#1E90FF',
                    highlight:'#848484',
                    hover: '#848484',
                    inherit: 'from',
                    opacity:1.0
                },
                smooth:true,
            }
            /*layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            },
            physics: {
                enabled: false
            },
            autoResize: true,
            interaction: {multiselect: true, dragView: true},
            height: this.props.height ? this.props.height : '100%',
            groups: {
                switch: {
                    shape: "triangle",
                    color: "#aa5589"
                }
            }*/
        };
    }

    componentDidMount() {

    }


    render(){

        if (this.props.graph !== undefined) {
            return (
                <Graph
                    graph={this.props.graph}
                    options={this.options}
                    events={this.props.events !== undefined ? this.props.events : null}
                    /*getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property

                    }}*/
                />
            )
        } else {
            return (<></>)
        }

    }
}

function mapStateToProps(state) {
    return {
        modalToggle: state.modalToggle,
    }
}

export default connect(mapStateToProps)(TopologyDiagram);