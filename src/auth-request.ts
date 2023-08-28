// @ts-nocheck

import axios from "axios";
const base = (method, url, data, other = {}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const { headers = {}, options = {} } = other;
    const token = // MOCK TOKEN - give your user token to see file uploaded into your account
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTI5NTYzMDUsImV4cCI6MTcyNDU3ODcwNSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoibmFzdHlhYmFyYWJha2giLCJ1c2VyX3Nlc3Npb25fdXVpZCI6Ijk5MzU2OTM4LTk5ZjEtNGZiZi1hMGM4LTVkMDRjMWM5NTVhYSIsIndvcmtzcGFjZV9pZCI6OTE4fQ.Q-vEJg8ZCqUy1O5iWtj5j30lswYTmWOQfAcPW7Tun-VywCFjxU5JKZpLDByFFYyRN6Nnhf5Fr300h6lR_BWHWjWc3vqebXtL7dO1TA7BHag3Pwq61DCvktT0BtwOw0NFXuuesDraWSoADzk1EV5XMlE18-TkdtTthFt7nox_So_afX3OK9aJUBtdJT7SdJBPpRbCi_RHlIC5BT3h8cdZlKLB0IYSvbZPvRaCgbsJjNLo42I4WNLoEoMOEIhslai7EsoUBQNZ2YMa3XWzupR8K1pSTbndo8BWtQteIUDQqXkUJoX9suGILOUwS-fHGC5T0C63IRE68HYLNbKKNKWNPIJcFZ03Tv4H4rsVNlFZilQNkEC-hgsrke-kHQu5VCLoyFvTubpEpqB1kUaSRJmobF7xeddXFaD0tlZ32UFdBz33BK2odgwKXSCP2dhYNNOoHOL1yVYeWQZz1wozW_Nxw2oRYtnsoysw7mtqFiWsOX2JXW2eAvY48NJYHj1jWGl1lU43h4E9ku8kvY2FDriEETC7jJiu6az_UQYTPPTlYouyw-J-e-lzoviUJNXZGiiBlq4WPPZbvXm3fPkSwdvw6ECgxorL_ydKoifrGonlZopwEaWIvbNgiNT0GN0v6V7_jbWYfvd0Nh4MJnXWEhCez9KBZk89TkGeHsPwtMrF_J4";
    const requestConfig = {
      method,
      data,
      url,
      headers: {
        "X-Token": token,
        Accept: "application/json, text/plain, */*",
        ...headers,
      },
      ...options,
    };
    if (!token) delete requestConfig.headers["X-Token"];

    try {
      const response = await axios(requestConfig);
      resolve(response);
    } catch (error) {
      //   if (error?.response?.status === 401) {
      //     authTokenRefresh()
      //       .then(() => {
      //         window.location.reload();
      //       })
      //       .catch(() => {
      //         removeToken();
      //         window.location.reload();
      //       });
      //   }
      //   if (error?.response?.status === 403 || error?.response?.status === 412) {
      //     const me = store.getState().account.userInfo.entities;
      //     if (
      //       !(
      //         me.is_password_access &&
      //         me.password_access &&
      //         !me.password_access?.enabled
      //       )
      //     ) {
      //       store.dispatch(
      //         setErrors(error?.response?.data, error?.response?.status)
      //       );
      //     }
      //   }
      //   reject(error);
    }
  });

const authRequest = {};
["get", "post", "put", "delete", "patch"].forEach((method) => {
  authRequest[method] = (...props) => base(method.toUpperCase(), ...props);
});
export default authRequest;
