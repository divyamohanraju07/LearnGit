import React, { Component } from "react";
import { TextBox } from "../../helpers";
import { Field } from "redux-form";
class tabTwo extends Component {
  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        />
        <div className="form-section">
          <div className="form-section-head clearfix">
            <h3>SO Process</h3>
            <span className="status-label status-label-pending">Pending</span>
          </div>
          <div className="form-section-content" style={{ display: "block" }}>
            <div className="flex-row">
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={"Sourcing Location"}
                  name="SourcingLocation"
                  component={TextBox}
                  placeholder="Enter Sourcing Location"
                  type="text"
                  hasFeedback
                  className="form-control-custom"
                />
              </div>
              <div className="form-group col-xs-6 col-md-4">
                <Field
                  label={"Extra Field"}
                  name="extraField"
                  component={TextBox}
                  placeholder="Extra Field"
                  type="text"
                  hasFeedback
                  className="form-control-custom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default tabTwo;
