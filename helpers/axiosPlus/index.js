/**
 * Why : i am the middleware for axios and your api request
 * I can help you to write less and aviod TRY.
 * Author : a8
 */
import axios from "axios";
import Config from "../constant";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

class AxiosPlus {
  constructor({ baseURL = "" }) {
    this.config = {};
    //if url found append url to axios config
    baseURL && (this.config = this.baseURL = { baseURL });
    this.axiosplus = axios.create(this.config);
    // this.axiosplus.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  /**
   * get broker
   * params :
   * {
   *   path : valid url path,
   *   config
   *  }
   */
  get = async ({ path, config = {} }) => {
    try {
      if (path && typeof path == "string") {
        const { data } = await this.axiosplus.get(path, config);
        return data;
      } else {
        throw new Error("AxiosPlus GET Error: path should be valid string");
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   * post broker
   */
  post = async ({ path, values = {}, config = {} }) => {
    try {
      if (path && typeof path == "string") {
        const { data } = await this.axiosplus.post(path, values, config);
        return data;
      } else {
        throw new Error("AxiosPlus POST Error: path should be valid string");
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   * put broker
   */
  put = async ({ path, values = {}, config = {} }) => {
    try {
      if (path && typeof path == "string") {
        const { data } = await this.axiosplus.put(path, values, config);
        return data;
      } else {
        throw new Error("AxiosPlus PUT Error: path should be valid string");
      }
    } catch (e) {
      throw e;
    }
  };

  /**
   * delete broker
   */
  delete = async ({ path, params = {}, config = {} }) => {
    try {
      if (path && typeof path == "string") {
        const { data } = await this.axiosplus.delete(path, params, config);
        return data;
      } else {
        throw new Error("AxiosPlus DELETE Error: path should be valid string");
      }
    } catch (e) {
      throw e;
    }
  };
}

// export default AxiosPlus;
//for production
export default new AxiosPlus({
  baseURL: Config.baseUrl
});

// https://esaf-testing.autonom8.com/engine-rest

//for development
// export default new AxiosPlus({baseURL: "http://localhost:8080/engine-result/"});
