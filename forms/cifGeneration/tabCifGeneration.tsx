import * as React from 'react'
import { A8V, FormHeadSection, Config } from '../../helpers'
import {
  TextBox,
  TextArea,
  TextButtonGroup,
  DatePicker,
  Select,
  SelectHelper,
} from 'a8flow-uikit'
import { Field, getFormSyncErrors, getFormValues, isValid } from 'redux-form'
import { connect } from 'react-redux'
import classname from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { Table } from 'antd'
import validate from 'validate.js'
import { default as ApiClient } from 'a8forms-api-client'

const { Option } = SelectHelper
const { Column, ColumnGroup } = Table

type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
  moduleName: any
  isFormValid: any
  touch: any
}

type State = {
  sectionValidator: any
  CIFbuttonLabel: string
  CIFloading: boolean
  CIF_Number: any
  c1CIF_Number: any
  c2CIF_Number: any
  c3CIF_Number: any
  c4CIF_Number: any
  SAV_Options: any
  c1SAV_Options: any
  c2SAV_Options: any
  c3SAV_Options: any
  c4SAV_Options: any
  ShowhiddenFields: any
  c1ShowhiddenFields: any
  c2ShowhiddenFields: any
  c3ShowhiddenFields: any
  c4ShowhiddenFields: any
  AccountNo: any
  response: any
  returnData: any
  errMsg: any
  c1errMsg: any
  c2errMsg: any
  c3errMsg: any
  c4errMsg: any
  errorMsg: any
  showErrMsg: any
  c1showErrMsg: any
  c2showErrMsg: any
  c3showErrMsg: any
  c4showErrMsg: any
  showErrorMsg: any
  ciferror: any
}

