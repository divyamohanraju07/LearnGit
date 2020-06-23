/* eslint-disable no-useless-concat */
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
  TextArea,
  TextButtonGroup,
  Uploader
} from "a8flow-uikit";
import {
  Button,
  Result,
  Icon,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Table
} from "antd";
import {
  FormHeadSection,
  A8V,
  proceedNumber,
  RenderTabs,
  renderExpenseMembers,
  IsJsonString,
  inrFormat,
  uploadChecker,
  TextDropdownGroup,
  // sortAlphabetically,
  retrieveBigData,
  Config
} from "../../helpers";
import {
  Field,
  FieldArray,
  getFormSyncErrors,
  getFormValues
} from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
import axios from "axios";
import * as soProcessNewTabInfo from "./soProcessNewTabInfo";
import { updateDynamicTabInfo } from "../../stateManager/actions";
import validate from "validate.js";
import classname from "classnames";
import ReactSpeedometer from "react-d3-speedometer";
import _ from "lodash";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import Column from "antd/lib/table/Column";
import { default as ApiClient } from "a8forms-api-client";

const { Option } = SelectHelper;
const { Panel } = Collapse;

class TabApplicantNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        FormScanner: [],
        FormScannerQR: [],
        applicantIdentInfo: [
          "ApplicationID",
          "BorrowerType",
        ],
        applicantBasicInfo: [
          "FirstName",
          "LastName",
          "Gender",
          "Salutation",
          "DateOfBirth",
        ],
        applicantEmpInfo: [
          "OccupationType",
          "TypeofJob",
          "CurrentJobExperience",
          "MonthlyGrossSalary",
          "MonthlyFixedObligation",
          "salariedOfficeName",
          "SalariedOfficeNo",
          "SalariedStreetArea",
          "SalariedCity",
          "SalariedDistrict",
          "SalariedState",
          "SalariedPincode",
          "SalariedPostOffice",
          "BusinessType",
          "BusinessName",
          "Constitution",
          "BusinessStructure",
          "BusinessModel",
          "EmployeeCount",
          "CurrentBusinessExperience",
          "AnnualTurnover",
          "MonthlyBusinessGross",
          "MonthlyBusinessObligation",
          "businessOfficeName",
          "businessOfficeNo",
          "businessStreetArea",
          "businessCity",
          "businessDistrict",
          "businessState",
          "businessPincode",
          "businessPostOffice",
          "JobType",
          "ExperienceCurrentJob",
          "DailyIncome",
          "WorkingDayCount",
          "FixedObligation",
          "othrOfficeName",
          "othrOfficeNo",
          "othrStreetArea",
          "othrCity",
          "othrDistrict",
          "othrState",
          "othrPincode",
          "othrPostOffice",
          "VerifyAddress"
        ],
        applicantExtraOrdinaryExpense: [
          "ExtraExpenseType",
          "ExpenseValue",
          "members"
        ],
        CRIFScore: [""],
        applicantBasicEval: [
          "LoanAmount",
          "LoanPurpose",
          "ExpectedTenure",
          "ROI",
          "EstimatedEMI",
          "InsuredLife",
          "InsurancePremium"
        ],
        applicantKYC: [
          "kycstatus",
          "AadhaarName",
          "AadhaarNo",
          "AadhaarDOB",
          "DL_DateOfBirth",
          "DL_IssueDate",
          "DL_ExpiryDate",
          "DL_Number",
          "panName",
          "panNo",
          "panDOB",
          "panFatherName",
          "passportType",
          "passportNo",
          "passport_IssueDate",
          "passport_ExpiryDate",
          "VoterIDNumber",
          "VoterIDName",
          "VoterIDFatherName",
        ],
        applicantDetailedInfo: [
          "Citizenship",
          "ResidencyStatus",
          "Religion",
          "Caste",
          "MaritalStatus",
          "EducationLevel",
          "FatherName",
          "SpouseName",
          "ApplicantMBCustomer"
        ],
        applicantOtpVerification: ["hiddenOTPStatus"],
        applicantAddressInfo: [
          "permanentAddressType",
          "permanentAddressProofNumber",
          "HouseName",
          "StreetArea",
          "City",
          "District",
          "State",
          "Pincode",
          "PresentAddressAadhaarSame",
          "permanentCorrespondenceAddressSame"
        ],
        applicantBankingHistory: [
          "ESAFCustomer",
          "BranchName",
          "AccountNumber",
          "AccountType",
          "IFSCCode",
        ],
        ReferencesInfo: [
          "ReferenceName_1",
          "ReferenceAddress_1",
          "ReferenceMobile_1",
          "ReferenceType_1",
          "ReferenceName_2",
          "ReferenceAddress_2",
          "ReferenceMobile_2",
          "ReferenceType_2",
        ],
        loanRequestDetails: [
          "LoanAmount",
          "LoanPurpose",
          "LoanSubType",
          "ExpectedLoanTenure",
          "ROI",
          "SecurityType",
          "MonthlyRepaymentCapacity"
        ],
        loanEligibilityDetails: [
          "LoanType",
          "VehicleType",
          "Manufacturer",
          "AssetModel",
          "AssetMake",
          "ExShowroomPrice",
          "RoadTax",
          "InsuranceAmount",
          "MarginAmount",
          "DealerName",
          "dealerLocation"
        ],
        SoUpload: ["soUpload"],
        coBorrowerSelection: [""]
      },
      showSalariedFields: false,
      salariedMonthlySalary: "",
      showBusinessFields: false,
      businessMonthlySalary: "",
      showOthersFields: false,
      showCRIF: false,
      showJobTypeFields: false,
      showResidencyStatus: false,
      AadhaarQRCodeScan: "",
      veh_InsuranceAmount: 0,
      veh_showRoomPrice: 0,
      veh_roadTax: 0,
      veh_othersAmt: 0,
      startDate: "",
      Age: "",
      agelimit: "",
      dayCount: "",
      otp: "",
      verifyOTP: "",
      mobileNumber: "",
      otpPinID: "",
      OTP_submit: false,
      CustomerAccountNumber: "",
      responseData: {},
      mappedJson: {},
      loantypeOptions: [],
      loanSubtypeOptions: [],
      educationOptions: [],
      casteOptions: [],
      stateOptions: [],
      postOfficeOptions: [],
      maritalStatusOptions: [],
      religionOptions: [],
      citizenshipOptions: [],
      districtOptions: [],
      showFoirProgress: false,
      showFoirButton: true,
      ifsc: "",
      voterNo: "",
      otpSent: false,
      buttonLabel: "SEND OTP",
      loading: false,
      showSuccess: false,
      showFailure: false,
      showOTPverification: false,
      monthlyIncomeOthers: "",
      salObligationValue: "",
      busiObligationValue: "",
      othersObligationValue: "",
      foirValue: "",
      RepaymentEMIAmount: "",
      HighMarkScoreloading: false,
      getHighMarkDone: false,
      HighMarkScore: 0,
      HighMarkApiData: null,
      pincode: "",
      returnData: null,
      errorMessage: false,
      errMsg: "",
      numberRepeated: false,
      uniqueMsg: "",

      renderTabs: new RenderTabs(this.getInitialTabInfo()),
      deleteTab: "",
      SoUpload: {
        // name of uploader field name
        fieldName: "soUpload",
        /**
         * fileInfo props contain all the fileinfo user need to upload
         * fileInfo.length should be equal to uploadLimit
         * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
         */
        fileInfo: [
          {
            name: "Application Form",
            key: "ApplicationForm"
          },
          {
            name: "Declaration",
            key: "Declaration"
          },
          {
            name: "Check List",
            key: "CheckList"
          },
          {
            name: "Authorization Note",
            key: "AuthorizationNote"
          },
          {
            name: "Asset Liability",
            key: "AssetLiability"
          },
          {
            name: "SO_Document 1",
            key: "SO_Document1"
          },
          {
            name: "SO_Document 2",
            key: "SO_Document2"
          },
          {
            name: "SO_Document 3",
            key: "SO_Document3"
          }
        ],
        /**
         * defaultValuesFieldNames props responsible for appending default values to uploader
         */
        defaultValuesFieldNames: [
          "Application Form",
          "Declaration",
          "Check List",
          "Authorization Note",
          "Asset Liability",
          "SO_Document 1",
          "SO_Document 2",
          "SO_Document 3"
        ],

        // uploadLimit handle how many fields the user need to upload
        uploadLimit: 8,
        /**
         * errorMsg : handle custom error messages.
         * you can pass to handle different sceneries
         */
        errorMsg: {
          //if upload limit exceed
          uploadLimit: "Upload limit exceed!",
          //if fileInfo.length != uploadLimit below message will show
          fileInfoUploadLimitMisMatch:
            "YOUR FIELD NAME props fileinfo and upload limit should be equal",
          //if multiple file uploads have same name
          variableNameConflict: "File Name should be unique",
          //if file uploaded, force your to select file/variable name
          updateVariableName: "Please Select File Name"
        },
        //this props handle defaultFiles fetching state
        initialUploadLoader: true
      },
      scannedImagesList: [
        "panImg",
        "aadhaarImg",
        "Vehicleimage",
        "DLImg",
        "passportImg",
        "voterIdImage",
        "singleKycimage"
      ],
      DealerNameOptions: [],

    };
  }

  async componentDidMount() {
    //NOTE ::: Commend below code for local development
    //set initialUploader true
    this.setState(prevState => ({
      SoUpload: {
        ...prevState.SoUpload,
        initialUploadLoader: true
      }
    }));

    this.setState(prevState => ({
      SoUpload: {
        ...prevState.SoUpload,
        initialUploadLoader: false
      }
    }));
    //loan type option
    // let loanTypeConfig = {
    //   url: `${Config.apiUrl}/v1/loanType`,
    //   method: "get",

    // };
    // axios(loanTypeConfig)
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
    //       loantypeOptions: loanTypeDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // educationLevel Options
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
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
        this.setState({ educationOptions: educationDD });
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
        this.setState({ casteOptions: casteDD });
      })
      .catch(error => {
        console.log(error);
      });
    // maritalstatus options
    let maritalConfig = {
      url:
        ` ${Config.apiUrl}/v1/maritalStatus`,
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
        this.setState({ maritalStatusOptions: maritalStatusDD });
      })
      .catch(error => {
        console.log(error);
      });

    //Dealer Options
    let DealerConfig = {
      url: `${Config.apiUrl}/v1/dealers`,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    };
    axios(DealerConfig)
      .then(res => {
        let DealerNameOptions = res.data.dealers.map(item => {
          return {
            value: item.DealerName,
            label: item.DealerName,
            Location: item.Location,
            accNo: item.BankAccNo
          }
        })
        this.setState({ DealerNameOptions: DealerNameOptions });
      }).catch(error => {
        console.log("dealerOptions function error", error)
      })


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
        this.setState({ religionOptions: religionDD });
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
    //         id: states[iter].id,
    //         value: states[iter].StateCode,
    //         label: states[iter].StateName
    //       });
    //     }
    //     this.setState({
    //       stateOptions: stateDD
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    //countries Opttions
    // let countryConfig = {
    //   url: `${Config.apiUrl}/v1/countries`,
    //   method: "get",
    //   headers: {
    //     Authorization: authToken,
    //   },
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
    //     // this.props.fieldPopulator("Citizenship", { type: "String", value: "India", valueInfo: {} });
    //     this.setState({ citizenshipOptions: citizenDD });

    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.props.fieldPopulator("Citizenship", { type: "String", value: "India", valueInfo: {} })
    // onchange default valaue set
    if (
      this.props.formValues &&
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value !== ""
    ) {
      this.handleOccupationType(this.props.formValues.OccupationType);
      if (this.props.formValues.JobType) {
        this.handleOtherJobType(this.props.formValues.JobType);
      }
    }
    if (this.props.formValues &&
      this.props.formValues.OTP_Value &&
      this.props.formValues.OTP_Value.value !== "") {
      if (this.props.formValues.hiddenOTPStatus &&
        this.props.formValues.hiddenOTPStatus.value === "true") {
        this.setState({ OTP_submit: true, showSuccess: true, buttonLabel: "Verified", otp: this.props.formValues.OTP_Value.value });
      } else if (this.props.formValues.hiddenOTPStatus &&
        this.props.formValues.hiddenOTPStatus.value === "false") {
        this.setState({ OTP_submit: false, showFailure: true, buttonLabel: "Resend OTP", otp: this.props.formValues.OTP_Value.value });
      }
    }
    if (
      this.props.formValues &&
      this.props.formValues.LoanType &&
      this.props.formValues.LoanType.value !== ""
    ) {
      this.loanTypeChange(this.props.formValues.LoanType);
    }
    if (this.props.formValues &&
      this.props.formValues.LoanPurpose &&
      this.props.formValues.LoanPurpose.value !== "") {
      let loanProduct = this.props.formValues.LoanPurpose.value;
      if (loanProduct === "Two Wheeler Loan") {
        this.props.fieldPopulator("ROI", {
          type: "String",
          value: 20
        });
      }
      if (loanProduct === "Three Wheeler Loan") {
        this.props.fieldPopulator("ROI", {
          type: "String",
          value: 23
        });
      }
    }
    if (this.props.formValues &&
      this.props.formValues.LoanAmount &&
      this.props.formValues.LoanAmount.value !== "") {
      this.handleProcessingFee();
    }
    if (!validate.isEmpty(this.props.formValues && this.props.formValues.HighMarkData)) {
      this.handleHighMarkReport()
      let HighMarkData = this.props.formValues.HighMarkData.value;
      if (HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg === "Consumer record not found") {
        let errMsg = HighMarkData.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
        this.setState({
          getHighMarkDone: true,
          HighMarkScoreloading: false,
          HighMarkScore: -1,
          showFoirButton: false,
          HighMarkApiData: HighMarkData,
          errorMessage: false,
          errMsg: errMsg,
          showFoirProgress: true,
          foirValue: this.props.formValues.FoirValue ? this.props.formValues.FoirValue.value : ""
        })
      } else {
        let HighMarkScore = HighMarkData.ResponseXML.BureauResponse.ScoreDetails.score.value;
        this.setState({
          getHighMarkDone: true,
          HighMarkScoreloading: false,
          HighMarkScore: HighMarkScore,
          HighMarkApiData: HighMarkData,
          errorMessage: false,
          showFoirProgress: true,
          showFoirButton: false,
          foirValue: this.props.formValues.FoirValue ? this.props.formValues.FoirValue.value : ""
        });
      }
    }

    if (this.props.formValues && this.props.formValues.PresentAddressAadhaarSame && this.props.formValues.PresentAddressAadhaarSame.value === "No") {
      this.setState({ showPresentAddressFields: true })
    }
    if (this.props.formValues && this.props.formValues.permanentCorrespondenceAddressSame && this.props.formValues.permanentCorrespondenceAddressSame.value === "No") {
      this.setState({ showCorrespondenceAddressFields: true })

    }
    this.handleReturn();
    this.addTabs()
    let {
      taskInfo: {
        info: { assignee },
      },
    } = this.props,
      apiClient = new ApiClient(Config.hostUrl, authToken),
      userDetails = await apiClient.getUserDetails(assignee);
    this.props.fieldPopulator("LC_code", { type: 'string', value: userDetails.data.id, valueInfo: {} });
    this.props.fieldPopulator("LC_firstName", { type: 'string', value: userDetails.data.firstName, valueInfo: {} });
    this.props.fieldPopulator("LC_lastName", { type: 'string', value: userDetails.data.lastName, valueInfo: {} });

    let ApplicationDate = this.props.formValues.ApplicationDate ? this.props.formValues.ApplicationDate.value : "";
    let Date = ApplicationDate.slice(0, 10);
    let applicationDate = moment(Date).format('DD-MM-YYYY');
    this.props.fieldPopulator("applicationDate", { type: 'string', value: applicationDate, valueInfo: {} });

  }

  handleReturn = () => {
    let processVariables = this.props.formValues;
    let data = [];
    if (!validate.isEmpty(processVariables.BOStatus)) {
      if (processVariables.BOStatus.value === "Returned") {
        data.push({
          key: "BackOffice",
          name: "Back Officer",
          value: processVariables.BackOfficerComments.value
        })
      }
    }
    if (!validate.isEmpty(processVariables.l1Status)) {
      if (processVariables.l1Status.value === "Returned") {
        data.push({
          key: "l1CreditOfficer",
          name: "L1 credit Officer",
          value: processVariables.L1OfficerComments.value
        });
      }
    }
    this.setState({ returnData: data });
  }

  handleHighMarkReport = async () => {
    if (!validate.isEmpty(this.props.formValues && this.props.formValues.HighMarkData)) {
      if (typeof this.props.formValues.HighMarkData.value === "string") {
        let HighMarkAPIdata = await retrieveBigData(
          this.props.formValues.HighMarkData.value,
          this.props.taskInfo.info
        );
        if (HighMarkAPIdata.Error) {
          let Error = HighMarkAPIdata.Error;
          this.setState({
            HighMarkError: Error,
            showHighMarkError: true
          })
        } else {
          let base64 = HighMarkAPIdata.pdfBuffer;
          var blob = new Blob([(base64)], { type: 'application/pdf' });
          let pdfFile = window.URL.createObjectURL(blob);
          window.open(pdfFile);
          this.props.fieldPopulator("HighMarkRetrieveData", { type: "String", value: HighMarkAPIdata });
        }
      }
    }
  }

  // handleloanSchemeChange = e => {
  //   let config = {
  //     url: `${Config.apiUrl}/v1/loanSubType`,
  //     data: {
  //       loanType: e.value
  //     },
  //     method: "post"
  //   };
  //   axios(config)
  //     .then(Response => {
  //       let loanType = Response.data.loanSubType;
  //       let loanTypeDD = [];
  //       for (let iter = 0; iter < loanType.length; iter++) {
  //         loanTypeDD.push({
  //           value: loanType[iter].LoanSubType,
  //           label: loanType[iter].LoanSubType
  //         });
  //       }
  //       this.setState({
  //         loanSubtypeOptions: loanTypeDD
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // };
  handleOccupationType = e => {
    if (e.value === "Salaried") {
      this.setState({
        showSalariedFields: true,
        showBusinessFields: false,
        showOthersFields: false
      });
    } else if (e.value === "Business") {
      this.setState({
        showSalariedFields: false,
        showBusinessFields: true,
        showOthersFields: false
      });
    } else if (e.value === "Others") {
      this.setState({
        showSalariedFields: false,
        showBusinessFields: false,
        showOthersFields: true
      });
    }
  };

  handleOtherJobType = (e) => {
    if (e.value === "Student" || e.value === "HomeMaker") {
      this.setState({
        showJobTypeFields: false,
      });
    } else {
      this.setState({
        showJobTypeFields: true,
      });
    }
  }

  citizenshipChange = e => {
    if (e.value === "India") {
      this.setState({ showResidencyStatus: false });
    } else {
      this.setState({ showResidencyStatus: true });
    }
  };
  handleChange_age = e => {
    let age = moment().diff(e.value, 'years');
    this.props.fieldPopulator("Age", {
      type: "String",
      value: age
    })
  };
  handleBusinessStartDate = e => {
    let selected = moment(e.value);
    let today = moment(new Date());
    let Duration = moment.duration(selected.diff(today));
    let year = Duration.years();
    let month = Duration.months();
    let day = Duration.days();
    let age = year + "Years" + month + "Months" + day + "Days";
    let bsDate = { type: "String", value: age };
    this.setState({ startDate: selected, Age: age });
    this.props.fieldPopulator("BusinessAge", bsDate);
  };
  displayINRformat = entry => {
    let value = entry;
    value = value.toString();
    let lastThree = value.substring(value.length - 3);
    let otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  };
  salariedhandleMonthlySalary = e => {
    let enteredValue = e.value;
    let salariedmonthly = enteredValue.replace(/,/g, "");
    this.setState({ salariedMonthlySalary: salariedmonthly });
    let salariedGross = this.displayINRformat(salariedmonthly * 12);
    let gross = { type: "String", value: salariedGross };
    if (!this.props.formValues.MonthlyFixedObligation) {
      this.setState({ salariedAnnualIncome: salariedGross });
      this.props.fieldPopulator("GrossAnnualIncome", gross);
    } else if (
      this.props.formValues.MonthlyFixedObligation &&
      this.props.formValues.MonthlyFixedObligation.value
    ) {
      let salariedObligationValue = this.state.salObligationValue;
      let netIncome = this.displayINRformat(
        salariedGross.replace(/,/g, "") - salariedObligationValue * 12
      );
      let net = { type: "String", value: netIncome };
      this.props.fieldPopulator("GrossAnnualIncome", gross);
      this.props.fieldPopulator("NetAnnualIncome", net);
    }
  };
  handlemonthlyObligationSalaried = e => {
    let enteredValue = e.value;
    let salariedObligation = enteredValue.replace(/,/g, "");
    this.setState({ salObligationValue: salariedObligation });
    let monthlySalary = this.state.salariedMonthlySalary;
    let salariedMonthlySurplus = this.displayINRformat(
      monthlySalary - salariedObligation
    );
    let salariedGrossAnnual = this.props.formValues.GrossAnnualIncome.value;
    let salariednetIncome = this.displayINRformat(
      salariedGrossAnnual.replace(/,/g, "") - salariedObligation * 12
    );
    let net = { type: "String", value: salariednetIncome };
    let surplus = { type: "String", value: salariedMonthlySurplus };
    this.props.fieldPopulator("TotalMonthlySurplus", surplus);
    this.props.fieldPopulator("NetAnnualIncome", net);
  };
  businesshandleMonthlySalary = e => {
    let enteredValue = e.value;
    let businessmonthly = enteredValue.replace(/,/g, "");
    this.setState({ businessMonthlySalary: businessmonthly });
    let businessGross = this.displayINRformat(businessmonthly * 12);
    let gross = {
      type: "String",
      value: businessGross
    };
    this.props.fieldPopulator("BusinessGrossAnnual", gross);
    if (
      this.props.formValues.MonthlyBusinessObligation &&
      this.props.formValues.MonthlyBusinessObligation.value
    ) {
      let businessObligation = this.state.busiObligationValue;
      let netIncomeBusiness = this.displayINRformat(
        businessGross.replace(/,/g, "") - businessObligation * 12
      );
      let net = {
        type: "String",
        value: netIncomeBusiness
      };
      this.props.fieldPopulator("BusinessGrossAnnual", gross);
      this.props.fieldPopulator("BusinessNetAnnual", net);
    }
  };
  handlemonthlyObligationBusiness = e => {
    let enteredValue = e.value;
    let businessObligation = enteredValue.replace(/,/g, "");
    this.setState({ busiObligationValue: businessObligation });
    let monthlySalary = this.state.businessMonthlySalary;
    let BusinessMonthlySurplus = this.displayINRformat(
      monthlySalary - businessObligation
    );
    let businessGrossAnnual = this.props.formValues.BusinessGrossAnnual.value;
    let businessnetIncome = this.displayINRformat(
      businessGrossAnnual.replace(/,/g, "") - businessObligation * 12
    );
    let surplus = { type: "String", value: BusinessMonthlySurplus };
    let net = { type: "String", value: businessnetIncome };
    this.props.fieldPopulator("BusinessNetAnnual", net);
    this.props.fieldPopulator("TotalMonthlySurplus", surplus);
  };
  handlemonthlyObligationOthers = e => {
    let enteredValue = e.value;
    let othersObligation = enteredValue.replace(/,/g, "");
    this.setState({ othersObligationValue: othersObligation });
    let othersGrossMonthly = this.props.formValues.GrossMonthlyIncome.value;
    let othersGrossAnnualIncome = othersGrossMonthly.replace(/,/g, "") * 12;
    let othersnetIncome = this.displayINRformat(
      othersGrossAnnualIncome - othersObligation * 12
    );
    let OthersMonthlySurplus = this.displayINRformat(
      othersGrossMonthly.replace(/,/g, "") - othersObligation
    );
    let surplus = { type: "String", value: OthersMonthlySurplus };
    let net = { type: "String", value: othersnetIncome };
    this.props.fieldPopulator("AnnualIncome", net);
    this.props.fieldPopulator("TotalMonthlySurplus", surplus);
  };
  handleDailyIncomeChange = e => {
    let OthersdailyIncome = e.value.replace(/,/g, "");
    this.setState({ monthlyIncomeOthers: OthersdailyIncome });
    if (!this.props.formValues.WorkingDayCount) {
      this.props.fieldPopulator("GrossMonthlyIncome", { type: "String", value: "" });
    } else {
      let daycountValue = this.props.formValues.WorkingDayCount.value;
      let MonthlyGross = this.displayINRformat(
        OthersdailyIncome * daycountValue
      );
      let obligationOthers = this.state.othersObligationValue;
      let othersGrossAnnual = MonthlyGross * 12;
      let othersnetIncome = this.displayINRformat(
        othersGrossAnnual - obligationOthers * 12
      );
      this.props.fieldPopulator("OthersGrossAnnualSalary", { type: 'String', value: othersGrossAnnual })
      this.props.fieldPopulator("GrossMonthlyIncome", { type: "String", value: MonthlyGross });
      this.props.fieldPopulator("AnnualIncome", { type: "String", value: othersnetIncome });
    }
  };
  handleDayCount = e => {
    let enteredValue = e.value;
    let dayCount = enteredValue;
    let MonthlyGrossIncome = this.displayINRformat(
      this.props.formValues.DailyIncome.value.replace(/,/g, "") * dayCount
    );
    let grossAnnual = this.displayINRformat(
      this.props.formValues.DailyIncome.value.replace(/,/g, "") * dayCount * 12
    )
    let gross = { type: "String", value: MonthlyGrossIncome };
    if (!this.props.formValues.FixedObligation) {
      this.props.fieldPopulator("GrossMonthlyIncome", gross);
      this.props.fieldPopulator("OthersGrossAnnualSalary", { type: 'String', value: grossAnnual })
    } else {
      let obliqothr = this.props.formValues.FixedObligation.value.replace(
        /,/g,
        ""
      );
      let annualIncomeOthers = MonthlyGrossIncome * 12;
      let netAnnualOthers = this.displayINRformat(
        annualIncomeOthers - obliqothr * 12
      );
      let net = { type: "String", value: netAnnualOthers };
      this.props.fieldPopulator("OthersGrossAnnualSalary",
        { type: 'String', value: annualIncomeOthers })
      this.props.fieldPopulator("GrossMonthlyIncome", gross);
      this.props.fieldPopulator("AnnualIncome", net);
    }
  };
  handleFoirCalculation = () => {
    let i;
    if (
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value === "Salaried"
    ) {
      let Foirobligation = this.props.formValues.MonthlyFixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.MonthlyGrossSalary.value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.members &&
        this.props.formValues.members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.value.length; i++) {
          let salariedMemberExpense = this.props.formValues.members.value[i]
            .ExpenseValue.value;
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
        this.setState({ foirValue: membertotalFoir });
        this.props.fieldPopulator("FoirValue", {
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
      this.setState({ showFoirButton: false, showFoirProgress: true });
    }
    if (
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value === "Business"
    ) {
      let Foirobligation = this.props.formValues.MonthlyBusinessObligation
        .value;
      let FoirMonthlyGross = this.props.formValues.MonthlyBusinessGross.value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.members &&
        this.props.formValues.members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.value.length; i++) {
          let businessMemberExpense = this.props.formValues.members.value[i]
            .ExpenseValue.value;
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
        this.setState({ foirValue: membertotalFoir });
        this.props.fieldPopulator("FoirValue", {
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
      this.setState({ showFoirButton: false, showFoirProgress: true });
    }
    if (
      this.props.formValues.OccupationType &&
      this.props.formValues.OccupationType.value === "Others"
    ) {
      let Foirobligation = this.props.formValues.FixedObligation.value;
      let FoirMonthlyGross = this.props.formValues.GrossMonthlyIncome.value;
      let totalFoir = Math.round(parseInt((Foirobligation.replace(/,/g, "") / FoirMonthlyGross.replace(/,/g, "")) * 100));
      if (
        this.props.formValues.members &&
        this.props.formValues.members.value.length > 0
      ) {
        let memberExpenseValue = [];
        for (i = 0; i < this.props.formValues.members.value.length; i++) {
          let OthersMemberExpense = this.props.formValues.members.value[i]
            .ExpenseValue.value;
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
        this.setState({ foirValue: membertotalFoir });
        this.props.fieldPopulator("FoirValue", {
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
      this.setState({ showFoirButton: false, showFoirProgress: true });
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
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    this.setState({ HighMarkScoreloading: true });
    let addresstype;
    if (this.props.formValues.KYC_selectedValue &&
      this.props.formValues.KYC_selectedValue.value !== "") {
      let kyc = JSON.parse(this.props.formValues.KYC_selectedValue.value);
      // ["Aadhaar","DrivingLicense","PAN","Passport","VoterId","SingleKYCApproval"]
      if (kyc.includes('PAN')) {
        addresstype = "2"
      } else if (kyc.includes('Aadhaar')) {
        addresstype = '1'
      } else if (kyc.includes('DrivingLicense')) {
        addresstype = '3'
      } else if (kyc.includes('VoterId')) {
        addresstype = '4'
      } else if (kyc.includes('Passport')) {
        addresstype = '5'
      }
    }

    let firstName = !validate.isEmpty(this.props.formValues.FirstName)
      ? this.props.formValues.FirstName.value
      : null;
    let lastName = !validate.isEmpty(this.props.formValues.LastName)
      ? this.props.formValues.LastName.value
      : null;
    let gender = !validate.isEmpty(this.props.formValues.Gender)
      ? this.props.formValues.Gender.value
      : null;
    let city = !validate.isEmpty(this.props.formValues.City)
      ? this.props.formValues.City.value
      : null;
    let pincode = !validate.isEmpty(this.props.formValues.Pincode)
      ? this.props.formValues.Pincode.value
      : null;
    let maritalstatus = !validate.isEmpty(this.props.formValues.MaritalStatus)
      ? this.props.formValues.MaritalStatus.value
      : null;
    let state = !validate.isEmpty(this.props.formValues.State)
      ? this.props.formValues.State.value
      : null;
    let dob = !validate.isEmpty(this.props.formValues.DateOfBirth)
      ? this.props.formValues.DateOfBirth.value.slice(0, 10)
      : null;
    let aadhar = !validate.isEmpty(this.props.formValues.AadhaarNo)
      ? this.props.formValues.AadhaarNo.value
      : null;
    let panNo = !validate.isEmpty(this.props.formValues.panNo)
      ? this.props.formValues.panNo.value
      : null;
    let voterNo = !validate.isEmpty(this.props.formValues.VoterIDNumber)
      ? this.props.formValues.VoterIDNumber.value :
      null;
    let passportNum = !validate.isEmpty(this.props.formValues.passportNo)
      ? this.props.formValues.passportNo.value :
      null;
    let dlNo = !validate.isEmpty(this.props.formValues.DL_Number)
      ? this.props.formValues.DL_Number.value :
      null;
    let loanamount = !validate.isEmpty(this.props.formValues.LoanAmount)
      ? this.props.formValues.LoanAmount.value.replace(/,/g, "")
      : null;
    let address = !validate.isEmpty(this.props.formValues.BorrowerAddress)
      ? this.props.formValues.BorrowerAddress.value
      : null;
    let HighMarkConfig = {
      url: `${Config.apiUrl}/v1/cibil`,
      method: "post",
      headers: {
        Authorization: authToken
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
        if (response.data.Error === "Consumer record not found") {
          let errMsg = response.data.ResponseXML.BureauResponse.ErrorTypeDetails.ErrorType.ErrorMsg;
          this.setState({
            getHighMarkDone: true,
            HighMarkScoreloading: false,
            HighMarkScore: -1,
            HighMarkApiData: response.data,
            errorMessage: true,
            errMsg: errMsg
          })
        } else {
          let HighMarkScore = response.data.ResponseXML.BureauResponse.ScoreDetails.score.value;
          let CrifLink = response.data.pdfLink;
          this.props.fieldPopulator("HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
          this.props.fieldPopulator("CrifLink", { type: "String", value: CrifLink });
          let account_summary = response.ResponseXML.BureauResponse.AccountSummaryDetails;
          let total = 0;
          account_summary.AccountSummary.forEach((summary) => {
            total += Number(summary.TotalMonthlyPaymentAmount);
          })
          this.props.fieldPopulator("TotalMonthlyPayment", total);
          this.setState({
            getHighMarkDone: true,
            HighMarkScoreloading: false,
            HighMarkScore: HighMarkScore,
            HighMarkApiData: response.data,
            errorMessage: false
          });
        }
        this.props.fieldPopulator("HighMarkData", { type: "String", value: HighMarkData, valueInfo: {} });
      }, (error) => {
        this.setState({
          HighMarkScoreloading: false,
          errorMessage: true
        });
      })
      .catch(e => {
        this.setState({
          HighMarkScoreloading: false,
          errorMessage: true
        });
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
      const dateOfBirth = moment(DateOfBirth).format("DD MM YYYY");
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
    } else {
      return null
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
              const createdOn = moment(address.CreatedOn).format("DD MM YYYY");
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
              const issueDate = moment(CreatedOn).format("DD MM YYYY");
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
    let { members } = this.props.formValues;
    if (members) {
      members.value.forEach((member, index) => {
        if (modifiedIndex !== index) {
          total += parseInt(member.ExpenseValue.value)
        } else {
          total += parseInt(value.value)
        }
      })
    } else {
      total = parseInt(value.value);
    }
    this.props.fieldPopulator("ExpenseTotal", { type: "String", value: total });
  };
  handleIFSCcode = value => {
    let enteredValue = value.value;
    let code = enteredValue;
    if (code.length >= 11) {
      let status = code.match(/^[A-Za-z]{4}\d{7}$/gi) != null;
      if (status === true) {
        this.setState({ ifsc: code });
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
        this.setState({ pincode: pincode }, () => {
          this.mapCityState();
        })
      }
    }
  };
  PresentAddressAadhaarSame = e => {
    if (e.value === "Yes") {
      this.setState({ showPresentAddressFields: false });
    } else {
      this.setState({ showPresentAddressFields: true });
    }
  };
  CorrespondenceAddressSame = e => {
    if (e.value === "Yes") {
      this.setState({ showCorrespondenceAddressFields: false });
    } else {
      this.setState({ showCorrespondenceAddressFields: true });
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
        mobile: "91" + this.props.formValues.BorrowerMobile.value
      }
    };
    this.setState({ loading: true });
    axios(config).then(
      response => {
        let pinID = response.data.pinId;
        if (response.data.smsStatus === "MESSAGE_SENT") {
          let OTP_Status = response.data.smsStatus;
          this.props.fieldPopulator("OTP_Status", { type: "String", value: OTP_Status });
        }
        this.setState({
          otpPinID: pinID,
          loading: false,
          buttonLabel: "RESEND OTP",
          showSuccess: false,
          showFailure: false
        });
      },
      () => {
        this.setState({
          loading: false,
          buttonLabel: "RESEND OTP",
          showSuccess: false,
          showFailure: true
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
        pin_id: this.state.otpPinID
      }
    };
    this.setState({ loading: true });
    axios(config).then(
      response => {
        let resendpinID = response.data.pinId;
        this.setState({
          otpPinID: resendpinID,
          otpSent: true,
          loading: false,
          buttonLabel: "RESEND OTP",
          showSuccess: true
        });
      },
      () => {
        this.setState({
          loading: false,
          buttonLabel: "RESEND OTP",
          showSuccess: false,
          showFailure: true
        });
      }
    );
  };
  handleOtpNumber = otp => {
    let otpValue = otp;
    this.setState({ otp: otpValue });
    this.props.fieldPopulator("OTP_Value", { type: "String", value: otpValue });
    let authToken =
      this.props.taskInfo && this.props.taskInfo.info && this.props.taskInfo.info.authToken ?
        this.props.taskInfo.info.authToken : null;
    let config = {
      url: `${Config.apiUrl}/v1/verifyOtp`,
      method: "post",
      headers: {
        Authorization: authToken,
      },
      data: {
        otp: otpValue,
        pin_id: this.state.otpPinID
      }
    };
    if (otpValue.length === 4) {
      axios(config).then(response => {
        this.setState({ verifyOTP: response.data.verified });
        if (response.data.verified === true) {
          this.setState({ OTP_submit: true, showSuccess: true, buttonLabel: "Verified" });
          this.props.fieldPopulator("hiddenOTPStatus", {
            type: "String",
            value: this.state.verifyOTP
          })
        } else if (response.data.verified === false) {
          this.setState({ OTP_submit: false });
          this.props.fieldPopulator("hiddenOTPStatus", {
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
    this.setState({ otp: value });
    this.setState({ OTP_submit: false });
  };
  handleAssetType = value => {
    if (value.value === "Others") {
      this.setState({ showOthersComments: true });
    } else if (value.value !== "Others") {
      this.setState({ showOthersComments: false });
    }
  };
  handleShowRoomPrice = e => {
    let enteredValue = e.value;
    let price = enteredValue.replace(/,/g, "");
    this.setState({ veh_showRoomPrice: price }, () => { });
    if (
      this.props.formValues.RoadTax &&
      this.props.formValues.RoadTax.value &&
      this.props.formValues.InsuranceAmount &&
      this.props.formValues.InsuranceAmount.value) {
      let veh_tax = this.state.veh_roadTax;
      let veh_insAmt = this.state.veh_InsuranceAmount;
      let veh_otherAmt = this.state.veh_othersAmt;
      let veh_onroadprice =
        Number(price) +
        Number(veh_tax) +
        Number(veh_insAmt) +
        Number(veh_otherAmt);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onroadprice)
      };
      this.props.fieldPopulator("OnRoadPrice", orp);
    }
  };
  handleRoadTax = e => {
    let value = e.value;
    let tax = value.replace(/,/g, "");
    this.setState({ veh_roadTax: tax }, () => { });
    if (
      this.props.formValues.ExShowroomPrice &&
      this.props.formValues.ExShowroomPrice.value &&
      this.props.formValues.InsuranceAmount &&
      this.props.formValues.InsuranceAmount.value) {
      let veh_insAmount = this.state.veh_InsuranceAmount;
      let veh_Price = this.state.veh_showRoomPrice;
      let veh_Others = this.state.veh_othersAmt;
      let veh_onRoadPrice =
        Number(tax) +
        Number(veh_insAmount) +
        Number(veh_Price) +
        Number(veh_Others);
      let orp = {
        type: "String",
        value: this.displayINRformat(veh_onRoadPrice)
      };
      this.props.fieldPopulator("OnRoadPrice", orp);
    }
  };
  handleInsuranceAmount = e => {
    let value = e.value;
    let insAmount = value.replace(/,/g, "");
    this.setState({ veh_InsuranceAmount: insAmount }, () => { });
    if (
      this.props.formValues.ExShowroomPrice &&
      this.props.formValues.ExShowroomPrice.value &&
      this.props.formValues.RoadTax && this.props.formValues.RoadTax.value) {
      let veh_roadTax = this.state.veh_roadTax;
      let veh_Price = this.state.veh_showRoomPrice;
      let veh_others = this.state.veh_othersAmt;
      let vehonRoadPrice =
        Number(veh_roadTax) +
        Number(veh_Price) +
        Number(veh_others) +
        Number(insAmount);
      let orp = {
        type: "String",
        value: this.displayINRformat(vehonRoadPrice)
      };
      this.props.fieldPopulator("OnRoadPrice", orp);
    }
  };
  handleOnRoadPrice = e => {
    let others = e.value;
    let othersAmt = others.replace(/,/g, "");
    this.setState({ veh_othersAmt: othersAmt }, () => { });
    let showRoomPrice = this.state.veh_showRoomPrice;
    let roadTax = this.state.veh_roadTax;
    let insAmount = this.state.veh_InsuranceAmount;
    let onRoadPrice =
      Number(showRoomPrice) +
      Number(roadTax) +
      Number(insAmount) +
      Number(othersAmt);
    let orp = { type: "String", value: this.displayINRformat(onRoadPrice) };
    this.props.fieldPopulator("OnRoadPrice", orp);
  };

  handleExpectedTenure = e => {
    // EMI = [P x R x(1 + R) ^ N] / [(1 + R) ^ N - 1]
    let P = this.props.formValues.LoanAmount ? this.props.formValues.LoanAmount.value : "";
    let N = e.value.replace(/M/g, "");
    let ROI = this.props.formValues.ROI ? this.props.formValues.ROI.value : "";
    let R = ROI / 1200;
    let numerator = Math.pow((1 + R), N)
    let denominator = numerator - 1
    let ratio = numerator / denominator;
    let EMI = P * R * ratio;
    let X_EMI = Math.ceil(EMI / 5) * 5;
    let EMI_inwords = this.handleNumtoWord(X_EMI);
    this.props.fieldPopulator("EMI_inWords", { type: "String", value: EMI_inwords, valueInfo: {} });
    this.props.fieldPopulator("EstimatedEMI", { type: "String", value: X_EMI, valueInfo: {} });
    // let Tenure = this.props.formValues.ExpectedTenure ? this.props.formValues.ExpectedTenure.value : "";
    // let repaymentconfig = {
    //   url:
    //     `${Config.apiUrl}/v1/repaymentScheduleGeneration`,
    //   method: "post",
    // headers: {
    //   Authorization: authToken
    // },
    //   data: {
    //     "input": {
    //       "Operation": {
    //         "_text": "repaymentScheduleGreneration"
    //       },
    //       "SessionContext": {
    //         "Channel": {
    //           "_text": "AUTO8"
    //         },
    //         "ExternalReferenceNo": {
    //           "_text": "MBL-000000000004-PRO"
    //         },
    //         "SupervisorContext": {
    //           "UserId": {
    //             "_text": "AUTONOMOS8"
    //           },
    //           "PrimaryPassword": {
    //             "_text": "V2VsY29tZUAxMjM="
    //           }
    //         }
    //       },
    //       "AccountNumber": {
    //         "_text": "999999999999"
    //       },
    //       "EndDate": {
    //         "_text": "01/01/2099"
    //       },
    //       "INPUT": {
    //         "_text": this.props.formValues.BranchID.value + "|7201|" + this.props.formValues.LoanAmount.value.replace(',', '') + "|1MA1|" + Tenure + "|" + this.props.formValues.ROI.value + "|||1#12/12/2021~1#01/01/2024"
    //       },
    //       "UserID": {
    //         "_text": "PD8901"
    //       },
    //       "LoggedInUserId": {}
    //     }
    //   }
    // };
    // axios(repaymentconfig)
    //   .then(response => {
    //     console.log("response", response)
    //     let RepaymentResponse = response.data.Response.RepaymentDetailsList.Repayment;
    //     let data = RepaymentResponse.find(function (value) {
    //       return (value.Activity_Description._text.toLowerCase()).includes("repayment")
    //     });
    //     if (data && Object.keys(data).length > 0) {
    //       let EMI = data.EMI_Amount._text;
    //       console.log("EMI....>", EMI);
    //       this.setState({ RepaymentEMIAmount: EMI });
    //       this.props.fieldPopulator("EstimatedEMI", {
    //         type: "String",
    //         value: EMI,
    //         valueInfo: {}
    //       });

    //     } else {
    //       // let errorMsg = response.data.Exception.ErrorMessage;
    //       // throw error saying unable to find repayment of loan
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  getInitialTabInfo() {
    if (this.props.taskInfo) {
      let taskId = this.props.taskInfo.info.id;
      let currentTabInfo = soProcessNewTabInfo.default;
      let { dynamicTabDetails } = this.props;
      if (dynamicTabDetails && dynamicTabDetails[taskId]) {
        currentTabInfo = dynamicTabDetails[taskId];
      }
      return currentTabInfo;
    }
  }
  addTabs() {
    let guarantorSelect =
      this.props.formValues && this.props.formValues.guarantorSelect
        ? this.props.formValues.guarantorSelect.value
        : null;
    let coBorrowerSelect =
      this.props.formValues && this.props.formValues.coBorrowerSelect
        ? this.props.formValues.coBorrowerSelect.value
        : null;
    let { currentTabInfo } = this.state.renderTabs;
    let latestTabList = [...soProcessNewTabInfo.default.tabList];
    if (!validate.isEmpty(coBorrowerSelect)) {
      for (let i = 0; i < coBorrowerSelect; i++) {
        let newCoApplicantDetail = {
          name: `tabcoApplicantNew${i + 1}`,
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
          name: `tabGuarantorNew${j + 1}`,
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

    this.props.updateDynamicTabInfo({
      taskId: this.props.taskInfo.info.id,
      tabInfo: latestTabList
    });

    this.setState({ renderTabs: newRenderTabs });
  }
  deleteTabs() {
    let newRenderTabs = this.state.renderTabs
      .deleteTabs([this.state.deleteTab])
      .renderTabs(this.props.taskInfo.info.id, this.props.ipc);
    this.props.fieldPopulator("deletionSelect", {});
    let { tabList } = this.state.renderTabs.currentTabInfo;
    let coApplicantCount = 0,
      guarantorCount = 0;
    tabList.forEach(tab => {
      if (tab.label.includes("guarantor")) {
        guarantorCount++;
      } else if (tab.label.includes("coApplicant")) {
        coApplicantCount++;
      }
    });
    this.props.fieldPopulator("coBorrowerSelect", {
      type: "String",
      value: coApplicantCount,
      valueInfo: {}
    });
    this.props.fieldPopulator("guarantorSelect", {
      type: "String",
      value: guarantorCount,
      valueInfo: {}
    });
    this.props.updateDynamicTabInfo({
      taskId: this.props.taskInfo.info.id,
      tabInfo: newRenderTabs.currentTabInfo.tabList
    });
    this.setState({ renderTabs: newRenderTabs, deleteTab: "" });
  }

  handleKycSelect = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("KYC_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });
    if (selectedValue.length >= 2) {
      this.props.fieldPopulator("kycstatus", { type: "String", value: "true" });
    } else {
      this.props.fieldPopulator("kycstatus", { type: "String", value: "" });
    }
  }

  handleAddressVerification = (value) => {
    let selectedValue = value;
    this.props.fieldPopulator("Addr_selectedValue", { type: "string", value: JSON.stringify(selectedValue) });

    if (selectedValue.length >= 1) {
      this.props.fieldPopulator("VerifyAddress", { type: "String", value: "true" });
    } else {
      this.props.fieldPopulator("VerifyAddress", { type: "String", value: "" });
    }
  }

  handleCreditShield = (e) => {
    this.props.fieldPopulator("CreditShieldValue", { type: "String", value: e.value });
  }

  mapCityState = () => {
    let pincode = this.state.pincode;
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
          districtOptions: districtDD,
          stateOptions: stateDD,
          postOfficeOptions: postOfficeDD
        });

      }).catch(error => {
        console.log("mapCityState function error", error)
      })
  }
  handleDealer = e => {
    let selection = e.value;
    let dealerLocation = this.state.DealerNameOptions.filter(item => item.value === selection)[0].Location;
    let dealerBankAccNo = this.state.DealerNameOptions.filter(item => item.value === selection)[0].accNo;
    this.props.fieldPopulator("dealerLocation", {
      type: "String",
      value: dealerLocation
    })

    this.props.fieldPopulator("BankAccNo", {
      type: "String",
      value: dealerBankAccNo
    })
  }

  handleProcessingFee = () => {
    let loanAmount = this.props.formValues.LoanAmount ? this.props.formValues.LoanAmount.value : 0;
    let processingFee = loanAmount * 0.02;
    let ProcessingFee_inWords = this.handleNumtoWord(processingFee)
    this.props.fieldPopulator("ProcessingFee", {
      type: "String",
      value: `${processingFee} /- (Plus applicable taxes).`
    })
    this.props.fieldPopulator("ProcessingFee_inWords", {
      type: "String",
      value: ProcessingFee_inWords
    })
  }


  handleMarginInWord = (e) => {
    let Margin_inWords = this.handleNumtoWord(e.value)
    this.props.fieldPopulator("Margin_inWords", {
      type: "String", value: Margin_inWords
    })
  }

  handleNumtoWord = (amount) => {
    let a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen "
    ];
    var b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety"
    ];
    let num = amount;
    if ((num = num.toString()).length > 9) return "overflow";
    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    str +=
      n[1] !== "00"
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore "
        : "";
    str +=
      n[2] !== "00"
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh "
        : "";
    str +=
      n[3] !== "00"
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand "
        : "";
    str +=
      n[4] !== "0"
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred "
        : "";
    str +=
      n[5] !== "00"
        ? (str !== "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
        : "";
    str += "Only.";
    return str;
  };

  renderMembers() {
    if ((this.props.formValues && !this.props.formValues.members) || (this.props.formValues && this.props.formValues.members && typeof this.props.formValues.members.value !== "string")) {
      return (
        <div className="form-section">
          <FormHeadSection
            sectionLabel="Applicant ExtraOrdinary Expense"
            sectionKey="applicantExtraOrdinaryExpense"
            formSyncError={this.props.formSyncError}
            sectionValidator={this.state.sectionValidator}
          />
          <div className="form-section-content">
            <div className="flex-row">
              <FieldArray
                name="members.value"
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
    let panDetails = this.props.formValues && this.props.formValues.panDetails ? this.props.formValues.panDetails.value : null;

    let aadhaarDetails = this.props.formValues && this.props.formValues.aadhaarDetails ? this.props.formValues.aadhaarDetails.value : null;

    let passportDetails = this.props.formValues && this.props.formValues.passportDetails ? this.props.formValues.passportDetails.value : null;

    let drivingLicenseDetails = this.props.formValues && this.props.formValues.drivingLicenseDetails ? this.props.formValues.drivingLicenseDetails.value : null;

    let voterIdDetails = this.props.formValues && this.props.formValues.voterIdDetails ?
      this.props.formValues.voterIdDetails.value : null;

    if (panDetails && IsJsonString(panDetails)) {
      panDetails = JSON.parse(panDetails);
    }
    if (aadhaarDetails && IsJsonString(aadhaarDetails)) {
      aadhaarDetails = JSON.parse(aadhaarDetails);
    }
    if (passportDetails && IsJsonString(passportDetails)) {
      passportDetails = JSON.parse(passportDetails);
    }
    if (drivingLicenseDetails && IsJsonString(drivingLicenseDetails)) {
      drivingLicenseDetails = JSON.parse(drivingLicenseDetails);
    }
    if (voterIdDetails && IsJsonString(voterIdDetails)) {
      voterIdDetails = JSON.parse(voterIdDetails);
    }

    const KycOptions = [
      { label: 'Aadhaar', value: 'Aadhaar' },
      { label: 'Driving License', value: 'DrivingLicense' },
      { label: 'PAN', value: 'PAN' },
      { label: 'Passport', value: 'Passport' },
      { label: 'VoterId', value: 'VoterId' },
      { label: 'Single KYC Approval', value: 'SingleKYCApproval' }
    ];

    const addressOptions = [
      { label: "Permanent Address", value: "PermanentAddress" },
      { label: "Residential Address", value: "ResidentialAddress" },
      { label: "Work Address", value: "WorkAddress" }
    ]

    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-so_process"
        >

          {/*Returned Section */}
          {((this.props.formValues.BOStatus && this.props.formValues.BOStatus.value === "Returned") ||
            (this.props.formValues.l1Status && this.props.formValues.l1Status.value === "Returned")) &&

            <div className="form-section">
              <div className={"form-section-head clearfix on"}>
                <h3>
                  {"Return Status"}
                </h3>
                <span className="status-label status-label-warning">Returned</span>
              </div>
              <div className="form-section-content" style={{ display: "block" }}>
                {this.state.returnData &&
                  <Table dataSource={this.state.returnData} size="middle">
                    <ColumnGroup>
                      <Column
                        title="Returned By"
                        dataIndex="name"
                        key="returned"
                      />
                      <Column
                        title="Reason "
                        dataIndex="value"
                        key="returned"
                      />
                    </ColumnGroup>
                  </Table>}
              </div>
            </div>
          }

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Identity Information"
              sectionKey="applicantIdentInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            // use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Application ID"}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant ID"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Borrower Type <span style={{ color: "red" }}>*</span></span>}
                    name="BorrowerType"
                    component={Select}
                    placeholder="Select Borrower Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "BorrowerType is required" })
                    ]}
                  >
                    <Option value="Applicant">Applicant</Option>
                    <Option value="Co-Applicant_1">Co-Applicant_1</Option>
                    <Option value="Co-Applicant_2">Co-Applicant_2</Option>
                    <Option value="Co-Applicant_3">Co-Applicant_3</Option>
                    <Option value="Co-Applicant_4">Co-Applicant_4</Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Basic Information"
              sectionKey="applicantBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name="FirstName"
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
                      A8V.minLength({ errorMsg: " ", min: 1 }),
                      A8V.required({ errorMsg: "FirstName is required" }),
                      A8V.text({ errorMsg: "" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Middle Name"}
                    name="MiddleName"
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
                    name="LastName"
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
                      A8V.required({ errorMsg: "LastName is required" }),
                      A8V.text({ errorMsg: "" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Gender <span style={{ color: "red" }}>*</span></span>}
                    name="Gender"
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
                    name="Salutation"
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
                    name="DateOfBirth"
                    type="date"
                    component={DatePicker}
                    dateFormat="DD/MM/YYYY"
                    placeholder="Select DateOfBirth"
                    onChange={this.handleChange_age}
                    disabledDate={current => {
                      return (current && (moment().add(-60, 'year').add(-1, 'day') > current || current > moment().add(-18, 'year').add(-1, 'day')));
                    }}
                    validate={[
                      A8V.required({ errorMsg: "Date of Birth Required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Age"}
                    name="Age"
                    type="text"
                    component={TextBox}
                    placeholder="Enter Age"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant KYC Information (Any Two Mandatory)"
              sectionKey="applicantKYC"
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
                      style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox"
                      options={KycOptions}
                      defaultValue={this.props.formValues.KYC_selectedValue ? JSON.parse(this.props.formValues.KYC_selectedValue.value) : ""}
                      onChange={this.handleKycSelect} />
                  </div>
                  <Field
                    hidden={true}
                    name="kycstatus"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "kycstatus is required" })
                    ]}
                  />
                </div>
              </div>
              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("Aadhaar")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Aadhaar Name <span style={{ color: "red" }}>*</span></span>}
                        // label={"Aadhaar Name"}
                        name="AadhaarName"
                        component={TextBox}
                        placeholder="Enter  Aadhaar Name"
                        type="text"
                        maxlength="40"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Aadhaar Name is required" }),
                          // A8V.text({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Aadhaar Number <span style={{ color: "red" }}>*</span></span>}
                        // label={"Aadhaar Number"}
                        name="AadhaarNo"
                        component={TextBox}
                        placeholder="Enter  Aadhaar Number"
                        type="text"
                        maxlength="12"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Aadhaar Number is required" }),
                          A8V.number({ errorMsg: "" }),
                          A8V.minLength({ min: 12 }),
                          A8V.maxLength({ max: 12 })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Aadhaar Date Of Birth <span style={{ color: "red" }}>*</span></span>}
                        name="AadhaarDOB"
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
                        name="Aadhaar_Scanner"
                        component={Scanner}
                        docType="AADHAR"
                        imageVar={"aadhaarImg"}
                        parserVar={"aadhaarDetails"}
                        metaVar={"aadhaarMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={aadhaarDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {aadhaarDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {aadhaarDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Aadhaar Number :
                            </span>{" "}
                            {aadhaarDetails.aadharNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {aadhaarDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Gender :
                            </span>{" "}
                            {aadhaarDetails.gender}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("DrivingLicense")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        name="DL_DateOfBirth"
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
                        name="DL_IssueDate"
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
                        name="DL_ExpiryDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Valid Upto"
                        disabledDate={current => {
                          return (
                            current && current < moment().add(-1, "day")
                          );
                        }}
                        validate={[
                          A8V.required({ errorMsg: "Date of Expiry is required" }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Driving License Number<span style={{ color: "red" }}>*</span></span>}
                        name="DL_Number"
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
                        name="DL_Scanner"
                        component={Scanner}
                        docType="DL"
                        imageVar={"DLImg"}
                        parserVar={"drivingLicenseDetails"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={drivingLicenseDetails}
                        metaVar={"drivingLicenseMeta"}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {drivingLicenseDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                            {drivingLicenseDetails.bloodGroup}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                            {" "}
                            {drivingLicenseDetails.dateOfBirth}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {drivingLicenseDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                            {" "}
                            {drivingLicenseDetails.dateOfExpiry}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                            {" "}
                            {drivingLicenseDetails.dlId}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>State :</span>
                            {" "}
                            {drivingLicenseDetails.dlState}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("PAN")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Pan Name<span style={{ color: "red" }}>*</span></span>}
                        name="panName"
                        component={TextBox}
                        placeholder="Enter Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "PAN name is required" }),
                          A8V.text({ errorMsg: "" })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Pan Number<span style={{ color: "red" }}>*</span></span>}
                        name="panNo"
                        component={TextBox}
                        placeholder="Enter PAN Number"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Date Of Birth<span style={{ color: "red" }}>*</span></span>}
                        name="panDOB"
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
                        label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                        name="panFatherName"
                        component={TextBox}
                        placeholder="Enter Father Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "Father Name is required" }),
                          A8V.text({ errorMsg: "" })
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Pan Card Scanner"}
                        name="PAN_Scanner"
                        component={Scanner}
                        docType="PAN"
                        imageVar={"panImg"}
                        parserVar={"panDetails"}
                        docParse={true}
                        metaVar={"panMeta"}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={panDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {panDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {panDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {panDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                            {panDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {panDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("Passport")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Type Of Passport<span style={{ color: "red" }}>*</span></span>}
                        name="passportType"
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
                        label={<span> Passport Number<span style={{ color: "red" }}>*</span></span>}
                        name="passportNo"
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
                        label={<span> Date Of Issue<span style={{ color: "red" }}>*</span></span>}
                        name="passport_IssueDate"
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
                        label={<span> Date Of Expiry<span style={{ color: "red" }}>*</span></span>}
                        name="passport_ExpiryDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Valid Upto"
                        disabledDate={current => {
                          return (
                            current && current < moment().add(-1, "day")
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
                        name="Passport_Scanner"
                        component={Scanner}
                        docType="PASSPORT"
                        imageVar={"passportImg"}
                        parserVar={"passportDetails"}
                        metaVar={"passportMeta"}
                        docParse={true}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={passportDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {passportDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Type :</span>
                            {passportDetails.type}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Passport Number :</span>
                            {" "}
                            {passportDetails.passportNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>DOB :</span>
                            {" "}
                            {passportDetails.dob}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>
                            {" "}
                            {passportDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                            {" "}
                            {passportDetails.dateOfIssue}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Date Of Expiry :</span>
                            {" "}
                            {passportDetails.dateOfExpiry}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }

              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("VoterId")) && <React.Fragment>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Voter ID Number<span style={{ color: "red" }}>*</span></span>}
                        name="VoterIDNumber"
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
                        label={<span> Name in Voter ID<span style={{ color: "red" }}>*</span></span>}
                        name="VoterIDName"
                        component={TextBox}
                        placeholder="Enter VoterID Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "VoterID Name  is required" }),
                          A8V.text({ errorMsg: "" })
                        ]}
                      />
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                        name="VoterIDFatherName"
                        component={TextBox}
                        placeholder="Enter Father Name"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: "VoterID Father Name is required" }),
                          A8V.text({ errorMsg: "" })

                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Voter Scanner"}
                        name="Voter_Scanner"
                        component={Scanner}
                        docType="VOTERID"
                        imageVar={"voterIdImage"}
                        parserVar={"voterIdDetails"}
                        docParse={true}
                        metaVar={"voterIdMeta"}
                        taskInfo={this.props.taskInfo}
                        a8flowApiUrl={`${Config.baseUrl}`}
                        isDataFound={voterIdDetails}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                      {voterIdDetails && (
                        <div style={{ marginTop: "-20px" }}>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Name :</span>
                            {voterIdDetails.name}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Account Number :
                        </span>{" "}
                            {voterIdDetails.accountNumber}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                            {voterIdDetails.gender}
                          </p>
                          <p>
                            {" "}
                            <span style={{ color: "#CB1E1A" }}>
                              Fathers Name :
                        </span>{" "}
                            {voterIdDetails.fathersName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider type="horizontal" />
                </React.Fragment>
              }
              {(this.props.formValues &&
                this.props.formValues.KYC_selectedValue &&
                JSON.parse(this.props.formValues.KYC_selectedValue.value).includes("SingleKYCApproval")) &&
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    {/** File Uploader */}
                    <Field
                      label={"Single KYC Image "}
                      name="singleKycImage"
                      component={Scanner}
                      docType="IMG"
                      imageVar="singleKycimage"
                      metaVar={"singleKycimageMeta"}
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
              sectionLabel="Applicant Detailed Information"
              sectionKey="applicantDetailedInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Mobile number<span style={{ color: "red" }}>*</span></span>}
                    name="BorrowerMobile"
                    component={TextBox}
                    placeholder="Enter Mobile Number"
                    disabled={true}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Mobile number is required" }),
                      A8V.number({ errorMsg: "" }),
                      A8V.minLength({ errorMsg: "", min: 10 }),
                      A8V.maxLength({ errorMsg: "", max: 10 })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Alternate Mobile number'}
                    name="AlternateMobile"
                    component={TextBox}
                    placeholder="Enter Alternative Phone Number"
                    type="text"
                    // onChange={this.handleMobileNumber}
                    hasFeedback
                    className="form-control-coustom"
                  // validate={[
                  //   A8V.uniqueMobileNumber({
                  //     errorMsg: "Mobile number should be unique", mobile: [
                  //       this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                  //       this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                  //       // this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
                  //       this.props.formValues.ReferenceMobile_2 ? this.props.formValues.ReferenceMobile_2.value : '',
                  //       this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
                  //       this.props.formValues.c2mobileNumber ? this.props.formValues.c2mobileNumber.value : '',
                  //       this.props.formValues.c3mobileNumber ? this.props.formValues.c3mobileNumber.value : '',
                  //       this.props.formValues.c4mobileNumber ? this.props.formValues.c4mobileNumber.value : '',
                  //       this.props.formValues.c1AlternativePhone ? this.props.formValues.c1AlternativePhone.value : '',
                  //       this.props.formValues.c2AlternativePhone ? this.props.formValues.c2AlternativePhone.value : '',
                  //       this.props.formValues.c3AlternativePhone ? this.props.formValues.c3AlternativePhone.value : '',
                  //       this.props.formValues.c4AlternativePhone ? this.props.formValues.c4AlternativePhone.value : '',
                  //       this.props.formValues.g1mobileNumber ? this.props.formValues.g1mobileNumber.value : '',
                  //       this.props.formValues.g1AlternativePhone ? this.props.formValues.g1AlternativePhone.value : '',
                  //       this.props.formValues.g2mobileNumber ? this.props.formValues.g2mobileNumber.value : '',
                  //       this.props.formValues.g2AlternativePhone ? this.props.formValues.g2AlternativePhone.value : '',
                  //     ]
                  //   })
                  // ]}
                  />
                </div>
                {/**{this.state.numberRepeated && (
                  <p style={{ color: "red" }}>{this.state.uniqueMsg}</p>
                )}**/}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Email Id"}
                    name="Email"
                    component={TextBox}
                    placeholder="Enter Email"
                    type="email"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Citizenship<span style={{ color: "red" }}>*</span></span>}
                    name="Citizenship"
                    component={Select}
                    placeholder="Select Citizenship"
                    className="a8Select"
                    onChange={this.citizenshipChange}
                    validate={[
                      A8V.required({ errorMsg: "Citizenship is required" }),
                      A8V.text({ errorMsg: "" })
                    ]}
                  >
                    <Option key="India" value="India">India</Option>
                    {/*{this.state.citizenshipOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}*/}
                  </Field>
                </div>
                {this.state.showResidencyStatus && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={<span> Residency Status<span style={{ color: "red" }}>*</span></span>}
                      name="ResidencyStatus"
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
                    label={<span> Religion<span style={{ color: "red" }}>*</span></span>}
                    name="Religion"
                    component={Select}
                    placeholder="Select Religion"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Religion is required" })
                    ]}
                  >
                    {this.state.religionOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Caste<span style={{ color: "red" }}>*</span></span>}
                    name="Caste"
                    component={Select}
                    placeholder="Select Caste"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "Caste is required" })]}
                  >
                    {this.state.casteOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Marital Status<span style={{ color: "red" }}>*</span></span>}
                    name="MaritalStatus"
                    component={Select}
                    placeholder="Enter MaritalStatus"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Marital Status is required" })
                    ]}
                  >
                    {this.state.maritalStatusOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Education Level<span style={{ color: "red" }}>*</span></span>}
                    name="EducationLevel"
                    component={Select}
                    placeholder="Select EducationLevel"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "EducationLevel is required" })
                    ]}
                  >
                    {this.state.educationOptions.map(data => (
                      <Option key={data.value} value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Father Name<span style={{ color: "red" }}>*</span></span>}
                    name="FatherName"
                    component={TextBox}
                    placeholder="Enter Father Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "FatherName is required" }),
                      A8V.text({ errorMsg: "" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Mother Maiden Name"}
                    name="MotherMaidenName"
                    component={TextBox}
                    placeholder="Enter Mother Maiden Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"

                  />
                </div>
                {this.props.formValues.MaritalStatus &&
                  this.props.formValues.MaritalStatus.value === "Married" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Spouse Name<span style={{ color: "red" }}>*</span></span>}
                        name="SpouseName"
                        component={TextBox}
                        placeholder="Enter Spouse Name"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "SpouseName is required" }),
                          A8V.text({ errorMsg: "" })
                        ]}
                      />
                    </div>
                  )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is Applicant a MicroBanking customer?<span style={{ color: "red" }}>*</span></span>}
                    name="ApplicantMBCustomer"
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
                {this.props.formValues.ApplicantMBCustomer &&
                  this.props.formValues.ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Sangam Name"}
                        name="SangamName"
                        component={TextBox}
                        placeholder="Enter SangamName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  )}
                {this.props.formValues.ApplicantMBCustomer &&
                  this.props.formValues.ApplicantMBCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Microbanking Branch Name"}
                        name="MBBranchName"
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
            this.props.formValues.BorrowerMobile &&
            this.props.formValues.BorrowerMobile.value && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="OTP Verification"
                  sectionKey="applicantOtpVerification"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label="Mobile number"
                        name="BorrowerMobile"
                        component={TextButtonGroup}
                        placeholder="Enter 10-digit Mobile Number"
                        maxlength="10"
                        disabled={true}
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: "Mobile number is required"
                          }),
                        ]}
                        buttonLabel={this.state.buttonLabel}
                        isButtonLoading={this.state.loading}
                        showSuccesIcon={this.state.showSuccess}
                        showFailureIcon={this.state.showFailure}
                        onButtonClick={() => {
                          this.state.buttonLabel === "SEND OTP"
                            ? this.handleSendApi()
                            : this.handleResendApi();
                        }}
                      />
                    </div>
                    {this.props.formValues && this.props.formValues.OTP_Status && (
                      <div className="form-group ">
                        <Otp
                          numInputs={4}
                          submitLabel={"submit"}
                          disableSubmit={this.state.OTP_submit}
                          mobileNumber={
                            this.props.formValues.mobileNumber
                              ? this.props.formValues.mobileNumber.value
                              : null
                          }
                          value={this.props.formValues.OTP_Value && this.props.formValues.OTP_Value.value}
                          handleOtpNumber={this.handleOtpNumber}
                          otpOnchange={this.onchangeOtp}
                          className=""
                        />
                      </div>
                    )}
                    <Field
                      hidden={true}
                      name="hiddenOTPStatus"
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
              sectionLabel="Applicant Address Information"
              sectionKey="applicantAddressInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                    name="HouseName"
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
                    name="StreetArea"
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
                    name="City"
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
                    name="Pincode"
                    component={TextBox}
                    placeholder="Enter Pincode"
                    normalize={proceedNumber}
                    onChange={this.handlePincode}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Pincode is required" }),
                      A8V.minLength({ errorMsg: "", min: 6 }),
                      A8V.maxLength({ errorMsg: "", max: 6 })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                    name="PostOffice"
                    component={Select}
                    placeholder="Select  PostOffice"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "PostOffice is required" })
                    ]}
                  >
                    {this.state.postOfficeOptions.map(data => (
                      <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>District<span style={{ color: "red" }}>*</span></span>}
                    name="District"
                    component={Select}
                    placeholder="Select District"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "District is required" })
                    ]}
                  >
                    {this.state.districtOptions.map(data => (
                      <Option key={data.district} value={data.district}>{data.district}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>State<span style={{ color: "red" }}>*</span></span>}
                    name="State"
                    component={Select}
                    placeholder="Select State"
                    className="a8Select"
                    validate={[A8V.required({ errorMsg: "State is required" })]}
                  >
                    {this.state.stateOptions.map(data => (
                      <Option key={data.id} value={data.state_name}>{data.state_name}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Is present address same as Aadhaar address?<span style={{ color: "red" }}>*</span></span>}
                    name="PresentAddressAadhaarSame"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.PresentAddressAadhaarSame}
                    validate={[A8V.required({ errorMsg: "PresentAddressAadhaarSame is required" })]}
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Field>
                </div>
                {this.state.showPresentAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Address Proof Type<span style={{ color: "red" }}>*</span></span>}
                        name="permanentAddressType"
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
                        name="permanentAddressNumber"
                        component={TextBox}
                        placeholder="Enter Address ProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="permanentHouseName"
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
                        name="permanentStreetArea"
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
                        name="permanentCity"
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
                        name="permanentPincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxLength={6}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" }),
                          A8V.minLength({ errorMsg: "", min: 6 }),
                          A8V.maxLength({ errorMsg: "", max: 6 })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"Post Office"}
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="permanentPostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                      >
                        {this.state.postOfficeOptions.map(data => (
                          <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={"District"}
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="permanentDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.districtOptions.map(data => (
                          <Option key={data.district} value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="State"
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="permanentState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.stateOptions.map(data => (
                          <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="permanentLandMark"
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
                        // label={<span>Years in PresentAddress<span style={{ color: "red" }}>*</span></span>}
                        name="YearsPresentAddress"
                        component={Select}
                        placeholder="Select YearsPresentAddress"
                        className="a8Select"
                      // validate={[
                      //   A8V.required({
                      //     errorMsg: "YearsPresentAddress is required"
                      //   })
                      // ]}
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
                    label={<span>Is correspondence address same as Permanent address<span style={{ color: "red" }}>*</span></span>}
                    name="permanentCorrespondenceAddressSame"
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
                {this.state.showCorrespondenceAddressFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label={" Address Proof Type"}
                        label={<span>Address Proof Type<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceAddressProofType"
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
                        // label={"Address ProofNumber"}
                        label={<span>Address ProofNumber<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceAddressProofNumber"
                        component={TextBox}
                        placeholder="Enter AddressProofNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>House No/Name<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceHouseName"
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
                        name="CorrespondenceStreetArea"
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
                        label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceCity"
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
                        name="CorrespondencePincode"
                        component={TextBox}
                        placeholder="Enter Pincode"
                        normalize={proceedNumber}
                        onChange={this.handlePincode}
                        maxlength="6"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "Pincode is required" }),
                          A8V.minLength({ errorMsg: "", min: 6 }),
                          A8V.maxLength({ errorMsg: "", max: 6 })
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondencePostOffice"
                        component={Select}
                        placeholder="Enter PostOffice"
                        className="a8Select"
                      >
                        {this.state.postOfficeOptions.map(data => (
                          <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>District<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceDistrict"
                        component={Select}
                        placeholder="Select District"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "District is required" })
                        ]}
                      >
                        {this.state.districtOptions.map(data => (
                          <Option key={data.district} value={data.district}>{data.district}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>State<span style={{ color: "red" }}>*</span></span>}
                        name="CorrespondenceState"
                        component={Select}
                        placeholder="Select State"
                        className="a8Select"
                        validate={[A8V.required({ errorMsg: "State is required" })]}
                      >
                        {this.state.stateOptions.map(data => (
                          <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
                        ))}
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"LandMark"}
                        name="CorrespondenceLandMark"
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
              sectionLabel="Applicant Employment Information"
              sectionKey="applicantEmpInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Occupation Type<span style={{ color: "red" }}>*</span></span>}
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
                        label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                        name="TypeofJob"
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
                        name="CurrentJobExperience"
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
                        name={"MonthlyGrossSalary"}
                        component={TextBox}
                        placeholder="Enter Monthly Gross"
                        normalize={inrFormat}
                        hasFeedback
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
                        name="MonthlyFixedObligation"
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
                        name="GrossAnnualIncome"
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
                        name="NetAnnualIncome"
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
                            label={<span>Office Name<span style={{ color: "red" }}>*</span></span>}
                            name="salariedOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Office name is required" }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address "
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Office Address is required" }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedStreetArea"
                            component={TextBox}
                            placeholder="Enter Street/Area"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Street is required" }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "City is required" }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedPincode"
                            component={TextBox}
                            placeholder="Enter Pincode"
                            normalize={proceedNumber}
                            onChange={this.handlePincode}
                            maxlength="6"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Pincode is required" }),
                              A8V.minLength({ errorMsg: "", min: 6 }),
                              A8V.maxLength({ errorMsg: "", max: 6 })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.postOfficeOptions.map(data => (
                              <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.districtOptions.map(data => (
                              <Option key={data.district} value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="SalariedState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.stateOptions.map(data => (
                              <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
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
                {this.state.showBusinessFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Business<span style={{ color: "red" }}>*</span></span>}
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
                        label={<span>Business Name<span style={{ color: "red" }}>*</span></span>}
                        name="BusinessName"
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
                        label={<span>Business Structure<span style={{ color: "red" }}>*</span></span>}
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
                        label={<span>Business model<span style={{ color: "red" }}>*</span></span>}
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
                        label={<span>When was the business started<span style={{ color: "red" }}>*</span></span>}
                        name="BusinessStartDate"
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
                        name="BusinessAge"
                        component={TextBox}
                        placeholder="Enter Business Age"
                        type="text"
                        hasFeedback
                        className="form-control-custom"
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Number of employees<span style={{ color: "red" }}>*</span></span>}
                        name="EmployeeCount"
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
                        name="CurrentBusinessExperience"
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
                        name="AnnualTurnover"
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
                        name="MonthlyBusinessGross"
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
                        name="MonthlyBusinessObligation"
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
                        name="BusinessGrossAnnual"
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
                        name="BusinessNetAnnual"
                        component={TextBox}
                        placeholder="Enter Net Income"
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
                            name="businessOfficeName"
                            component={TextBox}
                            placeholder="Enter Office Name"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[A8V.required({ errorMsg: "businessOfficeName is required" })]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Office Address<span style={{ color: "red" }}>*</span></span>}
                            name="businessOfficeNo"
                            component={TextBox}
                            placeholder="Enter Office Address "
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[A8V.required({ errorMsg: "businessOfficeNo is required" })]}

                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                            name="businessStreetArea"
                            component={TextBox}
                            placeholder="Enter Street/Area"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[A8V.required({ errorMsg: "businessStreetArea is required" })]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                            name="businessCity"
                            component={TextBox}
                            placeholder="Enter City"
                            type="text"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[A8V.required({ errorMsg: "businessCity is required" })]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                            name="businessPincode"
                            component={TextBox}
                            placeholder="Enter Pincode"
                            normalize={proceedNumber}
                            onChange={this.handlePincode}
                            maxlength="6"
                            hasFeedback
                            className="form-control-coustom"
                            validate={[
                              A8V.required({ errorMsg: "Pincode is required" }),
                              A8V.minLength({ errorMsg: "", min: 6 }),
                              A8V.maxLength({ errorMsg: "", max: 6 })
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                            name="businessPostOffice"
                            component={Select}
                            placeholder="Select  PostOffice"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "PostOffice is required" })
                            ]}
                          >
                            {this.state.postOfficeOptions.map(data => (
                              <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>District<span style={{ color: "red" }}>*</span></span>}
                            name="businessDistrict"
                            component={Select}
                            placeholder="Select District"
                            className="a8Select"
                            validate={[
                              A8V.required({ errorMsg: "District is required" })
                            ]}
                          >
                            {this.state.districtOptions.map(data => (
                              <Option key={data.district} value={data.district}>{data.district}</Option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>State<span style={{ color: "red" }}>*</span></span>}
                            name="businessState"
                            component={Select}
                            placeholder="Select State"
                            className="a8Select"
                            validate={[A8V.required({ errorMsg: "State is required" })]}
                          >
                            {this.state.stateOptions.map(data => (
                              <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
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
                {this.state.showOthersFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Type of Job<span style={{ color: "red" }}>*</span></span>}
                        name="JobType"
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
                    {this.state.showJobTypeFields && (
                      <React.Fragment >
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Total Years of Experience in Current job<span style={{ color: "red" }}>*</span></span>}
                            name="ExperienceCurrentJob"
                            component={Select}
                            placeholder="Select Experience in Current job"
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
                            name="DailyIncome"
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
                            name="WorkingDayCount"
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
                            name="GrossMonthlyIncome"
                            component={TextBox}
                            placeholder="Enter Monthly Gross"
                            normalize={inrFormat}
                            hasFeedback
                            className="form-control-custom"
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={<span>Monthly Fixed Obligation<span style={{ color: "red" }}>*</span></span>}
                            name="FixedObligation"
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
                            name="OthersGrossAnnualSalary"
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
                            name="AnnualIncome"
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
                                name="othrOfficeName"
                                component={TextBox}
                                placeholder="Enter Office Name"
                                type="text"
                                hasFeedback
                                className="form-control-coustom"
                                validate={[A8V.required({ errorMsg: "officeName is required" })]}
                              />
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>Office Address<span style={{ color: "red" }}>*</span></span>}
                                name="othrOfficeNo"
                                component={TextBox}
                                placeholder="Enter Office Address "
                                type="text"
                                hasFeedback
                                className="form-control-coustom"
                                validate={[A8V.required({ errorMsg: "office Address is required" })]}
                              />
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>Street/Area<span style={{ color: "red" }}>*</span></span>}
                                name="othrStreetArea"
                                component={TextBox}
                                placeholder="Enter Street/Area"
                                type="text"
                                hasFeedback
                                className="form-control-coustom"
                                validate={[A8V.required({ errorMsg: "Street is required" })]}
                              />
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>City/Village/Town<span style={{ color: "red" }}>*</span></span>}
                                name="othrCity"
                                component={TextBox}
                                placeholder="Enter City"
                                type="text"
                                hasFeedback
                                className="form-control-coustom"
                                validate={[A8V.required({ errorMsg: "City is required" })]}
                              />
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                                name="othrPincode"
                                component={TextBox}
                                placeholder="Enter Pincode"
                                normalize={proceedNumber}
                                onChange={this.handlePincode}
                                maxlength="6"
                                hasFeedback
                                className="form-control-coustom"
                                validate={[
                                  A8V.required({ errorMsg: "Pincode is required" }),
                                  A8V.minLength({ errorMsg: "", min: 6 }),
                                  A8V.maxLength({ errorMsg: "", max: 6 })
                                ]}
                              />
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>Post Office<span style={{ color: "red" }}>*</span></span>}
                                name="othrPostOffice"
                                component={Select}
                                placeholder="Select  PostOffice"
                                className="a8Select"
                                validate={[
                                  A8V.required({ errorMsg: "PostOffice is required" })
                                ]}
                              >
                                {this.state.postOfficeOptions.map(data => (
                                  <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                                ))}
                              </Field>
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>District<span style={{ color: "red" }}>*</span></span>}
                                name="othrDistrict"
                                component={Select}
                                placeholder="Select District"
                                className="a8Select"
                                validate={[
                                  A8V.required({ errorMsg: "District is required" })
                                ]}
                              >
                                {this.state.districtOptions.map(data => (
                                  <Option key={data.district} value={data.district}>{data.district}</Option>
                                ))}
                              </Field>
                            </div>
                            <div className="form-group col-xs-6 col-md-4">
                              <Field
                                label={<span>State<span style={{ color: "red" }}>*</span></span>}
                                name="othrState"
                                component={Select}
                                placeholder="Select State"
                                className="a8Select"
                                validate={[A8V.required({ errorMsg: "State is required" })]}
                              >
                                {this.state.stateOptions.map(data => (
                                  <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
                                ))}
                              </Field>
                            </div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
                <div className="form-group ">
                  <div>
                    <label>
                      <strong style={{ marginLeft: "10px" }}>

                        <span>Address to be Verified<span style={{ color: "red" }}>*</span></span>
                      </strong>
                    </label>
                    <Checkbox.Group style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox" options={addressOptions} defaultValue={this.props.formValues.Addr_selectedValue ? JSON.parse(this.props.formValues.Addr_selectedValue.value) : ""} onChange={this.handleAddressVerification} validate={[A8V.required({ errorMsg: "VerifyAddress is required" })]} />
                  </div>
                  <Field
                    hidden={true}
                    name="VerifyAddress"
                    component={TextBox}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "VerifyAddress is required" })
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {this.renderMembers()}
          {(!this.props.formValues.JobType ||
            (this.props.formValues.JobType &&
              this.props.formValues.JobType.value !== "HomeMaker" &&
              this.props.formValues.JobType.value !== "Student")) &&
            <div className="form-section">
              <div className={classname("form-section-head clearfix", { on: false })}>
                <h3>{"FOIR Calculation"}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  {this.state.showFoirProgress && (
                    <div style={{ width: "100%" }}>
                      {this.state.foirValue > 60 &&
                        <React.Fragment>
                          {
                            this.props.formValues &&
                            this.props.formValues.FoirValue &&
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
                                <p>{this.props.formValues.FoirValue.value}/100</p>
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
                      {this.state.foirValue <= 60 &&
                        <React.Fragment>
                          {this.props.formValues &&
                            this.props.formValues.FoirValue &&
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
                                <p>{this.props.formValues.FoirValue.value}/100</p>
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
                              loading={this.state.HighMarkScoreloading}
                            >
                              Generate CRIF Details
                        </Button>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  )}

                  {this.state.errorMessage && (
                    <p style={{ color: "red" }}>{this.state.errMsg}</p>
                  )}
                  {this.state.showFoirButton && (
                    <div className="form-group col-xs-6 col-md-4" style={{ textAlign: "justify  " }}>
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
                    </div>
                  )}
                </div>
              </div>
            </div>}
          {this.props.formValues.JobType &&
            (this.props.formValues.JobType.value === "HomeMaker" ||
              this.props.formValues.JobType.value === "Student") &&
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
                      loading={this.state.HighMarkScoreloading}
                    > Generate CRIF Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }


          {this.state.getHighMarkDone && (
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
              sectionLabel="Applicant Basic Evaluation"
              sectionKey="applicantBasicEval"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Amount<span style={{ color: "red" }}>*</span></span>}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    normalize={proceedNumber}
                    hasFeedback
                    disabled={true}
                    className="form-control-custom"
                    // onChange={this.handleProcessingFee}
                    validate={[
                      A8V.required({ errorMsg: "LoanAmount is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Scheme<span style={{ color: "red" }}>*</span></span>}
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Selected Loan Scheme"
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "LoanScheme is required" })
                    ]}
                  ></Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Rate Of Interest (in Percentage)<span style={{ color: "red" }}>*</span></span>}
                    name="ROI"
                    component={TextBox}
                    disabled={true}
                    placeholder="Rate of Interest"
                    className="form=control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "ROI is required"
                      })
                    ]}
                  >
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Expected Tenure<span style={{ color: "red" }}>*</span></span>}
                    name="ExpectedTenure"
                    component={TextDropdownGroup}
                    placeholder="Enter Tenure"
                    onChange={this.handleExpectedTenure}
                    className="form-control-custom"
                    dropdownValues={["M"]}
                    defaultSelectedValue={this.props.formValues.tenureSelect ? this.props.formValues.tenureSelect.value : "M"}
                    fieldPopulator={this.props.fieldPopulator}
                    InputValue={this.props.formValues.tenureInput && this.props.formValues.tenureInput.value}
                    validate={[
                      A8V.required({ errorMsg: "ExpectedTenure is required" }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Estimated EMI<span style={{ color: "red" }}>*</span></span>}
                    name="EstimatedEMI"
                    component={TextBox}
                    placeholder="Enter EMI"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: "EstimatedEMI is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span> Processing Fee<span style={{ color: "red" }}>*</span></span>}
                    name="ProcessingFee"
                    component={TextBox}
                    placeholder="Enter Processing Fee"
                    disabled="true"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Choose Insured Life Coverage On<span style={{ color: "red" }}>*</span></span>}
                    name="InsuredLife"
                    buttonStyle="outline"
                    component={RadioWrapper}
                    onChange={this.handleCreditShield}
                    validate={[
                      A8V.required({ errorMsg: "InsuredLife is required" })
                    ]}
                  >
                    <Radio value="Applicant">Applicant</Radio>
                    <Radio value="Co-Applicant_1">Co-Applicant_1</Radio>
                    <Radio value="Co-Applicant_2">Co-Applicant_2</Radio>
                  </Field>
                </div>

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Repayment Frequency"
                    name="RepaymentFrequency"
                    component={Select}
                    placeholder="Choose Repayment Frequency"
                    className="a8Select"
                  >
                    <Option value="Monthly"> Monthly</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Sales Officer Comments"}
                    name="SalesOfficerComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                </div>

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
                    label={<span>Is Applicant banking with ESAF?<span style={{ color: "red" }}>*</span></span>}
                    name="ESAFCustomer"
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
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Branch Name<span style={{ color: "red" }}>*</span></span>}
                        name="BranchName"
                        component={TextBox}
                        placeholder="Enter BranchName"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "BranchName is required" })
                        ]}
                      />
                    </div>
                  )}
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Number<span style={{ color: "red" }}>*</span></span>}
                        name="AccountNumber"
                        component={TextBox}
                        placeholder="Enter AccountNumber"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "AccountNumber is required" })
                        ]}
                      />
                    </div>
                  )}
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>Account Type<span style={{ color: "red" }}>*</span></span>}
                        name="AccountType"
                        component={Select}
                        placeholder="Select AccountType"
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "AccountType is required" })
                        ]}
                      >
                        <Option value="Savings">Savings</Option>
                        <Option value="Current">Current</Option>
                      </Field>
                    </div>
                  )}
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={<span>IFSCCode<span style={{ color: "red" }}>*</span></span>}
                        name="IFSCCode"
                        component={TextBox}
                        placeholder="Enter IFSCCode(CASE-SENSITIVE)"
                        onChange={this.handleIFSCcode}
                        maxlength="11"
                        type="text"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: "IFSCCode is required" })
                        ]}
                      />
                    </div>
                  )}
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" && (
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Banking Since"
                        name="BankingHistory"
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
                      label={<span>Reference Name<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceName_1"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_1 is required"
                        }),
                        A8V.text({ errorMsg: "" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // label={"Reference Address"}
                      label={<span>Reference Address<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceAddress_1"
                      component={TextBox}
                      placeholder="Enter ReferenceAddress"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_1 is required"
                        }),
                        A8V.address({ errorMsg: "" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // label={"Reference Mobile"}
                      label={<span>Reference Mobile<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceMobile_1"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      maxlength="10"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceMobile_1 is required"
                        }),
                        A8V.minLength({ errorMsg: "", min: 10 }),
                        A8V.maxLength({ errorMsg: "", max: 10 }),
                        A8V.uniqueMobileNumber({
                          errorMsg: "Mobile number should be unique", mobile:
                            [
                              this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                              this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                              // this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
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
                      label="Reference Type"
                      name="ReferenceType_1"
                      component={Select}
                      placeholder="Select ReferenceType"
                      className="a8Select"
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
                      // label={"Reference Name"}
                      label={<span>Reference Name<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceName_2"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_2 is required"
                        }),
                        A8V.text({ errorMsg: "" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // label={"Reference Address"}
                      label={<span>Reference Address<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceAddress_2"
                      component={TextBox}
                      placeholder="Enter ReferenceAddress"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceName_2 is required"
                        }),
                        A8V.address({ errorMsg: "" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      // label={"Reference Mobile"}
                      label={<span>Reference Mobile<span style={{ color: "red" }}>*</span></span>}
                      name="ReferenceMobile_2"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      normalize={proceedNumber}
                      maxlength="10"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "ReferenceMobile_2 is required"
                        }),
                        A8V.minLength({ errorMsg: "", min: 10 }),
                        A8V.maxLength({ errorMsg: "", max: 10 }),
                        A8V.uniqueMobileNumber({
                          errorMsg: "Mobile number should be unique", mobile:
                            [
                              this.props.formValues.BorrowerMobile ? this.props.formValues.BorrowerMobile.value : '',
                              this.props.formValues.AlternateMobile ? this.props.formValues.AlternateMobile.value : '',
                              this.props.formValues.ReferenceMobile_1 ? this.props.formValues.ReferenceMobile_1.value : '',
                              // this.props.formValues.ReferenceMobile_2 ? this.props.formValues.ReferenceMobile_2.value : '',
                              this.props.formValues.c1mobileNumber ? this.props.formValues.c1mobileNumber.value : '',
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
                      label="Reference Type"
                      name="ReferenceType_2"
                      component={Select}
                      placeholder="Select ReferenceType"
                      className="a8Select"
                    >
                      <Option value="General">General</Option>
                      <Option value="Business">Business</Option>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Loan Request Details"
              sectionKey="loanRequestDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Amount<span style={{ color: "red" }}>*</span></span>}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "LoanAmount is required"
                      }),

                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Scheme<span style={{ color: "red" }}>*</span></span>}
                    name="LoanPurpose"
                    component={TextBox}
                    type="text"
                    placeholder="Selected Loan Scheme"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "LoanScheme is required" })
                    ]}
                  >
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Purpose Category<span style={{ color: "red" }}>*</span></span>}
                    name="LoanSubType"
                    component={TextBox}
                    placeholder="Select Loan Purpose"
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "LoanPurposeCategory is required"
                      })
                    ]}
                  >
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Rate Of Interest (in Percentage)<span style={{ color: "red" }}>*</span></span>}
                    name="ROI"
                    component={TextBox}
                    placeholder="Rate of Interest"
                    disabled={true}
                    className="form=control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "ROI is required"
                      })
                    ]}
                  >
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Detailed Loan Purpose"}
                    name="DetailedLoanPurpose"
                    component={TextBox}
                    placeholder="Enter Loan Purpose"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Expected Loan Tenure <span style={{ color: "red" }}>*</span></span>}
                    name="ExpectedTenure"
                    component={TextBox}
                    placeholder="Enter Loan Tenure"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Expected Loan Tenure is required" }),
                      A8V.minValue({ errorMsg: "", min: 12 }),
                      A8V.maxValue({ errorMsg: "", max: 60 })
                    ]}
                  />
                </div>
                {((this.props.formValues && this.props.formValues.requestLoanScheme) && (this.props.formValues.requestLoanScheme.value !== "Two Wheeler Loan" || this.props.formValues.requestLoanScheme.value !== "Three Wheeler Loan")) &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Security Type"
                      name="SecurityType"
                      component={Select}
                      placeholder="Select Security Type"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "SecurityType is required" }),
                      ]}
                    >
                      <Option value="Land">Land</Option>
                      <Option value="Building">Building</Option>
                      <Option value="Land and Building">Land and Building</Option>
                    </Field>
                  </div>}
                {this.props.formValues.ESAFCustomer &&
                  this.props.formValues.ESAFCustomer.value === "Yes" &&
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Repayment Day/Sangam Day"
                      name="RepaymentDay"
                      component={Select}
                      placeholder="Select Repayment Day"
                      className="a8Select"
                    >
                      <Option value="Monday">Monday</Option>
                      <Option value="Tuesday">Tuesday</Option>
                      <Option value="Wednesday">Wednesday</Option>
                      <Option value="Thursday">Thursday</Option>
                      <Option value="Friday">Friday</Option>
                    </Field>
                  </div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Vehicle Information"
              sectionKey="loanEligibilityDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>Loan Type<span style={{ color: "red" }}>*</span></span>}
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Selected LoanType"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "LoanType is required" })
                    ]}
                  >
                  </Field>
                </div>

                {/*Business Loan */}
                {this.props.formValues &&
                  this.props.formValues.LoanPurpose &&
                  this.props.formValues.LoanPurpose.value ===
                  "Business Loan" && (
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
                          label="Ownership"
                          name="Ownership"
                          component={Select}
                          placeholder="Select Ownership"
                          className="a8Select"
                          validate={[
                            A8V.required({ errorMsg: "Ownership is required" })
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
                          label="Relationship Business"
                          name="RelationshipBusiness"
                          component={Select}
                          placeholder="Select RelationshipBusiness"
                          className="a8Select"
                          validate={[
                            A8V.required({
                              errorMsg: "RelationshipBusiness is required"
                            })
                          ]}
                        >
                          <Option value="Director">Director</Option>
                          <Option value="Partner">Partner</Option>
                          <Option value="Proprietor">Proprietor</Option>
                          <Option value="Others">Others</Option>
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Proof Type/Business Registration type"
                          name="ProofType"
                          component={Select}
                          placeholder="Select ProofType"
                          className="a8Select"
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
                      {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Others"}
                      name="Others"
                      component={TextBox}
                      placeholder="Enter Others"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>  */}
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Type of Business Address"
                          name="BusinessAddressType"
                          component={Select}
                          placeholder="Select BusinessAddressType"
                          className="a8Select"
                        >
                          <Option value="Registered Address">
                            Registered Address
                          </Option>
                          <Option value="Corporate Address">
                            Corporate Address
                          </Option>
                          <Option value="Current Address">
                            Current Address
                          </Option>
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Business Location"
                          name="BusinessLocation"
                          component={Select}
                          placeholder="Select BusinessLocation"
                          className="a8Select"
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
                          label="Property Value Appreciation"
                          name="PropertyValueAppreciation"
                          component={Select}
                          placeholder="Select PropertyValueAppreciation"
                          className="a8Select"
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
                          <Option value="BSNL Land Line Bill (Not older than 3 Months)">
                            BSNL Land Line Bill (Not older than 3 Months)
                          </Option>
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Address ProofNumber"}
                          name="AddressProofNumber"
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
                          name="busHouseName"
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
                          component={Select}
                          placeholder="Select  PostOffice"
                          className="a8Select"
                          validate={[
                            A8V.required({ errorMsg: "PostOffice is required" })
                          ]}
                        >
                          {this.state.postOfficeOptions.map(data => (
                            <Option key={data.office_name} value={data.office_name}>{data.office_name}</Option>
                          ))}
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"District"}
                          name="busDistrict"
                          component={Select}
                          placeholder="Select District"
                          className="a8Select"
                          validate={[
                            A8V.required({ errorMsg: "District is required" })
                          ]}
                        >
                          {this.state.districtOptions.map(data => (
                            <Option key={data.district} value={data.district}>{data.district}</Option>
                          ))}
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="State"
                          name="busState"
                          component={Select}
                          placeholder="Select State"
                          className="a8Select"
                          validate={[A8V.required({ errorMsg: "State is required" })]}
                        >
                          {this.state.stateOptions.map(data => (
                            <Option key={data.state_name} value={data.state_name}>{data.state_name}</Option>
                          ))}
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          // label={"Pincode"}
                          label={<span>Pincode<span style={{ color: "red" }}>*</span></span>}
                          name="busPincode"
                          component={TextBox}
                          placeholder="Enter Pincode"
                          normalize={proceedNumber}
                          onChange={this.handlePincode}
                          maxlength="6"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "Pincode is required" }),
                            A8V.minLength({ errorMsg: "", min: 6 }),
                            A8V.maxLength({ errorMsg: "", max: 6 })
                          ]}
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
                          name="busPresentAddressYears"
                          component={Select}
                          placeholder="Select PresentAddressYears"
                          className="a8Select"
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
                          maxlength="10"
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
                {((this.props.formValues &&
                  this.props.formValues.LoanPurpose &&
                  this.props.formValues.LoanPurpose.value ===
                  "Loan Against Property") ||
                  (this.props.formValues &&
                    this.props.formValues.LoanPurpose &&
                    this.props.formValues.LoanPurpose.value ===
                    "Micro Housing Loan") ||
                  (this.props.formValues &&
                    this.props.formValues.LoanPurpose &&
                    this.props.formValues.LoanPurpose.Value ===
                    "Dream House Loan") ||
                  (this.props.formValues &&
                    this.props.formValues.LoanPurpose &&
                    this.props.formValues.LoanPurpose.value ===
                    "Affordable Housing Loan")) && (
                    <React.Fragment>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Property Details"}
                          name="PropertyDetails"
                          component={TextBox}
                          placeholder="Enter PropertyDetails"
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
                          placeholder="Select RoadAccess"
                          className="a8Select"
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
                {((this.props.formValues &&
                  this.props.formValues.LoanPurpose &&
                  this.props.formValues.LoanPurpose.value ===
                  "Two Wheeler Loan") ||
                  (this.props.formValues &&
                    this.props.formValues.LoanPurpose &&
                    this.props.formValues.LoanPurpose.value ===
                    "Three Wheeler Loan")) && (
                    <React.Fragment>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Vehicle Type<span style={{ color: "red" }}>*</span></span>}
                          name="VehicleType"
                          component={Select}
                          placeholder="Select VehicleType"
                          className="a8Select"
                          validate={[
                            A8V.required({
                              errorMsg: "Vehicle Type is required"
                            })
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
                          label={<span>Manufacturer<span style={{ color: "red" }}>*</span></span>}
                          name="Manufacturer"
                          component={TextBox}
                          placeholder="Enter Manufacturer"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "Manufacturer is required"
                            })
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Asset Model<span style={{ color: "red" }}>*</span></span>}
                          name="AssetModel"
                          component={TextBox}
                          placeholder="Enter AssetModel"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "AssetModel is required"
                            })
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Asset Make<span style={{ color: "red" }}>*</span></span>}
                          name="AssetMake"
                          component={TextBox}
                          placeholder="Enter AssetMake"
                          type="text"
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "AssetMake is required"
                            })
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Ex-Showroom Price<span style={{ color: "red" }}>*</span></span>}
                          name="ExShowroomPrice"
                          component={TextBox}
                          placeholder="Enter ExShowroomPrice"
                          onChange={this.handleShowRoomPrice}
                          normalize={inrFormat}
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "ExShowroomPrice is required"
                            })
                          ]}

                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Road Tax<span style={{ color: "red" }}>*</span></span>}
                          name="RoadTax"
                          component={TextBox}
                          placeholder="Enter RoadTax"
                          onChange={this.handleRoadTax}
                          normalize={inrFormat}
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "RoadTax is required"
                            })
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Insurance Amount<span style={{ color: "red" }}>*</span></span>}
                          name="InsuranceAmount"
                          component={TextBox}
                          placeholder="Enter InsuranceAmount"
                          normalize={inrFormat}
                          onChange={this.handleInsuranceAmount}
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: "InsuranceAmount is required"
                            })
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={"Other Costs"}
                          name="OtherCosts"
                          component={TextBox}
                          placeholder="Enter Others"
                          normalize={inrFormat}
                          type="text"
                          onChange={this.handleOnRoadPrice}
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
                          label={<span>Margin Amount<span style={{ color: "red" }}>*</span></span>}
                          name="MarginAmount"
                          component={TextBox}
                          placeholder="Enter Margin"
                          maxLength={6}
                          hasFeedback
                          onChange={this.handleMarginInWord}
                          className="form-control-coustom"
                          validate={[
                            A8V.required({ errorMsg: "margin is required" }),
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Registered To"
                          name="RegisteredTo"
                          component={Select}
                          placeholder="Select AssetOwner"
                          className="a8Select"
                        >
                          <Option value="Applicant">Applicant</Option>
                          <Option value="Co-Applicant_1">Co-Applicant_1</Option>
                          <Option value="Co-Applicant_2">Co-Applicant_2</Option>
                          <Option value="Co-Applicant_3">Co-Applicant_3</Option>
                          <Option value="Co-Applicant_4">Co-Applicant_4</Option>
                        </Field>
                      </div>

                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span> Dealer Name<span style={{ color: "red" }}>*</span></span>}
                          name="DealerName"
                          component={Select}
                          placeholder="Enter Dealer Name"
                          className="a8Select"
                          onChange={this.handleDealer}
                          showSearch
                          validate={[
                            A8V.required({ errorMsg: "Dealer Name is required" })
                          ]}
                        >
                          {this.state.DealerNameOptions.map(data => (
                            <Option key={data.value} value={data.value}>{data.label}</Option>
                          ))}
                        </Field>
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Dealer Location<span style={{ color: "red" }}>*</span></span>}
                          name="dealerLocation"
                          component={TextBox}
                          disabled="true"
                          placeholder="Enter Dealer Location"
                          hasFeedback
                          className="form-control-coustom"

                        />
                      </div>

                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={<span>Dealer Account No<span style={{ color: "red" }}>*</span></span>}
                          name="BankAccNo"
                          component={TextBox}
                          disabled="true"
                          placeholder="Enter Dealer Location"
                          hasFeedback
                          className="form-control-coustom"
                        />
                      </div>
                    </React.Fragment>
                  )}

                {/* {ESAF Haritha Loan} */}

                {((this.props.formValues &&
                  this.props.formValues.LoanType &&
                  this.props.formValues.LoanPurpose.value ===
                  "ESAF Haritha Loan") ||
                  (this.props.formValues &&
                    this.props.formValues.LoanType &&
                    this.props.formValues.LoanPurpose.value ===
                    "Clean Energy Loan")) && (
                    <React.Fragment>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label="Asset Type"
                          name="AssetType"
                          component={Select}
                          placeholder="Select AssetType"
                          onChange={this.handleAssetType}
                          className="a8Select"
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

                      {this.state.showOthersComments && (
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={"Comments"}
                            name="Comments"
                            component={TextArea}
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
                      )}
                    </React.Fragment>
                  )}
              </div>
            </div>
          </div>

          {this.props.formValues &&
            this.props.formValues.LoanPurpose &&
            this.props.formValues.LoanPurpose.value === "Business Loan" && (
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
                    name="BusinessImage"
                    component={Scanner}
                    docType="IMG"
                    imageVar="Businessimage"
                    metaVar={"BusinessMeta"}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                </div>
              </div>
            )}
          {((this.props.formValues &&
            this.props.formValues.LoanPurpose &&
            this.props.formValues.LoanPurpose.value === "Housing") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value ===
              "Loan Against Property") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value ===
              "Micro Housing Loan") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value === "Dream House Loan") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value ===
              "Affordable Housing Loan")) && (
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
                    name="HousingImage"
                    component={Scanner}
                    docType="IMG"
                    imageVar="Housingimage"
                    metaVar={"HousingMeta"}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                </div>
              </div>
            )}
          {((this.props.formValues &&
            this.props.formValues.LoanPurpose &&
            this.props.formValues.LoanPurpose.value === "Two Wheeler Loan") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value ===
              "Three Wheeler Loan")) && (
              <div className="form-section">
                <div
                  className={classname("form-section-head clearfix", {
                    on: false
                  })}
                >
                  <h3>{"VEHICLE QUOTATION"}</h3>
                </div>
                <div className="form-section-content">
                  {/** File Uploader */}
                  <Field
                    label={"Image "}
                    name="VehicleImage"
                    component={Scanner}
                    docType="IMG"
                    imageVar="Vehicleimage"
                    metaVar={"VehicleimageMeta"}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                </div>
              </div>
            )}
          {((this.props.formValues &&
            this.props.formValues.LoanPurpose &&
            this.props.formValues.LoanPurpose.value === "ESAF Haritha Loan") ||
            (this.props.formValues &&
              this.props.formValues.LoanPurpose &&
              this.props.formValues.LoanPurpose.value ===
              "Clean Energy Loan")) && (
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
                    name="harithaLoanImage"
                    component={Scanner}
                    docType="IMG"
                    imageVar="harithaLoanimage"
                    metaVar={"harithaLoanMeta"}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                </div>
              </div>
            )}

          <div className="form-section">
            <FormHeadSection
              sectionLabel="SO Upload Section"
              sectionKey="SoUpload"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <Field
              label="Uploader Helper"
              name={this.state.SoUpload.fieldName}
              component={Uploader}
              multiple={true}
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              uploaderConfig={this.state.SoUpload}
              validate={[
                uploadChecker(this.state.SoUpload)
              ]}
              ipc={this.props.ipc}

            />
          </div>

          <div className="form-section">
            <div
              className={classname("form-section-head clearfix", {
                on: false
              })}
            >
              <h3>{"Co-Applicant/Guarantor Selection/Deletion"}</h3>
            </div>
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
                    <Option value="0">0</Option>
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
                    <Option value="0">0</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                  </Field>
                </div>
                <div style={{ display: "flex", marginTop: "28px" }}>
                  <Button
                    className=" api-button"
                    type="danger"
                    size="default"
                    onClick={() => this.addTabs()}
                  >
                    Add
                  </Button>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Deletion Dropdown"
                    name="deletionSelect"
                    component={Select}
                    placeholder="Select tab to delete"
                    className="a8Select"
                    onChange={value =>
                      this.setState({ deleteTab: value.value })
                    }
                  >
                    {this.state.renderTabs.currentTabInfo.tabList
                      .filter(tab => tab.name !== "tabApplicantNew")
                      .map(tabName => (
                        <Option key={tabName.label} value={tabName.label}>{tabName.label}</Option>
                      ))}
                  </Field>
                </div>
                <div style={{ display: "flex", marginTop: "28px" }}>
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={() => this.deleteTabs()}
                    disabled={validate.isEmpty(this.state.deleteTab)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("State values of Applicant New --------> ", state);
  return {
    //get current form values
    formValues: getFormValues("soProcessNew")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("soProcessNew")(state),
    // get taskInfo from formsReducer
    dynamicTabDetails: state.task.taskInfo.dynamicTabDetails
  };
};

export default connect(mapStateToProps, { updateDynamicTabInfo })(
  TabApplicantNew
);

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
