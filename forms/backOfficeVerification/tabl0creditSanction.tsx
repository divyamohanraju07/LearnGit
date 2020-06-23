import * as React from 'react'
import {
  FormHeadSection,
  A8V,
  uploadChecker,
  Scorecards,
  inrFormat,
  Checklist,
  Config,
  retrieveDefaultFiles,
} from '../../helpers'
import { Uploader, TextBox, TextArea, Select, SelectHelper } from 'a8flow-uikit'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import {
  Descriptions,
  Table,
  Icon,
  Button,
  Slider,
  InputNumber,
  Col,
  Row,
} from 'antd'
import { connect } from 'react-redux'
import EditableField from '../../helpers/form/descriptionField'
import validate from 'validate.js'
import classname from 'classnames'
import axios from 'axios'
import moment from 'moment'

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
  KYCchecklist: any[]
  KYCImageschecklist: any[]
  ReferenceChecklist: any[]
  UploaderEsafSample: any
  scannedImagesList: string[]
  showScoreCard: boolean
  showReturnTo: boolean
  tenure: any
  amount: any
  CreditScoreGrade: any
  creditScorevalue: boolean
  creditscore: any
  scoreCardData: any
  LevelofRisk: any
  BackOfficeUpload: any
}

class Tabl0CreditSanction extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      KYCchecks: [],
      FinancialChecks: [],
      ReferenceChecks: [],
      Uploader: ['UploaderEsafSample'],
      KYCImagechecks: [],
      BO_Decision: ['BackOfficerComments', 'BOStatus', 'BOreturnTO'],
      creditScoreDataCollection: [
        'Networth',
        'PopulationGroup',
        'ResidenceType',
        'ExperienceinCurrentEmployment',
        'MainSourceofincome',
        'TotalLoans',
        'ProofofIncome',
        "borrower'soperativeaccount",
        'ModeofRepayment',
        'CreditVintage',
        'ApplicantBureauScore',
        'MaxDPDinlast12months',
        'NoofmonthsDPDexceeded30daysinlast12months',
        'Co-ApplicantBureauScore',
        'CreditHistorypriorto12months',
        'NetworthOfco-Applicant',
        'Co-ApplicantNetWorthtoloanAmount',
        'LoantoValue',
      ],
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
    KYCchecklist: [],
    KYCImageschecklist: [],
    showScoreCard: false,
    showReturnTo: false,
    amount: this.props.formValues.LoanAmount
      ? this.props.formValues.LoanAmount.value
      : 0,
    tenure: this.props.formValues.tenureInput
      ? this.props.formValues.tenureInput.value
      : 0,
    CreditScoreGrade: '',
    creditScorevalue: false,
    creditscore: '',
    scoreCardData: [],
    LevelofRisk: '',
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
      //     title: 'Score Obtained',
      //     dataIndex: 'Score',
      // },
    ],
    ReferenceChecklist: [],
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
    //set initialUploader true
    // this.setState(prevState => ({
    //     UploaderEsafSample: {
    //         ...prevState.UploaderEsafSample,
    //         initialUploadLoader: true
    //     }
    // }));
    //use this helper to retrieve default files
    await retrieveDefaultFiles({
      taskInfo: this.props.taskInfo,
      fileInfo: this.state.UploaderEsafSample,
      fieldPopulator: this.props.fieldPopulator,
    })
    //set initialUploadLoader false
    // this.setState(prevState => ({
    //     UploaderEsafSample: {
    //         ...prevState.UploaderEsafSample,
    //         initialUploadLoader: false
    //     }
    // }));
    // this.setState(prevState => ({
    //     BackOfficeUpload: {
    //         ...prevState.BackOfficeUpload,
    //         initialUploadLoader: false
    //     }
    // }));

    let additionalConditions = `1) Confirmation of noting of hypothecation in favouring ESAF Bank from RTO Website or Dealer to be taken within 60 days from the date of Vehicle delivery.
2) Disbursement has to be done after deducting credit protect insurance and processing fee. Hypothecation note, insurance cover note and Tax Invoice to be produce within 7 days of vehicle delivery.
3) Validity of the sanction is for 30 days.
4) Sanction terms and conditions annexure should be attached.
5) Mandate from all the Applicants shall be obtained for crediting the loan proceeds to a single partys account.
6) Vehicle delivery order shall be issued only from HO.`

    this.props.fieldPopulator('additionalConditions', {
      type: 'String',
      value: additionalConditions,
      valueInfo: {},
    })

    let ReferenceCheck = this.mapReferenceChecklist()
    this.mapGenderAndMaritalstatus()
    this.handleDrivingLicense()
    this.handleExShowroomPrice()
    this.handleNetIncome()
    this.handleMemberExpense()
    this.handleTotalObligation()
    this.handleEmploymentInfo()
    this.mapKYCImageschecklist()

    if (this.props.formValues.BO_NetIncome) {
      this.props.fieldPopulator('Monthlyincome', {
        type: 'String',
        value: this.props.formValues.BO_NetIncome.value,
      })
    }
    this.setState({
      ReferenceChecklist: ReferenceCheck,
    })

    if (
      this.props.formValues.BackOfficerComments &&
      this.props.formValues.BackOfficerComments.value !== ''
    ) {
      this.props.fieldPopulator('BackOfficerComments', {
        type: 'String',
        value: '',
      })
      this.props.fieldPopulator('BOStatus', { type: 'String', value: '' })
    }

    if (
      this.props.formValues.LG_code &&
      this.props.formValues.LG_firstName &&
      this.props.formValues.LC_code &&
      this.props.formValues.LC_firstName
    ) {
      this.props.fieldPopulator('LG_code', {
        type: 'string',
        value: this.props.formValues.LG_code.value,
      })
      this.props.fieldPopulator('LG_firstName', {
        type: 'string',
        value: this.props.formValues.LG_firstName.value,
      })
      this.props.fieldPopulator('LC_code', {
        type: 'string',
        value: this.props.formValues.LC_code.value,
      })
      this.props.fieldPopulator('LC_firstName', {
        type: 'string',
        value: this.props.formValues.LC_firstName.value,
      })
    }

    if (
      this.props.formValues.coBorrowerSelect &&
      (this.props.formValues.coBorrowerSelect.value === '1' ||
        this.props.formValues.coBorrowerSelect.value === '2' ||
        this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4')
    ) {
      this.mapKYCImageschecklist('c1')
    }
    if (
      this.props.formValues.coBorrowerSelect &&
      (this.props.formValues.coBorrowerSelect.value === '2' ||
        this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4')
    ) {
      this.mapKYCImageschecklist('c2')
    }
    if (
      this.props.formValues.coBorrowerSelect &&
      (this.props.formValues.coBorrowerSelect.value === '3' ||
        this.props.formValues.coBorrowerSelect.value === '4')
    ) {
      this.mapKYCImageschecklist('c3')
    }
    if (
      this.props.formValues.coBorrowerSelect &&
      this.props.formValues.coBorrowerSelect.value === '4'
    ) {
      this.mapKYCImageschecklist('c4')
    }
    if (
      this.props.formValues.guarantorSelect &&
      (this.props.formValues.guarantorSelect.value === '1' ||
        this.props.formValues.guarantorSelect.value === '2')
    ) {
      this.mapKYCImageschecklist('g1')
    }
    if (
      this.props.formValues.guarantorSelect &&
      this.props.formValues.guarantorSelect.value === '2'
    ) {
      this.mapKYCImageschecklist('g2')
    }
  }

  mapKYCImageschecklist = (coApplicantPrefix = ''.trim()) => {
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
      let mandatoryFields = [
        `${coApplicantPrefix}panImg`,
        `${coApplicantPrefix}aadhaarImg`,
        `${coApplicantPrefix}Vehicleimage`,
        `${coApplicantPrefix}DLImg`,
        `${coApplicantPrefix}passportImg`,
        `${coApplicantPrefix}voterIdImage`,
        `${coApplicantPrefix}singleKycimage`,
      ]
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
          if (mandatoryFields.includes(key)) {
            KYCImageData.validation = ['required']
          }
          KYCImagescheck.push(KYCImageData)
        }
      }
      this.setState({ KYCImageschecklist: KYCImagescheck })
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
      let Data = {
        RelatedToApplicant: '',
        KnowApplicantSince: '',
        ApplicantJobType: '',
        BusinessrelationWithApplicant: '',
        ApplicantJobAddress: '',
        ApplicantJobStability: '',
        AwareOfApplicantAddress: '',
        ApplicantHasLoans: '',
        ApplicantBusinessgrasp: '',
        Businessperformance: '',
        Overallfeedback: '',
        referenceComment: '',
        ReferenceCallResult: '',
      }
      let mandatoryFields = ['']
      for (let key in Data) {
        let referenceData = { fieldName: '', fieldValue: {}, validation: [] }
        if (!validate.isEmpty(processVariables[key])) {
          referenceData.fieldName = key
          referenceData.fieldValue = { ...processVariables[key] }
          if (mandatoryFields.includes(key)) {
            referenceData.validation = ['required']
          }
          ReferenceCheck.push(referenceData)
        }
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
  handleEmploymentInfo = () => {
    if (this.props.formValues.OccupationType) {
      if (this.props.formValues.OccupationType.value === 'Salaried') {
        this.props.fieldPopulator('appOccType', {
          type: 'string',
          value: this.props.formValues.OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('appJobType', {
          type: 'string',
          value: this.props.formValues.TypeofJob
            ? this.props.formValues.TypeofJob.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.OccupationType.value === 'Business') {
        this.props.fieldPopulator('appOccType', {
          type: 'string',
          value: this.props.formValues.OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('appJobType', {
          type: 'string',
          value: this.props.formValues.BusinessType
            ? this.props.formValues.BusinessType.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.OccupationType.value === 'Others') {
        this.props.fieldPopulator('appOccType', {
          type: 'string',
          value: this.props.formValues.OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('appJobType', {
          type: 'string',
          value: this.props.formValues.JobType
            ? this.props.formValues.JobType.value
            : '',
          valueInfo: {},
        })
      }
    }
    if (this.props.formValues.c1OccupationType) {
      if (this.props.formValues.c1OccupationType.value === 'Salaried') {
        this.props.fieldPopulator('c1OccType', {
          type: 'string',
          value: this.props.formValues.c1OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c1JobType', {
          type: 'string',
          value: this.props.formValues.c1SlariedTypeofJob
            ? this.props.formValues.c1SlariedTypeofJob.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c1OccupationType.value === 'Business') {
        this.props.fieldPopulator('c1OccType', {
          type: 'string',
          value: this.props.formValues.c1OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c1JobType', {
          type: 'string',
          value: this.props.formValues.c1BusinessType
            ? this.props.formValues.c1BusinessType.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c1OccupationType.value === 'Others') {
        this.props.fieldPopulator('c1OccType', {
          type: 'string',
          value: this.props.formValues.c1OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c1JobType', {
          type: 'string',
          value: this.props.formValues.c1JobType
            ? this.props.formValues.c1JobType.value
            : '',
          valueInfo: {},
        })
      }
    }
    if (this.props.formValues.c2OccupationType) {
      if (this.props.formValues.c2OccupationType.value === 'Salaried') {
        this.props.fieldPopulator('c2OccType', {
          type: 'string',
          value: this.props.formValues.c2OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c2JobType', {
          type: 'string',
          value: this.props.formValues.c2SlariedTypeofJob
            ? this.props.formValues.c2SlariedTypeofJob.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c2OccupationType.value === 'Business') {
        this.props.fieldPopulator('c2OccType', {
          type: 'string',
          value: this.props.formValues.c2OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c2JobType', {
          type: 'string',
          value: this.props.formValues.c2BusinessType
            ? this.props.formValues.c2BusinessType.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c2OccupationType.value === 'Others') {
        this.props.fieldPopulator('c2OccType', {
          type: 'string',
          value: this.props.formValues.c2OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c2JobType', {
          type: 'string',
          value: this.props.formValues.c2JobType
            ? this.props.formValues.c2JobType.value
            : '',
          valueInfo: {},
        })
      }
    }
    if (this.props.formValues.c3OccupationType) {
      if (this.props.formValues.c3OccupationType.value === 'Salaried') {
        this.props.fieldPopulator('c3OccType', {
          type: 'string',
          value: this.props.formValues.c3OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c3JobType', {
          type: 'string',
          value: this.props.formValues.c3salariedTypeofJob
            ? this.props.formValues.c3salariedTypeofJob.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c3OccupationType.value === 'Business') {
        this.props.fieldPopulator('c3OccType', {
          type: 'string',
          value: this.props.formValues.c3OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c3JobType', {
          type: 'string',
          value: this.props.formValues.c3BusinessType
            ? this.props.formValues.c3BusinessType.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c3OccupationType.value === 'Others') {
        this.props.fieldPopulator('c3OccType', {
          type: 'string',
          value: this.props.formValues.c3OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c3JobType', {
          type: 'string',
          value: this.props.formValues.c3JobType
            ? this.props.formValues.c3JobType.value
            : '',
          valueInfo: {},
        })
      }
    }
    if (this.props.formValues.c4OccupationType) {
      if (this.props.formValues.c4OccupationType.value === 'Salaried') {
        this.props.fieldPopulator('c4OccType', {
          type: 'string',
          value: this.props.formValues.c4OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c4JobType', {
          type: 'string',
          value: this.props.formValues.c4salariedTypeofJob
            ? this.props.formValues.c4salariedTypeofJob.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c4OccupationType.value === 'Business') {
        this.props.fieldPopulator('c4OccType', {
          type: 'string',
          value: this.props.formValues.c4OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c4JobType', {
          type: 'string',
          value: this.props.formValues.c4BusinessType
            ? this.props.formValues.c4BusinessType.value
            : '',
          valueInfo: {},
        })
      } else if (this.props.formValues.c4OccupationType.value === 'Others') {
        this.props.fieldPopulator('c4OccType', {
          type: 'string',
          value: this.props.formValues.c4OccupationType.value,
          valueInfo: {},
        })
        this.props.fieldPopulator('c4JobType', {
          type: 'string',
          value: this.props.formValues.c4JobType
            ? this.props.formValues.c4JobType.value
            : '',
          valueInfo: {},
        })
      }
    }
  }
  // from CIBIL API
  handleCoApplicantNetWorthtoloanAmount = (data) => {
    if (this.props.formValues.TotalLoans) {
      this.props.fieldPopulator('Co-ApplicantNetWorthtoloanAmount', {
        type: 'String',
        value:
          Math.round(
            (Number(data.value) /
              Number(this.props.formValues.TotalLoans.value)) *
              100,
          ) / 100,
      })
    }
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
      RecommendedLoanAmount: '',
      RecommendedLoanTenure: '',
      ApplicationDate: '',
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
        c1ResidenceType: '',
      },
      CoApplicant_2: {
        c2FirstName: '',
        c2relationShipWithApplicant: '',
        c2OccupationType: '',
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
        c3OccupationType: '',
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
        c4OccupationType: '',
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
        g1OccupationType: '',
        g1relationShipWithApplicant: '',
        g1salariedExperienceCurrentJob: '',
        g1businessMonthlyGrossSalary: '',
        g1salariedMonthlyGrossSalary: '',
        g1othersGrossMonthlyIncome: '',
      },
      Guarantor_2: {
        g2FirstName: '',
        g2OccupationType: '',
        g2relationShipWithApplicant: '',
        g2MonthlyGrossSalary: '',
        g2businessMonthlyGrossSalary: '',
        g2salariedMonthlyGrossSalary: '',
        g2othersGrossMonthlyIncome: '',
      },
    }
    let finalData = {}
    finalData['ApplicationDate'] = this.props.formValues.applicationDate
      ? this.props.formValues.applicationDate.value
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
  handleApproveClick = () => {
    this.setState({ showReturnTo: false })
    this.props.fieldPopulator('BOStatus', {
      type: 'String',
      value: 'Approved',
    })
    this.props.fieldPopulator('BOApprovalDate', {
      type: 'String',
      value: moment(Date()).format('DD-MM-YYYY').slice(0, 15),
    })
  }
  handleReturnClick = () => {
    this.setState({ showReturnTo: true })
    this.props.fieldPopulator('BOStatus', {
      type: 'String',
      value: 'Returned',
    })
  }
  handleNumtoWord = (amount) => {
    let a = [
      '',
      'One ',
      'Two ',
      'Three ',
      'Four ',
      'Five ',
      'Six ',
      'Seven ',
      'Eight ',
      'Nine ',
      'Ten ',
      'Eleven ',
      'Twelve ',
      'Thirteen ',
      'Fourteen ',
      'Fifteen ',
      'Sixteen ',
      'Seventeen ',
      'Eighteen ',
      'Nineteen ',
    ]
    var b = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ]
    let num = amount
    if ((num = num.toString()).length > 9) return 'overflow'
    const n = ('000000000' + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n) return
    let str = ''
    str +=
      n[1] !== '00'
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore '
        : ''
    str +=
      n[2] !== '00'
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh '
        : ''
    str +=
      n[3] !== '00'
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand '
        : ''
    str +=
      n[4] !== '0'
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred '
        : ''
    str +=
      n[5] !== '00'
        ? (str !== '' ? 'and ' : '') +
          (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
        : ''
    str += 'Only.'
    return str
  }
  handleRecommendedloanAmount = (e) => {
    this.setState({ amount: e }, () => {})
    if (e !== 0) {
      this.props.fieldPopulator('BO_RecommendedLoanAmount', {
        type: 'String',
        value: e,
      })
      this.props.fieldPopulator('BO_RecommendedLoanAmount_inwords', {
        type: 'String',
        value: this.handleNumtoWord(e),
      })
    } else {
      this.props.fieldPopulator('BO_RecommendedLoanAmount', {
        type: 'String',
        value: this.props.formValues.LoanAmount.value,
      })
    }
  }
  handleRecommendedTenure = (e) => {
    this.setState({ tenure: e }, () => {})
    if (e !== 0) {
      this.props.fieldPopulator('BO_RecommendedLoanTenure', {
        type: 'String',
        value: e,
      })
    } else {
      this.props.fieldPopulator('BO_RecommendedLoanTenure', {
        type: 'String',
        value: this.props.formValues.tenureInput.value,
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
          value: '0',
        })
      }
    }
  }
  handleMonthlyincome = (value) => {
    if (value) {
      this.props.fieldPopulator('Monthlyincome', {
        type: 'String',
        value: value,
      })
    }
    this.autoPopulateforLoanAmountNetMonthlyincome(value)
  }
  autoPopulateforLoanAmountNetMonthlyincome = (element) => {
    if (element) {
      let loanAmount = this.props.formValues.LoanAmount.value
      let income = element
      let value = Number(parseInt(loanAmount) / parseInt(income))
      this.props.fieldPopulator('LoanAmountNetMonthlyincome', {
        type: 'String',
        value: value,
      })
    }
  }
  calculateCreditScore = () => {
    let BO_NetIncome = this.props.formValues.BO_NetIncome.value
    this.handleMonthlyincome(BO_NetIncome)
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
      individualCreditScore['ExperienceinCurrentEmployment'] = Number(
        (5 / 100) * getExperienceinCurrentEmploymentScore,
      )
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
      individualCreditScore['ProofofIncome'] = (5 / 100) * getperticularcore
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
          '-1,0': 5,
          '300 to 679': -10,
          '680 to 714': 2,
          '715 to 737': 4,
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
          return ApplicantsBureauScore['715 to 737']
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
          '715 to 737': 4,
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
  handleNetIncome = () => {
    let formValues = this.props.formValues
    if (formValues.OccupationType) {
      if (formValues.OccupationType.value === 'Salaried') {
        let app_salary = formValues.MonthlyGrossSalary
          ? formValues.MonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('ApplicantSalary', {
          type: 'String',
          value: app_salary,
        })
        let app_obligation = formValues.MonthlyFixedObligation
          ? formValues.MonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('appobligation', {
          type: 'String',
          value: app_obligation,
        })
      } else if (formValues.OccupationType.value === 'Business') {
        let app_salary = formValues.MonthlyBusinessGross
          ? formValues.MonthlyBusinessGross.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('ApplicantSalary', {
          type: 'String',
          value: app_salary,
        })
        let app_obligation = formValues.MonthlyBusinessObligation
          ? formValues.MonthlyBusinessObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('appobligation', {
          type: 'String',
          value: app_obligation,
        })
      } else if (formValues.OccupationType.value === 'Others') {
        let app_salary = formValues.GrossMonthlyIncome
          ? formValues.GrossMonthlyIncome.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('ApplicantSalary', {
          type: 'String',
          value: app_salary,
        })
        let app_obligation = formValues.FixedObligation
          ? formValues.FixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('appobligation', {
          type: 'String',
          value: app_obligation,
        })
      }
    }
    if (formValues.c1OccupationType) {
      if (formValues.c1OccupationType.value === 'Salaried') {
        let c1app_salary = formValues.c1salariedMonthlyGrossSalary
          ? formValues.c1salariedMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1ApplicantSalary', {
          type: 'String',
          value: c1app_salary,
        })
        let c1app_obligation = formValues.c1salariedMonthlyFixedObligation
          ? formValues.c1salariedMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1obligation', {
          type: 'String',
          value: c1app_obligation,
        })
      } else if (formValues.c1OccupationType.value === 'Business') {
        let c1app_salary = formValues.c1businessMonthlyGrossSalary
          ? formValues.c1businessMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1ApplicantSalary', {
          type: 'String',
          value: c1app_salary,
        })
        let c1app_obligation = formValues.c1businessMonthlyFixedObligation
          ? formValues.c1businessMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1obligation', {
          type: 'String',
          value: c1app_obligation,
        })
      } else if (formValues.c1OccupationType.value === 'Others') {
        let c1app_salary = formValues.c1othersGrossMonthlyIncome
          ? formValues.c1othersGrossMonthlyIncome.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1ApplicantSalary', {
          type: 'String',
          value: c1app_salary,
        })
        let c1app_obligation = formValues.c1othersMonthlyFixedObligation
          ? formValues.c1othersMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c1obligation', {
          type: 'String',
          value: c1app_obligation,
        })
      }
    } else {
      this.props.fieldPopulator('c1ApplicantSalary', {
        type: 'String',
        value: '0',
      })
      this.props.fieldPopulator('c1obligation', { type: 'String', value: '0' })
    }
    if (formValues.c2OccupationType) {
      if (formValues.c2OccupationType.value === 'Salaried') {
        let c2app_salary = formValues.c2salariedMonthlyGrossSalary
          ? formValues.c2salariedMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2ApplicantSalary', {
          type: 'String',
          value: c2app_salary,
        })
        let c2app_obligation = formValues.c2salariedMonthlyFixedObligation
          ? formValues.c2salariedMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2obligation', {
          type: 'String',
          value: c2app_obligation,
        })
      } else if (formValues.c2OccupationType.value === 'Business') {
        let c2app_salary = formValues.c2businessMonthlyGrossSalary
          ? formValues.c2businessMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2ApplicantSalary', {
          type: 'String',
          value: c2app_salary,
        })
        let c2app_obligation = formValues.c2businessMonthlyFixedObligation
          ? formValues.c2businessMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2obligation', {
          type: 'String',
          value: c2app_obligation,
        })
      } else if (formValues.c2OccupationType.value === 'Others') {
        let c2app_salary = formValues.c2othersGrossMonthlyIncome
          ? formValues.c2othersGrossMonthlyIncome.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2ApplicantSalary', {
          type: 'String',
          value: c2app_salary,
        })
        let c2app_obligation = formValues.c1othersMonthlyFixedObligation
          ? formValues.c1othersMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c2obligation', {
          type: 'String',
          value: c2app_obligation,
        })
      }
    } else {
      this.props.fieldPopulator('c2ApplicantSalary', {
        type: 'String',
        value: 0,
      })
      this.props.fieldPopulator('c2obligation', { type: 'String', value: 0 })
    }
    if (formValues.c3OccupationType) {
      if (formValues.c3OccupationType.value === 'Salaried') {
        let c3app_salary = formValues.c3salariedMonthlyGrossSalary
          ? formValues.c3salariedMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c3ApplicantSalary', {
          type: 'String',
          value: c3app_salary,
        })
        let c3app_obligation = formValues.c3salariedMonthlyFixedObligation
          ? formValues.c3salariedMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c3obligation', {
          type: 'String',
          value: c3app_obligation,
        })
      } else if (formValues.c3OccupationType.value === 'Business') {
        let c3app_salary = formValues.c3businessMonthlyGrossSalary
          ? formValues.c3businessMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c3ApplicantSalary', {
          type: 'String',
          value: c3app_salary,
        })
        let c3app_obligation = formValues.c3businessMonthlyFixedObligation
          ? this.props.formValues.c3businessMonthlyFixedObligation.value.replace(
              /,/g,
              '',
            )
          : 0
        this.props.fieldPopulator('c3obligation', {
          type: 'String',
          value: c3app_obligation,
        })
      } else if (formValues.c3OccupationType.value === 'Others') {
        let c3app_salary = formValues.c3othersGrossMonthlyIncome
          ? formValues.c3othersGrossMonthlyIncome.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c3ApplicantSalary', {
          type: 'String',
          value: c3app_salary,
        })
        let c3app_obligation = formValues.c3othersMonthlyFixedObligation
          ? formValues.c3othersMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c3obligation', {
          type: 'String',
          value: c3app_obligation,
        })
      }
    } else {
      this.props.fieldPopulator('c3ApplicantSalary', {
        type: 'String',
        value: 0,
      })
      this.props.fieldPopulator('c3obligation', { type: 'String', value: 0 })
    }
    if (formValues.c4OccupationType) {
      if (formValues.c4OccupationType.value === 'Salaried') {
        let c4app_salary = formValues.c4salariedMonthlyGrossSalary
          ? formValues.c4salariedMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4ApplicantSalary', {
          type: 'String',
          value: c4app_salary,
        })
        let c4app_obligation = formValues.c4salariedMonthlyFixedObligation
          ? formValues.c4salariedMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4obligation', {
          type: 'String',
          value: c4app_obligation,
        })
      } else if (formValues.c4OccupationType.value === 'Business') {
        let c4app_salary = formValues.c4businessMonthlyGrossSalary
          ? formValues.c4businessMonthlyGrossSalary.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4ApplicantSalary', {
          type: 'String',
          value: c4app_salary,
        })
        let c4app_obligation = formValues.c4businessMonthlyFixedObligation
          ? formValues.c4businessMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4obligation', {
          type: 'String',
          value: c4app_obligation,
        })
      } else if (formValues.c4OccupationType.value === 'Others') {
        let c4app_salary = formValues.c4othersGrossMonthlyIncome
          ? formValues.c4othersGrossMonthlyIncome.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4ApplicantSalary', {
          type: 'String',
          value: c4app_salary,
        })
        let c4app_obligation = formValues.c1othersMonthlyFixedObligation
          ? formValues.c1othersMonthlyFixedObligation.value.replace(/,/g, '')
          : 0
        this.props.fieldPopulator('c4obligation', {
          type: 'String',
          value: c4app_obligation,
        })
      }
    } else {
      this.props.fieldPopulator('c4ApplicantSalary', {
        type: 'String',
        value: 0,
      })
      this.props.fieldPopulator('c4obligation', { type: 'String', value: 0 })
    }
    let NetMonthlyIncome = Math.round(
      parseInt(
        this.props.formValues.ApplicantSalary
          ? this.props.formValues.ApplicantSalary.value
          : 0,
      ) +
        parseInt(
          this.props.formValues.c1ApplicantSalary
            ? this.props.formValues.c1ApplicantSalary.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c2ApplicantSalary
            ? this.props.formValues.c2ApplicantSalary.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c3ApplicantSalary
            ? this.props.formValues.c3ApplicantSalary.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c4ApplicantSalary
            ? this.props.formValues.c4ApplicantSalary.value
            : 0,
        ),
    )

    let financialObligation = Math.round(
      parseInt(
        this.props.formValues.appobligation
          ? this.props.formValues.appobligation.value
          : 0,
      ) +
        parseInt(
          this.props.formValues.c1obligation
            ? this.props.formValues.c1obligation.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c2obligation
            ? this.props.formValues.c2obligation.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c3obligation
            ? this.props.formValues.c3obligation.value
            : 0,
        ) +
        parseInt(
          this.props.formValues.c4obligation
            ? this.props.formValues.c4obligation.value
            : 0,
        ),
    )
    this.props.fieldPopulator('BO_NetIncome', {
      type: 'String',
      value: NetMonthlyIncome,
    })
    this.props.fieldPopulator('BO_Obligation', {
      type: 'String',
      value: financialObligation,
    })
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
        ? isNaN(
            parseInt(
              this.props.formValues.BO_Obligation &&
                this.props.formValues.BO_Obligation.value,
            ),
          )
          ? 0
          : parseInt(
              this.props.formValues.BO_Obligation &&
                this.props.formValues.BO_Obligation.value,
            )
        : isNaN(obligation)
        ? 0
        : obligation
    let expenseValue =
      expense === 0
        ? isNaN(
            parseInt(
              this.props.formValues.BO_ExpenseTotal &&
                this.props.formValues.BO_ExpenseTotal.value,
            ),
          )
          ? 0
          : parseInt(
              this.props.formValues.BO_ExpenseTotal &&
                this.props.formValues.BO_ExpenseTotal.value,
            )
        : isNaN(expense)
        ? 0
        : expense
    let incomeValue =
      income === 0
        ? isNaN(
            parseInt(
              this.props.formValues.BO_NetIncome &&
                this.props.formValues.BO_NetIncome.value,
            ),
          )
          ? 0
          : parseInt(
              this.props.formValues.BO_NetIncome &&
                this.props.formValues.BO_NetIncome.value,
            )
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

  render() {
    let { formValues } = this.props
    const { amount, tenure } = this.state

    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-credit"
        >
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Employment Information'}</h3>
            </div>
            <div className="form-section-content">
              <div>
                <label>
                  <strong>Applicant Employment Information</strong>
                </label>
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
            </div>
          </div>

          {/* Reference checklist */}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Reference Check'}</h3>
            </div>
            <div className="form-section-content">
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
            </div>
          </div>

          {/* file uploaded files checklist  */}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Uploaded Files Check'}</h3>
            </div>
            <div className="form-section-content">
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
                    validate={[uploadChecker(this.state.UploaderEsafSample)]}
                    isReadOnly={true}
                    ipc={this.props.ipc}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KYC/scanned Image checklist */}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Scanned Images Check'}</h3>
            </div>
            <div className="form-section-content">
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
            </div>
          </div>

          {/* Insome and Expense details*/}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Income and Expense Detail"
              sectionKey="IncomeAndExpense"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={false}
            />
            <div className="form-section-content">
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
                    onChange={this.IncomeChange('c2ApplicantSalary')}
                    hasFeedback
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
                    disabled={true}
                    type="tel"
                    hasFeedback
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
                    hasFeedback
                    onChange={this.ExpenseChange('c1appExpense')}
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
                      A8V.required({ errorMsg: 'Fixed Expenses is required' }),
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
                      A8V.required({ errorMsg: 'Fixed Expenses is required' }),
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
                    type="tel"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'FOIR_inPercent is required' }),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BackOffice Comment Section */}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Back Office Remarks"
              sectionKey="BackOfficeComments"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
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
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Credit History">
                      <EditableField
                        name={'CreditHistory'}
                        value={
                          this.props.formValues.CreditHistory &&
                          this.props.formValues.CreditHistory.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Reference Done">
                      <EditableField
                        name={'ReferenceDone'}
                        value={
                          this.props.formValues.ReferenceDone &&
                          this.props.formValues.ReferenceDone.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Negatives">
                      <EditableField
                        name={'Negatives'}
                        value={
                          this.props.formValues.Negatives &&
                          this.props.formValues.Negatives.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Mitigants">
                      <EditableField
                        name={'Mitigants'}
                        value={
                          this.props.formValues.Mitigants &&
                          this.props.formValues.Mitigants.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Cash Flow">
                      <EditableField
                        name={'CashFlow'}
                        value={
                          this.props.formValues.CashFlow &&
                          this.props.formValues.CashFlow.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Utilization of Loan">
                      <EditableField
                        name={'utilizationofLoan'}
                        value={
                          this.props.formValues.utilizationofLoan &&
                          this.props.formValues.utilizationofLoan.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>

                    <Descriptions.Item label="Additional Conditions">
                      <EditableField
                        name={'additionalConditions'}
                        value={
                          this.props.formValues.additionalConditions &&
                          this.props.formValues.additionalConditions.value
                        }
                        validation={true}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <Field
                    label="Loan Scheme"
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Selected Loan Scheme"
                    disabled={true}
                    className="form-control-custom"
                  ></Field>
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <Field
                    label="Rate Of Interest (in Percentage)"
                    name="ROI"
                    component={TextBox}
                    placeholder="Rate of Interest"
                    className="form=control-coustom"
                    disabled={true}
                  ></Field>
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <Field
                    label={'Requested Loan Amount'}
                    name="LoanAmount"
                    component={TextBox}
                    normalize={inrFormat}
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Requested Loan Tenure'}
                    name="ExpectedTenure"
                    component={TextBox}
                    disabled={true}
                    placeholder="Enter LoanTenure"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Insurance Premium'}
                    name="InsurancePremium"
                    component={TextBox}
                    disabled={true}
                    placeholder="Enter InsurancePremium"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Processing Fee'}
                    name="ProcessingFee"
                    component={TextBox}
                    disabled={true}
                    placeholder="Enter ProcessingFee"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <IntegerStep
                    label="Recommended Loan Amount"
                    min={25000}
                    max={this.props.formValues.LoanAmount.value}
                    value={amount}
                    step={1000}
                    onChange={this.handleRecommendedloanAmount}
                  />
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <IntegerStep
                    label="Recommended Loan Tenure (in Months)"
                    min={24}
                    max={this.props.formValues.tenureInput.value}
                    value={tenure}
                    step={1.0}
                    onChange={this.handleRecommendedTenure}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credit Score Card Data Collection */}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Credit Score Data Collection"
              sectionKey="creditScoreDataCollection"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={false}
            />
            <div className="form-section-content">
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
                        Population Group<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="PopulationGroup"
                    component={Select}
                    placeholder="Population Group"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: 'PopulationGroup is required' }),
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
                        Residence Type<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="ResidenceType"
                    component={Select}
                    placeholder="Residence Type"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: 'ResidenceType is required' }),
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
                        errorMsg: 'ExperienceinCurrentEmployment is required',
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
                        Proof of Income<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="ProofofIncome"
                    component={Select}
                    placeholder="Proof of Income"
                    className="a8Select"
                    validate={[
                      A8V.required({ errorMsg: 'Proof of Income is required' }),
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
                        Mode of Repayment<span style={{ color: 'red' }}>*</span>
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
                        Credit Vintage<span style={{ color: 'red' }}>*</span>
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
                    <Option value="1 year to 3 years">1 year to 3 years</Option>
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
                      No hit in CB report/Credit vintage up to 6M and DPD less
                      than 30 days
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
                      No hit in CB report/Credit vintage up to 6M and DPD less
                      than 30 days
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
                    <Option value="715 to 737">715 to 737</Option>
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
            </div>
          </div>

          {/* credit score */}
          {formValues.finalCreditScore &&
            formValues.finalCreditScore.value &&
            formValues.CreditScoreGrade &&
            formValues.CreditScoreGrade.value &&
            formValues.LevelofRisk &&
            formValues.LevelofRisk.value && (
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
                                        Score={formValues.finalCreditScore.value}
                                    /> */}
                      <Scorecards
                        title={'Credit Grade'}
                        Score={formValues.CreditScoreGrade.value}
                      />
                      <Scorecards
                        title={'Level of Risk'}
                        Score={formValues.LevelofRisk.value}
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
                    {this.state.showScoreCard && this.handleScoreCardView()}
                  </div>
                </div>
              </React.Fragment>
            )}

          {/* BackOffice upload Section */}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Back Office Upload'}</h3>
            </div>
            {/** File Uploader */}
            <Field
              label="Uploader Helper"
              name={this.state.BackOfficeUpload.fieldName}
              component={Uploader}
              multiple={true}
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              uploaderConfig={this.state.BackOfficeUpload}
              validate={[uploadChecker(this.state.BackOfficeUpload)]}
              ipc={this.props.ipc}
            />
          </div>

          {/* CAM REPORT */}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'CAM Report'}</h3>
            </div>
            <div className="form-section-content">
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
            </div>
          </div>

          {/* Back Office Decision */}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Back Office Decision"
              sectionKey="BO_Decision"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Lead Generator Code
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="LG_code"
                    component={TextBox}
                    placeholder="LG_code"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Lead Generator Name
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="LG_firstName"
                    component={TextBox}
                    placeholder="LG_Name"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Lead convertor Code
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="LC_code"
                    component={TextBox}
                    placeholder="LC_code"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Lead Convertor Name
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="LC_firstName"
                    component={TextBox}
                    placeholder="LC_firstName"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4"></div>
                <div className="form-group col-xs-6 col-md-4"></div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={' Decision '}
                    name="BackOfficerComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                  <Field
                    hidden={true}
                    name="BOStatus"
                    component={TextArea}
                    type="text"
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'BO_Status is required' }),
                    ]}
                  />
                  <div style={{ display: 'flex' }}>
                    <Button
                      style={{ marginRight: '12px' }}
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.handleApproveClick}
                    >
                      Approve
                    </Button>
                    <Button
                      style={{ marginRight: '12px' }}
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.handleReturnClick}
                    >
                      Return
                    </Button>
                    {/* <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.handleReject}
                    >
                      Reject
                    </Button> */}
                  </div>
                </div>
                {this.state.showReturnTo && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Return To"
                      name="BOreturnTO"
                      component={Select}
                      placeholder="Select Return To"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: 'Return To is required' }),
                      ]}
                    >
                      <Option value="SO_New">SO_New</Option>
                      {/* <Option value="SO_Existing">SO_Existing</Option> */}
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log('##### BACK OFFICE VALUES #####', state)
  return {
    //get current form values
    formValues: getFormValues('backOfficeVerification')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('backOfficeVerification')(state),
  }
}
export default connect(mapStateToProps, {})(Tabl0CreditSanction)

const IntegerStep = ({ label, onChange, value, max, min, step }) => {
  return (
    <div className="form-group col-xs-12 col-md-8">
      <p>{label}</p>
      <Row>
        <Col span={12}>
          <Slider
            min={min}
            max={max}
            onChange={onChange}
            value={value}
            step={step}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={min}
            max={max}
            step={step}
            style={{ marginLeft: 16 }}
            value={value}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  )
}
