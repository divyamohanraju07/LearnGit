import * as React from 'react'
import {
  FormHeadSection,
  A8V,
  uploadChecker,
  Scorecards,
  Checklist,
  Config,
  retrieveDefaultFiles,
} from '../../helpers'
import { Uploader, TextBox } from 'a8flow-uikit'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { Descriptions, Table, Collapse, Icon, Button, Anchor } from 'antd'
import { connect } from 'react-redux'
import validate from 'validate.js'
import axios from 'axios'
import Style from './makersForm.module.css'
import EditableField from '../../helpers/form/descriptionField'

const { Panel } = Collapse
const { Link } = Anchor

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
  showReturnTo: boolean
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
        '',
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
    //set initialUploadLoader false
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

  mapApplicantChecklist = (coApplicantPrefix = '') => {
    try {
      var processVariables = this.props.formValues
      var Data = {
        [`${coApplicantPrefix}BranchCode`]: '',
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
      headers: {
        Authorization: authToken,
      },
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
      ? this.props.formValues.ApplicationDate.value.slice(0, 10)
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
    this.setState({ amount: e }, () => {})
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
    this.setState({ tenure: e }, () => {})
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
                <Panel header="Applicant CIBIL Report" key="7">
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
                      {'Co-Applicant 1 Basic Details'}
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
        {
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
                    {'L0 Credit Sanction'}
                  </div>
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
                        this.props.formValues.coBorrowerSelect.value ===
                          '4') && (
                        <div>
                          <label>
                            <strong>
                              Co-Applicant_1 Employment Information
                            </strong>
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
                        this.props.formValues.coBorrowerSelect.value ===
                          '4') && (
                        <div>
                          <label>
                            <strong>
                              Co-Applicant_2 Employment Information
                            </strong>
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
                        this.props.formValues.coBorrowerSelect.value ===
                          '4') && (
                        <div>
                          <label>
                            <strong>
                              Co-Applicant_3 Employment Information
                            </strong>
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
                            <strong>
                              Co-Applicant_4 Employment Information
                            </strong>
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          disabled={true}
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Net Income is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
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
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
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
                          disabled={true}
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
                          disabled={true}
                          hasFeedback
                          className="form-control-coustom"
                          validate={[
                            A8V.required({
                              errorMsg: 'Obligation is required',
                            }),
                          ]}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-md-4">
                        <Field
                          label={'FOIR%'}
                          name="FOIR_inPercent"
                          component={TextBox}
                          placeholder="FOIR"
                          type="tel"
                          disabled={true}
                          hasFeedback
                          className="form-control-coustom"
                        />
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
                            <FormHeadSection
                              sectionLabel="Credit Score Card"
                              sectionKey="CreditScore"
                              formSyncError={this.props.formSyncError}
                              sectionValidator={this.state.sectionValidator}
                              //use this props to set firstTab always open
                              // initialTab={true}
                            />
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
                                  Score={
                                    this.props.formValues.LevelofRisk.value
                                  }
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
                                        showScoreCard: !this.state
                                          .showScoreCard,
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
        }
      </>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log('##### BACK OFFICE VALUES #####', state)
  return {
    //get current form values
    formValues: getFormValues('makersForm')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('makersForm')(state),
  }
}
export default connect(mapStateToProps, {})(TabBackOfficeVerification)
