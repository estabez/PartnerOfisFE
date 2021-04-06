import React from 'react';
import Graph from "react-graph-vis";
import "../../node_modules/vis-network/dist/vis-network.css";


class TopologyDiagram extends React.Component {

    constructor(props) {
        super(props);

        this.options = {
            autoResize: true,
            physics: true,
            height: this.props.height ? this.props.height : '100%',
            width: '100%',
            interaction: {
                dragNodes: true,
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
            layout: {
                hierarchical:{
                    enabled: false,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 100,
                },
            },
            edges: {
                arrows:{
                    to:{
                        enabled: false
                    }
                },
                color: {
                    color: '#1E90FF',
                    highlight: '#848484',
                    hover: '#848484',
                    inherit: 'from',
                    opacity: 1
                },
                smooth: true,
            }
        };
    }


    render(){
        const {graph, events} = this.props;

        if (graph !== undefined) {
            return (
                <Graph
                    graph={graph}
                    options={this.options}
                    events={events !== undefined ? events : null}
                />
            )
        } else {
            return (<></>)
        }
    }
}

export default TopologyDiagram;