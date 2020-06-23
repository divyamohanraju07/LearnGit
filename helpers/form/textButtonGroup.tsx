import * as React from "react";
import { Input, Button, Icon, Form } from "antd";

export type textButtonGroupProps = {
  // isButtonLoading: boolean;
  // showSuccesIcon: boolean;
  // buttonLabel: string;
  // showFailureIcon: boolean;
  // onButtonClick: (event: any) => void;
  // input: any;
  // meta: any;
  // label: any;
  // hasFeedback: any;
  // children: any;
};

export interface textButtonGroupState { }

const { Group } = Input;

class textButtonGroup extends React.Component<
  textButtonGroupProps,
  textButtonGroupState
  > {
  state = {};

  renderButtonContent(showSuccesIcon, showFailureIcon, buttonLabel) {
    let button: JSX.Element;

    if (showSuccesIcon) {
      button = (
        <div>
          <Icon
            style={{ fontSize: "20px", float: "left" }}
            type="check-circle"
            theme="twoTone"
            twoToneColor="#52c41a"
          />
          {buttonLabel}
        </div>
      );
    } else if (showFailureIcon) {
      button = (
        <div>
          <Icon
            type="close-circle"
            style={{ fontSize: "20px", float: "left" }}
            theme="twoTone"
            twoToneColor="#cb1e1a"
          />
          {buttonLabel}
        </div>
      );
    } else {
      button = <div>{buttonLabel}</div>;
    }

    return button;
  }

  render() {
    let {
      isButtonLoading,
      buttonLabel,
      showSuccesIcon,
      onButtonClick,
      showFailureIcon,
      label,
      input,
      meta,
      hasFeedback,
      children = null,
      ...rest
    }: any = this.props;

    const { onChange, ...inputs } = input;


    const hasError = meta.touched && meta.invalid;
    return (
      <Form.Item
        label={label ? label : null}
        validateStatus={hasError ? "error" : "success"}
        hasFeedback={hasFeedback && hasError}
        help={hasError && meta.error}
      >
        <Group compact>
          <Input
            style={{ width: "60%" }}
            onChange={onChange}
            children={children}
            {...rest}
            {...inputs}
          />
          <Button
            style={{
              width: "40%",
              height: "50px",
              border: "1px solid #cb1e1a",
              color: "#cb1e1a"
            }}
            onClick={onButtonClick}
            disabled={isButtonLoading || hasError}
          >
            {isButtonLoading ? (
              <Icon type="loading" spin />
            ) : (
                this.renderButtonContent(showSuccesIcon, showFailureIcon, buttonLabel)
              )}
          </Button>
        </Group>
      </Form.Item>
    );
  }
}

export default textButtonGroup;
