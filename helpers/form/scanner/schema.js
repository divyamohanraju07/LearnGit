export const _schemaScanner = {
  $id: "http://example.com/schemas/schema.json",
  type: "object",
  properties: {
    docType: {
      type: "string"
    },
    taskInfo: {
      type: "object"
    },
    parserVar: {
      type: "string"
    },
    docParse: {
      type: "boolean"
    },
    a8flowApiUrl : {
      type : "string"
    },
    ipc : {
      type : "object"
    }
  },
  required: [
    "docType",
    "taskInfo",
    "a8flowApiUrl",
    "ipc"
 ],
  additionalProperties: true,
  errorMessage: {
    "properties" : {
        "docType" : "docType props must be string at Scanner Component",
        "taskInfo" : "taskInfo props must be object at Scanner Component",
        "parserVar" : "parserVer prop must be string at Scanner Component",
        "docParse" : "docParser props must be boolean at Scanner Component",
        "a8flowApiUrl" : "a8flowApiUrl props must be string at Scanner Component",
        "ipc" : "ipc props must be object at Scanner Component"
    },
    required: {
      "docType" : "docType prop is missing at Scanner Component",
      "taskInfo" : "taskInfo prop is missing at Scanner Component",
      "docParse" : "docParser prop is missing at Scanner Component",
      "a8flowApiUrl" : "a8flowApiUrl prop is missing at Scanner Component",
      "ipc" : "ipc prop is missing at Scanner Component"
    }
  }
};
