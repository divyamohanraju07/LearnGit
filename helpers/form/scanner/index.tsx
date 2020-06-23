import * as React from "react";
import { Form, Icon, Spin } from "antd";
// import { ajv } from "../ajvPlus";
import { ajv } from "../../ajvPlus";
import { _schemaScanner } from "./schema";
import axios from "axios";
import "../style.css";
type ScannerProps = {
  parserVar: string;
  a8flowApiUrl: string;
  docType: string;
  docParse: boolean;
  taskInfo: any;
  input: any;
  isDataFound: any;
  ipc: any;
  imageVar: any;
  label: string;
};

type ScannerState = {};

class Scanner extends React.Component<ScannerProps, ScannerState> {
  state = {
    scannerModalVisibility: false,
    modalLiveController: false,
    scannerData: "",
    uploadedImage: "",
    imageLoader: false
  };

  componentDidMount() {
    try {

      if (!this.props.docType) {
        throw new Error(`docType prop is required for @${
          this.props.input.name
          } Scanner Component`);
      }

      if (!ajv.validate(_schemaScanner, this.props)) {
        throw ajv.errors;
      }
      //extrace information for scanner
      let {
        parserVar,
        a8flowApiUrl: url,
        docType,
        docParse: parse,
        taskInfo: {
          info: { processInstanceId, authToken }
        },
        imageVar
      } = this.props;

      let scannerFormat = {};

      if (
        docType === "PAN" ||
        docType === "AADHAR" ||
        docType === "DL" ||
        docType === "CHEQUE" ||
        docType === "PASSPORT" ||
        docType === "VOTERID"
      ) {
        scannerFormat = {
          docType,
          parse,
          a8FlowInfo: {
            url,
            imageVar,
            parserVar,
            processInstanceId,
            authToken
          }
        };
      } else if (docType === "QR") {
        scannerFormat = {
          docType,
          a8FlowInfo: {
            url,
            parserVar,
            processInstanceId,
            authToken
          }
        };
      } else if (docType === "PDF") {
        scannerFormat = {
          docType,
          a8FlowInfo: {
            url,
            imageVar,
            processInstanceId,
            authToken
          }
        };
      }

      this.setState(
        {
          scannerData: window.btoa(JSON.stringify(scannerFormat))
        },
      );

      //update pan image is data found
      if (this.props.docType !== "QR" && this.props.isDataFound) {
        this.updateImage();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  componentDidUpdate = (prevProps: any) => {
    if (
      this.props.isDataFound &&
      JSON.stringify(prevProps.isDataFound) !==
      JSON.stringify(this.props.isDataFound) &&
      this.props.docType !== "QR"
    ) {
      this.updateImage();
    }
  };

  updateImage = async () => {
    try {
      let {
        a8flowApiUrl,
        imageVar,
        taskInfo: {
          info: { processInstanceId, authToken }
        }
      } = this.props;
      //trigger loader for fetching image
      this.setState({
        imageLoader: true,
        uploadedImage: null
      });
      let result = await axios.get(
        `${a8flowApiUrl}process-instance/${processInstanceId}/variables/${imageVar}/data`,
        {
          headers: { Authorization: authToken },
          responseType: "blob"
        }
      );
      this.setState({
        imageLoader: false
      });
      if (result) {
        var reader = new FileReader();
        reader.readAsDataURL(result.data);
        reader.onloadend = () => {
          let base64data = reader.result;
          this.setState({
            uploadedImage: base64data
          });
        };
      }
    } catch (e) {
    } finally {
      this.setState({
        imageLoader: false
      });
    }
  };

  handleModal = () => {
    if (this.props.ipc) {
      this.props.ipc.source.postMessage(
        {
          action: "openScannerDrawer",
          values: {
            scannerData: this.state.scannerData
          }
        },
        "*"
      );
    }
  };

  handleImagePreview = () => {
    if (this.props.ipc) {
      this.props.ipc.source.postMessage(
        {
          action: "openImageView",
          values: {
            imageData: this.state.uploadedImage
          }
        },
        "*"
      );
    }
  };

  render() {
    return (
      <div className="scannerWrapper">
        <Form.Item label={`${this.props.label}`}>
          <div className="documentPreviewer">
            <span
              onClick={this.handleModal.bind(this, true)}
              className={"scannerButtonWrapper"}
            >
              <Icon type={"scan"} className={"scannerIcon"} />
            </span>

            {this.state.imageLoader && (
              <div>
                <Spin className="spinnerStyle" tip={"Fetching Document..."} />
              </div>
            )}

            {this.state.uploadedImage && (
              <div className="filePreviewer">
                <span
                  className="form-files-preview-item"
                  onClick={this.handleImagePreview}
                >
                  <span className="form-files-preview-item-image">
                    <img src={this.state.uploadedImage} alt="scannerImage" />
                  </span>
                </span>
              </div>
            )}
          </div>
        </Form.Item>
      </div>
    );
  }
}

export default Scanner;
