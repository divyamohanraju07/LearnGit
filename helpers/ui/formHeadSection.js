import React from "react";
import { SectionValidator } from "../../helpers";
import classname from "classnames";

export const FormHeadSection = ({
  sectionLabel,
  sectionKey,
  formSyncError,
  sectionValidator,
  initialTab = false
}) => {
  return (
    <div className={classname("form-section-head clearfix", { on: initialTab })}>
      <h3>{sectionLabel}</h3>
      {SectionValidator({
        sectionName: sectionKey,
        formSyncError,
        sectionValidator
      }) ? (
        <span className="status-label status-label-success">Completed</span>
      ) : (
        <span className="status-label status-label-pending">Pending</span>
      )}
    </div>
  );
};
