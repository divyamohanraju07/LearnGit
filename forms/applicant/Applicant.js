import React, { Component } from "react";
import config from "./applicantTabInfo";
import Validator from "./applicantValidator";
import { Form, Button } from "antd";
import { reduxForm, submit, getFormValues, SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { extractInitialValues, formatValues } from "../../helpers";
import Validate from "validate.js";

//Tab Components
import TabOne from "./tabOne";
import TabTwo from "./tabTwo";
import TabLeadDetails from "./../lead/tabLeadDetails";
import loggingSave from "../../helpers/loggingConfig/loggingInSave";

class Applicant extends Component {
  state = {
    activeTab: config.activeTab,
    taskInfo: null
  };

  componentDidMount = () => {
    window.addEventListener("message", this.formPMListener);
  };

  // DO NOT MODIFY THIS CODE
  formPMListener = e => {
    try {
      let { data } = e;
      if (data.activeTab) {
        this.setState({
          activeTab: data.activeTab
        });
      } else if (data.formAction) {
        if (data.formAction === "submit") {
          //perform submit action
          this.props.handleSubmit(this.handleForm)();
        } else if (data.formAction === "reset") {
          //reset the form a8flow web
          this.props.reset();
        } else if (data.formAction === "save") {
          if (this.props.ipc) {
            let message = JSON.stringify({
              ...formatValues(this.props.formValues).variables
            });
            loggingSave(this.props.taskInfo.info, message);

            this.props.ipc.source.postMessage(
              {
                action: "onSaveClick",
                values: { ...formatValues(this.props.formValues).variables }
              },
              "*"
            );
          }
        }
      } else if (!Validate.isEmpty(data.taskInfo)) {
        this.setState({
          taskInfo: data.taskInfo
        });
      }
      // }
    } catch (error) {
      throw error;
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("message", this.formPMListener);
  };

  handleForm = values => {
    try {
      if (this.props.env === "OUTSIDE") {
        //filter the variables based on camunda submit endpoint accepted format
        let variables = {};
        Object.keys(values).forEach(item => {
          variables[item] = { value: values[item] };
        });
        console.log("Valuse from complete @outside environment");
        console.log(variables);
      } else if (this.props.ipc) {
        //filter the variables based on camunda submit endpoint accepted format
        let variables = {};
        Object.keys(values).forEach(item => {
          if (values[item] && values[item].type === "file") {
            values[item].values.forEach(data => {
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
        this.props.ipc.source.postMessage(
          { action: "onCompleteClick", values: { variables } },
          "*"
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

  render() {
    /**
     * This below extraction are form handling available hooks
     * use it when ever necessery ...
     * hooks are available by this.props.HOOKNAME
     */
    const { handleSubmit } = this.props;
    return (
      <React.Fragment>
        <Form
          layout={"vertical"}
          className="login-form"
          onSubmit={handleSubmit(this.handleForm)}
        >
          {this.state.activeTab === "tabOne" && (
            <TabOne
              fieldPopulator={this.props.change}
              errorThrower={this.runTimeErrorThrower}
            />
          )}
          {this.state.activeTab === "tabTwo" && (
            <TabTwo
              fieldPopulator={this.props.change}
              errorThrower={this.runTimeErrorThrower}
            />
          )}

          {this.state.activeTab === "tabLeadDetails" && (
            <TabLeadDetails
              fieldPopulator={this.props.change}
              errorThrower={this.runTimeErrorThrower}
              moduleName={"applicant"}
            />
          )}
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
      </React.Fragment>
    );
  }
}

//combine redux-form and component
Applicant = reduxForm({
  //pass your form key
  form: "applicant",
  validate: Validator,
  enableReinitialize: true,
  destroyOnUnmount: false
})(Applicant);

const mapStateToProps = (state, props) => {
  return {
    /**
     * extraceInitialValues function helper extract
     * -the task variables and give the formate what initialValues understant
     * Note : initialValues is redux-form helper to set initialvalue for form fields
     * initialValues only accept {formKey : values, formKey : values } object format
     */
    initialValues: {
      ...extractInitialValues(props.taskInfo.info.taskVariables),
      // "ApplicationID" : "sa",
      selectWidget: null
      //add custom fields initial values
      // extraField: "value"
      // uploader
    },

    //this below prop have current form values when you consume
    formValues: getFormValues("applicant")(state)
  };
};

export default connect(
  mapStateToProps,
  { submit }
)(Applicant);
