import React from "react";
import { Field } from "redux-form";
import { Button } from "antd";
import { TextBox, Select, SelectHelper, DatePicker } from "a8flow-uikit";
import {
  A8V,
  proceedNumber
  //retrieveDefaultFiles
  //InjectedFormProps
} from "../../helpers";

const { Option } = SelectHelper;

export const renderPurchaseBill = ({
  fields,
  meta: { touched, error, submitFailed },
  fieldWatcher
}) => (
    <ul className="col-md-12 expenselist">
      <div className="flex-row">
        <div className="form-group col-xs-6 col-md-4">
          <Button icon="plus" size={"large"} onClick={() => fields.push({})} >
            Add Purchase Bill
          </Button>
        </div>
      </div>

      {fields.map((member, index) => (
        <div key={index} className="flex-row">
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Purchase Bill Month"
              name={`${member}.PurchaseBillMonth`}
              component={DatePicker}
              onChange={fieldWatcher}
              dateFormat="DD-MM-YYYY"
              placeholder="Enter Purchase Bill Month"
              validate={[
                A8V.required({ errorMsg: "Date is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Purchase Bill Type"
              name={`${member}.PurchaseBillType`}
              component={Select}
              onChange={fieldWatcher}
              placeholder="Select Purchase Bill Type"
              className="a8Select"
              validate={[
                A8V.required({ errorMsg: "Purchase Bill Type is required" }),
              ]}
            >
              <Option value="Pukka">Pukka</Option>
              <Option value="Kuccha">Kuccha</Option>
            </Field>
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Purchase Bill Value"}
              name={`${member}.PurchaseBillValue`}
              component={TextBox}
              onChange={fieldWatcher}
              placeholder="Enter Purchase Bill Value"
              normalize={proceedNumber}
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Purchase Bill value is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Purchase Bill Date"
              name={`${member}.PurchaseBillDate`}
              component={DatePicker}
              onChange={fieldWatcher}
              dateFormat="DD-MM-YYYY"
              placeholder="Enter Purchase Bill Date"
              validate={[
                A8V.required({ errorMsg: "Date is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Purchase Margin"}
              name={`${member}.PurchaseMargin`}
              component={TextBox}
              placeholder="Enter Purchase Margin"
              normalize={proceedNumber}
              onChange={fieldWatcher}
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Purchase Margin is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Sales by Month"}
              name={`${member}.SalesByMonth`}
              component={TextBox}
              onChange={fieldWatcher}
              placeholder="Enter Sales By Month"
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Sales by Month is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Average Monthly Sales"}
              name={`${member}.AverageMonthlySales`}
              component={TextBox}
              onChange={fieldWatcher}
              normalize={proceedNumber}
              placeholder="Enter Sales By Month"
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Average Monthly Sales is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <ul className="horizontal-list">
              <li>
                <Button
                  className="activity-list-item"
                  type="danger"
                  onClick={() => fields.remove(index)}
                  // style={{ marginTop: "33px" }}
                  icon="delete"
                  size={"large"}
                />
              </li>
              <li>
                <Button
                  className="activity-list-item"
                  type="danger"
                  onClick={() => fields.push(index)}
                  // style={{ marginTop: "33px" }}
                  icon="plus"
                  size={"large"}
                />
              </li>
            </ul>
          </div>
        </div>
      ))}
    </ul>
  );
