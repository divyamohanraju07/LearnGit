import * as React from "react";
import {
  FormHeadSection,
  A8V,
  renderPurchaseBill,
  renderSalesBill,
  proceedNumber,
  Config
} from "../../helpers";
import {
  TextBox,
  Select,
  SelectHelper,
  DatePicker,
  RadioWrapper,
  Radio,
  Scanner
} from "a8flow-uikit";
import {
  Field,
  getFormSyncErrors,
  getFormValues,
  FieldArray
} from "redux-form";
import { connect } from "react-redux";
import classname from 'classnames';
const { Option } = SelectHelper;
class TabIncomeAndExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        OccupationTypeDetails: ["OccupationType"],
        IncomeDetails: ["MonthlyIncome", "IncomeVerification", "VerificationSource", "OthersSpecify", "OtherIncome", "TotalApplicantIncome", "BusinessEvaluationApproach", "OtherIncome", "MonthStart", "TotalDeposit", "MonthEndBalance", "InwardBounces", "OutwardBounces", "TotalBounces", "GSTFilingApproach", "SalesMonth1", "SalesMonth2", "SalesMonth3", "SalesMonth4", "SalesMonth5", "SalesMonth6", "SalesQuarter1", "SalesQuarter2", "MonthlySalesfromGST", "ITRSalesYear1", "ITRSalesYear2", "MonthlyITRSales", "MultiplierNeededITR", "MultiplierValueITR", "YearlySales", "MultiplierNeededBankHistory", "MultiplierNeededGST"],
        ExpenseDetails: ["BorrowerExistingHousehold", "HouseholdHeadName", "Rent", "Food", "Water/Electricity", "Education", "Clothing", "HealthCare", "Transportation", "Telephone", "Other", "FixedObligations", "HouseholdDebtPayment", "TotalExpenses"],
        ObligationDetails: ["BankName", "LoanType", "OutstandingBalance", "EMI"],
        PurchaseBill: ["PurchaseBillMonth", "PurchaseBillType", "PurchaseBillValue", "PurchaseBillDate", "PurchaseMargin", "SalesByMonth", "AverageMonthlySales"],
        SalesBill: ["SaleBillMonth", "SaleBillType", "SaleBillValue", "SaleBillDate", "SalesByMonthSaleBill", "AverageMonthlySalesSaleBill"]
      },
      isSalariedEnabled: false,
      isBusinessEnabled: false,
      isVerificationSourceEnabled: false,
      isHouseHoldExpenseSectionEnabled: false,
      isDocumentationEnabled: false,
      isNoIncomeEnabled: false,
      isTradeEnabled: false,
      isITRenabled: false,
      isGSTenabled: false,
      isBankHistoryEnabled: false,
      isHouseHoldExpense: false,
      isMonthlyGSTenabled: false,
      isQuarterlyGSTenabled: false,
      isYearlyGSTenabled: false,
      isMultiplierDetailsEnabled: false,
      inwardBounces: 0,
      totalApplicantIncome: 0,
      monthlyIncome: 0,
      otherIncome: 0,
      gstFilingApproach: "",
      isPaySlipScannerEnabled: false,
      isRentalAggrementScannerEnabled: false,
      isTeleVerificationScannerEnabled: false,
      isVerifiedByOthersEnabled: false,
    };
  }
  async componentDidMount() {
    if (this.props.formValues &&
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value !== "") {
      this.handleOccupationTypeChange(this.props.formValues.OccupationType.value);
    }
  }
  handleVerifiedByChange = (e) => {
    if (e.value === "PaySlip") {
      this.setState({
        isPaySlipScannerEnabled: true,
        isRentalAggrementScannerEnabled: false,
        isTeleVerificationScannerEnabled: false,
        isVerifiedByOthersEnabled: false,
      });
    } else if (e.value === "RentalAggrement") {
      this.setState({
        isPaySlipScannerEnabled: false,
        isRentalAggrementScannerEnabled: true,
        isTeleVerificationScannerEnabled: false,
        isVerifiedByOthersEnabled: false
      });
    } else if (e.value === "TeleVerification") {
      this.setState({
        isPaySlipScannerEnabled: false,
        isRentalAggrementScannerEnabled: false,
        isTeleVerificationScannerEnabled: true,
        isVerifiedByOthersEnabled: false
      });
    } else if (e.value === "Others") {
      this.setState({
        isPaySlipScannerEnabled: false,
        isRentalAggrementScannerEnabled: false,
        isTeleVerificationScannerEnabled: false,
        isVerifiedByOthersEnabled: true
      });
    }
  }
  handleInwardBounce = (e) => {
    this.setState({
      inwardBounces: e.value
    });
  }
  handleOutwardBounce = (e) => {
    let totalBounces = Number(this.state.inwardBounces) + Number(e.value);
    this.props.fieldPopulator("TotalBounces", totalBounces);
  }
  handleMonthlyIncome = (e) => {
    this.setState({
      monthlyIncome: e.value
    })
  }
  handleOtherIncome = (e) => {
    this.setState({
      otherIncome: e.value
    })
    let monthlyIncome = this.state.monthlyIncome;
    let totalApplicantIncome = Number(monthlyIncome) + Number(e.value);
    this.props.fieldPopulator("TotalApplicantIncome", totalApplicantIncome);
  }
  handleOccupationTypeChange = (e) => {
    if (e === "Salaried" || e === "Others") {
      this.setState({
        isSalariedEnabled: true,
        isBusinessEnabled: false,
        isHouseHoldExpense: true
      });
    } else if (e === "Business") {
      this.setState({
        isSalariedEnabled: false,
        isBusinessEnabled: true,
        isHouseHoldExpense: false
      });
    }
  }
  handleSalesBill = () => {
    console.log("into handlesalesbill function");
  }
  handlePurchaseBill = () => {
    console.log("into handle purchasebill function")
  }
  BorrowerExistingChange = (e) => {
    let value = e.value;
    if (value === "Yes") {
      this.setState({
        isHouseHoldExpenseSectionEnabled: true
      });
    } else {
      this.setState({
        isHouseHoldExpenseSectionEnabled: false
      });
    }
  }
  handleMonthlyITRSales = (e) => {
    let totalMonthlySales = Number(e.value) / 12;
    this.props.fieldPopulator("MonthlyITRSales", totalMonthlySales.toFixed(0));
  }
  handleMultiplierChange = (e) => {
    if (e.value === "Yes") {
      this.setState({
        isMultiplierDetailsEnabled: true
      });
    } else if (e.value === "No") {
      this.setState({
        isMultiplierDetailsEnabled: false
      });
    }
    if (e.name === "MultiplierNeededBankHistory") {
      this.props.fieldPopulator("MultiplierValueBankHistory", "");
    } else if (e.name === "MultiplierNeededGST") {
      this.props.fieldPopulator("MultiplierValueGST", "");
    } else if (e.name === "MultiplierNeededITR") {
      this.props.fieldPopulator("MultiplierValueITR", "");
    }
  }
  handleVerifiedChange = (e) => {
    if (e.value === "Yes") {
      this.setState({
        isVerificationSourceEnabled: true
      })
    } else {
      this.setState({
        isVerificationSourceEnabled: false
      });
    }
  }
  handleGSTFilingApproach = (approach) => {

    if (approach.value === "Monthly") {
      this.setState({
        isMonthlyGSTenabled: true,
        isQuarterlyGSTenabled: false,
        isYearlyGSTenabled: false,
        gstFilingApproach: "Monthly"
      });
    }
    if (approach.value === "Quarterly") {
      this.setState({
        isMonthlyGSTenabled: false,
        isQuarterlyGSTenabled: true,
        isYearlyGSTenabled: false,
        gstFilingApproach: "Quarterly"
      });
    }
    if (approach.value === "Yearly") {
      this.setState({
        isMonthlyGSTenabled: false,
        isQuarterlyGSTenabled: false,
        isYearlyGSTenabled: true,
        gstFilingApproach: "Yearly"
      });
    }
  }
  handleMonthlySalesfromGST = (e) => {
    let totalMonthlySales = 0;
    if (this.state.gstFilingApproach === "Monthly") {
      totalMonthlySales = Number(this.props.formValues.SalesMonth1.value) + Number(this.props.formValues.SalesMonth2.value) + Number(this.props.formValues.SalesMonth3.value) + Number(this.props.formValues.SalesMonth4.value) + Number(this.props.formValues.SalesMonth5.value) + Number(e.value);
    } else if (this.state.gstFilingApproach === "Quarterly") {
      totalMonthlySales = Number(this.props.formValues.SalesQuarter1.value) + Number(e.value);
    }
    this.props.fieldPopulator("MonthlySalesfromGST", totalMonthlySales);
  }
  handleBusinessEvaluationApproach = (e) => {
    if (e.value === "No Documentation for manufacturing") {
      this.setState({
        isDocumentationEnabled: true,
        isNoIncomeEnabled: false,
        isTradeEnabled: false,
        isITRenabled: false,
        isGSTenabled: false,
        isBankHistoryEnabled: false
      });
    }
    else if (e.value === "No Income Proof for trading/ services") {
      this.setState({
        isDocumentationEnabled: false,
        isNoIncomeEnabled: true,
        isTradeEnabled: false,
        isITRenabled: false,
        isGSTenabled: false,
        isBankHistoryEnabled: false
      });
    }
    else if (e.value === "Trade") {
      this.setState({
        isDocumentationEnabled: false,
        isNoIncomeEnabled: false,
        isTradeEnabled: true,
        isITRenabled: false,
        isGSTenabled: false,
        isBankHistoryEnabled: false
      });
    } else if (e.value === "ITR") {
      this.setState({
        isDocumentationEnabled: false,
        isNoIncomeEnabled: false,
        isTradeEnabled: false,
        isITRenabled: true,
        isGSTenabled: false,
        isBankHistoryEnabled: false
      });
    } else if (e.value === "GST") {
      this.setState({
        isDocumentationEnabled: false,
        isNoIncomeEnabled: false,
        isTradeEnabled: false,
        isITRenabled: false,
        isGSTenabled: true,
        isBankHistoryEnabled: false
      });
    } else if (e.value === "Bank History") {
      this.setState({
        isDocumentationEnabled: false,
        isNoIncomeEnabled: false,
        isTradeEnabled: false,
        isITRenabled: false,
        isGSTenabled: false,
        isBankHistoryEnabled: true
      });
    }
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
              sectionLabel="Occupation Type Details"
              sectionKey="OccupationTypeDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Occupation Type"
                    name="OccupationType"
                    component={Select}
                    hidden={true}
                    placeholder="Select Occupation Type"
                    className="a8Select"
                    onChange={this.handleOccupationTypeChange}
                    validate={[
                      A8V.required({ errorMsg: "Occupation Type is required" }),
                    ]}
                  >
                    <Option value="Salaried">Salaried</Option>
                    <Option value="Business">Business</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>
          {(this.state.isSalariedEnabled || this.state.isBusinessEnabled) &&
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Income Details"
                sectionKey="IncomeDetails"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              {this.state.isSalariedEnabled &&
                <div className="form-section-content" style={{ display: "block" }}>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Income"}
                        name="MonthlyIncome"
                        component={TextBox}
                        onChange={this.handleMonthlyIncome}
                        placeholder="Enter Monthly Income"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Monthly Income is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Verified"
                        name="IncomeVerification"
                        buttonStyle="outline"
                        component={RadioWrapper}
                        onChange={this.handleVerifiedChange}
                        validate={[
                          A8V.required({ errorMsg: "Income Verification is required" }),
                        ]}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Field>
                    </div>
                    {this.state.isVerificationSourceEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Verified by"
                          name="VerificationSource"
                          component={Select}
                          placeholder="Select Source"
                          onChange={this.handleVerifiedByChange}
                          className="a8Select"
                          validate={[
                            A8V.required({ errorMsg: "Verification Source is required" }),
                          ]}
                        >
                          <Option value="PaySlip">Pay slip</Option>
                          <Option value="RentalAggrement">Rental Aggrement</Option>
                          <Option value="TeleVerification">Tele Verification</Option>
                          <Option value="Others">Others</Option>
                        </Field>
                      </div>}
                    {this.state.isVerifiedByOthersEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Others Description"}
                          name="OthersSpecify"
                          component={TextBox}
                          placeholder="Enter Others Description"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Others Description is required" }),
                          ]}
                        />
                      </div>
                    }
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Income from other sources"}
                        name="OtherIncome"
                        component={TextBox}

                        placeholder="Enter Income from other Sources"
                        onChange={this.handleOtherIncome}
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Other source income is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Total Applicant Income"}
                        name="TotalApplicantIncome"
                        component={TextBox}
                        placeholder="Enter Applicant Income"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Total Applicant income is required" }),
                        ]}
                      />
                    </div>
                  </div>
                </div>}
              {this.state.isBusinessEnabled &&
                <div className="form-section-content" style={{ display: "block" }}>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business Evaluation Approach"
                        name="BusinessEvaluationApproach"
                        component={Select}
                        placeholder="Select Source"
                        className="a8Select"
                        onChange={this.handleBusinessEvaluationApproach}
                        validate={[
                          A8V.required({ errorMsg: "Business Evaluation Approach is required" }),
                        ]}
                      >
                        <Option value="Bank History">Bank History</Option>
                        <Option value="GST">GST</Option>
                        <Option value="ITR">ITR</Option>
                        <Option value="Trade">Trade</Option>
                        <Option value="No Income Proof for trading/ services">No Income Proof for trading/ services</Option>
                        <Option value="No Documentation for manufacturing">No Documentation for manufacturing</Option>
                      </Field>
                    </div>
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Month Start"
                          name="MonthStart"
                          component={DatePicker}
                          dateFormat="DD-MM-YYYY"
                          placeholder="Select Date"
                          validate={[
                            A8V.required({ errorMsg: "Date is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Total Deposit"}
                          name="TotalDeposit"
                          component={TextBox}
                          placeholder="Enter Total Deposit"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Total Deposit is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Month End Balance"}
                          name="MonthEndBalance"
                          component={TextBox}
                          placeholder="Enter Month End Balance"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Month End Balance is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Inward Bounces"}
                          name="InwardBounces"
                          component={TextBox}
                          placeholder="Enter Inward Bounces"
                          type="text"
                          hasFeedback
                          onChange={this.handleInwardBounce}
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Inward Bounces is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Outward Bounces"}
                          name="OutwardBounces"
                          component={TextBox}
                          placeholder="Enter Outward Bounces"
                          onChange={this.handleOutwardBounce}
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Outward Bounces is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Total Bounces"}
                          name="TotalBounces"
                          component={TextBox}
                          placeholder="Enter Outward Bounces"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Total Bounces is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Needed?"
                          name="MultiplierNeededBankHistory"
                          buttonStyle="outline"
                          onChange={this.handleMultiplierChange}
                          component={RadioWrapper}
                        >
                          <Radio value="Yes">Yes</Radio>
                          <Radio value="No">No</Radio>
                        </Field>
                      </div>}
                    {this.state.isMultiplierDetailsEnabled && this.state.isBankHistoryEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Value"
                          name="MultiplierValueBankHistory"
                          component={Select}
                          placeholder="Select Multiplier Value"
                          className="a8Select"
                          onChange={this.handleGSTFilingApproach}
                          validate={[
                            A8V.required({ errorMsg: "Multiplier Value is required" }),
                          ]}
                        >
                          <Option value="1.1">1.1</Option>
                          <Option value="1.25">1.25</Option>
                          <Option value="1.5">1.5</Option>
                          <Option value="2">2</Option>
                        </Field>
                      </div>
                    }
                    {this.state.isGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="GST Filing Approach"
                          name="GSTFilingApproach"
                          component={Select}
                          placeholder="Select Approach"
                          className="a8Select"
                          onChange={this.handleGSTFilingApproach}
                          validate={[
                            A8V.required({ errorMsg: "GST Filing Approach is required" }),
                          ]}
                        >
                          <Option value="Monthly">Monthly</Option>
                          <Option value="Quarterly">Quarterly</Option>
                          <Option value="Yearly">Yearly</Option>
                        </Field>
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 1"}
                          name="SalesMonth1"
                          component={TextBox}
                          placeholder="Enter Sales Month 1"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 1 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 2"}
                          name="SalesMonth2"
                          component={TextBox}
                          placeholder="Enter Sales Month 2"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 2 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 3"}
                          name="SalesMonth3"
                          component={TextBox}
                          placeholder="Enter Sales Month 3"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 3 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 4"}
                          name="SalesMonth4"
                          component={TextBox}
                          placeholder="Enter Sales Month 4"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 4 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 5"}
                          name="SalesMonth5"
                          component={TextBox}
                          placeholder="Enter Sales Month 5"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 5 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isMonthlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Month 6"}
                          name="SalesMonth6"
                          component={TextBox}
                          onChange={this.handleMonthlySalesfromGST}
                          placeholder="Enter Sales Month 6"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Month 6 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isQuarterlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Quarter "}
                          name="SalesQuarter1"
                          component={TextBox}
                          placeholder="Enter Sales Quarter 1"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Quarter 1 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isQuarterlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Sales Quarter 2"}
                          name="SalesQuarter2"
                          component={TextBox}
                          onChange={this.handleMonthlySalesfromGST}
                          placeholder="Enter Sales Quarter 2"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Sales Quarter 1 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled && this.state.isYearlyGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Yearly Sales"}
                          name="YearlySales"
                          component={TextBox}
                          placeholder="Enter Yearly Sales"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Yearly Sales is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Needed?"
                          name="MultiplierNeededGST"
                          buttonStyle="outline"
                          onChange={this.handleMultiplierChange}
                          component={RadioWrapper}
                        >
                          <Radio value="Yes">Yes</Radio>
                          <Radio value="No">No</Radio>
                        </Field>
                      </div>}
                    {this.state.isMultiplierDetailsEnabled && this.state.isGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Value"
                          name="MultiplierValueGST"
                          component={Select}
                          placeholder="Select Multiplier Value"
                          className="a8Select"
                          onChange={this.handleGSTFilingApproach}
                          validate={[
                            A8V.required({ errorMsg: "Multiplier Value is required" }),
                          ]}
                        >
                          <Option value="1.1">1.1</Option>
                          <Option value="1.25">1.25</Option>
                          <Option value="1.5">1.5</Option>
                          <Option value="2">2</Option>
                        </Field>
                      </div>
                    }
                    {this.state.isGSTenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Monthly Sales from GST"}
                          name="MonthlySalesfromGST"
                          component={TextBox}
                          placeholder="Enter Monthly Sales from GST"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Monthly Sales from GST 1 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isITRenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"ITR Sales Year 1"}
                          name="ITRSalesYear1"
                          component={TextBox}
                          placeholder="Enter ITR sales year 1"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "ITR sales year 1 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isITRenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"ITR Sales Year 2"}
                          name="ITRSalesYear2"
                          component={TextBox}
                          onChange={this.handleMonthlyITRSales}
                          placeholder="Enter ITR sales year 2"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "ITR sales year 2 is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isITRenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Needed?"
                          name="MultiplierNeededITR"
                          buttonStyle="outline"
                          component={RadioWrapper}
                          onChange={this.handleMultiplierChange}
                        >
                          <Radio value="Yes">Yes</Radio>
                          <Radio value="No">No</Radio>
                        </Field>
                      </div>}
                    {this.state.isMultiplierDetailsEnabled && this.state.isITRenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Multiplier Value"
                          name="MultiplierValueITR"
                          component={Select}
                          placeholder="Select Multiplier Value"
                          className="a8Select"
                          onChange={this.handleGSTFilingApproach}
                          validate={[
                            A8V.required({ errorMsg: "Multiplier Value is required" }),
                          ]}
                        >
                          <Option value="1.1">1.1</Option>
                          <Option value="1.25">1.25</Option>
                          <Option value="1.5">1.5</Option>
                          <Option value="2">2</Option>
                        </Field>
                      </div>
                    }
                    {this.state.isITRenabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Monthly ITR sales"}
                          name="MonthlyITRSales"
                          component={TextBox}
                          placeholder="Enter Monthly ITR sales"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Monthly ITR services is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Daily Business"}
                          name="DailyBusiness"
                          component={TextBox}
                          placeholder="Enter Daily Business"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Daily Business is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Weekly Business"}
                          name="WeeklyBusiness"
                          component={TextBox}
                          placeholder="Enter Weekly Business"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Weekly Business is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Monthly Business"}
                          name="MonthlyBusiness"
                          component={TextBox}
                          placeholder="Enter Monthly Business"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Monthly Business is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Business Margin"}
                          name="BusinessMargin"
                          component={TextBox}
                          placeholder="Enter Business Margin"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Business Margin is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Average Monthly Income"}
                          name="AverageMonthlyIncome"
                          component={TextBox}
                          placeholder="Enter Average Monthly Income"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Average Monthly Income is required" }),
                          ]}
                        />
                      </div>}
                    {this.state.isNoIncomeEnabled &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Other Income"}
                          name="OtherIncome"
                          component={TextBox}
                          placeholder="Enter Other Income"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Other Income is required" }),
                          ]}
                        />
                      </div>}
                  </div>
                </div>}
            </div>}
          {this.state.isPaySlipScannerEnabled &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"Pay Slip"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field

                  label={"Pay Slip"}
                  name="PaySlip"
                  component={Scanner}
                  docType="IMG"
                  imageVar="PaySlip"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>}
          {this.state.isRentalAggrementScannerEnabled &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"Rental Aggerement"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field

                  label={"Rental Aggerement"}
                  name="RentalAggerement"
                  component={Scanner}
                  docType="IMG"
                  imageVar="RentalAggerement"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>}
          {this.state.isTeleVerificationScannerEnabled &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"Tele Verification"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field

                  label={"Tele Verification"}
                  name="TeleVerification"
                  component={Scanner}
                  docType="IMG"
                  imageVar="TeleVerification"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>}
          {this.state.isVerifiedByOthersEnabled &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"Others"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field

                  label={"Others"}
                  name="Others"
                  component={Scanner}
                  docType="IMG"
                  imageVar="Others"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>}
          {this.state.isTradeEnabled &&
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Purchase Bill"
                sectionKey="PurchaseBill"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <FieldArray name="members" component={renderPurchaseBill}
                    fieldWatcher={this.handlePurchaseBill} />
                </div>
              </div>
            </div>}
          {this.state.isTradeEnabled &&
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Sales Bill"
                sectionKey="SalesBill"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <FieldArray name="members" component={renderSalesBill}
                    fieldWatcher={this.handleSalesBill} />
                </div>
              </div>
            </div>}
          {this.state.isHouseHoldExpense &&
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Expense Details"
                sectionKey="ExpenseDetails"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Is borrower part of a household"
                      name="BorrowerExistingHousehold"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      onChange={this.BorrowerExistingChange}
                      validate={[
                        A8V.required({ errorMsg: "Borrower Existing HouseHold is required" }),
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"If already included, name of household head"}
                        name="HouseholdHeadName"
                        component={TextBox}
                        placeholder="Enter Name of Hosuehold"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Household Head Income is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Rent"}
                        name="Rent"
                        component={TextBox}
                        placeholder="Enter Rent"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Rent is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Food"}
                        name="Food"
                        component={TextBox}
                        placeholder="Enter Food expense"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Food is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Water / Electricity"}
                        name="Water/Electricity"
                        component={TextBox}
                        placeholder="Enter Water / Electricity Expense"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Water/Electricity is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Education"}
                        name="Education"
                        component={TextBox}
                        placeholder="Enter Education Expense"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Education is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Clothing"}
                        name="Clothing"
                        component={TextBox}
                        placeholder="Enter Clothing"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Clothing is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Healthcare"}
                        name="HealthCare"
                        component={TextBox}
                        placeholder="Enter Healthcare"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Health Care is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Transportation"}
                        name="Transportation"
                        component={TextBox}
                        placeholder="Enter Transportation"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Transportation is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Telephone"}
                        name="Telephone"
                        component={TextBox}
                        placeholder="Enter Telephone"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Telephone is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Other"}
                        name="Other"
                        component={TextBox}
                        placeholder="Enter Other Expenses"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Other is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Fixed Obligations"}
                        name="FixedObligations"
                        component={TextBox}
                        placeholder="Enter Fixed Obligations"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Fixed Obligations is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Payment towards Household Debt"}
                        name="HouseholdDebtPayment"
                        component={TextBox}
                        placeholder="Enter Payment towards Household Debt"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Payment towards Household Debt is required" }),
                        ]}
                      />
                    </div>}
                  {this.state.isHouseHoldExpenseSectionEnabled &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Total Expenses"}
                        name="TotalExpenses"
                        component={TextBox}
                        placeholder="Enter TotalExpenses"
                        type="text"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Total Expense is required" }),
                        ]}
                      />
                    </div>}
                </div>
              </div>
            </div>}
          <div className="form-section" >
            <FormHeadSection
              sectionLabel="Obligation Details"
              sectionKey="ObligationDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Name Of the Bank"
                    name="BankName"
                    component={Select}
                    placeholder="Select Name of the Bank"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Bank Name is Required" }),
                    ]}
                  >
                    <Option value="AxisBank">Axis Bank</Option>
                    <Option value="KotakMahindraBank">Kotak Mahindra Bank</Option>
                    <Option value="HDFCBank">HDFC Bank</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Type of Loan"
                    name="LoanType"
                    component={Select}
                    placeholder="Select Loan Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Loan Type is Required" }),
                    ]}
                  >
                    <Option value="Housng Loan">Housing Loan</Option>
                    <Option value="LAP">LAP</Option>
                    <Option value="Personal Loan">Personal Loan</Option>
                    <Option value="Gold Loan">Gold Loan</Option>
                    <Option value="Credit CARD">Credit CARD</Option>
                    <Option value="Vehicle Loan">Vehicle Loan</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4" >
                  <Field
                    label={"Outstanding Balance"}
                    name="OutstandingBalance"
                    component={TextBox}
                    placeholder="Enter Outstanding Balance"
                    type="text"
                    hasFeedback
                    normalize={proceedNumber}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Outstanding Balance is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4" >
                  <Field
                    label={"EMI"}
                    name="EMI"
                    component={TextBox}
                    normalize={proceedNumber}
                    placeholder="Enter EMI"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "EMI is required" }),
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
  console.log("TAB income and epense values", state);
  return {
    //get current form values
    formValues: getFormValues("coProcess")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("coProcess")(state)
  };
};
export default connect(
  mapStateToProps,
  {}
)(TabIncomeAndExpense);
