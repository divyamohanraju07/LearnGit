import * as React from 'react'
import {
  A8V,
  uploadChecker,
  Scorecards,
  Checklist,
  Config,
  retrieveDefaultFiles,
} from '../../helpers'
import { Select, SelectHelper, Uploader, TextBox } from 'a8flow-uikit'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { Descriptions, Table, Collapse, Icon, Button, Anchor } from 'antd'
import { connect } from 'react-redux'
import validate from 'validate.js'
import EditableField from '../../helpers/form/descriptionField'
import axios from 'axios'
import classname from 'classnames'
import moment from 'moment'
import Style from './L1CreditSanction.module.css'

const { Panel } = Collapse
const { Link } = Anchor
const { Option } = SelectHelper

type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
  ipc: any
}

type State = {
  sectionValidator: any
  ApplicantChecklist: any[]
  c1ApplicantChecklist: any[]
  c2ApplicantChecklist: any[]
  c3ApplicantChecklist: any[]
  c4ApplicantChecklist: any[]
  g1ApplicantChecklist: any[]
  g2ApplicantChecklist: any[]
  KYCchecklist: any[]
  c1KYCchecklist: any[]
  c2KYCchecklist: any[]
  c3KYCchecklist: any[]
  c4KYCchecklist: any[]
  g1KYCchecklist: any[]
  g2KYCchecklist: any[]
  addressCheckList: any[]
  c1addressCheckList: any[]
  c2addressCheckList: any[]
  c3addressCheckList: any[]
  c4addressCheckList: any[]
  g1addressCheckList: any[]
  g2addressCheckList: any[]
  KYCImageschecklist: any[]
  VehicleChecklist: any[]
  FinanceChecklist: any[]
  ReferenceChecklist: any[]
  UploaderEsafSample: any
  scannedImagesList: string[]
  showScoreCard: boolean
  tenure: any
  amount: any
  CreditScoreGrade: any
  creditScorevalue: boolean
  creditscore: any
  scoreCardData: any
  LevelofRisk: any
  BackOfficeUpload: any
  showReturnTo: any
}

