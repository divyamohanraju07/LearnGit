import * as React from "react";
import {
  Select,
  SelectHelper,
  Scanner,
  TextBox,
  DatePicker,
  RadioWrapper,
  Radio,
  TextButtonGroup,
  Otp
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
import validate from "validate.js"

const { Option } = SelectHelper;
const { Panel } = Collapse;

class TabGuarantorNew1 extends React.Component {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      g1FormScanner: [],
      g1FormScannerQR: [],
      g1applicantIdentInfo: [
        "g1ApplicationID",
        "g1BorrowerType",
        "g1existingCustomer",
        "g1relationshipWithApplicant"
      ],
      g1applicantBasicInfo: [
        "g1FirstName",
        "g1LastName",
        "g1Gender",
        "g1Salutation",
        "g1DateOfBirth",
      ],
      g1applicantKYC: [
        "g1kycstatus",
        "g1AadhaarName",
        "g1AadhaarNo",
        "g1AadhaarDOB",
        "g1DL_DateOfBirth",
        "g1DL_IssueDate",
        "g1DL_ExpiryDate",
        "g1DL_Number",
        "g1panName",
        "g1panNo",
        "g1panDOB",
        "g1panFatherName",
        "g1passportType",
        "g1passportNo",
        "g1passport_IssueDate",
        "g1passport_ExpiryDate",
        "g1VoterIDNumber",
        "g1VoterIDName",
        "g1VoterIDFatherName",
      ],
      g1applicantEmpInfo: [
        "g1OccupationType",
        "g1salariedMonthlyGrossSalary",
        "g1salariedMonthlyFixedObligation",
        "g1salariedOfficeName",
        "g1SalariedPincode"
      ],
      g1applicantExtraOrdinaryExpense: [
        "g1ExtraExpenseType",
        "g1ExpenseValue",
        "g1members"
      ],
      g1foirCalculation: [""],
      g1CRIFScore: [""],
      g1applicantDetailedInfo: [
        "g1Citizenship",
        "g1ResidencyStatus",
        "g1Religion",
        "g1Caste",
        "g1MaritalStatus",
        "g1EducationLevel",
        "g1FatherName",
        "g1MotherMaidenName",
        "g1ApplicantMBCustomer"
      ],
      g1applicantOtpVerification: ["g1hiddenOTPStatus"],
      g1applicantAddressInfo: [
        "g1permanentAddressType",
        "g1permanentAddressProofNumber",
        "g1HouseName",
        "g1StreetArea",
        "g1City",
        "g1District",
        "g1State",
        "g1Pincode",
        "g1PresentAddressAadhaarSame",
        "g1PresentAddressSameAsApplicant",
        "g1permanentCorrespondenceAddressSame",
        "g1CorrespondenceAddressSameAsApplicant"
      ],
      g1applicantBankingHistory: [
        "g1ESAFCustomer",
        "g1BranchName",
        "g1AccountNumber",
        "g1AccountType",
        "g1IFSCCode",
        "g1BankingHistory"
      ],
    },
    g1showSalariedFields: false,
    g1salariedMonthlySalary: "",
    g1showBusinessFields: false,
    g1businessMonthlySalary: "",
    g1showOthersFields: false,
    g1showJobTypeFields: false,
    g1showResidencyStatus: false,
    g1showLoanDetails: false,
    g1showAddressDetails: false,
    g1showRelationshipDetails: false,
    g1AadhaarQRCodeScan: "",
    g1veh_InsuranceAmount: 0,
    g1veh_showRoomPrice: 0,
    g1veh_roadTax: 0,
    g1veh_othersAmt: 0,
    g1startDate: "",
    g1Age: "",
    g1dayCount: "",
    g1CustomerAccountNumber: "",
    g1responseData: {},
    g1mappedJson: {},
    g1loantypeOptions: [],
    g1loanSubtypeOptions: [],
    g1stateOptions: [],
    g1StateOptions: [],
    g1postOfficeOptions: [],
    g1districtOptions: [],
    g1religionOptions: [],
    g1educationOptions: [],
    g1casteOptions: [],
    g1maritalStatusOptions: [],
    g1citizenshipOptions: [],
    g1showFoirField: false,
    g1showFoirProgress: false,
    g1showFoirButton: true,
    g1ifsc: "",
    g1voterNo: "",
    g1otp: "",
    g1verifyOTP: "",
    g1mobileNumber: "",
    g1otpPinID: "",
    g1OTP_submit: false,
    g1showFailure: false,
    g1showVerifiedCheck: false,
    g1showVerifiedUncheck: false,
    g1otpSent: false,
    g1buttonLabel: "SEND OTP",
    g1loading: false,
    g1showSuccess: false,
    g1showOTPverification: false,
    g1InsuranceAmount: "",
    g1monthlyIncomeOthers: "",
    g1salObligationValue: "",
    g1busiObligationValue: "",
    g1othersObligationValue: "",
    g1foirValue: "",
    g1HighMarkScoreloading: false,
    g1getHighMarkDone: false,
    g1HighMarkScore: 0,
    g1HighMarkApiData: null,
    g1pincode: "",

  };

  componentDidMount() {
    // Guarantor ApplicationID Generation
    this.handleApplicationID();
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    //loan type option
    // let config = {
    //   url: `${Config.apiUrl}/v1/loanType`,
    //   method: "get",
    //   headers: {
    //     Authorization: authToken,
    //   },
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
    //       g1loantypeOptions: loanTypeDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
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
        let education = response.data.educationType;
        let educationDD = [];
        for (let iter = 0; iter < education.length; iter++) {
          educationDD.push({
            value: education[iter].educationLevel,
            label: education[iter].educationLevel
          });
        }
        this.setState({ g1educationOptions: educationDD });
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
        this.setState({ g1casteOptions: casteDD });
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
        this.setState({ g1maritalStatusOptions: maritalStatusDD });
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
        this.setState({ g1religionOptions: religionDD });
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
    //       g1StateOptions: stateDD
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
    //     this.props.fieldPopulator("g1Citizenship", { type: "String", value: "India", valueInfo: {} });
    //     this.setState({ g1citizenshipOptions: citizenDD });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.props.fieldPopulator("g1Citizenship", { type: "String", value: "India", valueInfo: {} });
    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.g1OccupationType &&
      this.props.formValues.g1OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.g1OccupationType);
      if (this.props.formValues.g1JobType) {
        this.handleOtherJobType(this.props.formValues.g1JobType);
      }
    }
    if (this.props.formValues &&
      this.props.formValues.g1OTP_Value &&
      this.props.formValues.g1OTP_Value.value !== "") {
      // this.
      // this.handleOtpNumber(this.props.formValues.OTP_Value.value);
      if (this.props.formValues.g1hiddenOTPStatus &&
        this.props.formValues.g1hiddenOTPStatus.value === "true") {
        this.setState({ g1OTP_submit: true, g1showSuccess: true, g1buttonLabel: "Verified", g1otp: this.props.formValues.g1OTP_Value.value });
      } else if (this.props.formValues.g1hiddenOTPStatus &&
        this.props.formValues.g1hiddenOTPStatus.value === "false") {
        this.setState({ g1OTP_submit: false, g1showFailure: true, g1buttonLabel: "Resend OTP", g1otp: this.props.formValues.g1OTP_Value.value });
      }
    }
    if (
      this.props.formValues &&
      this.props.formValues.g1LoanType &&
      this.props.formValues.g1LoanType.value !== ""
    ) {
      this.loanTypeChange(this.props.formValues.g1LoanType);
    }

    if (!validate.isEmpty(this.props.formValues && this.props.formValues.g1HighMarkData)) {
      let HighMarkData = this.props.formValues.g1HighMarkData.value;
      if (HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
        let errMsg = HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
        this.setState({
          g1getHighMarkDone: true,
          g1HighMarkScoreloading: false,
          g1HighMarkScore: -1,
          g1showFoirButton: false,
          g1HighMarkApiData: HighMarkData,
          g1errorMessage: false,
          g1errMsg: errMsg,
          g1showFoirProgress: true,
          g1foirValue: this.props.formValues.g1FoirValue ? this.props.formValues.g1FoirValue.value : 0
        })
      } else {
        let HighMarkScore = HighMarkData.ResponseXML.BureauResponse.ScoreDetails.score.value;
        this.setState({
          g1getHighMarkDone: true,
          g1HighMarkScoreloading: false,
          g1HighMarkScore: HighMarkScore,
          g1HighMarkApiData: HighMarkData,
          g1errorMessage: false,
          g1showFoirProgress: true,
          g1showFoirButton: false,
          g1foirValue: this.props.formValues.g1FoirValue ? this.props.formValues.g1FoirValue.value : 0
        });
      }
    }
  }

  handleOccupationType = e => {
    if (e.value === "Salaried") {
      this.setState({
        g1showSalariedFields: true,
        g1showBusinessFields: false,
        g1showOthersFields: false
      });
    } else if (e.value === "Business") {
      this.setState({
        g1showSalariedFields: false,
        g1showBusinessFields: true,
        g1showOthersFields: false
      });
    } else if (e.value === "Others") {
      this.setState({
        g1showSalariedFields: false,
        g1showBusinessFields: false,
        g1showOthersFields: true
      });
    }
  };
  handleOtherJobType = (e) => {
    if (e.value === "Student" || e.value === "HomeMaker") {
      this.setState({
        g1showJobTypeFields: false,
      });
    } else {
      this.setState({
        g1showJobTypeFields: true,
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
      "Gu_1" + StateCode + currentYear + currentMonth + currentDate;
    let apIDs = { type: "String", value: applicationNumber };
    this.props.fieldPopulator("g1ApplicationID", apIDs);
  };
  citizenshipChange = value => {
    if (value && value.value === "India") {
      this.setState({ g1showResidencyStatus: false });
    } else {
      this.setState({ g1showResidencyStatus: true });
      this.props.fieldPopulator("g1ResidencyStatus", "");
    }
  };
  handleChange_age = e => {
    let age = moment().diff(e.value, 'years');
    this.props.fieldPopulator("g1Age", {
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
    this.setState({ g1startDate: selected, Age: age });
    this.props.fieldPopulator("g1BusinessAge", bsDate);
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
    this.setState({ g1salariedMonthlySalary: salariedmonthly });
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross };
    if (!this.props.formValues.g1salariedMonthlyFixedObligation) {
      this.setState({ g1salariedAnnualIncome: salariedGross });
      this.props.fieldPopulator("g1salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.g1salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.g1salObligationValue;
      let netIncome = this.displayINRformat(
        salariedGross.replace(/,/g, "") - salariedObligationValue * 12
      );
      let net = { type: "String", value: netIncome };
      this.props.fieldPopulator("g1salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("g1salariedNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationSalaried = value => {
    let enteredValue = value.value;
    let salariedObligation = enteredValue.replace(/,/g, "");
    let monthlySurplus = this.props.formValues.g1salariedMonthlyGrossSalary
      .value;
    let salariedMonthlySurplus = this.displayINRformat(
      monthlySurplus.replace(/,/g, "") - salariedObligation
    );
    this.setState({ g1salObligationValue: salariedObligation });
    let salariedGrossAnnual = this.props.formValues.g1salariedGrossAnnualIncome
      .value;
    let salariednetIncome = this.displayINRformat(
      salariedGrossAnnual.replace(/,/g, "") - salariedObligation * 12
    );
    let surplus = { type: "String", value: salariedMonthlySurplus };
    let net = { type: "String", value: salariednetIncome };
    this.props.fieldPopulator("g1salariedNetAnnualIncome", net);
    this.props.fieldPopulator("g1salariedMonthlySurplus", surplus);
  };
  businesshandleMonthlySalary = value => {
    let enteredValue = value.value;
    let businessmonthly = enteredValue.replace(/,/g, "");
    this.setState({ g1businessMonthlySalary: businessmonthly });
    let businessGross = this.displayINRformat(
      businessmonthly.replace(/,/g, "") * 12
    );
    let gross = { type: "String", value: businessGross };
    this.props.fieldPopulator("g1businessGrossAnnualIncome", gross);
    if (this.props.formValues.g1businessMonthlyFixedObligation) {
      let businessObligation = this.state.g1busiObligationValue;
      let netIncomeBusiness = this.displayINRformat(
        businessGross.replace(/,/g, "") - businessObligation * 12
      );
      let net = { type: "String", value: netIncomeBusiness };
      this.props.fieldPopulator("g1businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("g1businessNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationBusiness = value => {
    let enteredValue = value.value;
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ g1busiObligationValue: businessObligation });
    let monthlySalary = this.state.g1businessMonthlySalary;
    let BusinessMonthlySurplus = this.displayINRformat(
      monthlySalary - businessObligation
    );
    let businessGrossAnnual = this.props.formValues.g1businessGrossAnnualIncome
      .value;
    let businessnetIncome = this.displayINRformat(
      businessGrossAnnual.replace(/,/g, "") - businessObligation * 12
    );
    let surplus = { type: "String", value: BusinessMonthlySurplus };
    let net = { type: "String", value: businessnetIncome };
    this.props.fieldPopulator("g1TotalMonthlySurplus", surplus);
    this.props.fieldPopulator("g1businessNetAnnualIncome", net);
  };
  handlemonthlyObligationOthers = value => {
    let enteredValue = value.value;
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ g1othersObligationValue: othersObligation });
    let othersGrossMonthly = this.props.formValues.g1othersGrossMonthlyIncome
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
    this.props.fieldPopulator("g1NetAnnualIncomeOthers", net);
    this.props.fieldPopulator("g1othersMonthlySurplus", surplus);
  };
  handleDailyIncomeChange = value => {
    let enteredValue = value.value;
    let OthersdailyIncome = enteredValue.replace(/,/g, "");
    let values = { type: "String", value: "" };
    this.setState({ g1monthlyIncomeOthers: OthersdailyIncome });
    if (!this.props.formValues.g1othersWorkingDayCount) {
      this.props.fieldPopulator("g1othersGrossMonthlyIncome", values);
    } else {
      let daycountValue = this.props.formValues.g1othersWorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(
        OthersdailyIncome * daycountValue
      );
      let gross = { type: "String", value: MonthlyGross };
      let obligationOthers = this.state.g1othersObligationValue;
      let othersGrossAnnual = MonthlyGross * 12;
      let othersnetIncome = this.displayINRformat(
        othersGrossAnnual - obligationOthers * 12
      );
      let net = { type: "String", value: othersnetIncome };
      this.props.fieldPopulator("g1OthersGrossAnnualSalary", { type: 'String', value: othersGrossAnnual })
      this.props.fieldPopulator("g1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("g1NetAnnualIncomeOthers", net);
    }
  };
  handleDayCount = value => {
    let enteredValue = value.value;
    let dayCount = enteredValue;
    let MonthlyGrossIncome = this.displayINRformat(
      this.props.formValues.g1othersDailyIncome.value.replace(/,/g, "") *
      dayCount
    );
    let gross = { type: "String", value: MonthlyGrossIncome };
    let grossAnnual = this.displayINRformat(this.props.formValues.g1othersDailyIncome.value.replace(/,/g, "") * dayCount * 12)
    if (!this.props.formValues.g1othersMonthlyFixedObligation) {
      this.props.fieldPopulator("g1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("g1OthersGrossAnnualSalary", { type: 'String', value: grossAnnual })

    } else {
      let obliqothr = this.props.formValues.g1othersMonthlyFixedObligation.value.replace(
        /,/g,
        ""
      );
      let annualIncomeOthers = MonthlyGrossIncome * 12;
      let netAnnualOthers = this.displayINRformat(
        annualIncomeOthers - obliqothr * 12
      );
      let net = { type: "String", value: netAnnualOthers };
      this.props.fieldPopulator("g1OthersGrossAnnualSalary",
        { type: 'String', value: annualIncomeOthers })
      this.props.fieldPopulator("g1othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("g1NetAnnualIncomeOthers", net);
      this.props.fieldPopulator("g1OthersGrossAnnualSalary", { type: 'String', value: annualIncomeOthers })
    }
  };
  handleFoirCalculation = () => {
    let i;
    if (
      this.props.formValues.g1OccupationType &&
      this.props.formValues.g1OccupationType.value === "Salaried"
    ) {
      let Foirobligation = this.props.formValues
        .g1salariedMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.g1salariedMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.g1members &&
        this.props.formValues.g1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.g1members.value.length; i++) {
          let salariedMemberExpense = this.props.formValues.g1members.value[i].ExpenseValue.value;
          memberExpenseValue.push(parseInt(salariedMemberExpense));
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
        this.setState({ g1foirValue: membertotalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ g1foirValue: totalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ g1showFoirButton: false, g1showFoirProgress: true });
    }
    if (
      this.props.formValues.g1OccupationType &&
      this.props.formValues.g1OccupationType.value === "Business"
    ) {
      let Foirobligation = this.props.formValues
        .g1businessMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.g1businessMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.g1members &&
        this.props.formValues.g1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.g1members.value.length; i++) {
          let businessMemberExpense = this.props.formValues.g1members.value[i].ExpenseValue.value;
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
        this.setState({ g1foirValue: membertotalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ g1foirValue: totalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ g1showFoirButton: false, g1showFoirProgress: true });
    }
    if (
      this.props.formValues.g1OccupationType &&
      this.props.formValues.g1OccupationType.value === "Others"
    ) {
      let Foirobligation = this.props.formValues.g1othersMonthlyFixedObligation
        .value;
      let FoirMonthlyGross = this.props.formValues.g1othersMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.g1members &&
        this.props.formValues.g1members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.g1members.value.length; i++) {
          let OthersMemberExpense = this.props.formValues.g1members.value[i].ExpenseValue.value;
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
        this.setState({ g1foirValue: membertotalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ g1foirValue: totalFoir });
        this.props.fieldPopulator("g1FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ g1showFoirButton: false, g1showFoirProgress: true });
    }
  };

  ScoreCardHeader = (type, label) => {
    return (
      <React.Fragment>
        <Icon type={type} theme="twoTone" twoToneColor="#fa8g16" />
        <span style={{ paddingLeft: "15px" }}>{label}</span>
      </React.Fragment>
    );
  };

  handleCRIF = () => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    this.setState({ g1HighMarkScoreloading: true });

    let addresstype;
    if (this.props.formValues.g1KYC_selectedValue &&
      this.props.formValues.g1KYC_selectedValue.value !== "") {
      let kyc = JSON.parse(this.props.formValues.g1KYC_selectedValue.value);
      // ["Aadhaar","DrivingLicense","PAN","Passport","VoterId","SingleKYCApproval"]
      if (kyc.includes('g1PAN')) {
        addresstype = "2"
      } else if (kyc.includes('g1Aadhaar')) {
        addresstype = '1'
      } else if (kyc.includes('g1DrivingLicense')) {
        addresstype = '3'
      } else if (kyc.includes('g1VoterId')) {
        addresstype = '4'
      } else if (kyc.includes('g1Passport')) {
        addresstype = '5'
      }
    }
    let firstName = !validate.isEmpty(this.props.formValues.g1FirstName)
      ? this.props.formValues.g1FirstName.value
      : null;
    let lastName = !validate.isEmpty(this.props.formValues.g1LastName)
      ? this.props.formValues.g1LastName.value
      : null;
    let gender = !validate.isEmpty(this.props.formValues.g1Gender)
      ? this.props.formValues.g1Gender.value
      : null;
    let city = !validate.isEmpty(this.props.formValues.g1City)
      ? this.props.formValues.g1City.value
      : this.props.formValues.City.value;
    let pincode = !validate.isEmpty(this.props.formValues.g1Pincode)
      ? this.props.formValues.g1Pincode.value
      : this.props.formValues.Pincode.value;
    let maritalstatus = !validate.isEmpty(this.props.formValues.g1MaritalStatus)
      ? this.props.formValues.g1MaritalStatus.value
      : null;
    let state = !validate.isEmpty(this.props.formValues.g1State)
      ? this.props.formValues.g1State.value
      : this.props.formValues.State.value;
    let dob = !validate.isEmpty(this.props.formValues.g1DateOfBirth)
      ? this.props.formValues.g1DateOfBirth.value.slice(0, 10)
      : null;
    let aadhar = !validate.isEmpty(this.props.formValues.g1AadhaarNo)
      ? this.props.formValues.g1AadhaarNo.value
      : null;
    let panNo = !validate.isEmpty(this.props.formValues.g1panNo)
      ? this.props.formValues.g1panNo.value
      : null;
    let voterNo = !validate.isEmpty(this.props.formValues.g1VoterIDNumber)
      ? this.props.formValues.g1VoterIDNumber.value :
      null;
    let passportNum = !validate.isEmpty(this.props.formValues.g1passportNo)
      ? this.props.formValues.g1passportNo.value :
      null;
    let dlNo = !validate.isEmpty(this.props.formValues.g1DL_Number)
      ? this.props.formValues.g1DL_Number.value :
      null;
    let loanamount = !validate.isEmpty(this.props.formValues.LoanAmount)
      ? this.props.formValues.LoanAmount.value.replace(/,/g, "")
      : null;
    let address = !validate.isEmpty(this.props.formValues.BorrowerAddress)
      ? this.props.formValues.g1City.value
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
            g1getHighMarkDone: true,
            g1HighMarkScoreloading: false,
            g1HighMarkScore: -1,
            g1HighMarkApiData: response.data,
            g1errorMessage: false,
            g1errMsg: errMsg
          })
        } else {
          let HighMarkScore = response.data.ScoreDetails.Score.Value;
          let CrifLink = response.data.pdfLink;
          this.props.fieldPopulator("g1HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
          this.props.fieldPopulator("g1CrifLink", { type: "String", value: CrifLink });
          let account_summary = response.ResponseXML.BureauResponse.AccountSummaryDetails;
          let total = 0;
          account_summary.AccountSummary.forEach((summary) => {
            total += Number(summary.TotalMonthlyPaymentAmount);
          })
          this.props.fieldPopulator("g1TotalMonthlyPayment", total);
          this.setState({
            g1getHighMarkDone: true,
            g1HighMarkScoreloading: false,
            g1HighMarkScore: HighMarkScore,
            g1HighMarkApiData: response.data,
            g1errorMessage: false
          });
        }
        this.props.fieldPopulator("g1HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
      })
      .catch(e => {
        console.log("error in cibil score api", e);
        this.setState({ g1HighMarkScoreloading: true });
      });
  }
  renderEmploymentInformation = () => {
    let {
      HighMarkApiData: {
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
      HighMarkApiData: {
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
      HighMarkApiData: {
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
      HighMarkApiData: {
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
      HighMarkApiData: {
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
    let { g1members } = this.props.formValues;
    if (g1members) {
      g1members.value.forEach((member, index) => {
        if (modifiedIndex !== index) {
          total += parseInt(member.ExpenseValue.value)
        } else {
          total += parseInt(value.value)
        }
      })
    } else {
      total = parseInt(value.value);
    }
    this.props.fieldPopulator("g1ExpenseTotal", { type: "String", value: total });
  };
  handleIFSCcode = value => {
    let enteredValue = value.value;
    let code = enteredValue;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ g1ifsc: code });
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
        this.setState({ g1voterNo: voterIdNo });
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
        this.setState({ g1pincode: pincode }, () => {
          this.mapCityState();
        })
      } else {
        alert("Pincode doesn't match");
      }
    }
  };
  mapCityState = () => {
    let pincode = this.state.g1pincode;
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
          g1districtOptions: districtDD,
          g1stateOptions: stateDD,
          g1postOfficeOptions: postOfficeDD
        });

      }).catch(error => {
        console.log("mapCityState function error", error)
      })
  }
  PresentAddressAadhaarSame = e => {
    if (e.value === "Yes") {
      this.setState({ g1showPresentAddressFields: false });
    } else {
      this.setState({ g1showPresentAddressFields: true });
    }
  };
  CorrespondenceAddressSame = e => {
    if (e.value === "Yes") {
      this.setState({ g1showCorrespondenceAddressFields: false });
    } else {
      this.setState({ g1showCorrespondenceAddressFields: true });
    }
  };
  PresentAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ g1showPresentAddressSame: false });
    } else {
      this.setState({ g1showPresentAddressSame: true });
    }
  };
  CorrespondenceAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ g1showCorrespondenceAddressSame: false });
    } else {
      this.setState({ g1showCorrespondenceAddressSame: true });
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
  handleNumberChange = value => {
    let enteredValue = value.value;
    let mobNo = enteredValue;
    let number = { type: "String", value: mobNo };
    if (mobNo.length >= 10) {
      let validate = mobNo.match(/^[6-9]{1}[0-9]{9}$/gi) != null;
      if (validate === true) {
        this.setState({ g1mobileNumber: mobNo });
        this.props.fieldPopulator("g1otpmobileNumber", number);
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
        Authorization: authToken,
      },
      data: {
        mobile: "91" + this.props.formValues.g1mobileNumber.value
      }
    };
    this.setState({ g1loading: true });
    axios(config).then(
      response => {
        var pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          let OTP_Status = response.data.smsStatus;
          this.props.fieldPopulator("g1OTP_Status", { type: "String", value: OTP_Status });
        }
        this.setState({
          g1otpPinID: pinID,
          g1loading: false,
          g1buttonLabel: "RESEND OTP",
          g1showSuccess: false,
          g1showFailure: false
        });
      },
      () => {
        this.setState({
          g1loading: false,
          g1buttonLabel: "RESEND OTP",
          g1showSuccess: false,
          g1showFailure: true
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
        Authorization: authToken,
      },
      data: {
        pin_id: this.state.g1otpPinID
      }
    };
    this.setState({ g1loading: true });
    axios(config).then(
      response => {
        var resendpinID = response.data.pinId;
        this.setState({
          g1otpPinID: resendpinID,
          g1otpSent: true,
          g1loading: false,
          g1buttonLabel: "RESEND OTP",
          g1showSuccess: true
        });
      },
      () => {
        this.setState({
          g1loading: false,
          g1buttonLabel: "RESEND OTP",
          g1showSuccess: false,
          g1showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let otpValue = otp;
    this.setState({ g1otp: otpValue });
    this.props.fieldPopulator("g1OTP_Value", { type: "String", value: otpValue });
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      headers: {
        Authorization: authToken,
      },
      data: {
        otp: otpValue,
        pin_id: this.state.g1otpPinID
      }
    };
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ g1verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ g1OTP_submit: true, g1showSuccess: true, g1buttonLabel: "Verified" });
          this.props.fieldPopulator("g1hiddenOTPStatus", {
            type: "String",
            value: this.state.g1verifyOTP
          })
        } else if (response.data.verified === false) {
          this.setState({ g1OTP_submit: true });
          this.props.fieldPopulator("g1hiddenOTPStatus", {
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
    this.setState({ g1otp: value });
    this.setState({ g1OTP_submit: false });
  };
  handleAssetType = value => {
    if (value.value === "Others") {
      this.setState({ g1showOthersComments: true });
    } else if (value.value !== "Others") {
      this.setState({ g1showOthersComments: false });
    }
  };
  handleShowRoomPrice = e => {
    let enteredValue = e.value;
    let price = enteredValue.replace(/,/g, "");
    this.setState({ g1veh_showRoomPrice: price });
    if (
      this.props.formValues.g1RoadTax &&
      this.props.formValues.g1InsuranceAmount
    ) {
      let veh_tax = this.state.g1veh_roadTax;
      let veh_insAmt = this.state.g1veh_InsuranceAmount;
      let veh_otherAmt = this.state.g1veh_othersAmt;
      let veh_onroadprice =
        Number(price) +
        Number(veh_tax) +
        Number(veh_insAmt) +
        Number(veh_otherAmt);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onroadprice)
      };
      this.props.fieldPopulator("g1OnRoadPrice", orp);
    }
  };
  handleRoadTax = e => {
    let enteredValue = e.value;
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ g1veh_roadTax: tax }, () => { });
    if (
      this.props.formValues.g1ExShowroomPrice &&
      this.props.formValues.g1InsuranceAmount
    ) {
      let veh_insAmount = this.state.g1veh_InsuranceAmount;
      let veh_Price = this.state.g1veh_showRoomPrice;
      let veh_Others = this.state.g1veh_othersAmt;
      let veh_onRoadPrice =
        Number(tax) +
        Number(veh_insAmount) +
        Number(veh_Price) +
        Number(veh_Others);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onRoadPrice)
      };
      this.props.fieldPopulator("g1OnRoadPrice", orp);
    }
  };
  handleInsuranceAmount = e => {
    let value = e.value;
    let insAmount = value.replace(/,/g, "");
    this.setState({ g1veh_InsuranceAmount: insAmount }, () => { });
    if (
      this.props.formValues.g1ExShowroomPrice &&
      this.props.formValues.g1RoadTax

    ) {
      let veh_roadTax = this.state.g1veh_roadTax;
      let veh_Price = this.state.g1veh_showRoomPrice;
      let veh_others = this.state.g1veh_othersAmt;
      let vehonRoadPrice =
        Number(veh_roadTax) +
        Number(veh_Price) +
        Number(veh_others) +
        Number(insAmount);
      let orp = {
        type: "String",
        value: this.displayINRformat(vehonRoadPrice)
      };
      this.props.fieldPopulator("g1OnRoadPrice", orp);
    }
  };
  handleOnRoadPrice = e => {
    let enteredValue = e.value;
    let othersAmt = enteredValue.replace(/,/g, "");
    this.setState({ g1veh_othersAmt: othersAmt }, () => { });
    let showRoomPrice = this.state.g1veh_showRoomPrice;
    let roadTax = this.state.g1veh_roadTax;
    let insAmount = this.state.g1veh_InsuranceAmount;
    let onRoadPrice =
      Number(showRoomPrice) +
      Number(roadTax) +
      Number(insAmount) +
      Number(othersAmt);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) };
    this.props.fieldPopulator("g1OnRoadPrice", orp);
  };
  handleApplicantLoan = e => {
    if (e.value === "Yes") {
      this.setState({
        g1showLoanDetails: true
      });
    } else if (e.value === "No" || e.value === "Don't Know") {
      this.setState({
        g1showLoanDetails: false
      });
    }
  };
  handleBusinessrelationship = e => {
    let value = e.value;
    if (value === "Yes") {
      this.setState({
        g1showRelationshipDetails: true
      });
    } else {
      this.setState({
        g1showRelationshipDetails: false
      });
    }
  };
  handleApplicantAddress = e => {
    let value = e.value;
    if (value === "Yes") {
      this.setState({
        g1showAddressDetails: true
      });
    } else {
      this.setState({
        g1showAddressDetails: false
      });
    }
  };

  handleKycSelect = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("g1KYC_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 2) {
      this.props.fieldPopulator("g1kycstatus", {
        type: "String",
        value: "true"
      })
    } else {
      this.props.fieldPopulator("g1kycstatus", {
        type: "String",
        value: ""
      })
    }
  }

  handleAddressVerification = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("g1Addr_selectedValue", { type: "string", value: JSON.stringify(selectedValue) })
  }

  renderMembers() {
    if ((this.props.formValues && !this.props.formValues.g1members) ||
      (this.props.formValues && this.props.formValues.g1members &&
        typeof this.props.formValues.g1members.value !== "string")) {
      return (
        <div className="form-section">
          <FormHeadSection
            sectionLabel="Guarantor ExtraOrdinary Expense"
            sectionKey="g1applicantExtraOrdinaryExpense"
            formSyncError={this.props.formSyncError}
            sectionValidator={this.state.sectionValidator}
          />
          <div className="form-section-content">
            <div className="flex-row">
              <FieldArray
                name="g1members.value"
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
    let g1panDetails =
      this.props.formValues && this.props.formValues.g1panDetails
        ? this.props.formValues.g1panDetails.value
        : null;
    let g1aadharDetails =
      this.props.formValues && this.props.formValues.g1aadharDetails
        ? this.props.formValues.g1aadharDetails.value
        : null;
    let g1passportDetails = this.props.formValues && this.props.formValues.g1passportDetails ? this.props.formValues.g1passportDetails.value : null;
    let g1drivingLicenseDetails = this.props.formValues && this.props.formValues.g1drivingLicenseDetails ? this.props.formValues.g1drivingLicenseDetails.value : null;
    let g1voterIdDetails = this.props.formValues && this.props.formValues.g1voterIdDetails ?
      this.props.formValues.g1voterIdDetails.value : null;


    if (g1panDetails && IsJsonString(g1panDetails)) {
      g1panDetails = JSON.parse(g1panDetails);
    }
    if (g1aadharDetails && IsJsonString(g1aadharDetails)) {
      g1aadharDetails = JSON.parse(g1aadharDetails);
    }
    if (g1passportDetails && IsJsonString(g1passportDetails)) {
      g1passportDetails = JSON.parse(g1passportDetails);
    }
    if (g1drivingLicenseDetails && IsJsonString(g1drivingLicenseDetails)) {
      g1drivingLicenseDetails = JSON.parse(g1drivingLicenseDetails);
    }
    if (g1voterIdDetails && IsJsonString(g1voterIdDetails)) {
      g1voterIdDetails = JSON.parse(g1voterIdDetails);
    }

    const g1KycOptions = [
      { label: 'Aadhaar', value: 'g1Aadhaar' },
      { label: 'Driving License', value: 'g1DrivingLicense' },
      { label: 'PAN', value: 'g1PAN' },
      { label: 'Passport', value: 'g1Passport' },
      { label: 'VoterId', value: 'g1VoterId' },
      { label: 'Single KYC Approval', value: 'g1SingleKYCApproval' }
    ];

    const g1addressOptions = [
      { label: "Permanent Address", value: "g1PermanentAddress" },
      { label: "Residential Address", value: "g1ResidentialAddress" },
      { label: "Work Address", value: "g1WorkAddress" }
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
              sectionLabel="Guarantor Identity Information"
              sectionKey="g1applicantIdentInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            // use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant ID"}
                    name="g1ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "ApplicantID is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Borrower Type"
                    label={<span> Borrower Type<span style={{ color: "red" }}>*</span></span>}
                    name="g1BorrowerType"
                    component={Select}
                    placeholder="Select Borrower Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "BorrowerType is required" })
                    ]}
                  >
                    <Option value="Guarantor_1">Guarantor_1</Option>
                    <Option value="Guarantor_2">Guarantor_2</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Relationship with Applicant"}
                    label={<span> Relationship with Applicant<span style={{ color: "red" }}>*</span></span>}
                    name="g1relationshipWithApplicant"
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
                    // label="Is Guarantor an Existing Customer?"
                    label={<span> Is Guarantor an Existing Customer?<span style={{ color: "red" }}>*</span></span>}
                    name="g1existingCustomer"
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
              sectionLabel="Guarantor Basic Information"
              sectionKey="g1applicantBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"First Name"}
                    label={<span> First Name <span style={{ color: "red" }}>*</span></span>}
                    name="g1FirstName"
                    component={TextBox}
                    placeholder="Enter First Name"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "FirstName is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Middle Name"}
                    name="g1MiddleName"
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
                    label={<span> Last Name <span style={{ color: "red" }}>*</span></span>}
                    name="g1LastName"
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
                    name="g1Gender"
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
                    label={<span> Salutation <span style={{ color: "red" }}>*</span></span>}
                    name="g1Salutation"
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
                    name="g1DateOfBirth"
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
                    // label={"Last Name"}
                    label={"Age"}
                    name={"g1Age"}
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
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Guarantor KYC Information"
              sectionKey="g1applicantKYC"
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
                      options={g1KycOptions}
                      defaultValue={this.props.formValues.g1KYC_selectedValue ? JSON.parse(this.props.formValues.g1KYC_selectedValue.value) : ""}
                      onChange={this.handleKycSelect} />
                  </div>
                  <Field
                    hidden={true}
                    name="g1kycstatus"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "kycstatus is required" })
                    ]}
                  />
                </div>
              </div>
              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1Aadhaar")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Aadhaar Name"}
                        name="g1AadhaarName"
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
                        label={"Aadhaar Number"}
                        name="g1AadhaarNo"
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
                        label=" Aadhaar Date Of Birth "
                        name="g1AadhaarDOB"
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
                        name="g1Aadhaar_Scanner"
                        component={Scanner}
                        docType="AADHAR"
                        imageVar={"g1aadharImg"}
                        parserVar={"g1aadharDetails"}
                        metaVar={"g1aadhaarMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={g1aadharDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {g1aadharDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {g1aadharDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Aadhaar Number :
                            </span>{" "}
                            {g1aadharDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {g1aadharDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Gender :
                            </span>{" "}
                            {g1aadharDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1DrivingLicense")) &&
                <React.Fragment>
                  <div className="flex-row">

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Date Of Birth"
                        name="g1DL_DateOfBirth"
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
                        label="Date Of Issue"
                        name="g1DL_IssueDate"
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
                        label="Date Of Expiry"
                        name="g1DL_ExpiryDate"
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
                        label={"Driving License Number"}
                        name="g1DL_Number"
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
                        name="g1DL_Scanner"
                        component={Scanner}
                        docType="DL"
                        imageVar={"g1DLImg"}
                        parserVar={"g1drivingLicenseDetails"}
                        metaVar={"g1drivingLicenseMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={g1drivingLicenseDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {g1drivingLicenseDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                            {g1drivingLicenseDetails.bloodGroup}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                            {" "}
                            {g1drivingLicenseDetails.dateOfBirth}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {g1drivingLicenseDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                            {" "}
                            {g1drivingLicenseDetails.dateOfExpiry}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                            {" "}
                            {g1drivingLicenseDetails.dlId}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>State :</span>
                            {" "}
                            {g1drivingLicenseDetails.dlState}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1PAN")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Name"}
                        name="g1panName"
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
                        label={"Pan Number"}
                        name="g1panNo"
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
                        label="Date Of Birth"
                        name="g1panDOB"
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
                        label={"Father Name"}
                        name="g1panFatherName"
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
                        name="g1PAN_Scanner"
                        component={Scanner}
                        docType="PAN"
                        imageVar={"g1panImg"}
                        parserVar={"g1panDetails"}
                        metaVar={"g1panMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={g1panDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {g1panDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {g1panDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {g1panDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {g1panDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {g1panDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1Passport")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Type Of Passport"}
                        name="g1passportType"
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
                        label={"Passport Number"}
                        name="g1passportNo"
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
                        label="Date Of Issue"
                        name="g1passport_IssueDate"
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
                        label="Date Of Expiry"
                        name="g1passport_ExpiryDate"
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
                        name="g1Passport_Scanner"
                        component={Scanner}
                        docType="PASSPORT"
                        imageVar={"g1passportImg"}
                        parserVar={"g1passportDetails"}
                        metaVar={"g1passportMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={g1passportDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {g1passportDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {g1passportDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Aadhaar Number :</span>
                            {" "}
                            {g1passportDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>
                            {" "}
                            {g1passportDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>
                            {" "}
                            {g1passportDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1VoterId")) && <React.Fragment >
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Voter ID Number"}
                        name="g1VoterIDNumber"
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
                        label={" Name in Voter ID "}
                        name="g1VoterIDName"
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
                        label={"Father Name"}
                        name="g1VoterIDFatherName"
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
                        name="g1Voter_Scanner"
                        component={Scanner}
                        docType="VOTERID"
                        imageVar={"g1voterIdImage"}
                        parserVar={"g1voterIdDetails"}
                        metavar={"g1voterIdMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={g1voterIdDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {g1voterIdDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {g1voterIdDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {g1voterIdDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                            {g1voterIdDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {g1voterIdDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.g1KYC_selectedValue &&
                JSON.parse(this.props.formValues.g1KYC_selectedValue.value).includes("g1SingleKYCApproval")) &&
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    {/** File Uploader */}
                    <Field
                      label={"Single KYC Image "}
                      name="g1singleKycImage"
                      component={Scanner}
                      docType="IMG"
                      imageVar={"g1singleKycimage"}
                      metaVar={"g1singlrKysMeta"}
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
              sectionLabel="Guarantor Detailed Information"
              sectionKey="g1applicantDetailedInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Mobile number <span style={{ color: "red" }}>*</span></span>}
                    name="g1mobileNumber"
                    component={TextBox}
                    placeholder="Enter Mobile Number"
                    type="text"
                    hasFeedback
                    // disabled={true}
                    onChange={this.handleNumberChange}
                    maxlength="10"
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Mobile number is required" }),
                      A8V.minLength({
                        errorMsg: "",
                        min: 10
                      }),
                      A8V.maxLength({
                        errorMsg: "",
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
                            this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                            this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                            this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                            this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                            this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                            this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                            this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                            // this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
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
                    name="g1AlternativePhone"
                    component={TextBox}
                    placeholder="Enter Alternative Phone Number"
                    type="text"
                    hasFeedback
                    // onChange={this.handleNumberChange}
                    className="form-control-coustom"
                    validate={[
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
                            this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                            this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                            this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                            this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                            this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                            this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                            this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                            this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
                            // this.props.formValues.g1AlternativePhone ? this.props.formValues.g1AlternativePhone.value : '',
                            this.props.formValues.g2mobileNumber ? this.props.formValues.g2mobileNumber.value : '',
                            this.props.formValues.g2AlternativePhone ? this.props.formValues.g2AlternativePhone.value : '',
                          ]
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Email Id"}
                    name="g1Email"
                    component={TextBox}
                    placeholder="Enter Email"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Citizenship"
                    name="g1Citizenship"
                    component={Select}
                    placeholder="Select Citizenship"
                    className="a8Select"
                    onChange={this.citizenshipChange}
                    validate={[
                      A8V.required({ errorMsg: "Citizenship is required" })
                    ]}
                  >
                    {/* {this.state.g1citizenshipOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                   ))}*/}
                  </Field>
                </div>
                {this.state.g1showResidencyStatus && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // disabled={this.state.disableResidencyStatus}
                      label="Residency Status"
                      name="g1ResidencyStatus"
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
                    label="Religion"
                    name="g1Religion"
                    component={Select}
                    placeholder="Select Religion"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Religion is required" })
                    ]}
                  >
                    {this.state.g1religionOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Caste"
                    name="g1Caste"
                    component={Select}
                    placeholder="Select Caste"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Caste is required" })]}
                  >
                    {this.state.g1casteOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Marital Status"
                    name="g1MaritalStatus"
                    component={Select}
                    placeholder="Enter MaritalStatus"
                    // onChange= {this.handleMaritalStatus}
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Marital Status is required" })
                    ]}
                  >
                    {this.state.g1maritalStatusOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Education Level"
                    name="g1EducationLevel"
                    component={Select}
                    placeholder="Select EducationLevel"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "EducationLevel is required" })
                    ]}
                  >
                    {this.state.g1educationOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Father Name"}
                    name="g1FatherName"
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
                    name="g1MotherMaidenName"
                    component={TextBox}
                    placeholder="Enter Mother Maiden Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "MotherMaidenName is required" })
                    ]}
                  />
                </div>
                {this.props.formValues.g1MaritalStatus &&
                  this.props.formValues.g1MaritalStatus.value === "Married" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableSpouseName}
                        label={"Spouse Name"}
                        name="g1SpouseName"
                        component={TextBox}
                        placeholder="Enter Spouse Name"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant a MicroBanking customer?"
                    name="g1ApplicantMBCustomer"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.MbCustomerChange}
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
                {this.props.formValues.g1ApplicantMBCustomer &&
                  this.props.formValues.g1ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableSangamBranch}
                        label={"Sangam Name"}
                        name="g1SangamName"
                        component={TextBox}
                        placeholder="Enter SangamName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.g1ApplicantMBCustomer &&
                  this.props.formValues.g1ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        disabled={this.state.disableMbBranchName}
                        label={"Microbanking Branch Name"}
                        name="g1MBBranchName"
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
            this.props.formValues.g1mobileNumber &&
            this.props.formValues.g1mobileNumber.value && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="OTP Verification"
                  sectionKey="g1applicantOtpVerification"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label="Mobile number"
                        name="g1mobileNumber"
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
                                this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                                this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                                this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                                this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                                this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                                this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                                this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                                // this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
                                this.props.formValues.g1AlternativePhone ? this.props.formValues.g1AlternativePhone.value : '',
                                this.props.formValues.g2mobileNumber ? this.props.formValues.g2mobileNumber.value : '',
                                this.props.formValues.g2AlternativePhone ? this.props.formValues.g2AlternativePhone.value : '',
                              ]
                          })
                        ]}
                        buttonLabel={this.state.g1buttonLabel}
                        isButtonLoading={this.state.g1loading}
                        showSuccesIcon={this.state.g1showSuccess}
                        showFailureIcon={this.state.g1showFailure}
                        onButtonClick={() => {
                          this.state.g1buttonLabel === "SEND OTP"
                            ? this.handleSendApi()
                            : this.handleResendApi();
                        }}
                      />
                    </div>
                    {
                      this.props.formValues && this.props.formValues.g1OTP_Status && (
                        <div className="form-group ">
                          <Otp
                            numInputs={4}
                            submitLabel={"submit"}
                            disableSubmit={this.state.g1OTP_submit}
                            mobileNumber={
                              this.props.formValues.g1mobileNumber
                                ? this.props.formValues.g1mobileNumber.value
                                : null
                            }
                            value={this.props.formValues.g1OTP_Value && this.props.formValues.g1OTP_Value.value}
                            handleOtpNumber={this.handleOtpNumber}
                            otpOnchange={this.onchangeOtp}
                            className=""
                          />
                        </div>
                      )}
                    <Field
                      hidden={true}
                      name="g1hiddenOTPStatus"
                      component={TextBox}
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "hiddenOTPStatus is required" })
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Guarantor Address Information"
              sectionKey="g1applicantAddressInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is present address same as Applicant?"
                    name="g1PresentAddressSameAsApplicant"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressSameAsApplicant}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.g1showPresentAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"House No/Name"}
                        name="g1HouseName"
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
                        label={"Street/Area"}
                        name="g1StreetArea"
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
                        label={"City/Village/Town"}
                        name="g1City"
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
                        label={"Pincode"}
                        name="g1Pincode"
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
                        label={"Post Office"}
                        name="g1PostOffice"
                        component={Select}
                        placeholder="Select  PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "PostOffice is required" })
                        ]}
                      >
                        {this.state.g1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="g1District"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.g1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="g1State"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.g1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>


                  </React.Fragment>
                )}

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Aadhaar address?<span style={{ color: "red" }}>*</span></span>}
                    name="g1PresentAddressAadhaarSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressAadhaarSame}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.g1showPresentAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={" Address ProofType"}
                        name="g1permanentAddressType"
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
                        label={" Address ProofNumber"}
                        name="g1permanentAddressNumber"
                        component={TextBox}
                        placeholder="Enter Address ProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"House No/Name"}
                        name="g1permanentHouseName"
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
                        label={"Street/Area"}
                        name="g1permanentStreetArea"
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
                        label={"City/Village/Town"}
                        name="g1permanentCity"
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
                        label={"Pincode"}
                        name="g1permanentPincode"
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
                        label={"Post Office"}
                        name="g1permanentPostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                      >
                        {this.state.g1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="g1permanentDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.g1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="g1permanentState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.g1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="g1permanentLandMark"
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
                        name="g1permanentYearsPresentAddress"
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

                    label={<span>Is correspondence address same as Permanent address?<span style={{ color: "red" }}>*</span></span>}
                    name="g1permanentCorrespondenceAddressSame"
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
                {this.state.g1showCorrespondenceAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={" AddressProof Type"}
                        name="g1CorrespondenceAddressProofType"
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
                        label={"Address ProofNumber"}
                        name="g1CorrespondenceAddressProofNumber"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"House No/Name"}
                        name="g1CorrespondenceHouseName"
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
                        label={"Street/Area"}
                        name="g1CorrespondenceStreetArea"
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
                        label={"City/Village/Town"}
                        name="g1CorrespondenceCity"
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
                        label={"Pincode"}
                        name="g1CorrespondencePincode"
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
                        label={"Post Office"}
                        name="g1CorrespondencePostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                      >
                        {this.state.g1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="g1CorrespondenceDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.g1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="g1CorrespondenceState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.g1stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="g1CorrespondenceLandMark"
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
                    label={<span>Is correspondence address same as Applicant?<span style={{ color: "red" }}>*</span></span>}
                    name="g1CorrespondenceAddressSameApplicant"
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
                {this.state.g1showCorrespondenceAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={" AddressProof Type"}
                        name="g1CorrespondenceAddressProofTypeAsApplicant"
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
                        label={"Address ProofNumber"}
                        name="g1CorrespondenceAddressProofNumberAsApplicant"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"House No/Name"}
                        name="g1CorrespondenceHouseNameAsApplicant"
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
                        name="g1CorrespondenceStreetAreaAsApplicant"
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
                        name="g1CorrespondenceCityAsApplicant"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Pincode"}
                        name="g1CorrespondencePincodeAsApplicant"
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
                        name="g1CorrespondencePostOfficeAsApplicant"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.g1postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="g1CorrespondenceDistrictAsApplicant"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.g1districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="g1CorrespondenceStateAsApplicant"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.g1stateOptions.map(data => (
                          <Option value={data.value}>{data.label}</Option>
                        ))}
                      </Field>
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="g1CorrespondenceLandMarkAsApplicant"
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
              sectionLabel="Guarantor Employment Information"
              sectionKey="g1applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Occupation Type<span style={{ color: "red" }}>*</span></span>}
                    name="g1OccupationType"
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
                {this.state.g1showSalariedFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="g1salariedTypeofJob"
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
                        name="g1salariedExperienceCurrentJob"
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
                        label={<span>Monthly Gross Salary<span style={{ color: "red" }}>*</span></span>}
                        name="g1salariedMonthlyGrossSalary"
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
                        label={<span>Monthly Fixed Obligation<span style={{ color: "red" }}>*</span></span>}
                        name="g1salariedMonthlyFixedObligation"
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
                        name="g1salariedGrossAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Annual Income"
                        // normalize={inrFormat}
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
                        name="g1salariedNetAnnualIncome"
                        component={TextBox}
                        placeholder="Enter Net Income"
                        // normalize={inrFormat}
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
                            label={"Office Name"}
                            name="g1salariedOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Office Address No"}
                            name="g1SalariedOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Street/Area"}
                            name="g1SalariedStreetArea"
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
                            name="g1SalariedCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Pincode"}
                            name="g1SalariedPincode"
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
                            label={"Post Office"}
                            name="g1SalariedPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.g1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="g1SalariedDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.g1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="g1SalariedState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.g1stateOptions.map(data => (
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
                {this.state.g1showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Business"
                        name="g1BusinessType"
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
                        name="g1BusinessName"
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
                        name="g1Constitution"
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
                        name="g1BusinessStructure"
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
                        name="g1BusinessModel"
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
                        name="g1BusinessStartDate"
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
                        name="g1BusinessAge"
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
                        name="g1businessEmployeeCount"
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
                        name="g1CurrentBusinessExp"
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
                        label="Annual Turnover"
                        name="g1businessAnnualTurnover"
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
                        label={"Monthly Gross Salary"}
                        name="g1businessMonthlyGrossSalary"
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
                        name="g1businessMonthlyFixedObligation"
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
                        name="g1businessGrossAnnualIncome"
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
                        name="g1businessNetAnnualIncome"
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
                            label={"Office Name"}
                            name="g1businessOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Office Address No"}
                            name="g1businessOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Street/Area"}
                            name="g1businessStreetArea"
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
                            name="g1businessCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Pincode"}
                            name="g1businessPincode"
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
                            label={"Post Office"}
                            name="g1businessPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.g1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="g1businessDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.g1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="g1businessState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.g1stateOptions.map(data => (
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
                {this.state.g1showOthersFields &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Type of Job"
                      name="g1JobType"
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
                      <Option value="Employedlocally??">
                        Employed locally??
                        </Option>
                      <Option value="HomeMaker">Home Maker</Option>
                      <Option value="Student">Student</Option>
                      <Option value="NRI">NRI</Option>
                    </Field>
                  </div>}
                {this.state.g1showJobTypeFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Total Years of Experience in Current job"
                        name="g1ExperienceCurrentJob"
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
                        label={"Daily Income"}
                        name="g1othersDailyIncome"
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
                        name="g1othersWorkingDayCount"
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
                        name="g1othersGrossMonthlyIncome"
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
                        name="g1othersMonthlyFixedObligation"
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
                        name="g1OthersGrossAnnualSalary"
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
                        name="g1NetAnnualIncomeOthers"
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
                            label={"Office Name"}
                            name="g1othrOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Office Address No"}
                            name="g1othrOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address No"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Street/Area"}
                            name="g1othrStreetArea"
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
                            name="g1othrCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Pincode"}
                            name="g1othrPincode"
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
                            label={"Post Office"}
                            name="g1othrPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.g1postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="g1othrDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.g1districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="g1othrState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.g1stateOptions.map(data => (
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
                    <Checkbox.Group style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox" options={g1addressOptions}
                      defaultValue={this.props.formValues.g1Addr_selectedValue ? JSON.parse(this.props.formValues.g1Addr_selectedValue.value) : ""} onChange={this.handleAddressVerification} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {this.renderMembers()}
          {(!this.props.formValues.g1JobType ||
            (this.props.formValues.g1JobType &&
              this.props.formValues.g1JobType.value !== "HomeMaker" &&
              this.props.formValues.g1JobType.value !== "Student")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"FOIR Calculation"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  {this.state.g1showFoirProgress && (
                    <div style={{ width: "100%" }}>
                      {this.state.g1foirValue > 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.g1FoirValue &&
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
                                <p>{this.props.formValues.g1FoirValue.value}/100</p>
                              </Card>
                            </div>
                          }
                          <Result
                            icon={<Icon type="dislike" theme="twoTone" />}
                            title="Oops, Not Eligible to proceed with CRIF!"
                          />
                          <div style={{ textAlign: "center" }}>
                            <Button
                              className="api-button"
                              type="danger"
                              size="default"
                              style={{
                                marginTop: 29,
                                marginBottom: 29,
                                marginLeft: 40
                              }}
                              onClick={() => this.handleFoirCalculation()}
                            >
                              Recalcuate FOIR
                        </Button>
                          </div>
                        </React.Fragment>
                      }
                      {this.state.g1foirValue <= 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.g1FoirValue &&
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
                                <p>{this.props.formValues.g1FoirValue.value}/100</p>
                              </Card>
                            </div>
                          }
                          <Result
                            icon={<Icon type="like" theme="twoTone" />}
                            title="Great, We are ready to proceed with CRIF!"
                          />
                          <Button
                            className="api-button"
                            type="danger"
                            size="default"
                            // disabled={true}

                            style={{
                              marginTop: 29,
                              marginBottom: 29,
                              marginLeft: 40
                            }}
                            onClick={() => this.handleCRIF()}
                            loading={this.state.g1HighMarkScoreloading}
                          >
                            Generate CRIF Details
                        </Button>
                        </React.Fragment>

                      }
                    </div>
                  )}
                  {this.state.g1showFoirButton && (
                    <div className="form-group col-xs-6 col-md-4" style={{ textAlign: "center" }}>
                      <Button
                        className="api-button"
                        type="danger"
                        size="default"
                        style={{ marginTop: 29 }}
                        onClick={() => this.handleFoirCalculation()}
                      >
                        Calcuate FOIR
                    </Button>
                      <Field
                        hidden={true}
                        name="g1FoirValue"
                        component={TextBox}
                        type="text"
                        className=" form-control-custom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>}

          {this.props.formValues.g1JobType &&
            (this.props.formValues.g1JobType.value === "HomeMaker" ||
              this.props.formValues.g1JobType.value === "Student") &&
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
                      loading={this.state.g1HighMarkScoreloading}
                    > Generate CRIF Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.g1getHighMarkDone && (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="CRIF HighMark"
                sectionKey="g1CRIFScore"
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
                        value={this.state.g1HighMarkScore}
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
                        currentValueText={`HighMark Score: ${this.state.g1HighMarkScore}`}
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
              sectionLabel="Guarantor Banking History with ESAF "
              sectionKey="g1applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant banking with ESAF?"
                    name="g1ESAFCustomer"
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
                {this.props.formValues.g1ESAFCustomer &&
                  this.props.formValues.g1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableBranchName}
                        label={"Branch Name"}
                        name="g1BranchName"
                        component={TextBox}
                        placeholder="Enter BranchName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.g1ESAFCustomer &&
                  this.props.formValues.g1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableAccountNumber}
                        label={"Account Number"}
                        name="g1AccountNumber"
                        component={TextBox}
                        placeholder="Enter AccountNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.g1ESAFCustomer &&
                  this.props.formValues.g1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableAccountType}
                        label="Account Type"
                        name="g1AccountType"
                        component={Select}
                        placeholder="Select AccountType"
                        className="a8Select"
                      >
                        <Option value="Savings">Savings</Option>
                        <Option value="Current">Current</Option>
                      </Field>
                    </div>
                  )}
                {this.props.formValues.g1ESAFCustomer &&
                  this.props.formValues.g1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableIFSCCode}
                        label={"IFSCCode"}
                        name="g1IFSCCode"
                        component={TextBox}
                        placeholder="Enter IFSCCode(CASE-SENSITIVE)"
                        onChange={this.handleIFSCcode}
                        maxlength="11"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.g1ESAFCustomer &&
                  this.props.formValues.g1ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableBankingHistory}
                        label="Banking Since"
                        name="g1BankingHistory"
                        component={Select}
                        placeholder="Select BankingHistory"
                        className="a8Select"
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
  console.log("++++++State of G1 Basic++++++", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessNew")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessNew")(state)
  };
};

export default connect(mapStateToProps, {})(TabGuarantorNew1);


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
