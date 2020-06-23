import * as React from 'react'
import { FormHeadSection, A8V, Config } from '../../helpers'
import { TextBox, DatePicker } from 'a8flow-uikit'
import { Button } from 'antd'
import { Field, getFormSyncErrors, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import classname from 'classnames'

type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
  moduleName: any
}

type State = {
  sectionValidator: any
}

class TabFinalDisbursement extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        DisbursementInfo: ['UTRNumber', 'sanctionedLoanAmount', 'sanctionDate'],
      },
    }
  }

  handleSanctionDate = (e) => {
    this.props.fieldPopulator('sanctionDate_format', {
      type: 'String',
      value: moment(e.value).format('DD-MM-YYYY').slice(0, 10),
    })
  }

  handleOfferLetterGen = () => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    axios({
      url: `${Config.apiUrl}/v1/offerLetter`,
      method: 'POST',
      headers: { Authorization: authToken },
      responseType: 'arraybuffer',
      data: this.mapOfferLetter(),
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

  mapOfferLetter() {
    try {
      let processVariables = this.props.formValues
      let data = {
        WorkItemNo: '',
        BorrowerName: '',
        LoanAmount: '',
        HouseName: '',
        StreetArea: '',
        City: '',
        District: '',
        State: '',
        Pincode: '',
        VehicleType: '',
        Manufacturer: '',
        AssetModel: '',
        OnRoadPrice: '',
        AssetMake: '',
        sanctionDate_format: '',
        UTRNumber: '',
        BankAccNo: '',
        sanctionedLoanAmount: '',
        DealerName: '',
      }
      let finalData = {}
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
    } catch (error) {
      throw error
    }
  }

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
              sectionLabel="Disbursement Information"
              sectionKey="DisbursementInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    // label={"UTR Number"}
                    label={
                      <span>
                        UTR Number<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="UTRNumber"
                    component={TextBox}
                    placeholder="Enter UTR Number"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'UTR Number is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Payment Amount'}
                    name="sanctionedLoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'Loan Amount is required' }),
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={
                      <span>
                        Fund Transfer Date
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    name="sanctionDate"
                    component={DatePicker}
                    dateFormat="DD-MM-YYYY"
                    placeholder="Select Date"
                    onChange={this.handleSanctionDate}
                    validate={[
                      A8V.required({ errorMsg: 'sanctionDate is required' }),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div
              className={classname('form-section-head clearfix', {
                on: false,
              })}
            >
              <h3>{'Offer Letter Generation'}</h3>
            </div>
            <div className="form-section-content">
              <div className="flex-row">
                <div style={{ display: 'flex' }}>
                  <Button
                    style={{ marginRight: '12px' }}
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.handleOfferLetterGen}
                  >
                    Generate Offer Letter
                  </Button>
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
  console.log('FROM MAP STATE TO PROPS Final Disbursement', state)

  return {
    //get current form values
    formValues: getFormValues(props.moduleName || 'finalDisbursement')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors(props.moduleName || 'finalDisbursement')(
      state,
    ),
  }
}

export default connect(mapStateToProps, {})(TabFinalDisbursement)