class TabCifGeneration extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        appDisbursalInfo: [
          'CustomerID',
          'CIFcustomerName',
          'AccountNo',
          'DisbursementDate',
          'cifButton',
        ],
        c1DisbursalInfo: ['c1CustomerID', 'c1CIFcustomerName', 'c1cifButton'],
        c2DisbursalInfo: ['c2CustomerID', 'c2CIFcustomerName', 'c2cifButton'],
        c3DisbursalInfo: ['c3CustomerID', 'c3CIFcustomerName', 'c3cifButton'],
        c4DisbursalInfo: ['c4CustomerID', 'c4CIFcustomerName', 'c4cifButton'],
      },
      CIFbuttonLabel: 'Fetch CIF',
      CIFloading: false,
      CIF_Number: '',
      c1CIF_Number: '',
      c2CIF_Number: '',
      c3CIF_Number: '',
      c4CIF_Number: '',
      SAV_Options: [],
      c1SAV_Options: [],
      c2SAV_Options: [],
      c3SAV_Options: [],
      c4SAV_Options: [],
      ShowhiddenFields: false,
      c1ShowhiddenFields: false,
      c2ShowhiddenFields: false,
      c3ShowhiddenFields: false,
      c4ShowhiddenFields: false,
      showErrMsg: false,
      c1showErrMsg: false,
      c2showErrMsg: false,
      c3showErrMsg: false,
      c4showErrMsg: false,
      response: '',
      errMsg: '',
      c1errMsg: '',
      c2errMsg: '',
      c3errMsg: '',
      c4errMsg: '',
      returnData: [],
      AccountNo: '',
      showErrorMsg: false,
      errorMsg: '',
      ciferror: '',
    }
  }

  async componentDidMount() {
    this.handleReturn()

    if (this.props.formValues.DateOfBirth) {
      this.props.fieldPopulator('customerDOB', {
        type: 'string',
        value: this.props.formValues.DateOfBirth
          ? moment(this.props.formValues.DateOfBirth.value)
              .format('DD-MM-YYYY')
              .slice(0, 10)
          : '0',
      })
    }
    if (this.props.formValues.c1DateOfBirth) {
      this.props.fieldPopulator('coApplicant_1DOB', {
        type: 'string',
        value: this.props.formValues.c1DateOfBirth
          ? moment(this.props.formValues.c1DateOfBirth.value)
              .format('DD-MM-YYYY')
              .slice(0, 10)
          : '0',
      })
    }
    if (this.props.formValues.c2DateOfBirth) {
      this.props.fieldPopulator('coApplicant_2DOB', {
        type: 'string',
        value: this.props.formValues.c1DateOfBirth
          ? moment(this.props.formValues.c2DateOfBirth.value)
              .format('DD-MM-YYYY')
              .slice(0, 10)
          : '0',
      })
    }

    if (
      this.props.formValues.HouseName &&
      this.props.formValues.StreetArea &&
      this.props.formValues.City &&
      this.props.formValues.District &&
      this.props.formValues.State
    ) {
      let address =
        this.props.formValues.HouseName.value +
        ',' +
        this.props.formValues.StreetArea.value +
        ',' +
        this.props.formValues.City.value +
        ',' +
        this.props.formValues.District.value +
        ',' +
        this.props.formValues.State.value
      this.props.fieldPopulator('customerAddress', {
        type: 'string',
        value: address,
      })
    }

    this.props.fieldPopulator('sanctionLoanAmount', {
      type: 'string',
      value: this.props.formValues.FinalApprovalLoanAmount
        ? this.props.formValues.FinalApprovalLoanAmount.value
        : this.props.formValues.L2RecommendedLoanAmount
        ? this.props.formValues.L2RecommendedLoanAmount.value
        : this.props.formValues.L1RecommendedLoanAmount
        ? this.props.formValues.L1RecommendedLoanAmount.value
        : this.props.formValues.BO_RecommendedLoanAmount
        ? this.props.formValues.BO_RecommendedLoanAmount.value
        : this.props.formValues.LoanAmount.value,
    })

    this.props.fieldPopulator('ProcessingFee', {
      type: 'String',
      value:
        (this.props.formValues.FinalApprovalLoanAmount
          ? this.props.formValues.FinalApprovalLoanAmount.value
          : this.props.formValues.L2RecommendedLoanAmount
          ? this.props.formValues.L2RecommendedLoanAmount.value
          : this.props.formValues.L1RecommendedLoanAmount
          ? this.props.formValues.L1RecommendedLoanAmount.value
          : this.props.formValues.BO_RecommendedLoanAmount
          ? this.props.formValues.BO_RecommendedLoanAmount.value
          : this.props.formValues.LoanAmount.value) * 0.02,
    })

    this.props.fieldPopulator('sanctionTenure', {
      type: 'string',
      value: this.props.formValues.FinalApprovalLoanTenure
        ? this.props.formValues.FinalApprovalLoanTenure.value
        : this.props.formValues.L2RecommendedLoanTenure
        ? this.props.formValues.L2RecommendedLoanTenure.value
        : this.props.formValues.L1RecommendedLoanTenure
        ? this.props.formValues.L1RecommendedLoanTenure.value
        : this.props.formValues.BO_RecommendedLoanTenure
        ? this.props.formValues.BO_RecommendedLoanTenure.value
        : this.props.formValues.tenureInput.value,
    })

    if (
      this.props.formValues.CustomerID &&
      this.props.formValues.CustomerID.value !== ''
    ) {
      this.setState({ ShowhiddenFields: true })
    }
    if (
      this.props.formValues.c1CustomerID &&
      this.props.formValues.c1CustomerID.value !== ''
    ) {
      this.setState({ c1ShowhiddenFields: true })
    }
    if (
      this.props.formValues.c2CustomerID &&
      this.props.formValues.c2CustomerID.value !== ''
    ) {
      this.setState({ c2ShowhiddenFields: true })
    }
    if (
      this.props.formValues.c3CustomerID &&
      this.props.formValues.c3CustomerID.value !== ''
    ) {
      this.setState({ c3ShowhiddenFields: true })
    }
    if (
      this.props.formValues.c4CustomerID &&
      this.props.formValues.c4CustomerID.value !== ''
    ) {
      this.setState({ c4ShowhiddenFields: true })
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
    this.props.fieldPopulator('CIF_claim', {
      type: 'string',
      value: userDetails.data.id,
      valueInfo: {},
    })
    this.props.fieldPopulator('CIFclaim_firstName', {
      type: 'string',
      value: userDetails.data.firstName,
      valueInfo: {},
    })
    this.props.fieldPopulator('CIFclaim_lastName', {
      type: 'string',
      value: userDetails.data.lastName,
      valueInfo: {},
    })
    // END of CDM
  }

  handleReturn = () => {
    let processVariables = this.props.formValues
    let data = []

    if (!validate.isEmpty(processVariables.checkerStatus)) {
      if (processVariables.checkerStatus.value === 'Returned') {
        data.push({
          key: 'Checker',
          name: 'Disbursal Checker',
          value: processVariables.checkersComments
            ? processVariables.checkersComments.value
            : '',
        })
      }
    }
    if (!validate.isEmpty(processVariables.makerStatus)) {
      if (processVariables.makerStatus.value === 'Returned') {
        data.push({
          key: 'maker',
          name: 'Disbursal Maker',
          value: processVariables.MakersComments
            ? processVariables.MakersComments.value
            : '',
        })
      }
    }
    if (!validate.isEmpty(processVariables.docGenStatus)) {
      if (processVariables.docGenStatus.value === 'Returned') {
        data.push({
          key: 'DocGen',
          name: 'Document Generation ',
          value: processVariables.docGenComments
            ? processVariables.docGenComments.value
            : '',
        })
      }
    }
    this.setState({ returnData: data })
  }

  handleCIFCheck = (value) => {
    let CIFprefix = value.trim()
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    let cifConfig = {
      url: `${Config.apiUrl}/v1/customerDetailsInquiry`,
      method: 'post',
      headers: {
        Authorization: authToken,
      },
      data: {
        data: this.props.formValues[`${CIFprefix}CustomerID`]
          ? this.props.formValues[`${CIFprefix}CustomerID`].value
          : '',
      },
    }
    this.setState({ CIFloading: true })
    axios(cifConfig)
      .then(
        (Response) => {
          var data = Response.data
          let CIF_customerFirstName = data['First Name']
          let CIF_customerMiddleName = data['Middle Name']
          let CIF_customerLastName = data['Last Name']
          let CIF_DOB = data['Date of Birth']
          let CIF_proof = data['Primary ID Proof No.']
          let CIF_Aadharnumber = data['Aadharnumber']
          let CIF_drivingLicense = data['Driving license no']
          let CIF_panNo = data['PAN no.']
          let CIF_passportNo = data['Passport No.']
          let CIF_voter = data['Voter id']

          this.props.fieldPopulator(`${CIFprefix}CIFcustomerName`, {
            type: 'string',
            value: CIF_customerFirstName,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFcustomerFirstName`, {
            type: 'String',
            value: CIF_customerFirstName,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFcustomerMiddleName`, {
            type: 'String',
            value: CIF_customerMiddleName,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFcustomerLastName`, {
            type: 'String',
            value: CIF_customerLastName,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFDateOfBirth`, {
            type: 'String',
            value: CIF_DOB,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFcustomerproof`, {
            type: 'String',
            value: CIF_proof,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFaadhaarNo`, {
            type: 'String',
            value: CIF_Aadharnumber,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFdrivingLicense`, {
            type: 'String',
            value: CIF_drivingLicense,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFpanNo`, {
            type: 'string',
            value: CIF_panNo,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFpassportNo`, {
            type: 'string',
            value: CIF_passportNo,
          })
          this.props.fieldPopulator(`${CIFprefix}CIFvoter`, {
            type: 'string',
            value: CIF_voter,
          })
          this.props.fieldPopulator(`${CIFprefix}cifButton`, {
            type: 'string',
            value: 'true',
            valueInfo: {},
          })
          this.setState({
            response: data,
            CIFloading: false,
            [`${CIFprefix}showErrMsg`]: false,
            [`${CIFprefix}ShowhiddenFields`]: true,
          } as Pick<State, keyof State>)

          this.handleSAV_acc(CIFprefix)
        },
        (err) => {
          console.log(err)
          this.setState({
            CIFloading: false,
            [`${CIFprefix}errMsg`]: err.response.data.message,
            [`${CIFprefix}showErrMsg`]: true,
            [`${CIFprefix}ShowhiddenFields`]: false,
          } as Pick<State, keyof State>)
        },
      )
      .catch((err) => {
        console.log(err)
      })
  }
  handleSAV_acc = (value) => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null

    let CIFprefix = value
    let payload = {
      customer_id: this.props.formValues[`${CIFprefix}CustomerID`].value,
    }
    let Acc_Config = {
      url: `${Config.apiUrl}/v1/inquireCustomerAccountDetails`,
      method: 'post',
      headers: {
        Authorization: authToken,
      },
      data: payload,
    }
    axios(Acc_Config)
      .then((Response) => {
        // console.log('response', Response)
        let accountDetails = Response.data.Response.CASA_AccountList
        this.props.fieldPopulator('AccountNo', {
          type: 'String',
          value: '',
          valueInfo: {},
        })
        let account = []
        if (Array.isArray(accountDetails.ChAccount) === true) {
          accountDetails.ChAccount.forEach((chAccount) => {
            if (
              chAccount.ProductCode._text === '504' ||
              chAccount.ProductCode._text === '501' ||
              chAccount.ProductCode._text === '502' ||
              chAccount.ProductCode._text === '505' ||
              chAccount.ProductCode._text === '507' ||
              chAccount.ProductCode._text === '508' ||
              chAccount.ProductCode._text === '510' ||
              chAccount.ProductCode._text === '516' ||
              chAccount.ProductCode._text === '517' ||
              chAccount.ProductCode._text === '520' ||
              chAccount.ProductCode._text === '522' ||
              chAccount.ProductCode._text === '523' ||
              chAccount.ProductCode._text === '531' ||
              chAccount.ProductCode._text === '532' ||
              chAccount.ProductCode._text === '533' ||
              chAccount.ProductCode._text === '534' ||
              chAccount.ProductCode._text === '535' ||
              chAccount.ProductCode._text === '536' ||
              chAccount.ProductCode._text === '537' ||
              chAccount.ProductCode._text === '538' ||
              chAccount.ProductCode._text === '539' ||
              chAccount.ProductCode._text === '101' ||
              chAccount.ProductCode._text === '102' ||
              chAccount.ProductCode._text === '203' ||
              chAccount.ProductCode._text === '204'
            ) {
              account.push(chAccount.AccountNumber._text)
            }
          })
          this.setState({ ciferror: '' })
        } else {
          if (
            accountDetails.ChAccount.ProductCode._text === '504' ||
            accountDetails.ChAccount.ProductCode._text === '501' ||
            accountDetails.ChAccount.ProductCode._text === '502' ||
            accountDetails.ChAccount.ProductCode._text === '505' ||
            accountDetails.ChAccount.ProductCode._text === '507' ||
            accountDetails.ChAccount.ProductCode._text === '508' ||
            accountDetails.ChAccount.ProductCode._text === '510' ||
            accountDetails.ChAccount.ProductCode._text === '516' ||
            accountDetails.ChAccount.ProductCode._text === '517' ||
            accountDetails.ChAccount.ProductCode._text === '520' ||
            accountDetails.ChAccount.ProductCode._text === '522' ||
            accountDetails.ChAccount.ProductCode._text === '523' ||
            accountDetails.ChAccount.ProductCode._text === '531' ||
            accountDetails.ChAccount.ProductCode._text === '532' ||
            accountDetails.ChAccount.ProductCode._text === '533' ||
            accountDetails.ChAccount.ProductCode._text === '534' ||
            accountDetails.ChAccount.ProductCode._text === '535' ||
            accountDetails.ChAccount.ProductCode._text === '536' ||
            accountDetails.ChAccount.ProductCode._text === '537' ||
            accountDetails.ChAccount.ProductCode._text === '538' ||
            accountDetails.ChAccount.ProductCode._text === '539' ||
            accountDetails.ChAccount.ProductCode._text === '101' ||
            accountDetails.ChAccount.ProductCode._text === '102' ||
            accountDetails.ChAccount.ProductCode._text === '203' ||
            accountDetails.ChAccount.ProductCode._text === '204'
          ) {
            account.push(accountDetails.ChAccount.AccountNumber._text)
          }
        }
        this.setState(({
          showErrMsg: false,
          [`${CIFprefix}SAV_Options`]: account,
        } as unknown) as Pick<State, keyof State>)
      })
      .catch((err) => {
        this.props.fieldPopulator('AccountNo', {
          type: 'String',
          value: '',
          valueInfo: {},
        })
        this.props.touch('cifGeneration', 'AccountNo')
        this.setState({
          ciferror: err.response.data.code
            ? err.response.data.code
            : 'NO Data Found',
        })
      })
  }

  handleDocGenVariables = (e: any) => {
    let formValues = Object.keys(this.props.formValues)
    let data = this.handleAddressInfo()
    let c1data = formValues.some((key) => key.startsWith('c1'))
      ? this.handleAddressInfo('c1')
      : []
    let c2data = formValues.some((key) => key.startsWith('c2'))
      ? this.handleAddressInfo('c2')
      : []
    let c3data = formValues.some((key) => key.startsWith('c3'))
      ? this.handleAddressInfo('c3')
      : []
    let c4data = formValues.some((key) => key.startsWith('c4'))
      ? this.handleAddressInfo('c4')
      : []
    let g1data = formValues.some((key) => key.startsWith('g1'))
      ? this.handleAddressInfo('g1')
      : []
    let g2data = formValues.some((key) => key.startsWith('g2'))
      ? this.handleAddressInfo('g2')
      : []
    let c1_data = formValues.some((key) => key.startsWith('c1'))
      ? this.handleCoAppData('c1')
      : []
    let c2_data = formValues.some((key) => key.startsWith('c2'))
      ? this.handleCoAppData('c2')
      : []
    let c3_data = formValues.some((key) => key.startsWith('c3'))
      ? this.handleCoAppData('c3')
      : []
    let c4_data = formValues.some((key) => key.startsWith('c4'))
      ? this.handleCoAppData('c4')
      : []
    let g1_data = formValues.some((key) => key.startsWith('g1'))
      ? this.handleCoAppData('g1')
      : []
    let g2_data = formValues.some((key) => key.startsWith('g2'))
      ? this.handleCoAppData('g2')
      : []

    this.props.fieldPopulator('DPN', {
      type: 'String',
      value: JSON.stringify({
        LoanPurpose: this.props.formValues.LoanPurpose
          ? this.props.formValues.LoanPurpose.value
          : '',
        RecommendedLoanAmount: this.props.formValues.FinalApprovalLoanAmount
          ? this.props.formValues.FinalApprovalLoanAmount.value
          : this.props.formValues.L2RecommendedLoanAmount
          ? this.props.formValues.L2RecommendedLoanAmount.value
          : this.props.formValues.L1RecommendedLoanAmount
          ? this.props.formValues.L1RecommendedLoanAmount.value
          : this.props.formValues.BO_RecommendedLoanAmount
          ? this.props.formValues.BO_RecommendedLoanAmount.value
          : this.props.formValues.LoanAmount.value,
        RecommendedLoanTenure: this.props.formValues.FinalApprovalLoanTenure
          ? this.props.formValues.FinalApprovalLoanTenure.value
          : this.props.formValues.L2RecommendedLoanTenure
          ? this.props.formValues.L2RecommendedLoanTenure.value
          : this.props.formValues.L1RecommendedLoanTenure
          ? this.props.formValues.L1RecommendedLoanTenure.value
          : this.props.formValues.BO_RecommendedLoanTenure
          ? this.props.formValues.BO_RecommendedLoanTenure.value
          : this.props.formValues.tenureInput.value,
        EstimatedEMI: this.props.formValues.EstimatedEMI
          ? this.props.formValues.EstimatedEMI.value
          : '',
        BorrowerName: this.props.formValues.BorrowerName
          ? this.props.formValues.BorrowerName.value
          : '',
        ROI: this.props.formValues.ROI ? this.props.formValues.ROI.value : '',
        c1FirstName: this.props.formValues.c1CIFcustomerFirstName
          ? this.props.formValues.c1CIFcustomerFirstName.value
          : '',
        c2FirstName: this.props.formValues.c2CIFcustomerFirstName
          ? this.props.formValues.c2CIFcustomerFirstName.value
          : '',
        c3FirstName: this.props.formValues.c3CIFcustomerFirstName
          ? this.props.formValues.c3CIFcustomerFirstName.value
          : '',
        c4FirstName: this.props.formValues.c4CIFcustomerFirstName
          ? this.props.formValues.c4CIFcustomerFirstName.value
          : '',
        BranchName: this.props.formValues.BranchName
          ? this.props.formValues.BranchName.value
          : '',
        ProcessingFee: this.props.formValues.ProcessingFee
          ? this.props.formValues.ProcessingFee.value
          : '',
        RepaymentFrequency: this.props.formValues.RepaymentFrequency
          ? this.props.formValues.RepaymentFrequency.value
          : '',
      }),
    })

    this.props.fieldPopulator('DocChecklist', {
      type: 'String',
      value: JSON.stringify({
        BorrowerName: this.props.formValues.CIFcustomerFirstName
          ? this.props.formValues.CIFcustomerFirstName.value
          : '',
        BranchName: this.props.formValues.BranchName
          ? this.props.formValues.BranchName.value
          : '',
        WorkItemNo: this.props.formValues.WorkItemNo
          ? this.props.formValues.WorkItemNo.value
          : '',
        LoanPurpose: this.props.formValues.LoanPurpose
          ? this.props.formValues.LoanPurpose.value
          : '',

        RecommendedLoanAmount: this.props.formValues.FinalApprovalLoanAmount
          ? this.props.formValues.FinalApprovalLoanAmount.value
          : this.props.formValues.L2RecommendedLoanAmount
          ? this.props.formValues.L2RecommendedLoanAmount.value
          : this.props.formValues.L1RecommendedLoanAmount
          ? this.props.formValues.L1RecommendedLoanAmount.value
          : this.props.formValues.BO_RecommendedLoanAmount
          ? this.props.formValues.BO_RecommendedLoanAmount.value
          : this.props.formValues.LoanAmount.value,

        BranchID: this.props.formValues.BranchID
          ? this.props.formValues.BranchID.value
          : '',
        CustomerID: this.props.formValues.CustomerID
          ? this.props.formValues.CustomerID.value
          : '',
      }),
    })

    this.props.fieldPopulator('demandPromisory', {
      type: 'String',
      value: JSON.stringify({
        BranchName: this.props.formValues.BranchName
          ? this.props.formValues.BranchName.value
          : '',
        LoanAmount: this.props.formValues.LoanAmount
          ? this.props.formValues.LoanAmount.value
          : '',
        BorrowerName: this.props.formValues.CIFcustomerFirstName
          ? this.props.formValues.CIFcustomerFirstName.value
          : '',
        c1FirstName: this.props.formValues.c1CIFcustomerFirstName
          ? this.props.formValues.c1CIFcustomerFirstName.value
          : '',
        c2FirstName: this.props.formValues.c2CIFcustomerFirstName
          ? this.props.formValues.c2CIFcustomerFirstName.value
          : '',
        Age: this.props.formValues.Age ? this.props.formValues.Age.value : '',
        RecommendedLoanAmount: this.props.formValues.FinalApprovalLoanAmount
          ? this.props.formValues.FinalApprovalLoanAmount.value
          : this.props.formValues.L2RecommendedLoanAmount
          ? this.props.formValues.L2RecommendedLoanAmount.value
          : this.props.formValues.L1RecommendedLoanAmount
          ? this.props.formValues.L1RecommendedLoanAmount.value
          : this.props.formValues.BO_RecommendedLoanAmount
          ? this.props.formValues.BO_RecommendedLoanAmount.value
          : this.props.formValues.LoanAmount.value,
        ROI: this.props.formValues.ROI ? this.props.formValues.ROI.value : '',
        LoanAmountInWords: this.props.formValues.FinalApprovalLoanAmount_inwords
          ? this.props.formValues.FinalApprovalLoanAmount_inwords.value
          : this.props.formValues.L2RecommendedLoanAmount_inwords
          ? this.props.formValues.L2RecommendedLoanAmount_inwords.value
          : this.props.formValues.L1RecommendedLoanAmount_inwords
          ? this.props.formValues.L1RecommendedLoanAmount_inwords.value
          : this.props.formValues.BO_RecommendedLoanAmount_inwords
          ? this.props.formValues.BO_RecommendedLoanAmount_inwords.value
          : this.props.formValues.LoanAmountInWords.value,
        today: moment(Date()).format('DD-MM-YYYY').slice(0, 10),
      }),
    })

    this.props.fieldPopulator('standingInstruction', {
      type: 'String',
      value: JSON.stringify({
        BorrowerName: this.props.formValues.CIFcustomerFirstName
          ? this.props.formValues.CIFcustomerFirstName.value
          : '',
        BranchName: this.props.formValues.BranchName
          ? this.props.formValues.BranchName.value
          : '',
        c1FirstName: this.props.formValues.c1CIFcustomerFirstName
          ? this.props.formValues.c1CIFcustomerFirstName.value
          : '',
        c2FirstName: this.props.formValues.c2CIFcustomerFirstName
          ? this.props.formValues.c2CIFcustomerFirstName.value
          : '',
        c3FirstName: this.props.formValues.c3CIFcustomerFirstName
          ? this.props.formValues.c3CIFcustomerFirstName.value
          : '',
        c4FirstName: this.props.formValues.c4CIFcustomerFirstName
          ? this.props.formValues.c4CIFcustomerFirstName.value
          : '',
        EstimatedEMI: this.props.formValues.EstimatedEMI
          ? this.props.formValues.EstimatedEMI.value
          : '',
        RepaymentFrequency: this.props.formValues.RepaymentFrequency
          ? this.props.formValues.RepaymentFrequency.value
          : '',
        RecommendedLoanTenure: this.props.formValues.FinalApprovalLoanTenure
          ? this.props.formValues.FinalApprovalLoanTenure.value
          : this.props.formValues.L2RecommendedLoanTenure
          ? this.props.formValues.L2RecommendedLoanTenure.value
          : this.props.formValues.L1RecommendedLoanTenure
          ? this.props.formValues.L1RecommendedLoanTenure.value
          : this.props.formValues.BO_RecommendedLoanTenure
          ? this.props.formValues.BO_RecommendedLoanTenure.value
          : this.props.formValues.tenureInput.value,
        RecommendedLoanAmount: this.props.formValues.FinalApprovalLoanAmount
          ? this.props.formValues.FinalApprovalLoanAmount.value
          : this.props.formValues.L2RecommendedLoanAmount
          ? this.props.formValues.L2RecommendedLoanAmount.value
          : this.props.formValues.L1RecommendedLoanAmount
          ? this.props.formValues.L1RecommendedLoanAmount.value
          : this.props.formValues.BO_RecommendedLoanAmount
          ? this.props.formValues.BO_RecommendedLoanAmount.value
          : this.props.formValues.LoanAmount.value,
        LoanAmountInWords: this.props.formValues.FinalApprovalLoanAmount_inwords
          ? this.props.formValues.FinalApprovalLoanAmount_inwords.value
          : this.props.formValues.L2RecommendedLoanAmount_inwords
          ? this.props.formValues.L2RecommendedLoanAmount_inwords.value
          : this.props.formValues.L1RecommendedLoanAmount_inwords
          ? this.props.formValues.L1RecommendedLoanAmount_inwords.value
          : this.props.formValues.BO_RecommendedLoanAmount_inwords
          ? this.props.formValues.BO_RecommendedLoanAmount_inwords.value
          : this.props.formValues.LoanAmountInWords.value,
        AccountNo: e.value,
        CustomerID: this.props.formValues.CustomerID
          ? this.props.formValues.CustomerID.value
          : '',
        EMI_inWords: this.props.formValues.EMI_inWords
          ? this.props.formValues.EMI_inWords.value
          : '',
        today: moment(Date()).format('DD-MM-YYYY').slice(0, 10),
      }),
    })

    let sanctionLetterdata = JSON.stringify({
      BranchName: this.props.formValues.BranchName
        ? this.props.formValues.BranchName.value
        : '',
      BranchID: this.props.formValues.BranchID
        ? this.props.formValues.BranchID.value
        : '',
      WorkItemNo: this.props.formValues.WorkItemNo
        ? this.props.formValues.WorkItemNo.value
        : '',
      BorrowerName: this.props.formValues.CIFcustomerFirstName
        ? this.props.formValues.CIFcustomerFirstName.value
        : '',
      FatherName: this.props.formValues.FatherName
        ? this.props.formValues.FatherName.value
        : '',
      AadhaarNo: this.props.formValues.CIFaadhaarNo
        ? this.props.formValues.CIFaadhaarNo.value
        : '',
      VoterIDNumber: this.props.formValues.CIFvoter
        ? this.props.formValues.CIFvoter.value
        : '',
      BorrowerMobile: this.props.formValues.BorrowerMobile
        ? this.props.formValues.BorrowerMobile.value
        : '',
      LoanPurpose: this.props.formValues.LoanPurpose
        ? this.props.formValues.LoanPurpose.value
        : '',
      RecommendedLoanAmount: this.props.formValues.FinalApprovalLoanAmount
        ? this.props.formValues.FinalApprovalLoanAmount.value
        : this.props.formValues.L2RecommendedLoanAmount
        ? this.props.formValues.L2RecommendedLoanAmount.value
        : this.props.formValues.L1RecommendedLoanAmount
        ? this.props.formValues.L1RecommendedLoanAmount.value
        : this.props.formValues.BO_RecommendedLoanAmount
        ? this.props.formValues.BO_RecommendedLoanAmount.value
        : this.props.formValues.LoanAmount.value,
      RecommendedLoanTenure: this.props.formValues.FinalApprovalLoanTenure
        ? this.props.formValues.FinalApprovalLoanTenure.value
        : this.props.formValues.L2RecommendedLoanTenure
        ? this.props.formValues.L2RecommendedLoanTenure.value
        : this.props.formValues.L1RecommendedLoanTenure
        ? this.props.formValues.L1RecommendedLoanTenure.value
        : this.props.formValues.BO_RecommendedLoanTenure
        ? this.props.formValues.BO_RecommendedLoanTenure.value
        : this.props.formValues.tenureInput.value,
      LoanAmountInWords: this.props.formValues.FinalApprovalLoanAmount_inwords
        ? this.props.formValues.FinalApprovalLoanAmount_inwords.value
        : this.props.formValues.L2RecommendedLoanAmount_inwords
        ? this.props.formValues.L2RecommendedLoanAmount_inwords.value
        : this.props.formValues.L1RecommendedLoanAmount_inwords
        ? this.props.formValues.L1RecommendedLoanAmount_inwords.value
        : this.props.formValues.BO_RecommendedLoanAmount_inwords
        ? this.props.formValues.BO_RecommendedLoanAmount_inwords.value
        : this.props.formValues.LoanAmountInWords.value,
      LoanSubType: this.props.formValues.LoanSubType
        ? this.props.formValues.LoanSubType.value
        : '',
      OccupationType: this.props.formValues.OccupationType
        ? this.props.formValues.OccupationType.value
        : '',
      MarginAmount: this.props.formValues.MarginAmount
        ? this.props.formValues.MarginAmount.value
        : '',
      Manufacturer: this.props.formValues.Manufacturer
        ? this.props.formValues.Manufacturer.value
        : '',
      AssetModel: this.props.formValues.AssetModel
        ? this.props.formValues.AssetModel.value
        : '',
      ExShowroomPrice: this.props.formValues.ExShowroomPrice
        ? this.props.formValues.ExShowroomPrice.value
        : '',
      InsurancePremium: this.props.formValues.InsurancePremium
        ? this.props.formValues.InsurancePremium.value
        : '',
      ProcessingFee: this.props.formValues.ProcessingFee
        ? this.props.formValues.ProcessingFee.value
        : '',
      Margin_inWords: this.props.formValues.Margin_inWords
        ? this.props.formValues.Margin_inWords.value
        : '',
      EstimatedEMI: this.props.formValues.EstimatedEMI
        ? this.props.formValues.EstimatedEMI.value
        : '',
      EMI_inWords: this.props.formValues.EMI_inWords
        ? this.props.formValues.EMI_inWords.value
        : '',
      AccountNo: e.value,
      RepaymentFrequency: this.props.formValues.RepaymentFrequency
        ? this.props.formValues.RepaymentFrequency.value
        : '',
      CustomerID: this.props.formValues.CustomerID
        ? this.props.formValues.CustomerID.value
        : '',
      BackOfficerComments: this.props.formValues.BackOfficerComments
        ? this.props.formValues.BackOfficerComments.value
        : '',
      L1OfficerComments: this.props.formValues.L1OfficerComments
        ? this.props.formValues.L1OfficerComments.value
        : '',
      L2OfficerComments: this.props.formValues.L2OfficerComments
        ? this.props.formValues.L2OfficerComments.value
        : '',
      FinalApproverComments: this.props.formValues.FinalApproverComments
        ? this.props.formValues.FinalApproverComments.value
        : '',
      today: moment(Date()).format('DD-MM-YYYY').slice(0, 10),
      additionalConditions: this.props.formValues.additionalConditions
        ? this.props.formValues.additionalConditions.value
        : '',

      ...data,
      ...c1data,
      ...c2data,
      ...c3data,
      ...c4data,
      ...g1data,
      ...g2data,
      ...c1_data,
      ...c2_data,
      ...c3_data,
      ...c4_data,
      ...g1_data,
      ...g2_data,
    })
    this.props.fieldPopulator('sanctionLetter', {
      type: 'String',
      value: sanctionLetterdata,
    })
  }

  handleAddressInfo = (coApplicantPrefix = '') => {
    let data = {
      [`${coApplicantPrefix}HouseName`]: '',
      [`${coApplicantPrefix}StreetArea`]: '',
      [`${coApplicantPrefix}City`]: '',
      [`${coApplicantPrefix}District`]: '',
      [`${coApplicantPrefix}State`]: '',
      [`${coApplicantPrefix}Pincode`]: '',
    }
    if (
      this.props.formValues[
        `${coApplicantPrefix}PresentAddressSameAsApplicant`
      ] &&
      this.props.formValues[`${coApplicantPrefix}PresentAddressSameAsApplicant`]
        .value === 'Yes'
    ) {
      data[`${coApplicantPrefix}HouseName`] = this.props.formValues.HouseName
        ? this.props.formValues.HouseName.value
        : ''
      data[`${coApplicantPrefix}StreetArea`] = this.props.formValues.StreetArea
        ? this.props.formValues.StreetArea.value
        : ''
      data[`${coApplicantPrefix}City`] = this.props.formValues.City
        ? this.props.formValues.City.value
        : ''
      data[`${coApplicantPrefix}District`] = this.props.formValues.District
        ? this.props.formValues.District.value
        : ''
      data[`${coApplicantPrefix}State`] = this.props.formValues.State
        ? this.props.formValues.State.value
        : ''
      data[`${coApplicantPrefix}Pincode`] = this.props.formValues.Pincode
        ? this.props.formValues.Pincode.value
        : ''
    } else {
      data[`${coApplicantPrefix}HouseName`] = this.props.formValues[
        `${coApplicantPrefix}HouseName`
      ]
        ? this.props.formValues.HouseName.value
        : ''
      data[`${coApplicantPrefix}StreetArea`] = this.props.formValues[
        `${coApplicantPrefix}StreetArea`
      ]
        ? this.props.formValues[`${coApplicantPrefix}StreetArea`].value
        : ''
      data[`${coApplicantPrefix}City`] = this.props.formValues[
        `${coApplicantPrefix}City`
      ]
        ? this.props.formValues[`${coApplicantPrefix}City`].value
        : ''
      data[`${coApplicantPrefix}District`] = this.props.formValues[
        `${coApplicantPrefix}District`
      ]
        ? this.props.formValues[`${coApplicantPrefix}District`].value
        : ''
      data[`${coApplicantPrefix}State`] = this.props.formValues[
        `${coApplicantPrefix}State`
      ]
        ? this.props.formValues[`${coApplicantPrefix}State`].value
        : ''
      data[`${coApplicantPrefix}Pincode`] = this.props.formValues[
        `${coApplicantPrefix}Pincode`
      ]
        ? this.props.formValues[`${coApplicantPrefix}Pincode`].value
        : ''
    }
    return data
  }
  handleCoAppData = (coApplicantPrefix = '') => {
    let data = {
      [`${coApplicantPrefix}FirstName`]: this.props.formValues[
        `${coApplicantPrefix}CIFcustomerFirstName`
      ]
        ? this.props.formValues[`${coApplicantPrefix}FirstName`].value
        : '',
      [`${coApplicantPrefix}FatherName`]: this.props.formValues[
        `${coApplicantPrefix}FatherName`
      ]
        ? this.props.formValues[`${coApplicantPrefix}FatherName`].value
        : '',
      [`${coApplicantPrefix}AadhaarNo`]: this.props.formValues[
        `${coApplicantPrefix}CIFaadhaarNo`
      ]
        ? this.props.formValues[`${coApplicantPrefix}CIFaadhaarNo`].value
        : '',
      [`${coApplicantPrefix}VoterIDNumber`]: this.props.formValues[
        `${coApplicantPrefix}CIFvoter`
      ]
        ? this.props.formValues[`${coApplicantPrefix}CIFvoter`].value
        : '',
      [`${coApplicantPrefix}mobileNumber`]: this.props.formValues[
        `${coApplicantPrefix}mobileNumber`
      ]
        ? this.props.formValues[`${coApplicantPrefix}mobileNumber`].value
        : '',
      [`${coApplicantPrefix}CustomerID`]: this.props.formValues[
        `${coApplicantPrefix}CustomerID`
      ]
        ? this.props.formValues[`${coApplicantPrefix}CustomerID`].value
        : '',
    }
    return data
  }

  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >
          {/*Returned Section */}
          {((this.props.formValues.checkerStatus &&
            this.props.formValues.checkerStatus.value === 'Returned') ||
            (this.props.formValues.makerStatus &&
              this.props.formValues.makerStatus.value === 'Returned') ||
            (this.props.formValues.docGenStatus &&
              this.props.formValues.docGenStatus.value === 'Returned')) && (
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
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', {
                on: false,
              })}
            >
              <h3>{'Applicant Information'}</h3>
            </div>
            <div className="form-section-content" style={{ display: 'block' }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Work Item No'}
                    name="WorkItemNo"
                    component={TextBox}
                    placeholder="Enter WorkItemNo"
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'WorkItemNo is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Customer Name'}
                    name="BorrowerName"
                    component={TextBox}
                    placeholder="Enter Borrower Name"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Borrower Name is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Customer DOB'}
                    name="customerDOB"
                    component={TextBox}
                    placeholder="Enter DOB"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Customer Address'}
                    name="customerAddress"
                    component={TextArea}
                    placeholder="Enter customerAddress"
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                    // validate={[
                    //     A8V.required({ errorMsg: "Customer Address is required" }),
                    // ]}
                  />
                </div>
                {this.props.formValues.c1FirstName && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Co-Applicant_1 Name'}
                      name="c1FirstName"
                      component={TextBox}
                      placeholder="Enter First Name"
                      type="text"
                      disabled={true}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                )}
                {this.props.formValues.c1DateOfBirth && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Co-Applicant_1 DOB'}
                      name="coApplicant_1DOB"
                      component={TextBox}
                      placeholder="Enter coApplicant_1DOB"
                      type="text"
                      disabled={true}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                )}
                {this.props.formValues.c2FirstName && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Co-Applicant_2 Name'}
                      name="c2FirstName"
                      component={TextBox}
                      placeholder="Enter First Name"
                      type="text"
                      disabled={true}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                )}
                {this.props.formValues.c2DateOfBirth && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Co-Applicant_2 DOB'}
                      name="coApplicant_2DOB"
                      component={TextBox}
                      placeholder="Enter coApplicant_2DOB"
                      type="text"
                      disabled={true}
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                )}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Loan Product'}
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Enter LoanPurpose"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Loan Purpose is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Sanctioned Loan Amount'}
                    name="sanctionLoanAmount"
                    component={TextBox}
                    placeholder="Enter sanctionLoanAmount"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({
                        errorMsg: 'sanctionLoanAmount is required',
                      }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Loan Tenure'}
                    name="sanctionTenure"
                    component={TextBox}
                    placeholder="Enter sanctionTenure"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'sanctionTenure is required' }),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Applicant Disbursal Information"
              sectionKey="appDisbursalInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-6">
                  <Field
                    label={'Customer ID'}
                    name="CustomerID"
                    component={TextButtonGroup}
                    placeholder="Enter AccountNumber"
                    type="text"
                    showDefaultSTD={false}
                    onChange={(e: any) => {
                      this.setState({ CIF_Number: e.value })
                      this.props.fieldPopulator('cifButton', {
                        type: 'string',
                        value: '',
                        valueInfo: {},
                      })
                    }}
                    hasFeedback
                    maxLength={12}
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'Account Number is required' }),
                    ]}
                    buttonLabel={this.state.CIFbuttonLabel}
                    isButtonLoading={this.state.CIFloading}
                    onButtonClick={() => {
                      this.handleCIFCheck('')
                    }}
                  />
                </div>
                <Field
                  hidden={true}
                  name="cifButton"
                  component={TextBox}
                  className="form-control-custom"
                  validate={[
                    A8V.required({ errorMsg: 'cifButton is required' }),
                  ]}
                />

                {this.state.showErrMsg && (
                  <p color="red">{this.state.errMsg}</p>
                )}
                {this.state.ShowhiddenFields && (
                  <React.Fragment>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Customer Name'}
                        name="CIFcustomerName"
                        component={TextBox}
                        placeholder="Enter Borrower Name"
                        type="text"
                        hasFeedback
                        disabled={true}
                        className="form-control-coustom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Borrower Name is required',
                          }),
                        ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={'Customer Primary Proof No'}
                        name="CIFcustomerproof"
                        component={TextBox}
                        placeholder="Enter Primary Proof No"
                        type="text"
                        maxLength={12}
                        disabled={true}
                        hasFeedback
                        className="form-control-custom"
                        // validate={[
                        //   A8V.required({ errorMsg: "Aadhaar Number is required" }),
                        // ]}
                      />
                    </div>
                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label="Customer Date Of Birth"
                        name="CIFDateOfBirth"
                        component={TextBox}
                        disabled={true}
                        className="form-control-custom"
                        validate={[
                          A8V.required({ errorMsg: 'DateOfBirth is required' }),
                        ]}
                      />
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={
                          <span>
                            Customer SB Acc/No.
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="AccountNo"
                        component={Select}
                        placeholder="Choose Account Number"
                        className="a8Select"
                        onChange={this.handleDocGenVariables}
                        validate={[
                          A8V.required({
                            errorMsg: 'Account Number is required',
                          }),
                        ]}
                      >
                        {this.state.SAV_Options.map((data) => (
                          <Option key={data} value={data}>
                            {data}
                          </Option>
                        ))}
                      </Field>
                      {this.state.ciferror && (
                        <p style={{ color: 'red' }}>{this.state.ciferror}</p>
                      )}
                    </div>

                    <div className="form-group col-xs-6 col-md-4">
                      <Field
                        // label="Disbursement Date"
                        label={
                          <span>
                            {' '}
                            Disbursement Date
                            <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        name="DisbursementDate"
                        type="date"
                        component={DatePicker}
                        dateFormat="DD/MM/YYYY"
                        placeholder="Select Disbursal Date"
                        validate={[
                          A8V.required({
                            errorMsg: 'Disbursement Date is required',
                          }),
                        ]}
                        disabledDate={(current) => {
                          return current && current < moment().add(-1, 'day')
                        }}
                      />
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          {this.props.formValues.coBorrowerSelect &&
            (this.props.formValues.coBorrowerSelect.value === '1' ||
              this.props.formValues.coBorrowerSelect.value === '2' ||
              this.props.formValues.coBorrowerSelect.value === '3' ||
              this.props.formValues.coBorrowerSelect.value === '4') && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="Co-Applicant_1 Disbursal Information"
                  sectionKey="c1DisbursalInfo"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label={'Customer ID'}
                        name="c1CustomerID"
                        component={TextButtonGroup}
                        placeholder="Enter AccountNumber"
                        type="text"
                        showDefaultSTD={false}
                        onChange={() =>
                          this.props.fieldPopulator('c1cifButton', {
                            type: 'string',
                            value: '',
                            valueInfo: {},
                          })
                        }
                        hasFeedback
                        maxLength={12}
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Account Number is required',
                          }),
                        ]}
                        buttonLabel={this.state.CIFbuttonLabel}
                        isButtonLoading={this.state.CIFloading}
                        onButtonClick={() => {
                          this.handleCIFCheck('c1')
                        }}
                      />
                    </div>
                    <Field
                      hidden={true}
                      name="c1cifButton"
                      component={TextBox}
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: 'c1cifButton is required' }),
                      ]}
                    />
                    {this.state.c1showErrMsg && (
                      <p color="red">{this.state.c1errMsg}</p>
                    )}
                    {this.state.c1ShowhiddenFields && (
                      <React.Fragment>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Name'}
                            name="c1CIFcustomerName"
                            component={TextBox}
                            placeholder="Enter Borrower Name"
                            type="text"
                            hasFeedback
                            disabled={true}
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: 'Borrower Name is required',
                              }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Primary Proof No'}
                            name="c1CIFcustomerproof"
                            component={TextBox}
                            placeholder="Enter  Aadhaar Number"
                            type="text"
                            maxLength={12}
                            hasFeedback
                            disabled={true}
                            className="form-control-custom"
                            // validate={[
                            //   A8V.required({ errorMsg: "Aadhaar Number is required" }),
                            // ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="Customer Date Of Birth"
                            name="c1CIFDateOfBirth"
                            component={TextBox}
                            disabled={true}
                            className="form-control-custom"
                            placeholder="Enter Date of Birth"
                            validate={[
                              A8V.required({
                                errorMsg: 'DateOfBirth is required',
                              }),
                            ]}
                          />
                        </div>
                        {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Customer SB Acc/No."}
                        name="c1AccountNo"
                        component={Select}
                        placeholder="Choose Account Number"
                        hasFeedback
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Account Number is required" }),
                        ]}
                      >
                        {this.state.c1SAV_Options.map(data => (
                          <Option key={data} value={data}>{data}</Option>
                        ))}
                      </Field>
                    </div> */}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            )}
          {this.props.formValues.coBorrowerSelect &&
            (this.props.formValues.coBorrowerSelect.value === '2' ||
              this.props.formValues.coBorrowerSelect.value === '3' ||
              this.props.formValues.coBorrowerSelect.value === '4') && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="Co-Applicant_2 Disbursal Information"
                  sectionKey="c2DisbursalInfo"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label={'Customer ID'}
                        name="c2CustomerID"
                        component={TextButtonGroup}
                        placeholder="Enter AccountNumber"
                        type="text"
                        showDefaultSTD={false}
                        onChange={() =>
                          this.props.fieldPopulator('c2cifButton', {
                            type: 'string',
                            value: '',
                            valueInfo: {},
                          })
                        }
                        hasFeedback
                        maxLength={12}
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Account Number is required',
                          }),
                        ]}
                        buttonLabel={this.state.CIFbuttonLabel}
                        isButtonLoading={this.state.CIFloading}
                        onButtonClick={() => {
                          this.handleCIFCheck('c2')
                        }}
                      />
                    </div>
                    <Field
                      hidden={true}
                      name="c2cifButton"
                      component={TextBox}
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: 'c2cifButton is required' }),
                      ]}
                    />
                    {this.state.c2showErrMsg && (
                      <p color="red">{this.state.c2errMsg}</p>
                    )}
                    {this.state.c2ShowhiddenFields && (
                      <React.Fragment>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Name'}
                            name="c2CIFcustomerName"
                            component={TextBox}
                            placeholder="Enter Borrower Name"
                            type="text"
                            hasFeedback
                            disabled={true}
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: 'Borrower Name is required',
                              }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Primary Proof No'}
                            name="c2CIFcustomerproof"
                            component={TextBox}
                            placeholder="Enter  Aadhaar Number"
                            type="text"
                            disabled={true}
                            maxLength={12}
                            hasFeedback
                            className="form-control-custom"
                            // validate={[
                            //   A8V.required({ errorMsg: "Aadhaar Number is required" }),
                            // ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="Customer Date Of Birth"
                            name="c2CIFDateOfBirth"
                            component={TextBox}
                            disabled={true}
                            className="form-control-custom"
                            placeholder="Enter Date of Birth"
                            validate={[
                              A8V.required({
                                errorMsg: 'DateOfBirth is required',
                              }),
                            ]}
                          />
                        </div>
                        {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Customer SB Acc/No."}
                        name="c2AccountNo"
                        component={Select}
                        placeholder="Choose Account Number"
                        hasFeedback
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Account Number is required" }),
                        ]}
                      >
                        {this.state.c2SAV_Options.map(data => (
                          <Option key={data} value={data}>{data}</Option>
                        ))}
                      </Field>
                    </div> */}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            )}
          {this.props.formValues.coBorrowerSelect &&
            (this.props.formValues.coBorrowerSelect.value === '3' ||
              this.props.formValues.coBorrowerSelect.value === '4') && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="Co-Applicant_3 Disbursal Information"
                  sectionKey="c3DisbursalInfo"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label={'Customer ID'}
                        name="c3CustomerID"
                        component={TextButtonGroup}
                        placeholder="Enter AccountNumber"
                        type="text"
                        showDefaultSTD={false}
                        onChange={() =>
                          this.props.fieldPopulator('c3cifButton', {
                            type: 'string',
                            value: '',
                            valueInfo: {},
                          })
                        }
                        hasFeedback
                        maxLength={12}
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Account Number is required',
                          }),
                        ]}
                        buttonLabel={this.state.CIFbuttonLabel}
                        isButtonLoading={this.state.CIFloading}
                        onButtonClick={() => {
                          this.handleCIFCheck('c3')
                        }}
                      />
                    </div>
                    <Field
                      hidden={true}
                      name="c3cifButton"
                      component={TextBox}
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: 'c3cifButton is required' }),
                      ]}
                    />
                    {this.state.c3showErrMsg && (
                      <p color="red">{this.state.c3errMsg}</p>
                    )}
                    {this.state.c3ShowhiddenFields && (
                      <React.Fragment>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Name'}
                            name="c3CIFcustomerName"
                            component={TextBox}
                            placeholder="Enter Borrower Name"
                            type="text"
                            hasFeedback
                            disabled={true}
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: 'Borrower Name is required',
                              }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Primary Proof No'}
                            name="c3CIFcustomerproof"
                            component={TextBox}
                            placeholder="Enter  Aadhaar Number"
                            type="text"
                            maxLength={12}
                            disabled={true}
                            hasFeedback
                            className="form-control-custom"
                            // validate={[
                            //   A8V.required({ errorMsg: "Aadhaar Number is required" }),
                            // ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="Customer Date Of Birth"
                            name="c3CIFDateOfBirth"
                            component={TextBox}
                            disabled={true}
                            className="form-control-custom"
                            placeholder="Enter Date of Birth"
                            validate={[
                              A8V.required({
                                errorMsg: 'DateOfBirth is required',
                              }),
                            ]}
                          />
                        </div>
                        {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Customer SB Acc/No."}
                        name="c3AccountNo"
                        component={Select}
                        placeholder="Choose Account Number"
                        hasFeedback
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Account Number is required" }),
                        ]}
                      >
                        {this.state.c3SAV_Options.map(data => (
                          <Option key={data} value={data}>{data}</Option>
                        ))}
                      </Field>
                    </div> */}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            )}

          {this.props.formValues.coBorrowerSelect &&
            this.props.formValues.coBorrowerSelect.value === '4' && (
              <div className="form-section">
                <FormHeadSection
                  sectionLabel="Co-Applicant_4 Disbursal Information"
                  sectionKey="c4DisbursalInfo"
                  formSyncError={this.props.formSyncError}
                  sectionValidator={this.state.sectionValidator}
                />
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group col-xs-6 col-md-6">
                      <Field
                        label={'Customer ID'}
                        name="c4CustomerID"
                        component={TextButtonGroup}
                        placeholder="Enter AccountNumber"
                        type="text"
                        showDefaultSTD={false}
                        onChange={() =>
                          this.props.fieldPopulator('c4cifButton', {
                            type: 'string',
                            value: '',
                            valueInfo: {},
                          })
                        }
                        hasFeedback
                        maxLength={12}
                        className="form-control-custom"
                        validate={[
                          A8V.required({
                            errorMsg: 'Account Number is required',
                          }),
                        ]}
                        buttonLabel={this.state.CIFbuttonLabel}
                        isButtonLoading={this.state.CIFloading}
                        onButtonClick={() => {
                          this.handleCIFCheck('c4')
                        }}
                      />
                    </div>
                    <Field
                      hidden={true}
                      name="c4cifButton"
                      component={TextBox}
                      className="form-control-custom"
                      validate={[
                        A8V.required({ errorMsg: 'c4cifButton is required' }),
                      ]}
                    />
                    {this.state.c4showErrMsg && (
                      <p color="red">{this.state.c4errMsg}</p>
                    )}
                    {this.state.c4ShowhiddenFields && (
                      <React.Fragment>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Name'}
                            name="c4CIFcustomerName"
                            component={TextBox}
                            placeholder="Enter Borrower Name"
                            type="text"
                            hasFeedback
                            disabled={true}
                            className="form-control-coustom"
                            validate={[
                              A8V.required({
                                errorMsg: 'Borrower Name is required',
                              }),
                            ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label={'Customer Primary Proof No'}
                            name="c4CIFcustomerproof"
                            component={TextBox}
                            placeholder="Enter  Aadhaar Number"
                            type="text"
                            maxLength={12}
                            disabled={true}
                            hasFeedback
                            className="form-control-custom"
                            // validate={[
                            //   A8V.required({ errorMsg: "Aadhaar Number is required" }),
                            // ]}
                          />
                        </div>
                        <div className="form-group col-xs-6 col-md-4">
                          <Field
                            label="Customer Date Of Birth"
                            name="c4CIFDateOfBirth"
                            component={TextBox}
                            className="form-control-custom"
                            disabled={true}
                            placeholder="Enter Date of Birth"
                            validate={[
                              A8V.required({
                                errorMsg: 'DateOfBirth is required',
                              }),
                            ]}
                          />
                        </div>
                        {/* <div className="form-group col-xs-6 col-md-4">
                      <Field
                        label={"Customer SB Acc/No."}
                        name="c4AccountNo"
                        component={Select}
                        placeholder="Choose Account Number"
                        hasFeedback
                        className="a8Select"
                        validate={[
                          A8V.required({ errorMsg: "Account Number is required" }),
                        ]}
                      >
                        {this.state.c4SAV_Options.map(data => (
                          <Option key={data} value={data}>{data}</Option>
                        ))}
                      </Field>
                    </div> */}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log('FROM MAP STATE TO PROPS CIFGeneration', state)
  return {
    //get current form values
    formValues: getFormValues(props.moduleName || 'cifGeneration')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors(props.moduleName || 'cifGeneration')(
      state,
    ),
    isFormValid: isValid(props.moduleName || 'cifGeneration')(state),
    //taskInfo
    // task: state.task
  }
}

export default connect(mapStateToProps, {})(TabCifGeneration)
