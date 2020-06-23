import * as React from "react";
import {
  Select,
  SelectHelper,
  Scanner,
  TextBox,
  DatePicker,
  RadioWrapper,
  Radio,
  Otp,
  TextButtonGroup
} from "a8flow-uikit";
import {
  FormHeadSection,
  A8V,
  proceedNumber,
  renderExpenseMembers,
  IsJsonString,
  inrFormat,
  // sortAlphabetically,
  Config
} from "../../helpers";
import {
  Field,
  FieldArray,
  getFormSyncErrors,
  getFormValues
} from "redux-form";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import classname from "classnames";
import {
  Button,
  Result,
  Icon,
  Card,
  Checkbox,
  Collapse,
  Divider
} from "antd";
import ReactSpeedometer from "react-d3-speedometer";
import _ from "lodash";
import validate from "validate.js";

const { Option } = SelectHelper;
const { Panel } = Collapse;


class TabCoApplicantNew2 extends React.Component {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      c2FormScanner: [],
      c2FormScannerQR: [],
      c2applicantIdentInfo: [
        "c2ApplicantID",
        "c2BorrowerType",
        "c2relationShipWithApplicant",
        "c2existingCustomer"
      ],
      c2applicantBasicInfo: [
        "c2FirstName",
        "c2LastName",
        "c2Gender",
        "c2Salutation",
        "c2DateOfBirth",
        "c2VoterID"
      ],
      c2applicantKYC: [
        "c2kycstatus",
        "c2AadhaarName",
        "c2AadhaarNo",
        "c2AadhaarDOB",
        "c2DL_DateOfBirth",
        "c2DL_IssueDate",
        "c2DL_ExpiryDate",
        "c2DL_Number",
        "c2panName",
        "c2panNo",
        "c2panDOB",
        "c2panFatherName",
        "c2passportType",
        "c2passportNo",
        "c2passport_IssueDate",
        "c2passport_ExpiryDate",
        "c2VoterIDNumber",
        "c2VoterIDName",
        "c2VoterIDFatherName",
      ],
      c2applicantEmpInfo: [
        "c2OccupationType",
        "c2SalariedTypeofJob",
        "c2salariedExperienceCurrentJob",
        "c2salariedMonthlyGrossSalary",
        "c2salariedMonthlyFixedObligation",
        "c2salariedOfficeName",
        "c2SalariedOfficeNo",
        "c2SalariedStreetArea",
        "c2SalariedCity",
        "c2SalariedDistrict",
        "c2SalariedState",
        "c2SalariedPincode",
        "c2SalariedPostOffice",
        "c2BusinessType",
        "c2BusinessName",
        "c2Constitution",
        "c2BusinessStructure",
        "c2BusinessModel",
        "c2BusinessStartDate",
        "c2businessEmployeeCount",
        "c2CurrentBusinessExp",
        "c2businessAnnualTurnover",
        "c2businessMonthlyGrossSalary",
        "c2businessMonthlyFixedObligation",
        "c2businessOfficeName",
        "c2businessOfficeNo",
        "c2businessStreetArea",
        "c2businessCity",
        "c2businessDistrict",
        "c2businessState",
        "c2businessPincode",
        "c2businessPostOffice",
        "c2JobType",
        "c2ExperienceCurrentJob",
        "c2othersDailyIncome",
        "c2othersWorkingDayCount",
        "c2othersGrossMonthlyIncome",
        "c2othersMonthlyFixedObligation",
        "c2othrOfficeName",
        "c2othrOfficeNo",
        "c2othrStreetArea",
        "c2othrCity",
        "c2othrDistrict",
        "c2othrState",
        "c2othrPincode",
        "c2othrPostOffice",
        "c2c2VerifyAddress"
      ],
      c2applicantExtraOrdinaryExpense: [
        "c2ExtraExpenseType",
        "c2ExpenseValue",
        "c2members"
      ],
      c2foirCalculation: [""],
      c2CRIFScore: [""],
      c2applicantDetailedInfo: [
        "c2Citizenship",
        "c2ResidencyStatus",
        "c2Religion",
        "c2Caste",
        "c2MaritalStatus",
        "c2EducationLevel",
        "c2FatherName",
        "c2SpouseName",
        "c2ApplicantMBCustomer"
      ],
      c2applicantOtpVerification: ["c2hiddenOTPStatus"],
      c2applicantAddressInfo: [
        "c2permanentAddressType",
        "c2permanentAddressNumber",
        "c2permanentAddressProofNumber",
        "c2HouseName",
        "c2StreetArea",
        "c2City",
        "c2District",
        "c2State",
        "c2Pincode",
        "c2PostOffice",
        "c2District",
        "c2State",
        "c2permanentHouseName",
        "c2permanentStreetArea",
        "c2permanentCity",
        "c2permanentPincode",
        "c2permanentPostOffice",
        "c2permanentDistrict",
        "c2permanentState",
        "c2permanentYearsPresentAddress",
        "c2CorrespondenceAddressProofType",
        "c2CorrespondenceAddressProofNumber",
        "c2CorrespondenceHouseName",
        "c2CorrespondenceStreetArea",
        "c2CorrespondenceCity",
        "c2CorrespondencePincode",
        "c2CorrespondencePostOffice",
        "c2CorrespondenceDistrict",
        "c2CorrespondenceState",
        "c2CorrespondenceAddressProofTypeAsApplicant",
        "c2CorrespondenceAddressProofNumberAsApplicant",
        "c2CorrespondenceHouseNameAsApplicant",
        "c2CorrespondenceStreetAreaAsApplicant",
        "c2CorrespondenceCityAsApplicant",
        "c2CorrespondencePostOfficeAsApplicant",
        "c2CorrespondenceDistrictAsApplicant",
        "c2CorrespondenceStateAsApplicant",
        "c2CorrespondencePincodeAsApplicant",
        "c2PresentAddressAadhaarSame",
        "c2PresentAddressSameAsApplicant",
        "c2permanentCorrespondenceAddressSame",
        "c2CorrespondenceAddressSameApplicant",
      ],
      c2applicantBankingHistory: [
        "c2ESAFCustomer",
        "c2BranchName",
        "c2AccountNumber",
        "c2AccountType",
        "c2IFSCCode",
        "c2BankingHistory"
      ],
    },
    c2ShowSalariedFields: false,
    c2salariedMonthlySalary: "",
    c2showBusinessFields: false,
    c2businessMonthlySalary: "",
    c2showOthersFields: false,
    c2showJobTypeFields: false,
    c2showResidencyStatus: false,
    c2showSpouseName: false,
    c2disableBranchName: true,
    c2AadhaarQRCodeScan: "",
    c2veh_InsuranceAmount: 0,
    c2veh_showRoomPrice: 0,
    c2veh_roadTax: 0,
    c2veh_othersAmt: 0,
    c2startDate: "",
    c2Age: "",
    c2dayCount: "",
    c2CustomerAccountNumber: "",
    c2responseData: {},
    c2mappedJson: {},
    c2loantypeOptions: [],
    c2loanSubtypeOptions: [],
    c2stateOptions: [],
    c2StateOptions: [],
    c2religionOptions: [],
    c2educationOptions: [],
    c2casteOptions: [],
    c2maritalStatusOptions: [],
    c2citizenshipOptions: [],
    c2postOfficeOptions: [],
    c2districtOptions: [],
    c2showFoirProgress: false,
    c2showFoirButton: true,
    c2ifsc: "",
    c2otp: "",
    c2voterNo: "",
    c2verifyOTP: "",
    c2mobileNumber: "",
    c2otpPinID: "",
    c2OTP_submit: false,
    c2showFailure: false,
    c2showVerifiedCheck: false,
    c2showVerifiedUncheck: false,
    c2otpSent: false,
    c2buttonLabel: "SEND OTP",
    c2loading: false,
    c2showSuccess: false,
    c2showOTPverification: false,
    c2InsuranceAmount: "",
    c2monthlyIncomeOthers: "",
    c2salObligationValue: "",
    c2busiObligationValue: "",
    c2othersObligationValue: "",
    c2foirValue: "",
    c2HighMarkScoreloading: false,
    c2getHighMarkDone: false,
    c2HighMarkScore: 0,
    c2HighMarkApiData: null,
    c2pincode: "",
    c2errorMessage: "",
    c2errMsg: "",

  };

  componentDidMount() {
    // CoApplicant ApplicationID Generation
    this.handleApplicationID();
    //loan type option
    // let config = {
    //   url: `${Config.apiUrl}/v1/loanType`,
    //   method: "get"
    // };
    // axios(config)
    //   .then(response => {
    //     let loanType = response.data.loantype;
    //     let loanTypeDD = [];
    //     for (let iter = 0; iter < loanType.length; iter++) {
    //       loanTypeDD.push({
    //         value: loanType[iter].LoanType,
    //         label: loanType[iter].LoanType
    //       });
    //     }
    //     this.setState({
    //       c2loantypeOptions: loanTypeDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    // educationLevel Options
    let educonfigs = {
      url: `${Config.apiUrl}/v1/education`,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    };
    axios(educonfigs)
      .then(response => {
        let education = response.data.education;
        let educationDD = [];
        for (let iter = 0; iter < education.length; iter++) {
          educationDD.push({
            value: education[iter].educationLevel,
            label: education[iter].educationLevel
          });
        }
        this.setState({ c2educationOptions: educationDD });
      })
      .catch(error => {
        console.log(error);
      });
    // caste options
    let casteConfig = {
      url:
        `${Config.apiUrl}/v1/caste`,
      method: "get"
    };
    axios(casteConfig)
      .then(response => {
        let caste = response.data.caste;
        let casteDD = [];
        for (let iter = 0; iter < caste.length; iter++) {
          casteDD.push({
            value: caste[iter].caste_desc,
            label: caste[iter].caste_desc
          })
        }
        this.setState({ c2casteOptions: casteDD });
      })
      .catch(error => {
        console.log(error);
      });
    // maritalstatus options
    let maritalConfig = {
      url:
        `${Config.apiUrl}/v1/maritalStatus`,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    };
    axios(maritalConfig)
      .then(response => {
        let maritalStatus = response.data.maritalStatus;
        let maritalStatusDD = [];
        for (let iter = 0; iter < maritalStatus.length; iter++) {
          maritalStatusDD.push({
            value: maritalStatus[iter].maritalStatus,
            label: maritalStatus[iter].maritalStatus
          });
        }
        this.setState({ c2maritalStatusOptions: maritalStatusDD });
      })
      .catch(error => {
        console.log(error);
      });
    //religion Options
    let religionConfig = {
      url: `${Config.apiUrl}/v1/religion`,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    };
    axios(religionConfig)
      .then(response => {
        let religion = response.data.religion;
        let religionDD = [];
        for (let iter = 0; iter < religion.length; iter++) {
          religionDD.push({
            value: religion[iter].religionType,
            label: religion[iter].religionType
          });
        }
        this.setState({ c2religionOptions: religionDD });
      })
      .catch(error => {
        console.log(error);
      });
    // state option
    // let configs = {
    //   url: `${Config.apiUrl}/v1/states`,
    //   method: "get"
    // };
    // axios(configs)
    //   .then(response => {
    //     let states = response.data.states;
    //     let stateDD = [];
    //     states.sort(sortAlphabetically("StateName"));
    //     for (let iter = 0; iter < states.length; iter++) {
    //       stateDD.push({
    //         value: states[iter].StateCode,
    //         label: states[iter].StateName
    //       });
    //     }
    //     this.setState({
    //       c2StateOptions: stateDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // //countries Opttions
    // let countryConfig = {
    //   url: `${Config.apiUrl}/v1/countries`,
    //   method: "get"
    // };
    // axios(countryConfig)
    //   .then(response => {
    //     let citizen = response.data.Countries;
    //     let citizenDD = [];
    //     for (let iter = 0; iter < citizen.length; iter++) {
    //       citizenDD.push({
    //         value: citizen[iter].countryName,
    //         label: citizen[iter].countryName
    //       });
    //     }
    //     this.props.fieldPopulator("c2Citizenship", { type: "String", value: "India", valueInfo: {} });
    //     this.setState({ c2citizenshipOptions: citizenDD });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.props.fieldPopulator("c2Citizenship", { type: "String", value: "India", valueInfo: {} });
    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.c2OccupationType &&
      this.props.formValues.c2OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.c2OccupationType);
      if (this.props.formValues.c2JobType) {
        this.handleOtherJobType(this.props.formValues.c2JobType);
      }
    }
    if (this.props.formValues &&
      this.props.formValues.c2OTP_Value &&
      this.props.formValues.c2OTP_Value.value !== "") {
      // this.
      // this.handleOtpNumber(this.props.formValues.OTP_Value.value);
      if (this.props.formValues.c2hiddenOTPStatus &&
        this.props.formValues.c2hiddenOTPStatus.value === "true") {
        this.setState({ c2OTP_submit: true, c2showSuccess: true, c2buttonLabel: "Verified", c2otp: this.props.formValues.c2OTP_Value.value });
      } else if (this.props.formValues.c2hiddenOTPStatus &&
        this.props.formValues.c2hiddenOTPStatus.value === "false") {
        this.setState({ c2OTP_submit: false, c2showFailure: true, c2buttonLabel: "Resend OTP", c2otp: this.props.formValues.c2OTP_Value.value });
      }
    }
    if (
      this.props.formValues &&
      this.props.formValues.c2LoanType &&
      this.props.formValues.c2LoanType.value !== ""
    ) {
      this.loanTypeChange(this.props.formValues.c2LoanType);
    }

    if (!validate.isEmpty(this.props.formValues && this.props.formValues.c2HighMarkData)) {
      let HighMarkData = this.props.formValues.c2HighMarkData.value;
      if (HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
        let errMsg = HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
        this.setState({
          c2getHighMarkDone: true,
          c2HighMarkScoreloading: false,
          c2HighMarkScore: -1,
          c2showFoirButton: false,
          c2HighMarkApiData: HighMarkData,
          c2errorMessage: false,
          c2errMsg: errMsg,
          c2showFoirProgress: true,
          c2foirValue: this.props.formValues.c2FoirValue ? this.props.formValues.c2FoirValue.value : 0
        })
      } else {
        let HighMarkScore = HighMarkData.ResponseXML.BureauResponse.ScoreDetails.score.value;
        this.setState({
          c2getHighMarkDone: true,
          c2HighMarkScoreloading: false,
          c2HighMarkScore: HighMarkScore,
          c2HighMarkApiData: HighMarkData,
          c2errorMessage: false,
          c2showFoirProgress: true,
          c2showFoirButton: false,
          c2foirValue: this.props.formValues.c2FoirValue ? this.props.formValues.c2FoirValue.value : 0
        });
      }
    }
  }

  handleOccupationType = e => {
    if (e.value === "Salaried") {
      this.setState({
        c2ShowSalariedFields: true,
        c2showBusinessFields: false,
        c2showOthersFields: false
      });
    } else if (e.value === "Business") {
      this.setState({
        c2ShowSalariedFields: false,
        c2showBusinessFields: true,
        c2showOthersFields: false
      });
    } else if (e.value === "Others") {
      this.setState({
        c2ShowSalariedFields: false,
        c2showBusinessFields: false,
        c2showOthersFields: true
      });
    }
  };
  handleOtherJobType = (e) => {
    if (e.value === "Student" || e.value === "HomeMaker") {
      this.setState({
        c2showJobTypeFields: false,
      });
    } else {
      this.setState({
        c2showJobTypeFields: true,
      });
    }
  }
  handleApplicationID = () => {
    let StateCode = 'KL';
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
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
    let applicationNumber =
      "COA_2" + StateCode + currentYear + currentMonth + currentDate;
    let apIDs = { type: "String", value: applicationNumber };
    this.props.fieldPopulator("c2ApplicationID", apIDs);
  };
  citizenshipChange = value => {
    if (value && value.value === "India") {
      this.setState({ c2showResidencyStatus: false });
    } else {
      this.setState({ c2showResidencyStatus: true });
      this.props.fieldPopulator("c2ResidencyStatus", "");
    }
  };

  handleChange_age = e => {
    let age = moment().diff(e.value, 'years');
    this.props.fieldPopulator("c2Age", {
      type: "String",
      value: age
    })
  };
  handleBusinessStartDate = value => {
    let selected = moment(value.value);
    let today = moment(new Date());
    var Duration = moment.duration(selected.diff(today));
    var year = Duration.years();
    var month = Duration.months();
    var day = Duration.days();
    let age = year + "Years" + month + "Months" + day + "Days";
    let bsDate = { type: "String", value: age };
    this.setState({ c2startDate: selected, Age: age });
    this.props.fieldPopulator("c2BusinessAge", bsDate);
  };
  displayINRformat = entry => {
    var value = entry;
    value = value.toString();
    var lastThree = value.substring(value.length - 3);
    var otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  };
  salariedhandleMonthlySalary = value => {
    let enteredValue = value.value;
    let salariedmonthly = enteredValue.replace(/,/g, "");
    this.setState({ c2salariedMonthlySalary: salariedmonthly });
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross };
    if (!this.props.formValues.c2salariedMonthlyFixedObligation) {
      this.setState({ c2salariedAnnualIncome: salariedGross });
      this.props.fieldPopulator("c2salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.c2salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.c2salObligationValue;
      let netIncome = this.displayINRformat(
        salariedGross.replace(/,/g, "") - salariedObligationValue * 12
      );
      let net = { type: "String", value: netIncome };
      this.props.fieldPopulator("c2salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("c2salariedNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationSalaried = value => {
    let enteredValue = value.value;
    let salariedObligation = enteredValue.replace(/,/g, "");
    let monthlySurplus = this.props.formValues.c2salariedMonthlyGrossSalary
      .value;
    let salariedMonthlySurplus = this.displayINRformat(
      monthlySurplus.replace(/,/g, "") - salariedObligation
    );
    this.setState({ c2salObligationValue: salariedObligation });
    let salariedGrossAnnual = this.props.formValues.c2salariedGrossAnnualIncome
      .value;
    let salariednetIncome = this.displayINRformat(
      salariedGrossAnnual.replace(/,/g, "") - salariedObligation * 12
    );
    let net = { type: "String", value: salariednetIncome };
    let surplus = { type: "String", value: salariedMonthlySurplus };
    this.props.fieldPopulator("c2salariedMonthlySurplus", surplus);
    this.props.fieldPopulator("c2salariedNetAnnualIncome", net);
  };
  businesshandleMonthlySalary = value => {
    let enteredValue = value.value;
    let businessmonthly = enteredValue.replace(/,/g, "");
    this.setState({ c2businessMonthlySalary: businessmonthly });
    let businessGross = this.displayINRformat(
      businessmonthly.replace(/,/g, "") * 12
    );
    let gross = { type: "String", value: businessGross };
    this.props.fieldPopulator("c2businessGrossAnnualIncome", gross);
    if (this.props.formValues.c2businessMonthlyFixedObligation) {
      let businessObligation = this.state.c2busiObligationValue;
      let netIncomeBusiness = this.displayINRformat(
        businessGross.replace(/,/g, "") - businessObligation * 12
      );
      let net = { type: "String", value: netIncomeBusiness };
      this.props.fieldPopulator("c2businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("c2businessNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationBusiness = value => {
    let enteredValue = value.value;
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ c2busiObligationValue: businessObligation });
    let monthlySalary = this.state.c2businessMonthlySalary;
    let BusinessMonthlySurplus = this.displayINRformat(
      monthlySalary - businessObligation
    );
    let businessGrossAnnual = this.props.formValues.c2businessGrossAnnualIncome
      .value;
    let businessnetIncome = this.displayINRformat(
      businessGrossAnnual.replace(/,/g, "") - businessObligation * 12
    );
    let surplus = { type: "String", value: BusinessMonthlySurplus };
    let net = { type: "String", value: businessnetIncome };
    this.props.fieldPopulator("c2TotalMonthlySurplus", surplus);
    this.props.fieldPopulator("c2businessNetAnnualIncome", net);
  };
  handlemonthlyObligationOthers = value => {
    let enteredValue = value.value;
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ c2othersObligationValue: othersObligation });
    let othersGrossMonthly = this.props.formValues.c2othersGrossMonthlyIncome
      .value;
    let othersGrossAnnualIncome = othersGrossMonthly.replace(/,/g, "") * 12;
    let othersnetIncome = this.displayINRformat(
      othersGrossAnnualIncome - othersObligation * 12
    );
    let OthersMonthlySurplus = this.displayINRformat(
      othersGrossMonthly.replace(/,/g, "") - othersObligation
    );
    let surplus = { type: "String", value: OthersMonthlySurplus };
    let net = { type: "String", value: othersnetIncome };
    this.props.fieldPopulator("c2othersMonthlySurplus", surplus);
    this.props.fieldPopulator("c2NetAnnualIncomeOthers", net);
  };
  handleDailyIncomeChange = e => {
    let OthersdailyIncome = e.value.replace(/,/g, "");
    this.setState({ c2monthlyIncomeOthers: OthersdailyIncome });
    if (!this.props.formValues.c2othersWorkingDayCount) {
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", { type: "String", value: "" });
    } else {
      let daycountValue = this.props.formValues.c2othersWorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(
        OthersdailyIncome * daycountValue
      );
      let obligationOthers = this.state.c2othersObligationValue;
      let othersGrossAnnual = MonthlyGross * 12;
      let othersnetIncome = this.displayINRformat(
        othersGrossAnnual - obligationOthers * 12
      );
      this.props.fieldPopulator("c2OthersGrossAnnualSalary", { type: 'String', value: othersGrossAnnual })
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", { type: "String", value: MonthlyGross });
      this.props.fieldPopulator("c2NetAnnualIncomeOthers", { type: "String", value: othersnetIncome });
    }
  };
  handleDayCount = value => {
    let enteredValue = value.value;
    let dayCount = enteredValue;
    let MonthlyGrossIncome = this.displayINRformat(
      this.props.formValues.c2othersDailyIncome.value.replace(/,/g, "") *
      dayCount
    );
    let grossAnnual = this.displayINRformat(this.props.formValues.c2othersDailyIncome.value.replace(/,/g, "") * dayCount * 12)
    let gross = { type: "String", value: MonthlyGrossIncome };
    if (!this.props.formValues.c2othersMonthlyFixedObligation) {
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c2OthersGrossAnnualSalary", { type: 'String', value: grossAnnual })
    } else {
      let obliqothr = this.props.formValues.c2othersMonthlyFixedObligation.value.replace(
        /,/g,
        ""
      );
      let annualIncomeOthers = MonthlyGrossIncome * 12;
      let netAnnualOthers = this.displayINRformat(
        annualIncomeOthers - obliqothr * 12
      );
      let net = { type: "String", value: netAnnualOthers };
      this.props.fieldPopulator("c2OthersGrossAnnualSalary",
        { type: 'String', value: annualIncomeOthers })
      this.props.fieldPopulator("c2othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c2NetAnnualIncomeOthers", net);
    }
  };
  handleFoirCalculation = () => {
    let i;
    if (
      this.props.formValues.c2OccupationType &&
      this.props.formValues.c2OccupationType.value === "Salaried"
    ) {
      let Foirobligation = this.props.formValues
        .c2salariedMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c2salariedMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c2members &&
        this.props.formValues.c2members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c2members.value.length; i++) {
          let salariedMemberExpense = this.props.formValues.c2members.value[i].ExpenseValue.value;
          memberExpenseValue.push(parseInt(salariedMemberExpense));
        }
        let foirMemberExpense = parseInt(
          memberExpenseValue.reduce((a, b) => a + b, 0)
        );
        let membertotalFoir = Math.round(
          ((parseInt(Foirobligation.replace(/,/g, "")) +
            parseInt(foirMemberExpense)) /
            parseInt(FoirMonthlyGross.replace(/,/g, ""))) *
          100
        );
        this.setState({ c2foirValue: membertotalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c2foirValue: totalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true });
    }
    if (
      this.props.formValues.c2OccupationType &&
      this.props.formValues.c2OccupationType.value === "Business"
    ) {
      let Foirobligation = this.props.formValues
        .c2businessMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c2businessMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c2members &&
        this.props.formValues.c2members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c2members.value.length; i++) {
          let businessMemberExpense = this.props.formValues.c2members.value[i].ExpenseValue.value;
          memberExpenseValue.push(parseInt(businessMemberExpense));
        }
        let foirMemberExpense = parseInt(
          memberExpenseValue.reduce((a, b) => a + b)
        );
        let membertotalFoir = Math.round(
          ((parseInt(Foirobligation.replace(/,/g, "")) +
            parseInt(foirMemberExpense)) /
            parseInt(FoirMonthlyGross.replace(/,/g, ""))) *
          100
        );
        this.setState({ c2foirValue: membertotalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c2foirValue: totalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true });
    }
    if (
      this.props.formValues.c2OccupationType &&
      this.props.formValues.c2OccupationType.value === "Others"
    ) {
      let Foirobligation = this.props.formValues.c2othersMonthlyFixedObligation
        .value;
      let FoirMonthlyGross = this.props.formValues.c2othersMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c2members &&
        this.props.formValues.c2members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c2members.value.length; i++) {
          let OthersMemberExpense = this.props.formValues.c2members.value[i].ExpenseValue.value;
          memberExpenseValue.push(parseInt(OthersMemberExpense));
        }
        let foirMemberExpense = parseInt(
          memberExpenseValue.reduce((a, b) => a + b)
        );
        let membertotalFoir = Math.round(
          ((parseInt(Foirobligation.replace(/,/g, "")) +
            parseInt(foirMemberExpense)) /
            parseInt(FoirMonthlyGross.replace(/,/g, ""))) *
          100
        );
        this.setState({ c2foirValue: membertotalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c2foirValue: totalFoir });
        this.props.fieldPopulator("c2FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c2showFoirButton: false, c2showFoirProgress: true });
    }
  };

  ScoreCardHeader = (type, label) => {
    return (
      <React.Fragment>
        <Icon type={type} theme="twoTone" twoToneColor="#fa8c26" />
        <span style={{ paddingLeft: "15px" }}>{label}</span>
      </React.Fragment>
    );
  };

  handleCRIF = () => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    this.setState({ c2HighMarkScoreloading: true });

    let addresstype;
    if (this.props.formValues.c2KYC_selectedValue &&
      this.props.formValues.c2KYC_selectedValue.value !== "") {
      let kyc = JSON.parse(this.props.formValues.c2KYC_selectedValue.value);
      // ["Aadhaar","DrivingLicense","PAN","Passport","VoterId","SingleKYCApproval"]
      if (kyc.includes('c2PAN')) {
        addresstype = "2"
      } else if (kyc.includes('c2Aadhaar')) {
        addresstype = '1'
      } else if (kyc.includes('c2DrivingLicense')) {
        addresstype = '3'
      } else if (kyc.includes('c2VoterId')) {
        addresstype = '4'
      } else if (kyc.includes('c2Passport')) {
        addresstype = '5'
      }
    }
    let firstName = !validate.isEmpty(this.props.formValues.c2FirstName)
      ? this.props.formValues.c2FirstName.value
      : null;
    let lastName = !validate.isEmpty(this.props.formValues.c2LastName)
      ? this.props.formValues.c2LastName.value
      : null;
    let gender = !validate.isEmpty(this.props.formValues.c2Gender)
      ? this.props.formValues.c22Gender.value
      : null;
    let city = !validate.isEmpty(this.props.formValues.c2City)
      ? this.props.formValues.c2City.value
      : this.props.formValues.City.value;
    let pincode = !validate.isEmpty(this.props.formValues.c2Pincode)
      ? this.props.formValues.c2Pincode.value
      : null;
    let maritalstatus = !validate.isEmpty(this.props.formValues.c2MaritalStatus)
      ? this.props.formValues.c2MaritalStatus.value
      : null;
    let state = !validate.isEmpty(this.props.formValues.c2State)
      ? this.props.formValues.c2State.value
      : this.props.formValues.State.value;
    let dob = !validate.isEmpty(this.props.formValues.c2DateOfBirth)
      ? this.props.formValues.c2DateOfBirth.value.slice(0, 10)
      : null;
    let aadhar = !validate.isEmpty(this.props.formValues.c2AadhaarNo)
      ? this.props.formValues.c2AadhaarNo.value
      : null;
    let panNo = !validate.isEmpty(this.props.formValues.c2panNo)
      ? this.props.formValues.c2panNo.value.toUpperCase()
      : null;
    let voterNo = !validate.isEmpty(this.props.formValues.c2VoterIDNumber)
      ? this.props.formValues.c2VoterIDNumber.value :
      null;
    let passportNum = !validate.isEmpty(this.props.formValues.c2passportNo)
      ? this.props.formValues.c2passportNo.value :
      null;
    let dlNo = !validate.isEmpty(this.props.formValues.c2DL_Number)
      ? this.props.formValues.c2DL_Number.value :
      null;
    let loanamount = !validate.isEmpty(this.props.formValues.LoanAmount)
      ? this.props.formValues.LoanAmount.value.replace(/,/g, "")
      : null;
    let address = !validate.isEmpty(this.props.formValues.c2city)
      ? this.props.formValues.c2city.value
      : this.props.formValues.BorrowerAddress.value;
    let HighMarkConfig = {
      url: `${Config.apiUrl}/v1/cibil`,
      method: "post",
      headers: {
        Authorization: authToken,
      },
      data: {
        "BureauId": 6,
        "AddrLine1": address,
        "AddressType": addresstype,
        "City": city,
        "DOB": dob,
        "First_Name": firstName,
        "Gender": gender,
        "Inq_Purpose": "17",
        "Last_Name": lastName,
        "Loan_Product_Code": "7201",
        "Pan_Id": panNo,
        "Passport_Id": passportNum,
        "Voter_Id": voterNo,
        "Driver_license": dlNo,
        "aadhar_card": aadhar,
        "Postal": pincode,
        "State": state,
        "Transaction_Amount": loanamount,
        "MaritalStatus": maritalstatus
      }
    };
    axios(HighMarkConfig)
      .then(response => {
        let HighMarkData = response.data;
        if (response.data.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
          let errMsg = response.data.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
          this.setState({
            c2getHighMarkDone: true,
            c2HighMarkScoreloading: false,
            c2HighMarkScore: -1,
            c2HighMarkApiData: response.data,
            c2errorMessage: false,
            c2errMsg: errMsg
          })
        } else {
          let HighMarkScore = response.data.ScoreDetails.Score.Value;
          let CrifLink = response.data.pdfLink;
          this.props.fieldPopulator("c2HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
          this.props.fieldPopulator("c2CrifLink", { type: "String", value: CrifLink });
          let account_summary = response.ResponseXML.BureauResponse.AccountSummaryDetails;
          let total = 0;
          account_summary.AccountSummary.forEach((summary) => {
            total += Number(summary.TotalMonthlyPaymentAmount);
          })
          this.props.fieldPopulator("c2TotalMonthlyPayment", total);
          this.setState({
            c2getHighMarkDone: true,
            c2HighMarkScoreloading: false,
            c2HighMarkScore: HighMarkScore,
            c2HighMarkApiData: response.data,
            c2errorMessage: false
          });
        }
        this.props.fieldPopulator("c2HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
      }, (error) => {
        this.setState({
          c2HighMarkScoreloading: false,
          c2errorMessage: true
        });

      })
      .catch(e => {
        this.setState({
          c2HighMarkScoreloading: false,
          c2errorMessage: true
        });
      });
  }
  renderEmploymentInformation = () => {
    let {
      c2HighMarkApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (BureauResponse.EmploymentInfo) {
      const {
        Accounttype,
        DateReported,
        OccupationCode,
        Income,
        MONTHLY_ANNUALINCOMEINDICATOR: frequency,
        NET_GROSSINCOMEINDICATOR: incomeIndicator
      } = BureauResponse.EmploymentInfo;
      const reportedDate = moment(new Date(DateReported)).format("DD MMM YYYY");
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
            <br />
            <div className="row" style={{ paddingLeft: "15px" }}>
              <SectionInsideCard
                label="Account Type"
                value={Accounttype}
                col="2"
              />
              <SectionInsideCard
                label="date reported"
                value={reportedDate}
                col="2"
              />
              <SectionInsideCard
                label="occupation"
                value={OccupationCode}
                col="2"
              />
              <SectionInsideCard label="income" value={Income} col="2" />
              <SectionInsideCard label="frecuency" value={frequency} col="2" />
              <SectionInsideCard
                label="income indicator"
                value={incomeIndicator}
                col="2"
              />
            </div>
          </div>
        </ul>
      );
    }
  }

  renderPersonalInfoDetails = () => {
    const {
      c2HighMarkApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (BureauResponse.PersonalInfoDetails &&
      BureauResponse.PersonalInfoDetails.PersonalInfo) {
      const {
        FirstName,
        MiddleName,
        LastName,
        DateOfBirth,
        Gender
      } = BureauResponse.PersonalInfoDetails.PersonalInfo;
      const fullName = `${FirstName} ${MiddleName} ${LastName}`;
      const dateOfBirth = moment(DateOfBirth).format("DD MMM YYYY");
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
            <h2>Basic Information</h2>
            <div className="row" style={{ paddingLeft: "15px" }}>
              <SectionInsideCard label="Name" value={fullName} col="2" />
              <SectionInsideCard
                label="DATE OF BIRTH"
                value={dateOfBirth}
                col="2"
              />
              <SectionInsideCard label="GENDER" value={Gender} col="2" />
            </div>
          </div>
        </ul>
      );
    }
  }

  renderTelephoneNumbers = () => {
    const {
      c2HighMarkApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (BureauResponse.TelephoneInfoDetails &&
      BureauResponse.TelephoneInfoDetails.TelephoneInfo) {
      const { TelephoneInfo } = BureauResponse.TelephoneInfoDetails;
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
            <h2>Telephone Numbers</h2>
            <div className="row" style={{ paddingLeft: "15px" }}>
              {TelephoneInfo.map(phNumber => {
                return (
                  <SectionInsideCard
                    label={phNumber.TelephoneType === "M" && "mobile phone"}
                    value={`+91 ${phNumber.TelephoneNumber}`}
                    col="2"
                  />
                );
              })}
            </div>
          </div>
        </ul>
      );
    }
  }

  renderEmailDetails = () => {
    return (
      <ul className="pannalclassname">
        <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
          <h2>Email Contact</h2>
          <div className="row" style={{ paddingLeft: "15px" }}>
            <SectionInsideCard
              label="Email 1"
              value=""
              col="1"
            />
            <SectionInsideCard
              label="Email 1"
              value=""
              col="1"
            />
          </div>
        </div>
      </ul>
    );
  }

  renderAddressDetails = () => {
    const {
      c2HighMarkApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (BureauResponse.AddressInfoDetails &&
      BureauResponse.AddressInfoDetails.AddressInfo) {

      const { AddressInfo } = BureauResponse.AddressInfoDetails;
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
            <h2>Address</h2>
            {AddressInfo.map((address, index) => {
              const createdOn = moment(address.CreatedOn).format("DD MMM YYYY");
              return (
                <React.Fragment>
                  <label>
                    <h5>
                      <b style={{ color: "#10239e" }}>{`ADDRESS ${index +
                        1}`}</b>
                    </h5>
                  </label>

                  <div className="row" style={{ paddingLeft: "15px" }}>
                    <SectionInsideCard
                      label="street name"
                      value={address.FullAddress}
                      col="1"
                    />
                  </div>
                  <div className="row" style={{ paddingLeft: "15px" }}>
                    <SectionInsideCard
                      label="catagory"
                      value={address.Category}
                      col="2"
                    />
                    {/* <SectionInsideCard label=" status" value="owned" col="2" /> */}
                    <SectionInsideCard
                      label="date reported"
                      value={createdOn}
                      col="2"
                    />
                    <SectionInsideCard
                      label="state"
                      value={address.State}
                      col="2"
                    />
                    <SectionInsideCard
                      label="pincode"
                      value={address.Postal}
                      col="2"
                    />
                  </div>
                  {AddressInfo.length - 1 !== index && <Divider />}
                </React.Fragment>
              );
            })}
          </div>
        </ul>
      );
    }
    return null;
  };

  renderDocumentDetails = () => {
    const {
      c2HighMarkApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (
      BureauResponse.IdentityInfoDetails &&
      BureauResponse.IdentityInfoDetails.IdentityInfo
    ) {
      const { IdentityInfo } = BureauResponse.IdentityInfoDetails;
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
            <h2>Document Deatails</h2>
            {IdentityInfo.map((identity, index) => {
              const { ID, NUMBER_, CreatedOn } = identity;
              const idName =
                ID === "PanId"
                  ? "PAN card"
                  : ID === "VoterId"
                    ? "Voter card"
                    : ID === "DriverLicense"
                      ? "Driving License"
                      : "Universal ID";
              const labelName =
                ID === "PanId"
                  ? "INCOME TAX NUMBER (PAN)"
                  : ID === "VoterId"
                    ? "Voter ID Number"
                    : ID === "DriverLicense"
                      ? "Driving License Number"
                      : "Universal ID Number";
              const issueDate = moment(CreatedOn).format("DD MMM YYYY");
              return (
                <React.Fragment>
                  <label>
                    <h5>
                      <b style={{ color: "#10239e" }}>{idName}</b>
                    </h5>
                  </label>
                  <div className="row" style={{ paddingLeft: "15px" }}>
                    <SectionInsideCard
                      label={labelName}
                      value={NUMBER_}
                      col="1"
                    />
                  </div>
                  <div className="row" style={{ paddingLeft: "15px" }}>
                    <SectionInsideCard
                      label="issue date"
                      value={issueDate}
                      col="2"
                    />
                    <SectionInsideCard
                      label="expiration date"
                      value="-"
                      col="2"
                    />
                  </div>
                  {IdentityInfo.length - 1 !== index && <Divider />}
                </React.Fragment>
              );
            })}
          </div>
        </ul>
      );
    }
    return null;
  };
  handleExtraExpense = (value, modifiedIndex) => {
    let total = 0;
    let { c2members } = this.props.formValues;
    if (c2members) {
      c2members.value.forEach((member, index) => {
        if (modifiedIndex !== index) {
          total += parseInt(member.ExpenseValue.value)
        } else {
          total += parseInt(value.value);
        }
      })
    } else {
      total = parseInt(value.value);
    }
    this.props.fieldPopulator("c2ExpenseTotal", { type: "String", value: total });
  };
  handleIFSCcode = value => {
    let enteredValue = value.value;
    let code = enteredValue;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ c2ifsc: code });
      } else {
        alert("IFSC code doesn't match");
      }
    }
  };
  handleVoterID = value => {
    let voterIdNo = value.value;
    if (voterIdNo.length >= 10) {
      let valid = voterIdNo.match(/^([a-zA-Z]){3}([0-9]){7}?$/gi) != null;
      if (valid === true) {
        this.setState({ c2voterNo: voterIdNo });
      } else {
        alert("VoterID doesn't match");
      }
    }
  };
  handlePincode = value => {
    let pincode = value.value;
    if (pincode.length >= 6) {
      let validate = pincode.match(/^\d{6}$/) != null;
      if (validate === true) {
        this.setState({ c2pincode: pincode }, () => {
          this.mapCityState();
        })
      } else {
        alert("Pincode doesn't match");
      }
    }
  };
  mapCityState = () => {
    let pincode = this.state.c2pincode;
    let pincodeConfig = {
      url: `https://a8chatdev.autonom8.com/api/pincodes?pincode=${pincode}`,
      method: "get"
    }
    axios(pincodeConfig)
      .then(res => {
        let responseData = res.data;
        let districtDD = _.uniqBy(responseData, function (element) {
          return element.district;
        });
        let stateDD = _.uniqBy(responseData, function (element) {
          return element.state_name;
        });
        let postOfficeDD = _.uniqBy(responseData, function (element) {
          return element.office_name;
        })
        this.setState({
          c2districtOptions: districtDD,
          c2stateOptions: stateDD,
          c2postOfficeOptions: postOfficeDD
        });

      }).catch(error => {
        console.log("mapCityState function error", error)
      })
  }
  PresentAddressAadhaarSame = e => {
    if (e.value === "Yes") {
      this.setState({ c2showPresentAddressFields: false });
    } else {
      this.setState({ c2showPresentAddressFields: true });
    }
  };
  CorrespondenceAddressSame = e => {
    if (e.value === "Yes") {
      this.setState({ c2showCorrespondenceAddressFields: false });
    } else {
      this.setState({ c2showCorrespondenceAddressFields: true });
    }
  };
  PresentAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c2showPresentAddressSame: false });
    } else {
      this.setState({ c2showPresentAddressSame: true });
    }
  };
  CorrespondenceAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c2showCorrespondenceAddressSame: false });
    } else {
      this.setState({ c2showCorrespondenceAddressSame: true });
    }
  };
  handleNumberChange = value => {
    let enteredValue = value.value;
    let mobNo = enteredValue;
    let number = { type: "String", value: mobNo };
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null;
      if (validate === true) {
        this.setState({ c2mobileNumber: mobNo });
        this.props.fieldPopulator("c2otpmobileNumber", number);
      } else {
        alert("Mobile Number doesn't match");
      }
    }
  };
  handleMobileNumber = value => {
    let enteredValue = value.value;
    let mobNo = enteredValue;
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null;
      if (validate === true) {
        console.log("Valid mobile number" + enteredValue);
      } else {
        alert("Mobile Number doesn't match");
      }
    }
  };
  handleSendApi = () => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let config = {
      url: `${Config.apiUrl}/v1/sendOtp`,
      method: "post",
      headers: {
        Authorization: authToken
      },
      data: {
        mobile: "91" + this.props.formValues.c2mobileNumber.value
      }
    };
    this.setState({ c2loading: true });
    axios(config).then(
      response => {
        var pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          let OTP_Status = response.data.smsStatus;
          this.props.fieldPopulator("c2OTP_Status", { type: "String", value: OTP_Status });
        }
        this.setState({
          c2otpPinID: pinID,
          c2loading: false,
          c2buttonLabel: "RESEND OTP",
          c2showSuccess: false,
          c2showFailure: false
        });
      },
      () => {
        this.setState({
          c2loading: false,
          c2buttonLabel: "RESEND OTP",
          c2showSuccess: false,
          c2showFailure: true
        });
      }
    );
  };
  handleResendApi = () => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let config = {
      url: `${Config.apiUrl}/v1/resendOtp`,
      method: "post",
      headers: {
        Authorization: authToken
      },
      data: {
        pin_id: this.state.c2otpPinID
      }
    };
    this.setState({ c2loading: true });
    axios(config).then(
      response => {
        var resendpinID = response.data.pinId;
        this.setState({
          c2otpPinID: resendpinID,
          c2otpSent: true,
          c2loading: false,
          c2buttonLabel: "RESEND OTP",
          c2showSuccess: true
        });
      },
      () => {
        this.setState({
          c2loading: false,
          c2buttonLabel: "RESEND OTP",
          c2showSuccess: false,
          c2showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let otpValue = otp;
    this.setState({ c2otp: otpValue });
    this.props.fieldPopulator("c2OTP_Value", { type: "String", value: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      headers: {
        Authorization: authToken
      },
      data: {
        otp: otpValue,
        pin_id: this.state.c2otpPinID
      }
    };
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ c2verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ c2OTP_submit: true, c2showSuccess: true, c2buttonLabel: "Verified" });
          this.props.fieldPopulator("c2hiddenOTPStatus", {
            type: "String",
            value: this.state.c2verifyOTP
          })
        } else if (response.data.verified === false) {
          this.setState({ c2OTP_submit: true, c2showFailure: true, c2buttonLabel: "RESEND OTP" });
          this.props.fieldPopulator("c2hiddenOTPStatus", {
            type: "String",
            value: null
          })
        }
      });
    } else {
      console.log("hit in first instance");
    }
  };
  onchangeOtp = otp => {
    let value = otp;
    this.setState({ c2otp: value });
    this.setState({ c2OTP_submit: false });
  };
  handleAssetType = value => {
    if (value.value === "Others") {
      this.setState({ c2showOthersComments: true });
    } else if (value !== "Others") {
      this.setState({ c2showOthersComments: false });
    }
  };
  handleShowRoomPrice = value => {
    let enteredValue = value.value;
    let price = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_showRoomPrice: price });
    if (
      this.props.formValues.c2RoadTax &&
      this.props.formValues.c2InsuranceAmount
    ) {
      let veh_tax = this.state.c2veh_roadTax;
      let veh_insAmt = this.state.c2veh_InsuranceAmount;
      let veh_otherAmt = this.state.c2veh_othersAmt;
      let veh_onroadprice =
        Number(price) +
        Number(veh_tax) +
        Number(veh_insAmt) +
        Number(veh_otherAmt);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onroadprice)
      };
      this.props.fieldPopulator("c2OnRoadPrice", orp);
    }
  };
  handleRoadTax = value => {
    let enteredValue = value.value;
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_roadTax: tax }, () => { });
    if (
      this.props.formValues.c2ExShowroomPrice &&
      this.props.formValues.c2InsuranceAmount
    ) {
      let veh_insAmount = this.state.c2veh_InsuranceAmount;
      let veh_Price = this.state.c2veh_showRoomPrice;
      let veh_Others = this.state.c2veh_othersAmt;
      let veh_onRoadPrice =
        Number(tax) +
        Number(veh_insAmount) +
        Number(veh_Price) +
        Number(veh_Others);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onRoadPrice)
      };
      this.props.fieldPopulator("c2OnRoadPrice", orp);
    }
  };
  handleInsuranceAmount = e => {
    let value = e.value;
    let insAmount = value.replace(/,/g, "");
    this.setState({ c2veh_InsuranceAmount: insAmount }, () => { });
    if (
      this.props.formValues.c2ExShowroomPrice &&
      this.props.formValues.c2RoadTax
    ) {
      let veh_roadTax = this.state.c2veh_roadTax;
      let veh_Price = this.state.c2veh_showRoomPrice;
      let veh_others = this.state.c2veh_othersAmt;
      let vehonRoadPrice =
        Number(veh_roadTax) +
        Number(veh_Price) +
        Number(veh_others) +
        Number(insAmount);
      let orp = {
        type: "String",
        value: this.displayINRformat(vehonRoadPrice)
      };
      this.props.fieldPopulator("c2OnRoadPrice", orp);
    }
  };
  handleOnRoadPrice = value => {
    let enteredValue = value.value;
    let othersAmt = enteredValue.replace(/,/g, "");
    this.setState({ c2veh_othersAmt: othersAmt }, () => { });
    let showRoomPrice = this.state.c2veh_showRoomPrice;
    let roadTax = this.state.c2veh_roadTax;
    let insAmount = this.state.c2veh_InsuranceAmount;
    let onRoadPrice =
      Number(showRoomPrice) +
      Number(roadTax) +
      Number(insAmount) +
      Number(othersAmt);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) };
    this.props.fieldPopulator("c2OnRoadPrice", orp);
  };

  handleKycSelect = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c2KYC_selectedValue", { type: "string", value: JSON.stringify(selectedValue) })
    if (selectedValue.length >= 2) {
      this.props.fieldPopulator("c2kycstatus", {
        type: "String",
        value: "true"
      })
    } else {
      this.props.fieldPopulator("c2kycstatus", {
        type: "String",
        value: ""
      })
    }
  }

  handleAddressVerification = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c2Addr_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 1) {
      this.props.fieldPopulator("c2VerifyAddress", { type: "String", value: "true" });
    } else {
      this.props.fieldPopulator("c2VerifyAddress", { type: "String", value: "" });
    }
  }

  renderMembers() {
    if ((this.props.formValues && !this.props.formValues.c2members) ||
      (this.props.formValues && this.props.formValues.c2members &&
        typeof this.props.formValues.c2members.value !== "string")) {
      return (
        <div className="form-section">
          <FormHeadSection
            sectionLabel="Co-Applicant ExtraOrdinary Expense"
            sectionKey="c2applicantExtraOrdinaryExpense"
            formSyncError={this.props.formSyncError}
            sectionValidator={this.state.sectionValidator}
          />
          <div className="form-section-content">
            <div className="flex-row">
              <FieldArray
                name="c2members.value"
                component={renderExpenseMembers}
                fieldWatcher={this.handleExtraExpense}
              />
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    let c2panDetails =
      this.props.formValues && this.props.formValues.c2panDetails
        ? this.props.formValues.c2panDetails.value
        : null;
    let c2aadharDetails =
      this.props.formValues && this.props.formValues.c2aadharDetails
        ? this.props.formValues.c2aadharDetails.value
        : null;
    let c2passportDetails = this.props.formValues && this.props.formValues.c2passportDetails ? this.props.formValues.c2passportDetails.value : null;
    let c2drivingLicenseDetails = this.props.formValues && this.props.formValues.c2drivingLicenseDetails ? this.props.formValues.c2drivingLicenseDetails.value : null;
    let c2voterIdDetails = this.props.formValues && this.props.formValues.c2voterIdDetails ?
      this.props.formValues.c2voterIdDetails.value : null;

    if (c2panDetails && IsJsonString(c2panDetails)) {
      c2panDetails = JSON.parse(c2panDetails);
    }
    if (c2aadharDetails && IsJsonString(c2aadharDetails)) {
      c2aadharDetails = JSON.parse(c2aadharDetails);
    }
    if (c2passportDetails && IsJsonString(c2passportDetails)) {
      c2passportDetails = JSON.parse(c2passportDetails);
    }
    if (c2drivingLicenseDetails && IsJsonString(c2drivingLicenseDetails)) {
      c2drivingLicenseDetails = JSON.parse(c2drivingLicenseDetails);
    }
    if (c2voterIdDetails && IsJsonString(c2voterIdDetails)) {
      c2voterIdDetails = JSON.parse(c2voterIdDetails);
    }

    const c2KycOptions = [
      { label: 'Aadhaar', value: 'c2Aadhaar' },
      { label: 'Driving License', value: 'c2DrivingLicense' },
      { label: 'PAN', value: 'c2PAN' },
      { label: 'Passport', value: 'c2Passport' },
      { label: 'VoterId', value: 'c2VoterId' },
      { label: 'Single KYC Approval', value: 'c2SingleKYCApproval' }
    ];

    const c2addressOptions = [
      { label: "Permanent Address", value: "c2PermanentAddress" },
      { label: "Residential Address", value: "c2ResidentialAddress" },
      { label: "Work Address", value: "c2WorkAddress" }
    ]


    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-so_process"
        >
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Identity Information"
              sectionKey="c2applicantIdentInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            // use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Applicant ID"}
                    label={<span> Co-Application ID <span style={{ color: "red" }}>*</span></span>}
                    name="c2ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    disabled={true}
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
                    // label="Borrower Type"
                    label={<span> Borrower Type <span style={{ color: "red" }}>*</span></span>}
                    name="c2BorrowerType"
                    component={Select}
                    placeholder="Select Borrower Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "BorrowerType is required" })
                    ]}
                  >
                    <Option value="Co-Applicant_1">Co-Applicant_1</Option>
                    <Option value="Co-Applicant_2">Co-Applicant_2</Option>
                    <Option value="Co-Applicant_3">Co-Applicant_3</Option>
                    <Option value="Co-Applicant_4">Co-Applicant_4</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Relationship with Applicant"}
                    name="c2relationShipWithApplicant"
                    component={TextBox}
                    placeholder="Enter Relationship with Applicant"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "Relationship is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Co-Applicant an Existing Customer?"
                    name="c2existingCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    validate={[
                      A8V.required({
                        errorMsg: "Is Existing Customer required"
                      })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Basic Information"
              sectionKey="c2applicantBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"First Name"}
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name="c2FirstName"
                    component={TextBox}
                    placeholder="Enter First Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.maxLength({
                        errorMsg: "FirstName must be 20 or less",
                        max: 20
                      }),
                      A8V.minLength({ errorMsg: "", min: 1 }),
                      A8V.required({ errorMsg: "FirstName is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Middle Name"}
                    name="c2MiddleName"
                    component={TextBox}
                    placeholder="Enter Middle Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Last Name"}
                    label={<span>Last Name <span style={{ color: "red" }}>*</span></span>}
                    name="c2LastName"
                    component={TextBox}
                    placeholder="Enter Last Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.maxLength({
                        errorMsg: "LastName must be 20 or less",
                        max: 20
                      }),
                      A8V.minLength({ errorMsg: "", min: 1 }),
                      A8V.required({ errorMsg: "LastName is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Gender"
                    label={<span> Gender <span style={{ color: "red" }}>*</span></span>}
                    name="c2Gender"
                    component={Select}
                    placeholder="Select Gender"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Gender is required" })
                    ]}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Salutation"
                    label={<span>Salutation <span style={{ color: "red" }}>*</span></span>}
                    name="c2Salutation"
                    component={Select}
                    placeholder="Select Salutation"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Salutation is required" })
                    ]}
                  >
                    <Option value="Mr">Mr</Option>
                    <Option value="Miss">Miss</Option>
                    <Option value="Mrs">Mrs</Option>
                    <Option value="Dr">Dr</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Date of Birth"
                    label={<span> Date of Birth <span style={{ color: "red" }}>*</span></span>}
                    name="c2DateOfBirth"
                    component={DatePicker}
                    placeholder="Select DOB"
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleChange_age}
                    disabledDate={current => {
                      return (current && (moment().add(-60, 'year').add(-1, 'day') > current || current > moment().add(-18, 'year').add(-1, 'day')));

                    }}
                    validate={[A8V.required({ errorMsg: "DOB is required" })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Age"}
                    name="c2Age"
                    type="text"
                    component={TextBox}
                    placeholder="Enter Middle Name"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant KYC Information (Any Two Mandatory)"
              sectionKey="c2applicantKYC"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group ">
                  <div>
                    <label>
                      <strong style={{ marginLeft: "10px" }}>
                        Select Atleast Two KYC Proof
                      </strong>
                    </label>
                    <Checkbox.Group
                      style={{ paddingLeft: "12px" }}
                      className="kyc-Option-checkBox" options={c2KycOptions}
                      defaultValue={this.props.formValues.c2KYC_selectedValue ? JSON.parse(this.props.formValues.c2KYC_selectedValue.value) : ""}
                      onChange={this.handleKycSelect} />
                  </div>
                  <Field
                    hidden={true}
                    name="c2kycstatus"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "kycstatus is required" })
                    ]}
                  />
                </div>
              </div>
              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2Aadhaar")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Aadhaar Name"}
                        label={<span> Aadhaar Name <span style={{ color: "red" }}>*</span></span>}
                        name="c2AadhaarName"
                        component={TextBox}
                        placeholder="Enter  Aadhaar Name"
                        type="text"
                        maxlength="40"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Aadhaar Name is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Aadhaar Number"}
                        label={<span> Aadhaar Number <span style={{ color: "red" }}>*</span></span>}
                        name="c2AadhaarNo"
                        component={TextBox}
                        placeholder="Enter  Aadhaar Number"
                        type="text"
                        maxlength="12"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Aadhaar Number is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label=" Aadhaar Date Of Birth "
                        label={<span> Aadhaar Date Of Birth <span style={{ color: "red" }}>*</span></span>}
                        name="c2AadhaarDOB"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Date Of Birth"
                        validate={[
                          A8V.required({ errorMsg: "Date of Birth is required" }),
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Aadhaar Card Scanner"}
                        name="c2Aadhaar_Scanner"
                        component={Scanner}
                        docType="AADHAR"
                        imageVar={"c2aadharImg"}
                        parserVar={"c2aadharDetails"}
                        docParse={true}
                        metaVar={"c2aadhaarMeta"}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c2aadharDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c2aadharDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c2aadharDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Aadhaar Number :
                            </span>{" "}
                            {c2aadharDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c2aadharDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Gender :
                            </span>{" "}
                            {c2aadharDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2DrivingLicense")) && <React.Fragment>
                  <div className="flex-row">

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Birth"
                        label={<span>Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        name="c2DL_DateOfBirth"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Date of Birth"
                        validate={[
                          A8V.required({ errorMsg: "Date of Birth is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Issue"
                        label={<span>Date Of Issue<span style={{ color: "red" }}>*</span></span>}
                        name="c2DL_IssueDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Issued On"
                        validate={[
                          A8V.required({ errorMsg: "Date of Issue is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Expiry"
                        label={<span>Date Of Expiry<span style={{ color: "red" }}>*</span></span>}
                        name="c2DL_ExpiryDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Valid Upto"
                        disabledDate={current => {
                          return (
                            current && current < moment().add(-2, "day")
                          );
                        }}
                        validate={[
                          A8V.required({ errorMsg: "Date of Expiry is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Driving License Number"}
                        label={<span>Driving License Number<span style={{ color: "red" }}>*</span></span>}
                        name="c2DL_Number"
                        component={TextBox}
                        placeholder="Enter  License Number"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "License Number is required" }),
                          A8V.alphaNumeric({ errorMsg: "Enter Valid License Number" })
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Driving License Scanner"}
                        name="c2DL_Scanner"
                        component={Scanner}
                        docType="DL"
                        imageVar={"c2DLImg"}
                        parserVar={"c2drivingLicenseDetails"}
                        metaVar={"c2drivingLicenseMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c2drivingLicenseDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c2drivingLicenseDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                            {c2drivingLicenseDetails.bloodGroup}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                            {" "}
                            {c2drivingLicenseDetails.dateOfBirth}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {c2drivingLicenseDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                            {" "}
                            {c2drivingLicenseDetails.dateOfExpiry}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                            {" "}
                            {c2drivingLicenseDetails.dlId}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>State :</span>
                            {" "}
                            {c2drivingLicenseDetails.dlState}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2PAN")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Name"}
                        label={<span>Pan Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2panName"
                        component={TextBox}
                        placeholder="Enter Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "PAN name is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pan Number"}
                        label={<span> Pan Number<span style={{ color: "red" }}>*</span></span>}
                        name="c2panNo"
                        component={TextBox}
                        placeholder="Enter PAN Number"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "PAN number is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Birth"
                        label={<span> Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        name="c2panDOB"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Date of Birth"
                        validate={[
                          A8V.required({ errorMsg: "Date of Birth is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Father Name"}
                        label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2panFatherName"
                        component={TextBox}
                        placeholder="Enter Father Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Father Name is required" }),
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Pan Card Scanner"}
                        name="c2PAN_Scanner"
                        component={Scanner}
                        docType="PAN"
                        imageVar={"c2panImg"}
                        parserVar={"c2panDetails"}
                        metaVar={"c2panMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c2panDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c2panDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c2panDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c2panDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c2panDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c2panDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2Passport")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Type Of Passport"}
                        label={<span> Type Of Passport<span style={{ color: "red" }}>*</span></span>}
                        name="c2passportType"
                        component={Select}
                        placeholder="Select  Passport Type"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Passport Type is required" }),
                        ]}
                      >
                        <Option value="Type P"> Type P</Option>
                        <Option value="Type S"> Type S</Option>
                        <Option value="Type D"> Type D</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Passport Number"}
                        label={<span> Passport Number<span style={{ color: "red" }}>*</span></span>}
                        name="c2passportNo"
                        component={TextBox}
                        placeholder="Enter  Passport Number"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Passport Number is required" }),
                          A8V.passport({ errorMsg: "" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Issue"
                        label={<span> Date Of Issue<span style={{ color: "red" }}>*</span></span>}
                        name="c2passport_IssueDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Issued On"
                        validate={[
                          A8V.required({ errorMsg: "Date of Issue is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">

                      <Field
                        // label="Date Of Expiry"
                        label={<span> Date Of Expiry<span style={{ color: "red" }}>*</span></span>}
                        name="c2passport_ExpiryDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Valid Upto"
                        disabledDate={current => {
                          return (
                            current && current < moment().add(-2, "day")
                          );
                        }}
                        validate={[
                          A8V.required({ errorMsg: "Date of Expiry is required" }),
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Passport Scanner"}
                        name="c2Passport_Scanner"
                        component={Scanner}
                        docType="PASSPORT"
                        imageVar={"c2passportImg"}
                        parserVar={"c2passportDetails"}
                        metaVar={"c2passportMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c2passportDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c2passportDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c2passportDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Aadhaar Number :</span>
                            {" "}
                            {c2passportDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>
                            {" "}
                            {c2passportDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>
                            {" "}
                            {c2passportDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2VoterId")) && <React.Fragment >
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Voter ID Number"}
                        label={<span> Voter ID Number<span style={{ color: "red" }}>*</span></span>}
                        name="c2VoterIDNumber"
                        component={TextBox}
                        placeholder="Enter Voter ID"
                        type="text"
                        maxLength={20}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "VoterID is required" }),
                          A8V.voter({ errorMsg: "" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={" Name in Voter ID "}
                        label={<span> Name in Voter ID<span style={{ color: "red" }}>*</span></span>}
                        name="c2VoterIDName"
                        component={TextBox}
                        placeholder="Enter VoterID Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "VoterID Name  is required" }),
                        ]}
                      />
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Father Name"}
                        label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2VoterIDFatherName"
                        component={TextBox}
                        placeholder="Enter Father Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "VoterID Father Name is required" }),
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Voter Scanner"}
                        name="c2Voter_Scanner"
                        component={Scanner}
                        docType="VOTERID"
                        imageVar={"c2voterIdImage"}
                        parserVar={"c2voterIdDetails"}
                        metaVar={"c2voterIdMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c2voterIdDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c2voterIdDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c2voterIdDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c2voterIdDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                            {c2voterIdDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c2voterIdDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c2KYC_selectedValue &&
                JSON.parse(this.props.formValues.c2KYC_selectedValue.value).includes("c2SingleKYCApproval")) &&
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    {/** File Uploader */}
                    <Field
                      label={"Single KYC Image "}
                      name="c2singleKycImage"
                      component={Scanner}
                      docType="IMG"
                      imageVar={"c2singleKycimage"}
                      metaVar={"c2singleKycMeta"}
                      taskInfo={this.props.taskInfo}
                      a8flowApiUrl={`${Config.baseUrl}`}
                      ipc={this.props.ipc}
                      fieldPopulator={this.props.fieldPopulator}
                    />
                  </div>
                </div>
              }
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Detailed Information"
              sectionKey="c2applicantDetailedInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Mobile number"
                    label={<span> Mobile number<span style={{ color: "red" }}>*</span></span>}
                    name="c2mobileNumber"
                    component={TextBox}
                    placeholder="Enter Mobile Number"
                    type="text"
                    hasFeedback
                    onChange={this.handleNumberChange}
                    maxlength="10"
                    // disabled={true}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Mobile number is required" }),
                      A8V.minLength({ errorMsg: "", min: 10 }),
                      A8V.maxLength({ errorMsg: "", max: 10 }),
                      A8V.uniqueMobileNumber({
                        errorMsg: "Mobile number should be unique", mobile:
                          [
                            this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                            this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                            this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
                            this.props.formValues.ReferenceMobile_2 ? this.props.formValues.ReferenceMobile_2.value : '',
                            this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
                            // this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                            this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                            this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                            this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                            this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                            this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                            this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                            this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
                            this.props.formValues.g1AlternativePhone ? this.props.formValues.g1AlternativePhone.value : '',
                            this.props.formValues.g2mobileNumber ? this.props.formValues.g2mobileNumber.value : '',
                            this.props.formValues.g2AlternativePhone ? this.props.formValues.g2AlternativePhone.value : '',
                          ]
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Alternative Phone number"
                    name="c2AlternativePhone"
                    component={TextBox}
                    placeholder="Enter Alternative Phone Number"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Email Id"}
                    name="c2Email"
                    component={TextBox}
                    placeholder="Enter Email"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Citizenship"
                    label={<span> Citizenship<span style={{ color: "red" }}>*</span></span>}
                    name="c2Citizenship"
                    component={Select}
                    placeholder="Select Citizenship"
                    className="a8Select"
                    onChange={this.citizenshipChange}
                    validate={[
                      A8V.required({ errorMsg: "Citizenship is required" })
                    ]}
                  >
                    { /*{this.state.c2citizenshipOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                   ))}*/}
                  </Field>
                </div>
                {this.state.c2showResidencyStatus && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // label="Residency Status"
                      label={<span> Residency Status<span style={{ color: "red" }}>*</span></span>}
                      name="c2ResidencyStatus"
                      component={Select}
                      placeholder="Select ResidencyStatus"
                      className="a8Select"
                    >
                      <Option value="Resident Individual">
                        Resident Individual
                      </Option>
                      <Option value="Non Resident Indian">
                        Non Resident Indian
                      </Option>
                      <Option value="Person Of Indian Origin">
                        Person Of Indian Origin
                      </Option>
                      <Option value="Default Resident Individual">
                        Default Resident Individual
                      </Option>
                    </Field>
                  </div>
                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Religion"
                    label={<span> Religion<span style={{ color: "red" }}>*</span></span>}
                    name="c2Religion"
                    component={Select}
                    placeholder="Select Religion"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Religion is required" })
                    ]}
                  >
                    {this.state.c2religionOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Caste"
                    label={<span> Caste<span style={{ color: "red" }}>*</span></span>}
                    name="c2Caste"
                    component={Select}
                    placeholder="Select Caste"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Caste is required" })]}
                  >
                    {this.state.c2casteOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Marital Status"
                    label={<span> Marital Status<span style={{ color: "red" }}>*</span></span>}
                    name="c2MaritalStatus"
                    component={Select}
                    placeholder="Enter MaritalStatus"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Marital Status is required" })
                    ]}
                  >
                    {this.state.c2maritalStatusOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Education Level"
                    label={<span> Education Level<span style={{ color: "red" }}>*</span></span>}
                    name="c2EducationLevel"
                    component={Select}
                    placeholder="Select EducationLevel"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "EducationLevel is required" })
                    ]}
                  >
                    {this.state.c2educationOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Father Name"}
                    label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                    name="c2FatherName"
                    component={TextBox}
                    placeholder="Enter Father Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "FatherName is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Mother Maiden Name"}
                    name="c2MotherMaidenName"
                    component={TextBox}
                    placeholder="Enter Mother Maiden Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                {this.props.formValues.c2MaritalStatus &&
                  this.props.formValues.c2MaritalStatus.value === "Married" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Spouse Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2SpouseName"
                        component={TextBox}
                        placeholder="Enter Spouse Name"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "SpouseName is required" })]}
                      />
                    </div>
                  )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is Applicant a MicroBanking customer?<span style={{ color: "red" }}>*</span></span>}
                    name="c2ApplicantMBCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    validate={[
                      A8V.required({
                        errorMsg: "ApplicantMBCustomer is required"
                      })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.props.formValues.c2ApplicantMBCustomer &&
                  this.props.formValues.c2ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Sangam Name"}
                        name="c2SangamName"
                        component={TextBox}
                        placeholder="Enter SangamName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.c2ApplicantMBCustomer &&
                  this.props.formValues.c2ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Microbanking Branch Name"}
                        name="c2MBBranchName"
                        component={TextBox}
                        placeholder="Enter Branch Name"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>

          {this.props.formValues &&
            this.props.formValues.c2mobileNumber &&
            this.props.formValues.c2mobileNumber.value && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="OTP Verification"
                  sectionKey="c2applicantOtpVerification"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label="Mobile number"
                        name="c2mobileNumber"
                        component={TextButtonGroup}
                        placeholder="Enter 10-digit Mobile Number"
                        type="text"
                        maxlength="10"
                        disabled={true}
                        onChange={this.handleMobileNumber}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "Mobile number is required"
                          }),
                          A8V.minLength({
                            errorMsg: "Enter valid Mobile Number",
                            min: 10
                          }),
                          A8V.maxLength({
                            errorMsg: "Enter valid Mobile Number",
                            max: 10
                          }),
                          A8V.uniqueMobileNumber({
                            errorMsg: "Mobile number should be unique", mobile:
                              [
                                this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                                this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                                this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
                                this.props.formValues.ReferenceMobile_2 ? this.props.formValues.ReferenceMobile_2.value : '',
                                this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
                                // this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                                this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                                this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                                this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                                this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                                this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                                this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                                this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
                                this.props.formValues.g1AlternativePhone ? this.props.formValues.g1AlternativePhone.value : '',
                                this.props.formValues.g2mobileNumber ? this.props.formValues.g2mobileNumber.value : '',
                                this.props.formValues.g2AlternativePhone ? this.props.formValues.g2AlternativePhone.value : '',
                              ]
                          })
                        ]}
                        buttonLabel={this.state.c2buttonLabel}
                        isButtonLoading={this.state.c2loading}
                        showSuccesIcon={this.state.c2showSuccess}
                        showFailureIcon={this.state.c2showFailure}
                        onButtonClick={() => {
                          this.state.c2buttonLabel === "SEND OTP"
                            ? this.handleSendApi()
                            : this.handleResendApi();
                        }}
                      />
                    </div>
                    {this.props.formValues && this.props.formValues.c2OTP_Status && (
                      <div className="form-group ">
                        <Otp
                          numInputs={4}
                          submitLabel={"submit"}
                          disableSubmit={this.state.c2OTP_submit}
                          mobileNumber={
                            this.props.formValues.c2mobileNumber
                              ? this.props.formValues.c2mobileNumber.value
                              : null
                          }
                          value={this.props.formValues.c2OTP_Value && this.props.formValues.c2OTP_Value.value}
                          handleOtpNumber={this.handleOtpNumber}
                          otpOnchange={this.onchangeOtp}
                          className=""
                        />
                      </div>
                    )}
                    <Field
                      hidden={true}
                      name="c2hiddenOTPStatus"
                      component={TextBox}
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "c2hiddenOTPStatus is required" })
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Address Information"
              sectionKey="c2applicantAddressInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Applicant?<span style={{ color: "red" }}>*</span></span>}
                    name="c2PresentAddressSameAsApplicant"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressSameAsApplicant}
                    validate={[A8V.required({ errorMsg: "PresentAddressSameAsApplicant is required" })]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c2showPresentAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2HouseName"
                        component={TextBox}
                        placeholder="Enter HouseName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "HouseName is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Street/Area"}
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c2StreetArea"
                        component={TextBox}
                        placeholder="Enter Street/Area"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Street is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"City/Village/Town"}
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="c2City"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "City is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c2Pincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxlength="6"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="c2PostOffice"
                        component={Select}
                        placeholder="Select  PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "PostOffice is required" })
                        ]}
                      >
                        {this.state.c2postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c2District"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c2districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c2State"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.c2stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>

                  </React.Fragment>
                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Aadhaar address?<span style={{ color: "red" }}>*</span></span>}
                    name="c2PresentAddressAadhaarSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressAadhaarSame}
                    validate={[A8V.required({ errorMsg: "PresentAddressAadhaarSame is required" })]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c2showPresentAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={" Address ProofType"}
                        label={<span>Address Proof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentAddressType"
                        component={Select}
                        placeholder="Enter Address Proof Type"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Type is required"
                          })
                        ]}
                      >
                        <Option value="Voters ID">Voters ID</Option>
                        <Option value="Ration card">Ration card</Option>
                        <Option value="Passport Valid">Passport Valid</Option>
                        <Option value="BSNL Land Line Bill (Not older than 3 Months)">
                          BSNL Land Line Bill (Not older than 3 Months)
                        </Option>
                        <Option value="Driving License">Driving License</Option>
                        <Option value="Electricity Bill- (not older an 3 Months)">
                          Electricity Bill- (not older an 3 Months)
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={" Address ProofNumber"}
                        label={<span>Address ProofNumber<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentAddressNumber"
                        component={TextBox}
                        placeholder="Enter Address ProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Address ProofNumber is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentHouseName"
                        component={TextBox}
                        placeholder="Enter HouseName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "HouseName is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Street/Area"}
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentStreetArea"
                        component={TextBox}
                        placeholder="Enter Street/Area"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Street is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"City/Village/Town"}
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentCity"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "City is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentPincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxlength="6"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentPostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c2postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c2districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c2permanentState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c2stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c2permanentLandMark"
                        component={TextBox}
                        placeholder="Enter LandMark"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Years in PresentAddress"
                        name="c2permanentYearsPresentAddress"
                        component={Select}
                        placeholder="Select YearsPresentAddress"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "YearsPresentAddress is required"
                          })
                        ]}
                      >
                        <Option value="Greater than 5 Years">
                          Greater than 5 Years
                        </Option>
                        <Option value="Greater than 3 Years,less than equal to 5 Years">
                          Greater than 3 Years less than equal to 5 Years
                        </Option>
                        <Option value="Greater than 2 Years,less than equal to 3 Years">
                          Greater than 2 Years,less than equal to 3 Years
                        </Option>
                        <Option value="Greater than 1 Year,less than equal to 2 Years">
                          Greater than 1 Years,less than equal to 2 Years
                        </Option>
                        <Option value="Less than 1 year">
                          Less than 1 year
                        </Option>
                      </Field>
                    </div>
                  </React.Fragment>
                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Is correspondence address same as Aadhar or present address"
                    label={<span>Is correspondence address same as Permanent address?<span style={{ color: "red" }}>*</span></span>}
                    name="c2permanentCorrespondenceAddressSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.CorrespondenceAddressSame}
                    validate={[
                      A8V.required({
                        errorMsg: "CorrespondenceAddressSame is required"
                      })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c2showCorrespondenceAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> AddressProof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceAddressProofType"
                        component={Select}
                        placeholder="Enter Address Proof Type"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Type is required"
                          })
                        ]}
                      >
                        <Option value="Voters ID">Voters ID</Option>
                        <Option value="Ration card">Ration card</Option>
                        <Option value="Passport Valid">Passport Valid</Option>
                        <Option value="BSNL Land Line Bill (Not older than 3 Months)">
                          BSNL Land Line Bill (Not older than 3 Months)
                        </Option>
                        <Option value="Driving License">Driving License</Option>
                        <Option value="Electricity Bill- (not older an 3 Months)">
                          Electricity Bill- (not older an 3 Months)
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Address ProofNumber<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceAddressProofNumber"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Number is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceHouseName"
                        component={TextBox}
                        placeholder="Enter HouseName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "HouseName is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Street/Area"}
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceStreetArea"
                        component={TextBox}
                        placeholder="Enter Street/Area"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Street/Area is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"City/Village/Town"}
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceCity"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "City is required" }),
                          A8V.address({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondencePincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxlength="6"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondencePostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c2postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c2districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c2stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c2CorrespondenceLandMark"
                        component={TextBox}
                        placeholder="Enter LandMark"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  </React.Fragment>
                )}

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is correspondence address same as Applicant<span style={{ color: "red" }}>*</span></span>}
                    name="c2CorrespondenceAddressSameApplicant"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.CorrespondenceAddressSameAsApplicant}
                    validate={[
                      A8V.required({
                        errorMsg: "CorrespondenceAddressSame is required"
                      })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c2showCorrespondenceAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Correspondence AddressProof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceAddressProofTypeAsApplicant"
                        placeholder="Enter AddressProofType"
                        component={Select}
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Type is required"
                          })
                        ]}
                      >
                        <Option value="Voters ID">Voters ID</Option>
                        <Option value="Ration card">Ration card</Option>
                        <Option value="Passport Valid">Passport Valid</Option>
                        <Option value="BSNL Land Line Bill (Not older than 3 Months)">
                          BSNL Land Line Bill (Not older than 3 Months)
                        </Option>
                        <Option value="Driving License">Driving License</Option>
                        <Option value="Electricity Bill- (not older an 3 Months)">
                          Electricity Bill- (not older an 3 Months)
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Address ProofNumber<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceAddressProofNumberAsApplicant"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "Address Proof Number is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceHouseNameAsApplicant"
                        component={TextBox}
                        placeholder="Enter HouseName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "House No is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceStreetAreaAsApplicant"
                        component={TextBox}
                        placeholder="Enter Street/Area"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "Street/Area is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceCityAsApplicant"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "City/Village/Town is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondencePincodeAsApplicant"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        maxlength="6"
                        onChange={this.handlePincode}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondencePostOfficeAsApplicant"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c2postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceDistrictAsApplicant"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c2districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c2CorrespondenceStateAsApplicant"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c2stateOptions.map(data => (
                          <Option value={data.value}>{data.label}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c2CorrespondenceLandMarkAsApplicant"
                        component={TextBox}
                        placeholder="Enter LandMark"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Employment Information"
              sectionKey="c2applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Occupation Type<span style={{ color: "red" }}>*</span></span>}
                    name="c2OccupationType"
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
                {this.state.c2ShowSalariedFields && (
                  <React.Fragment >
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                        name="c2SlariedTypeofJob"
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
                        label={<span>Experience in Current job<span style={{ color: "red" }}>*</span></span>}
                        name="c2salariedExperienceCurrentJob"
                        component={Select}
                        placeholder="Select Current Experience"
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
                        <Option value="Between3to5years">
                          Between 3 to 5 years
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
                        // label={"Monthly Gross Salary"}
                        label={<span>Monthly Gross Salary<span style={{ color: "red" }}>*</span></span>}
                        name="c2salariedMonthlyGrossSalary"
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
                        // label={"Monthly Fixed Obligation"}
                        label={<span>Monthly Fixed Obligation<span style={{ color: "red" }}>*</span></span>}
                        name="c2salariedMonthlyFixedObligation"
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
                        name="c2salariedGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        // normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
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
                      />
                    </div>
                    <div>
                      <label>
                        <strong> Work Address Information</strong>
                      </label>
                      <div className="flex-row">
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Name<span style={{ color: "red" }}>*</span></span>}
                            name="c2salariedOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address No<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedStreetArea"
                            component={TextBox}
                            placeholder="Enter Street/Area"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedPincode"
                            component={TextBox}
                            placeholder="Enter Pincode"
                            normalize={proceedNumber}
                            onChange={this.handlePincode}
                            maxlength="6"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Pincode is required" })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c2postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c2districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c2SalariedState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c2stateOptions.map(data => (
                              <Option value={data.state_name}>{data.state_name}</Option>
                            ))}
                          </Field>
                        </div>

                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </React.Fragment>
                )}

                {/* if business */}
                {this.state.c2showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Business<span style={{ color: "red" }}>*</span></span>}
                        name="c2BusinessType"
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
                        label={<span>Business Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2BusinessName"
                        component={TextBox}
                        placeholder="Enter Business Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "BusinessName is required" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Constitution<span style={{ color: "red" }}>*</span></span>}
                        name="c2Constitution"
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
                        label={<span>Business Structure<span style={{ color: "red" }}>*</span></span>}
                        name="c2BusinessStructure"
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
                        label={<span>Business Model<span style={{ color: "red" }}>*</span></span>}
                        name="c2BusinessModel"
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
                        label={<span>When was the business started?<span style={{ color: "red" }}>*</span></span>}
                        name="c2BusinessStartDate"
                        component={DatePicker}
                        placeholder="Select start date"
                        selected={this.state.startDate}
                        dateFormat="DD/MM/YYYY"
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
                        name="c2BusinessAge"
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
                        label={<span>Number of employees<span style={{ color: "red" }}>*</span></span>}
                        name="c2businessEmployeeCount"
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
                        label={<span>Total Years of Experience in Current Business<span style={{ color: "red" }}>*</span></span>}
                        name="c2CurrentBusinessExp"
                        component={Select}
                        placeholder="Select Current Experience"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: "CurrentBusinessExp is required"
                          })
                        ]}
                      >
                        <Option value="10yearsandAbove">
                          10 years and above
                        </Option>
                        <Option value="Between5to10years">
                          Between 5 to 10 years
                        </Option>
                        <Option value="Between3to5years">
                          Between 3 to 5 years
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
                        label={<span>Annual Turnover<span style={{ color: "red" }}>*</span></span>}
                        name="c2businessAnnualTurnover"
                        component={Select}
                        placeholder="Select Annual Turnover"
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
                        label={<span>Monthly Gross Salary<span style={{ color: "red" }}>*</span></span>}
                        name="c2businessMonthlyGrossSalary"
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
                        label={<span>Monthly Fixed Obligation<span style={{ color: "red" }}>*</span></span>}
                        name="c2businessMonthlyFixedObligation"
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
                        name="c2businessGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="c2businessNetAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                      />
                    </div>
                    <div>
                      <label>
                        <strong> Work Address Information</strong>
                      </label>
                      <div className="flex-row">
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Name<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Office Name is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address No<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Office Address No is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessStreetArea"
                            component={TextBox}
                            placeholder="Enter Street/Area"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Street is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "City/Village/Town is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessPincode"
                            component={TextBox}
                            placeholder="Enter Pincode"
                            normalize={proceedNumber}
                            onChange={this.handlePincode}
                            maxlength="6"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Pincode is required" })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c2postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c2districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c2businessState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c2stateOptions.map(data => (
                              <Option value={data.state_name}>{data.state_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
                {/* if others */}
                {this.state.c2showOthersFields &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                      name="c2JobType"
                      component={Select}
                      placeholder="Select Job Type"
                      onChange={this.handleOtherJobType}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "JobType is required" })
                      ]}
                    >
                      <Option value="SelfEmployed">Self Employed</Option>
                      <Option value="Wages">Wages</Option>
                      <Option value="Employedlocally??">Employed locally??</Option>
                      <Option value="HomeMaker">Home Maker</Option>
                      <Option value="Student">Student</Option>
                      <Option value="NRI">NRI</Option>
                    </Field>
                  </div>
                }
                {this.state.c2showJobTypeFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Total Years of Experience in Current job<span style={{ color: "red" }}>*</span></span>}
                        name="c2ExperienceCurrentJob"
                        component={Select}
                        placeholder="Select Current Experience"
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
                        <Option value="Between3to5years">
                          Between 3 to 5 years
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
                        // label={"Daily Income"}
                        label={<span>Daily Income<span style={{ color: "red" }}>*</span></span>}
                        name="c2othersDailyIncome"
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
                        // label={"Average no. of working days"}
                        label={<span>Average no. of working days<span style={{ color: "red" }}>*</span></span>}
                        name="c2othersWorkingDayCount"
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
                        label={<span>Monthly Gross Salary<span style={{ color: "red" }}>*</span></span>}
                        name="c2othersGrossMonthlyIncome"
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
                        label={<span>Monthly Fixed Obligation<span style={{ color: "red" }}>*</span></span>}
                        name="c2othersMonthlyFixedObligation"
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
                        label={"Gross Annual Income"}
                        name="c2OthersGrossAnnualSalary"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        normalize={inrFormat}
                        hasFeedback
                        className="form-control-custom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Net Annual Income"}
                        name="c2NetAnnualIncomeOthers"
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
                    <div>
                      <label>
                        <strong> Work Address Information</strong>
                      </label>
                      <div className="flex-row">
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Name<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Office Name is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address No<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Office address is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrStreetArea"
                            component={TextBox}
                            placeholder="Enter Street/Area"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Street/Area is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "City is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrPincode"
                            component={TextBox}
                            placeholder="Enter Pincode"
                            normalize={proceedNumber}
                            onChange={this.handlePincode}
                            maxlength="6"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Pincode is required" })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c2postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c2districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c2othrState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c2stateOptions.map(data => (
                              <Option value={data.state_name}>{data.state_name}</Option>
                            ))}
                          </Field>
                        </div>

                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <div className="form-group ">
                  <div>
                    <label>
                      <strong style={{ marginLeft: "10px" }}>
                        Address to be Verified
                              </strong>
                    </label>
                    <Checkbox.Group style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox" options={c2addressOptions}
                      defaultValue={this.props.formValues.c2Addr_selectedValue ? JSON.parse(this.props.formValues.c2Addr_selectedValue.value) : ""} onChange={this.handleAddressVerification} validate={[A8V.required({ errorMsg: "c2VerifyAddress is required" })]} />
                  </div>
                  <Field
                    hidden={true}
                    name="c2VerifyAddress"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "c2VerifyAddress is required" })
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.renderMembers()}
          {(!this.props.formValues.c2JobType ||
            (this.props.formValues.c2JobType &&
              this.props.formValues.c2JobType.value !== "HomeMaker" &&
              this.props.formValues.c2JobType.value !== "Student")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"FOIR Calculation"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  {this.state.c2showFoirProgress && (
                    <div style={{ width: "100%" }}>
                      {this.state.c2foirValue > 60 && (<React.Fragment>
                        {this.props.formValues && this.props.formValues.c2FoirValue &&
                          <div style={{ float: "right" }} >
                            <Card
                              title="FOIR SCORE"
                              size="small"
                              headStyle={{
                                textAlign: "center",
                                fontSize: "smaller"
                              }}
                              bodyStyle={{
                                fontSize: "larger",
                                marginTop: "-10px",
                                textAlign: "center"
                              }}
                              bordered={false}
                              style={{
                                width: 102,
                                height: "72px",
                                backgroundColor: "#f5f5f5",
                                borderRadius: 15
                              }}
                            >
                              <p>{this.props.formValues.c2FoirValue.value}/100</p>
                            </Card>
                          </div>
                        }
                        <Result
                          icon={<Icon type="dislike" theme="twoTone" />}
                          title="Oops, Not Eligible to proceed with CRIF!"
                        />
                        <div style={{ textAlign: "justify" }}>
                          <Button
                            className="api-button"
                            type="danger"
                            size="default"
                            style={{
                              marginTop: 29,
                              marginBottom: 29,
                              marginLeft: 29
                            }}
                            onClick={() => this.handleFoirCalculation()}
                          >
                            Recalcuate FOIR
                        </Button>
                        </div>
                      </React.Fragment>
                      )}
                      {this.state.c2foirValue <= 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.c2FoirValue &&
                            <div style={{ float: "right" }}>
                              <Card
                                title="FOIR SCORE"
                                size="small"
                                headStyle={{
                                  textAlign: "center",
                                  fontSize: "smaller"
                                }}
                                bodyStyle={{
                                  fontSize: "larger",
                                  marginTop: "-10px",
                                  textAlign: "center"
                                }}
                                bordered={false}
                                style={{
                                  width: 102,
                                  height: "72px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: 15
                                }}
                              >
                                <p>{this.props.formValues.c2FoirValue.value}/100</p>
                              </Card>
                            </div>
                          }
                          <Result
                            icon={<Icon type="like" theme="twoTone" />}
                            title="Great, We are ready to proceed with CRIF!"
                          />
                          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <Button
                              className="api-button"
                              type="danger"
                              size="default"
                              // disabled={true}

                              style={{
                                marginTop: 29,
                                marginBottom: 29,
                                marginLeft: 29
                              }}
                              onClick={() => this.handleCRIF()}
                              loading={this.state.c2HighMarkScoreloading}
                            >
                              Generate CRIF Details
                        </Button>
                          </div>
                        </React.Fragment>

                      }
                    </div>
                  )}
                  {this.state.c2errorMessage && (
                    <p style={{ color: "red" }}>{this.state.c2errMsg}</p>
                  )}
                  {this.state.c2showFoirButton && (
                    <div className="form-group col-xs-6 col-md-4" style={{ textAlign: "center" }}>
                      <Button
                        className="api-button"
                        type="danger"
                        size="default"
                        style={{
                          marginTop: 29,
                          marginBottom: 29,
                          marginLeft: 29
                        }}
                        onClick={() => this.handleFoirCalculation()}
                      >
                        Calcuate FOIR{" "}
                      </Button>
                      <Field
                        hidden={true}
                        name="c2FoirValue"
                        component={TextBox}
                        type="text"
                        className=" form-control-custom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>}

          {this.props.formValues.c2JobType &&
            (this.props.formValues.c2JobType.value === "HomeMaker" ||
              this.props.formValues.c2JobType.value === "Student") &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{" Generate CRIF "}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      // disabled={true}
                      style={{
                        marginTop: 29,
                        marginBottom: 29,
                        marginLeft: 29
                      }}
                      onClick={() => this.handleCRIF()}
                      loading={this.state.c2HighMarkScoreloading}
                    > Generate CRIF Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.c2getHighMarkDone && (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="CRIF HighMark"
                sectionKey="CRIFScore"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              // initialTab={true}
              />
              <div
                className="form-section-content"
                style={{ display: "block" }}
              >
                <div className="flex-row">
                  <div
                    className="form-group col-xs-12 col-md-12"
                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly"
                      }}
                    >
                      <ReactSpeedometer
                        value={this.state.HighMarkScore}
                        minValue={-1}
                        maxValue={900}
                        width={300}
                        height={175}
                        customSegmentStops={[-1, 250, 500, 750, 900]}
                        segmentColors={[
                          "#ff0000",
                          "#fadb14",
                          "#bae637",
                          "#5b8c00"
                        ]}
                        ringWidth={15}
                        startColor={"#ff0000"}
                        endColor={"#00ff00"}
                        needleTransitionDuration={2000}
                        currentValueText={`HighMark Score: ${this.state.HighMarkScore}`}
                      />
                    </div>
                    <Collapse
                      bordered={false}
                      expandIconPosition={"right"}
                    >
                      <Panel
                        header={this.ScoreCardHeader(
                          "contacts",
                          "Personal Information"
                        )}
                        key="1"
                      >
                        {this.renderPersonalInfoDetails()}
                        {this.renderDocumentDetails()}
                      </Panel>
                      <Panel
                        header={this.ScoreCardHeader(
                          "phone",
                          "Contact Information"
                        )}
                        key="2"
                      >
                        {this.renderAddressDetails()}

                        {this.renderTelephoneNumbers()}
                        {this.renderEmailDetails()}
                      </Panel>
                      <Panel
                        header={this.ScoreCardHeader(
                          "shop",
                          " Employment Information"
                        )}
                        key="3"
                      >
                        {this.renderEmploymentInformation()}
                      </Panel>
                      <Panel
                        header={this.ScoreCardHeader(
                          "account-book",
                          "Account Information"
                        )}
                        key="4"
                      >
                        <ul className="pannalclassname">
                          <div
                            className="tab-content-in"
                            style={{ paddingLeft: "15px" }}
                          >
                            <h2> Account Information</h2>
                            <div
                              className="row"
                              style={{ paddingLeft: "15px" }}
                            >
                              <SectionInsideCard
                                label="Account Type"
                                value="Home loan"
                                col="2"
                              />
                              <SectionInsideCard
                                label="date reported"
                                value="10 jan 2019"
                                col="2"
                              />
                              <SectionInsideCard
                                label="occupation"
                                value="salaried"
                                col="2"
                              />
                              <SectionInsideCard
                                label="income"
                                value="Rs.1,56,000"
                                col="2"
                              />
                              <SectionInsideCard
                                label="frecuency"
                                value="Monthly"
                                col="2"
                              />
                              <SectionInsideCard
                                label="income indicator"
                                value="Net"
                                col="2"
                              />
                            </div>
                          </div>
                        </ul>
                        <ul className="pannalclassname">
                          <div
                            className="tab-content-in"
                            style={{ paddingLeft: "15px" }}
                          >
                            <h2> Account status</h2>
                            <div
                              className="row"
                              style={{ paddingLeft: "15px" }}
                            >
                              <SectionInsideCard
                                label="Account status"
                                value="Home loan"
                                col="2"
                              />
                              <SectionInsideCard
                                label="credit limit"
                                value="10 jan 2019"
                                col="2"
                              />
                              <SectionInsideCard
                                label="high credit"
                                value="Salaried"
                                col="2"
                              />
                              <SectionInsideCard
                                label="current balance"
                                value="Rs.1,56,000"
                                col="2"
                              />
                              <SectionInsideCard
                                label="cash limit"
                                value="Monthly"
                                col="2"
                              />
                              <SectionInsideCard
                                label="account overdue"
                                value="Net"
                                col="2"
                              />
                              <SectionInsideCard
                                label="rate of interest"
                                value="Monthly"
                                col="2"
                              />
                              <SectionInsideCard
                                label="repayment frequency"
                                value="Net"
                                col="2"
                              />
                              <SectionInsideCard
                                label="emi amount"
                                value="Monthly"
                                col="2"
                              />
                              <SectionInsideCard
                                label="payment frequency"
                                value="Net"
                                col="2"
                              />
                              <div
                                className="row"
                                style={{ paddingLeft: "15px" }}
                              >
                                <SectionInsideCard
                                  label="accual payment account"
                                  value="Monthly"
                                  col="1"
                                />
                              </div>
                            </div>
                          </div>
                        </ul>
                        <ul className="pannalclassname">
                          <div
                            className="tab-content-in"
                            style={{ paddingLeft: "15px" }}
                          >
                            <h2>Collateral</h2>
                            <div
                              className="row"
                              style={{ paddingLeft: "15px" }}
                            >
                              <SectionInsideCard
                                label="value of collateral"
                                value="10,00,000"
                                col="2"
                              />
                              <SectionInsideCard
                                label="type of colateral"
                                value="Document"
                                col="2"
                              />
                              <SectionInsideCard
                                label="suit status"
                                value="suit filed"
                                col="2"
                              />
                              <SectionInsideCard
                                label="settled status"
                                value="Written-off"
                                col="2"
                              />
                            </div>
                          </div>
                        </ul>
                      </Panel>
                      <Panel
                        header={this.ScoreCardHeader(
                          "question-circle",
                          "Enquiry Information"
                        )}
                        key="5"
                      >
                        <ul className="pannalclassname">
                          <div
                            className="tab-content-in"
                            style={{ paddingLeft: "15px" }}
                          >
                            {/* <h2></h2> */}
                            <br />
                            <div
                              className="row"
                              style={{ paddingLeft: "15px" }}
                            >
                              <SectionInsideCard
                                label="Member name"
                                value="ICICI Bank"
                                col="2"
                              />
                              <SectionInsideCard
                                label="date of enquiry"
                                value="10 jan 2019"
                                col="2"
                              />
                              <SectionInsideCard
                                label="enquiry purpose"
                                value="Credit Card"
                                col="2"
                              />
                              <SectionInsideCard
                                label="enquiry amount"
                                value="Rs.1,56,000"
                                col="2"
                              />
                            </div>
                          </div>
                        </ul>
                      </Panel>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          )}



          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Banking History with ESAF "
              sectionKey="c2applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is Applicant banking with ESAF?<span style={{ color: "red" }}>*</span></span>}
                    name="c2ESAFCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.esafCustomerChange}
                    validate={[
                      A8V.required({ errorMsg: "ESAFCustomer is required" })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.props.formValues.c2ESAFCustomer &&
                  this.props.formValues.c2ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Branch Name<span style={{ color: "red" }}>*</span></span>}
                        name="c2BranchName"
                        component={TextBox}
                        placeholder="Enter BranchName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "Branch Name is required" })]}
                      />
                    </div>
                  )}
                {this.props.formValues.c2ESAFCustomer &&
                  this.props.formValues.c2ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Number<span style={{ color: "red" }}>*</span></span>}
                        name="c2AccountNumber"
                        component={TextBox}
                        placeholder="Enter AccountNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "Account Number is required" })]}
                      />
                    </div>
                  )}
                {this.props.formValues.c2ESAFCustomer &&
                  this.props.formValues.c2ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Type<span style={{ color: "red" }}>*</span></span>}
                        name="c2AccountType"
                        component={Select}
                        placeholder="Select AccountType"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "Account Type is required" })]}
                      >
                        <Option value="Savings">Savings</Option>
                        <Option value="Current">Current</Option>
                      </Field>
                    </div>
                  )}
                {this.props.formValues.c2ESAFCustomer &&
                  this.props.formValues.c2ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>IFSCCode<span style={{ color: "red" }}>*</span></span>}
                        name="c2IFSCCode"
                        component={TextBox}
                        placeholder="Enter IFSCCode(CASE-SENSITIVE)"
                        onChange={this.handleIFSCcode}
                        maxlength="11"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "IFSCCode is required" })]}
                      />
                    </div>
                  )}
                {this.props.formValues.c2ESAFCustomer &&
                  this.props.formValues.c2ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Banking Since<span style={{ color: "red" }}>*</span></span>}
                        name="c2BankingHistory"
                        component={Select}
                        placeholder="Select BankingHistory"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "Banking Since is required" })]}
                      >
                        <Option value="<1 year">Less than 1 year</Option>
                        <Option value="1-2 years">1-2 years</Option>
                        <Option value="2-3 years">2-3 years</Option>
                        <Option value="3-5 years">3-5 years</Option>
                        <Option value=">5 years">Greater than 5 years</Option>
                      </Field>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("++++++State of Co2_Applicant Basic++++++", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessNew")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessNew")(state)
  };
};

export default connect(mapStateToProps, {})(TabCoApplicantNew2);


const SectionInsideCard = ({ label, value, col }) => {
  return (
    <div className={col === "3" ? "common-col-div-1" : "common-col-div"}>
      <p className="text-label">{label}</p>
      <p style={{ marginBottom: "15px" }}>
        <strong>{value}</strong>
      </p>
    </div>
  );
};
