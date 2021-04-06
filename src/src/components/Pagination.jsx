import React from 'react';
import {connect} from "react-redux";
import Pagination from "react-js-pagination";

class PaginationMatrix extends React.Component {

    render() {
        const {language, editOn} = this.props;

        if (language) {
            return (
                <>
                    {editOn &&
                    <p className={'text-muted'}>
                        {language.paginationDisabled}
                    </p>
                    }

                    {!editOn &&
                    <Pagination
                        activePage={this.props.activePage}
                        itemsCountPerPage={this.props.itemPerPage}
                        totalItemsCount={this.props.totalCountOfData}
                        pageRangeDisplayed={10}
                        onChange={this.props.handlePageChange.bind(this)}
                    />
                    }
                </>
            )
        } else {
            return (<></>)
        }
    }
}

function mapStateToProps(state) {
    return {
        language: state.language,
        editOn: state.editOn
    }
}

export default connect(mapStateToProps)(PaginationMatrix);