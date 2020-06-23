import { Client } from "elasticsearch";
import { store } from "../../stateManager";
const client = new Client({
  host: "https://elastic.autonom8.com/"
});

// var client = new Client();

client.search({
  index: "logging"
});

export async function logging(data) {
  let {
    username,
    sessionId,
    formKey,
    taskName,
    processInstanceId,
    taskId
  } = store.getState().user.userInfo;

  client.bulk({
    body: [
      { index: { _index: "logging" } },
      {
        username: username,
        sessionId: sessionId,
        timestamp: new Date().getTime(),
        browser: navigator.userAgent,
        device: navigator.userAgent,
        page: "login form",
        project: "esaf forms",
        formKey: formKey,
        taskId: taskId,
        processInstanceId: processInstanceId,
        taskName: taskName,
        ...data
      }
    ]
  });
}
