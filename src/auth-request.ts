// @ts-nocheck

import axios from "axios";
const base = (method, url, data, other = {}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const { headers = {}, options = {} } = other;
    const token = // MOCK TOKEN - give your user token to see file uploaded into your account
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTM5OTM5MzEsImV4cCI6MTcyNTYxNjMzMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoibmFzdHlhYmFyYWJha2giLCJ1c2VyX3Nlc3Npb25fdXVpZCI6IjFhYTNhZTFmLTg5N2EtNDcyZS1hMDcxLWRhMjYzMjk1NzliNiIsIndvcmtzcGFjZV9pZCI6OTE4fQ.thIL0CffRNqBEIYVUDk1O-30khiWBZeYR2ydiHt5FvxcJnzvc7TZtZv-13RgoHyc_n3lyLArb8dMGhpA-6120tc18w-tiktxydguy7NAZViwBVRvWa7_weJ_fr7hwVPTo8MSzd6bVBHyhrqzl8XHVsUKMxSBIAL7UAfXTjgUPlIEEshHzr9hkLbA1JYWXwjvpXJIiOAIbQ5qERQ7dncVV1Cv_0PFGbwQg538RDHKfgjazS3jWgWGodcGklyMyr-hIONj0e2idT1G7WDnDMHu4NTRYDNhdm638SVQa94_G2PNUv6NFOe8t4VHbVjfe0hB55oNLnqWwImwdCEc2n1SqibPvogYTBz_Qy5X1NbKsCdQt25R5qG8ZO6B7dUTKOjxC58eiz-BFH0rwovWBmSY3ugfmt3te1RA3Xfmox1DxqEe3vNC18oV3ExOLEq8rqXAsJArpQch5Fe4aPomi4kJA89yXy9YiVNR8q-OWo634otfZzvrOjwJyPUvDg4aTwpXo7azx9Qsi1sbbKR3ktCHVD7t3PrRBxB0vRhjpYDGkpvNu9TpLfEE27AijpJHA5JiUJVRqoTqLTdqXlpSSEauxgBPY-B1KQp-24zXm5st0ZjZ-pAKXfe_KHURcmDG0SGmYCPmlmOx8KqBhcXX2irgZKm2sGG61epKp8vVkIUfNxQ";
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
