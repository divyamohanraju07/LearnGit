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

class TabGuarantor1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionValidator: {
        g2ApplicantDetails: ["g2ApplicationID", "g2BorrowerType", "g2mobileNumber"],
        g2applicantOtpVerification: [""],
        g2cifCheck: ["g2CustomerAccountNumber"],
        g2applicantBasicEval: ["g2LoanAmount", "g2LoanScheme", "g2ExpectedTenure", "g2EstimatedEMI", "g2TotalMonthlySurplus"],
        g2applicantEmpInfo: ["g2OccupationType"],
        g2applicantExtraOrdinaryExpense: ["ExtraExpenseType", "ExpenseValue", "members"],
        g2foirCalculation: [""],
        g2applicantBankingHistory: ["g2ESAFCustomer"],
        g2ReferencesInfo: ["g2ReferenceName_4", "g2ReferenceName_2", "g2ReferenceMobile_4", "g2ReferenceMobile_2", "g2ReferenceType_4", "g2ReferenceType_2"],
        g2loanEligibilityDetails: ["g2LoanType"],

      },

      g2ifsc: '', g2showESAFCustomer: false, g2disableSangamBranch: true, g2disableMbBranchName: true,
      g2CustomerAccountNumber: '', g2showBusinessLoanFields: false, g2showHousingLoanFields: false,
      g2showVehicleLoanFields: false, g2showGreenEnergyLoanFields: false, g2showOthersComments: false,
      g2response: {}, g2otp: "", g2verifyOTP: '', g2mobileNumber: '', g2otpPinID: '', g2otpSent: false,
      g2showFieldCards: false, g2ShowhiddenFields: false, g2prefix: '', g2maritalStatus: '', g2DOB: '', g2foirValue: '',
      g2aadhaar: '', g2fatherName: '', g2motherName: '', g2houseName: '', g2street: '', g2city: '',
      g2district: '', g2pinCode: '', g2incomeDetails: '', g2employeeNumber: '', g2veh_InsuranceAmount: '',
      g2veh_showRoomPrice: '', g2veh_roadTax: '', g2RelationShipBusinessOthers: false, g2RegistrationTypeOthers: false,
      g2AddressProofTypeOthers: false, g2digit1: '', g2digit2: '', g2digit3: '', g2digit4: '', g2showOTPverification: false,
      g2showSalariedFields: false, g2showBusinessFields: false, g2showOthersFields: false, g2monthlySalary: '',
      g2grossAnnual: '', g2monthlyObligation: '', g2netAnnual: '', g2startDate: '', g2Age: '', g2dayCount: '',
      g2monthlyGross: '', g2annualGross: '', g2loantypeOptions: [], g2stateOptions: [], g2showFoirField: false,
      g2showFoirProgress: false, g2showFoirButton: true, g2buttonLabel: 'Verify', g2loading: false, g2showSuccess: false,
      g2showFailure: false, g2monthlyIncomeOthers: '', g2salObligationValue: '', g2busiObligationValue: '',
      g2othersObligationValue: '', g2CIFbuttonLabel: "CIF Check", g2CIFloading: false, g2cardView: null

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
        g2loantypeOptions: loanTypeDD
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
        g2stateOptions: stateDD
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
        "Data": this.state.g2CustomerAccountNumber
      }
    }
    let cifConfig = {
      url: `${Config.apiUrl}/v1/customerDetailsInquiry`,
      method: 'post',
      data: payload
    }
    axios(cifConfig).then(Response => {
      var data = Response.data;
      this.setState({ g2response: data });
      this.setState({ g2showFieldCards: true });
      this.setState({ g2ShowhiddenFields: true });
      this.mapSections();
    })
  }

  mapSections = () => {
    try {
      var cifResponse = this.state.g2response;
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
      this.setState({ g2cardView: cardView })

    } catch (error) {
      throw error;
    }
  }


  MbCustomerChange = (e) => {
    if (e.value === "Yes") {
      this.setState({
        g2disableSangamBranch: false,
        g2disableMbBranchName: false
      });
    } else {
      this.setState({
        g2disableSangamBranch: true,
        g2disableMbBranchName: true
      });
      this.props.fieldPopulator("g2SangamBranch", "");
      this.props.fieldPopulator("g2MBBranchName", "");
    }
  }

  esafCustomerChange = (e) => {
    if (e.value === "Yes") {
      this.setState({ g2showESAFCustomer: true });
    } else if (e.value === "No") {
      this.setState({ g2showESAFCustomer: false });
    }
  }
  handleIFSCcode = (e) => {
    let code = e.value;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null
      if (status === true) {
        this.setState({ g2ifsc: code });
      } else {
        alert("IFSC code doesn't match")
      }
    }
  }

  handleAccountNumber = value => {
    let enteredValue = value.value
    let accountNumber = enteredValue
    if (accountNumber.length > 12) {
      message.error("Please check your CIF Account Number");
    }
    this.setState({ g2CustomerAccountNumber: enteredValue });
  };

  handleNumberChange = (e) => {
    let mobNo = e.value;
    this.setState({ g2mobileNumber: mobNo });
  }
  handleSendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/sendOtp`,
      "method": 'post',
      "data": {
        mobile: '91' + this.state.g2mobileNumber,
      }
    }
    this.setState({ g2loading: true });
    axios(config).then(response => {
      var pinID = response.data.pinId;
      if (response.data.smsStatus === "MESSAGE_SENT") {
        this.setState({ g2otpSent: true, })
        this.setState({ g2showOTPverification: true })
      }
      this.setState({ g2otpPinID: pinID, g2loading: false, g2buttonLabel: "Resend", g2showSuccess: true, g2showFailure: false })
    }, () => {
      this.setState({ g2loading: false, g2buttonLabel: "Resend", g2showSuccess: false, g2showFailure: true });
    })
  }
  handleResendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/resendOtp`,
      "method": 'post',
      "data": {
        mobile: '91' + this.state.g2mobileNumber
      }
    }
    this.setState({ loading: true });
    axios(config).then(response => {
      var resendpinID = response.data.pinId;
      this.setState({ g2otpPinID: resendpinID, g2otpSent: true, g2loading: false, g2buttonLabel: "Resend", g2showSuccess: true })
    }, () => {
      this.setState({ g2loading: false, g2buttonLabel: "Resend", g2showSuccess: false, g2showFailure: true })
    })
  }
  handleOtpNumber = (otp) => {
    let otpValue = otp
    this.setState({ g2otp: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      "method": 'post',
      "data": {
        otp: otpValue,
        pin_id: this.state.g2otpPinID
      }
    }
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ g2verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          alert("OTP Verified Successfully")
        } else if (response.data.verified === false) {
          alert("OTP Verification Failed")
        }
      })
    } else {
      console.log("hit in first instance")
    }
  }
  onchangeOtp = (otp) => {
    // for ui warning manipulation
  }

  handleShowRoomPrice = (value) => {
    let enteredValue = value.value
    let price = enteredValue.replace(/,/g, "");
    this.setState({ g2veh_showRoomPrice: price })
    if (this.props.formValues.g2RoadTax && this.props.formValues.g2InsuranceAmount) {
      let veh_tax = this.state.g2veh_roadTax
      let veh_insAmt = this.state.g2veh_InsuranceAmount;
      let veh_onroadprice = parseInt(price) + parseInt(veh_tax) + parseInt(veh_insAmt);
      let orp = { type: "String", value: this.displayINRformat(veh_onroadprice) }
      this.props.fieldPopulator("g2OnRoadPrice", orp)
    }
  }
  handleRoadTax = (value) => {
    let enteredValue = value.value
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ g2veh_roadTax: tax })
    if (this.props.formValues.g2ExShowroomPrice && this.props.formValues.g2InsuranceAmount) {
      let veh_insAmount = this.state.g2veh_InsuranceAmount;
      let veh_Price = this.state.g2veh_showRoomPrice;
      let veh_onRoadPrice = parseInt(tax) + parseInt(veh_insAmount) + parseInt(veh_Price)
      let orp = { type: "String", value: this.displayINRformat(veh_onRoadPrice) }
      this.props.fieldPopulator("g2OnRoadPrice", orp)
    }
  }

  handleOnRoadPrice = (value) => {
    let enteredValue = value.value
    let insAmount = enteredValue.replace(/,/g, "");
    this.setState({ g2veh_InsuranceAmount: insAmount }, () => { });
    let showRoomPrice = this.state.g2veh_showRoomPrice;
    let roadTax = this.state.g2veh_roadTax;
    let onRoadPrice = parseInt(showRoomPrice) + parseInt(roadTax) + parseInt(insAmount);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) }
    this.props.fieldPopulator("g2OnRoadPrice", orp)
  }
  handleRelationShipBusiness = (value) => {
    if (value.value === 'Others') {
      this.setState({ g2RelationShipBusinessOthers: true })
    }
  }

  handleRegistrationTypeOthers = (value) => {
    if (value.value === 'Others') {
      this.setState({ g2RegistrationTypeOthers: true })
    }
  }

  handleAddressProofTypeOthers = (value) => {
    if (value.value === 'Others') {
      this.setState({ g2AddressProofTypeOthers: true })
    }
  }

  loanTypeChange = (value) => {
    if (value.value === "Business Loan") {
      this.setState({
        g2showBusinessLoanFields: true,
        g2showHousingLoanFields: false,
        g2showVehicleLoanFields: false,
        g2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "Micro Housing Loan" ||
      value.value === "Loan Against Property" ||
      value.value === "Dream House Loan" ||
      value.value === "Affordable Housing Loan") {
      this.setState({
        g2showBusinessLoanFields: false,
        g2showHousingLoanFields: true,
        g2showVehicleLoanFields: false,
        g2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "Two Wheeler Loan" || value.value === "Three Wheeler Loan") {
      this.setState({
        g2showBusinessLoanFields: false,
        g2showHousingLoanFields: false,
        g2showVehicleLoanFields: true,
        g2showGreenEnergyLoanFields: false
      });
    } else if (value.value === "ESAF Haritha Loan" || value.value === "Clean Energy Loan") {
      this.setState({
        g2showBusinessLoanFields: false,
        g2showHousingLoanFields: false,
        g2showVehicleLoanFields: false,
        g2showGreenEnergyLoanFields: true
      });
    }
  }

  handleAssetType = (value) => {
    if (value.value === "Others") {
      this.setState({ g2showOthersComments: true });
    } else if (value.value !== "Others") {
      this.setState({ g2showOthersComments: false })
    }
  }

  handleOccupationType = (value) => {
    if (value && value.value === "Salaried") {
      this.setState({ g2showSalariedFields: true, g2showBusinessFields: false, g2showOthersFields: false });
    } else if (value && value.value === "Business") {
      this.setState({ g2showSalariedFields: false, g2showBusinessFields: true, g2showOthersFields: false });
    } else if (value && value.value === "Others") {
      this.setState({ g2showSalariedFields: false, g2showBusinessFields: false, g2sshowOthersFields: true, });
    }
  }
  handleFoirCalculation = () => {
    let i;
    if (this.props.formValues.g2OccupationType && this.props.formValues.g2OccupationType.value === "Salaried") {
      let Foirobligation = this.props.formValues.g2salariedMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.g2salariedMonthlyGrossSalary.value
      let membertotalFoir;
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let salariedMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(salariedMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ g2foirValue: membertotalFoir });
      }
      this.setState({ g2showFoirButton: false, g2showFoirProgress: true })
    }
    if (this.props.formValues.g2OccupationType && this.props.formValues.g2OccupationType.value === "Business") {
      let Foirobligation = this.props.formValues.g2businessMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.g2businessMonthlyGrossSalary.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let businessMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(businessMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ g2foirValue: membertotalFoir });
      }
      this.setState({ g2showFoirButton: false, g2showFoirProgress: true })
    }
    if (this.props.formValues.g2OccupationType && this.props.formValues.g2OccupationType.value === "Others") {
      let Foirobligation = this.props.formValues.g2othersMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.g2othersMonthlyGrossSalary.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let OthersMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(OthersMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ g2foirValue: membertotalFoir });
      }
      this.setState({ g2showFoirButton: false, g2showFoirProgress: true })
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

    this.setState({ g2startDate: date, g2Age: age });
    this.props.fieldPopulator("g2BusinessAge", age);
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
    if (!this.props.formValues.g2salariedMonthlyFixedObligation) {
      this.setState({ g2salariedAnnualIncome: salariedGross })
      this.props.fieldPopulator("g2salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.g2salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.g2salObligationValue;
      let netIncome = this.displayINRformat(salariedGross.replace(/,/g, "") - (salariedObligationValue * 12))
      let net = { type: "String", value: netIncome }
      this.props.fieldPopulator("g2salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("g2salariedNetAnnualIncome", net);
    }
  }
  handlemonthlyObligationSalaried = (value) => {
    let enteredValue = value.value
    let salariedObligation = enteredValue.replace(/,/g, "");
    this.setState({ g2salObligationValue: salariedObligation })
    let salariedGrossAnnual = this.props.formValues.g2salariedGrossAnnualIncome.value;
    let salariednetIncome = this.displayINRformat(salariedGrossAnnual.replace(/,/g, "") - (salariedObligation * 12))
    let net = { type: "String", value: salariednetIncome }
    this.props.fieldPopulator("g2salariedNetAnnualIncome", net)
  }
  businesshandleMonthlySalary = (value) => {
    let enteredValue = value.value
    let businessmonthly = enteredValue.replace(/,/g, "");
    let businessGross = this.displayINRformat(businessmonthly.replace(/,/g, "") * 12);
    let gross = { type: "String", value: businessGross }
    this.props.fieldPopulator("g2businessGrossAnnualIncome", gross);
    if (this.props.formValues.g2businessMonthlyFixedObligation) {
      let businessObligation = this.state.g2busiObligationValue
      let netIncomeBusiness = this.displayINRformat(businessGross.replace(/,/g, "") - (businessObligation * 12))
      let net = { type: "String", value: netIncomeBusiness }
      this.props.fieldPopulator("g2businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("g2businessNetAnnualIncome", net)
    }
  }
  handlemonthlyObligationBusiness = (value) => {
    let enteredValue = value.value
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ g2busiObligationValue: businessObligation })
    let businessGrossAnnual = this.props.formValues.g2businessGrossAnnualIncome
    let businessnetIncome = this.displayINRformat(businessGrossAnnual.replace(/,/g, "") - (businessObligation * 12));
    let net = { type: "String", value: businessnetIncome }
    this.props.fieldPopulator("g2businessNetAnnualIncome", net);
  }
  handlemonthlyObligationOthers = (value) => {
    let enteredValue = value.value
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ g2othersObligationValue: othersObligation })
    let othersGrossMonthly = this.props.formValues.g2othersGrossMonthlyIncome
    let othersGrossAnnualIncome = (othersGrossMonthly.replace(/,/g, "") * 12);
    let othersnetIncome = this.displayINRformat(othersGrossAnnualIncome - (othersObligation * 12));
    let net = { type: "String", value: othersnetIncome }
    this.props.fieldPopulator("g2NetAnnualIncomeOthers", net);
  }
  handleDailyIncomeChange = (value) => {
    let enteredValue = value.value
    let OthersdailyIncome = enteredValue.replace(/,/g, "");
    let values = { type: "String", value: "" }
    this.setState({ g2monthlyIncomeOthers: OthersdailyIncome })
    if (!this.props.formValues.g2othersWorkingDayCount) {
      this.props.fieldPopulator("g2othersGrossMonthlyIncome", values)
    } else {
      let daycountValue = this.props.formValues.g2othersWorkingDayCount;
      let MonthlyGross = this.displayINRformat(OthersdailyIncome * daycountValue);
      let gross = { type: "String", value: MonthlyGross }
      let obligationOthers = this.state.g2othersObligationValue
      let othersGrossAnnual = (MonthlyGross * 12);
      let othersnetIncome = this.displayINRformat(othersGrossAnnual - (obligationOthers * 12));
      let net = { type: "String", value: othersnetIncome }
      this.props.fieldPopulator("g2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("g2NetAnnualIncomeOthers", net)
    }
  }
  handleDayCount = (value) => {
    let enteredValue = value.value
    let dayCount = enteredValue
    let MonthlyGrossIncome = this.displayINRformat(this.props.formValues.g2othersDailyIncome.value.replace(/,/g, "") * dayCount);
    let gross = { type: "String", value: MonthlyGrossIncome }
    if (!this.props.formValues.g2othersMonthlyFixedObligation) {
      this.props.fieldPopulator("g2othersGrossMonthlyIncome", gross);
    } else {
      let obliqothr = this.props.formValues.g2othersMonthlyFixedObligation.value.replace(/,/g, "")
      let annualIncomeOthers = MonthlyGrossIncome * 12
      let netAnnualOthers = this.displayINRformat(annualIncomeOthers - (obliqothr * 12))
      let net = { type: "String", value: netAnnualOthers }
      this.props.fieldPopulator("g2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("g2NetAnnualIncomeOthers", net)
    }
  }


  render() {

    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-4-lead"
        >
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Details"
              sectionKey="g2ApplicantDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant ID"}
                    name="g2ApplicationID"
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
                    name="g2BorrowerType"
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
                    name="g2mobileNumber"
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
                    buttonLabel={this.state.g2buttonLabel}
                    isButtonLoading={this.state.g2loading}
                    showSuccesIcon={this.state.g2showSuccess}
                    showFailureIcon={this.state.g2showFailure}
                    onButtonClick={() => { this.state.g2buttonLabel === "Verify" ? this.handleSendApi() : this.handleResendApi() }}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.state.g2showOTPverification &&
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
                      mobileNumber={this.props.formValues.g2mobileNumber}
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
              sectionKey="g2cifCheck"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-6">
                  <Field
                    label={"Account Number"}
                    name="g2CustomerAccountNumber"
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
                    buttonLabel={this.state.g2CIFbuttonLabel}
                    isButtonLoading={this.state.g2CIFloading}
                    onButtonClick={() => { this.handleCIFCheck() }}
                  />
                </div>
                {this.state.g2showFieldCards &&
                  <div className="form-group col-xs-12 col-md-12">
                    {
                      this.state.g2cardView &&
                      <AccountDetailsView
                        accountDetails={this.state.g2cardView}
                      />
                    }
                  </div>}

              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Basic Evaluation"
              sectionKey="g2applicantBasicEval"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="g2LoanAmount"
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
                    name="g2LoanScheme"
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
                    name="g2ExpectedTenure"
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
                    name="g2EstimatedEMI"
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
                    name="g2TotalMonthlySurplus"
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
                    name="g2repaymentFrequency"
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
              sectionKey="g2applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Occupation Type"
                    name="g2OccupationType"
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

                {this.state.g2showSalariedFields && <React.Fragment>

                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Type of Job"
                      name="g2salariedTypeofJob"
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
                      name="g2salariedExperienceCurrentJob"
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
                  {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"No. of Family Members"}
                      name="g2FamilyMemberCount"
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
                      name="g2DependentCount"
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
                      name="g2salariedMonthlyGrossSalary"
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
                      name="g2MonthlyFixedObligation"
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
                      name="g2salariedGrossAnnualIncome"
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
                      name="g2salariedNetAnnualIncome"
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
                      name="g2salariedMonthlySurplus"
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
                  this.state.g2showBusinessFields && <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Business"
                        name="g2BusinessType"
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
                        name="g2BusinessName"
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
                        name="g2Constitution"
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
                        name="g2BusinessStructure"
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
                        name="g2BusinessModel"
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
                        name="g2BusinessStartDate"
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
                        name="g2BusinessAge"
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
                        name="g2businessEmployeeCount"
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
                        name="g2CurrentBusinessExp"
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
                        name="g2businessAnnualTurnover"
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
                        name="g2FamilyMemberCount"
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
                        name="g2DependentCount"
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
                        name="g2businessMonthlyGrossSalary"
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
                        name="g2businessMonthlyFixedObligation"
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
                        name="g2businessGrossAnnualIncome"
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
                        name="g2businessNetAnnualIncome"
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
                        name="g2businessMonthlySurplus"
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
                  this.state.g2showOthersFields && <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="g2JobType"
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
                        name="g2ExperienceCurrentJob"
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
                        name="g2FamilyMemberCount"
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
                        name="g2DependentCount"
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
                        name="gothers2DailyIncome"
                        component={TextBox}
                        placeholder="Enter Daily Income"
                        normalize={inrFormat}
                        hasFeedback
                        onChange={this.handleDailyIncomeChange}
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "DailyIncome is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Average no. of working days"}
                        name="g2othersWorkingDayCount"
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
                        name="g2pthersGrossMonthlyIncome"
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
                        name="g2othersMonthlyFixedObligation"
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
                        name="g2NetAnnualIncomeOthers"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        normalize={inrFormat}
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
                        name="g2othersMonthlySurplus"
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
              sectionKey="g2applicantExtraOrdinaryExpense"
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
              sectionKey="g2foirCalculation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                {this.state.g2showFoirProgress &&
                  <div>
                    {this.state.g2foirValue > 60 &&
                      <Result
                        icon={<Icon type="like" theme="twoTone" />}
                        title="Great, We are ready to proceed with CRIF!"
                      />}
                    {this.state.g2foirValue < 60 &&
                      <Result
                        icon={<Icon type="dislike" theme="twoTone" />}
                        title="Oops, Not Eligible to proceed with CRIF!"
                      />}
                  </div>
                }
                {this.state.g2showFoirButton &&
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
              sectionKey="g2applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant banking with ESAF?"
                    name="g2ESAFCustomer"
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
                {this.state.g2showESAFCustomer && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Branch Name"}
                      name="g2BranchName"
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
                      name="g2IFSCCode"
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
                      name="g2BankingHistory"
                      component={Select}
                      placeholder="Select Banking History"
                      className="a8Select"
                    >
                      <Option value="<4 year">Less than 4 year</Option>
                      <Option value="4-2 years">4-2 years</Option>
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
              sectionKey="g2ReferencesInfo"
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
                      name="g2ReferenceName_1"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceName_4 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Address"}
                      name="g2ReferenceAddress_1"
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
                      name="g2ReferenceMobile_1"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "ReferenceMobile_4 is required" }),
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Reference_1 Type"
                      name="g2ReferenceType_1"
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
                      name="g2ReferenceName_2"
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
                      name="g2ReferenceAddress_2"
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
                      name="g2ReferenceMobile_2"
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
                      name="g2ReferenceType_2"
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

              {this.g2ShowhiddenFields && <React.Fragment>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Salutation"}
                    name="g2Salutation"
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
                    name="g2maritalStatus"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Date Of Birth"}
                    name="g2dob"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Aadhaar Number"}
                    name="g2AadhaarNumber"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Father Name"}
                    name="g2fathersName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Mother Name"}
                    name="g2mothersName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"House Name"}
                    name="g2HouseName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Street Name"}
                    name="g2StreetName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"City"}
                    name="g2CityName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"District"}
                    name="g2districtName"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Pincode"}
                    name="g2pinnCode"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Income Details"}
                    name="g2IncomeDetails"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Employee Number"}
                    name="g2employeeNumber"
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
              sectionKey="g2loanEligibilityDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" >
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Type"
                    name="g2LoanType"
                    component={Select}
                    placeholder="Select Loan Type"
                    onChange={this.loanTypeChange}
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "LoanType is required" }),
                    ]}
                  >
                    {this.state.g2loantypeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                {/*Business Loan */}
                {this.state.g2showBusinessLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Does the business remain open even when you are unavailable"
                      name="g2BusinessAvailability"
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
                      name="g2OwnerShip"
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
                      name="g2RelationShipBusiness"
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
                  {this.state.g2RelationShipBusinessOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="g2RelationShipBusinessOthers"
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
                      name="g2BusinessRegistrationType"
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
                  {this.state.g2RegistrationTypeOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="g2RegistrationTypeOthers"
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
                      name="g2BusinessAddressType"
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
                      name="g2BusinessLocation"
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
                      <Option value="Pucca shop,rented <4 years in the current location and residence within 40 kms">Pucca shop,rented less than 4 years in the current location and residence within 40 kms</Option>
                      <Option value="Pucca shop, rented <4 years in the current location and residence greater than 40 kms">Pucca shop,rented less than 4 years in the current location and residence greater than 40 kms</Option>
                      <Option value="Way side temporary set up">Way side temporary set up</Option>
                      <Option value="Shop On Wall">Shop On Wall</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Property Appreciation Value"
                      name="g2PropertyAppreciationValue"
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
                      name="g2busAddressProofType"
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
                  {this.state.g2AddressProofTypeOthers &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Others"}
                        name="g2busAddressProofTypeOthers"
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
                      name="g2busAddressProofNumber"
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
                      name="g2busHouseNo"
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
                      name="g2busStreetArea"
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
                      name="g2busCity"
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
                      name="g2busPostOffice"
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
                      name="g2busDistrict"
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
                      name="g2busState"
                      component={Select}
                      placeholder="Select State"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "State is required" }),
                      ]}
                    >
                      {this.state.g2stateOptions.map(data => (
                        <Option value={data.value}>{data.label}</Option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Pincode"}
                      name="g2busPincode"
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
                      name="g2busLandMark"
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
                      name="g2busYearsInPresentAddress"
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
                      <Option value=">4 years and <=2 years">Greater than 4 year and less than equalto 2 years</Option>
                      <Option value="less than 4 year">Less than 4 year</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Landline Number"}
                      name="g2LbusandlineNumber"
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
                      name="g2busMobile"
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
                      name="g2busLocation"
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
                {this.state.g2showHousingLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Property Details"}
                      name="g2PropertyDetails"
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
                      name="g2TotalArea"
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
                      name="g2RoadAccess"
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
                      name="g2LandType"
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
                {this.state.g2showVehicleLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Vehicle Type"
                      name="g2VehicleType"
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
                      name="g2Manufacturer"
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
                      name="g2AssetModel"
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
                      name="g2AssetMake"
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
                      name="g2ExShowroomPrice"
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
                      name="g2RoadTax"
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
                      name="g2InsuranceAmount"
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
                      name="g2OnRoadPrice"
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
                      name="g2AssetOwner"
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
                {this.state.g2showGreenEnergyLoanFields && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Asset Type"
                      name="g2AssetType"
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
                      name="g2assetValue"
                      component={TextBox}
                      placeholder="Enter Asset Value"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  {this.state.g2showOthersComments &&
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Comments"}
                        name="g2Comments"
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
          {this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Business Loan" &&
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
          {((this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Housing") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Loan Against Property") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Micro Housing Loan") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Dream House Loan") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Affordable Housing Loan")) &&
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
          {((this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Two Wheeler Loan") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Three Wheeler Loan")) &&
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
          {((this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "Clean Energy Loan") ||
            (this.props.formValues && this.props.formValues.g2LoanType && this.props.formValues.g2LoanType.value === "ESAF Haritha Loan")) &&
            < div className="form-section">
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
      </div >
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
)(TabGuarantor1);
