import React from 'react'
import {connect} from "react-redux";

import {Row, Col, Card, CardBody} from 'reactstrap';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

class Help extends React.Component {

    render() {
        const {contentCSS} = this.props;

        return (
            <>
                <Header/>
                <Row className={'h-100'}>
                    <Sidebar/>

                    <Col className={contentCSS}>

                        <Card className={'mt-3 fixedCardHelpPage'}>
                            <CardBody className={'p-1'}>
                                <iframe src={'./static/KolayOtoHelpPage.htm'}
                                        width={'100%'}
                                        height={'100%'} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        contentCSS: state.contentCSS
    }
}
export default connect(mapStateToProps)(Help);