import React from "react";
import PropTypes from "prop-types";
class Editor extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isEdit:false,
            Component: this.props.element||null,
            config:{...this.props.config}
        };
    }
    render(){
        const {Component,config,isEdit} = this.state;
        const {style,id} = config;
        return (
            <Component style={style} id={id} class={isEdit?"hoverable":""} />
            {/* <h3 id="sampleTitle" style={infor.title["styles"]} class="hoverable" onClick={onEdit}>{infor.title["text"]}</h3> */}
        );
    }
}
Editor.propTypes = {
    content: PropTypes.any,
    config: PropTypes.object,
    isScriptLoaded: PropTypes.bool,
    scriptUrl: PropTypes.string,
    activeClass: PropTypes.string,
    events: PropTypes.object
};
export default Editor;
