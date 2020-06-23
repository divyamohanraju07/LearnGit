import * as React from "react";
import {
  FormHeadSection,
  inrFormat,
  A8V,
  renderExpenseMembers,
  TextAreaHelper,
  proceedNumber,
  RenderTabs,
  sortAlphabetically,
  TextDropdownGroup,
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
import { Button, Result, Icon, message } from "antd";
import {
  Field,
  FieldArray,
  getFormSyncErrors,
  getFormValues
} from "redux-form";
import axios from "axios";
import * as soProcessExistingTabInfo from "./soProcessExistingTabInfo";
import { connect } from "react-redux";
import validate from "validate.js";
import moment from "moment";
import classname from "classnames";
const { Option } = SelectHelper;

class TabSoProcessExisitng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        ApplicantDetails: ["ApplicationID", "BorrowerType", "mobileNumber"],
        applicantOtpVerification: ["otpmobileNumber", "hiddenOTPStatus"],
        cifCheck: ["CustomerAccountNumber"],
        applicantBasicEval: [
          "LoanAmount",
          "LoanScheme",
          "ExpectedTenure",
          "EstimatedEMI",
          "TotalMonthlySurplus",
          "RepaymentFrequency"
        ],
        applicantEmpInfo: ["OccupationType"],
        applicantExtraOrdinaryExpense: [
          "ExtraExpenseType",
          "ExpenseValue",
          "members"
        ],
        foirCalculation: [""],
        applicantBankingHistory: ["ESAFCustomer"],
        ReferencesInfo: [
          "ReferenceName_1",
          "ReferenceName_2",
          "ReferenceMobile_1",
          "ReferenceMobile_2",
          "ReferenceType_1",
          "ReferenceType_2"
        ],
        loanEligibilityDetails: [
          "LoanType",
          "BusinessAvailability",
          "OwnerShip",
          "RelationShipBusiness",
          "RelationShipBusinessOthers",
          "BusinessRegistrationType",
          "RegistrationTypeOthers",
          "BusinessAddressType",
          "BusinessLocation",
          "PropertyAppreciationValue",
          "AddressProofType",
          "AddressProofTypeOthers",
          "AddressProofNumber",
          "State",
          "Pincode",
          "LandMark",
          "YearsInPresentAddress",
          "Mobile",
          "Location"
        ],
        coBorrowerSelection: [""]
      },

      loantypeOptions: [],
      stateOptions: [],
      showESAFCustomer: false,
      showSalariedFields: false,
      showBusinessFields: false,
      showOthersFields: false,
      disableAadhaarQRCodeScan: false,
      disableBankingHistory: true,
      CustomerAccountNumber: "",
      showBusinessLoanFields: false,
      showHousingLoanFields: false,
      showVehicleLoanFields: false,
      showGreenEnergyLoanFields: false,
      showOthersComments: false,
      veh_InsuranceAmount: '',
      veh_showRoomPrice: '',
      veh_roadTax: '',
      checked: true,
      diabled: false,
      response: {},
      otp: "",
      verifyOTP: "",
      mobileNumber: "",
      otpPinID: "",
      otpSent: false,
      OTP_submit: false,
      showFieldCards: false,
      ShowhiddenFields: false,
      showFoirProgress: false,
      showFoirButton: true,
      prefix: "",
      maritalStatus: "",
      DOB: "",
      aadhaar: "",
      fatherName: "",
      motherName: "",
      houseName: "",
      street: "",
      city: "",
      district: "",
      pinCode: "",
      incomeDetails: "",
      employeeNumber: "",
      RelationShipBusinessOthers: false,
      RegistrationTypeOthers: false,
      AddressProofTypeOthers: false,
      buttonLabel: "Verify",
      CIFbuttonLabel: "CIF Check",
      loading: false,
      CIFloading: false,
      showSuccess: false,
      showFailure: false,
      showOTPverification: false,
      ifsc: "",
      monthlySalary: "",
      grossAnnual: "",
      monthlyObligation: "",
      netAnnual: "",
      startDate: "",
      Age: "",
      dayCount: "",
      monthlyIncomeOthers: '',
      salObligationValue: '',
      busiObligationValue: '',
      othersObligationValue: '',
      foirValue: '',
      renderTabs: new RenderTabs(this.getInitialTabInfo()),
      cardView: null,
    };
  }

  componentDidMount() {
    //loanType Options
    let config = {
      url: `${Config.apiUrl}/v1/loanType`,
      method: "get"
    };
    axios(config)
      .then(response => {
        let loanType = response.data.loantype;
        let loanTypeDD = [];
        for (let iter = 0; iter < loanType.length; iter++) {
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
    //state Options
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
      this.setState({ stateOptions: stateDD });
    }).catch(error => { console.log(error); });

    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.OccupationType);
    }

  }

  handleExpectedTenure = (e) => {
    let Tenure = e.value;
    // let branchCode = this.props.formValues.BranchCode;
    // let loanPurpose = this.props.formValues.LoanPurpose;
    let repaymentconfig = {
      url: `${Config.apiUrl}/v1/repaymentScheduleGeneration`,
      method: "post",
      data:
      {
        "input": {
          "Operation": {
            "_text": "repaymentScheduleGreneration"
          },
          "SessionContext": {
            "Channel": {
              "_text": "AUTO8"
            },
            "ExternalReferenceNo": {
              "_text": "30265678910"
            },
            "SupervisorContext": {
              "UserId": {
                "_text": "AUTONOMOS8"
              },
              "PrimaryPassword": {
                "_text": "V2VsY29tZUAxMjM="
              }
            }
          },
          "AccountNumber": {
            "_text": "999999999999"
          },
          "EndDate": {
            "_text": "01/01/2099"
          },
          "INPUT": {
            "_text": "1160|7301|" + this.props.formValues.LoanAmount.value + "|1MA5|" + Tenure + "|13.33|24|12|1500#12/12/2021~3000#01/01/2024"
          },
          "UserID": {
            "_text": "PD8901"
          },
          "LoggedInUserId": {}
        }
      }
    }
    axios(repaymentconfig)
      .then(response => {
        let RepaymentResponse = response.data.Response.RepaymentDetailsList.Repayment;
        let data = RepaymentResponse.find(function (value) {
          return value.Activity_Description._text === 'Repayment of loan';
        })
        let EMI = data.EMI_Amount._text;
        this.setState({ RepaymentEMIAmount: EMI })
        this.props.fieldPopulator("EstimatedEMI", { type: "String", value: EMI, valueInfo: {} });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleCIFCheck = () => {
    let payload = {
      input: {
        Operation: "customerDetailsInquiry",
        SessionContext: {
          Channel: "AUTO8",
          ExternalReferenceNo: "30265678999",
          SupervisorContext: {
            userID: "AUTONOMOS8",
            PrimaryPassword: "V2VsY29tZUAxMjM="
          }
        },
        Action: "CUSTENQ",
        Data: this.state.CustomerAccountNumber
      }
    };
    let cifConfig = {
      url:
        `${Config.apiUrl}/v1/customerDetailsInquiry`,
      method: "post",
      data: payload
    };
    this.setState({ CIFloading: true })
    axios(cifConfig).then(Response => {
      var data = Response.data;
      this.setState({
        response: data,
        showFieldCards: true,
        CIFloading: false,
        ShowhiddenFields: true
      });
      this.mapSections();
    });
  };
  mapSections = () => {
    try {
      var cifResponse = this.state.response;
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
      this.setState({ cardView: cardView })

    } catch (error) {
      throw error;
    }
  }
  handleAccountNumber = value => {
    let enteredValue = value.value
    let accountNumber = enteredValue
    if (accountNumber.length > 12) {
      message.error("Please check your CIF Account Number");
    }
    this.setState({ CustomerAccountNumber: enteredValue });
  };
  handleNumberChange = (value) => {
    let enteredValue = value.value
    let mobNo = enteredValue;
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null
      if (validate === true) { this.setState({ mobileNumber: mobNo }) }
      else { message.error("Mobile Number doesn't match") }
    }
  }
  handleSendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/sendOtp`,
      method: "post",
      data: {
        mobile: "91" + this.state.mobileNumber
      }
    };
    this.setState({ loading: true });
    axios(config).then(
      response => {
        var pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          this.setState({ otpSent: true });
          this.setState({ showOTPverification: true });
        }
        this.setState({
          otpPinID: pinID,
          loading: false,
          buttonLabel: "Resend",
          showSuccess: true,
          showFailure: false
        });
      },
      () => {
        this.setState({
          loading: false,
          buttonLabel: "Resend",
          showSuccess: false,
          showFailure: true
        });
      }
    );
  };
  handleResendApi = () => {
    let config = {
      url: `${Config.apiUrl}/v1/resendOtp`,
      method: "post",
      data: {
        mobile: "91" + this.state.mobileNumber
      }
    };
    this.setState({ loading: true });
    axios(config).then(
      response => {
        var resendpinID = response.data.pinId;
        this.setState({
          otpPinID: resendpinID,
          otpSent: true,
          loading: false,
          buttonLabel: "Resend",
          showSuccess: true
        });
      },
      () => {
        this.setState({
          loading: false,
          buttonLabel: "Resend",
          showSuccess: false,
          showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let otpValue = otp;
    this.setState({ otp: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      data: {
        otp: otpValue,
        pin_id: this.state.otpPinID
      }
    };
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ OTP_submit: true })
          message.success("OTP Verified Successfully")
        } else if (response.data.verified === false) {
          this.setState({ OTP_submit: true })
          message.error("OTP Verification Failed")
        }
      });
    } else {
      console.log("hit in first instance");
    }
  };
  onchangeOtp = otp => {
    let value = otp;
    this.setState({ otp: value });
    this.setState({ OTP_submit: false })
  };
  handleShowRoomPrice = (value) => {
    let enteredValue = value.value
    let price = enteredValue.replace(/,/g, "");
    this.setState({ veh_showRoomPrice: price })
    if ((this.props.formValues.RoadTax && this.props.formValues.RoadTax.value) && (this.props.formValues.InsuranceAmount && this.props.formValues.InsuranceAmount.value)) {
      let veh_tax = this.state.veh_roadTax
      let veh_insAmt = this.state.veh_InsuranceAmount;
      let veh_onroadprice = parseInt(price) + parseInt(veh_tax) + parseInt(veh_insAmt)
      let orp = { type: "String", value: this.displayINRformat(veh_onroadprice) }
      this.props.fieldPopulator("OnRoadPrice", orp)
    }
  }
  handleRoadTax = (value) => {
    let enteredValue = value.value
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ veh_roadTax: tax })
    if ((this.props.formValues.ExShowroomPrice && this.props.formValues.ExShowroomPrice.value) && (this.props.formValues.InsuranceAmount && this.props.formValues.InsuranceAmount.value)) {
      let veh_insAmount = this.state.veh_InsuranceAmount;
      let veh_Price = this.state.veh_showRoomPrice;
      let veh_onRoadPrice = parseInt(tax) + parseInt(veh_insAmount) + parseInt(veh_Price)
      let orp = { type: "String", value: this.displayINRformat(veh_onRoadPrice) }
      this.props.fieldPopulator("OnRoadPrice", orp)
    }
  }
  handleOnRoadPrice = (value) => {
    let enteredValue = value.value
    let insAmount = enteredValue.replace(/,/g, "");
    this.setState({ veh_InsuranceAmount: insAmount }, () => { });
    let showRoomPrice = this.state.veh_showRoomPrice;
    let roadTax = this.state.veh_roadTax;
    let onRoadPrice = parseInt(showRoomPrice) + parseInt(roadTax) + parseInt(insAmount)
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) }
    this.props.fieldPopulator("OnRoadPrice", orp)
  }
  handleRelationShipBusiness = value => {
    if (value && value.value === "Others") {
      this.setState({ RelationShipBusinessOthers: true });
    }
  };
  handleRegistrationTypeOthers = value => {
    if (value && value.value === "Others") {
      this.setState({ RegistrationTypeOthers: true });
    }
  };
  handleAddressProofTypeOthers = value => {
    if (value && value.value === "Others") {
      this.setState({ AddressProofTypeOthers: true });
    }
  };
  loanTypeChange = value => {
    if (value && value.value === "Business Loan") {
      this.setState({
        showBusinessLoanFields: true, showHousingLoanFields: false,
        showVehicleLoanFields: false, showGreenEnergyLoanFields: false
      });
    } else if ((
      value && value.value === "Micro Housing Loan") ||
      (value && value.value === "Loan Against Property") ||
      (value && value.value === "Dream House Loan") ||
      (value && value.value === "Affordable Housing Loan")) {
      this.setState({
        showBusinessLoanFields: false, showHousingLoanFields: true,
        showVehicleLoanFields: false, showGreenEnergyLoanFields: false
      });
    } else if ((value && value.value === "Two Wheeler Loan") ||
      (value && value.value === "Three Wheeler Loan")) {
      this.setState({
        showBusinessLoanFields: false, showHousingLoanFields: false,
        showVehicleLoanFields: true, showGreenEnergyLoanFields: false
      });
    } else if ((value && value.value === "ESAF Haritha Loan") ||
      (value && value.value === "Clean Energy Loan")) {
      this.setState({
        showBusinessLoanFields: false, showHousingLoanFields: false,
        showVehicleLoanFields: false, showGreenEnergyLoanFields: true
      });
    }
  };
  esafCustomerChange = (e) => {
    if (e.value === "Yes") {
      this.setState({ showESAFCustomer: true });
    } else if (e.value === "No") {
      this.setState({ showESAFCustomer: false });
    }
  }
  handleAssetType = (value) => {
    if (value && value.value === "Others") {
      this.setState({ showOthersComments: true });
    } else {
      this.setState({ showOthersComments: false });
    }
  };
  handleOccupationType = (value) => {
    if (value && value.value === "Salaried") {
      this.setState({
        showSalariedFields: true,
        showBusinessFields: false,
        showOthersFields: false
      });
    } else if (value && value.value === "Business") {
      this.setState({
        showSalariedFields: false,
        showBusinessFields: true,
        showOthersFields: false
      });
    } else if (value && value.value === "Others") {
      this.setState({
        showSalariedFields: false,
        showBusinessFields: false,
        showOthersFields: true
      });
    }
  };
  handleBusinessStartDate = (date) => {
    let selected = moment(date);
    let today = moment(new Date());
    var Duration = moment.duration(selected.diff(today));
    var year = Duration.years()
    var month = Duration.months()
    var day = Duration.days()
    let age = year + "Years" + month + "Months" + day + "Days"
    let value = { type: "String", value: age }
    this.setState({ startDate: date, Age: age });
    this.props.fieldPopulator("BusinessAge", value);
  }
  displayINRformat = entry => {
    var value = entry;
    value = value.toString();
    var lastThree = value.substring(value.length - 3);
    var otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  };
  salariedhandleMonthlySalary = (value) => {
    let enteredValue = value.value
    let salariedmonthly = enteredValue.replace(/,/g, "");
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross }
    if (!this.props.formValues.salariedMonthlyFixedObligation) {
      this.setState({ salariedAnnualIncome: salariedGross })
      this.props.fieldPopulator("salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.salariedMonthlyFixedObligation && this.props.formValues.salariedMonthlyFixedObligation.value) {
      let salariedObligationValue = this.state.salObligationValue;
      let netIncome = this.displayINRformat(salariedGross.replace(/,/g, "") - (salariedObligationValue * 12))
      let net = { type: "String", value: netIncome }
      this.props.fieldPopulator("salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("salariedNetAnnualIncome", net);
    }
  }
  handlemonthlyObligationSalaried = (value) => {
    let enteredValue = value.value
    let salariedObligation = enteredValue.replace(/,/g, "");
    this.setState({ salObligationValue: salariedObligation })
    let salariedGrossAnnual = this.props.formValues.salariedGrossAnnualIncome.value;
    let salariednetIncome = this.displayINRformat(salariedGrossAnnual.replace(/,/g, "") - (salariedObligation * 12))
    let net = { type: "String", value: salariednetIncome }
    this.props.fieldPopulator("salariedNetAnnualIncome", net)
  }
  businesshandleMonthlySalary = (value) => {
    let enteredValue = value.value
    let businessmonthly = enteredValue
    let businessGross = this.displayINRformat((businessmonthly.replace(/,/g, "")) * 12);
    let gross = { type: "String", value: businessGross }
    this.props.fieldPopulator("businessGrossAnnualIncome", gross);
    if (this.props.formValues.businessMonthlyFixedObligation && this.props.formValues.businessMonthlyFixedObligation.value) {
      let businessObligation = this.state.busiObligationValue
      let netIncomeBusiness = this.displayINRformat(businessGross.replace(/,/g, "") - (businessObligation * 12))
      let net = { type: "String", value: netIncomeBusiness }
      this.props.fieldPopulator("businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("businessNetAnnualIncome", net)
    }
  }
  handlemonthlyObligationBusiness = (value) => {
    let enteredValue = value.value
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ busiObligationValue: businessObligation })
    let businessGrossAnnual = this.props.formValues.businessGrossAnnualIncome.value
    let businessnetIncome = this.displayINRformat(businessGrossAnnual.replace(/,/g, "") - (businessObligation * 12));
    let net = { type: "String", value: businessnetIncome }
    this.props.fieldPopulator("businessNetAnnualIncome", net);
  }
  handlemonthlyObligationOthers = (value) => {
    let enteredValue = value.value
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ othersObligationValue: othersObligation })
    let othersGrossMonthly = this.props.formValues.othersGrossMonthlyIncome.value
    let othersGrossAnnualIncome = (othersGrossMonthly.replace(/,/g, "") * 12);
    let othersnetIncome = this.displayINRformat(othersGrossAnnualIncome - (othersObligation * 12));
    let net = { type: "String", value: othersnetIncome }
    this.props.fieldPopulator("NetAnnualIncomeOthers", net);
  }
  handleDailyIncomeChange = (value) => {
    let enteredValue = value.value
    let OthersdailyIncome = enteredValue.replace(/,/g, "");
    let values = { type: "String", value: "" }
    this.setState({ monthlyIncomeOthers: OthersdailyIncome })
    if (!this.props.formValues.othersWorkingDayCount) {
      this.props.fieldPopulator("othersGrossMonthlyIncome", values)
    } else {
      let daycountValue = this.props.formValues.othersWorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(OthersdailyIncome * daycountValue);
      let gross = { type: "String", value: MonthlyGross }
      let obligationOthers = this.state.othersObligationValue
      let othersGrossAnnual = (MonthlyGross * 12);
      let othersnetIncome = this.displayINRformat(othersGrossAnnual - (obligationOthers * 12));
      let net = { type: "String", value: othersnetIncome }
      this.props.fieldPopulator("othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("NetAnnualIncomeOthers", net)
    }
  }
  handleDayCount = (value) => {
    let enteredValue = value.value
    let dayCount = enteredValue
    let MonthlyGrossIncome = this.displayINRformat(this.props.formValues.othersDailyIncome.value.replace(/,/g, "") * dayCount);
    let gross = { type: "String", value: MonthlyGrossIncome }
    if (!this.props.formValues.othersMonthlyFixedObligation) {
      this.props.fieldPopulator("othersGrossMonthlyIncome", gross);
    } else {
      let obliqothr = this.props.formValues.othersMonthlyFixedObligation.value.replace(/,/g, "")
      let annualIncomeOthers = MonthlyGrossIncome * 12
      let netAnnualOthers = this.displayINRformat(annualIncomeOthers - (obliqothr * 12))
      let net = { type: "String", value: netAnnualOthers }
      this.props.fieldPopulator("othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("NetAnnualIncomeOthers", net)
    }
  }
  handleFoirCalculation = () => {
    let i;
    if (this.props.formValues.OccupationType && this.props.formValues.OccupationType.value === "Salaried") {
      let Foirobligation = this.props.formValues.salariedMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.salariedMonthlyGrossSalary.value
      let membertotalFoir;
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let salariedMemberExpense = this.props.formValues.members[i].ExpenseValue.value;
          memberExpenseValue.push(parseInt(salariedMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b, 0))
        membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ foirValue: membertotalFoir });
      }
      this.setState({ showFoirButton: false, showFoirProgress: true })
    }
    if (this.props.formValues.OccupationType && this.props.formValues.OccupationType.value === "Business") {
      let Foirobligation = this.props.formValues.businessMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.businessMonthlyGrossSalary.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let businessMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(businessMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ foirValue: membertotalFoir });
      }
      this.setState({ showFoirButton: false, showFoirProgress: true })
    }
    if (this.props.formValues.OccupationType && this.props.formValues.OccupationType.value === "Others") {
      let Foirobligation = this.props.formValues.othersMonthlyFixedObligation.value
      let FoirMonthlyGross = this.props.formValues.othersGrossMonthlyIncome.value
      if (this.props.formValues.members && this.props.formValues.members.length > 0) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.length; i++) {
          let OthersMemberExpense = this.props.formValues.members[i].ExpenseValue.value
          memberExpenseValue.push(parseInt(OthersMemberExpense));
        }
        let foirMemberExpense = parseInt(memberExpenseValue.reduce((a, b) => a + b))
        let membertotalFoir = Math.round(((parseInt(Foirobligation.replace(/,/g, "")) + parseInt(foirMemberExpense)) / parseInt(FoirMonthlyGross.replace(/,/g, ""))) * 100)
        this.setState({ foirValue: membertotalFoir });
      }
      this.setState({ showFoirButton: false, showFoirProgress: true })
    }
  }

  handleExtraExpense = () => {
    console.log("Into handle function of extra expense")
  }
  handleIFSCcode = value => {
    let enteredValue = value.value
    let code = enteredValue
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ ifsc: code });
      } else {
        message.errorMsg("IFSC code doesn't match");
      }
    }
  }
  handlePincode = (value) => {
    let pincode = value.value;
    if (pincode.length >= 6) {
      let validate = pincode.match(/^\d{6}$/) != null
      if (validate === true) { console.log("Entered pincode is valid" + pincode); }
      else { message.error("Pincode doesn't match") }
    }
  }
  getInitialTabInfo() {
    if (this.props.taskInfo) {
      let taskId = this.props.taskInfo.info.id;
      let currentTabInfo = soProcessExistingTabInfo.default;
      let { dynamicTabDetails } = this.props.taskInfo;
      if (dynamicTabDetails && dynamicTabDetails[taskId]) {
        currentTabInfo = dynamicTabDetails[taskId];
      }
      return currentTabInfo;
    }
  }
  addTabs() {
    let guarantorSelect = this.props.formValues.guarantorSelect ? this.props.formValues.guarantorSelect.value : null;
    let coBorrowerSelect = this.props.formValues.coBorrowerSelect ? this.props.formValues.coBorrowerSelect.value : null;
    let { currentTabInfo } = this.state.renderTabs;
    let latestTabList = [...soProcessExistingTabInfo.default.tabList];
    if (!validate.isEmpty(coBorrowerSelect)) {
      for (let i = 0; i < coBorrowerSelect; i++) {
        let newCoApplicantDetail = {
          name: `tabcoApplicant${i + 1}`,
          label: `coApplicant${i + 1}`
        };
        if (currentTabInfo.tabList.includes(newCoApplicantDetail)) {
          let existingTabInfo = currentTabInfo.tabList.filter(
            x => x === newCoApplicantDetail
          )[0];
          latestTabList.push(existingTabInfo);
        } else {
          latestTabList.push(newCoApplicantDetail);
        }
      }
    }
    if (!validate.isEmpty(guarantorSelect)) {
      for (let j = 0; j < guarantorSelect; j++) {
        let newGuarantorDetail = {
          name: `tabGuarantor${j + 1}`,
          label: `guarantor${j + 1}`
        };
        if (currentTabInfo.tabList.includes(newGuarantorDetail)) {
          let existingTabInfo = currentTabInfo.tabList.filter(
            x => x === newGuarantorDetail
          )[0];
          latestTabList.push(existingTabInfo);
        } else {
          latestTabList.push(newGuarantorDetail);
        }
      }
    }

    let newRenderTabs = this.state.renderTabs
      .appendTabs(latestTabList)
      .renderTabs(this.props.taskInfo.info.id, this.props.ipc);

    this.setState({ renderTabs: newRenderTabs });
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
              sectionKey="ApplicantDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant ID"}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.maxLength({
                        errorMsg: "ApplicantID exceeds limit",
                        max: 20
                      }),
                      A8V.minLength({ errorMsg: "", min: 3 }),
                      A8V.required({ errorMsg: "ApplicantID is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Borrower Type"
                    name="BorrowerType"
                    component={Select}
                    placeholder="Select Borrower Type"
                    className="a8Select"
                    // mode="multiple"
                    validate={[
                      A8V.required({ errorMsg: "BorrowerType is required" })
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
                    name="mobileNumber"
                    component={TextButtonGroup}
                    placeholder="Enter 10-digit Mobile Number"
                    type="text"
                    onChange={this.handleNumberChange}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Mobile number is required" }),
                      A8V.minLength({
                        errorMsg: "Enter valid Mobile Number",
                        min: 10
                      }),
                      A8V.maxLength({
                        errorMsg: "Enter valid Mobile Number",
                        max: 10
                      })
                    ]}
                    buttonLabel={this.state.buttonLabel}
                    isButtonLoading={this.state.loading}
                    showSuccesIcon={this.state.showSuccess}
                    showFailureIcon={this.state.showFailure}
                    onButtonClick={() => {
                      this.state.buttonLabel === "Verify"
                        ? this.handleSendApi()
                        : this.handleResendApi();
                    }}
                  />
                  <Field
                    hidden={true}
                    name="hiddenOTPStatus"
                    component={TextBox}
                    type="text"
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "hiddenOTPStatus is required" })
                    ]}
                  />
                </div>
                {this.state.otpSent &&
                  (
                    <div className="form-group ">
                      <Otp
                        numInputs={4}
                        submitLabel={"submit"}
                        mobileNumber={this.props.formValues.mobileNumber
                          ? this.props.formValues.mobileNumber.value
                          : null}
                        disableSubmit={this.state.OTP_submit}
                        handleOtpNumber={this.handleOtpNumber}
                        otpOnchange={this.onchangeOtp}
                        className=""
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="CIF Check "
              sectionKey="cifCheck"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-6">
                  <Field
                    label={"Account Number"}
                    name="CustomerAccountNumber"
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
                    buttonLabel={this.state.CIFbuttonLabel}
                    isButtonLoading={this.state.CIFloading}
                    onButtonClick={() => { this.handleCIFCheck() }}
                  />
                </div>
                {this.state.showFieldCards &&
                  <div className="form-group col-xs-12 col-md-12">
                    {
                      this.state.cardView &&
                      <AccountDetailsView
                        accountDetails={this.state.cardView}
                      />
                    }
                  </div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Basic Evaluation"
              sectionKey="applicantBasicEval"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "LoanAmount is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Scheme"
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Selected Loan Scheme"
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "LoanScheme is required" })
                    ]}
                  >
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Expected Tenure"}
                    name="ExpectedTenure"
                    component={TextDropdownGroup}
                    placeholder="Enter Tenure"
                    // normalize={proceedNumber}
                    // hasFeedback
                    onChange={this.handleExpectedTenure}
                    className="form-control-custom"
                    dropdownValues={
                      [
                        // "Weekly",
                        "M",
                        // "Yearly"
                      ]
                    }
                    defaultSelectedValue="M"
                    validate={[
                      A8V.required({ errorMsg: "ExpectedTenure is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Estimated EMI"}
                    name="EstimatedEMI"
                    component={TextBox}
                    placeholder="Enter EMI"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "EstimatedEMI is required" })
                    ]}
                  />
                </div>
                {/* <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Total Monthly surplus"}
                    name="TotalMonthlySurplus"
                    component={TextBox}
                    placeholder="Enter Monthly surplus"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({
                        errorMsg: "TotalMonthlySurplus is required"
                      })
                    ]}
                  />
                </div> */}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Repayment Frequency"
                    name="repaymentFrequency"
                    component={Select}
                    palceholder="Choose Repayment Frequency"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Repayment Frequency is required"
                      })
                    ]}
                  >
                    <Option value="Monthly"> Monthly</Option>
                    <Option value="Weekly"> Weekly</Option>
                    <Option value="Fortnightly"> Fortnightly</Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Employment Information"
              sectionKey="applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Occupation Type"
                    name="OccupationType"
                    component={Select}
                    placeholder="Select Occupation Type"
                    className="a8Select"
                    onChange={this.handleOccupationType}
                    validate={[
                      A8V.required({ errorMsg: "OccupationType is required" })
                    ]}
                  >
                    <Option value="Salaried">Salaried</Option>
                    <Option value="Business">Business</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>

                {/* if salaried */}
                {this.state.showSalariedFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="salariedTypeofJob"
                        component={Select}
                        placeholder="Select Type of Job"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "TypeofJob is required" })
                        ]}
                      >
                        <Option value="Private">Private</Option>
                        <Option value="Government Job">Government Job</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Experience in Current job"
                        name="salariedExperienceCurrentJob"
                        component={Select}
                        placeholder="Select Occupation Type"
                        defaultProp
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "Experience Current Job is required"
                          })
                        ]}
                      >
                        <Option value="10yearsandAbove">
                          10 years and above
                        </Option>
                        <Option value="Between5to10years">
                          Between 5 to 10 years
                        </Option>
                        <Option value="Between2to3years">
                          Between 2 to 3 years
                        </Option>
                        <Option value="Between1to2years">
                          Between 1 to 2 years
                        </Option>
                        <Option value="Lessthan1year">Less than 1 year</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="salariedMonthlyGrossSalary"
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.salariedhandleMonthlySalary}
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyGrossSalary is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Fixed Obligation"}
                        name="salariedMonthlyFixedObligation"
                        component={TextBox}
                        placeholder="Enter Monthly Obligation"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handlemonthlyObligationSalaried}
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyFixedObligation is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Gross Annual Income"}
                        name="salariedGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "GrossAnnualIncome is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="salariedNetAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "NetAnnualIncome is required"
                          })
                        ]}
                      />
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Surplus"}
                        name="salariedMonthlySurplus"
                        component={TextBox}
                        placeholder="Enter Monthly Surplus"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlySurplus is required"
                          })
                        ]}
                      />
                    </div> */}
                  </React.Fragment>
                )}
                {/* if business */}
                {this.state.showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Business"
                        name="BusinessType"
                        component={Select}
                        placeholder="Select Business Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "BusinessType is required" })
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
                        name="BusinessName"
                        component={TextBox}
                        placeholder="Enter Business Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.maxLength({
                            errorMsg: "Business Name must be 40 or less",
                            max: 40
                          }),
                          A8V.required({ errorMsg: "BusinessName is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Constitution"
                        name="Constitution"
                        component={Select}
                        placeholder="Select Constitution"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Constitution is required" })
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
                        name="BusinessStructure"
                        component={Select}
                        placeholder="Select Business Structure"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessStructure is required"
                          })
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
                        name="BusinessModel"
                        component={Select}
                        placeholder="Select Business model"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessModel is required"
                          })
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
                        name="BusinessStartDate"
                        component={DatePicker}
                        placeholder="Select start date"
                        selected={this.state.startDate}
                        onChange={this.handleBusinessStartDate}
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessStartDate is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Age of Business"}
                        name="BusinessAge"
                        component={TextBox}
                        placeholder="Enter Business Age"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "BusinessAge is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Number of employees"}
                        name="businessEmployeeCount"
                        component={TextBox}
                        placeholder="Enter Employee Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "EmployeeCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Total Years of Experience in Current Business"
                        name="CurrentBusinessExp"
                        component={Select}
                        placeholder="Select Current Experience"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "CurrentBusinessExp is required"
                          })
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
                        name="businessAnnualTurnover"
                        component={Select}
                        placeholder="Select Annual Turnover"
                        // normalize={inrFormat}
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "AnnualTurnover is required"
                          })
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
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="businessMonthlyGrossSalary"
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.businesshandleMonthlySalary}
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyGrossSalary is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Fixed Obligation"}
                        name="businessMonthlyFixedObligation"
                        component={TextBox}
                        placeholder="Enter Monthly Obligation"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handlemonthlyObligationBusiness}
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyFixedObligation is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Gross Annual Income"}
                        name="businessGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "GrossAnnualIncome is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="businessNetAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "NetAnnualIncome is required"
                          })
                        ]}
                      />
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Monthly Surplus"}
                      name="businessMonthlySurplus"
                      component={TextBox}
                      placeholder="Enter Monthly Surplus"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      validate={[
                        A8V.required({
                          errorMsg: "MonthlySurplus is required"
                        })
                      ]}
                    />
                  </div> */}
                  </React.Fragment>
                )}
                {/* if others */}
                {this.state.showOthersFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="JobType"
                        component={Select}
                        placeholder="Select Job Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "JobType is required" })
                        ]}
                      >
                        <Option value="SelfEmployed">Self Employed</Option>
                        <Option value="Wages">Wages</Option>
                        <Option value="Employedlocally??">
                          Employed locally??
                      </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="TotalYears of Experience in Current job"
                        name="ExperienceCurrentJob"
                        component={Select}
                        placeholder="Select Occupation Type"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "ExperienceCurrentJob is required"
                          })
                        ]}
                      >
                        <Option value="10yearsandAbove">
                          10 years and above
                      </Option>
                        <Option value="Between5to10years">
                          Between 5 to 10 years
                      </Option>
                        <Option value="Between2to3years">
                          Between 2 to 3 years
                      </Option>
                        <Option value="Between1to2years">
                          Between 1 to 2 years
                      </Option>
                        <Option value="Lessthan1year">Less than 1 year</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Daily Income"}
                        name="othersDailyIncome"
                        component={TextBox}
                        placeholder="Enter Daily Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handleDailyIncomeChange}
                        validate={[
                          A8V.required({ errorMsg: "DailyIncome is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Average no. of working days"}
                        name="othersWorkingDayCount"
                        component={TextBox}
                        placeholder="Enter WorkingDay Count"
                        normalize={proceedNumber}
                        onChange={this.handleDayCount}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "WorkingDayCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="othersGrossMonthlyIncome"
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyGrossSalary is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Fixed Obligation"}
                        name="othersMonthlyFixedObligation"
                        component={TextBox}
                        placeholder="Enter Monthly Obligation"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        onChange={this.handlemonthlyObligationOthers}
                        validate={[
                          A8V.required({
                            errorMsg: "MonthlyFixedObligation is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="NetAnnualIncomeOthers"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "NetAnnualIncome is required"
                          })
                        ]}
                      />
                    </div>
                    {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Monthly Surplus"}
                      name="othersMonthlySurplus"
                      component={TextBox}
                      placeholder="Enter Monthly Surplus"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-custom"
                      validate={[
                        A8V.required({
                          errorMsg: "MonthlySurplus is required"
                        })
                      ]}
                    />
                  </div> */}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant ExtraOrdinary Expense"
              sectionKey="applicantExtraOrdinaryExpense"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <FieldArray name="members" component={renderExpenseMembers} fieldWatcher={this.handleExtraExpense} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="FOIR Calculation"
              sectionKey="foirCalculation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                {this.state.showFoirProgress &&
                  <div>
                    {this.state.foirValue > 60 &&
                      <Result
                        icon={<Icon type="like" theme="twoTone" />}
                        title="Great, We are ready to proceed with CRIF!"
                      />}
                    {this.state.foirValue < 60 &&
                      <Result
                        icon={<Icon type="dislike" theme="twoTone" />}
                        title="Oops, Not Eligible to proceed with CRIF!"
                      />}
                  </div>
                }
                {this.state.showFoirButton &&
                  <div className="form-group col-xs-6 col-md-4" >
                    <Button className="api-button" type='danger' size='default' style={{ marginTop: 29 }}
                      onClick={() => this.handleFoirCalculation()}> Calcuate FOIR </Button>
                  </div>
                }
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Banking History with ESAF "
              sectionKey="applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant banking with ESAF?"
                    name="ESAFCustomer"
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
                {this.state.showESAFCustomer && <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Branch Name"}
                      name="BranchName"
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
                      name="IFSCCode"
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
                      name="BankingHistory"
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
              sectionKey="ReferencesInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="form-group col-xs-12 col-md-12">
                <label>
                  <strong>REFERENCE 1</strong>
                </label>
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Name"}
                      name="ReferenceName_1"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_1 is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_1 Address"}
                      name="ReferenceAddress_1"
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
                      name="ReferenceMobile_1"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceMobile_1 is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Reference_1 Type"
                      name="ReferenceType_1"
                      component={Select}
                      placeholder="Select Reference Type"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Reference Type is required" })
                      ]}
                    >
                      <Option value="General">General</Option>
                      <Option value="Business">Business</Option>
                    </Field>
                  </div>
                </div>
              </div>
              <div>
                <label>
                  <strong>REFERENCE 2</strong>
                </label>
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_2 Name"}
                      name="ReferenceName_2"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_2 is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Reference_2 Address"}
                      name="ReferenceAddress_2"
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
                      name="ReferenceMobile_2"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceMobile_2 is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Reference_2 Type"
                      name="ReferenceType_2"
                      component={Select}
                      placeholder="Select Reference Type"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Reference Type is required" })
                      ]}
                    >
                      <Option value="General">General</Option>
                      <Option value="Business">Business</Option>
                    </Field>
                  </div>
                </div>
              </div>

              {this.ShowhiddenFields && (
                <React.Fragment>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Salutation"}
                      name="CIFSalutation"
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
                      name="CIFmaritalStatus"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Date Of Birth"}
                      name="CIFdob"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Aadhaar Number"}
                      name="CIFAadhaarNumber"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Father Name"}
                      name="CIFfathersName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Mother Name"}
                      name="CIFmothersName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"House Name"}
                      name="CIFHouseName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Street Name"}
                      name="CIFStreetName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"City"}
                      name="CIFCityName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"District"}
                      name="CIFdistrictName"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Pincode"}
                      name="CIFpinnCode"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Income Details"}
                      name="CIFIncomeDetails"
                      component={TextBox}
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Employee Number"}
                      name="CIFemployeeNumber"
                      component={TextBox}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Loan-Eligibility details"
              sectionKey="loanEligibilityDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Loan Type"
                    name="LoanType"
                    component={Select}
                    placeholder="Select LoanType"
                    onChange={this.loanTypeChange}
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "LoanType is required" })
                    ]}
                  >
                    {this.state.loantypeOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                {/*Business Loan */}
                {this.state.showBusinessLoanFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Does the business remain open even when you are unavailable"
                        name="BusinessAvailability"
                        buttonStyle="outline"
                        component={RadioWrapper}
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessAvailability is required"
                          })
                        ]}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="OwnerShip"
                        name="OwnerShip"
                        component={Select}
                        placeholder="Select OwnerShip"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "OwnerShip is required" })
                        ]}
                      >
                        <Option value="Self">Self</Option>
                        <Option value="Father">Father</Option>
                        <Option value="Mother">Mother</Option>
                        <Option value="Son">Son</Option>
                        <Option value="Spouse">Spouse</Option>
                        <Option value="Brother">Brother</Option>
                        <Option value="Sister">Sister</Option>
                        <Option value="Parental Grandparents">
                          Parental Grandparents
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="RelationShip Business"
                        name="RelationShipBusiness"
                        component={Select}
                        placeholder="Select RelationShipBusiness"
                        onChange={this.handleRelationShipBusiness}
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "RelationShipBusiness is required"
                          })
                        ]}
                      >
                        <Option value="Director">Director</Option>
                        <Option value="Partner">Partner</Option>
                        <Option value="Proprietor">Proprietor</Option>
                        <Option value="Others">Others</Option>
                      </Field>
                    </div>
                    {this.state.RelationShipBusinessOthers && (
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Others"}
                          name="RelationShipBusinessOthers"
                          component={TextBox}
                          placeholder="Enter Others"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                        />
                      </div>
                    )}
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business Registration Type"
                        name="BusinessRegistrationType"
                        component={Select}
                        placeholder="Select BusinessRegistrationType"
                        onChange={this.handleRegistrationTypeOthers}
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessRegistrationType is required"
                          })
                        ]}
                      >
                        <Option value="Business Incorporation">
                          Business Incorporation
                        </Option>
                        <Option value="PAN">PAN</Option>
                        <Option value="Income Tax Returns">
                          Income Tax Returns
                        </Option>
                        <Option value="TIN">TIN</Option>
                        <Option value="GST No">GST No</Option>
                        <Option value="Service Tax No">Service Tax No</Option>
                        <Option value="SSI NO">SSI NO</Option>
                      </Field>
                    </div>
                    {this.state.RegistrationTypeOthers && (
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Others"}
                          name="RegistrationTypeOthers"
                          component={TextBox}
                          placeholder="Enter Others"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                        />
                      </div>
                    )}
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business Address Type"
                        name="BusinessAddressType"
                        component={Select}
                        placeholder="Select BusinessAddressType"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessAddressType is required"
                          })
                        ]}
                      >
                        <Option value="Registered Address">
                          Registered Address
                        </Option>
                        <Option value="Corporate Address">
                          Corporate Address
                        </Option>
                        <Option value="Current Address">Current Address</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Business Location"
                        name="BusinessLocation"
                        component={Select}
                        placeholder="Select BusinessLocation"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "BusinessLoacation is required"
                          })
                        ]}
                      >
                        <Option value="Pucca shop-own premises">
                          Pucca shop-own premises
                        </Option>
                        <Option value="Own house is the business premises">
                          Own house is the business premises
                        </Option>
                        <Option value="Pucca shop,rented >4 years in the current location">
                          {`Pucca shop,rented >4 years in the current location`}
                        </Option>
                        <Option value="Pucca shop,rented <4 years in the current location and residence within 10 kms">
                          Pucca shop,rented less than 4 years in the current
                          location and residence within 10 kms
                        </Option>
                        <Option value="Pucca shop, rented <4 years in the current location and residence greater than 10 kms">
                          Pucca shop,rented less than 4 years in the current
                          location and residence greater than 10 kms
                        </Option>
                        <Option value="Way side temporary set up">
                          Way side temporary set up
                        </Option>
                        <Option value="Shop On Wall">Shop On Wall</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Property Appreciation Value"
                        name="PropertyAppreciationValue"
                        component={Select}
                        placeholder="Select PropertyAppreciationValue"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "PropertyAppreciationValue is required"
                          })
                        ]}
                      >
                        <Option value="Property has appreciated in last 3 years">
                          Property has appreciated in last 3 years
                        </Option>
                        <Option value="Property has not appreciated in last 3 years">
                          Property has not appreciated in last 3 years
                        </Option>
                        <Option value="Property has depreciated in last 3 years">
                          Property has depreciated in last 3 years
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Address Proof Type"
                        name="busAddressProofType"
                        component={Select}
                        placeholder="Select Address Proof Type"
                        onChange={this.handleAddressProofTypeOthers}
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Type is required"
                          })
                        ]}
                      >
                        <Option value="Voters ID">Voters ID</Option>
                        <Option value="Ration Card">Ration Card</Option>
                        <Option value="PAssport Valid">Passport Valid</Option>
                        <Option value="BSNL Land Line Bill (Not older than 3 Months)">BSNL Land Line Bill (Not older than 3 Months)</Option>
                      </Field>
                    </div>
                    {this.state.AddressProofTypeOthers && (
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Others"}
                          name="busAddressProofTypeOthers"
                          component={TextBox}
                          placeholder="Enter Others"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                        />
                      </div>
                    )}
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Address ProofNumber"}
                        name="busAddressProofNumber"
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
                        name="busHouseNo"
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
                        name="busStreetArea"
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
                        name="busCity"
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
                        name="busPostOffice"
                        component={TextBox}
                        placeholder="Enter PostOffice"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "PostOffice is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="busDistrict"
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
                        name="busState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.stateOptions.map(data => (
                          <Option value={data.value}>{data.label}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Pincode"}
                        name="busPincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxlength="6"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Land mark"}
                        name="busLandMark"
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
                        name="busYearsInPresentAddress"
                        component={Select}
                        placeholder="Select YearsInPresentAddress"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "YearsInPresentAddress is required"
                          })
                        ]}
                      >
                        <Option value=">5 Years">Greater than 5 Years</Option>
                        <Option value=">3 years and <=5 years">
                          Greater than 3 years and less than equalto 5 years
                        </Option>
                        <Option value=">2 years and <=3 years">
                          Greater than 2 years and leass than equal to 3 years
                        </Option>
                        <Option value=">1 years and <=2 years">
                          Greater than 1 year and less than equalto 2 years
                        </Option>
                        <Option value="less than 1 year">
                          Less than 1 year
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Landline Number"}
                        name="busLandlineNumber"
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
                        name="busMobile"
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
                        name="busLocation"
                        component={TextBox}
                        placeholder="Enter Location"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  </React.Fragment>
                )}
                {/*Housing Loan */}
                {this.state.showHousingLoanFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Property Details"}
                        name="PropertyDetails"
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
                        name="TotalArea"
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
                        name="RoadAccess"
                        component={Select}
                        placeholder="Select Road Access"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "RoadAccess is required" })
                        ]}
                      >
                        <Option value="Two-Wheeler Access">
                          Two-Wheeler Access
                        </Option>
                        <Option value="Three-Wheeler Access">
                          Three-Wheeler Access
                        </Option>
                        <Option value="Four-Wheeler Access">
                          Four-Wheeler Access
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Type of Land"}
                        name="LandType"
                        component={TextBox}
                        placeholder="Enter LandType"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  </React.Fragment>
                )}
                {/* Vehicle Loan */}
                {this.state.showVehicleLoanFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Vehicle Type"
                        name="VehicleType"
                        component={Select}
                        placeholder="Select VehicleType"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "VehicleType is required" })
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
                        name="Manufacturer"
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
                        name="AssetModel"
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
                        name="AssetMake"
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
                        name="ExShowroomPrice"
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
                        name="RoadTax"
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
                        name="InsuranceAmount"
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
                        name="OnRoadPrice"
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
                        name="AssetOwner"
                        component={Select}
                        placeholder="Select AssetOwner"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "AssetOwner is required" })
                        ]}
                      >
                        <Option value="Applicant">Applicant</Option>
                        <Option value="Co-Applicant">Co-Applicant</Option>
                        <Option value="Applicant and Co-Applicant">
                          Applicant and Co-Applicant
                        </Option>
                      </Field>
                    </div>
                  </React.Fragment>
                )}
                {/* {ESAF Haritha Loan} */}
                {this.state.showGreenEnergyLoanFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Asset Type"
                        name="AssetType"
                        component={Select}
                        placeholder="Select AssetType"
                        onChange={this.handleAssetType}
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "AssetType is required" })
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
                        name="assetValue"
                        component={TextBox}
                        placeholder="Enter Asset Value"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    {this.state.showOthersComments &&
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Comments"}
                          name="Comments"
                          component={TextAreaHelper}
                          placeholder="Enter Comments"
                          type="text"
                          hasFeedback
                          className="form-control-custom"
                          validate={[
                            A8V.maxLength({
                              errorMsg: "Comments must be 40 or less",
                              max: 40
                            }),
                            A8V.required({ errorMsg: "Comments is required" })
                          ]}
                        />
                      </div>
                    }
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          {this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Business Loan" &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"BUSSINESS PROOFS"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Image"}
                  name="BusinessIMAGE"
                  component={Scanner}
                  docType="IMG"
                  imageVar="Businessimage"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          }
          {((this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Housing") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Loan Against Property") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Micro Housing Loan") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Dream House Loan") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Affordable Housing Loan")) &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"HOUSING PROOFS"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Image "}
                  name="HousingIMAGE"
                  component={Scanner}
                  docType="IMG"
                  imageVar="Housingimage"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          }
          {((this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Two Wheeler Loan") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Three Wheeler Loan")) &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"VEHICLE PROOFS"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Image "}
                  name="VehicleIMAGE"
                  component={Scanner}
                  docType="IMG"
                  imageVar="Vehicleimage"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          }
          {((this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "ESAF Haritha Loan") ||
            (this.props.formValues && this.props.formValues.LoanType && this.props.formValues.LoanType.value === "Clean Energy Loan")) &&
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"HARITHA LOAN PROOFS"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Image "}
                  name="HarithaIMAGE"
                  component={Scanner}
                  docType="IMG"
                  imageVar="harithaLoanimage"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant/Guarantor Selection"
              sectionKey="coBorrowerSelection"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Choose Co-Borrower"
                    name="coBorrowerSelect"
                    component={Select}
                    placeholder="Select No. of Co-Borrower"
                    className="a8Select"
                  >
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Choose Guarantor"
                    name="guarantorSelect"
                    component={Select}
                    placeholder="Select No. of Guarantor"
                    className="a8Select"
                  >
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                  </Field>
                </div>
              </div>
              <div className="flex-row">
                <div class="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={() => this.addTabs()}
                  >Add </Button>
                </div>
                <div class="form-group add-del-button ">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={() => this.deleteTabs()}
                  > Delete </Button>
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
  console.log("++++++State of SoProcess Existing ++++++", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessExisting")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessExisting")(state)
  };
};

export default connect(
  mapStateToProps,
)(TabSoProcessExisitng);
