import Validate from "validate.js";
import uuid from "uuid";
import Axiosplus from "./axiosPlus";
import Config from "./constant";
import Axios from "axios";
export const extractInitialValues = taskVariables => {
  try {
    let values = {
      ...taskVariables
    };
    /**
     * return empty object is values is empty or invalid
     */
    if (Validate.isEmpty(values)) return {};

    /**
     * check value is object or not
     * if not object return empty object
     */
    if (!Validate.isObject) return {};

    // filtered values holder
    let extractedValues = {};

    //extrace value based on redux-form initialValues {formName : values}
    for (var key in values) {
      extractedValues[key] = values[key];
      // if (values[key].type === "File") {
      // } else if(values[key])
      // else {
      //   extractedValues[key] = values[key].value;
      // }
    }
    //return extracted values
    return extractedValues;
  } catch (error) {
    throw error;
  }
};

export const SectionValidator = ({
  sectionName,
  formSyncError = {},
  sectionValidator = []
}) => {
  try {
    if (sectionValidator[sectionName]) {
      let section = sectionValidator[sectionName];
      //extract mannualValidator
      let mannualErrorObj = sectionValidator[sectionName][0];
      //if sectionName found, Process the formSyncError and check if any errors found for this sectionNames fields
      for (let key in formSyncError) {
        if (section.indexOf(key) !== -1) {
          return false;
        }
      }

      if (Validate.isObject(mannualErrorObj)) {
        for (const prop in mannualErrorObj) {
          if (mannualErrorObj.hasOwnProperty(prop)) {
            if (!mannualErrorObj[prop]) {
              return false;
            }
          }
        }
      }
      return true;
    } else {
      //if your sectionName not inside sectionValidator return false
      throw new Error(
        `Your sectionName does not found inside this.state.sectionValidator. Please include your ${sectionName} config @ this.state.sectionValidator`
      );
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

//process formvalues to camunda task variable format
export const formatValues = values => {
  let variables = {};
  if (values) {
    Object.keys(values).forEach(item => {
      // variables[item] = { value: values[item] };
      variables[item] = values[item];
    });
    return {
      variables
    };
  }
  return {};
};

export const uploadChecker = ({
  fileInfo,
  uploadLimit,
  errorMsg
}) => v => {
  //extrace error msg
  let {
    uploadLimit: uploadLimitError,
    fileInfoUploadLimitMisMatch,
    variableNameConflict,
    updateVariableName
  } = errorMsg;
  // throw error if fileInfo.length not equal to uploadLimit
  if (fileInfo.length !== uploadLimit) {
    return fileInfoUploadLimitMisMatch ?
      fileInfoUploadLimitMisMatch :
      `${fileInfo.fieldName} prop fileInfo.length should be equal to uploadLimit`;
  }
  //throw error if value.length > uploadLimit
  if (v && Validate.isArray(v.values) && v.values.length > uploadLimit) {
    return uploadLimitError ? uploadLimitError : "upload limit exceed!";
  }
  // check all fields are have variable Name assigned
  if (v && Validate.isArray(v.values)) {
    let allValueHasVariableName = v.values.every(
      data => data.variableName !== undefined
    );
    if (!allValueHasVariableName) {
      return updateVariableName ?
        updateVariableName :
        "Please update variable name for uploaded file.";
    }
  }
  if (v && Validate.isArray(v.values)) {
    let checker = "";
    //need to improve this iteration
    //logn2
    v.values.forEach(start => {
      v.values.forEach(compare => {
        if (
          start.uid !== compare.uid &&
          start.variableName === compare.variableName
        ) {
          checker = "Some files have same name";
        }
      });
    });
    return !Validate.isEmpty(checker) ?
      variableNameConflict ?
        variableNameConflict :
        "Variable Name should be unique" :
      undefined;
  }
  return undefined;
};

/**
 * param(taskInfo) contain all the information about current passed task
 * param(fileInfo) contain all the information about file uploader configs
 */
// export const retrieveDefaultFiles = async ({
//   taskInfo,
//   fileInfo,
//   fieldPopulator
// }) => {
//   try {
//     //first check fileInfo default value file names are found in taskInfo task variable
//     let {
//       defaultValuesFieldNames
//     } = fileInfo;
//     let {
//       info
//     } = taskInfo;
//     let taskVariablesHolder = info.taskVariables;
//     let taskVariables = Object.keys(info.taskVariables);
//     let resultHolder = [];
//     await Promise.all(
//       defaultValuesFieldNames.map(async variableName => {
//         if (taskVariables.indexOf(variableName) !== -1) {
//           let result = await Axiosplus.get({
//             path: `task/${info.id}/variables/${variableName}/data`,
//             config: {
//               headers: {
//                 Authorization: info.authToken
//               },
//               accept: "application/octet-stream",
//               responseType: "blob"
//             }
//           });
//           var reader = new FileReader();
//           reader.readAsDataURL(result);
//           reader.onloadend = () => {
//             let base64data = reader.result;
//             if (taskVariablesHolder[variableName]) {
//               resultHolder.push({
//                 File: {
//                   name: taskVariablesHolder[variableName].valueInfo.filename
//                 },
//                 result: base64data,
//                 uid: uuid(),
//                 default: true,
//                 variableName
//               });
//               fieldPopulator(fileInfo.fieldName, {
//                 values: [...resultHolder],
//                 type: "file"
//               });
//             } else {
//               throw new Error(
//                 `TaskVariable filename not found for ${variableName}`
//               );
//             }
//           };
//         }
//       })
//     );
//     return "finished";
//   } catch (error) {
//     throw error;
//   }
// };

export const retrieveDefaultFiles = async ({
  taskInfo,
  fileInfo,
  fieldPopulator
}) => {
  try {
    //first check fileInfo default value file names are found in taskInfo task variable
    let {
      defaultValuesFieldNames
    } = fileInfo;
    let {
      info
    } = taskInfo;
    let taskVariablesHolder = info.taskVariables;
    let taskVariables = Object.keys(info.taskVariables);
    let resultHolder = [];
    defaultValuesFieldNames.forEach(async variableName => {
      if (taskVariables.indexOf(variableName) !== -1) {
        console.log(`${variableName} is found ***`, taskVariablesHolder[variableName]);
        let cloudImg = JSON.parse(taskVariablesHolder[variableName].value);
        resultHolder.push({
          File: {
            name: cloudImg.fileName
          },
          result: cloudImg.url,
          uid: uuid(),
          default: true,
          variableName
        });
      }
    })
    fieldPopulator(fileInfo.fieldName, {
      values: [...resultHolder],
      type: "String"
    });
  } catch (error) {
    throw error;
  }
}

export const retrieveScannedFiles = async ({
  taskInfo,
  variableNamesList,
  fieldPopulator,
  isScannedFile = true
}) => {
  try {
    //first check fileInfo default value file names are found in taskInfo task variable
    let {
      info
    } = taskInfo;
    let taskVariablesHolder = info.taskVariables;
    let taskVariables = Object.keys(info.taskVariables);
    await Promise.all(
      variableNamesList.map(async variableName => {
        if (taskVariables.indexOf(variableName) !== -1) {
          console.log(`${variableName} is found ***`);
          let config = {
            headers: {
              Authorization: info.authToken
            },
            accept: "application/octet-stream",
            responseType: "blob",
          };
          let requestConfig = isScannedFile ? {
            ...config
          } : {
              ...config,
              ...{
                responseType: "arraybuffer",
                dataType: "blob"
              }
            }
          console.log("Scanned File Config:", requestConfig);
          let result = await Axiosplus.get({
            path: `task/${info.id}/variables/${variableName}/data`,
            config: requestConfig
          });
          console.log("from result");
          console.log(result);
          if (!isScannedFile) {
            let existingVariableInfo = taskVariablesHolder[variableName];
            fieldPopulator(variableName, {
              ...existingVariableInfo,
              value: result
            });
          } else {
            var reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = () => {
              let base64data = reader.result;
              console.log("Scanned Image ", base64data);
              let existingVariableInfo = taskVariablesHolder[variableName];
              fieldPopulator(variableName, {
                ...existingVariableInfo,
                value: base64data
              });
            };
          }
        }
        // else {
        //   throw new Error(
        //     `${variableName} not found in taskVariable. Please Check your console`
        //   );
        // }
      })
    );
    return "finished";
  } catch (error) {
    throw error;
  }
};

export const proceedNumber = value => {
  if (!isNaN(value.value)) {
    let formattedNumber = {
      type: "String",
      value: value.value
    };
    return formattedNumber;
  }
};
export const inrFormat = value => {
  value = value.value;
  value = value.replace(/,/g, "");
  if (!isNaN(value)) {
    value = value.replace(/,/g, "");
    value = value.toString();
    var lastThree = value.substring(value.length - 3);
    var otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    let formattedRes = {
      type: "String",
      value: res
    };
    return formattedRes;
  }
};

export const sortAlphabetically = property => {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};
export const getOSEnv = () => {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }
  return os;
};

export const IsJsonString = str => {
  try {
    if (parseInt(str)) {
      return false;
    }
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
};

//handleDynamicErrorHelper is responsible for handling FormSection Status
export const handleDynamicErrorHelper = ({
  sectionValidator = {},
  sectionKey,
  fieldKey,
  value,
  ipc
}) => {
  try {
    if (Validate.isEmpty(sectionValidator)) {
      throw new Error(
        "SectionValidator Prop is Required @handleDynamicErrorHelper"
      );
    }
    let cloneSecValidator = JSON.parse(JSON.stringify(sectionValidator));
    let extractSectionObject = cloneSecValidator[sectionKey];
    if (
      Validate.isArray(extractSectionObject) &&
      Validate.isObject(extractSectionObject[0])
    ) {
      for (const prop in extractSectionObject[0]) {
        if (extractSectionObject[0].hasOwnProperty(prop)) {
          if (prop === fieldKey) {
            extractSectionObject[0][prop] = value;
          }
        }
      }

      if (ipc) {
        ipc.source.postMessage({
          action: "handleDynamicFormState",
          dynamicState: value ? "valid" : "invalid"
        },
          Config.targetOrigin
        );
      }

      // return extractSectionObject;
      return {
        ...cloneSecValidator,
        sectionKey: extractSectionObject
      };
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const handleFormWatcher = (ipc, isFormValid) => {
  // add formListener
  this.formWatcher = setInterval(() => {
    if (ipc) {
      ipc.source.postMessage({
        action: "handleStaticFormState",
        formState: isFormValid
      },
        Config.targetOrigin
      );
    }
  }, 1000);
};

export const getGoogleCloudLink = async (data, info) => {
  console.log("Google link data", window.btoa(encodeURIComponent(JSON.stringify(data))));
  const response = await Axiosplus.post({
    path: `upload`,
    config: {
      headers: {
        Authorization: info.authToken
      },
    },
    values: {
      data: window.btoa(encodeURIComponent(JSON.stringify(data))),
      contentType: "application/json"
    }
  });
  return response;
}

export const retrieveBigData = async (retrieveUrl, info) => {
  console.log("RetieveUrl", retrieveUrl);
  const response = await Axios.get(retrieveUrl);
  return JSON.parse(decodeURIComponent(response.data));
}
