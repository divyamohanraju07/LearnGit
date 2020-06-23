import * as React from "react";
import {
  TextBox,
  FormHeadSection,
  SelectHelper,
  Option,
  DatePickerHelper,
  // RadioWrapper,
  // Radio,
  // Uploader,
  // uploadChecker,
  // retrieveDefaultFiles,
  A8V
} from "../../helpers/index";
// import {A8V} from "../../helpers";
import {
  Field,
  getFormSyncErrors,
  getFormValues
  // InjectedFormProps
} from "redux-form";
import { connect } from "react-redux";
// import Validate from "validate.js";
// const required = value => (value || typeof value === 'number' ? undefined : 'Required')

type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
};

type State = {
  sectionValidator: any;
  UploaderEsafSample: any;
};

class TabSampleTwo extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      basicInfo: ["ApplicationID", "BranchID", "extraField"],
      sectionTwo: ["BorrowerAddress"],
      Uploader: ["UploaderEsafSample"]
    },

    UploaderEsafSample: {
      // name of uploader field name
      fieldName: "UploaderEsafSample",
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        { name: "Adhar Card", key: "AdharCard" },
        { name: "Pan Card", key: "PanCard" },
        { name: "Passport", key: "Passport" }
      ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: ["AdharCard"],
      // uploadLimit handle how many fields the user need to upload
      uploadLimit: 3,
      /**
       * errorMsg : handle custom error messages.
       * you can pass to handle different sceneries
       */
      errorMsg: {
        //if upload limit exceed
        uploadLimit: "Upload limit exceed!",
        //if fileInfo.length != uploadLimit below message will show
        fileInfoUploadLimitMisMatch:
          "YOUR FIELD NAME props fileinfo and upload limit should be equal",
        //if multiple file uploads have same name
        variableNameConflict: "File Name should be unique",
        //if file uploaded, force your to select file/variable name
        updateVariableName: "Please Select File Name"
      },
      //this props handle defaultFiles fetching state
      initialUploadLoader: false
    }
  };

  async componentDidMount() {
    console.log("from cdm");
    console.log(this.props.formSyncError);
    //set initialUploader true
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafSample,
    //     initialUploadLoader: true
    //   }
    // }));

    //use this helper to retrieve default files
    // await retrieveDefaultFiles({
    //   taskInfo: this.props.task.taskInfo,
    //   fileInfo: this.state.UploaderEsafSample,
    //   fieldPopulator: this.props.fieldPopulator
    // });

    //set initialUploadLoader false
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafSample,
    //     initialUploadLoader: false
    //   }
    // }));
  }

  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Basic Information"
              sectionKey="basicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              // initialTab={true}
            />
            {/* <div className="form-section-content" style={{ display: "block" }}> */}
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant Id"}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "ApplicantID is required" })
                      // A8V.email({errorMsg : "valid email"})
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Branch Id"}
                    name="BranchID"
                    component={TextBox}
                    placeholder="Enter Branch Id"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    // validate={[Validate.required]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Branch Name"}
                    name="BranchName"
                    component={TextBox}
                    placeholder="Enter Branch Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Extra Field"}
                    name="extraField"
                    component={TextBox}
                    placeholder="Extra Field"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Widget"
                    name="selectWidget"
                    component={SelectHelper}
                    placeholder="Select a person"
                    className="a8Select"
                  >
                    <Option value="1">Option One</Option>
                    <Option value="2">Option Two</Option>
                    <Option value="3">Option Three</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Date"
                    name="dateA8"
                    component={DatePickerHelper}
                    showTime
                    placeholder="Select Time"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Section Two"
              sectionKey="sectionTwo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Borrower Address"}
                    name="BorrowerAddress"
                    component={TextBox}
                    placeholder="Enter BorrowerAddress"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Officer Name"}
                    name="OfficerName"
                    component={TextBox}
                    placeholder="Enter Officer Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("from tab sample case");
  console.log(getFormSyncErrors("sampleForm")(state));
  return {
    //get current form values
    formValues: getFormValues("sampleForm")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("sampleForm")(state),
    //taskInfo
    task: state.task
  };
};

export default connect(
  mapStateToProps,
  {}
)(TabSampleTwo);
