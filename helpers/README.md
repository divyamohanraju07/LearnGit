## How to use Field Level Validation a8flowform :

### Step 1 : Import Validator.

`import { A8V } from "../../helpers"`

## Supported Field Level Validation List

| Methods                                                | description                         |
| ------------------------------------------------------ | ----------------------------------- |
| A8V.required({errorMsg : "Custom Error Msg"})          | throw if field is empty             |
| A8V.maxLength({errorMsg : "Error Msg", max : number }) | throw if value exceed max number    |
| A8V.minLength({errorMsg : "Error Msg", min : number})  | throw if value less then min number |
| A8V.number({errorMsg : "Error Msg"})                   | throw if field is NAN               |
| A8V.maxValue({errorMsg : "Error Msg", max : number})   | throw if value exceed max number    |
| A8V.minValue({errorMsg : "Error Msg", min : number})   | throw if value less then min number |
| A8V.email({errorMsg : "Error Msg"})                    | throw if not valid email            |

### Step 2 : Apply to Fields like below.

```
                <Field
                    label={"Applicant Id"}
                    name="ApplicationID"
                    component={TextBox}
                    placeholder="Enter Applicant Name"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                       A8V.required({errorMsg: "ApplicantID is required"}),
                       A8V.maxLength({errorMsg:"Custom Error" ,max : 12}),
                    ]}
                  />
```
