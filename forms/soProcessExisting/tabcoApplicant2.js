import * as React from "react";
import { connect } from "react-redux";
import { Button, Result, Icon, message } from "antd";
import {
  FormHeadSection,
  inrFormat,
  A8V,
  renderExpenseMembers,
  TextAreaHelper,
  proceedNumber,
  sortAlphabetically,
  Config
} from "../../helpers";
import {
  Select,
  SelectHelper,
  Scanner,
  TextBox,
  RadioWrapper,
  Radio,
  DatePicker,
  Otp,
  TextButtonGroup,
  AccountDetailsView
} from "a8flow-uikit";

import {
  Field, FieldArray, getFormSyncErrors, getFormValues,//InjectedFormProps
} from "redux-form";
import axios from "axios";
import moment from "moment";
import classname from "classnames"

const { Option } = SelectHelper

class TabCoApplicant2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionValidator: {
        c2ApplicantDetails: ["c2ApplicationID", "c2BorrowerType", "c2mobileNumber"],
        c2applicantOtpVerification: [""],
        c2cifCheck: ["c2CustomerAccountNumber"],
        c2applicantBasicEval: ["c2LoanAmount", "c2LoanScheme", "c2ExpectedTenure", "c2EstimatedEMI", "c2TotalMonthlySurplus"],
        c2applicantEmpInfo: ["c2OccupationType"],
        c2applicantExtraOrdinaryExpense: ["ExtraExpenseType", "ExpenseValue", "members"],
        c2foirCalculation: [""],
        c2applicantBankingHistory: ["c2ESAFCustomer"],
        c2ReferencesInfo: ["c2ReferenceName_1", "c2ReferenceName_2", "c2ReferenceMobile_1", "c2ReferenceMobile_2", "c2ReferenceType_1", "c2ReferenceType_2"],
        c2loanEligibilityDetails: ["c2LoanType"],

      },

      c2showESAFCustomer: false, c2disableSangamBranch: true, c2disableMbBranchName: true, c2CustomerAccountNumber: '',
      c2showBusinessLoanFields: false, c2showHousingLoanFields: false, c2showVehicleLoanFields: false, c2showGreenEnergyLoanFields: false,
      c2showOthersComments: false, c2response: {}, c2otp: "", c2verifyOTP: '', c2mobileNumber: '', c2otpPinID: '', c2otpSent: false, c2foirValue: '',
      c2showFieldCards: false, c2ShowhiddenFields: false, c2prefix: '', c2maritalStatus: '', c2DOB: '', c2aadhaar: '', c2fatherName: '',
      c2motherName: '', c2houseName: '', c2street: '', c2city: '', c2district: '', c2pinCode: '', c2incomeDetails: '', c2employeeNumber: '',
      c2veh_InsuranceAmount: '', c2veh_showRoomPrice: '', c2veh_roadTax: '', c2RelationShipBusinessOthers: false, c2RegistrationTypeOthers: false,
      c2AddressProofTypeOthers: false, c2digit1: '', c2digit2: '', c2digit3: '', c2digit4: '', c2showOTPverification: false, c2showSalariedFields: false,
      c2showBusinessFields: false, c2showOthersFields: false, c2monthlySalary: '', c2grossAnnual: '', c2monthlyObligation: '', c2netAnnual: '',
      c2startDate: '', c2Age: '', c2dayCount: '', c2monthlyGross: '', c2annualGross: '', c2loantypeOptions: [], c2stateOptions: [], c2showFoirProgress: false, c2showFoirButton: true, c2ifsc: '', c2buttonLabel: 'Verify', c2loading: false, c2showSuccess: false, c2showFailure: false,
      c2monthlyIncomeOthers: '', c2salObligationValue: '', c2busiObligationValue: '', c2othersObligationValue: '', c2CIFbuttonLabel: "CIF Check",
      c2CIFloading: false, c2cardView: null
    };
  }

  componentDidMount() {
    let config = {
      url: `${Config.apiUrl}/v1/loanType`,
      method: 'get'
    }
    axios(config).then(response => {
      let loanType = response.data.loantype;
      let loanTypeDD = [];
      for (let iter = 0; iter < loanType.length; iter++) {
        loanTypeDD.push({
          value: loanType[iter].LoanType,
          label: loanType[iter].LoanType
        })
      }
      this.setState({
        c2loantypeOptions: loanTypeDD
      });
    }).catch(error => {
      console.log(error);
    });

    let configs = {
      url: `${Config.apiUrl}/v1/states`,
      method: 'get'
    }
    axios(configs).then(response => {
      let states = response.data.states;
      let stateDD = [];
      states.sort(sortAlphabetically("StateName"));
      for (let iter = 0; iter < states.length; iter++) {
        stateDD.push({
          value: states[iter].StateCode,
          label: states[iter].StateName
        })
      }
      this.setState({
        c2stateOptions: stateDD
      });
    }).catch(error => {
      console.log(error);
    });
  }

  handleCIFCheck = () => {
    let payload = {
      "input": {
        "Operation": "customerDetailsInquiry",
        "SessionContext": {
          "Channel": "AUTO8",
          "ExternalReferenceNo": "30265678999",
          "SupervisorContext": {
            "userID": "AUTONOMOS8",
            "PrimaryPassword": "V2VsY29tZUAxMjM="
          }
        },
        "Action": "CUSTENQ",
        "Data": this.state.c2CustomerAccountNumber
      }
    }
    let cifConfig = {
      url: `${Config.apiUrl}/v1/customerDetailsInquiry`,
      method: 'post',
      data: payload
    }

    axios(cifConfig).then(Response => {
      var data = Response.data;
      this.setState({ c2response: data });
      this.setState({ c2showFieldCards: true });
      this.setState({ c2ShowhiddenFields: true });
      this.mapSections();
    })
  }

  mapSections = () => {
    try {
      var cifResponse = this.state.c2response;
      var totalInformations = {
        "Applicant Basic Information": {
          "Aadharnumber": "",
          "PAN no.": "",
          "First Name": "",
          "Middle Name": " ",
          "Last Name": "",
          "Maiden Name": "",
          "Gender": "",
          "Salutation": "",
          "Date of Birth": "",
          "Age": "",
          "Voter id": ""
        },
        "Applicant Employment Information": {
          "Occupation Type": "",
          "Sub-Occupation": "",
          "If Self Employed": "",
          "Mode of Operation": "",
          "Applicants Annual Income in INR": "",
          "Form 60 /61": "",
          "Employeee Number": "",
          "Company name for salaried individual": "",
          "Employee working sector": "",
          "Date of commencement of business": "",
          "Nature of Business": "",
          "TAN No": "",
          "SSI MSME REG NO MSME Registration is an optional Registration under the MSMED Act that provides Micro Small and Medium sized enterprises": "",
          "Annual sales": "",
          "Company name": "",
          "Designation": "",
          "Employee id": "",
          "SBU CODE": "",
          "Prefered category": "",
          "Income details": ""
        },
        "Applicant Detailed Information": {
          "Primary ID Proof Type": "",
          "Primary ID Proof No.": "",
          "Secondary ID Proof Type": "",
          "Secondary ID Proof No.": "",
          "Age as On Date": "",
          "Education Qualification": "",
          "Mobile no.": "",
          "Email": "",
          "Father's Name": "",
          "Mother's Maiden Name": "",
          "Spouse Name": "",
          "What is the general education level of the female head/spouse?": "",
          "Residency Status": "",
          "Religion": "",
          "Caste": "",
          "Nationality": "",
          "Marital Status": "",
          "No. of adults (Dependents)": ""
        },
        "Applicant Address Information": {
          "Present/Permanent Address Proof Type": "",
          "Present/Permanent Address Proof No.": "",
          "House No./Name": "",
          "Street/Area": "",
          "City": "",
          "Post Office": "",
          "State": "",
          "District": "",
          "Pin code": "",
          "Telephone Residence": "",
          "STD Code": "",
          "Location": "",
          "Land Mark": "",
          "Period of Stay at the Address": "",
          "Correspondence Address Proof Type": "",
          "Correspondence Address Proof No": "",
          "House No./Namerepeated": "",
          "Street/Arearepeated": "",
          "Cityrepeated": "",
          "Post Officerepeated": "",
          "Staterepeated": "",
          "Districtrepeated": "",
          "Pin coderepeated": "",
          "Telephone Residencerepeated": "",
          "STD Coderepeated": "",
          "Locationrepeated": "",
          "Land Markrepeated": ""
        }
      }
      var cardView = [];
      for (let parentKey in totalInformations) {
        let collectCardData = {};
        collectCardData["accountName"] = parentKey;
        collectCardData["fields"] = [];
        //append actual data to totalInformation
        for (let childKey in totalInformations[parentKey]) {
          totalInformations[parentKey][childKey] = cifResponse[childKey] || "";
          if (totalInformations[parentKey][childKey]) {
            collectCardData.fields.push({
              fieldKey: childKey,
              fieldValue: totalInformations[parentKey][childKey]
            })
          }
        }
        cardView.push(collectCardData);
      }
      this.setState({ c2cardView: cardView })

    } catch (error) {
      throw error;
    }
  }

  MbCustomerChange = (e) => {
    if (e.value === "Yes") {
      this.setState({
        c2disableSangamBranch: false,
        c2disableMbBranchName: false
      });
    } else {
      this.setState({
        c2disableSangamBranch: true,
        c2disableMbBranchName: true
      });
      this.props.fieldPopulator("SangamBranch", "");
      this.props.fieldPopulator("MBBranchName", "");
    }
  }

  handleIFSCcode = (e) => {
    let code = e.value;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null
      if (status === true) {
        this.setState({ c2ifsc: code });
      } else {
        alert("IFSC code doesn't match")
      }
    }
  }

  esafCustomerChange = (e) => {
    if (e.value === "Yes") {
      this.setState({ c2showESAFCustomer: true });
    } else if (e.value === "No") {
      this.setState({ c2showESAFCustomer: false });
    }
  }

  handleAccountNumber = value => {
    let enteredValue = value.value
    let accountNumber = enteredValue
    if (accountNumber.length > 12) {
      message.error("Please check your CIF Account Number");
    }
    this.setState({ c2CustomerAccountNumber: enteredValue });
  };

  handleNumberChange = (e) => {
    let mobNo = e.value;
    this.setState({ c2mobileNumber: mobNo });
  }
  handleSendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/sendOtp`,
      "method": 'post',
      "data": {
        mobile: '91' + this.state.c2mobileNumber,
      }
    }
    this.setState({ c2loading: true });
    axios(config).then(response => {
      var pinID = response.data.pinId;
      if (response.data.smsStatus === "MESSAGE_SENT") {
        this.setState({ c2otpSent: true, })
        this.setState({ c2showOTPverification: true })
      }
      this.setState({ c2otpPinID: pinID, c2loading: false, c2buttonLabel: "Resend", c2showSuccess: true, c2showFailure: false })
    }, () => {
      this.setState({ c2loading: false, c2buttonLabel: "Resend", c2showSuccess: false, c2showFailure: true });
    })
  }
  handleResendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/resendOtp`,
      "method": 'post',
      "data": {
        mobile: '91' + this.state.c2mobileNumber
      }
    }
    this.setState({ loading: true });
    axios(config).then(response => {
      var resendpinID = response.data.pinId;
      this.setState({ c2otpPinID: resendpinID, c2otpSent: true, c2loading: false, c2buttonLabel: "Resend", c2showSuccess: true })
    }, () => {
      this.setState({ c2loading: false, c2buttonLabel: "Resend", c2showSuccess: false, c2showFailure: true })
    })
  }
  handleOtpNumber = (otp) => {
    let otpValue = otp
    this.setState({ c2otp: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      "method": 'post',
      "data": {
        otp: otpValue,
        pin_id: this.state.c2otpPinID
      }
    }
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ c2verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          message.success("OTP Verified Successfully")
        } else if (response.data.verified === false) {
          message.error("OTP Verification Failed")
        }
      })
    } else {
      console.log("hit in first instance")
    }
  }
  onchangeOtp = () => {
    // for ui warning manipulation
  }

  handleShowRoomPrice = (value) => {
    let enteredValue = value.value
    let price = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_showRoomPrice: price })
    if (this.props.formValues.c2RoadTax && this.props.formValues.c2InsuranceAmount) {
      let veh_tax = this.state.c2veh_roadTax
      let veh_insAmt = this.state.c2veh_InsuranceAmount;
      let veh_onroadprice = parseInt(price) + parseInt(veh_tax) + parseInt(veh_insAmt);
      let orp = { type: "String", value: this.displayINRformat(veh_onroadprice) }
      this.props.fieldPopulator("c2OnRoadPrice", orp)
    }
  }
  handleRoadTax = (value) => {
    let enteredValue = value.value
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_roadTax: tax })
    if (this.props.formValues.c2ExShowroomPrice && this.props.formValues.c2InsuranceAmount) {
      let veh_insAmount = this.state.c2veh_InsuranceAmount;
      let veh_Price = this.state.c2veh_showRoomPrice;
      let veh_onRoadPrice = parseInt(tax) + parseInt(veh_insAmount) + parseInt(veh_Price)
      let orp = { type: "String", value: this.displayINRformat(veh_onRoadPrice) }
      this.props.fieldPopulator("c2OnRoadPrice", orp)
    }
  }
  handleOnRoadPrice = (value) => {
    let enteredValue = value.value
    let insAmount = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_InsuranceAmount: insAmount }, () => { });
    let showRoomPrice = this.state.c2veh_showRoomPrice;
    let roadTax = this.state.c2veh_roadTax;
    let onRoadPrice = parseInt(showRoomPrice) + parseInt(roadTax) + parseInt(insAmount);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) }
    this.props.fieldPopulator("c2OnRoadPrice", orp)
  }
  handleRelationShipBusiness = (value) => {
    if (value.value === 'Others') {
      this.setState({ c2RelationShipBusinessOthers: true })
    }
  }
  handleRegistrationTypeOthers = (value) => {
    if (value.value === 'Others') {
      this.setState({ c2RegistrationTypeOthers: true })
    }
  }
  handleAddressProofTypeOthers = (value) => {
    if (value.value === 'Others') {
      this.setState({ c2AddressProofTypeOthers: true })
    }
  }
  loanTypeChange = (value) => {
    if (value.value === "Business Loan") {
      this.setState({
        c2showBusinessLoanFields: true, c2showHousingLoanFields: false, c2showVehicleLoanFields: false,
        c2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "Micro Housing Loan" ||
      value.value === "Loan Against Property" ||
      value.value === "Dream House Loan" ||
      value.value === "Affordable Housing Loan") {
      this.setState({
        c2showBusinessLoanFields: false, c2showHousingLoanFields: true, c2showVehicleLoanFields: false,
        c2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "Two Wheeler Loan" || value.value === "Three Wheeler Loan") {
      this.setState({
        c2showBusinessLoanFields: false, c2showHousingLoanFields: false, c2showVehicleLoanFields: true,
        c2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "ESAF Haritha Loan" || value.value === "Clean Energy Loan") {
      this.setState({
        c2showBusinessLoanFields: false, c2showHousingLoanFields: false, c2showVehicleLoanFields: false,
        c2showGreenEnergyLoanFields: true
      });
    }
  }
  handleAssetType = (value) => {
    if (value.value === "Others") {
      this.setState({ c2showOthersComments: true });
    } else if (value.value !== "Others") {
      this.setState({ c2showOthersComments: false })
    }
  }
  handleOccupationType = (value) => {
    if (value && value.value === "Salaried") {
      this.setState({ c2showSalariedFields: true, c2showBusinessFields: false, c2showOthersFields: false });
    } else if (value && value.value === "Business") {
      this.setState({ c2showSalariedFields: false, c2showBusinessFields: true, c2showOthersFields: false });
    } else if (value && value.value === "Others") {
      this.setState({ c2showSalariedFields: false, c2showBusinessFields: false, c2sshowOthersFields: true, });
    }
  }
  handleFoirCalculation = () => {
    let i;
    if (this.props.formValues.c2OccupationType && this.props.formValues.c2OccupationType.value === "Salaried") {
      let Foirobligation = this.props.formValues.c2salariedMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.c2salariedMonthlyGrossSalary.value
      let membertotalFoir;
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let salariedMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(salariedMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ c2foirValue: membertotalFoir });
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true })
    }
    if (this.props.formValues.c2OccupationType && this.props.formValues.c2OccupationType.value === "Business") {
      let Foirobligation = this.props.formValues.c2businessMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.c2businessMonthlyGrossSalary.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let businessMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(businessMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ c2foirValue: membertotalFoir });
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true })
    }
    if (this.props.formValues.c2OccupationType && this.props.formValues.c2OccupationType.value === "Others") {
      let Foirobligation = this.props.formValues.c2othersMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.c2othersMonthlyGrossSalary.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let OthersMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(OthersMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ c2foirValue: membertotalFoir });
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true })
    }
  }
  handleBusinessStartDate = (date) => {
    let selected = moment(date);
    let today = moment(new Date());
    var Duration = moment.duration(selected.diff(today));
    var year = Duration.years()
    var month = Duration.months()
    var day = Duration.days()
    let age = year + "Years" + month + "Months" + day + "Days"
    let value = { type: "String", value: age }
    this.setState({ c2startDate: date, Age: age });
    this.props.fieldPopulator("c2BusinessAge", value);
  }
  displayINRformat = (entry) => {
    var value = entry;
    value = value.toString();
    var lastThree = value.substring(value.length - 3);
    var otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return (res);
  }
  salariedhandleMonthlySalary = (value) => {
    let enteredValue = value.value
    let salariedmonthly = enteredValue.replace(/,/g, "");
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross }
    if (!this.props.formValues.c2salariedMonthlyFixedObligation) {
      this.setState({ c2salariedAnnualIncome: salariedGross })
      this.props.fieldPopulator("c2salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.c2salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.c2salObligationValue;
      let netIncome = this.displayINRformat(salariedGross.replace(/,/g, "") - (salariedObligationValue * 12))
      let net = { type: "String", value: netIncome }
      this.props.fieldPopulator("c2salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("c2salariedNetAnnualIncome", net);
    }
  }
  handlemonthlyObligationSalaried = (value) => {
    let enteredValue = value.value
    let salariedObligation = enteredValue.replace(/,/g, "");
    this.setState({ c2salObligationValue: salariedObligation })
    let salariedGrossAnnual = this.props.formValues.c2salariedGrossAnnualIncome.value;
    let salariednetIncome = this.displayINRformat(salariedGrossAnnual.replace(/,/g, "") - (salariedObligation * 12))
    let net = { type: "String", value: salariednetIncome }
    this.props.fieldPopulator("c2salariedNetAnnualIncome", net)
  }
  businesshandleMonthlySalary = (value) => {
    let enteredValue = value.value
    let businessmonthly = enteredValue.replace(/,/g, "");
    let businessGross = this.displayINRformat(businessmonthly.replace(/,/g, "") * 12);
    let gross = { type: "String", value: businessGross }
    this.props.fieldPopulator("c2businessGrossAnnualIncome", gross);
    if (this.props.formValues.c2businessMonthlyFixedObligation) {
      let businessObligation = this.state.c2busiObligationValue
      let netIncomeBusiness = this.displayINRformat(businessGross.replace(/,/g, "") - (businessObligation * 12))
      let net = { type: "String", value: netIncomeBusiness }
      this.props.fieldPopulator("c2businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("c2businessNetAnnualIncome", net)
    }
  }
  handlemonthlyObligationBusiness = (value) => {
    let enteredValue = value.value
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ c2busiObligationValue: businessObligation })
    let businessGrossAnnual = this.props.formValues.c2businessGrossAnnualIncome
    let businessnetIncome = this.displayINRformat(businessGrossAnnual.replace(/,/g, "") - (businessObligation * 12));
    let net = { type: "String", value: businessnetIncome }
    this.props.fieldPopulator("c2businessNetAnnualIncome", net);
  }
  handlemonthlyObligationOthers = (value) => {
    let enteredValue = value.value
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ c2othersObligationValue: othersObligation })
    let othersGrossMonthly = this.props.formValues.c2othersGrossMonthlyIncome
    let othersGrossAnnualIncome = (othersGrossMonthly.replace(/,/g, "") * 12);
    let othersnetIncome = this.displayINRformat(othersGrossAnnualIncome - (othersObligation * 12));
    let net = { type: "String", value: othersnetIncome }
    this.props.fieldPopulator("c2NetAnnualIncomeOthers", net);
  }
  handleDailyIncomeChange = (value) => {
    let enteredValue = value.value
    let OthersdailyIncome = enteredValue.replace(/,/g, "");
    let values = { type: "String", value: "" }
    this.setState({ c2monthlyIncomeOthers: OthersdailyIncome })
    if (!this.props.formValues.c2othersWorkingDayCount) {
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", values)
    } else {
      let daycountValue = this.props.formValues.c2othersWorkingDayCount;
      let MonthlyGross = this.displayINRformat(OthersdailyIncome * daycountValue);
      let gross = { type: "String", value: MonthlyGross }
      let obligationOthers = this.state.c2othersObligationValue
      let othersGrossAnnual = (MonthlyGross * 12);
      let othersnetIncome = this.displayINRformat(othersGrossAnnual - (obligationOthers * 12));
      let net = { type: "String", value: othersnetIncome }
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c2NetAnnualIncomeOthers", net)
    }
  }
  handleDayCount = (value) => {
    let enteredValue = value.value
    let dayCount = enteredValue
    let MonthlyGrossIncome = this.displayINRformat(this.props.formValues.c2othersDailyIncome.value.replace(/,/g, "") * dayCount);
    let gross = { type: "String", value: MonthlyGrossIncome }
    if (!this.props.formValues.c2othersMonthlyFixedObligation) {
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", gross);
    } else {
      let obliqothr = this.props.formValues.c2othersMonthlyFixedObligation.value.replace(/,/g, "")
      let annualIncomeOthers = MonthlyGrossIncome * 12
      let netAnnualOthers = this.displayINRformat(annualIncomeOthers - (obliqothr * 12))
      let net = { type: "String", value: netAnnualOthers }
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c2NetAnnualIncomeOthers", net)
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
              sectionLabel="Applicant Details"
              sectionKey="c2ApplicantDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant ID"}
                    name="c2ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.maxLength({ errorMsg: "ApplicantID exceeds limit", max: 20 }),
                      A8V.minLength({ errorMsg: "", min: 3 }),
                      A8V.required({ errorMsg: "ApplicantID is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Borrower Type"
                    name="c2BorrowerType"
                    component={Select}
                    placeholder="Select Borrower Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "BorrowerType is required" }),
                    ]}
                  >
                    <Option value="Applicant">Applicant</Option>
                    <Option value="Co-Applicant">Co-Applicant</Option>
                    <Option value="Guarantor">Guarantor</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  {/* empty div for UI adjustment */}
                </div>
                <div className="form-group col-xs-6 col-md-6">
                  <Field
                    label="Mobile number"
                    name="c2mobileNumber"
                    component={TextButtonGroup}
                    placeholder="Enter 10-digit Mobile Number"
                    type="text"
                    onChange={this.handleNumberChange}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Mobile number is required" }),
                      A8V.minLength({ errorMsg: "Enter valid Mobile Number", min: 10 }),
                      A8V.maxLength({ errorMsg: "Enter valid Mobile Number", max: 10 }),
                    ]}
                    buttonLabel={this.state.c2buttonLabel}
                    isButtonLoading={this.state.c2loading}
                    showSuccesIcon={this.state.c2showSuccess}
                    showFailureIcon={this.state.c2showFailure}
                    onButtonClick={() => { this.state.c2buttonLabel === "Verify" ? this.handleSendApi() : this.handleResendApi() }}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.state.c2showOTPverification &&
            <div className="form-section">
              <FormHeadSection
                sectionLabel="OTP Verification"
                sectionKey="applicantOtpVerification"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              <div className="form-section-content" >
                <div className="flex-row">
                  <div className="form-group ">
                    <Otp
                      numInputs={4}
                      submitLabel={"submit"}
                      mobileNumber={this.props.formValues.c2mobileNumber}
                      handleOtpNumber={this.handleOtpNumber}
                      otpOnchange={this.onchangeOtp}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>}

          <div className="form-section">
            <FormHeadSection
              sectionLabel="CIF Check "
              sectionKey="c2cifCheck"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-6">
                  <Field
                    label={"Account Number"}
                    name="c2CustomerAccountNumber"
                    component={TextButtonGroup}
                    placeholder="Enter AccountNumber"
                    onChange={this.handleAccountNumber}
                    type="text"
                    hasFeedback
                    maxlength="12"
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "Account Number is required" })
                    ]}
                    buttonLabel={this.state.c2CIFbuttonLabel}
                    isButtonLoading={this.state.c2CIFloading}
                    onButtonClick={() => { this.handleCIFCheck() }}
                  />
                </div>
                {this.state.c2showFieldCards &&
                  <div className="form-group col-xs-12 col-md-12">
                    {
                      this.state.c2cardView &&
                      <AccountDetailsView
                        accountDetails={this.state.c2cardView}
                      />
                    }
                  </div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Basic Evaluation"
              sectionKey="c2applicantBasicEval"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="c2LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "LoanAmount is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Scheme"
                    name="c2LoanScheme"
                    component={Select}
                    placeholder="Select Loan Scheme"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "LoanScheme is required" }),
                    ]}
                  >
                    <Option value=" Business Loan"> Business Loan</Option>
                    <Option value="ESAF Haritha Loan">ESAF Haritha Loan</Option>
                    <Option value="Clean Energy Loan-Hypothecation">Clean Energy Loan-Hypothecation</Option>
                    <Option value="Clean Energy Loan-Mortgage">Clean Energy Loan-Mortgage</Option>
                    <Option value="Loan Against Property">Loan Against Property</Option>
                    <Option value="Micro Housing Loan">Micro Housing Loan</Option>
                    <Option value="Home Improvement Loan-Secured">Home Improvement Loan-Secured</Option>
                    <Option value="Two Wheeler Loan">Two Wheeler Loan</Option>
                    <Option value="Three Wheeler Loan">Three Wheeler Loan</Option>
                    <Option value="School Loan">School Loan</Option>
                    <Option value="Salary Personal Loan">Salary Personal Loan</Option>
                    <Option value="Home Improvement Loan-Unsecured">Home Improvement Loan-Unsecured</Option>
                    <Option value="Unsecured Business Loan">Unsecured Business Loan</Option>
                    <Option value="Personal Loan">Personal Loan</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Expected Tenure"}
                    name="c2ExpectedTenure"
                    component={TextBox}
                    placeholder="Enter Tenure"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "ExpectedTenure is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Estimated EMI"}
                    name="c2EstimatedEMI"
                    component={TextBox}
                    placeholder="Enter EMI"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "EstimatedEMI is required" }),
                    ]}
                  />
                </div>
                {/* <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Total Monthly surplus"}
                    name="c2TotalMonthlySurplus"
                    component={TextBox}
                    placeholder="Enter Monthly surplus"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "TotalMonthlySurplus is required" }),
                    ]}
                  />
                </div> */}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Repayment Frequency"
                    name="c2repaymentFrequency"
                    component={Select}
                    palceholder="Choose Repayment Frequency"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Repayment Frequency is required" }),
                    ]}
                  >
                    <Option value="Monthly"> Monthly</Option>
                    <Option value="Monthly"> Weekly</Option>
                    <Option value="Monthly"> Fortnightly</Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Employment Information"
              sectionKey="c2applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Occupation Type"
                    name="c2OccupationType"
                    component={Select}
                    placeholder="Select Occupation Type"
                    className="a8Select"
                    onChange={this.handleOccupationType}
                    validate={[
                      A8V.required({ errorMsg: "OccupationType is required" }),
                    ]}
                  >
                    <Option value="Salaried">Salaried</Option>
                    <Option value="Business">Business</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>

                {/* if salaried */}

                {this.state.c2showSalariedFields && <React.Fragment>

                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Type of Job"
                      name="c2salariedTypeofJob"
                      component={Select}
                      placeholder="Select Type of Job"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "TypeofJob is required" }),
                      ]}
                    >
                      <Option value="Private">Private</Option>
                      <Option value="Government Job">Government Job</Option>
                    </Field>
                  </div>

                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Experience in Current job"
                      name="c2salariedExperienceCurrentJob"
                      component={Select}
                      placeholder="Select Occupation Type"
                      defaultProp
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Experience Current Job is required" }),
                      ]}
                    >
                      <Option value="10yearsandAbove">10 years and above</Option>
                      <Option value="Between5to10years">Between 5 to 10 years</Option>
                      <Option value="Between2to3years">Between 2 to 3 years</Option>
                      <Option value="Between1to2years">Between 1 to 2 years</Option>
                      <Option value="Lessthan1year">Less than 1 year</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Monthly Gross Salary"}
                      name="c2salariedMonthlyGrossSalary"
                      component={TextBox}
                      placeholder="Enter Monthly Gross"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      onChange={this.salariedhandleMonthlySalary}
                      validate={[
                        A8V.required({ errorMsg: "MonthlyGrossSalary is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Monthly Fixed Obligation"}
                      name="c2salariedMonthlyFixedObligation"
                      component={TextBox}
                      placeholder="Enter Monthly Obligation"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      onChange={this.handlemonthlyObligationSalaried}
                      validate={[
                        A8V.required({ errorMsg: "MonthlyFixedObligation is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Gross Annual Income"}
                      name="c2salariedGrossAnnualIncome"
                      component={TextBox}
                      placeholder="Enter Annual Income"
                      // normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: "GrossAnnualIncome is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Net Annual Income"}
                      name="c2salariedNetAnnualIncome"
                      component={TextBox}
                      placeholder="Enter Net Income"
                      // normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: "NetAnnualIncome is required" }),
                      ]}
                    />
                  </div>
                  {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Monthly Surplus"}
                      name="c2salariedMonthlySurplus"
                      component={TextBox}
                      placeholder="Enter Monthly Surplus"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: "MonthlySurplus is required" }),
                      ]}
                    />
                  </div> */}
                </React.Fragment>
                }

                {/* if business */}

                {
                  this.state.c2showBusinessFields && <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Business"
                        name="c2BusinessType"
                        component={Select}
                        placeholder="Select Business Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "BusinessType is required" }),
                        ]}
                      >
                        <Option value="Manufacturing">Manufacturing</Option>
                        <Option value="Services">Services</Option>
                        <Option value="Trade">Trade</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Business Name"}
                        name="c2BusinessName"
                        component={TextBox}
                        placeholder="Enter Business Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.maxLength({ errorMsg: "Business Name must be 40 or less", max: 40 }),
                          A8V.required({ errorMsg: "BusinessName is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Constitution"
                        name="c2Constitution"
                        component={Select}
                        placeholder="Select Constitution"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Constitution is required" }),
                        ]}
                      >
                        <Option value="Proprietorship">Proprietorship</Option>
                        <Option value="Partnership">Partnership</Option>
                        <Option value="Individual">Individual</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business Structure"
                        name="c2BusinessStructure"
                        component={Select}
                        placeholder="Select Business Structure"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "BusinessStructure is required" }),
                        ]}
                      >
                        <Option value="HomeBased">Home Based</Option>
                        <Option value="FixedShop">Fixed Shop</Option>
                        <Option value="MobilityShop">Mobility Shop</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business model"
                        name="c2BusinessModel"
                        component={Select}
                        placeholder="Select Business model"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "BusinessModel is required" }),
                        ]}
                      >
                        <Option value="Micro">Micro</Option>
                        <Option value="Small">Small</Option>
                        <Option value="Medium">Medium</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="When was the business started"
                        name="c2BusinessStartDate"
                        component={DatePicker}
                        placeholder="Select start date"
                        selected={this.state.startDate}
                        onChange={this.handleBusinessStartDate}
                        validate={[
                          A8V.required({ errorMsg: "BusinessStartDate is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Age of Business"}
                        name="c2BusinessAge"
                        component={TextBox}
                        placeholder="Enter Business Age"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "BusinessAge is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Number of employees"}
                        name="c2businessEmployeeCount"
                        component={TextBox}
                        placeholder="Enter Employee Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "EmployeeCount is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Total Years of Experience in Current Business"
                        name="c2CurrentBusinessExp"
                        component={Select}
                        placeholder="Select Current Experience"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "CurrentBusinessExp is required" }),
                        ]}
                      >
                        <Option value="10yearsandAbove">10 years and above</Option>
                        <Option value="Between5to10years">Between 5 to 10 years</Option>
                        <Option value="Between2to3years">Between 2 to 3 years</Option>
                        <Option value="Between1to2years">Between 1 to 2 years</Option>
                        <Option value="Lessthan1year">Less than 1 year</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Annual Turnover"
                        name="c2businessAnnualTurnover"
                        component={Select}
                        placeholder="Select Annual Turnover"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "AnnualTurnover is required" }),
                        ]}
                      >
                        <Option value="ZerotoFiveLac">0-5 Lac</Option>
                        <Option value="FivtoTenLac">5-10 Lac</Option>
                        <Option value="TentoTwentyFiveLac">10-25 Lac</Option>
                        <Option value="TwentyFivetoFiftyLac">25-50 Lac</Option>
                        <Option value="FiftytoOneCr">50-1 Cr</Option>
                        <Option value="OnetoFiveCr">1-5 Cr</Option>
                        <Option value="MoreThanFiveCr">{`>5 Cr`}</Option>
                      </Field>
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Family Members"}
                        name="c2FamilyMemberCount"
                        component={TextBox}
                        placeholder="Enter FamilyMember Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "FamilyMemberCount is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Dependent"}
                        name="c2DependentCount"
                        component={TextBox}
                        placeholder="Enter Dependent Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "DependentCount is required" }),
                        ]}
                      />
                    </div> */}
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="c2businessMonthlyGrossSalary"
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.businesshandleMonthlySalary}
                        validate={[
                          A8V.required({ errorMsg: "MonthlyGrossSalary is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Fixed Obligation"}
                        name="c2MonthlyFixedObligation"
                        component={TextBox}
                        placeholder="Enter Monthly Obligation"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handlemonthlyObligationBusiness}
                        validate={[
                          A8V.required({ errorMsg: "MonthlyFixedObligation is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Gross Annual Income"}
                        name="c2businessGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        // normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "GrossAnnualIncome is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="c2businessNetAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        // normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "NetAnnualIncome is required" }),
                        ]}
                      />
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Surplus"}
                        name="c2businessMonthlySurplus"
                        component={TextBox}
                        placeholder="Enter Monthly Surplus"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "MonthlySurplus is required" }),
                        ]}
                      />
                    </div> */}
                  </React.Fragment>
                }

                {/* if others */}

                {
                  this.state.c2showOthersFields && <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="c2JobType"
                        component={Select}
                        placeholder="Select Job Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "JobType is required" }),
                        ]}
                      >
                        <Option value="SelfEmployed">Self Employed</Option>
                        <Option value="Wages">Wages</Option>
                        <Option value="Employedlocally??">Employed locally??</Option>

                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="TotalYears of Experience in Current job"
                        name="c2ExperienceCurrentJob"
                        component={Select}
                        placeholder="Select Occupation Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "ExperienceCurrentJob is required" }),
                        ]}
                      >
                        <Option value="10yearsandAbove">10 years and above</Option>
                        <Option value="Between5to10years">Between 5 to 10 years</Option>
                        <Option value="Between2to3years">Between 2 to 3 years</Option>
                        <Option value="Between1to2years">Between 1 to 2 years</Option>
                        <Option value="Lessthan1year">Less than 1 year</Option>
                      </Field>
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Family Members"}
                        name="c2FamilyMemberCount"
                        component={TextBox}
                        placeholder="Enter Family member Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "FamilyMemberCount is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Dependent"}
                        name="c2DependentCount"
                        component={TextBox}
                        placeholder="Enter Dependent Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "DependentCount is required" }),
                        ]}
                      />
                    </div> */}
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Daily Income"}
                        name="c2othersDailyIncome"
                        component={TextBox}
                        placeholder="Enter Daily Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handleDailyIncomeChange}
                        validate={[
                          A8V.required({ errorMsg: "DailyIncome is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Average no. of working days"}
                        name="c2othersWorkingDayCount"
                        component={TextBox}
                        placeholder="Enter WorkingDay Count"
                        normalize={proceedNumber}
                        onChange={this.handleDayCount}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "WorkingDayCount is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="c2othersGrossMonthlyIncome"
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "MonthlyGrossSalary is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Fixed Obligation"}
                        name="c2othersMonthlyFixedObligation"
                        component={TextBox}
                        placeholder="Enter Monthly Obligation"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handlemonthlyObligationOthers}
                        validate={[
                          A8V.required({ errorMsg: "MonthlyFixedObligation is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="c2NetAnnualIncomeOthers"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        // normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "NetAnnualIncome is required" }),
                        ]}
                      />
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Surplus"}
                        name="c2othersMonthlySurplus"
                        component={TextBox}
                        placeholder="Enter Monthly Surplus"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "MonthlySurplus is required" }),
                        ]}
                      />
                    </div> */}
                  </React.Fragment>
                }
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant ExtraOrdinary Expense"
              sectionKey="c2applicantExtraOrdinaryExpense"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <FieldArray name="members" component={renderExpenseMembers} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="FOIR Calculation"
              sectionKey="c2foirCalculation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                {this.state.c2showFoirProgress &&
                  <div>
                    {this.state.c2foirValue > 60 &&
                      <Result
                        icon={<Icon type="like" theme="twoTone" />}
                        title="Great, We are ready to proceed with CRIF!"
                      />}
                    {this.state.c2foirValue < 60 &&
                      <Result
                        icon={<Icon type="dislike" theme="twoTone" />}
                        title="Oops, Not Eligible to proceed with CRIF!"
                      />}
                  </div>
                }
                {this.state.c2showFoirButton &&
                  <div className="form-group col-xs-6 col-md-4" >
                    <Button className="api-button" type='danger' size='default' style={{ marginTop: 29 }}
                      onClick={() => this.handleFoirCalculation()}>
                      Calcuate FOIR </Button>
                  </div>
                }

              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Banking History with ESAF "
              sectionKey="c2applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant banking with ESAF?"
                    name="c2ESAFCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.esafCustomerChange}
                    validate={[
                      A8V.required({ errorMsg: "ESAFCustomer is required" }),
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c2showESAFCustomer && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Branch Name"}
                      name="c2BranchName"
                      component={TextBox}
                      placeholder="Enter BranchName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"IFSCCode"}
                      name="c2IFSCCode"
                      component={TextBox}
                      placeholder="Enter IFSCCode(CASE-SENSITIVE)"
                      onChange={this.handleIFSCcode}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Banking since"
                      name="c2BankingHistory"
                      component={Select}
                      placeholder="Select Banking History"
                      className="a8Select"
                    >
                      <Option value="<1 year">Less than 1 year</Option>
                      <Option value="1-2 years">1-2 years</Option>
                      <Option value="2-3 years">2-3 years</Option>
                      <Option value="3-5 years">3-5 years</Option>
                      <Option value=">5 years">Greater than 5 years</Option>
                    </Field>
                  </div>
                </React.Fragment>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="References Information"
              sectionKey="c2ReferencesInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="form-group col-xs-12 col-md-12">
                <label><strong>REFERENCE 1</strong></label>
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Name"}
                      name="c2ReferenceName_1"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceName_1 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Address"}
                      name="c2ReferenceAddress_1"
                      component={TextBox}
                      placeholder="Enter ReferenceAddress"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Mobile"}
                      name="c2ReferenceMobile_1"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceMobile_1 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Reference_1 Type"
                      name="c2ReferenceType_1"
                      component={Select}
                      placeholder="Select Reference Type"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Reference Type is required" }),
                      ]}
                    >
                      <Option value="General">General</Option>
                      <Option value="Business">Business</Option>
                    </Field>
                  </div>
                </div>
              </div>
              <div className="form-group col-xs-12 col-md-12">
                <label><strong>REFERENCE 2</strong></label>
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_2 Name"}
                      name="c2ReferenceName_2"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceName_2 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_2 Address"}
                      name="c2ReferenceAddress_2"
                      component={TextBox}
                      placeholder="Enter ReferenceAddress"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_2 Mobile"}
                      name="c2ReferenceMobile_2"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceMobile_2 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Reference_2 Type"
                      name="c2ReferenceType_2"
                      component={Select}
                      placeholder="Select Reference Type"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Reference Type is required" }),
                      ]}
                    >
                      <Option value="General">General</Option>
                      <Option value="Business">Business</Option>
                    </Field>
                  </div>
                </div>
              </div>

              {this.c2ShowhiddenFields && <React.Fragment>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Salutation"}
                    name="c2Salutation"
                    component={TextBox}
                    placeholder="Enter ReferenceAddress"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Marital Status"}
                    name="c2maritalStatus"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Date Of Birth"}
                    name="c2dob"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Aadhaar Number"}
                    name="c2AadhaarNumber"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Father Name"}
                    name="c2fathersName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Mother Name"}
                    name="c2mothersName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"House Name"}
                    name="c2HouseName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Street Name"}
                    name="c2StreetName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"City"}
                    name="c2CityName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"District"}
                    name="c2districtName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Pincode"}
                    name="c2pinnCode"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Income Details"}
                    name="c2IncomeDetails"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Employee Number"}
                    name="c2employeeNumber"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
              </React.Fragment>
              }
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Loan-Eligibility details"
              sectionKey="c2loanEligibilityDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Type"
                    name="c2LoanType"
                    component={Select}
                    placeholder="Select Loan Type"
                    onChange={this.loanTypeChange}
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "LoanType is required" }),
                    ]}
                  >
                    {this.state.c2loantypeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                {/*Business Loan */}
                {this.state.c2showBusinessLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Does the business remain open even when you are unavailable"
                      name="c2BusinessAvailability"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({ errorMsg: "BusinessAvailability is required" }),
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="OwnerShip"
                      name="c2OwnerShip"
                      component={Select}
                      placeholder="Select OwnerShip"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "OwnerShip is required" }),
                      ]}
                    >
                      <Option value="Self">Self</Option>
                      <Option value="Father">Father</Option>
                      <Option value="Mother">Mother</Option>
                      <Option value="Son">Son</Option>
                      <Option value="Spouse">Spouse</Option>
                      <Option value="Brother">Brother</Option>
                      <Option value="Sister">Sister</Option>
                      <Option value="Parental Grandparents">Parental Grandparents</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="RelationShip Business"
                      name="c2RelationShipBusiness"
                      component={Select}
                      placeholder="Select RelationShipBusiness"
                      onChange={this.handleRelationShipBusiness}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "RelationShipBusiness is required" }),
                      ]}
                    >
                      <Option value="Director">Director</Option>
                      <Option value="Partner">Partner</Option>
                      <Option value="Proprietor">Proprietor</Option>
                      <Option value="Others">Others</Option>
                    </Field>
                  </div>
                  {this.state.c2RelationShipBusinessOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="c2RelationShipBusinessOthers"
                        component={TextBox}
                        placeholder="Enter Others"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  }
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Business Registration Type"
                      name="c2BusinessRegistrationType"
                      component={Select}
                      placeholder="Select BusinessRegistrationType"
                      onChange={this.handleRegistrationTypeOthers}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "BusinessRegistrationType is required" }),
                      ]}
                    >
                      <Option value="Business Incorporation">Business Incorporation</Option>
                      <Option value="PAN">PAN</Option>
                      <Option value="Income Tax Returns">Income Tax Returns</Option>
                      <Option value="TIN">TIN</Option>
                      <Option value="GST No">GST No</Option>
                      <Option value="Service Tax No">Service Tax No</Option>
                      <Option value="SSI NO">SSI NO</Option>
                    </Field>
                  </div>
                  {this.state.c2RegistrationTypeOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="c2RegistrationTypeOthers"
                        component={TextBox}
                        placeholder="Enter Others"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  }
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Business Address Type"
                      name="c2BusinessAddressType"
                      component={Select}
                      placeholder="Select BusinessAddressType"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "BusinessAddressType is required" }),
                      ]}
                    >
                      <Option value="Registered Address">Registered Address</Option>
                      <Option value="Corporate Address">Corporate Address</Option>
                      <Option value="Current Address">Current Address</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Business Location"
                      name="c2BusinessLocation"
                      component={Select}
                      placeholder="Select BusinessLocation"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "BusinessLoacation is required" }),
                      ]}
                    >
                      <Option value="Pucca shop-own premises">Pucca shop-own premises</Option>
                      <Option value="Own house is the business premises">Own house is the business premises
                      </Option>
                      <Option value="Pucca shop,rented >4 years in the current location">{`Pucca shop,rented >4 years in the current location`}</Option>
                      <Option value="Pucca shop,rented <4 years in the current location and residence within 10 kms">Pucca shop,rented less than 4 years in the current location and residence within 10 kms</Option>
                      <Option value="Pucca shop, rented <4 years in the current location and residence greater than 10 kms">Pucca shop,rented less than 4 years in the current location and residence greater than 10 kms</Option>
                      <Option value="Way side temporary set up">Way side temporary set up</Option>
                      <Option value="Shop On Wall">Shop On Wall</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Property Appreciation Value"
                      name="c2PropertyAppreciationValue"
                      component={Select}
                      placeholder="Select PropertyAppreciationValue"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "PropertyAppreciationValue is required" }),
                      ]}
                    >
                      <Option value="Property has appreciated in last 3 years">Property has appreciated in last 3 years</Option>
                      <Option value="Property has not appreciated in last 3 years">Property has not appreciated in last 3 years</Option>
                      <Option value="Property has depreciated in last 3 years">Property has depreciated in last 3 years</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Address Proof Type"
                      name="c2busAddressProofType"
                      component={Select}
                      placeholder="Select Address Proof Type"
                      onChange={this.handleAddressProofTypeOthers}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Address Proof Type is required" }),
                      ]}
                    >
                      <Option value="Voters ID">Voters ID</Option>
                      <Option value="Ration Card">Ration Card</Option>
                      <Option value="PAssport Valid">Passport Valid</Option>
                      <Option value="BSNL Land Line Bill (Not older than 3 Months)">BSNL Land Line Bill (Not older than 3 Months)</Option>
                    </Field>
                  </div>
                  {this.state.c2AddressProofTypeOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="c2busAddressProofTypeOthers"
                        component={TextBox}
                        placeholder="Enter Others"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  }
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Address ProofNumber"}
                      name="c2busAddressProofNumber"
                      component={TextBox}
                      placeholder="Enter AddressProofNumber"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"House No/Name"}
                      name="c2busHouseNo"
                      component={TextBox}
                      placeholder="Enter HouseName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Street/Area"}
                      name="c2busStreetArea"
                      component={TextBox}
                      placeholder="Enter Street/Area"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"City/Village/Town"}
                      name="c2busCity"
                      component={TextBox}
                      placeholder="Enter City"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Post Office"}
                      name="c2busPostOffice"
                      component={TextBox}
                      placeholder="Enter PostOffice"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "PostOffice is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"District"}
                      name="c2busDistrict"
                      component={TextBox}
                      placeholder="Enter District"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="State"
                      name="c2busState"
                      component={Select}
                      placeholder="Select State"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "State is required" }),
                      ]}
                    >
                      {this.state.c2stateOptions.map(data => (
                        <Option value={data.value}>{data.label}</Option>
                      ))}

                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Pincode"}
                      name="c2busPincode"
                      component={TextBox}
                      placeholder="Enter Pincode"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Land mark"}
                      name="c2busLandMark"
                      component={TextBox}
                      placeholder="Enter LandMark"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Years in Present Address"
                      name="c2busYearsInPresentAddress"
                      component={Select}
                      placeholder="Select YearsInPresentAddress"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "YearsInPresentAddress is required" }),
                      ]}
                    >
                      <Option value=">5 Years">Greater than 5 Years</Option>
                      <Option value=">3 years and <=5 years">Greater than 3 years and less than equalto 5 years</Option>
                      <Option value=">2 years and <=3 years">Greater than 2 years and leass than equal to 3 years</Option>
                      <Option value=">1 years and <=2 years">Greater than 1 year and less than equalto 2 years</Option>
                      <Option value="less than 1 year">Less than 1 year</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Landline Number"}
                      name="c2busLandlineNumber"
                      component={TextBox}
                      placeholder="Enter LandlineNumber"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Mobile Number"}
                      name="c2busMobile"
                      component={TextBox}
                      placeholder="Enter Mobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Location"}
                      name="c2busLocation"
                      component={TextBox}
                      placeholder="Enter Location"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                </React.Fragment>
                }
                {/*Housing Loan */}
                {this.state.c2showHousingLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Property Details"}
                      name="c2PropertyDetails"
                      component={TextBox}
                      placeholder="Enter Property Details"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Total Area"}
                      name="c2TotalArea"
                      component={TextBox}
                      placeholder="Enter TotalArea"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Road Access"
                      name="c2RoadAccess"
                      component={Select}
                      placeholder="Select Road Access"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "RoadAccess is required" }),
                      ]}
                    >
                      <Option value="Two-Wheeler Access">Two-Wheeler Access</Option>
                      <Option value="Three-Wheeler Access">Three-Wheeler Access</Option>
                      <Option value="Four-Wheeler Access">Four-Wheeler Access</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Type of Land"}
                      name="c2LandType"
                      component={TextBox}
                      placeholder="Enter LandType"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                </React.Fragment>
                }
                {/* Vehicle Loan */}
                {this.state.c2showVehicleLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Vehicle Type"
                      name="c2VehicleType"
                      component={Select}
                      placeholder="Select VehicleType"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "VehicleType is required" }),
                      ]}
                    >
                      <Option value="Two-Wheeler">Two-Wheeler</Option>
                      <Option value="Three-Wheeler">Three-Wheeler</Option>
                      <Option value="Four-Wheeler">Four-Wheeler</Option>
                      <Option value="Others(Specify)">Others</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Manufacturer"}
                      name="c2Manufacturer"
                      component={TextBox}
                      placeholder="Enter Manufacturer"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Asset Model"}
                      name="c2AssetModel"
                      component={TextBox}
                      placeholder="Enter AssetModel"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Asset Make"}
                      name="c2AssetMake"
                      component={TextBox}
                      placeholder="Enter AssetMake"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Ex-Showroom Price"}
                      name="c2ExShowroomPrice"
                      component={TextBox}
                      placeholder="Enter ExShowroomPrice"
                      onChange={this.handleShowRoomPrice}
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Road Tax"}
                      name="c2RoadTax"
                      component={TextBox}
                      placeholder="Enter RoadTax"
                      onChange={this.handleRoadTax}
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Insurance Amount"}
                      name="c2InsuranceAmount"
                      component={TextBox}
                      placeholder="Enter InsuranceAmount"
                      onChange={this.handleOnRoadPrice}
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"On Road Price"}
                      name="c2OnRoadPrice"
                      component={TextBox}
                      placeholder="Enter OnRoadPrice"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Asset Owner"
                      name="c2AssetOwner"
                      component={Select}
                      placeholder="Select AssetOwner"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "AssetOwner is required" }),
                      ]}
                    >
                      <Option value="Applicant">Applicant</Option>
                      <Option value="Co-Applicant">Co-Applicant</Option>
                      <Option value="Applicant and Co-Applicant">Applicant and Co-Applicant</Option>
                    </Field>
                  </div>
                </React.Fragment>
                }
                {/* {ESAF Haritha Loan} */}
                {this.state.c2showGreenEnergyLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Asset Type"
                      name="c2AssetType"
                      component={Select}
                      placeholder="Select AssetType"
                      onChange={this.handleAssetType}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "AssetType is required" }),
                      ]}
                    >
                      <Option value="Solar Panel">Solar Panel</Option>
                      <Option value="Solar Invertor">Solar Invertor</Option>
                      <Option value="Others">Others</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Asset Value"}
                      name="c2assetValue"
                      component={TextBox}
                      placeholder="Enter Asset Value"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  {this.state.c2showOthersComments &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Comments"}
                        name="c2Comments"
                        component={TextAreaHelper}
                        placeholder="Enter Comments"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.maxLength({ errorMsg: "Comments must be 40 or less", max: 40 }),
                          A8V.required({ errorMsg: "Comments is required" }),
                        ]}
                      />
                    </div>}
                </React.Fragment>
                }
              </div>
            </div>
          </div>

          {this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Business Loan" &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"BUSSINESS PROOFS"}</h3>
              </div>

              {/** File Uploader */}
              <Field
                label={"Image "} Vehicle Loan
                name="IMAGE"
                component={Scanner}
                docType="IMG"
                imageVar="img"
                taskInfo={this.props.taskInfo}
                a8flowApiUrl={`${Config.baseUrl}`}
                ipc={this.props.ipc}
              />
            </div>
          }
          {((this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Housing") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Loan Against Property") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Micro Housing Loan") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Dream House Loan") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Affordable Housing Loan")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"HOUSING PROOFS(SHOP IMAGES)"}</h3>
              </div>

              {/** File Uploader */}
              <Field
                label={"Image "}
                name="IMAGE"
                component={Scanner}
                docType="IMG"
                imageVar="img"
                taskInfo={this.props.taskInfo}
                a8flowApiUrl={`${Config.baseUrl}`}
                ipc={this.props.ipc}
              />
            </div>
          }
          {((this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Two Wheeler Loan") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Three Wheeler Loan")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"VEHICLE PROOFS"}</h3>
              </div>

              {/** File Uploader */}
              <Field
                label={"Image "}
                name="IMAGE"
                component={Scanner}
                docType="IMG"
                imageVar="img"
                taskInfo={this.props.taskInfo}
                a8flowApiUrl={`${Config.baseUrl}`}
                ipc={this.props.ipc}
              />
            </div>
          }
          {((this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "ESAF Haritha Loan") ||
            (this.props.formValues && this.props.formValues.c2LoanType && this.props.formValues.c2LoanType.value === "Clean Energy Loan")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"HARITHA LOAN PROOFS"}</h3>
              </div>

              {/** File Uploader */}
              <Field
                label={"Image "}
                name="IMAGE"
                component={Scanner}
                docType="IMG"
                imageVar="img"
                taskInfo={this.props.taskInfo}
                a8flowApiUrl={`${Config.baseUrl}`}
                ipc={this.props.ipc}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //get current form values
    formValues: getFormValues("soProcessExisting")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessExisting")(state),
    //taskInfo
    task: state.task
  };
};

export default connect(
  mapStateToProps,
  {}
)(TabCoApplicant2);
