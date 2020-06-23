import * as React from "react";
import config from "./soProcessNewTabInfo";
import Validator from "./soProcessNewValidator";
import { Form, Button } from "antd";
import {
  reduxForm,
  submit,
  getFormValues,
  SubmissionError,
  isValid
} from "redux-form";
import { connect } from "react-redux";
import {
  // extractInitialValues,
  Config,
  formatValues,
  getGoogleCloudLink
} from "../../helpers";
//import Validate from "validate.js";

//Tab Components
import TabApplicantNew from "./tabApplicantNew";
import TabCoApplicantNew1 from "./tabcoApplicantNew1";
import TabCoApplicantNew2 from "./tabcoApplicantNew2";
import TabCoApplicantNew3 from "./tabcoApplicantNew3";
import TabCoApplicantNew4 from "./tabcoApplicantNew4";
import TabGuarantorNew1 from "./tabGuarantorNew1";
import TabGuarantorNew2 from "./tabGuarantorNew2";
import loggingSave from "../../helpers/loggingConfig/loggingInSave";
class SoNew extends React.Component {
  state = {
    activeTab: config.activeTab
    //taskInfo: null
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

  //Do not modify this code
  // GIVE TYPESCRIPT TO e as any
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
        }
      }
    } catch (error) {
      throw error;
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("message", this.formPMListener);
  };
  // GIVE TYPESCRIPT TO VALUE as any
  handleForm = async values => {
    try {
      if (this.props.env === "OUTSIDE") {
        //filter the variables based on camunda submit endpoint accepted
        // GIVE TYPESCRIPT TO variables as any
        let variables = {};
        Object.keys(values).forEach(item => {
          variables[item] = { value: values[item] };
        });
      } else if (this.props.ipc) {
        //filter the variables based on camunda submit endpoint accepted format
        // GIVE TYPESCRIPT TO variables as any
        let variables = {};
        const data = Object.keys(values);
        for (var i = 0; i < data.length;) {
          const item = data[i];
          variables = await this.updatedata(item, variables, values);
          i++;
        }
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

  async updatedata(item, variables, values) {
    if (values[item] && values[item].type === "file") {
      // GIVE TYPESCRIPT TO data as any
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
      if (
        item === "members" ||
        item === "c1members" ||
        item === "c2members" ||
        item === "c3members" ||
        item === "c4members" ||
        item === "g1members" ||
        item === "g2members"
      ) {
        variables[item] = {
          type: "String",
          value: JSON.stringify(values[item].value)
        };
      } else if (
        values[item] &&
        values[item].type === "File" &&
        values[item] &&
        values[item].value !== null
      ) {
        variables[item] = {
          ...values[item],
          value: values[item].value.split("base64,")[1]
        };
      } else if (
        (values[item] && values[item].type === "File") ||
        (values[item] && values[item].value === null) ||
        (values[item] && values[item].value === {})
      ) {
        console.log("Inside file");
      } else if (
        (item === "HighMarkData" && typeof values[item].value === "object") ||
        (item === "c1HighMarkData" && typeof values[item].value === "object") ||
        (item === "c2HighMarkData" && typeof values[item].value === "object") ||
        (item === "c3HighMarkData" && typeof values[item].value === "object") ||
        (item === "c4HighMarkData" && typeof values[item].value === "object")
      ) {
        const cloudUrl = await getGoogleCloudLink(
          values[item].value,
          this.props.taskInfo.info
        );
        variables[item] = {
          type: "string",
          value: cloudUrl,
          valueInfo: {}
        };
      } else {
        variables[item] = values[item];
      }
    }
    return variables;
  }

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
          {this.state.activeTab === "tabApplicantNew" && (
            <TabApplicantNew
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicantNew1" && (
            <TabCoApplicantNew1
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicantNew2" && (
            <TabCoApplicantNew2
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicantNew3" && (
            <TabCoApplicantNew3
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabcoApplicantNew4" && (
            <TabCoApplicantNew4
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabGuarantorNew1" && (
            <TabGuarantorNew1
              fieldPopulator={this.props.change}
              taskInfo={this.props.taskInfo}
              ipc={this.props.ipc}
            />
          )}
          {this.state.activeTab === "tabGuarantorNew2" && (
            <TabGuarantorNew2
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
let SoNewReduxFormWrapper = reduxForm({
  //pass your form key
  form: "soProcessNew",
  validate: Validator,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(SoNew);

const extractTaskVariables = taskVariables => {
  let updatedTaskVariables = {};
  for (const item in taskVariables) {
    if (taskVariables.hasOwnProperty(item)) {
      const element = taskVariables[item];
      if (
        item === "members" ||
        item === "c1members" ||
        item === "c2members" ||
        item === "c3members" ||
        item === "c4members" ||
        item === "g1members" ||
        item === "g2members"
      ) {
        updatedTaskVariables[item] = {
          ...element,
          value:
            typeof element.value === "string"
              ? JSON.parse(element.value)
              : element.value
        };
      } else {
        updatedTaskVariables[item] = element;
      }
    }
  }

  return updatedTaskVariables;
};

const mapStateToProps = (state, props) => {
  return {
    /**
     * extraceInitialValues function helper extract
     * -the task variables and give the formate what initialValues understant
     * Note : initialValues is redux-form helper to set initialvalue for form fields
     * initialValues only accept {formKey : values, formKey : values } object format
     */
    initialValues: {
      ...extractTaskVariables(props.taskInfo.info.taskVariables)
    },
    isFormValid: isValid("soProcessNew")(state),

    //this below prop have current form values when you consume
    formValues: getFormValues("soProcessNew")(state)
  };
};

export default connect(
  mapStateToProps,
  { submit }
)(SoNewReduxFormWrapper);
