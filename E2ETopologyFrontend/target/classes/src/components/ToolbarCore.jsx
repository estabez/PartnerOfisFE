import React from 'react';
import {connect} from "react-redux";
import MaximizeContent from "./MaximizeContent";
import {Button, ButtonGroup} from 'reactstrap';
import html2canvas from 'html2canvas';
import {
    dropDownHandler,
    modalTitle,
    modalToggle,
    setTopologyFirstLevel,
    setTopologySecondLevel
} from "../redux/actions";
import CryptoJS from 'crypto-js' ;

class ToolbarCore extends React.Component {

    constructor(props) {
        super(props);

        this.maximizeButton = true; // in modal maximize button will not be shown

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        const nav = document.querySelector('.vis-navigation');
        nav.classList.add('d-none');
        html2canvas(document.getElementById('CoreTopology'), {
            logging:true,
            profile:true,
            useCORS: true
        }).then(function(canvas) {
           // document.body.appendChild(canvas);
            console.log(canvas);
            saveAs(canvas.toDataURL(), 'Core Topology.png');
        });
        nav.classList.remove('d-none');


        const data = "123456";
        const key  = CryptoJS.enc.Latin1.parse('hVmYq3t6w9z$C&E)');
        const iv   = CryptoJS.enc.Latin1.parse('hVmYq3t6w9z$C&E)');
        const encrypted = CryptoJS.AES.encrypt(
            data,
            key,
            {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding
            });
        console.log('encrypted: ' + encrypted) ;
        const decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
        console.log('decrypted: '+ decrypted.toString(CryptoJS.enc.Utf8));

    }


    render() {

        const {language} = this.props;

        this.maximizeButton = this.props.maximizeButton === undefined
            ? this.maximizeButton
            : this.props.maximizeButton;

        if (language && this.props.labels !== null) {

            return (
                <div id={'target'} className={this.props.wrapper}>
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

function mapDispatchToProps(dispatch) {
    return {
        dropDownHandler: () => dispatch(dropDownHandler()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ToolbarCore);