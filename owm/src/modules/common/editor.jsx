import React, {PropTypes, Component} from 'react';

export default class ConditionalWYSIWYG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field_name:this.props.field_name||"",
            field_value:this.props.field_value||"",
            showWYSIWYG:true
        };
        this.beginEdit = this.beginEdit.bind(this);
        this.initEditor = this.initEditor.bind(this);
    }
    render() {
        if ( this.state.showWYSIWYG  ) {
            var field = this.state.field_name;
            this.initEditor(field);
            return (
                <textarea name='editor' cols="100" rows="6" defaultValue={unescape(this.state.field_value)}></textarea>
            )
        } else {
            return (
                <p className='description_field' onClick={this.beginEdit}>{unescape(this.state.field_value)}</p>
            )
        }
    }
    beginEdit() {
        this.setState({showWYSIWYG:true})
    }
    initEditor(field) {
        var self = this;

        function toggle() {
            window.CKEDITOR.replace("editor", { toolbar: "Basic", width: 870, height: 150 });
            window.CKEDITOR.instances.editor.on('blur', function() {

                let data = window.CKEDITOR.instances.editor.getData();
                self.setState({
                    field_value:escape(data),
                    showWYSIWYG:false
                });
                self.value = data;
                window.CKEDITOR.instances.editor.destroy();
            });
        }
        window.setTimeout(toggle, 100);
    }
}