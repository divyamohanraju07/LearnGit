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
import validate from "validate.js";

const { Option } = SelectHelper;
const { Panel } = Collapse;

class TabCoApplicantNew4 extends React.Component {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      c4FormScanner: [],
      c4FormScannerQR: [],
      c4applicantIdentInfo: [
        "c4ApplicantID",
        "c4BorrowerType",
        "c4existingCustomer",
        "c4relationshipWithApplicant"
      ],
      c4applicantBasicInfo: [
        "c4FirstName",
        "c4LastName",
        "c4Gender",
        "c4Salutation",
        "c4DateOfBirth",
        "c4VoterID"
      ],
      c4applicantKYC: [
        "c4kycstatus",
        "c4AadhaarName",
        "c4AadhaarNo",
        "c4AadhaarDOB",
        "c4DL_DateOfBirth",
        "c4DL_IssueDate",
        "c4DL_ExpiryDate",
        "c4DL_Number",
        "c4panName",
        "c4panNo",
        "c4panDOB",
        "c4panFatherName",
        "c4passportType",
        "c4passportNo",
        "c4passport_IssueDate",
        "c4passport_ExpiryDate",
        "c4VoterIDNumber",
        "c4VoterIDName",
        "c4VoterIDFatherName",
      ],
      c4applicantEmpInfo: [
        "c4OccupationType",
        "c4VerifyAddress"
      ],
      c4applicantExtraOrdinaryExpense: [
        "c4ExtraExpenseType",
        "c4ExpenseValue",
        "c4members"
      ],
      c4foirCalculation: [""],
      c4CRIFScore: [""],
      c4applicantDetailedInfo: [
        "c4Citizenship",
        "c4ResidencyStatus",
        "c4Religion",
        "c4Caste",
        "c4MaritalStatus",
        "c4EducationLevel",
        "c4FatherName",
        "c4SpouseName",
        "c4MotherMaidenName",
        "c4ApplicantMBCustomer"
      ],
      c4applicantOtpVerification: ["c4hiddenOTPStatus"],
      c4applicantAddressInfo: [
        "c4permanentAddressType",
        "c4permanentAddressProofNumber",
        "c4HouseName",
        "c4StreetArea",
        "c4City",
        "c4District",
        "c4State",
        "c4Pincode",
        "c4PresentAddressAadhaarSame",
        "c4CorrespondenceAddressSame",
        "c4PresentAddressSameAsApplicant",
        "c4CorrespondenceAddressSameAsApplicant"
      ],
      c4applicantBankingHistory: [
        "c4ESAFCustomer",
        "c4BranchName",
        "c4AccountNumber",
        "c4AccountType",
        "c4IFSCCode",
        "c4BankingHistory"
      ],
      c4ReferencesInfo: [
        "c4ReferenceName_1",
        "c4ReferenceAddress_1",
        "c4ReferenceMobile_1",
        "c4ReferenceType_1",
        "c4ReferenceName_2",
        "c4ReferenceAddress_2",
        "c4ReferenceMobile_2",
        "c4ReferenceType_2",
        "c4RelatedToApplicant?",
        "c4KnowApplicantSince",
        "c4ApplicantJobType",
        "c4BusinessrelationWithApplicant",
        "c4ApplicantJobAddress",
        "c4ApplicantJobStability",
        "c4AwareOfApplicantAddress",
        "c4ApplicantHasLoans",
        "c4ApplicantBusinessgrasp",
        "c4Businessperformance",
        "c4Overallfeedback",
        "c4ReferenceComment"
      ]
    },
    c4showSalariedFields: false,
    c4salariedMonthlySalary: "",
    c4showBusinessFields: false,
    c4businessMonthlySalary: "",
    c4showOthersFields: false,
    c4showJobTypeFields: false,
    c4showResidencyStatus: false,
    c4showLoanDetails: false,
    c4showAddressDetails: false,
    c4showRelationshipDetails: false,
    c4AadhaarQRCodeScan: "",
    c4veh_InsuranceAmount: 0,
    c4veh_showRoomPrice: 0,
    c4veh_roadTax: 0,
    c4veh_othersAmt: 0,
    c4netAnnual: "",
    c4startDate: "",
    c4Age: "",
    c4dayCount: "",
    c4CustomerAccountNumber: "",
    c4responseData: {},
    c4mappedJson: {},
    c4loantypeOptions: [],
    c4loanSubtypeOptions: [],
    c4stateOptions: [],
    c4StateOptions: [],
    c4religionOptions: [],
    c4educationOptions: [],
    c4casteOptions: [],
    c4maritalStatusOptions: [],
    c4citizenshipOptions: [],
    c4postOfficeOptions: [],
    c4districtOptions: [],
    c4showFoirField: false,
    c4showFoirProgress: false,
    c4showFoirButton: true,
    c4ifsc: "",
    c4voterNo: "",
    c4otp: "",
    c4verifyOTP: "",
    c4OTP_submit: false,
    c4mobileNumber: "",
    c4otpPinID: "",
    c4showFailure: false,
    c4showVerifiedCheck: false,
    c4showVerifiedUncheck: false,
    c4otpSent: false,
    c4buttonLabel: "SEND OTP",
    c4loading: false,
    c4showSuccess: false,
    c4showOTPverification: false,
    c4InsuranceAmount: "",
    c4monthlyIncomeOthers: "",
    c4salObligationValue: "",
    c4busiObligationValue: "",
    c4othersObligationValue: "",
    c4foirValue: "",
    c4HighMarkScoreloading: false,
    c4getHighMarkDone: false,
    c4HighMarkScore: 0,
    c4HighMarkApiData: null,
    c4pincode: "",
    c4errorMessage: "",
    c4errMsg: "",

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
    //       c4loantypeOptions: loanTypeDD
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
        this.setState({ c4educationOptions: educationDD });
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
        this.setState({ c4casteOptions: casteDD });
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
        this.setState({ c4maritalStatusOptions: maritalStatusDD });
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
        this.setState({ c4religionOptions: religionDD });
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
    //       c4StateOptions: stateDD
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
    //     this.props.fieldPopulator("c4Citizenship", { type: "String", value: "India", valueInfo: {} });
    //     this.setState({ c4citizenshipOptions: citizenDD });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    this.props.fieldPopulator("c4Citizenship", { type: "String", value: "India", valueInfo: {} });
    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.c4OccupationType &&
      this.props.formValues.c4OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.c4OccupationType);
      if (this.props.formValues.c4JobType) {
        this.handleOtherJobType(this.props.formValues.c4JobType);
      }
    }
    if (this.props.formValues &&
      this.props.formValues.c4OTP_Value &&
      this.props.formValues.c4OTP_Value.value !== "") {
      // this.
      // this.handleOtpNumber(this.props.formValues.OTP_Value.value);
      if (this.props.formValues.c4hiddenOTPStatus &&
        this.props.formValues.c4hiddenOTPStatus.value === "true") {
        this.setState({ c4OTP_submit: true, c4showSuccess: true, c4buttonLabel: "Verified", c4otp: this.props.formValues.c4OTP_Value.value });
      } else if (this.props.formValues.c4hiddenOTPStatus &&
        this.props.formValues.c4hiddenOTPStatus.value === "false") {
        this.setState({ c4OTP_submit: false, c4showFailure: true, c4buttonLabel: "Resend OTP", c4otp: this.props.formValues.c4OTP_Value.value });
      }
    }
    if (
      this.props.formValues &&
      this.props.formValues.c4LoanType &&
      this.props.formValues.c4LoanType.value !== ""
    ) {
      this.loanTypeChange(this.props.formValues.c4LoanType);
    }

    if (!validate.isEmpty(this.props.formValues && this.props.formValues.c4HighMarkData)) {
      let HighMarkData = this.props.formValues.c4HighMarkData.value;
      if (HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
        let errMsg = HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
        this.setState({
          c4getHighMarkDone: true,
          c4HighMarkScoreloading: false,
          c4HighMarkScore: -1,
          c4showFoirButton: false,
          c4HighMarkApiData: HighMarkData,
          c4errorMessage: false,
          c4errMsg: errMsg,
          c4showFoirProgress: true,
          c4foirValue: this.props.formValues.c4FoirValue ? this.props.formValues.c4FoirValue.value : 0
        })
      } else {
        let HighMarkScore = HighMarkData.ResponseXML.BureauResponse.ScoreDetails.score.value;
        this.setState({
          c4getHighMarkDone: true,
          c4HighMarkScoreloading: false,
          c4HighMarkScore: HighMarkScore,
          c4HighMarkApiData: HighMarkData,
          c4errorMessage: false,
          c4showFoirProgress: true,
          c4showFoirButton: false,
          c4foirValue: this.props.formValues.c4FoirValue ? this.props.formValues.c4FoirValue.value : 0
        });
      }
    }
  }

  handleOccupationType = e => {
    if (e.value === "Salaried") {
      this.setState({
        c4showSalariedFields: true,
        c4showBusinessFields: false,
        c4showOthersFields: false
      });
    } else if (e.value === "Business") {
      this.setState({
        c4showSalariedFields: false,
        c4showBusinessFields: true,
        c4showOthersFields: false
      });
    } else if (e.value === "Others") {
      this.setState({
        c4showSalariedFields: false,
        c4showBusinessFields: false,
        c4showOthersFields: true
      });
    }
  };
  handleOtherJobType = (e) => {
    if (e.value === "Student" || e.value === "HomeMaker") {
      this.setState({
        c4showJobTypeFields: false,
      });
    } else {
      this.setState({
        c4showJobTypeFields: true,
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
      "COA_4" + StateCode + currentYear + currentMonth + currentDate;
    let apIDs = { type: "String", value: applicationNumber };
    this.props.fieldPopulator("c4ApplicationID", apIDs);
  };
  citizenshipChange = value => {
    if (value && value.value === "India") {
      this.setState({ c4showResidencyStatus: false });
    } else {
      this.setState({ c4showResidencyStatus: true });
      this.props.fieldPopulator("c4ResidencyStatus", "");
    }
  };
  handleChange_age = e => {
    let age = moment().diff(e.value, 'years');
    this.props.fieldPopulator("c4Age", {
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
    this.setState({ c4startDate: selected, Age: age });
    this.props.fieldPopulator("c4BusinessAge", bsDate);
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
    this.setState({ c4salariedMonthlySalary: salariedmonthly });
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross };
    if (!this.props.formValues.c4salariedMonthlyFixedObligation) {
      this.setState({ c4salariedAnnualIncome: salariedGross });
      this.props.fieldPopulator("c4salariedGrossAnnualIncome", gross);
    } else if (this.props.formValues.c4salariedMonthlyFixedObligation) {
      let salariedObligationValue = this.state.c4salObligationValue;
      let netIncome = this.displayINRformat(
        salariedGross.replace(/,/g, "") - salariedObligationValue * 12
      );
      let net = { type: "String", value: netIncome };
      this.props.fieldPopulator("c4salariedGrossAnnualIncome", gross);
      this.props.fieldPopulator("c4salariedNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationSalaried = value => {
    let enteredValue = value.value;
    let salariedObligation = enteredValue.replace(/,/g, "");
    let monthlySurplus = this.props.formValues.c4salariedMonthlyGrossSalary
      .value;
    let salariedMonthlySurplus = this.displayINRformat(
      monthlySurplus.replace(/,/g, "") - salariedObligation
    );
    this.setState({ c4salObligationValue: salariedObligation });
    let salariedGrossAnnual = this.props.formValues.c4salariedGrossAnnualIncome
      .value;
    let salariednetIncome = this.displayINRformat(
      salariedGrossAnnual.replace(/,/g, "") - salariedObligation * 12
    );
    let surplus = { type: "String", value: salariedMonthlySurplus };
    let net = { type: "String", value: salariednetIncome };
    this.props.fieldPopulator("c4salariedNetAnnualIncome", net);
    this.props.fieldPopulator("c4salariedMonthlySurplus", surplus);
  };
  businesshandleMonthlySalary = value => {
    let enteredValue = value.value;
    let businessmonthly = enteredValue.replace(/,/g, "");
    this.setState({ c4businessMonthlySalary: businessmonthly });
    let businessGross = this.displayINRformat(
      businessmonthly.replace(/,/g, "") * 12
    );
    let gross = { type: "String", value: businessGross };
    this.props.fieldPopulator("c4businessGrossAnnualIncome", gross);
    if (this.props.formValues.c4businessMonthlyFixedObligation) {
      let businessObligation = this.state.c4busiObligationValue;
      let netIncomeBusiness = this.displayINRformat(
        businessGross.replace(/,/g, "") - businessObligation * 12
      );
      let net = { type: "String", value: netIncomeBusiness };
      this.props.fieldPopulator("c4businessGrossAnnualIncome", gross);
      this.props.fieldPopulator("c4businessNetAnnualIncome", net);
    }
  };
  handlemonthlyObligationBusiness = value => {
    let enteredValue = value.value;
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ c4busiObligationValue: businessObligation });
    let monthlySalary = this.state.c4businessMonthlySalary;
    let BusinessMonthlySurplus = this.displayINRformat(
      monthlySalary - businessObligation
    );
    let businessGrossAnnual = this.props.formValues.c4businessGrossAnnualIncome
      .value;
    let businessnetIncome = this.displayINRformat(
      businessGrossAnnual.replace(/,/g, "") - businessObligation * 12
    );
    let surplus = { type: "String", value: BusinessMonthlySurplus };
    let net = { type: "String", value: businessnetIncome };
    this.props.fieldPopulator("c4TotalMonthlySurplus", surplus);
    this.props.fieldPopulator("c4businessNetAnnualIncome", net);
  };
  handlemonthlyObligationOthers = value => {
    let enteredValue = value.value;
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ c4othersObligationValue: othersObligation });
    let othersGrossMonthly = this.props.formValues.c4othersGrossMonthlyIncome
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
    this.props.fieldPopulator("c4NetAnnualIncomeOthers", net);
    this.props.fieldPopulator("c4othersMonthlySurplus", surplus);
  };
  handleDailyIncomeChange = value => {
    let enteredValue = value.value;
    let OthersdailyIncome = enteredValue.replace(/,/g, "");
    let values = { type: "String", value: "" };
    this.setState({ c4monthlyIncomeOthers: OthersdailyIncome });
    if (!this.props.formValues.c4othersWorkingDayCount) {
      this.props.fieldPopulator("c4othersGrossMonthlyIncome", values);
    } else {
      let daycountValue = this.props.formValues.c4othersWorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(
        OthersdailyIncome * daycountValue
      );
      let gross = { type: "String", value: MonthlyGross };
      let obligationOthers = this.state.c4othersObligationValue;
      let othersGrossAnnual = MonthlyGross * 12;
      let othersnetIncome = this.displayINRformat(
        othersGrossAnnual - obligationOthers * 12
      );
      let net = { type: "String", value: othersnetIncome };
      this.props.fieldPopulator("c4OthersGrossAnnualSalary", { type: 'String', value: othersGrossAnnual })
      this.props.fieldPopulator("c4othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c4NetAnnualIncomeOthers", net);
    }
  };
  handleDayCount = value => {
    let enteredValue = value.value;
    let dayCount = enteredValue;
    let MonthlyGrossIncome = this.displayINRformat(
      this.props.formValues.c4othersDailyIncome.value.replace(/,/g, "") *
      dayCount
    );
    let grossAnnual = this.displayINRformat(this.props.formValues.c4othersDailyIncome.value.replace(/,/g, "") * dayCount * 12)
    let gross = { type: "String", value: MonthlyGrossIncome };
    if (!this.props.formValues.c4othersMonthlyFixedObligation) {
      this.props.fieldPopulator("c4othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c4OthersGrossAnnualSalary", { type: 'String', value: grossAnnual })

    } else {
      let obliqothr = this.props.formValues.c4othersMonthlyFixedObligation.value.replace(
        /,/g,
        ""
      );
      let annualIncomeOthers = MonthlyGrossIncome * 12;
      let netAnnualOthers = this.displayINRformat(
        annualIncomeOthers - obliqothr * 12
      );
      let net = { type: "String", value: netAnnualOthers };
      this.props.fieldPopulator("c4OthersGrossAnnualSalary",
        { type: 'String', value: annualIncomeOthers })
      this.props.fieldPopulator("c4othersGrossMonthlyIncome", gross);
      this.props.fieldPopulator("c4NetAnnualIncomeOthers", net);
    }
  };
  handleFoirCalculation = () => {
    let i;
    if (
      this.props.formValues.c4OccupationType &&
      this.props.formValues.c4OccupationType.value === "Salaried"
    ) {
      let Foirobligation = this.props.formValues
        .c4salariedMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c4salariedMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c4members &&
        this.props.formValues.c4members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c4members.value.length; i++) {
          let salariedMemberExpense = this.props.formValues.c4members.value[i].ExpenseValue.value;
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
        this.setState({ c4foirValue: membertotalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c4foirValue: totalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c4showFoirButton: false, c4showFoirProgress: true });
    }
    if (
      this.props.formValues.c4OccupationType &&
      this.props.formValues.c4OccupationType.value === "Business"
    ) {
      let Foirobligation = this.props.formValues
        .c4businessMonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.c4businessMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c4members &&
        this.props.formValues.c4members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c4members.value.length; i++) {
          let businessMemberExpense = this.props.formValues.c4members.value[i].ExpenseValue.value;
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
        this.setState({ c4foirValue: membertotalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: membertotalFoir
        });

      } else {
        this.setState({ c4foirValue: totalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c4showFoirButton: false, c4showFoirProgress: true });
    }
    if (
      this.props.formValues.c4OccupationType &&
      this.props.formValues.c4OccupationType.value === "Others"
    ) {
      let Foirobligation = this.props.formValues.c4othersMonthlyFixedObligation
        .value;
      let FoirMonthlyGross = this.props.formValues.c4othersMonthlyGrossSalary
        .value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.c4members &&
        this.props.formValues.c4members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.c4members.value.length; i++) {
          let OthersMemberExpense = this.props.formValues.c4members.value[i].ExpenseValue.value;
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
        this.setState({ c4foirValue: membertotalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: membertotalFoir
        });
      } else {
        this.setState({ c4foirValue: totalFoir });
        this.props.fieldPopulator("c4FoirValue", {
          type: "String",
          value: totalFoir
        })
      }
      this.setState({ c4showFoirButton: false, c4showFoirProgress: true });
    }
  };

  ScoreCardHeader = (type, label) => {
    return (
      <React.Fragment>
        <Icon type={type} theme="twoTone" twoToneColor="#fa8c46" />
        <span style={{ paddingLeft: "15px" }}>{label}</span>
      </React.Fragment>
    );
  };

  handleCRIF = () => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    this.setState({ c4HighMarkScoreloading: true });

    let addresstype;
    if (this.props.formValues.c4KYC_selectedValue &&
      this.props.formValues.c4KYC_selectedValue.value !== "") {
      let kyc = JSON.parse(this.props.formValues.c4KYC_selectedValue.value);
      // ["Aadhaar","DrivingLicense","PAN","Passport","VoterId","SingleKYCApproval"]
      if (kyc.includes('c4PAN')) {
        addresstype = "2"
      } else if (kyc.includes('c4Aadhaar')) {
        addresstype = '1'
      } else if (kyc.includes('c4DrivingLicense')) {
        addresstype = '3'
      } else if (kyc.includes('c4VoterId')) {
        addresstype = '4'
      } else if (kyc.includes('c4Passport')) {
        addresstype = '5'
      }
    }
    let firstName = !validate.isEmpty(this.props.formValues.c4FirstName)
      ? this.props.formValues.c4FirstName.value
      : null;
    let lastName = !validate.isEmpty(this.props.formValues.c4LastName)
      ? this.props.formValues.c4LastName.value
      : null;
    let gender = !validate.isEmpty(this.props.formValues.c4Gender)
      ? this.props.formValues.c4Gender.value
      : null;
    let city = !validate.isEmpty(this.props.formValues.c4City)
      ? this.props.formValues.c4City.value
      : this.props.formValues.City.value;
    let pincode = !validate.isEmpty(this.props.formValues.c4Pincode)
      ? this.props.formValues.c4Pincode.value
      : this.props.formValues.Pincode.value;
    let maritalstatus = !validate.isEmpty(this.props.formValues.c4MaritalStatus)
      ? this.props.formValues.c4MaritalStatus.value
      : null;
    let state = !validate.isEmpty(this.props.formValues.c4State)
      ? this.props.formValues.c4State.value
      : this.props.formValues.State.value;
    let dob = !validate.isEmpty(this.props.formValues.c4DateOfBirth)
      ? this.props.formValues.c4DateOfBirth.value.slice(0, 10)
      : null;
    let aadhar = !validate.isEmpty(this.props.formValues.c4AadhaarNo)
      ? this.props.formValues.c4AadhaarNo.value
      : null;
    let panNo = !validate.isEmpty(this.props.formValues.c4panNo)
      ? this.props.formValues.c4panNo.value
      : null;
    let voterNo = !validate.isEmpty(this.props.formValues.c4VoterIDNumber)
      ? this.props.formValues.c4VoterIDNumber.value :
      null;
    let passportNum = !validate.isEmpty(this.props.formValues.c4passportNo)
      ? this.props.formValues.c4passportNo.value :
      null;
    let dlNo = !validate.isEmpty(this.props.formValues.c4DL_Number)
      ? this.props.formValues.c4DL_Number.value :
      null;
    let loanamount = !validate.isEmpty(this.props.formValues.LoanAmount)
      ? this.props.formValues.LoanAmount.value.replace(/,/g, "")
      : null;
    let address = !validate.isEmpty(this.props.formValues.BorrowerAddress)
      ? this.props.formValues.c4City.value
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
            c4getHighMarkDone: true,
            c4HighMarkScoreloading: false,
            c4HighMarkScore: -1,
            c4HighMarkApiData: response.data,
            c4errorMessage: false,
            c4errMsg: errMsg
          })
        } else {
          let HighMarkScore = response.data.ScoreDetails.Score.Value;
          let CrifLink = response.data.pdfLink;
          this.props.fieldPopulator("c4HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
          this.props.fieldPopulator("c4CrifLink", { type: "String", value: CrifLink });
          let account_summary = response.ResponseXML.BureauResponse.AccountSummaryDetails;
          let total = 0;
          account_summary.AccountSummary.forEach((summary) => {
            total += Number(summary.TotalMonthlyPaymentAmount);
          })
          this.props.fieldPopulator("c4TotalMonthlyPayment", total);
          this.setState({
            c4getHighMarkDone: true,
            c4HighMarkScoreloading: false,
            c4HighMarkScore: HighMarkScore,
            c4HighMarkApiData: response.data,
            c4errorMessage: false
          });
        }
        this.props.fieldPopulator("c4HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
      }, (error) => {
        this.setState({
          c4HighMarkScoreloading: false,
          c4errorMessage: true
        });
      })
      .catch(e => {
        console.log("error in cibil score api", e);
        this.setState({
          c4HighMarkScoreloading: false,
          c4errorMessage: true
        });
      });
  }
  renderEmploymentInformation = () => {
    let {
      c4HighMarkApiData: {
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
      c4HighMarkApiData: {
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
      c4HighMarkApiData: {
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
      c4HighMarkApiData: {
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
      c4HighMarkApiData: {
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
    let { c4members } = this.props.formValues;
    if (c4members) {
      c4members.value.forEach((member, index) => {
        if (modifiedIndex !== index) {
          total += parseInt(member.ExpenseValue.value)
        } else {
          total += parseInt(value.value)
        }
      })
    } else {
      total = parseInt(value.value);
    }
    this.props.fieldPopulator("c4ExpenseTotal", { type: "String", value: total });
  };
  handleIFSCcode = value => {
    let enteredValue = value.value;
    let code = enteredValue;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ c4ifsc: code });
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
        this.setState({ c4voterNo: voterIdNo });
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
        this.setState({ c4pincode: pincode }, () => {
          this.mapCityState();
        })
      } else {
        alert("Pincode doesn't match");
      }
    }
  };
  mapCityState = () => {
    let pincode = this.state.c4pincode;
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
          c4districtOptions: districtDD,
          c4stateOptions: stateDD,
          c4postOfficeOptions: postOfficeDD
        });

      }).catch(error => {
        console.log("mapCityState function error", error)
      })
  }
  PresentAddressAadhaarSame = e => {
    if (e.value === "Yes") {
      this.setState({ c4showPresentAddressFields: false });
    } else {
      this.setState({ c4showPresentAddressFields: true });
    }
  };
  CorrespondenceAddressSame = e => {
    if (e.value === "Yes") {
      this.setState({ c4showCorrespondenceAddressFields: false });
    } else {
      this.setState({ c4showCorrespondenceAddressFields: true });
    }
  };
  PresentAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c4showPresentAddressSame: false });
    } else {
      this.setState({ c4showPresentAddressSame: true });
    }
  };
  CorrespondenceAddressSameAsApplicant = e => {
    if (e.value === "Yes") {
      this.setState({ c4showCorrespondenceAddressSame: false });
    } else {
      this.setState({ c4showCorrespondenceAddressSame: true });
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
        this.setState({ c4mobileNumber: mobNo });
        this.props.fieldPopulator("c4otpmobileNumber", number);
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
        mobile: "91" + this.props.formValues.c4mobileNumber.value
      }
    };
    this.setState({ c4loading: true });
    axios(config).then(
      response => {
        var pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          let OTP_Status = response.data.smsStatus;
          this.props.fieldPopulator("c4OTP_Status", { type: "String", value: OTP_Status });
        }
        this.setState({
          c4otpPinID: pinID,
          c4loading: false,
          c4buttonLabel: "RESEND OTP",
          c4showSuccess: false,
          c4showFailure: false
        });
      },
      () => {
        this.setState({
          c4loading: false,
          c4buttonLabel: "RESEND OTP",
          c4showSuccess: false,
          c4showFailure: true
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
        pin_id: this.state.c4otpPinID
      }
    };
    this.setState({ c4loading: true });
    axios(config).then(
      response => {
        var resendpinID = response.data.pinId;
        this.setState({
          c4otpPinID: resendpinID,
          c4otpSent: true,
          c4loading: false,
          c4buttonLabel: "RESEND OTP",
          c4showSuccess: true
        });
      },
      () => {
        this.setState({
          c4loading: false,
          c4buttonLabel: "RESEND OTP",
          c4showSuccess: false,
          c4showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let otpValue = otp;
    this.setState({ c4otp: otpValue });
    this.props.fieldPopulator("c4OTP_Value", { type: "String", value: otpValue });

    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      headers: {
        Authorization: authToken,
      },
      data: {
        otp: otpValue,
        pin_id: this.state.c4otpPinID
      }
    };
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ c4verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ c4OTP_submit: true, c4showSuccess: true, c4buttonLabel: "Verified" });
          this.props.fieldPopulator("c4hiddenOTPStatus", {
            type: "String",
            value: this.state.c4verifyOTP
          })
        } else if (response.data.verified === false) {
          this.setState({ c4OTP_submit: false, c4showSuccess: false, c4buttonLabel: "RESEND" });
          this.props.fieldPopulator("c4hiddenOTPStatus", {
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
    this.setState({ c4otp: value });
    this.setState({ c4OTP_submit: false });
  };
  handleAssetType = value => {
    if (value.value === "Others") {
      this.setState({ c4showOthersComments: true });
    } else if (value.value !== "Others") {
      this.setState({ c4showOthersComments: false });
    }
  };
  handleShowRoomPrice = e => {
    let enteredValue = e.value;
    let price = enteredValue.replace(/,/g, "");
    this.setState({ c4veh_showRoomPrice: price });
    if (
      this.props.formValues.c4RoadTax &&
      this.props.formValues.c4InsuranceAmount
    ) {
      let veh_tax = this.state.c4veh_roadTax;
      let veh_insAmt = this.state.c4veh_InsuranceAmount;
      let veh_otherAmt = this.state.c4veh_othersAmt;
      let veh_onroadprice =
        Number(price) +
        Number(veh_tax) +
        Number(veh_insAmt) +
        Number(veh_otherAmt);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onroadprice)
      };
      this.props.fieldPopulator("c4OnRoadPrice", orp);
    }
  };
  handleRoadTax = e => {
    let enteredValue = e.value;
    let tax = enteredValue.replace(/,/g, "");
    this.setState({ c4veh_roadTax: tax }, () => { });
    if (
      this.props.formValues.c4ExShowroomPrice &&
      this.props.formValues.c4InsuranceAmount
    ) {
      let veh_insAmount = this.state.c4veh_InsuranceAmount;
      let veh_Price = this.state.c4veh_showRoomPrice;
      let veh_Others = this.state.c4veh_othersAmt;
      let veh_onRoadPrice =
        Number(tax) +
        Number(veh_insAmount) +
        Number(veh_Price) +
        Number(veh_Others);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onRoadPrice)
      };
      this.props.fieldPopulator("c4OnRoadPrice", orp);
    }
  };
  handleInsuranceAmount = e => {
    let value = e.value;
    let insAmount = value.replace(/,/g, "");
    this.setState({ c4veh_InsuranceAmount: insAmount }, () => { });
    if (
      this.props.formValues.c4ExShowroomPrice &&
      this.props.formValues.c4RoadTax
    ) {
      let veh_roadTax = this.state.c4veh_roadTax;
      let veh_Price = this.state.c4veh_showRoomPrice;
      let veh_others = this.state.c4veh_othersAmt;
      let vehonRoadPrice =
        Number(veh_roadTax) +
        Number(veh_Price) +
        Number(veh_others) +
        Number(insAmount);
      let orp = {
        type: "String",
        value: this.displayINRformat(vehonRoadPrice)
      };
      this.props.fieldPopulator("c4OnRoadPrice", orp);
    }
  };
  handleOnRoadPrice = e => {
    let enteredValue = e.value;
    let othersAmt = enteredValue.replace(/,/g, "");
    this.setState({ c4veh_othersAmt: othersAmt }, () => { });
    let showRoomPrice = this.state.c4veh_showRoomPrice;
    let roadTax = this.state.c4veh_roadTax;
    let insAmount = this.state.c4veh_InsuranceAmount;
    let onRoadPrice =
      Number(showRoomPrice) +
      Number(roadTax) +
      Number(insAmount) +
      Number(othersAmt);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) };
    this.props.fieldPopulator("c4OnRoadPrice", orp);
  };
  handleApplicantLoan = e => {
    if (e.value === "Yes") {
      this.setState({
        c4showLoanDetails: true
      });
    } else if (e.value === "No" || e.value === "Don't Know") {
      this.setState({
        c4showLoanDetails: false
      });
    }
  };
  handleBusinessrelationship = e => {
    let value = e.value;
    if (value === "Yes") {
      this.setState({
        c4showRelationshipDetails: true
      });
    } else {
      this.setState({
        c4showRelationshipDetails: false
      });
    }
  };
  handleApplicantAddress = e => {
    let value = e.value;
    if (value === "Yes") {
      this.setState({
        c4showAddressDetails: true
      });
    } else {
      this.setState({
        c4showAddressDetails: false
      });
    }
  };

  handleKycSelect = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c4KYC_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 2) {
      this.props.fieldPopulator("c4kycstatus", {
        type: "String",
        value: "true"
      })
    } else {
      this.props.fieldPopulator("c4kycstatus", {
        type: "String",
        value: ""
      })
    }
  }

  handleAddressVerification = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("c4Addr_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 1) {
      this.props.fieldPopulator("c4VerifyAddress", { type: "String", value: "true" });
    } else {
      this.props.fieldPopulator("c4VerifyAddress", { type: "String", value: "" });
    }
  }

  renderMembers() {
    if ((this.props.formValues && !this.props.formValues.c4members) ||
      (this.props.formValues && this.props.formValues.c4members &&
        typeof this.props.formValues.c4members.value !== "string")) {
      return (
        <div className="form-section">
          <FormHeadSection
            sectionLabel="Co-Applicant ExtraOrdinary Expense"
            sectionKey="c4applicantExtraOrdinaryExpense"
            formSyncError={this.props.formSyncError}
            sectionValidator={this.state.sectionValidator}
          />
          <div className="form-section-content">
            <div className="flex-row">
              <FieldArray
                name="c4members"
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
    let c4panDetails =
      this.props.formValues && this.props.formValues.c4panDetails
        ? this.props.formValues.c4panDetails.value
        : null;
    let c4aadharDetails =
      this.props.formValues && this.props.formValues.c4aadharDetails
        ? this.props.formValues.c4aadharDetails.value
        : null;
    let c4passportDetails = this.props.formValues && this.props.formValues.c4passportDetails ? this.props.formValues.c4passportDetails.value : null;
    let c4drivingLicenseDetails = this.props.formValues && this.props.formValues.c4drivingLicenseDetails ? this.props.formValues.c4drivingLicenseDetails.value : null;
    let c4voterIdDetails = this.props.formValues && this.props.formValues.c4voterIdDetails ?
      this.props.formValues.c4voterIdDetails.value : null;

    if (c4panDetails && IsJsonString(c4panDetails)) {
      c4panDetails = JSON.parse(c4panDetails);
    }
    if (c4aadharDetails && IsJsonString(c4aadharDetails)) {
      c4aadharDetails = JSON.parse(c4aadharDetails);
    }
    if (c4passportDetails && IsJsonString(c4passportDetails)) {
      c4passportDetails = JSON.parse(c4passportDetails);
    }
    if (c4drivingLicenseDetails && IsJsonString(c4drivingLicenseDetails)) {
      c4drivingLicenseDetails = JSON.parse(c4drivingLicenseDetails);
    }
    if (c4voterIdDetails && IsJsonString(c4voterIdDetails)) {
      c4voterIdDetails = JSON.parse(c4voterIdDetails);
    }

    const c4KycOptions = [
      { label: 'Aadhaar', value: 'c4Aadhaar' },
      { label: 'Driving License', value: 'c4DrivingLicense' },
      { label: 'PAN', value: 'c4PAN' },
      { label: 'Passport', value: 'c4Passport' },
      { label: 'VoterId', value: 'c4VoterId' },
      { label: 'Single KYC Approval', value: 'c4SingleKYCApproval' }
    ];

    const c4addressOptions = [
      { label: "Permanent Address", value: "c4PermanentAddress" },
      { label: "Residential Address", value: "c4ResidentialAddress" },
      { label: "Work Address", value: "c4WorkAddress" }
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
              sectionKey="c4applicantIdentInfo"
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
                    name="c4ApplicationID"
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
                    name="c4BorrowerType"
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
                    name="c4relationshipWithApplicant"
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
                    name="c4existingCustomer"
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
              sectionKey="c4applicantBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"First Name"}
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name="c4FirstName"
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
                    name="c4MiddleName"
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
                    name="c4LastName"
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
                    name="c4Gender"
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
                    name="c4Salutation"
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
                    name="c4DateOfBirth"
                    component={DatePicker}
                    dateFormat="DD/MM/YYYY"
                    onChange={this.handleChange_age}
                    disabledDate={current => {
                      return (current && (moment().add(-60, 'year').add(-1, 'day') > current || current > moment().add(-18, 'year').add(-1, 'day')));
                    }}
                    placeholder="Select DOB"
                    validate={[A8V.required({ errorMsg: "DOB is required" })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Age"}
                    name="c4Age"
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
              sectionKey="c4applicantKYC"
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
                      options={c4KycOptions}
                      defaultValue={this.props.formValues.c4KYC_selectedValue ? JSON.parse(this.props.formValues.c4KYC_selectedValue.value) : ""}
                      onChange={this.handleKycSelect} />
                  </div>
                  <Field
                    hidden={true}
                    name="c4kycstatus"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "kycstatus is required" })
                    ]}
                  />
                </div>
              </div>
              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4Aadhaar")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Aadhaar Name"}
                        label={<span> Aadhaar Name <span style={{ color: "red" }}>*</span></span>}
                        name="c4AadhaarName"
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
                        name="c4AadhaarNo"
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
                        name="c4AadhaarDOB"
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
                        name="c4Aadhaar_Scanner"
                        component={Scanner}
                        docType="AADHAR"
                        imageVar={"c4aadharImg"}
                        parserVar={"c4aadharDetails"}
                        metaVar={"c4aadhaarMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c4aadharDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c4aadharDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c4aadharDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Aadhaar Number :
                            </span>{" "}
                            {c4aadharDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c4aadharDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Gender :
                            </span>{" "}
                            {c4aadharDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4DrivingLicense")) && <React.Fragment>
                  <div className="flex-row">

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Date Of Birth"
                        label={<span>Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        name="c4DL_DateOfBirth"
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
                        name="c4DL_IssueDate"
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
                        name="c4DL_ExpiryDate"
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
                        name="c4DL_Number"
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
                        name="c4DL_Scanner"
                        component={Scanner}
                        docType="DL"
                        imageVar={"c4DLImg"}
                        parserVar={"c4drivingLicenseDetails"}
                        metaVar={"c4drivingLicenseMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c4drivingLicenseDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c4drivingLicenseDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                            {c4drivingLicenseDetails.bloodGroup}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                            {" "}
                            {c4drivingLicenseDetails.dateOfBirth}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {c4drivingLicenseDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                            {" "}
                            {c4drivingLicenseDetails.dateOfExpiry}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                            {" "}
                            {c4drivingLicenseDetails.dlId}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>State :</span>
                            {" "}
                            {c4drivingLicenseDetails.dlState}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4PAN")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Name"}
                        label={<span>Pan Name<span style={{ color: "red" }}>*</span></span>}
                        name="c4panName"
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
                        name="c4panNo"
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
                        name="c4panDOB"
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
                        name="c4panFatherName"
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
                        name="c4PAN_Scanner"
                        component={Scanner}
                        docType="PAN"
                        imageVar={"c4panImg"}
                        parserVar={"c4panDetails"}
                        metaVar={"c4panMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c4panDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c4panDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c4panDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c4panDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {c4panDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c4panDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4Passport")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Type Of Passport"}
                        label={<span> Type Of Passport<span style={{ color: "red" }}>*</span></span>}
                        name="c4passportType"
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
                        name="c4passportNo"
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
                        name="c4passport_IssueDate"
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
                        name="c4passport_ExpiryDate"
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
                        name="c4Passport_Scanner"
                        component={Scanner}
                        docType="PASSPORT"
                        imageVar={"c4passportImg"}
                        parserVar={"c4passportDetails"}
                        metaVar={"c4passportMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c4passportDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c4passportDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c4passportDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Aadhaar Number :</span>
                            {" "}
                            {c4passportDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>
                            {" "}
                            {c4passportDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>
                            {" "}
                            {c4passportDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4VoterId")) && <React.Fragment >
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Voter ID Number"}
                        label={<span> Voter ID Number<span style={{ color: "red" }}>*</span></span>}
                        name="c4VoterIDNumber"
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
                        name="c4VoterIDName"
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
                        name="c4VoterIDFatherName"
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
                        name="c4Voter_Scanner"
                        component={Scanner}
                        docType="VOTERID"
                        imageVar={"c4voterIdImage"}
                        parserVar={"c4voterIdDetails"}
                        metaVar={"c4voterIdMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={c4voterIdDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {c4voterIdDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {c4voterIdDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {c4voterIdDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                            {c4voterIdDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {c4voterIdDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.c4KYC_selectedValue &&
                JSON.parse(this.props.formValues.c4KYC_selectedValue.value).includes("c4SingleKYCApproval")) &&
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    {/** File Uploader */}
                    <Field
                      label={"Single KYC Image "}
                      name="c4singleKycImage"
                      component={Scanner}
                      docType="IMG"
                      imageVar={"c4singleKycimage"}
                      metaVar={"c4singleKycMeta"}
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
              sectionKey="c4applicantDetailedInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Mobile number"
                    label={<span> Mobile number<span style={{ color: "red" }}>*</span></span>}
                    name="c4mobileNumber"
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
                            // this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
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
                    name="c4AlternativePhone"
                    component={TextBox}
                    placeholder="Enter Alternative Phone Number"
                    type="text"
                    hasFeedback
                    // onChange={this.handleNumberChange}
                    className="form-control-coustom"
                    validate={[

                      A8V.minLength({
                        errorMsg: "Enter valid Alternative Phone Number",
                        min: 10
                      }),
                      A8V.maxLength({
                        errorMsg: "Enter valid Alternative Phone Number",
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
                            // this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
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
                    label={"Email Id"}
                    name="c4Email"
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
                    name="c4Citizenship"
                    component={Select}
                    placeholder="Select Citizenship"
                    className="a8Select"
                    onChange={this.citizenshipChange}
                    validate={[
                      A8V.required({ errorMsg: "Citizenship is required" })
                    ]}
                  >
                    {/* {this.state.c4citizenshipOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                   ))}*/}
                  </Field>
                </div>
                {this.state.c4showResidencyStatus && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // disabled={this.state.disableResidencyStatus}
                      // label="Residency Status"
                      label={<span> Residency Status<span style={{ color: "red" }}>*</span></span>}
                      name="c4ResidencyStatus"
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
                    name="c4Religion"
                    component={Select}
                    placeholder="Select Religion"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Religion is required" })
                    ]}
                  >
                    {this.state.c4religionOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Caste"
                    label={<span> Caste<span style={{ color: "red" }}>*</span></span>}
                    name="c4Caste"
                    component={Select}
                    placeholder="Select Caste"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Caste is required" })]}
                  >
                    {this.state.c4casteOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Marital Status"
                    label={<span> Marital Status<span style={{ color: "red" }}>*</span></span>}
                    name="c4MaritalStatus"
                    component={Select}
                    placeholder="Enter MaritalStatus"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Marital Status is required" })
                    ]}
                  >
                    {this.state.c4maritalStatusOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Education Level"
                    label={<span> Education Level<span style={{ color: "red" }}>*</span></span>}
                    name="c4EducationLevel"
                    component={Select}
                    placeholder="Select EducationLevel"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "EducationLevel is required" })
                    ]}
                  >
                    {this.state.c4educationOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"Father Name"}
                    label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                    name="c4FatherName"
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
                    // label={"Mother Maiden Name"}
                    label={<span> Mother Maiden Name<span style={{ color: "red" }}>*</span></span>}
                    name="c4MotherMaidenName"
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
                {this.props.formValues.c4MaritalStatus &&
                  this.props.formValues.c4MaritalStatus.value === "Married" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableSpouseName}
                        // label={"Spouse Name"}
                        label={<span>Spouse Name<span style={{ color: "red" }}>*</span></span>}
                        name="c4SpouseName"
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
                    // label="Is Applicant a MicroBanking customer?"
                    label={<span>Is Applicant a MicroBanking customer?<span style={{ color: "red" }}>*</span></span>}
                    name="c4ApplicantMBCustomer"
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
                {this.props.formValues.c4ApplicantMBCustomer &&
                  this.props.formValues.c4ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableSangamBranch}
                        label={"Sangam Name"}
                        name="c4SangamName"
                        component={TextBox}
                        placeholder="Enter SangamName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.c4ApplicantMBCustomer &&
                  this.props.formValues.c4ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        disabled={this.state.disableMbBranchName}
                        label={"Microbanking Branch Name"}
                        name="c4MBBranchName"
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
            this.props.formValues.c4mobileNumber &&
            this.props.formValues.c4mobileNumber.value && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="OTP Verification"
                  sectionKey="c4applicantOtpVerification"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label="Mobile number"
                        name="c4mobileNumber"
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
                                // this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
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
                        buttonLabel={this.state.c4buttonLabel}
                        isButtonLoading={this.state.c4loading}
                        showSuccesIcon={this.state.c4showSuccess}
                        showFailureIcon={this.state.c4showFailure}
                        onButtonClick={() => {
                          this.state.c4buttonLabel === "SEND OTP"
                            ? this.handleSendApi()
                            : this.handleResendApi();
                        }}
                      />
                    </div>
                    {
                      this.props.formValues && this.props.formValues.c4OTP_Status && (
                        <div className="form-group ">
                          <Otp
                            numInputs={4}
                            submitLabel={"submit"}
                            disableSubmit={this.state.c4OTP_submit}
                            mobileNumber={
                              this.props.formValues.c4mobileNumber
                                ? this.props.formValues.c4mobileNumber.value
                                : null
                            }
                            value={this.props.formValues.c4OTP_Value && this.props.formValues.c4OTP_Value.value}
                            handleOtpNumber={this.handleOtpNumber}
                            otpOnchange={this.onchangeOtp}
                            className=""
                          />
                        </div>
                      )}
                    <Field
                      hidden={true}
                      name="c4hiddenOTPStatus"
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
              sectionLabel="Co-Applicant Address Information"
              sectionKey="c4applicantAddressInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Applicant?<span style={{ color: "red" }}>*</span></span>}
                    name="c4PresentAddressSameAsApplicant"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressSameAsApplicant}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c4showPresentAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c4HouseName"
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
                        name="c4StreetArea"
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
                        name="c4City"
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
                        label={"Post Office"}
                        name="c4PostOffice"
                        component={Select}
                        placeholder="Select PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c4districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="c4District"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c4districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="c4State"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.c4stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c4Pincode"
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

                  </React.Fragment>
                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Aadhaar address?<span style={{ color: "red" }}>*</span></span>}
                    name="c4PresentAddressAadhaarSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressAadhaarSame}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.c4showPresentAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={" Address ProofType"}
                        label={<span>Address Proof Type<span style={{ color: "red" }}>*</span></span>}
                        name="c4permanentAddressType"
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
                        name="c4permanentAddressNumber"
                        component={TextBox}
                        placeholder="Enter Address ProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c4permanentHouseName"
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
                        name="c4permanentStreetArea"
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
                        name="c4permanentCity"
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
                        label={"Post Office"}
                        name="c4permanentPostOffice"
                        component={Select}
                        placeholder="Select PostOffice"
                        className="a8Select"
                      >
                        {this.state.c4postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="c4permanentDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c4districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="c4permanentState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c4stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c4permanentPincode"
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
                        label={"LandMark"}
                        name="c4permanentLandMark"
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
                        name="c4permanentYearsPresentAddress"
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
                    name="c4permanentCorrespondenceAddressSame"
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
                {this.state.c4showCorrespondenceAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={" AddressProof Type"}
                        name="c4CorrespondenceAddressProofType"
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
                        name="c4CorrespondenceAddressProofNumber"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"House No/Name"}
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="c4CorrespondenceHouseName"
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
                        name="c4CorrespondenceStreetArea"
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
                        name="c4CorrespondenceCity"
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
                        label={"Post Office"}
                        name="c4CorrespondencePostOffice"
                        component={Select}
                        placeholder="Select PostOffice"
                        className="a8Select"
                      >
                        {this.state.c4postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"District"}
                        name="c4CorrespondenceDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c4districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="c4CorrespondenceState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c4stateOptions.map(data => (
                          <Option value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Pincode"}
                        label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                        name="c4CorrespondencePincode"
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
                        label={"LandMark"}
                        name="c4CorrespondenceLandMark"
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
                    name="c4CorrespondenceAddressSameApplicant"
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
                {this.state.c4showCorrespondenceAddressSame && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={" AddressProof Type"}
                        name="c4CorrespondenceAddressProofTypeAsApplicant"
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
                        name="c4CorrespondenceAddressProofNumberAsApplicant"
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
                        name="c4CorrespondenceHouseNameAsApplicant"
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
                        name="c4CorrespondenceStreetAreaAsApplicant"
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
                        name="c4CorrespondenceCityAsApplicant"
                        component={TextBox}
                        placeholder="Enter City"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="c4CorrespondencePostOfficeAsApplicant"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Post Office is required" })
                        ]}
                      >
                        {this.state.c4postOfficeOptions.map(data => (
                          <Option value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="c4CorrespondenceDistrictAsApplicant"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.c4districtOptions.map(data => (
                          <Option value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="State"
                        name="c4CorrespondenceStateAsApplicant"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "State is required" })
                        ]}
                      >
                        {this.state.c4stateOptions.map(data => (
                          <Option value={data.value}>{data.label}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Pincode"}
                        name="c4CorrespondencePincodeAsApplicant"
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
                        label={"LandMark"}
                        name="c4CorrespondenceLandMarkAsApplicant"
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
              sectionKey="c4applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label="Occupation Type"
                    label={<span>Occupation Type<span style={{ color: "red" }}>*</span></span>}
                    name="c4OccupationType"
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
                {this.state.c4showSalariedFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Job"
                        name="c4salariedTypeofJob"
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
                        name="c4salariedExperienceCurrentJob"
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
                        label={"No. of Family Members"}
                        name="c4salariedFamilyMemberCount"
                        component={TextBox}
                        placeholder="Enter Family member Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "FamilyMemberCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Dependent"}
                        name="c4salariedDependentCount"
                        component={TextBox}
                        placeholder="Enter Dependent Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "DependentCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Monthly Gross Salary"}
                        label={<span>Monthly Gross Salary<span style={{ color: "red" }}>*</span></span>}
                        name="c4salariedMonthlyGrossSalary"
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
                        name="c4salariedMonthlyFixedObligation"
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
                        name="c4salariedGrossAnnualIncome"
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
                        name="c4salariedNetAnnualIncome"
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
                            name="c4salariedOfficeName"
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
                            name="c4SalariedOfficeNo"
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
                            name="c4SalariedStreetArea"
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
                            name="c4SalariedCity"
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
                            name="c4SalariedPincode"
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
                            name="c4SalariedPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c4postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="c4SalariedDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c4districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="c4SalariedState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c4stateOptions.map(data => (
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
                {this.state.c4showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Type of Business"
                        name="c4BusinessType"
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
                        name="c4BusinessName"
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
                        name="c4Constitution"
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
                        name="c4BusinessStructure"
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
                        name="c4BusinessModel"
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
                        name="c4BusinessStartDate"
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
                        name="c4BusinessAge"
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
                        name="c4businessEmployeeCount"
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
                        name="c4CurrentBusinessExp"
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
                        name="c4businessAnnualTurnover"
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
                        label={"No. of Family Members"}
                        name="c4businessFamilyMemberCount"
                        component={TextBox}
                        placeholder="Enter FamilyMember Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "FamilyMemberCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Dependent"}
                        name="c4businessDependentCount"
                        component={TextBox}
                        placeholder="Enter Dependent Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "DependentCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Monthly Gross Salary"}
                        name="c4businessMonthlyGrossSalary"
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
                        name="c4businessMonthlyFixedObligation"
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
                        name="c4businessGrossAnnualIncome"
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
                        name="c4businessNetAnnualIncome"
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
                            name="c4businessOfficeName"
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
                            name="c4businessOfficeNo"
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
                            name="c4businessStreetArea"
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
                            name="c4businessCity"
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
                            name="c4businessPincode"
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
                            name="c4businessPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c4postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="c4businessDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c4districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="c4businessState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c4stateOptions.map(data => (
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
                {this.state.c4showOthersFields &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Type of Job"
                      name="c4JobType"
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
                  </div>
                }
                {this.state.c4showJobTypeFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Total Years of Experience in Current job"
                        name="c4ExperienceCurrentJob"
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
                        label={"No. of Family Members"}
                        name="c4othersFamilyMemberCount"
                        component={TextBox}
                        placeholder="Enter Family member Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "FamilyMemberCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"No. of Dependent"}
                        name="c4othersDependentCount"
                        component={TextBox}
                        placeholder="Enter Dependent Count"
                        normalize={proceedNumber}
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: "DependentCount is required"
                          })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Daily Income"}
                        name="c4othersDailyIncome"
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
                        name="c4othersWorkingDayCount"
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
                        name="c4othersGrossMonthlyIncome"
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
                        name="c4othersMonthlyFixedObligation"
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
                        name="c4OthersGrossAnnualSalary"
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
                        name="c4NetAnnualIncomeOthers"
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
                        name="c4othersMonthlySurplus"
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
                    <div>
                      <label>
                        <strong> Work Address Information</strong>
                      </label>
                      <div className="flex-row">
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Office Name"}
                            name="c4othrOfficeName"
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
                            name="c4othrOfficeNo"
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
                            name="c4othrStreetArea"
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
                            name="c4othrCity"
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
                            name="c4othrPincode"
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
                            name="c4othrPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.c4postOfficeOptions.map(data => (
                              <Option value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"District"}
                            name="c4othrDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.c4districtOptions.map(data => (
                              <Option value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="State"
                            name="c4othrState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.c4stateOptions.map(data => (
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
                    <Checkbox.Group style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox" options={c4addressOptions}
                      defaultValue={this.props.formValues.c4Addr_selectedValue ? JSON.parse(this.props.formValues.c4Addr_selectedValue.value) : ""} onChange={this.handleAddressVerification} validate={[A8V.required({ errorMsg: "c4VerifyAddress is required" })]} />
                  </div>
                  <Field
                    hidden={true}
                    name="c4VerifyAddress"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "c4VerifyAddress is required" })
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.renderMembers()}

          {(!this.props.formValues.c4JobType ||
            (this.props.formValues.c4JobType &&
              this.props.formValues.c4JobType.value !== "HomeMaker" &&
              this.props.formValues.c4JobType.value !== "Student")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"FOIR Calculation"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  {this.state.c4showFoirProgress && (
                    <div style={{ width: "100%" }}>
                      {this.state.c4foirValue > 60 && <React.Fragment>
                        {this.props.formValues && this.props.formValues.c4FoirValue &&
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
                              <p>{this.props.formValues.c4FoirValue.value}/100</p>
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
                      {this.state.c4foirValue <= 60 &&
                        <React.Fragment>
                          {this.props.formValues && this.props.formValues.c4FoirValue &&
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
                                <p>{this.props.formValues.c4FoirValue.value}/100</p>
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
                              loading={this.state.c4HighMarkScoreloading}
                            >
                              Generate CRIF Details
                        </Button>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  )}
                  {this.state.c4errorMessage && (
                    <p style={{ color: "red" }}>{this.state.c4errMsg}</p>
                  )}
                  {this.state.c4showFoirButton && (
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
                        Calcuate FOIR
                    </Button>
                      <Field
                        hidden={true}
                        name="c4FoirValue"
                        component={TextBox}
                        type="text"
                        className=" form-control-custom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>}

          {this.props.formValues.c4JobType &&
            (this.props.formValues.c4JobType.value === "HomeMaker" ||
              this.props.formValues.c4JobType.value === "Student") &&
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
                      loading={this.state.c4HighMarkScoreloading}
                    > Generate CRIF Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {this.state.c4getHighMarkDone && (
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
                        value={this.state.c4HighMarkScore}
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
                        currentValueText={`HighMark Score: ${this.state.c4HighMarkScore}`}
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
              sectionKey="c4applicantBankingHistory"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Is Applicant banking with ESAF?"
                    name="c4ESAFCustomer"
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
                {this.props.formValues.c4ESAFCustomer &&
                  this.props.formValues.c4ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableBranchName}
                        label={"Branch Name"}
                        name="c4BranchName"
                        component={TextBox}
                        placeholder="Enter BranchName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.c4ESAFCustomer &&
                  this.props.formValues.c4ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableAccountNumber}
                        label={"Account Number"}
                        name="c4AccountNumber"
                        component={TextBox}
                        placeholder="Enter AccountNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.c4ESAFCustomer &&
                  this.props.formValues.c4ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableAccountType}
                        label="Account Type"
                        name="c4AccountType"
                        component={Select}
                        placeholder="Select AccountType"
                        className="a8Select"
                      >
                        <Option value="Savings">Savings</Option>
                        <Option value="Current">Current</Option>
                      </Field>
                    </div>
                  )}
                {this.props.formValues.c4ESAFCustomer &&
                  this.props.formValues.c4ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        //disabled={this.state.disableIFSCCode}
                        label={"IFSCCode"}
                        name="c4IFSCCode"
                        component={TextBox}
                        placeholder="Enter IFSCCode(CASE-SENSITIVE)"
                        onChange={this.handleIFSCcode}
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.c4ESAFCustomer &&
                  this.props.formValues.c4ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // disabled={this.state.disableBankingHistory}
                        label="Banking Since"
                        name="c4BankingHistory"
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
      </div >
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("++++++State of Applicant Basic++++++", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessNew")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessNew")(state)
  };
};

export default connect(mapStateToProps, {})(TabCoApplicantNew4);

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
