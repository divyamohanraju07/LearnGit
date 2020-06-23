import * as React from "react";
import { FormHeadSection, A8V, proceedNumber, Config } from "../../helpers";
import { TextBox, TextArea, Select, SelectHelper, DatePicker } from "a8flow-uikit";
import { Field, getFormSyncErrors, getFormValues } from "redux-form";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { default as ApiClient } from "a8forms-api-client";

const { Option } = SelectHelper;

type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
  formValues: any;
  moduleName: any;
};

type State = {
  sectionValidator: any;
  isReferralNameEnabled: any;
  isReferralCodeEnabled: any;
  loantypeOptions: any;
  loanType: any;
  loanSubTypeOptions: any;
  branchCodeOptions: any;
  BranchStateName: any;
  districtOptions: any;
};

class TabLeadDetails extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        applicationInfo: ["ApplicationID", "BranchID", "BranchName", "Geolocation", "ApplicationDate", "ApplicationType"],
        applicantInfo: [
          "LeadSource",
          "ReferralName",
          "ReferralContactNumber",
          "ReferralCode",
          "BorrowerName",
          "BorrowerMobile",
          "LoanAmount",
          "LoanPurpose",
          "BorrowerAddress"
        ]
      },
      isReferralNameEnabled: false,
      isReferralCodeEnabled: false,
      loantypeOptions: [],
      loanType: "",
      loanSubTypeOptions: [],
      branchCodeOptions: [],
      districtOptions: [],
      BranchStateName: ""
    };
  }

  async componentDidMount() {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null;

    this.handleApplicationID();

    let startLocation = JSON.parse(this.props.formValues["StartprocessGeolocation"].value);
    this.props.fieldPopulator("Geolocation", {
      "type:": "String",
      value: startLocation.locationName
    });

    let today = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
    let todaysDate = {
      type: "Date",
      value: today
    };
    this.props.fieldPopulator("ApplicationDate", todaysDate);
    // loanType options
    let config = {
      url: `${Config.apiUrl}/v1/loanType`,
      method: "get",
      headers: {
        Authorization: authToken
      }
    };
    axios(config)
      .then(response => {
        let loanType = response.data.loanType;
        let loanTypeDD = [];
        for (let iter: any = 0; iter < loanType.length; iter++) {
          loanTypeDD.push({
            value: loanType[iter].LoanType,
            label: loanType[iter].LoanType
          });
        }
        this.setState({
          loantypeOptions: loanTypeDD
        });
      })
      .catch(error => {
        console.log(error);
      });
    // branchMasters

    let branchConfig = {
      url: `${Config.apiUrl}/v1/branch-masters`,
      method: "get",
      headers: {
        Authorization: authToken
      }
    };
    axios(branchConfig)
      .then(response => {
        console.log(response);
        let branchData = response.data.branchMasters.map(item => {
          return {
            value: item.branch_name,
            label: item.branch_name,
            branchCode: item.branch_master_code,
            branchStateCode: item.state_code,
            branchDistrictCode: item.district_code
          };
        });
        this.setState({ branchCodeOptions: branchData });
      })
      .catch(error => {
        console.log("BranchMasters function error", error);
      });

    let {
        taskInfo: {
          info: { assignee }
        }
      } = this.props,
      apiClient = new ApiClient(Config.hostUrl, authToken),
      userDetails = await apiClient.getUserDetails(assignee);
    this.props.fieldPopulator("LG_code", {
      type: "string",
      value: userDetails.data.id,
      valueInfo: {}
    });
    this.props.fieldPopulator("LG_firstName", {
      type: "string",
      value: userDetails.data.firstName,
      valueInfo: {}
    });
    this.props.fieldPopulator("LG_lastName", {
      type: "string",
      value: userDetails.data.lastName,
      valueInfo: {}
    });
  }

  handleApplicationID = () => {
    let StateCode = "KL";
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let now = new Date().toDateString();
    let currentYear = now.match(/\d\d\d\d/g)[0].substring(2, 4);
    let currentDate = now.match(/\s\d\d/g)[0].replace(/\s/g, "");
    let currentMonth = now.match(/\s\w\w\w\s/g)[0].replace(/\s/g, "");
    for (let i = 0; i < months.length; i++) {
      if (currentMonth === months[i]) {
        if (String(i).length !== 1) {
          currentMonth = String(i);
        } else {
          currentMonth = "0" + String(i);
        }
      }
    }
    let applicationNumber = StateCode + currentYear + currentMonth + currentDate;
    let apIDs = { type: "String", value: applicationNumber };
    this.props.fieldPopulator("ApplicationID", apIDs);
  };

  handleLoanTypeChange = e => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null;
    this.props.fieldPopulator("LoanSubType", "");
    let config = {
      url: `${Config.apiUrl}/v1/loanSubType?loanType=` + e.value,
      method: "get",
      headers: {
        Authorization: authToken
      }
    };
    axios(config)
      .then(Response => {
        let loanType = Response.data.loanSubType;
        let loanTypeDD = [];
        for (let iter: any = 0; iter < loanType.length; iter++) {
          loanTypeDD.push({
            value: loanType[iter].loanSubType,
            label: loanType[iter].loanSubType
          });
        }
        this.setState({
          loanSubTypeOptions: loanTypeDD
        });
      })
      .catch(e => {
        console.log(e);
      });
  };
  handleLeadSourceChange = e => {
    if (e.value !== "Direct Lead" && e.value !== "Website Lead") {
      this.setState({ isReferralNameEnabled: true });
    } else {
      this.setState({ isReferralNameEnabled: false });
      this.props.fieldPopulator("ReferralName", "");
      this.props.fieldPopulator("ReferralContactNumber", "");
    }
    if (
      e.value === "Employee Referral" ||
      e.value === "Branch Lead" ||
      e.value === "DSA" ||
      e.value === "BC Referral" ||
      e.value === "Tele-Calling"
    ) {
      this.setState({ isReferralCodeEnabled: true });
    } else {
      this.setState({ isReferralCodeEnabled: false });
      this.props.fieldPopulator("ReferralCode", "");
    }
  };
  handleBranchCode = e => {
    let selection = e.value;
    let Branchcode = this.state.branchCodeOptions.filter(item => item.value === selection)[0].branchCode;
    let StateCode = this.state.branchCodeOptions.filter(item => item.value === selection)[0].branchStateCode;
    let DistrictCode = this.state.branchCodeOptions.filter(item => item.value === selection)[0].branchDistrictCode;
    this.props.fieldPopulator("branchStateCode", { type: "String", value: StateCode, valueInfo: {} });
    this.props.fieldPopulator("branchDistrictCode", { type: "String", value: DistrictCode, valueInfo: {} });
    this.props.fieldPopulator("BranchID", {
      type: "String",
      value: Branchcode,
      valueInfo: {}
    });
    let soAssignee = Branchcode + "SO";
    this.props.fieldPopulator("soAssignee", {
      type: "String",
      value: soAssignee.trim(),
      valueInfo: {}
    });
    let cifAssignee = Branchcode + "CIFFetch";
    this.props.fieldPopulator("cifAssignee", {
      type: "string",
      value: cifAssignee.trim(),
      valueInfo: {}
    });
    let documentAssignee = Branchcode + "docgen";
    this.props.fieldPopulator("documentAssignee", {
      type: "string",
      value: documentAssignee.trim(),
      valueInfo: {}
    });
  };

  handleLoanAmountInWords = e => {
    let value = e.value;
    var a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen "
    ];
    var b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    let num = value.replace(/,/g, "");
    if ((num = num.toString()).length > 9) return "overflow";
    const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = "";
    str += n[1] !== "00" ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore " : "";
    str += n[2] !== "00" ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh " : "";
    str += n[3] !== "00" ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand " : "";
    str += n[4] !== "0" ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred " : "";
    str += n[5] !== "00" ? (str !== "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : "";

    str += "Only.";
    this.props.fieldPopulator("LoanAmountInWords", {
      type: "String",
      value: str
    });
  };

  render() {
    return (
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="card-item-details-1-lead">
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Application Information"
              sectionKey="applicationInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Application ID <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Application ID"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[A8V.required({ errorMsg: "ApplicantID is required" })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Branch Name<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="BranchName"
                    component={Select}
                    placeholder="Enter Branch Name"
                    className="a8Select"
                    onChange={this.handleBranchCode}
                    showSearch
                    validate={[A8V.required({ errorMsg: "Branch Name is required" })]}
                  >
                    {this.state.branchCodeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Branch Code<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="BranchID"
                    component={TextBox}
                    placeholder="Enter Branch ID"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[A8V.required({ errorMsg: "Branch ID is required" })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Sourcing Location<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="Geolocation"
                    component={TextBox}
                    placeholder="Enter Sourcing Location"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "Sourcing Location is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Select Date<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="ApplicationDate"
                    component={DatePicker}
                    dateFormat="DD-MM-YYYY"
                    placeholder="Select Date"
                    validate={[A8V.required({ errorMsg: "Date is required" })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Application Type<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="ApplicationType"
                    component={Select}
                    placeholder="Select Application Type"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Application Type is required"
                      })
                    ]}
                  >
                    <Option value="New">New</Option>
                    {/* <Option value="Existing">Existing</Option> */}
                  </Field>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Information"
              sectionKey="applicantInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Lead Source"
                    label={
                      <span>
                        Lead Source<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="LeadSource"
                    component={Select}
                    placeholder="Select Lead Source"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Lead Source is required" })]}
                    onChange={this.handleLeadSourceChange}
                  >
                    <Option value="Direct Lead">Direct Lead</Option>
                    <Option value="Branch Lead">Branch Lead</Option>
                    <Option value="Customer Referral">Customer Referral</Option>
                    <Option value="DSA">DSA</Option>
                    <Option value="BC Referral">BC Referral</Option>
                    <Option value="Employee Referral">Employee Referral</Option>
                    <Option value="Website Lead">Website Lead</Option>
                    <Option value="Tele-Calling">Tele-Calling</Option>
                  </Field>
                </div>
                {this.state.isReferralNameEnabled ? (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Referral Name"}
                      name="ReferralName"
                      component={TextBox}
                      placeholder="Enter Referral Name"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[A8V.required({ errorMsg: "Referral Name is required" })]}
                    />
                  </div>
                ) : null}
                {this.state.isReferralNameEnabled ? (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Referral Contact Number"}
                      name="ReferralContactNumber"
                      component={TextBox}
                      placeholder="Enter Referral Contact Number"
                      type="text"
                      hasFeedback
                      normalize={proceedNumber}
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Referral Contact Number is required"
                        })
                      ]}
                    />
                  </div>
                ) : null}
                {this.state.isReferralCodeEnabled ? (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Referral Code"}
                      name="ReferralCode"
                      component={TextBox}
                      placeholder="Enter Referral Code"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[A8V.required({ errorMsg: "Referral Code is required" })]}
                    />
                  </div>
                ) : null}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Borrower Name"}
                    label={
                      <span>
                        Borrower Name<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="BorrowerName"
                    component={TextBox}
                    placeholder="Enter Borrower Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Borrower Name is required" }),
                      A8V.text({ errorMsg: "Only Character allowed" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Borrower Mobile"}
                    label={
                      <span>
                        Borrower Mobile<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="BorrowerMobile"
                    component={TextBox}
                    placeholder="Enter Borrower Mobile"
                    type="text"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Borrower Mobile is required" }),
                      A8V.minLength({
                        errorMsg: "Enter a Valid Mobile Number",
                        min: 10
                      }),
                      A8V.maxLength({
                        errorMsg: "Enter a Valid Mobile Number",
                        max: 10
                      }),
                      A8V.number({ errorMsg: "Only numbers allowed" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Alternate Mobile"}
                    name="AlternateMobile"
                    component={TextBox}
                    placeholder="Enter Alternate Mobile Number"
                    type="text"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.minLength({
                        errorMsg: "Enter a Valid Mobile Number",
                        min: 10
                      }),
                      A8V.maxLength({
                        errorMsg: "Enter a Valid Mobile Number",
                        max: 10
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Loan Amount<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    normalize={proceedNumber}
                    onChange={this.handleLoanAmountInWords}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Loan Amount is required" }),
                      A8V.minValue({ errorMsg: "", min: 25000 }),
                      A8V.maxValue({ errorMsg: "", max: 1000000 })
                    ]}
                  />
                </div>

                <Field
                  hidden={true}
                  name="LoanAmountInWords"
                  component={TextBox}
                  placeholder="Enter Loan Amount"
                  type="text"
                  hasFeedback
                  className="form-control-coustom"
                />

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Loan Product"
                    label={
                      <span>
                        {" "}
                        Loan Product <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="LoanPurpose"
                    component={Select}
                    placeholder="Enter Loan Purpose"
                    className="a8Select"
                    onChange={this.handleLoanTypeChange}
                    validate={[A8V.required({ errorMsg: "Loan Purpose is required" })]}
                  >
                    {this.state.loantypeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Sub type"
                    name="LoanSubType"
                    component={Select}
                    placeholder="Enter Loan Purpose Sub Type"
                    className="a8Select"
                    validate={[]}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{
                      width: "320px"
                    }}
                  >
                    {this.state.loanSubTypeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Borrower Address"}
                    label={
                      <span>
                        {" "}
                        Borrower Address <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="BorrowerAddress"
                    component={TextArea}
                    placeholder="Enter Borrower Address"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "Borrower Address is required"
                      }),
                      A8V.address({ errorMsg: "" })
                    ]}
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
  console.log("FROM MAP STATE TO PROPS Lead", state);

  return {
    //get current form values
    formValues: getFormValues(props.moduleName || "lead")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors(props.moduleName || "lead")(state)
  };
};

export default connect(
  mapStateToProps,
  {}
)(TabLeadDetails);
