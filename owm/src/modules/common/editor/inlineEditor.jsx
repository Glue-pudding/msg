import React from "react";
import PropTypes from "prop-types";
import {InlineConfig} from  './editConfig';
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      config: { ...this.props.config },
    };
  }
  onEdit = () => {
    let t = this;
    const { id } = this.state.config;
    const { getValue} = this.props;
    const CKEDITOR = window.CKEDITOR;
    if (CKEDITOR.instances && CKEDITOR.instances[id]) {
      return false;
    }
    var editorElement = CKEDITOR.document.getById(id);
    editorElement.setAttribute("contenteditable", "true");
    t.setState({ isEdit: true });
    CKEDITOR.inline(id,InlineConfig)

    CKEDITOR.instances[id].on("blur", function(ele) {
      let data = CKEDITOR.instances[id].getData();
      t.setState({
        field_value: escape(data),
        isEdit: false,
        value: data
      });
      getValue(data);
      CKEDITOR.instances[id].destroy();
    });
  };
  render() {
    const { config, isEdit } = this.state;
    const {id, text } = config;
    return (
      <p
        id={id}
        class={!isEdit ? "editable" : ""}
        onClick={this.onEdit}
        dangerouslySetInnerHTML={{ __html: text}}
      >
      </p>
    );
  }
}
Editor.propTypes = {};
export default Editor;
