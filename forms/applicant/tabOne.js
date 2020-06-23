import React, { Component } from "react";
import {
  TextBox,
  FormHeadSection,
  SelectHelper,
  Option,
  // DatePickerHelper,
} from "../../helpers";
import { Field, getFormSyncErrors, getFormValues } from "redux-form";
import { connect } from "react-redux";
import "./tab.css";
class TabOne extends Component {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      basicInfo: ["ApplicationID", "BranchID", "extraField"],
      sectionTwo: ["BorrowerAddress"],
      Uploader: ["UploaderEsaf"]
    }
  };

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
                    onChange={this.handle}
                  >
                    <Option value="1">Option One</Option>
                    <Option value="2">Option Two</Option>
                    <Option value="3">Option Three</Option>
                  </Field>
                </div>
                {/* <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Date"
                    name="dateA8"
                    component={DatePickerHelper}
                    showTime
                    placeholder="Select Time"
                  />
                </div> */}
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
  console.log("from applicant");
  console.log(state);
  return {
    //get current form values
    formValues: getFormValues("applicant")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("applicant")(state)
  };
};

export default connect(
  mapStateToProps,
  {}
)(TabOne);
