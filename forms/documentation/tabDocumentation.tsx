import * as React from 'react'
import {
  FormHeadSection,
  // retrieveScannedFiles,
  uploadChecker,
  A8V,
  Config,
} from '../../helpers'
import { Select, SelectHelper, Uploader, TextArea } from 'a8flow-uikit'
import { getFormSyncErrors, getFormValues, Field } from 'redux-form'
import { connect } from 'react-redux'
import { Table, Divider, Button } from 'antd'
import validate from 'validate.js'
import { default as ApiClient } from 'a8forms-api-client'

const { Column, ColumnGroup } = Table
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
  docUpload: any
  returnData: any
  showReturnTo: any
}
let data = [
  {
    key: 'documentChecklist',
    slNo: '1.',
    docName: 'Document CheckList',
  },
  {
    key: 'dpnKeyFacts',
    slNo: '2.',
    docName: 'DPN Keyfacts',
  },
  {
    key: 'DemandPromisory',
    slNo: '3.',
    docName: 'Demand Promissory',
  },
  // {
  //   key: "moDTD",
  //   slNo: "4.",
  //   docName: "MoDTD"
  // },
  {
    key: 'SanctionLetter',
    slNo: '5.',
    docName: 'Sanction Letter',
  },
  {
    key: 'StandingInstruction',
    slNo: '6.',
    docName: 'Standing Instructions',
  },
]
class TabDocumentation extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      applicantDocs: [],
      Uploader: ['docUpload'],
      docGenDecision: ['docGenComments', 'docGenStatus', 'docGenReturnTO'],
    },
    showReturnTo: false,
    returnData: [],
    docUpload: {
      // name of uploader field name
      fieldName: 'docUpload',
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        {
          name: 'Annexure to Sanction Order',
          key: 'AnnexuretoSanctionOrder',
        },
        {
          name: 'Dealer Quote',
          key: 'DealerQuote',
        },
        {
          name: 'Form 29 and 30',
          key: 'Form29and30',
        },
        {
          name: 'HP Letter',
          key: 'HPLetter',
        },
        {
          name: 'Insurance Cover Note',
          key: 'InsuranceCoverNote',
        },
        {
          name: 'Loan Agreement',
          key: 'LoanAgreement',
        },
        {
          name: 'Mandate Letter',
          key: 'MandateLetter',
        },
        {
          name: 'PDC',
          key: 'PDC',
        },
        {
          name: 'Document Checklist',
          key: 'DocumentChecklist',
        },
        {
          name: 'Sanction Letter',
          key: 'SanctionLetter',
        },
        {
          name: 'Margin Money',
          key: 'MarginMoney',
        },
        {
          name: 'DPN Key Facts',
          key: ' DPNKeyFacts',
        },
        {
          name: 'Rate Approval',
          key: ' RateApproval',
        },
        {
          name: 'Standing Instruction',
          key: 'StandingInstruction',
        },
        {
          name: 'Others 1',
          key: ' Others_1',
        },
        {
          name: 'Others 2',
          key: ' Others_2',
        },
        {
          name: 'Others 3',
          key: ' Others_3',
        },
        {
          name: 'Others 4',
          key: ' Others_4',
        },
        {
          name: 'Others 5',
          key: ' Others_5',
        },
      ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: [
        'ResidenceVerificationReport',
        'BusinessVerificationReport',
        'EmploymentVerificationReport',
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
      initialUploadLoader: true,
    },
  }

  componentDidMount = async () => {
    //NOTE ::: Commend below code for local development
    //set initialUploader true
    this.setState((prevState) => ({
      docUpload: {
        ...prevState.docUpload,
        initialUploadLoader: false,
      },
    }))

    // const retreiveScannedImagesList: string[] = [];
    // const { formValues } = this.props;
    // if (formValues) {
    //   for (const key in formValues) {
    //     if (formValues.hasOwnProperty(key)) {
    //       const element = formValues[key];
    //       if (element.type === "File") {
    //         retreiveScannedImagesList.push(key);
    //       }
    //     }
    //   }
    // }

    //use this helper to retrieve pdf files
    // await retrieveScannedFiles({
    //   taskInfo: this.props.task.taskInfo,
    //   variableNamesList: retreiveScannedImagesList,
    //   fieldPopulator: this.props.fieldPopulator,
    //   isScannedFile: false
    // });

    if (
      this.props.formValues.docGenComments &&
      this.props.formValues.docGenComments.value !== ''
    ) {
      this.props.fieldPopulator('docGenComments', { type: 'String', value: '' })
      this.props.fieldPopulator('docGenStatus', { type: 'String', value: '' })
    }

    this.handleDOB()
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
    this.props.fieldPopulator('docGen_claim', {
      type: 'string',
      value: userDetails.data.id,
      valueInfo: {},
    })
    this.props.fieldPopulator('docGenclaim_firstName', {
      type: 'string',
      value: userDetails.data.firstName,
      valueInfo: {},
    })
    this.props.fieldPopulator('docGenclaim_lastName', {
      type: 'string',
      value: userDetails.data.lastName,
      valueInfo: {},
    })
  }

  handleReturn = () => {
    let processVariables = this.props.formValues
    let data = []

    if (!validate.isEmpty(processVariables.docGenStatus)) {
      if (processVariables.docGenStatus.value === 'Returned') {
        data.push({
          key: 'DocGen',
          name: 'Document Generation ',
          value: processVariables.docGenComments.value,
        })
      }
    }
    if (!validate.isEmpty(processVariables.checkerStatus)) {
      if (processVariables.checkerStatus.value === 'Returned') {
        data.push({
          key: 'Checker',
          name: 'Disbursal Checker',
          value: processVariables.checkersComments.value,
        })
      }
    }

    if (!validate.isEmpty(processVariables.makerStatus)) {
      if (processVariables.makerStatus.value === 'Returned') {
        data.push({
          key: 'maker',
          name: 'Disbursal Maker',
          value: processVariables.MakersComments.value,
        })
      }
    }
    this.setState({ returnData: data })
  }

  handleDocumentView = (record) => {
    let pdfData = this.props.formValues[record.key]
    let cloudImage = JSON.parse(pdfData.value),
      pdfImage = cloudImage.url,
      fileType = cloudImage.contentType.split('/')[1]
    let finalPDF = { fileType: fileType }
    if (fileType === 'pdf') {
      finalPDF['file'] = {
        result: { url: pdfImage },
      }
    }
    if (this.props.ipc) {
      this.props.ipc.source.postMessage(
        {
          action: 'openImageView',
          values: {
            ...finalPDF,
          },
        },
        '*',
      )
    }
    // var blob = new Blob([(pdfData.value)], { type: 'application/pdf' });
    // let pdfFile = window.URL.createObjectURL(blob);
    // window.open(pdfFile);
  }

  handleDownload = (record) => {
    let pdfData = this.props.formValues[record.key]
    let element = document.createElement('a')
    let cloudImage = JSON.parse(pdfData.value),
      pdfImage = cloudImage.url,
      fileName = cloudImage.fileName
    //convert arrayBuffer to blob
    // var blob = new Blob([(pdfData.value)], { type: 'application/pdf' });
    //convert the blob object to URL
    let pdfFile = pdfImage
    element.setAttribute('href', pdfFile)
    element.setAttribute('download', fileName)
    element.setAttribute('target', '_blank')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  handleDOB = () => {
    let DateOfBirth = this.props.formValues.DateOfBirth
      ? this.props.formValues.DateOfBirth.value
      : ''
    let date = DateOfBirth.split('T')[0]
    this.props.fieldPopulator('DateOfBirth', {
      type: 'String',
      value: date,
    })
  }

  handleApproveClick = () => {
    this.setState({ showReturnTo: false })
    this.props.fieldPopulator('docGenStatus', {
      type: 'String',
      value: 'Approved',
    })
    this.props.fieldPopulator('DocGenApprovalDate', {
      type: 'String',
      value: Date(),
    })
  }

  handleReturnClick = () => {
    this.setState({ showReturnTo: true })
    this.props.fieldPopulator('docGenStatus', {
      type: 'String',
      value: 'Returned',
    })
  }

  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >
          {/* (this.props.formValues.docGenStatus && this.props.formValues.docGenStatus.value === "Returned") || */}
          {/*Returned Section */}
          {((this.props.formValues.checkerStatus &&
            this.props.formValues.checkerStatus.value === 'Returned') ||
            (this.props.formValues.makerStatus &&
              this.props.formValues.makerStatus.value === 'Returned')) && (
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
            <FormHeadSection
              sectionLabel="Applicant Documents"
              sectionKey="applicantDocs"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <Table dataSource={data}>
                <ColumnGroup>
                  <Column title="Sl. No." dataIndex="slNo" key="slNo" />
                  <Column
                    title="Document Name"
                    dataIndex="docName"
                    key="DocName"
                  />
                </ColumnGroup>
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <Button
                        onClick={() => {
                          this.handleDocumentView(record)
                        }}
                      >
                        View
                      </Button>
                      <Divider type="vertical" />
                      <Button
                        icon="download"
                        onClick={() => {
                          this.handleDownload(record)
                        }}
                      >
                        Download
                      </Button>
                    </span>
                  )}
                />
              </Table>
            </div>
          </div>

          <div className="form-section">
            <FormHeadSection
              sectionLabel="Document Upload  "
              sectionKey="Uploader"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            {/** File Uploader */}
            <Field
              label="Uploader Helper"
              name={this.state.docUpload.fieldName}
              component={Uploader}
              multiple={true}
              initialUploadLoader={this.state.docUpload.initialUploadLoader}
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              uploaderConfig={this.state.docUpload}
              validate={[
                uploadChecker(this.state.docUpload),
                // A8V.required({ errorMsg: "required" })
              ]}
            />
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Document Generation Decision "
              sectionKey="docGenDecision"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={'Decision'}
                    name="docGenComments"
                    component={TextArea}
                    placeholder="Enter Comments"
                    type="text"
                    hasFeedback
                    className="form-control-custom"
                  />
                  <Field
                    hidden={true}
                    name="docGenStatus"
                    component={TextArea}
                    type="text"
                    disabled={true}
                    hasFeedback
                    className="form-control-custom"
                    validate={[
                      A8V.required({ errorMsg: 'docGenStatus is required' }),
                    ]}
                  />

                  {/* for UI Adjustment */}
                  <div className="form-group col</div>-xs-6 col-md-4"></div>
                  <div className="form-group col</div>-xs-6 col-md-4"></div>
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
                </div>

                {this.state.showReturnTo && (
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Return To"
                      name="docGenReturnTO"
                      component={Select}
                      placeholder="Select Return To"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: 'docGenReturnTO is required',
                        }),
                      ]}
                    >
                      <Option value="CIF_Fetch">CIF_Fetch</Option>
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
  console.log('**** State form DocGen ****', state)
  return {
    //get current form values
    formValues: getFormValues('documentation')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('documentation')(state),
    //taskInfo
    task: state.task,
  }
}
export default connect(mapStateToProps, {})(TabDocumentation)
