import * as React from "react";
import config from "./soProcessExistingTabInfo";
import Validator from "./soProcessExistingValidator";
import { Form, Button } from "antd";
import {
  reduxForm,
  getFormValues,
  SubmissionError,
  isValid
  // InjectedFormProps
} from "redux-form";
import { connect } from "react-redux";
import { extractInitialValues, Config, formatValues } from "../../helpers";
// import Validate from "validate.js";
// import { Env } from "../../types";

// type Props = {
//   env: any;
//   ipc: any;
//   formValues: any;
//   taskInfo: any;
// } & InjectedFormProps;

// type State = {
//   activeTab: string;
// };

//Tab Components
import TabSoProcessExisitng from "./tabSoProcessExisting";
import TabCoApplicant1 from "./tabcoApplicant1";
import TabCoApplicant2 from "./tabcoApplicant2";
import TabCoApplicant3 from "./tabcoApplicant3";
import TabCoApplicant4 from "./tabcoApplicant4";
import TabGuarantor1 from "./tabGuarantor1";
import TabGuarantor2 from "./tabGuarantor2";
import loggingSave from "../../helpers/loggingConfig/loggingInSave";

class SoExisting extends React.Component {
  state = {
    activeTab: config.activeTab
  };

  componentDidMount = () => {
    window.addEventListener("message", this.formPMListener);
    this.handleFormWatcher();
  };

  handleFormWatcher = () => {
    // add formListener
    this.formWatcher = setInterval(() => {
      if (this.props.ipc) {
        this.props.ipc.source.postMessage(
          {
            action: "handleStaticFormState",
            formState: this.props.isFormValid
          },
          Config.targetOrigin
        );
      }
    }, 1000);
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
              Config.targetOrigin
            );
          }
        } else if (data.formAction === "updateStreamValue") {
          let {
            variableValueInfo,
            variableNameInfo: { variableName }
          } = data.streamData;
          this.props.change(variableName, variableValueInfo);
          // if (variableValueInfo.type === "File") {
          //   this.props.change(variableName, variableValueInfo);
          // } else {
          //   this.props.change(variableName, variableValueInfo);
          // }
        }
        // }
      }
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
          // variables[item] = values[item];
        });
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
          }
          // else if (item.toLowerCase().indexOf("tempa8var") !== -1) { }
          else {
            // variables[item] = { value: values[item] };
            //format the field array variables to the default format.
            if (item === "members") {
              variables[item] = { type: "String", value: JSON.stringify(values[item]) };
            } else {
              variables[item] = values[item];
            }
          }
        });
        this.props.ipc.source.postMessage(
          { action: "onCompleteClick", values: { variables } },
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
          {this.state.activeTab === "tabSoProcessExisting" && (
            <TabSoProcessExisitng
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicant1" && (
            <TabCoApplicant1
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicant2" && (
            <TabCoApplicant2
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicant3" && (
            <TabCoApplicant3
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicant4" && (
            <TabCoApplicant4
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabGuarantor1" && (
            <TabGuarantor1
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabGuarantor2" && (
            <TabGuarantor2
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
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
let SoExistingReduxFormWrapper = reduxForm({
  //pass your form key
  form: "soProcessExisting",
  validate: Validator,
  enableReinitialize: true,
  destroyOnUnmount: false
})(SoExisting);

const mapStateToProps = (state, props) => {
  return {
    /**
     * extraceInitialValues function helper extract
     * -the task variables and give the formate what initialValues understant
     * Note : initialValues is redux-form helper to set initialvalue for form fields
     * initialValues only accept {formKey : values, formKey : values } object format
     */
    initialValues: {
      ...extractInitialValues(props.taskInfo.info.taskVariables)
    },
    isFormValid: isValid("soProcessExisting")(state),

    //this below prop have current form values when you consume
    formValues: getFormValues("soProcessExisting")(state)
  };
};

export default connect(
  mapStateToProps,
)(SoExistingReduxFormWrapper);
