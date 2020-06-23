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
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
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
import classname from "classnames";

const { Panel } = Collapse;
const { Option } = SelectHelper;

class TabCoApplicantNew1 extends React.Component {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      c1FormScanner: [],
      c1FormScannerQR: [],
      c1applicantIdentInfo: [
        "c1ApplicantID",
        "c1BorrowerType",
        "c1relationShipWithApplicant",
        "c1existingCustomer"
      ],
      c1applicantBasicInfo: [
        "c1FirstName",
        "c1LastName",
        "c1Gender",
        "c1Salutation",
        "c1DateOfBirth",
        "c1VoterID"
      ],
      c1applicantKYC: [
        "c1kycstatus",
        "c1AadhaarName",
        "c1AadhaarNo",
        "c1AadhaarDOB",
        "c1DL_DateOfBirth",
        "c1DL_IssueDate",
        "c1DL_ExpiryDate",
        "c1DL_Number",
        "c1panName",
        "c1panNo",
        "c1panDOB",
        "c1panFatherName",
        "c1passportType",
        "c1passportNo",
        "c1passport_IssueDate",
        "c1passport_ExpiryDate",
        "c1VoterIDNumber",
        "c1VoterIDName",
        "c1VoterIDFatherName",
      ],
      c1applicantEmpInfo: [
        "c1OccupationType",
        "c1SlariedTypeofJob",
        "c1salariedExperienceCurrentJob",
        "c1salariedMonthlyGrossSalary",
        "c1salariedMonthlyFixedObligation",
        "c1salariedOfficeName",
        "c1SalariedOfficeNo",
        "c1SalariedStreetArea",
        "c1SalariedCity",
        "c1SalariedDistrict",
        "c1SalariedState",
        "c1SalariedPincode",
        "c1SalariedPostOffice",
        "c1BusinessType",
        "c1BusinessName",
        "c1Constitution",
        "c1BusinessStructure",
        "c1BusinessModel",
        "c1BusinessStartDate",
        "c1businessEmployeeCount",
        "c1CurrentBusinessExp",
        "c1businessAnnualTurnover",
        "c1businessMonthlyGrossSalary",
        "c1businessMonthlyFixedObligation",
        "c1businessOfficeName",
        "c1businessOfficeNo",
        "c1businessStreetArea",
        "c1businessCity",
        "c1businessDistrict",
        "c1businessState",
        "c1businessPincode",
        "c1businessPostOffice",
        "c1JobType",
        "c1ExperienceCurrentJob",
        "c1othersDailyIncome",
        "c1othersWorkingDayCount",
        "c1othersGrossMonthlyIncome",
        "c1othersMonthlyFixedObligation",
        "c1othrOfficeName",
        "c1othrOfficeNo",
        "c1othrStreetArea",
        "c1othrCity",
        "c1othrDistrict",
        "c1othrState",
        "c1othrPincode",
        "c1othrPostOffice",
        "c1c1VerifyAddress"
      ],
      c1applicantExtraOrdinaryExpense: [
        "c1ExtraExpenseType",
        "c1ExpenseValue",
        "c1members"
      ],
      c1foirCalculation: [""],
      c1CRIFScore: [""],
      c1applicantDetailedInfo: [
        "c1AlternativePhone",
        "c1Citizenship",
        "c1ResidencyStatus",
        "c1Religion",
        "c1Caste",
        "c1MaritalStatus",
        "c1EducationLevel",
        "c1FatherName",
        "c1SpouseName",
        "c1ApplicantMBCustomer"
      ],

