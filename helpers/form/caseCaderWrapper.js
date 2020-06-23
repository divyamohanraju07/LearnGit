import * as React from 'react';
import Cascader from 'antd/lib/cascader';
import { Form } from "antd";

export function renderCascader(props) {
    const { input, cascaderProps, formItemStyle, meta, label, hasFeedback } = props;
    const hasError = meta.touched && meta.invalid;
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
}

