import React from "react";

class Copyright extends React.Component {

    render() {
        return (
           <>&copy; KolayOto {new Date().getFullYear()}</>
        )
    }
}

export default Copyright;