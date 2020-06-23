import * as React from "react";
import { FormHeadSection, A8V, Config } from "../../helpers";
import { getFormSyncErrors, getFormValues, Field } from "redux-form";
import { Button, Result, Modal, Table } from "antd";
import { connect } from "react-redux";
import { TextArea, AccountDetailsView, Select, SelectHelper, TextBox } from "a8flow-uikit";
import validate from "validate.js";
import classname from "classnames";
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
};
type State = {
  sectionValidator: any;
  cardView: any;
  AccountNumber: any;
  ReplyText: any;
  visible: any;
  column: any[];
  dataSource: any[];
  API_Error: any;
  showReturnTo: any;
  MappingStatus: any;
  BorrowerMappingAPI_Error: any;
  isDisabled: any;
  showField: any;
};

class TabApproval extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      CheckersComments: ["checkersComments", "checkerStatus", "CheckerReturnTO"]
      // DisbursementInfo: ["UTRNumber", "sanctionAmount"]
    },
    cardView: [],
    AccountNumber: "",
    ReplyText: "",
    visible: false,
    dataSource: [],
    column: [
      {
        title: "variable Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value"
      }
    ],
    API_Error: "",
    showReturnTo: false,
    MappingStatus: "",
    BorrowerMappingAPI_Error: "",
    isDisabled: false,
    showField: false
  };

  componentDidMount = async () => {
    if (
      this.props.formValues.checkersComments &&
      this.props.formValues.checkersComments.value !== "" &&
      this.props.formValues.checkerStatus &&
      this.props.formValues.checkerStatus.value === "Returned"
    ) {
      this.props.fieldPopulator("checkersComments", {
        type: "String",
        value: "",
        valueInfo: {}
      });
      this.props.fieldPopulator("checkerStatus", {
        type: "String",
        value: "",
        valueInfo: {}
      });
    }

    let {
        taskInfo: {
          info: { processInstanceId }
        }
      } = this.props,
      authToken =
        this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
          ? this.props.taskInfo.info.authToken
          : null,
      apiClient = new ApiClient(Config.hostUrl, authToken),
      variableDetails = await apiClient
        .getVariables(processInstanceId)
        .then(variableDetails => {
          if (
            variableDetails.data.checkersComments &&
            variableDetails.data.checkersComments.value !== "" &&
            variableDetails.data.checkerStatus === "Approved"
          ) {
            this.props.fieldPopulator("checkersComments", {
              type: "String",
              value: variableDetails.data.checkersComments.value
            });
          }
          if (
            variableDetails.data.checkerStatus &&
            variableDetails.data.checkerStatus.value === "Approved" &&
            variableDetails.data.LoanCreationNo &&
            variableDetails.data.LoanCreationNo.value !== ""
          ) {
            this.setState({ isDisabled: true, showField: true });
          }
        })
        .catch(err => {
          console.log("getVariables Error", err);
        });
    console.log("varialbleDetails", variableDetails);
  };

  handleApproveClick = async () => {
    this.setState({ isDisabled: true });
    let customerID = this.props.formValues.CustomerID ? this.props.formValues.CustomerID.value : "";
    let requestedLoanAmount = this.props.formValues.LoanAmount ? this.props.formValues.LoanAmount.value : "";
    let sanctionedLoanAmount = this.props.formValues.sanctionLoanAmount ? this.props.formValues.sanctionLoanAmount.value : "";
    let ExpectedTenure = this.props.formValues.FinalApprovalLoanTenure
      ? this.props.formValues.FinalApprovalLoanTenure.value
      : this.props.formValues.L2RecommendedLoanTenure
      ? this.props.formValues.L2RecommendedLoanTenure.value
      : this.props.formValues.L1RecommendedLoanTenure
      ? this.props.formValues.L1RecommendedLoanTenure.value
      : this.props.formValues.BO_RecommendedLoanTenure
      ? this.props.formValues.BO_RecommendedLoanTenure.value
      : this.props.formValues.tenureInput.value;
    let salutation = this.props.formValues.Salutation ? this.props.formValues.Salutation.value : "";
    let AccountNo = this.props.formValues.AccountNo ? this.props.formValues.AccountNo.value : "";
    let firstName = this.props.formValues.FirstName ? this.props.formValues.FirstName.value : "";
    let BranchID = this.props.formValues.BranchID ? this.props.formValues.BranchID.value : "";
    let districtCode = this.props.formValues.branchDistrictCode ? this.props.formValues.branchDistrictCode.value : "";
    let stateCode = this.props.formValues.branchStateCode ? this.props.formValues.branchStateCode.value : "";
    // for Production deployment uncomment these line
    let D_date = moment(Date())
      .format("DD-MM-YYYY")
      .slice(0, 15);

    // For testing uncomment this and comment below lines
    // let D_date = this.props.formValues.finalDisbursementDate ? this.props.formValues.finalDisbursementDate.value : "";
    let day = D_date.split("-"),
      d: any = day[0],
      m: any = day[1],
      y: any = day[2],
      DIST;
    if (d <= 15) {
      let dt = 5;
      DIST = moment(new Date(y, m, dt)).format("DD-MM-YYYY");
      console.log("DIST", DIST);
    }
    if (d > 15) {
      let dt = 5;
      DIST = moment(new Date(y, m, dt))
        .add(1, "M")
        .format("DD-MM-YYYY");
      console.log("DIST", DIST);
    }

    let PopulationGroup;
    if (this.props.formValues.PopulationGroup && this.props.formValues.PopulationGroup.value !== "") {
      if (this.props.formValues.PopulationGroup.value === "Rural") {
        PopulationGroup = "1";
      } else if (this.props.formValues.PopulationGroup.value === "Semi urban") {
        PopulationGroup = "2";
      } else if (this.props.formValues.PopulationGroup.value === "Urban") {
        PopulationGroup = "3";
      } else if (this.props.formValues.PopulationGroup.value === "Metropolitian") {
        PopulationGroup = "4";
      }
    }

    let {
      taskInfo: {
        info: { processInstanceId }
      }
    } = this.props;
    let authToken =
        this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
          ? this.props.taskInfo.info.authToken
          : null,
      apiClient = new ApiClient(Config.hostUrl, authToken);

    let loanCreationConfig = {
      url: `${Config.apiUrl}/v1/loanCreation`,
      headers: {
        Authorization: authToken
      },
      method: "post",
      data: {
        input: `LN.ACN=${customerID},RELCIF1.ACN=${customerID},RELCIF1.ROLE='1',RELCIF1.ACTOWNPCT='0',
        LN.GRP='LN',LN.DIST1ND=${DIST},LN.ACNRELC='A',LN.APPID='',LN.TITLE1=${salutation}. ${firstName},LN.ZBALPAY='N',LN.ZLIMITID='',LN.PTRM=${ExpectedTenure}M,LN.SFRE='1MAE',LN.ZSBU='03',LN.SECTOR='126',LN.SUBSECTOR='853',LN.RATING='0',LN.ZCLCD=' ',LN.ZPRIORITY='0',LN.ZUNSEC='1',LN.LNSACDETL='0',LN.ZUNSECCOL='1',LN.NATUREBORR='1',LN.ZBORWAHEAD='',LN.SPLCATEGORY='Null',LN.STCODE=${stateCode},LN.DISTRICT=${districtCode},LN.ORGCODE='82',LN.OCCUCODE='95012',LN.ZPOPULATION=${PopulationGroup},LN.SANCTIONDT=${D_date},LN.SANCTIONAMT=${sanctionedLoanAmount},LN.DATEDPN=${D_date},LN.GOVTSCHEME='0',LN.IROPT='5',LN.DXSI='1',LN.ZDCARD='0',LN.ZCCAP='0',LN.AMTREQ=${sanctionedLoanAmount},LN.DIST1FRE='1MA5',LN.CCL='',LN.REVF=0,LN.ODD=${D_date},LN.DSCHPR='0',LN.ODT=${D_date},LN.PMTDIST='I-P',LN.PMTDISTF=' ',LN.DOUBLECOL='N',LN.ORG=${requestedLoanAmount},LN.ACCTNAME='TWLM',LN.ZDISAMTFLG='0',LN.ZDISBACCT=${AccountNo},LN.TRM=${ExpectedTenure}M,LN.AOMCODE='2',LN.PCM='15N',LN.BOO=${BranchID},LN.TYPE='7201',LN.CRCD='INR',LN.ARS='0',LN.ZNPAAUTH='1',LN.ZLNSANCAUTHN='',LN.ZLNSANCAUTHE=''`,
        branch_code: BranchID
      }
    };

    axios(loanCreationConfig)
      .then(async response => {
        if (response.data.Response) {
          let loanCreateResponse = response.data.Response.AccountNumber._text;
          let status = response.data.Response.TransactionStatus.ReplyText._text;
          this.props.fieldPopulator("LoanCreationNo", {
            type: "string",
            value: loanCreateResponse,
            valueInfo: {}
          });
          this.setState(
            {
              AccountNumber: loanCreateResponse,
              ReplyText: status,
              showField: true
            },
            () => {}
          );
          let variableDetails = await apiClient.saveVariables(processInstanceId, {
            LoanCreationNo: {
              type: "string",
              value: loanCreateResponse,
              valueInfo: {}
            }
          });
          console.log("variableDetails", variableDetails);
          if (this.props.formValues.coBorrowerSelect && this.props.formValues.coBorrowerSelect.value !== "0") {
            this.handleBorrowerMapping();
          } else {
            this.setState({ MappingStatus: "Success", isDisabled: true });
            this.props.fieldPopulator("checkerStatus", {
              type: "String",
              value: "Approved"
            });
            let variableDetails = await apiClient.saveVariables(processInstanceId, {
              checkerStatus: {
                type: "String",
                value: "Approved",
                valueInfo: {}
              }
            });
            console.log("variableDetails", variableDetails);
          }
        } else {
          this.setState({
            API_Error: response.data.Exception.ErrorMessage._text,
            isDisabled: false
          });
          this.props.fieldPopulator("checkerStatus", {
            type: "String",
            value: "",
            valueInfo: {}
          });
        }
      })
      .catch(error => {
        console.log("Loan Creation", error);
        this.setState({ isDisabled: false });
        this.props.fieldPopulator("checkerStatus", {
          type: "String",
          value: "",
          valueInfo: {}
        });
      });
    if (this.state.ReplyText === "Success") {
    }
  };

  handleBorrowerMapping = () => {
    let CIF_Number = this.props.formValues.CustomerID ? this.props.formValues.CustomerID.value : "";
    let c1CIF_Number = this.props.formValues.c1CustomerID ? this.props.formValues.c1CustomerID.value : "";
    let c2CIF_Number = this.props.formValues.c2CustomerID ? this.props.formValues.c2CustomerID.value : "";
    let Salutation = this.props.formValues.Salutation ? this.props.formValues.Salutation.value : "";
    let c1Salutation = this.props.formValues.c1Salutation ? this.props.formValues.c1Salutation.value : "";
    let c2Salutation = this.props.formValues.c2Salutation ? this.props.formValues.c2Salutation.value : "";
    let FirstName = this.props.formValues.CIFcustomerFirstName ? this.props.formValues.CIFcustomerFirstName.value : "";
    let LastName = this.props.formValues.CIFcustomerLastName ? this.props.formValues.CIFcustomerLastName.value : "";
    let c1FirstName = this.props.formValues.c1CIFcustomerFirstName ? this.props.formValues.c1CIFcustomerFirstName.value : "";
    let c1LastName = this.props.formValues.c1CIFcustomerLastName ? this.props.formValues.c1CIFcustomerLastName.value : "";
    let c2FirstName = this.props.formValues.c2CIFcustomerFirstName ? this.props.formValues.c2CIFcustomerFirstName.value : "";
    let c2LastName = this.props.formValues.c2CIFcustomerLastName ? this.props.formValues.c2CIFcustomerLastName.value : "";
    let LoanCreationNo = this.props.formValues.LoanCreationNo ? this.props.formValues.LoanCreationNo.value : "";

    let {
      taskInfo: {
        info: { processInstanceId }
      }
    } = this.props;
    let authToken =
        this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
          ? this.props.taskInfo.info.authToken
          : null,
      apiClient = new ApiClient(Config.hostUrl, authToken);

    let borrowerCongfig = {
      url: `${Config.apiUrl}/v1/addOrDeleteAccount`,
      method: "post",
      headers: {
        Authorization: authToken
      },
      data: {
        account_details: `RELCIF1.CID=${LoanCreationNo},RELCIF1.ACN=${CIF_Number},RELCIF1.ACTOWNPCT=1,RELCIF1.ROLE=1,OPTION1=OVERLAY,RELCIF2.CID=${LoanCreationNo},RELCIF2.ACN=${c1CIF_Number},RELCIF2.ROLE=2,OPTION2=OVERLAY,RELCIF3.CID=${LoanCreationNo},RELCIF3.ACN=${c2CIF_Number},RELCIF3.ROLE=2,OPTION3=OVERLAY,ACN.CID=${LoanCreationNo},ACN.TITLE1=${Salutation}. ${FirstName} ${LastName},ACN.TITLE2=${c1Salutation}. ${c1FirstName} ${c1LastName},ACN.TITLE3=${c2Salutation}. ${c2FirstName} ${c2LastName},ACN.TITLE4=,ACN.RFLG=0,ACN.ACNRELC=B,UserId=2`
      }
    };
    axios(borrowerCongfig)
      .then(async response => {
        if (response.data.Response) {
          let borrowerMappingStatus = response.data.Response.TransactionStatus.ReplyText._text;
          this.setState({
            MappingStatus: borrowerMappingStatus,
            isDisabled: true
          });
          this.props.fieldPopulator("checkerStatus", {
            type: "String",
            value: "Approved"
          });
          let variableDetails = await apiClient.saveVariables(processInstanceId, {
            checkerStatus: {
              type: "String",
              value: "Approved",
              valueInfo: {}
            }
          });
          console.log("variableDetails", variableDetails);
        } else {
          this.setState({
            BorrowerMappingAPI_Error: response.data.Exception.ErrorMessage._text
          });
          this.setState({ isDisabled: false });
        }
      })
      .catch(error => {
        console.log("Borrower Mapping", error);
        this.setState({ isDisabled: false });
      });
  };

  mapComment = () => {
    try {
      let processVariables = this.props.formValues;
      let creditOfficerComment = {
        " Credit Officer Comments ": {
          BackOfficerComments: "",
          BOApprovalDate: "",
          L1OfficerComments: "",
          L2OfficerComments: "",
          makersComments: "",
          finalApprovalComments: "",
          FinalApprovalDate: ""
        }
      };
      let cardView = [];
      for (let parentKey in creditOfficerComment) {
        let collectedCardData = { accountName: "", fields: [] };
        collectedCardData.accountName = parentKey;
        collectedCardData.fields = [];
        //append actual data to creditOfficerComment
        for (let childKey in creditOfficerComment[parentKey]) {
          if (!validate.isEmpty(processVariables[childKey])) {
            creditOfficerComment[parentKey][childKey] = processVariables[childKey] ? processVariables[childKey].value : "";
            collectedCardData.fields.push({
              fieldKey: childKey,
              fieldValue: creditOfficerComment[parentKey][childKey]
            });
          }
        }
        cardView.push(collectedCardData);
      }
      this.setState({ cardView: cardView });
    } catch (error) {
      throw error;
    }
  };

  mapTableValues = () => {
    try {
      let processData = this.props.formValues;
      let tableData = {
        WorkItemNo: "",
        CustomerID: "",
        CIFcustomerName: "",
        CIFaadhaarNo: "",
        CIFDateOfBirth: "",
        LoanPurpose: "",
        ROI: "",
        LoanAmount: "",
        ExpectedTenure: "",
        EstimatedEMI: "",
        sanctionedLoanAmount: "",
        DealerName: "",
        AccountNo: "",
        Sector: "",
        Subsector: "",
        OccupationCode: "",
        BSRcode: "",
        DisbursementDate: ""
      };
      let dataSource = [];

      for (let i in tableData) {
        tableData[i] = processData[i] ? processData[i].value : "";
        tableData.Sector = " Other Community, Social and Personal Service Activities ";
        tableData.Subsector = " Personal loans to individuals other than staff members";
        tableData.OccupationCode = "Loans for purchase of Motor Vehicle & Two-wheelers by individuals";
        tableData.BSRcode = "95012";
        tableData.ExpectedTenure = this.props.formValues.FinalApprovalLoanTenure
          ? this.props.formValues.FinalApprovalLoanTenure.value
          : this.props.formValues.L2RecommendedLoanTenure
          ? this.props.formValues.L2RecommendedLoanTenure.value
          : this.props.formValues.L1RecommendedLoanTenure
          ? this.props.formValues.L1RecommendedLoanTenure.value
          : this.props.formValues.BO_RecommendedLoanTenure
          ? this.props.formValues.BO_RecommendedLoanTenure.value
          : this.props.formValues.tenureInput.value;
        tableData.DisbursementDate = this.props.formValues.DisbursementDate
          ? moment(this.props.formValues.DisbursementDate.value)
              .format("DD-MM-YYYY")
              .slice(0, 10)
          : "";
        dataSource.push({
          key: i,
          name: i,
          value: tableData[i]
        });
      }
      this.setState({ dataSource: dataSource });
    } catch (error) {
      throw error;
    }
  };

  handleReturnClick = () => {
    this.setState({ showReturnTo: true });
    this.props.fieldPopulator("checkerStatus", {
      type: "String",
      value: "Returned"
    });
  };

  handleCheckerComments = async e => {
    let value = e.value;
    let {
        taskInfo: {
          info: { processInstanceId }
        }
      } = this.props,
      authToken =
        this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken
          ? this.props.taskInfo.info.authToken
          : null,
      apiClient = new ApiClient(Config.hostUrl, authToken);
    let checkercomment = await apiClient.saveVariables(processInstanceId, {
      checkersComments: { type: "String", value: value, valueInfo: {} }
    });
    console.log("checkercomment", checkercomment);
  };

  render() {
    const { column, dataSource } = this.state;
    return (
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="card-item-details-1-lead">
          {this.props.formValues.l1CreditSanctionComments && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Credit Officer & Final Approval Comments"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group  add-del-button">
                    <Button className="api-button" type="danger" size="default" onClick={this.mapComment}>
                      View Details
                    </Button>
                  </div>
                  <div className="form-group col-xs-12 col-md-12">
                    {!validate.isEmpty(this.state.cardView) && <AccountDetailsView accountDetails={this.state.cardView} />}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-section">
            <div
              className={classname("form-section-head clearfix", {
                on: false
              })}
            >
              <h3>{"Disbursement Check Table"}</h3>
            </div>
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button className="api-button" type="danger" size="default" onClick={this.mapTableValues}>
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.dataSource) && <Table dataSource={dataSource} columns={column} />}
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Checkers Comment "
              sectionKey="CheckersComments"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                {/* <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={" Disbursement Date (for UAT purpose) "}
                    name="finalDisbursementDate"
                    component={TextBox}
                    placeholder="Enter Disbursal Date (DD-MM-YYYY)"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div> */}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={" Decision "}
                    name="checkersComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    onChange={this.handleCheckerComments}
                    className="form-control-custom"
                  />

                  <div className="form-group col-xs-6 col-md-4" style={{ display: "flex" }}>
                    <Button
                      style={{ marginRight: "12px" }}
                      className="api-button"
                      type="danger"
                      size="default"
                      disabled={this.state.isDisabled}
                      onClick={this.handleApproveClick}
                    >
                      Approve
                    </Button>
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      disabled={this.state.isDisabled}
                      onClick={this.handleReturnClick}
                    >
                      Return
                    </Button>
                  </div>
                </div>
                {this.state.showField && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Loan Creation No"}
                      name="LoanCreationNo"
                      component={TextBox}
                      placeholder="Enter LoanCreationNo"
                      type="text"
                      hasFeedback
                      disabled={true}
                      className="form-control-custom"
                      validate={[
                        A8V.required({
                          errorMsg: "LoanCreationNo is required"
                        })
                      ]}
                    />
                  </div>
                )}
                <Field
                  hidden={true}
                  name="checkerStatus"
                  component={TextArea}
                  type="text"
                  hasFeedback
                  className="form-control-custom"
                  validate={[A8V.required({ errorMsg: "checkerStatus is required" })]}
                />
                {this.state.showReturnTo && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Return To"
                      name="CheckerReturnTO"
                      component={Select}
                      placeholder="Select Return To"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "CheckerReturnTO is required"
                        })
                      ]}
                    >
                      <Option value="Maker">Maker</Option>
                      <Option value="Doc_Execution">Doc_Execution</Option>
                      <Option value="CIF_Fetch">CIF_Fetch</Option>
                    </Field>
                  </div>
                )}
                {this.state.API_Error !== "" && (
                  <div className="form-group col-xs-6 col-md-6" style={{ color: "red" }}>
                    {this.state.API_Error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal
          visible={this.state.MappingStatus === "Success"}
          footer={null}
          onCancel={() => {
            this.setState({ MappingStatus: "" });
          }}
        >
          <Result
            status="success"
            title="Borrower's Mapped Successfully and Generated Loan Number "
            subTitle={`Account Number is ${this.state.AccountNumber}`}
          />
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  console.log("*********** state values of checkers form ***********", state);
  return {
    //get current form values
    formValues: getFormValues("checkersForm")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("checkersForm")(state),
    //taskInfo
    task: state.task
  };
};
export default connect(
  mapStateToProps,
  {}
)(TabApproval);
