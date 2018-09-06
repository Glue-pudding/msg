import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
    getInput = () => {
      if (this.props.inputType === 'number') {
        return <InputNumber size="small" />;
      }
      return <Input size="small" />;
    };
    render() {
      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        ...restProps
      } = this.props;
      return (
        <EditableContext.Consumer>
          {(form) => {
            const { getFieldDecorator } = form;
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem>
                    {getFieldDecorator(dataIndex, {
                      rules: [
                        {
                          required: true,
                          message: `Please Input ${title}!`,
                        },
                      ],
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
                ) : (
                  restProps.children
                )}
              </td>
            );
          }}
        </EditableContext.Consumer>
      );
    }
  }