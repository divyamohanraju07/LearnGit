import React from "react";
import { Field } from "redux-form";
import { Button } from "antd";
import { TextBox, DatePicker, Select, SelectHelper } from "a8flow-uikit";
import {
  A8V,
  proceedNumber
  //retrieveDefaultFiles
  //InjectedFormProps
} from "../../helpers";

const { Option } = SelectHelper;

export const renderSalesBill = ({
  fields,
  meta: { touched, error, submitFailed },
  fieldWatcher
}) => (
    <ul className="col-md-12 expenselist">
      <div className="flex-row">
        <div className="form-group col-xs-4 col-md-4">
          <Button icon="plus" size={"large"} onClick={() => fields.push({})} >
            Add Sales Bill
          </Button>
        </div>
      </div>

      {fields.map((member, index) => (
        <div key={index} className="flex-row">
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Sale Bill Month"
              name={`${member}.SaleBillMonth`}
              component={DatePicker}
              onChange={fieldWatcher}
              dateFormat="DD-MM-YYYY"
              placeholder="Enter Sale Bill Month"
              validate={[
                A8V.required({ errorMsg: "Sale Bill Month is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Sale Bill Type"
              name={`${member}.SaleBillType`}
              component={Select}
              onChange={fieldWatcher}
              placeholder="Select Sale Bill Type"
              className="a8Select"
              // onChange={this.handleGSTFilingApproach}
              validate={[
                A8V.required({ errorMsg: "Sale Bill Type is required" }),
              ]}
            >
              <Option value="Pukka">Pukka</Option>
              <Option value="Kuccha">Kuccha</Option>
            </Field>
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Sale Bill Value"}
              name={`${member}.SaleBillValue`}
              component={TextBox}
              onChange={fieldWatcher}
              normalize={proceedNumber}
              placeholder="Enter Sale Bill Value"
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Sales Bill Value is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label="Sale Bill Date"
              name={`${member}.SaleBillDate`}
              component={DatePicker}
              onChange={fieldWatcher}
              dateFormat="DD-MM-YYYY"
              placeholder="Enter Sale Bill Date"
              validate={[
                A8V.required({ errorMsg: "Date is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Sales By Month"}
              name={`${member}.SalesByMonthSaleBill`}
              component={TextBox}
              onChange={fieldWatcher}
              normalize={proceedNumber}
              placeholder="Enter Sale Bill Month"
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Sale Bill Month is required" }),
              ]}
            />
          </div>
          <div className="form-group col-xs-6 col-md-4">
            <Field
              label={"Average Monthly Sales"}
              name={`${member}.AverageMonthlySalesSaleBill`}
              component={TextBox}
              normalize={proceedNumber}
              onChange={fieldWatcher}
              placeholder="Enter Sale Bill Month"
              type="text"
              hasFeedback
              className="form-control-coustom"
              validate={[
                A8V.required({ errorMsg: "Sale Bill Month is required" }),
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
