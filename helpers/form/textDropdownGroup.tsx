import * as React from "react";
import { Select, Form, Input } from "antd";
import validate from "validate.js";

const { Option } = Select;

export interface textDropdownGroupState { }
export type textDropdownGroupProps = {
  input: any;
  dropdownValues: string[];
  defaultSelectedValue?: String;
  fieldPopulator: any;
  InputValue: String;
};

class textDropdownGroup extends React.Component<
  textDropdownGroupProps,
  textDropdownGroupState
  > {
  state = {
    input: "",
    selectedInput: this.props.defaultSelectedValue
      ? this.props.defaultSelectedValue
      : ""
  };

  handleChange = (event: any) => {
    let { value } = this.props.input;
    this.setState({ input: event.target.value }, () => {
      let addedvalue = this.state.input + this.state.selectedInput;
      let processVariableStructure = {
        type: value.type ? value.type : "String",
        value: addedvalue,
        valueInfo: validate.isEmpty(value.valueInfo) ? value.valueInfo : {},
        inputValue: this.state.input
      };
      this.props.input.onChange(processVariableStructure);
    });
    this.props.fieldPopulator("tenureInput", { type: "String", value: event.target.value })
  };
  handleSelected = value => {
    this.setState({ selectedInput: value }, () => {
      let addedvalue = this.state.input + this.state.selectedInput;
      let processVariableStructure = {
        type: value.type ? value.type : "String",
        value: addedvalue,
        valueInfo: validate.isEmpty(value.valueInfo) ? value.valueInfo : {}
      };
      this.props.input.onChange(processVariableStructure);
    });
    this.props.fieldPopulator("tenureSelect", { type: "String", value: value })
  };

  render() {
    let {
      label,
      input,
      meta,
      onselection,
      hasFeedback,
      placeholder,
      children = null,
      defaultSelectedValue,
      dropdownValues = [],
      className,
      InputValue,
      ...rest
    }: any = this.props;
    // const { onChange, ...inputs } = input;
    const hasError = meta.touched && meta.invalid;

    return (
      <Form.Item
        label={label ? label : null}
        validateStatus={hasError ? "error" : "success"}
        hasFeedback={hasFeedback && hasError}
        help={hasError && meta.error}
      >
        <div style={{ display: "flex" }}>
          <Input.Group compact>
            <Input
              style={{ width: "146px" }}
              onChange={this.handleChange}
              placeholder={placeholder}
              children={children}
              value={InputValue ? InputValue : null}

              className
              {...rest}
            />
            <Select
              defaultValue={defaultSelectedValue}
              className="a8Select"
              onChange={this.handleSelected}
              children={children}
              {...rest}
            >
              {dropdownValues.map((value: string) => (
                <Option key={value} value={value}>{value}</Option>
              ))}
            </Select>
          </Input.Group>
        </div>
      </Form.Item>
    );
  }
}

export default textDropdownGroup;