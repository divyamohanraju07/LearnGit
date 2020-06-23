import * as React from "react";
import { TextBox, Select, SelectHelper } from "a8flow-uikit";
import {
  Field,
  getFormValues,
  InjectedFormProps,
  reduxForm,
  SubmissionError
} from "redux-form";
import { connect } from "react-redux";
import { Form, Button } from "antd";
import { Config } from "../../helpers";

type Props = {
  env: any;
  ipc: any;
  formValues: any;
  taskInfo: any;
} & InjectedFormProps;

type State = {};

const { Option } = SelectHelper;

class SampleFormStartProcess extends React.Component<Props, State> {
  state = {};

  componentDidMount = () => {
    window.addEventListener("message", this.formPMListener);
  };

  // DO NOT MODIFY THIS CODE
  formPMListener = (e: any) => {
    try {
      let { data } = e;

      if (data.formAction) {
        if (data.formAction === "getStartProcessVariables") {
          //perform submit action
          this.props.handleSubmit(this.handleForm)();
        }
        // }
      }
    } catch (error) {
      throw error;
    }
  };

  handleForm = (values: any) => {
    try {
      if (this.props.env === "OUTSIDE") {
        //filter the variables based on camunda submit endpoint accepted format
        let variables: any = {};
        Object.keys(values).forEach(item => {
          variables[item] = { value: values[item] };
        });
      } else if (this.props.ipc) {
        //filter the variables based on camunda submit endpoint accepted format
        let variables: any = {};
        Object.keys(values).forEach(item => {
          if (values[item] && values[item].type === "file") {
            values[item].values.forEach((data: any) => {
              let { variableName, result, File } = data;
              if (!variableName) {
                throw new SubmissionError({
                  [item]: "Variable Name Not found one of your file",
                  _error: `Variable Name not found @${item} File`
                });
              }
              variables[variableName] = {
                value: result.split("base64,")[1],
                type: "File",
                valueInfo: {
                  filename: File.name,
                  mimetype: File.type
                }
              };
            });
          } else {
            variables[item] = { value: values[item] };
          }
        });
        console.count("how many time i am triggering from handleForm");

        this.props.ipc.source.postMessage(
          { action: "fromStartProcessIframeForm", values: { variables } },
          Config.targetOrigin
        );
      } else {
        throw new Error(
          "a8FlowFormError : $a8ipc(Inter Process Communication) Not Found"
        );
      }
    } catch (error) {
      throw error;
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("message", this.formPMListener);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div
        className="card-item-details-content-in"
        style={{ backgroundColor: "white" }}
      >
        <Form
          layout={"vertical"}
          className="login-form"
          onSubmit={handleSubmit(this.handleForm)}
        >
          <div className="form-group">
            <Field
              label={"Applicatino ID"}
              name={"ApplicationID"}
              component={TextBox}
              placeholder="Application ID"
              type="text/number/password"
              hasFeedback // optional
              onChange={() => { }} // optional
            />
          </div>

          <div className="form-group">
            <Field
              label={"Invoice Category"}
              name={"invoiceCategory"}
              component={Select}
              placeholder="Invoice Category"
              //This class is must
              className={"a8Select"}
            >
              <Option value="1">Option One</Option>
              <Option value="2">Option Two</Option>
              <Option value="3">Option Three</Option>
            </Field>
          </div>

          <div className="form-group">
            <Field
              label={"Amount"}
              name={"amount"}
              component={TextBox}
              placeholder="Amount"
              type="text"
              hasFeedback // optional
              onChange={() => { }} // optional
            />
          </div>
          {this.props.env === "OUTSIDE" && (
            <div style={{ width: "20%", marginTop: "16px" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="button button-primary"
                style={{ marginTop: "9px" }}
              // disabled={invalid || pristine || submitting}
              // loading={this.state.btnLoading}
              >
                Submit
              </Button>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

//combine redux-form and component
let SampleFormStartProcessReduxFormWrapper = reduxForm({
  //pass your form key
  form: "sampleFormStartProcess"
})(SampleFormStartProcess);

const mapStateToProps = (state, props) => {
  return {
    //this below prop have current form values when you consume
    formValues: getFormValues("sampleFormStartProcess")(state)
  };
};

export default connect(
  mapStateToProps,
)(SampleFormStartProcessReduxFormWrapper);

// export default SampleFormStartProcess;
