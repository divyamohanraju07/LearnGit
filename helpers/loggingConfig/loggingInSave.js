import { logging } from "./loggingconfig";

const loggingSave = (props, message) => {
  let { id, processInstanceId, name } = props;

  let saveData = {
    requestUrl: null,
    requestMethod: null,
    ResponceStatus: null,
    taskId: id,
    processInstanceId: processInstanceId,
    taskName: name,
    message: message,
    type: "saveProcessVariables"
  };
  logging(saveData);
};

export default loggingSave;
