import React from 'react';
import {connect} from "react-redux";
import MaximizeContent from "./MaximizeContent";
import {Button, ButtonGroup} from 'reactstrap';
import {modalImportToggle, modalExportToggle} from "../redux/actions";

class ToolbarMatrix extends React.Component {

    render() {

        const {language} = this.props;

        if (language) {

            return (
                <div className={'card mt-3'}>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-3">

                                <select className="custom-select" id={'city'}>
                                    <option value="0">Load by City</option>
                                    <option value="1">City 1</option>
                                    <option value="1">City 2</option>
                                    <option value="1">City 3</option>
                                    <option value="1">City 4</option>
                                </select>

                            </div>

                            <div className="col-9 text-right tools">

                                <ButtonGroup>
                                {
                                language.matrixViewToolbar.map((item, key) => {

                                    if ((item.clickEvent === 'edit' ||
                                        item.id === 'saveOptions')) {
                                        item.showMe = !this.props.editOn
                                    }

                                    const dis = this.props.editOn ? item.showMe : false;

                                    if (item.id !== 'saveOptions') {
                                        return (
                                            <Button key={key}
                                                    data-tip={item.title}
                                                    data-place={'top'}
                                                    disabled={dis}
                                                    className={item.showMe
                                                        ? undefined
                                                        : 'd-none'
                                                    }
                                                    onClick={item.clickEvent === 'import'
                                                        ? this.props.setModalImport
                                                        : item.clickEvent === 'edit'
                                                            ? this.props.editClick
                                                            : item.clickEvent === 'new'
                                                                ? this.props.newClick
                                                                : item.clickEvent === 'history'
                                                                    ? this.props.historyToggle
                                                                    : item.clickEvent === 'export'
                                                                        ? this.props.setModalExport
                                                                        : undefined
                                                    }
                                                    color={item.btnClass}>
                                                <i className={`icon ${item.icon}`}/>
                                            </Button>
                                        )
                                    } else if (item.id === 'saveOptions' && this.props.editOn) {

                                        return (

                                            <div className="dropdown" key={key}>
                                                <Button data-tip={item.title}
                                                        data-place={'top'}
                                                        color={item.btnClass}
                                                        data-toggle="dropdown">
                                                    <i className={`icon ${item.icon}`}/>
                                                </Button>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    {item.children.map((child, childKey) => {

                                                        const showOption = this.props.newRowAdded === true
                                                            ? child.showOnNewRow
                                                            : true;

                                                        const divClass = `${child.class} ${
                                                            (showOption) ? '' : ' d-none'
                                                            }`;

                                                        return (
                                                            <div className={divClass}
                                                               onClick={child.clickEvent === 'cancel'
                                                                   ? this.props.cancelClick
                                                                   : child.clickEvent === 'save-history'
                                                                       ? this.props.saveHistoryClick
                                                                       : child.clickEvent === 'save'
                                                                           ? this.props.saveClick
                                                                           : undefined
                                                               }
                                                               key={childKey}>
                                                                <i className={`icon ${child.icon} mr-2`}/>
                                                                {child.title}
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                                }
                                </ButtonGroup>

                                <MaximizeContent/>
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

function mapStateToProps(state) {
    return {
        language: state.language,
        editOn: state.editOn
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setModalImport: () => dispatch(modalImportToggle()),
        setModalExport: () => dispatch(modalExportToggle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarMatrix);