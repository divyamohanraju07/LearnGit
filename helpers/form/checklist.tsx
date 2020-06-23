import * as React from "react";
import { Form, Icon } from "antd";
import classname from "classnames";
import validate from "validate.js";
import { IsJsonString } from "../filter";
import moment from "moment";
import { Field } from "redux-form";
import { Select, SelectHelper, TextBox } from "a8flow-uikit";
import { A8V } from "../../helpers"

export type checklistProps = {
  input: any;
  fieldKey: string;
  fieldValue: any;
  validation: any;
  meta: any;
  ipc: any;
};

export interface checklistState { }

const { Option } = SelectHelper;

class checklist extends React.Component<checklistProps, checklistState>  {
  state = {};

  handleChange = (event: any) => {
    let { value } = this.props.input;
    if (this.props.validation.includes("required") && !event.target.checked) {
      this.props.input.onChange("");
      this.props.input.onBlur("");
    } else {
      let processVariableStructure = {
        type: value.type ? value.type : "Boolean",
        value: event.target.checked,
        valueInfo: validate.isEmpty(value.valueInfo) ? {} : value.valueInfo
      };
      this.props.input.onChange(processVariableStructure);
      this.props.input.onBlur(processVariableStructure);
    }
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

  handleFilePreview = (data: any, fileType: string) => {
    if (this.props.ipc) {
      this.props.ipc.source.postMessage(
        {
          action: "openFile",
          values: {
            data: data,
            fileType: fileType
          }
        },
        "*"
      );
    }

  }

  handleDownload = (base64Data: string, valueInfo: any) => {
    let element = document.createElement("a");
    element.setAttribute("href", base64Data);
    element.setAttribute("download", valueInfo.filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  renderValueFields = (fieldValue: {
    type: string;
    value: any;
    valueInfo: any;
    fieldType: string;
  }) => {
    let { type, value, valueInfo, fieldType = "" } = fieldValue;

    if (type === "String") {
      if (!IsJsonString(value)) {
        //if the value is not a JSON string
        return (
          <div className="col-xs-8 col-md-6">
            <p>
              <strong>{value}</strong>
            </p>
          </div>
        );
      } else {
        //if it is a JSON string, then check with fieldType
        if (fieldType === "Reference") {
          let { Name, Address, Mobile, Type } = JSON.parse(value);
          return (
            <div style={{ display: "flex", paddingLeft: "15px" }}>
              <div>
                <div>
                  <p>
                    <strong>{Name}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{Address}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{Mobile}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{Type}</strong>
                  </p>
                </div>
              </div>
            </div>
          );
        }
      }
    } else if (type === "File") {
      const imageFileTypes: string[] = ["jpg", "png", "gif", "jpeg"]
      const fileType = valueInfo.filename.split(".")[1].toLowerCase();

      if (imageFileTypes.some(x => x === fileType)) {
        return (
          <div className="filePreviewer">
            <span
              className="form-files-preview-item"
              style={{ textAlign: "center", width: "auto" }}
            >
              <span
                className="form-files-preview-item-image"
                style={{ width: "auto" }}
                onClick={() => this.handleImagePreview(value)}
              >
                <img src={value} alt="scannerImage" />
              </span>
              <span style={{ textAlign: "center" }}>
                <Icon
                  className="downloadIcon"
                  type="download"
                  onClick={() => this.handleDownload(value, valueInfo)}
                />
              </span>
            </span>
          </div>
        );
      } else {
        const xlTypes = ["xlsb", "xltx", "xltm", "xls", "xlsx"];
        return (
          <div className="filePreviewer">
            <span
              className="form-files-preview-item"
              style={{ textAlign: "center", width: "auto" }}
            >
              <span
                className="form-files-preview-item-image"
                style={{ width: "auto" }}
                onClick={() => this.handleFilePreview(value, fileType)}
              >
                {fileType === "pdf" && (
                  <div className="customIcon">
                    <Icon type="file-pdf" />
                  </div>
                )}
                {fileType === "docx" && (
                  <div className="customIcon">
                    <Icon type="file-word" />
                  </div>
                )}
                {xlTypes.indexOf(
                  fileType
                ) !== -1 && (
                    <div className="customIcon">
                      <Icon type="file-excel" />
                    </div>
                  )}
              </span>
              <span style={{ textAlign: "center" }}>
                <Icon
                  className="downloadIcon"
                  type="download"
                  onClick={() => this.handleDownload(value, valueInfo)}
                />
              </span>
            </span>
          </div>
        );
      }
    } else if (type === "Date") {
      return (
        <div className="col-xs-8 col-md-6">
          <p>
            <strong>{moment(value).format("DD/MM/YYYY")}</strong>
          </p>
        </div>
      );
    }
    else if (type === "Object") {
      return (
        <div className="filePreviewer">
          <span
            className="form-files-preview-item"
            style={{ textAlign: "center", width: "auto" }}
          >
            <span
              className="form-files-preview-item-image"
              style={{ width: "auto" }}
              onClick={() => this.handleImagePreview(value)}
            >
              <img src={value} alt="scannerImage" />
            </span>
            <span style={{ textAlign: "center" }}>
              <Icon
                className="downloadIcon"
                type="download"
                onClick={() => this.handleDownload(value, valueInfo)}
              />
            </span>
          </span>
        </div>
      );
    }
  };

  render() {
    let {
      input,
      fieldKey = "",
      fieldValue,
      meta,
      validation = []
    } = this.props;
    let { value } = input;
    let { touched, invalid, error } = meta;
    let hasError = touched && invalid;

    return (
      <Form.Item
        validateStatus={hasError ? "error" : "success"}
        style={{ marginBottom: "0px" }}
      >
        <div
          className={classname("list-table-item", { selected: value.value })}
          style={{ padding: "30px 0 10px 40px" }}
        >
          <label className="input-check input-control">
            <input
              type="checkbox"
              checked={value ? value.value : undefined}
              onChange={e => this.handleChange(e)}
            />
            <span></span>
          </label>
          <div className="row">
            <div className="col-xs-4 col-md-3">
              <p>
                {fieldKey}
                {validation.includes("required") && (
                  <span style={{ color: "#cb1e1a" }}>*</span>
                )}
              </p>
            </div>
            {!validate.isEmpty(fieldValue) &&
              this.renderValueFields(fieldValue)}
          </div>
          {!validate.isEmpty(fieldValue) && fieldValue.fieldType === "Reference" &&
            <div className="row">
              <div className="col-xs-4 col-md-3">
                <Field
                  label={"Reference Call Result"}
                  name={`${fieldKey}_CallResult`}
                  component={Select}
                  placeholder="Select Call Result"
                  className="a8Select"
                >
                  <Option value="Excellent">Excellent</Option>
                  <Option value="Good">Good</Option>
                  <Option value="Average"> Average</Option>
                  <Option value="Bad">Bad</Option>
                </Field>
              </div>
              <div className="col-xs-4 col-md-3">
                <Field
                  label={"Reference Remarks"}
                  name={`${fieldKey}_Remarks`}
                  component={TextBox}
                  placeholder="Enter Reference Remarks"
                  type="text"
                  hasFeedback
                  className="form-control-custom"
                  validate={[
                    A8V.required({ errorMsg: "Refernce Remark is required" })
                  ]}
                />
              </div>
            </div>
          }
        </div>

        {hasError && <div className="ant-form-explain">{error}</div>}
      </Form.Item>
    );
  }
}

export default checklist;
