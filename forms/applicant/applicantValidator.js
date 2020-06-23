import Validate from "validate.js";
/**
 * This function execute each time the form fields change
 * values contain all the fields and values
 * you can check the fields by values.fieldName
 */
export default values => {
  // errors object responsible for handling all errors info and return to redux-form
    
  const errors = {};
  if (Validate.isEmpty(values.ApplicationID)) {
    errors.ApplicationID = "ApplicationId is Required";
  }

  if (!values.BranchID) {
    errors.BranchID = "Branch Id is Required";
  }
  if (!values.BranchName) {
    errors.BranchName = "Branch Name is required";
  }
  if (!values.officerName) {
    errors.officerName = "Officer Name is required";
  }
  if (!values.sourcingLocation) {
    errors.sourcingLocation = "Sourcing Location is required";
  }
  if (!values.date) {
    errors.date = "Date is required";
  }
  if (!values.applicationType) {
    errors.applicationType = "Application Type is required";
  }
  if (!values.leadSource) {
    errors.leadSource = "Lead Source is required";
  }
  if (
    values.leadSource === "Direct Lead" ||
    values.leadSource === "Website Lead"
  ) {
    if (!values.referralName) {
      errors.referralName = "Referral Name is required";
    }
    if (!values.referralNumber) {
      errors.referralNumber = "Referral Number is required";
    }
  }

  if (!values.referralCode) {
    errors.referralCode = "Referral Code is required";
  }
  if (!values.borrowerName) {
    errors.borrowerName = "Borrower Name is required";
  }
  if (!values.borrowerMobile) {
    errors.borrowerMobile = "Borrower Mobile is required";
  }
  if (Validate.isEmpty(values.UploaderEsaf)) {
    errors.UploaderEsaf = "File Upload is  is Required";
  }
  return errors;
};
