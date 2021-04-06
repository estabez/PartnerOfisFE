import React from 'react';
import {connect} from "react-redux";
import {Button, Card, CardBody, Row, Col, Input} from 'reactstrap';
import html2canvas from "html2canvas";
import {saveAs} from 'file-saver';
import 'canvas-toBlob';
import dataURLtoBlob from 'blueimp-canvas-to-blob';

import MaximizeContent from "./MaximizeContent";
import SelectRegion from './SelectRegion';
import ReactTooltip from 'react-tooltip'


class TopologyToolbar extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        ReactTooltip.rebuild();
    }

    handleSnapshotClick(){
        const {diagramAreaId, snapshotFileName, topologyLevel} = this.props;

        const elem = document.getElementById(diagramAreaId);

        if (elem) {

            const nav = elem.querySelector('.vis-navigation');

            let card = null;
            if (topologyLevel === 2) {
                card = elem.querySelector('.card');

                card.classList.add('d-none');
            }

            nav.classList.add('d-none');
            html2canvas(elem).then(function(canvas) {
                const blob = dataURLtoBlob(canvas.toDataURL());
                saveAs(blob, snapshotFileName);
                nav.classList.remove('d-none');

                if (topologyLevel === 2) card.classList.remove('d-none');
            });
        }
    }

    render() {

        const {language, labels, topologyLevel, wrapper, tooltipPlacement,
            handleAggregSiteChange, handleRegionChange, handleSelectNode} = this.props;

        const snapShotButtonOffset = topologyLevel === 1 ? 'offset-6' : 'offset-8';

        if (language) {

            return (

                <Card className={wrapper}>
                    <CardBody>
                        <Row>
                            {topologyLevel === 1 &&
                            <Col xs={4} sm={3} md={2} lg={2} xl={2}>
                                <SelectRegion handleRegionChange={handleRegionChange.bind(this)} />
                            </Col>
                            }

                            {topologyLevel === 1 &&
                            <Col xs={4} sm={3} md={2} lg={2} xl={2}>
                                {labels &&
                                <Input type={'select'} className={'custom-select'}
                                       onChange={ev => handleAggregSiteChange(ev.target.value)}>
                                    <option value="0">Aggre Site</option>
                                    {labels.map((value, index) => {
                                        return <option value={value} key={index}>{value}</option>
                                    })}
                                </Input>
                                }
                            </Col>
                            }

                            {topologyLevel !== 1 &&
                            <Col xs={4} sm={3} md={2} lg={2} xl={2}>
                                {labels &&
                                <Input type={'select'} className={'custom-select'}
                                       onChange={ev => handleSelectNode(ev.target.value)}>
                                    <option value="0" >{language.selectNode}</option>
                                    {labels.map((value, index) => {
                                        return <option value={value} key={index}>{value}</option>
                                    })}
                                </Input>
                                }
                            </Col>
                            }

                            <Col xs={4} sm={3} md={2} lg={2} xl={2} className={`${snapShotButtonOffset} text-right`}>
                                <Button data-place={tooltipPlacement}
                                        data-tip={language.snapshotButtonText}
                                        color={'primary'}
                                        onClick={this.handleSnapshotClick.bind(this)}>
                                    <i className={`icon icon-camera-photo`}/>
                                </Button>

                                {topologyLevel !== 2 &&
                                <MaximizeContent/>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            )
        } else {
            return (
                <></>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        tooltipPlacement: state.tooltipPlacement
    }
}

export default connect(mapStateToProps)(TopologyToolbar);