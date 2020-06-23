import * as React from 'react'
import { FormHeadSection, A8V, TextBox, inrFormat, Config } from '../../helpers'
import { getFormSyncErrors, getFormValues, Field } from 'redux-form'
import { Button, Row, Col, Slider, InputNumber } from 'antd'
import { connect } from 'react-redux'
import {
  TextArea,
  AccountDetailsView,
  Select,
  SelectHelper,
} from 'a8flow-uikit'
import classname from 'classnames'
import validate from 'validate.js'
import axios from 'axios'
import moment from 'moment'

const { Option } = SelectHelper

type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
}
type State = {
  sectionValidator: any
  cardView: any
  amount: any
  tenure: any
  showReturnTo: any
  PremiumRates: any
}

class TabApprovalInformation extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      finalApprovalComments: [
        'FinalApproverComments',
        'FAstatus',
        'FAreturnTO',
      ],
    },
    cardView: [],
    amount: this.props.formValues.L2RecommendedLoanAmount
      ? this.props.formValues.L2RecommendedLoanAmount.value
      : this.props.formValues.L1RecommendedLoanAmount
      ? this.props.formValues.L1RecommendedLoanAmount.value
      : this.props.formValues.BO_RecommendedLoanAmount
      ? this.props.formValues.BO_RecommendedLoanAmount.value
      : this.props.formValues.LoanAmount.value,

    tenure: this.props.formValues.L2RecommendedLoanTenure
      ? this.props.formValues.L2RecommendedLoanTenure.value
      : this.props.formValues.L1RecommendedLoanTenure
      ? this.props.formValues.L1RecommendedLoanTenure.value
      : this.props.formValues.BO_RecommendedLoanTenure
      ? this.props.formValues.BO_RecommendedLoanTenure.value
      : this.props.formValues.tenureInput.value,

    showReturnTo: false,
    PremiumRates: '',
  }

  componentDidMount = () => {
    let formvalues = this.props.formValues

    // Recommended Loan Amount Populate Condition check
    if (formvalues.L2RecommendedLoanAmount) {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: formvalues.L2RecommendedLoanAmount.value,
      })
      let x_value = formvalues.L2RecommendedLoanAmount
        ? formvalues.L2RecommendedLoanAmount.value * 0.02
        : '0'
      this.props.fieldPopulator('ProcessingFee', {
        type: 'String',
        value: `${x_value} /- (Plus applicable taxes)`,
      })
    } else if (formvalues.L1RecommendedLoanAmount) {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: formvalues.L1RecommendedLoanAmount.value,
      })
      let x_value = formvalues.L1RecommendedLoanAmount
        ? formvalues.L1RecommendedLoanAmount.value * 0.02
        : '0'
      this.props.fieldPopulator('ProcessingFee', {
        type: 'String',
        value: `${x_value} /- (Plus applicable taxes)`,
      })
    } else if (formvalues.BO_RecommendedLoanAmount) {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: formvalues.BO_RecommendedLoanAmount.value,
      })
      let x_value = formvalues.BO_RecommendedLoanAmount
        ? formvalues.BO_RecommendedLoanAmount.value * 0.02
        : '0'
      this.props.fieldPopulator('ProcessingFee', {
        type: 'String',
        value: `${x_value} /- (Plus applicable taxes)`,
      })
    } else {
      this.props.fieldPopulator('RecommendedLoanAmount', {
        type: 'String',
        value: formvalues.LoanAmount.value,
      })
      let x_value = formvalues.LoanAmount
        ? formvalues.LoanAmount.value * 0.02
        : '0'
      this.props.fieldPopulator('ProcessingFee', {
        type: 'String',
        value: `${x_value} /- (Plus applicable taxes)`,
      })
    }
    // Recommended Loan Tenure Populate Condition check
    if (formvalues.L2RecommendedLoanTenure) {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: formvalues.L2RecommendedLoanTenure.value,
      })
      this.handleInsuranceChange()
    } else if (formvalues.L1RecommendedLoanTenure) {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: formvalues.L1RecommendedLoanTenure.value,
      })
      this.handleInsuranceChange()
    } else if (formvalues.BO_RecommendedLoanTenure) {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: formvalues.BO_RecommendedLoanTenure.value,
      })
      this.handleInsuranceChange()
    } else {
      this.props.fieldPopulator('RecommendedLoanTenure', {
        type: 'String',
        value: this.props.formValues.tenureInput.value,
      })
    }

    if (
      this.props.formValues.FinalApproverComments &&
      this.props.formValues.FinalApproverComments.value !== ''
    ) {
      this.props.fieldPopulator('FinalApproverComments', {
        type: 'String',
        value: '',
      })
      this.props.fieldPopulator('FAstatus', { type: 'String', value: '' })
    }
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
    let tenure = this.props.formValues.L2RecommendedLoanTenure
      ? this.props.formValues.L2RecommendedLoanTenure.value
      : this.props.formValues.L1RecommendedLoanTenure
      ? this.props.formValues.L1RecommendedLoanTenure.value
      : this.props.formValues.BO_RecommendedLoanTenure
      ? this.props.formValues.BO_RecommendedLoanTenure.value
      : this.props.formValues.tenureInput.value
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
            value: tenure,
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
      let loanAmount = this.props.formValues.L2RecommendedLoanAmount
        ? this.props.formValues.L2RecommendedLoanAmount.value
        : this.props.formValues.L1RecommendedLoanAmount
        ? this.props.formValues.L1RecommendedLoanAmount.value
        : this.props.formValues.BO_RecommendedLoanAmount
        ? this.props.formValues.BO_RecommendedLoanAmount.value
        : this.props.formValues.LoanAmount.value
      let premium = Math.round((charge * parseInt(loanAmount)) / 100000)
      this.props.fieldPopulator('InsurancePremium', {
        type: 'String',
        value: `${premium} /- (Plus applicable taxes)`,
      })
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
    this.setState({ amount: e })
    this.props.fieldPopulator('FinalApprovalLoanAmount', {
      type: 'String',
      value: e,
    })
    this.props.fieldPopulator('FinalApprovalLoanAmount_inwords', {
      type: 'String',
      value: this.handleNumtoWord(e),
    })
  }

  handleRecommendedTenure = (e) => {
    this.setState({ tenure: e })
    this.props.fieldPopulator('FinalApprovalLoanTenure', {
      type: 'String',
      value: e,
    })
  }

  handleApproveClick = () => {
    this.setState({ showReturnTo: false })
    this.props.fieldPopulator('FAstatus', {
      type: 'String',
      value: 'Approved',
    })
    this.props.fieldPopulator('FinalApprovalDate', {
      type: 'String',
      value: moment(Date()).format('DD-MM-YYYY').slice(0, 15),
    })
  }

  handleReturnClick = () => {
    this.setState({ showReturnTo: true })
    this.props.fieldPopulator('FAstatus', {
      type: 'String',
      value: 'Returned',
    })
  }
  mapComment = () => {
    try {
      var processVariables = this.props.formValues
      var creditOfficerComment = {
        ' Credit Officer Comments ': {
          BackOfficerComments: '',
          BOApprovalDate: '',
          L1OfficerComments: '',
          L1ApprovalDate: '',
          L2OfficerComments: '',
          L2ApprovalDate: '',
        },
      }
      var cardView = []
      for (let parentKey in creditOfficerComment) {
        let collectedCardData = { accountName: '', fields: [] }
        collectedCardData.accountName = parentKey
        collectedCardData.fields = []
        //append actual data to creditOfficerComment
        for (let childKey in creditOfficerComment[parentKey]) {
          if (!validate.isEmpty(processVariables[childKey])) {
            creditOfficerComment[parentKey][childKey] = processVariables[
              childKey
            ]
              ? processVariables[childKey].value
              : ''
            collectedCardData.fields.push({
              fieldKey: childKey,
              fieldValue: creditOfficerComment[parentKey][childKey],
            })
          }
        }
        cardView.push(collectedCardData)
      }
      this.setState({ cardView: cardView })
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
          {this.props.formValues.L1OfficerComments && (
            <div className="form-section">
              <div
                className={classname('form-section-head clearfix', {
                  on: false,
                })}
              >
                <h3>{'Credit Officer Comments'}</h3>
              </div>
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group  add-del-button">
                    <Button
                      className="api-button"
                      type="danger"
                      size="default"
                      onClick={this.mapComment}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="form-group col-xs-12 col-md-12">
                    {!validate.isEmpty(this.state.cardView) && (
                      <AccountDetailsView
                        accountDetails={this.state.cardView}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Final Approval Comment Section"
              sectionKey="finalApprovalComments"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
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
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <Field
                    label={'Recommended Loan Amount'}
                    name="RecommendedLoanAmount"
                    component={TextBox}
                    type="text"
                    hasFeedback
                    disabled={true}
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Recommended Loan Tenure'}
                    name="RecommendedLoanTenure"
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
                    max={parseInt(this.state.amount)}
                    value={parseInt(this.state.amount)}
                    step={1000.0}
                    onChange={this.handleRecommendedloanAmount}
                  />
                </div>
                <div
                  className="form-group col-xs-6 col-md-4"
                  style={{ marginTop: '10px' }}
                >
                  <IntegerStep
                    label="Recommended Loan Tenure"
                    min={24}
                    max={parseInt(this.state.tenure)}
                    value={parseInt(this.state.tenure)}
                    step={1.0}
                    onChange={this.handleRecommendedTenure}
                  />
                </div>
                {/* for UI Adjustment */}
                <div className="form-group col</div>-xs-6 col-md-4"></div>
                <div className="form-group col</div>-xs-6 col-md-4"></div>

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={' Comments '}
                    name="FinalApproverComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
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
                  </div>
                  <Field
                    hidden={true}
                    name="FAstatus"
                    component={TextArea}
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'FAstatus is required' }),
                    ]}
                  />
                  <Field
                    hidden={true}
                    name="DPN"
                    component={TextBox}
                    className="form-control-coustom"
                  />
                  <Field
                    hidden={true}
                    name="DocChecklist"
                    component={TextBox}
                    className="form-control-coustom"
                  />
                  <Field
                    hidden={true}
                    name="standingInstruction"
                    component={TextBox}
                    className="form-control-coustom"
                  />
                </div>
                {this.state.showReturnTo && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Return To"
                      name="FAreturnTO"
                      component={Select}
                      placeholder="Select Return To"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: 'FAreturnTO is required' }),
                      ]}
                    >
                      <Option value="L1_CreditOfficer">L1_CreditOfficer</Option>
                      <Option value="L2_CreditOfficer">L2_CreditOfficer</Option>
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
  console.log('****** state value final Approval *******', state)
  return {
    //get current form values
    formValues: getFormValues('finalApproval')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('finalApproval')(state),
    //taskInfo
    task: state.task,
  }
}
export default connect(mapStateToProps, {})(TabApprovalInformation)

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
