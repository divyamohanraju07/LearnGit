import * as React from 'react'
import {
  FormHeadSection,
  uploadChecker,
  A8V,
  retrieveDefaultFiles,
} from '../../helpers'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import classname from 'classnames'
import { Uploader, TextBox, DatePicker } from 'a8flow-uikit'

// const { Option } = SelectHelper;

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
  Progress: any
  setscore: any
  showAssetValue: any
  UploaderEsafSample: any
  // dealerNameOptions: any;
  dealerObj: any
}

class TabMakers extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      makersDoc: [],
      Uploader: ['UploaderEsafSample'],
      deliveryInfo: ['MakersDeliveryDate', 'DealerName', 'BankAccNo', ''],
    },
    Progress: false,
    showAssetValue: false,
    setscore: null,
    UploaderEsafSample: {
      // name of uploader field name
      fieldName: 'UploaderEsafSample',
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        { name: 'Annexure to Sanction Order', key: 'AnnexuretoSanctionOrder' },
        { name: 'Dealer Quote', key: 'DealerQuote' },
        { name: 'Form 29 and 30', key: 'Form29and30' },
        { name: 'HP Letter', key: 'HPLetter' },
        { name: 'Insurance Cover Note', key: 'InsuranceCoverNote' },
        { name: 'Loan Agreement', key: 'LoanAgreement' },
        { name: 'Mandate Letter', key: 'MandateLetter' },
        { name: 'PDC', key: 'PDC' },
        { name: 'Document Checklist', key: 'DocumentChecklist' },
        { name: 'Sanction Letter', key: 'SanctionLetter' },
        { name: 'Margin Money', key: 'MarginMoney' },
        { name: 'DPN Key Facts', key: ' DPNKeyFacts' },
        { name: 'Rate Approval', key: ' RateApproval' },
        { name: 'Standing Instruction', key: 'StandingInstruction' },
        { name: 'Others 1', key: ' Others_1' },
        { name: 'Others 2', key: ' Others_2' },
        { name: 'Others 3', key: ' Others_3' },
        { name: 'Others 4', key: ' Others_4' },
        { name: 'Others 5', key: ' Others_5' },
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
        'Annexure to Sanction Order',
        'Dealer Quote',
        'Form 29 and 30',
        'HP Letter',
        'Insurance Cover Note',
        'Loan Agreement',
        'Mandate Letter',
        'PDC',
        'Document Checklist',
        'Sanction Letter',
        'Margin Money',
        'DPN Key Facts',
        'Rate Approval',
        'Standing Instruction',
        'Others 1',
        'Others 2',
        'Others 3',
        'Others 4',
        'Others 5',
      ],
      // uploadLimit handle how many fields the user need to upload
      uploadLimit: 19,
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
      initialUploadLoader: false,
    },
    // dealerNameOptions: [],
    dealerObj: {},
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
    this.setState((prevState) => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: false,
      },
    }))
    const retreiveScannedImagesList: string[] = []
    const { formValues } = this.props
    if (formValues) {
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const element = formValues[key]
          if (element.type === 'File') {
            retreiveScannedImagesList.push(key)
          }
        }
      }
    }
    this.props.fieldPopulator('favourOf', {
      type: 'String',
      value: 'ESAF Small Finance Bank',
      valueInfo: {},
    })
    this.handleSanctionAmount()
  }

  handleSanctionAmount = () => {
    let formvalues = this.props.formValues
    let FinalRecommendedAmount = this.props.formValues.LoanAmount
      ? this.props.formValues.LoanAmount.value
      : '0'
    if (formvalues.FinalApprovalLoanAmount) {
      FinalRecommendedAmount = formvalues.FinalApprovalLoanAmount.value
    } else if (
      !formvalues.FinalApprovalLoanAmount &&
      formvalues.L2RecommendedLoanAmount
    ) {
      FinalRecommendedAmount = formvalues.L2RecommendedLoanAmount.value
    } else if (
      !formvalues.FinalApprovalLoanAmount &&
      !formvalues.L2RecommendedLoanAmount &&
      formvalues.L1RecommendedLoanAmount
    ) {
      FinalRecommendedAmount = formvalues.L1RecommendedLoanAmount.value
    } else if (
      !formvalues.FinalApprovalLoanAmount &&
      !formvalues.L2RecommendedLoanAmount &&
      !formvalues.L1RecommendedLoanAmount &&
      formvalues.BO_RecommendedLoanAmount
    ) {
      FinalRecommendedAmount = formvalues.BO_RecommendedLoanAmount.value
    }
    this.props.fieldPopulator('sanctionedLoanAmount', {
      type: 'String',
      value: FinalRecommendedAmount,
    })
  }

  // handleDealer = (e) => {
  //     let { value } = e;
  //     var dealerObj = this.state.dealerNameOptions.find(function (dealer) {
  //         return dealer.DealerName === value;
  //     })
  //     this.props.fieldPopulator("BankAccNo", { type: 'string', value: dealerObj.BankAccNo })
  // }

  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', { on: false })}
            >
              <h3>{'Document Upload'}</h3>
            </div>
            <div className="form-section-content">
              <div className="flex-row">
                {/** File Uploader */}
                <Field
                  label="Uploader Helper"
                  name={this.state.UploaderEsafSample.fieldName}
                  component={Uploader}
                  multiple={true}
                  // initialUploadLoader={this.state.UploaderEsafSample.initialUploadLoader}
                  accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
                  uploaderConfig={this.state.UploaderEsafSample}
                  validate={[uploadChecker(this.state.UploaderEsafSample)]}
                  isReadOnly={true}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Delivery Information"
              sectionKey="deliveryInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={true}
            />
            <div className="form-section-content" style={{ display: 'block' }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Disbursal Date<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="MakersDeliveryDate"
                    component={DatePicker}
                    dateFormat="DD-MM-YYYY"
                    placeholder="Select Date"
                    validate={[A8V.required({ errorMsg: 'Date is required' })]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Dealer Name<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="DealerName"
                    component={TextBox}
                    placeholder="Enter Dealer Name"
                    type="text"
                    hasFeedback
                    disabled="true"
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Dealer Name is required' }),
                    ]}
                  />
                </div>

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Dealer A/C<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="BankAccNo"
                    component={TextBox}
                    placeholder="Enter BankAccNo"
                    type="text"
                    disabled={false}
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'BankAccNo is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Dealer Location<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="dealerLocation"
                    component={TextBox}
                    placeholder="Enter BankAccNo"
                    type="text"
                    disabled="true"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'Location is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Loan Amount<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="sanctionedLoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'loan Amount is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        In Favour Of<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="favourOf"
                    component={TextBox}
                    placeholder="Enter Favour Of"
                    type="text"
                    hasFeedback
                    // defaultValue={"ESAF Small Finance Bank"}
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: 'favour Of is required' }),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log('Makers formValue', state)
  return {
    //get current form values
    formValues: getFormValues('makersForm')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('makersForm')(state),
    //taskInfo
    task: state.task,
  }
}

export default connect(mapStateToProps, {})(TabMakers)
