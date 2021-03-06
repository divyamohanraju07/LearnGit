import * as React from "react";
import { AccountDetailsView } from "a8flow-uikit";
import {
  getFormSyncErrors,
  getFormValues
} from "redux-form";
import { Button, Table } from "antd";
import { connect } from "react-redux";
import validate from "validate.js";
import classname from "classnames";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import Column from "antd/lib/table/Column";
import { Config } from "../../helpers";
import { default as ApiClient } from "a8forms-api-client";

type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
  formValues: any;
};
type State = {
  sectionValidator: any;
  cardView: any;
  coAppCardView: any;
  guaCardView: any;
  UploaderEsafSample: any;
  returnData: any;
};
class TabApplicantBasicInformation extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      ApplicantBasicInformation: [],
      coApplicantBasicInformation: [],
      guarantorBasicInformation: [],
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
      // fileInfo: [
      //   { name: "Adhar Card", key: "AdharCard" },
      //   { name: "Pan Card", key: "PanCard" },
      //   { name: "Passport", key: "Passport" }
      // ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: ["AdharCard"],
      // uploadLimit handle how many fields the user need to upload
      // uploadLimit: 3,
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
    },
    cardView: [],
    coAppCardView: [],
    guaCardView: [],
    returnData: []
  };

  componentDidMount = async () => {
    this.handleReturn();

    let {
      taskInfo: {
        info: { assignee },
      },
    } = this.props,
      authToken =
        this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
          this.props.taskInfo.info.authToken : null,
      apiClient = new ApiClient(Config.hostUrl, authToken),
      userDetails = await apiClient.getUserDetails(assignee);
    this.props.fieldPopulator("maker_claim", { type: 'string', value: userDetails.data.id, valueInfo: {} });
    this.props.fieldPopulator("makerclaim_firstName", { type: 'string', value: userDetails.data.firstName, valueInfo: {} });
    this.props.fieldPopulator("makerclaim_lastName", { type: 'string', value: userDetails.data.lastName, valueInfo: {} });

  }


  handleReturn = () => {
    let processVariables = this.props.formValues;
    let data = [];

    if (!validate.isEmpty(processVariables.makerStatus)) {
      if (processVariables.makerStatus.value === "Returned") {
        data.push({
          key: "maker",
          name: "Disbursal Maker",
          value: processVariables.MakersComments.value
        });
      }
    }
    if (!validate.isEmpty(processVariables.checkerStatus)) {
      if (processVariables.checkerStatus.value === "Returned") {
        data.push({
          key: "checker",
          name: "Disbursal Checker",
          value: processVariables.checkersComments.value
        });
      }
    }
    this.setState({ returnData: data })
  }

  mapCardSections = () => {
    try {
      var processVariables = this.props.formValues;
      var totalInformations = {
        "Applicant Basic Information": {
          ApplicationID: "",
          BranchID: "",
          BranchName: "",
          Geolocation: " ",
          applicationDate: "",
          ApplicationType: "",
          OfficerName: "",
          CollateralID: "",
          LeadSource: "",
          BorrowerType: "",
          BorrowerName: "",
          Gender: "",
          Salutation: "",
          dateofbirth: "",
          VoterID: "",
          BorrowerMobile: "",
          AlternateMobile: "",
          Email: "",
          BorrowerAddress: "",
          AadhaarQRCodeScan: "",
          OccupationType: "",
          TypeofJob: "",
          ExperienceCurrentJob: "",
          MonthlyGrossSalary: "",
          MonthlyFixedObligation: "",
          GrossAnnualIncome: "",
          NetAnnualIncome: "",
          LoanAmount: "",
          LoanPurpose: "",
          LoanSubType: "",
          LoanScheme: "",
          ExpectedTenure: "",
          EstimatedEMI: "",
          TotalMonthlySurplus: "",
          repaymentFrequency: "",
          Citizenship: "",
          Religion: "",
          Caste: "",
          MaritalStatus: "",
          EducationLevel: "",
          FatherName: "",
          MotherMaidenName: "",
          ApplicantMBCustomer: "",
          SangamName: "",
          MBBranchName: "",
          SalesOfficerComments: ""
        },
        "Applicant Address & Reference Information": {
          HouseName: "",
          StreetArea: "",
          City: "",
          PostOffice: "",
          District: "",
          State: "",
          Pincode: "",
          permanentAddressType: "",
          permanentAddressNumber: "",
          permanentHouseName: "",
          permanentStreetArea: "",
          permanentCity: "",
          permanentPostOffice: "",
          permanentDistrict: "",
          permanentState: "",
          permanentPincode: "",
          CorrespondenceAddressProofType: "",
          CorrespondenceAddressProofNumber: "",
          CorrespondenceHouseName: "",
          CorrespondenceStreetArea: "",
          CorrespondenceCity: "",
          CorrespondencePostOffice: "",
          CorrespondenceDistrict: "",
          CorrespondenceState: "",
          CorrespondencePincode: "",
          CorrespondenceLandMark: "",
          ReferenceName_1: "",
          ReferenceAddress_1: "",
          ReferenceType_1: "",
          ReferenceName_2: "",
          ReferenceMobile_2: "",
          ReferenceType_2: ""
        },
        "Vehicle Information": {
          SecurityValue: "",
          MonthlyRepaymentCapacity: "",
          RepaymentDay: "",
          "Secondary ID Proof No.": "",
          VehicleType: "",
          Manufacturer: "",
          AssetMake: "",
          AssetModel: "",
          RegisteredTo: "",
          ExShowroomPrice: "",
          RoadTax: "",
          InsuranceAmount: "",
          OnRoadPrice: ""
        }
      };
      var cardView = [];
      const parentKeys = Object.keys(totalInformations);
      for (let parentKey in totalInformations) {
        let collectCardData = { accountName: "", fields: [] };
        collectCardData.accountName = parentKey;
        collectCardData.fields = [];
        collectCardData["parentKeys"] = parentKeys;
        collectCardData["totalInformations"] = totalInformations;
        //append actual data to totalInformation
        for (let childKey in totalInformations[parentKey]) {
          totalInformations[parentKey][childKey] = processVariables[childKey] ? processVariables[childKey].value
            : "";
          if (!validate.isEmpty(totalInformations[parentKey][childKey])) {
            collectCardData.fields.push({
              fieldKey: childKey,
              fieldValue: totalInformations[parentKey][childKey]
            })
          }
        }
        cardView.push(collectCardData);
      }
      this.setState({ cardView: cardView });
    } catch (error) {
      throw error;
    }
  };
  mapCoAppCardSections = () => {
    try {
      var processVariables = this.props.formValues;
      var totalInformations = {
        "Basic Information": {
          ApplicationID: "",
          BranchID: "",
          BranchName: "",
          Geolocation: " ",
          applicationDate: "",
          ApplicationType: "",
          OfficerName: "",
          CollateralID: "",
          LeadSource: "",
          BorrowerType: "",
          relationShipWithApplicant: "",
          FirstName: "",
          Gender: "",
          Salutation: "",
          dateofbirth: "",
          VoterID: "",
          BorrowerMobile: "",
          AlternateMobile: "",
          Email: "",
          BorrowerAddress: "",
          AadhaarQRCodeScan: "",
          OccupationType: "",
          TypeofJob: "",
          ExperienceCurrentJob: "",
          MonthlyGrossSalary: "",
          MonthlyFixedObligation: "",
          GrossAnnualIncome: "",
          NetAnnualIncome: "",
          LoanAmount: "",
          LoanPurpose: "",
          LoanSubType: "",
          LoanScheme: "",
          ExpectedTenure: "",
          EstimatedEMI: "",
          TotalMonthlySurplus: "",
          repaymentFrequency: "",
          Citizenship: "",
          Religion: "",
          Caste: "",
          MaritalStatus: "",
          EducationLevel: "",
          FatherName: "",
          MotherMaidenName: "",
          ApplicantMBCustomer: "",
          SangamName: "",
          MBBranchName: "",
          SalesOfficerComments: ""
        },
        "Address Information": {
          HouseName: "",
          StreetArea: "",
          City: "",
          PostOffice: "",
          District: "",
          State: "",
          Pincode: "",
          permanentAddressType: "",
          permanentAddressNumber: "",
          permanentHouseName: "",
          permanentStreetArea: "",
          permanentCity: "",
          permanentPostOffice: "",
          permanentDistrict: "",
          permanentState: "",
          permanentPincode: "",
          CorrespondenceAddressProofType: "",
          CorrespondenceAddressProofNumber: "",
          CorrespondenceHouseName: "",
          CorrespondenceStreetArea: "",
          CorrespondenceCity: "",
          CorrespondencePostOffice: "",
          CorrespondenceDistrict: "",
          CorrespondenceState: "",
          CorrespondencePincode: "",
          CorrespondenceLandMark: "",

        },

      };
      var cardView = [];
      let { coBorrowerSelect: { value: coBorrowerCount } } = processVariables;
      const parentKeys = Object.keys(totalInformations);
      for (let count = 1; count <= coBorrowerCount; count++) {
        parentKeys.forEach((parentKey: string) => {
          let collectCardData = {
            accountName: '',
            fields: []
          };
          const childKeys = Object.keys(totalInformations[parentKey]);
          childKeys.forEach((childKey: string) => {
            let childValue = totalInformations[parentKey][childKey];
            if (!validate.isEmpty(processVariables[`c${count}${childKey}`])) {
              childValue = processVariables[`c${count}${childKey}`].value;
              collectCardData.accountName = `Co-Applicant${count} ${parentKey}`
              collectCardData.fields.push({
                fieldKey: childKey,
                fieldValue: childValue
              });
            }
          });
          if (collectCardData.fields.length > 0) {
            cardView.push(collectCardData);
          }
        });
      }
      this.setState({ coAppCardView: cardView });
    } catch (error) {
      throw error;
    }
  };
  mapGuaCardSections = () => {
    try {
      var processVariables = this.props.formValues;
      var totalInformations = {
        "Basic Information": {
          ApplicationID: "",
          BranchID: "",
          BranchName: "",
          Geolocation: " ",
          applicationDate: "",
          ApplicationType: "",
          OfficerName: "",
          CollateralID: "",
          LeadSource: "",
          BorrowerType: "",
          relationShipWithApplicant: "",
          FirstName: "",
          Gender: "",
          Salutation: "",
          dateofbirth: "",
          VoterID: "",
          BorrowerMobile: "",
          AlternateMobile: "",
          Email: "",
          BorrowerAddress: "",
          AadhaarQRCodeScan: "",
          OccupationType: "",
          TypeofJob: "",
          ExperienceCurrentJob: "",
          MonthlyGrossSalary: "",
          MonthlyFixedObligation: "",
          GrossAnnualIncome: "",
          NetAnnualIncome: "",
          LoanAmount: "",
          LoanPurpose: "",
          LoanSubType: "",
          LoanScheme: "",
          ExpectedTenure: "",
          EstimatedEMI: "",
          TotalMonthlySurplus: "",
          repaymentFrequency: "",
          Citizenship: "",
          Religion: "",
          Caste: "",
          MaritalStatus: "",
          EducationLevel: "",
          FatherName: "",
          MotherMaidenName: "",
          ApplicantMBCustomer: "",
          SangamName: "",
          MBBranchName: "",
          SalesOfficerComments: ""
        },
        "Address Information": {
          HouseName: "",
          StreetArea: "",
          City: "",
          PostOffice: "",
          District: "",
          State: "",
          Pincode: "",
          permanentAddressType: "",
          permanentAddressNumber: "",
          permanentHouseName: "",
          permanentStreetArea: "",
          permanentCity: "",
          permanentPostOffice: "",
          permanentDistrict: "",
          permanentState: "",
          permanentPincode: "",
          CorrespondenceAddressProofType: "",
          CorrespondenceAddressProofNumber: "",
          CorrespondenceHouseName: "",
          CorrespondenceStreetArea: "",
          CorrespondenceCity: "",
          CorrespondencePostOffice: "",
          CorrespondenceDistrict: "",
          CorrespondenceState: "",
          CorrespondencePincode: "",
          CorrespondenceLandMark: "",

        },

      };
      var cardView = [];
      let { guarantorSelect: { value: guarantorCount } } = processVariables;
      const parentKeys = Object.keys(totalInformations);
      for (let count = 1; count <= guarantorCount; count++) {
        parentKeys.forEach((parentKey: string) => {
          let collectCardData = {
            accountName: '',
            fields: []
          };
          const childKeys = Object.keys(totalInformations[parentKey]);
          childKeys.forEach((childKey: string) => {
            let childValue = totalInformations[parentKey][childKey];
            if (!validate.isEmpty(processVariables[`g${count}${childKey}`])) {
              childValue = processVariables[`g${count}${childKey}`].value;
              collectCardData.accountName = `Guarantor${count} ${parentKey}`
              collectCardData.fields.push({
                fieldKey: childKey,
                fieldValue: childValue
              });
            }
          });
          if (collectCardData.fields.length > 0) {
            cardView.push(collectCardData);
          }
        });
      }
      this.setState({ guaCardView: cardView });
    } catch (error) {
      throw error;
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
          {/*Returned Section */}
          {((this.props.formValues.makerStatus && this.props.formValues.makerStatus.value === "Returned") ||
            (this.props.formValues.checkerStatus && this.props.formValues.checkerStatus.value === "Returned")) &&
            < div className="form-section">
              <div className={"form-section-head clearfix on"}>
                <h3>
                  {"Return Status"}
                </h3>
                <span className="status-label status-label-warning">Returned</span>
              </div>
              <div className="form-section-content" style={{ display: "block" }}>
                <Table dataSource={this.state.returnData} size="middle">
                  <ColumnGroup>
                    <Column
                      title="Returned By"
                      dataIndex="name"
                      key="returnedBy"
                    />
                    <Column
                      title="Reason "
                      dataIndex="value"
                      key="reason"
                    />
                  </ColumnGroup>

                </Table>
              </div>
            </div>
          }
          <div className="form-section">
            <div
              className={classname("form-section-head clearfix", { on: false })}
            >
              <h3>{"Applicant Basic Information"}</h3>
            </div>
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapCardSections}
                  >
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.cardView) && (
                    <AccountDetailsView accountDetails={this.state.cardView} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.props.formValues &&
            this.props.formValues.coBorrowerSelect &&
            this.props.formValues.coBorrowerSelect.value !== "null" &&
            this.props.formValues.coBorrowerSelect.value !== "0" &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", { on: false })}
              >
                <h3>{"Co-Applicant Basic Information"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group  add-del-button">
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.mapCoAppCardSections}
                    >
                      View Details
                  </Button>
                  </div>
                  <div className="form-group col-xs-12 col-md-12">
                    {!validate.isEmpty(this.state.coAppCardView) && (
                      <AccountDetailsView
                        accountDetails={this.state.coAppCardView}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>}
          {this.props.formValues &&
            this.props.formValues.guarantorSelect &&
            this.props.formValues.guarantorSelect.value !== "null" &&
            this.props.formValues.guarantorSelect.value !== "0" &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", { on: false })}
              >
                <h3>{"Guarantor Basic Information"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group  add-del-button">
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.mapGuaCardSections}
                    >
                      View Details
                  </Button>
                  </div>
                  <div className="form-group col-xs-12 col-md-12">
                    {!validate.isEmpty(this.state.guaCardView) && (
                      <AccountDetailsView
                        accountDetails={this.state.guaCardView}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>}

        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  return {
    //get current form values
    formValues: getFormValues("makersForm")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("makersForm")(state),
    //taskInfo
    task: state.task
  };
};
export default connect(
  mapStateToProps,
  {}
)(TabApplicantBasicInformation);
