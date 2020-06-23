import * as React from "react";
import { Upload, Icon, Modal, Button } from "antd";
import { InjectedFormProps } from "redux-form";
import Validate from "validate.js";
import "./style.css";

//filelist type definition
interface FileList {
  lastModified: any;
  lastModifiedDate: any;
  name: string;
  originFileObj: any;
  percent: any;
  size: number;
  status: string;
  type: string;
  uid: string;
}

type upProps = {
  input: any;
  defaultFileList: any;
};

type upState = {
  fileList?: FileList[];
  previewVisible: boolean;
  previewImage: string;
  selectedFileList: any;
  selectedFile: any;
};

class UploaderWrapper extends React.Component<upProps, upState> {
  state = {
    previewVisible: false,
    previewImage: "",
    selectedFile: null,
    selectedFileList: []
  };

  componentDidMount() {
    //append default value to redux-form
    if (
      this.props.defaultFileList &&
      Validate.isArray(this.props.defaultFileList)
    ) {
      this.props.input.onChange(this.props.defaultFileList);
    }
  }

  dummyRequest = ({
    file,
    onSuccess,
    onProgress
  }: {
    file: any;
    onSuccess: any;
    onProgress: any;
  }) => {
    // onProgress(10,file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  // beforeUpload = (value: any) => {
  //   console.log("FROM BEFORE UPLOAD PART");
  //   let reader = new FileReader();
  //   reader.readAsDataURL(value);
  //   reader.onload = function() {
  //     console.log("FROM BASE64 INSIDE");
  //     console.log(reader.result);
  //   };
  //   reader.onerror = function(error) {
  //     console.log("File Upload Error: ", error);
  //   };
  //   console.log(value);
  //   console.log(btoa(value));
  //   return { ...value, tempName: "sathish" };
  // };

  handleOnChange = (fileInfo: any, cb: any) => {
    try {
      let reader = new FileReader();
      reader.readAsDataURL(fileInfo.file.originFileObj);
      reader.onload = () => {
        let base64String = reader.result;
        let { file: { uid }, fileList } = fileInfo;
        let filteredFileList = fileList.map((value: any) => {
          if (value.uid === uid) {
            return { ...value, serverFile: base64String }
          } else {
            return value;
          }
        });
        this.props.input.onChange({ fileInfo, fileList: filteredFileList });
      };
      reader.onerror = function (error) {
        console.error("Base64 converter error returnBase64");
        throw error;
      };
    } catch (error) {
      throw error;
    }
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { value, onChange, ...filteredInput } = this.props.input;

    const UploadButton = () => (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <React.Fragment>
        <div className="form-section-content" style={{ display: "block" }}>
          <div>
            <div className="form-group col-xs-12">
              <div>
                <Upload
                  customRequest={this.dummyRequest}
                  listType="picture-card"
                  onChange={this.handleOnChange}
                  className="uploadWrapper"
                  // beforeUpload={this.beforeUpload}
                  {...this.props}
                  {...filteredInput}
                >
                  <UploadButton />
                </Upload>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UploaderWrapper;
