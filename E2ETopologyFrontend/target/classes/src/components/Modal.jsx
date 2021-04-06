import React from 'react';
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, Alert, ButtonGroup} from 'reactstrap';
import {modalTitle, modalToggle, setTopologySecondLevel} from "../redux/actions";
import TopologyDiagram from '../components/TopologyDiagram'

import ToolbarRanSecondLevel from "./ToolbarRanSecondLevel";

class ModalTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.graph = [];
        this.labels = [];

        this.state = {
            graph: null,
            selectedOption: null,
            selectedNodeColor: null,
            selectedNodeId: null,
            dropdownLabels: null,
        }

        this.labels = [];
    }

    toggle() {
        if (this.props.open) {
            setTimeout(() => {
                // this is need for clear second level data
                this.props.setTopologySecondLevel(null)
            }, 500)
        }
        this.props.setModal();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.graph) {
            this.prepareDropDown();
        }
    }


    handleChange = selectedOption => {
        const option = selectedOption.target.selectedOptions[0].text
        console.log(`Option selected:`, selectedOption.target.selectedOptions[0].text);
        let { graph } = this.props;

        const nodeItem = graph.nodes.find((node) => {
            return node.id === option
        });
        nodeItem.font = {color: 'red'};

        console.log(nodeItem);
        console.log(graph.nodes);

        this.props.setTopologySecondLevel(graph);
    };

    prepareDropDown() {

        const {graph} = this.props;

        if (graph) {
            let labels = [];

            graph.nodes.map(item => {
                labels.push(item.label);
            })
            this.labels = labels.sort();
        }
    }

    render() {
        const {language, title, graph} = this.props;

        if (language !== null) {

            console.log(graph);

            const sizeOfModal = graph ? 'xxl' : 'md'
            return (
                <Modal isOpen={this.props.open} size={sizeOfModal}>

                    <ModalHeader toggle={this.toggle.bind(this)}>{title}</ModalHeader>

                    <ModalBody id={'RanTopologySecondLevel'}>
                        {graph &&
                        <ToolbarRanSecondLevel wrapper={'card'}
                                               handleChange={this.handleChange}
                                               labels={this.labels}/>
                        }
                        {graph &&
                        <TopologyDiagram  graph={graph} height={'85%'}/>
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
        graph: state.topologySecondLevel
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