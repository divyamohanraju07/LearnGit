import * as React from 'react'
import {
  FormHeadSection,
  inrFormat,
  uploadChecker,
  A8V,
  AccountDetailsView,
  // retrieveDefaultFiles,
  Config,
} from '../../helpers'
import { TextBox, Uploader } from 'a8flow-uikit'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import validate from 'validate.js'
import { Button, Table } from 'antd'
import classname from 'classnames'
import axios from 'axios'
import moment from 'moment'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import Column from 'antd/lib/table/Column'
import { default as ApiClient } from 'a8forms-api-client'

type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
}
type State = {
  sectionValidator: any
  UploaderEsafSample: any
  appAddrcardView: any
  coappAddrcardView: any
  guaAddrcardView: any
  returnData: any
  PremiumRates: any
}
class TabFieldInspection extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        FIDetails: ['ApplicationID', 'BorrowerName', 'LoanAmount'],
        Uploader: ['UploaderEsafSample'],
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
        ],
        /**
         * defaultValuesFieldNames props responsible for appending default values to uploader
         */
        defaultValuesFieldNames: [
          'Residence Verification Report',
          'Business Verification Report',
          'Employment Verification Report',
        ],
        // uploadLimit handle how many fields the user need to upload
        uploadLimit: 3,
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
      appAddrcardView: [],
      coappAddrcardView: [],
      guaAddrcardView: [],
      returnData: [],
      PremiumRates: '',
    }
  }
  async componentDidMount() {
    //NOTE ::: Commend below code for local development
    //set initialUploader true
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafSample,
    //     initialUploadLoader: true
    //   }
    // }));
    //use this helper to retrieve default files
    // await retrieveDefaultFiles({
    //   taskInfo: this.props.taskInfo,
    //   fileInfo: this.state.UploaderEsafSample,
    //   fieldPopulator: this.props.fieldPopulator
    // });
    //set initialUploadLoader false
    this.setState((prevState) => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: false,
      },
    }))

    this.handleDOB()
    this.handleInsuranceChange()
    this.handleReturn()

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
    this.props.fieldPopulator('FI_claim', {
      type: 'string',
      value: userDetails.data.id,
      valueInfo: {},
    })
    this.props.fieldPopulator('FIclaim_firstName', {
      type: 'string',
      value: userDetails.data.firstName,
      valueInfo: {},
    })
    this.props.fieldPopulator('FIclaim_lastName', {
      type: 'string',
      value: userDetails.data.lastName,
      valueInfo: {},
    })
  }

  handleDOB = () => {
    if (
      this.props.formValues.DateOfBirth &&
      this.props.formValues.DateOfBirth.value !== ''
    ) {
      let DateOfBirth = this.props.formValues.DateOfBirth.value
      let Date = DateOfBirth.slice(0, 10)
      let dateofbirth = moment(Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('dateofbirth', {
        type: 'string',
        value: dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.c1DateOfBirth &&
      this.props.formValues.c1DateOfBirth.value !== ''
    ) {
      let c1DateOfBirth = this.props.formValues.c1DateOfBirth.value
      let c1Date = c1DateOfBirth.slice(0, 10)
      let c1dateofbirth = moment(c1Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('c1dateofbirth', {
        type: 'string',
        value: c1dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.c2DateOfBirth &&
      this.props.formValues.c2DateOfBirth.value !== ''
    ) {
      let c2DateOfBirth = this.props.formValues.c2DateOfBirth.value
      let c2Date = c2DateOfBirth.slice(0, 10)
      let c2dateofbirth = moment(c2Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('c2dateofbirth', {
        type: 'string',
        value: c2dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.c3DateOfBirth &&
      this.props.formValues.c3DateOfBirth.value !== ''
    ) {
      let c3DateOfBirth = this.props.formValues.c3DateOfBirth.value
      let c3Date = c3DateOfBirth.slice(0, 10)
      let c3dateofbirth = moment(c3Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('c3dateofbirth', {
        type: 'string',
        value: c3dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.c4DateOfBirth &&
      this.props.formValues.c4DateOfBirth.value !== ''
    ) {
      let c4DateOfBirth = this.props.formValues.c4DateOfBirth.value
      let c4Date = c4DateOfBirth.slice(0, 10)
      let c4dateofbirth = moment(c4Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('c4dateofbirth', {
        type: 'string',
        value: c4dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.g1DateOfBirth &&
      this.props.formValues.g1DateOfBirth.value !== ''
    ) {
      let g1DateOfBirth = this.props.formValues.g1DateOfBirth.value
      let g1Date = g1DateOfBirth.slice(0, 10)
      let g1dateofbirth = moment(g1Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('g1dateofbirth', {
        type: 'string',
        value: g1dateofbirth,
        valueInfo: {},
      })
    }
    if (
      this.props.formValues.g2DateOfBirth &&
      this.props.formValues.g2DateOfBirth.value !== ''
    ) {
      let g2DateOfBirth = this.props.formValues.g2DateOfBirth.value
      let g2Date = g2DateOfBirth.slice(0, 10)
      let g2dateofbirth = moment(g2Date).format('DD/MM/YYYY')
      this.props.fieldPopulator('g2dateofbirth', {
        type: 'string',
        value: g2dateofbirth,
        valueInfo: {},
      })
    }
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
          name: 'L1 credit Officer',
          value: processVariables.L1OfficerComments.value,
        })
      }
    }
    this.setState({ returnData: data })
  }

  handleInsuranceChange = () => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    let insuredLife = this.props.formValues.CreditShieldValue
      ? this.props.formValues.CreditShieldValue.value
      : ''
    let value
    if (insuredLife === 'Applicant') {
      value = this.props.formValues.Age ? this.props.formValues.Age.value : 0
    } else if (insuredLife === 'Co-Applicant') {
      value = this.props.formValues.c1Age
        ? this.props.formValues.c1Age.value
        : 0
    }

    let insuranceChargeConfig = {
      url: `${Config.apiUrl}/v1/dmn`,
      method: 'Post',
      headers: {
        Authorization: authToken,
      },
      data: {
        variables: {
          Age: {
            value: value,
            type: 'Integer',
          },
          tenureInput: {
            value: this.props.formValues.tenureInput.value,
            type: 'Integer',
          },
        },
      },
    }
    // summary
    axios(insuranceChargeConfig).then((response) => {
      let InsuranceResponse = response.data[0]
      let charge = InsuranceResponse.charge.value
      this.setState({ PremiumRates: charge })
      let loanAmount = this.props.formValues.LoanAmount.value
      let premium = Math.round((charge * loanAmount) / 100000)
      this.props.fieldPopulator('InsurancePremium', {
        type: 'String',
        value: `${premium} /- (Plus applicable taxes).`,
      })
    })
  }
  mapApplicantAddress = () => {
    try {
      let processVariables = this.props.formValues
      let information = {}
      if (
        this.props.formValues &&
        this.props.formValues.Addr_selectedValue &&
        JSON.parse(this.props.formValues.Addr_selectedValue.value).includes(
          'PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.PresentAddressAadhaarSame &&
          this.props.formValues.PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Applicant Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.PresentAddressAadhaarSame &&
          this.props.formValues.PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Applicant Permanent Address'] = {
            permanentHouseName: '',
            permanentStreetArea: '',
            permanentCity: '',
            permanentPostOffice: '',
            permanentDistrict: '',
            permanentState: '',
            permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.Addr_selectedValue &&
        JSON.parse(this.props.formValues.Addr_selectedValue.value).includes(
          'ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.permanentCorrespondenceAddressSame &&
          this.props.formValues.permanentCorrespondenceAddressSame.value ===
            'Yes'
        ) {
          information['Applicant Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.permanentCorrespondenceAddressSame &&
          this.props.formValues.permanentCorrespondenceAddressSame.value ===
            'No'
        ) {
          information['Applicant Residential Address'] = {
            CorrespondenceHouseName: '',
            CorrespondenceStreetArea: '',
            CorrespondenceCity: '',
            CorrespondencePincode: '',
            CorrespondenceDistrict: '',
            CorrespondenceState: '',
            CorrespondencePostOffice: '',
          }
        }
      }
      if (
        this.props.formValues &&
        this.props.formValues.Addr_selectedValue &&
        JSON.parse(this.props.formValues.Addr_selectedValue.value).includes(
          'WorkAddress',
        )
      ) {
        information['Applicant Work Address'] = {
          salariedOfficeName: '',
          SalariedOfficeNo: '',
          SalariedStreetArea: '',
          SalariedCity: '',
          SalariedPostOffice: '',
          SalariedDistrict: '',
          SalariedState: '',
          SalariedPincode: '',
          businessOfficeName: '',
          businessOfficeNo: '',
          businessStreetArea: '',
          businessCity: '',
          businessPostOffice: '',
          businessDistrict: '',
          businessState: '',
          businessPincode: '',
          othrOfficeName: '',
          othrOfficeNo: '',
          othrStreetArea: '',
          othrCity: '',
          othrPostOffice: '',
          othrDistrict: '',
          othrState: '',
          othrPincode: '',
        }
      }

      var cardView = []
      const parentKeys = Object.keys(information)
      for (let parentKey in information) {
        let collectedData = { accountName: '', fields: [] }
        collectedData.accountName = parentKey
        collectedData.fields = []
        collectedData['parentKeys'] = parentKeys
        collectedData['totalInformations'] = information
        //append actual data to totalInformation
        for (let childKey in information[parentKey]) {
          information[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(information[parentKey][childKey])) {
            collectedData.fields.push({
              fieldKey: childKey,
              fieldValue: information[parentKey][childKey],
            })
          }
        }
        cardView.push(collectedData)
      }
      this.setState({ appAddrcardView: cardView })
    } catch (error) {
      throw error
    }
  }
  mapCoApplicantAddress = () => {
    try {
      let processVariables = this.props.formValues
      let information = {}
      if (
        this.props.formValues.c1Addr_selectedValue &&
        JSON.parse(this.props.formValues.c1Addr_selectedValue.value).includes(
          'c1PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.c1PresentAddressSameAsApplicant &&
          this.props.formValues.c1PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c1PresentAddressAadhaarSame &&
          this.props.formValues.c1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_1 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c1PresentAddressSameAsApplicant &&
          this.props.formValues.c1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c1PresentAddressAadhaarSame &&
          this.props.formValues.c1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_1 Permanent Address'] = {
            c1HouseName: '',
            c1StreetArea: '',
            c1City: '',
            c1PostOffice: '',
            c1District: '',
            c1state: '',
            c1Pincode: '',
          }
        } else if (
          (this.props.formValues.c1PresentAddressSameAsApplicant &&
            this.props.formValues.c1PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c1PresentAddressAadhaarSame &&
            this.props.formValues.c1PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c1PresentAddressSameAsApplicant &&
            this.props.formValues.c1PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c1PresentAddressAadhaarSame &&
            this.props.formValues.c1PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_1 Permanent Address'] = {
            c1permanentHouseName: '',
            c1permanentStreetArea: '',
            c1permanentCity: '',
            c1permanentPostOffice: '',
            c1permanentDistrict: '',
            c1permanentState: '',
            c1permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c2Addr_selectedValue &&
        JSON.parse(this.props.formValues.c2Addr_selectedValue.value).includes(
          'c2PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.c2PresentAddressSameAsApplicant &&
          this.props.formValues.c2PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c2PresentAddressAadhaarSame &&
          this.props.formValues.c2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_2 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c2PresentAddressSameAsApplicant &&
          this.props.formValues.c2PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c1PresentAddressAadhaarSame &&
          this.props.formValues.c2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_2 Permanent Address'] = {
            c1HouseName: '',
            c1StreetArea: '',
            c1City: '',
            c1PostOffice: '',
            c1District: '',
            c1state: '',
            c1Pincode: '',
          }
        } else if (
          (this.props.formValues.c2PresentAddressSameAsApplicant &&
            this.props.formValues.c2PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c2PresentAddressAadhaarSame &&
            this.props.formValues.c2PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c2PresentAddressSameAsApplicant &&
            this.props.formValues.c2PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c2PresentAddressAadhaarSame &&
            this.props.formValues.c2PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_2 Permanent Address'] = {
            c2permanentHouseName: '',
            c2permanentStreetArea: '',
            c2permanentCity: '',
            c2permanentPostOffice: '',
            c2permanentDistrict: '',
            c2permanentState: '',
            c2permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c3Addr_selectedValue &&
        JSON.parse(this.props.formValues.c3Addr_selectedValue.value).includes(
          'c3PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c3PresentAddressAadhaarSame &&
          this.props.formValues.c3PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_3 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c3PresentAddressAadhaarSame &&
          this.props.formValues.c3PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_3 Permanent Address'] = {
            c3HouseName: '',
            c3StreetArea: '',
            c3City: '',
            c3PostOffice: '',
            c3District: '',
            c3state: '',
            c3Pincode: '',
          }
        } else if (
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c3PresentAddressAadhaarSame &&
            this.props.formValues.c3PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c3PresentAddressAadhaarSame &&
            this.props.formValues.c3PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_3 Permanent Address'] = {
            c3permanentHouseName: '',
            c3permanentStreetArea: '',
            c3permanentCity: '',
            c3permanentPostOffice: '',
            c3permanentDistrict: '',
            c3permanentState: '',
            c3permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c4Addr_selectedValue &&
        JSON.parse(this.props.formValues.c4Addr_selectedValue.value).includes(
          'c4PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c4PresentAddressAadhaarSame &&
          this.props.formValues.c4PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_4 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c4PresentAddressAadhaarSame &&
          this.props.formValues.c4PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_4 Permanent Address'] = {
            c4HouseName: '',
            c4StreetArea: '',
            c4City: '',
            c4PostOffice: '',
            c4District: '',
            c4state: '',
            c4Pincode: '',
          }
        } else if (
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c4PresentAddressAadhaarSame &&
            this.props.formValues.c4PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c4PresentAddressAadhaarSame &&
            this.props.formValues.c4PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_4 Permanent Address'] = {
            c4permanentHouseName: '',
            c4permanentStreetArea: '',
            c4permanentCity: '',
            c4permanentPostOffice: '',
            c4permanentDistrict: '',
            c4permanentState: '',
            c4permanentPincode: '',
          }
        }
      }

      if (
        this.props.formValues.c1Addr_selectedValue &&
        JSON.parse(this.props.formValues.c1Addr_selectedValue.value).includes(
          'c1ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.c1PresentAddressSameAsApplicant &&
          this.props.formValues.c1PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c1PresentAddressAadhaarSame &&
          this.props.formValues.c1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_1 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c1PresentAddressSameAsApplicant &&
          this.props.formValues.c1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c1PresentAddressAadhaarSame &&
          this.props.formValues.c1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_1 Residential Address'] = {
            c1HouseName: '',
            c1StreetArea: '',
            c1City: '',
            c1PostOffice: '',
            c1District: '',
            c1state: '',
            c1Pincode: '',
          }
        } else if (
          (this.props.formValues.c1PresentAddressSameAsApplicant &&
            this.props.formValues.c1PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c1PresentAddressAadhaarSame &&
            this.props.formValues.c1PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c1PresentAddressSameAsApplicant &&
            this.props.formValues.c1PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c1PresentAddressAadhaarSame &&
            this.props.formValues.c1PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_1 Residential Address'] = {
            c1permanentHouseName: '',
            c1permanentStreetArea: '',
            c1permanentCity: '',
            c1permanentPostOffice: '',
            c1permanentDistrict: '',
            c1permanentState: '',
            c1permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c2Addr_selectedValue &&
        JSON.parse(this.props.formValues.c2Addr_selectedValue.value).includes(
          'c2ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.c2PresentAddressSameAsApplicant &&
          this.props.formValues.c2PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c2PresentAddressAadhaarSame &&
          this.props.formValues.c2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_2 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c2PresentAddressSameAsApplicant &&
          this.props.formValues.c2PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c2PresentAddressAadhaarSame &&
          this.props.formValues.c2PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Co-Applicant_2 Residential Address'] = {
            c2HouseName: '',
            c2StreetArea: '',
            c2City: '',
            c2PostOffice: '',
            c2District: '',
            c2state: '',
            c2Pincode: '',
          }
        } else if (
          (this.props.formValues.c2PresentAddressSameAsApplicant &&
            this.props.formValues.c2PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c2PresentAddressAadhaarSame &&
            this.props.formValues.c2PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c2PresentAddressSameAsApplicant &&
            this.props.formValues.c2PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c2PresentAddressAadhaarSame &&
            this.props.formValues.c2PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_2 Residential Address'] = {
            c2permanentHouseName: '',
            c2permanentStreetArea: '',
            c2permanentCity: '',
            c2permanentPostOffice: '',
            c2permanentDistrict: '',
            c2permanentstate: '',
            c2permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c3Addr_selectedValue &&
        JSON.parse(this.props.formValues.c3Addr_selectedValue.value).includes(
          'c3ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c3PresentAddressAadhaarSame &&
          this.props.formValues.c3PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_3 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c3PresentAddressSameAsApplicant &&
          this.props.formValues.c3PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c3PresentAddressAadhaarSame &&
          this.props.formValues.c3PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_3 Residential Address'] = {
            c3HouseName: '',
            c3StreetArea: '',
            c3City: '',
            c3PostOffice: '',
            c3District: '',
            c3state: '',
            c3Pincode: '',
          }
        } else if (
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c3PresentAddressAadhaarSame &&
            this.props.formValues.c3PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c3PresentAddressSameAsApplicant &&
            this.props.formValues.c3PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c3PresentAddressAadhaarSame &&
            this.props.formValues.c3PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_3 Residential Address'] = {
            c3permanentHouseName: '',
            c3permanentStreetArea: '',
            c3permanentCity: '',
            c3permanentPostOffice: '',
            c3permanentDistrict: '',
            c3permanentstate: '',
            c3permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c4Addr_selectedValue &&
        JSON.parse(this.props.formValues.c4Addr_selectedValue.value).includes(
          'c4ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.c4PresentAddressSameAsApplicant &&
          this.props.formValues.c4PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.c4PresentAddressAadhaarSame &&
          this.props.formValues.c4PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_4 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.c4PresentAddressSameAsApplicant &&
          this.props.formValues.c4PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.c4PresentAddressAadhaarSame &&
          this.props.formValues.c4PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Co-Applicant_4 Residential Address'] = {
            c4HouseName: '',
            c4StreetArea: '',
            c4City: '',
            c4PostOffice: '',
            c4District: '',
            c4state: '',
            c4Pincode: '',
          }
        } else if (
          (this.props.formValues.c4PresentAddressSameAsApplicant &&
            this.props.formValues.c4PresentAddressSameAsApplicant.value ===
              'No' &&
            this.props.formValues.c4PresentAddressAadhaarSame &&
            this.props.formValues.c4PresentAddressAadhaarSame.value === 'No') ||
          (this.props.formValues.c4PresentAddressSameAsApplicant &&
            this.props.formValues.c4PresentAddressSameAsApplicant.value ===
              'Yes' &&
            this.props.formValues.c4PresentAddressAadhaarSame &&
            this.props.formValues.c4PresentAddressAadhaarSame.value === 'No')
        ) {
          information['Co-Applicant_4 Residential Address'] = {
            c4permanentHouseName: '',
            c4permanentStreetArea: '',
            c4permanentCity: '',
            c4permanentPostOffice: '',
            c4permanentDistrict: '',
            c4permanentstate: '',
            c4permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.c1Addr_selectedValue &&
        JSON.parse(this.props.formValues.c1Addr_selectedValue.value).includes(
          'c1WorkAddress',
        )
      ) {
        information['Co-Applicant_1 Work Address'] = {
          c1salariedOfficeName: '',
          c1SalariedOfficeNo: '',
          c1SalariedStreetArea: '',
          c1SalariedCity: '',
          c1SalariedPostOffice: '',
          c1SalariedDistrict: '',
          c1SalariedState: '',
          c1SalariedPincode: '',
          c1businessOfficeName: '',
          c1businessOfficeNo: '',
          c1businessStreetArea: '',
          c1businessCity: '',
          c1businessPostOffice: '',
          c1businessDistrict: '',
          c1businessState: '',
          c1businessPincode: '',
          c1othrOfficeName: '',
          c1othrOfficeNo: '',
          c1othrStreetArea: '',
          c1othrCity: '',
          c1othrPostOffice: '',
          c1othrDistrict: '',
          c1othrState: '',
          c1othrPincode: '',
        }
      }
      if (
        this.props.formValues.c2Addr_selectedValue &&
        JSON.parse(this.props.formValues.c2Addr_selectedValue.value).includes(
          'c2WorkAddress',
        )
      ) {
        information['Co-Applicant_2 Work Address'] = {
          c2salariedOfficeName: '',
          c2SalariedOfficeNo: '',
          c2SalariedStreetArea: '',
          c2SalariedCity: '',
          c2SalariedPostOffice: '',
          c2SalariedDistrict: '',
          c2SalariedState: '',
          c2SalariedPincode: '',
          c2businessOfficeName: '',
          c2businessOfficeNo: '',
          c2businessStreetArea: '',
          c2businessCity: '',
          c2businessPostOffice: '',
          c2businessDistrict: '',
          c2businessState: '',
          c2businessPincode: '',
          c2othrOfficeName: '',
          c2othrOfficeNo: '',
          c2othrStreetArea: '',
          c2othrCity: '',
          c2othrPostOffice: '',
          c2othrDistrict: '',
          c2othrState: '',
          c2othrPincode: '',
        }
      }
      if (
        this.props.formValues.c3Addr_selectedValue &&
        JSON.parse(this.props.formValues.c3Addr_selectedValue.value).includes(
          'c3WorkAddress',
        )
      ) {
        information['Co-Applicant_3 Work Address'] = {
          c3salariedOfficeName: '',
          c3SalariedOfficeNo: '',
          c3SalariedStreetArea: '',
          c3SalariedCity: '',
          c3SalariedPostOffice: '',
          c3SalariedDistrict: '',
          c3SalariedState: '',
          c3SalariedPincode: '',
          c3businessOfficeName: '',
          c3businessOfficeNo: '',
          c3businessStreetArea: '',
          c3businessCity: '',
          c3businessPostOffice: '',
          c3businessDistrict: '',
          c3businessState: '',
          c3businessPincode: '',
          c3othrOfficeName: '',
          c3othrOfficeNo: '',
          c3othrStreetArea: '',
          c3othrCity: '',
          c3othrPostOffice: '',
          c3othrDistrict: '',
          c3othrState: '',
          c3othrPincode: '',
        }
      }
      if (
        this.props.formValues.c4Addr_selectedValue &&
        JSON.parse(this.props.formValues.c4Addr_selectedValue.value).includes(
          'c4WorkAddress',
        )
      ) {
        information['Co-Applicant_4 Work Address'] = {
          c4salariedOfficeName: '',
          c4SalariedOfficeNo: '',
          c4SalariedStreetArea: '',
          c4SalariedCity: '',
          c4SalariedPostOffice: '',
          c4SalariedDistrict: '',
          c4SalariedState: '',
          c4SalariedPincode: '',
          c4businessOfficeName: '',
          c4businessOfficeNo: '',
          c4businessStreetArea: '',
          c4businessCity: '',
          c4businessPostOffice: '',
          c4businessDistrict: '',
          c4businessState: '',
          c4businessPincode: '',
          c4othrOfficeName: '',
          c4othrOfficeNo: '',
          c4othrStreetArea: '',
          c4othrCity: '',
          c4othrPostOffice: '',
          c4othrDistrict: '',
          c4othrState: '',
          c4othrPincode: '',
        }
      }

      var cardView = []
      const parentKeys = Object.keys(information)
      for (let parentKey in information) {
        let collectedData = { accountName: '', fields: [] }
        collectedData.accountName = parentKey
        collectedData.fields = []
        collectedData['parentKeys'] = parentKeys
        collectedData['informations'] = information
        //append actual data to totalInformation
        for (let childKey in information[parentKey]) {
          information[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(information[parentKey][childKey])) {
            collectedData.fields.push({
              fieldKey: childKey,
              fieldValue: information[parentKey][childKey],
            })
          }
        }
        cardView.push(collectedData)
      }
      this.setState({ coappAddrcardView: cardView })
    } catch (error) {
      throw error
    }
  }
  mapGuarantorAddress = () => {
    try {
      let processVariables = this.props.formValues
      let information = {}
      if (
        this.props.formValues.g1Addr_selectedValue &&
        JSON.parse(this.props.formValues.g1Addr_selectedValue.value).includes(
          'g1PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_1 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_1 Permanent Address'] = {
            g1HouseName: '',
            g1StreetArea: '',
            g1City: '',
            g1PostOffice: '',
            g1District: '',
            g1State: '',
            g1Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Guarantor_1 Permanent Address'] = {
            g1permanentHouseName: '',
            g1permanentStreetArea: '',
            g1permanentCity: '',
            g1permanentPostOffice: '',
            g1permanentDistrict: '',
            g1permanentState: '',
            g1permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.g2Addr_selectedValue &&
        JSON.parse(this.props.formValues.g2Addr_selectedValue.value).includes(
          'g2PermanentAddress',
        )
      ) {
        if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_2 Permanent Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_2 Permanent Address'] = {
            g2HouseName: '',
            g2StreetArea: '',
            g2City: '',
            g2PostOffice: '',
            g2District: '',
            g2State: '',
            g2Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Guarantor_2 Permanent Address'] = {
            g2permanentHouseName: '',
            g2permanentStreetArea: '',
            g2permanentCity: '',
            g2permanentPostOffice: '',
            g2permanentDistrict: '',
            g2permanentState: '',
            g2permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.g1Addr_selectedValue &&
        JSON.parse(this.props.formValues.g1Addr_selectedValue.value).includes(
          'g1ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_1 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_1 Residential Address'] = {
            g1HouseName: '',
            g1StreetArea: '',
            g1City: '',
            g1PostOffice: '',
            g1District: '',
            g1state: '',
            g1Pincode: '',
          }
        } else if (
          this.props.formValues.g1PresentAddressSameAsApplicant &&
          this.props.formValues.g1PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g1PresentAddressAadhaarSame &&
          this.props.formValues.g1PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Guarantor_1 Permanent Address'] = {
            g2permanentHouseName: '',
            g2permanentStreetArea: '',
            g2permanentCity: '',
            g2permanentPostOffice: '',
            g2permanentDistrict: '',
            g2permanentState: '',
            g2permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.g2Addr_selectedValue &&
        JSON.parse(this.props.formValues.g2Addr_selectedValue.value).includes(
          'g2ResidentialAddress',
        )
      ) {
        if (
          this.props.formValues.g2PresentAddressSameAsApplicant &&
          this.props.formValues.g2PresentAddressSameAsApplicant.value ===
            'Yes' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_2 Residential Address'] = {
            HouseName: '',
            StreetArea: '',
            City: '',
            PostOffice: '',
            District: '',
            state: '',
            Pincode: '',
          }
        } else if (
          this.props.formValues.g2PresentAddressSameAsApplicant &&
          this.props.formValues.g2PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'Yes'
        ) {
          information['Guarantor_2 Residential Address'] = {
            g2HouseName: '',
            g2StreetArea: '',
            g2City: '',
            g2PostOffice: '',
            g2District: '',
            g2state: '',
            g2Pincode: '',
          }
        } else if (
          this.props.formValues.g2PresentAddressSameAsApplicant &&
          this.props.formValues.g2PresentAddressSameAsApplicant.value ===
            'No' &&
          this.props.formValues.g2PresentAddressAadhaarSame &&
          this.props.formValues.g2PresentAddressAadhaarSame.value === 'No'
        ) {
          information['Guarantor_2 Residential Address'] = {
            g2permanentHouseName: '',
            g2permanentStreetArea: '',
            g2permanentCity: '',
            g2permanentPostOffice: '',
            g2permanentDistrict: '',
            g2permanentstate: '',
            g2permanentPincode: '',
          }
        }
      }
      if (
        this.props.formValues.g1Addr_selectedValue &&
        JSON.parse(this.props.formValues.g1Addr_selectedValue.value).includes(
          'g1WorkAddress',
        )
      ) {
        information['Guarantor_1 Work Address'] = {
          g1salariedOfficeName: '',
          g1SalariedOfficeNo: '',
          g1SalariedStreetArea: '',
          g1SalariedCity: '',
          g1SalariedPostOffice: '',
          g1SalariedDistrict: '',
          g1SalariedState: '',
          g1SalariedPincode: '',
          g1businessOfficeName: '',
          g1businessOfficeNo: '',
          g1businessStreetArea: '',
          g1businessCity: '',
          g1businessPostOffice: '',
          g1businessDistrict: '',
          g1businessState: '',
          g1businessPincode: '',
          g1othrOfficeName: '',
          g1othrOfficeNo: '',
          g1othrStreetArea: '',
          g1othrCity: '',
          g1othrPostOffice: '',
          g1othrDistrict: '',
          g1othrState: '',
          g1othrPincode: '',
        }
      }
      if (
        this.props.formValues.g2Addr_selectedValue &&
        JSON.parse(this.props.formValues.g2Addr_selectedValue.value).includes(
          'g2WorkAddress',
        )
      ) {
        information['Guarantor_2 Work Address'] = {
          g2salariedOfficeName: '',
          g2SalariedOfficeNo: '',
          g2SalariedStreetArea: '',
          g2SalariedCity: '',
          g2SalariedPostOffice: '',
          g2SalariedDistrict: '',
          g2SalariedState: '',
          g2SalariedPincode: '',
          g2businessOfficeName: '',
          g2businessOfficeNo: '',
          g2businessStreetArea: '',
          g2businessCity: '',
          g2businessPostOffice: '',
          g2businessDistrict: '',
          g2businessState: '',
          g2businessPincode: '',
          g2othrOfficeName: '',
          g2othrOfficeNo: '',
          g2othrStreetArea: '',
          g2othrCity: '',
          g2othrPostOffice: '',
          g2othrDistrict: '',
          g2othrState: '',
          g2othrPincode: '',
        }
      }

      var cardView = []
      const parentKeys = Object.keys(information)
      for (let parentKey in information) {
        let collectedData = { accountName: '', fields: [] }
        collectedData.accountName = parentKey
        collectedData.fields = []
        collectedData['parentKeys'] = parentKeys
        collectedData['informations'] = information
        //append actual data to totalInformation
        for (let childKey in information[parentKey]) {
          information[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(information[parentKey][childKey])) {
            collectedData.fields.push({
              fieldKey: childKey,
              fieldValue: information[parentKey][childKey],
            })
          }
        }
        cardView.push(collectedData)
      }
      this.setState({ guaAddrcardView: cardView })
    } catch (error) {
      throw error
    }
  }

  renderDynamicFields(): JSX.Element[] {
    let result: JSX.Element[] = []
    let guarantorSelect = this.props.formValues.guarantorSelect
      ? this.props.formValues.guarantorSelect.value
      : null
    let coBorrowerSelect = this.props.formValues.coBorrowerSelect
      ? this.props.formValues.coBorrowerSelect.value
      : null

    if (!validate.isEmpty(coBorrowerSelect)) {
      for (let i = 0; i < coBorrowerSelect; i++) {
        result.push(
          <div className="form-group col-xs-12 col-md-12">
            <label>
              <strong>CO-APPLICANT {i + 1}</strong>
            </label>
            <div className="flex-row">
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'First Name'}
                  name={`c${i + 1}FirstName`}
                  component={TextBox}
                  placeholder="Enter First Name"
                  type="text"
                  hasFeedback
                  disabled={true}
                  className="form-control-custom"
                  validate={[
                    A8V.maxLength({
                      errorMsg: 'FirstName must be 20 or less',
                      max: 20,
                    }),
                    A8V.minLength({ errorMsg: '', min: 1 }),
                    A8V.required({ errorMsg: 'FirstName is required' }),
                  ]}
                />
              </div>
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'Middle Name'}
                  name={`c${i + 1}MiddleName`}
                  component={TextBox}
                  placeholder="Enter Middle Name"
                  type="text"
                  disabled={true}
                  hasFeedback
                  className="form-control-custom"
                />
              </div>
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'Last Name'}
                  name={`c${i + 1}LastName`}
                  component={TextBox}
                  placeholder="Enter Last Name"
                  type="text"
                  disabled={true}
                  hasFeedback
                  className="form-control-custom"
                  validate={[
                    A8V.required({ errorMsg: 'LastName is required' }),
                  ]}
                />
              </div>
            </div>
          </div>,
        )
      }
    }
    if (!validate.isEmpty(guarantorSelect)) {
      for (let i = 0; i < guarantorSelect; i++) {
        result.push(
          <div className="form-group col-xs-12 col-md-12">
            <label>
              <strong>GUARANTOR {i + 1}</strong>
            </label>
            <div className="flex-row">
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'First Name'}
                  name={`g${i + 1}FirstName`}
                  component={TextBox}
                  placeholder="Enter First Name"
                  type="text"
                  disabled={true}
                  hasFeedback
                  className="form-control-custom"
                  validate={[
                    A8V.maxLength({
                      errorMsg: 'FirstName must be 20 or less',
                      max: 20,
                    }),
                    A8V.minLength({ errorMsg: '', min: 1 }),
                    A8V.required({ errorMsg: 'FirstName is required' }),
                  ]}
                />
              </div>
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'Middle Name'}
                  name={`g${i + 1}MiddleName`}
                  component={TextBox}
                  placeholder="Enter Middle Name"
                  type="text"
                  disabled={true}
                  hasFeedback
                  className="form-control-custom"
                />
              </div>
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={'Last Name'}
                  name={`g${i + 1}LastName`}
                  component={TextBox}
                  placeholder="Enter Last Name"
                  type="text"
                  hasFeedback
                  disabled={true}
                  className="form-control-custom"
                  validate={[
                    A8V.required({ errorMsg: 'LastName is required' }),
                  ]}
                />
              </div>
            </div>
          </div>,
        )
      }
    }
    return result
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
          {((this.props.formValues.BOStatus &&
            this.props.formValues.BOStatus.value === 'Returned') ||
            (this.props.formValues.l1Status &&
              this.props.formValues.l1Status.value === 'Returned')) && (
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
                {this.state.returnData && (
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
                  </Table>
                )}
              </div>
            </div>
          )}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Field Inspection Basic Details"
              sectionKey="FIDetails"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content" style={{ display: 'block' }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Application ID'}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Application ID"
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'ApplicantID is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Borrower Name'}
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
                    label={'Loan Product'}
                    name="LoanPurpose"
                    component={TextBox}
                    placeholder="Enter Loan Purpose"
                    type="text"
                    disabled={true}
                    normalize={inrFormat}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Loan Purpose is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Loan Amount'}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Loan Amount is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Loan Tenure'}
                    name="ExpectedTenure"
                    component={TextBox}
                    placeholder="Enter Loan Tenure"
                    type="text"
                    normalize={inrFormat}
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Loan Tenure is required' }),
                    ]}
                  />
                </div>

                {/* Insert fields based on no. of coborrower and guarantor */}
                {this.renderDynamicFields()}
              </div>
            </div>
          </div>
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Applicant Address Information'}</h3>
            </div>
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapApplicantAddress}
                  >
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.appAddrcardView) && (
                    <AccountDetailsView
                      accountDetails={this.state.appAddrcardView}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {this.props.formValues.coBorrowerSelect &&
            this.props.formValues.coBorrowerSelect.value !== '0' && (
              <div className="form-section">
                <div
                  className={classname('form-section-head clearfix', {
                    on: false,
                  })}
                >
                  <h3>{'Co-Applicant Address Information'}</h3>
                </div>
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group  add-del-button">
                      <Button
                        className="api-button"
                        type="danger"
                        size="default"
                        onClick={this.mapCoApplicantAddress}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="form-group col-xs-12 col-md-12">
                      {!validate.isEmpty(this.state.coappAddrcardView) && (
                        <AccountDetailsView
                          accountDetails={this.state.coappAddrcardView}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {this.props.formValues &&
            this.props.formValues.guarantorSelect &&
            this.props.formValues.guarantorSelect.value !== '0' && (
              <div className="form-section">
                <div
                  className={classname('form-section-head clearfix', {
                    on: false,
                  })}
                >
                  <h3>{'Guarantor Address Information'}</h3>
                </div>
                <div className="form-section-content">
                  <div className="flex-row">
                    <div className="form-group  add-del-button">
                      <Button
                        className="api-button"
                        type="danger"
                        size="default"
                        onClick={this.mapGuarantorAddress}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="form-group col-xs-12 col-md-12">
                      {!validate.isEmpty(this.state.guaAddrcardView) && (
                        <AccountDetailsView
                          accountDetails={this.state.guaAddrcardView}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Reference Information'}</h3>
            </div>
            <div className="form-section-content">
              <div className="form-group col-xs-12 col-md-12">
                <label>
                  <strong>REFERENCE 1</strong>
                </label>
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Reference Name'}
                      name="ReferenceName_1"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      disabled={true}
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Reference Mobile'}
                      name="ReferenceMobile_1"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      maxLength="10"
                      disabled={true}
                      className="form-control-coustom"
                    />
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
                      label={'Reference Name'}
                      name="ReferenceName_2"
                      component={TextBox}
                      placeholder="Enter ReferenceName"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      disabled={true}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={'Reference Mobile'}
                      name="ReferenceMobile_2"
                      component={TextBox}
                      placeholder="Enter ReferenceMobile"
                      maxLength="10"
                      disabled={true}
                      className="form-control-coustom"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="File Uploader"
              sectionKey="Uploader"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            {/** File Uploader */}
            <Field
              label="Uploader Helper"
              name={this.state.UploaderEsafSample.fieldName}
              component={Uploader}
              multiple={true}
              initialUploadLoader={
                this.state.UploaderEsafSample.initialUploadLoader
              }
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              uploaderConfig={this.state.UploaderEsafSample}
              validate={[uploadChecker(this.state.UploaderEsafSample)]}
            />
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, props) => {
  console.log('***** Field inspection States', state)
  return {
    //get current form values
    formValues: getFormValues('fieldInspection')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('fieldInspection')(state),
  }
}
export default connect(mapStateToProps, {})(TabFieldInspection)
