import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, Alert} from 'reactstrap';
import {modalTitle, modalToggle, setTopologySecondLevel} from "../redux/actions";
import TopologyDiagram from '../components/TopologyDiagram'
import ToolbarRan from "./TopologyToolbar";

class ModalTemplate extends React.Component {

    toggle() {
        if (this.props.open) {
            setTimeout(() => {
                // this is need for clear second level data
                this.props.setTopologySecondLevel(null)
            }, 500)
        }
        this.props.setModal();
    }

    handleSelectNode = selectedNodeId => {

        const {graph, fontSize} = this.props;

        let newGraph = JSON.parse(JSON.stringify(graph));

        newGraph.nodes.map((node) => {
            node.font = {color: 'black', size: 13}
            node.size = 25;
            if (node.id === selectedNodeId) {
                node.font = {color: 'red', size: fontSize};
                node.size = 40;
            }
        });
        this.props.setTopologySecondLevel(newGraph);

    };

    render() {
        const {language, title, graph, diagramAreaId, labels} = this.props;

        if (language !== null) {
            const sizeOfModal = graph ? 'xxl' : 'md'
            return (
                <Modal isOpen={this.props.open} size={sizeOfModal}>

                    <ModalHeader toggle={this.toggle.bind(this)}>{title}</ModalHeader>

                    <ModalBody id={diagramAreaId}>
                        {labels &&
                        <ToolbarRan handleSelectNode={this.handleSelectNode.bind(this)}
                                    labels={labels.dropdownList}
                                    topologyLevel={2}
                                    diagramAreaId={diagramAreaId}
                                    snapshotFileName={'RanTopologySecondLevel.png'}/>
                        }
                        {graph &&
                        <TopologyDiagram graph={graph} height={'85%'}/>
                        }
                        {!graph &&
                            <Alert color={'danger'}>
                                {language.aggregSiteNoData}
                            </Alert>
                        }
                    </ModalBody>
                </Modal>
            )
        } else {
            return (<></>)
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        open: state.modalToggle,
        title: state.modalTitle,
        graph: state.topologySecondLevel,
        labels: state.topologySecondLevelDropdownLabels,
        fontSize: state.topologySelectedNodeFontSize
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setModal: () => dispatch(modalToggle()),
        setModalTitle: (content) => dispatch(modalTitle(content)),
        setTopologySecondLevel: (graph) => dispatch(setTopologySecondLevel(graph))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalTemplate);