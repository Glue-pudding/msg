import React, { Component } from "react";
import propTypes from "prop-types";
import { Card, Input, Icon, Upload, Modal, Popconfirm, message } from "antd";
import styles from "./Banner.module.less";

import API from "@/mock";

class ConStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: props.canEdit || false,
      disabled: props.disabled || false,
      canSave: false,
      InputValue: props.InputValue,
      previewVisible: false,
      previewImage: "",
      url: this.props.url,
      loading: false,
      defaultFileList: this.props.url
        ? [
            {
              uid: -1,
              name: this.props.InputValue,
              status: "done",
              url: this.props.url,
              thumbUrl: this.props.url
            }
          ]
        : null
    };
    this.priValue = this.props.InputValue;
  }
  beforeUpload = file => {
    const isPic = file.type === "image/jpeg" || file.type === "image/png";
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isPic) {
      alert("请上传图片文件");
    }
    if (!isLt1M) {
      alert("图片大小不能超过1MB!");
    }
    return isPic && isLt1M;
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  Edit = () => {
    const { canEdit, InputValue } = this.state;
    const t = this;
    if (!canEdit) {
      return [
        <div
          onClick={() => {
            t.setState({
              canEdit: true,
              // InputValue: '',
              InputValue,
              canSave: false,
              canEdit: true,
              disabled: false,
            });
          }}
        >
          编辑
        </div>
      ];
    }

    return [
      <div
        onClick={() => {
          // console.log('取消', this.priValue);
          t.props.handleCancel();
          t.setState({
            canEdit: false,
            InputValue: this.priValue,
            canSave: false,
            disabled: true,
            url: this.props.url
          });
        }}
      >
        取消
      </div>,
      <div
        onClick={() => {
          if (!t.state.url || !t.state.InputValue) {
            message.info("请添加图片和标题");
          } else {
            let obj = { url: t.state.url, title: t.state.InputValue };
            t.props.handleSave(obj);
            t.setState({
              canEdit: false,
              canSave: true,
              disabled: true
            });
            this.priValue = t.state.InputValue;
          }
        }}
      >
        保存
      </div>
    ];
  };

  renderSave() {
    return (
      <div className={styles.Ycard}>
        <Input
          onChange={e => {
            this.setState({
              InputValue: e.target.value
            });
          }}
          value={this.state.InputValue}
        />
      </div>
    );
  }

  renderInput() {
    const { canEdit, InputValue, canSave } = this.state;
    if (canEdit || canSave) {
      return (
        <div>
          {canSave ? (
            <div className={styles.Ycard}>{InputValue}</div>
          ) : (
            this.renderSave()
          )}
        </div>
      );
    }

    return <div className={styles.Ycard}>{InputValue}</div>;
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    const t = this;
    t.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleRemove = () => {
    this.setState({ url: "" });
  };

  handleChange = info => {
    // let url = info.file.response&&info.file.response.data;
    //  this.setState({avatar:url,loading:false})
    let status = info.file.status;
    if (status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (status === "removed" || status === "error") {
      this.setState({ defaultFileList: "", loading: false });
      return;
    }
    if (status === "done") {
      let url = info.file.response && info.file.response.data;

      let iObj = [
        {
          uid: -1,
          name: "logo",
          status: "done",
          url: url
        }
      ];
      this.setState({ loading: false, defaultFileList: iObj, url: url });
    }
  };

  render() {
    var t = this,
      state = t.state;
    const { previewVisible, previewImage, canEdit } = t.state;
    const { title } = t.props;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus-square"} />
      </div>
    );
    return (
      <div >
          <Card actions={this.Edit()} className={styles.industCard}>
						<Popconfirm title="确认删除?" onConfirm={this.props.delCard}okText="是" cancelText="否">
							<Icon type="close-circle-o" />
						</Popconfirm>
            {!canEdit?<div><img
              src={this.state.url}
              style={{ width: "100px", height: "100px" }}
              className={styles.dropbox}
            />
            <p className={styles.Ycard}>{title}</p>
						{this.renderInput()}</div>:
						<div>
							<div className="clearfix">
								<Upload
									name="file"
									listType="picture-card"
									className={styles.dropbox}
									action={API.API_FILE_UPLOAD}
									beforeUpload={this.beforeUpload.bind(this)}
									onPreview={this.handlePreview}
									onChange={this.handleChange.bind(this)}
									onRemove={this.handleRemove}
									disabled={state.disabled}
									defaultFileList={this.state.defaultFileList}
								>
									{this.state.defaultFileList ? null : uploadButton}
								</Upload>

								<Modal
									visible={previewVisible}
									footer={null}
									onCancel={this.handleCancel}
								>
									<img
										alt="example"
										style={{ width: "100%" }}
										src={previewImage}
									/>
								</Modal>
							</div>
							<p className={styles.Ycard}>{title}</p>
            	{this.renderInput()}
						</div>
						}
          </Card>
      </div>
    );
  }
}

ConStyle.propTypes = {
  className: propTypes.string,
  title: propTypes.string,
  // description: propTypes.string,
  imgSrc: propTypes.string,
  handleSave: propTypes.func,
  InputValue: propTypes.string
};

ConStyle.defaultProps = {
  className: "",
  title: "",
  // description: '',
  imgSrc: "",
  handleSave: () => {},
  InputValue: ""
};

export default ConStyle;
