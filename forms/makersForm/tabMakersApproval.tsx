import * as React from "react";
import {
  FormHeadSection,
  A8V,
} from "../../helpers";
import {
  getFormSyncErrors,
  getFormValues,
  Field
} from "redux-form";
import {
  Button,
  Table
} from "antd";
import { connect } from "react-redux";
import {
  TextArea,
  AccountDetailsView,
  Select,
  SelectHelper
} from "a8flow-uikit";
import validate from "validate.js";
import classname from "classnames";
import moment from "moment";


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
  column: any[];
  dataSource: any[];
  showReturnTo: any;

};

class TabApproval extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      makersComments: ["MakersComments", "makerStatus", "MakerReturnTO"],
    },
    cardView: [],
    dataSource: [],
    column: [
      {
        title: 'variable Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
    ],
    showReturnTo: false,

  };

  componentDidMount = () => {
    if (this.props.formValues.MakersComments &&
      this.props.formValues.MakersComments.value !== "") {
      this.props.fieldPopulator("MakersComments", { type: "String", value: "" });
      this.props.fieldPopulator("makerStatus", { type: "String", value: "" });
    }
  }
  handleApproveClick = () => {
    this.setState({ showReturnTo: false })
    this.props.fieldPopulator("makerStatus", {
      type: "String",
      value: "Approved"
    });
  }
  handleReturnClick = () => {
    this.setState({ showReturnTo: true })
    this.props.fieldPopulator("makerStatus", {
      type: "String",
      value: "Returned"
    })
  }

  mapComment = () => {
    try {
      let processVariables = this.props.formValues;
      let creditOfficerComment = {
        " Credit Officer Comments ": {
          BackOfficerComments: "",
          BOApprovalDate: "",
          L1OfficerComments: "",
          L1ApprovalDate: "",
          L2OfficerComments: "",
          L2ApprovalDate: "",
          FinalApproverComments: "",
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
            creditOfficerComment[parentKey][childKey] = processVariables[childKey]
              ? processVariables[childKey].value
              : "";
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
        CIFAadhaarNo: "",
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
        MakersDeliveryDate: "",
      }
      let dataSource = [];

      for (let i in tableData) {
        tableData[i] = processData[i] ? processData[i].value : "";
        tableData.Sector = " Other Community, Social and Personal Service Activities ";
        tableData.Subsector = " Personal loans to individuals other than staff members";
        tableData.OccupationCode = "Loans for purchase of Motor Vehicle & Two-wheelers by individuals";
        tableData.BSRcode = "95012";
        tableData.MakersDeliveryDate = moment(this.props.formValues.MakersDeliveryDate &&
          this.props.formValues.MakersDeliveryDate.value).format('DD-MM-YYYY').slice(0, 10);
        tableData.ExpectedTenure = this.props.formValues.FinalApprovalLoanTenure ? this.props.formValues.FinalApprovalLoanTenure.value : this.props.formValues.L2RecommendedLoanTenure ? this.props.formValues.L2RecommendedLoanTenure.value : this.props.formValues.L1RecommendedLoanTenure ? this.props.formValues.L1RecommendedLoanTenure.value : this.props.formValues.BO_RecommendedLoanTenure ? this.props.formValues.BO_RecommendedLoanTenure.value : this.props.formValues.tenureInput.value;
        if (!validate.isEmpty(tableData[i])) {
          dataSource.push({
            key: i,
            name: i,
            value: tableData[i],
          });
        }
      }
      this.setState({ dataSource: dataSource });
    } catch (error) {
      throw error;
    }
  }


  render() {

    const { column, dataSource } = this.state

    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >


          {this.props.formValues.L1OfficerComments && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Credit Officer & Final Approval Decision"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group  add-del-button">
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.mapComment}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="form-group col-xs-12 col-md-12">
                    {!validate.isEmpty(this.state.cardView) && (
                      <AccountDetailsView
                        accountDetails={this.state.cardView}
                      />
                    )}
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
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapTableValues}
                  >
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
              sectionLabel="Makers Decision "
              sectionKey="makersComments"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={" Decision "}
                    name="MakersComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                  <Field
                    hidden={true}
                    name="makerStatus"
                    component={TextArea}
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "makerStatus is required" })
                    ]}
                  />
                  <div style={{ display: "flex" }}>
                    <Button
                      style={{ marginRight: "12px" }}
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.handleApproveClick}
                    >
                      Approve
                    </Button>
                    <Button
                      style={{ marginRight: "12px" }}
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.handleReturnClick}
                    >
                      Return
                    </Button>
                  </div>
                </div>
                {this.state.showReturnTo &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Return To"
                      name="MakerReturnTO"
                      component={Select}
                      placeholder="Select Return To"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "MakerReturnTO is required" })
                      ]}
                    >
                      <Option value="Doc_Execution">Doc_Execution</Option>
                      <Option value="CIF_Fetch">CIF_Fetch</Option>
                    </Field>
                  </div>}
              </div>
            </div>
          </div>
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
export default connect(mapStateToProps, {})(TabApproval);
