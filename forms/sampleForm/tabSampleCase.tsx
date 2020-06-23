import * as React from "react";
import {
  FormHeadSection,

  uploadChecker,
  // retrieveDefaultFiles,
  A8V,
  IsJsonString,
  handleDynamicErrorHelper,
  Config
} from "../../helpers";
import {
  Field,
  getFormSyncErrors,
  getFormValues,
  isValid
} from "redux-form";
import { connect } from "react-redux";


import {
  Scanner,
  DatePicker,
  Otp,
  Select,
  SelectHelper,
  Checkbox,
  TextButtonGroup,
  Checklist,
  AccountDetailsView,
  RadioWrapper,
  Radio,
  TextBox,
  Password,
  Switch,
  Uploader,
  DocumentCollector
} from "a8flow-uikit";
import { Checkbox as antCheckbox, Form } from "antd";

type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
  ipc: any;
  formValues: any;
  isFormValid: any;
};

type State = {
  sectionValidator: any;
  UploaderEsafSample: any;
  loading: boolean;
  showSuccess: boolean;
  buttonLabel: string;
  showFailure: boolean;
  checklist: any[];
  accountDetails: any[];
  otpDisable: boolean;
  // idProofs: any;
  // salaryProofs: any;
  documentsUploadedBy: string;
};

//Extract Option from SelectHelper
const { Option } = SelectHelper;

