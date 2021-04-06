import React from 'react';
import {connect} from "react-redux";

import {Button, ButtonGroup} from 'reactstrap';
import html2canvas from "html2canvas";

class ToolbarRan extends React.Component {

    constructor(props) {
        super(props)

        this.maximizeButton = true; // in modal maximize button will not be shown
    }

    handleClick(){
        const nav = document.querySelector('.vis-navigation');
        nav.classList.add('d-none');
        html2canvas(document.getElementById('RanTopologySecondLevel'), {
            logging:true,
            profile:true,
            useCORS: true
        }).then(function(canvas) {
            // document.body.appendChild(canvas);
            console.log(canvas);
            saveAs(canvas.toDataURL(), 'Ran Topology Second Level.png');
        });
        nav.classList.remove('d-none');
    }

    render() {

        const {language} = this.props;

        if (language) {

            return (
                <div className={this.props.wrapper}>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-3">
                                <select className="custom-select"
                                        onChange={this.props.handleChange} >
                                    <option value="0" >Select a node</option>
                                    {this.props.labels.map((value, index) => {
                                        return <option value="5" key={index}>{value}</option>
                                    })}
                                </select>

                            </div>

                            <div className="col-9 text-right">


                                <ButtonGroup>
                                    {
                                        language.coreViewToolbar.map((item, key) => {
                                            return (

                                                <Button key={key}
                                                        data-place={'top'}
                                                        data-tip={item.title}
                                                        color={item.btnClass}
                                                        onClick={item.clickEvent === 'snapshot'
                                                            ? this.handleClick
                                                            : item.clickEvent === 'zoomIn'
                                                                ? undefined
                                                                :item.clickEvent === 'zoomOut'
                                                                    ? undefined
                                                                    :item.clickEvent === 'refresh'
                                                                        ?undefined
                                                                        : undefined}
                                                >
                                                    <i className={`icon ${item.icon}`}/>

                                                </Button>
                                            )
                                        })
                                    }
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                </div>

            )
        } else {
            return (
                <></>
            )
        }

    }
}

function saveAs(uri, filename) {

    const link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}




function mapStateToProps(state) {
    return {
        language: state.language
    }
}

export default connect(mapStateToProps)(ToolbarRan);