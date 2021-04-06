import React from "react";

class Copyright extends React.Component {

    render() {
        return (
           <>&copy; Sekizgen {new Date().getFullYear()}</>
        )
    }
}

export default Copyright;