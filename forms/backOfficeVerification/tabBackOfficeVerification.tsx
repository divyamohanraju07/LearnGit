import * as React from 'react'
import { retrieveBigData, Checklist, Config } from '../../helpers'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import validate from 'validate.js'
import { Collapse, Icon, Button, Divider, Table, Anchor } from 'antd'
import ReactSpeedometer from 'react-d3-speedometer'
import axios from 'axios'
import moment from 'moment'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import Column from 'antd/lib/table/Column'
import Style from './backOfficeVerification.module.css'
import { default as ApiClient } from 'a8forms-api-client'

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
  VehicleChecklist: any[]
  FinanceChecklist: any[]
  UploaderEsafSample: any
  getCIbilDone: Boolean
  CibilScoreloading: boolean
  cibilApiData: any
  cibilScore: number
  c1getCIbilDone: Boolean
  c1CibilScoreloading: boolean
  c1cibilApiData: any
  c1cibilScore: number
  c2getCIbilDone: Boolean
  c2CibilScoreloading: boolean
  c2cibilApiData: any
  c2cibilScore: number
  c3getCIbilDone: Boolean
  c3CibilScoreloading: boolean
  c3cibilApiData: any
  c3cibilScore: number
  c4getCIbilDone: Boolean
  c4CibilScoreloading: boolean
  c4cibilApiData: any
  c4cibilScore: number
  g1getCIbilDone: Boolean
  g1CibilScoreloading: boolean
  g1cibilApiData: any
  g1cibilScore: number
  g2getCIbilDone: Boolean
  g2CibilScoreloading: boolean
  g2cibilApiData: any
  g2cibilScore: number
  edit: any
  returnData: any
  amount: any
  tenure: any
  errorMessage: any
  c1errorMessage: any
  c2errorMessage: any
  c3errorMessage: any
  c4errorMessage: any
  showReturnTo: any
  HighMarkError: any
  showHighMarkError: any
  columnData: any
}
class TabBackOfficeVerification extends React.Component<Props, State | any> {
  constructor(props: Props) {
    super(props)

    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        applicantChecks: [],
        KYCchecks: [],
        FinancialChecks: [],
        Uploader: ['UploaderEsafSample'],
      },
      amount: 0,
      tenure: 0,
      CibilScoreloading: false,
      getCIbilDone: false,
      cibilScore: 0,
      c1CibilScoreloading: false,
      c1getCIbilDone: false,
      c1cibilScore: 0,
      c2CibilScoreloading: false,
      c2getCIbilDone: false,
      c2cibilScore: 0,
      c3CibilScoreloading: false,
      c3getCIbilDone: false,
      c3cibilScore: 0,
      c4CibilScoreloading: false,
      c4getCIbilDone: false,
      c4cibilScore: 0,
      g1CibilScoreloading: false,
      g1getCIbilDone: false,
      g1cibilScore: 0,
      g2CibilScoreloading: false,
      g2getCIbilDone: false,
      g2cibilScore: 0,
      edit: false,
      HighMarkError: '',
      showHighMarkError: false,
      showReturnTo: false,
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
      VehicleChecklist: [],
      FinanceChecklist: [],
      returnData: [],
      columnData: [
        {
          title: 'Data',
          dataIndex: 'data',
        },
        {
          title: 'Actual Value',
          dataIndex: 'ActualValue',
        },
        {
          title: 'Score Obtained',
          dataIndex: 'Score',
        },
      ],
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
        ],
        /**
         * defaultValuesFieldNames props responsible for appending default values to uploader
         */
        defaultValuesFieldNames: [
          'Residence Verification Report',
          'Business Verification Report',
          'Employment Verification Report',
          'Application Form',
          'Declaration',
          'Check List',
          'Authorization Note',
          'Asset Liability',
          'SO_Document 1',
          'SO_Document 2',
          'SO_Document 3',
        ],
        // uploadLimit handle how many fields the user need to upload
        uploadLimit: 11,
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
      cibilApiData: null,
      c1cibilApiData: null,
      c2cibilApiData: null,
      c3cibilApiData: null,
      c4cibilApiData: null,
      g1cibilApiData: null,
      g2cibilApiData: null,
      errorMessage: false,
      c1errorMessage: false,
      c2errorMessage: false,
      c3errorMessage: false,
      c4errorMessage: false,
      g1errorMessage: false,
      g2errorMessage: false,
    }
  }

  componentDidMount = async () => {
    //NOTE ::: Commend below code for local development
    //set initialUploader true
    this.setState((prevState) => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: true,
      },
    }))
    //set initialUploadLoader false
    this.setState((prevState) => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: false,
      },
    }))

    let applicantCheck = this.mapApplicantChecklist()
    let KYCcheck = this.mapKYCDocumentChecklist()
    let addrerssCheck = this.mapAddressInfoChecklist()

    if (this.props.formValues.coBorrowerSelect) {
      if (this.props.formValues.coBorrowerSelect.value === '1') {
        let c1ApplicantCheck = this.mapApplicantChecklist('c1')
        this.setState({ c1ApplicantChecklist: c1ApplicantCheck })
        let c1KYCcheck = this.mapKYCDocumentChecklist('c1')
        this.setState({ c1KYCchecklist: c1KYCcheck })
        let c1addrerssCheck = this.mapAddressInfoChecklist('c1')
        this.setState({ c1addressCheckList: c1addrerssCheck })
      }
      if (this.props.formValues.coBorrowerSelect.value === '2') {
        let c2ApplicantCheck = this.mapApplicantChecklist('c2')
        this.setState({ c2ApplicantChecklist: c2ApplicantCheck })
        let c2KYCcheck = this.mapKYCDocumentChecklist('c2')
        this.setState({ c2KYCchecklist: c2KYCcheck })
        let c2addrerssCheck = this.mapAddressInfoChecklist('c2')
        this.setState({ c2addressCheckList: c2addrerssCheck })
      }
      if (this.props.formValues.coBorrowerSelect.value === '3') {
        let c3ApplicantCheck = this.mapApplicantChecklist('c3')
        this.setState({ c3ApplicantChecklist: c3ApplicantCheck })
        let c3KYCcheck = this.mapKYCDocumentChecklist('c3')
        this.setState({ c3KYCchecklist: c3KYCcheck })
        let c3addrerssCheck = this.mapAddressInfoChecklist('c3')
        this.setState({ c3addressCheckList: c3addrerssCheck })
      }
      if (this.props.formValues.coBorrowerSelect.value === '4') {
        let c4ApplicantCheck = this.mapApplicantChecklist('c4')
        this.setState({ c4ApplicantChecklist: c4ApplicantCheck })
        let c4KYCcheck = this.mapKYCDocumentChecklist('c4')
        this.setState({ c4KYCchecklist: c4KYCcheck })
        let c4addrerssCheck = this.mapAddressInfoChecklist('c4')
        this.setState({ c4addressCheckList: c4addrerssCheck })
      }
    }

    if (this.props.formValues.guarantorSelect) {
      if (this.props.formValues.guarantorSelect.value === '1') {
        let g1ApplicantCheck = this.mapApplicantChecklist('g1')
        this.setState({ g1ApplicantChecklist: g1ApplicantCheck })
        let g1KYCcheck = this.mapKYCDocumentChecklist('g1')
        this.setState({ g1KYCchecklist: g1KYCcheck })
        let g1addrerssCheck = this.mapAddressInfoChecklist('g1')
        this.setState({ g1addressCheckList: g1addrerssCheck })
      }
      if (this.props.formValues.guarantorSelect.value === '2') {
        let g2ApplicantCheck = this.mapApplicantChecklist('g2')
        this.setState({ g2ApplicantChecklist: g2ApplicantCheck })
        let g2KYCcheck = this.mapKYCDocumentChecklist('g2')
        this.setState({ g2KYCchecklist: g2KYCcheck })
        let g2addrerssCheck = this.mapAddressInfoChecklist('g2')
        this.setState({ g2addressCheckList: g2addrerssCheck })
      }
    }

    let vehicleCheck = this.mapVehicleChecklist()
    let FinancialCheck = this.mapFinanceChecklist()

    this.handleReturn()
    this.setState({
      ApplicantChecklist: applicantCheck,
      KYCchecklist: KYCcheck,
      addressCheckList: addrerssCheck,
      VehicleChecklist: vehicleCheck,
      FinanceChecklist: FinancialCheck,
    })

    if (
      this.props.formValues.TotalMonthlyPayment &&
      this.props.formValues.TotalMonthlyPayment.value
    ) {
      this.props.fieldPopulator(
        'ApplicantFinancialObligation',
        this.props.formValues.TotalMonthlyPaymentAmount.value,
      )
    }

    let {
        taskInfo: {
          info: { assignee },
        },
      } = this.props,
      authToken =
        this.props.taskInfo &&
        this.props.taskInfo.info &&
        this.props.taskInfo.info.authToken
          ? this.props.taskInfo.info.authToken
          : null,
      apiClient = new ApiClient(Config.hostUrl, authToken),
      userDetails = await apiClient.getUserDetails(assignee)
    this.props.fieldPopulator('BO_claim', {
      type: 'string',
      value: userDetails.data.id,
      valueInfo: {},
    })
    this.props.fieldPopulator('BOclaim_firstName', {
      type: 'string',
      value: userDetails.data.firstName,
      valueInfo: {},
    })
    this.props.fieldPopulator('BOclaim_lastName', {
      type: 'string',
      value: userDetails.data.lastName,
      valueInfo: {},
    })
  }

  handleReturn = () => {
    let processVariables = this.props.formValues
    let data = []

    if (!validate.isEmpty(processVariables.BOStatus)) {
      if (processVariables.BOStatus.value === 'Returned') {
        data.push({
          key: 'BackOffice',
          name: 'Back Officer',
          value: processVariables.BackOfficerComments.value,
        })
      }
    }
    if (!validate.isEmpty(processVariables.l1Status)) {
      if (processVariables.l1Status.value === 'Returned') {
        data.push({
          key: 'l1CreditOfficer',
          name: 'L1 Credit Sanction',
          value: processVariables.L1OfficerComments.value,
        })
      }
    }
    if (!validate.isEmpty(processVariables.l2Status)) {
      if (processVariables.l2Status.value === 'Returned') {
        data.push({
          key: 'l2CreditOfficer',
          name: 'L2 Credit Sanction',
          value: processVariables.L2OfficerComments.value,
        })
      }
    }
    this.setState({ returnData: data })
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
      let ApplicantCheck = []
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
      let processVariables = this.props.formValues
      let Data = {
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

  mapKYCDocumentChecklist = (coApplicantPrefix = '') => {
    try {
      let processVariables = this.props.formValues
      let Data = {
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
      let mandatoryFields = [
        'DL_Number',
        'AadhaarNo',
        'panNo',
        'passportNo',
        'VoterIDNumber',
      ]
      let KYCcheck = []
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
      let processVariables = this.props.formValues
      let Data = {
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
      let VehicleCheck = []
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

  ScoreCardHeader = (type, label) => {
    return (
      <React.Fragment>
        <Icon type={type} theme="twoTone" twoToneColor="#fa8c16" />
        <span style={{ paddingLeft: '15px' }}>{label}</span>
      </React.Fragment>
    )
  }

  getCibil = (Prefix = '') => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    this.setState({ CibilScoreloading: true })
    let Data = {
      [`${Prefix}FirstName`]: '',
      [`${Prefix}LastName`]: '',
      [`${Prefix}Gender`]: '',
      [`${Prefix}City`]: '',
      [`${Prefix}Pincode`]: '',
      [`${Prefix}MaritalStatus`]: '',
      [`${Prefix}State`]: '',
      [`${Prefix}DateOfBirth`]: '',
      [`${Prefix}AadhaarNo`]: '',
      [`${Prefix}panNo`]: '',
      [`${Prefix}VoterIDNumber`]: '',
      [`${Prefix}passportNo`]: '',
      [`${Prefix}DL_Number`]: '',
      [`LoanAmount`]: '',
    }
    let cibildata = {}
    for (let key in Data) {
      cibildata[key] = !validate.isEmpty(this.props.formValues[`${key}`])
        ? this.props.formValues[`${key}`].value
        : null
    }
    if (Prefix !== '') {
      let addresstype: any
      if (
        this.props.formValues[`${Prefix}KYC_selectedValue`] &&
        this.props.formValues[`${Prefix}KYC_selectedValue`].value !== ''
      ) {
        let kyc = JSON.parse(
          this.props.formValues[`${Prefix}KYC_selectedValue`].value,
        )
        if (kyc.includes(`${Prefix}PAN`)) {
          addresstype = '2'
        } else if (kyc.includes(`${Prefix}Aadhaar`)) {
          addresstype = '1'
        } else if (kyc.includes(`${Prefix}DrivingLicense`)) {
          addresstype = '3'
        } else if (kyc.includes(`${Prefix}VoterId`)) {
          addresstype = '4'
        } else if (kyc.includes(`${Prefix}Passport`)) {
          addresstype = '5'
        }
      }
      let cibilConfig = {
        url: `${Config.apiUrl}/v1/cibil`,
        method: 'post',
        headers: {
          Authorization: authToken,
        },
        data: {
          BureauId: 3,
          AddrLine1:
            this.props.formValues[`${Prefix}PresentAddressSameAsApplicant`]
              .value === 'Yes'
              ? this.props.formValues.City.value
              : cibildata[`${Prefix}City`],
          AddressType: addresstype,
          City:
            this.props.formValues[`${Prefix}PresentAddressSameAsApplicant`]
              .value === 'Yes'
              ? this.props.formValues.City.value
              : cibildata[`${Prefix}City`],
          DOB: cibildata[`${Prefix}DateOfBirth`]
            ? cibildata[`${Prefix}DateOfBirth`].slice(0, 10)
            : null,
          First_Name: cibildata[`${Prefix}FirstName`],
          Gender: cibildata[`${Prefix}Gender`],
          Inq_Purpose: '17',
          Last_Name: cibildata[`${Prefix}LastName`],
          Loan_Product_Code: '7004',
          Pan_Id: cibildata[`${Prefix}panNo`]
            ? cibildata[`${Prefix}panNo`].toUpperCase()
            : null,
          Passport_Id: cibildata[`${Prefix}passportNo`],
          Voter_Id: cibildata[`${Prefix}VoterIDNumber`],
          Driver_license: cibildata[`${Prefix}DL_Number`],
          aadhar_card: cibildata[`${Prefix}AadhaarNo`],
          Postal:
            this.props.formValues[`${Prefix}PresentAddressSameAsApplicant`]
              .value === 'Yes'
              ? this.props.formValues.Pincode.value
              : cibildata[`${Prefix}Pincode`],
          State:
            this.props.formValues[`${Prefix}PresentAddressSameAsApplicant`]
              .value === 'Yes'
              ? this.props.formValues.state.value
              : cibildata[`${Prefix}State`],
          Transaction_Amount: cibildata[`LoanAmount`]
            ? cibildata[`LoanAmount`].replace(/,/g, '')
            : null,
          MaritalStatus: cibildata[`${Prefix}MaritalStatus`],
        },
      }
      axios(cibilConfig)
        .then(
          (response) => {
            let CibilScore = response.data.ScoreDetails.Score.Value
            let cibilLink = response.data.pdfLink
            if (response.data.ScoreDetails.Score.Value !== -1) {
              let TotalLoans =
                response.data.AccountSummaryDetails.AccountSummary
                  .TotalMonthlyPaymentAmount
              this.props.fieldPopulator('TotalLoans', TotalLoans)
            }
            this.props.fieldPopulator('ApplicantBureauScore', {
              type: 'String',
              value: CibilScore,
            })
            this.props.fieldPopulator('CibilLink', {
              type: 'String',
              value: cibilLink,
            })
            this.setState({
              [`${Prefix}getCIbilDone`]: true,
              [`${Prefix}CibilScoreloading`]: false,
              [`${Prefix}cibilScore`]: CibilScore,
              [`${Prefix}cibilApiData`]: response.data,
              [`${Prefix}errorMessage`]: false,
            })
          },
          (error) => {
            console.error('cibil score api failes', error)
            this.setState({
              [`${Prefix}CibilScoreloading`]: false,
              [`${Prefix}errorMessage`]: true,
            })
          },
        )
        .catch((e) => {
          console.log('error in cibil score api', e)
          this.setState({ [`${Prefix}CibilScoreloading`]: false })
        })
    } else {
      let addresstype: any
      if (
        this.props.formValues.KYC_selectedValue &&
        this.props.formValues.KYC_selectedValue.value !== ''
      ) {
        let kyc = JSON.parse(this.props.formValues.KYC_selectedValue.value)
        if (kyc.includes('PAN')) {
          addresstype = '2'
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
      let cibilConfig = {
        url: `${Config.apiUrl}/v1/cibil`,
        method: 'post',
        headers: {
          Authorization: authToken,
        },
        data: {
          BureauId: 3,
          AddrLine1: this.props.formValues.City.value,
          AddressType: addresstype,
          City: this.props.formValues.City.value,
          DOB: cibildata[`${Prefix}DateOfBirth`]
            ? cibildata[`${Prefix}DateOfBirth`].slice(0, 10)
            : null,
          First_Name: cibildata[`${Prefix}FirstName`],
          Gender: cibildata[`${Prefix}Gender`],
          Inq_Purpose: '17',
          Last_Name: cibildata[`${Prefix}LastName`],
          Loan_Product_Code: '7004',
          Pan_Id: cibildata[`${Prefix}panNo`]
            ? cibildata[`${Prefix}panNo`].toUpperCase()
            : null,
          Passport_Id: cibildata[`${Prefix}passportNo`],
          Voter_Id: cibildata[`${Prefix}VoterIDNumber`],
          Driver_license: cibildata[`${Prefix}DL_Number`],
          aadhar_card: cibildata[`${Prefix}AadhaarNo`],
          Postal: this.props.formValues.Pincode.value,
          State: this.props.formValues.State.value,
          Transaction_Amount: cibildata[`LoanAmount`]
            ? cibildata[`LoanAmount`].replace(/,/g, '')
            : null,
          MaritalStatus: cibildata[`${Prefix}MaritalStatus`],
        },
      }

      axios(cibilConfig)
        .then(
          (response) => {
            let CibilScore = response.data.ScoreDetails.Score.Value
            let cibilLink = response.data.pdfLink
            if (response.data.ScoreDetails.Score.Value !== -1) {
              let TotalLoans =
                response.data.AccountSummaryDetails.AccountSummary
                  .TotalMonthlyPaymentAmount
              this.props.fieldPopulator('TotalLoans', TotalLoans)
            }
            this.props.fieldPopulator('ApplicantBureauScore', {
              type: 'String',
              value: CibilScore,
            })
            this.props.fieldPopulator('CibilLink', {
              type: 'String',
              value: cibilLink,
            })
            this.setState({
              [`${Prefix}getCIbilDone`]: true,
              [`${Prefix}CibilScoreloading`]: false,
              [`${Prefix}cibilScore`]: CibilScore,
              [`${Prefix}cibilApiData`]: response.data,
              [`${Prefix}errorMessage`]: false,
            })
          },
          (error) => {
            console.error('cibil score api failes', error)
            this.setState({
              [`${Prefix}CibilScoreloading`]: false,
              [`${Prefix}errorMessage`]: true,
            })
          },
        )
        .catch((e) => {
          console.log('error in cibil score api', e)
          this.setState({ [`${Prefix}CibilScoreloading`]: false })
        })
    }
  }

  renderEmploymentInformation = (Prefix = '') => {
    let {
      [`${Prefix}cibilApiData`]: {
        ResponseXML: { BureauResponse },
      },
    } = this.state
    if (BureauResponse.EmploymentInfo) {
      const {
        Accounttype,
        DateReported,
        OccupationCode,
        Income,
        MONTHLY_ANNUALINCOMEINDICATOR: frequency,
        NET_GROSSINCOMEINDICATOR: incomeIndicator,
      } = BureauResponse.EmploymentInfo
      const reportedDate = moment(new Date(DateReported)).format('DD MMM YYYY')
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
            <br />
            <div className="row" style={{ paddingLeft: '15px' }}>
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
      )
    }
  }

  renderPersonalInfoDetails = (Prefix = '') => {
    const {
      [`${Prefix}cibilApiData`]: {
        ResponseXML: { BureauResponse },
      },
    } = this.state
    if (
      BureauResponse.PersonalInfoDetails &&
      BureauResponse.PersonalInfoDetails.PersonalInfo
    ) {
      const {
        FirstName,
        MiddleName,
        LastName,
        DateOfBirth,
        Gender,
      } = BureauResponse.PersonalInfoDetails.PersonalInfo
      const fullName = `${FirstName} ${MiddleName} ${LastName}`
      const dateOfBirth = moment(DateOfBirth).format('DD MMM YYYY')
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
            <h2>Basic Information</h2>
            <div className="row" style={{ paddingLeft: '15px' }}>
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
      )
    }
  }

  renderTelephoneNumbers = (Prefix = '') => {
    const {
      [`${Prefix}cibilApiData`]: {
        ResponseXML: { BureauResponse },
      },
    } = this.state
    if (
      BureauResponse.TelephoneInfoDetails &&
      BureauResponse.TelephoneInfoDetails.TelephoneInfo
    ) {
      const { TelephoneInfo } = BureauResponse.TelephoneInfoDetails
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
            <h2>Telephone Numbers</h2>
            <div className="row" style={{ paddingLeft: '15px' }}>
              {Array.isArray(TelephoneInfo) &&
                TelephoneInfo.map((phNumber) => {
                  return (
                    <SectionInsideCard
                      label={phNumber.TelephoneType === 'M' && 'mobile phone'}
                      value={`+91 ${phNumber.TelephoneNumber}`}
                      col="2"
                    />
                  )
                })}
            </div>
          </div>
        </ul>
      )
    }
  }

  renderEmailDetails = () => {
    return (
      <ul className="pannalclassname">
        <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
          <h2>Email Contact</h2>
          <div className="row" style={{ paddingLeft: '15px' }}>
            <SectionInsideCard label="Email 1" value="" col="1" />
            <SectionInsideCard label="Email 2" value="" col="1" />
          </div>
        </div>
      </ul>
    )
  }

  renderAddressDetails = (Prefix = '') => {
    const {
      [`${Prefix}cibilApiData`]: {
        ResponseXML: { BureauResponse },
      },
    } = this.state
    if (
      BureauResponse.AddressInfoDetails &&
      BureauResponse.AddressInfoDetails.AddressInfo
    ) {
      const { AddressInfo } = BureauResponse.AddressInfoDetails
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
            <h2>Address</h2>
            {Array.isArray(AddressInfo) &&
              AddressInfo.map((address, index) => {
                const createdOn = moment(address.CreatedOn).format(
                  'DD MMM YYYY',
                )
                return (
                  <React.Fragment>
                    <label>
                      <h5>
                        <b style={{ color: '#10239e' }}>{`ADDRESS ${
                          index + 1
                        }`}</b>
                      </h5>
                    </label>

                    <div className="row" style={{ paddingLeft: '15px' }}>
                      <SectionInsideCard
                        label="street name"
                        value={address.FullAddress}
                        col="1"
                      />
                    </div>
                    <div className="row" style={{ paddingLeft: '15px' }}>
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
                )
              })}
          </div>
        </ul>
      )
    }
    return null
  }

  renderDocumentDetails = (Prefix = '') => {
    const {
      [`${Prefix}cibilApiData`]: {
        ResponseXML: { BureauResponse },
      },
    } = this.state

    if (
      BureauResponse.IdentityInfoDetails &&
      BureauResponse.IdentityInfoDetails.IdentityInfo
    ) {
      const { IdentityInfo } = BureauResponse.IdentityInfoDetails
      return (
        <ul className="pannalclassname">
          <div className="tab-content-in" style={{ paddingLeft: '15px' }}>
            <h2>Document Deatails</h2>
            {Array.isArray(IdentityInfo) &&
              IdentityInfo.map((identity, index) => {
                const { ID, NUMBER_, CreatedOn } = identity
                const idName =
                  ID === 'PanId'
                    ? 'PAN card'
                    : ID === 'VoterId'
                    ? 'Voter card'
                    : ID === 'DriverLicense'
                    ? 'Driving License'
                    : 'Universal ID'
                const labelName =
                  ID === 'PanId'
                    ? 'INCOME TAX NUMBER (PAN)'
                    : ID === 'VoterId'
                    ? 'Voter ID Number'
                    : ID === 'DriverLicense'
                    ? 'Driving License Number'
                    : 'Universal ID Number'
                const issueDate = moment(CreatedOn).format('DD MMM YYYY')
                return (
                  <React.Fragment>
                    <label>
                      <h5>
                        <b style={{ color: '#10239e' }}>{idName}</b>
                      </h5>
                    </label>
                    <div className="row" style={{ paddingLeft: '15px' }}>
                      <SectionInsideCard
                        label={labelName}
                        value={NUMBER_}
                        col="1"
                      />
                    </div>
                    <div className="row" style={{ paddingLeft: '15px' }}>
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
                )
              })}
          </div>
        </ul>
      )
    }
    return null
  }

  handleHighMarkReport = async () => {
    if (
      !validate.isEmpty(
        this.props.formValues && this.props.formValues.HighMarkData,
      )
    ) {
      if (typeof this.props.formValues.HighMarkData.value === 'string') {
        let HighMarkAPIdata = await retrieveBigData(
          this.props.formValues.HighMarkData.value,
          this.props.taskInfo.info,
        )
        if (HighMarkAPIdata.Error) {
          let Error = HighMarkAPIdata.Error
          this.setState({
            HighMarkError: Error,
            showHighMarkError: true,
          })
        } else {
          let base64 = HighMarkAPIdata.pdfBuffer
          var blob = new Blob([base64], { type: 'application/pdf' })
          let pdfFile = window.URL.createObjectURL(blob)
          window.open(pdfFile)
          this.props.fieldPopulator('HighMarkRetrieveData', {
            type: 'String',
            value: HighMarkAPIdata,
          })
        }
      }
    }
  }

  render() {
    return (
      <>
        <div className="tab-content">
          <div
            role="tabpanel"
            className="tab-pane active"
            id="card-item-details-1-credit"
          >
            {/*Returned Section */}
            {((this.props.formValues.BOStatus &&
              this.props.formValues.BOStatus.value === 'Returned') ||
              (this.props.formValues.l1Status &&
                this.props.formValues.l1Status.value === 'Returned') ||
              (this.props.formValues.l2Status &&
                this.props.formValues.l2Status.value === 'Returned')) && (
              <div className="form-section">
                <div className={'form-section-head clearfix on'}>
                  <h3>{'Return Status'}</h3>
                  <span className="status-label status-label-warning">
                    Returned
                  </span>
                </div>
                <div
                  className="form-section-content"
                  style={{ display: 'block' }}
                >
                  <Table dataSource={this.state.returnData} size="middle">
                    <ColumnGroup>
                      <Column
                        title="Returned By"
                        dataIndex="name"
                        key="returnedBy"
                      />
                      <Column title="Reason " dataIndex="value" key="reason" />
                    </ColumnGroup>
                  </Table>
                </div>
              </div>
            )}

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
                      {'Applicant Verification Details'}
                    </div>
                  }
                  className="section-header"
                  key="1"
                >
                  {/* Applicant Check */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
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

                  {/* Finance Check */}
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

                  {/* Address checklist */}
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

                  {/* KYC Documents Check */}
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

                  {/* Vehicle Details Check */}
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

                  {/* HighMark Report */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="Highmark Report" key="6">
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
                              title="Click Here to View HighMark Report"
                              target="_blank"
                            />
                          </Anchor>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>

                  {/* Cibil Score */}
                  <Collapse
                    className={Style.antSection}
                    bordered={true}
                    expandIconPosition={'right'}
                    style={{ marginBottom: '30px' }}
                  >
                    <Panel header="CIBIL Score" key="7">
                      <div className="flex-row">
                        <div
                          className="form-group col-xs-6 col-md-4"
                          style={{ paddingBottom: '15px' }}
                        >
                          <Button
                            className="ant-btn button button-primary  button-md ant-btn-primary"
                            onClick={() => this.getCibil()}
                            loading={this.state.CibilScoreloading}
                          >
                            {' '}
                            Get Cibil
                          </Button>
                        </div>
                      </div>
                      {this.state.errorMessage && (
                        <p style={{ color: 'red' }}>
                          We are unable to process your request.
                        </p>
                      )}

                      {this.state.getCIbilDone && (
                        <div
                          className="form-section-content"
                          style={{ display: 'block' }}
                        >
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-12 col-md-12"
                              style={{
                                paddingLeft: '0px',
                                paddingRight: '0px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-evenly',
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
                                    '#ff0000',
                                    '#fadb14',
                                    '#bae637',
                                    '#5b8c00',
                                  ]}
                                  ringWidth={15}
                                  startColor={'#ff0000'}
                                  endColor={'#00ff00'}
                                  needleTransitionDuration={2000}
                                  currentValueText={`CIBIL Score: ${this.state.cibilScore}`}
                                />
                              </div>
                              <Collapse
                                bordered={false}
                                expandIconPosition={'right'}
                              >
                                <Panel
                                  header={this.ScoreCardHeader(
                                    'contacts',
                                    'Personal Information',
                                  )}
                                  key="1"
                                >
                                  {this.renderPersonalInfoDetails()}
                                  {this.renderDocumentDetails()}
                                </Panel>
                                <Panel
                                  header={this.ScoreCardHeader(
                                    'phone',
                                    'Contact Information',
                                  )}
                                  key="2"
                                >
                                  {this.renderAddressDetails()}

                                  {this.renderTelephoneNumbers()}
                                  {this.renderEmailDetails()}
                                </Panel>
                                <Panel
                                  header={this.ScoreCardHeader(
                                    'shop',
                                    ' Employment Information',
                                  )}
                                  key="3"
                                >
                                  {this.renderEmploymentInformation()}
                                </Panel>
                                <Panel
                                  header={this.ScoreCardHeader(
                                    'account-book',
                                    'Account Information',
                                  )}
                                  key="4"
                                >
                                  <ul className="pannalclassname">
                                    <div
                                      className="tab-content-in"
                                      style={{ paddingLeft: '15px' }}
                                    >
                                      <h2> Account Information</h2>
                                      <div
                                        className="row"
                                        style={{ paddingLeft: '15px' }}
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
                                      style={{ paddingLeft: '15px' }}
                                    >
                                      <h2> Account status</h2>
                                      <div
                                        className="row"
                                        style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
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
                                      style={{ paddingLeft: '15px' }}
                                    >
                                      <h2>Collateral</h2>
                                      <div
                                        className="row"
                                        style={{ paddingLeft: '15px' }}
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
                                    'question-circle',
                                    'Enquiry Information',
                                  )}
                                  key="5"
                                >
                                  <ul className="pannalclassname">
                                    <div
                                      className="tab-content-in"
                                      style={{ paddingLeft: '15px' }}
                                    >
                                      <br />
                                      <div
                                        className="row"
                                        style={{ paddingLeft: '15px' }}
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
                          {'Co-Applicant_1 Verification Details'}
                        </div>
                      }
                      className="section-header"
                      key="1"
                    >
                      {/* Co-Applicant1 Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
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
                                  this.state.c1ApplicantChecklist,
                                ) &&
                                  this.state.c1ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
                              </React.Fragment>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 1 Address checklist */}
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
                                {!validate.isEmpty(
                                  this.state.c1addressCheckList,
                                ) &&
                                  this.state.c1addressCheckList.map((item) => {
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

                      {/* Co-Applicant1 KYC Documents Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="KYC Documents Check" key="3">
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
                                {!validate.isEmpty(this.state.c1KYCchecklist) &&
                                  this.state.c1KYCchecklist.map((item) => {
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

                      {/* Co-Applicant1 HighMark Report */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Highmark Report" key="4">
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
                                  title="Click Here to View HighMark Report"
                                  target="_blank"
                                />
                              </Anchor>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant1 Cibil Score */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('c1')}
                                loading={this.state.c1CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.c1errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.c1getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.c1cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.c1cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('c1')}
                                      {this.renderDocumentDetails('c1')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('c1')}

                                      {this.renderTelephoneNumbers('c1')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('c1')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                          {'Co-Applicant_2 Verification Details'}
                        </div>
                      }
                      className="section-header"
                      key="1"
                    >
                      {/* Co-Applicant 2 Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_2 Check" key="1">
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
                                  this.state.c2ApplicantChecklist,
                                ) &&
                                  this.state.c2ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
                              </React.Fragment>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 2 Address checklist */}
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
                                {!validate.isEmpty(
                                  this.state.c2addressCheckList,
                                ) &&
                                  this.state.c2addressCheckList.map((item) => {
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

                      {/* Co-Applicant 2 KYC Documents Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel
                          header="Co-Applicant_2 KYC Documents Check"
                          key="3"
                        >
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
                                {!validate.isEmpty(this.state.c2KYCchecklist) &&
                                  this.state.c2KYCchecklist.map((item) => {
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

                      {/* Co-Applicant 2 HighMark Report */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_2 Highmark Report" key="4">
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
                                  title="Click Here to View HighMark Report"
                                  target="_blank"
                                />
                              </Anchor>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 2 Cibil Score */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_2 CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('c2')}
                                loading={this.state.c2CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.c2errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.c2getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.c2cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.c2cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('c2')}
                                      {this.renderDocumentDetails('c2')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('c2')}

                                      {this.renderTelephoneNumbers('c2')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('c2')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                          {'Co-Applicant_3 Verification Details'}
                        </div>
                      }
                      className="section-header"
                      key="1"
                    >
                      {/* Co-Applicant 3 Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_3 Check" key="1">
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
                                  this.state.c3ApplicantChecklist,
                                ) &&
                                  this.state.c3ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
                              </React.Fragment>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 3 Address checklist */}
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
                                {!validate.isEmpty(
                                  this.state.c3addressCheckList,
                                ) &&
                                  this.state.c3addressCheckList.map((item) => {
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

                      {/* Co-Applicant 3 KYC Documents Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel
                          header="Co-Applicant_3 KYC Documents Check"
                          key="3"
                        >
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
                                {!validate.isEmpty(this.state.c3KYCchecklist) &&
                                  this.state.c3KYCchecklist.map((item) => {
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

                      {/* Co-Applicant 3 HighMark Report */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_3 Highmark Report" key="4">
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
                                  title="Click Here to View HighMark Report"
                                  target="_blank"
                                />
                              </Anchor>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 3 Cibil Score */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_3 CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('c3')}
                                loading={this.state.c3CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.c3errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.c3getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.c3cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.c3cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('c3')}
                                      {this.renderDocumentDetails('c3')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('c3')}

                                      {this.renderTelephoneNumbers('c3')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('c3')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                          {'Co-Applicant_4 Verification Details'}
                        </div>
                      }
                      className="section-header"
                      key="1"
                    >
                      {/* Co-Applicant 4 Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '40px', marginTop: '40px' }}
                      >
                        <Panel header="Co-Applicant_4 Check" key="1">
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
                                  this.state.c4ApplicantChecklist,
                                ) &&
                                  this.state.c4ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
                              </React.Fragment>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 4 Address checklist */}
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
                                {!validate.isEmpty(
                                  this.state.c4addressCheckList,
                                ) &&
                                  this.state.c4addressCheckList.map((item) => {
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

                      {/* Co-Applicant 4 KYC Documents Check */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel
                          header="Co-Applicant_4 KYC Documents Check"
                          key="3"
                        >
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
                                {!validate.isEmpty(this.state.c4KYCchecklist) &&
                                  this.state.c4KYCchecklist.map((item) => {
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

                      {/* Co-Applicant 4 HighMark Report */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_4 Highmark Report" key="4">
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
                                  title="Click Here to View HighMark Report"
                                  target="_blank"
                                />
                              </Anchor>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      {/* Co-Applicant 4 Cibil Score */}
                      <Collapse
                        className={Style.antSection}
                        bordered={true}
                        expandIconPosition={'right'}
                        style={{ marginBottom: '30px' }}
                      >
                        <Panel header="Co-Applicant_4 CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('c4')}
                                loading={this.state.c4CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.c4errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.c4getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.c4cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.c4cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('c4')}
                                      {this.renderDocumentDetails('c4')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('c4')}

                                      {this.renderTelephoneNumbers('c4')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('c4')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                  this.state.g1ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
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
                                {!validate.isEmpty(
                                  this.state.g1addressCheckList,
                                ) &&
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
                        <Panel
                          header="Guarantor_1  KYC Documents Check"
                          key="3"
                        >
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
                        <Panel header="Guarantor_1 CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('g1')}
                                loading={this.state.g1CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.g1errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.g1getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.g1cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.g1cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('g1')}
                                      {this.renderDocumentDetails('g1')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('g1')}

                                      {this.renderTelephoneNumbers('g1')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('g1')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                  this.state.g2ApplicantChecklist.map(
                                    (item) => {
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
                                    },
                                  )}
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
                                {!validate.isEmpty(
                                  this.state.g2addressCheckList,
                                ) &&
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
                        <Panel
                          header="Guarantor_2  KYC Documents Check"
                          key="3"
                        >
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
                        <Panel header="Guarantor_2 CIBIL Score" key="5">
                          <div className="flex-row">
                            <div
                              className="form-group col-xs-6 col-md-4"
                              style={{ paddingBottom: '15px' }}
                            >
                              <Button
                                className="ant-btn button button-primary  button-md ant-btn-primary"
                                onClick={() => this.getCibil('g2')}
                                loading={this.state.g2CibilScoreloading}
                              >
                                {' '}
                                Get Cibil
                              </Button>
                            </div>
                          </div>
                          {this.state.g2errorMessage && (
                            <p style={{ color: 'red' }}>
                              We are unable to process your request.
                            </p>
                          )}

                          {this.state.g2getCIbilDone && (
                            <div
                              className="form-section-content"
                              style={{ display: 'block' }}
                            >
                              <div className="flex-row">
                                <div
                                  className="form-group col-xs-12 col-md-12"
                                  style={{
                                    paddingLeft: '0px',
                                    paddingRight: '0px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    <ReactSpeedometer
                                      value={this.state.g2cibilScore}
                                      minValue={-1}
                                      maxValue={900}
                                      width={300}
                                      height={175}
                                      customSegmentStops={[
                                        -1,
                                        250,
                                        500,
                                        750,
                                        900,
                                      ]}
                                      segmentColors={[
                                        '#ff0000',
                                        '#fadb14',
                                        '#bae637',
                                        '#5b8c00',
                                      ]}
                                      ringWidth={15}
                                      startColor={'#ff0000'}
                                      endColor={'#00ff00'}
                                      needleTransitionDuration={2000}
                                      currentValueText={`CIBIL Score: ${this.state.g2cibilScore}`}
                                    />
                                  </div>
                                  <Collapse
                                    bordered={false}
                                    expandIconPosition={'right'}
                                  >
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'contacts',
                                        'Personal Information',
                                      )}
                                      key="1"
                                    >
                                      {this.renderPersonalInfoDetails('g2')}
                                      {this.renderDocumentDetails('g2')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'phone',
                                        'Contact Information',
                                      )}
                                      key="2"
                                    >
                                      {this.renderAddressDetails('g2')}

                                      {this.renderTelephoneNumbers('g2')}
                                      {this.renderEmailDetails()}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'shop',
                                        ' Employment Information',
                                      )}
                                      key="3"
                                    >
                                      {this.renderEmploymentInformation('g2')}
                                    </Panel>
                                    <Panel
                                      header={this.ScoreCardHeader(
                                        'account-book',
                                        'Account Information',
                                      )}
                                      key="4"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account Information</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2> Account status</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                              style={{ paddingLeft: '15px' }}
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
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <h2>Collateral</h2>
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                                        'question-circle',
                                        'Enquiry Information',
                                      )}
                                      key="5"
                                    >
                                      <ul className="pannalclassname">
                                        <div
                                          className="tab-content-in"
                                          style={{ paddingLeft: '15px' }}
                                        >
                                          <br />
                                          <div
                                            className="row"
                                            style={{ paddingLeft: '15px' }}
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
                        </Panel>
                      </Collapse>
                    </Panel>
                  </Collapse>
                </div>
              )}
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = (state, props) => {
  console.log('BACK OFFICE VALUES', state)
  return {
    //get current form values
    formValues: getFormValues('backOfficeVerification')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('backOfficeVerification')(state),
  }
}
export default connect(mapStateToProps, {})(TabBackOfficeVerification)

const SectionInsideCard = ({ label, value, col }) => {
  return (
    <div className={col === '3' ? 'common-col-div-1' : 'common-col-div'}>
      <p className="text-label">{label}</p>
      <p style={{ marginBottom: '15px' }}>
        <strong>{value}</strong>
      </p>
    </div>
  )
}
