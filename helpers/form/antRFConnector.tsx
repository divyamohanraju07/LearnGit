import * as React from "react";
import {
  Form,
  Input,
  Select as antdSelect,
  Radio as antdRadio,
  Switch as antdSwitch,
  DatePicker,
  Cascader,
  Checkbox as antCheckBox
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import validate from "validate.js";
interface ElementProps {
  input: any;
  meta: { touched: boolean; invalid: boolean; error: boolean };
  children: any;
  formItemStyle: object;
  formItemLayout: object;
  label: any;
  hasFeedback: boolean;
  colon: boolean;
  inputRef?: (value: string) => void;
  onInputBlur: (value: any) => void
}

export const RenderField = (Component: any, cType = "text") => ({
  input,
  meta,
  children = null,
  formItemStyle = {},
  formItemLayout = {},
  hasFeedback,
  label,
  colon = false,
  inputRef = () => null,
  onInputBlur,
  ...rest
}: ElementProps) => {
  const hasError = meta.touched && meta.invalid;
  const { value, onBlur, } = input;
  let valueProp = {};
  if (cType === "checkBox" || cType === "switch") {
    valueProp["checked"] = value ? value.value : undefined;
  } else {
    valueProp[value] = value ? value.value : undefined;
  }

  return (
    <Form.Item
      {...formItemLayout}
      label={label}
      validateStatus={hasError ? "error" : "success"}
      hasFeedback={hasFeedback && hasError}
      help={hasError && meta.error}
      style={{ ...formItemStyle }}
      colon={colon}
    >
      <Component
        {...valueProp}
        value={value ? value.value : undefined}
        onChange={fieldValue => {
          let processVariableStructure = {};
          if (cType === "checkBox") {
            processVariableStructure = {
              type: value.type ? value.type : "Boolean",
              value: fieldValue.target.checked,
              valueInfo: validate.isEmpty(value.valueInfo)
                ? {}
                : value.valueInfo
            };
          } else if (cType === "switch") {
            processVariableStructure = {
              type: value.type ? value.type : "Boolean",
              value: fieldValue,
              valueInfo: validate.isEmpty(value.valueInfo)
                ? {}
                : value.valueInfo
            };
          } else if (cType === "select") {
            processVariableStructure = {
              type: value.type ? value.type : "String",
              value: fieldValue,
              valueInfo: !validate.isEmpty(value.valueInfo)
                ? value.valueInfo
                : {}
            };
          } else {
            processVariableStructure = {
              type: value.type ? value.type : "String",
              value: fieldValue.target.value,
              valueInfo: !validate.isEmpty(value.valueInfo)
                ? value.valueInfo
                : {}
            };
          }
          // onChange(processVariableStructure);
          onBlur(processVariableStructure);
        }}
        onBlur={(fieldValue) => onInputBlur && onInputBlur(fieldValue)}
        // {...filteredInput}
        {...rest}
        children={children}
        ref={(refValue) => inputRef && inputRef(refValue)}
      />
    </Form.Item>
  );
};

export const CascaderHelper = props => {
  const {
    input,
    cascaderProps,
    formItemStyle,
    meta,
    label = null,
    hasFeedback
  } = props;
  const hasError = meta.dirty && meta.invalid;
  return (
    <Form.Item
      label={label ? label : null}
      validateStatus={hasError ? "error" : "success"}
      hasFeedback={hasFeedback && hasError}
      help={hasError && meta.error}
      style={{ ...formItemStyle }}
    >
      <Cascader
        value={input.value ? input.value : undefined}
        onChange={input.onChange}
        {...cascaderProps}
      />
    </Form.Item>
  );
};

export const DatePickerHelper = (props: any): any => {
  const {
    input,
    datePickerProps,
    formItemStyle,
    meta,
    label = null,
    hasFeedback,
    colon = false,
    dateFormat = "YYYY-MM-DD",
    ...extra
  } = props;
  // const hasError = meta.dirty && meta.invalid;
  const hasError = meta.touched && meta.invalid;
  // const hasError = true;
  const { value, onChange } = input;
  return (
    <Form.Item
      label={label ? label : null}
      validateStatus={hasError ? "error" : "success"}
      hasFeedback={hasFeedback && hasError}
      help={hasError && meta.error}
      style={{ ...formItemStyle }}
      colon={colon}
    >
      <DatePicker
        className="a8DatePicker"
        value={value ? moment(value.value) : null}
        onChange={date => {
          let processVariableStructure = {
            type: value.type ? value.type : "Date",
            value: date.format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
            valueInfo: !validate.isEmpty(value.valueInfo) ? value.valueInfo : {}
          };
          onChange(processVariableStructure);
        }}
        format={dateFormat}
        // {...filteredInput}
        {...extra}
      />
    </Form.Item>
  );
};

// export const DatePickerHelper = props => {
//   const {
//     input,
//     datePickerProps,
//     formItemStyle,
//     meta,
//     label = null,
//     hasFeedback,
//     ...extra
//   } = props;
//   const hasError = meta.dirty && meta.invalid;
//   const { value, onChange, ...filteredInput } = input;
//   return (
//     <Form.Item
//       label={label ? label : null}
//       validateStatus={hasError ? "error" : "success"}
//       hasFeedback={hasFeedback && hasError}
//       help={hasError && meta.error}
//       style={{ ...formItemStyle }}
//     >
//       <DatePicker
//         value={value ? moment(value) : null}
//         onChange={onChange}
//         {...filteredInput}
//         {...extra}
//       />
//     </Form.Item>
//   );
// };

//connect antd element with redux-form
export const TextBox = RenderField(Input);

//password field
export const Password = RenderField(Input.Password);

//conenct antd element with redux-form
export const TextAreaHelper = RenderField(Input.TextArea);

//select component
export const SelectHelper = RenderField(antdSelect, "select");

//select option helper
// export const SelectHelper = antdSelect;

//Radio.Group Wrapper
export const RadioWrapper = RenderField(antdRadio.Group);

//export radioHelpers
export const Radio = antdRadio;

//Upload wrapper with redux-form
// export const UploadHelper = RenderField(Upload);

//Switch wrapper
export const Switch = RenderField(antdSwitch, "switch");

//checkbox connector
export const Checkbox = RenderField(antCheckBox, "checkBox");

//Option Helper for Select Widget
export const Option = antdSelect.Option;
