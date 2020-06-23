import React from "react";
import { Field } from "redux-form";
import { Button } from "antd";
import { Select, SelectHelper, TextBox } from "a8flow-uikit";
import {
  A8V
  //retrieveDefaultFiles
  //InjectedFormProps
} from "../../helpers";
// import validate from "validate.js";

const { Option } = SelectHelper;

export const renderExpenseMembers = ({
  fields,
  meta: { touched, error, submitFailed },
  fieldWatcher
}) => (
    <ul className="col-md-12 expenselist">
      <div className="flex-row">
        <div className="form-group col-xs-4 col-md-4">
          <Button icon="plus" size={"large"} onClick={() => fields.push({})} >
            Add Expense
          </Button>
        </div>
      </div>

      {fields.map((member, index) => {
        return (<div key={index} className="flex-row">
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Expense Type"}
              name={`${member}.ExtraExpense`}
              component={Select}
              placeholder="Select ExtraOrdinary Expense"
              className="a8Select"
              validate={[
                A8V.required({ errorMsg: "ExtraOrdinaryExpense is required" })
              ]}
            >
              <Option value="Child Education"> Child Education </Option>
              <Option value="Medical Expense"> Medical Expense </Option>
              <Option value="Rent"> Rent </Option>
              <Option value="Habitual Expense"> Habitual Expense </Option>
              <Option value="Others"> Others </Option>
            </Field>
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Expense Value"}
              name={`${member}.ExpenseValue`}
              component={TextBox}
              onChange={(value) => fieldWatcher(value, index)}
              placeholder="Enter Expense Value"
              type="text"
              hasFeedback
              className="form-control-custom"
              validate={[A8V.required({ errorMsg: "Expense Value is required" })]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <ul className="horizontal-list">
              <li>
                <Button
                  className="activity-list-item"
                  type="danger"
                  onClick={() => fields.remove(index)}
                  icon="delete"
                  size={"large"}
                />
              </li>
              <li>
                <Button
                  className="activity-list-item"
                  type="danger"
                  onClick={() => fields.push(index)}
                  icon="plus"
                  size={"large"}
                />
              </li>
            </ul>
          </div>
        </div>
        )
      })}
    </ul>
  );
