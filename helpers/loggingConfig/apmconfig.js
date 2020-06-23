import { init as initApm } from "@elastic/apm-rum";

export var apm = initApm({
  // Set required service name
  // (allowed characters: a-z, A-Z, 0-9, -, _,
  // and space)
  serviceName: "esaf-lps-forms59",
  // Set custom APM Server URL (
  // default: http://localhost:8200)
  serverUrl: "http://localhost:8200",

  // Set service version (required for sourcemap
  // feature)
  serviceVersion: "0.0.1"
});
