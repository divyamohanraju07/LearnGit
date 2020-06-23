import * as React from "react";
import {
  FormHeadSection,
  A8V,
  proceedNumber,
  Scorecards,
  inrFormat
  // ImageViewer
} from "../../helpers";
import {
  TextBox,
  SelectHelper,
  Select,
  DatePicker,
  RadioWrapper,
  Radio
} from "a8flow-uikit";
import { Field, getFormSyncErrors, getFormValues } from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
import { Button, Collapse, Icon, Divider } from "antd";
import ReactSpeedometer from "react-d3-speedometer";
import axios from "axios";
const { Panel } = Collapse;
const { Option } = SelectHelper;
type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
  handleStateFromTab: any;
  formValues: any;
  ipc: any;
};
type State = {
  sectionValidator: any;
  creditScorevalue: Boolean;
  CreditScoreGrade: any;
  LevelofRisk: any;
  creditscore: any;
  getCIbilDone: Boolean;
  cibilScore?: number;
  CibilScoreloading: boolean;
  // array: any;
  cibilApiData: any;
};

class TabCreditScore extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      CibilScoreloading: false,
      getCIbilDone: false,
      creditScorevalue: false,
      CreditScoreGrade: "",
      LevelofRisk: "",
      creditscore: "",
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        PersonalInformation: [
          "dob",
          "age",
          "GenderAndMaritalstatus",
          "DrivingLicense",
          "PopulationGroup",
          "EducationalQualification",
          "ResidenceType",
          "ExperienceinCurrentEmployment"
        ],
        IncomeandFinancialPosition: [
          "Monthlyincome",
          "Vehicletype",
          "MainSourceofincome",
          "Networth",
          "TotalLoans",
          "NetworthTotalLoans",
          "ProofofIncome",
          "LoanAmount",
          "LoanAmount/NetMonthlyincome",
          "Fixedoblogationtoincomeratio"
        ],
        BankingBehaviour: [
          "borrower'soperativeaccount",
          "ModeofRepayment",
          "CreditVintage",
          "ApplicantBureauScore",
          "MaxDPDinlast12months",
          "NoofmonthsDPDexceeded30daysinlast12months",
          "Co-ApplicantBureauScore",
          "CreditHistorypriorto12months"
        ],
        Security: [
          "NetworthOfco-Applicant",
          "Co-ApplicantNetWorthtoloanAmount",
          "LoantoValue"
        ],
        CreditScore: [""]
      },
      cibilApiData: {}
    };
  }
  autoPopulateforNetWorth = data => {
    if (this.props.formValues.Networth) {
      this.props.fieldPopulator("NetworthTotalLoans", {
        type: "String",
        value:
          Math.round(
            (this.props.formValues.Networth.value / data.value) * 100
          ) / 100
      });
    }
  };
  autoPopulateforLoanAmountNetMonthlyincome = data => {
    if (this.props.formValues.Monthlyincome) {
      this.props.fieldPopulator("LoanAmount/NetMonthlyincome", {
        type: "String",
        value:
          Math.round(
            (data.value / this.props.formValues.Monthlyincome.value) * 100
          ) / 100
      });
    }
  };

  getscore = (n, data) => {
    switch (n) {
      case "age":
        {
          let agescoreJson = {
            "less than 21": -10,
            "21 to 28": 3,
            "28 to 36": 6,
            "36 to 45": 10,
            "45 to 60": 8,
            "more than 60": 0
          };
          if (data < 21) {
            return agescoreJson["less than 21"];
          } else if (21 <= data && data < 28) {
            return agescoreJson["21 to 28"];
          } else if (28 <= data && data < 36) {
            return agescoreJson["28 to 36"];
          } else if (36 <= data && data < 45) {
            return agescoreJson["36 to 45"];
          } else if (45 <= data && data < 60) {
            return agescoreJson["45 to 60"];
          } else if (data >= 60) {
            return agescoreJson["more than 60"];
          }
        }
        break;
      case "GenderAndMaritalstatus": {
        let GenderAndMaritalstatus = {
          "Unmarried Female": 0,
          "Married Female": 2,
          "Unmarried Male": 4,
          "Married Male": 10,
          Others: 0
        };
        return GenderAndMaritalstatus[data];
      }
      case "DrivingLicense": {
        let DrivingLicense = {
          Yes: 10,
          No: -10
        };
        return DrivingLicense[data];
      }
      case "PopulationGroup": {
        let PopulationGroup = {
          Rural: 3,
          "Semi urban": 5,
          Urban: 7,
          Metropolitian: 10
        };
        return PopulationGroup[data];
      }
      case "EducationalQualification": {
        let EducationalQualification = {
          "Primary or less": -2,
          "Secondary school": 2,
          "Higher secondary (+1/+2)": 5,
          Diploma: 5,
          Graduate: 8,
          "Post Graduate/Professional": 10
        };
        return EducationalQualification[data];
      }
      case "ResidenceType": {
        let ResidenceType = {
          "House owned by self/Spouse": 10,
          "House owned by parents": 4,
          "Rented House/Appartment": 2
        };
        return ResidenceType[data];
      }
      case "ExperienceinCurrentEmployment": {
        let ExperienceinCurrentEmployment = {
          "No prior experience/Unskilled labour": 0,
          "Skilled labour on daily wages": 2,
          "NRI s other than professionals": 3,
          "Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.": 4,
          "Professional / salaried / Business < 5 years": 6,
          "Professional / salaried / Business 5 years to <10 years": 8,
          "Professional / salaried / Business  >=10 years": 10
        };
        return ExperienceinCurrentEmployment[data];
      }
      case "Monthlyincome": {
        let Monthlyincome = {
          "Up to Rs 25000": 10,
          "25000 - 40000": 10,
          "40000 - 65000": 10,
          "above 65000": 10
        };
        if (data < 25000) {
          return Monthlyincome["Up to Rs 25000"];
        } else if (25000 <= data && data < 40000) {
          return Monthlyincome["25000 - 40000"];
        } else if (40000 <= data && data < 65000) {
          return Monthlyincome["40000 - 65000"];
        } else if (65000 <= data) {
          return Monthlyincome["above 65000"];
        }
        break;
      }
      case "MainSourceofincome": {
        let MainSourceofincome = {
          "Salaried- govt/quasi Govt/Organized pvt sector employee/NRI Professionals": 10,
          "Salaried- Unorganized PVT sector employees": 7,
          "Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.": 6,
          "Other own businees- Manufacturing/Trade/Service": 7,
          "Skilled labourers - Carpenters,Mason,Plumbers,Electricians,Tailors, other skilled daily wage earners,Other NRIs": 5,
          "Unskilled labourers/others": 0,

          "Marginal Farmer - Land Holding < 0.50 Ha": 0,
          "Small Farmer - Land Holding >0.50 Ha to 2 Ha": 4,
          "Large Farmer- Land Holding > 2 Ha": 8,
          "Pension/Rent": 4
        };
        return MainSourceofincome[data];
      }
      case "NetworthTotalLoans": {
        let NetworthTotalLoansTimes = {
          "<=1.00": 1,
          ">1.00 to 2.00": 3,
          "> 2.00 to 3.00": 6,
          "> 3.00 to 5.00": 8,
          "> 5.00": 10
        };
        if (data <= 1.0) {
          return NetworthTotalLoansTimes["<=1.00"];
        } else if (1.0 < data && data <= 2.0) {
          return NetworthTotalLoansTimes[">1.00 to 2.00"];
        } else if (2.0 < data && data <= 3.0) {
          return NetworthTotalLoansTimes["> 2.00 to 3.00"];
        } else if (3.0 < data && data <= 5.0) {
          return NetworthTotalLoansTimes["> 3.00 to 5.00"];
        } else if (data > 5.0) {
          return NetworthTotalLoansTimes["> 5.00"];
        }
        break;
      }
      case "ProofofIncome": {
        let ProofofIncome = {
          "ITR/Form 16/Audited Financial Statement": 10,
          "Attested salary certificate supported by minimum one year bank statement": 8,
          "salary certificate and bank statement for less than one year": 6,
          "Average monthly remittance in NRE account for minimum one year": 4,
          "Income assessed on the basis of Bank statement": 2,
          "No proof of income estimated by Credit officer based on activity/asset holding": 0
        };
        return ProofofIncome[data];
      }
      case "LoanAmount/NetMonthlyincome": {
        let LoanAmountNetMonthlyincome = {
          "<=2": 10,
          ">2 to 3": 8,
          ">3 to 4": 6,
          ">4 to 5": 4,
          ">5 to 7": 2,
          ">7": 0
        };
        if (data <= 2) {
          return LoanAmountNetMonthlyincome["<=2"];
        } else if (2 < data && data <= 3) {
          return LoanAmountNetMonthlyincome[">2 to 3"];
        } else if (3 < data && data <= 4) {
          return LoanAmountNetMonthlyincome[">3 to 4"];
        } else if (4 < data && data <= 5) {
          return LoanAmountNetMonthlyincome[">4 to 5"];
        } else if (5 < data && data <= 7) {
          return LoanAmountNetMonthlyincome[">5 to 7"];
        } else if (data > 7) {
          return LoanAmountNetMonthlyincome[">7"];
        }
        break;
      }
      case "Fixedoblogationtoincomeratio": {
        let Fixedoblogationtoincomeratio = {
          "<20": 10,
          "20% to <35%": 8,
          "35% to <48%": 6,
          "48% to <55%": 4,
          "55% to <65%": 2,
          "65% and above": 0
        };
        if (data < 20) {
          return Fixedoblogationtoincomeratio["<20"];
        } else if (20 <= data && data < 35) {
          return Fixedoblogationtoincomeratio["20% to <35%"];
        } else if (35 <= data && data < 48) {
          return Fixedoblogationtoincomeratio["35% to <48%"];
        } else if (48 <= data && data < 55) {
          return Fixedoblogationtoincomeratio["48% to <55%"];
        } else if (55 <= data && data < 65) {
          return Fixedoblogationtoincomeratio["55% to <65%"];
        } else if (data >= 65) {
          return Fixedoblogationtoincomeratio["65% and above"];
        }
        break;
      }
      case "borrower'soperativeaccount": {
        let borrowersoperativeaccount = {
          "New to Banking A/C less than 12 month old": 2,
          "Up to 1000": -2,
          "Rs 1000 to Rs 3000": 4,
          "Rs 3000 to Rs 5000": 6,
          "Rs 5000 to Rs 10000": 8,
          "Rs 10000 above": 10
        };
        return borrowersoperativeaccount[data];
      }
      case "ModeofRepayment": {
        let ModeofRepayment = {
          "Check off system by employer": 10,
          "Salary A/C with ESAF bank": 8,
          "ECS Mandate from other bank Account": 4,
          "SB A/C with ESAF Bank/others": 3
        };
        return ModeofRepayment[data];
      }
      case "CreditVintage": {
        let CreditVintage = {
          "Credit record nill / up to one year": 1,
          "Applicant is sangam member for <5 years": 3,
          "Applicant is sangam member for >=5 years": 5,
          "1 year to 3 years": 3,
          "3 years to 5 years": 7,
          ">5 years": 10
        };
        return CreditVintage[data];
      }
      case "ApplicantBureauScore": {
        let ApplicantsBureauScore = {
          "-1,0": 5,
          "300 to 599": -10,
          "1 to 6 & 600 to 670": 5,
          "671 to 700": 4,
          "701 to 730": 6,
          "731 to 790": 8,
          ">790": 10
        };
        if (data === -1 || data === 0) {
          return ApplicantsBureauScore["-1,0"];
        } else if (300 <= data && data <= 599) {
          return ApplicantsBureauScore["300 to 599"];
        } else if ((600 <= data && data <= 670) || (1 <= data && data <= 6)) {
          return ApplicantsBureauScore["1 to 6 & 600 to 670"];
        } else if (671 <= data && data <= 700) {
          return ApplicantsBureauScore["671 to 700"];
        } else if (701 <= data && data <= 730) {
          return ApplicantsBureauScore["701 to 730"];
        } else if (731 <= data && data <= 790) {
          return ApplicantsBureauScore["731 to 790"];
        } else if (data > 790) {
          return ApplicantsBureauScore[">790"];
        }
        break;
      }
      case "MaxDPDinlast12months": {
        let MaxDPDinlast12months = {
          "No hit in CB report/Credit vintage up to 6M and DPD less than 30 days": 6,
          "Credit vintage >6M and DPD <10 days": 10,
          "DPD 10 days to 30 days": 6,
          "DPD 30 +": 0,
          "DPD 60 +": -10,
          "DPD 90 +": -30,
          "Settled / Written off": -35
        };
        return MaxDPDinlast12months[data];
      }
      case "NoofmonthsDPDexceeded30daysinlast12months": {
        let NoofmonthsDPDexceeded30daysinlast12months = {
          "No hit in CB report/Credit vintage up to 6M and DPD less than 30 days": 6,
          "Credit vintage >6M and DPD <30 days": 10,
          "DPD >30 days - 1 month": 0,
          "DPD >30 days - 2 to 3 months": -10,
          "DPD >30 days - 4 to 5 months": -20,
          "DPD >30 days - 6 months &above": -30
        };
        return NoofmonthsDPDexceeded30daysinlast12months[data];
      }
      case "Co-ApplicantBureauScore": {
        let CoApplicantsBureauScore = {
          "-1,0": 5,
          "300 to 599": -10,
          "1 to 6 & 600 to 670": 2,
          "671 to 700": 4,
          "701 to 730": 6,
          "731 to 790": 8,
          ">790": 10
        };
        if (data === -1 || data === 0) {
          return CoApplicantsBureauScore["-1,0"];
        } else if (300 <= data && data <= 599) {
          return CoApplicantsBureauScore["300 to 599"];
        } else if ((600 <= data && data <= 670) || (1 <= data && data <= 6)) {
          return CoApplicantsBureauScore["1 to 6 & 600 to 670"];
        } else if (671 <= data && data <= 700) {
          return CoApplicantsBureauScore["671 to 700"];
        } else if (701 <= data && data <= 730) {
          return CoApplicantsBureauScore["701 to 730"];
        } else if (731 <= data && data <= 790) {
          return CoApplicantsBureauScore["731 to 790"];
        } else if (data > 790) {
          return CoApplicantsBureauScore[">790"];
        }
        break;
      }
      case "CreditHistorypriorto12months": {
        let CreditHistorypriorto12months = {
          "No hit in CB report/No history prior to 12 months": 2,
          Satisfactory: 10,
          Substandard: 0,
          "Suit Field/Written off/Settled": -50
        };
        return CreditHistorypriorto12months[data];
      }
      case "Co-ApplicantNetWorthtoloanAmount": {
        let CoApplicantsNetWorthtoloanAmount = {
          "Up to 5/ No guarantor": 0,
          ">5 to 10": 2,
          ">10 to 20": 4,
          ">20 to 30": 6,
          ">30 to 50": 8,
          ">50": 10
        };
        if (data <= 5) {
          return CoApplicantsNetWorthtoloanAmount["Up to 5/ No guarantor"];
        } else if (5 < data && data <= 10) {
          return CoApplicantsNetWorthtoloanAmount[">5 to 10"];
        } else if (10 < data && data <= 20) {
          return CoApplicantsNetWorthtoloanAmount[">10 to 20"];
        } else if (20 < data && data <= 30) {
          return CoApplicantsNetWorthtoloanAmount[">20 to 30"];
        } else if (30 < data && data <= 50) {
          return CoApplicantsNetWorthtoloanAmount[">30 to 50"];
        } else if (data > 50) {
          return CoApplicantsNetWorthtoloanAmount[">50"];
        }
        break;
      }
      default:
        break;
    }
  };

  calculateCreditScore = () => {
    this.setState({ creditScorevalue: true });
    var formvalues = this.props.formValues;
    var creditScore = {};
    var keydata = Object.keys(formvalues);
    var valuedata = Object.values(formvalues);
    for (let i = 0; i < keydata.length; i++) {
      creditScore[keydata[i]] = valuedata[i]["value"];
    }

    var individualCreditScore = {};
    if (creditScore["age"]) {
      let getagescore = this.getscore("age", creditScore["age"]);
      individualCreditScore["age"] = (2 / 100) * getagescore;
    }
    if (creditScore["GenderAndMaritalstatus"]) {
      var getgenderscore = this.getscore(
        "GenderAndMaritalstatus",
        creditScore["GenderAndMaritalstatus"]
      );
      individualCreditScore["GenderAndMaritalstatus"] =
        (2 / 100) * getgenderscore;
    }
    if (creditScore["DrivingLicense"]) {
      var getlicencescore = this.getscore(
        "DrivingLicense",
        creditScore["DrivingLicense"]
      );
      individualCreditScore["DrivingLicense"] = (1 / 100) * getlicencescore;
    }
    if (creditScore["PopulationGroup"]) {
      var getpopulatingroupscore = this.getscore(
        "PopulationGroup",
        creditScore["PopulationGroup"]
      );
      individualCreditScore["PopulationGroup"] =
        (2 / 100) * getpopulatingroupscore;
    }
    if (creditScore["EducationalQualification"]) {
      var geteducationqualificationscore = this.getscore(
        "EducationalQualification",
        creditScore["EducationalQualification"]
      );
      individualCreditScore["EducationalQualification"] =
        (3 / 100) * geteducationqualificationscore;
    }
    if (creditScore["ResidenceType"]) {
      var getResidenceTypescore = this.getscore(
        "ResidenceType",
        creditScore["ResidenceType"]
      );
      individualCreditScore["ResidenceType"] =
        (5 / 100) * getResidenceTypescore;
    }
    if (creditScore["ExperienceinCurrentEmployment"]) {
      var getExperienceinCurrentEmploymentScore = this.getscore(
        "ExperienceinCurrentEmployment",
        creditScore["ExperienceinCurrentEmployment"]
      );
      individualCreditScore["ExperienceinCurrentEmployment"] =
        Math.round((5 / 100) * getExperienceinCurrentEmploymentScore * 100) /
        100;
    }
    if (creditScore["Monthlyincome"]) {
      var getMonthlyIncomeScore = this.getscore(
        "Monthlyincome",
        creditScore["Monthlyincome"]
      );
      individualCreditScore["Monthlyincome"] =
        (1 / 100) * getMonthlyIncomeScore;
    }
    if (creditScore["Vehicletype"]) {
      if (creditScore["Monthlyincome"] < 25000) {
        let monthlyIncomeschema = {
          "upto 70000": 5,
          "Rs.70,000 to Rs.1,20,000": 0,
          "Rs.1,20,000 to Rs.2,00,000": -5,
          "above Rs.2,00,000": -10
        };
        if (creditScore["Vehicletype"] < 70000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["upto 70000"];
        } else if (
          70000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 120000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.70,000 to Rs.1,20,000"];
        } else if (
          120000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 200000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.1,20,000 to Rs.2,00,000"];
        } else if (creditScore["Vehicletype"] >= 200000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["above Rs.2,00,000"];
        }
      } else if (
        25000 <= creditScore["Monthlyincome"] &&
        creditScore["Monthlyincome"] < 40000
      ) {
        let monthlyIncomeschema = {
          "upto 70000": 10,
          "Rs.70,000 to Rs.1,20,000": 5,
          "Rs.1,20,000 to Rs.2,00,000": 0,
          "above Rs.2,00,000": -5
        };
        if (creditScore["Vehicletype"] < 70000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["upto 70000"];
        } else if (
          70000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 120000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.70,000 to Rs.1,20,000"];
        } else if (
          120000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 200000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.1,20,000 to Rs.2,00,000"];
        } else if (creditScore["Vehicletype"] >= 200000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["above Rs.2,00,000"];
        }
      } else if (
        40000 <= creditScore["Monthlyincome"] &&
        creditScore["Monthlyincome"] < 65000
      ) {
        let monthlyIncomeschema = {
          "upto 70000": 10,
          "Rs.70,000 to Rs.1,20,000": 10,
          "Rs.1,20,000 to Rs.2,00,000": 5,
          "above Rs.2,00,000": 0
        };
        if (creditScore["Vehicletype"] < 70000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["upto 70000"];
        } else if (
          70000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 120000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.70,000 to Rs.1,20,000"];
        } else if (
          120000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 200000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.1,20,000 to Rs.2,00,000"];
        } else if (creditScore["Vehicletype"] >= 200000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["above Rs.2,00,000"];
        }
      } else if (creditScore["Monthlyincome"] >= 65000) {
        let monthlyIncomeschema = {
          "upto 70000": 10,
          "Rs.70,000 to Rs.1,20,000": 10,
          "Rs.1,20,000 to Rs.2,00,000": 10,
          "above Rs.2,00,000": 5
        };
        if (creditScore["Vehicletype"] < 70000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["upto 70000"];
        } else if (
          70000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 120000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.70,000 to Rs.1,20,000"];
        } else if (
          120000 <= creditScore["Vehicletype"] &&
          creditScore["Vehicletype"] < 200000
        ) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["Rs.1,20,000 to Rs.2,00,000"];
        } else if (creditScore["Vehicletype"] >= 200000) {
          individualCreditScore["Vehicletype"] =
            (10 / 100) * monthlyIncomeschema["above Rs.2,00,000"];
        }
      }
    }
    if (creditScore["MainSourceofincome"]) {
      var getMainSourceofincomescore = this.getscore(
        "MainSourceofincome",
        creditScore["MainSourceofincome"]
      );
      individualCreditScore["MainSourceofincome"] =
        Math.round((5 / 100) * getMainSourceofincomescore * 100) / 100;
    }
    if (creditScore["NetworthTotalLoans"]) {
      let getperticularcore = this.getscore(
        "NetworthTotalLoans",
        creditScore["NetworthTotalLoans"]
      );
      individualCreditScore["NetworthTotalLoans"] =
        (3 / 100) * getperticularcore;
    }
    if (creditScore["ProofofIncome"]) {
      let getperticularcore = this.getscore(
        "ProofofIncome",
        creditScore["ProofofIncome"]
      );
      individualCreditScore["ProofofIncome"] = (3 / 100) * getperticularcore;
    }
    if (creditScore["LoanAmount/NetMonthlyincome"]) {
      let getperticularcore = this.getscore(
        "LoanAmount/NetMonthlyincome",
        creditScore["LoanAmount/NetMonthlyincome"]
      );
      individualCreditScore["LoanAmount/NetMonthlyincome"] =
        (6 / 100) * getperticularcore;
    }
    if (creditScore["Fixedoblogationtoincomeratio"]) {
      let getperticularcore = this.getscore(
        "Fixedoblogationtoincomeratio",
        Number(creditScore["Fixedoblogationtoincomeratio"])
      );
      individualCreditScore["Fixedoblogationtoincomeratio"] =
        Math.round((15 / 100) * getperticularcore * 100) / 100;
    }
    if (creditScore["borrower'soperativeaccount"]) {
      let getperticularcore = this.getscore(
        "borrower'soperativeaccount",
        creditScore["borrower'soperativeaccount"]
      );
      individualCreditScore["borrower'soperativeaccount"] =
        (2 / 100) * getperticularcore;
    }
    if (creditScore["ModeofRepayment"]) {
      let getperticularcore = this.getscore(
        "ModeofRepayment",
        creditScore["ModeofRepayment"]
      );
      individualCreditScore["ModeofRepayment"] = (1 / 100) * getperticularcore;
    }
    if (creditScore["CreditVintage"]) {
      let getperticularcore = this.getscore(
        "CreditVintage",
        creditScore["CreditVintage"]
      );
      individualCreditScore["CreditVintage"] = (3 / 100) * getperticularcore;
    }
    if (creditScore["ApplicantBureauScore"]) {
      let getperticularcore = this.getscore(
        "ApplicantBureauScore",
        Number(creditScore["ApplicantBureauScore"])
      );
      individualCreditScore["ApplicantBureauScore"] =
        (12 / 100) * getperticularcore;
    }
    if (creditScore["MaxDPDinlast12months"]) {
      let getperticularcore = this.getscore(
        "MaxDPDinlast12months",
        creditScore["MaxDPDinlast12months"]
      );
      individualCreditScore["MaxDPDinlast12months"] =
        (2 / 100) * getperticularcore;
    }
    if (creditScore["NoofmonthsDPDexceeded30daysinlast12months"]) {
      let getperticularcore = this.getscore(
        "NoofmonthsDPDexceeded30daysinlast12months",
        creditScore["NoofmonthsDPDexceeded30daysinlast12months"]
      );
      individualCreditScore["NoofmonthsDPDexceeded30daysinlast12months"] =
        (2 / 100) * getperticularcore;
    }
    if (creditScore["Co-ApplicantBureauScore"]) {
      let getperticularcore = this.getscore(
        "Co-ApplicantBureauScore",
        Number(creditScore["Co-ApplicantBureauScore"])
      );
      individualCreditScore["Co-ApplicantBureauScore"] =
        (2 / 100) * getperticularcore;
    }
    if (creditScore["CreditHistorypriorto12months"]) {
      let getperticularcore = this.getscore(
        "CreditHistorypriorto12months",
        creditScore["CreditHistorypriorto12months"]
      );
      individualCreditScore["CreditHistorypriorto12months"] =
        (1 / 100) * getperticularcore;
    }
    if (creditScore["Co-ApplicantNetWorthtoloanAmount"]) {
      let getperticularcore = this.getscore(
        "Co-ApplicantNetWorthtoloanAmount",
        creditScore["Co-ApplicantNetWorthtoloanAmount"]
      );
      individualCreditScore["Co-ApplicantNetWorthtoloanAmount"] =
        (5 / 100) * getperticularcore;
    }
    if (creditScore["LoantoValue"]) {
      if (creditScore["Vehicletype"] < 70000) {
        let LoantoValueJson = {
          "and LTV<=60%": 10,
          "and LTV>60% to 65%": 10,
          "and LTV>65% to 70%": 10,
          "and LTV>70% to 75%": 10,
          "and LTV>75% to 80%": 8,
          "and LTV>80% to 85%": 6,
          "and LTV>85% to 90%": 5,
          "and LTV>90% to 95%": 4,
          "and LTV>95%": 3
        };

        if (creditScore["LoantoValue"] <= 60) {
          individualCreditScore["LoantoValue"] =
            Math.round((5 / 100) * LoantoValueJson["and LTV<=60%"] * 100) / 100;
          // (5 / 100) * LoantoValueJson["and LTV<=60%"];
        } else if (
          60 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 65
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        } else if (
          65 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 70
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>65% to 70%"] * 100
            ) / 100;
        } else if (
          70 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 75
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>70% to 75%"] * 100
            ) / 100;
        } else if (
          75 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 80
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>75% to 80%"] * 100
            ) / 100;
        } else if (
          80 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 85
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>80% to 85%"] * 100
            ) / 100;
        } else if (
          85 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 90
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>85% to 90%"] * 100
            ) / 100;
        } else if (
          90 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 95
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>90% to 95%"] * 100
            ) / 100;
        } else if (creditScore["LoantoValue"] > 95) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        }
      } else if (
        70000 <= creditScore["Vehicletype"] &&
        creditScore["Vehicletype"] < 120000
      ) {
        let LoantoValueJson = {
          "and LTV<=60%": 10,
          "and LTV>60% to 65%": 10,
          "and LTV>65% to 70%": 10,
          "and LTV>70% to 75%": 8,
          "and LTV>75% to 80%": 6,
          "and LTV>80% to 85%": 5,
          "and LTV>85% to 90%": 4,
          "and LTV>90% to 95%": 3,
          "and LTV>95%": 2
        };

        if (creditScore["LoantoValue"] <= 60) {
          individualCreditScore["LoantoValue"] =
            Math.round((5 / 100) * LoantoValueJson["and LTV<=60%"] * 100) / 100;
        } else if (
          60 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 65
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        } else if (
          65 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 70
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>65% to 70%"] * 100
            ) / 100;
        } else if (
          70 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 75
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>70% to 75%"] * 100
            ) / 100;
        } else if (
          75 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 80
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>75% to 80%"] * 100
            ) / 100;
        } else if (
          80 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 85
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>80% to 85%"] * 100
            ) / 100;
        } else if (
          85 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 90
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>85% to 90%"] * 100
            ) / 100;
        } else if (
          90 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 95
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>90% to 95%"] * 100
            ) / 100;
        } else if (creditScore["LoantoValue"] > 95) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        }
      } else if (
        120000 <= creditScore["Vehicletype"] &&
        creditScore["Vehicletype"] < 200000
      ) {
        let LoantoValueJson = {
          "and LTV<=60%": 10,
          "and LTV>60% to 65%": 10,
          "and LTV>65% to 70%": 8,
          "and LTV>70% to 75%": 6,
          "and LTV>75% to 80%": 5,
          "and LTV>80% to 85%": 4,
          "and LTV>85% to 90%": 3,
          "and LTV>90% to 95%": 2,
          "and LTV>95%": 0
        };

        if (creditScore["LoantoValue"] <= 60) {
          individualCreditScore["LoantoValue"] =
            Math.round((5 / 100) * LoantoValueJson["and LTV<=60%"] * 100) / 100;
        } else if (
          60 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 65
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        } else if (
          65 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 70
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>65% to 70%"] * 100
            ) / 100;
        } else if (
          70 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 75
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>70% to 75%"] * 100
            ) / 100;
        } else if (
          75 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 80
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>75% to 80%"] * 100
            ) / 100;
        } else if (
          80 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 85
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>80% to 85%"] * 100
            ) / 100;
        } else if (
          85 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 90
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>85% to 90%"] * 100
            ) / 100;
        } else if (
          90 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 95
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>90% to 95%"] * 100
            ) / 100;
        } else if (creditScore["LoantoValue"] > 95) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        }
      } else if (creditScore["Vehicletype"] >= 200000) {
        let LoantoValueJson = {
          "and LTV<=60%": 10,
          "and LTV>60% to 65%": 8,
          "and LTV>65% to 70%": 6,
          "and LTV>70% to 75%": 5,
          "and LTV>75% to 80%": 4,
          "and LTV>80% to 85%": 3,
          "and LTV>85% to 90%": 2,
          "and LTV>90% to 95%": 0,
          "and LTV>95%": -2
        };

        if (creditScore["LoantoValue"] <= 60) {
          individualCreditScore["LoantoValue"] =
            Math.round((5 / 100) * LoantoValueJson["and LTV<=60%"] * 100) / 100;
        } else if (
          60 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 65
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        } else if (
          65 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 70
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>65% to 70%"] * 100
            ) / 100;
        } else if (
          70 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 75
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>70% to 75%"] * 100
            ) / 100;
        } else if (
          75 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 80
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>75% to 80%"] * 100
            ) / 100;
        } else if (
          80 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 85
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>80% to 85%"] * 100
            ) / 100;
        } else if (
          85 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 90
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>85% to 90%"] * 100
            ) / 100;
        } else if (
          90 < creditScore["LoantoValue"] &&
          creditScore["LoantoValue"] <= 95
        ) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>90% to 95%"] * 100
            ) / 100;
        } else if (creditScore["LoantoValue"] > 95) {
          individualCreditScore["LoantoValue"] =
            Math.round(
              (5 / 100) * LoantoValueJson["and LTV>60% to 65%"] * 100
            ) / 100;
        }
      }
    }

    //add all the value

    var CreditScoreArray = Object.values(individualCreditScore);
    let finalCreditScore = 0;
    CreditScoreArray.forEach(element => {
      finalCreditScore = Number(finalCreditScore) + Number(element);
    });

    this.setState({ creditscore: finalCreditScore });
    this.props.fieldPopulator("finalCreditScore", {
      type: "String",
      value: finalCreditScore.toFixed(2)
    });

    let RiskGrade = {
      "<1.50": "EB10",
      ">1.50 to 2.00": "EB9",
      ">2.00 to 2.50": "EB8",
      ">2.50 to 3.00": "EB7",
      ">3.00 to 3.75": "EB6",
      ">3.75 to 4.5": "EB5",
      ">4.50 to 5.25": "EB4",
      ">5.25 to 6.25": "EB3",
      ">6.25 to 7.25": "EB2",
      ">7.25 to 10": "EB1"
    };
    let LevelofRisk = {
      EB1: "Extremely Low",
      EB2: "Very Low",
      EB3: "Low",
      EB4: "moderate",
      EB5: "More than moderate",
      EB6: "Near to High",
      EB7: "High",
      EB8: "Very High",
      EB9: "Extremely High",
      EB10: "Absolute"
    };

    if (finalCreditScore <= 1.5) {
      this.setState({
        CreditScoreGrade: RiskGrade["<1.50"],
        LevelofRisk: LevelofRisk["EB10"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade["<1.50"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB10"]
      });
    } else if (1.5 < finalCreditScore && finalCreditScore <= 2.0) {
      this.setState({
        CreditScoreGrade: RiskGrade[">1.50 to 2.00"],
        LevelofRisk: LevelofRisk["EB9"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">1.50 to 2.00"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB9"]
      });
    } else if (2.0 < finalCreditScore && finalCreditScore <= 2.5) {
      this.setState({
        CreditScoreGrade: RiskGrade[">2.00 to 2.50"],
        LevelofRisk: LevelofRisk["EB8"]
      });
      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">2.00 to 2.50"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB8"]
      });
    } else if (2.5 < finalCreditScore && finalCreditScore <= 3.0) {
      this.setState({
        CreditScoreGrade: RiskGrade[">2.50 to 3.00"],
        LevelofRisk: LevelofRisk["EB7"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">2.50 to 3.00"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB7"]
      });
    } else if (3.0 < finalCreditScore && finalCreditScore <= 3.75) {
      this.setState({
        CreditScoreGrade: RiskGrade[">3.00 to 3.75"],
        LevelofRisk: LevelofRisk["EB6"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">3.00 to 3.75"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB6"]
      });
    } else if (3.75 < finalCreditScore && finalCreditScore <= 4.5) {
      this.setState({
        CreditScoreGrade: RiskGrade[">3.75 to 4.5"],
        LevelofRisk: LevelofRisk["EB5"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">3.75 to 4.5"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB5"]
      });
    } else if (4.5 < finalCreditScore && finalCreditScore <= 5.25) {
      this.setState({
        CreditScoreGrade: RiskGrade[">4.50 to 5.25"],
        LevelofRisk: LevelofRisk["EB4"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">4.50 to 5.25"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB4"]
      });
    } else if (5.25 < finalCreditScore && finalCreditScore <= 6.25) {
      this.setState({
        CreditScoreGrade: RiskGrade[">5.25 to 6.25"],
        LevelofRisk: LevelofRisk["EB3"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">5.25 to 6.25"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB3"]
      });
    } else if (6.25 < finalCreditScore && finalCreditScore <= 7.25) {
      this.setState({
        CreditScoreGrade: RiskGrade[">6.25 to 7.25"],
        LevelofRisk: LevelofRisk["EB2"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">6.25 to 7.25"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB2"]
      });
    } else if (7.25 < finalCreditScore && finalCreditScore <= 10.0) {
      this.setState({
        CreditScoreGrade: RiskGrade[">7.25 to 10"],
        LevelofRisk: LevelofRisk["EB1"]
      });

      this.props.fieldPopulator("CreditScoreGrade", {
        type: "String",
        value: RiskGrade[">7.25 to 10"]
      });
      this.props.fieldPopulator("LevelofRisk", {
        type: "String",
        value: LevelofRisk["EB1"]
      });
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
  getCibil = () => {
    this.setState({ CibilScoreloading: true });
    let scoreConfig = {
      url: "https://suryoday-staging.autonom8.com/service-app/apis/v1/cibil",
      method: "post",
      data: {
        AddrLine1: "ISLAMPURA MASJID PASE, ALIGADH, VIRAMGAM",
        City: "AHMEDABAD ",
        DOB: "1963-07-05",
        First_Name: "JUJAR  LUKMANJI PATEL",
        Gender: "Male",
        Last_Name: "YASMIN JUJAR PATEL",
        Locality1: "AHMEDABAD",
        Mobile_Phone: "8179882719",
        Pan_Id: "ABCPP2044C",
        Postal: "382150",
        State: "Gujarat",
        Transaction_Amount: "112111",
        Loan_Product_Code: "7004",
        Inq_Purpose: "17"
      }
    };
    axios(scoreConfig)
      .then(response => {

        this.setState({
          getCIbilDone: true,
          CibilScoreloading: false,
          cibilScore: response.data.ScoreDetails.Score.Value,
          cibilApiData: response.data
        });
      })
      .catch(e => {
        this.setState({ CibilScoreloading: true });
      });
  };

  renderPersonalInfoDetails = () => {
    const {
      cibilApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (
      BureauResponse.PersonalInfoDetails &&
      BureauResponse.PersonalInfoDetails.PersonalInfo
    ) {
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
    return null;
  };

  renderDocumentDetails = () => {
    const {
      cibilApiData: {
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

  renderAddressDetails = () => {
    const {
      cibilApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (
      BureauResponse.AddressInfoDetails &&
      BureauResponse.AddressInfoDetails.AddressInfo
    ) {
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
  renderTelephoneNumbers = () => {
    const {
      cibilApiData: {
        ResponseXML: { BureauResponse }
      }
    } = this.state;

    if (
      BureauResponse.TelephoneInfoDetails &&
      BureauResponse.TelephoneInfoDetails.TelephoneInfo
    ) {
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
              {/* <SectionInsideCard
              label="home phone"
              value="+91 9942276886"
              col="2"
            />
            <SectionInsideCard
              label="office phone"
              value="+91 9942276886"
              col="2"
            />
            <SectionInsideCard
              label="not classified"
              value="+91 9942276886"
              col="2"
            /> */}
            </div>
          </div>
        </ul>
      );
    } else {
      return null;
    }
  };
  renderEmailDetails = () => {
    return (
      <ul className="pannalclassname">
        <div className="tab-content-in" style={{ paddingLeft: "15px" }}>
          <h2>Email Contact</h2>
          <div className="row" style={{ paddingLeft: "15px" }}>
            <SectionInsideCard
              label="Email 1"
              value="sivasakthi@gmail.com"
              col="1"
            />
            <SectionInsideCard
              label="Email 1"
              value="sivasakthi@autonom8.com"
              col="1"
            />
          </div>
        </div>
      </ul>
    );
  };

  renderEmploymentInformation = () => {
    const {
      cibilApiData: {
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
  };

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
              sectionLabel="Personal Information"
              sectionKey="PersonalInformation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={false}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Date of birth"}
                    name={"dob"}
                    component={DatePicker}
                    dateFormat="DD/MM/YYYY"
                    onChange={(e: any) => {
                      let selectedDate = moment(e.value);
                      let Duration = moment().diff(selectedDate, "years");
                      let age = Duration;
                      this.props.fieldPopulator("age", {
                        type: "String",
                        value: age
                      });
                    }}
                    placeholder="Select DOB"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"age"}
                    name="age"
                    component={TextBox}
                    placeholder="Enter Collateral ID"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Collateral ID is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Gender And Marital status"
                    name="GenderAndMaritalstatus"
                    component={Select}
                    placeholder="Gender and Marital status"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="Unmarried Female">Unmarried Female</Option>
                    <Option value="Married Female">Married Female</Option>
                    <Option value="Unmarried Male">Unmarried Male</Option>
                    <Option value="Married Male">Married Male</Option>
                    <Option value="Others">Others</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Driving License"}
                    name="DrivingLicense"
                    component={RadioWrapper}
                    //optional
                    onChange={() => { }}
                  >
                    <Radio value={"Yes"}>Yes</Radio>
                    <Radio value={"No"}>No</Radio>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Population Group"
                    name="PopulationGroup"
                    component={Select}
                    placeholder="Population Group"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="Rural">Rural</Option>
                    <Option value="Semi urban">Semi urban</Option>
                    <Option value="Urban">Urban</Option>
                    <Option value="Metropolitian">Metropolitian</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Educational Qualification"
                    name="EducationalQualification"
                    component={Select}
                    placeholder="Educational Qualification"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="Primary or less">Primary or less</Option>
                    <Option value="Secondary school">Secondary school</Option>
                    <Option value="Higher secondary (+1/+2)">
                      Higher secondary (+1/+2)
                    </Option>
                    <Option value="Diploma">Diploma</Option>
                    <Option value="Graduate">Graduate</Option>
                    <Option value="Post Graduate/Professional">
                      Post Graduate/Professional
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Residence Type"
                    name="ResidenceType"
                    component={Select}
                    placeholder="Residence Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="House owned by self/Spouse">
                      House owned by self/Spouse
                    </Option>
                    <Option value="House owned by parents">
                      House owned by parents
                    </Option>
                    <Option value="Rented House/Appartment">
                      Rented House/Appartment
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Experience  Employment / Business"
                    name="ExperienceinCurrentEmployment"
                    component={Select}
                    placeholder="Experience in Current Employment / Business"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="No prior experience/Unskilled labour">
                      No prior experience/Unskilled labour{" "}
                    </Option>
                    <Option value="Skilled labour on daily wages">
                      Skilled labour on daily wages
                    </Option>
                    <Option value="NRI s other than professionals">
                      NRI s other than professionals
                    </Option>
                    <Option value="Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.">
                      Skilled and self employed
                      -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own
                      vehicle) etc.
                    </Option>
                    <Option value="Professional / salaried / Business < 5 years">{`Professional / salaried / Business < 5 years`}</Option>
                    <Option value="Professional / salaried / Business 5 years to <10 years">{`Professional / salaried / Business 5 years to <10 years`}</Option>
                    <Option value="Professional / salaried / Business  >=10 years">{`Professional / salaried / Business  >=10 years`}</Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Income & Financial Position"
              sectionKey="IncomeandFinancialPosition"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Monthly income (NET)"}
                    name="Monthlyincome"
                    component={TextBox}
                    placeholder="Monthly income (NET)"
                    type="tel"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Monthly income  is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Ex showroom price"}
                    name="Vehicletype"
                    component={TextBox}
                    placeholder="Vehicle Type"
                    type="tel"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Vehicle Type is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Main Source of income"
                    name="MainSourceofincome"
                    component={Select}
                    placeholder="Main Source of income"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Main Source of income is required"
                      })
                    ]}
                  >
                    <Option value="Salaried- govt/quasi Govt/Organized pvt sector employee/NRI Professionals">
                      Salaried- govt/quasi Govt/Organized pvt sector
                      employee/NRI Professionals
                    </Option>
                    <Option value="Salaried- Unorganized PVT sector employees">
                      Salaried- Unorganized PVT sector employees
                    </Option>
                    <Option value="Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.">
                      Skilled and self employed
                      -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own
                      vehicle) etc.
                    </Option>
                    <Option value="Other own businees- Manufacturing/Trade/Service">
                      Other own businees- Manufacturing/Trade/Service
                    </Option>
                    <Option value="Skilled labourers - Carpenters,Mason,Plumbers,Electricians,Tailors, other skilled daily wage earners,Other NRIs">
                      Skilled labourers -
                      Carpenters,Mason,Plumbers,Electricians,Tailors, other
                      skilled daily wage earners,Other NRIs
                    </Option>
                    <Option value="Unskilled labourers/others">
                      Unskilled labourers/others
                    </Option>
                    <Option value="Marginal Farmer - Land Holding < 0.50 Ha">{`Marginal Farmer - Land Holding < 0.50 Ha`}</Option>
                    <Option value="Small Farmer - Land Holding >0.50 Ha to 2 Ha">
                      {`Small Farmer-Land Holding >0.50 Ha to 2 Ha`}
                    </Option>
                    <Option value="Large Farmer-Land Holding > 2 Ha"> {`Large Farmer-Land Holding > 2 Ha`}</Option>
                    <Option value="Pension/Rent">Pension/Rent</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"NetWorth"}
                    name="Networth"
                    component={TextBox}
                    placeholder="Net worth"
                    type="tel"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Net worth is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Total Loan Amount Paying Currently"}
                    name="TotalLoans"
                    component={TextBox}
                    placeholder="Total Loans"
                    type="tel"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                    onChange={this.autoPopulateforNetWorth}
                    validate={[
                      A8V.required({ errorMsg: "Net worth is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Net worth / Total Loans (Times)"}
                    name="NetworthTotalLoans"
                    component={TextBox}
                    placeholder="Net worth / Total Loans (Times)"
                    type="tel"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "Net worth / Total Loans (Times) is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Proof of Income"
                    name="ProofofIncome"
                    component={Select}
                    placeholder="Proof of Income"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: "Proof of Income is required" })
                    ]}
                  >
                    <Option value="ITR/Form 16/Audited Financial Statement">
                      ITR/Form 16/Audited Financial Statement
                    </Option>
                    <Option value="Attested salary certificate supported by minimum one year bank statement">
                      Attested salary certificate supported by minimum one year
                      bank statement
                    </Option>
                    <Option value="salary certificate and bank statement for less than one year">
                      salary certificate and bank statement for less than one
                      year
                    </Option>
                    <Option value="Average monthly remittance in NRE account for minimum one year">
                      Average monthly remittance in NRE account for minimum one
                      year
                    </Option>
                    <Option value="Income assessed on the basis of Bank statement">
                      Income assessed on the basis of Bank statement
                    </Option>
                    <Option value="No proof of income estimated by Credit officer based on activity/asset holding">
                      No proof of income estimated by Credit officer based on
                      activity/asset holding
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Loan Amount"
                    type="tel"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    onChange={this.autoPopulateforLoanAmountNetMonthlyincome}
                    validate={[
                      A8V.required({ errorMsg: "Loan Amount is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount/ Net Monthly income"}
                    name="LoanAmount/NetMonthlyincome"
                    component={TextBox}
                    placeholder="Loan Amount/ Net Monthly income"
                    type="tel"
                    normalize={proceedNumber}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: "Loan Amount/ Net Monthly income is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"FOIR (In Percentage)"}
                    name="Fixedoblogationtoincomeratio"
                    component={TextBox}
                    placeholder="Loan Amount"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg:
                          "Fixed oblogation to income ratio (FOIR) is required"
                      })
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Banking Behaviour"
              sectionKey="BankingBehaviour"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="AMB borrower's operative account"
                    name="borrower'soperativeaccount"
                    component={Select}
                    placeholder="principle borrower's operative account"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "AMB borrower's operative account is required"
                      })
                    ]}
                  >

                    <Option value="New to Banking A/C less than 12 month old">
                      New to Banking A/C less than 12 month old
                    </Option>

                    <Option value="Up to 1000">Up to 1000</Option>
                    <Option value="Rs 1000 to Rs 3000">
                      Rs 1000 to Rs 3000
                    </Option>
                    <Option value="Rs 3000 to Rs 5000">
                      Rs 3000 to Rs 5000
                    </Option>
                    <Option value="Rs 5000 to Rs 10000">
                      Rs 5000 to Rs 10000
                    </Option>
                    <Option value="Rs 10000 above">Rs 10000 above</Option>

                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Mode of Repayment"
                    name="ModeofRepayment"
                    component={Select}
                    placeholder="Mode of Repayment"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Mode of Repayment is required"
                      })
                    ]}
                  >
                    <Option value="Check off system by employer">
                      Check off system by employer
                    </Option>
                    <Option value="Salary A/C with ESAF bank">
                      Salary A/C with ESAF bank
                    </Option>
                    <Option value="ECS Mandate from other bank Account">
                      ECS Mandate from other bank Account
                    </Option>
                    <Option value="SB A/C with ESAF Bank/others">
                      SB A/C with ESAF Bank/others
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Credit Vintage"
                    name="CreditVintage"
                    component={Select}
                    placeholder="Credit Vintage"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Mode of Repayment is required"
                      })
                    ]}
                  >
                    <Option value="Credit record nill / up to one year">
                      Credit record nill / up to one year
                    </Option>
                    <Option value="Applicant is sangam member for <5 years">{`Applicant is sangam member for <5 years`}</Option>
                    <Option value="Applicant is sangam member for >=5 years">{`Applicant is sangam member for >=5 years`}</Option>
                    <Option value="1 year to 3 years">1 year to 3 years</Option>
                    <Option value="3 years to 5 years">
                      3 years to 5 years
                    </Option>
                    <Option value=">5 years">5 years above</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant's Bureau Score (CIBIL)"}
                    name="ApplicantBureauScore"
                    component={TextBox}
                    placeholder="Applicant's Bureau Score (CIBIL)"
                    hasFeedback
                    className="form-control-coustom"
                    // normalize={proceedNumber}
                    validate={[
                      A8V.required({
                        errorMsg: "Applicant's Bureau Score (CIBIL) is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Max DPD in last 12 months"
                    name="MaxDPDinlast12months"
                    component={Select}
                    placeholder="Max DPD in last 12 months"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg: "Max DPD in last 12 months is required"
                      })
                    ]}
                  >
                    <Option value="No hit in CB report/Credit vintage up to 6M and DPD less than 30 days">
                      No hit in CB report/Credit vintage up to 6M and DPD less
                      than 30 days
                    </Option>
                    <Option value="Credit vintage >6M and DPD <10 days">{`Credit vintage >6M and DPD < 10 days`}</Option>
                    <Option value="DPD 10 days to 30 days">
                      DPD 10 days to 30 days
                    </Option>
                    <Option value="DPD 30 +">{`DPD 30 +`}</Option>
                    <Option value="DPD 60 +">{`DPD 60 +`}</Option>
                    <Option value="DPD 90 +">{`DPD 90 +`}</Option>
                    <Option value="Settled / Written off">
                      Settled / Written off
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="No of months DPD exceeded 30 days in last 12 months"
                    name="NoofmonthsDPDexceeded30daysinlast12months"
                    component={Select}
                    placeholder="No of months DPD exceeded 30 days in last 12 months"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg:
                          "No of months DPD exceeded 30 days in last 12 months is required"
                      })
                    ]}
                  >
                    <Option value="No hit in CB report/Credit vintage up to 6M and DPD less than 30 days">
                      {`No hit in CB report/Credit vintage up to 6M and DPD less
                      than 30 days`}
                    </Option>
                    <Option value="Credit vintage >6M and DPD <30 days">{`Credit vintage >6M and DPD <30 days`}</Option>
                    <Option value="DPD >30 days - 1 month">
                      {` DPD >30 days - 1 month`}
                    </Option>
                    <Option value="DPD >30 days - 2 to 3 months">
                      {`DPD >30 days - 2 to 3 months`}
                    </Option>
                    <Option value="DPD >30 days - 4 to 5 months">
                      {`DPD >30 days - 4 to 5 months`}
                    </Option>
                    <Option value="DPD >30 days - 6 months &above">
                      {`DPD >30 days - 6 months &above`}
                    </Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Co-Applicant's Bureau Score (CIBIL)"}
                    name="Co-ApplicantBureauScore"
                    component={TextBox}
                    placeholder="Co-Applicant's Bureau Score"
                    hasFeedback
                    className="form-control-coustom"
                    // normalize={proceedNumber}
                    validate={[
                      A8V.required({
                        errorMsg:
                          "Co-Applicant's Bureau Score (CIBIL) is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Credit History prior to 12 months"
                    name="CreditHistorypriorto12months"
                    component={Select}
                    placeholder="Credit History prior to 12 months"
                    className="a8Select"
                    validate={[
                      A8V.required({
                        errorMsg:
                          "Credit History prior to 12 months is required"
                      })
                    ]}
                  >
                    <Option value="No hit in CB report/No history prior to 12 months">
                      No hit in CB report/No history prior to 12 months
                    </Option>
                    <Option value="Satisfactory">Satisfactory</Option>
                    <Option value="Substandard">Substandard</Option>
                    <Option value="Suit Field/Written off/Settled">
                      Suit Field/Written off/Settled
                    </Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Security"
              sectionKey="Security"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Networth Of co-Applicant"}
                    name="NetworthOfco-Applicant"
                    component={TextBox}
                    placeholder="NetworthOfco-Applicant"
                    hasFeedback
                    className="form-control-coustom"
                    onChange={(data: any) => {
                      if (this.props.formValues.TotalLoans) {
                        this.props.fieldPopulator(
                          "Co-ApplicantNetWorthtoloanAmount",
                          {
                            type: "String",
                            value:
                              Math.round((data.value / Number(this.props.formValues.TotalLoans.value)) * 100) / 100
                          }
                        );
                      }
                    }}
                    // normalize={proceedNumber}
                    validate={[
                      A8V.required({
                        errorMsg: "Networth Of co-Applicant is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Co-Applicant's NetWorth to loan Amount "}
                    name="Co-ApplicantNetWorthtoloanAmount"
                    component={TextBox}
                    placeholder="Co-Applicant's Net Worth to loan Amount"
                    hasFeedback
                    className="form-control-coustom"
                    normalize={proceedNumber}
                    validate={[
                      A8V.required({
                        errorMsg:
                          "Co-Applicant's Net Worth to loan Amount is required"
                      })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan to Value (EX-Showroom) in percentage"}
                    name="LoantoValue"
                    component={TextBox}
                    placeholder="Co-Applicant's Net Worth to loan Amount"
                    hasFeedback
                    className="form-control-coustom"
                    // normalize={proceedNumber}
                    validate={[
                      A8V.required({
                        errorMsg: "Loan to Value (EX-Showroom) is required"
                      })
                    ]}
                  />
                </div>
              </div>
              <div className="flex-row" style={{ marginBottom: "30px" }}>
                <div className="form-group col-xs-6 col-md-4">
                  <Button
                    className="ant-btn button button-primary  button-md ant-btn-primary"
                    onClick={this.calculateCreditScore}
                  >
                    Calculate
                  </Button>

                </div>
              </div>
            </div>
          </div>
          {this.state.creditScorevalue && (
            <React.Fragment>
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="Credit Score"
                  sectionKey="CreditScore"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                  //use this props to set firstTab always open
                  initialTab={true}
                />
                <div
                  className="form-section-content"
                  style={{ display: "block" }}
                >
                  {/* <div className="flex-row"> */}
                  <div style={{ display: "flex" }}>
                    <Scorecards
                      title={"FinalCreditScore"}
                      Score={this.state.creditscore}
                    />
                    <Scorecards
                      title={"Credit Grade"}
                      Score={this.state.CreditScoreGrade}
                    />
                    <Scorecards
                      title={"Level of Risk"}
                      Score={this.state.LevelofRisk}
                    />
                  </div>
                  <Field
                    hidden={true}
                    name="finalCreditScore"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                  <Field
                    hidden={true}
                    name="CreditScoreGrade"
                    component={TextBox}
                    placeholder="CreditScoreGrade"
                    hasFeedback
                    className="form-control-coustom"
                  />
                  <Field
                    hidden={true}
                    name="LevelofRisk"
                    component={TextBox}
                    placeholder="LevelofRisk"
                    hasFeedback
                    className="form-control-coustom"
                  />
                  {/* <ImageViewer ImgArray={this.state.array} ipc={this.props.ipc} /> */}
                  {/* </div> */}
                </div>
              </div>
            </React.Fragment>
          )}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Credit Score"
              sectionKey="Credit Score"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />

            <div className="flex-row">
              <div
                className="form-group col-xs-6 col-md-4"
                style={{ paddingBottom: "15px" }}
              >
                <Button
                  className="ant-btn button button-primary  button-md ant-btn-primary"
                  onClick={this.getCibil}
                  loading={this.state.CibilScoreloading}
                >
                  Get Cibil
                </Button>
              </div>
            </div>

            {this.state.getCIbilDone && (
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
                        value={this.state.cibilScore}
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
                        // needleTransition="easeElastic"
                        currentValueText={`Current Value: ${this.state.cibilScore}`}
                      />
                    </div>
                    <Collapse
                      bordered={false}
                      expandIconPosition={"right"}
                    // defaultActiveKey={["1"]}
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
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  console.log("***** Credit Score VALUES *****", state);
  return {
    // get current form values
    formValues: getFormValues("creditScore")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("creditScore")(state),
    //taskInfo
    task: state.task
  };
};
export default connect(
  mapStateToProps,
  {}
)(TabCreditScore);

const SectionInsideCard = ({ label, value, col }) => {
  return (
    <div className={col === "1" ? "common-col-div-1" : "common-col-div"}>
      <p className="text-label">{label}</p>
      <p style={{ marginBottom: "15px" }}>
        <strong>{value}</strong>
      </p>
    </div>
  );
};
