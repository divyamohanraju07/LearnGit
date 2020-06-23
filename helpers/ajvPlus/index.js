import Ajv from "ajv";
import ajvErrors from "ajv-errors";
let Validator = ajvErrors(new Ajv({ allErrors: true, jsonPointers: true }))
export const ajv = Validator; 