class TabSampleCase extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      FormScanner: [
        { fieldOne: true, fieldTwo: true },
        "tempa8VarFieldName",
        "tempa8VarFieldNameSSS",
        "testStringVariable"
      ],
      FormScannerQR: [{}],
      FormScannerPDF: [],
      basicInfo: ["ApplicationID", "BranchID", "extraField"],
      sectionTwo: ["BorrowerAddress", "AccountNumber"],
      Uploader: ["UploaderEsafSample"],
      docsCollection: []
    },
    // idProofs: { docs: [], minReq: 1 },
    // salaryProofs: { docs: [], minReq: 1 },
    documentsUploadedBy: "",
    UploaderEsafSample: {
      // name of uploader field name
      fieldName: "UploaderEsafSample",
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      fileInfo: [
        { name: "Adhar Card", key: "AdharCard" },
        { name: "Pan Card", key: "PanCard" },
        { name: "Passport", key: "Passport" },

      ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: ["AdharCard"],
      // uploadLimit handle how many fields the user need to upload
      uploadLimit: 3,
      /**
       * errorMsg : handle custom error messages.
       * you can pass to handle different sceneries
       */
      errorMsg: {
        //if upload limit exceed
        uploadLimit: "Upload limit exceed!",
        //if fileInfo.length != uploadLimit below message will show
        fileInfoUploadLimitMisMatch:
          "YOUR FIELD NAME props fileinfo and upload limit should be equal",
        //if multiple file uploads have same name
        variableNameConflict: "File Name should be unique",
        //if file uploaded, force your to select file/variable name
        updateVariableName: "Please Select File Name"
      },
      //this props handle defaultFiles fetching state
      initialUploadLoader: false
    },
    //otp disable state
    otpDisable: false,
    //fields necessary for text button group

    loading: false,
    buttonLabel: "Verify",
    showSuccess: false,
    showFailure: false,

    //Dynamic ProcessVariable Update from API or Manually
    dynamicValues: {
      dynamicVariableOne: {
        value: "dynamicValueOne"
      },
      dynamicVariableTwo: {
        value: "dynamicValueTwo"
      },
      dynamicFileVariable: {
        value: "base64",
        type: "File",
        valueInfo: {
          filename: "myFileName"
        }
      }
    },
    //data for checklist

    checklist: [
      {
        fieldName: "Name",
        value: { type: "String", value: "Mohamed Nadheem" },
        validation: []
      },
      {
        fieldName: "Age",
        value: { type: "String", value: "24" },
        validation: ["required"]
      },
      {
        fieldName: "Address",
        value: { type: "String", value: "Chennai" },
        validation: ["required"]
      },
      {
        fieldName: "NameTwo",
        value: { type: "String", value: "Mohamed" },
        validation: ["required"]
      },
      // {
      //   fieldName: "panImg",
      //   value: { type: "Object", value: this.props.task.taskInfo.info.taskVariables["panImg"].value },
      //   validation: ["required"]
      // }
    ],

    //data for account details view

    accountDetails: [
      {
        accountName: "Applicant Employment Information",
        fields: [
          {
            fieldKey: "Primary ID Proof Type",
            fieldValue: "Aadhaar CARD"
          },
          {
            fieldKey: "Primary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Secondary ID Proof Type",
            fieldValue: "PAN Crad"
          },
          {
            fieldKey: "Secondary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "PAN No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Salutation",
            fieldValue: "Mr."
          },
          {
            fieldKey: "First Name",
            fieldValue: "Mohamed"
          },
          {
            fieldKey: "Middle Name",
            fieldValue: "M"
          },
          {
            fieldKey: "Last Name",
            fieldValue: "Nadheem"
          },
          {
            fieldKey: "Maiden Name",
            fieldValue: "Nadheem"
          },
          {
            fieldKey: "Gender",
            fieldValue: "Male"
          },
          {
            fieldKey: "Date of Birth",
            fieldValue: "18 October 1994"
          },
          {
            fieldKey: "Age",
            fieldValue: "24"
          },
          {
            fieldKey: "Age as On Date",
            fieldValue: "30 August 2019"
          }
        ]
      },

      {
        accountName: "Applicant Employment Information",
        fields: [
          {
            fieldKey: "Primary ID Proof Type",
            fieldValue: "Aadhaar CARD"
          },
          {
            fieldKey: "Primary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Secondary ID Proof Type",
            fieldValue: "PAN Crad"
          },
          {
            fieldKey: "Secondary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "PAN No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Salutation",
            fieldValue: "Mr."
          },
          {
            fieldKey: "First Name",
            fieldValue: "Mohamed"
          },
          {
            fieldKey: "Middle Name",
            fieldValue: "M"
          },
          {
            fieldKey: "Last Name",
            fieldValue: "Nadheem"
          }
        ]
      },

      {
        accountName: "Applicant Employment Information",
        fields: [
          {
            fieldKey: "Primary ID Proof Type",
            fieldValue: "Aadhaar CARD"
          },
          {
            fieldKey: "Primary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Secondary ID Proof Type",
            fieldValue: "PAN Crad"
          },
          {
            fieldKey: "Secondary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "PAN No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Salutation",
            fieldValue: "Mr."
          },
          {
            fieldKey: "First Name",
            fieldValue: "Mohamed"
          },
          {
            fieldKey: "Middle Name",
            fieldValue: "M"
          },
          {
            fieldKey: "Last Name",
            fieldValue: "Nadheem"
          }
        ]
      },

      {
        accountName: "Applicant Employment Information",
        fields: [
          {
            fieldKey: "Primary ID Proof Type",
            fieldValue: "Aadhaar CARD"
          },
          {
            fieldKey: "Primary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Secondary ID Proof Type",
            fieldValue: "PAN Crad"
          },
          {
            fieldKey: "Secondary ID Proof No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "PAN No.",
            fieldValue: "AELPV4406678"
          },
          {
            fieldKey: "Salutation",
            fieldValue: "Mr."
          },
          {
            fieldKey: "First Name",
            fieldValue: "Mohamed"
          },
          {
            fieldKey: "Middle Name",
            fieldValue: "M"
          },
          {
            fieldKey: "Last Name",
            fieldValue: "Nadheem"
          },
          {
            fieldKey: "Maiden Name",
            fieldValue: "Nadheem"
          },
          {
            fieldKey: "Gender",
            fieldValue: "Male"
          },
          {
            fieldKey: "Date of Birth",
            fieldValue: "18 October 1994"
          },
          {
            fieldKey: "Age",
            fieldValue: "24"
          },
          {
            fieldKey: "Age as On Date",
            fieldValue: "30 August 2019"
          }
        ]
      }
    ]
  };

  async componentDidMount() {
    //NOTE ::: Commend below code for local development
    //set initialUploader true
    this.setState(prevState => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: true
      }
    }));
    //use this helper to retrieve default files
    // await retrieveDefaultFiles({
    //   taskInfo: this.props.task.taskInfo,
    //   fileInfo: this.state.UploaderEsafSample,
    //   fieldPopulator: this.props.fieldPopulator
    // });
    //set initialUploadLoader false
    this.setState(prevState => ({
      UploaderEsafSample: {
        ...prevState.UploaderEsafSample,
        initialUploadLoader: false
      }
    }));

    // initialise the checklist values from api and bind in the respective field

    let formKeys = Object.keys(this.props.formValues);

    let {
      sectionValidator: { sectionTwo }
    } = this.state;
    if (formKeys.includes("-isChecked")) {
      this.state.checklist.forEach(item => {
        //initialise false in redux-store for the fields that are not required in checklist
        this.props.fieldPopulator(
          `${item.fieldName}-isChecked`,
          item.validation.includes("required") ? "" : false
        );

        //add the required fields in sectionv validatior to keep as Pending when it is not selected
        item.validation.includes("required") &&
          sectionTwo.push(`${item.fieldName}-isChecked`);
      });
    } else {
      this.state.checklist.forEach(item => {
        //add the required fields in sectionv validatior to keep as Pending when it is not selected
        item.validation.includes("required") &&
          sectionTwo.push(`${item.fieldName}-isChecked`);
      });
    }

    this.setState((prevState: State) => ({
      sectionValidator: {
        ...prevState.sectionValidator,
        sectionTwo: [...sectionTwo]
      }
    }));
  }
  otpNumber = (otp, clearOtp) => {
    console.log("otp in tabsampleCase-->", otp);
    this.setState({ otpDisable: true });
    // clearOtp();
  };
  onchangeOtp = otp => {
    console.log("otp in tabsampleCase onchange-->", otp);
    this.setState({ otpDisable: false });
  };

  handleDynamicError = e => {

    if (e === "2") {
      this.setState({
        sectionValidator: handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          fieldKey: "fieldOne",
          value: false,
          ipc: this.props.ipc
        })
      });

      for (var key in this.state.dynamicValues) {
        if (this.state.dynamicValues[key].type === "File") {
          this.props.fieldPopulator(key, this.state.dynamicValues[key]);
        } else {
          this.props.fieldPopulator(key, this.state.dynamicValues[key]);
        }
      }
    } else if (e === "1") {
      this.setState({
        sectionValidator: handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          fieldKey: "fieldOne",
          value: true,
          ipc: this.props.ipc
        })
      });
    }
  };

  handleDynamicErrorTwo = e => {
    if (e === "2") {
      console.log("from Dynamic Error Object");
      console.log(
        handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          value: false,
          fieldKey: "fieldTwo",
          ipc: this.props.ipc
        })
      );
      this.setState({
        sectionValidator: handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          fieldKey: "fieldTwo",
          value: false,
          ipc: this.props.ipc
        })
      });
    } else if (e === "1") {
      console.log(
        handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          fieldKey: "fieldTwo",
          value: true,
          ipc: this.props.ipc
        })
      );
      this.setState({
        sectionValidator: handleDynamicErrorHelper({
          sectionKey: "FormScanner",
          sectionValidator: this.state.sectionValidator,
          fieldKey: "fieldTwo",
          value: true,
          ipc: this.props.ipc
        })
      });
    }
  };

  handleKycDocsSelect = (values: any[], categoryId: string, displayNameMap: any) => {
    console.log(values);
    let { docsCollectorData } = this.props.formValues;
    let allCategories, newCategory, newValues;
    if (docsCollectorData && docsCollectorData.value) {
      newCategory = docsCollectorData.value[categoryId] ? { ...docsCollectorData.value[categoryId] } : { docs: [], minReq: 1 };
      newValues = values.map(val => { return { variable: val, displayName: displayNameMap[val] } })
      newCategory.docs = newValues;
      allCategories = { ...docsCollectorData.value, [categoryId]: newCategory };
    } else {
      newCategory = { docs: [], minReq: 1 };
      newValues = values.map(val => { return { variable: val, displayName: displayNameMap[val] } })
      newCategory.docs = newValues;
      allCategories = { [categoryId]: newCategory };
    }
    this.props.fieldPopulator("docsCollectorData", { type: "String", value: allCategories });
    // this.setState<any>({ [`${categoryId}`]: newCategory });
  }

  handleKycMinReqSelect = (categoryId: string, minReq: number = 0) => {
    let { docsCollectorData } = this.props.formValues;
    let allCategories, newCategory;
    if (docsCollectorData && docsCollectorData.value) {
      newCategory = docsCollectorData.value[categoryId] ? { ...docsCollectorData.value[categoryId] } : { docs: [], minReq: 1 };
      newCategory.minReq = minReq;
      allCategories = { ...docsCollectorData.value, [categoryId]: newCategory };
    } else {
      newCategory = { docs: [], minReq: 1 };
      newCategory.minReq = minReq;
      allCategories = { [categoryId]: newCategory };
    }
    this.props.fieldPopulator("docsCollectorData", { type: "String", value: allCategories });
    // this.setState<any>({ [`${categoryId}`]: newCategory });
  }

  docsCollector = [
    {
      id: "idProofs",
      category: "ID Proofs",
      options: [
        { label: 'Aadhar', value: 'aadhar' },
        { label: 'Driving License', value: 'drivingLicense' },
        { label: 'PAN', value: 'panImg' },
        { label: 'Passport', value: 'passport' },
        { label: 'VoterId', value: 'voterId' },
      ],
      displayNameMap: {
        aadhar: "Aadhar",
        drivingLicense: "Driving License",
        panImg: "PAN",
        passport: "Passport",
        voterId: "Voter Id"
      }
    },
    {
      id: "salaryProofs",
      category: "Salary Proofs",
      options: [
        { label: 'Payslip', value: 'payslip' },
        { label: 'Bank Statement', value: 'bankStatement' },
        { label: 'Single KYC Approval', value: 'singleKYCApproval' }
      ],
      displayNameMap: {
        payslip: "Payslip",
        bankStatement: "Bank Statement",
        singleKYCApproval: "Single KYC Approval"
      }
    }
  ]


  render() {
    let {
      panDetails,
      adharDetails,
      drivingLicenseDetails,
      passportDetails,
      voterIdDetails,
      docsCollectorData,
      uploadedBy
    } = this.props.formValues;

    let panDetailsParsed = null;

    if (panDetails && IsJsonString(panDetails.value)) {
      panDetailsParsed = JSON.parse(panDetails.value);
    }

    if (adharDetails && IsJsonString(adharDetails)) {
      adharDetails = JSON.parse(adharDetails);
    }

    if (drivingLicenseDetails && IsJsonString(drivingLicenseDetails)) {
      drivingLicenseDetails = JSON.parse(drivingLicenseDetails);
    }

    if (passportDetails && IsJsonString(passportDetails)) {
      passportDetails = JSON.parse(passportDetails);
    }

    if (voterIdDetails && IsJsonString(voterIdDetails)) {
      voterIdDetails = JSON.parse(voterIdDetails);
    }




    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >

          {/**start
           */}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Documents Collection"
              sectionKey="docsCollection"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            {/* <div className="form-section-content" style={{ display: "block" }}> */}
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-8 col-md-8">
                  <Field
                    label={"Uploaded by"}
                    name={"uploadedBy"}
                    component={Select}
                    //This class is must
                    className={"a8Select"}
                    placeholder="Select documents uploaded by"
                  >
                    <Option value="applicant">Applicant</Option>
                    <Option value="fieldAgent">Field Agent</Option>
                  </Field>
                  {uploadedBy &&
                    uploadedBy.value === "applicant" &&
                    (<>
                      {this.docsCollector.map(docs =>
                        <Form.Item
                          label={docs.category}
                          style={{ border: "1px solid #d9d9d9", padding: "12px", borderRadius: "8px" }}
                        >
                          <div className="row">
                            <div className="form-group col-xs-8 col-md-8">
                              <antCheckbox.Group
                                style={{ paddingLeft: "12px" }} className="kyc-Option-checkBox"
                                options={docs.options}
                                value={docsCollectorData && docsCollectorData.value[docs.id] && docsCollectorData.value[docs.id].docs.map(x => x.variable)}
                                onChange={(values) => this.handleKycDocsSelect(values, docs.id, docs.displayNameMap)} />
                            </div>
                            <div className="form-group col-xs-4 col-md-4">
                              <Form.Item
                                label={"Minimum required"}
                              >
                                <SelectHelper
                                  placeholder="Minimum required"
                                  value={docsCollectorData && docsCollectorData.value[docs.id] && docsCollectorData.value[docs.id].minReq}
                                  onChange={(value) => this.handleKycMinReqSelect(docs.id, value)}>
                                  {new Array(docs.options.length).fill(0).map((dummy, i) => {
                                    return (<Option value={i + 1}>{i + 1}</Option>)
                                  })}
                                </SelectHelper>
                              </Form.Item>
                            </div>
                          </div>
                        </Form.Item>
                      )}
                      <Field
                        label="Customer's documents"
                        name="documentCollector"
                        component={DocumentCollector}
                        docsDetails={this.docsCollector.map(doc => {
                          return {
                            category: doc.category,
                            docVarsDetails: docsCollectorData && docsCollectorData.value[doc.id] ? docsCollectorData.value[doc.id].docs : [],
                            minRequired: docsCollectorData && docsCollectorData.value[doc.id] ? docsCollectorData.value[doc.id].minReq : 0
                          }
                        })
                        }
                        hostUrl={Config.hostUrl}
                        taskInfo={this.props.taskInfo}
                        ipc={this.props.ipc}
                        fieldPopulator={this.props.fieldPopulator}
                      />
                    </>)}

                  {this.props.formValues.uploadedBy &&
                    this.props.formValues.uploadedBy.value === "fieldAgent" &&
                    <Field
                      label={"Document Scanner"}
                      name="tmpDocScanner"
                      component={Scanner}
                      docType="PDF"
                      imageVar="docHolder"
                      taskInfo={this.props.taskInfo}
                      a8flowApiUrl={
                        "https://esaf-testing.autonom8.com/engine-rest/"
                      }
                      ipc={this.props.ipc}
                    />}
                </div>
              </div>
            </div>
          </div>


          {/* /**end */}




          <div className="form-section">
            <FormHeadSection
              sectionLabel="Form Scanner"
              sectionKey="FormScanner"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              initialTab={true}
            />

            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                {/* <div className="form-group col-xs-6 col-md-4">
                  <input
                    type="date"
                    placeholder="Date"
                    // type="text"
                    // data-date-format="DD MMMM YYYY"
                    // placeholder="Select date"
                    // onChange={e => {
                    //   console.log("eeeeee", e.target.value);
                    // }}
                    // name="expecteddate"
                  />
                </div> */}
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name={"FieldEddd"}
                    component={Checkbox}
                    //class name is must
                    className="a8CheckBox"
                  />
                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name="RadioBooleanTest"
                    component={RadioWrapper}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Field>
                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name={"dateTest"}
                    component={DatePicker}
                    showTime //optional
                    placeholder="Select Time"
                  />

                  <Field
                    label={"DatePickerTwe"}
                    name={"dateTestTwo"}
                    component={DatePicker}
                    showTime //optional
                    placeholder="Select Time"
                    onChange={(date: any) => {
                      console.log("from date picker");
                      console.log(date);
                    }}
                  />

                  <Field
                    label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                    name={"selectFieldName"}
                    component={Select}
                    placeholder="Select Placeholder"
                    //This class is must
                    className={"selectCCC"}
                    onChange={this.handleDynamicError}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{
                      width: "400px"
                    }}
                  >
                    <Option value="1">Option One</Option>
                    <Option value="2">Option Two</Option>
                    <Option value="3">Option Three</Option>
                  </Field>

                  <Field
                    label={"Your Label"}
                    name={"selectFieldNameTwo"}
                    component={Select}
                    placeholder="Select Placeholder"
                    //This class is must
                    className={"a8Select"}
                    onChange={this.handleDynamicErrorTwo}
                  >
                    <Option value="1">Option One</Option>
                    <Option value="2">Option Two</Option>
                    <Option value="3">Option Three</Option>
                  </Field>

                  <Field
                    label={"Your Label"}
                    name={"tempa8VarFieldName"}
                    component={TextBox}
                    placeholder="placeholder"
                    type="text"
                    hasFeedback
                  />

                  <Field
                    label={"Password"}
                    name={"tempa8VarFieldName"}
                    component={Password}
                    placeholder="placeholder"
                    hasFeedback
                  />


                  <Field
                    label={"Your dsfds"}
                    name={"testStringVariable"}
                    component={TextBox}
                    placeholder="placeholder"
                    type="text"
                    hasFeedback
                    validate={[
                      A8V.required({
                        errorMsg: "testStringVariable Type is required"
                      })
                    ]}
                  />
                  <Field
                    label={"Voter Scanner"}
                    name="tmpScanner"
                    component={Scanner}
                    docType="VOTERID"
                    imageVar={"voterIdImage"}
                    parserVar={"voterIdDetails"}
                    docParse={true}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    isDataFound={panDetails}
                    metaVar={"voterIdMeta"}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                  {voterIdDetails && (
                    <div style={{ marginTop: "-20px" }}>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Name :</span>
                        {voterIdDetails.name}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          Account Number :
                        </span>{" "}
                        {voterIdDetails.accountNumber}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Gender :</span>{" "}
                        {voterIdDetails.gender}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          Fathers Name :
                        </span>{" "}
                        {voterIdDetails.fathersName}
                      </p>
                    </div>
                  )}
                  <Field
                    label={"Driving License Scanner"}
                    name="tmpScanner"
                    component={Scanner}
                    docType="DL"
                    imageVar={"DLImg"}
                    parserVar={"drivingLicenseDetails"}
                    docParse={true}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    isDataFound={drivingLicenseDetails}
                    metaVar={"drivingLicenseMeta"}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                  {drivingLicenseDetails && (
                    <div style={{ marginTop: "-20px" }}>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Blood Group :</span>
                        {drivingLicenseDetails.bloodGroup}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Date of Birth :</span>
                        {" "}
                        {drivingLicenseDetails.dateOfBirth}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                        {" "}
                        {drivingLicenseDetails.dateOfIssue}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Date of Expiry :</span>
                        {" "}
                        {drivingLicenseDetails.dateOfExpiry}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>DL Number :</span>
                        {" "}
                        {drivingLicenseDetails.dlId}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>State :</span>
                        {" "}
                        {drivingLicenseDetails.dlState}
                      </p>
                    </div>
                  )}
                  <Field
                    label={"Passport Scanner"}
                    name="tmpScanner"
                    component={Scanner}
                    docType="PASSPORT"
                    imageVar={"passportImg"}
                    parserVar={"passportDetails"}
                    docParse={true}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    isDataFound={passportDetails}
                    metaVar={"passportMeta"}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  />
                  {passportDetails && (
                    <div style={{ marginTop: "-20px" }}>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Type :</span>
                        {passportDetails.type}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Passport Number :</span>
                        {" "}
                        {passportDetails.passportNumber}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>DOB :</span>
                        {" "}
                        {passportDetails.dob}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Gender :</span>
                        {" "}
                        {passportDetails.gender}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Date of Issue :</span>
                        {" "}
                        {passportDetails.dateOfIssue}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Date Of Expiry :</span>
                        {" "}
                        {passportDetails.dateOfExpiry}
                      </p>
                    </div>
                  )}
                  <Field
                    label={"Scan Pan Card"}
                    name="tmpScanner"
                    component={Scanner}
                    docType="PAN"
                    imageVar={"panImg"}
                    parserVar={"panDetails"}
                    docParse={true}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    isDataFound={panDetails}
                    metaVar={"panMeta"}
                    ipc={this.props.ipc}
                    fieldPopulator={this.props.fieldPopulator}
                  // scannerDisabled={true}
                  />
                  {panDetailsParsed && (
                    <div style={{ marginTop: "-20px" }}>
                      <p>
                        <span style={{ color: "#CB1E1A" }}>Name :</span>
                        {panDetailsParsed.name}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          Account Number :
                        </span>{" "}
                        {panDetailsParsed.accountNumber}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>DOB :</span>{" "}
                        {panDetailsParsed.dob}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          Fathers Name :
                        </span>{" "}
                        {panDetailsParsed.fathersName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Form Scanner Adhar Qr"
              sectionKey="FormScannerQR"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />

            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Scan Adhar Card Via Qr"}
                    name="tmpAdharScanner"
                    component={Scanner}
                    docType="QR"
                    parserVar={"adharDetails"}
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                  />
                  {adharDetails && (
                    <div>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>Name :</span>
                        {adharDetails.name}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          Adhar Number :
                        </span>{" "}
                        {adharDetails.uid}
                      </p>
                      <p>
                        {" "}
                        <span style={{ color: "#CB1E1A" }}>
                          District :
                        </span>{" "}
                        {adharDetails.dist}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Form Scanner PDF"
              sectionKey="FormScannerPDF"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />

            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Switch Label"}
                    name={"SwitchLabelName"}
                    component={Switch}
                    //class name is must
                    className="a8Switch"
                  />
                  <Field
                    label={"PDF Scanner"}
                    name="tmpPDFScanner"
                    component={Scanner}
                    docType="PDF"
                    imageVar="pdfHolder"
                    taskInfo={this.props.taskInfo}
                    a8flowApiUrl={`${Config.baseUrl}`}
                    ipc={this.props.ipc}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="File Uploader Testing"
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
              validate={[
                uploadChecker(this.state.UploaderEsafSample)
                // A8V.required({ errorMsg: "required" })
              ]}
              ipc={this.props.ipc}
            // defaultAnnotation={"voterId"}
            />
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Basic Information"
              sectionKey="basicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            {/* <div className="form-section-content" style={{ display: "block" }}> */}
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Applicant Id"}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={
                      [
                        // A8V.maxLength({errorMsg:"Custom Error" ,max : 12}),
                        // A8V.minLength({errorMsg : "", min : 3}),
                        // A8V.required({errorMsg: "ApplicantID is required"}),
                        // A8V.number({errorMsg : "ApplicationId must be number"}),
                        // A8V.maxValue({errorMsg : "from max" , max : 4}),
                        // A8V.minValue({min : 4}),
                        // A8V.email({})
                      ]
                    }
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Branch Id"}
                    name="BranchID"
                    component={TextBox}
                    placeholder="Enter Branch Id"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  // validate={[Validate.required]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Branch Name"}
                    name="BranchName"
                    component={TextBox}
                    placeholder="Enter Branch Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Extra Field"}
                    name="extraField"
                    component={TextBox}
                    placeholder="Extra Field"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Widget"
                    name="selectWidget"
                    component={SelectHelper}
                    placeholder="Select a person"
                    className="a8Select"
                  >
                    <Option value="1">Option One</Option>
                    <Option value="2">Option Two</Option>
                    <Option value="3">Option Three</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Date"
                    name="dateA8"
                    component={DatePicker}
                    showTime
                    placeholder="Select Time"
                  />
                </div>
                <div className="form-group ">
                  <Otp
                    numInputs={5}
                    submitLabel={"submit"}
                    mobileNumber={"9942276886"}
                    handleOtpNumber={this.otpNumber}
                    otpOnchange={this.onchangeOtp}
                    disableSubmit={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Section Two"
              sectionKey="sectionTwo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Borrower Address"}
                    name="BorrowerAddress"
                    component={TextBox}
                    placeholder="Enter BorrowerAddress"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Loan Amount"}
                    name="LoanAmount"
                    component={TextBox}
                    placeholder="Enter Loan Amount"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Officer Name"}
                    name="OfficerName"
                    component={TextBox}
                    placeholder="Enter Officer Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                  />
                </div>
                <div className="form-group ">
                  <Otp
                    numInputs={6}
                    submitLabel={"submit"}
                    mobileNumber={"1234567891"}
                    handleOtpNumber={this.otpNumber}
                    otpOnchange={this.onchangeOtp}
                    disableSubmit={this.state.otpDisable}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Your Label"}
                    name={"Field Name"}
                    component={Checkbox}
                    //class name is must
                    className="a8CheckBox"
                  />
                </div>

                {/* Text button group component */}

                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Account Number"
                    name="AccountNumber"
                    component={TextButtonGroup}
                    placeholder="Type Account Number"
                    className="form-control-coustom"
                    hasFeedback
                    validate={[
                      A8V.required({ errorMsg: "Account Number is required" })
                    ]}
                    buttonLabel={this.state.buttonLabel}
                    isButtonLoading={this.state.loading}
                    onInputChange={(e: any) => console.log(e)}
                    showSuccesIcon={this.state.showSuccess}
                    showFailureIcon={this.state.showFailure}
                    onButtonClick={() => {
                      this.setState({ loading: true });
                      setTimeout(() => {
                        this.setState({
                          loading: false,
                          showSuccess: true,
                          buttonLabel: "Retry"
                        });
                      }, 5000);
                    }}
                  />
                </div>

                {/* Checklist component */}

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
                    {this.state.checklist.map(item => {
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
                            item.validation.includes("required") && [
                              A8V.required({
                                errorMsg: `${item.fieldName} checklist is not selected`
                              })
                            ]
                          }
                        />
                      );
                    })}
                  </React.Fragment>
                </div>

                {/* Account details view component */}

                <div className="form-group col-xs-12 col-md-12">
                  <AccountDetailsView
                    accountDetails={this.state.accountDetails}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Select Date"
                    name="dateA8"
                    component={DatePicker}
                    showTime
                    placeholder="Select Time"
                  />
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log("fromDynamicUpdate");
  console.log(getFormValues("sampleForm")(state));
  return {
    //get current form values
    formValues: getFormValues("sampleForm")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("sampleForm")(state),
    isFormValid: isValid("sampleForm")(state),
    //taskInfo
    task: state.task
  };
};

export default connect(
  mapStateToProps,
  {}
)(TabSampleCase);
