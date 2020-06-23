# How to use Form Widgets in a8flowform

#### Currently Supporting Form Elements/Components for Field:

| Component List | Status    |
| -------------- | --------- |
| TextBox        | Done      |
| TextArea       | Done      |
| Select         | Done      |
| DatePicker     | Done      |
| Radio          | Done      |
| Uploader       | Done      |
| CheckBox       | `pending` |
| Switch         | `pending` |
| Signature      | `pending` |

## Input Text/number/password widget example.

`import {TextBox} from "../../helpers";`
```
<Field
 label={customLabelName}
 name={fieldName}
 component={TextBox}
 placeholder="placeholder"
 type="text"
 hasFeedback // optional
 onChange={()=>{}} // optional
 // below className is required
 className="form-control-coustom"
/>
```
## TextArea widget example.

`import {TextAreaHelper} from "../../helpers";`

    <Field
        label={customLabelName}
        name={fieldName}
        component={TextAreaHelper}
        placeholder="placeholder"
        rows={4} //optional
        hasFeedback // optional
        onChange={()=>{}} // optional
        // below className is required
        className="form-control-coustom"
        //Height autosize feature
        autosize={boolean} // optional
    />

## Select widget example.

`import {SelectHelper} from "../../helpers";`

     <Field
      label="{customLabelName}"
      name="{fieldName}"
      component={SelectHelper}
      placeholder="PLACEHOLDER"
      //below classname is required
      className="a8Select">
        <Option value="1">Option One</Option>
        <Option value="2">Option Two</Option>
        <Option value="3">Option Three</Option>
    </Field>

    ### DatePicker widget example.


## DatePickerHelper

`import {DatePickerHelper} from "../../helpers";`

     <Field
         label="customlabelname"
         name={fieldName}
         component={DatePickerHelper}
         showTime //optional
         placeholder="Select Time"
    />


## RadioWrapper.

`import {RadioWrapper, Radio, RadioButton} from "../../helpers";`

 #### RadioElement support two views, Radio and RadioButtons.

 #### All antdesign radio props configs available for this component.
 [Antd design Radio Reference](https://ant.design/components/radio/)

    <Field
     label="Label Name"
     name="fieldName"
     component={RadioWrapper}
     //optional
     onChange={()=>}
     >
        //Option 1
        <Radio value={1}>A</Radio>
        <Radio value={2} disabled>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
        //Option 2
        <RadioButton value={1}>A</RadioButton>
        <RadioButton value={2} disabled>B</RadioButton>
        <RadioButton value={3}>C</RadioButton>
        <RadioButton value={4}>D</RadioButton>
    </Field>

## Uploader

  ### Procedure to follow :
 * Import needed files for uploader from helper.
 * Create uploader config with field name in state.
 * Combine uploder with redux-form field.
 * configure uploadChecker field level validation.
 * configure retrieveDefaultFiles helper.
 
##### Step 1: Import needed files for uploader from helper : 
```import { Uploader,uploadChecker,retrieveDefaultFiles} from "../../helpers";```

##### Step 2: Create uploader config with field name in state :

```
  this.state = {
        //the key should be your uploader field name
        UploaderEsaf: {
        // name of uploader field name
        fieldName: "UploaderEsaf",
        /**
         * fileInfo props contain all the fileinfo user need to upload
         * fileInfo.length should be equal to uploadLimit
         * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
         */
        fileInfo: [
          { name: "Adhar Card", key: "AdharCard" },
          { name: "Pan Card", key: "PanCard" },
          { name: "Passport", key: "Passport" }
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
          uploadLimit: "Test Upload limit exceed!",
          //if fileInfo.length != uploadLimit below message will show
          fileInfoUploadLimitMisMatch:
            "Test UploaderEsaf props fileinfo and upload limit should be equal",
          //if multiple file uploads have same name
          variableNameConflict: "Test File Name should be unique",
          //if file uploaded, force user to select file/variable name
          updateVariableName: "Please Select File Name"
        }
        //this props handle defaultFiles fetching state 
        initialUploadLoader: false
      }
      
  }
```

##### Step 3: Combine uploder with redux-form field. :
```import { Uploader,uploadChecker,retrieveDefaultFiles} from "../../helpers";```
```
         <Field
              label="Uploader Helper"
              name="UploaderEsaf"
              //Uploader Component from helper
              component={Uploader}
              //provide what are the format need to support
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              //if you want multiple file selection make multiple={true} or multiple={false} 
              multiple={true}
              uploaderConfig={this.state.UploaderEsaf}
              //step 4 configure uploaderChecker validation
              validate={[uploadChecker(this.state.UploaderEsaf)]}>
            </Field>
```

##### Step 4: Configure retrieveDefaultFiles helper (at tabComponent) : 
```import { retrieveDefaultFiles} from "../../helpers";```

```
  async componentDidMount() {
    //set initialUploader true
    this.setState(prevState => ({
      UploaderEsafSample: {
       //preveStete.fileUplaoderName
        ...prevState.UploaderEsafSample,
        initialUploadLoader: true
      }
    }));

    //use this helper to retrieve default files
    await retrieveDefaultFiles({
      taskInfo: this.props.taskInfo,
      fileInfo: this.state.UploaderEsafSample,
      fieldPopulator: this.props.fieldPopulator
    });

    //set initialUploadLoader false
    this.setState(prevState => ({
      UploaderEsafSample: {
        //preveStete.fileUplaoderName
        ...prevState.UploaderEsafSample,
        initialUploadLoader: false
      }
    }));
  }
```
    
  