      c1applicantOtpVerification: ["c1otpmobileNumber", "c1hiddenOTPStatus"],
      c1applicantAddressInfo: [
        "c1permanentAddressType",
        "c1permanentAddressNumber",
        "c1permanentAddressProofNumber",
        "c1HouseName",
        "c1StreetArea",
        "c1City",
        "c1District",
        "c1State",
        "c1Pincode",
        "c1PostOffice",
        "c1District",
        "c1State",
        "c1permanentHouseName",
        "c1permanentStreetArea",
        "c1permanentCity",
        "c1permanentPincode",
        "c1permanentPostOffice",
        "c1permanentDistrict",
        "c1permanentState",
        "c1CorrespondenceAddressProofType",
        "c1CorrespondenceAddressProofNumber",
        "c1CorrespondenceHouseName",
        "c1CorrespondenceStreetArea",
        "c1CorrespondenceCity",
        "c1CorrespondencePincode",
        "c1CorrespondencePostOffice",
        "c1CorrespondenceDistrict",
        "c1CorrespondenceState",
        "c1CorrespondenceAddressProofTypeAsApplicant",
        "c1CorrespondenceAddressProofNumberAsApplicant",
        "c1CorrespondenceHouseNameAsApplicant",
        "c1CorrespondenceStreetAreaAsApplicant",
        "c1CorrespondenceCityAsApplicant",
        "c1CorrespondencePostOfficeAsApplicant",
        "c1CorrespondenceDistrictAsApplicant",
        "c1CorrespondenceStateAsApplicant",
        "c1CorrespondencePincodeAsApplicant",
        "c1PresentAddressAadhaarSame",
        "c1PresentAddressSameAsApplicant",
        "c1permanentCorrespondenceAddressSame",
        "c1CorrespondenceAddressSameApplicant",
      ],
      c1applicantBankingHistory: [
        "c1ESAFCustomer",
        "c1BranchName",
        "c1AccountNumber",
        "c1AccountType",
        "c1IFSCCode",
        "c1BankingHistory"
      ],
    },
    c1showSalariedFields: false,
    c1salariedMonthlySalary: "",
    c1showBusinessFields: false,
    c1businessMonthlySalary: "",
    c1showOthersFields: false,
    c1showJobTypeFields: false,
    c1showResidencyStatus: false,
    c1veh_InsuranceAmount: 0,
    c1veh_showRoomPrice: 0,
    c1veh_roadTax: 0,
    c1veh_othersAmt: 0,
    c1startDate: "",
    c1Age: "",
    c1dayCount: "",
    c1CustomerAccountNumber: "",
    c1responseData: {},
    c1mappedJson: {},
    c1loantypeOptions: [],
    c1loanSubtypeOptions: [],
    c1stateOptions: [],
    c1StateOptions: [],
    c1postOfficeOptions: [],
    c1districtOptions: [],
    c1religionOptions: [],
    c1educationOptions: [],
    c1casteOptions: [],
    c1maritalStatusOptions: [],
    c1citizenshipOptions: [],
    c1showFoirProgress: false,
    c1showFoirButton: true,
    c1ifsc: "",
    c1otp: "",
    c1voterNo: "",
    c1verifyOTP: "",
    c1mobileNumber: "",
    c1otpPinID: "",
    c1OTP_submit: false,
    c1showFailure: false,
    c1showVerifiedCheck: false,
    c1showVerifiedUncheck: false,
    c1otpSent: false,
    c1buttonLabel: "SEND OTP",
    c1loading: false,
    c1showSuccess: false,
    c1showOTPverification: false,
    c1InsuranceAmount: "",
    c1monthlyIncomeOthers: "",
    c1salObligationValue: "",
    c1busiObligationValue: "",
    c1othersObligationValue: "",
    c1foirValue: "",
    c1HighMarkScoreloading: false,
    c1getHighMarkDone: false,
    c1HighMarkScore: 0,
    c1pincode: "",
    c1errorMessage: "",
    c1errMsg: "",
  };

  componentDidMount() {
    //Generate ApplicationID
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
    //       c1loantypeOptions: loanTypeDD
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
        this.setState({ c1educationOptions: educationDD });
      })
      .catch(error => {
        console.log(error);
      });
    // caste options
    let casteConfig = {
      url:
        `${Config.apiUrl}/v1/caste`,
      method: "get",
      headers: {
        Authorization: authToken,
      },
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
        this.setState({ c1casteOptions: casteDD });
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
        this.setState({ c1maritalStatusOptions: maritalStatusDD });
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
        this.setState({ c1religionOptions: religionDD });
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
    //       c1StateOptions: stateDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    //countries Opttions
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
    //     this.props.fieldPopulator("c1Citizenship", { type: "String", value: "India", valueInfo: {} });
    //     this.setState({ c1citizenshipOptions: citizenDD });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.props.fieldPopulator("c1Citizenship", { type: "String", value: "India", valueInfo: {} });
    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.c1OccupationType &&
      this.props.formValues.c1OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.c1OccupationType);
      if (this.props.formValues.c1JobType) {
        this.handleOtherJobType(this.props.formValues.c1JobType);
      }
    }
    if (this.props.formValues &&
      this.props.formValues.c1OTP_Value &&
      this.props.formValues.c1OTP_Value.value !== "") {
      if (this.props.formValues.c1hiddenOTPStatus &&
        this.props.formValues.c1hiddenOTPStatus.value === "true") {
        this.setState({ c1OTP_submit: true, c1showSuccess: true, c1buttonLabel: "Verified", otp: this.props.formValues.c1OTP_Value.value });
      } else if (this.props.formValues.c1hiddenOTPStatus &&
        this.props.formValues.c1hiddenOTPStatus.value === "false") {
        this.setState({ c1OTP_submit: false, c1showFailure: true, c1buttonLabel: "Resend OTP", c1otp: this.props.formValues.c1OTP_Value.value });
      }
    }

    if (
      this.props.formValues &&
      this.props.formValues.c1LoanType &&
      this.props.formValues.c1LoanType.value !== ""
    ) {
      this.loanTypeChange(this.props.formValues.c1LoanType);
    }

    if (!validate.isEmpty(this.props.formValues && this.props.formValues.c1HighMarkData)) {
      let HighMarkData = this.props.formValues.c1HighMarkData.value;
      if (HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
        let errMsg = HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
        this.setState({
          c1getHighMarkDone: true,
          c1HighMarkScoreloading: false,
          c1HighMarkScore: -1,
          c1showFoirButton: false,
          c1HighMarkApiData: HighMarkData,
          c1errorMessage: false,
          c1errMsg: errMsg,
          c1showFoirProgress: true,
          c1foirValue: this.props.formValues.c1FoirValue ? this.props.formValues.c1FoirValue.value : 0
        })
      } else {
        let HighMarkScore = HighMarkData.ResponseXML.BureauResponse.ScoreDetails.score.value;
        this.setState({
          c1getHighMarkDone: true,
          c1HighMarkScoreloading: false,
          c1HighMarkScore: HighMarkScore,
          c1HighMarkApiData: HighMarkData,
          c1errorMessage: false,
          c1showFoirProgress: true,
          c1showFoirButton: false,
          c1foirValue: this.props.formValues.c1FoirValue ? this.props.formValues.c1FoirValue.value : 0
        });
      }
    }
  }
  handleOccupationType = e => {
    if (e.value === "Salaried") {
      this.setState({
        c1showSalariedFields: true,
        c1showBusinessFields: false,
        c1showOthersFields: false
      });
    } else if (e.value === "Business") {
      this.setState({
        c1showSalariedFields: false,
        c1showBusinessFields: true,
        c1showOthersFields: false
      });
    } else if (e.value === "Others") {
      this.setState({
        c1showSalariedFields: false,
        c1showBusinessFields: false,
        c1showOthersFields: true
      });
    }
  };

  handleOtherJobType = (e) => {
    if (e.value === "Student" || e.value === "HomeMaker") {
      this.setState({
        c1showJobTypeFields: false,
      });
    } else {
      this.setState({
        c1showJobTypeFields: true,
      });
    }
  }
  handleApplicationID = () => {
    let StateCode = "KL";
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
      "COA_1" + StateCode + currentYear + currentMonth + currentDate;
    let apIDs = { type: "String", value: applicationNumber };
    this.props.fieldPopulator("c1ApplicationID", apIDs);
  };
  citizenshipChange = value => {
    if (value && value.value === "India") {
      this.setState({ showResidencyStatus: false });
    } else {
      this.setState({ showResidencyStatus: true });
    }
  };
  handleChange_age = e => {
    let age = moment().diff(e.value, 'years');
    this.props.fieldPopulator("c1Age", {
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
    this.setState({ c1startDate: selected, Age: age });
    this.props.fieldPopulator("c1BusinessAge", bsDate);
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
    this.setState({ c1salariedMonthlySalary: salariedmonthly });
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross };
    if (!this.props.formValues.c1salariedMonthlyFixedObligation) {
      this.setState({ c1salariedAnnualIncome: salariedGross });
      this.props.fieldPopulator("c1salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.c1salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.c1salObligationValue;
      let netIncome = this.displayINRformat(
        salariedGross.replace(/,/g, "") - salariedObligationValue * 12
      );
      let net = { type: "String", value: netIncome };
      this.props.fieldPopulator("c1salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("c1salariedNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationSalaried = value => {
    let enteredValue = value.value;
    let salariedObligation = enteredValue.replace(/,/g, "");
    let monthlySurplus = this.props.formValues.c1salariedMonthlyGrossSalary
      .value;
    let salariedMonthlySurplus = this.displayINRformat(
      monthlySurplus.replace(/,/g, "") - salariedObligation
    );
    this.setState({ c1salObligationValue: salariedObligation });
    let salariedGrossAnnual = this.props.formValues.c1salariedGrossAnnualIncome
      .value;
    let salariednetIncome = this.displayINRformat(
      salariedGrossAnnual.replace(/,/g, "") - salariedObligation * 12
    );
    let net = { type: "String", value: salariednetIncome };
    let surplus = { type: "String", value: salariedMonthlySurplus };
    this.props.fieldPopulator("c1salariedNetAnnualIncome", net);
    this.props.fieldPopulator("c1salariedMonthlySurplus", surplus);
  };
  businesshandleMonthlySalary = e => {
    let businessmonthly = e.value.replace(/,/g, "");
    this.setState({ c1businessMonthlySalary: businessmonthly });
    let businessGross = this.displayINRformat(
      businessmonthly * 12);
    let gross = { type: "String", value: businessGross };
    this.props.fieldPopulator("c1businessGrossAnnualIncome", gross);
    if (this.props.formValues.c1businessMonthlyFixedObligation) {
      let businessObligation = this.state.c1busiObligationValue;
      let netIncomeBusiness = this.displayINRformat(
        businessGross.replace(/,/g, "") - businessObligation * 12
      );
      let net = { type: "String", value: netIncomeBusiness };
      this.props.fieldPopulator("c1businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("c1businessNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationBusiness = value => {
    let enteredValue = value.value;
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ c1busiObligationValue: businessObligation });
    let monthlySalary = this.state.c1businessMonthlySalary;
    let BusinessMonthlySurplus = this.displayINRformat(
      monthlySalary - businessObligation
    );
    let businessGrossAnnual = this.props.formValues.c1businessGrossAnnualIncome
      .value;
    let businessnetIncome = this.displayINRformat(
      businessGrossAnnual.replace(/,/g, "") - businessObligation * 12
    );
    let surplus = { type: "String", value: BusinessMonthlySurplus };
    let net = { type: "String", value: businessnetIncome };
    this.props.fieldPopulator("c1TotalMonthlySurplus", surplus);
    this.props.fieldPopulator("c1businessNetAnnualIncome", net);
  };
  handlemonthlyObligationOthers = value => {
    let enteredValue = value.value;
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ c1othersObligationValue: othersObligation });
    let othersGrossMonthly = this.props.formValues.c1othersGrossMonthlyIncome
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
    this.props.fieldPopulator("c1NetAnnualIncomeOthers", net);
    this.props.fieldPopulator("c1othersMonthlySurplus", surplus);
  };
  handleDailyIncomeChange = e => {
    let OthersdailyIncome = e.value.replace(/,/g, "");
    this.setState({ c1monthlyIncomeOthers: OthersdailyIncome });
    if (!this.props.formValues.c1othersWorkingDayCount) {
      this.props.fieldPopulator("c1othersGrossMonthlyIncome", { type: "String", value: "" });
    } else {
      let daycountValue = this.props.formValues.c1othersWorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(
        OthersdailyIncome * daycountValue
      );
      let gross = { type: "String", value: MonthlyGross };
      let obligationOthers = this.state.c1othersObligationValue;
      let othersGrossAnnual = MonthlyGross * 12;
      let othersnetIncome = this.displayINRformat(
        othersGrossAnnual - obligationOthers * 12
      );
      let net = { type: "String", value: othersnetIncome };
      this.props.fieldPopulator("c1OthersGrossAnnualSalary", { type: 'String', value: othersGrossAnnual })
      this.props.fieldPopulator("c1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c1NetAnnualIncomeOthers", net);
    }
  };
  handleDayCount = value => {
    let enteredValue = value.value;
    let dayCount = enteredValue;
    let MonthlyGrossIncome = this.displayINRformat(
      this.props.formValues.c1othersDailyIncome.value.replace(/,/g, "") *
      dayCount
    );
    let grossAnnual = this.displayINRformat(this.props.formValues.c1othersDailyIncome.value.replace(/,/g, "") * dayCount * 12)
    let gross = { type: "String", value: MonthlyGrossIncome };
    if (!this.props.formValues.c1othersMonthlyFixedObligation) {
      this.props.fieldPopulator("c1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c1OthersGrossAnnualSalary", { type: 'String', value: grossAnnual })
    } else {
      let obliqothr = this.props.formValues.c1othersMonthlyFixedObligation.value.replace(
        /,/g,
        ""
      );
      let annualIncomeOthers = MonthlyGrossIncome * 12;
      let netAnnualOthers = this.displayINRformat(
        annualIncomeOthers - obliqothr * 12
      );
      let net = { type: "String", value: netAnnualOthers };
      this.props.fieldPopulator("c1OthersGrossAnnualSalary",
        { type: 'String', value: annualIncomeOthers })
      this.props.fieldPopulator("c1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c1NetAnnualIncomeOthers", net);
    }
  };
  handleFoirCalculation = () => {
    let i;
    if (
      this.props.formValues.c1OccupationType &&
      this.props.formValues.c1OccupationType.value === "Salaried"
    ) {
      let Foirobligation = this.props.formValues
        .c1salariedMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c1salariedMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c1members &&
        this.props.formValues.c1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c1members.value.length; i++) {
          let salariedMemberExpense = this.props.formValues.c1members.value[i].ExpenseValue.value;
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
        this.setState({ c1foirValue: membertotalFoir });
        this.props.fieldPopulator("c1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c1foirValue: totalFoir });
        this.props.fieldPopulator("c1FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c1showFoirButton: false, c1showFoirProgress: true });
    }
    if (
      this.props.formValues.c1OccupationType &&
      this.props.formValues.c1OccupationType.value === "Business"
    ) {
      let Foirobligation = this.props.formValues
        .c1businessMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c1businessMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c1members &&
        this.props.formValues.c1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c1members.value.length; i++) {
          let businessMemberExpense = this.props.formValues.c1members.value[i].ExpenseValue.value;
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
        this.setState({ c1foirValue: membertotalFoir });
        this.props.fieldPopulator("c1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c1foirValue: totalFoir });
        this.props.fieldPopulator("c1FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c1showFoirButton: false, c1showFoirProgress: true });
    }
    if (
      this.props.formValues.c1OccupationType &&
      this.props.formValues.c1OccupationType.value === "Others"
    ) {
      let Foirobligation = this.props.formValues.c1othersMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c1othersGrossMonthlyIncome.value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c1members &&
        this.props.formValues.c1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c1members.value.length; i++) {
          let OthersMemberExpense = this.props.formValues.c1members.value[i].ExpenseValue.value;
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
        this.setState({ c1foirValue: membertotalFoir });
        this.props.fieldPopulator("c1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ foirValue: totalFoir });
        this.props.fieldPopulator("FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c1showFoirButton: false, c1showFoirProgress: true });
    }
  };

  ScoreCardHeader = (type, label) => {
    return (
      <React.Fragment>
        <Icon type={type} theme="twoTone" twoToneColor="#fa8c16" />
        <span style={{ paddingLeft: "15px" }}>{label}</span>
      </React.Fragment>
    );
  };

  handleCRIF = () => {
    this.setState({ c1HighMarkScoreloading: true });
    let addresstype;
    if (this.props.formValues.c1KYC_selectedValue &&
      this.props.formValues.c1KYC_selectedValue.value !== "") {
      let kyc = JSON.parse(this.props.formValues.c1KYC_selectedValue.value);
      // ["Aadhaar","DrivingLicense","PAN","Passport","VoterId","SingleKYCApproval"]
      if (kyc.includes('c1PAN')) {
        addresstype = "2"
      } else if (kyc.includes('c1Aadhaar')) {
        addresstype = '1'
      } else if (kyc.includes('c1DrivingLicense')) {
        addresstype = '3'
      } else if (kyc.includes('c1VoterId')) {
        addresstype = '4'
      } else if (kyc.includes('c1Passport')) {
        addresstype = '5'
      }
    }
    let firstName = !validate.isEmpty(this.props.formValues.c1FirstName)
      ? this.props.formValues.c1FirstName.value
      : null;
    let lastName = !validate.isEmpty(this.props.formValues.c1LastName)
      ? this.props.formValues.c1LastName.value
      : null;
    let gender = !validate.isEmpty(this.props.formValues.c1Gender)
      ? this.props.formValues.c1Gender.value
      : null;
    let city = !validate.isEmpty(this.props.formValues.c1City)
      ? this.props.formValues.c1City.value
      : this.props.formValues.City.value;
    let pincode = !validate.isEmpty(this.props.formValues.c1Pincode)
      ? this.props.formValues.c1Pincode.value
      : this.props.formValues.Pincode.value;
    let maritalstatus = !validate.isEmpty(this.props.formValues.c1MaritalStatus)
      ? this.props.formValues.c1MaritalStatus.value
      : null;
    let state = !validate.isEmpty(this.props.formValues.c1State)
      ? this.props.formValues.c1State.value
      : this.props.formValues.State.value;
    let dob = !validate.isEmpty(this.props.formValues.c1DateOfBirth)
      ? this.props.formValues.c1DateOfBirth.value.slice(0, 10)
      : null;
    let aadhar = !validate.isEmpty(this.props.formValues.c1AadhaarNo)
      ? this.props.formValues.c1AadhaarNo.value
      : null;
    let panNo = !validate.isEmpty(this.props.formValues.c1panNo)
      ? this.props.formValues.c1panNo.value.toUpperCase()
      : null;
    let voterNo = !validate.isEmpty(this.props.formValues.c1VoterIDNumber)
      ? this.props.formValues.c1VoterIDNumber.value :
      null;
    let passportNum = !validate.isEmpty(this.props.formValues.c1passportNo)
      ? this.props.formValues.c1passportNo.value :
      null;
    let dlNo = !validate.isEmpty(this.props.formValues.c1DL_Number)
      ? this.props.formValues.c1DL_Number.value :
      null;
    let loanamount = !validate.isEmpty(this.props.formValues.LoanAmount)
      ? this.props.formValues.LoanAmount.value.replace(/,/g, "")
      : null;
    let address = !validate.isEmpty(this.props.formValues.c1city)
      ? this.props.formValues.c1city.value
      : this.props.formValues.BorrowerAddress.value;
    let HighMarkConfig = {
      url: `${Config.apiUrl}/v1/cibil`,
      method: "post",
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
        if (response.data.Error === "Consumer record not found") {
          let errMsg = response.data.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
          this.setState({
            c1getHighMarkDone: true,
            c1HighMarkScoreloading: false,
            c1HighMarkScore: -1,
            c1HighMarkApiData: response.data,
            c1errorMessage: false,
            c1errMsg: errMsg
          })
        } else {
          let HighMarkScore = response.data.ResponseXML.BureauResponse.ScoreDetails.Score.Value;
          let CrifLink = response.data.pdfLink;
          this.props.fieldPopulator("c1HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
          this.props.fieldPopulator("c1CrifLink", { type: "String", value: CrifLink });
          let account_summary = response.ResponseXML.BureauResponse.AccountSummaryDetails;
          let total = 0;
          account_summary.AccountSummary.forEach((summary) => {
            total += Number(summary.TotalMonthlyPaymentAmount);
          })
          this.props.fieldPopulator("c1TotalMonthlyPayment", total);
          this.setState({
            c1getHighMarkDone: true,
            c1HighMarkScoreloading: false,
            c1HighMarkScore: HighMarkScore,
            c1HighMarkApiData: response.data,
            c1errorMessage: false
          });
        }
        this.props.fieldPopulator("c1HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
      }, (error) => {
        this.setState({
          c1HighMarkScoreloading: false,
          c1errorMessage: true
        });
      })
      .catch(e => {
        this.setState({
          c1HighMarkScoreloading: false,
          c1errorMessage: true
        });
      });
  }
  renderEmploymentInformation = () => {
    let {
      c1HighMarkApiData: {
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
      c1HighMarkApiData: {
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
      c1HighMarkApiData: {
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
      c1HighMarkApiData: {
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
      c1HighMarkApiData: {
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
    let { c1members } = this.props.formValues;
    if (c1members) {
      c1members.value.forEach((member, index) => {
        if (modifiedIndex !== index) {
          total += parseInt(member.ExpenseValue.value)
        } else {
          total += parseInt(value.value)
        }
      })
    } else {
      total = parseInt(value.value);
    }
    this.props.fieldPopulator("c1ExpenseTotal", { type: "String", value: total });
  };
  handleIFSCcode = value => {
    let enteredValue = value.value;
    let code = enteredValue;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ c1ifsc: code });
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
        this.setState({ c1voterNo: voterIdNo });
      } else {
        alert("VoterID doesn't match");
      }
    }
  };
  handlePincode = e => {
    let pincode = e.value;
    if (pincode.length >= 6) {
      let validate = pincode.match(/^\d{6}$/) != null;
      if (validate === true) {
        this.setState({ c1pincode: pincode }, () => {
          this.mapCityState(pincode);
        })
      } else {
        alert("Pincode doesn't match");
      }
    }
  };
  mapCityState = (value) => {
    let pincode = value;
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
          c1districtOptions: districtDD,
          c1stateOptions: stateDD,
          c1postOfficeOptions: postOfficeDD
        });

      }).catch(error => {
        console.log("mapCityState function error", error)
      })
  }
  PresentAddressAadhaarSame = e => {
    if (e.value === "Yes") {
      this.setState({ c1showPresentAddressFields: false });
    } else {
      this.setState({ c1showPresentAddressFields: true });
    }
  };
  CorrespondenceAddressSame = e => {
    if (e.value === "Yes") {
      this.setState({ c1showCorrespondenceAddressFields: false });
    } else {
      this.setState({ c1showCorrespondenceAddressFields: true });
    }
  };
  PresentAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c1showPresentAddressSame: false });
    } else {
      this.setState({ c1showPresentAddressSame: true });
    }
  };
  CorrespondenceAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c1showCorrespondenceAddressSame: false });
    } else {
      this.setState({ c1showCorrespondenceAddressSame: true });
    }
  };
  handleMobileNumber = e => {
    let mobNo = e.value;
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null;
      if (validate === true) {
        console.log("Valid mobile number" + mobNo);
      } else {
        alert("Mobile Number doesn't match");
      }
    }
  };
  handleNumberChange = value => {
    let enteredValue = value.value;
    let mobNo = enteredValue;
    let number = { type: "String", value: mobNo };
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null;
      if (validate === true) {
        this.setState({ c1mobileNumber: mobNo });
        this.props.fieldPopulator("c1otpmobileNumber", number);
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
        mobile: "91" + this.props.formValues.c1mobileNumber.value
      }
    };
    this.setState({ c1loading: true });
    axios(config).then(
      response => {
        var pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          let c1OTP_Status = response.data.smsStatus;
          this.props.fieldPopulator("c1OTP_Status", { type: "String", value: c1OTP_Status });
        }
        this.setState({
          c1otpPinID: pinID,
          c1loading: false,
          c1buttonLabel: "RESEND OTP",
          c1showSuccess: false,
          c1showFailure: false
        });
      },
      () => {
        this.setState({
          c1loading: false,
          c1buttonLabel: "RESEND OTP",
          c1showSuccess: false,
          c1showFailure: true
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
        pin_id: this.state.c1otpPinID
      }
    };
    this.setState({ c1loading: true });
    axios(config).then(
      response => {
        var resendpinID = response.data.pinId;
        this.setState({
          c1otpPinID: resendpinID,
          c1otpSent: true,
          c1loading: false,
          c1buttonLabel: "RESEND OTP",
          c1showSuccess: true
        });
      },
      () => {
        this.setState({
          c1loading: false,
          c1buttonLabel: "RESEND OTP",
          c1showSuccess: false,
          c1showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let otpValue = otp;
    this.setState({ c1otp: otpValue });
    this.props.fieldPopulator("c1OTP_Value", { type: "String", value: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      headers: {
        Authorization: authToken
      },
      data: {
        otp: otpValue,
        pin_id: this.state.c1otpPinID
      }
    }
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ c1verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ c1OTP_submit: true, c1showSuccess: true, c1buttonLabel: "Verified" });
          this.props.fieldPopulator("c1hiddenOTPStatus", {
            type: "String",
            value: this.state.c1verifyOTP
          })
        } else if (response.data.verified === false) {
          this.setState({ c1OTP_submit: true });
          this.props.fieldPopulator("c1hiddenOTPStatus", {
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
    this.setState({ c1otp: value });
    this.setState({ c1OTP_submit: false });
  };
  handleAssetType = e => {
    if (e.value === "Others") {
      this.setState({ c1showOthersComments: true });
    } else if (e.value !== "Others") {
      this.setState({ c1showOthersComments: false });
    }
  };
  handleShowRoomPrice = e => {
    let enteredValue = e.value;
    let price = enteredValue.replace(/,/g, "");
    this.setState({ c1veh_showRoomPrice: price });
    if (
      this.props.formValues.c1RoadTax &&
      this.props.formValues.c1InsuranceAmount
    ) {
      let veh_tax = this.state.c1veh_roadTax;
      let veh_insAmt = this.state.c1veh_InsuranceAmount;
      let veh_otherAmt = this.state.c1veh_othersAmt;
      let veh_onroadprice =
        Number(price) +
        Number(veh_tax) +
        Number(veh_insAmt) +
        Number(veh_otherAmt);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onroadprice)
      };
      this.props.fieldPopulator("c1OnRoadPrice", orp);
    }
  };
  handleRoadTax = e => {
    let enteredValue = e.value;
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ c1veh_roadTax: tax }, () => { });
    if (
      this.props.formValues.c1ExShowroomPrice &&
      this.props.formValues.c1InsuranceAmount
    ) {
      let veh_insAmount = this.state.c1veh_InsuranceAmount;
      let veh_Price = this.state.c1veh_showRoomPrice;
      let veh_Others = this.state.c1veh_othersAmt;
      let veh_onRoadPrice =
        Number(tax) +
        Number(veh_insAmount) +
        Number(veh_Price) +
        Number(veh_Others);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onRoadPrice)
      };
      this.props.fieldPopulator("c1OnRoadPrice", orp);
    }
  };
  handleInsuranceAmount = e => {
    let value = e.value;
    let insAmount = value.replace(/,/g, "");
    this.setState({ c1veh_InsuranceAmount: insAmount }, () => { });
    if (
      this.props.formValues.c1ExShowroomPrice &&
      this.props.formValues.c1RoadTax
    ) {
      let veh_roadTax = this.state.c1veh_roadTax;
      let veh_Price = this.state.c1veh_showRoomPrice;
      let veh_others = this.state.c1veh_othersAmt;
      let vehonRoadPrice =
        Number(veh_roadTax) +
        Number(veh_Price) +
        Number(veh_others) +
        Number(insAmount);
      let orp = {
        type: "String",
        value: this.displayINRformat(vehonRoadPrice)
      };
      this.props.fieldPopulator("c1OnRoadPrice", orp);
    }
  };
  handleOnRoadPrice = e => {
    let enteredValue = e.value;
    let othersAmt = enteredValue.replace(/,/g, "");
    this.setState({ c1veh_othersAmt: othersAmt }, () => { });
    let showRoomPrice = this.state.c1veh_showRoomPrice;
    let roadTax = this.state.c1veh_roadTax;
    let insAmount = this.state.c1veh_InsuranceAmount;
    let onRoadPrice =
      Number(showRoomPrice) +
      Number(roadTax) +
      Number(insAmount) +
      Number(othersAmt);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) };
    this.props.fieldPopulator("c1OnRoadPrice", orp);
  };

  handleKycSelect = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c1KYC_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 2) {
      this.props.fieldPopulator("c1kycstatus", {
        type: "String",
        value: "true"
      })
    } else {
      this.props.fieldPopulator("c1kycstatus", {
        type: "String",
        value: ""
      })
    }
  }

  handleAddressVerification = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c1Addr_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 1) {
      this.props.fieldPopulator("c1VerifyAddress", { type: "String", value: "true" });
    } else {
      this.props.fieldPopulator("c1VerifyAddress", { type: "String", value: "" });
    }
  }

  renderMembers() {
    if ((this.props.formValues && !this.props.formValues.c1members) ||
      (this.props.formValues && this.props.formValues.c1members &&
        typeof this.props.formValues.c1members.value !== "string")) {
      return (
        <div className="form-section">
          <FormHeadSection
            sectionLabel="Co-Applicant ExtraOrdinary Expense"
            sectionKey="c1applicantExtraOrdinaryExpense"
            formSyncError={this.props.formSyncError}
            sectionValidator={this.state.sectionValidator}
          />
          <div className="form-section-content">
            <div className="flex-row">
              <FieldArray
                name="c1members.value"
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
    let c1panDetails =
      this.props.formValues && this.props.formValues.c1panDetails
        ? this.props.formValues.c1panDetails.value
        : null;
    let c1aadharDetails =
      this.props.formValues && this.props.formValues.c1aadharDetails
        ? this.props.formValues.c1aadharDetails.value
        : null;
    let c1passportDetails = this.props.formValues && this.props.formValues.c1passportDetails ? this.props.formValues.c1passportDetails.value : null;

    let c1drivingLicenseDetails = this.props.formValues && this.props.formValues.c1drivingLicenseDetails ? this.props.formValues.c1drivingLicenseDetails.value : null;

    let c1voterIdDetails = this.props.formValues && this.props.formValues.c1voterIdDetails ?
      this.props.formValues.c1voterIdDetails.value : null;

    if (c1panDetails && IsJsonString(c1panDetails)) {
      c1panDetails = JSON.parse(c1panDetails);
    }
    if (c1aadharDetails && IsJsonString(c1aadharDetails)) {
      c1aadharDetails = JSON.parse(c1aadharDetails);
    }
    if (c1passportDetails && IsJsonString(c1passportDetails)) {
      c1passportDetails = JSON.parse(c1passportDetails);
    }
    if (c1drivingLicenseDetails && IsJsonString(c1drivingLicenseDetails)) {
      c1drivingLicenseDetails = JSON.parse(c1drivingLicenseDetails);
    }

    if (c1voterIdDetails && IsJsonString(c1voterIdDetails)) {
      c1voterIdDetails = JSON.parse(c1voterIdDetails);
    }


    const c1KycOptions = [
      { label: 'Aadhaar', value: 'c1Aadhaar' },
      { label: 'Driving License', value: 'c1DrivingLicense' },
      { label: 'PAN', value: 'c1PAN' },
      { label: 'Passport', value: 'c1Passport' },
      { label: 'VoterId', value: 'c1VoterId' },
      { label: 'Single KYC Approval', value: 'c1SingleKYCApproval' }
    ];

    const c1addressOptions = [
      { label: "Permanent Address", value: "c1PermanentAddress" },
      { label: "Residential Address", value: "c1ResidentialAddress" },
      { label: "Work Address", value: "c1WorkAddress" }
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
              sectionKey="c1applicantIdentInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            // use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Co-Application ID <span style={{ color: "red" }}>*</span></span>}
                    // label={"Co-Application ID"}
                    name="c1ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    hasFeedback
                    disabled={true}
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
                    label={<span> Borrower Type <span style={{ color: "red" }}>*</span></span>}
                    // label="Borrower Type"
                    name="c1BorrowerType"
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
                    // label={"Relationship with Applicant"}
                    label={<span> Relationship with Applicant <span style={{ color: "red" }}>*</span></span>}
                    name="c1relationShipWithApplicant"
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
                    // label="Is Co-Applicant an Existing Customer?"
                    label={<span>Is Co-Applicant an Existing Customer? <span style={{ color: "red" }}>*</span></span>}
                    name="c1existingCustomer"
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
              sectionKey="c1applicantBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    // label={"First Name"}
                    name="c1FirstName"
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
                    name="c1MiddleName"
                    component={TextBox}
                    placeholder="Enter Middle Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Last Name <span style={{ color: "red" }}>*</span></span>}
                    // label={"Last Name"}
                    name="c1LastName"
                    component={TextBox}
                    placeholder="Enter Last Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "LastName is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Gender <span style={{ color: "red" }}>*</span></span>}
                    // label={"Gender"}
                    name="c1Gender"
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
                    label={<span>Salutation <span style={{ color: "red" }}>*</span></span>}
                    // label={"Salutation"}
                    name="c1Salutation"
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
                    label={<span> Date of Birth <span style={{ color: "red" }}>*</span></span>}
                    // label={"Date of Birth"}
                    name="c1DateOfBirth"
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
                    name="c1Age"
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
              sectionKey="c1applicantKYC"
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
                      className="kyc-Option-checkBox"
                      options={c1KycOptions}
                      defaultValue={this.props.formValues.c1KYC_selectedValue ? JSON.parse(this.props.formValues.c1KYC_selectedValue.value) : ""}
                      onChange={this.handleKycSelect} />
                  </div>
                  <Field
                    hidden={true}
                    name="c1kycstatus"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "kycstatus is required" })
                    ]}
                  />
                </div>
              </div>
              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1Aadhaar")) &&
                <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Aadhaar Name <span style={{ color: "red" }}>*</span></span>}
                        // label={"Aadhaar Name"}
                        name="c1AadhaarName"
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
                        label={<span> Aadhaar Number <span style={{ color: "red" }}>*</span></span>}
                        // label={"Aadhaar Number"}
                        name="c1AadhaarNo"
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
                        label={<span> Aadhaar Date Of Birth <span style={{ color: "red" }}>*</span></span>}
                        // label={" Aadhaar Date Of Birth "}
                        name="c1AadhaarDOB"
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
                        name="c1Aadhaar_Scanner"
                        component={Scanner}
                        docType="AADHAR"
                        imageVar={"c1aadharImg"}
                        parserVar={"c1aadharDetails"}
                        metaVar={"c1aadharMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c1aadharDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c1aadharDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c1aadharDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Aadhaar Number :
                            </span>{" "}
                            {c1aadharDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c1aadharDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Gender :
                            </span>{" "}
                            {c1aadharDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1DrivingLicense")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        // label="Date Of Birth"
                        name="c1DL_DateOfBirth"
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
                        label={<span>Date Of Issue<span style={{ color: "red" }}>*</span></span>}
                        // label="Date Of Issue"
                        name="c1DL_IssueDate"
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
                        label={<span>Date Of Expiry<span style={{ color: "red" }}>*</span></span>}
                        // label="Date Of Expiry"
                        name="c1DL_ExpiryDate"
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
                        name="c1DL_Number"
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
                        name="c1DL_Scanner"
                        component={Scanner}
                        docType="DL"
                        imageVar={"c1DLImg"}
                        parserVar={"c1drivingLicenseDetails"}
                        metaVar={"c1drivingLicenseMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c1drivingLicenseDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c1drivingLicenseDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                            {c1drivingLicenseDetails.bloodGroup}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                            {" "}
                            {c1drivingLicenseDetails.dateOfBirth}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {c1drivingLicenseDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                            {" "}
                            {c1drivingLicenseDetails.dateOfExpiry}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                            {" "}
                            {c1drivingLicenseDetails.dlId}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>State :</span>
                            {" "}
                            {c1drivingLicenseDetails.dlState}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1PAN")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Name"}
                        label={<span>Pan Name<span style={{ color: "red" }}>*</span></span>}
                        name="c1panName"
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
                        name="c1panNo"
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
                        name="c1panDOB"
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
                        name="c1panFatherName"
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
                        name="c1PAN_Scanner"
                        component={Scanner}
                        docType="PAN"
                        imageVar={"c1panImg"}
                        parserVar={"c1panDetails"}
                        metaVar={"c1panMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c1panDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c1panDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c1panDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c1panDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c1panDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c1panDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1Passport")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Type Of Passport"}
                        label={<span> Type Of Passport<span style={{ color: "red" }}>*</span></span>}
                        name="c1passportType"
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
                        name="c1passportNo"
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
                        name="c1passport_IssueDate"
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
                        name="c1passport_ExpiryDate"
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
                        name="c1Passport_Scanner"
                        component={Scanner}
                        docType="PASSPORT"
                        imageVar={"c1passportImg"}
                        parserVar={"c1passportDetails"}
                        metaVar={"c1passportMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c1passportDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c1passportDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c1passportDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Aadhaar Number :</span>
                            {" "}
                            {c1passportDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>
                            {" "}
                            {c1passportDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>
                            {" "}
                            {c1passportDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1VoterId")) && <React.Fragment >
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Voter ID Number"}
                        label={<span> Voter ID Number<span style={{ color: "red" }}>*</span></span>}
                        name="c1VoterIDNumber"
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
                        name="c1VoterIDName"
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
                        name="c1VoterIDFatherName"
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
                        name="c1Voter_Scanner"
                        component={Scanner}
                        docType="VOTERID"
                        imageVar={"c1voterIdImage"}
                        parserVar={"c1voterIdDetails"}
                        metaVar={"c1voterIdMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c1voterIdDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c1voterIdDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c1voterIdDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c1voterIdDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                            {c1voterIdDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c1voterIdDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c1KYC_selectedValue &&
                JSON.parse(this.props.formValues.c1KYC_selectedValue.value).includes("c1SingleKYCApproval")) &&
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    {/** File Uploader */}
                    <Field
                      label={"Single KYC Image "}
                      name="c1singleKycImage"
                      component={Scanner}
                      docType="IMG"
                      imageVar={"c1singleKycimage"}
                      metaVar={"c1singleKycMeta"}
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
              sectionKey="c1applicantDetailedInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Mobile number<span style={{ color: "red" }}>*</span></span>}
                    name="c1mobileNumber"
                    component={TextBox}
                    placeholder="Enter Mobile Number"
                    type="text"
                    hasFeedback
                    onChange={this.handleNumberChange}
                    maxlength="10"
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
                            // this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
                            this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
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
                    label={'Alternate Mobile number'}
                    name="c1AlternativePhone"
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
                    name="c1Email"
                    component={TextBox}
                    placeholder="Enter Email"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Citizenship<span style={{ color: "red" }}>*</span></span>}
                    name="c1Citizenship"
                    component={Select}
                    placeholder="Select Citizenship"
                    className="a8Select"
                    onChange={this.citizenshipChange}
                    validate={[
                      A8V.required({ errorMsg: "Citizenship is required" })
                    ]}
                  >
                    {/*{this.state.c1citizenshipOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}*/}
                  </Field>
                </div>
                {this.state.c1showResidencyStatus && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={<span> Residency Status<span style={{ color: "red" }}>*</span></span>}
                      name="c1ResidencyStatus"
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
                    name="c1Religion"
                    component={Select}
                    placeholder="Select Religion"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Religion is required" })
                    ]}
                  >
                    {this.state.c1religionOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Caste"
                    label={<span> Caste<span style={{ color: "red" }}>*</span></span>}
                    name="c1Caste"
                    component={Select}
                    placeholder="Select Caste"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Caste is required" })]}
                  >
                    {this.state.c1casteOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Marital Status"
                    label={<span> Marital Status<span style={{ color: "red" }}>*</span></span>}
                    name="c1MaritalStatus"
                    component={Select}
                    placeholder="Enter MaritalStatus"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Marital Status is required" })
                    ]}
                  >
                    {this.state.c1maritalStatusOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Education Level"
                    label={<span> Education Level<span style={{ color: "red" }}>*</span></span>}
                    name="c1EducationLevel"
                    component={Select}
                    placeholder="Select EducationLevel"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "EducationLevel is required" })
                    ]}
                  >
                    {this.state.c1educationOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Father Name"}
                    label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                    name="c1FatherName"
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
                    name="c1MotherMaidenName"
                    component={TextBox}
                    placeholder="Enter Mother Maiden Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                {this.props.formValues.c1MaritalStatus &&
                  this.props.formValues.c1MaritalStatus.value === "Married" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Spouse Name<span style={{ color: "red" }}>*</span></span>}
                        name="c1SpouseName"
                        component={TextBox}
                        placeholder="Enter Spouse Name"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "c1SpouseName is required" })
                        ]}
                      />
                    </div>
                  )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is Applicant a MicroBanking customer?<span style={{ color: "red" }}>*</span></span>}
                    name="c1ApplicantMBCustomer"
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
                {this.props.formValues.c1ApplicantMBCustomer && this.props.formValues.c1ApplicantMBCustomer.value === "Yes" && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Sangam Name"}
                      name="c1SangamName"
                      component={TextBox}
                      placeholder="Enter SangamName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                )}
                {this.props.formValues.c1ApplicantMBCustomer && this.props.formValues.c1ApplicantMBCustomer.value === "Yes" && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Microbanking Branch Name"}
                      name="c1MBBranchName"
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
            this.props.formValues.c1mobileNumber &&
            this.props.formValues.c1mobileNumber.value && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="OTP Verification"
                  sectionKey="c1applicantOtpVerification"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label="Mobile number"
                        name="c1mobileNumber"
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
                          A8V.uniqueMobileNumber({
                            errorMsg: "Mobile number should be unique", mobile:
                              [
                                this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                                this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                                this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
                                this.props.formValues.ReferenceMobile_2 ? this.props.formValues.ReferenceMobile_2.value : '',
                                // this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
                                this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
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
                        buttonLabel={this.state.c1buttonLabel}
                        isButtonLoading={this.state.c1loading}
                        showSuccesIcon={this.state.c1showSuccess}
                        showFailureIcon={this.state.c1showFailure}
                        onButtonClick={() => {
                          this.state.c1buttonLabel === "SEND OTP"
                            ? this.handleSendApi()
                            : this.handleResendApi();
                        }}
                      />
                    </div>
                    {this.props.formValues && this.props.formValues.c1OTP_Status && (
                      <div className="form-group ">
                        <Otp
                          numInputs={4}
                          submitLabel={"submit"}
                          disableSubmit={this.state.c1OTP_submit}
                          mobileNumber={
                            this.props.formValues.c1mobileNumber
                              ? this.props.formValues.c1mobileNumber.value
                              : null
                          }
                          value={this.props.formValues.c1OTP_Value && this.props.formValues.c1OTP_Value.value}
                          handleOtpNumber={this.handleOtpNumber}
                          otpOnchange={this.onchangeOtp}
                          className=""
                        />
                      </div>
                    )}
                    <Field
                      hidden={true}
                      name="c1hiddenOTPStatus"
                      component={TextBox}
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "c1hiddenOTPStatus is required" })
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Address Information"
              sectionKey="c1applicantAddressInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Applicant?<span style={{ color: "red" }}>*</span></span>}
                    name="c1PresentAddressSameAsApplicant"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressSameAsApplicant}
                    validate={[A8V.required({ errorMsg: "PresentAddressSameAsApplicant is required" })]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c1showPresentAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c1HouseName"
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
                        name="c1StreetArea"
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
                        name="c1City"
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
                        name="c1Pincode"
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
                        name="c1PostOffice"
                        component={Select}
                        placeholder="Select  PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "PostOffice is required" })
                        ]}
                      >
                        {this.state.c1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c1District"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c1State"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.c1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                  </React.Fragment>

                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Aadhaar address?<span style={{ color: "red" }}>*</span></span>}
                    name="c1PresentAddressAadhaarSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressAadhaarSame}
                    validate={[A8V.required({ errorMsg: "PresentAddressAadhaarSame is required" })]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c1showPresentAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Address Proof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentAddressType"
                        placeholder="Enter Address Proof Type"
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
                        name="c1permanentAddressNumber"
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
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentHouseName"
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
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentStreetArea"
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
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentCity"
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
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentPincode"
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
                        name="c1permanentPostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {
                          this.state.c1postOfficeOptions.map(data => (
                            <Option value={data.office_name}>{data.office_name}</Option>
                          ))
                        }
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c1permanentState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c1permanentLandMark"
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
                        name="c1permanentYearsPresentAddress"
                        component={Select}
                        placeholder="Select YearsPresentAddress"
                        className="a8Select"

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
                    label={<span>Is correspondence address same as Permanent address?<span style={{ color: "red" }}>*</span></span>}
                    name="c1permanentCorrespondenceAddressSame"
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
                {this.state.c1showCorrespondenceAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> AddressProof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceAddressProofType"
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
                        label={<span> Address ProofNumber<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceAddressProofNumber"
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
                        name="c1CorrespondenceHouseName"
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
                        name="c1CorrespondenceStreetArea"
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
                        name="c1CorrespondenceCity"
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
                        name="c1CorrespondencePincode"
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
                        name="c1CorrespondencePostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c1CorrespondenceLandMark"
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
                    name="c1CorrespondenceAddressSameApplicant"
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
                {this.state.c1showCorrespondenceAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Correspondence AddressProof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceAddressProofTypeAsApplicant"
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
                        name="c1CorrespondenceAddressProofNumberAsApplicant"
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
                        name="c1CorrespondenceHouseNameAsApplicant"
                        component={TextBox}
                        placeholder="Enter HouseName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "HouseName is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceStreetAreaAsApplicant"
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
                        name="c1CorrespondenceCityAsApplicant"
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
                        name="c1CorrespondencePincodeAsApplicant"
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
                        name="c1CorrespondencePostOfficeAsApplicant"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceDistrictAsApplicant"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="c1CorrespondenceStateAsApplicant"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c1stateOptions.map(data => (
                          <Option value={data.value}>{data.label}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="c1CorrespondenceLandMarkAsApplicant"
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
              sectionKey="c1applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Occupation Type<span style={{ color: "red" }}>*</span></span>}
                    name="c1OccupationType"
                    component={Select}
                    placeholder="Select Occupation Type"
                    onChange={this.handleOccupationType}
                    className="a8Select"
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
                {this.state.c1showSalariedFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                        name="c1SlariedTypeofJob"
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
                        name="c1salariedExperienceCurrentJob"
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
                        name="c1salariedMonthlyGrossSalary"
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
                        name="c1salariedMonthlyFixedObligation"
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
                        name="c1salariedGrossAnnualIncome"
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
                        name="c1salariedNetAnnualIncome"
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
                            name="c1salariedOfficeName"
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
                            name="c1SalariedOfficeNo"
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
                            name="c1SalariedStreetArea"
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
                            name="c1SalariedCity"
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
                            name="c1SalariedPincode"
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
                            name="c1SalariedPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c1SalariedDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c1SalariedState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c1stateOptions.map(data => (
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
                {this.state.c1showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Business<span style={{ color: "red" }}>*</span></span>}
                        name="c1BusinessType"
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
                        name="c1BusinessName"
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
                        label={<span>Constitution<span style={{ color: "red" }}>*</span></span>}
                        name="c1Constitution"
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
                        name="c1BusinessStructure"
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
                        label={<span>Business model<span style={{ color: "red" }}>*</span></span>}
                        name="c1BusinessModel"
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
                        label={<span>When was the business started<span style={{ color: "red" }}>*</span></span>}
                        name="c1BusinessStartDate"
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
                        name="c1BusinessAge"
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
                        name="c1businessEmployeeCount"
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
                        name="c1CurrentBusinessExp"
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
                        name="c1businessAnnualTurnover"
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
                        name="c1businessMonthlyGrossSalary"
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
                        name="c1businessMonthlyFixedObligation"
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
                        name="c1businessGrossAnnualIncome"
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
                        name="c1businessNetAnnualIncome"
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
                            name="c1businessOfficeName"
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
                            name="c1businessOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "Office Address is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="c1businessStreetArea"
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
                            name="c1businessCity"
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
                            name="c1businessPincode"
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
                            name="c1businessPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c1businessDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c1businessState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c1stateOptions.map(data => (
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
                {this.state.c1showOthersFields &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                      name="c1JobType"
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
                {this.state.c1showJobTypeFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>TotalYears of Experience in Current job<span style={{ color: "red" }}>*</span></span>}
                        name="c1ExperienceCurrentJob"
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
                        label={<span>Daily Income<span style={{ color: "red" }}>*</span></span>}
                        name="c1othersDailyIncome"
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
                        label={<span>Average no. of working days<span style={{ color: "red" }}>*</span></span>}
                        name="c1othersWorkingDayCount"
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
                        name="c1othersGrossMonthlyIncome"
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
                        name="c1othersMonthlyFixedObligation"
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
                        name="c1OthersGrossAnnualSalary"
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
                        name="c1NetAnnualIncomeOthers"
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
                            name="c1othrOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "office name is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address No<span style={{ color: "red" }}>*</span></span>}
                            name="c1othrOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "office address is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="c1othrStreetArea"
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
                            name="c1othrCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: "city is required"
                              })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="c1othrPincode"
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
                            name="c1othrPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="c1othrDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="c1othrState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c1stateOptions.map(data => (
                              <Option value={data.state_name}>{data.state_name}</Option>
                            ))}
                          </Field>
                        </div>
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
                    <Checkbox.Group style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox" options={c1addressOptions}
                      defaultValue={this.props.formValues.c1Addr_selectedValue ? JSON.parse(this.props.formValues.c1Addr_selectedValue.value) : ""} onChange={this.handleAddressVerification} validate={[A8V.required({ errorMsg: "c1VerifyAddress is required" })]} />
                  </div>
                  <Field
                    hidden={true}
                    name="c1VerifyAddress"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "c1VerifyAddress is required" })
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.renderMembers()}
          {(!this.props.formValues.c1JobType ||
            (this.props.formValues.c1JobType &&
              this.props.formValues.c1JobType.value !== "HomeMaker" &&
              this.props.formValues.c1JobType.value !== "Student")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"FOIR Calculation"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  {this.state.c1showFoirProgress && (
                    <div style={{ width: "100%" }}>
                      {this.state.c1foirValue > 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.c1FoirValue &&
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
                                <p>{this.props.formValues.c1FoirValue.value}/100</p>
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
                      }
                      {this.state.c1foirValue <= 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.c1FoirValue &&
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
                                <p>{this.props.formValues.c1FoirValue.value}/100</p>
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
                              loading={this.state.c1HighMarkScoreloading}
                            >
                              Generate CRIF Details
                        </Button>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  )}

                  {this.state.c1showFoirButton && (
                    <div className="form-group col-xs-6 col-md-4">
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
                        Calcuate FOIR
                    </Button>
                      <Field
                        hidden={true}
                        name="c1FoirValue"
                        component={TextBox}
                        type="text"
                        className=" form-control-custom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>}

          {this.props.formValues.c1JobType &&
            (this.props.formValues.c1JobType.value === "HomeMaker" ||
              this.props.formValues.c1JobType.value === "Student") &&
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
                      loading={this.state.c1HighMarkScoreloading}
                    > Generate CRIF Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.c1getHighMarkDone && (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="CRIF HighMark"
                sectionKey="c1CRIFScore"
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
                        value={this.state.c1HighMarkScore}
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
                        currentValueText={`HighMark Score: ${this.state.c1HighMarkScore}`}
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
              sectionKey="c1applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is Applicant banking with ESAF?<span style={{ color: "red" }}>*</span></span>}
                    name="c1ESAFCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    validate={[
                      A8V.required({ errorMsg: "ESAFCustomer is required" })
                    ]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.props.formValues.c1ESAFCustomer &&
                  this.props.formValues.c1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Branch Name<span style={{ color: "red" }}>*</span></span>}
                        name="c1BranchName"
                        component={TextBox}
                        placeholder="Enter BranchName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "Branch Name is required" })]}
                      />
                    </div>
                  )}
                {this.props.formValues.c1ESAFCustomer &&
                  this.props.formValues.c1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Number<span style={{ color: "red" }}>*</span></span>}
                        name="c1AccountNumber"
                        component={TextBox}
                        placeholder="Enter AccountNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[A8V.required({ errorMsg: "Account Number is required" })]}
                      />
                    </div>
                  )}
                {this.props.formValues.c1ESAFCustomer &&
                  this.props.formValues.c1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Type<span style={{ color: "red" }}>*</span></span>}
                        name="c1AccountType"
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
                {this.props.formValues.c1ESAFCustomer &&
                  this.props.formValues.c1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>IFSCCode<span style={{ color: "red" }}>*</span></span>}
                        name="c1IFSCCode"
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
                {this.props.formValues.c1ESAFCustomer &&
                  this.props.formValues.c1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Banking Since<span style={{ color: "red" }}>*</span></span>}
                        name="c1BankingHistory"
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
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("++++++State of Co1_Applicant Basic++++++", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessNew")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessNew")(state)
  };
};

export default connect(mapStateToProps, {})(TabCoApplicantNew1);

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
