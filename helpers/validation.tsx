import Validate from "validate.js";

const required = ({ errorMsg }) => value => {
  return (value && !Validate.isEmpty(value.value)) || typeof value === "number"
    ? undefined
    : errorMsg
      ? errorMsg
      : `Required`;
};

const maxLength = ({
  errorMsg = "",
  max
}: {
  errorMsg?: string;
  max: number;
}) => value =>
    value && value.value.length > max
      ? errorMsg
        ? errorMsg
        : `Must be ${max} characters or less`
      : undefined;

const minLength = ({
  errorMsg = "",
  min
}: {
  errorMsg?: string;
  min: number;
}) => value =>
    value && value.value.length < min
      ? errorMsg
        ? errorMsg
        : `Must be ${min} characters or more`
      : undefined;

const number = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && isNaN(Number(value.value))
    ? errorMsg
      ? errorMsg
      : "Must be a number"
    : undefined;

const minValue = ({
  errorMsg = "",
  min
}: {
  errorMsg?: string;
  min: number;
}) => value =>
    value && parseInt(value.value) < min
      ? errorMsg
        ? errorMsg
        : `Must be at least ${min}`
      : undefined;

const maxValue = ({
  errorMsg = "",
  max
}: {
  errorMsg?: string;
  max: number;
}) => value =>
    value && parseInt(value.value) > max
      ? errorMsg
        ? errorMsg
        : `Must be lower than ${max}`
      : undefined;

const email = ({ errorMsg = "" }: { errorMsg?: string }) => (value: any) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.value)
    ? errorMsg
      ? errorMsg
      : "Invalid email address"
    : undefined;

const text = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/^([a-z]+\s)*[a-z]*$/i.test(value.value)
    ? errorMsg ? errorMsg : "Only string allowed" : undefined;

const address = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/^[a-zA-Z0-9\s,'-/]*$/.test(value.value)
    ? errorMsg ? errorMsg : "Invalid address Line" : undefined

const alphaNumeric = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/^[a-zA-Z0-9]{3,20}/i.test(value.value)
    ? errorMsg ? errorMsg : "Invalid Entry" : undefined

const pan = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/^([a - zA - Z]){ 5 } ([0 - 9]){ 4 } ([a - zA - Z]){ 1 }?$/i.test(value.value)
    ? errorMsg ? errorMsg : "Invalid Entry" : undefined

const passport = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/^(?!^0+$)[a-zA-Z0-9]{3,20}$/i.test(value.value)
    ? errorMsg ? errorMsg : "Invalid Entry" : undefined

const voter = ({ errorMsg }: { errorMsg?: string }) => (value: any) =>
  value && !/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(value.value)
    ? errorMsg ? errorMsg : "Invalid Entry" : undefined

const uniqueMobileNumber = ({ errorMsg, mobile }) => (value) => {
  return value && !mobile.includes(value.value)
    ? undefined
    : errorMsg
      ? errorMsg
      : `Mobile Number should be unique`;
};
// const uniqueMobileNumber = ({ errorMsg, mobile }) => (variable) => {
//   console.log("uniqueVariable...>>", variable, mobile, errorMsg)
//   if (Validate.isEmpty(variable)) {
//     return undefined;
//   } else {
//     if (Validate.isEmpty(variable.value)) {
//       return undefined;
//     }
//     else if (mobile.filter(x => x === variable.value).length > 0) {
//       return errorMsg
//         ? errorMsg
//         : `Mobile Number should be unique`;
//     } else {
//       return undefined;
//     }
//   }
// }




export default {
  required,
  maxLength,
  minLength,
  number,
  minValue,
  maxValue,
  email,
  text,
  address,
  alphaNumeric,
  pan,
  passport,
  voter,
  uniqueMobileNumber
};
