import React from "react";

class Copyright extends React.Component {

    render() {
        return (
           <>&copy; Ericsson {new Date().getFullYear()}</>
        )
    }
}

export default Copyright;