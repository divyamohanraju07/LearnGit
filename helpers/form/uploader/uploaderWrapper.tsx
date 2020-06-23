import * as React from "react";
import { Icon, Popover, Tag, Spin } from "antd";
import { InjectedFormProps } from "redux-form";
import Validate from "validate.js";
import uuid from "uuid";
import className from "classnames";
import UploaderPopOver from "./uploaderPopover";
import validate from "validate.js";

type upProps = {
  input: any;
  meta: any;
  defaultFileList: any;
  accept: string;
  fileInfo: any;
  uploadLimit: number;
  popOverTitle: string;
  errorThrower: () => void;
  uploaderConfig: any;
  initialUploadLoader: boolean;
  multiple: boolean;
  defaultAnnotation?: string;
  isReadOnly: boolean;
  ipc: any;
} & InjectedFormProps;

type upState = {
  xlTypes: any;
  imageFileTypes: string[];
  filePreviewPointer: string;
  uploadEnabler: boolean;
};

class UploaderWrapper extends React.Component<upProps, upState> {
  state = {
    imageFileTypes: ["jpg", "png", "gif", "jpeg"],
    xlTypes: ["xlsb", "xltx", "xltm", "xls", "xlsx"],
    filePreviewPointer: "",
    uploadEnabler: false
  };

  handleFile = (file: any) => {
    try {
      let { files } = file.target;
      for (let key in files) {
        if (files.hasOwnProperty(key)) {
          let reader = new FileReader();
          reader.readAsDataURL(files[key]);
          reader.onload = (e: any) => {
            let defaultVariableName = this.props.defaultAnnotation
              ? { variableName: this.props.defaultAnnotation }
              : {};
            let filteredFile = {
              File: files[key],
              uid: uuid(),
              result: e.target.result,
              ...defaultVariableName
            };
            let finalValues = [filteredFile];
            let { value } = this.props.input;
            if (Validate.isObject(value)) {
              finalValues = [...value.values, ...finalValues];
            }
            this.props.input.onChange({ values: finalValues, type: "file" });
            this.props.input.onBlur({ values: finalValues, type: "file" });
          };
        }
      }
    } catch (error) {
      throw error;
    }
  };

  updateFileVariableName = ({
    variableName,
    uid
  }: {
    variableName: string;
    uid: string;
  }) => {
    let { values } = this.props.input.value;
    let updatedList = values.map((data: any) => {
      if (data.uid === uid) {
        return { ...data, variableName };
      }
      return data;
    });
    this.props.input.onChange({
      values: updatedList,
      type: "file"
    });
    this.props.input.onBlur({ values: updatedList, type: "file" });
  };

  //extrace file name and return file type
  filterFileName = (name: string) => {
    let regexAll = /[^\\]*\.(\w+)$/;
    let total: any = name.match(regexAll);
    return total[1];
  };

  handleFilePreviewPointer = (uid: string) => {
    this.setState({
      filePreviewPointer: uid
    });
  };

  handleFileDelete = (uid: string) => {
    let { values } = this.props.input.value;
    let result = values.filter((file: any) => file.uid !== uid);
    this.props.input.onChange({
      values: result,
      type: "file"
    });
    this.props.input.onBlur({
      values: result,
      type: "file"
    });
  };

