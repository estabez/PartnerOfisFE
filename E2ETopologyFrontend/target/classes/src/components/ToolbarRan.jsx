import React from 'react';
import {connect} from "react-redux";
import MaximizeContent from "./MaximizeContent";
import {Button, ButtonGroup} from 'reactstrap';
import html2canvas from "html2canvas";

class ToolbarRan extends React.Component {

    constructor(props) {
        super(props)

        this.maximizeButton = true; // in modal maximize button will not be shown
    }

    handleSnapshotClick(){
        const nav = document.querySelector('.vis-navigation');
        nav.classList.add('d-none');
        html2canvas(document.getElementById('RanTopology'), {
            logging:true,
            profile:true,
            useCORS: true
        }).then(function(canvas) {
            /*let a = document.getElementById('snapshot');
            a.href = canvas.toDataURL();
            a.download = 'Ran Topology.png';
            a.click();
            setTimeout(() => {
                a.href = "";
            }, 1000)*/
            saveAs(canvas.toDataURL(), 'Ran Topology.png');
        });
        nav.classList.remove('d-none');
    }

    render() {

        const {language} = this.props;

        this.maximizeButton = this.props.maximizeButton === undefined
            ? this.maximizeButton
            : this.props.maximizeButton;

        if (language && this.props.labels !== null) {

            return (
                <div className={this.props.wrapper}>
                    <div className="card-body">

                        <a className={'d-none'} id={'snapshot'}></a>
                        <div className="row">
                            <div className="col-2">

                                <select className="custom-select" id={'city'}
                                        onChange={ev => this.props.handleRegionChange(ev.target.value)}
                                >
                                    <option value="0">Load by Region</option>
                                    <option value="Agadir">Agadir</option>
                                    <option value="Casablanca">Casablanca</option>
                                    <option value="Marrackech">Marrackech</option>
                                    <option value="Tanger">Tanger</option>
                                </select>

                            </div>
                            <div className="col-2">
                                <select className="custom-select"
                                        onChange={ev => this.props.handleChange(ev.target.value)} >
                                    <option value="0" >Aggre Site</option>
                                    {this.props.labels.map((value, index) => {
                                        return <option value={value} key={index}>{value}</option>
                                    })}
                                </select>
                            </div>

                            <div className="col-2 offset-6 text-right">

                                <ButtonGroup>
                                    {language.ranViewToolbar.map((item, key) => {
                                        return (
                                            <Button key={key}
                                                    data-place={'top'}
                                                    data-tip={item.title}
                                                    color={item.btnClass}
                                                    onClick={item.clickEvent === 'snapshot'
                                                        ? this.handleSnapshotClick
                                                        : undefined
                                                    }
                                            >
                                                <i className={`icon ${item.icon}`}/>
                                            </Button>
                                        )
                                    })
                                    }
                                </ButtonGroup>
                                {this.maximizeButton &&
                                <MaximizeContent/>
                                }
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
    const ggg = document.createElement('a');

    console.log(ggg);

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