class TabBackOfficeVerification extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      applicantChecks: [],
      KYCchecks: [],
      FinancialChecks: [],
      ReferenceChecks: [],
      Uploader: ['UploaderEsafSample'],
      KYCImagechecks: [],
      IncomeAndExpense: [
        'ApplicantSalary',
        'c1ApplicantSalary',
        'c2ApplicantSalary',
        'c3ApplicantSalary',
        'c4ApplicantSalary',
        'BO_NetIncome',
        'appobligation',
        'c1obligation',
        'c2obligation',
        'c3obligation',
        'c4obligation',
        'BO_Obligation',
        'appExpense',
        'c1appExpense',
        'c2appExpense',
        'c3appExpense',
        'c4appExpense',
        'BO_ExpenseTotal',
        'EstimatedEMI',
        'BO_TotalObligation',
        'FOIR_inPercent',
      ],
      BackOfficeComments: [
        'IndustryExperience',
        'CreditHistory',
        'ReferenceDone',
        'Negatives',
        'Mitigants',
        'CashFlow',
        'utilizationofLoan',
        'additionalConditions',
      ],
    },
    ApplicantChecklist: [],
    c1ApplicantChecklist: [],
    c2ApplicantChecklist: [],
    c3ApplicantChecklist: [],
    c4ApplicantChecklist: [],
    g1ApplicantChecklist: [],
    g2ApplicantChecklist: [],
    KYCchecklist: [],
    c1KYCchecklist: [],
    c2KYCchecklist: [],
    c3KYCchecklist: [],
    c4KYCchecklist: [],
    g1KYCchecklist: [],
    g2KYCchecklist: [],
    addressCheckList: [],
    c1addressCheckList: [],
    c2addressCheckList: [],
    c3addressCheckList: [],
    c4addressCheckList: [],
    g1addressCheckList: [],
    g2addressCheckList: [],
    KYCImageschecklist: [],
    VehicleChecklist: [],
    FinanceChecklist: [],
    showScoreCard: false,
    CreditScoreGrade: '',
    creditScorevalue: false,
    creditscore: '',
    scoreCardData: [],
    LevelofRisk: '',
    tenure: '',
    amount: '',
    showReturnTo: false,
    columnData: [
      {
        title: 'Data',
        dataIndex: 'data',
      },
      {
        title: 'Actual Value',
        dataIndex: 'ActualValue',
      },
      // {
      //   title: 'Score Obtained',
      //   dataIndex: 'Score',
      // },
    ],
    ReferenceChecklist: [],
    UploaderEsafSample: {
      // name of uploader field name
      fieldName: 'UploaderEsafSample',
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        {
          name: 'Residence Verification Report',
          key: 'ResidenceVerificationReport',
        },
        {
          name: 'Business Verification Report',
          key: 'BusinessVerificationReport',
        },
        {
          name: 'Employment Verification Report',
          key: 'EmploymentVerificationReport',
        },
        {
          name: 'CERSAI Report',
          key: 'CERSAIReport',
        },
        {
          name: 'CFR Report',
          key: 'CFRReport',
        },
        {
          name: 'Application Form',
          key: 'ApplicationForm',
        },
        {
          name: 'Declaration',
          key: 'Declaration',
        },
        {
          name: 'Check List',
          key: 'CheckList',
        },
        {
          name: 'Authorization Note',
          key: 'AuthorizationNote',
        },
        {
          name: 'Asset Liability',
          key: 'AssetLiability',
        },
        {
          name: 'SO_Document 1',
          key: 'SO_Document1',
        },
        {
          name: 'SO_Document 2',
          key: 'SO_Document2',
        },
        {
          name: 'SO_Document 3',
          key: 'SO_Document3',
        },
        {
          name: 'BO_Document 1',
          key: 'BO_Document1',
        },
        {
          name: 'BO_Document 2',
          key: 'BO_Document2',
        },
        {
          name: 'BO_Document 3',
          key: 'BO_Document3',
        },
      ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: [
        'Residence Verification Report',
        'Business Verification Report',
        'Employment Verification Report',
        'CFR Report',
        'CERSAI Report',
        'Application Form',
        'Declaration',
        'Check List',
        'Authorization Note',
        'Asset Liability',
        'BO_Document 1',
        'BO_Document 2',
        'BO_Document 3',
        'SO_Document 1',
        'SO_Document 2',
        'SO_Document 3',
      ],
      // uploadLimit handle how many fields the user need to upload
      uploadLimit: 16,
      /**
       * errorMsg : handle custom error messages.
       * you can pass to handle different sceneries
       */
      errorMsg: {
        //if upload limit exceed
        uploadLimit: 'Upload limit exceed!',
        //if fileInfo.length != uploadLimit below message will show
        fileInfoUploadLimitMisMatch:
          'YOUR FIELD NAME props fileinfo and upload limit should be equal',
        //if multiple file uploads have same name
        variableNameConflict: 'File Name should be unique',
        //if file uploaded, force your to select file/variable name
        updateVariableName: 'Please Select File Name',
      },
      //this props handle defaultFiles fetching state
      initialUploadLoader: true,
    },
    BackOfficeUpload: {
      // name of uploader field name
      fieldName: 'backOfficeUpload',
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        {
          name: 'CERSAI Report',
          key: 'CERSAIReport',
        },
        {
          name: 'CFR Report',
          key: 'CFRReport',
        },
        {
          name: 'BO_Document 1',
          key: 'BO_Document1',
        },
        {
          name: 'BO_Document 2',
          key: 'BO_Document2',
        },
        {
          name: 'BO_Document 3',
          key: 'BO_Document3',
        },
      ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: [
        'CERSAI Report',
        'CFR Report',
        'BO_Document 1',
        'BO_Document 2',
        'BO_Document 3',
      ],
      // uploadLimit handle how many fields the user need to upload
      uploadLimit: 5,
      /**
       * errorMsg : handle custom error messages.
       * you can pass to handle different sceneries
       */
      errorMsg: {
        //if upload limit exceed
        uploadLimit: 'Upload limit exceed!',
        //if fileInfo.length != uploadLimit below message will show
        fileInfoUploadLimitMisMatch:
          'YOUR FIELD NAME props fileinfo and upload limit should be equal',
        //if multiple file uploads have same name
        variableNameConflict: 'File Name should be unique',
        //if file uploaded, force your to select file/variable name
        updateVariableName: 'Please Select File Name',
      },
      //this props handle defaultFiles fetching state
      initialUploadLoader: true,
    },
    scannedImagesList: [
      'panImg',
      'aadhaarImg',
      'Vehicleimage',
      'DLImg',
      'passportImg',
      'voterIdImage',
      'singleKycimage',
      'c1panImg',
      'c1aadhaarImg',
      'c1Vehicleimage',
      'c1DLImg',
      'c1passportImg',
      'c1voterIdImage',
      'c1singleKycimage',
      'c2panImg',
      'c2aadhaarImg',
      'c2Vehicleimage',
      'c2DLImg',
      'c2passportImg',
      'c2voterIdImage',
      'c2singleKycimage',
      'c3panImg',
      'c3aadhaarImg',
      'c3Vehicleimage',
      'c3DLImg',
      'c3passportImg',
      'c3voterIdImage',
      'c3singleKycimage',
      'c4panImg',
      'c4aadhaarImg',
      'c4Vehicleimage',
      'c4DLImg',
      'c4passportImg',
      'c4voterIdImage',
      'c4singleKycimage',
    ],
  }

  componentDidMount = async () => {
    //NOTE ::: Commend below code for local development
    //use this helper to retrieve default files
    await retrieveDefaultFiles({
      taskInfo: this.props.taskInfo,
      fileInfo: this.state.UploaderEsafSample,
      fieldPopulator: this.props.fieldPopulator,
    })
    //set initialUploader true
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafSample,
    //     initialUploadLoader: true
    //   }
    // }));
    // //set initialUploadLoader false
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafSample,
    //     initialUploadLoader: false
    //   }
    // }));

    let applicantCheck = this.mapApplicantChecklist()
    let KYCcheck = this.mapKYCDocumentChecklist()
    let addrerssCheck = this.mapAddressInfoChecklist()
    this.mapKYCImageschecklist()

    if (this.props.formValues.coBorrowerSelect) {
      if (
        this.props.formValues.coBorrowerSelect.value === '1' ||
        this.props.formValues.coBorrowerSelect.value === '2' ||
        this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4'
      ) {
        let c1ApplicantCheck = this.mapApplicantChecklist('c1')
        this.setState({ c1ApplicantChecklist: c1ApplicantCheck })
        let c1KYCcheck = this.mapKYCDocumentChecklist('c1')
        this.setState({ c1KYCchecklist: c1KYCcheck })
        let c1addrerssCheck = this.mapAddressInfoChecklist('c1')
        this.setState({ c1addressCheckList: c1addrerssCheck })
        this.mapKYCImageschecklist('c1')
      }
      if (
        this.props.formValues.coBorrowerSelect.value === '2' ||
        this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4'
      ) {
        let c2ApplicantCheck = this.mapApplicantChecklist('c2')
        this.setState({ c2ApplicantChecklist: c2ApplicantCheck })
        let c2KYCcheck = this.mapKYCDocumentChecklist('c2')
        this.setState({ c2KYCchecklist: c2KYCcheck })
        let c2addrerssCheck = this.mapAddressInfoChecklist('c2')
        this.setState({ c2addressCheckList: c2addrerssCheck })
        this.mapKYCImageschecklist('c2')
      }
      if (
        this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4'
      ) {
        let c3ApplicantCheck = this.mapApplicantChecklist('c3')
        this.setState({ c3ApplicantChecklist: c3ApplicantCheck })
        let c3KYCcheck = this.mapKYCDocumentChecklist('c3')
        this.setState({ c3KYCchecklist: c3KYCcheck })
        let c3addrerssCheck = this.mapAddressInfoChecklist('c3')
        this.setState({ c3addressCheckList: c3addrerssCheck })
        this.mapKYCImageschecklist('c3')
      }
      if (this.props.formValues.coBorrowerSelect.value === '4') {
        let c4ApplicantCheck = this.mapApplicantChecklist('c4')
        this.setState({ c4ApplicantChecklist: c4ApplicantCheck })
        let c4KYCcheck = this.mapKYCDocumentChecklist('c4')
        this.setState({ c4KYCchecklist: c4KYCcheck })
        let c4addrerssCheck = this.mapAddressInfoChecklist('c4')
        this.setState({ c4addressCheckList: c4addrerssCheck })
        this.mapKYCImageschecklist('c4')
      }
    }

    if (this.props.formValues.guarantorSelect) {
      if (
        this.props.formValues.guarantorSelect.value === '1' ||
        this.props.formValues.guarantorSelect.value === '2'
      ) {
        let g1ApplicantCheck = this.mapApplicantChecklist('g1')
        this.setState({ g1ApplicantChecklist: g1ApplicantCheck })
        let g1KYCcheck = this.mapKYCDocumentChecklist('g1')
        this.setState({ g1KYCchecklist: g1KYCcheck })
        let g1addrerssCheck = this.mapAddressInfoChecklist('g1')
        this.setState({ g1addressCheckList: g1addrerssCheck })
        this.mapKYCImageschecklist('g1')
      }
      if (this.props.formValues.guarantorSelect.value === '2') {
        let g2ApplicantCheck = this.mapApplicantChecklist('g2')
        this.setState({ g2ApplicantChecklist: g2ApplicantCheck })
        let g2KYCcheck = this.mapKYCDocumentChecklist('g2')
        this.setState({ g2KYCchecklist: g2KYCcheck })
        let g2addrerssCheck = this.mapAddressInfoChecklist('g2')
        this.setState({ g2addressCheckList: g2addrerssCheck })
        this.mapKYCImageschecklist('g2')
      }
    }

    let vehicleCheck = this.mapVehicleChecklist()
    let FinancialCheck = this.mapFinanceChecklist()
    let ReferenceCheck = this.mapReferenceChecklist()
    this.mapGenderAndMaritalstatus()
    this.handleDrivingLicense()
    this.handleMemberExpense()
    this.handleExShowroomPrice()
    this.handleTotalObligation()

    if (this.props.formValues.BO_NetIncome) {
      this.props.fieldPopulator('Monthlyincome', {
        type: 'String',
        value: this.props.formValues.BO_NetIncome.value,
      })
    }

    this.setState({
      ApplicantChecklist: applicantCheck,
      KYCchecklist: KYCcheck,
      addressCheckList: addrerssCheck,
      VehicleChecklist: vehicleCheck,
      FinanceChecklist: FinancialCheck,
      ReferenceChecklist: ReferenceCheck,
    })

    let additionalConditions = `1) Confirmation of noting of hypothecation in favouring ESAF Bank from RTO Website or Dealer to be taken within 60 days from the date of Vehicle delivery.
2) Disbursement has to be done after deducting credit protect insurance and processing fee. Hypothecation note, insurance cover note and Tax Invoice to be produce within 7 days of vehicle delivery.
3) Validity of the sanction is for 30 days.
4) Sanction terms and conditions annexure should be attached.
5) Mandate from all the Applicants shall be obtained for crediting the loan proceeds to a single partys account.
6) Vehicle delivery order shall be issued only from HO.`

    this.props.fieldPopulator('additionalConditions', {
      type: 'string',
      value: additionalConditions,
      valueInfo: {},
    })
  }

  mapGenderAndMaritalstatus = () => {
    if (
      this.props.formValues &&
      this.props.formValues.Gender &&
      this.props.formValues.MaritalStatus
    ) {
      let Gender = this.props.formValues.Gender.value
      let Maritalstatus = this.props.formValues.MaritalStatus.value
      if (Maritalstatus === 'Unmarried') {
        let result = Maritalstatus + ' ' + Gender
        // return result;
        this.props.fieldPopulator('GenderAndMaritalstatus', {
          type: 'String',
          value: result,
        })
      } else if (Maritalstatus === 'Married') {
        let result = Maritalstatus + ' ' + Gender
        this.props.fieldPopulator('GenderAndMaritalstatus', {
          type: 'String',
          value: result,
        })
      } else if (
        Maritalstatus === 'Divorced' ||
        Maritalstatus === 'Widow' ||
        Maritalstatus === 'Widower' ||
        Maritalstatus === 'Seperate'
      ) {
        let result = 'Others'
        this.props.fieldPopulator('GenderAndMaritalstatus', {
          type: 'String',
          value: result,
        })
      }
    }
  }

  handleDrivingLicense = () => {
    let processVariables = this.props.formValues
    if (processVariables.DL_Number && processVariables.DL_ExpiryDate) {
      this.props.fieldPopulator('DrivingLicence', {
        type: 'String',
        value: 'Yes',
      })
    } else {
      this.props.fieldPopulator('DrivingLicence', {
        type: 'String',
        value: 'No',
      })
    }
  }

  handleExShowroomPrice = () => {
    if (this.props.formValues.ExShowroomPrice) {
      let showroomprice = this.props.formValues.ExShowroomPrice.value
      // let replace = showroomprice.replace(/,/g, "");
      this.props.fieldPopulator('exshowroomprice', {
        type: 'String',
        value: showroomprice.replace(/,/g, ''),
      })
    }
  }

  handleMonthlyincome = (value) => {
    if (this.props.formValues.BO_NetIncome) {
      this.props.fieldPopulator('Monthlyincome', {
        type: 'String',
        value: value,
      })
    }
    this.autoPopulateforLoanAmountNetMonthlyincome()
  }

  autoPopulateforLoanAmountNetMonthlyincome = () => {
    if (this.props.formValues.Monthlyincome) {
      let value = this.props.formValues.LoanAmount.value
      let loanAmount = value.replace(/,/g, '')
      let income = this.props.formValues.Monthlyincome.value
      this.props.fieldPopulator('LoanAmountNetMonthlyincome', {
        type: 'String',
        value: Math.round((Number(loanAmount) / Number(income)) * 100) / 100,
      })
    }
  }

  mapApplicantChecklist = (coApplicantPrefix = '') => {
    try {
      var processVariables = this.props.formValues
      var Data = {
        BranchCode: '',
        [`${coApplicantPrefix}FirstName`]: '',
        [`${coApplicantPrefix}MiddleName`]: '',
        [`${coApplicantPrefix}LastName`]: '',
        [`${coApplicantPrefix}DateOfBirth`]: '',
        [`${coApplicantPrefix}Gender`]: '',
        [`${coApplicantPrefix}MaritalStatus`]: '',
        [`${coApplicantPrefix}EducationLevel`]: '',
        [`${coApplicantPrefix}ESAFCustomer`]: '',
        [`${coApplicantPrefix}Citizenship`]: '',
        [`${coApplicantPrefix}Religion`]: '',
      }
      //add mandatory fields key in this array
      let mandatoryFields = ['BranchName', 'BranchCode', 'FirstName']
      var ApplicantCheck = []
      for (let key in Data) {
        let ApplicantData = { fieldName: '', value: {}, validation: [] }
        if (!validate.isEmpty(processVariables[key])) {
          ApplicantData.fieldName = key
          ApplicantData.value = { ...processVariables[key] }
          if (mandatoryFields.includes(key)) {
            ApplicantData.validation = ['required']
          }
          ApplicantCheck.push(ApplicantData)
        }
      }
      return ApplicantCheck
    } catch (error) {
      throw error
    }
  }

  mapFinanceChecklist = () => {
    try {
      var processVariables = this.props.formValues
      var Data = {
        LoanAmount: '',
        LoanPurpose: '',
        ROI: '',
        ExpectedTenure: '',
        EstimatedEMI: '',
        InsurancePremium: '',
        ProcessingFee: '',
        RepaymentFrequency: '',
      }
      //add mandatory fields key in this array
      let mandatoryFields = [
        'LoanAmount',
        'LoanPurpose',
        'ExpectedTenure',
        'EstimatedEMI',
        'InsurancePremium',
      ]
      let FinanceCheck = []
      for (let key in Data) {
        let FinanceData = { fieldName: '', value: {}, validation: [] }
        if (!validate.isEmpty(processVariables[key])) {
          FinanceData.fieldName = key
          FinanceData.value = { ...processVariables[key] }
          if (mandatoryFields.includes(key)) {
            FinanceData.validation = ['required']
          }
          FinanceCheck.push(FinanceData)
        }
      }
      return FinanceCheck
    } catch (error) {
      throw error
    }
  }

  mapAddressInfoChecklist = (coApplicantPrefix = '') => {
    if (
      this.props.formValues[`${coApplicantPrefix}PresentAddressSameAsApplicant`]
    ) {
      if (
        this.props.formValues[
          `${coApplicantPrefix}PresentAddressSameAsApplicant`
        ].value === 'Yes'
      ) {
        let processVariables = this.props.formValues
        let Data = {
          HouseName: '',
          StreetArea: '',
          City: '',
          Pincode: '',
          PostOffice: '',
          District: '',
          State: '',
          [`${coApplicantPrefix}salariedOfficeName`]: '',
          [`${coApplicantPrefix}SalariedOfficeNo`]: '',
          [`${coApplicantPrefix}SalariedStreetArea`]: '',
          [`${coApplicantPrefix}SalariedCity`]: '',
          [`${coApplicantPrefix}SalariedDistrict`]: '',
          [`${coApplicantPrefix}SalariedState`]: '',
          [`${coApplicantPrefix}SalariedPincode`]: '',
          [`${coApplicantPrefix}SalariedPostOffice`]: '',

          [`${coApplicantPrefix}businessOfficeName`]: '',
          [`${coApplicantPrefix}businessOfficeNo`]: '',
          [`${coApplicantPrefix}businessStreetArea`]: '',
          [`${coApplicantPrefix}businessCity`]: '',
          [`${coApplicantPrefix}businessDistrict`]: '',
          [`${coApplicantPrefix}businessState`]: '',
          [`${coApplicantPrefix}businessPincode`]: '',
          [`${coApplicantPrefix}businessPostOffice`]: '',

          [`${coApplicantPrefix}othrOfficeName`]: '',
          [`${coApplicantPrefix}othrOfficeNo`]: '',
          [`${coApplicantPrefix}othrStreetArea`]: '',
          [`${coApplicantPrefix}othrCity`]: '',
          [`${coApplicantPrefix}othrDistrict`]: '',
          [`${coApplicantPrefix}othrState`]: '',
          [`${coApplicantPrefix}othrPincode`]: '',
          [`${coApplicantPrefix}othrPostOffice`]: '',
        }
        let mandatoryFields = [
          'HouseName',
          'StreetArea',
          'Pincode',
          'District',
          'State',
        ]
        let addrerssCheck = []
        for (let key in Data) {
          let AddressData = { fieldName: '', value: {}, validation: [] }
          if (!validate.isEmpty(processVariables[key])) {
            AddressData.fieldName = key
            AddressData.value = { ...processVariables[key] }
            if (mandatoryFields.includes(key)) {
              AddressData.validation = ['required']
            }
            addrerssCheck.push(AddressData)
          }
        }
        return addrerssCheck
      } else {
        try {
          let processVariables = this.props.formValues
          let Data = {
            [`${coApplicantPrefix}HouseName`]: '',
            [`${coApplicantPrefix}StreetArea`]: '',
            [`${coApplicantPrefix}City`]: '',
            [`${coApplicantPrefix}Pincode`]: '',
            [`${coApplicantPrefix}PostOffice`]: '',
            [`${coApplicantPrefix}District`]: '',
            [`${coApplicantPrefix}State`]: '',

            [`${coApplicantPrefix}permanentHouseName`]: '',
            [`${coApplicantPrefix}permanentStreetArea`]: '',
            [`${coApplicantPrefix}permanentCity`]: '',
            [`${coApplicantPrefix}permanentPincode`]: '',
            [`${coApplicantPrefix}permanentPostOffice`]: '',
            [`${coApplicantPrefix}permanentDistrict`]: '',
            [`${coApplicantPrefix}permanentState`]: '',

            [`${coApplicantPrefix}CorrespondenceHouseName`]: '',
            [`${coApplicantPrefix}CorrespondenceStreetArea`]: '',
            [`${coApplicantPrefix}CorrespondenceCity`]: '',
            [`${coApplicantPrefix}CorrespondencePincode`]: '',
            [`${coApplicantPrefix}CorrespondencePostOffice`]: '',
            [`${coApplicantPrefix}CorrespondenceDistrict`]: '',
            [`${coApplicantPrefix}CorrespondenceState`]: '',

            [`${coApplicantPrefix}salariedOfficeName`]: '',
            [`${coApplicantPrefix}SalariedOfficeNo`]: '',
            [`${coApplicantPrefix}SalariedStreetArea`]: '',
            [`${coApplicantPrefix}SalariedCity`]: '',
            [`${coApplicantPrefix}SalariedDistrict`]: '',
            [`${coApplicantPrefix}SalariedState`]: '',
            [`${coApplicantPrefix}SalariedPincode`]: '',
            [`${coApplicantPrefix}SalariedPostOffice`]: '',

            [`${coApplicantPrefix}businessOfficeName`]: '',
            [`${coApplicantPrefix}businessOfficeNo`]: '',
            [`${coApplicantPrefix}businessStreetArea`]: '',
            [`${coApplicantPrefix}businessCity`]: '',
            [`${coApplicantPrefix}businessDistrict`]: '',
            [`${coApplicantPrefix}businessState`]: '',
            [`${coApplicantPrefix}businessPincode`]: '',
            [`${coApplicantPrefix}businessPostOffice`]: '',

            [`${coApplicantPrefix}othrOfficeName`]: '',
            [`${coApplicantPrefix}othrOfficeNo`]: '',
            [`${coApplicantPrefix}othrStreetArea`]: '',
            [`${coApplicantPrefix}othrCity`]: '',
            [`${coApplicantPrefix}othrDistrict`]: '',
            [`${coApplicantPrefix}othrState`]: '',
            [`${coApplicantPrefix}othrPincode`]: '',
            [`${coApplicantPrefix}othrPostOffice`]: '',
          }
          let mandatoryFields = [
            'HouseName',
            'StreetArea',
            'Pincode',
            'District',
            'State',
          ]
          let addrerssCheck = []
          for (let key in Data) {
            let AddressData = { fieldName: '', value: {}, validation: [] }
            if (!validate.isEmpty(processVariables[key])) {
              AddressData.fieldName = key
              AddressData.value = { ...processVariables[key] }
              if (mandatoryFields.includes(key)) {
                AddressData.validation = ['required']
              }
              addrerssCheck.push(AddressData)
            }
          }
          return addrerssCheck
        } catch (error) {
          throw error
        }
      }
    } else {
      try {
        let processVariables = this.props.formValues
        let Data = {
          [`${coApplicantPrefix}HouseName`]: '',
          [`${coApplicantPrefix}StreetArea`]: '',
          [`${coApplicantPrefix}City`]: '',
          [`${coApplicantPrefix}Pincode`]: '',
          [`${coApplicantPrefix}PostOffice`]: '',
          [`${coApplicantPrefix}District`]: '',
          [`${coApplicantPrefix}State`]: '',

          [`${coApplicantPrefix}permanentHouseName`]: '',
          [`${coApplicantPrefix}permanentStreetArea`]: '',
          [`${coApplicantPrefix}permanentCity`]: '',
          [`${coApplicantPrefix}permanentPincode`]: '',
          [`${coApplicantPrefix}permanentPostOffice`]: '',
          [`${coApplicantPrefix}permanentDistrict`]: '',
          [`${coApplicantPrefix}permanentState`]: '',

          [`${coApplicantPrefix}CorrespondenceHouseName`]: '',
          [`${coApplicantPrefix}CorrespondenceStreetArea`]: '',
          [`${coApplicantPrefix}CorrespondenceCity`]: '',
          [`${coApplicantPrefix}CorrespondencePincode`]: '',
          [`${coApplicantPrefix}CorrespondencePostOffice`]: '',
          [`${coApplicantPrefix}CorrespondenceDistrict`]: '',
          [`${coApplicantPrefix}CorrespondenceState`]: '',

          [`${coApplicantPrefix}salariedOfficeName`]: '',
          [`${coApplicantPrefix}SalariedOfficeNo`]: '',
          [`${coApplicantPrefix}SalariedStreetArea`]: '',
          [`${coApplicantPrefix}SalariedCity`]: '',
          [`${coApplicantPrefix}SalariedDistrict`]: '',
          [`${coApplicantPrefix}SalariedState`]: '',
          [`${coApplicantPrefix}SalariedPincode`]: '',
          [`${coApplicantPrefix}SalariedPostOffice`]: '',

          [`${coApplicantPrefix}businessOfficeName`]: '',
          [`${coApplicantPrefix}businessOfficeNo`]: '',
          [`${coApplicantPrefix}businessStreetArea`]: '',
          [`${coApplicantPrefix}businessCity`]: '',
          [`${coApplicantPrefix}businessDistrict`]: '',
          [`${coApplicantPrefix}businessState`]: '',
          [`${coApplicantPrefix}businessPincode`]: '',
          [`${coApplicantPrefix}businessPostOffice`]: '',

          [`${coApplicantPrefix}othrOfficeName`]: '',
          [`${coApplicantPrefix}othrOfficeNo`]: '',
          [`${coApplicantPrefix}othrStreetArea`]: '',
          [`${coApplicantPrefix}othrCity`]: '',
          [`${coApplicantPrefix}othrDistrict`]: '',
          [`${coApplicantPrefix}othrState`]: '',
          [`${coApplicantPrefix}othrPincode`]: '',
          [`${coApplicantPrefix}othrPostOffice`]: '',
        }
        let mandatoryFields = [
          'HouseName',
          'StreetArea',
          'Pincode',
          'District',
          'State',
        ]
        let addrerssCheck = []
        for (let key in Data) {
          let AddressData = { fieldName: '', value: {}, validation: [] }
          if (!validate.isEmpty(processVariables[key])) {
            AddressData.fieldName = key
            AddressData.value = { ...processVariables[key] }
            if (mandatoryFields.includes(key)) {
              AddressData.validation = ['required']
            }
            addrerssCheck.push(AddressData)
          }
        }
        return addrerssCheck
      } catch (error) {
        throw error
      }
    }
  }

  mapKYCImageschecklist = (coApplicantPrefix = '') => {
    try {
      let processVariables = this.props.formValues
      let data = {
        [`${coApplicantPrefix}panImg`]: {},
        [`${coApplicantPrefix}aadhaarImg`]: {},
        [`${coApplicantPrefix}Vehicleimage`]: {},
        [`${coApplicantPrefix}DLImg`]: {},
        [`${coApplicantPrefix}passportImg`]: {},
        [`${coApplicantPrefix}voterIdImage`]: {},
        [`${coApplicantPrefix}singleKycimage`]: {},
      }
      // let mandatoryFields = ["panImg", "aadhaarImg"];
      let KYCImagescheck = [...this.state.KYCImageschecklist]
      for (let key in data) {
        let KYCImageData = { fieldName: '', value: {}, validation: [] }
        if (
          !validate.isEmpty(processVariables[key]) &&
          processVariables[key].value !== null
        ) {
          if (processVariables[key].type === 'Object') {
            KYCImageData.fieldName = key
            KYCImageData.value = {
              type: 'Object',
              value: JSON.parse(processVariables[key].value).url,
            }
          } else {
            KYCImageData.fieldName = key
            KYCImageData.value = { ...processVariables[key] }
          }
          // if (mandatoryFields.includes(key)) {
          //     KYCImageData.validation = ["required"];
          // }
          KYCImagescheck.push(KYCImageData)
        }
      }
      this.setState({ KYCImageschecklist: KYCImagescheck })
    } catch (error) {
      throw error
    }
  }

  mapKYCDocumentChecklist = (coApplicantPrefix = '') => {
    try {
      var processVariables = this.props.formValues
      var Data = {
        [`${coApplicantPrefix}AadhaarName`]: '',
        [`${coApplicantPrefix}AadhaarDOB`]: '',
        [`${coApplicantPrefix}AadhaarNo`]: '',
        [`${coApplicantPrefix}AadhaarGender`]: '',
        [`${coApplicantPrefix}DL_BloodGroup`]: '',
        [`${coApplicantPrefix}DL_DateOfBirth`]: '',
        [`${coApplicantPrefix}DL_IssueDate`]: '',
        [`${coApplicantPrefix}DL_ExpiryDate`]: '',
        [`${coApplicantPrefix}DL_Number`]: '',
        [`${coApplicantPrefix}DL_State`]: '',
        [`${coApplicantPrefix}panName`]: '',
        [`${coApplicantPrefix}panNo`]: '',
        [`${coApplicantPrefix}panDOB`]: '',
        [`${coApplicantPrefix}panFatherName`]: '',
        [`${coApplicantPrefix}passportType`]: '',
        [`${coApplicantPrefix}passportNo`]: '',
        [`${coApplicantPrefix}passportDOB`]: '',
        [`${coApplicantPrefix}passportGender`]: '',
        [`${coApplicantPrefix}passport_IssueDate`]: '',
        [`${coApplicantPrefix}passport_ExpiryDate`]: '',
        [`${coApplicantPrefix}VoterIDNumber`]: '',
        [`${coApplicantPrefix}VoterIDName`]: '',
        [`${coApplicantPrefix}VoterIDGender`]: '',
        [`${coApplicantPrefix}VoterIDFatherName`]: '',
        [`${coApplicantPrefix}ResidencyStatus`]: '',
      }
      //add mandatory fields key in this array
      let mandatoryFields = ['DateOfBirth', 'AadhaarNumber']
      var KYCcheck = []
      for (let key in Data) {
        let KYCData = { fieldName: '', value: {}, validation: [] }
        if (!validate.isEmpty(processVariables[key])) {
          KYCData.fieldName = key
          KYCData.value = { ...processVariables[key] }
          if (mandatoryFields.includes(key)) {
            KYCData.validation = ['required']
          }
          KYCcheck.push(KYCData)
        }
      }
      return KYCcheck
    } catch (error) {
      throw error
    }
  }

  mapVehicleChecklist = () => {
    try {
      var processVariables = this.props.formValues
      var Data = {
        VehicleType: '',
        Manufacturer: '',
        AssetModel: '',
        AssetMake: '',
        ExShowroomPrice: '',
        InsuranceAmount: '',
        RoadTax: '',
        OtherCosts: '',
        OnRoadPrice: '',
        Margin: '',
      }
      //add mandatory fields key in this array
      let mandatoryFields = ['VehicleType']
      var VehicleCheck = []
      for (let key in Data) {
        let VehicleData = { fieldName: '', value: {}, validation: [] }
        if (!validate.isEmpty(processVariables[key])) {
          VehicleData.fieldName = key
          VehicleData.value = { ...processVariables[key] }
          if (mandatoryFields.includes(key)) {
            VehicleData.validation = ['required']
          }
          VehicleCheck.push(VehicleData)
        }
      }

      return VehicleCheck
    } catch (error) {
      throw error
    }
  }

  mapReferenceChecklist = () => {
    var processVariables = this.props.formValues
    try {
      let ReferenceCheck = [
        {
          fieldName: 'Reference 1',
          fieldValue: {},
          validation: [],
        },
        {
          fieldName: 'Reference 2',
          fieldValue: {},
          validation: [],
        },
      ]

      for (let index = 0; index < ReferenceCheck.length; index++) {
        let element = ReferenceCheck[index]
        element.fieldValue = {
          type: 'String',
          value: processVariables[`ReferenceName_${index + 1}`]
            ? JSON.stringify({
                Name: processVariables[`ReferenceName_${index + 1}`].value,
                Address:
                  processVariables[`ReferenceAddress_${index + 1}`].value,
                Mobile: processVariables[`ReferenceMobile_${index + 1}`].value,
                Type: processVariables[`ReferenceType_${index + 1}`]
                  ? processVariables[`ReferenceType_${index + 1}`].value
                  : '',
              })
            : '',
          valueInfo: {},
          fieldType: 'Reference',
        }
        element.validation = ['required']
      }
      return ReferenceCheck
    } catch (error) {
      throw error
    }
  }

  handleScoreCardView = () => {
    return (
      <>
        <div>
          <h3>{'Score Card Reference Data'}</h3>
        </div>
        <div className="form-section-content" style={{ display: 'block' }}>
          <div className="flex-row">
            <div className="form-group col-xs-12 col-md-12">
              <Table
                columns={this.state.columnData}
                dataSource={JSON.parse(
                  this.props.formValues.scoreCardData.value,
                )}
                size="middle"
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  IncomeChange = (key) => async (value) => {
    await this.props.fieldPopulator(key, {
      type: 'String',
      value: String(value.value ? value.value : value),
    })
    let c1ApplicantSalary = this.props.formValues.c1ApplicantSalary
      ? this.props.formValues.c1ApplicantSalary.value
      : 0
    let c2ApplicantSalary = this.props.formValues.c2ApplicantSalary
      ? this.props.formValues.c2ApplicantSalary.value
      : 0
    let c3ApplicantSalary = this.props.formValues.c3ApplicantSalary
      ? this.props.formValues.c3ApplicantSalary.value
      : 0
    let c4ApplicantSalary = this.props.formValues.c4ApplicantSalary
      ? this.props.formValues.c4ApplicantSalary.value
      : 0
    let ApplicantSalary = this.props.formValues.ApplicantSalary
      ? this.props.formValues.ApplicantSalary.value
      : 0
    let income =
      Number(c1ApplicantSalary) +
      Number(c2ApplicantSalary) +
      Number(c3ApplicantSalary) +
      Number(c4ApplicantSalary) +
      Number(ApplicantSalary)
    this.props.fieldPopulator('BO_NetIncome', { type: 'String', value: income })
    this.handleTotalObligation(0, income, 0)
    this.handleMonthlyincome(income)
  }
  ObligationChange = (key) => async (value) => {
    await this.props.fieldPopulator(key, {
      type: 'String',
      value: String(value.value ? value.value : value),
    })
    let c1obligation = this.props.formValues.c1obligation
      ? this.props.formValues.c1obligation.value
      : 0
    let c2obligation = this.props.formValues.c2obligation
      ? this.props.formValues.c2obligation.value
      : 0
    let c3obligation = this.props.formValues.c3obligation
      ? this.props.formValues.c3obligation.value
      : 0
    let c4obligation = this.props.formValues.c4obligation
      ? this.props.formValues.c4obligation.value
      : 0
    let appobligation = this.props.formValues.appobligation
      ? this.props.formValues.appobligation.value
      : 0
    let obligation =
      Number(c1obligation) +
      Number(c2obligation) +
      Number(c3obligation) +
      Number(c4obligation) +
      Number(appobligation)
    this.props.fieldPopulator('BO_Obligation', {
      type: 'String',
      value: String(obligation),
    })
    this.handleTotalObligation(0, 0, obligation)
  }

  ExpenseChange = (key) => async (value) => {
    await this.props.fieldPopulator(key, {
      type: 'String',
      value: String(value.value ? value.value : value),
    })
    let c1Expense = this.props.formValues.c1appExpense
      ? this.props.formValues.c1appExpense.value
      : 0
    let c2Expense = this.props.formValues.c2appExpense
      ? this.props.formValues.c2appExpense.value
      : 0
    let c3Expense = this.props.formValues.c3appExpense
      ? this.props.formValues.c3appExpense.value
      : 0
    let c4Expense = this.props.formValues.c4appExpense
      ? this.props.formValues.c4appExpense.value
      : 0
    let appExpense = this.props.formValues.appExpense
      ? this.props.formValues.appExpense.value
      : 0
    let totalExpense =
      Number(c1Expense) +
      Number(c2Expense) +
      Number(c3Expense) +
      Number(c4Expense) +
      Number(appExpense)
    this.props.fieldPopulator('BO_ExpenseTotal', {
      type: 'String',
      value: String(totalExpense),
    })
    this.handleTotalObligation(totalExpense, 0, 0)
  }

  handleMemberExpense = () => {
    let formValues = this.props.formValues
    let app_expenseTotal = formValues.ExpenseTotal
      ? formValues.ExpenseTotal.value
      : 0
    this.props.fieldPopulator('appExpense', {
      type: 'String',
      value: app_expenseTotal,
    })
    let c1app_expenseTotal = formValues.c1ExpenseTotal
      ? formValues.c1ExpenseTotal.value
      : 0
    this.props.fieldPopulator('c1appExpense', {
      type: 'String',
      value: c1app_expenseTotal,
    })
    let c2app_expenseTotal = formValues.c2ExpenseTotal
      ? formValues.c2ExpenseTotal.value
      : 0
    this.props.fieldPopulator('c2appExpense', {
      type: 'String',
      value: c2app_expenseTotal,
    })
    let c3app_expenseTotal = formValues.c3ExpenseTotal
      ? formValues.c3ExpenseTotal.value
      : 0
    this.props.fieldPopulator('c3appExpense', {
      type: 'String',
      value: c3app_expenseTotal,
    })
    let c4app_expenseTotal = formValues.c4ExpenseTotal
      ? formValues.c4ExpenseTotal.value
      : 0
    this.props.fieldPopulator('c4appExpense', {
      type: 'String',
      value: c4app_expenseTotal,
    })
    let totalExpense = Math.round(
      parseInt(app_expenseTotal) +
        parseInt(c1app_expenseTotal) +
        parseInt(c2app_expenseTotal) +
        parseInt(c3app_expenseTotal) +
        parseInt(c4app_expenseTotal),
    )
    this.props.fieldPopulator('BO_ExpenseTotal', {
      type: 'String',
      value: totalExpense,
    })
  }

  handleTotalObligation = (expense = 0, income = 0, obligation = 0) => {
    let obligationValue =
      obligation === 0
        ? isNaN(parseInt(this.props.formValues.BO_Obligation.value))
          ? 0
          : parseInt(this.props.formValues.BO_Obligation.value)
        : isNaN(obligation)
        ? 0
        : obligation
    let expenseValue =
      expense === 0
        ? isNaN(parseInt(this.props.formValues.BO_ExpenseTotal.value))
          ? 0
          : parseInt(this.props.formValues.BO_ExpenseTotal.value)
        : isNaN(expense)
        ? 0
        : expense
    let incomeValue =
      income === 0
        ? isNaN(parseInt(this.props.formValues.BO_NetIncome.value))
          ? 0
          : parseInt(this.props.formValues.BO_NetIncome.value)
        : isNaN(income)
        ? 0
        : income
    // from HighmarkResponse
    // let totalobligation = formValues.TotalMonthlyPayment ? formValues.TotalMonthlyPayment.value : 0;
    let EMI = this.props.formValues.EstimatedEMI.value.replace(/,/g, '')
    let totalobligation = Math.round(
      obligationValue + expenseValue + parseInt(EMI),
    )
    this.props.fieldPopulator('BO_TotalObligation', {
      type: 'String',
      value: totalobligation,
    })
    let foir = Number((totalobligation / incomeValue) * 100).toFixed(2)
    this.props.fieldPopulator('FOIR_inPercent', { type: 'String', value: foir })
  }

  handleCAMgeneration = () => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    axios({
      url: `${Config.apiUrl}/v1/camReport`,
      method: 'POST',
      headers: { Authorization: authToken },
      responseType: 'arraybuffer',
      data: this.mapCAMvalues(),
    })
      .then((response) => {
        let pdfData = response.data
        //convert arrayBuffer to blob
        var blob = new Blob([pdfData], { type: 'application/pdf' })
        //convert the blob object to URL
        let pdfFile = window.URL.createObjectURL(blob)
        window.open(pdfFile)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  mapCAMvalues() {
    var processVariables = this.props.formValues
    var data = {
      BranchName: '',
      LoanPurpose: '',
      LoanAmount: '',
      BorrowerName: '',
      Age: '',
      OccupationType: '',
      Citizenship: '',
      Monthlyincome: '',
      WorkItemNo: '',
      NetworthTotalLoans: '',
      TotalLoans: '',
      ApplicantBureauScore: '',
      'Co-ApplicantBureauScore': '',
      MainSourceofincome: '',
      ResidenceType: '',
      ResidentialStatus: '',
      TypeofJob: '',
      BusinessType: '',
      CurrentJobExperience: '',
      CurrentBusinessExperience: '',
      ExperienceCurrentJob: '',
      JobType: '',
      finalCreditScore: '',
      creditOfficerName: '',
      ESAFCustomer: '',
      OfficerName: '',
      Geolocation: '',
      SalesOfficerComments: '',
      BackOfficerComments: '',
      L1OfficerComments: '',
      L2OfficerComments: '',
      finalApprovalComments: '',
      IndustryExperience: '',
      CreditHistory: '',
      ReferenceDone: '',
      utilizationofLoan: '',
      Mitigants: '',
      CashFlow: '',
      Negatives: '',
      additionalConditions: '',
      CIBILscore: '',
      FOIR_inPercent: '',
      'Reference 1_Remarks': '',
      'Reference 2_Remarks': '',
      EstimatedEMI: '',
      startedBy: '',
      CoApplicant_1: {
        c1FirstName: '',
        c1Age: '',
        c1fatherName: '',
        c1AadhaarNo: '',
        c1VoterID: '',
        c1PermanentAddress: '',
        c1CurrentAddress: '',
        c1BusinessType: '',
        c1JobType: '',
        c1mobileNumber: '',
        c1relationShipWithApplicant: '',
        c1salariedMonthlyGrossSalary: '',
        c1businessMonthlyGrossSalary: '',
        c1othersGrossMonthlyIncome: '',
        c1MainSourceofincome: '',
        c1subSector: '',
        c1NetworthTotalLoans: '',
        c1TotalLoans: '',
        c1salariedExperienceCurrentJob: '',
        c1CurrentBusinessExp: '',
        c1ExperienceCurrentJob: '',
        c1CIBILScore: '',
      },
      CoApplicant_2: {
        c2FirstName: '',
        c2relationShipWithApplicant: '',
        c2BusinessType: '',
        c2JobType: '',
        c2salariedMonthlyGrossSalary: '',
        c2businessMonthlyGrossSalary: '',
        c2othersGrossMonthlyIncome: '',
        c2CIBILScore: '',
        c2salariedExperienceCurrentJob: '',
        c2CurrentBusinessExp: '',
        c2ExperienceCurrentJob: '',
      },
      CoApplicant_3: {
        c3FirstName: '',
        c3relationShipWithApplicant: '',
        c3BusinessType: '',
        c3JobType: '',
        c3salariedMonthlyGrossSalary: '',
        c3businessMonthlyGrossSalary: '',
        c3othersGrossMonthlyIncome: '',
        c3CIBILScore: '',
        c3salariedExperienceCurrentJob: '',
        c3CurrentBusinessExp: '',
        c3ExperienceCurrentJob: '',
      },
      CoApplicant_4: {
        c4FirstName: '',
        c4relationShipWithApplicant: '',
        c4BusinessType: '',
        c4JobType: '',
        c4salariedMonthlyGrossSalary: '',
        c4businessMonthlyGrossSalary: '',
        c4othersGrossMonthlyIncome: '',
        c4CIBILScore: '',
        'c4Co-ApplicantBureauScore': '',
        c4salariedExperienceCurrentJob: '',
        c4CurrentBusinessExp: '',
        c4ExperienceCurrentJob: '',
      },
      Guarantor_1: {
        g1FirstName: '',
        g1relationShipWithApplicant: '',
        g1MonthlyGrossSalary: '',
        g1businessMonthlyGrossSalary: '',
        g1GrossMonthlyIncome: '',
        g1TotalMonthlySurplus: '',
      },
      Guarantor_2: {
        g2FirstName: '',
        g2relationShipWithApplicant: '',
        g2MonthlyGrossSalary: '',
        g2businessMonthlyGrossSalary: '',
        g2GrossMonthlyIncome: '',
        g2TotalMonthlySurplus: '',
      },
    }
    let finalData = {}
    finalData['ApplicationDate'] = this.props.formValues.ApplicationDate
      ? moment(this.props.formValues.ApplicationDate.value)
          .format('DD-MM-YYYY')
          .slice(0, 10)
      : ''
    finalData['RecommendedLoanTenure'] = this.props.formValues
      .FinalApprovalLoanTenure
      ? this.props.formValues.FinalApprovalLoanTenure.value
      : this.props.formValues.L2RecommendedLoanTenure
      ? this.props.formValues.L2RecommendedLoanTenure.value
      : this.props.formValues.L1RecommendedLoanTenure
      ? this.props.formValues.L1RecommendedLoanTenure.value
      : this.props.formValues.BO_RecommendedLoanTenure
      ? this.props.formValues.BO_RecommendedLoanTenure.value
      : this.props.formValues.tenureInput.value
    finalData['RecommendedLoanAmount'] = this.props.formValues
      .FinalApprovalLoanAmount
      ? this.props.formValues.FinalApprovalLoanAmount.value
      : this.props.formValues.L2RecommendedLoanAmount
      ? this.props.formValues.L2RecommendedLoanAmount.value
      : this.props.formValues.L1RecommendedLoanAmount
      ? this.props.formValues.L1RecommendedLoanAmount.value
      : this.props.formValues.BO_RecommendedLoanAmount
      ? this.props.formValues.BO_RecommendedLoanAmount.value
      : this.props.formValues.LoanAmount.value
    for (let parentKey in data) {
      if (Object.keys(data[parentKey]).length > 0) {
        for (let childKey in data[parentKey]) {
          data[parentKey][childKey] = processVariables[childKey] || ''
          if (data[parentKey][childKey]) {
            finalData[parentKey] = {
              ...finalData[parentKey],
              [childKey]: data[parentKey][childKey]['value'],
            }
          }
        }
      } else {
        data[parentKey] = processVariables[parentKey]
        finalData = {
          ...finalData,
          [parentKey]: data[parentKey] ? data[parentKey]['value'] : '',
        }
      }
    }
    return finalData
  }

  handleRecommendedloanAmount = (e) => {
    this.setState({ amount: e })
    if (e !== 0) {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: e,
      })
    } else {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: '-',
      })
    }
  }

  handleRecommendedTenure = (e) => {
    this.setState({ tenure: e })
    if (e !== 0) {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: e,
      })
    } else {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: '-',
      })
    }
  }

  autoPopulateforNetWorth = (data) => {
    if (this.props.formValues.Networth) {
      if (data.value !== '0') {
        const networthTotalLoans =
          Math.round(
            (Number(this.props.formValues.Networth.value) /
              Number(data.value)) *
              100,
          ) / 100
        this.props.fieldPopulator('NetworthTotalLoans', {
          type: 'String',
          value: networthTotalLoans.toString(),
        })
      } else if (data.value === '0') {
        this.props.fieldPopulator('NetworthTotalLoans', {
          type: 'String',
          value: 0,
        })
      }
    }
  }

  calculateCreditScore = () => {
    if (this.props.formValues.BO_NetIncome) {
      let BO_NetIncome = this.props.formValues.BO_NetIncome.value
      this.handleMonthlyincome(BO_NetIncome)
    }
    this.setState({ creditScorevalue: true })
    let formvalues = this.props.formValues
    let creditScore = {}
    let keydata = Object.keys(formvalues)
    let valuedata = Object.values(formvalues)
    for (let i = 0; i < keydata.length; i++) {
      creditScore[keydata[i]] = valuedata[i]['value']
    }
    let individualCreditScore = {}
    if (creditScore['Age']) {
      let getagescore = this.getscore('Age', creditScore['Age'])
      individualCreditScore['Age'] = (2 / 100) * getagescore
    }
    if (creditScore['GenderAndMaritalstatus']) {
      var getgenderscore = this.getscore(
        'GenderAndMaritalstatus',
        creditScore['GenderAndMaritalstatus'],
      )
      individualCreditScore['GenderAndMaritalstatus'] =
        (2 / 100) * getgenderscore
    }
    if (creditScore['DrivingLicence']) {
      var getlicencescore = this.getscore(
        'DrivingLicence',
        creditScore['DrivingLicence'],
      )
      individualCreditScore['DrivingLicence'] = (1 / 100) * getlicencescore
    }
    if (creditScore['PopulationGroup']) {
      var getpopulatingroupscore = this.getscore(
        'PopulationGroup',
        creditScore['PopulationGroup'],
      )
      individualCreditScore['PopulationGroup'] =
        (2 / 100) * getpopulatingroupscore
    }
    if (creditScore['EducationLevel']) {
      var geteducationqualificationscore = this.getscore(
        'EducationLevel',
        creditScore['EducationLevel'],
      )
      individualCreditScore['EducationLevel'] =
        Number(3 / 100) * geteducationqualificationscore
    }
    if (creditScore['ResidenceType']) {
      var getResidenceTypescore = this.getscore(
        'ResidenceType',
        creditScore['ResidenceType'],
      )
      individualCreditScore['ResidenceType'] = (5 / 100) * getResidenceTypescore
    }
    if (creditScore['ExperienceinCurrentEmployment']) {
      var getExperienceinCurrentEmploymentScore = this.getscore(
        'ExperienceinCurrentEmployment',
        creditScore['ExperienceinCurrentEmployment'],
      )
      individualCreditScore['ExperienceinCurrentEmployment'] =
        Math.round((5 / 100) * getExperienceinCurrentEmploymentScore * 100) /
        100
    }
    if (creditScore['Monthlyincome']) {
      var getMonthlyIncomeScore = this.getscore(
        'Monthlyincome',
        creditScore['Monthlyincome'],
      )
      individualCreditScore['Monthlyincome'] =
        Number(1 / 100) * getMonthlyIncomeScore
    }
    if (creditScore['exshowroomprice']) {
      if (creditScore['Monthlyincome'] < 25000) {
        let monthlyIncomeschema = {
          'upto 70000': 5,
          'Rs.70,000 to Rs.1,20,000': 0,
          'Rs.1,20,000 to Rs.2,00,000': -5,
          'above Rs.2,00,000': -10,
        }
        if (creditScore['exshowroomprice'] < 70000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['upto 70000']
        } else if (
          70000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 120000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.70,000 to Rs.1,20,000']
        } else if (
          120000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 200000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.1,20,000 to Rs.2,00,000']
        } else if (creditScore['exshowroomprice'] >= 200000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['above Rs.2,00,000']
        }
      } else if (
        25000 <= creditScore['Monthlyincome'] &&
        creditScore['Monthlyincome'] < 40000
      ) {
        let monthlyIncomeschema = {
          'upto 70000': 10,
          'Rs.70,000 to Rs.1,20,000': 5,
          'Rs.1,20,000 to Rs.2,00,000': 0,
          'above Rs.2,00,000': -5,
        }
        if (creditScore['exshowroomprice'] < 70000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['upto 70000']
        } else if (
          70000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 120000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.70,000 to Rs.1,20,000']
        } else if (
          120000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 200000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.1,20,000 to Rs.2,00,000']
        } else if (creditScore['exshowroomprice'] >= 200000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['above Rs.2,00,000']
        }
      } else if (
        40000 <= creditScore['Monthlyincome'] &&
        creditScore['Monthlyincome'] < 65000
      ) {
        let monthlyIncomeschema = {
          'upto 70000': 10,
          'Rs.70,000 to Rs.1,20,000': 10,
          'Rs.1,20,000 to Rs.2,00,000': 5,
          'above Rs.2,00,000': 0,
        }
        if (creditScore['exshowroomprice'] < 70000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['upto 70000']
        } else if (
          70000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 120000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.70,000 to Rs.1,20,000']
        } else if (
          120000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 200000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.1,20,000 to Rs.2,00,000']
        } else if (creditScore['exshowroomprice'] >= 200000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['above Rs.2,00,000']
        }
      } else if (creditScore['Monthlyincome'] >= 65000) {
        let monthlyIncomeschema = {
          'upto 70000': 10,
          'Rs.70,000 to Rs.1,20,000': 10,
          'Rs.1,20,000 to Rs.2,00,000': 10,
          'above Rs.2,00,000': 5,
        }
        if (creditScore['exshowroomprice'] < 70000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['upto 70000']
        } else if (
          70000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 120000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.70,000 to Rs.1,20,000']
        } else if (
          120000 <= creditScore['exshowroomprice'] &&
          creditScore['exshowroomprice'] < 200000
        ) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['Rs.1,20,000 to Rs.2,00,000']
        } else if (creditScore['exshowroomprice'] >= 200000) {
          individualCreditScore['exshowroomprice'] =
            (10 / 100) * monthlyIncomeschema['above Rs.2,00,000']
        }
      }
    }
    if (creditScore['MainSourceofincome']) {
      var getMainSourceofincomescore = this.getscore(
        'MainSourceofincome',
        creditScore['MainSourceofincome'],
      )
      individualCreditScore['MainSourceofincome'] =
        Math.round((5 / 100) * getMainSourceofincomescore * 100) / 100
    }
    if (creditScore['NetworthTotalLoans']) {
      let getperticularcore = this.getscore(
        'NetworthTotalLoans',
        creditScore['NetworthTotalLoans'],
      )
      individualCreditScore['NetworthTotalLoans'] =
        (3 / 100) * getperticularcore
    }
    if (creditScore['ProofofIncome']) {
      let getperticularcore = this.getscore(
        'ProofofIncome',
        creditScore['ProofofIncome'],
      )
      individualCreditScore['ProofofIncome'] = (3 / 100) * getperticularcore
    }
    if (creditScore['LoanAmountNetMonthlyincome']) {
      let getperticularcore = this.getscore(
        'LoanAmountNetMonthlyincome',
        creditScore['LoanAmountNetMonthlyincome'],
      )
      individualCreditScore['LoanAmountNetMonthlyincome'] =
        (6 / 100) * getperticularcore
    }
    if (creditScore['FOIR_inPercent']) {
      let getperticularcore = this.getscore(
        'FOIR_inPercent',
        Number(creditScore['FOIR_inPercent']),
      )
      individualCreditScore['FOIR_inPercent'] =
        Math.round((15 / 100) * getperticularcore * 100) / 100
    }
    if (creditScore["borrower'soperativeaccount"]) {
      let getperticularcore = this.getscore(
        "borrower'soperativeaccount",
        creditScore["borrower'soperativeaccount"],
      )
      individualCreditScore["borrower'soperativeaccount"] =
        (2 / 100) * getperticularcore
    }
    if (creditScore['ModeofRepayment']) {
      let getperticularcore = this.getscore(
        'ModeofRepayment',
        creditScore['ModeofRepayment'],
      )
      individualCreditScore['ModeofRepayment'] = (1 / 100) * getperticularcore
    }
    if (creditScore['CreditVintage']) {
      let getperticularcore = this.getscore(
        'CreditVintage',
        creditScore['CreditVintage'],
      )
      individualCreditScore['CreditVintage'] = (3 / 100) * getperticularcore
    }
    if (creditScore['ApplicantBureauScore']) {
      let getperticularcore = this.getscore(
        'ApplicantBureauScore',
        Number(creditScore['ApplicantBureauScore']),
      )
      individualCreditScore['ApplicantBureauScore'] =
        (12 / 100) * getperticularcore
    }
    if (creditScore['MaxDPDinlast12months']) {
      let getperticularcore = this.getscore(
        'MaxDPDinlast12months',
        creditScore['MaxDPDinlast12months'],
      )
      individualCreditScore['MaxDPDinlast12months'] =
        (2 / 100) * getperticularcore
    }
    if (creditScore['NoofmonthsDPDexceeded30daysinlast12months']) {
      let getperticularcore = this.getscore(
        'NoofmonthsDPDexceeded30daysinlast12months',
        creditScore['NoofmonthsDPDexceeded30daysinlast12months'],
      )
      individualCreditScore['NoofmonthsDPDexceeded30daysinlast12months'] =
        (2 / 100) * getperticularcore
    }
    if (creditScore['Co-ApplicantBureauScore']) {
      let getperticularcore = this.getscore(
        'Co-ApplicantBureauScore',
        creditScore['Co-ApplicantBureauScore'].trim(),
      )
      individualCreditScore['Co-ApplicantBureauScore'] =
        (2 / 100) * getperticularcore
    }
    if (creditScore['CreditHistorypriorto12months']) {
      let getperticularcore = this.getscore(
        'CreditHistorypriorto12months',
        creditScore['CreditHistorypriorto12months'],
      )
      individualCreditScore['CreditHistorypriorto12months'] =
        (1 / 100) * getperticularcore
    }
    if (creditScore['Co-ApplicantNetWorthtoloanAmount']) {
      let getperticularcore = this.getscore(
        'Co-ApplicantNetWorthtoloanAmount',
        creditScore['Co-ApplicantNetWorthtoloanAmount'],
      )
      individualCreditScore['Co-ApplicantNetWorthtoloanAmount'] =
        (5 / 100) * getperticularcore
    }
    if (creditScore['LoantoValue']) {
      if (creditScore['exshowroomprice'] < 70000) {
        let LoantoValueJson = {
          '<=60%': 10,
          '>60% to 65%': 10,
          '>65% to 70%': 10,
          '>70% to 75%': 10,
          '>75% to 80%': 8,
          '>80% to 85%': 6,
          '>85% to 90%': 5,
          '>90% to 95%': 4,
          '>95%': 3,
        }
        individualCreditScore['LoantoValue'] =
          Math.round(
            (5 / 100) * LoantoValueJson[creditScore['LoantoValue']] * 100,
          ) / 100
      } else if (
        70000 <= creditScore['exshowroomprice'] &&
        creditScore['exshowroomprice'] < 120000
      ) {
        let LoantoValueJson = {
          '<=60%': 10,
          '>60% to 65%': 10,
          '>65% to 70%': 10,
          '>70% to 75%': 8,
          '>75% to 80%': 6,
          '>80% to 85%': 5,
          '>85% to 90%': 4,
          '>90% to 95%': 3,
          '>95%': 2,
        }
        individualCreditScore['LoantoValue'] =
          Math.round(
            (5 / 100) * LoantoValueJson[creditScore['LoantoValue']] * 100,
          ) / 100
      } else if (
        120000 <= creditScore['exshowroomprice'] &&
        creditScore['exshowroomprice'] < 200000
      ) {
        let LoantoValueJson = {
          '<=60%': 10,
          '>60% to 65%': 10,
          '>65% to 70%': 8,
          '>70% to 75%': 6,
          '>75% to 80%': 5,
          '>80% to 85%': 4,
          '>85% to 90%': 3,
          '>90% to 95%': 2,
          '>95%': 0,
        }
        individualCreditScore['LoantoValue'] =
          Math.round(
            (5 / 100) * LoantoValueJson[creditScore['LoantoValue']] * 100,
          ) / 100
      } else if (creditScore['exshowroomprice'] >= 200000) {
        let LoantoValueJson = {
          '<=60%': 10,
          '>60% to 65%': 8,
          '>65% to 70%': 6,
          '>70% to 75%': 5,
          '>75% to 80%': 4,
          '>80% to 85%': 3,
          '>85% to 90%': 2,
          '>90% to 95%': 0,
          '>95%': -2,
        }

        individualCreditScore['LoantoValue'] =
          Math.round(
            (5 / 100) * LoantoValueJson[creditScore['LoantoValue']] * 100,
          ) / 100
      }
    }

    // lines to populate in table view
    let scoreCardData = []
    for (const key in individualCreditScore) {
      let data = {
        data: key,
        ActualValue: creditScore[key],
        // Score: individualCreditScore[key]
      }
      scoreCardData.push(data)
    }
    this.setState({ scoreCardData: scoreCardData })
    this.props.fieldPopulator('scoreCardData', {
      type: 'String',
      value: JSON.stringify(scoreCardData),
    })
    //add all the value
    let CreditScoreArray = Object.values(individualCreditScore)

    let finalCreditScore = 0
    CreditScoreArray.forEach((element) => {
      finalCreditScore = Number(finalCreditScore.toFixed(2)) + Number(element)
    })
    this.setState({ creditscore: finalCreditScore.toFixed(2) })
    this.props.fieldPopulator('finalCreditScore', {
      type: 'String',
      value: finalCreditScore.toFixed(2),
    })

    let RiskGrade = {
      '<1.50': 'EB10',
      '>1.50 to 2.00': 'EB9',
      '>2.00 to 2.50': 'EB8',
      '>2.50 to 3.00': 'EB7',
      '>3.00 to 3.75': 'EB6',
      '>3.75 to 4.5': 'EB5',
      '>4.50 to 5.25': 'EB4',
      '>5.25 to 6.25': 'EB3',
      '>6.25 to 7.25': 'EB2',
      '>7.25 to 10': 'EB1',
    }
    let LevelofRisk = {
      EB1: 'Extremely Low',
      EB2: 'Very Low',
      EB3: 'Low',
      EB4: 'moderate',
      EB5: 'More than moderate',
      EB6: 'Near to High',
      EB7: 'High',
      EB8: 'Very High',
      EB9: 'Extremely High',
      EB10: 'Absolute',
    }

    if (finalCreditScore <= 1.5) {
      this.setState({
        CreditScoreGrade: RiskGrade['<1.50'],
        LevelofRisk: LevelofRisk['EB10'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['<1.50'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB10'],
      })
    } else if (1.5 < finalCreditScore && finalCreditScore <= 2.0) {
      this.setState({
        CreditScoreGrade: RiskGrade['>1.50 to 2.00'],
        LevelofRisk: LevelofRisk['EB9'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>1.50 to 2.00'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB9'],
      })
    } else if (2.0 < finalCreditScore && finalCreditScore <= 2.5) {
      this.setState({
        CreditScoreGrade: RiskGrade['>2.00 to 2.50'],
        LevelofRisk: LevelofRisk['EB8'],
      })
      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>2.00 to 2.50'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB8'],
      })
    } else if (2.5 < finalCreditScore && finalCreditScore <= 3.0) {
      this.setState({
        CreditScoreGrade: RiskGrade['>2.50 to 3.00'],
        LevelofRisk: LevelofRisk['EB7'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>2.50 to 3.00'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB7'],
      })
    } else if (3.0 < finalCreditScore && finalCreditScore <= 3.75) {
      this.setState({
        CreditScoreGrade: RiskGrade['>3.00 to 3.75'],
        LevelofRisk: LevelofRisk['EB6'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>3.00 to 3.75'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB6'],
      })
    } else if (3.75 < finalCreditScore && finalCreditScore <= 4.5) {
      this.setState({
        CreditScoreGrade: RiskGrade['>3.75 to 4.5'],
        LevelofRisk: LevelofRisk['EB5'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>3.75 to 4.5'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB5'],
      })
    } else if (4.5 < finalCreditScore && finalCreditScore <= 5.25) {
      this.setState({
        CreditScoreGrade: RiskGrade['>4.50 to 5.25'],
        LevelofRisk: LevelofRisk['EB4'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>4.50 to 5.25'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB4'],
      })
    } else if (5.25 < finalCreditScore && finalCreditScore <= 6.25) {
      this.setState({
        CreditScoreGrade: RiskGrade['>5.25 to 6.25'],
        LevelofRisk: LevelofRisk['EB3'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>5.25 to 6.25'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB3'],
      })
    } else if (6.25 < finalCreditScore && finalCreditScore <= 7.25) {
      this.setState({
        CreditScoreGrade: RiskGrade['>6.25 to 7.25'],
        LevelofRisk: LevelofRisk['EB2'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>6.25 to 7.25'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB2'],
      })
    } else if (7.25 < finalCreditScore && finalCreditScore <= 10.0) {
      this.setState({
        CreditScoreGrade: RiskGrade['>7.25 to 10'],
        LevelofRisk: LevelofRisk['EB1'],
      })

      this.props.fieldPopulator('CreditScoreGrade', {
        type: 'String',
        value: RiskGrade['>7.25 to 10'],
      })
      this.props.fieldPopulator('LevelofRisk', {
        type: 'String',
        value: LevelofRisk['EB1'],
      })
    }
  }

  getscore = (n, data) => {
    switch (n) {
      case 'Age':
        {
          let agescoreJson = {
            'less than 21': -10,
            '21 to 28': 3,
            '28 to 36': 6,
            '36 to 45': 10,
            '45 to 60': 8,
            'more than 60': 0,
          }
          if (data < 21) {
            return agescoreJson['less than 21']
          } else if (21 <= data && data < 28) {
            return agescoreJson['21 to 28']
          } else if (28 <= data && data < 36) {
            return agescoreJson['28 to 36']
          } else if (36 <= data && data < 45) {
            return agescoreJson['36 to 45']
          } else if (45 <= data && data < 60) {
            return agescoreJson['45 to 60']
          } else if (data >= 60) {
            return agescoreJson['more than 60']
          }
        }
        break
      case 'GenderAndMaritalstatus': {
        let GenderAndMaritalstatus = {
          'Unmarried Female': 0,
          'Married Female': 2,
          'Unmarried Male': 4,
          'Married Male': 10,
          Others: 0,
        }
        return GenderAndMaritalstatus[data]
      }
      case 'DrivingLicence': {
        let DrivingLicence = {
          Yes: 10,
          No: -10,
        }
        return DrivingLicence[data]
      }
      case 'PopulationGroup': {
        let PopulationGroup = {
          Rural: 3,
          'Semi urban': 5,
          Urban: 7,
          Metropolitian: 10,
        }
        return PopulationGroup[data]
      }
      case 'EducationLevel': {
        let EducationLevel = {
          ' Primary or less': -2,
          'Secondary school': 2,
          'Higher secondary (+1/+2)': 5,
          Diploma: 5,
          Graduate: 8,
          'Post Graduate/Professional': 10,
        }
        return EducationLevel[data]
      }
      case 'ResidenceType': {
        let ResidenceType = {
          'House owned by self/Spouse': 10,
          'House owned by parents': 4,
          'Rented House/Appartment': 2,
        }
        return ResidenceType[data]
      }
      case 'ExperienceinCurrentEmployment': {
        let ExperienceinCurrentEmployment = {
          'No prior experience/Unskilled labour': 0,
          'Skilled labour on daily wages': 2,
          'NRI s other than professionals': 3,
          'Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.': 4,
          'Professional / salaried / Business < 5 years': 6,
          'Professional / salaried / Business 5 years to <10 years': 8,
          'Professional / salaried / Business  >=10 years': 10,
        }
        return ExperienceinCurrentEmployment[data]
      }
      case 'Monthlyincome': {
        let Monthlyincome = {
          'Up to Rs 25000': 10,
          '25000 - 40000': 10,
          '40000 - 65000': 10,
          'above 65000': 10,
        }
        if (data < 25000) {
          return Monthlyincome['Up to Rs 25000']
        } else if (25000 <= data && data < 40000) {
          return Monthlyincome['25000 - 40000']
        } else if (40000 <= data && data < 65000) {
          return Monthlyincome['40000 - 65000']
        } else if (65000 <= data) {
          return Monthlyincome['above 65000']
        }
        break
      }
      case 'MainSourceofincome': {
        let MainSourceofincome = {
          'Salaried- govt/quasi Govt/Organized pvt sector employee/NRI Professionals': 10,
          'Salaried- Unorganized PVT sector employees': 7,
          'Skilled and self employed -Tailor,Beautician,Barber,Goldsmith,Blacksmith,Driver(own vehicle) etc.': 6,
          'Other own businees- Manufacturing/Trade/Service': 7,
          'Skilled labourers - Carpenters,Mason,Plumbers,Electricians,Tailors, other skilled daily wage earners,Other NRIs': 5,
          'Unskilled labourers/others': 0,

          'Marginal Farmer - Land Holding < 0.50 Ha': 0,
          'Small Farmer - Land Holding >0.50 Ha to 2 Ha': 4,
          'Large Farmer- Land Holding > 2 Ha': 8,
          'Pension/Rent': 4,
        }
        return MainSourceofincome[data]
      }
      case 'NetworthTotalLoans': {
        let NetworthTotalLoansTimes = {
          '<=1.00': 1,
          '>1.00 to 2.00': 3,
          '> 2.00 to 3.00': 6,
          '> 3.00 to 5.00': 8,
          '> 5.00': 10,
        }
        if (data <= 1.0) {
          return NetworthTotalLoansTimes['<=1.00']
        } else if (1.0 < data && data <= 2.0) {
          return NetworthTotalLoansTimes['>1.00 to 2.00']
        } else if (2.0 < data && data <= 3.0) {
          return NetworthTotalLoansTimes['> 2.00 to 3.00']
        } else if (3.0 < data && data <= 5.0) {
          return NetworthTotalLoansTimes['> 3.00 to 5.00']
        } else if (data > 5.0) {
          return NetworthTotalLoansTimes['> 5.00']
        }
        break
      }
      case 'ProofofIncome': {
        let ProofofIncome = {
          'ITR/Form 16/Audited Financial Statement': 10,
          'Attested salary certificate supported by minimum one year bank statement': 8,
          'salary certificate and bank statement for less than one year': 6,
          'Average monthly remittance in NRE account for minimum one year': 4,
          'Income assessed on the basis of Bank statement': 2,
          'No proof of income estimated by Credit officer based on activity/asset holding': 0,
        }
        return ProofofIncome[data]
      }
      case 'LoanAmountNetMonthlyincome': {
        let LoanAmountNetMonthlyincome = {
          '<=2': 10,
          '>2 to 3': 8,
          '>3 to 4': 6,
          '>4 to 5': 4,
          '>5 to 7': 2,
          '>7': 0,
        }
        if (data <= 2) {
          return LoanAmountNetMonthlyincome['<=2']
        } else if (2 < data && data <= 3) {
          return LoanAmountNetMonthlyincome['>2 to 3']
        } else if (3 < data && data <= 4) {
          return LoanAmountNetMonthlyincome['>3 to 4']
        } else if (4 < data && data <= 5) {
          return LoanAmountNetMonthlyincome['>4 to 5']
        } else if (5 < data && data <= 7) {
          return LoanAmountNetMonthlyincome['>5 to 7']
        } else if (data > 7) {
          return LoanAmountNetMonthlyincome['>7']
        }
        break
      }
      case 'FOIR_inPercent': {
        let FOIR_inPercent = {
          '<20': 10,
          '20% to <35%': 8,
          '35% to <48%': 6,
          '48% to <55%': 4,
          '55% to <65%': 2,
          '65% and above': 0,
        }
        if (data < 20) {
          return FOIR_inPercent['<20']
        } else if (20 <= data && data < 35) {
          return FOIR_inPercent['20% to <35%']
        } else if (35 <= data && data < 48) {
          return FOIR_inPercent['35% to <48%']
        } else if (48 <= data && data < 55) {
          return FOIR_inPercent['48% to <55%']
        } else if (55 <= data && data < 65) {
          return FOIR_inPercent['55% to <65%']
        } else if (data >= 65) {
          return FOIR_inPercent['65% and above']
        }
        break
      }
      case "borrower'soperativeaccount": {
        let borrowersoperativeaccount = {
          'New to Banking A/C less than 12 month old': 2,
          'Up to 1000': -2,
          'Rs 1000 to Rs 3000': 4,
          'Rs 3000 to Rs 5000': 6,
          'Rs 5000 to Rs 10000': 8,
          'Rs 10000 above': 10,
        }
        return borrowersoperativeaccount[data]
      }
      case 'ModeofRepayment': {
        let ModeofRepayment = {
          'Check off system by employer': 10,
          'Salary A/C with ESAF bank': 8,
          'ECS Mandate from other bank Account': 4,
          'SB A/C with ESAF Bank/others': 3,
        }
        return ModeofRepayment[data]
      }
      case 'CreditVintage': {
        let CreditVintage = {
          'Credit record nill / up to one year': 1,
          'Applicant is sangam member for <5 years': 3,
          'Applicant is sangam member for >=5 years': 5,
          '1 year to 3 years': 3,
          '3 years to 5 years': 7,
          '>5 years': 10,
        }
        return CreditVintage[data]
      }
      case 'ApplicantBureauScore': {
        let ApplicantsBureauScore = {
          '-1,0': 1,
          '300 to 679': -10,
          '680 to 714': 0,
          '714 to 737': 4,
          '738 to 750': 6,
          '751 to 785': 8,
          '>785': 10,
        }
        if (data === -1 || data === 0) {
          return ApplicantsBureauScore['-1,0']
        } else if (300 <= data && data <= 679) {
          return ApplicantsBureauScore['300 to 679']
        } else if (680 <= data && data <= 714) {
          return ApplicantsBureauScore['680 to 714']
        } else if (714 <= data && data <= 737) {
          return ApplicantsBureauScore['714 to 737']
        } else if (738 <= data && data <= 750) {
          return ApplicantsBureauScore['738 to 750']
        } else if (751 <= data && data <= 785) {
          return ApplicantsBureauScore['751 to 785']
        } else if (data > 785) {
          return ApplicantsBureauScore['>785']
        }
        break
      }
      case 'MaxDPDinlast12months': {
        let MaxDPDinlast12months = {
          'No hit in CB report/Credit vintage up to 6M and DPD less than 30 days': 6,
          'Credit vintage >6M and DPD <10 days': 10,
          'DPD 10 days to 30 days': 6,
          'DPD 30 +': 0,
          'DPD 60 +': -10,
          'DPD 90 +': -30,
          'Settled / Written off': -35,
        }
        return MaxDPDinlast12months[data]
      }
      case 'NoofmonthsDPDexceeded30daysinlast12months': {
        let NoofmonthsDPDexceeded30daysinlast12months = {
          'No hit in CB report/Credit vintage up to 6M and DPD less than 30 days': 6,
          'Credit vintage >6M and DPD <30 days': 10,
          'DPD >30 days - 1 month': 0,
          'DPD >30 days - 2 to 3 months': -10,
          'DPD >30 days - 4 to 5 months': -20,
          'DPD >30 days - 6 months &above': -30,
        }
        return NoofmonthsDPDexceeded30daysinlast12months[data]
      }
      case 'Co-ApplicantBureauScore': {
        let CoApplicantsBureauScore = {
          '-1': 5,
          '300 to 679': -10,
          '680 to 714': 2,
          '714 to 737': 4,
          '738 to 750': 6,
          '751 to 785': 8,
          '>785': 10,
          'No Co-Applicant': 0,
        }
        return CoApplicantsBureauScore[data]
      }
      case 'CreditHistorypriorto12months': {
        let CreditHistorypriorto12months = {
          'No hit in CB report/No history prior to 12 months': 2,
          Satisfactory: 10,
          Substandard: 0,
          'Suit Field/Written off/Settled': -50,
        }
        return CreditHistorypriorto12months[data]
      }
      case 'Co-ApplicantNetWorthtoloanAmount': {
        let CoApplicantsNetWorthtoloanAmount = {
          'Up to 5/ No guarantor': 0,
          '>5 to 10': 2,
          '>10 to 20': 4,
          '>20 to 30': 6,
          '>30 to 50': 8,
          '>50': 10,
        }
        return CoApplicantsNetWorthtoloanAmount[data]
      }
      default:
        break
    }
  }

  handleApproveClick = () => {
    this.setState({ showReturnTo: false })
    this.props.fieldPopulator('BOStatus', {
      type: 'String',
      value: 'Approved',
    })
  }

  handleReturnClick = () => {
    this.setState({ showReturnTo: true })
    this.props.fieldPopulator('BOStatus', {
      type: 'String',
      value: 'Returned',
    })
  }

  render() {
    return (
      <>
        <div className={Style.formSection}>
          <Collapse
            className={Style.antSection}
            bordered={false}
            expandIconPosition={'right'}
            expandIcon={({ isActive }) => (
              <Icon
                type="up-circle"
                style={{ fontSize: '30px' }}
                rotate={isActive ? 180 : 0}
              />
            )}
          >
            <Panel
              header={
                <div className={Style.headerTitle}>
                  {'Applicant Verification Details'}
                </div>
              }
              className="section-header"
              key="1"
            >
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Applicant Check" key="1">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.ApplicantChecklist) &&
                          this.state.ApplicantChecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Finance Check" key="2">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.FinanceChecklist) &&
                          this.state.FinanceChecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Address & Work Address Check" key="3">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                {' '}
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                {' '}
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.addressCheckList) &&
                          this.state.addressCheckList.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="KYC Documents Check" key="4">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.KYCchecklist) &&
                          this.state.KYCchecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Vehicle Details Check" key="5">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.VehicleChecklist) &&
                          this.state.VehicleChecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Applicant HighMark Report" key="6">
                  <div className="flex-row">
                    <div
                      className="form-group col-xs-6 col-md-4"
                      style={{ paddingBottom: '15px' }}
                    >
                      <Anchor>
                        <Link
                          href={
                            this.props.formValues.CrifLink
                              ? this.props.formValues.CrifLink.value
                              : ''
                          }
                          title="Click Here to View CIBIL Report"
                          target="_blank"
                        />
                      </Anchor>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="CIBIL Report" key="7">
                  <div className="flex-row">
                    <div
                      className="form-group col-xs-6 col-md-4"
                      style={{ paddingBottom: '15px' }}
                    >
                      <Anchor>
                        <Link
                          href={
                            this.props.formValues.CibilLink
                              ? this.props.formValues.CibilLink.value
                              : ''
                          }
                          title="Click Here to View CIBIL Report"
                          target="_blank"
                        />
                      </Anchor>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        </div>

        {this.props.formValues &&
          this.props.formValues.coBorrowerSelect &&
          (this.props.formValues.coBorrowerSelect.value === '1' ||
            this.props.formValues.coBorrowerSelect.value === '2' ||
            this.props.formValues.coBorrowerSelect.value === '3' ||
            this.props.formValues.coBorrowerSelect.value === '4') && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Co-Applicant 1 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 1 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapApplicantChecklist('c1').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 1 Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapAddressInfoChecklist('c1').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 1 KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapKYCDocumentChecklist('c1').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 1 HighMark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c1CrifLink
                                  ? this.props.formValues.c1CrifLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 1 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c1CibilLink
                                  ? this.props.formValues.c1CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {this.props.formValues &&
          this.props.formValues.coBorrowerSelect &&
          (this.props.formValues.coBorrowerSelect.value === '2' ||
            this.props.formValues.coBorrowerSelect.value === '3' ||
            this.props.formValues.coBorrowerSelect.value === '4') && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Co-Applicant 2 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 2 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapApplicantChecklist('c2').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 2 Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapAddressInfoChecklist('c2').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 2 KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapKYCDocumentChecklist('c2').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 2 HighMark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c2CrifLink
                                  ? this.props.formValues.c2CrifLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 2 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c2CibilLink
                                  ? this.props.formValues.c2CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {this.props.formValues &&
          this.props.formValues.coBorrowerSelect &&
          (this.props.formValues.coBorrowerSelect.value === '3' ||
            this.props.formValues.coBorrowerSelect.value === '4') && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Co-Applicant 3 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 3 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapApplicantChecklist('c3').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 3 Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapAddressInfoChecklist('c3').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 3 KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapKYCDocumentChecklist('c3').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 3 HighMark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c3CrifLink
                                  ? this.props.formValues.c3CrifLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 3 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c3CibilLink
                                  ? this.props.formValues.c3CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {this.props.formValues &&
          this.props.formValues.coBorrowerSelect &&
          this.props.formValues.coBorrowerSelect.value === '4' && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Co-Applicant 4 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 4 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapApplicantChecklist('c4').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={false}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 4 Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapAddressInfoChecklist('c4').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 4 KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {this.mapKYCDocumentChecklist('c4').map((item) => {
                              return (
                                <Field
                                  name={`${item.fieldName}-isChecked`}
                                  key={item.fieldName}
                                  component={Checklist}
                                  className="form-control-coustom"
                                  hasFeedback
                                  fieldKey={item.fieldName}
                                  fieldValue={item.value}
                                  validation={item.validation}
                                />
                              )
                            })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 4 HighMark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c4CrifLink
                                  ? this.props.formValues.c4CrifLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Co-Applicant 4 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.c4CibilLink
                                  ? this.props.formValues.c4CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {this.props.formValues &&
          this.props.formValues.guarantorSelect &&
          (this.props.formValues.guarantorSelect.value === '1' ||
            this.props.formValues.guarantorSelect.value === '2') && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                style={{ marginBottom: '10px', marginTop: '10px' }}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Guarantor_1 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  {/* Guarantor 1 Check */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_1 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(
                              this.state.g1ApplicantChecklist,
                            ) &&
                              this.state.g1ApplicantChecklist.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/*guarantor Address checklist */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Address & Work Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(this.state.g1addressCheckList) &&
                              this.state.g1addressCheckList.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/*Guarantor 1 KYC Documents Check */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_1  KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(this.state.g1KYCchecklist) &&
                              this.state.g1KYCchecklist.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/* Guarantor 1 HighMark Report */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_1 Highmark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.g1CrifLink
                                  ? this.props.formValues.g1CrifLink.value
                                  : ''
                              }
                              title="Click Here to View HighMark Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/* Guarantor 1 Cibil Score */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_1 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.g1CibilLink
                                  ? this.props.formValues.g1CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {this.props.formValues &&
          this.props.formValues.guarantorSelect &&
          this.props.formValues.guarantorSelect.value === '2' && (
            <div className={Style.formSection}>
              <Collapse
                className={Style.antSection}
                bordered={false}
                expandIconPosition={'right'}
                style={{ marginBottom: '10px', marginTop: '10px' }}
                expandIcon={({ isActive }) => (
                  <Icon
                    type="up-circle"
                    style={{ fontSize: '30px' }}
                    rotate={isActive ? 180 : 0}
                  />
                )}
              >
                <Panel
                  header={
                    <div className={Style.headerTitle}>
                      {'Guarantor_2 Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  {/* Guarantor 2 Check */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_2 Check" key="1">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(
                              this.state.g2ApplicantChecklist,
                            ) &&
                              this.state.g2ApplicantChecklist.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/*guarantor 2 Address checklist */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Address & Work Address Check" key="2">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(this.state.g2addressCheckList) &&
                              this.state.g2addressCheckList.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/*Guarantor 2 KYC Documents Check */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_2  KYC Documents Check" key="3">
                      <div className="flex-row">
                        <div className="form-group col-xs-12 col-md-12">
                          <React.Fragment>
                            <div className="list-table-head">
                              <div className="row">
                                <div className="col-xs-6 col-md-3">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    field name
                                  </span>
                                </div>
                                <div className="col-xs-6 col-md-6">
                                  <span className="list-table-label list-table-label-pf">
                                    {' '}
                                    Value
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!validate.isEmpty(this.state.g2KYCchecklist) &&
                              this.state.g2KYCchecklist.map((item) => {
                                return (
                                  <Field
                                    name={`${item.fieldName}-isChecked`}
                                    key={item.fieldName}
                                    component={Checklist}
                                    className="form-control-coustom"
                                    hasFeedback
                                    fieldKey={item.fieldName}
                                    fieldValue={item.value}
                                    validation={item.validation}
                                  />
                                )
                              })}
                          </React.Fragment>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/* Guarantor 2 HighMark Report */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_2 Highmark Report" key="4">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.g2CrifLink
                                  ? this.props.formValues.g2CrifLink.value
                                  : ''
                              }
                              title="Click Here to View HighMark Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/* Guarantor 2 Cibil Score */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Guarantor_2 CIBIL Report" key="5">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Anchor>
                            <Link
                              href={
                                this.props.formValues.g2CibilLink
                                  ? this.props.formValues.g2CibilLink.value
                                  : ''
                              }
                              title="Click Here to View CIBIL Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Panel>
              </Collapse>
            </div>
          )}

        {/* l0 credit sanction */}
        <div className={Style.formSection}>
          <Collapse
            className={Style.antSection}
            bordered={false}
            expandIconPosition={'right'}
            expandIcon={({ isActive }) => (
              <Icon
                type="up-circle"
                style={{ fontSize: '30px' }}
                rotate={isActive ? 180 : 0}
              />
            )}
          >
            <Panel
              header={
                <div className={Style.headerTitle}>{'L0 Credit Sanction'}</div>
              }
              className="section-header"
              key="1"
            >
              {/* Employment Information */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Employment Information" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Applicant Occupation Type'}
                        name="appOccType"
                        component={TextBox}
                        placeholder="Applicant Occupation Type"
                        disabled={true}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Applicant Occupation Type is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Applicant Job Type'}
                        name="appJobType"
                        component={TextBox}
                        placeholder="JobType"
                        disabled={true}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Job Type is required' }),
                        ]}
                      />
                    </div>
                  </div>
                  {this.props.formValues.coBorrowerSelect &&
                    (this.props.formValues.coBorrowerSelect.value === '1' ||
                      this.props.formValues.coBorrowerSelect.value === '2' ||
                      this.props.formValues.coBorrowerSelect.value === '3' ||
                      this.props.formValues.coBorrowerSelect.value === '4') && (
                      <div>
                        <label>
                          <strong>Co-Applicant_1 Employment Information</strong>
                        </label>
                        <div className="flex-row">
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_1 Occupation Type'}
                              name="c1OccType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              disabled={true}
                              hasFeedback
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_1 Job Type'}
                              name="c1JobType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              hasFeedback
                              disabled={true}
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant1 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {this.props.formValues.coBorrowerSelect &&
                    (this.props.formValues.coBorrowerSelect.value === '2' ||
                      this.props.formValues.coBorrowerSelect.value === '3' ||
                      this.props.formValues.coBorrowerSelect.value === '4') && (
                      <div>
                        <label>
                          <strong>Co-Applicant_2 Employment Information</strong>
                        </label>
                        <div className="flex-row">
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_2 Occupation Type'}
                              name="c2OccType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              disabled={true}
                              hasFeedback
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant2 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_2 Job Type'}
                              name="c2JobType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              hasFeedback
                              disabled={true}
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant2 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {this.props.formValues.coBorrowerSelect &&
                    (this.props.formValues.coBorrowerSelect.value === '3' ||
                      this.props.formValues.coBorrowerSelect.value === '4') && (
                      <div>
                        <label>
                          <strong>Co-Applicant_3 Employment Information</strong>
                        </label>
                        <div className="flex-row">
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_3 Occupation Type'}
                              name="c3OccType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              disabled={true}
                              hasFeedback
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant3 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_3 Job Type'}
                              name="c3JobType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              hasFeedback
                              disabled={true}
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant3 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {this.props.formValues.coBorrowerSelect &&
                    this.props.formValues.coBorrowerSelect.value === '4' && (
                      <div>
                        <label>
                          <strong>Co-Applicant_4 Employment Information</strong>
                        </label>
                        <div className="flex-row">
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_4 Occupation Type'}
                              name="c4OccType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              disabled={true}
                              hasFeedback
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant4 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                          <div className="form-group col-xs-6 col-md-4">
                            <Field
                              label={'Co-Applicant_4 Job Type'}
                              name="c4JobType"
                              component={TextBox}
                              placeholder="Co-Applicant Occupation Type"
                              hasFeedback
                              disabled={true}
                              className="form-control-coustom"
                              validate={[
                                A8V.required({
                                  errorMsg:
                                    'Co-Applicant4 Occupation Type is required',
                                }),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </Panel>
              </Collapse>

              {/* Reference Check */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Reference Check" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.ReferenceChecklist) &&
                          this.state.ReferenceChecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.fieldValue}
                                validation={item.validation}
                                validate={
                                  item.validation.includes('required') && [
                                    A8V.required({
                                      errorMsg: `${item.fieldName} checklist is not selected`,
                                    }),
                                  ]
                                }
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>
              {/* Uploaded Files Check */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Uploaded Files Check" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      {/** File Uploader */}
                      <Field
                        label="Uploader Helper"
                        name={this.state.UploaderEsafSample.fieldName}
                        component={Uploader}
                        multiple={true}
                        accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
                        uploaderConfig={this.state.UploaderEsafSample}
                        validate={[
                          uploadChecker(this.state.UploaderEsafSample),
                        ]}
                        isReadOnly={true}
                        ipc={this.props.ipc}
                      />
                    </div>
                  </div>
                </Panel>
              </Collapse>
              {/* Scanned Images Check */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Scanned Images Check" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <React.Fragment>
                        <div className="list-table-head">
                          <div className="row">
                            <div className="col-xs-6 col-md-3">
                              <span className="list-table-label list-table-label-pf">
                                field name
                              </span>
                            </div>
                            <div className="col-xs-6 col-md-6">
                              <span className="list-table-label list-table-label-pf">
                                Value
                              </span>
                            </div>
                          </div>
                        </div>
                        {!validate.isEmpty(this.state.KYCImageschecklist) &&
                          this.state.KYCImageschecklist.map((item) => {
                            return (
                              <Field
                                name={`${item.fieldName}-isChecked`}
                                key={item.fieldName}
                                component={Checklist}
                                className="form-control-coustom"
                                hasFeedback
                                fieldKey={item.fieldName}
                                fieldValue={item.value}
                                validation={item.validation}
                                validate={
                                  item.validation.includes('required') && [
                                    A8V.required({
                                      errorMsg: `${item.fieldName} checklist is not selected`,
                                    }),
                                  ]
                                }
                                ipc={this.props.ipc}
                              />
                            )
                          })}
                      </React.Fragment>
                    </div>
                  </div>
                </Panel>
              </Collapse>
              {/* Income and Expense Detail */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Income and Expense Detail" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Applicant Net Income'}
                        name="ApplicantSalary"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.IncomeChange('ApplicantSalary')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'C1_Net Income'}
                        name="c1ApplicantSalary"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.IncomeChange('c1ApplicantSalary')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'C2_Net Income'}
                        name="c2ApplicantSalary"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.IncomeChange('c2ApplicantSalary')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'C3_Net Income'}
                        name="c3ApplicantSalary"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.IncomeChange('c3ApplicantSalary')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'C4_Net Income'}
                        name="c4ApplicantSalary"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.IncomeChange('c4ApplicantSalary')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Net Income'}
                        name="BO_NetIncome"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        disabled={true}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net Income is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Applicant Obligation'}
                        name="appobligation"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ObligationChange('appobligation')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c1_Obligation'}
                        name="c1obligation"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ObligationChange('c1obligation')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c2_Obligation'}
                        name="c2obligation"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ObligationChange('c2obligation')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c3_Obligation'}
                        name="c3obligation"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ObligationChange('c3obligation')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c4_Obligation'}
                        name="c4obligation"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ObligationChange('c4obligation')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Financial Obligation'}
                        name="BO_Obligation"
                        component={TextBox}
                        placeholder="Financial Obligation"
                        type="tel"
                        disabled={true}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Financial Obligation is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Applicant Expense'}
                        name="appExpense"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ExpenseChange('appExpense')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Expense is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c1_Expense'}
                        name="c1appExpense"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        onChange={this.ExpenseChange('c1appExpense')}
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Expense is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c2_Expense'}
                        name="c2appExpense"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ExpenseChange('c2appExpense')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Expense is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c3_Expense'}
                        name="c3appExpense"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ExpenseChange('c3appExpense')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Expense is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'c4_Expense'}
                        name="c4appExpense"
                        component={TextBox}
                        placeholder="Net Income"
                        type="tel"
                        hasFeedback
                        onChange={this.ExpenseChange('c4appExpense')}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Expense is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Fixed Expenses'}
                        name="BO_ExpenseTotal"
                        component={TextBox}
                        placeholder="Fixed Expenses"
                        type="tel"
                        hasFeedback
                        disabled={true}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Fixed Expenses is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Proposed EMI'}
                        name="EstimatedEMI"
                        component={TextBox}
                        placeholder="Fixed Expenses"
                        type="tel"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Fixed Expenses is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Total Obligation'}
                        name="BO_TotalObligation"
                        component={TextBox}
                        placeholder="Obligation"
                        type="tel"
                        hasFeedback
                        disabled={true}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Obligation is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'FOIR%'}
                        name="FOIR_inPercent"
                        component={TextBox}
                        placeholder="FOIR"
                        disabled={true}
                        type="tel"
                        hasFeedback
                        className="form-control-coustom"
                      />
                    </div>
                  </div>
                </Panel>
              </Collapse>
              {/* backOffice Remarks */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Back Office Remarks" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-12 col-md-12">
                      <Descriptions
                        title="Responsive Descriptions"
                        bordered
                        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                      >
                        <Descriptions.Item label="Industry Experience">
                          <EditableField
                            name={'IndustryExperience'}
                            value={
                              this.props.formValues.IndustryExperience &&
                              this.props.formValues.IndustryExperience.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Credit History">
                          <EditableField
                            name={'CreditHistory'}
                            value={
                              this.props.formValues.CreditHistory &&
                              this.props.formValues.CreditHistory.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Reference Done">
                          <EditableField
                            name={'ReferenceDone'}
                            value={
                              this.props.formValues.ReferenceDone &&
                              this.props.formValues.ReferenceDone.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Negatives">
                          <EditableField
                            name={'Negatives'}
                            value={
                              this.props.formValues.Negatives &&
                              this.props.formValues.Negatives.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Mitigants">
                          <EditableField
                            name={'Mitigants'}
                            value={
                              this.props.formValues.Mitigants &&
                              this.props.formValues.Mitigants.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Cash Flow">
                          <EditableField
                            name={'CashFlow'}
                            value={
                              this.props.formValues.CashFlow &&
                              this.props.formValues.CashFlow.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Utilization of Loan">
                          <EditableField
                            name={'utilizationofLoan'}
                            value={
                              this.props.formValues.utilizationofLoan &&
                              this.props.formValues.utilizationofLoan.value
                            }
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Additional Conditions">
                          <EditableField
                            name={'additionalConditions'}
                            value={
                              this.props.formValues.additionalConditions &&
                              this.props.formValues.additionalConditions.value
                            }
                          />
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              {/* score card data collection */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="Credit Scorecard Data Collection" key="9">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Networth<span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="Networth"
                        component={TextBox}
                        placeholder="Networth"
                        type="tel"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({ errorMsg: 'Net worth is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Population Group
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="PopulationGroup"
                        component={Select}
                        placeholder="Population Group"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'PopulationGroup is required',
                          }),
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
                        label={
                          <span>
                            Residence Type
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="ResidenceType"
                        component={Select}
                        placeholder="Residence Type"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'ResidenceType is required',
                          }),
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
                        label={
                          <span>
                            Experience Employment / Business
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="ExperienceinCurrentEmployment"
                        component={Select}
                        placeholder="Experience in Current Employment / Business"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              'ExperienceinCurrentEmployment is required',
                          }),
                        ]}
                      >
                        <Option value="No prior experience/Unskilled labour">
                          No prior experience/Unskilled labour{' '}
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
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Main Source of income
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="MainSourceofincome"
                        component={Select}
                        placeholder="Main Source of income"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'Main Source of income is required',
                          }),
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
                          {`Small Farmer - Land Holding >0.50 Ha to 2 Ha`}
                        </Option>
                        <Option value="Large Farmer- Land Holding > 2 Ha">
                          {`Large Farmer- Land Holding > 2 Ha`}
                        </Option>
                        <Option value="Pension/Rent">Pension/Rent</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Total Loan Amount Paying Currently
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="TotalLoans"
                        component={TextBox}
                        placeholder="Total Loans"
                        type="tel"
                        hasFeedback
                        className="form-control-coustom"
                        onChange={this.autoPopulateforNetWorth}
                        validate={[
                          A8V.required({ errorMsg: 'TotalLoans is required' }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Proof of Income
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="ProofofIncome"
                        component={Select}
                        placeholder="Proof of Income"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'Proof of Income is required',
                          }),
                        ]}
                      >
                        <Option value="ITR/Form 16/Audited Financial Statement">
                          ITR/Form 16/Audited Financial Statement
                        </Option>
                        <Option value="Attested salary certificate supported by minimum one year bank statement">
                          Attested salary certificate supported by minimum one
                          year bank statement
                        </Option>
                        <Option value="salary certificate and bank statement for less than one year">
                          salary certificate and bank statement for less than
                          one year
                        </Option>
                        <Option value="Average monthly remittance in NRE account for minimum one year">
                          Average monthly remittance in NRE account for minimum
                          one year
                        </Option>
                        <Option value="Income assessed on the basis of Bank statement">
                          Income assessed on the basis of Bank statement{' '}
                        </Option>
                        <Option value="No proof of income estimated by Credit officer based on activity/asset holding">
                          No proof of income estimated by Credit officer based
                          on activity/asset holding
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            AMB borrower's operative account
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="borrower'soperativeaccount"
                        component={Select}
                        placeholder="principle borrower's operative account"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              "AMB borrower's operative account is required",
                          }),
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
                        label={
                          <span>
                            Mode of Repayment
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="ModeofRepayment"
                        component={Select}
                        placeholder="Mode of Repayment"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'Mode of Repayment is required',
                          }),
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
                        label={
                          <span>
                            Credit Vintage
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="CreditVintage"
                        component={Select}
                        placeholder="Credit Vintage"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'CreditVintage is required',
                          }),
                        ]}
                      >
                        <Option value="Credit record nill / up to one year">
                          Credit record nill / up to one year
                        </Option>
                        <Option value="Applicant is sangam member for <5 years">{`Applicant is sangam member for <5 years`}</Option>
                        <Option value="Applicant is sangam member for >=5 years">{`Applicant is sangam member for >=5 years`}</Option>
                        <Option value="1 year to 3 years">
                          1 year to 3 years
                        </Option>
                        <Option value="3 years to 5 years">
                          3 years to 5 years
                        </Option>
                        <Option value=">5 years">5 years above</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Applicant's Bureau Score (CIBIL)
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="ApplicantBureauScore"
                        component={TextBox}
                        placeholder="Applicant's Bureau Score (CIBIL)"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg:
                              "Applicant's Bureau Score (CIBIL) is required",
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Max DPD in last 12 months
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="MaxDPDinlast12months"
                        component={Select}
                        placeholder="Max DPD in last 12 months"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'Max DPD in last 12 months is required',
                          }),
                        ]}
                      >
                        <Option value="No hit in CB report/Credit vintage up to 6M and DPD less than 30 days">
                          No hit in CB report/Credit vintage up to 6M and DPD
                          less than 30 days
                        </Option>
                        <Option value="Credit vintage >6M and DPD <10 days">{`Credit vintage >6M and DPD < 10 days`}</Option>
                        <Option value="DPD 10 days to 30 days">
                          DPD 10 days to 30 days
                        </Option>
                        <Option value="DPD 30 +">DPD 30 +</Option>
                        <Option value="DPD 60 +">DPD 60 +</Option>
                        <Option value="DPD 90 +">DPD 90 +</Option>
                        <Option value="Settled / Written off">
                          Settled / Written off
                        </Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            No of months DPD exceeded 30 days in last 12 months
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="NoofmonthsDPDexceeded30daysinlast12months"
                        component={Select}
                        placeholder="No of months DPD exceeded 30 days in last 12 months"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              'No of months DPD exceeded 30 days in last 12 months is required',
                          }),
                        ]}
                      >
                        <Option value="No hit in CB report/Credit vintage up to 6M and DPD less than 30 days">
                          No hit in CB report/Credit vintage up to 6M and DPD
                          less than 30 days
                        </Option>
                        <Option value="Credit vintage >6M and DPD <30 days">{`Credit vintage >6M and DPD <30 days`}</Option>
                        <Option value="DPD >30 days - 1 month">
                          {`DPD >30 days - 1 month`}
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
                        label={
                          <span>
                            Co-Applicant's Bureau Score (CIBIL)
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="Co-ApplicantBureauScore"
                        component={Select}
                        placeholder="Co-Applicant's Bureau Score"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              "Co-Applicant's Bureau Score (CIBIL) is required",
                          }),
                        ]}
                      >
                        <Option value="-1">-1</Option>
                        <Option value="300 to 679">300 to 679</Option>
                        <Option value="680 to 714">680 to 714</Option>
                        <Option value="714 to 737">714 to 737</Option>
                        <Option value="738 to 750"> 738 to 750</Option>
                        <Option value="751 to 785">751 to 785</Option>
                        <Option value=">785">{`>785`}</Option>
                        <Option value="No Co-Applicant">No Co-Applicant</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Credit History prior to 12 months
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="CreditHistorypriorto12months"
                        component={Select}
                        placeholder="Credit History prior to 12 months"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              'Credit History prior to 12 months is required',
                          }),
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
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Networth Of co-Applicant
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="NetworthOfco-Applicant"
                        component={TextBox}
                        placeholder="NetworthOfco-Applicant"
                        hasFeedback
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Networth Of co-Applicant is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Co-Applicant's NetWorth to loan Amount
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="Co-ApplicantNetWorthtoloanAmount"
                        component={Select}
                        placeholder="Co-Applicant's Net Worth to loan Amount"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg:
                              "Co-Applicant's Net Worth to loan Amount is required",
                          }),
                        ]}
                      >
                        <Option value="Up to 5/ No guarantor">
                          {' '}
                          Up to 5/ No guarantor
                        </Option>
                        <Option value=">5 to 10"> {`>5 to 10`} </Option>
                        <Option value=">10 to 20"> {`>10 to 20`}</Option>
                        <Option value=">20 to 30">{`>20 to 30`}</Option>
                        <Option value=">30 to 50"> {`>30 to 50`}</Option>
                        <Option value=">50">{`>50`}</Option>
                      </Field>
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Loan to Value (EX-Showroom) in percentage'}
                        name="LoantoValue"
                        component={Select}
                        placeholder="Loan to Value (EX-Showroom) in percentage"
                        className="a8Select"
                        validate={[
                          A8V.required({
                            errorMsg: 'Loan to Value (EX-Showroom) is required',
                          }),
                        ]}
                      >
                        <Option value="<=60%">{`<=60%`}</Option>
                        <Option value=">60% to 65%">{`>60% to 65%`}</Option>
                        <Option value=">65% to 70%">{`>65% to 70%`}</Option>
                        <Option value=">70% to 75%">{`>70% to 75%`}</Option>
                        <Option value=">75% to 80%">{`>75% to 80%`}</Option>
                        <Option value=">80% to 85%">{`>80% to 85%`}</Option>
                        <Option value=">85% to 90%">{`>85% to 90%`}</Option>
                        <Option value=">90% to 95%">{`>90% to 95%`}</Option>
                        <Option value=">95%">{`>95%`}</Option>
                      </Field>
                    </div>
                  </div>
                  <div className="flex-row" style={{ marginBottom: '30px' }}>
                    <div className="form-group col-xs-6 col-md-4">
                      <Button
                        className="ant-btn button button-primary  button-md ant-btn-primary"
                        onClick={this.calculateCreditScore}
                      >
                        {' '}
                        Calculate
                      </Button>
                    </div>
                  </div>
                </Panel>
              </Collapse>

              {/* SCORECARD */}
              {this.props.formValues.finalCreditScore &&
                this.props.formValues.finalCreditScore.value &&
                this.props.formValues.CreditScoreGrade &&
                this.props.formValues.CreditScoreGrade.value &&
                this.props.formValues.LevelofRisk &&
                this.props.formValues.LevelofRisk.value && (
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Credit Score Card" key="9">
                      <React.Fragment>
                        <div className="form-section">
                          <div
                            className={classname('form-section-head clearfix', {
                              on: false,
                            })}
                          >
                            <h3>{'Credit Score Card'}</h3>
                          </div>
                          <div
                            className="form-section-content"
                            style={{ display: 'block' }}
                          >
                            <div style={{ display: 'flex' }}>
                              {/* <Scorecards
                              title={"Final Credit Score"}
                              Score={this.props.formValues.finalCreditScore.value}
                            /> */}
                              <Scorecards
                                title={'Credit Grade'}
                                Score={
                                  this.props.formValues.CreditScoreGrade.value
                                }
                              />
                              <Scorecards
                                title={'Level of Risk'}
                                Score={this.props.formValues.LevelofRisk.value}
                              />
                              <div
                                style={{
                                  position: 'relative',
                                  top: '43px',
                                  left: '50px',
                                }}
                              >
                                <Icon
                                  type="solution"
                                  style={{ fontSize: '48px' }}
                                  onClick={() =>
                                    this.setState({
                                      showScoreCard: !this.state.showScoreCard,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            {this.state.showScoreCard &&
                              this.handleScoreCardView()}
                          </div>
                        </div>
                      </React.Fragment>
                    </Panel>
                  </Collapse>
                )}

              {/* CAM Report */}
              <Collapse
                className={Style.antSection}
                bordered={true}
                expandIconPosition={'right'}
                style={{ marginBottom: '30px' }}
              >
                <Panel header="CAM Report" key="9">
                  <div className="flex-row">
                    <div
                      className="form-group col-xs-6 col-md-4"
                      style={{ paddingBottom: '15px' }}
                    >
                      <Button
                        className="ant-btn button button-primary  button-md ant-btn-primary"
                        onClick={this.handleCAMgeneration}
                      >
                        View CAM Report
                      </Button>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log('*********** state of l1 credit sanction ************', state)
  return {
    //get current form values
    formValues: getFormValues('l1creditSanction')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('l1creditSanction')(state),
  }
}
export default connect(mapStateToProps, {})(TabBackOfficeVerification)