  handleDownload = (data: any) => {
    let element = document.createElement("a");
    element.setAttribute("href", data.result);
    element.setAttribute("download", data.File.name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  handleImagePreview = (base64Data: string) => {
    if (this.props.ipc) {
      this.props.ipc.source.postMessage(
        {
          action: "openImageView",
          values: {
            imageData: base64Data
          }
        },
        "*"
      );
    }
  };

  render() {
    const { accept = "", multiple = false, isReadOnly = false } = this.props;
    const { fileInfo = [] } = this.props.uploaderConfig;
    const {
      value: { values },
      onChange,
      meta,
      onBlur,
      ...inputs
    } = this.props.input;
    const { touched, invalid, error } = this.props.meta;
    const hasError = touched && invalid;

    return (
      <React.Fragment>
        <div className="fileUploadWrapper">
          {hasError && (
            <div>
              <p style={{ color: "#cb1e1a" }}>{error}</p>
            </div>
          )}
          <div className="form-files">
            {!isReadOnly && (
              <label className="form-files-input">
                <input
                  type="file"
                  multiple={multiple}
                  disabled={this.state.uploadEnabler}
                  style={{ cursor: "drag" }}
                  onChange={this.handleFile}
                  accept={accept}
                  {...inputs}
                />
              </label>
            )}
            {/* {this.props.initialUploadLoader */}
            {this.props.initialUploadLoader && (
              <div>
                <Spin
                  className="spinnerStyle"
                  tip={"Loading default files..."}
                />
              </div>
            )}
            {values &&
              values.length > 0 &&
              values.map((data: any) => (
                <div className="filePreviewer" key={data.uid}>
                  <span
                    className="form-files-preview-item"
                    style={{ width: "auto" }}
                    onClick={() => this.handleImagePreview(data.result)}
                  >
                    <span
                      className="form-files-preview-item-image"
                      onMouseEnter={this.handleFilePreviewPointer.bind(
                        this,
                        data.uid
                      )}
                      onMouseLeave={this.handleFilePreviewPointer.bind(
                        this,
                        ""
                      )}
                    >
                      {this.state.imageFileTypes.indexOf(
                        this.filterFileName(data.File.name)
                      ) !== -1 && (
                          <img src={`${data.result}`} alt="uploadedImage" />
                        )}
                      {this.filterFileName(data.File.name) === "pdf" && (
                        <div className="customIcon">
                          <Icon style={{}} type="file-pdf" />
                        </div>
                      )}
                      {this.filterFileName(data.File.name) === "docx" && (
                        <div className="customIcon">
                          <Icon type="file-word" />
                        </div>
                      )}
                      {this.state.xlTypes.indexOf(
                        this.filterFileName(data.File.name)
                      ) !== -1 && (
                          <div className="customIcon">
                            <Icon type="file-excel" />
                          </div>
                        )}
                      {/* <div className={data.uid === this.state.filePreviewPointer ? "active" : "inactive"} > */}
                      <div
                        className={className("actionWrapper", {
                          // inactive: false
                          inactive: this.state.filePreviewPointer !== data.uid
                        })}
                      >
                        {/* <div className="actionWrapper"> */}
                        {!isReadOnly && (
                          <Icon
                            type="delete"
                            // theme="filled"
                            onClick={this.handleFileDelete.bind(this, data.uid)}
                            className="actionIconStyle"
                          />
                        )}
                        <Icon
                          type="download"
                          className="actionIconStyle"
                          onClick={this.handleDownload.bind(this, data)}
                        />
                      </div>
                    </span>
                    {validate.isEmpty(this.props.defaultAnnotation) &&
                      !isReadOnly ? (
                        <Popover
                          placement="bottom"
                          content={
                            <UploaderPopOver
                              fileUniqueId={data.uid}
                              fileInfo={fileInfo}
                              handleFile={this.updateFileVariableName}
                            />
                          }
                          title="Select File Name"
                          trigger="click"
                        >
                          {data.variableName ? (
                            // <div className="fileNameWrapper">{`${
                            //   data.File.name
                            // }`}</div>
                            <div className="fileNameWrapper">
                              <Tag
                                color="#cb1e1a"
                                className="tagWrapper"
                              >{`${data.variableName}`}</Tag>
                            </div>
                          ) : (
                              <div className="fileNameWrapper">
                                <Tag
                                  className="tagWrapper"
                                  color="#cb1e1a"
                                  style={{ textAlign: "center" }}
                                >
                                  <Icon type="edit" />
                                </Tag>
                              </div>
                            )}
                        </Popover>
                      ) : (
                        <div className="fileNameWrapper">
                          <Tag color="#cb1e1a" className="tagWrapper">
                            {isReadOnly
                              ? data.variableName
                              : `${this.props.defaultAnnotation}`}
                          </Tag>
                        </div>
                      )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UploaderWrapper;
